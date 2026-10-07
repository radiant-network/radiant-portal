/*
   radiant_data_dev.v_cbc_latest_results  (VIEW)

   Read surface over radiant_data_dev.cbc_latest_results that adds
     - mrn and research_id  (from radiant_data_dev.radiant_patient_mrn_list)
     - an age in days beside each analyte's observation timestamp

   CONTAINS PHI: mrn, patient_fhir_id, and real calendar *_observed_at timestamps
   side by side with research_id. Internal use only. The grant-guarded surface over
   this view is cbtn_tenant.v_cbc_latest_results (see
   access_controlled_views/cbc_latest_results_access_controlled.sql.tmpl); do not
   copy this view into cbtn_tenant unguarded.

   ORGANIZATION RESOLUTION -- required for downstream access control
   organization_name comes from stg_cbtn_enrollment_final (deduped by mrn) and
   organization_code from pcx_30_organization_ref.name -> .code, exactly as the
   seven pcx_30 combined views do. This is NOT interchangeable with the base
   table's org_short_code: that is the FHIR source vocabulary (chop / seattle /
   ucsf) while organization_code is the pcx_30 / auth.pii_grant vocabulary
   (CHOP / SCH / BCH). Only 'chop' coincides between the two, so keying access
   control on org_short_code would fail closed for every Seattle and UCSF patient.
   Resolves for 2,405 of 2,421 patients: CHOP 1,837, SCH 336, BCH 231, UAB 1.
   pcx_30_organization_ref.name is unique across its 41 rows, so that join cannot
   fan out; the roster CTE dedupes stg_cbtn_enrollment_final, which holds 7,157
   rows for 7,116 distinct research_id.

   *** 16 of 2,421 patients resolve to a NULL organization_code (14 chop + 2
   seattle, i.e. those absent from the mrn list or lacking an organization_name in
   stg). A NULL organization_code can never match a pii_grant row, so in any
   downstream access-controlled view those patients fail CLOSED -- permanently
   de-identified even for an authorized caller. That is the safe direction, but it
   is silent, so it is recorded here. ***

   IDENTIFIER JOIN
   radiant_patient_mrn_list.patient_id IS the patient FHIR id, so it joins directly
   to cbc_latest_results.patient_fhir_id. Verified unique (2,798 of 2,798 rows), so
   the join cannot fan out.

   *** LEFT JOIN, deliberately: 3 of the 2,421 CBC patients have NO row in
   radiant_patient_mrn_list. An inner join would silently drop them. They surface
   here with NULL mrn and NULL research_id, so the gap is visible rather than
   swallowed. Filter on `mrn is not null` if you need the matched subset. ***

   AGE IN DAYS
   age_at_<analyte>_days = datediff(<analyte>_observed_at, birth_date), i.e. whole
   days from date of birth to the observation, matching the age_at_*_days
   convention used across the pcx_30 objects.

   DOB SOURCE: radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient.birth_date.
   Chosen over stg_cbtn_enrollment_final.dob on coverage: FHIR birth_date is
   present for 2,421 of 2,421 CBC patients, stg dob for only 2,369. It is also the
   source the pcx_30 demographics view prefers first. patient.id is unique (2,804
   of 2,804) and birth_date is uniformly 'YYYY-MM-DD' (10 chars), so the cast is
   safe and the join cannot fan out. Joined LEFT anyway, so a future missing
   birth_date yields a NULL age rather than dropping the patient.

   birth_date itself is NOT projected -- the age columns are the point, and this
   keeps one more raw PHI field off the surface. Add it if you need to audit the
   arithmetic.

   The four ages may differ from each other: the underlying table holds the latest
   value per analyte independently, so ~19% of patients have values from different
   draws (see cbc_latest_results_table.sql). Each age therefore corresponds to its
   own analyte's timestamp, not to a single visit.

   NOTE: values are NOT unit-normalized. ANC appears as both '/uL' and 'x10E9/L',
   which differ by 1000x. Every value carries its unit, LOINC code and source
   code_text -- see cbc_latest_results_table.sql for the full explanation.
*/

drop view if exists radiant_data_dev.v_cbc_latest_results;

create view radiant_data_dev.v_cbc_latest_results as (
    with roster as (
        -- deduped: stg_cbtn_enrollment_final has 7,157 rows / 7,116 research_id
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
        c.subject_reference,

        -- organization (pcx_30 / auth.pii_grant vocabulary, not org_short_code)
        r.organization_name,
        o.code as organization_code,
        c.org_short_code,

        -- WBC
        c.wbc_value,
        c.wbc_unit,
        c.wbc_observed_at,
        datediff(c.wbc_observed_at, cast(p.birth_date as date)) as age_at_wbc_days,
        c.wbc_loinc,
        c.wbc_source_code_text,

        -- hemoglobin
        c.hemoglobin_value,
        c.hemoglobin_unit,
        c.hemoglobin_observed_at,
        datediff(c.hemoglobin_observed_at, cast(p.birth_date as date)) as age_at_hemoglobin_days,
        c.hemoglobin_loinc,
        c.hemoglobin_source_code_text,

        -- platelets
        c.platelets_value,
        c.platelets_unit,
        c.platelets_observed_at,
        datediff(c.platelets_observed_at, cast(p.birth_date as date)) as age_at_platelets_days,
        c.platelets_loinc,
        c.platelets_source_code_text,

        -- ANC
        c.anc_value,
        c.anc_unit,
        c.anc_observed_at,
        datediff(c.anc_observed_at, cast(p.birth_date as date)) as age_at_anc_days,
        c.anc_loinc,
        c.anc_source_code_text,

        c.analytes_found,
        c.administrative_dates
    from radiant_data_dev.cbc_latest_results c
    left join radiant_data_dev.radiant_patient_mrn_list m
        on m.patient_id = c.patient_fhir_id
    left join radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient p
        on p.id = c.patient_fhir_id
    left join roster r
        on r.mrn = m.mrn
    left join radiant_data_dev.pcx_30_organization_ref o
        on o.name = r.organization_name
);
