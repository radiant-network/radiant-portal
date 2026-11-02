CREATE TABLE IF NOT EXISTS `germline__cnv__variant_frequency` (
     cnv_id bigint(20) NOT NULL,
     pc_wgs BIGINT NULL,
     pn_wgs BIGINT NULL,
     pf_wgs DOUBLE NULL,
     pc_wgs_affected BIGINT NULL,
     pn_wgs_affected BIGINT NULL,
     pf_wgs_affected DOUBLE NULL,
     pc_wgs_not_affected BIGINT NULL,
     pn_wgs_not_affected BIGINT NULL,
     pf_wgs_not_affected DOUBLE NULL,
     pc_wxs BIGINT NULL,
     pn_wxs BIGINT NULL,
     pf_wxs DOUBLE NULL,
     pc_wxs_affected BIGINT NULL,
     pn_wxs_affected BIGINT NULL,
     pf_wxs_affected DOUBLE NULL,
     pc_wxs_not_affected BIGINT NULL,
     pn_wxs_not_affected BIGINT NULL,
     pf_wxs_not_affected DOUBLE NULL
) ENGINE=OLAP
DUPLICATE KEY(cnv_id)
DISTRIBUTED BY HASH(cnv_id) BUCKETS 1;
