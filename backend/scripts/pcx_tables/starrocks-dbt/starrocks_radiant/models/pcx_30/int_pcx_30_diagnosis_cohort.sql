{{ config(
    materialized='table',
    tags=['pcx_30', 'intermediate']
) }}

{%- set cohort_scope = var('pcx_30_cohort_scope', 'atrt_mb') -%}

-- The `subj` CTE, lifted out of the five prelim_30_sql/prod scripts that each
-- carried a verbatim copy: the distinct (subject, cns_diagnosis_category) pairs
-- defining the PCX-30 cohort.
--
-- The commented-out coordinating_institution filter is carried over from the source
-- scripts, where it was present but disabled in every copy. Kept so the intent stays
-- visible and re-enabling it becomes a one-place change instead of five.
--
-- GRAIN: one row per (subject, cns_diagnosis_category). A patient carrying both an
-- ATRT and a Medulloblastoma diagnosis appears twice -- deliberate, and the reason
-- diagnosis_type_cohort can duplicate a patient downstream. Measured on prod
-- 2026-10-23: NO patient actually carries both (all 995 carry exactly one), so that
-- fan-out is theoretical rather than realised.
--
-- ---------------------------------------------------------------------------------
-- COHORT SCOPE IS VAR-GATED. DEFAULT IS THE CURATED COHORT.
-- ---------------------------------------------------------------------------------
-- This model is the SOLE chokepoint for cohort membership: int_pcx_30_cohort_roster
-- (which 6 of the 7 _deid models and all 8 combined views inner-join) and
-- pcx_30_demographics_deid (which joins this model directly) both read it.
--
--   pcx_30_cohort_scope = 'atrt_mb'        DEFAULT. The curated ATRT /
--                                          Medulloblastoma cohort -- 995 subjects
--                                          here, 970 patients after the enrollment
--                                          inner join downstream. Byte-identical to
--                                          the pre-var definition.
--
--   pcx_30_cohort_scope = 'all_diagnosed'  Every subject with a diagnosis row.
--                                          ATRT/MB keep their real category;
--                                          everyone else collapses to exactly ONE
--                                          'Not Applicable' row. 12,517 subjects
--                                          here, 6,963 patients downstream.
--
-- WHY A VAR AND NOT AN EDIT: UPSTREAM_SOURCES.md section 5 instructs an operator to
-- refresh all seven sources and then rebuild everything downstream. Without this
-- gate, the next routine `dbt run` -- by anyone, for an unrelated source refresh --
-- would silently publish a 7x cohort. Expanding must be a deliberate act with its
-- own command line:
--
--   dbt run --vars '{pcx_30_cohort_scope: all_diagnosed}'
--
-- The expansion is PLANNED BUT NOT APPROVED. See COHORT_EXPANSION_PLAN.md in
-- backend/scripts/pcx_tables -- section 5 carries the governance checkpoint, and
-- section 1 the authoritative statement of the collapse rule. Do not flip the
-- default until that checkpoint is signed.
--
-- AND NOTE THIS MODEL IS NOT SUFFICIENT ON ITS OWN. pcx_30_event_level_deid
-- (line 173) re-filters cns_diagnosis_category to the same two categories in its
-- own WHERE clause, so under 'all_diagnosed' a 'Not Applicable' patient gets no
-- 'Initial CNS Tumor' event, 3,313 of 6,963 patients get no event_level row at
-- all, and is_initial_treatment falls to 'no' for every newly admitted patient.
-- Measured 2026-10-23 -- see COHORT_EXPANSION_PLAN.md section 6b.
--
-- NOTE the accepted_values test on diagnosis_type_cohort (_pcx_30__models.yml) is
-- pinned to the two curated categories, so it FAILS under 'all_diagnosed' until
-- 'Not Applicable' is added to it. That is the guard working, not a defect.

{%- if cohort_scope == 'atrt_mb' %}

select distinct
    subject,
    cns_diagnosis_category
from {{ source('dwh_source', 'diagnosis') }}
where cns_diagnosis_category in (
    'Atypical teratoid/rhabdoid tumor',
    'Medulloblastoma'
)
-- and coordinating_institution in (
--     'The Children''s Hospital of Philadelphia',
--     'Seattle Children''s Hospital',
--     'UCSF Benioff Children''s Hospital'
-- )

{%- elif cohort_scope == 'all_diagnosed' %}

-- Arm 1: ATRT / Medulloblastoma subjects keep their real category, unchanged. A
-- subject who ALSO carries other categories is labelled by their ATRT/MB diagnosis
-- and receives no 'Not Applicable' row (97 subjects, measured 2026-10-23) -- which
-- is already the pre-expansion behaviour, since the curated filter dropped their
-- other categories too.
select distinct
    subject,
    cns_diagnosis_category
from {{ source('dwh_source', 'diagnosis') }}
where cns_diagnosis_category in (
    'Atypical teratoid/rhabdoid tumor',
    'Medulloblastoma'
)

union all

-- Arm 2: every other subject collapses to exactly ONE 'Not Applicable' row,
-- regardless of how many distinct categories they carry (467 of the newly admitted
-- carry 2+, up to 4). The collapse is what keeps the downstream grain at one row per
-- patient; without it those subjects duplicate across every grain.
--
-- NOT EXISTS, not NOT IN: a single NULL subject in the subquery would make `not in`
-- return zero rows for every candidate. There are no NULL subjects on prod today
-- (verified 2026-10-23), so this is defence against a future load, not a live fix.
--
-- 'Not Reported' is the largest category admitted here (4,586 subjects). It is a real
-- registry value meaning the category was not stated, and it is not ATRT or
-- Medulloblastoma, so it collapses like everything else -- confirmed by the data
-- owner 2026-10-23.
select distinct
    d.subject,
    'Not Applicable' as cns_diagnosis_category
from {{ source('dwh_source', 'diagnosis') }} d
where not exists (
    select 1
    from {{ source('dwh_source', 'diagnosis') }} atrt_mb
    where atrt_mb.subject = d.subject
      and atrt_mb.cns_diagnosis_category in (
          'Atypical teratoid/rhabdoid tumor',
          'Medulloblastoma'
      )
)

{%- else %}
{{ exceptions.raise_compiler_error(
    "pcx_30_cohort_scope must be 'atrt_mb' or 'all_diagnosed', got: '" ~ cohort_scope ~ "'"
) }}
{%- endif %}
