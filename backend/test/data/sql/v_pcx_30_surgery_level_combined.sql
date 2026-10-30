create table v_pcx_30_surgery_level_combined
(
    organization_name varchar(256) NULL,
    organization_code varchar(64) NULL,
    patient_id varchar(256) NULL,
    patient_id_type varchar(20) NULL,
    radiant_patient_id int NULL,
    surgery_date datetime NULL,
    age_at_surgery_days varchar(1000) NULL,
    extent_of_tumor_resection varchar(256) NULL,
    is_initial_treatment varchar(64) NULL,
    can_read_phi boolean NULL
);
