/*
   radiant_data_dev.csf_results_latest_by_component  (TABLE)

   Latest CSF result per patient PER COMPONENT -- routine chemistry and cell counts
   alongside the tumour-relevant findings. 1,054 patients.

   Eleven components, each resolved INDEPENDENTLY to its own most recent result:
     routine   protein, glucose, wbc (nucleated cells), rbc
     tumour    cytology, afp, hcg, cea, cell_free_dna, malignant_cell_panel,
               pathology_review

   *** SEMANTICS: EACH COMPONENT IS ITS OWN LATEST. A patient's protein and their
   cytology may come from DIFFERENT lumbar punctures, months or years apart. Every
   component therefore carries its own *_observed_at, and the view over this table
   adds its own age_at_*_days, so the divergence is always visible. Do NOT read a
   row as one lumbar puncture. ***

   This is the cbc_latest_results pattern (latest per analyte independently), chosen
   over a single-event anchor deliberately. The alternative -- anchor on the latest
   tumour analysis and attach only same-encounter routine values -- yields ONE
   coherent LP per row but completes for just 470 of 814 patients, and would report
   a 2022 tumour result while ignoring routine CSF from 2023 (for 231 patients the
   latest routine CSF is LATER than the latest tumour analysis, on average by 307
   days). Per-component latest maximises coverage on every column at the cost of
   contemporaneity. If you need values provably from one draw, join back on
   encounter_reference, which is populated on 99.8% of CSF reports (16,631/16,667)
   -- unlike the specimen link, which does not exist at all in this data.

   ROUTINE AND TUMOUR RESULTS ARE SEPARATE REPORTS, not sections of one. Only 39
   routine observations appear across all 814 latest tumour reports, and just 218 of
   12,264 routine reports carry a tumour observation. They are separate orders that
   happen to share a puncture, which is exactly why this table resolves them
   independently rather than pretending they arrive together.

   COHORT: the UNION of patients with any routine CSF analyte and any tumour-relevant
   CSF analysis -- 1,054 = 633 with both + 240 routine-only + 181 tumour-only.
   Restricting to the tumour cohort would silently drop 240 patients who had CSF
   chemistry or cell counts but never a cytology or marker. For the 240,
   patient_best_evidence and every tumour column are NULL.

   Source: radiant_iceberg_catalog.fhir_cbtn_tenant_db
     diagnostic_report / diagnostic_report_category   the report, and lab-vs-imaging
     diagnostic_report_result -> observation          WHERE THE VALUES AND TEXT LIVE
     observation_code_coding                          LOINC for the routine analytes
     specimen / specimen_type_coding                  CSF collection (cytology tier 3)

   ------------------------------------------------------------------------------
   ROUTINE ANALYTE IDENTIFICATION -- LOINC first, code_text fallback
   ------------------------------------------------------------------------------
     protein  2880-3   + 'CSF Protein', 'Total Protein, CSF', ...   mg/dL
     glucose  2342-4   + 'CSF Glucose', 'Glucose, CSF'              mg/dL
     wbc      806-0, 26465-5, 58470-6  + 'CSF Nucleated Cell Count',
              'White Blood Cells, BF', 'WBC, CSF', 'Total Nucleated Cells, CSF'
     rbc      26454-9, 23860-0 + 'CSF Red Cell Count', 'Red Blood Cells, BF',
              'RBC, CSF'
   The code_text arm is required: 'CSF Protein' (1,386 obs) and 'CSF Glucose'
   (1,397) carry NO LOINC at all, so a LOINC-only query would drop ~212 patients
   per analyte.

   *** EXCLUDED: DIFFERENTIAL DENOMINATORS. 'CSF number of cells counted',
   'Total Cells Counted', 'Total Cells Counted, BF' and 'Number of Cells Counted
   for Differential' (LOINC 19075-1) are the number of cells INSPECTED for the
   differential, not a concentration -- 676 of ~690 values are exactly 100.0.
   Admitting them as a cell count would report 100 cells for most patients. The
   genuine concentrations span 0 to 1,539,000, which is how they were told apart. ***

   UNITS ARE NOT NORMALISED. Cell counts arrive under SIX different spellings, and
   all six are numerically EQUIVALENT, so no conversion is applied or needed:
     /uL  /ul  /µl  /mm3  CUMM  x10E6/L
   1 mm3 = 1 uL = 1 CUMM by definition, and x10E6/L reduces to /uL (10^6 per litre
   over 10^6 uL per litre). That equivalence was CHECKED against the data rather
   than assumed: RBC in 'x10E6/L' averages 2,236 (min 1, max 54,500) against 2,417
   for '/µl' and 3,828 for '/uL' -- same order of magnitude, not the 1000x offset a
   genuine unit mismatch would show. Contrast cbc_latest_results, where ANC in
   '/uL' vs 'x10E9/L' really do differ by 1000x and must not be pooled.
   AFP appears as both 'ng/mL' and 'NG/ML' (case only); protein and glucose are
   uniformly 'mg/dL'; hCG uniformly 'IU/L'. Every value still ships with its own
   unit and its own source_code_text so the spelling is auditable per row.
   Observed ranges: protein 7-7,655 mg/dL, glucose 5-222 mg/dL, wbc 0-126,255,
   rbc 0-1,539,000.

   *** COMPARATORS ARE LOAD-BEARING on the chemistry. protein carries '<' or '>' on
   276 of its observations and glucose on 55; for the tumour markers it is the
   majority ('< 1.0 ng/mL' AFP means UNDETECTABLE, not a concentration of 1.0).
   Read <component>_display, which pre-composes comparator + value + unit. The bare
   <component>_value is provided for filtering and must not be read alone. ***

   ------------------------------------------------------------------------------
   CYTOLOGY: attribution tier and the derived finding
   ------------------------------------------------------------------------------
   Most cytology reports do not name the specimen source, and NO specimen -> report
   link exists (diagnostic_report_specimen and specimen_request are both empty, and
   the raw DiagnosticReport JSON has no 'specimen' key). Attribution is therefore
   tiered and cytology_evidence_tier states which applied:
     named           the report NAME contains CSF
     text_confirmed  the report's own result text names CSF and no competing source
     same_day_only   no source stated, but CSF was drawn that calendar day (weakest)

   malignant_cells is the derived, de-identification-safe finding
   (positive / suspicious / negative / non_diagnostic / no_malignancy_statement),
   classified from the diagnostic sections with three negation passes -- 'no tumor
   cells present' CONTAINS 'tumor cells present', which is the most common negative
   finding in this corpus. multi_specimen_report = 1 flags a report covering more
   than one specimen, where the finding may pertain to a non-CSF part. Full
   derivation and validation notes: csf_tumor_analysis_latest_table.sql.

   TRAPS IN IDENTIFYING CSF AT ALL -- both handled: 'UCSF' contains 'csf' (1,838
   unrelated rows), and CSF-flow / shunt-patency studies are imaging, excluded on
   diagnostic_report_category. Do not substitute keyword filtering: '%nuclear%'
   captures 'Anti Neuronal Nuclear AB, CSF' and '%dna%' captures 'Rapid HSV DNA,
   CSF' (virology), hence '%cell free dna%'.

   COMPLETED = a RESULTED report, status in ('final','amended'). Of the CSF
   ServiceRequests 31,789 are completed but 8,259 are REVOKED and 3,456 still
   active, so the order is not evidence the test happened.

   DATES: effective_date_time, a genuine CLINICAL date, 100% populated on these
   reports. UTC; the trailing 'Z' is stripped, not converted. Ages are NOT computed
   here -- the view over this table adds age_at_<component>_days per component, so
   the tenant view can gate every date while leaving every age visible.

   ------------------------------------------------------------------------------
   MATERIALIZATION
   ------------------------------------------------------------------------------
   POINT-IN-TIME SNAPSHOT; re-run to refresh.

   *** RUN AS A SCRIPT, IN ONE SESSION. *** The leading `set group_concat_max_len`
   is REQUIRED: cytology_result_text is assembled with group_concat, whose default
   cap is 1024 BYTES, and it truncates SILENTLY.

   RELATIONSHIP TO csf_tumor_analysis_latest: that table answers "the single most
   recent tumour-relevant CSF test per patient" (814 patients, one anchor event).
   This one answers "the latest value for each CSF component" (1,054 patients,
   eleven independent anchors). They disagree by construction and both are correct
   for their own question; neither supersedes the other.

   CONTAINS PHI: patient_fhir_id, real calendar timestamps, and free-text
   cytology_final_diagnosis / cytology_result_text that quote patient name and MRN.
 */

