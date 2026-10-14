{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_cbc_latest_results',
    tags=['cbtn_clinical', 'access_controlled']
) }}

-- cbtn_tenant.v_cbc_latest_results
--
-- Grant-aware read surface over radiant_data_dev.v_cbc_latest_results.
-- Grant scaffold and access model: see the access_controlled_view macro.
--
-- DROPPED relative to the combined view: patient_fhir_id, subject_reference,
-- org_short_code and diagnostic_report_id. The identifiers are PHI-only and are not
-- projected into guarded views at all (same handling as
-- csf_tumor_analysis_latest.latest_report_id); org_short_code is dropped because
-- organization_code is the vocabulary the grant model speaks, and publishing both
-- invites keying access decisions on the wrong one.
--
-- ONE PANEL DATE (changed 2026-10-14). Four masked *_observed_at columns and four
-- age_at_<analyte>_days columns collapsed to one masked panel_observed_at plus one
-- unguarded age_at_panel_days, because the base model now returns a single panel
-- rather than per-analyte latest values.
--
-- UNLIKE THE PERFORMANCE-STATUS DOMAIN, this cohort has real non-CHOP membership
-- (CHOP 1,837, SCH 336, BCH 231, UAB 1), so an SCH grant holder genuinely sees
-- identified rows here. It is the better domain to test the grant path against.
--
-- Values, units, LOINC codes and age_at_panel_days are all unguarded -- a lab value
-- and an age in days are not identifying. Only the calendar panel_observed_at is
-- masked. Every value in a row is from the SAME panel, so the single age applies to
-- all of them.
--
-- anc_value is NULL for ~401 patients whose latest panel had no differential. That
-- is deliberate: the panel contract is "one draw or nothing", with no fill-forward
-- from an earlier ANC. Read a NULL anc_value as "not in this panel", NOT as "never
-- measured" -- those patients often do have an older ANC that this table no longer
-- surfaces.
--
-- NOT UNIT-NORMALIZED -- ANC appears as both '/uL' and 'x10E9/L', differing by
-- 1000x. Read the unit alongside the value.

{{ access_controlled_view(
    source_relation = ref('v_cbc_latest_results'),
    columns = [
        ['organization_name',           'plain'],
        ['organization_code',           'plain'],
        ['patient_id',                  'id_pair'],
        ['radiant_patient_id',          'plain'],

        ['panel_observed_at',           'phi'],
        ['age_at_panel_days',           'plain'],
        ['date_semantic',               'plain'],

        ['wbc_value',                   'plain'],
        ['wbc_unit',                    'plain'],
        ['wbc_loinc',                   'plain'],
        ['wbc_source_code_text',        'plain'],

        ['hemoglobin_value',            'plain'],
        ['hemoglobin_unit',             'plain'],
        ['hemoglobin_loinc',            'plain'],
        ['hemoglobin_source_code_text', 'plain'],

        ['platelets_value',             'plain'],
        ['platelets_unit',              'plain'],
        ['platelets_loinc',             'plain'],
        ['platelets_source_code_text',  'plain'],

        ['anc_value',                   'plain'],
        ['anc_unit',                    'plain'],
        ['anc_loinc',                   'plain'],
        ['anc_source_code_text',        'plain'],

        ['analytes_found',              'plain'],
        ['can_read_phi',                'plain'],
    ]
) }}
