
-- pcx_30 medical therapy (chemotherapy) level tables.
--
-- protocol_name_and_arm / protocol_name / protocol_arm (2026-10-02):
--   protocol_name_and_arm now has DOUBLE QUOTES STRIPPED. The source
--   treatment.protocol_name_unmasked_internal_use wraps 98 of 1267 rows in literal
--   quote characters, e.g. "ACNS0332: Regimen A (no carboplatin, no isotretinoin)".
--   Only the quote character is removed; nothing else about the value changes.
--
--   protocol_name / protocol_arm split the cleaned value on its FIRST COLON:
--     'ACNS0333: Arm I (chemotherapy, ...)' -> 'ACNS0333' + 'Arm I (chemotherapy, ...)'
--     'ACNS0331'                            -> 'ACNS0331' + 'Not Applicable'
--
--   THE SEPARATOR IS A COLON, NOT A SEMICOLON. Profiled on prod 2026-10-02 over the
--   1267-row build: 382 rows contain a colon, ZERO contain a semicolon. A semicolon
--   split would have been inert -- every row would have fallen through to
--   'Not Applicable'. Re-profile before changing the delimiter.
--
--   FIRST colon, deliberately: 56 rows carry more than one, e.g.
--   'SJMB12: Stratum N1: Standard Risk' -> 'SJMB12' + 'Stratum N1: Standard Risk'.
--   substring_index(...,':',1) takes the head; the arm keeps its remaining colons.
--
--   Both halves are trim()ed, because the convention is ': ' and the arm would
--   otherwise carry a leading space. protocol_name_and_arm itself is NOT trimmed --
--   it is quote-stripped only, so it stays a faithful rendering of the source.
--
--   A no-colon SENTINEL yields the sentinel in BOTH columns by design, following the
--   "repeat the whole value" rule: 'Not Applicable' (341 rows) -> protocol_name
--   'Not Applicable' + protocol_arm 'Not Applicable'; same for 'Not Reported' (78)
--   and 'Other' (63). So protocol_arm='Not Applicable' CONFLATES "this protocol has
--   no arm" with "the protocol itself is unrecorded" -- check protocol_name before
--   reading protocol_arm as a real absence of arm.
--
--   protocol_name is a usable grouping key: the same trial appears both bare and
--   with arms ('ACNS0331' alone, 105 rows, plus four 'ACNS0331: Arm ...' variants),
--   and all of them now collapse to protocol_name='ACNS0331'.
--
-- is_initial_treatment (added 2026-10-01): 'yes' when the regimen started on or
-- after the initial-diagnosis event and on or before the first SUBSEQUENT disease
-- event, i.e. upfront/frontline therapy for the initial tumour rather than
-- therapy for a progression/recurrence.
--
-- Profiled on prod 2026-10-01 against radiant_data_dev.pcx_30_event_level_deid
-- (1844 rows), so the next reader inherits the counts:
--   * event_type vocabulary is CLOSED at 7 values: Initial CNS Tumor (941 rows /
--     939 pts), Progressive (359/184), Deceased (262/261), Recurrence (217/176),
--     Second Malignancy (54/48), Unavailable (8/7), Not Reported (3/3).
--     So `like 'Initial%'` matches ONLY 'Initial CNS Tumor' — exactly the value
--     excluded from the age_at_first_event_days arm. The two arms are therefore
--     consistent today; a new 'Initial *' event type would silently collapse the
--     window to a single day, so re-profile if the vocabulary grows.
--   * 0 research_ids carry more than one organization_name, so joining
--     initial_events on research_id alone (narrower than its group-by) cannot
--     fan out today. Same caveat: re-check if that ever becomes non-zero.
--   * 'Deceased' counts as a terminating first event, so for a patient whose only
--     non-initial event is death the window is dx..death.
--   * `between` is inclusive, so a regimen starting exactly ON the first-event day
--     is flagged 'yes'.
--   * age_at_initial_dx_days is deliberately NOT coalesced: a patient with no
--     Initial event (or absent from the event table) yields NULL -> 'no'.
--   * Aggregate FILTER (WHERE ...) is supported on this StarRocks version
--     (verified 2026-10-01).
--   * ANCHOR GUARD `>= 0` (added 2026-10-01, with the surgery + radiation builds):
--     pcx_30_event_level_deid uses -1 for an unknown event date, and the anchors are
--     min() values, so -1 WINS the minimum and corrupts the window. 5 event rows
--     carry -1, affecting 5 patients: 2 whose Initial CNS Tumor is -1 (window would
--     open at -1 -> every later regimen a false 'yes') and 3 whose Deceased event is
--     -1 (upper bound -1 sits below the diagnosis age -> empty window -> every
--     regimen a false 'no'). The guard drops -1 from both min()s so an unknown
--     becomes NULL -> 'no' (indeterminate) rather than silently inverting the flag.
--     Changed 0 rows here on current data (none of the 5 patients has a chemotherapy
--     row), so the 732/535 split is unaffected; it is a correctness guard against
--     future data and keeps this CTE byte-identical to the surgery/radiation builds.
--
-- KNOWN LIMITATION — 'no' CONFLATES "not frontline" WITH "cannot tell".
-- Decided 2026-10-01: keep the 2-value 'yes'/'no' vocabulary and document the
-- overstatement here rather than adding an 'unknown' third value.
--   treatment.age_at_chemo_start carries SENTINEL STRINGS, not only numbers:
--   'Not Available' (93 rows), 'Not Applicable' (38), 'Not Reported' (14).
--   They are non-NULL so they survive the select distinct, but cast(... as int)
--   yields NULL, so `between` yields NULL and the case falls through to 'no'.
--   Measured breakdown of the 535 'no' rows on the 2026-10-01 build:
--       372 rows / 182 pts  genuine — chemo started outside the frontline window
--       145 rows / 119 pts  INDETERMINATE — start age is a sentinel string
--        18 rows /   7 pts  INDETERMINATE — no Initial event to anchor on
--   i.e. ~30% of 'no' (163 rows, 126 pts) is an unavailable SOURCE presented as a
--   clinical NEGATIVE. Anyone filtering `is_initial_treatment = 'no'`, or counting
--   non-frontline regimens off this column, inherits that overstatement silently.
--   To separate them, test `cast(age_at_chemo_start as int) is null` (NOT
--   `age_at_chemo_start is null`, which matches 0 rows).
--   Same caveat already applies to the PHI table's regimen_start_date /
--   regimen_stop_date, which are NULL on those sentinel rows (pre-existing, not
--   introduced by is_initial_treatment).
--
-- Depends on radiant_data_dev.pcx_30_event_level_deid — build that FIRST.
-- (The PHI table reads the _deid event table too; this leaks nothing, the join is
-- on research_id and ages only.)

