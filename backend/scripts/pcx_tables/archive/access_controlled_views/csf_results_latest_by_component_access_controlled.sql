/*
   cbtn_tenant.v_csf_results_latest_by_component  (VIEW, access-controlled)

   Grant-aware read surface over radiant_data_dev.v_csf_results_latest_by_component.
   1,054 patients: 814 with at least one tumour-relevant CSF component + 240 with
   routine chemistry or cell counts only.

   LAYERING:
     radiant_data_dev.csf_results_latest_by_component     TABLE, snapshot, PHI
     radiant_data_dev.v_csf_results_latest_by_component   VIEW, + mrn/org/11 ages
     cbtn_tenant.v_csf_results_latest_by_component        this view, grant-guarded

   ACCESS MODEL (per row, keyed on organization_code):
     can_read_phi TRUE  -> patient_id = mrn,        all 13 dates AND free text shown
     can_read_phi FALSE -> patient_id = research_id, all 13 dates AND free text NULL
   Collapsing the identifier pair into ONE column makes "never show mrn and
   research_id together" structurally impossible rather than policy-dependent.

   NOTE: patient_id deliberately mixes identifier namespaces across rows when a
   caller is granted some organizations but not others. patient_id_type
   discriminates per row.

   ------------------------------------------------------------------------------
   EVERY COMPONENT HAS A GATED DATE AND AN OPEN AGE
   ------------------------------------------------------------------------------
   Eleven components each carry their own timestamp and their own age in days, plus
   the first/last span over the whole CSF history -- 13 gated dates, 13 open ages:
     protein, glucose, wbc, rbc, cytology, afp, hcg, cea, cell_free_dna,
     malignant_cell_panel, pathology_review, first_csf_result, last_csf_result
   age_at_<component>_days is the de-identified counterpart of
   <component>_observed_at, exactly as age_at_*_days pairs with a calendar date in
   the pcx_30 views. Each age is NULL precisely when its component is absent, so a
   NULL age means the test was not done, not that the age is unknown.

   *** EACH COMPONENT IS ITS OWN LATEST -- A ROW IS NOT ONE LUMBAR PUNCTURE.
   A patient's protein and their cytology routinely come from different punctures:
   of the 544 holding both, only 334 share a day and the extremes are 4,567 days
   (12.5 years) apart. A de-identified caller can still detect this WITHOUT the
   dates, by comparing the age pair -- that is a further reason the ages stay open.
   Do not aggregate across components as though they were contemporaneous. ***

   The ages are exact to the day and reach ~59 years, so an age plus a known
   diagnosis is not automatically anonymous -- if the release needs HIPAA-style age
   capping, that belongs here, not downstream.

   ------------------------------------------------------------------------------
   FREE TEXT IS GATED, NOT DROPPED
   ------------------------------------------------------------------------------
   cytology_final_diagnosis, cytology_result_text and pathology_review_text are
   pathology prose that quotes the patient name and medical record number verbatim
   (the specimen label is transcribed into the report). They are treated exactly
   like a calendar timestamp: shown to a caller with PHI rights for that
   organization, NULL to everyone else. CASE WHEN gating on free text is COMPLETE
   masking, not redaction -- the whole string becomes NULL, and there is no partial
   view. A caller sees the whole report or none of it.

   *** malignant_cells IS DERIVED FROM THE GATED TEXT AND IS SHOWN TO EVERYONE.
   Deliberate, and the point of the column: it carries the clinical ANSWER
   (positive / suspicious / negative / non_diagnostic) without the prose. A finding,
   not an identifier, so not PHI -- but it IS an intentional information channel out
   of PHI-bearing text and should be recognised as such rather than mistaken later
   for a leak. Same reasoning as an age standing in for a gated date. ***
   multi_specimen_report ships beside it: 1 means the report covered more than one
   specimen, so the finding may pertain to a non-CSF part. Showing the label while
   suppressing that flag would present a reviewable inference as settled fact.

   *** READ <component>_display, NOT <component>_value. The comparator is
   load-bearing -- protein carries '<' or '>' on 276 observations, glucose on 55,
   and for AFP / hCG it is the majority: '<1.0 ng/mL' means UNDETECTABLE, not a
   concentration of 1.0. Cell counts arrive under six numerically equivalent unit
   spellings ('/uL', '/ul', '/µl', '/mm3', 'CUMM', 'x10E6/L'), verified equivalent
   against the data. ***

   patient_fhir_id is NOT projected -- a direct patient identifier that would
   re-link a de-identified row to the identified FHIR source. The other
   access-controlled views likewise expose no FHIR ids.

   patient_best_evidence and cytology_evidence_tier ARE projected: a consumer cannot
   otherwise tell a CSF analysis named as such from one attributed by its report
   text or by same-day specimen collection. NULL patient_best_evidence marks the 240
   routine-only patients. Filter to 'named' for the strictly defensible subset.

   COLUMN MASKING ONLY -- no row filtering. A caller with zero grants still sees
   every row from every institution, de-identified, with all dates and text hidden.

   FAIL-CLOSED: organization_code comes from stg_cbtn_enrollment_final ->
   pcx_30_organization_ref in the base view. A NULL cannot match phi.org_code, so
   the row degrades to research_id + NULL dates + NULL text rather than leaking.

   *** THIS VIEW GENUINELY RELEASES PHI TODAY. A substantial share of these patients
   resolve to organization_code 'SCH', and the only auth.pii_grant row for
   tenant_code 'cbtn' grants 'SCH', so the current grant holder sees mrn,
   real dates and full clinical narratives for them. Verify the grant roster before
   exposing this view. ***

   user_id NOTE: auth.pii_grant.user_id holds portal UUIDs, matched against the
   StarRocks login name via substring_index(substr(current_user(),2),char(39),1).
   A human DBA login holds no grant and always sees the de-identified projection.

   RENDERED FOR TENANT 'cbtn' from
   csf_results_latest_by_component_access_controlled.sql.tmpl -- the tenant-code Go template
   placeholder has been substituted, so this file executes as-is. Edit the
   .sql.tmpl and re-render rather than hand-editing this file.

   radiant_patient_id (added 2026-09-30). Portal surrogate patient key
   (radiant_jdbc.public.patient.id), joined on organization_code plus MRN with
   leading zeros stripped from BOTH sides -- the portal zero-pads to a fixed width
   and pcx_30 does not, so a raw equality join matches nothing. NULL when the
   patient has no portal record, which is the common case today (the portal holds
   cbtn patients for SCH only). DELIBERATELY NOT MASKED: projected to every caller,
   treated as a non-identifying surrogate. This diverges from patient_fhir_id /
   subject_reference / observation_id, which are PHI-only and not projected here at
   all; the key does resolve to a portal record carrying name, date of birth and
   MRN, so portal-catalog access is the compensating control.

   can_read_phi is the OR of TWO grant sources (widened 2026-09-30): the original
   ORG grant (auth.pii_grant.org_code = src.organization_code) and a LAB grant
   (auth.pii_lab_patient.patient_id = radiant_patient_id). auth.pii_lab_patient is
   DERIVED from auth.pii_grant: it re-reads the same org_code as
   cases.diagnosis_lab_code and returns that lab's probands PLUS their family
   members, so it is NOT bounded by src.organization_code -- a lab-granted caller
   can read PHI for that lab's patients at ANY enrolling institution. Inert while
   radiant_jdbc.public.cases holds no rows for this tenant; it activates on its own
   once that table is seeded, with no further change to this view.

   FAIL-CLOSED on both new paths: a NULL organization_code cannot match
   org_grant.org_code, and an MRN that does not resolve to a portal patient leaves
   radiant_patient_id NULL, which cannot match lab_grant.patient_id. Either miss
   degrades the row to the de-identified values.
 */

