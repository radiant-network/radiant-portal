CREATE TABLE `gnomad_constraint` (
                                     `transcript_id` varchar(100) NOT NULL COMMENT "",
                                     `pli` float NULL COMMENT "",
                                     `loeuf` float NULL COMMENT ""
) ENGINE=OLAP
DUPLICATE KEY(`transcript_id`)
