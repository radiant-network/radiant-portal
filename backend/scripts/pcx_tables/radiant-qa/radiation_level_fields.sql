drop table if exists radiant_tests.pcx_30_radiation_level;
drop table if exists radiant_tests.pcx_30_radiation_level_deid;

create table radiant_tests.pcx_30_radiation_level as (
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
        date_add(dob, interval cast(age_at_radiation_start as int) day)
            as radiation_start_date,
        date_add(dob, interval cast(age_at_radiation_stop as int) day)
            as radiation_stop_date,
        radiation_site,
        radiation_site_other,
        radiation_type,
        radiation_type_other,
        total_radiation_dose,
        total_radiation_dose_unit,
        total_radiation_dose_focal,
        total_radiation_dose_focal_unit
    from radiant_tests.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    where radiation = 'Yes'
    order by mrn
);

create table radiant_tests.pcx_30_radiation_level_deid as (
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
        age_at_radiation_start as radiation_start_date,
        age_at_radiation_stop as radiation_stop_date,
        radiation_site,
        radiation_site_other,
        radiation_type,
        radiation_type_other,
        total_radiation_dose,
        total_radiation_dose_unit,
        total_radiation_dose_focal,
        total_radiation_dose_focal_unit
    from radiant_tests.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    where radiation = 'Yes'
    order by research_id
);
