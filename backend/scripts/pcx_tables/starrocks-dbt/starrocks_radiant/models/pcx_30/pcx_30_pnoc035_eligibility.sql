{{ config(
    materialized='table',
    tags=['pcx_30', 'pnoc035']
) }}

-- radiant_data_dev.pcx_30_pnoc035_eligibility
--
-- PNOC035 trial-eligibility verdicts from BRIM -- the payload of the variable
-- '3.6 PNOC035 Eligibility', one row per patient.
--
-- Its two sources are NOT dbt models and must never become them: brim_output and
-- pcx_30_pnoc035_brim_url are both CREATE-IF-NOT-EXISTS tables holding data
-- recorded nowhere else (loader-appended exports; hand-curated links), and a dbt
-- table model drops and recreates. Their DDL lives in ../../../radiant-prod/tables/.
--
-- NO PATIENT IDENTIFIERS IN THIS FILE; the repo is PUBLIC. Research ids (C...) are
-- fine. An earlier revision hard-coded an MRN and a BRIM link in a CASE, which is
-- why the links are joined from their own table whose rows are never committed.
--
-- LATEST VINTAGE ONLY. brim_output is append-only, and a patient can hold an older
-- blank row plus a newer populated one, so without the row_number filter they
-- appear twice with disagreeing values. The variable is one-per-patient scope, so
-- there is no per-note fan-out to collapse.
--
-- THREE EXCLUSIONS. (1) Blank verdicts -- 20 patients carry the row, 3 a value; a
-- blank is not an eligibility finding. BRIM's non-answer vocabulary ('No evidence',
-- 'Not Applicable', zero-date sentinels) is NON-blank and would survive this
-- filter, but none of it appears on this variable, so no sentinel filter is
-- guessed at. (2) Synthetic patients, keyed on BRIM's own synthetic_data_flag
-- rather than on an id pattern, so a synthetic patient with a conventional id is
-- still caught. (3) Unresolvable identity is NOT excluded -- that is the combined
-- view's job.

with synthetic_patients as (
    select distinct patient_id
    from {{ source('dwh_source', 'brim_output') }}
    where name = 'synthetic_data_flag'
      and trim(coalesce(value, '')) <> ''
),

eligibility as (
    select
        b.patient_id,
        b.generated_value,
        b.value,
        b.reasoning,
        b.confidence,
        b.review_status,
        b.scope,
        b.note_id,
        b.source_file,
        b.loaded_at,
        row_number() over (
            partition by b.patient_id
            order by b.loaded_at desc
        ) as vintage_rank
    from {{ source('dwh_source', 'brim_output') }} b
    where b.name = '3.6 PNOC035 Eligibility'
      and trim(coalesce(b.value, '')) <> ''
      and b.patient_id not in (
          select patient_id from synthetic_patients where patient_id is not null
      )
)

select
    cast(e.patient_id as varchar(128))        as patient_mrn,
    cast(e.generated_value as varchar(65533)) as generated_value,
    cast(e.value as varchar(65533))           as eligibility_value,
    cast(e.reasoning as varchar(65533))       as reasoning,
    cast(e.confidence as varchar(64))         as confidence,
    cast(e.review_status as varchar(128))     as review_status,
    cast(e.scope as varchar(128))             as brim_scope,
    cast(e.note_id as varchar(256))           as note_id,
    cast(u.brim_url as varchar(512))          as brim_url,
    cast(e.source_file as varchar(256))       as source_file,
    e.loaded_at                               as brim_loaded_at
from eligibility e
left join {{ source('dwh_source', 'pcx_30_pnoc035_brim_url') }} u
    on u.patient_mrn = e.patient_id
where e.vintage_rank = 1
