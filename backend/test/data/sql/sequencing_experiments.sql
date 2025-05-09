CREATE TABLE `sequencing_experiments`
(
    `case_id`       int NOT NULL,
    `seq_id`        int NOT NULL,
    `part`          int NOT NULL,
    `analysis_type` varchar(100) NULL,
    `sample_id`     varchar(255) NULL,
    `patient_id`    varchar(255) NULL,
    `vcf_filepath`  varchar(1024) NULL,
    `sex`           varchar(10) NULL,
    `family_role`   varchar(20) NULL,
    `is_affected`   boolean NULL,
    `created_at`    datetime NULL,
    `updated_at`    datetime NULL,
    `ingested_at`   datetime NULL
) ENGINE = OLAP
    PRIMARY KEY(`case_id`,`seq_id`);