/* StarRocks tables of the local stack. {shared} = SHARED_DATABASE (radiant), {tenant} = <code>_tenant.
   Extracted from the former init-sql/init_starrocks.sql; the per-tenant tables are those with PerTenant: true
   in internal/types. Keep in sync with the test DDL (test/data/sql). */

CREATE TABLE IF NOT EXISTS {shared}.`snv__consequence`
(
    `locus_id`                bigint(20) NOT NULL COMMENT "",
    `symbol`                  varchar(30)  NOT NULL COMMENT "",
    `transcript_id`           varchar(100) NOT NULL COMMENT "",
    `consequences`            array< varchar (100)> NULL COMMENT "",
    `impact_score`            tinyint(4) NULL COMMENT "",
    `biotype`                 varchar(50) NULL COMMENT "",
    `exon_rank`               int NULL,
    `exon_total`              int NULL,
    `spliceai_ds`             float NULL COMMENT "",
    `spliceai_type`           array< varchar (2)> NULL COMMENT "",
    `is_canonical`            boolean NULL COMMENT "",
    `is_picked`               boolean NULL COMMENT "",
    `is_mane_select`          boolean NULL COMMENT "",
    `is_mane_plus`            boolean NULL COMMENT "",
    `mane_select`             varchar(200) NULL COMMENT "",
    `sift_score`              float NULL COMMENT "",
    `sift_pred`               varchar(1) NULL COMMENT "",
    `polyphen2_hvar_score`    float NULL COMMENT "",
    `polyphen2_hvar_pred`     varchar(1) NULL COMMENT "",
    `fathmm_score`            float NULL COMMENT "",
    `fathmm_pred`             varchar(1) NULL COMMENT "",
    `cadd_score`              float NULL COMMENT "",
    `cadd_phred`              float NULL COMMENT "",
    `dann_score`              float NULL COMMENT "",
    `revel_score`             float NULL COMMENT "",
    `lrt_score`               float NULL COMMENT "",
    `lrt_pred`                varchar(1) NULL COMMENT "",
    `gnomad_pli`              float NULL COMMENT "",
    `gnomad_loeuf`            float NULL COMMENT "",
    `phyloP17way_primate`     float NULL COMMENT "",
    `phyloP100way_vertebrate` float NULL COMMENT "",
    `vep_impact`              varchar(20) NULL COMMENT "",
    `aa_change`               varchar(1000) NULL COMMENT "",
    `dna_change`              varchar(1000) NULL COMMENT ""
    ) ENGINE=OLAP;

CREATE TABLE IF NOT EXISTS {shared}.`clinvar`
(
    `locus_id`          bigint NOT NULL,
    `chromosome`        varchar(2) NULL,
    `start`             bigint NULL,
    `end`               bigint NULL,
    `reference`         varchar(2000) NULL,
    `alternate`         varchar(2000) NULL,
    `interpretations`   array< varchar (100)> NULL,
    `name`              varchar(2000) NULL,
    `clin_sig`          array< varchar (2000)> NULL,
    `clin_sig_conflict` array< varchar (2000)> NULL,
    `af_exac`           decimal(38, 9) NULL,
    `clnvcso`           varchar(2000) NULL,
    `geneinfo`          varchar(2000) NULL,
    `clnsigincl`        array<varchar(2000)> NULL,
    `clnvi`             array<varchar(2000)> NULL,
    `clndisdb`          array<varchar(2000)> NULL,
    `clnrevstat`        array<varchar(2000)> NULL,
    `alleleid`          int NULL,
    `origin`            array<varchar(2000)> NULL,
    `clndnincl`         array<varchar(2000)> NULL,
    `rs`                array<varchar(2000)> NULL,
    `dbvarid`           array<varchar(2000)> NULL,
    `af_tgp`            decimal(38, 9) NULL,
    `clnvc`             varchar(2000) NULL,
    `clnhgvs`           array<varchar(2000)> NULL,
    `mc`                array<varchar(2000)> NULL,
    `af_esp`            decimal(38, 9) NULL,
    `clndisdbincl`      array<varchar(2000)> NULL,
    `conditions`        array<varchar(2000)> NULL,
    `inheritance`       array<varchar(2000)> NULL,
    `locus`             varchar(2000) NOT NULL,
    `locus_hash`        varchar(2000) NOT NULL
    ) ENGINE = OLAP
    PRIMARY KEY(`locus_id`);

