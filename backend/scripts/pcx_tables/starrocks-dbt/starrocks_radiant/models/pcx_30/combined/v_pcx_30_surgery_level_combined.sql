{{ config(
    materialized='view',
    tags=['pcx_30', 'combined', 'phi']
) }}

-- Combined identified + de-identified tumor-directed surgery in ONE relation.
--
-- CONTAINS PHI (mrn + calendar surgery_date alongside research_id). Internal use only.
--
-- Field pairing rule: identical columns appear once; differing columns appear twice,
-- adjacent, identified value first.
--   mrn          / research_id
--   surgery_date / age_at_surgery_days
--
-- NOTE on the -1 sentinel: age_at_surgery carries -1 for an unknown date, so
-- date_add(dob, -1 day) yields dob minus one day for those rows. Inherited verbatim
-- from pcx_30_surgery_level; NOT corrected here.
--
-- is_initial_treatment: 'yes' when the surgery occurred on or after the
-- initial-diagnosis event and on or before the first SUBSEQUENT disease event, i.e.
-- part of frontline management of the initial tumour. The initial_events CTE is
-- byte-identical to pcx_30_surgery_level_deid and to the therapy and radiation builds
-- -- change all of them together.
--
-- The `>= 0` ANCHOR GUARD matters: pcx_30_event_level_deid uses -1 for an unknown
-- event date and the anchors are min() values, so an unguarded -1 wins the minimum
-- and inverts the flag. On the 2026-10-01 build the guard moves 4 rows / 3 patients.
--
-- 'no' CONFLATES "not frontline" WITH "cannot tell" (decided 2026-10-01: document
-- rather than add an 'unknown' third value). Of 133 'no' rows: 97 genuine, 30 with no
-- usable diagnosis anchor, 3 with age_at_surgery -1/negative, 3 with a string
-- sentinel -- so 36 (27%) is an unavailable source read as a clinical negative.
-- Surgery carries BOTH unknown conventions, so detecting them needs TWO tests:
-- cast(age_at_surgery as int) is null AND cast(age_at_surgery as int) < 0.
--
-- PHASE 3: the cohort roster and the frontline-window anchors are now refs to
-- int_pcx_30_cohort_roster and int_pcx_30_initial_events, shared with
-- pcx_30_surgery_level_deid and the therapy/radiation views -- so the "change all of
-- them together" instruction above is now enforced by the DAG rather than by hand.

with pt_roster as (
    select * from {{ ref('int_pcx_30_cohort_roster') }}
),

initial_events as (
    select * from {{ ref('int_pcx_30_initial_events') }}
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
from {{ source('dwh_source', 'treatment') }} treatment
inner join pt_roster on treatment.subject = pt_roster.research_id
left join {{ ref('pcx_30_organization_ref') }} org
    on org.name = pt_roster.organization_name
left join initial_events on pt_roster.research_id = initial_events.research_id
where surgery = 'Yes'
