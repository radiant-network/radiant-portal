CREATE TABLE cosmic_mutation_set
(
    locus_id       BIGINT       NOT NULL,
    mutation_url   VARCHAR(255) NULL,
    shared_aa      INT          NULL,
    cosmic_id      VARCHAR(32)  NULL,
    sample_mutated INT          NULL,
    sample_tested  INT          NULL,
    tier           VARCHAR(8)   NULL,
    sample_ratio   DOUBLE       NULL
) ENGINE = OLAP
    DUPLICATE KEY(locus_id);
