{{ config(
    materialized='table',
    tags=['cbtn_clinical', 'base', 'phi'],
    pre_hook="set group_concat_max_len = 1048576"
) }}

-- Latest CSF result per patient, PER COMPONENT: routine chemistry (protein,
-- glucose), cell counts (WBC, RBC), cytology, and the tumour markers (AFP, hCG, CEA,
-- cell-free DNA, malignant-cell panel, pathologist review).
--
-- ONE ROW PER PATIENT with each component resolved INDEPENDENTLY, so the
-- *_observed_at timestamps need not agree. Do not read the row as a single draw.
--
-- *** THE pre_hook IS LOAD-BEARING. *** cytology_result_text is assembled with
-- group_concat, capped by group_concat_max_len (default 1024 BYTES) and truncating
-- SILENTLY. The original script set this with a bare `set` before the CREATE TABLE;
-- in dbt it must be a pre_hook so it applies to the model's own session.
-- `diagnostic_text` -- the classifier input -- is deliberately built from
-- per-section max() + concat_ws instead, because classifying on a truncated string
-- would silently lose a malignancy statement past byte 1024. Two text columns, two
-- construction methods, on purpose.
--
-- TWO NAME TRAPS, both guarded: 'UCSF' contains 'csf', and CSF-FLOW IMAGING studies
-- are DiagnosticReports whose code_text says CSF. Hence `not like '%ucsf%'` and the
-- Radiology/Imaging category exclusion.
--
-- ROUTINE ANALYTES are identified LOINC-first with a code_text fallback, and two
-- exclusions that matter: 'Total Cells Counted' and LOINC 19075-1 are differential
-- DENOMINATORS, not concentrations (676 of ~690 are exactly 100). Admitting them
-- would report a denominator as a cell count.
--
-- CYTOLOGY CSF ATTRIBUTION IS TIERED, because a cytology report's name often does
-- not state the specimen:
--   tier 1 'named'          the report name says CSF
--   tier 2 'text_confirmed' the result prose names CSF and no competing source
--   tier 3 'same_day_only'  the prose names no source, but CSF was drawn that day
-- cytology_evidence_tier is the tier of the returned cytology; patient_best_evidence
-- is the strongest tier the patient has anywhere, and is NULL for routine-only
-- patients.
--
-- COMPARATORS TRAVEL WITH THE NUMBER -- read *_display. Most tumour-marker results
-- are '< 1.0', i.e. UNDETECTABLE; dropping the comparator reports that as 1.0.
--
-- MALIGNANT-CELLS CLASSIFIER: identical three-pass negation neutralisation to
-- csf_tumor_analysis_latest -- see that model's header for why each pass exists and
-- which real strings defeated the simpler forms. The two implementations are kept in
-- step by hand; they are NOT shared, because this one classifies the cytology
-- component specifically while that one classifies whichever analysis was latest.
--
-- MATERIALIZATION: a TABLE over a live source; `dbt run` to refresh.
-- CONTAINS PHI: patient_fhir_id, real calendar timestamps, and pathology prose that
-- quotes patient name and MRN. ac_v_csf_results_latest_by_component gates the text.

with csf_lab_report as (
    select dr.id                                            as report_id,
           substring_index(dr.subject_reference, '/', -1)     as patient_fhir_id,
           dr.code_text,
           dr.encounter_reference,
           cast(replace(replace(nullif(dr.effective_date_time, ''), 'T', ' '), 'Z', '') as datetime)
                                                            as observed_at
    from {{ source('radiant_fhir', 'diagnostic_report') }} dr
    where lower(dr.code_text) like '%csf%'
      and lower(dr.code_text) not like '%ucsf%'          -- 'UCSF' contains 'csf'
      and dr.status in ('final', 'amended')
      and dr.id not in (select diagnostic_report_id       -- CSF-flow imaging
                        from {{ source('radiant_fhir', 'diagnostic_report_category') }}
                        where category_text in ('Radiology', 'Imaging', 'IMAGING OUTSIDE FILMS'))
),

