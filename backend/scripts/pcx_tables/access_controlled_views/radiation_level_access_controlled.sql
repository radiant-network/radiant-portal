/*
   cbtn_tenant.v_pcx_30_radiation_level_combined  (VIEW, access-controlled)

   Grant-aware read surface over radiant_data_dev.v_pcx_30_radiation_level_combined,
   applying the same projection as every other pcx_30 access-controlled view.

   LAYERING:
     radiant_data_dev.v_pcx_30_radiation_level_combined   CONTAINS PHI, internal only
     cbtn_tenant.v_pcx_30_radiation_level_combined        this view, grant-guarded
   The tenant-facing schema holds NO unguarded PHI for radiation therapy.

   ACCESS MODEL (per row, keyed on organization_code):
     can_read_phi TRUE  -> patient_id = mrn,        PHI dates shown
     can_read_phi FALSE -> patient_id = research_id, PHI dates NULL
   Collapsing each identified/de-identified pair into ONE column makes "never show
   the identified and de-identified value together" structurally impossible rather
   than policy-dependent.

   NOTE: patient_id deliberately mixes identifier namespaces across rows when a
   caller is granted some organizations but not others. patient_id_type
   discriminates per row.

   Dose / site / modality are clinical measures, not identifiers, so they pass
   through to all callers.

   is_initial_treatment (added 2026-10-01) is a derived clinical flag, not a patient
   identifier and not date-bearing, so it passes through UNMASKED to all callers. It is
   computed from ages in days only, so it exposes no calendar date and does not narrow
   the gated radiation_start_date.

   CAVEAT WORTH REPEATING TO CONSUMERS -- WORST OF THE THREE TREATMENT VIEWS: 'no'
   means "not known to be frontline", not "confirmed not frontline". 89 of 241 'no'
   rows (37%) on the 2026-10-01 build are indeterminate -- 85 because
   age_at_radiation_start is 'Not Available'/'Not Reported' (cast -> NULL), 4 with no
   usable initial-diagnosis anchor. Roughly one 'no' in three is an unavailable START
   DATE read as a clinical negative. See the base view header for the measured split.

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
   radiation_level_access_controlled.sql.tmpl -- the tenant-code Go template
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

CREATE OR REPLACE VIEW cbtn_tenant.v_pcx_30_radiation_level_combined AS
SELECT s.organization_name,
       s.organization_code,
       CASE WHEN s.can_read_phi THEN s.mrn ELSE s.research_id END AS patient_id,
       CASE WHEN s.can_read_phi THEN 'mrn' ELSE 'research_id' END AS patient_id_type,
       s.radiant_patient_id,
       CASE WHEN s.can_read_phi THEN s.radiation_start_date END AS radiation_start_date,
       s.age_at_radiation_start_days,
       CASE WHEN s.can_read_phi THEN s.radiation_stop_date END AS radiation_stop_date,
       s.age_at_radiation_stop_days,
       s.radiation_site,
       s.radiation_site_other,
       s.radiation_type,
       s.radiation_type_other,
       s.total_radiation_dose,
       s.total_radiation_dose_unit,
       s.total_radiation_dose_focal,
       s.total_radiation_dose_focal_unit,
       s.is_initial_treatment,
       s.can_read_phi
FROM (SELECT src.*,
             p.id AS radiant_patient_id,
             (org_grant.org_code IS NOT NULL OR lab_grant.patient_id IS NOT NULL) AS can_read_phi
      FROM radiant_data_dev.v_pcx_30_radiation_level_combined src
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
