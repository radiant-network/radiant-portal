{{ config(
    materialized='table',
    tags=['pcx_30', 'deid']
) }}

-- One vital-status record per patient, de-identified.
--
-- Picks the winning status out of the candidate set: deceased (priority 1) outranks
-- alive/other (2), and within a tier the largest day-count wins. `nulls last` keeps
-- an undated candidate from beating a dated one inside the same tier -- it does not
-- demote an undated deceased record below a dated alive one, because priority_score
-- is the leading sort key.
--
-- RE-AGGREGATION STEP. int_pcx_30_vital_status_events is grained finer than this
-- table needs -- it carries mrn / dob / organization_name so the combined view can
-- project the identified side off the same stream. Regrouping to
-- (research_id, vital_status) here is LOSS-FREE because max() and min() are
-- associative: max over a set of per-MRN maxima equals max over the raw stream, and
-- likewise min for priority_score. It only materializes a difference for a multi-MRN
-- patient, whose per-MRN rows collapse back together here.
--
-- GRAIN: one row per research_id -- enforced by the unique test in
-- _pcx_30__models.yml, which is the assertion this model exists to satisfy.

with grouped_events as (
    select
        research_id,
        -- cast kept explicit: this is the PUBLISHED column, and an age in days is an
        -- integer. Without it the FLOAT source propagated through to decimal(38,9)
        -- and rendered as '5541.000000000'. Fixed at source in
        -- int_pcx_30_vital_status_events; this guarantees the published type.
        cast(max(age_at_vital_status_days) as int) as age_at_vital_status_days,
        vital_status,
        min(priority_score) as priority_score
    from {{ ref('int_pcx_30_vital_status_events') }}
    group by research_id, vital_status
),

ranked_statuses as (
    select
        research_id,
        age_at_vital_status_days,
        vital_status,
        row_number() over (
            partition by research_id
            order by priority_score asc, age_at_vital_status_days desc nulls last
        ) as rn
    from grouped_events
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
select
    research_id,
    age_at_vital_status_days,
    vital_status
from ranked_statuses
where rn = 1

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
            'research_id',
            'age_at_vital_status_days',
            'vital_status',
        ]) }} as pcx_row_uid
    from published
),

prov as (
    -- Field provenance, pivoted to one row per release row. `!` marks a
    -- reviewer-accepted OVERRIDE (the value differs from what the curator
    -- typed); no marker means corroborated, value unchanged.
    {{ pcx_30_field_provenance_pivot('patient', [
        'age_at_vital_status_days',
        'vital_status',
    ]) }}
)

-- Column order is the base table's, unchanged; field_provenance is appended
-- LAST so a positional consumer (the CSV exports) sees only an added column.
select
    keyed.research_id,
    coalesce(prov.ov_age_at_vital_status_days, keyed.age_at_vital_status_days) as age_at_vital_status_days,
    coalesce(prov.ov_vital_status, keyed.vital_status) as vital_status,
    prov.field_provenance
from keyed
left join prov on prov.pcx_row_uid = keyed.pcx_row_uid
