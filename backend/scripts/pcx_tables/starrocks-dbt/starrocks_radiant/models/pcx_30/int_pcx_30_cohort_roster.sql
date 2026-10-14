{{ config(
    materialized='table',
    tags=['pcx_30', 'intermediate']
) }}

-- Cohort definition for the PCX-30 slate: CBTN enrollees carrying an ATRT or
-- Medulloblastoma CNS diagnosis.
--
-- Extracted from the `subj` + `pt_roster` CTEs that were copy-pasted across the
-- prelim_30_sql/prod scripts, so the cohort is defined in exactly one place.
--
-- GRAIN: one row per (research_id, diagnosis_type_cohort, mrn) -- NOT one row per
-- patient. A patient with both an ATRT and a Medulloblastoma diagnosis appears
-- twice, and a patient with more than one MRN appears once per MRN. Both fan-outs
-- are inherited from the original CTEs and preserved deliberately; every
-- downstream consumer absorbs them with distinct/max aggregation.

with subj as (
    select * from {{ ref('int_pcx_30_diagnosis_cohort') }}
)

select
    enr.mrn,
    enr.research_id,
    cast(enr.dob as date) as dob,
    enr.organization_name,
    subj.cns_diagnosis_category as diagnosis_type_cohort,
    case
        when mrn_list.mrn is null then 'cbtn-non-radiant'
        else 'radiant'
    end as data_type_cohort
from {{ source('dwh_source', 'stg_cbtn_enrollment_final') }} enr
left join {{ ref('radiant_patient_mrn_list') }} mrn_list
    on enr.mrn = mrn_list.mrn
inner join subj
    on subj.subject = enr.research_id
