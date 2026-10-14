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
        max(age_at_vital_status_days) as age_at_vital_status_days,
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
)

select
    research_id,
    age_at_vital_status_days,
    vital_status
from ranked_statuses
where rn = 1
