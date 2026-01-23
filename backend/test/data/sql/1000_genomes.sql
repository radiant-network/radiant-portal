CREATE TABLE `1000_genomes`
(
    locus_id bigint NOT NULL,
    af       double NULL,
    ac       INT(11),
    an       INT(11)
) PRIMARY KEY(locus_id);