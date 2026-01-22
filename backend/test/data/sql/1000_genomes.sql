CREATE TABLE `1000_genomes`
(
    locus_id bigint NOT NULL,
    af       double NULL COMMENT "",
    ac       INT(11) COMMENT "",
    an       INT(11) COMMENT ""
) PRIMARY KEY(locus_id);