/*
   v_pcx_30_medical_therapy_level_combined

   Combined identified + de-identified systemic therapy in ONE relation.

   CONTAINS PHI (mrn + calendar regimen dates alongside research_id). Internal use only.

   Field pairing rule: identical columns appear once; differing columns appear
   twice, adjacent, identified value first.
   mrn                / research_id
   regimen_start_date / age_at_regimen_start_days
   regimen_stop_date  / age_at_regimen_stop_days

   NOTE: age_at_chemo_start/stop are varchar and carry 'Not Reported',
   'Not Available' and 'Not Applicable' for unknowns. cast(... as int) yields NULL
   for those, so the paired calendar date is NULL -- matching pcx_30_medical_therapy_level.

   protocol_name_and_arm / protocol_name / protocol_arm (2026-10-02). Kept
   BYTE-IDENTICAL to pcx_30_medical_therapy_level / _deid -- change all three
   together. protocol_name_and_arm has DOUBLE QUOTES STRIPPED (98 of 1267 rows arrive
   quote-wrapped). protocol_name / protocol_arm split the cleaned value on its FIRST
   COLON: 382 rows yield a real arm, 885 fall through to 'Not Applicable'.
   THE SEPARATOR IS A COLON, NOT A SEMICOLON -- zero rows contain a semicolon, so a
   semicolon split would be inert. First colon only: 56 rows carry more than one, e.g.
   'SJMB12: Stratum N1: Standard Risk' -> 'SJMB12' + 'Stratum N1: Standard Risk'.
   A no-colon SENTINEL repeats into protocol_name and yields protocol_arm
   'Not Applicable', so protocol_arm='Not Applicable' CONFLATES "no arm" with "protocol
   unrecorded" -- read protocol_name first.

   is_initial_treatment (added 2026-10-01). 'yes' when the regimen started on or
   after the initial-diagnosis event and on or before the first SUBSEQUENT disease
   event, i.e. frontline therapy for the initial tumour rather than therapy for a
   progression/recurrence. Logic is kept BYTE-IDENTICAL to
   pcx_30_medical_therapy_level / _deid -- change all three together.

   'no' CONFLATES "not frontline" WITH "cannot tell" (decided 2026-10-01: document
   rather than add an 'unknown' third value). Measured on the 2026-10-01 build, of
   535 'no' rows: 372 (182 pts) genuine, 145 (119 pts) start age is one of the
   sentinel strings above so cast() -> NULL -> between -> NULL -> 'no', and 18
   (7 pts) have no Initial event to anchor on. So ~30% of 'no' is an unavailable
   SOURCE presented as a clinical NEGATIVE; do not count non-frontline regimens off
   this column without excluding cast(age_at_chemo_start as int) is null.
 */

drop view if exists radiant_data_dev.v_pcx_30_medical_therapy_level_combined;

create view radiant_data_dev.v_pcx_30_medical_therapy_level_combined as (
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

        -- identical in both builds
        replace(protocol_name_unmasked_internal_use, '"', '') as protocol_name_and_arm,
        case when locate(':', replace(protocol_name_unmasked_internal_use, '"', '')) > 0
             then trim(substring_index(replace(protocol_name_unmasked_internal_use, '"', ''), ':', 1))
             else trim(replace(protocol_name_unmasked_internal_use, '"', ''))
        end as protocol_name,
        case when locate(':', replace(protocol_name_unmasked_internal_use, '"', '')) > 0
             then trim(substring(replace(protocol_name_unmasked_internal_use, '"', ''),
                                 locate(':', replace(protocol_name_unmasked_internal_use, '"', '')) + 1))
             else 'Not Applicable'
        end as protocol_arm,
        chemotherapy_type,

        -- timing pairs
        date_add(dob, interval cast(age_at_chemo_start as int) day) as regimen_start_date,
        age_at_chemo_start as age_at_regimen_start_days,
        date_add(dob, interval cast(age_at_chemo_stop as int) day) as regimen_stop_date,
        age_at_chemo_stop as age_at_regimen_stop_days,

        -- identical in both builds
        chemotherapy_agents_unmasked_internal_use as chemotherapy_agents,
        case when cast(age_at_chemo_start as int) between age_at_initial_dx_days
            and coalesce(age_at_first_event_days, 100000)
        then 'yes' else 'no' end as is_initial_treatment
    from radiant_data_dev.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    left join radiant_data_dev.pcx_30_organization_ref org
        on org.name = pt_roster.organization_name
    left join initial_events on pt_roster.research_id = initial_events.research_id
    where chemotherapy = 'Yes'
);
