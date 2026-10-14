{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_pcx_30_medical_therapy_level_combined',
    tags=['pcx_30', 'access_controlled']
) }}

-- cbtn_tenant.v_pcx_30_medical_therapy_level_combined
--
-- Grant-aware read surface over
-- radiant_data_dev.v_pcx_30_medical_therapy_level_combined.
-- Grant scaffold and access model: see the access_controlled_view macro.
--
-- NOTE the age_at_regimen_* columns are projected unguarded while the paired
-- calendar dates are masked -- an age in days is not PHI, a date of service is. That
-- is the pairing rule the whole slate is built on.
--
-- is_initial_treatment reaches an un-granted caller unchanged. Its 'no' value
-- conflates "not frontline" with "cannot tell" (~30% of 'no' rows) -- see the
-- upstream combined view's header before counting off this column.
--
-- protocol_name / protocol_arm are projected UNMASKED, per
-- view_data_dictionary_access_policy.csv ("OK to show to all users"). That policy
-- carries a conditional: "If protocol_name_and_arm is ever masked, mask this with
-- it." If that day comes, all three change kind together -- they are the same datum
-- split three ways.

{{ access_controlled_view(
    source_relation = ref('v_pcx_30_medical_therapy_level_combined'),
    columns = [
        ['organization_name',          'plain'],
        ['organization_code',          'plain'],
        ['patient_id',                 'id_pair'],
        ['radiant_patient_id',         'plain'],
        ['protocol_name_and_arm',      'plain'],
        ['protocol_name',              'plain'],
        ['protocol_arm',               'plain'],
        ['chemotherapy_type',          'plain'],
        ['regimen_start_date',         'phi'],
        ['age_at_regimen_start_days',  'plain'],
        ['regimen_stop_date',          'phi'],
        ['age_at_regimen_stop_days',   'plain'],
        ['chemotherapy_agents',        'plain'],
        ['is_initial_treatment',       'plain'],
        ['can_read_phi',               'plain'],
    ]
) }}