-- ============ ROUTINE ANALYTES (observation-level, LOINC-first) ============
routine_component as (
    select r.patient_fhir_id, r.report_id, r.observed_at,
           case
               when occ.code_coding_code = '2880-3'
                 or o.code_text in ('CSF Protein', 'Total Protein, CSF', 'Protein, Total, CSF',
                                    'Protein CSF', 'CSF Total Protein', 'Protein Total, CSF')
                                                                        then 'protein'
               when occ.code_coding_code = '2342-4'
                 or o.code_text in ('CSF Glucose', 'Glucose, CSF')       then 'glucose'
               when occ.code_coding_code in ('806-0', '26465-5', '58470-6')
                 or o.code_text in ('CSF Nucleated Cell Count', 'White Blood Cells, BF',
                                    'WBC, CSF', 'Total Nucleated Cells, CSF')
                                                                        then 'wbc'
               when occ.code_coding_code in ('26454-9', '23860-0')
                 or o.code_text in ('CSF Red Cell Count', 'Red Blood Cells, BF', 'RBC, CSF')
                                                                        then 'rbc'
           end                                                          as component,
           cast(nullif(o.value_quantity_value, '') as double)            as val,
           nullif(o.value_quantity_unit, '')                             as unit,
           nullif(o.value_quantity_comparator, '')                       as cmp,
           o.code_text                                                   as source_code_text
    from csf_lab_report r
    join {{ source('radiant_fhir', 'diagnostic_report_result') }} drr
      on drr.diagnostic_report_id = r.report_id
    join {{ source('radiant_fhir', 'observation') }} o
      on o.id = substring_index(drr.result_reference, '/', -1)
    left join {{ source('radiant_fhir', 'observation_code_coding') }} occ
      on occ.observation_id = o.id and occ.code_coding_system = 'http://loinc.org'
    where nullif(o.value_quantity_value, '') is not null
      -- differential DENOMINATORS, not concentrations (676 of ~690 are exactly 100)
      and o.code_text not in ('Total Cells Counted', 'CSF number of cells counted',
                              'Total Cells Counted, BF', 'Number of Cells Counted for Differential')
      and coalesce(occ.code_coding_code, '') <> '19075-1'
),

-- ============ TUMOUR-RELEVANT ANALYSES (report-level) ============
tier1_named as (
    select r.report_id, r.patient_fhir_id, r.code_text, r.observed_at,
           case
               when lower(r.code_text) like '%cytol%'              then 'cytology'
               when lower(r.code_text) like '%leukemia panel%'     then 'malignant_cell_panel'
               when lower(r.code_text) like '%feto%'               then 'afp'
               when lower(r.code_text) like '%hcg%'
                 or lower(r.code_text) like '%gonadotropin%'       then 'hcg'
               when lower(r.code_text) like '%carcinoembryonic%'   then 'cea'
               when lower(r.code_text) like '%cell free dna%'      then 'cell_free_dna'
               when lower(r.code_text) like '%pathology review%'
                 or lower(r.code_text) like '%pathologist review%'
                 or lower(r.code_text) like '%csf interpretation%' then 'pathology_review'
           end                                              as component
    from csf_lab_report r
),

unnamed_cytology as (
    select dr.id                                            as report_id,
           substring_index(dr.subject_reference, '/', -1)    as patient_fhir_id,
           dr.code_text,
           cast(replace(replace(nullif(dr.effective_date_time, ''), 'T', ' '), 'Z', '') as datetime)
                                                            as observed_at
    from {{ source('radiant_fhir', 'diagnostic_report') }} dr
    where (lower(dr.code_text) like '%cytol%' or lower(dr.code_text) like '%cytopath%')
      and lower(dr.code_text) not like '%csf%'
      and lower(dr.code_text) not like '%ucsf%'
      and dr.status in ('final', 'amended')
      and lower(dr.code_text) not like '%pap test%'
      and not (lower(dr.code_text) like '%gynecolog%'
               and lower(dr.code_text) not like '%non-gynecolog%'
               and lower(dr.code_text) not like '%non gyn%')
),

