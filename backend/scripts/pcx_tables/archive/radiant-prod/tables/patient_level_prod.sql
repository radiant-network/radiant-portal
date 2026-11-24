drop table if exists radiant_data_dev.pcx_30_patient_level;
drop table if exists radiant_data_dev.pcx_30_patient_level_deid;

create table radiant_data_dev.pcx_30_patient_level as (
with subj as (
    select distinct subject, cns_diagnosis_category
    from radiant_data_dev.diagnosis
    where cns_diagnosis_category in ('Atypical teratoid/rhabdoid tumor', 'Medulloblastoma')
),    

pt_roster as (
    select
        stg_cbtn_enrollment_final.mrn,
        stg_cbtn_enrollment_final.research_id,
        cast(dob as date) as dob,
        organization_name,
        subj.cns_diagnosis_category as diagnosis_type_cohort,
        case when radiant_patient_mrn_list.mrn is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
    from radiant_data_dev.stg_cbtn_enrollment_final
    left join radiant_data_dev.radiant_patient_mrn_list
        on stg_cbtn_enrollment_final.mrn = radiant_patient_mrn_list.mrn
    inner join subj 
        on subj.subject = stg_cbtn_enrollment_final.research_id
),

-- 1. Gather all unique deceased events from the diagnosis table
deceased_dx as (
    select distinct
        mrn,
        date_add(
            dob,
            interval cast(case when age_at_event_days = -1 then null else age_at_event_days end as int) day
        ) as vital_status_date,
        'deceased' as vital_status
    from radiant_data_dev.diagnosis
    inner join pt_roster on diagnosis.subject = pt_roster.research_id
    where diagnosis.event_type = 'Deceased'
),

-- 2. Consolidate ALL potential status records with calendar dates calculated
all_status_events as (
    -- Stream A: Deceased from diagnosis
    select mrn, vital_status_date, vital_status, 1 as priority_score from deceased_dx
    
    union all
    
    -- Stream B: Deceased from updates
    select
        mrn,
        max(date_add(dob, interval cast(date_of_visit_follow_up as int) day)) as vital_status_date,
        'deceased' as vital_status,
        1 as priority_score
    from radiant_data_dev.updates
    inner join pt_roster on updates.subject = pt_roster.research_id
    where clinical_status <> 'Not Reported'
      and date_of_visit_follow_up <> 'Not Reported'
      and lower(clinical_status) like '%deceased%'
    group by mrn, dob, clinical_status

    union all
    
    -- Stream C: Alive/General statuses from updates
    select
        mrn,
        max(date_add(dob, interval cast(date_of_visit_follow_up as int) day)) as vital_status_date,
        lower(clinical_status) as vital_status,
        2 as priority_score
    from radiant_data_dev.updates
    inner join pt_roster on updates.subject = pt_roster.research_id
    where clinical_status <> 'Not Reported'
      and date_of_visit_follow_up <> 'Not Reported'
      and lower(clinical_status) not like '%deceased%'
    group by mrn, dob, clinical_status
    
    union all

    -- Stream D: Alive/Active events from diagnosis (Evaluated for all patients now)
    select
        mrn,
        max(
            date_add(
                dob,
                interval cast(case when age_at_event_days = -1 then null else age_at_event_days end as int) day
            )
        ) as vital_status_date,
        'alive' as vital_status,
        2 as priority_score
    from radiant_data_dev.diagnosis
    inner join pt_roster on diagnosis.subject = pt_roster.research_id
    where diagnosis.event_type <> 'Unavailable'
      and diagnosis.event_type <> 'Deceased'
    group by mrn, dob
),

-- 3. Group the event stream to get the max calculated date per mrn & status type
grouped_events as (
    select 
        mrn,
        max(vital_status_date) as vital_status_date,
        vital_status,
        min(priority_score) as priority_score
    from all_status_events
    group by mrn, vital_status
),

-- 4. Rank statuses per patient: Deceased (1) beats Alive (2). 
--    If multiple rows have the same priority (e.g. multiple Alive entries), the newest date wins.
ranked_statuses as (
    select 
        mrn,
        vital_status_date,
        vital_status,
        row_number() over (
            partition by mrn 
            order by priority_score asc, vital_status_date desc nulls last
        ) as rn
    from grouped_events
)

-- 5. Final Output: Select only the top-ranked status per patient
select 
    mrn,
    vital_status_date,
    vital_status
from ranked_statuses
where rn = 1
order by mrn

);

