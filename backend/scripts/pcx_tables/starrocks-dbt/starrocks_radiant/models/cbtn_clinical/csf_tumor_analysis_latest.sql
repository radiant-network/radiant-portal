{{ config(
    materialized='table',
    tags=['cbtn_clinical', 'base', 'phi'],
    pre_hook="set group_concat_max_len = 1048576"
) }}

-- Latest CSF tumour-relevant analysis per patient, with a derived malignant-cells
-- label over the pathology prose.
--
-- *** THE pre_hook is important. *** result_text is assembled with
-- group_concat, which is capped by the session variable group_concat_max_len
-- (default 1024 BYTES). In dbt this must be a pre_hook so it
-- runs on the same session as the model build. Remove it and result_text is 
-- cut off mid-report.
--
-- Note the contrast with `diagnostic_text` is handled differently
-- because it does not approach this limit do not "simplify" them into one.
--
-- CSF ATTRIBUTION IS TIERED, because a cytology report's name often does not state
-- the specimen:
--   tier 1 'named'          the report name says CSF
--   tier 2 'text_confirmed' the report's own result prose names CSF and no competing source
--   tier 3 'same_day_only'  the prose names no source at all, but CSF was drawn that day
-- evidence_tier is the tier of the RETURNED analysis; patient_best_evidence is the
-- strongest tier that patient has ANYWHERE, which may be stronger.
--
-- Intentionally excluded: 'UCSF' contains the substring 'csf', and CSF-flow
-- IMAGING studies are DiagnosticReports whose code_text says CSF. Hence the
-- `not like '%ucsf%'` and the Radiology/Imaging category exclusion.
--
-- CSF SPECIMEN MATCHING is on SNOMED code OR display, because Epic-local OIDs carry
-- 'Cerebrospinal Fluid' under non-SNOMED codes.
--
-- COMPARATORS TRAVEL WITH THE NUMBER. Most tumour-marker results are '< 1.0', i.e.
-- UNDETECTABLE. Dropping the comparator reports undetectable as 1.0 -- read
-- result_display, not result_value alone.
--
-- NOTE: THIS PART IS PURELY LLM CREATED AND NEEDS TO BE VALIDATED FURTHER
-- MALIGNANT-CELLS CLASSIFIER -- negation handling is the hard part, and literal
-- string replacement was NOT sufficient:
--   pass 1  post-posed negation: 'Groups of tumor cells ARE NOT PRESENT' is a
--           NEGATIVE whose surface form contains the exact substring a naive
--           positive rule matches on.
--   pass 2  pre-posed negation with a GENERIC modifier slot ({0,2} intervening
--           words). Enumerating adverbs kept failing one at a time -- 'no DEFINITIVE
--           tumor cells seen', then 'no CYTOLOGICALLY malignant cells identified'.
--           The {0,2} bound stops it reaching across a clause boundary, verified
--           against '-no inflammatory cells -positive for malignant cells', which
--           must stay POSITIVE.
--   pass 3  'negative for ...' incl. blasts / atypical cells, so 'negative for
--           blasts or atypical cells' cannot score suspicious.
-- 'positive for' MUST be bound to a malignancy term: a bare '%positive for%' also
-- matched 'positive for BRAF gene rearrangement' and 'diffusely positive for mutant
-- protein' (H3 K27M immunostain) -- molecular/immunostain positivity, not malignant
-- cells in the fluid. '%metastatic%' alone and '%involved by%' were both
-- dropped/tightened: each fired on a DIFFERENT specimen inside a multi-specimen
-- pathology report, neither of which was CSF.
-- An explicit negation OUTRANKS incidental atypia: if the pathologist rendered a
-- negative opinion, that IS the diagnosis.
--
-- diagnostic_text deliberately EXCLUDES Clinical Information and Gross Description:
-- those carry the INDICATION and the specimen label, where 'rule out malignancy' or
-- a prior diagnosis would read as a positive finding. The nullif(...,'') is REQUIRED
-- because concat_ws skips NULLs and returns an EMPTY STRING when every section is
-- absent -- without it the classifier scores 'no diagnostic text at all' as
-- 'no_malignancy_statement', conflating absent text with an absent opinion.
--
-- multi_specimen_report is a REVIEW FLAG: the diagnostic text references a non-CSF
-- specimen, so any label should be confirmed against the CSF part specifically. This
-- is the residual limitation of a report-level classifier -- there is no
-- specimen -> report link to scope it.
--
-- CONTAINS PHI: patient_fhir_id, real calendar timestamps, and free-text pathology
-- prose that quotes patient name and MRN.

