{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_pcx_30_pnoc035_eligibility_combined',
    tags=['pcx_30', 'access_controlled', 'pnoc035']
) }}

-- <tenant>_tenant.v_pcx_30_pnoc035_eligibility_combined
--
-- Grant-aware read surface over radiant_data_dev.v_pcx_30_pnoc035_eligibility_combined.
-- The grant scaffold and the full access model live in the access_controlled_view
-- macro -- read it before changing anything here.
--
-- LAYERING:
--   radiant_data_dev.v_pcx_30_pnoc035_eligibility_combined   CONTAINS PHI, internal only
--   <tenant>_tenant.v_pcx_30_pnoc035_eligibility_combined    this view, grant-guarded
--
-- The model is named ac_* so it does not collide with the combined model's name;
-- `alias` puts the real relation name back.
--
-- THREE phi COLUMNS A READER MIGHT NOT EXPECT. reasoning is BRIM's free-text
-- justification, generated from the patient's own notes, so it may quote names,
-- MRNs and dates -- gated for the same reason the csf_* views gate pathology text.
-- brim_url embeds BRIM's internal patient id and re-identifies in the BRIM UI.
-- source_file is a BRIM EXPORT FILENAME, and BRIM names its exports after the
-- patient: '<date>-<project>-patient-<MRN>-....csv'. Measured on this view before
-- it was gated, 2 of 3 rows returned research_id in patient_id and then handed the
-- MRN straight back in the filename, which defeats the collapse-into-one-column
-- rule entirely. Not every basename carries one ('detailed_batch03.csv' does not),
-- so this cannot be left to naming discipline. brim_loaded_at stays plain and
-- gives an un-granted caller the vintage without the filename.
--
-- note_id is deliberately NOT PROJECTED: it is the closest analogue to
-- patient_fhir_id / subject_reference / observation_id, all PHI-only and absent
-- from every guarded view. It stays in the PHI base for internal work.

{{ access_controlled_view(
    source_relation = ref('v_pcx_30_pnoc035_eligibility_combined'),
    columns = [
        ['organization_name', 'plain'],
        ['organization_code', 'plain'],
        ['patient_id',        'id_pair'],
        ['radiant_patient_id','plain'],
        ['generated_value',   'plain'],
        ['eligibility_value', 'plain'],
        ['reasoning',         'phi'],
        ['confidence',        'plain'],
        ['review_status',     'plain'],
        ['brim_scope',        'plain'],
        ['brim_url',          'phi'],
        ['source_file',       'phi'],
        ['brim_loaded_at',    'plain'],
        ['can_read_phi',      'plain'],
    ]
) }}
