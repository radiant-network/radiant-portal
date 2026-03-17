package types

import "time"

var OccurrenceNoteTable = Table{
	Name:           "occurrence_note",
	FederationName: "radiant_jdbc.public.occurrence_note",
	Alias:          "note",
}

// OccurrenceNote is both the GORM model and the API response type.
// The Deleted field is internal and never serialized to JSON.
type OccurrenceNote struct {
	ID           string    `gorm:"primary_key; unique; type:uuid; column:id; default:uuid_generate_v4()" json:"id" validate:"required"`
	Type         string    `gorm:"column:type"                      json:"type" validate:"required"`
	CaseID       int       `gorm:"column:case_id"                   json:"case_id" validate:"required"`
	SeqID        int       `gorm:"column:seq_id"                    json:"seq_id" validate:"required"`
	OccurrenceID int64     `gorm:"column:occurrence_id"             json:"occurrence_id" validate:"required"`
	UserID       string    `gorm:"column:user_id"                   json:"user_id" validate:"required"`
	UserName     string    `gorm:"column:user_name"                 json:"user_name" validate:"required"`
	Content      string    `gorm:"column:content"                   json:"content" validate:"required"`
	CreatedAt    time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at" validate:"required"`
	UpdatedAt    time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at" validate:"required"`
	Deleted      bool      `gorm:"column:deleted;default:false"     json:"-"`
}

func (OccurrenceNote) TableName() string {
	return OccurrenceNoteTable.Name
}

// CreateOccurrenceNoteInput is the POST request body for creating a note.
// Type is injected from the route (snv/cnv). CaseID, SeqID, OccurrenceID come from path params.
// UserID and UserName come from the JWT token.
type CreateOccurrenceNoteInput struct {
	Content string `json:"content" binding:"required"`
}
