-- event_level_fields.sql  (QA / radiant_tests)
--
-- KNOWN GAP vs PROD -- the OpenPedCan diagnosis upgrade is NOT implemented here,
-- and CANNOT be until an openpedcan table exists on this cluster.
--
-- Prod builds these two tables from radiant-prod/event_level_fields_openpedcan_prod.sql
-- (2026-10-05), which replaces an '%NOS or NEC%' cns_integrated_diagnosis with a
-- more specific molecular subtype from
-- radiant_data_dev.openpedcan_histologies_annotated and publishes an extra
-- cns_integrated_diagnosis_source column ('CBTN' | 'OpenPedCan'). On prod that
-- upgrades 187 of 1856 rows.
--
-- Why it is absent rather than merely pending: verified 2026-10-05 that the QA
-- cluster (star-rocks-qa.radiant-tst.d3b.io) has ZERO tables matching
-- '%openpedcan%' in ANY schema. The table exists only in radiant_data_dev on the
-- prod cluster. The join key is NOT the blocker -- radiant_tests.diagnosis does
-- carry sample_subject_name -- so this becomes a straight port the moment an
-- openpedcan table is loaded into radiant_tests.
--
-- CONSEQUENCES while the gap stands:
--   * radiant_tests.pcx_30_event_level_deid has 11 columns; the prod table has 12.
--     Anything comparing QA to prod column-by-column will see the extra column.
--   * QA keeps the un-upgraded NOS/NEC values. 860 'Medulloblastoma, NOS or NEC'
--     and 332 'ATRT, NOS or NEC' rows here are candidates the prod rule would
--     narrow (the QA cohort is larger than prod's, so these are not the same
--     counts as prod's pre-upgrade figures).
--   * Do NOT add a constant cns_integrated_diagnosis_source = 'CBTN' column here
--     to force the shapes to match. It would assert that CBTN was consulted and
--     won, when in fact no upgrade was ever attempted.
--
-- Full rule, allowlist and the 12 measured caveats:
-- radiant-prod/event_level_fields_openpedcan_prod.sql

drop table if exists radiant_tests.pcx_30_event_level;
drop table if exists radiant_tests.pcx_30_event_level_deid;

create table radiant_tests.pcx_30_event_level as (
    with subj as (
        select distinct subject, cns_diagnosis_category
        from radiant_tests.diagnosis
        where
            cns_diagnosis_category in (
                'Atypical teratoid/rhabdoid tumor', 'Medulloblastoma'
            )
--            and coordinating_institution in (
--                'The Children''s Hospital of Philadelphia',
--                'Seattle Children''s Hospital',
--                'UCSF Benioff Children''s Hospital'
--            )
    ),

    pt_roster as (
        select
            stg_cbtn_enrollment_final.mrn,
            research_id,
            cast(dob as date) as dob,
            organization_name,
            subj.cns_diagnosis_category as diagnosis_type_cohort,
            case when radiant_patient_mrn_list.mrn is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
        from radiant_tests.stg_cbtn_enrollment_final
        left join
            radiant_tests.radiant_patient_mrn_list
            on stg_cbtn_enrollment_final.mrn = radiant_patient_mrn_list.mrn
        inner join subj on subj.subject=stg_cbtn_enrollment_final.research_id
    ),

    prelim as (
        select distinct
            organization_name,
            mrn,
            dob,
            event_type,
            min(age_at_event_days) as event_date,
            coalesce(
                group_concat(
                    distinct case
                        when metastasis = 'Yes' then metastasis
                    end separator ';'
                ),
                'No'
            ) as metastasis,
            coalesce(
                group_concat(
                    distinct case
                        when metastasis = 'Yes' then metastasis_location
                    end separator ';'
                ),
                'Not Applicable'
            ) as metastasis_location,
            coalesce(
                group_concat(
                    distinct case
                        when
                            metastasis_location = 'Other'
                            then metastasis_location_other
                    end separator ';'
                ),
                'Not Applicable'
            ) as metastasis_location_other,
            cns_diagnosis_category,
            cns_integrated_diagnosis,
            array_join(
                array_unique_agg(
                    array_map(x -> trim(x), split(tumor_locations, ';'))
                ),
                ';'
            ) as tumor_locations,
            coalesce(
                group_concat(
                    distinct case
                        when
                            tumor_location_other <> 'Not Applicable'
                            then tumor_location_other
                    end separator ';'
                ),
                'Not Applicable'
            ) as tumor_location_other
        from radiant_tests.diagnosis
        inner join pt_roster on diagnosis.subject = pt_roster.research_id
        where
            research_study_name = 'CBTN'
            and event_type = 'Initial CNS Tumor'
            and cns_diagnosis_category in (
                'Atypical teratoid/rhabdoid tumor', 'Medulloblastoma'
            )
        group by
            organization_name, mrn, dob, event_type,
            cns_diagnosis_category, cns_integrated_diagnosis

        union distinct

        select
            organization_name,
            mrn,
            dob,
            event_type,
            age_at_event_days as event_date,
            metastasis,
            metastasis_location,
            metastasis_location_other,
            cns_diagnosis_category,
            cns_integrated_diagnosis,
            tumor_locations,
            tumor_location_other
        from radiant_tests.diagnosis
        inner join pt_roster on diagnosis.subject = pt_roster.research_id
        where
            research_study_name = 'CBTN'
            and event_type <> 'Initial CNS Tumor'
        order by mrn, cast(event_date as int)
    )

    select
        organization_name,
        mrn,
        event_type,
        date_add(dob, interval cast(event_date as int) day) as event_date,
        metastasis,
        metastasis_location,
        metastasis_location_other,
        cns_diagnosis_category,
        cns_integrated_diagnosis,
        tumor_locations,
        tumor_location_other
    from prelim


);


create table radiant_tests.pcx_30_event_level_deid as (

    with subj as (
        select distinct subject, cns_diagnosis_category
        from radiant_tests.diagnosis
        where
            cns_diagnosis_category in (
                'Atypical teratoid/rhabdoid tumor', 'Medulloblastoma'
            )
--            and coordinating_institution in (
--                'The Children''s Hospital of Philadelphia',
--                'Seattle Children''s Hospital',
--                'UCSF Benioff Children''s Hospital'
--            )
    ),

    pt_roster as (
        select
            stg_cbtn_enrollment_final.mrn,
            research_id,
            cast(dob as date) as dob,
            organization_name,
            subj.cns_diagnosis_category as diagnosis_type_cohort,
            case when radiant_patient_mrn_list.mrn is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
        from radiant_tests.stg_cbtn_enrollment_final
        left join
            radiant_tests.radiant_patient_mrn_list
            on stg_cbtn_enrollment_final.mrn = radiant_patient_mrn_list.mrn
        inner join subj on subj.subject=stg_cbtn_enrollment_final.research_id
    )

    select distinct
        organization_name,
        research_id,
        event_type,
        min(age_at_event_days) as event_date,
        coalesce(
            group_concat(
                distinct case
                    when metastasis = 'Yes' then metastasis
                end separator ';'
            ),
            'No'
        ) as metastasis,
        coalesce(
            group_concat(
                distinct case
                    when metastasis = 'Yes' then metastasis_location
                end separator ';'
            ),
            'Not Applicable'
        ) as metastasis_location,
        coalesce(
            group_concat(
                distinct case
                    when
                        metastasis_location = 'Other'
                        then metastasis_location_other
                end separator ';'
            ),
            'Not Applicable'
        ) as metastasis_location_other,
        cns_diagnosis_category,
        cns_integrated_diagnosis,
        array_join(
            array_unique_agg(
                array_map(x -> trim(x), split(tumor_locations, ';'))
            ),
            ';'
        ) as tumor_locations,
        coalesce(
            group_concat(
                distinct case
                    when
                        tumor_location_other <> 'Not Applicable'
                        then tumor_location_other
                end separator ';'
            ),
            'Not Applicable'
        ) as tumor_location_other
    from radiant_tests.diagnosis
    inner join pt_roster on diagnosis.subject = pt_roster.research_id
    where
        research_study_name = 'CBTN'
        and event_type = 'Initial CNS Tumor'
        and cns_diagnosis_category in (
            'Atypical teratoid/rhabdoid tumor', 'Medulloblastoma'
        )
    group by
        organization_name, research_id, event_type,
        cns_diagnosis_category, cns_integrated_diagnosis

    union distinct

    select
        organization_name,
        research_id,
        event_type,
        age_at_event_days as event_date,
        metastasis,
        metastasis_location,
        metastasis_location_other,
        cns_diagnosis_category,
        cns_integrated_diagnosis,
        tumor_locations,
        tumor_location_other
    from radiant_tests.diagnosis
    inner join pt_roster on diagnosis.subject = pt_roster.research_id
    where
        research_study_name = 'CBTN'
        and event_type <> 'Initial CNS Tumor'
    order by research_id, cast(event_date as int)
);
