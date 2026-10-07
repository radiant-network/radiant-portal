/*
   cbtn_tenant.v_cbc_latest_results  (VIEW, access-controlled)

   Grant-aware read surface over radiant_data_dev.v_cbc_latest_results, applying
   the same projection as every other pcx_30 access-controlled view.

   LAYERING:
     radiant_data_dev.cbc_latest_results     TABLE, snapshot, CONTAINS PHI
     radiant_data_dev.v_cbc_latest_results   VIEW, + mrn/research_id/ages, PHI
     cbtn_tenant.v_cbc_latest_results        this view, grant-guarded
   The tenant-facing schema holds NO unguarded PHI for CBC results.

   ACCESS MODEL (per row, keyed on organization_code):
     can_read_phi TRUE  -> patient_id = mrn,        *_observed_at shown
     can_read_phi FALSE -> patient_id = research_id, *_observed_at NULL
   Collapsing the identifier pair into ONE column makes "never show mrn and
   research_id together" structurally impossible rather than policy-dependent.

   NOTE: patient_id deliberately mixes identifier namespaces across rows when a
   caller is granted some organizations but not others. patient_id_type
   discriminates per row.

   THE AGES STAY OPEN, THE TIMESTAMPS DO NOT. age_at_<analyte>_days is the
   de-identified counterpart of <analyte>_observed_at, exactly as age_at_*_days
   pairs with a calendar date in the pcx_30 views, so the ages are visible to all
   callers and the four calendar timestamps are gated. Note the ages are exact to
   the day and one is ~59 years, so an age plus a known diagnosis is not
   automatically anonymous -- if the release needs HIPAA-style age capping, that
   belongs here, not downstream.

   patient_fhir_id and subject_reference are NOT projected. They are direct
   patient identifiers that would re-link a de-identified row to the identified
   source and defeat the mrn/research_id separation. The other eight
   access-controlled views likewise expose neither.

   org_short_code is NOT projected either -- it is the FHIR source vocabulary
   (chop / seattle / ucsf), a different namespace from organization_code
   (CHOP / SCH / BCH), and carrying both invites keying access control on the
   wrong one. organization_code is the vocabulary auth.pii_grant uses.

   COLUMN MASKING ONLY -- no row filtering. A caller with zero grants still sees
   every row from every institution, de-identified.

   FAIL-CLOSED: organization_code comes from stg_cbtn_enrollment_final ->
   pcx_30_organization_ref in the base view. A NULL organization_code cannot match
   phi.org_code, so the row degrades to research_id + NULL timestamps rather than
   leaking.
   *** 16 of the 2,421 patients carry a NULL organization_code (14 chop + 2
   seattle: absent from radiant_patient_mrn_list, or no organization_name in
   stg_cbtn_enrollment_final). Those patients are PERMANENTLY de-identified here,
   even for a caller holding every grant. Safe, but silent -- fix the upstream
   organization_name gap if they must be reachable. ***

   user_id NOTE: auth.pii_grant.user_id holds portal UUIDs, matched against the
   StarRocks login name via substring_index(substr(current_user(),2),char(39),1).
   A human DBA login holds no grant and always sees the de-identified projection.

   RENDERED FOR TENANT 'cbtn' from
   cbc_latest_results_access_controlled.sql.tmpl -- the tenant-code Go template
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

CREATE OR REPLACE VIEW cbtn_tenant.v_cbc_latest_results AS
SELECT s.organization_name,
       s.organization_code,
       CASE WHEN s.can_read_phi THEN s.mrn ELSE s.research_id END AS patient_id,
       CASE WHEN s.can_read_phi THEN 'mrn' ELSE 'research_id' END AS patient_id_type,
       s.radiant_patient_id,

       s.wbc_value,
       s.wbc_unit,
       CASE WHEN s.can_read_phi THEN s.wbc_observed_at END AS wbc_observed_at,
       s.age_at_wbc_days,
       s.wbc_loinc,
       s.wbc_source_code_text,

       s.hemoglobin_value,
       s.hemoglobin_unit,
       CASE WHEN s.can_read_phi THEN s.hemoglobin_observed_at END AS hemoglobin_observed_at,
       s.age_at_hemoglobin_days,
       s.hemoglobin_loinc,
       s.hemoglobin_source_code_text,

       s.platelets_value,
       s.platelets_unit,
       CASE WHEN s.can_read_phi THEN s.platelets_observed_at END AS platelets_observed_at,
       s.age_at_platelets_days,
       s.platelets_loinc,
       s.platelets_source_code_text,

       s.anc_value,
       s.anc_unit,
       CASE WHEN s.can_read_phi THEN s.anc_observed_at END AS anc_observed_at,
       s.age_at_anc_days,
       s.anc_loinc,
       s.anc_source_code_text,

       s.analytes_found,
       s.administrative_dates,
       s.can_read_phi
FROM (SELECT src.*,
             p.id AS radiant_patient_id,
             (org_grant.org_code IS NOT NULL OR lab_grant.patient_id IS NOT NULL) AS can_read_phi
      FROM radiant_data_dev.v_cbc_latest_results src
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
