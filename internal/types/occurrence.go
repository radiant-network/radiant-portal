package types

import "github.com/Ferlab-Ste-Justine/radiant-api/internal/utils"

type Occurrence struct {
	SeqId               int                     `json:"seq_id,omitempty"`
	Chromosome          string                  `json:"chromosome,omitempty"`
	LocusId             int64                   `json:"locus_id,omitempty"`
	Quality             int                     `json:"quality,omitempty"`
	Filter              string                  `json:"filter,omitempty"`
	Zygosity            string                  `json:"zygosity,omitempty"`
	Pf                  float64                 `json:"pf,omitempty"`
	Af                  float64                 `json:"af,omitempty"`
	GnomadV3Af          float64                 `json:"gnomad_v3_af,omitempty"`
	Hgvsg               string                  `json:"hgvsg,omitempty"`
	OmimInheritanceCode string                  `json:"omim_inheritance_code,omitempty"`
	AdRatio             float64                 `json:"ad_ratio,omitempty"`
	VariantClass        string                  `json:"variant_class,omitempty"`
	VepImpact           string                  `json:"vep_impact,omitempty"`
	Symbol              string                  `json:"symbol,omitempty"`
	Clinvar             utils.JsonArray[string] `gorm:"type:json" json:"clinvar,omitempty"`
	ManeSelect          bool                    `json:"mane_select,omitempty"`
	Canonical           bool                    `json:"canonical,omitempty"`
}

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
	Table:         OccurrenceTable,
}
var ZygosityField = Field{
	Name:            "zygosity",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           OccurrenceTable,
}
var AdRatioField = Field{
	Name:          "ad_ratio",
	CanBeSelected: true,
	CanBeFiltered: true,
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
	AdRatioField,
	PfField,
	AfField,
	VariantClassField,
	HgvsgField,
	ChromosomeField,
	ClinvarField,
}
