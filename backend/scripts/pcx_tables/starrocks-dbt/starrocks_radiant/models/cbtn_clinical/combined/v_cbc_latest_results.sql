{{ config(
    materialized='view',
    tags=['cbtn_clinical', 'combined', 'phi']
) }}

-- Read surface over cbc_latest_results that adds mrn + research_id,
-- organization_name / organization_code (for downstream access control), and an age
-- in days beside each analyte's observation timestamp.
--
-- CONTAINS PHI: mrn, patient_fhir_id, and real calendar *_observed_at timestamps
-- side by side with research_id. The grant-guarded surface is
-- ac_v_cbc_latest_results.
--
-- ORGANIZATION RESOLUTION is NOT interchangeable with the base table's
-- org_short_code -- that is the FHIR vocabulary (chop/seattle/ucsf) while
-- organization_code is the pcx_30 / auth.pii_grant vocabulary (CHOP/SCH/UCSF-BCH). Only
-- 'chop' coincides, so keying access control on org_short_code would fail closed for
-- every Seattle and UCSF patient. Resolves for 2,405 of 2,421: CHOP 1,837, SCH 336,
-- UCSF-BCH 231, UAB 1 -- so unlike the performance-status domain this one DOES have
-- non-CHOP patients a grant can reach.
--
-- *** 16 of 2,421 patients resolve to a NULL organization_code (14 chop + 2 seattle,
-- i.e. absent from the mrn list or lacking an organization_name in stg). A NULL
-- organization_code can never match a pii_grant row, so downstream those patients
-- fail CLOSED -- permanently de-identified even for an authorized caller. Safe
-- direction, but silent. ***
--
-- IDENTIFIER JOIN: radiant_patient_mrn_list.patient_id IS the patient FHIR id.
-- Verified unique, so it cannot fan out. LEFT joined deliberately -- 3 of the 2,421
-- patients have no row there, and an inner join would silently drop them. They
-- surface with NULL mrn/research_id so the gap is visible. (42 NULL + 9 empty-string
-- research_id of 2,421 is the same upstream gap documented on
-- v_lansky_karnofsky_latest.)
--
-- ONE AGE FOR THE WHOLE ROW (changed 2026-10-14). This view previously carried four
-- age_at_<analyte>_days columns because the base table resolved each analyte
-- independently and the dates could differ. The base model now returns a single
-- PANEL, so there is one timestamp and one age -- see cbc_latest_results for the
-- measured defect this fixed and what it cost.
--
-- age_at_panel_days is the de-identified counterpart to the gated panel_observed_at,
-- which is why the tenant view can publish it unguarded.
--
-- VALUES ARE NOT UNIT-NORMALIZED -- ANC appears as both '/uL' and 'x10E9/L', which
-- differ by 1000x. Every value carries its unit, LOINC code and source code_text.
--
-- DOB SOURCE: FHIR patient.birth_date, chosen over stg_cbtn_enrollment_final.dob on
-- coverage (FHIR present for 2,421 of 2,421 CBC patients, stg dob for only 2,369).
-- patient.id is unique and birth_date is uniformly 'YYYY-MM-DD', so the cast is safe
-- and the join cannot fan out; LEFT joined anyway. birth_date itself is NOT projected
-- -- the age columns are the point.

select
    -- identifier block (identified first, then de-identified)
    c.patient_fhir_id,
    m.mrn,
    m.research_id,
    c.subject_reference,

    -- organization (pcx_30 / auth.pii_grant vocabulary, not org_short_code)
    r.organization_name,
    o.code as organization_code,
    c.org_short_code,

    -- panel timing: ONE date and ONE age for the whole row
    c.panel_observed_at,
    datediff(c.panel_observed_at, cast(p.birth_date as date)) as age_at_panel_days,
    c.date_semantic,
    c.diagnostic_report_id,

    -- WBC
    c.wbc_value,
    c.wbc_unit,
    c.wbc_loinc,
    c.wbc_source_code_text,

    -- hemoglobin
    c.hemoglobin_value,
    c.hemoglobin_unit,
    c.hemoglobin_loinc,
    c.hemoglobin_source_code_text,

    -- platelets
    c.platelets_value,
    c.platelets_unit,
    c.platelets_loinc,
    c.platelets_source_code_text,

    -- ANC
    c.anc_value,
    c.anc_unit,
    c.anc_loinc,
    c.anc_source_code_text,

    c.analytes_found
from {{ ref('cbc_latest_results') }} c
left join {{ ref('radiant_patient_mrn_list') }} m
    on m.patient_id = c.patient_fhir_id
left join {{ source('radiant_fhir', 'patient') }} p
    on p.id = c.patient_fhir_id
left join {{ ref('int_cbtn_organization_by_mrn') }} r
    on r.mrn = m.mrn
left join {{ ref('pcx_30_organization_ref') }} o
    on o.name = r.organization_name
