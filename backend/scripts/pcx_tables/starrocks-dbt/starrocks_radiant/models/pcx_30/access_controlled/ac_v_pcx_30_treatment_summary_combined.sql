{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_pcx_30_treatment_summary_combined',
    tags=['pcx_30', 'access_controlled']
) }}

-- cbtn_tenant.v_pcx_30_treatment_summary_combined
--
-- Grant-aware read surface over radiant_data_dev.v_pcx_30_treatment_summary_combined.
-- Grant scaffold and access model: see the access_controlled_view macro.
--
-- COLUMN ORDER DIFFERS FROM ITS PEERS, deliberately and preserved: the identifier
-- pair comes FIRST here, before organization_name/organization_code, whereas the other
-- seven lead with the organization columns. Order is part of the published contract,
-- so it is reproduced as-is rather than normalized.
--
-- Eight masked dates, each paired with an unguarded age-in-days. The _ever_ infix
-- marks first-EVER measures; those without it on the treatment side are
-- first-of-initial-treatment. age_at_first_event_days has no infix because it is a
-- disease event, not a treatment.

{{ access_controlled_view(
    source_relation = ref('v_pcx_30_treatment_summary_combined'),
    columns = [
        ['patient_id',                          'id_pair'],
        ['radiant_patient_id',                  'plain'],
        ['organization_name',                   'plain'],
        ['organization_code',                   'plain'],
        ['initial_dx_date',                     'phi'],
        ['age_at_initial_dx_days',              'plain'],
        ['first_event_date',                    'phi'],
        ['age_at_first_event_days',             'plain'],
        ['first_radiation_ever_date',           'phi'],
        ['age_at_first_radiation_ever_days',    'plain'],
        ['initial_radiation_date',              'phi'],
        ['age_at_initial_radiation_days',       'plain'],
        ['first_chemo_ever_date',               'phi'],
        ['age_at_first_chemo_ever_days',        'plain'],
        ['initial_chemo_date',                  'phi'],
        ['age_at_initial_chemo_days',           'plain'],
        ['first_methotrexate_ever_date',        'phi'],
        ['age_at_first_methotrexate_ever_days', 'plain'],
        ['had_initial_radiation',               'plain'],
        ['had_initial_chemo',                   'plain'],
        ['had_initial_methotrexate',            'plain'],
        ['initial_treatment_order',             'plain'],
        ['can_read_phi',                        'plain'],
    ]
) }}
