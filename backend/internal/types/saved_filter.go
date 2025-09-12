package types

import "time"

type SavedFilter struct {
	ID        int             `json:"id" validate:"required"`
	UserID    string          `json:"user_id" validate:"required"`
	Name      string          `json:"name" validate:"required"`
	Type      SavedFilterType `json:"type" validate:"required" enums:"germline_snv_occurrence,germline_cnv_occurrence,somatic_snv_occurrence,somatic_cnv_occurrence,germline_snv_variant,germline_cnv_variant,somatic_snv_variant,somatic_cnv_variant"`
	Favorite  bool            `json:"favorite" validate:"required"`
	Queries   JsonArray[Sqon] `gorm:"type:json" json:"queries" validate:"required"`
	CreatedOn time.Time       `json:"created_on" validate:"required"`
	UpdatedOn time.Time       `json:"updated_on" validate:"required"`
}

var SavedFilterTable = Table{
	Name:  "saved_filter",
	Alias: "sf",
}

type SavedFilterType = string

const (
	GERMLINE_SNV_OCCURRENCE SavedFilterType = "germline_snv_occurrence"
	GERMLINE_CNV_OCCURRENCE SavedFilterType = "germline_cnv_occurrence"
	SOMATIC_SNV_OCCURRENCE  SavedFilterType = "somatic_snv_occurrence"
	SOMATIC_CNV_OCCURRENCE  SavedFilterType = "somatic_cnv_occurrence"
	GERMLINE_SNV_VARIANT    SavedFilterType = "germline_snv_variant"
	GERMLINE_CNV_VARIANT    SavedFilterType = "germline_cnv_variant"
	SOMATIC_SNV_VARIANT     SavedFilterType = "somatic_snv_variant"
	SOMATIC_CNV_VARIANT     SavedFilterType = "somatic_cnv_variant"
)
