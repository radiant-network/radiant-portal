{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_lansky_karnofsky_latest',
    tags=['cbtn_clinical', 'access_controlled']
) }}

-- cbtn_tenant.v_lansky_karnofsky_latest
--
-- Grant-aware read surface over radiant_data_dev.v_lansky_karnofsky_latest.
-- Grant scaffold and access model: see the access_controlled_view macro -- the same
-- one the pcx_30 slate uses, because the scaffold is byte-identical.
--
-- DROPPED relative to the combined view: patient_fhir_id, subject_reference and
-- observation_id. All three are "Show for PHI access only" identifiers and are not
-- projected into the guarded view at all, rather than masked -- consistent with the
-- pcx_30 slate's handling of patient_fhir_id.
--
-- *** EXPECT AN ALL-RESEARCH_ID RESULT TODAY, and do not read it as a broken grant
-- join. This cohort is effectively CHOP-only (1,612 of 1,613 resolved patients, one
-- UAB, ZERO SCH) while the only auth.pii_grant row for tenant 'cbtn' grants org_code
-- 'SCH'. So every current grant holder legitimately sees the de-identified
-- projection. ***
--
-- age_at_score_days is projected unguarded as the de-identified counterpart to the
-- masked scored_at -- but note it is NULL for the 104 patients whose scored_at is
-- NULL, so those rows reach a caller with NEITHER a date NOR an age. And where it IS
-- present it derives from an ADMINISTRATIVE date (observation.issued), so it is
-- age-at-result-release, not age-at-assessment.

{{ access_controlled_view(
    source_relation = ref('v_lansky_karnofsky_latest'),
    columns = [
        ['organization_name', 'plain'],
        ['organization_code', 'plain'],
        ['patient_id',        'id_pair'],
        ['radiant_patient_id','plain'],
        ['scale',             'plain'],
        ['score',             'plain'],
        ['scored_at',         'phi'],
        ['age_at_score_days', 'plain'],
        ['score_text',        'plain'],
        ['scale_code',        'plain'],
        ['source_code_text',  'plain'],
        ['component_line',    'plain'],
        ['date_semantic',     'plain'],
        ['can_read_phi',      'plain'],
    ]
) }}
