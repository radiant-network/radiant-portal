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

published as (
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
            'age_at_surgery_days',
            'extent_of_tumor_resection',
            'is_initial_treatment',
        ]) }} as pcx_row_uid
    from published
),

prov as (
    -- Field provenance, pivoted to one row per release row. `!` marks a
    -- reviewer-accepted OVERRIDE (the value differs from what the curator
    -- typed); no marker means corroborated, value unchanged.
    {{ pcx_30_field_provenance_pivot('surgery', [
        'age_at_surgery_days',
        'extent_of_tumor_resection',
    ]) }}
)

-- Column order is the base table's, unchanged; field_provenance is appended
-- LAST so a positional consumer (the CSV exports) sees only an added column.
select
    keyed.organization_name,
    keyed.research_id,
    coalesce(prov.ov_age_at_surgery_days, keyed.age_at_surgery_days) as age_at_surgery_days,
    coalesce(prov.ov_extent_of_tumor_resection, keyed.extent_of_tumor_resection) as extent_of_tumor_resection,
    keyed.is_initial_treatment,
    prov.field_provenance
from keyed
left join prov on prov.pcx_row_uid = keyed.pcx_row_uid
