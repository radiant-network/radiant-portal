package types

import "time"

type Patient struct {
	ID                     int
	Mrn                    string
	ManagingOrganizationID int
	Organization           Organization `gorm:"foreignKey:ID;references:ManagingOrganizationID"`
	SexCode                string       `gorm:"column:sex"`
	Sex                    Sex          `gorm:"foreignKey:Code;references:SexCode"`
	DateOfBirth            time.Time    `gorm:"type:DATE;column:dob"`
}

var PatientTable = Table{
	Name: "radiant_jdbc.public.patient",
}

func (Patient) TableName() string {
	return PatientTable.Name
}
