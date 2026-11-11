/*
   v_pcx_30_patient_level_combined

   Combined identified + de-identified vital status in ONE relation.

   CONTAINS PHI (mrn + calendar vital_status_date alongside research_id). Internal use only.

   Field pairing rule: identical columns appear once; differing columns appear
   twice, adjacent, identified value first.
   mrn               / research_id
   vital_status_date / age_at_vital_status_days

   STRUCTURE NOTE. The two source builds differ in shape: pcx_30_patient_level
   computes date_add(dob, age) inside every status stream and then takes
   max(date), while pcx_30_patient_level_deid keeps raw day counts and takes
   max(age). This view carries the day count (plus dob) through the streams and
   derives the calendar date once at the end. That is equivalent because dob is
   constant per patient, so max(age) and max(date_add(dob, age)) select the same
   winning row -- and it guarantees the two paired columns can never disagree.

   The -1 -> NULL mapping for an unknown date is preserved from both builds, so
   age_at_vital_status_days here never carries -1 (unknown surfaces as NULL).
 */

drop view if exists radiant_data_dev.v_pcx_30_patient_level_combined;

create view radiant_data_dev.v_pcx_30_patient_level_combined as (
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
            research_id,
            dob,
            organization_name,
            -- cast to int, matching pcx_30_patient_level_deid: the ONLY arm of the union
            -- below that did not cast, which promoted the column to double. Lossless
            -- (0 fractional values, verified 2026-10-02); -1 -> NULL mapping unchanged.
            cast(case when age_at_event_days = -1 then null else age_at_event_days end as int)
                as age_at_vital_status_days,
            'deceased' as vital_status
        from radiant_data_dev.diagnosis
        inner join pt_roster on diagnosis.subject = pt_roster.research_id
        where diagnosis.event_type = 'Deceased'
    ),

    -- 2. Consolidate ALL potential status records into one stream (day counts)
    all_status_events as (
        -- Stream A: Deceased from diagnosis
        select mrn, research_id, dob, organization_name, age_at_vital_status_days, vital_status, 1 as priority_score
        from deceased_dx

        union all

        -- Stream B: Deceased from updates
        select
            mrn,
            research_id,
            dob,
            organization_name,
            max(cast(date_of_visit_follow_up as int)) as age_at_vital_status_days,
            'deceased' as vital_status,
            1 as priority_score
        from radiant_data_dev.updates
        inner join pt_roster on updates.subject = pt_roster.research_id
        where clinical_status <> 'Not Reported'
          and date_of_visit_follow_up <> 'Not Reported'
          and lower(clinical_status) like '%deceased%'
        group by mrn, research_id, dob, organization_name, clinical_status

        union all

        -- Stream C: Alive/General statuses from updates
        select
            mrn,
            research_id,
            dob,
            organization_name,
            max(cast(date_of_visit_follow_up as int)) as age_at_vital_status_days,
            lower(clinical_status) as vital_status,
            2 as priority_score
        from radiant_data_dev.updates
        inner join pt_roster on updates.subject = pt_roster.research_id
        where clinical_status <> 'Not Reported'
          and date_of_visit_follow_up <> 'Not Reported'
          and lower(clinical_status) not like '%deceased%'
        group by mrn, research_id, dob, organization_name, clinical_status

        union all

        -- Stream D: Alive/Active events from diagnosis
        select
            mrn,
            research_id,
            dob,
            organization_name,
            max(cast(case when age_at_event_days = -1 then null else age_at_event_days end as int)) as age_at_vital_status_days,
            'alive' as vital_status,
            2 as priority_score
        from radiant_data_dev.diagnosis
        inner join pt_roster on diagnosis.subject = pt_roster.research_id
        where diagnosis.event_type <> 'Unavailable'
          and diagnosis.event_type <> 'Deceased'
        group by mrn, research_id, dob, organization_name
    ),

    -- 3. Max day count per patient & status type
    grouped_events as (
        select
            mrn,
            research_id,
            dob,
            organization_name,
            max(age_at_vital_status_days) as age_at_vital_status_days,
            vital_status,
            min(priority_score) as priority_score
        from all_status_events
        group by mrn, research_id, dob, organization_name, vital_status
    ),

    -- 4. Rank statuses per patient: Deceased (1) beats Alive (2)
    --    the largest day count breaks ties within a priority tier.
    ranked_statuses as (
        select
            mrn,
            research_id,
            dob,
            organization_name,
            age_at_vital_status_days,
            vital_status,
            row_number() over (
                partition by research_id
                order by priority_score asc, age_at_vital_status_days desc nulls last
            ) as rn
        from grouped_events
    )

    -- 5. Top-ranked status per patient, projecting both timing forms
    select
        ranked_statuses.organization_name,
        org.code as organization_code,

        -- identifier pair
        mrn,
        research_id,

        -- timing pair
        date_add(dob, interval cast(age_at_vital_status_days as int) day) as vital_status_date,
        age_at_vital_status_days,

        -- identical in both builds
        vital_status
    from ranked_statuses
    left join radiant_data_dev.pcx_30_organization_ref org
        on org.name = ranked_statuses.organization_name
    where rn = 1
);
