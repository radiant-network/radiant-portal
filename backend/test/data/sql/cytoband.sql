CREATE TABLE `cytoband` (
                            `chromosome` char(2) NOT NULL COMMENT "",
                            `cytoband` varchar(20) NOT NULL COMMENT "",
                            `start` bigint(20) NOT NULL COMMENT "",
                            `end` bigint(20) NOT NULL COMMENT "",
                            `gie_stain` varchar(20) NULL COMMENT ""
) ENGINE=OLAP
DUPLICATE KEY(`chromosome`, `cytoband`)