cytology_source_evidence as (
    select drr.diagnostic_report_id                          as report_id,
           max(case when lower(o.value_string) like '%csf%'
                      or lower(o.value_string) like '%cerebrospinal%'
                      or lower(o.value_string) like '%lumbar puncture%'
                      or lower(o.value_string) like '%ventricular fluid%'
                      or lower(o.value_string) like '%ommaya%'
                      or lower(o.value_string) like '%spinal fluid%'
                    then 1 else 0 end)                      as names_csf,
           max(case when lower(o.value_string) like '%pleural%'
                      or lower(o.value_string) like '%periton%'
                      or lower(o.value_string) like '%ascit%'
                      or lower(o.value_string) like '%urine%'
                      or lower(o.value_string) like '%sputum%'
                      or lower(o.value_string) like '%bronch%'
                      or lower(o.value_string) like '%pericardial%'
                    then 1 else 0 end)                      as names_other_source
    from {{ source('radiant_fhir', 'diagnostic_report_result') }} drr
    join {{ source('radiant_fhir', 'observation') }} o
      on o.id = substring_index(drr.result_reference, '/', -1)
    where nullif(o.value_string, '') is not null
    group by drr.diagnostic_report_id
),

csf_specimen as (
    -- CSF by SNOMED code OR display: Epic-local OIDs carry 'Cerebrospinal Fluid'
    -- under non-SNOMED codes (155, 9)
    select distinct substring_index(s.subject_reference, '/', -1) as patient_fhir_id,
           date(cast(replace(replace(nullif(s.collection_collected_date_time, ''), 'T', ' '), 'Z', '') as datetime))
                                                                 as collected_on
    from {{ source('radiant_fhir', 'specimen') }} s
    join {{ source('radiant_fhir', 'specimen_type_coding') }} stc
      on stc.specimen_id = s.id
    where stc.type_coding_code in ('258450006', '65216001', '446861007')
       or lower(stc.type_coding_display) like '%cerebrospinal%'
       or lower(stc.type_coding_display) like '%cerebral spinal%'
),

tumour_component as (
    select report_id, patient_fhir_id, code_text, observed_at, component,
           'named' as evidence_tier, 1 as tier_rank
    from tier1_named where component is not null
    union all
    select u.report_id, u.patient_fhir_id, u.code_text, u.observed_at, 'cytology',
           'text_confirmed', 2
    from unnamed_cytology u
    join cytology_source_evidence e on e.report_id = u.report_id
    where e.names_csf = 1 and e.names_other_source = 0
    union all
    select u.report_id, u.patient_fhir_id, u.code_text, u.observed_at, 'cytology',
           'same_day_only', 3
    from unnamed_cytology u
    left join cytology_source_evidence e on e.report_id = u.report_id
    join csf_specimen cs on cs.patient_fhir_id = u.patient_fhir_id
                        and cs.collected_on = date(u.observed_at)
    where coalesce(e.names_csf, 0) = 0 and coalesce(e.names_other_source, 0) = 0
),

