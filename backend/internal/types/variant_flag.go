package types

import "time"

var VariantFlagTable = Table{
	Name:           "variant_flag",
	FederationName: "radiant_jdbc.public.variant_flag",
	Alias:          "flag",
}

// VariantFlag is both the GORM model and the API response type.
// An occurrence (SNV locus or CNV) has at most one flag per case
// (composite primary key on case_id + occurrence_id).
type VariantFlag struct {
	CaseID       int       `gorm:"primaryKey;column:case_id"        json:"case_id"       validate:"required"`
	OccurrenceID string    `gorm:"primaryKey;column:occurrence_id"  json:"occurrence_id" validate:"required"`
	FlagType     string    `gorm:"column:flag_type"                 json:"flag_type"     validate:"required,oneof=flag pin star" enums:"flag,pin,star"`
	UserID       string    `gorm:"column:user_id"                   json:"user_id"       validate:"required"`
	UserName     string    `gorm:"column:user_name"                 json:"user_name"     validate:"required"`
	CreatedAt    time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"    validate:"required"`
	UpdatedAt    time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"    validate:"required"`
}

func (VariantFlag) TableName() string {
	return VariantFlagTable.Name
}

// SetVariantFlagInput is the PUT request body for setting or changing a flag.
// CaseID and OccurrenceID come from URL parameters; UserID and UserName from the JWT.
type SetVariantFlagInput struct {
	FlagType string `json:"flag_type" binding:"required,oneof=flag pin star"`
}
