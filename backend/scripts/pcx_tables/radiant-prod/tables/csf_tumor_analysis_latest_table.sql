/*
   radiant_data_dev.csf_tumor_analysis_latest  (TABLE)

   MOST RECENT CSF tumor-relevant analysis per patient, WITH RESULT TEXT

   One row per patient: the LATEST completed cerebrospinal-fluid analysis in the
   tumor-relevant families (cytology / malignant cells, tumor markers
   AFP + beta-hCG + CEA, cell-free DNA, CSF acute-leukemia panel, pathologist or
   MD review of a CSF differential), together with the narrative result text and,
   where the assay is quantitative, the numeric value and unit.

   Routine CSF work (cell count, differential, protein, glucose), microbiology,
   autoimmune/neuro panels, metabolic studies and drug levels are OUT of scope.

   Returns 814 patients. Superseded predecessor:
   csf_tumor_analysis_per_patient.sql (520 patients, aggregate-per-patient, no
   result text). The cohort grew because the RESULT TEXT turned out to name the
   specimen source, which is far stronger evidence than the date-proximity
   inference that file relies on -- see EVIDENCE TIERS below.

   Source: radiant_iceberg_catalog.fhir_cbtn_tenant_db
     diagnostic_report            the result header
     diagnostic_report_category   separates laboratory analysis from imaging
     diagnostic_report_result     report -> Observation link (5,656,664 rows)
     observation                  WHERE THE RESULT TEXT AND VALUES ACTUALLY LIVE
     specimen + specimen_type_coding   CSF collection events (tier 3 only)

   ------------------------------------------------------------------------------
   WHERE THE RESULT TEXT LIVES -- not where you would expect
   ------------------------------------------------------------------------------
   diagnostic_report.conclusion is 0% POPULATED (0 of 846 named CSF tumor reports),
   so the obvious field is a dead end. diagnostic_report_presented_form covers only
   47 of those reports and carries a URL to a Binary, never inline text.

   The text is in the LINKED OBSERVATIONS, reached via diagnostic_report_result
   (result_reference = 'Observation/<id>'). A pathology report is decomposed into
   one Observation PER SECTION, with observation.code_text as the section name and
   observation.value_string as its prose:
     Final Diagnosis          the clinically decisive section
     Impression               "
     Microscopic Description  cytology findings
     Gross Description        specimen as received -- often NAMES the source
     Clinical Information     indication
     Case Results / Cytology Exam / Narrative / Pathology Review / Comment
   Quantitative assays instead populate value_quantity_value + _unit
   (AFP in ng/mL, beta-hCG in IU/L).

   *** THE COMPARATOR IS LOAD-BEARING -- READ result_display, NOT result_value. ***
   value_quantity_comparator carries '<' on the MAJORITY of tumour-marker results:
   AFP '< 1.0 ng/mL' (64), beta-hCG '< 1.0 IU/L' (46), AFP '< 0.5 NG/ML' (13),
   hCG '< 0.6 IU/L' (7), '< 0.5 IU/L' (5). Those are UNDETECTABLE results. The
   genuinely elevated ones carry NO comparator (AFP 32.0 and 18.0 ng/mL, beta-hCG
   185.0, 62.0 and 4.0 IU/L). Reading result_value alone would report an
   undetectable marker as a real concentration of 1.0 and destroy exactly the
   distinction a germ-cell marker is ordered to make. result_display pre-composes
   comparator + value + unit ('<1.0 ng/mL'); result_value, result_comparator and
   result_unit are also returned separately for filtering. Units are NOT
   normalised -- note both 'ng/mL' and 'NG/ML' occur.

   Five sections are EXCLUDED from result_text as non-results:
     Responsible User      a bare numeric user id, e.g. '97638'
     CSF Interpreted By:   attribution
     Compliance Statement  lab boilerplate ("these tests were developed and...")
     Control Statement     "All controls show appropriate reactivity."
     Case Report Header    case number + authorizing provider
   Everything else is kept, so a section vocabulary added later is retained rather
   than silently dropped. Concatenated result_text averages 877 characters over
   3.5 sections, max 10,665 over 8.

   RESULT-CONTENT COVERAGE of the 814 returned rows:
     369  narrative text WITH a Final Diagnosis / Impression section
     345  narrative text but NO final-diagnosis section (read result_text)
      38  numeric only -- a quantitative marker, no prose (read result_display)
      62  NO result content at all: the latest report carries no linked
          Observation, so result_text, final_diagnosis and result_display are all
          NULL. The analysis still happened -- the row is evidence of the test,
          not of its findings. The report -> Observation join is LEFT for exactly
          this reason; an inner join would silently drop these 62 patients.

   ------------------------------------------------------------------------------
   DERIVED COLUMN: malignant_cells -- the de-identification-safe label
   ------------------------------------------------------------------------------
   A scalar classification of the cytology finding, so a tenant-facing surface can
   expose the ANSWER without exposing the PHI-bearing prose. Free text is retained
   here (result_text, final_diagnosis) for internal review; only this column is
   safe to project into a de-identified release.

   Values, over the 814 rows:
     negative                311   an explicit negative opinion was rendered
     no_malignancy_statement  58   text present, but no opinion on malignancy
     suspicious               14   atypia / suspicion short of an assertion
     positive                 11   malignant or tumour cells asserted present
     non_diagnostic            3   specimen could not be assessed
     NULL                    417   no diagnostic text at all (mostly quantitative
                                   markers, which carry a number not a narrative)

   Classified on diagnostic_text -- the diagnostic sections ONLY. Clinical
   Information and Gross Description are excluded on purpose: they carry the
   indication and the specimen label, where 'rule out malignancy' or a prior
   diagnosis reads as a finding.

   *** NEGATION IS THE WHOLE PROBLEM. *** The naive rule fails catastrophically:
   'no tumor cells present' CONTAINS 'tumor cells present', and that is the single
   most common negative finding in this corpus. Three negation passes run before
   any positive test, each added after it was caught mislabelling real rows:
     pass 1  post-posed: 'groups of tumor cells ARE NOT PRESENT' / 'are not
             observed'. Surface form contains the positive substring exactly.
     pass 2  pre-posed with a GENERIC modifier slot ([a-z]+){0,2}. An enumerated
             adverb list kept failing one word at a time -- first 'no DEFINITIVE
             tumor cells seen', then 'no CYTOLOGICALLY malignant cells identified'
             each scored POSITIVE. The {0,2} bound is verified not to reach across
             a clause boundary: '-no inflammatory cells -positive for malignant
             cells' must stay POSITIVE, and does.
     pass 3  'negative for ...', including blasts and atypical cells, so
             'negative for blasts or atypical cells' cannot score suspicious.

   'positive for' is bound to a malignancy term by regex, never matched bare: a
   bare '%positive for%' also caught 'positive for BRAF gene rearrangement' and
   'diffusely positive for mutant protein' (an H3 K27M immunostain) -- molecular
   and immunostain positivity, not malignant cells in the fluid.

   An explicit negation OUTRANKS incidental atypia: if the pathologist rendered a
   negative opinion, that is the diagnosis, even where the same text notes atypical
   cells.

   VALIDATION: every one of the 11 positives and 14 suspicious rows was read
   verbatim. Zero positives contain any negation phrase (checked as a standing
   assertion against 'no cytolog%', 'negative for%', 'no definit%', 'are not
   present', 'no evidence of'). A 19-case fixture covering every negated,
   asserted and adversarial form observed in the corpus classifies correctly.

   *** RESIDUAL LIMITATION -- multi_specimen_report. *** A pathology report can
   cover several specimens at once, and the classifier reads the report, not the
   part. Two positives were traced to a DIFFERENT specimen in the same report ('A.
   Pituitary mass fluid  Involved by pituitary neuroendocrine tumor', and a
   surgical 'lateral margin ... positive for malignant peripheral nerve sheath
   tumor') -- neither was CSF. Both are now excluded by tightening the two loosest
   patterns, and multi_specimen_report = 1 marks any row whose diagnostic text
   still references a non-CSF specimen (margin / resection / biopsy / excision /
   mass fluid / ascites / pleural / peritoneal / bronchoalveolar). Currently 0 of
   the 11 positives are flagged; 4 negative, 4 no_malignancy_statement and 3
   suspicious rows are. There is no specimen -> report link to scope this
   properly, so the flag is the honest mitigation, not a fix.

   TREAT malignant_cells AS A SCREENING AID, NOT AN ABSTRACTION. It is a
   deterministic keyword classifier over prose written by many hands across four
   decades. For any use that must be right case by case, read final_diagnosis.

   *** result_text IS UNSTRUCTURED CLINICAL PROSE AND IS NOT DE-IDENTIFIED. ***
   It routinely quotes the specimen label, which includes the patient name and
   medical record number, e.g. 'received fresh in a container labeled with the
   patient's name, medical record number and designated "CSF"'. Provider names
   appear in some sections. It therefore CANNOT be exposed through the
   access-controlled tenant pattern the way a scalar can -- masking a column does
   nothing about PHI inside free text. Treat result_text as internal-only unless
   it has been through the de-identification pipeline.

   ------------------------------------------------------------------------------
   EVIDENCE TIERS -- read evidence_tier on every row
   ------------------------------------------------------------------------------
   Cytology is the problem case: most cytology reports do NOT name the specimen
   source in the report name ('Cytology Fluids' 900 reports, 'Cytopathology Exam'
   614, 'Cytology Exam (non-gynecologic)' 785), and NO specimen -> report link
   exists in this data to settle it. Both diagnostic_report_specimen and
   specimen_request are 0 rows, faithful to the source: the raw DiagnosticReport
   JSON in raw_fhir_resources has no 'specimen' key at all (0 of 2,000 sampled).
   ('basedOn' IS present -- report -> ServiceRequest works; specimen -> report
   does not.)

   So each analysis carries the strength of its own source evidence:

     1 named            243 pts  The REPORT NAME contains CSF. No inference.
     2 text_confirmed   756 pts  Report name is generic, but the RESULT TEXT names
                                 CSF / cerebrospinal / lumbar puncture / ommaya /
                                 spinal fluid AND names no competing source
                                 (pleural, peritoneal, ascitic, urine, sputum,
                                 bronchial, pericardial). The report states its own
                                 specimen, which is nearly as good as the name.
                                 571 of these patients are new vs tier 1.
     3 same_day_only     47 pts  Result text names NO source either way, but the
                                 patient had a CSF specimen COLLECTED that same
                                 calendar day. WEAKEST -- date proximity only, and
                                 same-day is not same-order.

   Union of all three = 814 patients. Tier counts overlap (a patient can hold
   analyses at several tiers); patient_best_evidence gives the strongest tier that
   patient has anywhere, and evidence_tier describes THE RETURNED (most recent)
   analysis specifically. Those two can differ -- a patient's best-evidenced
   analysis is not necessarily their latest.

   For a strictly defensible cohort:            patient_best_evidence = 'named'
   For a defensible cohort with good recall:    patient_best_evidence in ('named','text_confirmed')
   Tier 3 should be treated as candidates for review, not findings.

   15 unnamed cytology reports name BOTH CSF and another source and are excluded
   from tier 2 (they fall through to tier 3 only if same-day evidence exists);
   62 name another source ONLY and are excluded entirely.

   Gynecologic cytology and Pap tests are excluded by name from the cytology arms
   (4 codes, 6 reports). Note 'non-gynecologic' contains 'gynecologic', hence the
   explicit negative guards.

   ------------------------------------------------------------------------------
   TWO TRAPS IN TEXT-MATCHING 'CSF' -- both handled
   ------------------------------------------------------------------------------
   1. 'UCSF' CONTAINS 'CSF'. A bare LIKE '%csf%' pulls in 1,838 rows with nothing
      to do with cerebrospinal fluid -- 'Basic Metabolic Panel - UCSF/LabCorp/
      Quest' (859), 'Comprehensive Metabolic Panel - UCSF...' (734), 'UCSF500'.
   2. CSF-FLOW IMAGING IS NOT FLUID ANALYSIS. 'MR CSF Flow Study' (232),
      'Nuclear Medicine CSF Shunt Patency' (45), 'CSF FLOW, CISTERNOGRAPHY' are
      radiology, excluded on diagnostic_report_category.category_text. Verified no
      CSF report falls in both a lab and an imaging category.

   Do NOT substitute keyword filtering. '%nuclear%' wrongly captures 'Anti Neuronal
   Nuclear AB, CSF' (a real CSF test) and '%dna%' wrongly captures 'Rapid HSV DNA,
   CSF' (virology, not tumor cell-free DNA) -- hence '%cell free dna%', never
   '%dna%'. The named-arm patterns resolve to exactly 26 code_text values, each
   reviewed by hand against the full 187-value CSF vocabulary, and fold in
   non-obvious members: 'Human Chorionic Gonadotropin For Tumor, CSF',
   'CSF Carcinoembryonic Antigen', 'CSF Acute Leukemia Panel', and two
   'Miscellaneous Outside Lab Test - ... beta HCG, CSF' free-text orders.
   'Paraneoplastic Ab Eval - CSF' is deliberately excluded: antibodies, not
   malignant cells or tumour markers.

   COMPLETED = a RESULTED report: diagnostic_report.status in ('final','amended').
   Keying on the order would be wrong -- of the CSF ServiceRequests, 31,789 are
   completed but 8,259 are REVOKED and 3,456 still active.

   DATE: effective_date_time, 100% populated on the named tumor-relevant reports
   (771 of 771), so a genuine CLINICAL date needing no fallback chain -- unlike the
   Lansky/Karnofsky domain where it is empty. UTC; the trailing 'Z' is stripped,
   not converted, so the tier-3 same-day join is a UTC-day join.

   CONTAINS PHI: patient_fhir_id, real calendar timestamps, and free-text
   result_text that quotes names and MRNs. Internal use only.
   ------------------------------------------------------------------------------
   MATERIALIZATION
   ------------------------------------------------------------------------------
   This is a TABLE, i.e. a POINT-IN-TIME SNAPSHOT. The source is live, so it goes
   stale as new CSF results are filed. Re-run this file to refresh.

   *** RUN THIS FILE AS A SCRIPT, IN ONE SESSION. *** The leading
   `set group_concat_max_len` is REQUIRED and is not optional tidying: result_text
   is assembled with group_concat, whose default cap is 1024 BYTES, and it
   truncates SILENTLY. Executing the CREATE TABLE without the SET in the same
   session materialises a table whose result_text is cut off mid-report (observed:
   1024-byte values against a 6,398-byte Final Diagnosis). Materialising here is
   also why the downstream views are safe: they read stored text and never re-run
   group_concat.

   CONTAINS PHI: patient_fhir_id, real calendar timestamps, AND free-text
   result_text / final_diagnosis that quote patient name and MRN. radiant_data_dev
   is the correct home. The grant-guarded surface is
   cbtn_tenant.v_csf_tumor_analysis_latest, where the free text is gated behind
   can_read_phi rather than dropped.
 */

