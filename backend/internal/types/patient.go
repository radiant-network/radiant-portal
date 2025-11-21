package types

import "time"

type Patient struct {
	ID                        int
	OrganizationPatientId     string
	OrganizationPatientIdType string
	OrganizationID            int
	Organization              Organization `gorm:"foreignKey:ID;references:OrganizationID"`
	SexCode                   string
	LifeStatusCode            string
	FirstName                 string    `json:"first_name,omitempty"`
	LastName                  string    `json:"last_name,omitempty"`
	Jhn                       string    `json:"jhn,omitempty"`
	Sex                       Sex       `gorm:"foreignKey:Code;references:SexCode"`
	DateOfBirth               time.Time `gorm:"type:DATE"`
}

var PatientTable = Table{
	Name:  "radiant_jdbc.public.patient",
	Alias: "p",
}

var ProbandTable = Table{
	Name:  "radiant_jdbc.public.patient",
	Alias: "pro",
}

func (Patient) TableName() string {
	return "patient"
}

var ProbandOrganizationIDField = Field{
	Name:          "organization_patient_id",
	Alias:         "proband_organization_id",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         ProbandTable,
}

var PatientIdField = Field{
	Name:          "id",
	Alias:         "patient_id",
	CanBeFiltered: true,
	Table:         PatientTable,
}

var PatientOrganizationIDField = Field{
	Name:          "organization_patient_id",
	CanBeFiltered: true,
	Table:         PatientTable,
}

var PatientOrganizationCodeField = Field{
	Name:          "code",
	Alias:         "organization_code",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         ManagingOrganizationTable,
}

var PatientOrganizationNameField = Field{
	Name:          "name",
	Alias:         "organization_name",
	CanBeSelected: true,
	Table:         ManagingOrganizationTable,
}
