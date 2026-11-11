create table v_pcx_30_tumor_board_session
(
    organization_code varchar(64) NULL,
    patient_id_type varchar(20) NULL,
    patient_id varchar(256) NULL,
    session_id int NULL,
    tumor_board_date date NULL,
    age_at_tumor_board_days int NULL,
    reason varchar(65533) NULL,
    diagnosis varchar(65533) NULL,
    consensus varchar(65533) NULL,
    recommendations varchar(65533) NULL,
    status varchar(128) NULL,
    report_url varchar(1024) NULL,
    can_read_phi boolean NULL
);
