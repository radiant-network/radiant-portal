/*
   cbtn_tenant.v_csf_tumor_analysis_latest  (VIEW, access-controlled)

   Grant-aware read surface over radiant_data_dev.v_csf_tumor_analysis_latest,
   applying the same projection as every other pcx_30 access-controlled view, plus
   one thing none of the others do: it carries FREE CLINICAL TEXT, gated.

   LAYERING:
     radiant_data_dev.csf_tumor_analysis_latest     TABLE, snapshot, PHI
     radiant_data_dev.v_csf_tumor_analysis_latest   VIEW, + mrn/research_id/org/age
     cbtn_tenant.v_csf_tumor_analysis_latest        this view, grant-guarded
   The tenant-facing schema holds NO unguarded PHI for CSF analysis.

   ACCESS MODEL (per row, keyed on organization_code):
     can_read_phi TRUE  -> patient_id = mrn,        timestamps AND free text shown
     can_read_phi FALSE -> patient_id = research_id, timestamps AND free text NULL
   Collapsing the identifier pair into ONE column makes "never show mrn and
   research_id together" structurally impossible rather than policy-dependent.

   NOTE: patient_id deliberately mixes identifier namespaces across rows when a
   caller is granted some organizations but not others. patient_id_type
   discriminates per row.

   ------------------------------------------------------------------------------
   FREE TEXT IS GATED, NOT DROPPED -- the one place this view differs
   ------------------------------------------------------------------------------
   final_diagnosis and result_text are pathology prose that quotes the patient name
   and medical record number verbatim: the specimen label is routinely transcribed
   into the report ('received fresh in a container labeled with the patient's name,
   medical record number and designated "CSF"'). They are therefore treated exactly
   like a calendar timestamp -- shown to a caller with PHI rights for that
   organization, NULL to everyone else.

   CASE WHEN gating on free text is COMPLETE masking, not redaction: the whole
   string is replaced by NULL, so nothing is left to re-identify from. What it
   canNOT do is redact selectively -- there is no partial view of this text. A
   caller either sees the whole report or none of it. If a de-identified consumer
   needs the findings, they get malignant_cells (below), not a scrubbed narrative.

   *** malignant_cells IS DERIVED FROM THE GATED TEXT AND IS SHOWN TO EVERYONE.
   That is deliberate and is the point of the column: it carries the clinical
   ANSWER (positive / suspicious / negative / non_diagnostic) without the prose. It
   is a finding, not an identifier, so it is not PHI -- but it IS an intentional
   information channel out of PHI-bearing text, and should be recognised as such
   rather than mistaken later for a leak. Same reasoning as age_at_*_days standing
   in for a gated calendar date. ***

   *** THIS VIEW GENUINELY RELEASES PHI TODAY -- unlike its Lansky sibling. 190 of
   the 814 patients resolve to organization_code 'SCH', and the only auth.pii_grant
   row for tenant_code 'cbtn' grants 'SCH'. So the current grant holder
   sees mrn, real timestamps AND the full clinical narrative for those 190
   patients. By contrast cbtn_tenant.v_lansky_karnofsky_latest has zero SCH
   patients and returns an all-de-identified result no matter what. Do not carry
   over the assumption that the tenant surface is inert. Verify the grant roster
   before exposing this view. ***

   THE AGES AND THE DERIVED FINDING STAY OPEN, THE TIMESTAMPS AND TEXT DO NOT.
   age_at_latest_analysis_days / age_at_first_analysis_days are the de-identified
   counterparts of the two calendar timestamps, exactly as age_at_*_days pairs with
   a date in the pcx_30 views. Note the ages are exact to the day and reach ~59
   years, so an age plus a known diagnosis is not automatically anonymous -- if the
   release needs HIPAA-style age capping, that belongs here, not downstream.

   Unlike the Lansky view, these ages derive from a genuine CLINICAL date
   (effective_date_time, 100% populated), so they are age-at-analysis rather than
   age-at-result-release, and no row lacks an age.

   patient_fhir_id and latest_report_id are NOT projected. Both are direct FHIR
   resource identifiers that would re-link a de-identified row to the identified
   source and defeat the mrn/research_id separation -- latest_report_id resolves to
   a DiagnosticReport carrying subject_reference. The other access-controlled views
   likewise expose no FHIR ids.

   multi_specimen_report IS projected and should be read alongside
   malignant_cells: 1 means the underlying report covered more than one specimen,
   so the finding may pertain to a non-CSF part and needs confirmation. Suppressing
   that flag while exposing the label would present a reviewable inference as
   settled fact.

   evidence_tier / patient_best_evidence are projected because a consumer cannot
   otherwise tell a CSF analysis named as such from one attributed by its report
   text or by same-day specimen collection. Filter to patient_best_evidence =
   'named' for the strictly defensible subset.

   COLUMN MASKING ONLY -- no row filtering. A caller with zero grants still sees
   every row from every institution, de-identified, with the text hidden.

   FAIL-CLOSED: organization_code comes from stg_cbtn_enrollment_final ->
   pcx_30_organization_ref in the base view. A NULL organization_code cannot match
   phi.org_code, so the row degrades to research_id + NULL timestamps + NULL text
   rather than leaking.
   *** 6 of the 814 patients carry a NULL organization_code and are therefore
   PERMANENTLY de-identified here with their text hidden, even for a caller holding
   every grant. Safe, but silent -- fix the upstream organization_name gap if they
   must be reachable. ***

   *** 13 patients have no usable research_id (NULL or empty upstream in
   radiant_patient_mrn_list). Under the de-identified projection those rows return a
   NULL/blank patient_id -- masked but also unidentifiable, so they cannot be joined
   to anything downstream. Pre-existing upstream gap, not specific to this domain.
   Every one of the 814 DOES have an mrn, so the identified projection is complete. ***

   user_id NOTE: auth.pii_grant.user_id holds portal UUIDs, matched against the
   StarRocks login name via substring_index(substr(current_user(),2),char(39),1).
   A human DBA login holds no grant and always sees the de-identified projection.

   RENDERED FOR TENANT 'cbtn' from
   csf_tumor_analysis_latest_access_controlled.sql.tmpl -- the tenant-code Go template
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

CREATE OR REPLACE VIEW cbtn_tenant.v_csf_tumor_analysis_latest AS
SELECT s.organization_name,
       s.organization_code,
       CASE WHEN s.can_read_phi THEN s.mrn ELSE s.research_id END AS patient_id,
       CASE WHEN s.can_read_phi THEN 'mrn' ELSE 'research_id' END AS patient_id_type,
       s.radiant_patient_id,

       -- provenance of the CSF attribution (open: not PHI, and required to read
       -- the finding honestly)
       s.patient_best_evidence,
       s.evidence_tier,

       -- the latest analysis
       s.latest_test_family,
       s.latest_test_name,
       CASE WHEN s.can_read_phi THEN s.latest_analyzed_at END AS latest_analyzed_at,
       s.age_at_latest_analysis_days,

       -- derived finding: open by design, the de-identified stand-in for the prose
       s.malignant_cells,
       s.multi_specimen_report,

       -- quantitative result: read result_display, the comparator is load-bearing
       -- ('<1.0 ng/mL' is UNDETECTABLE, not a concentration of 1.0)
       s.result_display,
       s.result_value,
       s.result_comparator,
       s.result_unit,

       -- FREE TEXT: gated, quotes patient name + MRN
       CASE WHEN s.can_read_phi THEN s.final_diagnosis END AS final_diagnosis,
       CASE WHEN s.can_read_phi THEN s.result_text END     AS result_text,
       s.result_sections,

       -- cohort context
       s.csf_analyses_total,
       CASE WHEN s.can_read_phi THEN s.first_analyzed_at END AS first_analyzed_at,
       s.age_at_first_analysis_days,
       s.distinct_families,
       s.families_ever,
       s.can_read_phi
FROM (SELECT src.*,
             p.id AS radiant_patient_id,
             (org_grant.org_code IS NOT NULL OR lab_grant.patient_id IS NOT NULL) AS can_read_phi
      FROM radiant_data_dev.v_csf_tumor_analysis_latest src
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
