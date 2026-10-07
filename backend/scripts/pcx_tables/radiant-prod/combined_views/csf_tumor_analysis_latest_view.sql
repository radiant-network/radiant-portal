/*
   radiant_data_dev.v_csf_tumor_analysis_latest  (VIEW)

   Read surface over radiant_data_dev.csf_tumor_analysis_latest that adds
     - mrn and research_id  (from radiant_data_dev.radiant_patient_mrn_list)
     - organization_name / organization_code (for downstream access control)
     - age in days at the latest and first CSF analysis

   CONTAINS PHI, AND MORE OF IT THAN THE OTHER VIEWS IN THIS DIRECTORY: mrn and
   patient_fhir_id and real calendar timestamps side by side with research_id, PLUS
   free-text final_diagnosis and result_text that quote the patient name and medical
   record number verbatim (the specimen label is routinely transcribed into the
   Gross Description). Internal use only. The grant-guarded surface is
   cbtn_tenant.v_csf_tumor_analysis_latest (see
   access_controlled_views/csf_tumor_analysis_latest_access_controlled.sql.tmpl),
   where the free text is GATED behind can_read_phi rather than dropped; do not copy
   this view into cbtn_tenant unguarded.

   ORGANIZATION RESOLUTION -- required for downstream access control
   organization_name comes from stg_cbtn_enrollment_final (deduped by mrn) and
   organization_code from pcx_30_organization_ref.name -> .code, exactly as the
   pcx_30 combined views, v_cbc_latest_results and v_lansky_karnofsky_latest do.
   NOT interchangeable with the FHIR source vocabulary (chop / seattle / ucsf):
   organization_code is the pcx_30 / auth.pii_grant vocabulary (CHOP / SCH / BCH),
   and only 'chop' coincides, so keying access control on the FHIR code would fail
   closed for every non-CHOP patient.
   Resolves for 808 of 814 patients: CHOP 513, SCH 190, BCH 104, UAB 1.
   pcx_30_organization_ref.name is unique across its 41 rows so that join cannot
   fan out; the roster CTE dedupes stg_cbtn_enrollment_final.

   *** THIS COHORT DOES REACH THE CURRENT TENANT GRANT -- unlike the Lansky one.
   190 of these patients resolve to SCH, and the only auth.pii_grant row for tenant
   'cbtn' grants org_code 'SCH'. So the tenant-facing view genuinely exposes
   identified values AND free clinical text for those 190 patients to the current
   grant holder. That is the access model working as designed, but it is a real PHI
   release, not a theoretical one: v_lansky_karnofsky_latest has zero SCH patients
   and therefore never lights up. Confirm the grant roster is correct before use. ***

   *** 6 of 814 patients resolve to a NULL organization_code. A NULL can never match
   a pii_grant row, so downstream those patients fail CLOSED -- permanently
   de-identified with their text hidden, even for a caller holding every grant.
   Safe direction, but silent, so it is recorded here. ***

   IDENTIFIER JOIN
   radiant_patient_mrn_list.patient_id IS the patient FHIR id, so it joins directly
   to csf_tumor_analysis_latest.patient_fhir_id. Verified unique (2,798 of 2,798),
   so the join cannot fan out. Every one of the 814 patients HAS an mrn-list row
   (unlike the CBC and Lansky cohorts, which have 3 each with none), but 13 still
   carry a NULL or empty research_id, so those rows have no usable de-identified
   key. Pre-existing upstream gap. Joined LEFT regardless so a future miss surfaces
   as NULL rather than dropping the patient.

   AGE IN DAYS
   age_at_latest_analysis_days = datediff(latest_analyzed_at, birth_date), and
   age_at_first_analysis_days likewise, matching the age_at_*_days convention across
   the pcx_30 objects. Verified: no negative ages; range 18 to 21,671 days (0.05 to
   59.3 years). Note the upper end -- an exact age of 59 years plus a known
   diagnosis is not automatically anonymous.

   Unlike v_lansky_karnofsky_latest, the age here derives from a genuine CLINICAL
   date: diagnostic_report.effective_date_time is 100% populated for these reports,
   so age_at_*_days is age-at-analysis, not age-at-result-release.

   DOB SOURCE: radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient.birth_date, the
   same source the other views prefer. Present for 814 of 814 and uniformly
   'YYYY-MM-DD', so the cast is safe; patient.id is unique so the join cannot fan
   out. LEFT joined anyway.

   birth_date itself is NOT projected -- the age columns are the point, and this
   keeps one more raw PHI field off the surface.

   NO group_concat AT READ TIME. result_text was assembled once, when the base
   table was materialised, under a raised group_concat_max_len. This view only
   reads the stored string, so it cannot be silently truncated at 1024 bytes the
   way a view containing the assembly would be. That is a deliberate reason to
   materialise rather than layer the whole query as a view.
*/

drop view if exists radiant_data_dev.v_csf_tumor_analysis_latest;

create view radiant_data_dev.v_csf_tumor_analysis_latest as (
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

        -- provenance of the CSF attribution
        c.patient_best_evidence,
        c.evidence_tier,

        -- the latest analysis
        c.latest_test_family,
        c.latest_test_name,
        c.latest_analyzed_at,
        datediff(c.latest_analyzed_at, cast(p.birth_date as date)) as age_at_latest_analysis_days,

        -- derived, de-identification-safe finding
        c.malignant_cells,
        c.multi_specimen_report,

        -- quantitative result (read result_display: the comparator is load-bearing)
        c.result_display,
        c.result_value,
        c.result_comparator,
        c.result_unit,

        -- free text: PHI-bearing, gated downstream
        c.final_diagnosis,
        c.result_text,
        c.result_sections,

        -- cohort context
        c.csf_analyses_total,
        c.first_analyzed_at,
        datediff(c.first_analyzed_at, cast(p.birth_date as date)) as age_at_first_analysis_days,
        c.distinct_families,
        c.families_ever,
        c.latest_report_id
    from radiant_data_dev.csf_tumor_analysis_latest c
    left join radiant_data_dev.radiant_patient_mrn_list m
        on m.patient_id = c.patient_fhir_id
    left join radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient p
        on p.id = c.patient_fhir_id
    left join roster r
        on r.mrn = m.mrn
    left join radiant_data_dev.pcx_30_organization_ref o
        on o.name = r.organization_name
);
