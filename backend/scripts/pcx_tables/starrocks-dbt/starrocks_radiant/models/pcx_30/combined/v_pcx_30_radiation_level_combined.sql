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
),

-- REVIEWER OVERRIDES (added 2026-11-05) -- applies the same reviewer-accepted
-- values as pcx_30_radiation_level_deid, so a view-backed consumer no longer
-- sees the curator's original where a reviewer accepted a correction. One
-- override lands here today: C72570's total_radiation_dose_focal, 5580 -> 5400.
-- Provenance DETAIL is not exposed here; the release table carries a
-- `field_provenance` column and whether the view layer should too is an open
-- decision, so this moves the VALUES only and adds no column.
--
-- The paired calendar dates ARE re-derived from an accepted age -- they exist
-- only in this view and are a pure projection of it. `is_initial_treatment`
-- deliberately does NOT cascade: the deid model does not cascade either, and
-- view-vs-table agreement on a shared column matters more than the internal
-- coherence of a derived one.
published as (

select distinct
    -- pcx_30_organization_override wins where it carries the patient; see the seed's
    -- description in seeds/_pcx_30__seeds.yml. Empty seed = byte-identical.
    coalesce(ovr.organization_name, pt_roster.organization_name) as organization_name,
    coalesce(ovr.organization_code, org.code) as organization_code,

    -- NOT EMITTED -- the provenance key must be computed over the DEID table's
    -- values, and the deid model keys on the RAW roster organization name, not
    -- the pcx_30_organization_override one. Using the coalesced name above would
    -- move the hash and the join would silently miss: measured on C7617267
    -- (SCH-DEMO), whose 2 radiation rows were exactly the ones that failed to
    -- match before this column existed.
    pt_roster.organization_name as uid_organization_name,
    -- NOT EMITTED -- needed to re-derive the dates from an accepted age.
    dob as uid_dob,

    -- identifier pair
    -- (qualified: initial_events also exposes research_id / organization_name)
    pt_roster.mrn,
    pt_roster.research_id,

    -- timing pairs (the calendar dates are projected in the final select, from
    -- the accepted age where one exists)
    age_at_radiation_start as age_at_radiation_start_days,
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
left join {{ ref('pcx_30_organization_override') }} ovr
    on ovr.research_id = pt_roster.research_id
left join initial_events on pt_roster.research_id = initial_events.research_id
where radiation = 'Yes'

),

keyed as (
    select
        published.*,
        {{ pcx_row_uid([
            'uid_organization_name',
            'research_id',
            'age_at_radiation_start_days',
            'age_at_radiation_stop_days',
            'radiation_site',
            'radiation_site_other',
            'radiation_type',
            'radiation_type_other',
            'total_radiation_dose',
            'total_radiation_dose_unit',
            'total_radiation_dose_focal',
            'total_radiation_dose_focal_unit',
            'is_initial_treatment',
        ]) }} as pcx_row_uid
    from published
),

prov as (
    {{ pcx_30_field_provenance_pivot('radiation', [
        'age_at_radiation_start_days',
        'age_at_radiation_stop_days',
        'radiation_site',
        'radiation_type',
        'total_radiation_dose',
        'total_radiation_dose_focal',
    ]) }}
)

-- Column list and order UNCHANGED from the pre-override view.
select
    keyed.organization_name,
    keyed.organization_code,
    keyed.mrn,
    keyed.research_id,
    date_add(keyed.uid_dob, interval cast(coalesce(
        prov.ov_age_at_radiation_start_days,
        keyed.age_at_radiation_start_days) as int) day) as radiation_start_date,
    coalesce(prov.ov_age_at_radiation_start_days,
             keyed.age_at_radiation_start_days) as age_at_radiation_start_days,
    date_add(keyed.uid_dob, interval cast(coalesce(
        prov.ov_age_at_radiation_stop_days,
        keyed.age_at_radiation_stop_days) as int) day) as radiation_stop_date,
    coalesce(prov.ov_age_at_radiation_stop_days,
             keyed.age_at_radiation_stop_days) as age_at_radiation_stop_days,
    coalesce(prov.ov_radiation_site, keyed.radiation_site) as radiation_site,
    keyed.radiation_site_other,
    coalesce(prov.ov_radiation_type, keyed.radiation_type) as radiation_type,
    keyed.radiation_type_other,
    coalesce(prov.ov_total_radiation_dose, keyed.total_radiation_dose)
        as total_radiation_dose,
    keyed.total_radiation_dose_unit,
    coalesce(prov.ov_total_radiation_dose_focal, keyed.total_radiation_dose_focal)
        as total_radiation_dose_focal,
    keyed.total_radiation_dose_focal_unit,
    keyed.is_initial_treatment
from keyed
left join prov on prov.pcx_row_uid = keyed.pcx_row_uid
