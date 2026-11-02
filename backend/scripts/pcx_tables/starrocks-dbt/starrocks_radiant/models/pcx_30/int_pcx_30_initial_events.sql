{{ config(
    materialized='table',
    tags=['pcx_30', 'intermediate']
) }}

-- The `initial_events` CTE, which the source scripts carried as three byte-identical
-- copies in pcx_30_medical_therapy_level, pcx_30_surgery_level and
-- pcx_30_radiation_level, with headers instructing the reader to "change all of them
-- together". That instruction is now enforced by ref() -- this is the single copy.
--
-- Defines the frontline window per patient: open at the initial-diagnosis event,
-- close at the first SUBSEQUENT disease event. 'Deceased' counts as a terminating
-- first event, so for a patient whose only non-initial event is death the window is
-- dx..death.
--
-- ANCHOR GUARD (`>= 0`) IS LOAD-BEARING. pcx_30_event_level_deid uses -1 for an
-- unknown event date and both anchors are min() values, so an unknown date WINS the
-- minimum and corrupts the window. Measured on prod 2026-10-01: 5 event rows carry
-- -1, affecting 5 patients -- 2 whose Initial CNS Tumor is -1 (window would open at
-- -1, making every later course a false 'yes') and 3 whose Deceased event is -1
-- (upper bound falls below the diagnosis age, emptying the window so every course is
-- a false 'no'; e.g. C851283, Initial 486 / Recurrence 730 / Deceased -1, whose real
-- window is [486,730]). The guard excludes -1 from both min()s so an unknown
-- collapses to NULL -> 'no' (indeterminate) rather than silently inverting the flag.
--
-- `like 'Initial%'` matched ONLY 'Initial CNS Tumor' when last profiled (2026-10-01;
-- event_type vocabulary closed at 7 values), which is exactly the value excluded from
-- the age_at_first_event_days arm -- so the two arms are consistent. A new 'Initial *'
-- event type would silently collapse the window to a single day. Re-profile if the
-- vocabulary grows.
--
-- age_at_initial_dx_days is deliberately NOT coalesced: a patient with no Initial
-- event, or absent from the event table, yields NULL -> 'no'.
--
-- NOT TO BE REUSED BY pcx_30_treatment_summary_deid, which needs the UNGUARDED form
-- -- it publishes these two columns, and the data dictionary documents -1 as the
-- unknown-date marker, so -1 must pass through there. See that model's header.
--
-- GRAIN: one row per (research_id, organization_name).

select
    research_id,
    organization_name,
    min(cast(age_at_event_days as int))
        filter (where event_type like 'Initial%'
                and cast(age_at_event_days as int) >= 0) as age_at_initial_dx_days,
    min(cast(age_at_event_days as int))
        filter (where event_type not in ('Initial CNS Tumor', 'Unavailable', 'Not Reported')
                and cast(age_at_event_days as int) >= 0) as age_at_first_event_days
from {{ ref('pcx_30_event_level_deid') }}
group by research_id, organization_name