CREATE TABLE IF NOT EXISTS {shared}.`snv__consequence_filter_partitioned`
(
    `part`                    tinyint NOT NULL COMMENT "",
    `locus_id`                bigint(20) NULL COMMENT "",
    `is_deleterious`          boolean NOT NULL COMMENT "",
    `impact_score`            tinyint(4) NULL COMMENT "",
    `symbol`                  varchar(30) NULL COMMENT "",
    `consequence`             varchar(50) NULL COMMENT "",
    `biotype`                 varchar(50) NULL COMMENT "",
    `spliceai_ds`             decimal(6, 5) NULL COMMENT "",
    `sift_score`              decimal(6, 4) NULL COMMENT "",
    `sift_pred`               varchar(1) NULL COMMENT "",
    `polyphen2_hvar_score`    decimal(6, 5) NULL COMMENT "",
    `polyphen2_hvar_pred`     varchar(1) NULL COMMENT "",
    `fathmm_score`            decimal(6, 4) NULL COMMENT "",
    `fathmm_pred`             varchar(1) NULL COMMENT "",
    `cadd_score`              decimal(6, 4) NULL COMMENT "",
    `cadd_phred`              decimal(6, 4) NULL COMMENT "",
    `dann_score`              decimal(6, 5) NULL COMMENT "",
    `revel_score`             decimal(6, 5) NULL COMMENT "",
    `lrt_score`               decimal(6, 5) NULL COMMENT "",
    `lrt_pred`                varchar(1) NULL COMMENT "",
    `gnomad_pli`              decimal(6, 5) NULL COMMENT "",
    `gnomad_loeuf`            decimal(6, 5) NULL COMMENT "",
    `phyloP17way_primate`     decimal(7, 5) NULL COMMENT "",
    `phyloP100way_vertebrate` decimal(7, 5) NULL COMMENT "",
    `vep_impact`              varchar(20) NULL COMMENT ""
    ) ENGINE=OLAP;

CREATE TABLE IF NOT EXISTS {tenant}.`germline__snv__occurrence`
(
    part                            INT     NOT NULL,
    seq_id                          INT     NOT NULL,
    task_id                         INT     NOT NULL,
    locus_id                        bigint(20) NOT NULL,
    ad_ratio                        FLOAT,
    gq                              INT,
    dp                              INT,
    ad_total                        INT,
    ad_ref                          INT,
    ad_alt                          INT,
    zygosity                        CHAR(3),
    calls                           ARRAY<INT>,
    quality                         FLOAT,
    filter                          VARCHAR(255),
    info_baseq_rank_sum             FLOAT,
    info_excess_het                 FLOAT,
    info_fs                         FLOAT,
    info_ds                         BOOLEAN,
    info_fraction_informative_reads FLOAT,
    info_inbreed_coeff              FLOAT,
    info_mleac                      INT,
    info_mleaf                      FLOAT,
    info_mq                         FLOAT,
    info_m_qrank_sum                FLOAT,
    info_qd                         FLOAT,
    info_r2_5p_bias                 FLOAT,
    info_read_pos_rank_sum          FLOAT,
    info_sor                        FLOAT,
    info_vqslod                     FLOAT,
    info_culprit                    VARCHAR(255),
    info_dp                         INT,
    info_haplotype_score            FLOAT,
    phased                          BOOLEAN,
    parental_origin                 VARCHAR(10),
    father_dp                       INT,
    father_gq                       INT,
    father_ad_ref                   INT,
    father_ad_alt                   INT,
    father_ad_total                 INT,
    father_ad_ratio                 FLOAT,
    father_calls                    ARRAY<INT>,
    father_zygosity                 CHAR(3),
    mother_dp                       INT,
    mother_gq                       INT,
    mother_ad_ref                   INT,
    mother_ad_alt                   INT,
    mother_ad_total                 INT,
    mother_ad_ratio                 FLOAT,
    mother_calls                    ARRAY<INT>,
    mother_zygosity                 CHAR(3),
    transmission_mode               VARCHAR(50),
    info_old_record                 VARCHAR(2000),
    exomiser_moi VARCHAR(10),
    exomiser_acmg_classification  VARCHAR(300),
    exomiser_acmg_evidence        ARRAY<VARCHAR (10)>,
    exomiser_variant_score        FLOAT,
    exomiser_gene_combined_score  FLOAT,
    INDEX locus_id_index (`locus_id`) USING BITMAP COMMENT ''
    ) ENGINE=OLAP
    DUPLICATE KEY(`part`, `seq_id`, `task_id`, `locus_id`);

