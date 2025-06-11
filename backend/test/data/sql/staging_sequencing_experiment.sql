CREATE TABLE `staging_sequencing_experiment`
(
    `case_id`               int NOT NULL,
    `seq_id`                int NOT NULL,
    `task_id`               int NOT NULL,
    `part`                  int NOT NULL,
    `analysis_type`         varchar(100) NULL,
    `sample_id`             varchar(255) NULL,
    `patient_id`            varchar(255) NULL,
    `experimental_strategy` varchar(50) NULL,
    `request_id`            int NULL,
    `request_priority`      varchar(20) NULL,
    `vcf_filepath`          varchar(1024) NULL,
    `sex`                   varchar(10) NULL,
    `family_role`           varchar(20) NULL,
    `affected_status`       varchar(20) NULL,
    `created_at`            datetime NULL,
    `updated_at`            datetime NULL,
    `ingested_at`           datetime NULL
) ENGINE = OLAP
    PRIMARY KEY(`case_id`,`seq_id`);