-- ============ REPORT-LEVEL TEXT AND MARKER VALUES ============
report_result as (
    select drr.diagnostic_report_id                          as report_id,
           group_concat(
               case when nullif(o.value_string, '') is not null
                    then concat(o.code_text, ': ', o.value_string) end
               order by case o.code_text
                            when 'Final Diagnosis'          then 1
                            when 'Impression'               then 2
                            when 'Case Results'             then 3
                            when 'Microscopic Description'  then 4
                            when 'Pathology Review'         then 5
                            when 'CSF Interpretation'       then 6
                            when 'Cytology Exam'            then 7
                            when 'Narrative'                then 8
                            when 'Comment'                  then 9
                            when 'Clinical Information'     then 10
                            when 'Gross Description'        then 11
                            else 12 end
               separator ' | ')                             as result_text,
           max(case when o.code_text in ('Final Diagnosis', 'Impression')
                    then o.value_string end)                as final_diagnosis,
           -- per-section max(), NOT group_concat: group_concat truncates silently
           -- at 1024 bytes and the classifier must not read a cut-off string
           nullif(concat_ws(' ',
               max(case when o.code_text = 'Final Diagnosis'         then o.value_string end),
               max(case when o.code_text = 'Impression'              then o.value_string end),
               max(case when o.code_text = 'Case Results'            then o.value_string end),
               max(case when o.code_text = 'Cytology Exam'           then o.value_string end),
               max(case when o.code_text = 'Pathology Review'        then o.value_string end),
               max(case when o.code_text = 'CSF Interpretation'      then o.value_string end),
               max(case when o.code_text = 'Narrative'               then o.value_string end),
               max(case when o.code_text = 'Microscopic Description' then o.value_string end)
           ), '')                                           as diagnostic_text,
           max(nullif(o.value_quantity_value, ''))          as marker_value,
           max(nullif(o.value_quantity_unit, ''))           as marker_unit,
           max(nullif(o.value_quantity_comparator, ''))     as marker_comparator
    from {{ source('radiant_fhir', 'diagnostic_report_result') }} drr
    join {{ source('radiant_fhir', 'observation') }} o
      on o.id = substring_index(drr.result_reference, '/', -1)
    where o.code_text not in ('Responsible User', 'CSF Interpreted By:',
                              'Compliance Statement', 'Control Statement',
                              'Case Report Header')
    group by drr.diagnostic_report_id
),

report_result_scored as (
    select rr.*,
           regexp_replace(
             regexp_replace(
               regexp_replace(lower(replace(replace(rr.diagnostic_text, '\n', ' '), '  ', ' ')),
                   '(tumor|malignant|neoplastic|atypical|blast)( cell(s)?)? (are|is|were|was) not (present|observed|identified|seen|detected|noted|appreciated)',
                   '#NEG'),
                   'no(t)? ([a-z]+ ){0,2}(evidence of |presence of )?(tumor|malignant|neoplastic|germ|atypical|blast|malignancy|atypia)( cell(s)?)?( seen| present| identified| noted| detected)?',
                   '#NEG'),
               'negative for( [a-z]+)? ?(malignant|tumor|neoplastic|blast|atypical)( cell(s)?)?',
               '#NEG')                                      as dx_neutralised
    from report_result rr
),

-- ============ UNIFIED LONG FORM ============
component_row as (
    select rc.patient_fhir_id, rc.component, rc.observed_at, rc.report_id,
           rc.val                                           as num_value,
           rc.cmp                                           as num_comparator,
           rc.unit                                          as num_unit,
           rc.source_code_text,
           cast(null as varchar(1))                         as evidence_tier,
           cast(null as varchar(1))                         as final_diagnosis,
           cast(null as varchar(1))                         as result_text,
           cast(null as varchar(1))                         as dx_neutralised,
           cast(null as varchar(1))                         as diagnostic_text,
           4                                                as tier_rank
    from routine_component rc
    where rc.component is not null

    union all

    select tc.patient_fhir_id, tc.component, tc.observed_at, tc.report_id,
           cast(rr.marker_value as double), rr.marker_comparator, rr.marker_unit,
           tc.code_text,
           tc.evidence_tier, rr.final_diagnosis, rr.result_text,
           rr.dx_neutralised, rr.diagnostic_text,
           tc.tier_rank
    from tumour_component tc
    left join report_result_scored rr on rr.report_id = tc.report_id
),

ranked as (
    select c.*,
           row_number() over (
               partition by c.patient_fhir_id, c.component
               -- most recent first; on a tie prefer better-evidenced, then stable id
               order by c.observed_at desc, c.tier_rank, c.report_id
           ) as rn
    from component_row c
),

latest as (select * from ranked where rn = 1),

