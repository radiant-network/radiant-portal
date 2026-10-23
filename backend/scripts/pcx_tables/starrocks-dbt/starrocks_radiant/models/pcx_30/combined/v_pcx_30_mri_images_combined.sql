{{ config(
    materialized='view',
    tags=['pcx_30', 'combined', 'phi']
) }}

-- Combined identified + de-identified MRI imaging sessions in ONE relation.
--
-- CONTAINS PHI (mrn + calendar session_date alongside research_id). Internal use only.
--
-- Field pairing rule: identical columns appear once; differing columns appear twice,
-- adjacent, identified value first.
--   mrn          / research_id
--   session_date / age_at_session_days
--
-- This is the one pcx_30 combined view with NO underlying pcx_30 base table -- it
-- reads imaging_sessions directly.
--
-- SOURCE: imaging_sessions (loaded 2026-09-28, 46,420 rows). imaging_sessions.subject
-- IS the de-identified research_id, so it is aliased as such here. 2,954 of its 2,960
-- distinct subjects match stg_cbtn_enrollment_final.research_id; the inner join drops
-- the other 6.
--
-- COHORT FILTER: the subj CTE restricts to the two release diagnoses, matching every
-- other pcx_30 object. This is load-bearing, not cosmetic -- the base table holds
-- imaging for the whole CBTN population (2,960 subjects across 45 Flywheel projects
-- incl. LGG, Ependymoma, HGG, Schwannoma). With the filter the view returns ~8.9k
-- rows / 441 subjects; without it, 46,420 rows.
--
-- NOTE on `where imaging_modality = 'MRI'`: every row in imaging_sessions is
-- currently MRI, so this is a no-op today. It is kept so the view name stays true if
-- other modalities are ever loaded, mirroring the peers' `where surgery='Yes'` /
-- `where radiation='Yes'` predicates.
--
-- NOTE on the -1 sentinel: this domain has NONE. age_at_session_days is an integer
-- 0..44945 with no unknown-date sentinel, so session_date needs no caveat -- unlike
-- pcx_30_surgery_level and pcx_30_event_level, where -1 makes date_add(dob, -1 day)
-- yield dob minus one day.
--
-- NOTE on `select distinct`: stg_cbtn_enrollment_final holds 7,157 rows for 7,116
-- distinct research_id, so the roster join can fan out on a multi-MRN patient. None of
-- this cohort's imaging is affected today (rows = distinct session_id), but distinct
-- guards it, as in the peer views. pcx_30_organization_ref.name is unique across its
-- 44 rows, so that LEFT JOIN cannot fan out.
--
-- NOTE on flywheel_url: the chop.flywheel.io host is correct for EVERY row regardless
-- of contributing institution -- CHOP hosts all images for all sites.
--
-- PHASE 3: the cohort roster is now a ref to int_pcx_30_cohort_roster, shared with
-- every other pcx_30 object. The COHORT FILTER note above is why that matters here
-- more than anywhere else: this view's base table holds the whole CBTN imaging
-- population, so the roster join is what makes it a pcx_30 relation at all.

with pt_roster as (
    select * from {{ ref('int_pcx_30_cohort_roster') }}
)

select distinct
    pt_roster.organization_name,
    org.code as organization_code,

    -- identifier pair
    pt_roster.mrn,
    pt_roster.research_id,

    -- flywheel identity (identical in both builds)
    imaging_sessions.flywheel_subject_id,
    imaging_sessions.flywheel_project_id,
    imaging_sessions.flywheel_project_name,
    imaging_sessions.session_id,
    imaging_sessions.session_name,

    -- timing pair
    date_add(pt_roster.dob, interval cast(imaging_sessions.age_at_session_days as int) day) as session_date,
    imaging_sessions.age_at_session_days,

    -- identical in both builds
    imaging_sessions.anatomical_site,
    imaging_sessions.imaging_modality,
    concat(
        'https://chop.flywheel.io/#/projects/',
        imaging_sessions.flywheel_project_id,
        '/sessions/',
        imaging_sessions.session_id
    ) as flywheel_url
from {{ source('dwh_source', 'imaging_sessions') }} imaging_sessions
inner join pt_roster on imaging_sessions.subject = pt_roster.research_id
left join {{ ref('pcx_30_organization_ref') }} org
    on org.name = pt_roster.organization_name
where imaging_sessions.imaging_modality = 'MRI'
