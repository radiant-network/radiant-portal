package types

import "time"

type Patient struct {
	ID                     int
	SubmitterPatientId     string
	SubmitterPatientIdType string
	OrganizationId         int
	Organization           Organization `gorm:"foreignKey:ID;references:OrganizationId"`
	SexCode                string
	LifeStatusCode         string
	FirstName              string    `json:"first_name,omitempty"`
	LastName               string    `json:"last_name,omitempty"`
	Jhn                    string    `json:"jhn,omitempty"`
	Sex                    Sex       `gorm:"foreignKey:Code;references:SexCode"`
	DateOfBirth            time.Time `gorm:"type:DATE"`
}

var PatientTable = Table{
	Name:           "patient",
	FederationName: "radiant_jdbc.public.patient",
	Alias:          "p",
}

var ProbandTable = Table{
	Name:           "patient",
	FederationName: "radiant_jdbc.public.patient",
	Alias:          "pro",
}

func (Patient) TableName() string {
	return "patient"
}

var SubmitterProbandIdField = Field{
	Name:          "submitter_patient_id",
	Alias:         "submitter_proband_id",
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

var SubmitterPatientIdField = Field{
	Name:          "submitter_patient_id",
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
