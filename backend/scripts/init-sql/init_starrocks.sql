CREATE DATABASE IF NOT EXISTS test_db;

USE test_db;

CREATE TABLE IF NOT EXISTS `germline__snv__consequence`
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

CREATE TABLE IF NOT EXISTS `clinvar`
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

CREATE TABLE IF NOT EXISTS `germline__snv__consequence_filter_partitioned`
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

CREATE TABLE IF NOT EXISTS `germline__snv__occurrence`
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
    info_old_record                 VARCHAR(2000)
    ) ENGINE=OLAP
    DUPLICATE KEY(`part`, `seq_id`, `task_id`, `locus_id`);

CREATE TABLE IF NOT EXISTS `germline__snv__variant`
(
    locus_id               BIGINT NOT NULL,
    pf_wgs DOUBLE,
    gnomad_v3_af DOUBLE,
    topmed_af DOUBLE,
    tg_af DOUBLE,
    pc_wgs                     INT(11),
    pn_wgs                     INT(11),
    chromosome             CHAR(2),
    start                  BIGINT NULL COMMENT '',
    end                    BIGINT NULL COMMENT '',
    clinvar_name           VARCHAR(2000) NULL COMMENT '',
    variant_class          VARCHAR(50) NULL COMMENT '',
    clinvar_interpretation ARRAY<VARCHAR(100)> NULL COMMENT '',
    symbol                 VARCHAR(20) NULL COMMENT '',
    impact_score           tinyint NULL COMMENT "",
    consequences           ARRAY<VARCHAR(50)> NULL COMMENT '',
    vep_impact             VARCHAR(20) NULL COMMENT '',
    is_mane_select         BOOLEAN NULL COMMENT '',
    is_mane_plus           BOOLEAN NULL COMMENT '',
    is_canonical           BOOLEAN NULL COMMENT '',
    rsnumber               ARRAY<VARCHAR(15)> NULL COMMENT '',
    reference              VARCHAR(2000),
    alternate              VARCHAR(2000),
    mane_select            varchar(200) NULL,
    hgvsg                  VARCHAR(2000) NULL,
    hgvsc                  varchar(2000) NULL,
    hgvsp                  varchar(2000) NULL,
    locus                  VARCHAR(2000) NULL,
    dna_change             VARCHAR(2000),
    aa_change              VARCHAR(2000),
    transcript_id          varchar(100) COMMENT "",
    omim_inheritance_code  array<varchar(5)> COMMENT ""
    ) PRIMARY KEY(locus_id);

create table IF NOT EXISTS hpo_gene_panel
(
    symbol varchar(20)  NOT NULL,
    panel  varchar(200) NOT NULL
);

create table IF NOT EXISTS hpo_term
(
    id varchar(2000)  NOT NULL,
    name  varchar(2000) NOT NULL,
    term  varchar(2000) NOT NULL
);

create table IF NOT EXISTS mondo_term
(
    id varchar(2000)  NOT NULL,
    name  varchar(2000) NOT NULL,
    term  varchar(2000) NOT NULL
);

CREATE TABLE IF NOT EXISTS omim_gene_panel
(
    `symbol`            varchar(30)  NOT NULL COMMENT "",
    `panel`             varchar(200) NOT NULL COMMENT "",
    `inheritance_code`  array<varchar(5)>  NULL COMMENT "",
    `inheritance`       array<varchar(50)>  NULL COMMENT "",
    `omim_gene_id`      int NULL COMMENT "",
    `omim_phenotype_id` int NULL COMMENT ""
) ENGINE=OLAP
         DUPLICATE KEY(`symbol`, `panel`);

CREATE TABLE IF NOT EXISTS `staging_sequencing_experiment`
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
    PRIMARY KEY(`case_id`,`seq_id`,`task_id`);

INSERT INTO clinvar (locus_id, chromosome, start, reference, alternate, name)
VALUES
    (1000, '1', '1111', 'A', 'T', '111111'),
    (2000, '2', '2222', 'C', 'G', '222222');

INSERT INTO germline__snv__consequence (locus_id, consequences, is_picked, sift_pred, sift_score, fathmm_score, fathmm_pred, revel_score, cadd_score, cadd_phred, spliceai_ds, spliceai_type, gnomad_pli, gnomad_loeuf, biotype, symbol, transcript_id)
VALUES
    (1000, ['csq10'], true, 'T', 0.1, 0.1, 'T', 0.1, 0.1, 0.1, 0.1, ['AG'], 0.1, 0.1, 'IG_C_gene', 'BRAF', 'T001'),
    (1000, ['csq11'], false, 'T', 0.11, 0.11, 'T', 0.11, 0.11, 0.11, 0.11, ['AT'], 0.11, 0.11, 'IG_C_pseudogene', 'BRAC', 'T011'),
    (2000, ['csq20'], true, 'T', 0.2, 0.2, 'T', 0.2, 0.2, 0.2, 0.2, ['AT'], 0.2, 0.2, 'IG_C_pseudogene', 'BRAC', 'T002');

INSERT INTO germline__snv__consequence_filter_partitioned (part, locus_id, consequence, symbol, impact_score, sift_pred, is_deleterious)
VALUES
    (1, 1000, 'csq10', 'BRAF', 3, 'T', true),
    (1, 1000, 'csq11', 'BRAC', 3, 'T', true),
    (1, 2000, 'csq20', 'BRAC', 1, 'T', true);