CREATE TABLE IF NOT EXISTS {tenant}.`snv__variant`(
                                             locus_id BIGINT NOT NULL,
                                             germline_pf_wgs DOUBLE,
                                             germline_pf_wxs DOUBLE,
                                             somatic_pf_tn_wgs DOUBLE,
                                             somatic_pf_tn_wxs DOUBLE,
                                             somatic_pf_to_wgs DOUBLE,
                                             somatic_pf_to_wxs DOUBLE,
                                             gnomad_v3_af DOUBLE,
                                             topmed_af DOUBLE,
                                             tg_af DOUBLE,
                                             germline_pc_wgs INT(11),
                                             germline_pn_wgs INT(11),
                                             germline_pc_wgs_affected INT(11),
                                             germline_pn_wgs_affected INT(11),
                                             germline_pf_wgs_affected DOUBLE,
                                             germline_pc_wgs_not_affected INT(11),
                                             germline_pn_wgs_not_affected INT(11),
                                             germline_pf_wgs_not_affected DOUBLE,
                                             germline_pc_wxs INT(11),
                                             germline_pn_wxs INT(11),
                                             germline_pc_wxs_affected INT(11),
                                             germline_pn_wxs_affected INT(11),
                                             germline_pf_wxs_affected DOUBLE,
                                             germline_pc_wxs_not_affected INT(11),
                                             germline_pn_wxs_not_affected INT(11),
                                             germline_pf_wxs_not_affected DOUBLE,
                                             somatic_pc_tn_wgs INT(11),
                                             somatic_pn_tn_wgs INT(11),
                                             somatic_pc_tn_wxs INT(11),
                                             somatic_pn_tn_wxs INT(11),
                                             somatic_pc_to_wgs INT(11),
                                             somatic_pn_to_wgs INT(11),
                                             somatic_pc_to_wxs INT(11),
                                             somatic_pn_to_wxs INT(11),
                                             chromosome CHAR(2),
                                             start BIGINT NULL,
                                             end BIGINT NULL,
                                             clinvar_name VARCHAR(2000) NULL,
                                             variant_class VARCHAR(50) NULL,
                                             clinvar_interpretation ARRAY<VARCHAR(100)> NULL,
                                             symbol VARCHAR(20) NULL,
                                             impact_score tinyint NULL,
                                             consequences ARRAY<VARCHAR(50)> NULL,
                                             vep_impact VARCHAR(20) NULL,
                                             is_mane_select BOOLEAN NULL,
                                             is_mane_plus BOOLEAN NULL,
                                             is_canonical BOOLEAN NULL,
                                             rsnumber VARCHAR(20) NULL,
                                             reference VARCHAR(2000),
                                             alternate VARCHAR(2000),
                                             mane_select varchar(200) NULL,
                                             hgvsg VARCHAR(2000) NULL,
                                             hgvsc varchar(2000) NULL,
                                             hgvsp varchar(2000) NULL,
                                             locus VARCHAR(2000) NULL,
                                             dna_change VARCHAR(2000),
                                             aa_change VARCHAR(2000),
                                             transcript_id varchar(100),
                                             omim_inheritance_code array<varchar(5)>,
                                             cmc_mutation_url VARCHAR(255),
                                             cmc_sample_mutated INT,
                                             cmc_sample_ratio DOUBLE,
                                             cmc_tier VARCHAR(8)
) PRIMARY KEY(locus_id);

