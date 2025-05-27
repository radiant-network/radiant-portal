package types

/*
+-----------------------+------------------+----+-----+-------+-----+
|Field                  |Type              |Null|Key  |Default|Extra|
+-----------------------+------------------+----+-----+-------+-----+
|locus_id               |bigint            |NO  |true |null   |     |
|symbol                 |varchar(30)       |NO  |true |null   |     |
|transcript_id          |varchar(100)      |NO  |true |null   |     |
|consequences           |array<varchar(50)>|YES |false|null   |     |
|impact_score           |tinyint           |YES |false|null   |     |
|biotype                |varchar(50)       |YES |false|null   |     |
|exon_rank              |int               |YES |false|null   |     |
|exon_total             |int               |YES |false|null   |     |
|spliceai_ds            |float             |YES |false|null   |     |
|spliceai_type          |array<varchar(2)> |YES |false|null   |     |
|is_canonical           |boolean           |YES |false|null   |     |
|is_picked              |boolean           |YES |false|null   |     |
|is_mane_select         |boolean           |YES |false|null   |     |
|is_mane_plus           |boolean           |YES |false|null   |     |
|mane_select            |varchar(200)      |YES |false|null   |     |
|sift_score             |float             |YES |false|null   |     |
|sift_pred              |varchar(1)        |YES |false|null   |     |
|polyphen2_hvar_score   |float             |YES |false|null   |     |
|polyphen2_hvar_pred    |varchar(1)        |YES |false|null   |     |
|fathmm_score           |float             |YES |false|null   |     |
|fathmm_pred            |varchar(1)        |YES |false|null   |     |
|cadd_score             |float             |YES |false|null   |     |
|cadd_phred             |float             |YES |false|null   |     |
|dann_score             |float             |YES |false|null   |     |
|revel_score            |float             |YES |false|null   |     |
|lrt_score              |float             |YES |false|null   |     |
|lrt_pred               |varchar(1)        |YES |false|null   |     |
|gnomad_pli             |float             |YES |false|null   |     |
|gnomad_loeuf           |float             |YES |false|null   |     |
|phyloP17way_primate    |float             |YES |false|null   |     |
|phyloP100way_vertebrate|float             |YES |false|null   |     |
|vep_impact             |varchar(20)       |YES |false|null   |     |
|aa_change              |varchar(1000)     |YES |false|null   |     |
|dna_change             |varchar(1000)     |YES |false|null   |     |
+-----------------------+------------------+----+-----+-------+-----+
*/

type Consequence = struct {
	IsPicked           bool              `json:"is_picked"`
	Symbol             string            `json:"symbol,omitempty"`
	Biotype            string            `json:"biotype,omitempty"`
	GnomadPli          float32           `json:"gnomad_pli,omitempty"`
	GnomadLoeuf        float32           `json:"gnomad_loeuf,omitempty"`
	SpliceaiDs         float32           `json:"spliceai_ds,omitempty"`
	SpliceaiType       JsonArray[string] `gorm:"type:json" json:"spliceai_type,omitempty"`
	TranscriptId       string            `json:"transcript_id,omitempty"`
	IsCanonical        bool              `json:"is_canonical"`
	IsManeSelect       bool              `json:"is_mane_select"`
	IsManePlus         bool              `json:"is_mane_plus"`
	ExonRank           int               `json:"exon_rank,omitempty"`
	ExonTotal          int               `json:"exon_total,omitempty"`
	DnaChange          string            `json:"dna_change,omitempty"`
	AaChange           string            `json:"aa_change,omitempty"`
	Consequences       JsonArray[string] `gorm:"type:json" json:"consequences"`
	VepImpact          VepImpact         `json:"vep_impact,omitempty" enums:"MODIFIER,LOW,MODERATE,HIGH"`
	SiftPred           string            `json:"sift_pred,omitempty"`
	SiftScore          float32           `json:"sift_score,omitempty"`
	FathmmPred         string            `json:"fathmm_pred,omitempty"`
	FathmmScore        float32           `json:"fathmm_score,omitempty"`
	CaddScore          float32           `json:"cadd_score,omitempty"`
	CaddPhred          float32           `json:"cadd_phred,omitempty"`
	DannScore          float32           `json:"dann_score,omitempty"`
	LrtPred            string            `json:"lrt_pred,omitempty"`
	LrtScore           float32           `json:"lrt_score,omitempty"`
	RevelScore         float32           `json:"revel_score,omitempty"`
	Polyphen2HvarPred  string            `json:"polyphen2_hvar_pred,omitempty"`
	Polyphen2HvarScore float32           `json:"polyphen2_hvar_score,omitempty"`
	PhyloP17wayPrimate float32           `json:"phyloP17way_primate,omitempty"`
} // @name Consequence

type VariantConsequence = struct {
	IsPicked     bool                  `json:"is_picked"`
	Symbol       string                `json:"symbol,omitempty"`
	Biotype      string                `json:"biotype,omitempty"`
	GnomadPli    float32               `json:"gnomad_pli,omitempty"`
	GnomadLoeuf  float32               `json:"gnomad_loeuf,omitempty"`
	SpliceaiDs   float32               `json:"spliceai_ds,omitempty"`
	SpliceaiType JsonArray[string]     `gorm:"type:json" json:"spliceai_type,omitempty"`
	Transcripts  JsonArray[Transcript] `gorm:"type:json" json:"transcripts"`
} // @name VariantConsequence

var ConsequenceFilterTable = Table{
	Name:  "germline__snv__consequence_filter_partitioned",
	Alias: "cf",
}

var ConsequenceTable = Table{
	Name:  "germline__snv__consequence",
	Alias: "c",
}

var ConsequenceField = Field{
	Name:            "consequence",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           ConsequenceFilterTable,
}

var SymbolField = Field{
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

var BiotypeField = Field{
	Name:            "biotype",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           ConsequenceFilterTable,
}

var VepImpactFilterField = Field{
	Name:            "vep_impact",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           ConsequenceFilterTable,
}
