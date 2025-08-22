package types

import "time"

type Patient struct {
	ID                     int
	Mrn                    string
	ManagingOrganizationID int
	Organization           Organization `gorm:"foreignKey:ID;references:ManagingOrganizationID"`
	SexCode                string
	Sex                    Sex       `gorm:"foreignKey:Code;references:SexCode"`
	DateOfBirth            time.Time `gorm:"type:DATE"`
}

var PatientTable = Table{
	Name:  "radiant_jdbc.public.patient",
	Alias: "p",
}

var ProbandTable = Table{
	Name:  "radiant_jdbc.public.patient",
	Alias: "pro",
}

var ManagingOrganizationTable = Table{
	Name:  OrganizationTable.Name,
	Alias: "mgmt_org",
}

func (Patient) TableName() string {
	return PatientTable.Name
}

var ProbandIdField = Field{
	Name:          "id",
	Alias:         "proband_id",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         ProbandTable,
}

var ProbandMrnField = Field{
	Name:          "mrn",
	Alias:         "proband_mrn",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         ProbandTable,
}

var PatientMrnField = Field{
	Name:          "mrn",
	CanBeFiltered: true,
	Table:         PatientTable,
}

var PatientManagingOrganizationCodeField = Field{
	Name:          "code",
	Alias:         "managing_organization_code",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         ManagingOrganizationTable,
}

var PatientManagingOrganizationNameField = Field{
	Name:          "name",
	Alias:         "managing_organization_name",
	CanBeSelected: true,
	Table:         ManagingOrganizationTable,
}
