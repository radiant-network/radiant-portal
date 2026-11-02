{{ config(
    materialized='view',
    tags=['cbtn_clinical', 'combined', 'phi']
) }}

-- Read surface over csf_tumor_analysis_latest that adds mrn + research_id,
-- organization_name / organization_code (for downstream access control), and ages in
-- days beside the analysis timestamps.
--
-- CONTAINS PHI: mrn, patient_fhir_id, real calendar timestamps, and free-text
-- pathology prose that quotes patient name and MRN. The grant-guarded surface is
-- ac_v_csf_tumor_analysis_latest, which gates final_diagnosis and result_text.
--
-- ORGANIZATION RESOLUTION uses the pcx_30 / auth.pii_grant vocabulary via
-- int_cbtn_organization_by_mrn -> pcx_30_organization_ref, not the FHIR
-- org_short_code. See that intermediate for why the distinction is load-bearing.
--
-- A GENUINE CLINICAL DATE, unlike v_lansky_karnofsky_latest:
-- diagnostic_report.effective_date_time is 100% populated for these reports, so
-- age_at_*_days is age-at-analysis, not age-at-result-release.
--
-- NO group_concat AT READ TIME. result_text was assembled ONCE, when the base model
-- was materialised under a raised group_concat_max_len (see its pre_hook). This view
-- only reads the stored string, so it cannot be silently truncated at 1024 bytes the
-- way a view containing the assembly would be. That is a deliberate reason the base
-- is a table rather than this being one flattened view.
--
-- DOB SOURCE: FHIR patient.birth_date, present for 814 of 814 and uniformly
-- 'YYYY-MM-DD'. patient.id is unique so the join cannot fan out; LEFT joined anyway.
-- birth_date itself is NOT projected.

select
    -- identifier block (identified first, then de-identified)
    c.patient_fhir_id,
    m.mrn,
    m.research_id,

    -- organization (pcx_30 / auth.pii_grant vocabulary)
    r.organization_name,
    o.code as organization_code,

    -- provenance of the CSF attribution
    c.patient_best_evidence,
    c.evidence_tier,

    -- the latest analysis
    c.latest_test_family,
    c.latest_test_name,
    c.latest_analyzed_at,
    datediff(c.latest_analyzed_at, cast(p.birth_date as date)) as age_at_latest_analysis_days,

    -- derived, de-identification-safe finding
    c.malignant_cells,
    c.multi_specimen_report,

    -- quantitative result (read result_display: the comparator is load-bearing)
    c.result_display,
    c.result_value,
    c.result_comparator,
    c.result_unit,

    -- free text: PHI-bearing, gated downstream
    c.final_diagnosis,
    c.result_text,
    c.result_sections,

    -- cohort context
    c.csf_analyses_total,
    c.first_analyzed_at,
    datediff(c.first_analyzed_at, cast(p.birth_date as date)) as age_at_first_analysis_days,
    c.distinct_families,
    c.families_ever,
    c.latest_report_id
from {{ ref('csf_tumor_analysis_latest') }} c
left join {{ ref('radiant_patient_mrn_list') }} m
    on m.patient_id = c.patient_fhir_id
left join {{ source('radiant_fhir', 'patient') }} p
    on p.id = c.patient_fhir_id
left join {{ ref('int_cbtn_organization_by_mrn') }} r
    on r.mrn = m.mrn
left join {{ ref('pcx_30_organization_ref') }} o
    on o.name = r.organization_name
