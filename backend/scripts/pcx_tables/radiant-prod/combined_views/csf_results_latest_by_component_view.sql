/*
   radiant_data_dev.v_csf_results_latest_by_component  (VIEW)

   Read surface over radiant_data_dev.csf_results_latest_by_component that adds
     - mrn and research_id  (from radiant_data_dev.radiant_patient_mrn_list)
     - organization_name / organization_code (for downstream access control)
     - age_at_<component>_days BESIDE EVERY ONE of the 11 component dates

   1,054 patients: 814 with at least one tumour-relevant component + 240 with
   routine chemistry or cell counts only.

   *** EVERY COMPONENT CARRIES ITS OWN DATE AND ITS OWN AGE, because each is
   resolved to ITS OWN most recent result. A patient's protein and their cytology
   routinely come from different lumbar punctures -- of the 544 patients holding
   both, only 334 share a calendar day, and the extremes are 4,567 days (12.5
   years) apart. Never read one row as a single lumbar puncture. Compare the
   *_observed_at pair, or the age pair, before treating two components as
   contemporaneous. ***

   The 11 date/age pairs are:
     protein, glucose, wbc, rbc, cytology, afp, hcg, cea, cell_free_dna,
     malignant_cell_panel, pathology_review
   plus age_at_first_csf_result_days / age_at_last_csf_result_days spanning the
   whole CSF history.

   CONTAINS PHI: mrn and patient_fhir_id and 11 real calendar timestamps side by
   side with research_id, PLUS free-text cytology_final_diagnosis /
   cytology_result_text that quote the patient name and medical record number.
   Internal use only. The grant-guarded surface is
   cbtn_tenant.v_csf_results_latest_by_component, where every date and the free
   text are gated behind can_read_phi while every age stays visible.

   ORGANIZATION RESOLUTION -- required for downstream access control
   organization_name from stg_cbtn_enrollment_final (deduped by mrn),
   organization_code from pcx_30_organization_ref.name -> .code, exactly as the
   pcx_30 combined views and the other latest-result views do. NOT interchangeable
   with the FHIR source vocabulary (chop / seattle / ucsf): organization_code is the
   pcx_30 / auth.pii_grant vocabulary (CHOP / SCH / BCH) and only 'chop' coincides.
   pcx_30_organization_ref.name is unique across its 41 rows so that join cannot fan
   out; the roster CTE dedupes stg_cbtn_enrollment_final.

   IDENTIFIER JOIN
   radiant_patient_mrn_list.patient_id IS the patient FHIR id, joined directly to
   patient_fhir_id. Verified unique (2,798 of 2,798) so it cannot fan out. LEFT
   joined so a missing row surfaces as NULL rather than dropping the patient.

   AGE IN DAYS
   age_at_<component>_days = datediff(<component>_observed_at, birth_date), whole
   days from date of birth, matching the age_at_*_days convention across the pcx_30
   objects. Each age is NULL exactly when its component is NULL -- an absent age
   means the test was not done, not that the age is unknown.

   All 11 ages derive from a genuine CLINICAL date: effective_date_time is 100%
   populated on these reports, so these are age-at-analysis, not the
   age-at-result-release that v_lansky_karnofsky_latest is forced into.

   DOB SOURCE: radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient.birth_date,
   uniformly 'YYYY-MM-DD'; patient.id is unique so the join cannot fan out. LEFT
   joined, so a future missing birth_date yields NULL ages rather than dropping the
   patient. birth_date itself is NOT projected.

   *** READ <component>_display, NOT <component>_value. The comparator is
   load-bearing: protein carries '<' or '>' on 276 observations, glucose on 55, and
   for AFP / hCG it is the majority -- '<1.0 ng/mL' means UNDETECTABLE, not a
   concentration of 1.0. Units are not normalised: cell counts arrive under six
   spellings ('/uL', '/ul', '/µl', '/mm3', 'CUMM', 'x10E6/L') which are all
   numerically equivalent -- verified against the data, not assumed -- so they can
   be compared directly. AFP appears as both 'ng/mL' and 'NG/ML'. ***

   NO group_concat AT READ TIME: cytology_result_text was assembled once when the
   base table was materialised under a raised group_concat_max_len, so this view
   reads a stored string and cannot be silently truncated at 1024 bytes.

   NEVER PUT A SEMICOLON IN A '--' COMMENT IN THIS FILE (fixed 2026-10-02). The
   mysql client splits input on ';' and StarRocks then REJECTS the resulting
   comment-only statement -- 'Unexpected input <EOF>' -- where MySQL server would
   tolerate it. The file therefore failed outright under `mysql < file`, before
   reaching any statement. Because this script opens with `drop view if exists`, a
   failure at the wrong moment leaves the view MISSING, and the dependent
   cbtn_tenant view breaks with it. Two section markers below carried a semicolon
   and now use a comma instead. The inline '--' markers are otherwise fine; it is
   only the ';' character that is unsafe. Running with --skip-comments also avoids
   this, but do not rely on the caller remembering.
*/

drop view if exists radiant_data_dev.v_csf_results_latest_by_component;

create view radiant_data_dev.v_csf_results_latest_by_component as (
    with roster as (
        select mrn, min(organization_name) as organization_name
        from radiant_data_dev.stg_cbtn_enrollment_final
        where nullif(organization_name, '') is not null
        group by mrn
    )

    select
        -- identifier block (identified first, then de-identified)
        c.patient_fhir_id,
        m.mrn,
        m.research_id,

        -- organization (pcx_30 / auth.pii_grant vocabulary)
        r.organization_name,
        o.code as organization_code,

        -- tumour attribution tier, NULL for the 240 routine-only patients
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

        -- cell-free DNA: date, age (send-out, no scalar result returned)
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
    from radiant_data_dev.csf_results_latest_by_component c
    left join radiant_data_dev.radiant_patient_mrn_list m
        on m.patient_id = c.patient_fhir_id
    left join radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient p
        on p.id = c.patient_fhir_id
    left join roster r
        on r.mrn = m.mrn
    left join radiant_data_dev.pcx_30_organization_ref o
        on o.name = r.organization_name
);
