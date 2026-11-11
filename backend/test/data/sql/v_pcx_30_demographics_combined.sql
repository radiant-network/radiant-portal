create table v_pcx_30_demographics_combined
(
    organization_name varchar(256) NULL,
    organization_code varchar(64) NULL,
    patient_id varchar(256) NULL,
    patient_id_type varchar(20) NULL,
    radiant_patient_id int NULL,
    given_name varchar(256) NULL,
    family_name varchar(256) NULL,
    birth_date varchar(256) NULL,
    birth_year varchar(256) NULL,
    race varchar(256) NULL,
    ethnicity varchar(256) NULL,
    gender varchar(256) NULL,
    address_postal_code varchar(256) NULL,
    diagnosis_type_cohort varchar(500) NULL,
    data_type_cohort varchar(256) NULL,
    can_read_phi boolean NULL
);
