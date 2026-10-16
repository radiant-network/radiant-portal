create table v_pcx_30_mri_images_combined
(
    organization_name varchar(256) NULL,
    organization_code varchar(64) NULL,
    patient_id varchar(256) NULL,
    patient_id_type varchar(20) NULL,
    radiant_patient_id int NULL,
    flywheel_subject_id varchar(128) NULL,
    flywheel_project_id varchar(128) NULL,
    flywheel_project_name varchar(128) NULL,
    session_id varchar(128) NULL,
    session_name varchar(256) NULL,
    session_date datetime NULL,
    age_at_session_days varchar(64) NULL,
    anatomical_site varchar(256) NULL,
    imaging_modality varchar(256) NULL,
    flywheel_url varchar(1000) NULL,
    can_read_phi boolean NULL
);
