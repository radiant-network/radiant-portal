create table v_lansky_karnofsky_latest
(
    organization_name varchar(256) NULL,
    organization_code varchar(64) NULL,
    patient_id varchar(256) NULL,
    patient_id_type varchar(20) NULL,
    radiant_patient_id int NULL,
    scale varchar(64) NULL,
    score int NULL,
    scored_at datetime NULL,
    age_at_score_days int NULL,
    score_text varchar(512) NULL,
    scale_code varchar(64) NULL,
    source_code_text varchar(256) NULL,
    component_line varchar(256) NULL,
    date_semantic varchar(64) NULL,
    can_read_phi boolean NULL
);
