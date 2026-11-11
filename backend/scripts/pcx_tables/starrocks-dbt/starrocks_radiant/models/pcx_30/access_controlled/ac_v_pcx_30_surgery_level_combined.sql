{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_pcx_30_surgery_level_combined',
    tags=['pcx_30', 'access_controlled']
) }}

-- cbtn_tenant.v_pcx_30_surgery_level_combined
--
-- Grant-aware read surface over radiant_data_dev.v_pcx_30_surgery_level_combined.
-- Grant scaffold and access model: see the access_controlled_view macro.
--
-- NOTE the masked surgery_date inherits the upstream -1 sentinel behaviour: where
-- age_at_surgery is -1 (unknown), the upstream view's date_add(dob, -1 day) yields
-- dob minus one day rather than NULL. A granted caller therefore sees a plausible-
-- looking but meaningless date on those rows. Inherited verbatim and not corrected
-- here -- see the upstream view's header.
--
-- brim_url IS phi, for the same reason it is on the PNOC035 eligibility view: the
-- deep link embeds BRIM's internal patient id and resolves in the BRIM UI to the
-- named patient, so it is a re-identification vector rather than a reference. It is
-- also absent from pcx_30_surgery_level_deid and the exported release CSVs. An
-- un-granted caller sees NULL, not a broken link. The column name is the one the
-- portal's surgery query selects (SJRA-2018, renamed to brim_url in 2fdcc84b2 to
-- match what prd already exposed); the API re-labels it evidence_url in its JSON.

{{ access_controlled_view(
    source_relation = ref('v_pcx_30_surgery_level_combined'),
    columns = [
        ['organization_name',         'plain'],
        ['organization_code',         'plain'],
        ['patient_id',                'id_pair'],
        ['radiant_patient_id',        'plain'],
        ['surgery_date',              'phi'],
        ['age_at_surgery_days',       'plain'],
        ['extent_of_tumor_resection', 'plain'],
        ['is_initial_treatment',      'plain'],
        ['brim_url',                  'phi'],
        ['can_read_phi',              'plain'],
    ]
) }}
