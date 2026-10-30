CREATE TABLE IF NOT EXISTS `somatic__cnv__variant_frequency` (
     cnv_id bigint(20) NOT NULL,
     pc_to_wgs BIGINT NULL,
     pn_to_wgs BIGINT NULL,
     pf_to_wgs DOUBLE NULL,
     pc_to_wxs BIGINT NULL,
     pn_to_wxs BIGINT NULL,
     pf_to_wxs DOUBLE NULL
) ENGINE=OLAP
DUPLICATE KEY(cnv_id)
DISTRIBUTED BY HASH(cnv_id) BUCKETS 1;
