/*
   pcx_30_surgery_level / _deid

   is_initial_treatment (added 2026-10-01): 'yes' when the surgery occurred on or
   after the initial-diagnosis event and on or before the first SUBSEQUENT disease
   event, i.e. part of frontline management of the initial tumour rather than
   surgery for a progression/recurrence.

   The initial_events CTE is kept IDENTICAL across pcx_30_medical_therapy_level,
   pcx_30_surgery_level and pcx_30_radiation_level (and the matching _deid and
   combined-view builds) -- change all of them together.

   ANCHOR GUARD (`>= 0`): pcx_30_event_level_deid uses -1 for an unknown event date,
   and the anchors are min() values, so an unknown date WINS the minimum and corrupts
   the window. Measured on prod 2026-10-01: 5 event rows carry -1, affecting 5
   patients -- 2 whose Initial CNS Tumor is -1 (window would open at -1, making every
   later procedure a false 'yes') and 3 whose Deceased event is -1 (upper bound -1
   falls below the diagnosis age, so the window is empty and every procedure is a
   false 'no' -- e.g. C851283, Initial 486 / Recurrence 730 / Deceased -1, whose real
   window is [486,730]). The guard excludes -1 from both min()s, so an unknown
   collapses to NULL (-> 'no', indeterminate) instead of silently inverting the flag.
   The therapy build did NOT have this guard when first shipped; it was added there
   at the same time and changed 0 rows on current data, since none of the 5 patients
   has a chemotherapy row.

   'no' CONFLATES "not frontline" WITH "cannot tell" (consistent with the therapy
   build; decided 2026-10-01 to document rather than add an 'unknown' third value).
   For surgery, age_at_surgery carries BOTH unknown conventions, measured on prod
   2026-10-01 over 9719 surgery='Yes' rows:
     * 11 rows are string sentinels ('Not Reported', or NULL) -> cast() yields NULL
       -> between yields NULL -> 'no'. Catch with cast(age_at_surgery as int) is null.
     * 32 rows are exactly -1 and 36 are < 0 -> these cast CLEANLY, so they compare
       as real numbers, fall below the diagnosis anchor, and land in 'no'. They are
       NOT catchable with `is null` -- test cast(age_at_surgery as int) < 0.
   So treat 'no' as "not known to be initial treatment". Do not count non-frontline
   surgeries off this column without excluding both unknown forms.

   MEASURED on the 2026-10-01 build (1278 rows, unchanged by this change):
     1145 'yes' (925 pts) / 133 'no' (92 pts). Of the 133 'no':
        97 rows / 71 pts  genuine -- surgery outside the frontline window
        30 rows / 19 pts  INDETERMINATE -- no usable initial-diagnosis anchor
         3 rows /  2 pts  INDETERMINATE -- age_at_surgery is -1/negative
         3 rows /  3 pts  INDETERMINATE -- age_at_surgery is a string sentinel
     i.e. 36 of 133 'no' (27%) is an unavailable source read as a clinical negative.
   The anchor guard flipped 4 rows / 3 patients versus the unguarded form: 1 row
   no->yes (C851283, surgery at age 486, whose Deceased=-1 had emptied the window)
   and 3 rows yes->no (the 2 patients whose Initial CNS Tumor is -1, previously
   admitted by a window opening at -1). Both directions are corrections.
 */

drop table if exists radiant_data_dev.pcx_30_surgery_level;
drop table if exists radiant_data_dev.pcx_30_surgery_level_deid;

create table radiant_data_dev.pcx_30_surgery_level as (
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
        date_add(dob, interval cast(age_at_surgery as int) day) as surgery_date,
        extent_of_tumor_resection,
        case when cast(age_at_surgery as int) between age_at_initial_dx_days
            and coalesce(age_at_first_event_days, 100000)
        then 'yes' else 'no' end as is_initial_treatment
    from radiant_data_dev.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    left join initial_events on pt_roster.research_id = initial_events.research_id
    where surgery = 'Yes'
);

create table radiant_data_dev.pcx_30_surgery_level_deid as (
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
        age_at_surgery as age_at_surgery_days,
        extent_of_tumor_resection,
        case when cast(age_at_surgery as int) between age_at_initial_dx_days
            and coalesce(age_at_first_event_days, 100000)
        then 'yes' else 'no' end as is_initial_treatment
    from radiant_data_dev.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    left join initial_events on pt_roster.research_id = initial_events.research_id
    where surgery = 'Yes'
);
