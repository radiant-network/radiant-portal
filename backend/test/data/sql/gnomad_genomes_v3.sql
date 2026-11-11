CREATE TABLE gnomad_genomes_v3
(
    locus_id bigint NOT NULL,
    af       double NULL,
    ac       INT(11),
    an       INT(11),
    hom      INT(11)
) PRIMARY KEY(locus_id);