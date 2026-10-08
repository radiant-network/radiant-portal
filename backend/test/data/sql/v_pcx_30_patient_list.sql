create table v_pcx_30_patient_list
(
    patient_key                     varchar(36)  NOT NULL,
    organization_code               varchar(64)  NULL,
    organization_name               varchar(256) NULL,
    patient_id                      varchar(256) NULL,
    patient_id_type                 varchar(20)  NULL,
    radiant_patient_id              int          NULL,
    given_name                      varchar(256) NULL,
    family_name                     varchar(256) NULL,
    birth_year                      int          NULL,
    gender                          varchar(50)  NULL,
    diagnosis_type_cohort           varchar(256) NULL,
    data_type_cohort                varchar(256) NULL,
    cns_integrated_diagnosis        varchar(512) NULL,
    cns_integrated_diagnosis_source varchar(64)  NULL,
    vital_status                    varchar(20)  NULL,
    age_at_vital_status_days        int          NULL,
    age_at_initial_dx_days          int          NULL,
    survival_days                   int          NULL,
    has_imaging                     boolean      NULL,
    case_count                      bigint       NULL,
    can_read_phi                    boolean      NULL
);
