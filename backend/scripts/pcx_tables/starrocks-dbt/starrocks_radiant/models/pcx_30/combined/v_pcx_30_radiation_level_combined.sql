{{ config(
    materialized='view',
    tags=['pcx_30', 'combined', 'phi']
) }}

-- Combined identified + de-identified radiation therapy in ONE relation.
--
-- CONTAINS PHI (mrn + calendar radiation dates alongside research_id). Internal use only.
--
-- Field pairing rule: identical columns appear once; differing columns appear twice,
-- adjacent, identified value first.
--   mrn                  / research_id
--   radiation_start_date / age_at_radiation_start_days
--   radiation_stop_date  / age_at_radiation_stop_days
--
-- is_initial_treatment: 'yes' when the course STARTED on or after the
-- initial-diagnosis event and on or before the first SUBSEQUENT disease event, i.e.
-- part of frontline management of the initial tumour. The initial_events CTE is
-- byte-identical to pcx_30_radiation_level_deid and to the therapy and surgery
-- builds -- change all of them together. The `>= 0` anchor guard excludes the event
-- table's -1 unknown-date sentinel from the min() anchors, which would otherwise
-- invert the flag; it moves 0 rows here but is retained for cross-build identity.
--
-- 'no' CONFLATES "not frontline" WITH "cannot tell" (decided 2026-10-01: document
-- rather than add an 'unknown' third value), and RADIATION IS THE WORST OF THE THREE
-- TREATMENT VIEWS for this. age_at_radiation_start carries 'Not Available' and
-- 'Not Reported', which cast to NULL so the row lands in 'no'. Of 241 'no' rows on
-- the 2026-10-01 build: 152 genuine, 85 a string sentinel, 4 with no usable diagnosis
-- anchor -- so 89 (37%) is an unavailable START DATE read as a clinical negative.
-- Catch with cast(age_at_radiation_start as int) is null (no -1/negative values here,
-- unlike surgery). age_at_radiation_stop carries the same sentinels but the flag does
-- not read it.
--
-- PHASE 3: the cohort roster and the frontline-window anchors are now refs to
-- int_pcx_30_cohort_roster and int_pcx_30_initial_events, shared with
-- pcx_30_radiation_level_deid and the therapy/surgery views -- so the "change all of
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
from {{ source('dwh_source', 'treatment') }} treatment
inner join pt_roster on treatment.subject = pt_roster.research_id
left join {{ ref('pcx_30_organization_ref') }} org
    on org.name = pt_roster.organization_name
left join initial_events on pt_roster.research_id = initial_events.research_id
where radiation = 'Yes'