set group_concat_max_len = 1048576;

drop table if exists radiant_data_dev.csf_results_latest_by_component;

create table radiant_data_dev.csf_results_latest_by_component as (

with csf_lab_report as (
    select dr.id                                            as report_id,
           substring_index(dr.subject_reference, '/', -1)     as patient_fhir_id,
           dr.code_text,
           dr.encounter_reference,
           cast(replace(replace(nullif(dr.effective_date_time, ''), 'T', ' '), 'Z', '') as datetime)
                                                            as observed_at
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report dr
    where lower(dr.code_text) like '%csf%'
      and lower(dr.code_text) not like '%ucsf%'          -- 'UCSF' contains 'csf'
      and dr.status in ('final', 'amended')
      and dr.id not in (select diagnostic_report_id       -- CSF-flow imaging
                        from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report_category
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
    join radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report_result drr
      on drr.diagnostic_report_id = r.report_id
    join radiant_iceberg_catalog.fhir_cbtn_tenant_db.observation o
      on o.id = substring_index(drr.result_reference, '/', -1)
    left join radiant_iceberg_catalog.fhir_cbtn_tenant_db.observation_code_coding occ
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
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report dr
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
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report_result drr
    join radiant_iceberg_catalog.fhir_cbtn_tenant_db.observation o
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
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.specimen s
    join radiant_iceberg_catalog.fhir_cbtn_tenant_db.specimen_type_coding stc
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
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report_result drr
    join radiant_iceberg_catalog.fhir_cbtn_tenant_db.observation o
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
);