rollup as (
    select patient_fhir_id,
           count(distinct component)                        as components_present,
           count(distinct report_id)                        as csf_reports_total,
           min(observed_at)                                 as first_csf_result_at,
           max(observed_at)                                 as last_csf_result_at,
           min(case when component in ('cytology','afp','hcg','cea','cell_free_dna',
                                       'malignant_cell_panel','pathology_review')
                    then tier_rank end)                     as best_tumour_tier_rank
    from component_row
    group by patient_fhir_id
)

select
    r.patient_fhir_id,

    -- ---------- routine chemistry ----------
    max(case when l.component = 'protein' then
        concat(coalesce(l.num_comparator,''), cast(l.num_value as string),
               coalesce(concat(' ', l.num_unit), '')) end)          as protein_display,
    max(case when l.component = 'protein' then l.num_value end)     as protein_value,
    max(case when l.component = 'protein' then l.num_comparator end) as protein_comparator,
    max(case when l.component = 'protein' then l.num_unit end)      as protein_unit,
    max(case when l.component = 'protein' then l.observed_at end)   as protein_observed_at,
    max(case when l.component = 'protein' then l.source_code_text end) as protein_source_code_text,

    max(case when l.component = 'glucose' then
        concat(coalesce(l.num_comparator,''), cast(l.num_value as string),
               coalesce(concat(' ', l.num_unit), '')) end)          as glucose_display,
    max(case when l.component = 'glucose' then l.num_value end)     as glucose_value,
    max(case when l.component = 'glucose' then l.num_comparator end) as glucose_comparator,
    max(case when l.component = 'glucose' then l.num_unit end)      as glucose_unit,
    max(case when l.component = 'glucose' then l.observed_at end)   as glucose_observed_at,
    max(case when l.component = 'glucose' then l.source_code_text end) as glucose_source_code_text,

    -- ---------- cell counts ----------
    max(case when l.component = 'wbc' then
        concat(coalesce(l.num_comparator,''), cast(l.num_value as string),
               coalesce(concat(' ', l.num_unit), '')) end)          as wbc_display,
    max(case when l.component = 'wbc' then l.num_value end)         as wbc_value,
    max(case when l.component = 'wbc' then l.num_unit end)          as wbc_unit,
    max(case when l.component = 'wbc' then l.observed_at end)       as wbc_observed_at,
    max(case when l.component = 'wbc' then l.source_code_text end)  as wbc_source_code_text,

    max(case when l.component = 'rbc' then
        concat(coalesce(l.num_comparator,''), cast(l.num_value as string),
               coalesce(concat(' ', l.num_unit), '')) end)          as rbc_display,
    max(case when l.component = 'rbc' then l.num_value end)         as rbc_value,
    max(case when l.component = 'rbc' then l.num_unit end)          as rbc_unit,
    max(case when l.component = 'rbc' then l.observed_at end)       as rbc_observed_at,
    max(case when l.component = 'rbc' then l.source_code_text end)  as rbc_source_code_text,

    -- ---------- cytology ----------
    max(case when l.component = 'cytology' then l.observed_at end)    as cytology_observed_at,
    max(case when l.component = 'cytology' then l.evidence_tier end)   as cytology_evidence_tier,
    max(case when l.component = 'cytology' then l.source_code_text end) as cytology_test_name,
    max(case when l.component = 'cytology' then
        case
            when l.diagnostic_text is null then null
            when l.dx_neutralised regexp 'positive for( [a-z]+){0,3} ?(malignant|tumor cell|neoplastic|blast|malignancy)'
              or l.dx_neutralised like '%tumor cells present%'
              or l.dx_neutralised like '%malignant cells present%'
              or l.dx_neutralised like '%tumor cells seen%'
              or l.dx_neutralised like '%malignant cells seen%'
              or l.dx_neutralised like '%malignant cells identified%'
              or l.dx_neutralised like '%metastatic tumor cell%'
              or l.dx_neutralised like '%metastatic carcinoma cell%'
              or l.dx_neutralised like '%blasts present%'
              or l.dx_neutralised like '%blast cells present%'
              or l.dx_neutralised like '%favor tumor%'                then 'positive'
            when l.dx_neutralised like '%#NEG%'
              or l.dx_neutralised like '%no significant cytologic abnormalit%'
              or l.dx_neutralised like '%benign%'                      then 'negative'
            when l.dx_neutralised like '%suspicious%'
              or l.dx_neutralised like '%atypical%'
              or l.dx_neutralised like '%atypia%'
              or l.dx_neutralised like '%equivocal%'                   then 'suspicious'
            when l.dx_neutralised like '%inadequate%'
              or l.dx_neutralised like '%acellular%'
              or l.dx_neutralised like '%unsatisfactory%'
              or l.dx_neutralised like '%non-diagnostic%'
              or l.dx_neutralised like '%nondiagnostic%'
              or l.dx_neutralised like '%insufficient%'                then 'non_diagnostic'
            else 'no_malignancy_statement' end end)                    as malignant_cells,
    max(case when l.component = 'cytology' then
        case when l.diagnostic_text is null then null
             when lower(l.diagnostic_text) regexp '(margin|resection|biopsy|excision|lobectomy|mass fluid|ascites|pleural fluid|peritoneal fluid|bronchoalveolar)'
             then 1 else 0 end end)                                    as multi_specimen_report,
    max(case when l.component = 'cytology' then l.final_diagnosis end)  as cytology_final_diagnosis,
    max(case when l.component = 'cytology' then l.result_text end)      as cytology_result_text,

    -- ---------- tumour markers ----------
    max(case when l.component = 'afp' then
        concat(coalesce(l.num_comparator,''), cast(l.num_value as string),
               coalesce(concat(' ', l.num_unit), '')) end)          as afp_display,
    max(case when l.component = 'afp' then l.num_value end)         as afp_value,
    max(case when l.component = 'afp' then l.num_comparator end)    as afp_comparator,
    max(case when l.component = 'afp' then l.num_unit end)          as afp_unit,
    max(case when l.component = 'afp' then l.observed_at end)       as afp_observed_at,

    max(case when l.component = 'hcg' then
        concat(coalesce(l.num_comparator,''), cast(l.num_value as string),
               coalesce(concat(' ', l.num_unit), '')) end)          as hcg_display,
    max(case when l.component = 'hcg' then l.num_value end)         as hcg_value,
    max(case when l.component = 'hcg' then l.num_comparator end)    as hcg_comparator,
    max(case when l.component = 'hcg' then l.num_unit end)          as hcg_unit,
    max(case when l.component = 'hcg' then l.observed_at end)       as hcg_observed_at,

    max(case when l.component = 'cea' then
        concat(coalesce(l.num_comparator,''), cast(l.num_value as string),
               coalesce(concat(' ', l.num_unit), '')) end)          as cea_display,
    max(case when l.component = 'cea' then l.observed_at end)       as cea_observed_at,

    -- ---------- remaining tumour components (date-bearing, no scalar result) ----------
    max(case when l.component = 'cell_free_dna' then l.observed_at end)        as cell_free_dna_observed_at,
    max(case when l.component = 'malignant_cell_panel' then l.observed_at end) as malignant_cell_panel_observed_at,
    max(case when l.component = 'pathology_review' then l.observed_at end)     as pathology_review_observed_at,
    max(case when l.component = 'pathology_review' then l.final_diagnosis end) as pathology_review_text,

    -- ---------- cohort context ----------
    case r.best_tumour_tier_rank when 1 then 'named' when 2 then 'text_confirmed'
                                 when 3 then 'same_day_only' else null end     as patient_best_evidence,
    r.components_present,
    r.csf_reports_total,
    r.first_csf_result_at,
    r.last_csf_result_at
from rollup r
join latest l on l.patient_fhir_id = r.patient_fhir_id
group by r.patient_fhir_id, r.best_tumour_tier_rank, r.components_present,
         r.csf_reports_total, r.first_csf_result_at, r.last_csf_result_at
