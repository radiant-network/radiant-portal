{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_csf_results_latest_by_component',
    tags=['cbtn_clinical', 'access_controlled']
) }}

-- cbtn_tenant.v_csf_results_latest_by_component
--
-- Grant-aware read surface over radiant_data_dev.v_csf_results_latest_by_component.
-- Grant scaffold and access model: see the access_controlled_view macro.
--
-- THE WIDEST VIEW IN EITHER SLATE (69 columns) and the most heavily masked: every
-- one of the thirteen calendar timestamps is gated, each paired with an unguarded
-- age_at_*_days, plus three free-text columns (cytology_final_diagnosis,
-- cytology_result_text, pathology_review_text) which quote patient name and MRN.
--
-- DROPPED relative to the combined view: patient_fhir_id -- a PHI-only identifier,
-- not projected into the guarded view at all.
--
-- malignant_cells is the DE-IDENTIFIED STAND-IN for the gated cytology prose, open
-- by design so an un-granted caller can read the finding without the narrative.
-- multi_specimen_report travels with it as the review flag -- the text references a
-- non-CSF specimen, so the label needs confirming against the CSF part. A caller who
-- cannot read the prose needs that flag most.
--
-- Values, units, comparators and the *_display strings are all unguarded: a lab
-- value is not identifying. READ *_display rather than *_value alone -- the
-- comparator is load-bearing, since most tumour-marker results are '< 1.0', i.e.
-- UNDETECTABLE, and dropping it reports undetectable as 1.0.
--
-- patient_best_evidence is NULL for the ~240 routine-only patients: those with
-- chemistry or cell counts but no tumour-relevant analysis at all. NULL means "no
-- tumour evidence tier applies", not "weakest tier".

{{ access_controlled_view(
    source_relation = ref('v_csf_results_latest_by_component'),
    columns = [
        ['organization_name',                   'plain'],
        ['organization_code',                   'plain'],
        ['patient_id',                          'id_pair'],
        ['radiant_patient_id',                  'plain'],
        ['patient_best_evidence',               'plain'],

        ['protein_display',                     'plain'],
        ['protein_value',                       'plain'],
        ['protein_comparator',                  'plain'],
        ['protein_unit',                        'plain'],
        ['protein_observed_at',                 'phi'],
        ['age_at_protein_days',                 'plain'],
        ['protein_source_code_text',            'plain'],

        ['glucose_display',                     'plain'],
        ['glucose_value',                       'plain'],
        ['glucose_comparator',                  'plain'],
        ['glucose_unit',                        'plain'],
        ['glucose_observed_at',                 'phi'],
        ['age_at_glucose_days',                 'plain'],
        ['glucose_source_code_text',            'plain'],

        ['wbc_display',                         'plain'],
        ['wbc_value',                           'plain'],
        ['wbc_unit',                            'plain'],
        ['wbc_observed_at',                     'phi'],
        ['age_at_wbc_days',                     'plain'],
        ['wbc_source_code_text',                'plain'],

        ['rbc_display',                         'plain'],
        ['rbc_value',                           'plain'],
        ['rbc_unit',                            'plain'],
        ['rbc_observed_at',                     'phi'],
        ['age_at_rbc_days',                     'plain'],
        ['rbc_source_code_text',                'plain'],

        ['cytology_evidence_tier',              'plain'],
        ['cytology_test_name',                  'plain'],
        ['malignant_cells',                     'plain'],
        ['multi_specimen_report',               'plain'],
        ['cytology_final_diagnosis',            'phi'],
        ['cytology_result_text',                'phi'],
        ['cytology_observed_at',                'phi'],
        ['age_at_cytology_days',                'plain'],

        ['afp_display',                         'plain'],
        ['afp_value',                           'plain'],
        ['afp_comparator',                      'plain'],
        ['afp_unit',                            'plain'],
        ['afp_observed_at',                     'phi'],
        ['age_at_afp_days',                     'plain'],

        ['hcg_display',                         'plain'],
        ['hcg_value',                           'plain'],
        ['hcg_comparator',                      'plain'],
        ['hcg_unit',                            'plain'],
        ['hcg_observed_at',                     'phi'],
        ['age_at_hcg_days',                     'plain'],

        ['cea_display',                         'plain'],
        ['cea_observed_at',                     'phi'],
        ['age_at_cea_days',                     'plain'],

        ['cell_free_dna_observed_at',           'phi'],
        ['age_at_cell_free_dna_days',           'plain'],

        ['malignant_cell_panel_observed_at',    'phi'],
        ['age_at_malignant_cell_panel_days',    'plain'],

        ['pathology_review_text',               'phi'],
        ['pathology_review_observed_at',        'phi'],
        ['age_at_pathology_review_days',        'plain'],

        ['components_present',                  'plain'],
        ['csf_reports_total',                   'plain'],
        ['first_csf_result_at',                 'phi'],
        ['age_at_first_csf_result_days',        'plain'],
        ['last_csf_result_at',                  'phi'],
        ['age_at_last_csf_result_days',         'plain'],
        ['can_read_phi',                        'plain'],
    ]
) }}
