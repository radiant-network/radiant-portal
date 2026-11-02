{{ config(
    materialized='table',
    tags=['pcx_30', 'deid']
) }}

-- De-identified medical therapy (chemotherapy) level table.
--
-- is_initial_treatment: 'yes' when the regimen started on or after the
-- initial-diagnosis event and on or before the first SUBSEQUENT disease event, i.e.
-- upfront/frontline therapy for the initial tumour rather than therapy for a
-- progression/recurrence. `between` is inclusive, so a regimen starting exactly ON
-- the first-event day is 'yes'. The window anchors come from
-- int_pcx_30_initial_events -- see that model for the -1 anchor guard.
--
-- KNOWN LIMITATION -- 'no' CONFLATES "not frontline" WITH "cannot tell".
-- Decided 2026-10-01: keep the 2-value 'yes'/'no' vocabulary and document the
-- overstatement rather than adding an 'unknown' third value.
--   treatment.age_at_chemo_start carries SENTINEL STRINGS, not only numbers:
--   'Not Available' (93 rows), 'Not Applicable' (38), 'Not Reported' (14). They are
--   non-NULL so they survive the select distinct, but cast(... as int) yields NULL,
--   so `between` yields NULL and the case falls through to 'no'.
--   Measured breakdown of the 535 'no' rows on the 2026-10-01 build:
--       372 rows / 182 pts  genuine -- chemo started outside the frontline window
--       145 rows / 119 pts  INDETERMINATE -- start age is a sentinel string
--        18 rows /   7 pts  INDETERMINATE -- no Initial event to anchor on
--   i.e. ~30% of 'no' (163 rows, 126 pts) is an unavailable SOURCE presented as a
--   clinical NEGATIVE. Anyone filtering is_initial_treatment = 'no', or counting
--   non-frontline regimens off this column, inherits that overstatement silently.
--   To separate them, test cast(age_at_chemo_start as int) is null -- NOT
--   age_at_chemo_start is null, which matches 0 rows.
--
-- initial_events is joined on research_id ALONE, narrower than its
-- (research_id, organization_name) grain. Profiled 2026-10-01: 0 research_ids carry
-- more than one organization_name, so this cannot fan out today. Re-check if that
-- ever becomes non-zero.
--
-- Aggregate FILTER (WHERE ...) is supported on this StarRocks version (verified
-- 2026-10-01) -- used in int_pcx_30_initial_events.

with treatment as (
    select
        t.*,
        -- QUOTE STRIP. 190 source rows carry LITERAL double quotes in
        -- protocol_name_unmasked_internal_use (a CSV load artifact on values
        -- containing commas), and the published table does not. 5 of those rows
        -- carry quotes NOT purely at both ends, so this is replace-all rather than
        -- trim(both '"' from ...). Verified against the live build: stripping
        -- reproduces its protocol value set exactly (0 missing either way), while
        -- passing the raw column through misses 12 distinct values.
        --
        -- SCOPED TO THIS COLUMN ONLY. chemotherapy_agents_unmasked_internal_use also
        -- carries quotes in 56 source rows and the published table RETAINS them (2
        -- such rows in cohort) -- so stripping it would be its own regression. Do not
        -- "tidy" that column to match this one.
        replace(t.protocol_name_unmasked_internal_use, '"', '') as protocol_clean
    from {{ source('dwh_source', 'treatment') }} t
),

pt_roster as (
    select * from {{ ref('int_pcx_30_cohort_roster') }}
),

initial_events as (
    select * from {{ ref('int_pcx_30_initial_events') }}
)

select distinct
    pt_roster.organization_name,
    pt_roster.research_id,
    treatment.protocol_clean as protocol_name_and_arm,
    -- protocol_name / protocol_arm: split protocol_name_and_arm on its FIRST colon
    -- (added 2026-10-02). protocol_name repeats the whole value when there is no
    -- colon, so a sentinel such as 'Not Applicable' / 'Not Reported' / 'Other'
    -- appears unchanged and the column can be grouped on. protocol_arm keeps any
    -- FURTHER colons (e.g. 'Stratum N1: Standard Risk') and is 'Not Applicable' when
    -- there is no colon -- which covers BOTH a protocol with genuinely no arm AND a
    -- protocol that is itself unrecorded, so read protocol_name before treating this
    -- as an absence of arm.
    -- Splits the QUOTE-STRIPPED value, so a quoted source row yields a clean name.
    if(instr(treatment.protocol_clean, ':') > 0,
       trim(substr(treatment.protocol_clean, 1,
                   instr(treatment.protocol_clean, ':') - 1)),
       treatment.protocol_clean) as protocol_name,
    if(instr(treatment.protocol_clean, ':') > 0,
       trim(substr(treatment.protocol_clean,
                   instr(treatment.protocol_clean, ':') + 1)),
       'Not Applicable') as protocol_arm,
    treatment.chemotherapy_type,
    treatment.age_at_chemo_start as age_at_regimen_start_days,
    treatment.age_at_chemo_stop as age_at_regimen_stop_days,
    treatment.chemotherapy_agents_unmasked_internal_use as chemotherapy_agents,
    case
        when cast(treatment.age_at_chemo_start as int)
            between initial_events.age_at_initial_dx_days
            and coalesce(initial_events.age_at_first_event_days, 100000)
        then 'yes' else 'no'
    end as is_initial_treatment
from treatment
inner join pt_roster on treatment.subject = pt_roster.research_id
left join initial_events on pt_roster.research_id = initial_events.research_id
where treatment.chemotherapy = 'Yes'
