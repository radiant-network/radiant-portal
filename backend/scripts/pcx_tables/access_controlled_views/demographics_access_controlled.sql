/*
   cbtn_tenant.v_pcx_30_demographics_combined  (VIEW, access-controlled)

   Grant-aware read surface over radiant_data_dev.v_pcx_30_demographics_combined,
   applying the same projection as every other pcx_30 access-controlled view.

   LAYERING:
     radiant_data_dev.v_pcx_30_demographics_combined   CONTAINS PHI, internal only
     cbtn_tenant.v_pcx_30_demographics_combined        this view, grant-guarded
   The tenant-facing schema holds NO unguarded PHI for demographics.

   ACCESS MODEL (per row, keyed on organization_code):
     can_read_phi TRUE  -> patient_id = mrn,        PHI dates shown
     can_read_phi FALSE -> patient_id = research_id, PHI dates NULL
   Collapsing each identified/de-identified pair into ONE column makes "never show
   the identified and de-identified value together" structurally impossible rather
   than policy-dependent.

   NOTE: patient_id deliberately mixes identifier namespaces across rows when a
   caller is granted some organizations but not others. patient_id_type
   discriminates per row.

   THREE extra pairs beyond the identifier pair collapse the same way:
     given_name / given_name_deid, family_name / family_name_deid,
     address_postal_code / address_postal_code_deid.
   This also CLOSES a leak in the base view: given_name_deid and family_name_deid
   are built as concat(research_id, '_given_name'), so the unguarded base exposes
   research_id beside mrn. Collapsing each pair means a PHI caller sees the real
   name and mrn with no research_id anywhere, and a non-PHI caller sees the
   placeholder and research_id with no mrn.
   birth_date / birth_year do NOT collapse -- they are not interchangeable (full
   date vs year only), so birth_date is gated to NULL and birth_year always shows.

   COLUMN MASKING ONLY -- no row filtering. A caller with zero grants still sees
   every row from every institution, de-identified.

   FAIL-CLOSED: organization_code comes from a LEFT JOIN on the 41-row
   pcx_30_organization_ref seed. A NULL organization_code cannot match
   phi.org_code, so the row degrades to the de-identified values rather than
   leaking.

   user_id NOTE: auth.pii_grant.user_id holds portal UUIDs, matched against the
   StarRocks login name via substring_index(substr(current_user(),2),char(39),1).
   A human DBA login holds no grant and always sees the de-identified projection.

   RENDERED FOR TENANT 'cbtn' from
   demographics_access_controlled.sql.tmpl -- the tenant-code Go template
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

CREATE OR REPLACE VIEW cbtn_tenant.v_pcx_30_demographics_combined AS
SELECT s.organization_name,
       s.organization_code,
       CASE WHEN s.can_read_phi THEN s.mrn ELSE s.research_id END AS patient_id,
       CASE WHEN s.can_read_phi THEN 'mrn' ELSE 'research_id' END AS patient_id_type,
       s.radiant_patient_id,
       CASE WHEN s.can_read_phi THEN s.given_name ELSE s.given_name_deid END AS given_name,
       CASE WHEN s.can_read_phi THEN s.family_name ELSE s.family_name_deid END AS family_name,
       CASE WHEN s.can_read_phi THEN s.birth_date END AS birth_date,
       s.birth_year,
       s.race,
       s.ethnicity,
       s.gender,
       CASE WHEN s.can_read_phi THEN s.address_postal_code ELSE s.address_postal_code_deid END AS address_postal_code,
       s.diagnosis_type_cohort,
       s.data_type_cohort,
       s.can_read_phi
FROM (SELECT src.*,
             p.id AS radiant_patient_id,
             (org_grant.org_code IS NOT NULL OR lab_grant.patient_id IS NOT NULL) AS can_read_phi
      FROM radiant_data_dev.v_pcx_30_demographics_combined src
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
