{{ config(
    materialized='view',
    tags=['pcx_30', 'combined', 'phi', 'pnoc035']
) }}

-- Combined identified + de-identified PNOC035 eligibility in ONE relation.
--
-- CONTAINS PHI (mrn alongside research_id, plus free-text reasoning that may quote
-- names, MRNs or dates). Internal only. The grant-guarded surface is the tenant
-- view built from this one by ac_v_pcx_30_pnoc035_eligibility_combined.
--
-- Projects organization_code and the mrn/research_id pair because the
-- access_controlled_view macro requires all three from its source relation.
--
-- IDENTITY: mrn -> research_id via radiant_patient_mrn_list on RAW equality --
-- enrollment and the FHIR identifier values share an identifier space (verified:
-- the anti-join returns the same 4,495 MRNs either way). Zero-stripping belongs to
-- the portal patient join inside the macro; do not generalise one rule to the
-- other. This resolves BRIM patients at all only because that model gained its
-- enrollment_only arm -- before it, a CBTN-enrolled patient with no FHIR data had
-- no row and could get neither research_id nor organization.
--
-- organization_name: pcx_30_demographics_deid (by research_id) first, falling back
-- to enrollment (by mrn) for a patient not yet in the deid cohort. Both agree for
-- every patient here today, so the coalesce is insurance. The fallback carries a
-- known risk: organization_code resolves by joining the org_ref seed ON NAME, and
-- enrollment's spellings do not all match it (a view over enrollment has been
-- measured dropping 894 rows to a NULL code). A NULL code fails CLOSED in the
-- macro -- it cannot match org_grant.org_code -- rather than leaking.
--
-- NO FAN-OUT: every join is a LEFT JOIN to a source unique on its key, so the row
-- count equals the base table's. An unresolved identity yields NULLs; an
-- eligibility verdict must not vanish because an id lookup missed.

with enrollment_org as (
    select
        mrn,
        min(organization_name) as organization_name
    from {{ source('dwh_source', 'stg_cbtn_enrollment_final') }}
    group by mrn
)

select
    coalesce(demo.organization_name, enr.organization_name) as organization_name,
    org.code as organization_code,

    -- identifier pair
    elig.patient_mrn as mrn,
    mrn_list.research_id,

    -- the verdict
    elig.generated_value,
    elig.eligibility_value,
    elig.reasoning,
    elig.confidence,
    elig.review_status,
    elig.brim_scope,
    elig.brim_url,

    -- provenance
    elig.note_id,
    elig.source_file,
    elig.brim_loaded_at
from {{ ref('pcx_30_pnoc035_eligibility') }} elig
left join {{ ref('radiant_patient_mrn_list') }} mrn_list
    on mrn_list.mrn = elig.patient_mrn
left join {{ ref('pcx_30_demographics_deid') }} demo
    on demo.research_id = mrn_list.research_id
left join enrollment_org enr
    on enr.mrn = elig.patient_mrn
left join {{ ref('pcx_30_organization_ref') }} org
    on org.name = coalesce(demo.organization_name, enr.organization_name)
