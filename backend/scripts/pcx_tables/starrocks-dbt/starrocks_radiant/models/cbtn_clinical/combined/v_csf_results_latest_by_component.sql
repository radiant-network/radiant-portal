{{ config(
    materialized='view',
    tags=['cbtn_clinical', 'combined', 'phi']
) }}

-- Read surface over csf_results_latest_by_component that adds mrn + research_id,
-- organization_name / organization_code (for downstream access control), and an age
-- in days beside every component timestamp.
--
-- CONTAINS PHI: mrn, patient_fhir_id, real calendar timestamps, and pathology prose
-- that quotes patient name and MRN. The grant-guarded surface is
-- ac_v_csf_results_latest_by_component, which gates every date and every free-text
-- column.
--
-- ORGANIZATION RESOLUTION uses the pcx_30 / auth.pii_grant vocabulary via
-- int_cbtn_organization_by_mrn -> pcx_30_organization_ref, not the FHIR
-- org_short_code. See that intermediate for why the distinction is load-bearing.
--
-- EVERY COMPONENT CARRIES ITS OWN DATE AND AGE, because the base model resolves each
-- component independently -- the timestamps are not expected to agree, and the row is
-- not a single draw.
--
-- NO group_concat AT READ TIME: cytology_result_text was assembled once when the base
-- model was materialised under a raised group_concat_max_len (see its pre_hook), so
-- this view reads a stored string and cannot be silently truncated at 1024 bytes.
--
-- patient_best_evidence is NULL for the ~240 routine-only patients -- those with
-- chemistry or cell counts but no tumour-relevant analysis at all. NULL there means
-- "no tumour evidence tier applies", not "weakest tier".
--
-- DOB SOURCE: FHIR patient.birth_date. patient.id is unique so the join cannot fan
-- out; LEFT joined anyway. birth_date itself is NOT projected.

select
    -- identifier block (identified first, then de-identified)
    c.patient_fhir_id,
    m.mrn,
    m.research_id,

    -- organization (pcx_30 / auth.pii_grant vocabulary)
    r.organization_name,
    o.code as organization_code,

    -- tumour attribution tier; NULL for the routine-only patients
    c.patient_best_evidence,
    -- protein (mg/dL): value, date, age
    c.protein_display,
    c.protein_value,
    c.protein_comparator,
    c.protein_unit,
    c.protein_observed_at,
    datediff(c.protein_observed_at, cast(p.birth_date as date)) as age_at_protein_days,
    c.protein_source_code_text,
    -- glucose (mg/dL): value, date, age
    c.glucose_display,
    c.glucose_value,
    c.glucose_comparator,
    c.glucose_unit,
    c.glucose_observed_at,
    datediff(c.glucose_observed_at, cast(p.birth_date as date)) as age_at_glucose_days,
    c.glucose_source_code_text,
    -- nucleated cells / WBC: value, date, age
    c.wbc_display,
    c.wbc_value,
    c.wbc_unit,
    c.wbc_observed_at,
    datediff(c.wbc_observed_at, cast(p.birth_date as date)) as age_at_wbc_days,
    c.wbc_source_code_text,
    -- RBC: value, date, age
    c.rbc_display,
    c.rbc_value,
    c.rbc_unit,
    c.rbc_observed_at,
    datediff(c.rbc_observed_at, cast(p.birth_date as date)) as age_at_rbc_days,
    c.rbc_source_code_text,
    -- cytology: derived finding, free text, date, age
    c.cytology_evidence_tier,
    c.cytology_test_name,
    c.malignant_cells,
    c.multi_specimen_report,
    c.cytology_final_diagnosis,
    c.cytology_result_text,
    c.cytology_observed_at,
    datediff(c.cytology_observed_at, cast(p.birth_date as date)) as age_at_cytology_days,
    -- AFP: value, date, age
    c.afp_display,
    c.afp_value,
    c.afp_comparator,
    c.afp_unit,
    c.afp_observed_at,
    datediff(c.afp_observed_at, cast(p.birth_date as date)) as age_at_afp_days,
    -- beta-hCG: value, date, age
    c.hcg_display,
    c.hcg_value,
    c.hcg_comparator,
    c.hcg_unit,
    c.hcg_observed_at,
    datediff(c.hcg_observed_at, cast(p.birth_date as date)) as age_at_hcg_days,
    -- CEA: date, age
    c.cea_display,
    c.cea_observed_at,
    datediff(c.cea_observed_at, cast(p.birth_date as date)) as age_at_cea_days,

    -- cell-free DNA: date, age (send-out; no scalar result returned)
    c.cell_free_dna_observed_at,
    datediff(c.cell_free_dna_observed_at, cast(p.birth_date as date)) as age_at_cell_free_dna_days,

    -- malignant cell panel: date, age
    c.malignant_cell_panel_observed_at,
    datediff(c.malignant_cell_panel_observed_at, cast(p.birth_date as date)) as age_at_malignant_cell_panel_days,

    -- pathologist review: text, date, age
    c.pathology_review_text,
    c.pathology_review_observed_at,
    datediff(c.pathology_review_observed_at, cast(p.birth_date as date)) as age_at_pathology_review_days,

    -- cohort context, spanning the whole CSF history
    c.components_present,
    c.csf_reports_total,
    c.first_csf_result_at,
    datediff(c.first_csf_result_at, cast(p.birth_date as date)) as age_at_first_csf_result_days,
    c.last_csf_result_at,
    datediff(c.last_csf_result_at, cast(p.birth_date as date))  as age_at_last_csf_result_days
from {{ ref('csf_results_latest_by_component') }} c
left join {{ ref('radiant_patient_mrn_list') }} m
    on m.patient_id = c.patient_fhir_id
left join {{ source('radiant_fhir', 'patient') }} p
    on p.id = c.patient_fhir_id
left join {{ ref('int_cbtn_organization_by_mrn') }} r
    on r.mrn = m.mrn
left join {{ ref('pcx_30_organization_ref') }} o
    on o.name = r.organization_name
