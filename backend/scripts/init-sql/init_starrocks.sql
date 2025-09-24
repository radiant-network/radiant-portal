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
    info_old_record                 VARCHAR(2000),
    exomiser_moi VARCHAR(10),
    exomiser_acmg_classification  VARCHAR(300),
    exomiser_acmg_evidence        ARRAY<VARCHAR (10)>,
    exomiser_variant_score        FLOAT,
    exomiser_gene_combined_score  FLOAT,
    INDEX locus_id_index (`locus_id`) USING BITMAP COMMENT ''
    ) ENGINE=OLAP
    DUPLICATE KEY(`part`, `seq_id`, `task_id`, `locus_id`);

CREATE TABLE IF NOT EXISTS `germline__snv__variant`
(
    locus_id               BIGINT NOT NULL,
    pf_wgs DOUBLE,
    gnomad_v3_af DOUBLE,
    topmed_af DOUBLE,
    tg_af DOUBLE,
    pc_wgs INT(11),
    pn_wgs INT(11),
    pc_wgs_affected INT(11),
    pn_wgs_affected INT(11),
    pf_wgs_affected DOUBLE,
    pc_wgs_not_affected INT(11),
    pn_wgs_not_affected INT(11),
    pf_wgs_not_affected DOUBLE,
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
    panel  varchar(250) NOT NULL,
    hpo_term_name  varchar(200) NOT NULL,
    hpo_term_id  varchar(200) NOT NULL
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

CREATE TABLE IF NOT EXISTS orphanet_gene_panel
(
    symbol varchar(30)  NOT NULL,
    panel  varchar(250) NOT NULL,
    disorder_id bigint NULL,
    type_of_inheritance array<varchar(200)> NULL,
    inheritance_code array<varchar(3)> NULL
);

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


CREATE TABLE IF NOT EXISTS `clinvar_rcv_summary`
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

CREATE TABLE IF NOT EXISTS exomiser
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

CREATE TABLE IF NOT EXISTS `germline__cnv__occurrence` (
    `part`         INT NOT NULL,
    `seq_id`       INT NOT NULL,
    `id`           VARCHAR(256),
    `aliquot`      VARCHAR(255) NOT NULL,
    `chromosome`   VARCHAR(2) NOT NULL,
    `start`        BIGINT NOT NULL,
    `end`          BIGINT NOT NULL,
    `type`         VARCHAR(32) NOT NULL,
    `length`       BIGINT NOT NULL,
    `name`         VARCHAR(128) NOT NULL,
    `quality`      FLOAT,
    `calls`        ARRAY<INT>,
    `filter`       VARCHAR(32),
    `bc`           INT,
    `cn`           INT,
    `pe`           ARRAY<INT>,
    `sm`           FLOAT,
    `svtype`       VARCHAR(32),
    `svlen`        INT,
    `reflen`       INT,
    `ciend`        ARRAY<INT>,
    `cipos`        ARRAY<INT>
)
ENGINE=OLAP
DUPLICATE KEY(`part`, `seq_id`, `id`);

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

INSERT INTO germline__snv__occurrence (part, seq_id, task_id, locus_id, gq, filter, zygosity, ad_ratio, exomiser_moi, exomiser_acmg_classification, exomiser_acmg_evidence, exomiser_variant_score, exomiser_gene_combined_score)
VALUES
    (1, 1, 1, 1000, 100, 'PASS', 'HET', 1.0, 0, 'Pathogenic', ['PVS1', 'PM2'], 0.9, 0.8),
    (1, 1, 1, 1000, 150, 'PASS', 'HOM', 0.5, 0, 'Likely pathogenic', ['PP3'], 0.85, 0.75),
    (1, 19, 19, 2000, 200, 'PASS', 'HET', 1.0, 0, 'Benign', ['BP4'], 0.95, 0.9);

INSERT INTO germline__snv__variant (locus_id, impact_score, pf_wgs, pc_wgs, pn_wgs, pc_wgs_affected, pn_wgs_affected, pf_wgs_affected, pc_wgs_not_affected, pn_wgs_not_affected, pf_wgs_not_affected, gnomad_v3_af, hgvsg, omim_inheritance_code, variant_class, vep_impact, symbol, is_mane_select, is_canonical, clinvar_interpretation, rsnumber, aa_change, consequences, locus, chromosome, start, reference, alternate, transcript_id)
VALUES
    (1000, 3, 0.01, 10, 100, 20, 60, 0.333333333333, 10, 40, 0.25, 0.01, 'hgvsg1', 'AD', 'class1', 'MODIFIER', 'BRAF', true, true, ['Benign', 'Pathogenic'], 'rs111111111', 'p.Arg19His', ['splice acceptor'], 'locus_full_1000', '1', 1111, 'A', 'T', 'T001'),
    (2000, 1, 0.02, 20, 100, 40, 50, 0.80, 20, 50, 0.4, 0.02, 'hgvsg2', 'Smu', 'class2', 'MODIFIER', 'BRAC', false, true, ['Pathogenic'], 'rs2222222', 'p.Arg19His', ['splice acceptor'], 'locus_full_2000', '2', 2222, 'C', 'G', 'T002');

INSERT INTO staging_sequencing_experiment (case_id, seq_id, task_id, part, analysis_type, ingested_at)
VALUES
    (1, 1, 1, 1, 'germline', '1970-01-01'),
    (1, 2, 1, 1, 'germline', '1970-01-01'),
    (7, 19, 19, 1, 'germline', '1970-01-01');

INSERT INTO omim_gene_panel (symbol, panel, omim_gene_id, omim_phenotype_id, inheritance_code, inheritance)
VALUES
('BRAF', 'Noonan syndrome 7', 164757, 613706, ['AD'], ['Autosomal dominant']),
('TP53', 'Basal cell carcinoma 7', 191170,614740, ['AD'], ['Autosomal dominant']),
('BRAF','LEOPARD syndrome 3',164757, 613707, ['AD'], ['Autosomal dominant']),
('BRAC', 'Osteosarcoma', 191170, 259500, ['Smu'], ['Somatic mutation']),
('TML1', 'Leukemia/lymphoma, T-cell', 603769, 603769, null, null);

INSERT INTO hpo_gene_panel (symbol, panel, hpo_term_name, hpo_term_id)
VALUES
    ('TP53', 'Colon cancer(HP:0003003)', 'Colon cancer','HP:0003003'),
    ('BRAF','Acne(HP:0001061)','Acne', 'HP:0001061'),
    ('BRAF','Brachydactyly(HP:0001156)','Brachydactyly', 'HP:0001156'),
    ('BRAF','Epicanthus(HP:0000286)','Epicanthus', 'HP:0000286');


INSERT INTO orphanet_gene_panel (symbol, panel, disorder_id, type_of_inheritance)
VALUES
    ('TP53', 'Familial pancreatic carcinoma', 3708,['Autosomal dominant','Multigenic/multifactorial']),
    ('BRAF','Pilomyxoid astrocytoma',19660, ['Not applicable']),
    ('BRAF','Cardiofaciocutaneous syndrome',1559, ['Autosomal dominant']),
    ('BRAF','Classic hairy cell leukemia',10778, ['Unknown']);

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

INSERT INTO test_db.clinvar_rcv_summary
(locus_id, clinvar_id, accession, clinical_significance, date_last_evaluated, submission_count, review_status, review_status_stars, version, traits, origins, submissions, clinical_significance_count)
VALUES
    (1000,'RCV000000001','SCV000000001',['Pathogenic'], DATE('2023-01-01 00:00:00'),10,'reviewed',4,1, ['Trait1'],['somatic'],
        [row('Submitter1', 'SCV000000001', 1, 'reviewed', 4, 'Pathogenic', DATE('2023-01-01 00:00:00'))], map{'Pathogenic': 10});


INSERT INTO test_db.exomiser
(part, seq_id, locus_id, id, locus_hash, moi, variant_score, gene_combined_score, variant_rank, rank, symbol, acmg_classification, acmg_evidence)
VALUES
    (1, 1, 1000, 'var1', 'hash1', 'AD', 0.9, 0.8, 1, 1, 'BRAF', 'Pathogenic', ['PVS1', 'PM2']),
    (2, 2, 1000, 'var1', 'hash1', 'AD', 0.9, 0.8, 1, 1, 'BRAF', 'Pathogenic', ['PVS1', 'PM2']),
    (3, 3, 1000, 'var1', 'hash1', 'AD', 0.9, 0.8, 1, 1, 'BRAF', 'Benign', ['PVS1', 'PM2']);


INSERT INTO test_db.germline__cnv__occurrence
(part, seq_id, id, aliquot, chromosome, start, end, type, length, name, quality, calls, filter, bc, cn, pe, sm, svtype,
svlen, reflen, ciend, cipos)
VALUES
    (1, 1, 'CNV1_1', 'aliquot1', '1', 1000, 2000, 'DEL', 1000, 'CNV1', 0.999, [1, 2, 3], 'PASS', 2, 1, [1, 2], 0.5, 'DEL', 1000, 1000, [100, 200], [50, 150]),
    (1, 1, 'CNV2_1', 'aliquot2', '2', 2000, 3000, 'DUP', 1000, 'CNV2', 0.888, [4, 5, 6], 'PASS', 3, 2, [3, 4], 0.6, 'DUP', 1000, 1000, [200, 300], [150, 250]),
    (1, 2, 'CNV3_2', 'aliquot3', 'X', 3000, 4000, 'INV', 1000, 'CNV3', 0.777, [7, 8, 9], 'PASS', 4, 3, [5, 6], 0.7, 'INV', 1000, 1000, [300, 400], [250, 350]);

CREATE TABLE `ensembl_gene` (
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

INSERT INTO test_db.ensembl_gene(gene_id, name, alias) VALUES
                                                       ('ENSG00000000003', 'TSPAN6', ['T245','TM4SF6','TSPAN-6']),
                                                       ('ENSG00000000005', 'TNMD', ['BRICD4','CHM1L','MYODULIN', 'TEM', 'TENDIN']),
                                                       ('ENSG00000000419', 'DPM1', ['CDGIE','MPDS']),
                                                       ('ENSG00000000457', 'SCYL3', ['PACE-1','PACE1']),
                                                       ('ENSG00000000460', 'FIRRM', ['APOLO1','C1ORF112','FLIP', 'FLJ10706', 'MEICA1']),
                                                       ('ENSG00000000938', 'FGR', ['C-FGR','P55C-FGR','SRC2']),
                                                       ('ENSG00000000971', 'CFH', ['ARMD4','ARMS1','FHL1','HF','HF1','HF2','HUS']),
                                                       ('ENSG00000001036', 'FUCA2', ['DJ20N2.5','MGC1314']),
                                                       ('ENSG00000001084', 'GCLC', ['GCS','GLCL','GLCLC']),
                                                       ('ENSG00000001167', 'NFYA', ['CBF-B','HAP2','NF-YA']),
                                                       ('ENSG00000143420', 'ENSA', ['ARPP-19E','MGC4319','MGC78563','MGC8394']);

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