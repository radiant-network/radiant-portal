create table v_pcx_30_event_level_combined
(
    organization_name varchar(256) NULL,
    organization_code varchar(64) NULL,
    patient_id varchar(256) NULL,
    patient_id_type varchar(20) NULL,
    radiant_patient_id int NULL,
    event_type varchar(256) NULL,
    event_date datetime NULL,
    age_at_event_days int NULL,
    metastasis varchar(256) NULL,
    metastasis_location varchar(1000) NULL,
    metastasis_location_other varchar(1000) NULL,
    cns_diagnosis_category varchar(256) NULL,
    cns_integrated_diagnosis varchar(512) NULL,
    cns_integrated_diagnosis_source varchar(64) NULL,
    tumor_locations varchar(1000) NULL,
    tumor_location_other varchar(1000) NULL,
    can_read_phi boolean NULL
);
