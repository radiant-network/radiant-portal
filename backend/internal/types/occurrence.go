package types

// Occurrence represents an occurrence
// @Description Occurrence represents an occurrence
type Occurrence struct {
	SeqId               int               `json:"seq_id,omitempty"`
	Chromosome          string            `json:"chromosome,omitempty"`
	LocusId             int64             `json:"locus_id,omitempty"`
	GenotypeQuality     int32             `json:"genotype_quality,omitempty"`
	Filter              string            `json:"filter,omitempty"`
	Zygosity            string            `json:"zygosity,omitempty"`
	Pf                  float64           `json:"pf,omitempty"`
	Pc                  int               `json:"pc,omitempty"`
	Af                  float64           `json:"af,omitempty"`
	GnomadV3Af          float64           `json:"gnomad_v3_af,omitempty"`
	Hgvsg               string            `json:"hgvsg,omitempty"`
	OmimInheritanceCode JsonArray[string] `gorm:"type:json" json:"omim_inheritance_code,omitempty"`
	AdRatio             float64           `json:"ad_ratio,omitempty"`
	VariantClass        string            `json:"variant_class,omitempty"`
	VepImpact           string            `json:"vep_impact,omitempty"`
	Symbol              string            `json:"symbol,omitempty"`
	Clinvar             JsonArray[string] `gorm:"type:json" json:"clinvar,omitempty"`
	ManeSelect          bool              `json:"mane_select,omitempty"`
	Canonical           bool              `json:"canonical,omitempty"`
	AaChange            string            `json:"aa_change,omitempty"`
	RsNumber            string            `json:"rsnumber,omitempty"`
	PickedConsequences  JsonArray[string] `gorm:"type:json" json:"picked_consequences,omitempty"`
	TranscriptId        string            `json:"transcript_id,omitempty"`
} // @name Occurrence

var OccurrenceTable = Table{
	Name:  "occurrences",
	Alias: "o",
}

var FilterField = Field{
	Name:            "filter",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           OccurrenceTable,
}
var SeqIdField = Field{
	Name:          "seq_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         OccurrenceTable,
}
var LocusIdField = Field{
	Name:          "locus_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         OccurrenceTable,
}
var ZygosityField = Field{
	Name:            "zygosity",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           OccurrenceTable,
}
var GenotypeQualityField = Field{
	Name:          "gq",
	Alias:         "genotype_quality",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         OccurrenceTable,
}
var AdRatioField = Field{
	Name:          "ad_ratio",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         OccurrenceTable,
}
var ChromosomeField = Field{
	Name:            "chromosome",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           OccurrenceTable,
}

var OccurrencesFields = []Field{
	SeqIdField,
	LocusIdField,
	FilterField,
	ZygosityField,
	GenotypeQualityField,
	AdRatioField,
	PfField,
	PcField,
	AfField,
	VariantClassField,
	HgvsgField,
	ChromosomeField,
	ClinvarField,
	ConsequenceIdField,
	SymbolFilterField,
	ImpactScoreField,
	SiftPredField,
	OmimGenePanelField,
	HpoGenePanelField,
	RsNumberField,
	AaChangeField,
	ConsequenceField,
	VepImpactField,
	SymbolField,
	ManeSelectField,
	OmimInheritanceCodeField,
	GnomadV3AfField,
	TranscriptIdField,
}
