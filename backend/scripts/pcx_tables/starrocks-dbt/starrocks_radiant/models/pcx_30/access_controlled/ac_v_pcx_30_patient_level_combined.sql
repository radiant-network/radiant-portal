{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_pcx_30_patient_level_combined',
    tags=['pcx_30', 'access_controlled']
) }}

-- cbtn_tenant.v_pcx_30_patient_level_combined
--
-- Grant-aware read surface over radiant_data_dev.v_pcx_30_patient_level_combined.
-- The grant scaffold and the full access model live in the
-- access_controlled_view macro -- read it before changing anything here.
--
-- LAYERING:
--   radiant_data_dev.v_pcx_30_patient_level_combined   CONTAINS PHI, internal only
--   <tenant>_tenant.v_pcx_30_patient_level_combined    this view, grant-guarded
-- The tenant-facing schema holds NO unguarded PHI for vital status.
--
-- The model is named ac_* so it does not collide with the combined model's name;
-- `alias` puts the real relation name back. dbt requires globally unique model names
-- but the two layers deliberately share a relation name across schemas.

{{ access_controlled_view(
    source_relation = ref('v_pcx_30_patient_level_combined'),
    columns = [
        ['organization_name',        'plain'],
        ['organization_code',        'plain'],
        ['patient_id',               'id_pair'],
        ['radiant_patient_id',       'plain'],
        ['vital_status_date',        'phi'],
        ['age_at_vital_status_days', 'plain'],
        ['vital_status',             'plain'],
        ['can_read_phi',             'plain'],
    ]
) }}
