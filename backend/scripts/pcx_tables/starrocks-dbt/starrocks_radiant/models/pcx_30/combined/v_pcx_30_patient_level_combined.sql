{{ config(
    materialized='view',
    tags=['pcx_30', 'combined', 'phi']
) }}

-- Combined identified + de-identified vital status in ONE relation.
--
-- CONTAINS PHI (mrn + calendar vital_status_date alongside research_id).
-- Internal use only. The grant-guarded surface is the cbtn_tenant view built from
-- this one by ac_v_pcx_30_patient_level_combined.
--
-- Field pairing rule: identical columns appear once; differing columns appear twice,
-- adjacent, identified value first.
--   mrn               / research_id
--   vital_status_date / age_at_vital_status_days
--
-- PHASE 3: the four status streams, the -1 handling and the grouping now live ONCE in
-- int_pcx_30_vital_status_events, shared with pcx_30_patient_level_deid. This view
-- is reduced to ranking that stream and projecting both timing forms. Before this,
-- the stream logic existed in THREE places (identified table, deid table, this view),
-- and the identified copy computed date_add inside every stream and took max(date)
-- while the deid copy took max(age) -- shapes that could drift.
--
-- The calendar date is derived exactly once, here, from the same winning row the age
-- comes from, so the two paired columns cannot disagree by construction.
--
-- The -1 -> NULL mapping is applied upstream, so age_at_vital_status_days never
-- carries -1 and vital_status_date is NULL (not dob-minus-one-day) for an unknown.
-- That differs from the surgery and event_level views, which DO inherit the
-- dob-minus-one-day artifact -- deliberately, to match their identified tables.

with ranked_statuses as (
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
    from {{ ref('int_pcx_30_vital_status_events') }}
)

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
left join {{ ref('pcx_30_organization_ref') }} org
    on org.name = ranked_statuses.organization_name
where rn = 1
