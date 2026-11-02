{{ config(
    materialized='table',
    tags=['pcx_30', 'deid']
) }}

-- De-identified radiation course level table.
--
-- is_initial_treatment: 'yes' when the radiation course started on or after the
-- initial-diagnosis event and on or before the first SUBSEQUENT disease event, i.e.
-- part of frontline management of the initial tumour rather than radiation for a
-- progression/recurrence. Anchored on the course START age, matching how the therapy
-- model anchors on regimen start. Window anchors come from int_pcx_30_initial_events
-- -- see that model for the -1 anchor guard.
--
-- 'no' CONFLATES "not frontline" WITH "cannot tell", and RADIATION IS THE WORST
-- AFFECTED OF THE THREE TREATMENT TABLES. Measured on prod 2026-10-01 over 3333
-- radiation='Yes' rows, 507 (15.2%) have a non-numeric age_at_radiation_start --
-- 403 'Not Available' and 104 'Not Reported' -- which cast to NULL, so `between`
-- yields NULL and the row lands in 'no'. Unlike surgery there are no -1 or negative
-- values here, so the single catch-all is
-- cast(age_at_radiation_start as int) is null.
--
-- MEASURED on the 2026-10-01 build (771 rows):
--   530 'yes' (524 pts) / 241 'no' (197 pts). Of the 241 'no':
--     152 rows / 123 pts  genuine -- course started outside the frontline window
--      85 rows /  78 pts  INDETERMINATE -- age_at_radiation_start is a sentinel
--       4 rows /   2 pts  INDETERMINATE -- no usable initial-diagnosis anchor
--   i.e. 89 of 241 'no' (37%) is an unavailable source read as a clinical negative --
--   the highest indeterminate share of the three. Treat 'no' as "not known to be
--   initial radiation"; roughly one row in seven is an unavailable START DATE being
--   reported as non-frontline, so do not count non-frontline courses off this column
--   without excluding that population.
--   (The 507 sentinel rows in the source collapse to 85 here because select distinct
--   dedupes rows whose remaining columns match. age_at_radiation_stop carries the
--   same sentinels -- 378 'Not Available', 136 'Not Reported' -- but the flag does
--   not read the stop age.)

with pt_roster as (
    select * from {{ ref('int_pcx_30_cohort_roster') }}
),

initial_events as (
    select * from {{ ref('int_pcx_30_initial_events') }}
)

select distinct
    pt_roster.organization_name,
    pt_roster.research_id,
    treatment.age_at_radiation_start as age_at_radiation_start_days,
    treatment.age_at_radiation_stop as age_at_radiation_stop_days,
    treatment.radiation_site,
    treatment.radiation_site_other,
    treatment.radiation_type,
    treatment.radiation_type_other,
    treatment.total_radiation_dose,
    treatment.total_radiation_dose_unit,
    treatment.total_radiation_dose_focal,
    treatment.total_radiation_dose_focal_unit,
    case
        when cast(treatment.age_at_radiation_start as int)
            between initial_events.age_at_initial_dx_days
            and coalesce(initial_events.age_at_first_event_days, 100000)
        then 'yes' else 'no'
    end as is_initial_treatment
from {{ source('dwh_source', 'treatment') }} treatment
inner join pt_roster on treatment.subject = pt_roster.research_id
left join initial_events on pt_roster.research_id = initial_events.research_id
where treatment.radiation = 'Yes'
