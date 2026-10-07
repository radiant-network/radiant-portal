/*
   v_pcx_30_surgery_level_combined

   Combined identified + de-identified tumor-directed surgery in ONE relation.

   CONTAINS PHI (mrn + calendar surgery_date alongside research_id). Internal use only.

   Field pairing rule: identical columns appear once; differing columns appear
   twice, adjacent, identified value first.
   mrn          / research_id
   surgery_date / age_at_surgery_days

   NOTE on the -1 sentinel: age_at_surgery carries -1 for an unknown date, so
   date_add(dob, -1 day) yields dob minus one day for those rows. Inherited
   verbatim from pcx_30_surgery_level; not corrected here.

   is_initial_treatment (added 2026-10-01). 'yes' when the surgery occurred on or after
   the initial-diagnosis event and on or before the first SUBSEQUENT disease event,
   i.e. part of frontline management of the initial tumour. The initial_events CTE is
   byte-identical to pcx_30_surgery_level / _deid and to the therapy and radiation
   builds -- change all of them together.

   The `>= 0` ANCHOR GUARD matters: pcx_30_event_level_deid uses -1 for an unknown
   event date and the anchors are min() values, so an unguarded -1 wins the minimum and
   inverts the flag. On the 2026-10-01 build the guard moves 4 rows / 3 patients.

   'no' CONFLATES "not frontline" WITH "cannot tell" (decided 2026-10-01: document
   rather than add an 'unknown' third value). Of 133 'no' rows: 97 genuine, 30 with no
   usable diagnosis anchor, 3 with age_at_surgery -1/negative, 3 with a string
   sentinel -- so 36 (27%) is an unavailable source read as a clinical negative.
   Surgery carries BOTH unknown conventions, so detecting them needs TWO tests:
   cast(age_at_surgery as int) is null AND cast(age_at_surgery as int) < 0.
 */

drop view if exists radiant_data_dev.v_pcx_30_surgery_level_combined;

create view radiant_data_dev.v_pcx_30_surgery_level_combined as (
    with subj as (
        select distinct subject, cns_diagnosis_category
        from radiant_data_dev.diagnosis
        where
            cns_diagnosis_category in (
                'Atypical teratoid/rhabdoid tumor', 'Medulloblastoma'
            )
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
        inner join subj on subj.subject = stg_cbtn_enrollment_final.research_id
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
        org.code as organization_code,

        -- identifier pair
        -- (qualified: initial_events also exposes research_id / organization_name)
        pt_roster.mrn,
        pt_roster.research_id,

        -- timing pair
        date_add(dob, interval cast(age_at_surgery as int) day) as surgery_date,
        age_at_surgery as age_at_surgery_days,

        -- identical in both builds
        extent_of_tumor_resection,
        case when cast(age_at_surgery as int) between age_at_initial_dx_days
            and coalesce(age_at_first_event_days, 100000)
        then 'yes' else 'no' end as is_initial_treatment
    from radiant_data_dev.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    left join radiant_data_dev.pcx_30_organization_ref org
        on org.name = pt_roster.organization_name
    left join initial_events on pt_roster.research_id = initial_events.research_id
    where surgery = 'Yes'
);
