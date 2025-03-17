CREATE TABLE `sequencing_experiment`
(
    `seq_id`                          int     NOT NULL COMMENT "",
    `part`                            tinyint NOT NULL,
    `experiment_type`                 varchar(100),
    `analysis_type`                   varchar(100)

) ENGINE = OLAP
    PRIMARY KEY(`seq_id`);