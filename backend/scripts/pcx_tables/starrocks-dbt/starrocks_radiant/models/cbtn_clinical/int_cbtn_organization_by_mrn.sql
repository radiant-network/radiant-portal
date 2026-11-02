{{ config(
    materialized='table',
    tags=['cbtn_clinical', 'intermediate']
) }}

-- The `roster` CTE that all four cbtn_clinical combined views carried verbatim:
-- organization_name per MRN, deduped.
--
-- DISTINCT FROM int_pcx_30_cohort_roster. That one is cohort-filtered to the ATRT /
-- Medulloblastoma release and carries dob + research_id + data_type_cohort. These
-- four domains are NOT cohort-filtered -- they cover the whole CBTN population
-- (2,421 CBC patients, 1,627 performance-status patients vs 966 in pcx_30) -- and
-- need only mrn -> organization_name.
--
-- WHY organization_name AND NOT org_short_code. The base tables already carry
-- org_short_code, which is the FHIR source vocabulary (chop / seattle / ucsf).
-- organization_code, resolved from this name via pcx_30_organization_ref, is the
-- pcx_30 / auth.pii_grant vocabulary (CHOP / SCH / UCSF-BCH). Only 'chop' coincides
-- between the two, so keying access control on org_short_code would fail CLOSED for
-- every non-CHOP patient. This is the join that makes the downstream grant check
-- work at all.
--
-- The min() dedupe is defensive: stg_cbtn_enrollment_final holds one row per mrn
-- today (7,157 rows / 7,157 distinct mrn), so it is not currently load-bearing.
--
-- The `nullif(organization_name,'') is not null` filter drops blank names, so a
-- patient with a blank organization in stg resolves to a NULL organization_code
-- downstream rather than to an unmatchable empty string. Either way that patient
-- fails CLOSED at the grant join -- permanently de-identified even for an authorized
-- caller. 16 of 2,421 CBC patients and 14 of 1,627 performance-status patients are
-- in that state; it is the safe direction but it is silent.
--
-- GRAIN: one row per mrn.

select
    mrn,
    min(organization_name) as organization_name
from {{ source('dwh_source', 'stg_cbtn_enrollment_final') }}
where nullif(organization_name, '') is not null
group by mrn
