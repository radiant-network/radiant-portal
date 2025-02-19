package types

import (
	"time"
)

type UserSet struct {
	ID        string    `json:"id,omitempty"`
	UserId    string    `json:"user_id,omitempty"`
	Name      string    `json:"name,omitempty"`
	Type      string    `json:"type,omitempty"`
	Active    bool      `json:"active,omitempty"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	Ids       []string  `json:"ids,omitempty"`
} // @name UserSet

var UserSetTable = Table{
	Name: "user_set",
}

var UserSetParticipantTable = Table{
	Name: "user_set_participant",
}

var UserSetFileTable = Table{
	Name: "user_set_file",
}

var UserSetBiospecimenTable = Table{
	Name: "user_set_biospecimen",
}

var UserSetVariantTable = Table{
	Name: "user_set_variant",
}

type UserSetDAO struct {
	ID             string `gorm:"primary_key; unique; type:uuid; default:gen_random_uuid()"`
	UserId         string
	Name           string
	Type           string
	Active         bool
	CreatedAt      time.Time
	UpdatedAt      time.Time
	ParticipantIds []string `gorm:"many2many:user_set_participant;"`
	FileIds        []string `gorm:"many2many:user_set_file;"`
	BiospecimenIds []string `gorm:"many2many:user_set_biospecimen;"`
	VariantIds     []string `gorm:"many2many:user_set_variant;"`
}
