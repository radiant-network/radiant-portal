{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_pcx_30_demographics_combined',
    tags=['pcx_30', 'access_controlled']
) }}

-- cbtn_tenant.v_pcx_30_demographics_combined
--
-- Grant-aware read surface over radiant_data_dev.v_pcx_30_demographics_combined.
-- Grant scaffold and access model: see the access_controlled_view macro.
--
-- THE ONLY VIEW USING phi_deid COLUMNS. given_name, family_name and
-- address_postal_code fall back to the upstream view's _deid variant for an
-- un-granted caller -- a synthetic research_id-derived name and a ZIP3 mask -- rather
-- than to NULL like every other PHI column in the slate. birth_date is the exception
-- within this view: it masks to NULL, with birth_year published separately alongside.

{{ access_controlled_view(
    source_relation = ref('v_pcx_30_demographics_combined'),
    columns = [
        ['organization_name',     'plain'],
        ['organization_code',     'plain'],
        ['patient_id',            'id_pair'],
        ['radiant_patient_id',    'plain'],
        ['given_name',            'phi_deid'],
        ['family_name',           'phi_deid'],
        ['birth_date',            'phi'],
        ['birth_year',            'plain'],
        ['race',                  'plain'],
        ['ethnicity',             'plain'],
        ['gender',                'plain'],
        ['address_postal_code',   'phi_deid'],
        ['diagnosis_type_cohort', 'plain'],
        ['data_type_cohort',      'plain'],
        ['can_read_phi',          'plain'],
    ]
) }}
