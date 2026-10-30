{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_pcx_30_event_level_combined',
    tags=['pcx_30', 'access_controlled']
) }}

-- cbtn_tenant.v_pcx_30_event_level_combined
--
-- Grant-aware read surface over radiant_data_dev.v_pcx_30_event_level_combined.
-- Grant scaffold and access model: see the access_controlled_view macro.
--
-- cns_integrated_diagnosis_source ('CBTN' | 'OpenPedCan') is projected unguarded --
-- it is provenance metadata, not PHI. Any change to the OpenPedCan upgrade logic
-- upstream flows through here unchanged; this view adds no diagnosis logic of its own.

{{ access_controlled_view(
    source_relation = ref('v_pcx_30_event_level_combined'),
    columns = [
        ['organization_name',               'plain'],
        ['organization_code',               'plain'],
        ['patient_id',                      'id_pair'],
        ['radiant_patient_id',              'plain'],
        ['event_type',                      'plain'],
        ['event_date',                      'phi'],
        ['age_at_event_days',               'plain'],
        ['metastasis',                      'plain'],
        ['metastasis_location',             'plain'],
        ['metastasis_location_other',       'plain'],
        ['cns_diagnosis_category',          'plain'],
        ['cns_integrated_diagnosis',        'plain'],
        ['cns_integrated_diagnosis_source', 'plain'],
        ['tumor_locations',                 'plain'],
        ['tumor_location_other',            'plain'],
        ['can_read_phi',                    'plain'],
    ]
) }}
