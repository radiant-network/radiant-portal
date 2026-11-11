CREATE TABLE IF NOT EXISTS germline__snv__comphet
(
    part              INT          NOT NULL,
    seq_id            INT          NOT NULL,
    task_id           INT          NOT NULL,
    locus_id          BIGINT       NOT NULL,
    partner_locus_id  BIGINT       NOT NULL,
    symbol            VARCHAR(200) NOT NULL
) ENGINE=OLAP
    DUPLICATE KEY(`part`, `seq_id`, `task_id`, `locus_id`)