set group_concat_max_len = 1048576;

drop table if exists radiant_data_dev.csf_tumor_analysis_latest;

create table radiant_data_dev.csf_tumor_analysis_latest as (
with csf_lab_report as (
    -- every CSF DiagnosticReport that is a laboratory analysis, not imaging
    select dr.id                                            as report_id,
           substring_index(dr.subject_reference, '/', -1)    as patient_fhir_id,
           dr.code_text,
           cast(replace(replace(nullif(dr.effective_date_time, ''), 'T', ' '), 'Z', '') as datetime)
                                                            as analyzed_at
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report dr
    where lower(dr.code_text) like '%csf%'
      and lower(dr.code_text) not like '%ucsf%'                      -- trap 1
      and dr.status in ('final', 'amended')
      and dr.id not in (select diagnostic_report_id                  -- trap 2
                        from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report_category
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
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report dr
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
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report_result drr
    join radiant_iceberg_catalog.fhir_cbtn_tenant_db.observation o
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
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.specimen s
    join radiant_iceberg_catalog.fhir_cbtn_tenant_db.specimen_type_coding stc
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
           -- DIAGNOSTIC sections only, used as the classifier input. Deliberately
           -- excludes Clinical Information and Gross Description: those carry the
           -- INDICATION and the specimen label, where a phrase like 'rule out
           -- malignancy' or a prior diagnosis would read as a positive finding.
           --
           -- Built from per-section max() and concat_ws, NOT group_concat:
           -- group_concat is capped by group_concat_max_len (default 1024 BYTES)
           -- and truncates SILENTLY. Classifying on a truncated string is a
           -- correctness bug -- a malignancy statement past byte 1024 simply
           -- disappears. max() has no such cap.
           -- nullif(...,'') is REQUIRED: concat_ws skips NULL inputs and returns an
           -- EMPTY STRING when every section is absent, not NULL. Without this the
           -- classifier scores 'no diagnostic text at all' as
           -- 'no_malignancy_statement', conflating absent text with an absent opinion.
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
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report_result drr
    join radiant_iceberg_catalog.fhir_cbtn_tenant_db.observation o
      on o.id = substring_index(drr.result_reference, '/', -1)
    -- attribution + boilerplate, not results
    where o.code_text not in ('Responsible User', 'CSF Interpreted By:',
                              'Compliance Statement', 'Control Statement',
                              'Case Report Header')
    group by drr.diagnostic_report_id
),

-- negation-neutralised copy of diagnostic_text. Literal string replacement is
-- NOT sufficient here: 'no DEFINITIVE tumor cells seen' defeated a fixed-string
-- list and was mis-scored positive, so the modifier slot is a regex alternation.
report_result_scored as (
    select rr.*,
           regexp_replace(
             regexp_replace(
               regexp_replace(lower(replace(replace(rr.diagnostic_text, '\n', ' '), '  ', ' ')),
                   -- pass 1: post-posed negation. 'Groups of tumor cells ARE NOT
                   -- PRESENT' is a NEGATIVE whose surface form contains the exact
                   -- substring a naive positive rule matches on.
                   '(tumor|malignant|neoplastic|atypical|blast)( cell(s)?)? (are|is|were|was) not (present|observed|identified|seen|detected|noted|appreciated)',
                   '#NEG'),
                   -- pass 2: pre-posed negation with an optional hedge modifier.
                   -- The modifier slot is why a fixed-string list failed: 'no
                   -- DEFINITIVE tumor cells seen' slipped through and scored positive.
                   -- GENERIC modifier slot (up to two intervening words) rather
                   -- than an enumerated adverb list. Enumeration kept failing one
                   -- adverb at a time: 'no DEFINITIVE tumor cells seen', then 'no
                   -- CYTOLOGICALLY malignant cells identified'. The {0,2} bound
                   -- keeps it from reaching across a clause boundary, verified
                   -- against '-no inflammatory cells -positive for malignant cells',
                   -- which must stay POSITIVE.
                   'no(t)? ([a-z]+ ){0,2}(evidence of |presence of )?(tumor|malignant|neoplastic|germ|atypical|blast|malignancy|atypia)( cell(s)?)?( seen| present| identified| noted| detected)?',
                   '#NEG'),
               -- pass 3: 'negative for ...', incl. blasts / atypical cells, so
               -- 'negative for blasts or atypical cells' cannot score suspicious
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
    -- DERIVED, de-identification-safe label over the free text. See the
    -- MALIGNANT-CELLS CLASSIFIER note in the header for the negation handling.
    case
        when rr.diagnostic_text is null then null
        -- 'positive for' MUST be bound to a malignancy term. A bare
        -- '%positive for%' also matched 'positive for BRAF gene rearrangement'
        -- and 'diffusely positive for mutant protein' (H3 K27M immunostain) --
        -- molecular / immunostain positivity, not malignant cells in the fluid.
        when rr.dx_neutralised regexp 'positive for( [a-z]+){0,3} ?(malignant|tumor cell|neoplastic|blast|malignancy)'
          or rr.dx_neutralised like '%tumor cells present%'
          or rr.dx_neutralised like '%malignant cells present%'
          or rr.dx_neutralised like '%tumor cells seen%'
          or rr.dx_neutralised like '%malignant cells seen%'
          or rr.dx_neutralised like '%malignant cells identified%'
          -- '%metastatic%' alone and '%involved by%' were both DROPPED/TIGHTENED:
          -- each fired on a DIFFERENT specimen inside a multi-specimen pathology
          -- report (observed: 'A. Pituitary mass fluid  Involved by pituitary
          -- neuroendocrine tumor', and a surgical 'lateral margin ... positive for
          -- malignant peripheral nerve sheath tumor'). Neither was CSF. The
          -- genuine CSF positive that needed 'metastatic' reads 'rare groups of
          -- metastatic tumor cells', which the tightened form still catches.
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
    -- REVIEW FLAG: the report's diagnostic text references a non-CSF specimen, so
    -- it is a multi-specimen pathology report and any label should be confirmed
    -- against the CSF part specifically. This is the residual limitation of a
    -- report-level classifier: there is no specimen -> report link to scope it.
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
order by r.analyzed_at desc, r.patient_fhir_id
);
