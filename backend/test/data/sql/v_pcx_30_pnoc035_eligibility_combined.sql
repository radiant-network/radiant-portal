create table v_pcx_30_pnoc035_eligibility_combined
(
    organization_name varchar(256) NULL,
    organization_code varchar(64) NULL,
    patient_id varchar(256) NULL,
    patient_id_type varchar(20) NULL,
    radiant_patient_id int NULL,
    variable_name varchar(256) NULL,
    generated_value varchar(65533) NULL,
    eligibility_value varchar(65533) NULL,
    reasoning varchar(65533) NULL,
    confidence varchar(64) NULL,
    review_status varchar(128) NULL,
    brim_scope varchar(128) NULL,
    brim_url varchar(512) NULL,
    source_file varchar(256) NULL,
    brim_loaded_at datetime NULL,
    can_read_phi boolean NULL
);
