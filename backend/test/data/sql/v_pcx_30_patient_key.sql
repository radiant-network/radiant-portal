create table v_pcx_30_patient_key
(
    organization_code varchar(64)  NULL,
    patient_id_type   varchar(20)  NULL,
    patient_id        varchar(256) NULL,
    patient_key       varchar(36)  NOT NULL
);
