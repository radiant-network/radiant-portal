/*
   pcx_30_radiation_level / _deid

   is_initial_treatment (added 2026-10-01): 'yes' when the radiation course started on
   or after the initial-diagnosis event and on or before the first SUBSEQUENT disease
   event, i.e. part of frontline management of the initial tumour rather than
   radiation for a progression/recurrence. Anchored on the course START age, matching
   how the therapy build anchors on regimen start.

   The initial_events CTE is kept IDENTICAL across pcx_30_medical_therapy_level,
   pcx_30_surgery_level and pcx_30_radiation_level (and the matching _deid and
   combined-view builds) -- change all of them together.

   ANCHOR GUARD (`>= 0`): pcx_30_event_level_deid uses -1 for an unknown event date,
   and the anchors are min() values, so an unknown date WINS the minimum and corrupts
   the window. Measured on prod 2026-10-01: 5 event rows carry -1, affecting 5
   patients -- 2 whose Initial CNS Tumor is -1 (window would open at -1, making every
   later course a false 'yes') and 3 whose Deceased event is -1 (upper bound -1 falls
   below the diagnosis age, so the window is empty and every course is a false 'no' --
   e.g. C851283, Initial 486 / Recurrence 730 / Deceased -1, whose real window is
   [486,730]). The guard excludes -1 from both min()s, so an unknown collapses to NULL
   (-> 'no', indeterminate) instead of silently inverting the flag.

   'no' CONFLATES "not frontline" WITH "cannot tell" (consistent with the therapy
   build; decided 2026-10-01 to document rather than add an 'unknown' third value).
   RADIATION IS THE WORST AFFECTED OF THE THREE: measured on prod 2026-10-01 over
   3333 radiation='Yes' rows, 507 (15.2%) have a non-numeric age_at_radiation_start
   -- 403 'Not Available' and 104 'Not Reported' -- which cast to NULL, so between
   yields NULL and the row lands in 'no'. Unlike surgery there are no -1 or negative
   values here, so the single catch-all is cast(age_at_radiation_start as int) is null.
   Treat 'no' as "not known to be initial radiation"; roughly one row in seven is an
   unavailable START DATE being reported as non-frontline, so do not count
   non-frontline courses off this column without excluding that population.
   (age_at_radiation_stop carries the same sentinels -- 378 'Not Available' and 136
   'Not Reported' -- but the flag does not read the stop age.)

   MEASURED on the 2026-10-01 build (771 rows, unchanged by this change):
     530 'yes' (524 pts) / 241 'no' (197 pts). Of the 241 'no':
       152 rows / 123 pts  genuine -- course started outside the frontline window
        85 rows /  78 pts  INDETERMINATE -- age_at_radiation_start is a string sentinel
         4 rows /   2 pts  INDETERMINATE -- no usable initial-diagnosis anchor
     i.e. 89 of 241 'no' (37%) is an unavailable source read as a clinical negative --
     the highest indeterminate share of the three treatment tables. (The 507 sentinel
     rows in the source collapse to 85 here because select distinct dedupes rows whose
     remaining columns match.)
   The anchor guard flipped 0 rows here versus the unguarded form -- none of the 5
   -1-affected patients has a dated radiation course -- but it is retained so this CTE
   stays byte-identical to the surgery and therapy builds.
 */

drop table if exists radiant_data_dev.pcx_30_radiation_level;
drop table if exists radiant_data_dev.pcx_30_radiation_level_deid;

create table radiant_data_dev.pcx_30_radiation_level as (
    with subj as (
        select distinct subject, cns_diagnosis_category
        from radiant_data_dev.diagnosis
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
            stg_cbtn_enrollment_final.research_id,
            cast(dob as date) as dob,
            organization_name,
            subj.cns_diagnosis_category as diagnosis_type_cohort,
            case when radiant_patient_mrn_list.mrn is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
        from radiant_data_dev.stg_cbtn_enrollment_final
        left join
            radiant_data_dev.radiant_patient_mrn_list
            on stg_cbtn_enrollment_final.mrn = radiant_patient_mrn_list.mrn
        inner join subj on subj.subject=stg_cbtn_enrollment_final.research_id
    ),

    initial_events as (
        select
            research_id,
            organization_name,
            min(cast(age_at_event_days as int))
                FILTER (WHERE event_type like 'Initial%'
                        and cast(age_at_event_days as int) >= 0) as age_at_initial_dx_days,
            min(cast(age_at_event_days as int))
                FILTER (WHERE event_type not in ('Initial CNS Tumor','Unavailable','Not Reported')
                        and cast(age_at_event_days as int) >= 0) as age_at_first_event_days
        from radiant_data_dev.pcx_30_event_level_deid
        group by research_id, organization_name
    )

    select distinct
        pt_roster.organization_name,
        pt_roster.mrn,
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
        total_radiation_dose_focal_unit,
        case when cast(age_at_radiation_start as int) between age_at_initial_dx_days
            and coalesce(age_at_first_event_days, 100000)
        then 'yes' else 'no' end as is_initial_treatment
    from radiant_data_dev.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    left join initial_events on pt_roster.research_id = initial_events.research_id
    where radiation = 'Yes'
    order by mrn
);

create table radiant_data_dev.pcx_30_radiation_level_deid as (
    with subj as (
        select distinct subject, cns_diagnosis_category
        from radiant_data_dev.diagnosis
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
            stg_cbtn_enrollment_final.research_id,
            cast(dob as date) as dob,
            organization_name,
            subj.cns_diagnosis_category as diagnosis_type_cohort,
            case when radiant_patient_mrn_list.mrn is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
        from radiant_data_dev.stg_cbtn_enrollment_final
        left join
            radiant_data_dev.radiant_patient_mrn_list
            on stg_cbtn_enrollment_final.mrn = radiant_patient_mrn_list.mrn
        inner join subj on subj.subject=stg_cbtn_enrollment_final.research_id
    ),

    initial_events as (
        select
            research_id,
            organization_name,
            min(cast(age_at_event_days as int))
                FILTER (WHERE event_type like 'Initial%'
                        and cast(age_at_event_days as int) >= 0) as age_at_initial_dx_days,
            min(cast(age_at_event_days as int))
                FILTER (WHERE event_type not in ('Initial CNS Tumor','Unavailable','Not Reported')
                        and cast(age_at_event_days as int) >= 0) as age_at_first_event_days
        from radiant_data_dev.pcx_30_event_level_deid
        group by research_id, organization_name
    )

    select distinct
        pt_roster.organization_name,
        pt_roster.research_id,
        age_at_radiation_start as age_at_radiation_start_days,
        age_at_radiation_stop as age_at_radiation_stop_days,
        radiation_site,
        radiation_site_other,
        radiation_type,
        radiation_type_other,
        total_radiation_dose,
        total_radiation_dose_unit,
        total_radiation_dose_focal,
        total_radiation_dose_focal_unit,
        case when cast(age_at_radiation_start as int) between age_at_initial_dx_days
            and coalesce(age_at_first_event_days, 100000)
        then 'yes' else 'no' end as is_initial_treatment
    from radiant_data_dev.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    left join initial_events on pt_roster.research_id = initial_events.research_id
    where radiation = 'Yes'
    order by research_id
);