create table radiant_data_dev.pcx_30_patient_level_deid as (
with subj as (
    select distinct subject, cns_diagnosis_category
    from radiant_data_dev.diagnosis
    where cns_diagnosis_category in ('Atypical teratoid/rhabdoid tumor', 'Medulloblastoma')
),

pt_roster as (
    select
        stg_cbtn_enrollment_final.mrn,
        stg_cbtn_enrollment_final.research_id,
        cast(dob as date) as dob,
        organization_name,
        subj.cns_diagnosis_category as diagnosis_type_cohort,
        case when radiant_patient_mrn_list.mrn is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
    from radiant_data_dev.stg_cbtn_enrollment_final
    left join radiant_data_dev.radiant_patient_mrn_list
        on stg_cbtn_enrollment_final.mrn = radiant_patient_mrn_list.mrn
    inner join subj 
        on subj.subject = stg_cbtn_enrollment_final.research_id
),

-- 1. Gather all unique deceased events from the diagnosis table
deceased_dx as (
    select distinct
        research_id,
        -- cast to int: diagnosis.age_at_event_days is FLOAT, and this was the ONLY arm
        -- of the union below not casting, which promoted the whole column to
        -- decimal(38,9) and published it as '5541.000000000'. The other three arms
        -- already cast. Lossless -- verified 2026-10-02 that 0 of 959 non-null values
        -- carry a fractional part. The -1 -> NULL mapping is unchanged.
        cast(case when age_at_event_days = -1 then null else age_at_event_days end as int)
            as age_at_vital_status_days,
        'deceased' as vital_status
    from radiant_data_dev.diagnosis
    inner join pt_roster on diagnosis.subject = pt_roster.research_id
    where diagnosis.event_type = 'Deceased'
),

-- 2. Consolidate ALL potential status records into one stream
all_status_events as (
    -- Stream A: Deceased from diagnosis
    select research_id, age_at_vital_status_days, vital_status, 1 as priority_score from deceased_dx
    
    union all
    
    -- Stream B: Deceased from updates
    select
        research_id,
        max(cast(date_of_visit_follow_up as int)) as age_at_vital_status_days,
        'deceased' as vital_status,
        1 as priority_score
    from radiant_data_dev.updates
    inner join pt_roster on updates.subject = pt_roster.research_id
    where clinical_status <> 'Not Reported'
      and date_of_visit_follow_up <> 'Not Reported'
      and lower(clinical_status) like '%deceased%'
    group by research_id, clinical_status

    union all

    -- Stream C: Alive/General statuses from updates
    select
        research_id,
        max(cast(date_of_visit_follow_up as int)) as age_at_vital_status_days,
        lower(clinical_status) as vital_status,
        2 as priority_score
    from radiant_data_dev.updates
    inner join pt_roster on updates.subject = pt_roster.research_id
    where clinical_status <> 'Not Reported'
      and date_of_visit_follow_up <> 'Not Reported'
      and lower(clinical_status) not like '%deceased%'
    group by research_id, clinical_status

    union all

    -- Stream D: Alive/Active events from diagnosis (Evaluated for all patients now)
    select
        research_id,
        max(cast(case when age_at_event_days = -1 then null else age_at_event_days end as int)) as age_at_vital_status_days,
        'alive' as vital_status,
        2 as priority_score
    from radiant_data_dev.diagnosis
    inner join pt_roster on diagnosis.subject = pt_roster.research_id
    where diagnosis.event_type <> 'Unavailable'
      and diagnosis.event_type <> 'Deceased'
    group by research_id
),

-- 3. Flatten/Group the event stream to get the max day count per research_id & status type
grouped_events as (
    select 
        research_id,
        max(age_at_vital_status_days) as age_at_vital_status_days,
        vital_status,
        min(priority_score) as priority_score
    from all_status_events
    group by research_id, vital_status
),

-- 4. Rank statuses per patient: Deceased (1) beats Alive (2).
--    The largest numeric day count breaks ties for identical priority tiers.
ranked_statuses as (
    select 
        research_id,
        age_at_vital_status_days,
        vital_status,
        row_number() over (
            partition by research_id 
            order by priority_score asc, age_at_vital_status_days desc nulls last
        ) as rn
    from grouped_events
)

-- 5. Final Output: Select only the top-ranked status per patient
select 
    research_id,
    age_at_vital_status_days,
    vital_status
from ranked_statuses
where rn = 1
order by research_id
);
