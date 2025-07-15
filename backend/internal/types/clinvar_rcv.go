package types

import (
	"time"
)

// ClinvarRCV represents a Reference ClinVar record - data aggregated by variant-condition pair
// @Description ClinvarRCV represents a Reference ClinVar record - data aggregated by variant-condition pair
type ClinvarRCV struct {
	LocusId              string            `json:"locus_id" validate:"required"`
	ClinvarId            string            `json:"clinvar_id" validate:"required"`
	Accession            string            `json:"accession,omitempty"`
	ClinicalSignificance JsonArray[string] `json:"clinical_significance,omitempty"`
	DateLastEvaluated    time.Time         `json:"date_last_evaluated,omitempty"`
	SubmissionCount      int               `json:"submission_count,omitempty"`
	ReviewStatus         string            `json:"review_status,omitempty"`
	ReviewStatusStars    int               `json:"review_status_stars,omitempty"`
	Version              int               `json:"version,omitempty"`
	Traits               JsonArray[string] `json:"traits,omitempty" gorm:"type:json"`
	Origins              JsonArray[string] `json:"origins,omitempty" gorm:"type:json"`
}

var ClinvarRCVTable = Table{
	Name:  "clinvar_rcv_summary",
	Alias: "crs",
}
