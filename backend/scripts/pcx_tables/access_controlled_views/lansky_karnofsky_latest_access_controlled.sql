/*
   cbtn_tenant.v_lansky_karnofsky_latest  (VIEW, access-controlled)

   Grant-aware read surface over radiant_data_dev.v_lansky_karnofsky_latest,
   applying the same projection as every other pcx_30 access-controlled view.

   LAYERING:
     radiant_data_dev.lansky_karnofsky_latest     TABLE, snapshot, CONTAINS PHI
     radiant_data_dev.v_lansky_karnofsky_latest   VIEW, + mrn/research_id/org/age, PHI
     cbtn_tenant.v_lansky_karnofsky_latest        this view, grant-guarded
   The tenant-facing schema holds NO unguarded PHI for performance status.

   ACCESS MODEL (per row, keyed on organization_code):
     can_read_phi TRUE  -> patient_id = mrn,        scored_at shown
     can_read_phi FALSE -> patient_id = research_id, scored_at NULL
   Collapsing the identifier pair into ONE column makes "never show mrn and
   research_id together" structurally impossible rather than policy-dependent.

   NOTE: patient_id deliberately mixes identifier namespaces across rows when a
   caller is granted some organizations but not others. patient_id_type
   discriminates per row.

   THE AGE STAYS OPEN, THE TIMESTAMP DOES NOT. age_at_score_days is the
   de-identified counterpart of scored_at, exactly as age_at_*_days pairs with a
   calendar date in the pcx_30 views, so the age is visible to all callers and the
   calendar timestamp is gated. Note the age is exact to the day and reaches ~35
   years, so an age plus a known diagnosis is not automatically anonymous -- if the
   release needs HIPAA-style age capping, that belongs here, not downstream.

   *** THE AGE IS ABSENT FOR 104 OF 1,627 ROWS, unlike every other view in this
   directory. scored_at is NULL for those patients (no issued timestamp and no
   encounter_reference upstream, so no date exists at all), and the age is derived
   from scored_at, so those rows carry NEITHER a date NOR an age -- just scale and
   score. A de-identified consumer therefore cannot place them in time by any
   means. They are still returned rather than filtered, so the gap is visible.
   date_semantic = 'undated' marks them explicitly. ***

   *** THE AGE IS DERIVED FROM AN ADMINISTRATIVE DATE. scored_at comes from
   observation.issued because both FHIR clinical date columns are 0% populated for
   these two scales, so age_at_score_days is age-at-result-release, not
   age-at-assessment, and date_semantic = 'administrative' on every dated row. No
   clinical-dated alternative exists for this domain. ***

   patient_fhir_id, subject_reference and observation_id are NOT projected. All
   three are direct FHIR resource identifiers that would re-link a de-identified row
   to the identified source and defeat the mrn/research_id separation --
   observation_id resolves straight back to an observation carrying
   subject_reference. The other access-controlled views likewise expose no FHIR ids.

   org_short_code is NOT projected either -- it is the FHIR source vocabulary
   (chop / seattle / ucsf), a different namespace from organization_code
   (CHOP / SCH / BCH), and carrying both invites keying access control on the
   wrong one. organization_code is the vocabulary auth.pii_grant uses.

   COLUMN MASKING ONLY -- no row filtering. A caller with zero grants still sees
   every row from every institution, de-identified.

   FAIL-CLOSED: organization_code comes from stg_cbtn_enrollment_final ->
   pcx_30_organization_ref in the base view. A NULL organization_code cannot match
   phi.org_code, so the row degrades to research_id + NULL timestamp rather than
   leaking.
   *** 14 of the 1,627 patients carry a NULL organization_code (absent from
   radiant_patient_mrn_list, or no organization_name in stg_cbtn_enrollment_final).
   Those patients are PERMANENTLY de-identified here, even for a caller holding
   every grant. Safe, but silent -- fix the upstream organization_name gap if they
   must be reachable. ***

   *** EXPECT AN ALL-DE-IDENTIFIED RESULT TODAY. This cohort is effectively
   CHOP-only: of the 1,613 patients with a resolved organization_code, 1,612 are
   CHOP and one is UAB; ZERO are SCH. The only auth.pii_grant row for tenant_code
   'cbtn' grants org_code 'SCH', so every current grant holder sees the
   de-identified projection on every row. That is the access model working, NOT a
   broken grant join -- verify against organization_code before concluding
   otherwise. ***

   *** 47 OF 1,627 PATIENTS HAVE NO USABLE research_id (36 NULL + 8 empty upstream
   in radiant_patient_mrn_list, plus 3 with no mrn-list row at all). Under the
   de-identified projection those rows return a NULL or blank patient_id -- masked
   but also unidentifiable, so they cannot be joined to anything downstream. This is
   a pre-existing upstream gap, not specific to this domain (v_cbc_latest_results
   shows 42 NULL + 9 empty of 2,421).

   THE TWO GAPS COMPOUND ON THE 14 FAIL-CLOSED PATIENTS. All 14 of the NULL
   organization_code patients ALSO lack a research_id, so they can never be
   identified (no grant can match a NULL org) and carry no de-identified key either
   -- they surface as a scale + score + age with NO usable patient_id of any kind.
   Measured split: CHOP 1,612 (all have an mrn, 33 lack a research_id) /
   NULL org 14 (3 lack an mrn, all 14 lack a research_id) / UAB 1 (complete). ***

   user_id NOTE: auth.pii_grant.user_id holds portal UUIDs, matched against the
   StarRocks login name via substring_index(substr(current_user(),2),char(39),1).
   A human DBA login holds no grant and always sees the de-identified projection.

   RENDERED FOR TENANT 'cbtn' from
   lansky_karnofsky_latest_access_controlled.sql.tmpl -- the tenant-code Go template
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

CREATE OR REPLACE VIEW cbtn_tenant.v_lansky_karnofsky_latest AS
SELECT s.organization_name,
       s.organization_code,
       CASE WHEN s.can_read_phi THEN s.mrn ELSE s.research_id END AS patient_id,
       CASE WHEN s.can_read_phi THEN 'mrn' ELSE 'research_id' END AS patient_id_type,
       s.radiant_patient_id,

       s.scale,
       s.score,
       CASE WHEN s.can_read_phi THEN s.scored_at END AS scored_at,
       s.age_at_score_days,
       s.score_text,

       s.scale_code,
       s.source_code_text,
       s.component_line,
       s.date_semantic,
       s.can_read_phi
FROM (SELECT src.*,
             p.id AS radiant_patient_id,
             (org_grant.org_code IS NOT NULL OR lab_grant.patient_id IS NOT NULL) AS can_read_phi
      FROM radiant_data_dev.v_lansky_karnofsky_latest src
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
