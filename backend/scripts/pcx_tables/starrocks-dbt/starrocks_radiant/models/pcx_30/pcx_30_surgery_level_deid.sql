{{ config(
    materialized='table',
    tags=['pcx_30', 'deid']
) }}

-- De-identified surgery level table.
--
-- is_initial_treatment: 'yes' when the surgery occurred on or after the
-- initial-diagnosis event and on or before the first SUBSEQUENT disease event, i.e.
-- part of frontline management of the initial tumour rather than surgery for a
-- progression/recurrence. Window anchors come from int_pcx_30_initial_events -- see
-- that model for the -1 anchor guard, which flipped 4 rows / 3 patients here (1 row
-- no->yes for C851283, whose Deceased=-1 had emptied the window, and 3 rows yes->no
-- for the 2 patients whose Initial CNS Tumor is -1 and were previously admitted by a
-- window opening at -1). Both directions are corrections.
--
-- 'no' CONFLATES "not frontline" WITH "cannot tell". For surgery, age_at_surgery
-- carries BOTH unknown conventions -- measured on prod 2026-10-01 over 9719
-- surgery='Yes' rows:
--   * 11 rows are string sentinels ('Not Reported', or NULL) -> cast() yields NULL
--     -> between yields NULL -> 'no'. Catch with cast(age_at_surgery as int) is null.
--   * 32 rows are exactly -1 and 36 are < 0 -> these cast CLEANLY, so they compare as
--     real numbers, fall below the diagnosis anchor, and land in 'no'. They are NOT
--     catchable with `is null` -- test cast(age_at_surgery as int) < 0.
-- So treat 'no' as "not known to be initial treatment". Do not count non-frontline
-- surgeries off this column without excluding BOTH unknown forms.
--
-- MEASURED on the 2026-10-01 build (1278 rows):
--   1145 'yes' (925 pts) / 133 'no' (92 pts). Of the 133 'no':
--     97 rows / 71 pts  genuine -- surgery outside the frontline window
--     30 rows / 19 pts  INDETERMINATE -- no usable initial-diagnosis anchor
--      3 rows /  2 pts  INDETERMINATE -- age_at_surgery is -1/negative
--      3 rows /  3 pts  INDETERMINATE -- age_at_surgery is a string sentinel
--   i.e. 36 of 133 'no' (27%) is an unavailable source read as a clinical negative.

with pt_roster as (
    select * from {{ ref('int_pcx_30_cohort_roster') }}
),

initial_events as (
    select * from {{ ref('int_pcx_30_initial_events') }}
)

select distinct
    pt_roster.organization_name,
    pt_roster.research_id,
    treatment.age_at_surgery as age_at_surgery_days,
    treatment.extent_of_tumor_resection,
    case
        when cast(treatment.age_at_surgery as int)
            between initial_events.age_at_initial_dx_days
            and coalesce(initial_events.age_at_first_event_days, 100000)
        then 'yes' else 'no'
    end as is_initial_treatment
from {{ source('dwh_source', 'treatment') }} treatment
inner join pt_roster on treatment.subject = pt_roster.research_id
left join initial_events on pt_roster.research_id = initial_events.research_id
where treatment.surgery = 'Yes'
