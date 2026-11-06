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
),

-- FIELD PROVENANCE AND REVIEWER OVERRIDES (added 2026-11-05)
-- -----------------------------------------------------------------------
-- `field_provenance` records, per row, which values an independent automated
-- source produced: `field=source`, with `!` marking a value a clinical
-- reviewer accepted IN PLACE OF the curator's. The rule is "provenance only,
-- UNLESS a reviewer accepts an overriding value" (owner, 2026-11-05).
-- Detail -- who decided, when, the original value, the case id -- lives in
-- `pcx_30_field_provenance` and `pcx_30_promotion_decisions`, deliberately NOT
-- in more columns here.
--
-- `protocol_name_and_arm` IS RECOMPOSED on an overridden row (2026-11-06).
-- It is the PARENT of `protocol_name` / `protocol_arm` -- both are derived from
-- it by splitting on the first colon -- so overriding the name alone left the
-- parent carrying the curator's original and the row self-contradicting: all 3
-- affected rows read `protocol_name_and_arm = 'Not Applicable'` beside a real
-- `protocol_name` of 17ST011 / MEMMAT / SJMB12.
--
-- The fix is the INVERSE of the split, not a new judgment: the arm is unchanged
-- and the name is the reviewer's accepted value, so recomposing the parent from
-- its own two parts asserts nothing nobody decided. Measured before applying it:
--   * `concat(protocol_name, ': ', protocol_arm)` reproduces
--     `protocol_name_and_arm` EXACTLY on all 1,187 colon-bearing rows (0 differ),
--     so the ': ' separator is the source's own spelling, not an imposed one;
--   * 0 rows have a colon AND `protocol_arm = 'Not Applicable'`, so the two
--     branches below partition cleanly and an arm whose literal text is
--     'Not Applicable' cannot be confused with "there is no arm";
--   * on the 4,489 colon-free rows `protocol_name` already equals
--     `protocol_name_and_arm` on 4,486 -- the 3 exceptions ARE these overrides.
--
-- Applied ONLY where an override exists. Unconditional recomposition measures
-- byte-identical today, but it would make this column a projection of its own
-- children forever, so a future upstream value spelled 'FOO:BAR' would be
-- silently respaced. Gating on the override keeps every unreviewed row exactly
-- as the curator wrote it.
--
-- NOT given its own provenance token: no reviewer decided this column, and
-- `field_provenance` already carries `protocol_name=curated_view!` on the row,
-- which is the signal that the pair was recomposed.

published as (

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

)
,

keyed as (
    -- pcx_row_uid -- md5 over every base column in DDL order, '|#|'-joined,
    -- with a NUL-wrapped NULL sentinel so a NULL and the literal 'NULL' hash
    -- differently. Reproduces promote_to_pcx30._uid EXACTLY: verified
    -- 2026-11-05 against all five live release tables, 38,488 of 38,488 rows.
    -- It is the only join key these tables have -- the models are
    -- `select distinct` with no row identity of their own -- and being
    -- content-addressed is the right failure mode: if an upstream value moves,
    -- the uid moves, the provenance join misses, and a stamp measured against
    -- the old value stops applying rather than being applied to a value nobody
    -- reviewed.
    select
        published.*,
        {{ pcx_row_uid([
            'organization_name',
            'research_id',
            'protocol_name_and_arm',
            'protocol_name',
            'protocol_arm',
            'chemotherapy_type',
            'age_at_regimen_start_days',
            'age_at_regimen_stop_days',
            'chemotherapy_agents',
            'is_initial_treatment',
        ]) }} as pcx_row_uid
    from published
),

prov as (
    -- Field provenance, pivoted to one row per release row. `!` marks a
    -- reviewer-accepted OVERRIDE (the value differs from what the curator
    -- typed); no marker means corroborated, value unchanged.
    {{ pcx_30_field_provenance_pivot('medical_therapy', [
        'age_at_regimen_start_days',
        'age_at_regimen_stop_days',
        'chemotherapy_agents',
        'chemotherapy_type',
        'protocol_name',
    ]) }}
)

-- Column order is the base table's, unchanged; field_provenance is appended
-- LAST so a positional consumer (the CSV exports) sees only an added column.
select
    keyed.organization_name,
    keyed.research_id,
    -- recomposed from its own parts ONLY on an overridden row; see the header
    case
        when prov.ov_protocol_name is null then keyed.protocol_name_and_arm
        when keyed.protocol_arm = 'Not Applicable' then prov.ov_protocol_name
        else concat(prov.ov_protocol_name, ': ', keyed.protocol_arm)
    end as protocol_name_and_arm,
    coalesce(prov.ov_protocol_name, keyed.protocol_name) as protocol_name,
    keyed.protocol_arm,
    coalesce(prov.ov_chemotherapy_type, keyed.chemotherapy_type) as chemotherapy_type,
    coalesce(prov.ov_age_at_regimen_start_days, keyed.age_at_regimen_start_days) as age_at_regimen_start_days,
    coalesce(prov.ov_age_at_regimen_stop_days, keyed.age_at_regimen_stop_days) as age_at_regimen_stop_days,
    coalesce(prov.ov_chemotherapy_agents, keyed.chemotherapy_agents) as chemotherapy_agents,
    keyed.is_initial_treatment,
    prov.field_provenance
from keyed
left join prov on prov.pcx_row_uid = keyed.pcx_row_uid
