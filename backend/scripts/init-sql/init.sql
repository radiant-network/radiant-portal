CREATE DATABASE IF NOT EXISTS test_db;

USE test_db;

CREATE TABLE `occurrences`
(
    `part`                            tinyint NOT NULL,
    `seq_id`                          int     NOT NULL COMMENT "",
    `locus_id`                        bigint  NOT NULL,
    `ad_ratio`                        decimal(6, 5) NULL COMMENT "",
    `ad_total`                        int NULL COMMENT "",
    `ad_ref`                          int NULL COMMENT "",
    `ad_alt`                          int NULL COMMENT "",
    `dp`                              int NULL COMMENT "",
    `gq`                              int NULL COMMENT "",
    `chromosome`                      varchar(2) NULL COMMENT "",
    `start`                           bigint NULL COMMENT "",
    `zygosity`                        varchar(5) NULL COMMENT "",
    `has_alt`                         boolean NULL COMMENT "",
    `quality`                         decimal(10, 3) NULL COMMENT "",
    `variant_class`                   varchar(50) NULL COMMENT "",
    `filter`                          varchar(100) NULL COMMENT "",
    `info_ac`                         int NULL COMMENT "",
    `info_an`                         int NULL COMMENT "",
    `info_af`                         decimal(6, 5) NULL COMMENT "",
    `info_baseq_rank_sum`             decimal(10, 4) NULL COMMENT "",
    `info_excess_het`                 decimal(10, 4) NULL COMMENT "",
    `info_fs`                         decimal(7, 3) NULL COMMENT "",
    `info_ds`                         boolean NULL COMMENT "",
    `info_fraction_informative_reads` decimal(6, 5) NULL COMMENT "",
    `info_inbreed_coeff`              decimal(6, 4) NULL COMMENT "",
    `info_mleac`                      array< int > NULL COMMENT "",
    `info_mleaf`                      array< DECIMAL (6,4)> NULL COMMENT "",
    `info_mq`                         decimal(7, 3) NULL COMMENT "",
    `info_m_qrank_sum`                decimal(10, 4) NULL COMMENT "",
    `info_qd`                         decimal(7, 3) NULL COMMENT "",
    `info_r2_5p_bias`                 decimal(6, 4) NULL COMMENT "",
    `info_read_pos_rank_sum`          decimal(7, 3) NULL COMMENT "",
    `info_sor`                        decimal(7, 3) NULL COMMENT "",
    `info_vqslod`                     decimal(7, 3) NULL COMMENT "",
    `info_culprit`                    varchar(20) NULL COMMENT "",
    `info_dp`                         int NULL COMMENT "",
    `info_haplotype_score`            decimal(6, 4) NULL COMMENT "",
    `calls`                           array< int (2)> NULL COMMENT ""

) ENGINE = OLAP
    PRIMARY KEY(`part`,`seq_id`, `locus_id`);

CREATE TABLE `sequencing_experiment`
(
    `seq_id`                          int     NOT NULL COMMENT "",
    `part`                            tinyint NOT NULL

) ENGINE = OLAP
    PRIMARY KEY(`seq_id`);


CREATE TABLE `variants`
(
    `locus_id`               bigint,
    `af`                     decimal(7, 6),
    `pf`                     decimal(7, 6),
    `gnomad_v3_af`           decimal(7, 6),
    `ac`                     int(11),
    `pc`                     int(11),
    `hom`                    int(11),
    `chromosome`             char(2),
    `start`                  bigint NULL COMMENT "",
    `variant_class`          varchar(50) NULL COMMENT "",
    `clinvar_interpretation` array< varchar (100)> NULL COMMENT "",
    `omim_inheritance_code`  array< varchar (5)> NULL COMMENT "",
    `symbol`                 varchar(20) NULL COMMENT "",
    `consequence`            array< varchar (50)> NULL COMMENT "",
    `vep_impact`             varchar(20) NULL COMMENT "",
    `mane_select`            boolean NULL COMMENT "",
    `canonical`              boolean NULL COMMENT "",
    `rsnumber`               array< varchar (15)> NULL COMMENT "",
    `reference`              varchar(2000),
    `alternate`              varchar(2000),
    `hgvsg`                  varchar(2000) NULL,
    `locus_full`             varchar(2000) NULL,
    `dna_change`             varchar(2000)
) ENGINE = OLAP