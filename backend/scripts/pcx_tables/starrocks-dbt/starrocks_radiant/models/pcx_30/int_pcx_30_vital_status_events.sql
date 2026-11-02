{{ config(
    materialized='table',
    tags=['pcx_30', 'intermediate']
) }}

-- All candidate vital-status records per patient, carrying BOTH the de-identified and
-- the identified keys so the deid table and the combined view derive from ONE
-- aggregation instead of two independent ones.
--
-- Four source streams are unioned, then collapsed to the latest day-count per
-- (mrn, research_id, dob, organization_name, vital_status):
--   A  deceased, from a diagnosis event_type = 'Deceased'
--   B  deceased, from an updates clinical_status matching '%deceased%'
--   C  alive / other, from any remaining reported updates clinical_status
--   D  alive, inferred from any diagnosis event that is neither Deceased nor
--      Unavailable
--
-- priority_score encodes precedence for the downstream pick: deceased (1) outranks
-- any alive/other status (2). Ranking lives in the two leaf models, not here.
--
-- CONTAINS PHI (mrn, dob). This is an intermediate, not a published relation. The
-- deid leaf projects neither; only v_pcx_30_patient_level_combined does, and the
-- grant-guarded cbtn_tenant view masks the date on top of that.
--
-- WHY DAY COUNTS, NOT DATES. The streams carry the raw day count plus dob, and the
-- calendar date is derived ONCE at the end of the combined view. That is equivalent
-- because dob is constant per patient -- max(age) and max(date_add(dob, age)) select
-- the same winning row -- and it guarantees the two paired columns in the combined
-- view can never disagree. The pre-dbt identified build computed date_add inside
-- every stream and took max(date), which could drift from its deid twin; this shape
-- makes that impossible.
--
-- GRAIN: one row per (mrn, research_id, dob, organization_name, vital_status).
-- FINER than the deid table needs. pcx_30_patient_level_deid re-aggregates to
-- (research_id, vital_status), which is loss-free because max() and min() are
-- associative -- regrouping a grouped max is the same as grouping the raw stream
-- once. The finer grain only materializes a difference for a multi-MRN patient, where
-- the combined view wants the MRN split and the deid table does not.
--
-- The -1 -> NULL mapping for an unknown date is preserved, so
-- age_at_vital_status_days never carries -1 (unknown surfaces as NULL).

with roster as (
    select * from {{ ref('int_pcx_30_cohort_roster') }}
),

-- Stream A: deceased events from the diagnosis table.
-- age_at_event_days = -1 is the source's "unknown" sentinel and becomes NULL, so a
-- deceased record can legitimately arrive undated. It still outranks alive on
-- priority_score; `nulls last` in the leaf models only breaks ties within a tier.
deceased_dx as (
    select distinct
        roster.mrn,
        roster.research_id,
        roster.dob,
        roster.organization_name,
        -- cast to int: diagnosis.age_at_event_days is FLOAT, and this was the ONLY
        -- stream not casting it (B, C and D all do), so the union promoted the whole
        -- column to decimal(38,9) and the published age rendered as '5541.000000000'
        -- in pcx_30_patient_level_deid, v_pcx_30_patient_level_combined and (as
        -- double) the tenant view. Lossless -- verified 2026-10-14 that 0 of 1,216
        -- non-null values carry a fractional part, range 0..14,756 days. Mirrors the
        -- same fix already present in pcx_30_event_level_deid.
        cast(
            case
                when dx.age_at_event_days = -1 then null
                else dx.age_at_event_days
            end as int
        ) as age_at_vital_status_days,
        'deceased' as vital_status
    from {{ source('dwh_source', 'diagnosis') }} dx
    inner join roster
        on dx.subject = roster.research_id
    where dx.event_type = 'Deceased'
),

all_status_events as (

    select
        mrn,
        research_id,
        dob,
        organization_name,
        age_at_vital_status_days,
        vital_status,
        1 as priority_score
    from deceased_dx

    union all

    -- Stream B: deceased statuses from the updates table
    select
        roster.mrn,
        roster.research_id,
        roster.dob,
        roster.organization_name,
        max(cast(upd.date_of_visit_follow_up as int)) as age_at_vital_status_days,
        'deceased' as vital_status,
        1 as priority_score
    from {{ source('dwh_source', 'updates') }} upd
    inner join roster
        on upd.subject = roster.research_id
    where upd.clinical_status <> 'Not Reported'
      and upd.date_of_visit_follow_up <> 'Not Reported'
      and lower(upd.clinical_status) like '%deceased%'
    group by roster.mrn, roster.research_id, roster.dob, roster.organization_name, upd.clinical_status

    union all

    -- Stream C: alive / other reported statuses from the updates table.
    -- vital_status is the raw lowercased source value, so new source vocabulary
    -- flows straight through to the output rather than being silently bucketed.
    select
        roster.mrn,
        roster.research_id,
        roster.dob,
        roster.organization_name,
        max(cast(upd.date_of_visit_follow_up as int)) as age_at_vital_status_days,
        lower(upd.clinical_status) as vital_status,
        2 as priority_score
    from {{ source('dwh_source', 'updates') }} upd
    inner join roster
        on upd.subject = roster.research_id
    where upd.clinical_status <> 'Not Reported'
      and upd.date_of_visit_follow_up <> 'Not Reported'
      and lower(upd.clinical_status) not like '%deceased%'
    group by roster.mrn, roster.research_id, roster.dob, roster.organization_name, upd.clinical_status

    union all

    -- Stream D: alive inferred from any non-deceased, non-unavailable diagnosis
    -- event. Evaluated for every patient, including those with a deceased record --
    -- priority_score, not the WHERE clause, is what resolves the conflict.
    select
        roster.mrn,
        roster.research_id,
        roster.dob,
        roster.organization_name,
        max(cast(
            case
                when dx.age_at_event_days = -1 then null
                else dx.age_at_event_days
            end as int
        )) as age_at_vital_status_days,
        'alive' as vital_status,
        2 as priority_score
    from {{ source('dwh_source', 'diagnosis') }} dx
    inner join roster
        on dx.subject = roster.research_id
    where dx.event_type <> 'Unavailable'
      and dx.event_type <> 'Deceased'
    group by roster.mrn, roster.research_id, roster.dob, roster.organization_name

)

-- Collapse the streams: latest day-count per status, strongest priority per status.
-- Streams B and C group by the raw clinical_status, so two distinct source strings
-- that both map to one vital_status label converge here.
select
    mrn,
    research_id,
    dob,
    organization_name,
    -- explicit cast so the PUBLISHED type is INT regardless of how the engine types
    -- the union and the max(); belt-and-braces with the per-stream cast above
    cast(max(age_at_vital_status_days) as int) as age_at_vital_status_days,
    vital_status,
    min(priority_score) as priority_score
from all_status_events
group by mrn, research_id, dob, organization_name, vital_status