CREATE OR REPLACE VIEW cbtn_tenant.v_csf_results_latest_by_component AS
SELECT s.organization_name,
       s.organization_code,
       CASE WHEN s.can_read_phi THEN s.mrn ELSE s.research_id END AS patient_id,
       CASE WHEN s.can_read_phi THEN 'mrn' ELSE 'research_id' END AS patient_id_type,
       s.radiant_patient_id,
       s.patient_best_evidence,
       s.protein_display,
       s.protein_value,
       s.protein_comparator,
       s.protein_unit,
       CASE WHEN s.can_read_phi THEN s.protein_observed_at END AS protein_observed_at,
       s.age_at_protein_days,
       s.protein_source_code_text,
       s.glucose_display,
       s.glucose_value,
       s.glucose_comparator,
       s.glucose_unit,
       CASE WHEN s.can_read_phi THEN s.glucose_observed_at END AS glucose_observed_at,
       s.age_at_glucose_days,
       s.glucose_source_code_text,
       s.wbc_display,
       s.wbc_value,
       s.wbc_unit,
       CASE WHEN s.can_read_phi THEN s.wbc_observed_at END AS wbc_observed_at,
       s.age_at_wbc_days,
       s.wbc_source_code_text,
       s.rbc_display,
       s.rbc_value,
       s.rbc_unit,
       CASE WHEN s.can_read_phi THEN s.rbc_observed_at END AS rbc_observed_at,
       s.age_at_rbc_days,
       s.rbc_source_code_text,
       s.cytology_evidence_tier,
       s.cytology_test_name,
       s.malignant_cells,
       s.multi_specimen_report,
       CASE WHEN s.can_read_phi THEN s.cytology_final_diagnosis END AS cytology_final_diagnosis,
       CASE WHEN s.can_read_phi THEN s.cytology_result_text END AS cytology_result_text,
       CASE WHEN s.can_read_phi THEN s.cytology_observed_at END AS cytology_observed_at,
       s.age_at_cytology_days,
       s.afp_display,
       s.afp_value,
       s.afp_comparator,
       s.afp_unit,
       CASE WHEN s.can_read_phi THEN s.afp_observed_at END AS afp_observed_at,
       s.age_at_afp_days,
       s.hcg_display,
       s.hcg_value,
       s.hcg_comparator,
       s.hcg_unit,
       CASE WHEN s.can_read_phi THEN s.hcg_observed_at END AS hcg_observed_at,
       s.age_at_hcg_days,
       s.cea_display,
       CASE WHEN s.can_read_phi THEN s.cea_observed_at END AS cea_observed_at,
       s.age_at_cea_days,
       CASE WHEN s.can_read_phi THEN s.cell_free_dna_observed_at END AS cell_free_dna_observed_at,
       s.age_at_cell_free_dna_days,
       CASE WHEN s.can_read_phi THEN s.malignant_cell_panel_observed_at END AS malignant_cell_panel_observed_at,
       s.age_at_malignant_cell_panel_days,
       CASE WHEN s.can_read_phi THEN s.pathology_review_text END AS pathology_review_text,
       CASE WHEN s.can_read_phi THEN s.pathology_review_observed_at END AS pathology_review_observed_at,
       s.age_at_pathology_review_days,
       s.components_present,
       s.csf_reports_total,
       CASE WHEN s.can_read_phi THEN s.first_csf_result_at END AS first_csf_result_at,
       s.age_at_first_csf_result_days,
       CASE WHEN s.can_read_phi THEN s.last_csf_result_at END AS last_csf_result_at,
       s.age_at_last_csf_result_days,
       s.can_read_phi
FROM (SELECT src.*,
             p.id AS radiant_patient_id,
             (org_grant.org_code IS NOT NULL OR lab_grant.patient_id IS NOT NULL) AS can_read_phi
      FROM radiant_data_dev.v_csf_results_latest_by_component src
      LEFT JOIN radiant_jdbc.public.patient p
        ON p.tenant_code = 'cbtn'
       AND p.organization_code = src.organization_code
       AND p.submitter_patient_id_type = 'mrn'
       AND regexp_replace(src.mrn, '^0+', '') <> ''
       AND regexp_replace(p.submitter_patient_id, '^0+', '')
           = regexp_replace(src.mrn, '^0+', '')
      LEFT JOIN (SELECT DISTINCT org_code FROM auth.pii_grant
                 WHERE user_id = substring_index(substr(current_user(), 2), char(39), 1)
                   AND tenant_code = 'cbtn') org_grant
        ON org_grant.org_code = src.organization_code
      LEFT JOIN (SELECT DISTINCT patient_id FROM auth.pii_lab_patient
                 WHERE user_id = substring_index(substr(current_user(), 2), char(39), 1)
                   AND tenant_code = 'cbtn') lab_grant
        ON lab_grant.patient_id = p.id) s
