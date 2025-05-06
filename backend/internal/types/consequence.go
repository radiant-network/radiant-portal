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

type Consequence = struct {
	Picked              bool              `json:"picked,omitempty"`
	Symbol              string            `json:"symbol,omitempty"`
	Biotype             string            `json:"biotype,omitempty"`
	GnomadPli           float32           `json:"gnomad_pli,omitempty"`
	GnomadLoeuf         float32           `json:"gnomad_loeuf,omitempty"`
	SpliceaiDs          float32           `json:"spliceai_ds,omitempty"`
	SpliceaiType        JsonArray[string] `gorm:"type:json" json:"spliceai_type,omitempty"`
	EnsemblTranscriptId string            `json:"transcript_id,omitempty"`
	Canonical           bool              `json:"canonical,omitempty"`
	ManeSelect          bool              `json:"mane_select,omitempty"`
	ManePlus            bool              `json:"mane_plus,omitempty"`  // TODO
	ExonRank            int               `json:"exon_rank,omitempty"`  //TODO
	ExonTotal           int               `json:"exon_total,omitempty"` //TODO
	CodingDnaChange     string            `json:"coding_dna_change,omitempty"`
	AaChange            string            `json:"aa_change,omitempty"`
	Consequence         JsonArray[string] `gorm:"type:json" json:"consequence"`                            // TODO
	VepImpact           VepImpact         `json:"vep_impact,omitempty" enums:"MODIFIER,LOW,MODERATE,HIGH"` // TODO
	SiftPred            string            `json:"sift_pred,omitempty"`
	SiftScore           float32           `json:"sift_score,omitempty"`
	FathmmPred          string            `json:"fathmm_pred,omitempty"`
	FathmmScore         float32           `json:"fathmm_score,omitempty"`
	CaddScore           float32           `json:"cadd_score,omitempty"`
	CaddPhred           float32           `json:"cadd_phred,omitempty"`
	DannScore           float32           `json:"dann_score,omitempty"`
	LrtPred             string            `json:"lrt_pred,omitempty"`
	LrtScore            float32           `json:"lrt_score,omitempty"`
	RevelScore          float32           `json:"revel_score,omitempty"`
	Polyphen2HvarPred   string            `json:"polyphen2_hvar_pred,omitempty"`
	Polyphen2HvarScore  float32           `json:"polyphen2_hvar_score,omitempty"`
	PhyloP17wayPrimate  float32           `json:"phyloP17way_primate,omitempty"`
	RefseqMrnaId        string            `json:"refseq_mrna_id,omitempty"` //TODO
} // @name Consequence

type VariantConsequence = struct {
	Picked       bool                  `json:"picked,omitempty"`
	Symbol       string                `json:"symbol,omitempty"`
	Biotype      string                `json:"biotype,omitempty"`
	GnomadPli    float32               `json:"gnomad_pli,omitempty"`
	GnomadLoeuf  float32               `json:"gnomad_loeuf,omitempty"`
	SpliceaiDs   float32               `json:"spliceai_ds,omitempty"`
	SpliceaiType JsonArray[string]     `gorm:"type:json" json:"spliceai_type,omitempty"`
	Transcripts  JsonArray[Transcript] `gorm:"type:json" json:"transcripts"`
} // @name VariantConsequence

var ConsequenceFilterTable = Table{
	Name:  "consequences_filter",
	Alias: "cf",
}

var ConsequenceTable = Table{
	Name:  "consequences",
	Alias: "c",
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

var ImpactScoreFilterField = Field{
	Name:            "impact_score",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	CanBeSelected:   false,
	Table:           ConsequenceFilterTable,
}

var CaddScoreField = Field{
	Name:            "cadd_score",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Type:            NumericType,
	Table:           ConsequenceFilterTable,
}

var CaddPhredField = Field{
	Name:            "cadd_phred",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Type:            NumericType,
	Table:           ConsequenceFilterTable,
}

var DannScoreField = Field{
	Name:            "dann_score",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Type:            NumericType,
	Table:           ConsequenceFilterTable,
}

var FathmmPredField = Field{
	Name:            "fathmm_pred",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           ConsequenceFilterTable,
}

var LrtPredField = Field{
	Name:            "lrt_pred",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           ConsequenceFilterTable,
}
var Polyphen2HvarPredField = Field{
	Name:            "polyphen2_hvar_pred",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           ConsequenceFilterTable,
}

var SpliceaiDsField = Field{
	Name:            "spliceai_ds",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Type:            NumericType,
	Table:           ConsequenceFilterTable,
}

var RevelScoreField = Field{
	Name:            "revel_score",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Type:            NumericType,
	Table:           ConsequenceFilterTable,
}

var SiftPredField = Field{
	Name:            "sift_pred",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           ConsequenceFilterTable,
}

var GnomadPliField = Field{
	Name:            "gnomad_pli",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Type:            NumericType,
	Table:           ConsequenceFilterTable,
}

var GnomadLoeufField = Field{
	Name:            "gnomad_loeuf",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Type:            NumericType,
	Table:           ConsequenceFilterTable,
}
