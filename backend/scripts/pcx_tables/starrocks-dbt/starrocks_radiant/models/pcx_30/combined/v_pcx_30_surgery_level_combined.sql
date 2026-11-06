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
),

-- REVIEWER OVERRIDES (added 2026-11-05) -- applies the same reviewer-accepted
-- values as pcx_30_surgery_level_deid. This grain has NO overrides today (only
-- corroborations), so it is currently value-neutral; it is wired now so the next
-- accepted decision needs no schema change. `surgery_date` is re-derived from an
-- accepted age (view-only, a pure projection of it); `is_initial_treatment`
-- deliberately does not cascade, matching the deid model.
published as (

select distinct
    -- pcx_30_organization_override wins where it carries the patient; see the seed's
    -- description in seeds/_pcx_30__seeds.yml. Empty seed = byte-identical.
    coalesce(ovr.organization_name, pt_roster.organization_name) as organization_name,
    coalesce(ovr.organization_code, org.code) as organization_code,

    -- NOT EMITTED -- the provenance key is computed over the DEID values, and
    -- the deid model keys on the RAW roster organization name, not the
    -- pcx_30_organization_override one (measured on C7617267, SCH-DEMO).
    pt_roster.organization_name as uid_organization_name,
    -- NOT EMITTED -- needed to re-derive surgery_date from an accepted age.
    dob as uid_dob,

    -- identifier pair
    -- (qualified: initial_events also exposes research_id / organization_name)
    pt_roster.mrn,
    pt_roster.research_id,

    -- timing pair (the calendar date is projected in the final select)
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
left join {{ ref('pcx_30_organization_override') }} ovr
    on ovr.research_id = pt_roster.research_id
left join initial_events on pt_roster.research_id = initial_events.research_id
where surgery = 'Yes'

),

keyed as (
    select
        published.*,
        {{ pcx_row_uid([
            'uid_organization_name',
            'research_id',
            'age_at_surgery_days',
            'extent_of_tumor_resection',
            'is_initial_treatment',
        ]) }} as pcx_row_uid
    from published
),

prov as (
    {{ pcx_30_field_provenance_pivot('surgery', [
        'age_at_surgery_days',
        'extent_of_tumor_resection',
    ]) }}
)

-- Column list and order UNCHANGED from the pre-override view.
select
    keyed.organization_name,
    keyed.organization_code,
    keyed.mrn,
    keyed.research_id,
    date_add(keyed.uid_dob, interval cast(coalesce(
        prov.ov_age_at_surgery_days,
        keyed.age_at_surgery_days) as int) day) as surgery_date,
    coalesce(prov.ov_age_at_surgery_days, keyed.age_at_surgery_days)
        as age_at_surgery_days,
    coalesce(prov.ov_extent_of_tumor_resection, keyed.extent_of_tumor_resection)
        as extent_of_tumor_resection,
    keyed.is_initial_treatment
from keyed
left join prov on prov.pcx_row_uid = keyed.pcx_row_uid
