drop table if exists radiant_tests.pcx_30_surgery_level;
drop table if exists radiant_tests.pcx_30_surgery_level_deid;

create table radiant_tests.pcx_30_surgery_level as (
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
        mrn,
        date_add(dob, interval cast(age_at_surgery as int) day) as surgery_date,
        extent_of_tumor_resection
    from radiant_tests.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    where surgery = 'Yes'
);

create table radiant_tests.pcx_30_surgery_level_deid as (
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
        age_at_surgery as surgery_date,
        extent_of_tumor_resection
    from radiant_tests.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    where surgery = 'Yes'
);
