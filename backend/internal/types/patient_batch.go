package types

import (
	"fmt"
	"strings"
	"time"
)

const DateOfBirthFormat = "2006-01-02"

type DateOfBirthType struct {
	time.Time
}

func (d *DateOfBirthType) UnmarshalJSON(b []byte) (err error) {
	s := strings.Trim(string(b), `"`)
	if s == "null" {
		return
	}
	d.Time, err = time.Parse(DateOfBirthFormat, s)
	if err != nil {
		return fmt.Errorf("error parsing date of birth: %w", err)
	}
	return
}

type PatientBatch struct {
	OrganizationPatientId     string          `json:"organization_patient_id" binding:"required"`
	OrganizationPatientIdType string          `json:"organization_patient_id_type" binding:"required"`
	OrganizationCode          string          `json:"organization_code" binding:"required"`
	LifeStatusCode            string          `json:"life_status_code" binding:"required,oneof=alive deceased unknown"`
	FirstName                 string          `json:"first_name,omitempty"`
	LastName                  string          `json:"last_name,omitempty"`
	SexCode                   string          `json:"sex_code" binding:"required,oneof=male female unknown"`
	DateOfBirth               DateOfBirthType `json:"date_of_birth" binding:"required"`
	Jhn                       string          `json:"jhn,omitempty"`
}

// CreatePatientBatchBody represents the body required to create a patient batch
// @Description CreatePatientBatchBody represents the body required to create a patient batch
type CreatePatientBatchBody struct {
	Patients []*PatientBatch `json:"patients" validate:"required,dive,required" binding:"required,dive,required"`
} //@Name CreatePatientBatchBody
