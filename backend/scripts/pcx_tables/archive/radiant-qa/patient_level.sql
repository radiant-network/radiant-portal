drop table if exists radiant_tests.pcx_30_patient_level;
drop table if exists radiant_tests.pcx_30_patient_level_deid;

create table radiant_tests.pcx_30_patient_level as (
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

    no_update as (
        select *
        from pt_roster
        where research_id not in (select subject from radiant_tests.updates)
    ),

    deceased_dx as (
        select distinct
            mrn,
            date_add(
                dob,
                interval cast(
                    case
                        when age_at_event_days = -1 then null else
                            age_at_event_days
                    end as int
                ) day
            ) as vital_status_date,
            'deceased' as vital_status
        from radiant_tests.diagnosis
        inner join pt_roster on diagnosis.subject = pt_roster.research_id
        where diagnosis.event_type = 'Deceased'
        order by mrn
    )

    select *
    from deceased_dx

    union distinct

    select
        mrn,
        max(date_add(dob, interval cast(date_of_visit_follow_up as int) day)),
        lower(clinical_status)
    from radiant_tests.updates
    inner join pt_roster on updates.subject = pt_roster.research_id
    where
        clinical_status <> 'Not Reported'
        and date_of_visit_follow_up <> 'Not Reported'
        and mrn not in (select mrn from deceased_dx)
    group by mrn, clinical_status

    union distinct

    select distinct
        mrn,
        max(
            date_add(
                dob,
                interval cast(
                    case
                        when age_at_event_days = -1 then null else
                            age_at_event_days
                    end as int
                ) day
            )
        ) as vital_status_date,
        'alive' as vital_status
    from radiant_tests.diagnosis
    inner join no_update on diagnosis.subject = no_update.research_id
    where
        diagnosis.event_type <> 'Unavailable'
        and mrn not in (select mrn from deceased_dx)
    group by mrn
    order by mrn

);

create table radiant_tests.pcx_30_patient_level_deid as (
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

    no_update as (
        select *
        from pt_roster
        where research_id not in (select subject from radiant_tests.updates)
    ),

    deceased_dx as (
        select distinct
            research_id,
            case
                when age_at_event_days = -1 then null else age_at_event_days
            end as vital_status_date,
            'deceased' as vital_status
        from radiant_tests.diagnosis
        inner join pt_roster on diagnosis.subject = pt_roster.research_id
        where diagnosis.event_type = 'Deceased'
        order by research_id
    )

    select *
    from deceased_dx

    union distinct

    select
        research_id,
        max(cast(date_of_visit_follow_up as int)),
        lower(clinical_status)
    from radiant_tests.updates
    inner join pt_roster on updates.subject = pt_roster.research_id
    where
        clinical_status <> 'Not Reported'
        and date_of_visit_follow_up <> 'Not Reported'
        and research_id not in (select research_id from deceased_dx)
    group by research_id, clinical_status

    union distinct

    select distinct
        research_id,
        max(
            cast(
                case
                    when age_at_event_days = -1 then null else age_at_event_days
                end as int
            )
        ) as vital_status_date,
        'alive' as vital_status
    from radiant_tests.diagnosis
    inner join no_update on diagnosis.subject = no_update.research_id
    where
        diagnosis.event_type <> 'Unavailable'
        and research_id not in (select research_id from deceased_dx)
    group by research_id
    order by research_id


);
