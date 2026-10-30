{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_csf_tumor_analysis_latest',
    tags=['cbtn_clinical', 'access_controlled']
) }}

-- cbtn_tenant.v_csf_tumor_analysis_latest
--
-- Grant-aware read surface over radiant_data_dev.v_csf_tumor_analysis_latest.
-- Grant scaffold and access model: see the access_controlled_view macro.
--
-- THE FREE TEXT IS GATED, AND THAT IS THE POINT OF THIS VIEW. final_diagnosis and
-- result_text are pathology prose that quotes patient name and MRN, so both are
-- masked. malignant_cells is the DE-IDENTIFIED STAND-IN: a derived label over that
-- same prose, published openly so an un-granted caller can still read the finding
-- without reading the narrative. That trade is the reason the classifier exists --
-- see the base model's header for its negation handling and the real strings that
-- defeated simpler forms.
--
-- DROPPED relative to the combined view: patient_fhir_id and latest_report_id. Both
-- are PHI-only identifiers, not projected into the guarded view at all.
--
-- patient_best_evidence and evidence_tier are open by design: they are provenance,
-- not PHI, and required to read the finding honestly -- a 'same_day_only' attribution
-- is much weaker evidence that the specimen was CSF than a 'named' one.
--
-- multi_specimen_report is likewise open: it is the review flag saying the report's
-- text references a non-CSF specimen, so the label should be confirmed against the
-- CSF part. An un-granted caller who cannot read the prose needs that flag most.
--
-- result_display is the column to read for quantitative results -- the comparator is
-- load-bearing ('<1.0 ng/mL' is UNDETECTABLE, not a concentration of 1.0).

{{ access_controlled_view(
    source_relation = ref('v_csf_tumor_analysis_latest'),
    columns = [
        ['organization_name',            'plain'],
        ['organization_code',            'plain'],
        ['patient_id',                   'id_pair'],
        ['radiant_patient_id',           'plain'],

        ['patient_best_evidence',        'plain'],
        ['evidence_tier',                'plain'],

        ['latest_test_family',           'plain'],
        ['latest_test_name',             'plain'],
        ['latest_analyzed_at',           'phi'],
        ['age_at_latest_analysis_days',  'plain'],

        ['malignant_cells',              'plain'],
        ['multi_specimen_report',        'plain'],

        ['result_display',               'plain'],
        ['result_value',                 'plain'],
        ['result_comparator',            'plain'],
        ['result_unit',                  'plain'],

        ['final_diagnosis',              'phi'],
        ['result_text',                  'phi'],
        ['result_sections',              'plain'],

        ['csf_analyses_total',           'plain'],
        ['first_analyzed_at',            'phi'],
        ['age_at_first_analysis_days',   'plain'],
        ['distinct_families',            'plain'],
        ['families_ever',                'plain'],
        ['can_read_phi',                 'plain'],
    ]
) }}
