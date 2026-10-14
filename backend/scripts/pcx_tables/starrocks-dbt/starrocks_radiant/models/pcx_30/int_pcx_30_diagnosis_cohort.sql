{{ config(
    materialized='table',
    tags=['pcx_30', 'intermediate']
) }}

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
-- diagnosis_type_cohort can duplicate a patient downstream.

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
