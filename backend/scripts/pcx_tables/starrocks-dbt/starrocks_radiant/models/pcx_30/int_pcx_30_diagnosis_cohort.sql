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
--                                          Medulloblastoma cohort -- 970 subjects
--                                          here, 970 patients after the enrollment
--                                          inner join downstream. Publishes
--                                          identically to the pre-var definition
--                                          (see the study-filter note below).
--
--   pcx_30_cohort_scope = 'all_diagnosed'  Every subject with a CBTN-study diagnosis
--                                          row. ATRT/MB keep their real category;
--                                          everyone else collapses to exactly ONE
--                                          'Not Applicable' row. 6,957 subjects
--                                          here, 6,957 patients downstream.
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
-- re-filters cns_diagnosis_category to the same two categories in its own WHERE
-- clause. That is what the 3,313-of-6,963-patients-with-no-event_level-row figure
-- (measured 2026-10-23, COHORT_EXPANSION_PLAN.md section 6b) refers to, and the
-- third union arm added in the same commit CLOSED it: the live all_cbtn build has
-- 6,957 of 6,963 patients carrying an event_level row. The residual 6 were the study
-- filter below, not the category filter, and are now excluded at this chokepoint
-- instead -- so the two surfaces finally agree on the denominator.
--
-- NOTE the accepted_values test on diagnosis_type_cohort (_pcx_30__models.yml) is
-- pinned to the two curated categories, so it FAILS under 'all_diagnosed' until
-- 'Not Applicable' is added to it. That is the guard working, not a defect.
--
-- ---------------------------------------------------------------------------------
-- research_study_name = 'CBTN' IS REQUIRED ON EVERY ARM. Added 2026-10-30.
-- ---------------------------------------------------------------------------------
-- WHY: pcx_30_event_level_deid has ALWAYS carried this filter on every union arm
-- (inherited verbatim from radiant-prod/tables/event_level_fields_openpedcan_prod.sql,
-- whose header records the cohort as profiled with research_study_name = 'CBTN'), and
-- event_level feeds int_pcx_30_initial_events, which anchors is_initial_treatment and
-- treatment_summary. This model did NOT carry it. Under 'atrt_mb' that divergence was
-- invisible; under 'all_diagnosed' it admitted 6 patients to the roster -- and so to
-- demographics -- that every other grain then dropped.
--
-- The 6 are the 'CHOP Fly RNASeq' group (participants.research_study_name), measured
-- on prod 2026-10-30: C3360729, C3361344, C3361467, C3361590, C3361713, C3361836, all
-- at CBTN Non-Consortium Member. Each carries exactly ONE diagnosis row, and it is a
-- placeholder -- event_type 'Unavailable', cns_diagnosis_category 'Not Reported',
-- diagnosis 'Other', age_at_event_days 0 -- so they published as demographics-only
-- rows (6,963 demographics vs 6,957 everywhere else). They were the ENTIRE population
-- the filter excludes: of 6,963 roster patients exactly 6 had no CBTN-study diagnosis
-- row.
--
-- MEASURED BLAST RADIUS (prod, 2026-10-30):
--   * 'atrt_mb' PUBLISHES IDENTICALLY. This model drops 995 -> 970 rows, but all 25
--     dropped subjects are absent from stg_cbtn_enrollment_final, and all three
--     consumers (int_pcx_30_cohort_roster, pcx_30_demographics_deid,
--     v_pcx_30_demographics_combined) inner-join it. Curated patients lost: 0.
--     Published count stays 970.
--   * 'all_diagnosed' goes 12,517 -> 6,957 subjects here and 6,963 -> 6,957 patients
--     downstream, which is the point: demographics now agrees with every other grain.
--   * No diagnosis_type_cohort label flips. The ATRT/MB grain is one category per
--     subject both before and after (995 pairs / 995 subjects -> 970 / 970), so no
--     subject keeps one category while losing another.
--
-- 31 subjects carry an ATRT/MB diagnosis under a non-CBTN study (Penn NTTB 12,
-- PNOC027 11, DGD 8). 6 of them are in the curated roster, and all 6 ALSO carry
-- CBTN-study ATRT/MB rows, which is why the curated count does not move. If upstream
-- re-labels a study, that is where the curated cohort would shrink -- re-measure
-- there before blaming this filter.

{%- if cohort_scope == 'atrt_mb' %}

select distinct
    subject,
    cns_diagnosis_category
from {{ source('dwh_source', 'diagnosis') }}
where research_study_name = 'CBTN'
  and cns_diagnosis_category in (
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
where research_study_name = 'CBTN'
  and cns_diagnosis_category in (
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
-- The study filter is applied on BOTH sides -- the outer row and the NOT EXISTS
-- probe -- and the probe side is the subtle one. If the outer admitted a subject on
-- their CBTN-study row while the probe still saw their non-CBTN ATRT/MB row, arm 1
-- would have filtered them out and arm 2 would exclude them as "already ATRT/MB", so
-- they would vanish from the cohort entirely. Measured on prod 2026-10-30: 0 subjects
-- are in that position, so this is defence against a future load, not a live fix --
-- same posture as the NOT EXISTS choice itself.
select distinct
    d.subject,
    'Not Applicable' as cns_diagnosis_category
from {{ source('dwh_source', 'diagnosis') }} d
where d.research_study_name = 'CBTN'
  and not exists (
    select 1
    from {{ source('dwh_source', 'diagnosis') }} atrt_mb
    where atrt_mb.subject = d.subject
      and atrt_mb.research_study_name = 'CBTN'
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
