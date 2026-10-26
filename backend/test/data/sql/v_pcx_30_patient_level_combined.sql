create table v_pcx_30_patient_level_combined
(
    organization_name varchar(256) NULL,
    organization_code varchar(64) NULL,
    patient_id varchar(256) NULL,
    patient_id_type varchar(20) NULL,
    radiant_patient_id int NULL,
    vital_status_date datetime NULL,
    age_at_vital_status_days int NULL,
    vital_status varchar(256) NULL,
    can_read_phi boolean NULL
);
