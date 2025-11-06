package types

import "time"

type PatientBatch struct {
	OrganizationPatientId     string
	OrganizationPatientIdType string
	OrganizationCode          string
	LifeStatusCode            string `enums:"alive,deceased,unknown"`
	FirstName                 string `json:"first_name,omitempty"`
	LastName                  string `json:"last_name,omitempty"`
	SexCode                   string `enums:"male,female,unknown"`
	DateOfBirth               time.Time
	Jhn                       string `json:"jhn,omitempty"`
}
