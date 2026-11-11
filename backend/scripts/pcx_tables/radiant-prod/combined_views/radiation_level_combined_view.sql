/*
   v_pcx_30_radiation_level_combined

   Combined identified + de-identified radiation therapy in ONE relation.

   CONTAINS PHI (mrn + calendar radiation dates alongside research_id). Internal use only.

   Field pairing rule: identical columns appear once; differing columns appear
   twice, adjacent, identified value first.
   mrn                  / research_id
   radiation_start_date / age_at_radiation_start_days
   radiation_stop_date  / age_at_radiation_stop_days

   is_initial_treatment (added 2026-10-01). 'yes' when the course STARTED on or after
   the initial-diagnosis event and on or before the first SUBSEQUENT disease event,
   i.e. part of frontline management of the initial tumour. The initial_events CTE is
   byte-identical to pcx_30_radiation_level / _deid and to the therapy and surgery
   builds -- change all of them together. The `>= 0` anchor guard excludes the event
   table's -1 unknown-date sentinel from the min() anchors, which would otherwise
   invert the flag; it moves 0 rows here but is retained for cross-build identity.

   'no' CONFLATES "not frontline" WITH "cannot tell" (decided 2026-10-01: document
   rather than add an 'unknown' third value), and RADIATION IS THE WORST OF THE THREE
   TREATMENT VIEWS for this. age_at_radiation_start carries 'Not Available' and
   'Not Reported', which cast to NULL so the row lands in 'no'. Of 241 'no' rows on the
   2026-10-01 build: 152 genuine, 85 a string sentinel, 4 with no usable diagnosis
   anchor -- so 89 (37%) is an unavailable START DATE read as a clinical negative.
   Catch with cast(age_at_radiation_start as int) is null (no -1/negative values here,
   unlike surgery). age_at_radiation_stop carries the same sentinels but the flag does
   not read it.
 */

drop view if exists radiant_data_dev.v_pcx_30_radiation_level_combined;

create view radiant_data_dev.v_pcx_30_radiation_level_combined as (
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

        -- timing pairs
        date_add(dob, interval cast(age_at_radiation_start as int) day) as radiation_start_date,
        age_at_radiation_start as age_at_radiation_start_days,
        date_add(dob, interval cast(age_at_radiation_stop as int) day) as radiation_stop_date,
        age_at_radiation_stop as age_at_radiation_stop_days,

        -- identical in both builds
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
    left join radiant_data_dev.pcx_30_organization_ref org
        on org.name = pt_roster.organization_name
    left join initial_events on pt_roster.research_id = initial_events.research_id
    where radiation = 'Yes'
);
