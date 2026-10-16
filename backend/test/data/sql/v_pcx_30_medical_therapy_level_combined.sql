create table v_pcx_30_medical_therapy_level_combined
(
    organization_name varchar(256) NULL,
    organization_code varchar(64) NULL,
    patient_id varchar(256) NULL,
    patient_id_type varchar(20) NULL,
    radiant_patient_id int NULL,
    protocol_name_and_arm varchar(512) NULL,
    protocol_name varchar(256) NULL,
    protocol_arm varchar(256) NULL,
    chemotherapy_type varchar(512) NULL,
    regimen_start_date datetime NULL,
    age_at_regimen_start_days varchar(1000) NULL,
    regimen_stop_date datetime NULL,
    age_at_regimen_stop_days varchar(1000) NULL,
    chemotherapy_agents varchar(1000) NULL,
    is_initial_treatment varchar(64) NULL,
    can_read_phi boolean NULL
);
