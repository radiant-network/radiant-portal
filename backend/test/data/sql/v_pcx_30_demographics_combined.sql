create table v_pcx_30_demographics_combined
(
    organization_code varchar(64)  NULL,
    patient_id        varchar(256) NULL,
    patient_id_type   varchar(20)  NULL,
    given_name        varchar(256) NULL,
    family_name       varchar(256) NULL,
    can_read_phi      boolean      NULL
);