with csf_lab_report as (
    -- every CSF DiagnosticReport that is a laboratory analysis, not imaging
    select dr.id                                            as report_id,
           substring_index(dr.subject_reference, '/', -1)    as patient_fhir_id,
           dr.code_text,
           cast(replace(replace(nullif(dr.effective_date_time, ''), 'T', ' '), 'Z', '') as datetime)
                                                            as analyzed_at
    from {{ source('radiant_fhir', 'diagnostic_report') }} dr
    where lower(dr.code_text) like '%csf%'
      and lower(dr.code_text) not like '%ucsf%'                      -- trap 1
      and dr.status in ('final', 'amended')
      and dr.id not in (select diagnostic_report_id                  -- trap 2
                        from {{ source('radiant_fhir', 'diagnostic_report_category') }}
                        where category_text in ('Radiology', 'Imaging', 'IMAGING OUTSIDE FILMS'))
),

tier1_named as (
    select r.report_id, r.patient_fhir_id, r.code_text, r.analyzed_at,
           case
               when lower(r.code_text) like '%cytol%'              then 'cytology'
               when lower(r.code_text) like '%leukemia panel%'     then 'malignant_cell_panel'
               when lower(r.code_text) like '%feto%'               then 'tumor_marker_afp'
               when lower(r.code_text) like '%hcg%'
                 or lower(r.code_text) like '%gonadotropin%'       then 'tumor_marker_hcg'
               when lower(r.code_text) like '%carcinoembryonic%'   then 'tumor_marker_cea'
               when lower(r.code_text) like '%cell free dna%'      then 'cell_free_dna'
               when lower(r.code_text) like '%pathology review%'
                 or lower(r.code_text) like '%pathologist review%'
                 or lower(r.code_text) like '%csf interpretation%' then 'pathology_review'
           end                                              as test_family
    from csf_lab_report r
),

unnamed_cytology as (
    -- cytology whose NAME does not state the source; source decided below
    select dr.id                                            as report_id,
           substring_index(dr.subject_reference, '/', -1)    as patient_fhir_id,
           dr.code_text,
           cast(replace(replace(nullif(dr.effective_date_time, ''), 'T', ' '), 'Z', '') as datetime)
                                                            as analyzed_at
    from {{ source('radiant_fhir', 'diagnostic_report') }} dr
    where (lower(dr.code_text) like '%cytol%' or lower(dr.code_text) like '%cytopath%')
      and lower(dr.code_text) not like '%csf%'      -- named ones are tier 1
      and lower(dr.code_text) not like '%ucsf%'
      and dr.status in ('final', 'amended')
      and lower(dr.code_text) not like '%pap test%'
      and not (lower(dr.code_text) like '%gynecolog%'
               and lower(dr.code_text) not like '%non-gynecolog%'
               and lower(dr.code_text) not like '%non gyn%')
),

-- what the report's own prose says the specimen was
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
    -- CSF matched on SNOMED code OR display: Epic-local OIDs carry
    -- 'Cerebrospinal Fluid' under non-SNOMED codes (155, 9)
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

