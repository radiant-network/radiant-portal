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
),

-- REVIEWER OVERRIDES (added 2026-11-05) -- applies the same reviewer-accepted
-- values as pcx_30_patient_level_deid, so a view-backed consumer no longer sees
-- the curator's original where a reviewer accepted a correction. This grain has
-- NO overrides today (only corroborations), so this is currently value-neutral;
-- it is wired now so the next accepted decision needs no schema change.
-- `vital_status_date` is re-derived from the accepted age because it is a pure
-- projection of it and exists only in this view.
-- Unlike the other four grains this key does NOT include organization_name --
-- the deid table has only 3 columns -- so no un-overridden org helper is needed.
published as (

select
    -- pcx_30_organization_override wins where it carries the patient; see the seed's
    -- description in seeds/_pcx_30__seeds.yml. Empty seed = byte-identical.
    coalesce(ovr.organization_name, ranked_statuses.organization_name) as organization_name,
    coalesce(ovr.organization_code, org.code) as organization_code,

    -- NOT EMITTED -- needed to re-derive the date from an accepted age.
    dob as uid_dob,

    -- identifier pair
    -- (qualified: the override join also exposes research_id, so a bare reference
    --  is ambiguous)
    ranked_statuses.mrn,
    ranked_statuses.research_id,

    -- timing pair
    age_at_vital_status_days,

    -- identical in both builds
    vital_status
from ranked_statuses
left join {{ ref('pcx_30_organization_ref') }} org
    on org.name = ranked_statuses.organization_name
left join {{ ref('pcx_30_organization_override') }} ovr
    on ovr.research_id = ranked_statuses.research_id
where rn = 1

),

keyed as (
    select
        published.*,
        {{ pcx_row_uid([
            'research_id',
            'age_at_vital_status_days',
            'vital_status',
        ]) }} as pcx_row_uid
    from published
),

prov as (
    {{ pcx_30_field_provenance_pivot('patient', [
        'age_at_vital_status_days',
        'vital_status',
    ]) }}
)

-- Column list and order UNCHANGED from the pre-override view.
select
    keyed.organization_name,
    keyed.organization_code,
    keyed.mrn,
    keyed.research_id,
    date_add(keyed.uid_dob, interval cast(coalesce(
        prov.ov_age_at_vital_status_days,
        keyed.age_at_vital_status_days) as int) day) as vital_status_date,
    coalesce(prov.ov_age_at_vital_status_days, keyed.age_at_vital_status_days)
        as age_at_vital_status_days,
    coalesce(prov.ov_vital_status, keyed.vital_status) as vital_status
from keyed
left join prov on prov.pcx_row_uid = keyed.pcx_row_uid
