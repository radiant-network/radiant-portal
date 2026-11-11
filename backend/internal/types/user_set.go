package types

import (
	"time"
)

type Tabler interface {
	TableName() string
}

func (UserSetDAO) TableName() string {
	return UserSetTable.Name
}

func (UserSetParticipantDAO) TableName() string {
	return UserSetParticipantTable.Name
}

func (UserSetFileDAO) TableName() string {
	return UserSetFileTable.Name
}

func (UserSetBiospecimenDAO) TableName() string {
	return UserSetBiospecimenTable.Name
}

func (UserSetVariantDAO) TableName() string {
	return UserSetVariantTable.Name
}

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

type UserSetParticipantDAO struct {
	UserSetId     string
	ParticipantId string
}

type UserSetFileDAO struct {
	UserSetId string
	FileId    string
}

type UserSetBiospecimenDAO struct {
	UserSetId     string
	BiospecimenId string
}

type UserSetVariantDAO struct {
	UserSetId string
	VariantId string
}

type UserSetDAO struct {
	ID             string `gorm:"primary_key; unique; type:uuid; default:gen_random_uuid()"`
	UserId         string
	Name           string
	Type           string
	Active         bool
	CreatedAt      time.Time
	UpdatedAt      time.Time
	ParticipantIds []UserSetParticipantDAO `gorm:"foreignKey:UserSetId"`
	FileIds        []UserSetFileDAO        `gorm:"foreignKey:UserSetId"`
	BiospecimenIds []UserSetBiospecimenDAO `gorm:"foreignKey:UserSetId"`
	VariantIds     []UserSetVariantDAO     `gorm:"foreignKey:UserSetId"`
}
