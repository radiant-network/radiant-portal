/*
   cbtn_tenant.v_pcx_30_patient_level_combined  (VIEW, access-controlled)

   Grant-aware read surface over radiant_data_dev.v_pcx_30_patient_level_combined,
   applying the same projection as every other pcx_30 access-controlled view.

   LAYERING:
     radiant_data_dev.v_pcx_30_patient_level_combined   CONTAINS PHI, internal only
     cbtn_tenant.v_pcx_30_patient_level_combined        this view, grant-guarded
   The tenant-facing schema holds NO unguarded PHI for vital status.

   ACCESS MODEL (per row):
     can_read_phi TRUE  -> patient_id = mrn,        PHI dates shown
     can_read_phi FALSE -> patient_id = research_id, PHI dates NULL
   Collapsing each identified/de-identified pair into ONE column makes "never show
   the identified and de-identified value together" structurally impossible rather
   than policy-dependent.

   can_read_phi is the OR of TWO grant sources:
     1. ORG grant   -- auth.pii_grant.org_code = src.organization_code.
                       The enrolling institution. This is the original, and only,
                       grant path prior to this revision.
     2. LAB grant   -- auth.pii_lab_patient.patient_id = radiant_patient_id.
                       auth.pii_lab_patient is itself DERIVED from auth.pii_grant:
                       it re-reads the same org_code as cases.diagnosis_lab_code and
                       returns that lab's probands PLUS their family members. So this
                       arm grants PHI on a lab-relationship basis and is NOT bounded
                       by src.organization_code -- a lab-granted caller can read PHI
                       for that lab's patients at ANY enrolling institution.
                       Verify this is the intended policy before deploying.

   NOTE: patient_id deliberately mixes identifier namespaces across rows when a
   caller is granted some organizations but not others. patient_id_type
   discriminates per row.

   radiant_patient_id IS DELIBERATELY NOT MASKED -- reviewed and decided 2026-09-30.
   It is projected unconditionally, so an un-granted caller receives it alongside
   research_id, and it is therefore the one column here that does not obey the
   collapse-into-one-column rule above. The decision treats it as a non-identifying
   portal surrogate key. Recorded because it diverges from the three analogous
   identifiers in view_data_dictionary_access_policy.csv (patient_fhir_id,
   subject_reference, observation_id), all of which are "Show for PHI access only"
   and are not projected into the guarded views at all. The residual exposure: the
   key resolves to radiant_jdbc.public.patient, which carries first_name, last_name,
   jhn, date_of_birth and submitter_patient_id -- so it re-links a de-identified row
   for any caller who can also reach that table. Access to the portal catalog is the
   compensating control. To reverse, wrap it in a can_read_phi CASE like the columns
   around it and flip the CSV row to PHI-only.

   CAVEAT -- the other pcx_30 access-controlled views in this directory implement
   the ORG grant only. Until the LAB arm is applied across all of them, a
   lab-granted caller sees mrn here but research_id for the same patient in
   demographics / event_level / surgery / radiation / etc, i.e. patient_id
   disagrees across views for one patient.

   MRN JOIN NORMALIZATION. radiant_jdbc.public.patient.submitter_patient_id is
   zero-padded to a fixed width (all 29 tenant-'cbtn' rows are 8 numeric chars,
   '00...'); src.mrn is unpadded (6, 7 or 4 chars for SCH). A raw equality join
   therefore matched 0 of 960 rows -- which silently left radiant_patient_id NULL
   everywhere AND made the LAB grant arm unreachable, so the widened access model
   would have looked like a no-op in testing and then activated later on its own.
   Both sides are normalized by stripping leading zeros, which is width-agnostic in
   both directions (unlike lpad to a hardcoded 8) and leaves non-numeric ids such
   as SCH's 'R...' series intact. Verified against prod: no collisions introduced
   on either side (29 -> 29 distinct, 960 -> 960 distinct), no LEFT JOIN fan-out
   (960 rows out), 6 of the 29 portal patients resolve. The <> '' guard keeps an
   all-zeros id from collapsing to empty and cross-matching.

   COLUMN MASKING ONLY -- no row filtering. A caller with zero grants still sees
   every row from every institution, de-identified.

   FAIL-CLOSED, two levels. (1) organization_code comes from a LEFT JOIN on the
   41-row pcx_30_organization_ref seed; a NULL organization_code cannot match
   org_grant.org_code. (2) An MRN that does not resolve to a portal patient leaves
   radiant_patient_id NULL, which cannot match lab_grant.patient_id. Either miss
   degrades the row to the de-identified values rather than leaking.

   user_id NOTE: auth.pii_grant.user_id holds portal UUIDs, matched against the
   StarRocks login name via substring_index(substr(current_user(),2),char(39),1).
   A human DBA login holds no grant and always sees the de-identified projection.

   RENDERED FOR TENANT 'cbtn' from
   patient_level_access_controlled.sql.tmpl -- the tenant-code Go template
   placeholder has been substituted, so this file executes as-is. Edit the
   .sql.tmpl and re-render rather than hand-editing this file.
 */

CREATE OR REPLACE VIEW cbtn_tenant.v_pcx_30_patient_level_combined AS
SELECT s.organization_name,
       s.organization_code,
       CASE WHEN s.can_read_phi THEN s.mrn ELSE s.research_id END AS patient_id,
       CASE WHEN s.can_read_phi THEN 'mrn' ELSE 'research_id' END AS patient_id_type,
       s.radiant_patient_id,
       CASE WHEN s.can_read_phi THEN s.vital_status_date END AS vital_status_date,
       s.age_at_vital_status_days,
       s.vital_status,
       s.can_read_phi
FROM (SELECT src.*,
             p.id AS radiant_patient_id,
             (org_grant.org_code IS NOT NULL OR lab_grant.patient_id IS NOT NULL) AS can_read_phi
      FROM radiant_data_dev.v_pcx_30_patient_level_combined src
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
