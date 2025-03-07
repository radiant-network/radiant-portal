package types

/*
+-------------------------+--------------+------+-------+---------+-------+
| Field                   | Type         | Null | Key   | Default | Extra |
+-------------------------+--------------+------+-------+---------+-------+
| locus_id                | bigint       | YES  | false | NULL    |       |
| part                    | tinyint      | YES  | false | NULL    |       |
| is_deleterious          | boolean      | YES  | false | NULL    |       |
| consequence_id          | tinyint      | YES  | false | NULL    |       |
| symbol                  | varchar(20)  | YES  | false | NULL    |       |
| biotype_id              | varchar(50)  | YES  | false | NULL    |       |
| gnomad_pli              | decimal(6,5) | YES  | false | NULL    |       |
| gnomad_loeuf            | decimal(6,5) | YES  | false | NULL    |       |
| spliceai_ds             | decimal(6,5) | YES  | false | NULL    |       |
| impact_score            | tinyint      | YES  | false | NULL    |       |
| sift_score              | decimal(6,4) | YES  | false | NULL    |       |
| sift_pred               | char(1)      | YES  | false | NULL    |       |
| polyphen2_hvar_score    | decimal(6,5) | YES  | false | NULL    |       |
| polyphen2_hvar_pred     | char(1)      | YES  | false | NULL    |       |
| fathmm_score            | decimal(6,4) | YES  | false | NULL    |       |
| fathmm_pred             | char(1)      | YES  | false | NULL    |       |
| cadd_score              | decimal(6,4) | YES  | false | NULL    |       |
| cadd_phred              | decimal(6,4) | YES  | false | NULL    |       |
| dann_score              | decimal(6,5) | YES  | false | NULL    |       |
| revel_score             | decimal(6,5) | YES  | false | NULL    |       |
| lrt_score               | decimal(6,5) | YES  | false | NULL    |       |
| lrt_pred                | char(1)      | YES  | false | NULL    |       |
| phyloP17way_primate     | decimal(7,5) | YES  | false | NULL    |       |
| phyloP100way_vertebrate | decimal(7,5) | YES  | false | NULL    |       |
+-------------------------+--------------+------+-------+---------+-------+
*/

var ConsequenceFilterTable = Table{
	Name:  "consequences_filter",
	Alias: "cf",
}

var ConsequenceIdField = Field{
	Name:            "consequence_id",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           ConsequenceFilterTable,
}

var SymbolFilterField = Field{
	Name:            "symbol",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	CanBeSelected:   false,
	Table:           ConsequenceFilterTable,
}

var ImpactScoreField = Field{
	Name:            "impact_score",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           ConsequenceFilterTable,
}

var SiftPredField = Field{
	Name:            "sift_pred",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           ConsequenceFilterTable,
}
