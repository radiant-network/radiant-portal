package types

type VariantHeader = struct {
	Hgvsg           string            `json:"hgvsg" validate:"required"`
	AssemblyVersion string            `json:"assembly_version,omitempty"`
	Source          JsonArray[string] `gorm:"type:json" json:"source,omitempty"`
} // @name VariantOverview

type VariantOverview = struct {
	Symbol                string                 `json:"symbol,omitempty"`
	Consequence           JsonArray[string]      `gorm:"type:json" json:"picked_consequences" validate:"required"`
	ClinvarInterpretation JsonArray[string]      `gorm:"type:json" json:"clinvar,omitempty"`
	Pc                    int                    `json:"pc,omitempty"`
	Pn                    int                    `json:"pn,omitempty"` //TODO
	Pf                    float64                `json:"pf" validate:"required"`
	GnomadV3Af            float64                `json:"gnomad_v3_af" validate:"required"`
	Canonical             bool                   `json:"canonical,omitempty"`
	ManeSelect            bool                   `json:"mane_select,omitempty"`
	TranscriptId          string                 `json:"transcript_id,omitempty"`
	RefseqMrnaId          string                 `json:"refseq_mrna_id,omitempty"` //TODO
	ExonRank              int                    `json:"exon_rank,omitempty"`      //TODO
	ExonTotal             int                    `json:"exon_total,omitempty"`     //TODO
	CodingDnaChange       string                 `json:"coding_dna_change,omitempty"`
	RsNumber              string                 `json:"rsnumber,omitempty"`
	SiftPred              string                 `json:"sift_pred,omitempty"`
	SiftScore             float32                `json:"sift_score,omitempty"`
	RevelScore            float32                `json:"revel_score,omitempty"`
	GnomadLoeuf           float32                `json:"gnomad_loeuf,omitempty"`
	SpliceaiDs            float32                `json:"spliceai_ds,omitempty"`
	SpliceaiType          JsonArray[string]      `gorm:"type:json" json:"spliceai_type,omitempty"`
	OmimConditions        JsonArray[OmimGeneSet] `gorm:"type:json" json:"omim_conditions,omitempty"`
	LocusFull             string                 `json:"locus" validate:"required"`
	FathmmPred            string                 `json:"fathmm_pred,omitempty"`
	FathmmScore           float32                `json:"fathmm_score,omitempty"`
	CaddScore             float32                `json:"cadd_score,omitempty"`
	CaddPhred             float32                `json:"cadd_phred,omitempty"`
	DannScore             float32                `json:"dann_score,omitempty"`
	LrtPred               string                 `json:"lrt_pred,omitempty"`
	LrtScore              float32                `json:"lrt_score,omitempty"`
	Polyphen2HvarPred     string                 `json:"polyphen2_hvar_pred,omitempty"`
	Polyphen2HvarScore    float32                `json:"polyphen2_hvar_score,omitempty"`
	PhyloP17wayPrimate    float32                `json:"phyloP17way_primate,omitempty"`
	GnomadPli             float64                `json:"gnomad_pli,omitempty"`
	ClinvarId             string                 `json:"clinvar_id,omitempty"`
} // @name VariantOverview

var VariantTable = Table{
	Name:  "variants",
	Alias: "v",
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
var AfField = Field{
	Name:          "af",
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

var ConsequenceField = Field{
	Name:            "consequence",
	Alias:           "picked_consequences",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     false,
	CanBeAggregated: true,
	Type:            ArrayType,
	Table:           VariantTable,
}
var VepImpactField = Field{
	Name:            "vep_impact",
	CanBeSelected:   true,
	CanBeFiltered:   false,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           VariantTable,
}
var SymbolField = Field{
	Name:          "symbol",
	CanBeSelected: true,
	CanBeFiltered: false,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var ManeSelectField = Field{
	Name:          "mane_select",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var CanonicalField = Field{
	Name:          "canonical",
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