analysis as (
    -- tier 1: the report name says CSF
    select report_id, patient_fhir_id, code_text, analyzed_at, test_family,
           'named' as evidence_tier, 1 as tier_rank
    from tier1_named
    where test_family is not null

    union all

    -- tier 2: the report's own result text names CSF and no competing source
    select u.report_id, u.patient_fhir_id, u.code_text, u.analyzed_at, 'cytology',
           'text_confirmed', 2
    from unnamed_cytology u
    join cytology_source_evidence e on e.report_id = u.report_id
    where e.names_csf = 1 and e.names_other_source = 0

    union all

    -- tier 3: result text names no source at all, but CSF was drawn that day
    select u.report_id, u.patient_fhir_id, u.code_text, u.analyzed_at, 'cytology',
           'same_day_only', 3
    from unnamed_cytology u
    left join cytology_source_evidence e on e.report_id = u.report_id
    join csf_specimen cs
      on cs.patient_fhir_id = u.patient_fhir_id
     and cs.collected_on    = date(u.analyzed_at)
    where coalesce(e.names_csf, 0) = 0
      and coalesce(e.names_other_source, 0) = 0
),

report_result as (
    -- one row per report: narrative sections stitched together, plus any number
    select drr.diagnostic_report_id                          as report_id,
           group_concat(
               case when nullif(o.value_string, '') is not null
                    then concat(o.code_text, ': ', o.value_string) end
               order by case o.code_text
                            when 'Final Diagnosis'         then 1
                            when 'Impression'              then 2
                            when 'Case Results'            then 3
                            when 'Microscopic Description'  then 4
                            when 'Pathology Review'        then 5
                            when 'CSF Interpretation'      then 6
                            when 'Cytology Exam'           then 7
                            when 'Narrative'               then 8
                            when 'Comment'                 then 9
                            when 'Clinical Information'    then 10
                            when 'Gross Description'       then 11
                            else 12 end
               separator ' | ')                             as result_text,
           max(case when o.code_text in ('Final Diagnosis', 'Impression')
                    then o.value_string end)                as final_diagnosis,
           -- DIAGNOSTIC sections only, the classifier input. See the header for why
           -- this uses per-section max() + concat_ws rather than group_concat, and
           -- why Clinical Information / Gross Description are excluded.
           nullif(concat_ws(' ',
               max(case when o.code_text = 'Final Diagnosis'        then o.value_string end),
               max(case when o.code_text = 'Impression'             then o.value_string end),
               max(case when o.code_text = 'Case Results'           then o.value_string end),
               max(case when o.code_text = 'Cytology Exam'          then o.value_string end),
               max(case when o.code_text = 'Pathology Review'       then o.value_string end),
               max(case when o.code_text = 'CSF Interpretation'     then o.value_string end),
               max(case when o.code_text = 'Narrative'              then o.value_string end),
               max(case when o.code_text = 'Microscopic Description' then o.value_string end)
           ), '')                                           as diagnostic_text,
           max(nullif(o.value_quantity_value, ''))          as result_value,
           max(nullif(o.value_quantity_unit, ''))           as result_unit,
           -- '<' etc. MUST travel with the number: most tumour-marker results are
           -- '< 1.0', i.e. UNDETECTABLE. Dropping it reports undetectable as 1.0.
           max(nullif(o.value_quantity_comparator, ''))     as result_comparator,
           max(case when nullif(o.value_quantity_value, '') is not null
                    then concat(coalesce(nullif(o.value_quantity_comparator, ''), ''),
                                o.value_quantity_value,
                                coalesce(concat(' ', nullif(o.value_quantity_unit, '')), ''))
               end)                                         as result_display,
           sum(case when nullif(o.value_string, '') is not null then 1 else 0 end)
                                                            as result_sections
    from {{ source('radiant_fhir', 'diagnostic_report_result') }} drr
    join {{ source('radiant_fhir', 'observation') }} o
      on o.id = substring_index(drr.result_reference, '/', -1)
    -- attribution + boilerplate, not results
    where o.code_text not in ('Responsible User', 'CSF Interpreted By:',
                              'Compliance Statement', 'Control Statement',
                              'Case Report Header')
    group by drr.diagnostic_report_id
),

-- negation-neutralised copy of diagnostic_text; see the header for why each pass
-- exists and which real strings defeated the simpler forms
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