CREATE TABLE IF NOT EXISTS {shared}.`hpo_gene_panel`
(
    symbol varchar(20)  NOT NULL,
    panel  varchar(250) NOT NULL,
    hpo_term_name  varchar(200) NOT NULL,
    hpo_term_id  varchar(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS {shared}.`hpo_term`
(
    id varchar(2000)  NOT NULL,
    name  varchar(2000) NOT NULL,
    term  varchar(2000) NOT NULL
);

CREATE TABLE IF NOT EXISTS {shared}.`mondo_term`
(
    id varchar(2000)  NOT NULL,
    name  varchar(2000) NOT NULL,
    term  varchar(2000) NOT NULL
);

CREATE TABLE IF NOT EXISTS {shared}.`omim_gene_panel`
(
    `symbol`            varchar(30)  NOT NULL COMMENT "",
    `panel`             varchar(200) NOT NULL COMMENT "",
    `inheritance_code`  array<varchar(5)>  NULL COMMENT "",
    `inheritance`       array<varchar(50)>  NULL COMMENT "",
    `omim_gene_id`      int NULL COMMENT "",
    `omim_phenotype_id` int NULL COMMENT ""
) ENGINE=OLAP
         DUPLICATE KEY(`symbol`, `panel`);

CREATE TABLE IF NOT EXISTS {shared}.`orphanet_gene_panel`
(
    symbol varchar(30)  NOT NULL,
    panel  varchar(250) NOT NULL,
    disorder_id bigint NULL,
    type_of_inheritance array<varchar(200)> NULL,
    inheritance_code array<varchar(3)> NULL
);

CREATE TABLE IF NOT EXISTS {shared}.`staging_sequencing_experiment`
(
    case_id INT NOT NULL,
    seq_id INT NOT NULL,
    task_id INT NOT NULL,
    task_type VARCHAR(100) NOT NULL,
    part INT NOT NULL,
    analysis_type VARCHAR(50),
    aliquot VARCHAR(255),
    patient_id VARCHAR(255),
    experimental_strategy VARCHAR(50),
    request_priority VARCHAR(20),
    vcf_filepath VARCHAR(1024),
    cnv_vcf_filepath VARCHAR(1024),
    exomiser_filepath VARCHAR(1024),
    sex VARCHAR(50),
    family_id INT,
    family_role VARCHAR(50),
    affected_status VARCHAR(50),
    histology_type VARCHAR(100),
    created_at DATETIME,
    updated_at DATETIME,
    ingested_at DATETIME,
    deleted BOOLEAN NOT NULL DEFAULT "false"
) PRIMARY KEY (case_id, seq_id, task_id);

CREATE TABLE IF NOT EXISTS {shared}.`clinvar_rcv_summary`
(
    `locus_id`              BIGINT(20)   NOT NULL,
    `clinvar_id`            VARCHAR(32)  NOT NULL,
    `accession`             VARCHAR(32)  NOT NULL,
    `clinical_significance` ARRAY<VARCHAR (64)> NULL,
    `date_last_evaluated`   DATE         NULL,
    `submission_count`      INT(11)      NULL,
    `review_status`         VARCHAR(128) NULL,
    `review_status_stars`   INT(11)      NULL,
    `version`               INT(11)      NULL,
    `traits`                ARRAY< VARCHAR (128)> NULL,
    `origins`               ARRAY< VARCHAR (64)> NULL,
    `submissions` ARRAY<
        STRUCT<
            submitter             VARCHAR(128),
            scv                   VARCHAR(32),
            version               INT(11),
            review_status         VARCHAR(128),
            review_status_stars   INT(11),
            clinical_significance VARCHAR(128),
            date_last_evaluated   DATE
        >
    > NULL,
    `clinical_significance_count` MAP<VARCHAR(64), INT(11)> NULL
)
ENGINE = OLAP
DISTRIBUTED BY HASH(`locus_id`)
BUCKETS 10;

CREATE TABLE IF NOT EXISTS {tenant}.`exomiser`
(
    part                 INT,
    seq_id               INT,
    locus_id             BIGINT,
    id                   VARCHAR(2000),
    locus_hash           VARCHAR(256),
    moi                  VARCHAR(10),
    variant_score        FLOAT,
    gene_combined_score  FLOAT,
    variant_rank         TINYINT,
    rank                 INT,
    symbol               VARCHAR(200),
    acmg_classification  VARCHAR(300),
    acmg_evidence array< VARCHAR (10)>
)
ENGINE = OLAP
DUPLICATE KEY(`part`, `seq_id`, `locus_id`,  `id`)
PARTITION BY (`part`)
DISTRIBUTED BY HASH(`locus_id`)
BUCKETS 10;

CREATE TABLE IF NOT EXISTS {tenant}.`germline__cnv__occurrence` (
     part int(11) NOT NULL,
     seq_id int(11) NULL,
     task_id int(11) NOT NULL,
     cnv_id bigint(20) NOT NULL,
     aliquot varchar(50) NULL,
     chromosome varchar(20) NULL,
     alternate varchar(20) NULL,
     start int(11) NULL,
     end int(11) NULL,
     type varchar(10) NULL,
     length int(11) NULL,
     name varchar(1048576) NULL,
     quality FLOAT NULL,
     calls array<int(11)> NULL,
     filter varchar(255) NULL,
     bc int(11) NULL,
     cn int(11) NULL,
     pe array<int(11)> NULL,
     sm FLOAT NULL,
     svtype varchar(20) NULL,
     svlen int(11) NULL,
     reflen int(11) NULL,
     ciend array<int(11)> NULL,
     cipos array<int(11)> NULL,
     phased boolean NULL,
     cytoband array<varchar(10)> NULL,
     symbol array<varchar(128)> NULL,
     nb_genes int(11) NULL,
     nb_snv int(11) NULL,
     gnomad_af FLOAT NULL,
     gnomad_sc int(11) NULL,
     gnomad_sn int(11) NULL,
     gnomad_sf FLOAT NULL,
     gnomad_sc_hom int(11) NULL,
     gnomad_sc_het int(11) NULL
) ENGINE=OLAP
DUPLICATE KEY(part, seq_id, task_id, cnv_id)
PARTITION BY (part);

CREATE TABLE IF NOT EXISTS {tenant}.`somatic__cnv__occurrence` (
     part int(11) NOT NULL,
     seq_id int(11) NULL,
     task_id int(11) NOT NULL,
     cnv_id bigint(20) NOT NULL,
     aliquot varchar(50) NULL,
     chromosome varchar(20) NULL,
     alternate varchar(20) NULL,
     start int(11) NULL,
     end int(11) NULL,
     type varchar(10) NULL,
     length int(11) NULL,
     name varchar(1048576) NULL,
     quality FLOAT NULL,
     calls array<int(11)> NULL,
     filter varchar(255) NULL,
     bc int(11) NULL,
     pe array<int(11)> NULL,
     sm FLOAT NULL,
     svtype varchar(20) NULL,
     svlen int(11) NULL,
     reflen int(11) NULL,
     ciend array<int(11)> NULL,
     cipos array<int(11)> NULL,
     phased boolean NULL,


     cn int(11) NULL,
     cnf FLOAT NULL,
     cnq FLOAT NULL,
     mcn int(11) NULL,
     mcnf FLOAT NULL,
     mcnq FLOAT NULL,
     maf FLOAT NULL,
     sd FLOAT NULL,
     ascn_as int(11) NULL,
     cytoband array<varchar(10)> NULL,
     symbol array<varchar(128)> NULL,
     nb_genes int(11) NULL,
     nb_snv int(11) NULL,
     gnomad_af FLOAT NULL,
     gnomad_sc int(11) NULL,
     gnomad_sn int(11) NULL,
     gnomad_sf FLOAT NULL,
     gnomad_sc_hom int(11) NULL,
     gnomad_sc_het int(11) NULL
) ENGINE=OLAP
DUPLICATE KEY(part, seq_id, task_id, cnv_id)
PARTITION BY (part);

CREATE TABLE IF NOT EXISTS {tenant}.`somatic__snv__occurrence`
(
    part                            INT    NOT NULL,
    task_id                         INT    NOT NULL,
    tumor_seq_id                    INT    NOT NULL,
    locus_id                        BIGINT NOT NULL,
    normal_seq_id                   INT,
    quality                         FLOAT,
    filter                          VARCHAR(255),

    info_hotspotallele              VARCHAR(255),
    info_hotspot                    BOOLEAN,
    info_old_record                 VARCHAR(2000),
    info_baseq_rank_sum             FLOAT,
    info_excess_het                 FLOAT,
    info_fs                         FLOAT,
    info_ds                         BOOLEAN,
    info_fraction_informative_reads FLOAT,
    info_inbreed_coeff              FLOAT,
    info_mleac                      INT,
    info_mleaf                      FLOAT,
    info_mq                         FLOAT,
    info_mq0                        FLOAT,
    info_m_qrank_sum                FLOAT,
    info_qd                         FLOAT,
    info_r2_5p_bias                 FLOAT,
    info_read_pos_rank_sum          FLOAT,
    info_sor                        FLOAT,
    info_vqslod                     FLOAT,
    info_culprit                    VARCHAR(255),
    info_dp                         INT,
    info_haplotype_score            FLOAT,
    info_aq                         FLOAT,

    tumor_calls                     ARRAY<INT>,
    tumor_dp                        INT,
    tumor_gq                        INT,
    tumor_has_alt                   BOOLEAN,
    tumor_af                        FLOAT,
    tumor_zygosity                  CHAR(3),
    tumor_ad_ref                    INT,
    tumor_ad_alt                    INT,
    tumor_ad_total                  INT,
    tumor_ad_ratio                  FLOAT,
    tumor_phased                    BOOLEAN,
    tumor_gt_status                 VARCHAR(50),
    tumor_sq                        FLOAT,

    normal_calls                    ARRAY<INT>,
    normal_dp                       INT,
    normal_gq                       INT,
    normal_has_alt                  BOOLEAN,
    normal_af                       FLOAT,
    normal_zygosity                 CHAR(3),
    normal_ad_ref                   INT,
    normal_ad_alt                   INT,
    normal_ad_total                 INT,
    normal_ad_ratio                 FLOAT,
    normal_phased                   BOOLEAN,
    normal_gt_status                VARCHAR(50),
    normal_sq                       FLOAT
) ENGINE=OLAP
    DUPLICATE KEY(`part`, `task_id`, `tumor_seq_id`, `locus_id`);

CREATE TABLE IF NOT EXISTS {shared}.`ensembl_gene` (
                                `gene_id` varchar(128) NULL COMMENT "",
                                `chromosome` varchar(10) NULL COMMENT "",
                                `start` bigint(20) NULL COMMENT "",
                                `end` bigint(20) NULL COMMENT "",
                                `version` tinyint(4) NULL COMMENT "",
                                `type` varchar(128) NULL COMMENT "",
                                `strand` char(1) NULL COMMENT "",
                                `phase` tinyint(4) NULL COMMENT "",
                                `name` varchar(128) NULL COMMENT "",
                                `alias` array<varchar(128)> NULL COMMENT "",
                                `biotype` varchar(128) NULL COMMENT "",
                                `ccdsid` varchar(128) NULL COMMENT "",
                                `constitutive` varchar(128) NULL COMMENT "",
                                `description` varchar(500) NULL COMMENT "",
                                `ensembl_end_phase` varchar(10) NULL COMMENT "",
                                `ensembl_phase` varchar(10) NULL COMMENT "",
                                `external_name` varchar(128) NULL COMMENT "",
                                `logic_name` varchar(500) NULL COMMENT "",
                                `length` bigint(20) NULL COMMENT ""
) ENGINE=OLAP
    DUPLICATE KEY(`gene_id`, `chromosome`);

CREATE TABLE IF NOT EXISTS {shared}.`ensembl_exon_by_gene` (
                                        `gene_id` varchar(128) NULL COMMENT "",
                                        `exon_id` varchar(128) NULL COMMENT "",
                                        `chromosome` varchar(10) NULL COMMENT "",
                                        `start` bigint(20) NULL COMMENT "",
                                        `end` bigint(20) NULL COMMENT "",
                                        `transcript_ids` array<varchar(128)> NULL COMMENT "",
                                        `version` tinyint(4) NULL COMMENT "",
                                        `type` varchar(128) NULL COMMENT "",
                                        `strand` char(1) NULL COMMENT "",
                                        `phase` tinyint(4) NULL COMMENT "",
                                        `name` varchar(128) NULL COMMENT "",
                                        `alias` array<varchar(128)> NULL COMMENT "",
                                        `constitutive` varchar(128) NULL COMMENT "",
                                        `description` varchar(500) NULL COMMENT "",
                                        `ensembl_end_phase` varchar(10) NULL COMMENT "",
                                        `ensembl_phase` varchar(10) NULL COMMENT "",
                                        `external_name` varchar(128) NULL COMMENT "",
                                        `logic_name` varchar(500) NULL COMMENT "",
                                        `length` bigint(20) NULL COMMENT ""
) ENGINE=OLAP
DUPLICATE KEY(`gene_id`, `exon_id`, `chromosome`);

CREATE TABLE IF NOT EXISTS {shared}.`cytoband` (
                            `chromosome` char(2) NOT NULL COMMENT "",
                            `cytoband` varchar(20) NOT NULL COMMENT "",
                            `start` bigint(20) NOT NULL COMMENT "",
                            `end` bigint(20) NOT NULL COMMENT "",
                            `gie_stain` varchar(20) NULL COMMENT ""
) ENGINE=OLAP
DUPLICATE KEY(`chromosome`, `cytoband`);

CREATE TABLE IF NOT EXISTS {shared}.`gnomad_genomes_v3` (
    `locus_id` bigint(20) NOT NULL,
    `af` double NULL,
    `ac` INT(11),
    `an` INT(11),
    `hom` INT(11)
);

CREATE TABLE IF NOT EXISTS {shared}.`topmed_bravo` (
    `locus_id` bigint(20) NOT NULL,
    `af` double NULL,
    `ac` INT(11),
    `an` INT(11),
    `hom` INT(11)
);

CREATE TABLE IF NOT EXISTS {shared}.`1000_genomes` (
    `locus_id` bigint(20) NOT NULL,
    `af` double NULL,
    `ac` INT(11),
    `an` INT(11)
);

CREATE TABLE IF NOT EXISTS {shared}.`ddd_gene_panel` (
    symbol varchar(30) NOT NULL,
    panel varchar(250) NOT NULL
) DUPLICATE KEY(`symbol`);

CREATE TABLE IF NOT EXISTS {shared}.`cosmic_gene_panel` (
    symbol varchar(30) NOT NULL,
    panel varchar(250) NOT NULL
) DUPLICATE KEY(`symbol`);
