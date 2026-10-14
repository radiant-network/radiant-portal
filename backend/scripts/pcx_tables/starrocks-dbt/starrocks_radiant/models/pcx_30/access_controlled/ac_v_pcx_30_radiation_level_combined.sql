{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_pcx_30_radiation_level_combined',
    tags=['pcx_30', 'access_controlled']
) }}

-- cbtn_tenant.v_pcx_30_radiation_level_combined
--
-- Grant-aware read surface over radiant_data_dev.v_pcx_30_radiation_level_combined.
-- Grant scaffold and access model: see the access_controlled_view macro.
--
-- Dose columns are projected unguarded -- clinical measurements, not identifiers.
-- Only the two calendar dates are masked; their age-in-days pairs pass through.
--
-- is_initial_treatment reaches an un-granted caller unchanged, and radiation is the
-- worst of the three treatment tables for the 'no' conflation (37% of 'no' rows are
-- an unavailable start date, not a non-frontline course) -- see the upstream view.

{{ access_controlled_view(
    source_relation = ref('v_pcx_30_radiation_level_combined'),
    columns = [
        ['organization_name',               'plain'],
        ['organization_code',               'plain'],
        ['patient_id',                      'id_pair'],
        ['radiant_patient_id',              'plain'],
        ['radiation_start_date',            'phi'],
        ['age_at_radiation_start_days',     'plain'],
        ['radiation_stop_date',             'phi'],
        ['age_at_radiation_stop_days',      'plain'],
        ['radiation_site',                  'plain'],
        ['radiation_site_other',            'plain'],
        ['radiation_type',                  'plain'],
        ['radiation_type_other',            'plain'],
        ['total_radiation_dose',            'plain'],
        ['total_radiation_dose_unit',       'plain'],
        ['total_radiation_dose_focal',      'plain'],
        ['total_radiation_dose_focal_unit', 'plain'],
        ['is_initial_treatment',            'plain'],
        ['can_read_phi',                    'plain'],
    ]
) }}
