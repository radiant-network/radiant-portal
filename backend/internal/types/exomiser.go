package types

// Exomiser represents a record in the Exomiser database.
// @Description Exomiser represents a record in the Exomiser database.
type Exomiser struct {
	Part               int               `json:"part" validate:"required"`
	SeqId              int               `json:"seq_id" validate:"required"`
	LocusId            string            `json:"locus_id" validate:"required"`
	Id                 string            `json:"id" validate:"required"`
	LocusHash          string            `json:"locus_hash,omitempty"`
	Moi                string            `json:"moi,omitempty"`
	VariantScore       float32           `json:"variant_score,omitempty"`
	GeneCombinedScore  float32           `json:"gene_combined_score,omitempty"`
	VariantRank        int               `json:"variant_rank,omitempty"`
	Rank               int               `json:"rank,omitempty"`
	Symbol             string            `json:"symbol,omitempty"`
	AcmgClassification string            `json:"acmg_classification,omitempty"`
	AcmgEvidence       JsonArray[string] `json:"acmg_evidence,omitempty" gorm:"type:json"`
}

type ExomiserACMGClassificationCounts struct {
	AcmgClassification      string `json:"acmg_classification" validate:"required"`
	AcmgClassificationCount int    `json:"acmg_classification_count" validate:"required"`
}

var ExomiserTable = Table{
	Name:  "exomiser",
	Alias: "ex",
}