drop table if exists radiant_data_dev.pcx_30_medical_therapy_level;
drop table if exists radiant_data_dev.pcx_30_medical_therapy_level_deid;

create table radiant_data_dev.pcx_30_medical_therapy_level as (
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
        mrn,
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
        date_add(dob, interval cast(age_at_chemo_start as int) day)
            as regimen_start_date,
        date_add(dob, interval cast(age_at_chemo_stop as int) day)
            as regimen_stop_date,
        chemotherapy_agents_unmasked_internal_use as chemotherapy_agents,
        case when cast(age_at_chemo_start as int) between age_at_initial_dx_days
            and coalesce(age_at_first_event_days, 100000)
        then 'yes' else 'no' end as is_initial_treatment
    from radiant_data_dev.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    left join initial_events on pt_roster.research_id=initial_events.research_id
    where chemotherapy = 'Yes'
    order by mrn, regimen_start_date, regimen_stop_date
);

create table radiant_data_dev.pcx_30_medical_therapy_level_deid as (
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
        age_at_chemo_start as age_at_regimen_start_days,
        age_at_chemo_stop as age_at_regimen_stop_days,
        chemotherapy_agents_unmasked_internal_use as chemotherapy_agents,
        case when cast(age_at_chemo_start as int) between age_at_initial_dx_days
            and coalesce(age_at_first_event_days, 100000)
            then 'yes' else 'no' end as is_initial_treatment
    from radiant_data_dev.treatment
    inner join pt_roster on treatment.subject = pt_roster.research_id
    left join initial_events on pt_roster.research_id=initial_events.research_id
    where chemotherapy = 'Yes'
    order by research_id, age_at_regimen_start_days, age_at_regimen_stop_days
);
