CREATE TABLE `sequencing_experiment`
(
    `seq_id`                          int     NOT NULL COMMENT "",
    `part`                            tinyint NOT NULL

) ENGINE = OLAP
    PRIMARY KEY(`seq_id`);