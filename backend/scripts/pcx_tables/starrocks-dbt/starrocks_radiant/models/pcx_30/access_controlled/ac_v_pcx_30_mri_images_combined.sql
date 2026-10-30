{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_pcx_30_mri_images_combined',
    tags=['pcx_30', 'access_controlled']
) }}

-- cbtn_tenant.v_pcx_30_mri_images_combined
--
-- Grant-aware read surface over radiant_data_dev.v_pcx_30_mri_images_combined.
-- Grant scaffold and access model: see the access_controlled_view macro.
--
-- session_date is the only masked column; age_at_session_days passes through. This
-- domain has NO -1 unknown-date sentinel, so unlike surgery_date and event_date the
-- masked date here is either a real date or NULL -- never dob-minus-one-day.
--
-- flywheel_url and the flywheel_* ids are projected unguarded. They are Flywheel
-- PACS identifiers, and reaching the images behind them requires separate Flywheel
-- authorization -- the URL is a pointer, not the image. Worth re-confirming against
-- your access policy if that assumption ever changes.

{{ access_controlled_view(
    source_relation = ref('v_pcx_30_mri_images_combined'),
    columns = [
        ['organization_name',     'plain'],
        ['organization_code',     'plain'],
        ['patient_id',            'id_pair'],
        ['radiant_patient_id',    'plain'],
        ['flywheel_subject_id',   'plain'],
        ['flywheel_project_id',   'plain'],
        ['flywheel_project_name', 'plain'],
        ['session_id',            'plain'],
        ['session_name',          'plain'],
        ['session_date',          'phi'],
        ['age_at_session_days',   'plain'],
        ['anatomical_site',       'plain'],
        ['imaging_modality',      'plain'],
        ['flywheel_url',          'plain'],
        ['can_read_phi',          'plain'],
    ]
) }}
