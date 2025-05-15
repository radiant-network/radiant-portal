package types

/*
+----------------------+-------------------+----+-----+-------+-----+
|Field                 |Type               |Null|Key  |Default|Extra|
+----------------------+-------------------+----+-----+-------+-----+
|locus_id              |bigint             |NO  |true |null   |     |
|pf                    |double             |YES |false|null   |     |
|gnomad_v3_af          |double             |YES |false|null   |     |
|topmed_af             |double             |YES |false|null   |     |
|tg_af                 |double             |YES |false|null   |     |
|pc                    |int                |YES |false|null   |     |
|pn                    |int                |YES |false|null   |     |
|chromosome            |char(2)            |YES |false|null   |     |
|start                 |bigint             |YES |false|null   |     |
|clinvar_name          |varchar(2000)      |YES |false|null   |     |
|variant_class         |varchar(50)        |YES |false|null   |     |
|clinvar_interpretation|array<varchar(100)>|YES |false|null   |     |
|symbol                |varchar(20)        |YES |false|null   |     |
|impact_score          |tinyint            |YES |false|null   |     |
|consequences          |array<varchar(50)> |YES |false|null   |     |
|vep_impact            |varchar(20)        |YES |false|null   |     |
|is_mane_select        |boolean            |YES |false|null   |     |
|is_mane_plus          |boolean            |YES |false|null   |     |
|is_canonical          |boolean            |YES |false|null   |     |
|rsnumber              |array<varchar(15)> |YES |false|null   |     |
|reference             |varchar(2000)      |YES |false|null   |     |
|alternate             |varchar(2000)      |YES |false|null   |     |
|mane_select           |varchar(200)       |YES |false|null   |     |
|hgvsg                 |varchar(2000)      |YES |false|null   |     |
|hgvsc                 |varchar(2000)      |YES |false|null   |     |
|hgvsp                 |varchar(2000)      |YES |false|null   |     |
|locus                 |varchar(2000)      |YES |false|null   |     |
|dna_change            |varchar(2000)      |YES |false|null   |     |
|aa_change             |varchar(2000)      |YES |false|null   |     |
|transcript_id         |varchar(100)       |YES |false|null   |     |
|omim_inheritance_code |array<varchar(5)>  |YES |false|null   |     |
+----------------------+-------------------+----+-----+-------+-----+

*/

type VariantHeader = struct {
	Hgvsg           string            `json:"hgvsg" validate:"required"`
	AssemblyVersion string            `json:"assembly_version,omitempty"`
	Source          JsonArray[string] `gorm:"type:json" json:"source,omitempty"`
} // @name VariantOverview

type VariantOverview = struct {
	Symbol                string                   `json:"symbol,omitempty"`
	Consequences          JsonArray[string]        `gorm:"type:json" json:"picked_consequences" validate:"required"`
	ClinvarInterpretation JsonArray[string]        `gorm:"type:json" json:"clinvar,omitempty"`
	Pc                    int                      `json:"pc,omitempty"`
	Pn                    int                      `json:"pn,omitempty"`
	Pf                    float64                  `json:"pf" validate:"required"`
	GnomadV3Af            float64                  `json:"gnomad_v3_af" validate:"required"`
	IsCanonical           bool                     `json:"is_canonical"`
	IsManeSelect          bool                     `json:"is_mane_select"`
	TranscriptId          string                   `json:"transcript_id,omitempty"`
	ExonRank              int                      `json:"exon_rank,omitempty"`
	ExonTotal             int                      `json:"exon_total,omitempty"`
	DnaChange             string                   `json:"dna_change,omitempty"`
	RsNumber              string                   `json:"rsnumber,omitempty"`
	SiftPred              string                   `json:"sift_pred,omitempty"`
	SiftScore             float32                  `json:"sift_score,omitempty"`
	RevelScore            float32                  `json:"revel_score,omitempty"`
	GnomadLoeuf           float32                  `json:"gnomad_loeuf,omitempty"`
	SpliceaiDs            float32                  `json:"spliceai_ds,omitempty"`
	SpliceaiType          JsonArray[string]        `gorm:"type:json" json:"spliceai_type,omitempty"`
	OmimConditions        JsonArray[OmimGenePanel] `gorm:"type:json" json:"omim_conditions,omitempty"`
	Locus                 string                   `json:"locus" validate:"required"`
	FathmmPred            string                   `json:"fathmm_pred,omitempty"`
	FathmmScore           float32                  `json:"fathmm_score,omitempty"`
	CaddScore             float32                  `json:"cadd_score,omitempty"`
	CaddPhred             float32                  `json:"cadd_phred,omitempty"`
	DannScore             float32                  `json:"dann_score,omitempty"`
	LrtPred               string                   `json:"lrt_pred,omitempty"`
	LrtScore              float32                  `json:"lrt_score,omitempty"`
	Polyphen2HvarPred     string                   `json:"polyphen2_hvar_pred,omitempty"`
	Polyphen2HvarScore    float32                  `json:"polyphen2_hvar_score,omitempty"`
	PhyloP17wayPrimate    float32                  `json:"phyloP17way_primate,omitempty"`
	GnomadPli             float64                  `json:"gnomad_pli,omitempty"`
	ClinvarName           string                   `json:"clinvar_name,omitempty"`
	AaChange              string                   `json:"aa_change,omitempty"`
	VepImpact             VepImpact                `json:"vep_impact,omitempty" enums:"MODIFIER,LOW,MODERATE,HIGH"`
} // @name VariantOverview

var VariantTable = Table{
	Name:  "variants",
	Alias: "v",
}

var ChromosomeField = Field{
	Name:            "chromosome",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           VariantTable,
}

var StartField = Field{
	Name:            "start",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Type:            NumericType,
	Table:           VariantTable,
}

var PfField = Field{
	Name:          "pf",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         VariantTable,
}
var PcField = Field{
	Name:          "pc",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         VariantTable,
}
var PnField = Field{
	Name:          "pn",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         VariantTable,
}
var VariantClassField = Field{
	Name:            "variant_class",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           VariantTable,
}
var HgvsgField = Field{
	Name:          "hgvsg",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var ClinvarField = Field{
	Name:            "clinvar_interpretation",
	Alias:           "clinvar",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     false,
	CanBeAggregated: true,
	Type:            ArrayType,
	Table:           VariantTable,
}

var RsNumberField = Field{
	Name:          "rsnumber",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var AaChangeField = Field{
	Name:          "aa_change",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var ConsequencesField = Field{
	Name:            "consequences",
	Alias:           "picked_consequences",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     false,
	CanBeAggregated: true,
	Type:            ArrayType,
	Table:           VariantTable,
}
var VepImpactField = Field{
	Name:          "vep_impact",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var SymbolField = Field{
	Name:          "symbol",
	CanBeSelected: true,
	CanBeFiltered: false,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var IsManeSelectField = Field{
	Name:          "is_mane_select",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var IsCanonicalField = Field{
	Name:          "is_canonical",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var OmimInheritanceCodeField = Field{
	Name:          "omim_inheritance_code",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          ArrayType,
	Table:         VariantTable,
}
var GnomadV3AfField = Field{
	Name:            "gnomad_v3_af",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Type:            NumericType,
	Table:           VariantTable,
}
var TranscriptIdField = Field{
	Name:          "transcript_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var ImpactScoreField = Field{
	Name:          "impact_score",
	CanBeSelected: true,
	CanBeFiltered: false,
	CanBeSorted:   true,
	Table:         VariantTable,
}