INSERT INTO germline__snv__occurrence (part, seq_id, task_id, locus_id, gq, filter, zygosity, ad_ratio)
VALUES
    (1, 1, 1, 1000, 100, 'PASS', 'HET', 1.0),
    (1, 1, 1, 2000, 200, 'PASS', 'HOM', 0.5),
    (1, 19, 19, 1000, 300, 'PASS', 'HET', 1.0);

INSERT INTO germline__snv__variant (locus_id, impact_score, pf_wgs, pc_wgs, gnomad_v3_af, hgvsg, omim_inheritance_code, variant_class, vep_impact, symbol, is_mane_select, is_canonical, clinvar_interpretation, rsnumber, aa_change, consequences, locus, chromosome, start, reference, alternate, transcript_id)
VALUES
    (1000, 3, 0.01, 10, 0.01, 'hgvsg1', 'AD', 'class1', 'MODIFIER', 'BRAF', true, true, ['Benign', 'Pathogenic'], 'rs111111111', 'p.Arg19His', ['splice acceptor'], 'locus_full_1000', '1', 1111, 'A', 'T', 'T001'),
    (2000, 1, 0.02, 20, 0.02, 'hgvsg2', 'Smu', 'class2', 'MODIFIER', 'BRAC', false, true, ['Pathogenic'], 'rs2222222', 'p.Arg19His', ['splice acceptor'], 'locus_full_2000', '2', 2222, 'C', 'G', 'T002');

INSERT INTO staging_sequencing_experiment (case_id, seq_id, task_id, part, analysis_type)
VALUES
    (1, 1, 1, 1, 'germline'),
    (1, 2, 1, 1, 'germline'),
    (7, 19, 19, 1, 'germline');

INSERT INTO omim_gene_panel (symbol, panel, omim_gene_id, omim_phenotype_id, inheritance_code, inheritance)
VALUES
('BRAF', 'Noonan syndrome 7', 164757, 613706, ['AD'], ['Autosomal dominant']),
('TP53', 'Basal cell carcinoma 7', 191170,614740, ['AD'], ['Autosomal dominant']),
('BRAF','LEOPARD syndrome 3',164757, 613707, ['AD'], ['Autosomal dominant']),
('BRAC', 'Osteosarcoma', 191170, 259500, ['Smu'], ['Somatic mutation']),
('TML1', 'Leukemia/lymphoma, T-cell', 603769, 603769, null, null);

INSERT INTO mondo_term (id, name, term)
VALUES
('MONDO:0000001', 'blood group incompatibility', 'MONDO:0000001 blood group incompatibility'),
('MONDO:0000002', 'blood vessel neoplasm', 'MONDO:0000002 blood vessel neoplasm'),
('MONDO:0000003', 'colorblindness, partial', 'MONDO:0000003 colorblindness, partial'),
('MONDO:0700092', 'neurodevelopmental disorder', 'MONDO:0700092 neurodevelopmental disorder');

INSERT INTO hpo_term (id, name, term)
VALUES
    ('HP:0000001', 'Nocturia', 'HP:0000001 Nocturia'),
    ('HP:0000002', 'Abnormality of body height', 'HP:0000002 Abnormality of body height'),
    ('HP:0000003', 'Multicystic kidney dysplasia', 'HP:0000003 Multicystic kidney dysplasia'),
    ('HP:0010818', 'Generalized tonic seizure', 'HP:0010818 Generalized tonic seizure'),
    ('HP:0002011', 'Morphological central nervous system abnormality', 'HP:0002011 Morphological central nervous system abnormality'),
    ('HP:0004325', 'Decreased body weight', 'HP:0004325 Decreased body weight'),
    ('HP:0007068', 'Inferior cerebellar vermis hypoplasia', 'HP:0007068 Inferior cerebellar vermis hypoplasia'),
    ('HP:0010819', 'Atonic seizure', 'HP:0010819 Atonic seizure'),
    ('HP:0012443', 'Abnormal brain morphology', 'HP:0012443 Abnormal brain morphology'),
    ('HP:0009800', 'Maternal diabetes', 'HP:0009800 Maternal diabetes'),
    ('HP:0010519', 'Increased fetal movement', 'HP:0010519 Increased fetal movement'),
    ('HP:0100622', 'Maternal seizure', 'HP:0100622 Maternal seizure'),
    ('HP:0000479', 'Abnormal retinal morphology', 'HP:0000479 Abnormal retinal morphology'),
    ('HP:0001562', 'Oligohydramnios', 'HP:0001562 Oligohydramnios'),
    ('HP:0001561', 'Polyhydramnios', 'HP:0001561 Polyhydramnios');

CREATE EXTERNAL CATALOG IF NOT EXISTS radiant_jdbc
		PROPERTIES
		(
			"type"="jdbc",
			"user"="radiant",
			"password"="radiant",
			"jdbc_uri"="jdbc:postgresql://postgres:5432/radiant",
			"driver_url"="https://repo1.maven.org/maven2/org/postgresql/postgresql/42.3.3/postgresql-42.3.3.jar",
			"driver_class"="org.postgresql.Driver"
		);