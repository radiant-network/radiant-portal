create table v_pcx_30_radiation_level_combined
(
    organization_name varchar(256) NULL,
    organization_code varchar(64) NULL,
    patient_id varchar(256) NULL,
    patient_id_type varchar(20) NULL,
    radiant_patient_id int NULL,
    radiation_start_date datetime NULL,
    age_at_radiation_start_days varchar(1000) NULL,
    radiation_stop_date datetime NULL,
    age_at_radiation_stop_days varchar(1000) NULL,
    radiation_site varchar(256) NULL,
    radiation_site_other varchar(256) NULL,
    radiation_type varchar(256) NULL,
    radiation_type_other varchar(256) NULL,
    total_radiation_dose varchar(64) NULL,
    total_radiation_dose_unit varchar(64) NULL,
    total_radiation_dose_focal varchar(64) NULL,
    total_radiation_dose_focal_unit varchar(64) NULL,
    is_initial_treatment varchar(64) NULL,
    can_read_phi boolean NULL
);
