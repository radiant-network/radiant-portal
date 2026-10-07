/*
   radiant_data_dev.v_lansky_karnofsky_latest  (VIEW)

   Read surface over radiant_data_dev.lansky_karnofsky_latest that adds
     - mrn and research_id  (from radiant_data_dev.radiant_patient_mrn_list)
     - organization_name / organization_code (for downstream access control)
     - age_at_score_days beside the score timestamp

   CONTAINS PHI: mrn, patient_fhir_id, and a real calendar scored_at timestamp
   side by side with research_id. Internal use only. The grant-guarded surface over
   this view is cbtn_tenant.v_lansky_karnofsky_latest (see
   access_controlled_views/lansky_karnofsky_latest_access_controlled.sql.tmpl); do
   not copy this view into cbtn_tenant unguarded.

   ORGANIZATION RESOLUTION -- required for downstream access control
   organization_name comes from stg_cbtn_enrollment_final (deduped by mrn) and
   organization_code from pcx_30_organization_ref.name -> .code, exactly as the
   seven pcx_30 combined views and v_cbc_latest_results do. This is NOT
   interchangeable with the base table's org_short_code: that is the FHIR source
   vocabulary (chop / seattle / ucsf) while organization_code is the pcx_30 /
   auth.pii_grant vocabulary (CHOP / SCH / BCH). Only 'chop' coincides between the
   two, so keying access control on org_short_code would fail closed for every
   non-CHOP patient.
   Resolves for 1,613 of 1,627 patients: CHOP 1,612, UAB 1.
   pcx_30_organization_ref.name is unique across its 41 rows, so that join cannot
   fan out; the roster CTE dedupes stg_cbtn_enrollment_final (7,157 rows, 7,157
   distinct mrn today -- the dedupe is defensive, not currently load-bearing).

   *** 14 of 1,627 patients resolve to a NULL organization_code. A NULL
   organization_code can never match a pii_grant row, so in any downstream
   access-controlled view those patients fail CLOSED -- permanently de-identified
   even for an authorized caller. That is the safe direction, but it is silent, so
   it is recorded here. ***

   *** THIS COHORT IS EFFECTIVELY CHOP-ONLY. 1,612 of the 1,613 resolved patients
   are CHOP and one is UAB; ZERO resolve to SCH. The only auth.pii_grant row for
   tenant_code 'cbtn' today grants org_code 'SCH', so the tenant-facing view
   returns a fully de-identified projection for every current grant holder. That is
   correct behaviour, not a defect -- but do not read an all-research_id result as
   evidence the grant join is broken. ***

   IDENTIFIER JOIN
   radiant_patient_mrn_list.patient_id IS the patient FHIR id, so it joins directly
   to lansky_karnofsky_latest.patient_fhir_id. Verified unique (2,798 of 2,798
   rows), so the join cannot fan out.

   *** LEFT JOIN, deliberately: 3 of the 1,627 patients have NO row in
   radiant_patient_mrn_list. An inner join would silently drop them. They surface
   here with NULL mrn and NULL research_id, so the gap is visible rather than
   swallowed. Filter on `mrn is not null` if you need the matched subset. ***

   *** 47 OF 1,627 PATIENTS HAVE NO USABLE research_id (36 NULL + 8 empty string
   where an mrn row exists, plus the 3 with no mrn row at all). In the downstream
   de-identified projection patient_id = research_id, so those rows present a
   NULL/blank patient_id to an ungranted caller -- de-identified but also
   unidentifiable, so they cannot be joined to anything. This is a pre-existing
   upstream gap in radiant_patient_mrn_list, not specific to this domain:
   v_cbc_latest_results has the same shape (42 NULL + 9 empty of 2,421). Fix it
   upstream if these patients must be usable de-identified.

   Split by organization_code:
     CHOP           1,612 patients -- all have an mrn, 33 lack a research_id
     (NULL org)        14 patients -- 3 lack an mrn, ALL 14 lack a research_id
     UAB                1 patient  -- complete
   So the two gaps COMPOUND on the 14 fail-closed patients: they can never be
   identified (NULL organization_code blocks the grant join) AND they have no
   research_id, so downstream they surface as a score plus an age with no usable
   identifier of either kind. ***

   AGE IN DAYS
   age_at_score_days = datediff(scored_at, birth_date), i.e. whole days from date of
   birth to the score, matching the age_at_*_days convention used across the pcx_30
   objects. Verified on prod: no negative ages, range 70 to 12,844 days (0.2 to
   35.2 years).

   *** age_at_score_days IS NULL FOR 104 PATIENTS -- exactly the 104 whose scored_at
   is NULL (verified: the two counts match). Unlike the pcx_30 views and
   v_cbc_latest_results, where age_at_*_days is an always-present de-identified
   counterpart to a gated calendar date, here there is no date to derive it from, so
   those rows reach the tenant view with NEITHER a date NOR an age. They still carry
   scale and score. ***

   *** THE AGE IS DERIVED FROM AN ADMINISTRATIVE DATE. scored_at comes from
   observation.issued because both clinical date columns are 0% populated for these
   two scales (see lansky_karnofsky_latest_table.sql). age_at_score_days is
   therefore age-at-result-release, not age-at-assessment. The two are usually close
   but are not the same thing, and no clinical-dated alternative exists. ***

   DOB SOURCE: radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient.birth_date,
   the same source v_cbc_latest_results and the pcx_30 demographics view prefer.
   Present for 1,627 of 1,627 patients here and uniformly 'YYYY-MM-DD' (10 chars),
   so the cast is safe; patient.id is unique so the join cannot fan out. Joined
   LEFT anyway, so a future missing birth_date yields a NULL age rather than
   dropping the patient.

   birth_date itself is NOT projected -- the age column is the point, and this keeps
   one more raw PHI field off the surface. Add it if you need to audit the
   arithmetic.

   scored_at IS UTC (the source 'Z' is stripped, not converted -- see
   lansky_karnofsky_latest_table.sql), so age_at_score_days is computed against a
   UTC wall-clock. At a US site a late-evening UTC timestamp can sit on the next
   local calendar day, which can move the age by one day.
*/

drop view if exists radiant_data_dev.v_lansky_karnofsky_latest;

create view radiant_data_dev.v_lansky_karnofsky_latest as (
    with roster as (
        -- deduped defensively: stg_cbtn_enrollment_final is 1 row per mrn today
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

        -- the score
        c.scale,
        c.score,
        c.scored_at,
        datediff(c.scored_at, cast(p.birth_date as date)) as age_at_score_days,
        c.score_text,

        -- provenance
        c.scale_code,
        c.source_code_text,
        c.component_line,
        c.observation_id,
        c.date_semantic
    from radiant_data_dev.lansky_karnofsky_latest c
    left join radiant_data_dev.radiant_patient_mrn_list m
        on m.patient_id = c.patient_fhir_id
    left join radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient p
        on p.id = c.patient_fhir_id
    left join roster r
        on r.mrn = m.mrn
    left join radiant_data_dev.pcx_30_organization_ref o
        on o.name = r.organization_name
);
