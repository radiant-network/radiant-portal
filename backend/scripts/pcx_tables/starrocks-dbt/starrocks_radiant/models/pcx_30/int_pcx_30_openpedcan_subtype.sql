{{ config(
    materialized='table',
    tags=['pcx_30', 'intermediate']
) }}

-- The `opc_specific` CTE from event_level_fields_openpedcan_prod.sql: one row per
-- sample_id carrying ONLY an allowlisted OpenPedCan molecular subtype, already
-- mapped into the CBTN cns_integrated_diagnosis vocabulary.
--
-- CLOSED POSITIVE ALLOWLIST, not a non-null test (source caveat 2). For cohort
-- NOS/NEC samples `integrated_diagnosis` also contains 'Not Reported', bare
-- 'Medulloblastoma', bare 'Atypical Teratoid Rhabdoid Tumor (ATRT)',
-- 'Medulloblastoma, NOS or NEC' and 'CNS Embryonal tumor, NEC/NOS' -- none of which
-- are upgrades, and a coalesce() on non-null would ship 'Not Reported' as a
-- diagnosis. Adding a new subtype to the source means adding it here deliberately.
--
-- NO NEW PERMITTED VALUES (caveat 5): every mapping target already exists in the
-- CBTN cns_integrated_diagnosis vocabulary. Two mappings differ only in case
-- ('group 3'/'group 4' -> 'Group 3'/'Group 4').
--
-- 'Medulloblastoma, SHH-activated' (50 samples) IS DELIBERATELY EXCLUDED (caveat 6):
-- OpenPedCan does not split SHH by TP53 status, and the CBTN vocabulary has only the
-- TP53-wildtype / TP53-mutant forms. Emitting the unqualified term would introduce a
-- value outside the CBTN list; picking a TP53 variant would be an unsupported
-- clinical claim. Those samples stay 'Medulloblastoma, NOS or NEC'.
--
-- PRE-AGGREGATION IS LOAD-BEARING (caveat 3): openpedcan_histologies_annotated is
-- biospecimen/assay-level, with up to 23 rows per sample_id. Joined raw, the
-- group_concat/min aggregates downstream would multiply. max() here is a
-- deterministic pick over a verified-singleton set, not an arbitrary tie-break --
-- re-verify on a source reload (caveat 7).
--
-- GRAIN: one row per sample_id.

with mapped as (
    select
        sample_id,
        case integrated_diagnosis
            when 'Atypical Teratoid Rhabdoid Tumor, SHH'
                then 'ATRT-SHH'
            when 'Atypical Teratoid Rhabdoid Tumor, MYC'
                then 'ATRT-MYC'
            when 'Atypical Teratoid Rhabdoid Tumor, TYR'
                then 'ATRT-TYR'
            when 'Medulloblastoma, group 3'
                then 'Medulloblastoma, Group 3'
            when 'Medulloblastoma, group 4'
                then 'Medulloblastoma, Group 4'
            when 'Medulloblastoma, WNT-activated'
                then 'Medulloblastoma, WNT-activated'
        end as opc_cns_integrated_diagnosis
    from {{ source('dwh_source', 'openpedcan_histologies_annotated') }}
    where integrated_diagnosis in (
        'Atypical Teratoid Rhabdoid Tumor, SHH',
        'Atypical Teratoid Rhabdoid Tumor, MYC',
        'Atypical Teratoid Rhabdoid Tumor, TYR',
        'Medulloblastoma, group 3',
        'Medulloblastoma, group 4',
        'Medulloblastoma, WNT-activated'
    )
)

select
    sample_id,
    max(opc_cns_integrated_diagnosis) as opc_cns_integrated_diagnosis
from mapped
group by sample_id