patient_rollup as (
    select patient_fhir_id,
           count(distinct report_id)                        as csf_analyses_total,
           min(analyzed_at)                                 as first_analyzed_at,
           min(tier_rank)                                   as best_tier_rank,
           count(distinct test_family)                      as distinct_families,
           group_concat(distinct test_family order by test_family separator ', ') as families_ever
    from analysis
    group by patient_fhir_id
),

ranked as (
    select a.*,
           row_number() over (partition by a.patient_fhir_id
                              -- most recent first; on a tie prefer the better-evidenced
                              -- analysis, then a stable id
                              order by a.analyzed_at desc, a.tier_rank, a.report_id) as rn
    from analysis a
)

select
    r.patient_fhir_id,
    -- strongest evidence this patient has ANYWHERE (cohort filter)
    case p.best_tier_rank when 1 then 'named' when 2 then 'text_confirmed'
                          else 'same_day_only' end          as patient_best_evidence,
    -- evidence for THE RETURNED analysis (may be weaker than the above)
    r.evidence_tier,
    r.analyzed_at                                           as latest_analyzed_at,
    r.test_family                                           as latest_test_family,
    r.code_text                                             as latest_test_name,
    rr.result_display,
    rr.result_value,
    rr.result_comparator,
    rr.result_unit,
    -- DERIVED, de-identification-safe label over the free text. See the header for
    -- the negation handling and the rejected simpler forms.
    case
        when rr.diagnostic_text is null then null
        when rr.dx_neutralised regexp 'positive for( [a-z]+){0,3} ?(malignant|tumor cell|neoplastic|blast|malignancy)'
          or rr.dx_neutralised like '%tumor cells present%'
          or rr.dx_neutralised like '%malignant cells present%'
          or rr.dx_neutralised like '%tumor cells seen%'
          or rr.dx_neutralised like '%malignant cells seen%'
          or rr.dx_neutralised like '%malignant cells identified%'
          or rr.dx_neutralised like '%metastatic tumor cell%'
          or rr.dx_neutralised like '%metastatic carcinoma cell%'
          or rr.dx_neutralised like '%blasts present%'
          or rr.dx_neutralised like '%blast cells present%'
          or rr.dx_neutralised like '%favor tumor%'               then 'positive'
        -- an explicit negation outranks incidental atypia: if the pathologist
        -- rendered a negative opinion, that IS the diagnosis
        when rr.dx_neutralised like '%#NEG%'
          or rr.dx_neutralised like '%no significant cytologic abnormalit%'
          or rr.dx_neutralised like '%benign%'                   then 'negative'
        when rr.dx_neutralised like '%suspicious%'
          or rr.dx_neutralised like '%atypical%'
          or rr.dx_neutralised like '%atypia%'
          or rr.dx_neutralised like '%equivocal%'                then 'suspicious'
        when rr.dx_neutralised like '%inadequate%'
          or rr.dx_neutralised like '%acellular%'
          or rr.dx_neutralised like '%unsatisfactory%'
          or rr.dx_neutralised like '%non-diagnostic%'
          or rr.dx_neutralised like '%nondiagnostic%'
          or rr.dx_neutralised like '%insufficient%'             then 'non_diagnostic'
        else 'no_malignancy_statement' end                       as malignant_cells,
    -- REVIEW FLAG -- see header
    case when rr.diagnostic_text is null then null
         when lower(rr.diagnostic_text) regexp '(margin|resection|biopsy|excision|lobectomy|mass fluid|ascites|pleural fluid|peritoneal fluid|bronchoalveolar)'
         then 1 else 0 end                                        as multi_specimen_report,
    rr.final_diagnosis,
    rr.result_text,
    rr.result_sections,
    p.csf_analyses_total,
    p.first_analyzed_at,
    p.distinct_families,
    p.families_ever,
    r.report_id                                             as latest_report_id
from ranked r
join patient_rollup p on p.patient_fhir_id = r.patient_fhir_id
left join report_result_scored rr on rr.report_id = r.report_id   -- LEFT: some reports carry no Observation
where r.rn = 1
