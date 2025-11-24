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
	if s == "null" || s == "" {
		return fmt.Errorf("error parsing date of birth")
	}
	d.Time, err = time.Parse(DateOfBirthFormat, s)
	if err != nil {
		return fmt.Errorf("invalid date format for date of birth, expected YYYY-MM-DD")
	}
	return
}

func (d DateOfBirthType) MarshalJSON() ([]byte, error) {
	if d.Time.IsZero() {
		return []byte(`""`), nil
	}
	// Format using the same pattern used for parsing.
	s := d.Time.Format(DateOfBirthFormat)

	// Return as a JSON string
	return []byte(fmt.Sprintf(`"%s"`, s)), nil
}

type PatientBatch struct {
	OrganizationPatientId     TrimmedString    `json:"organization_patient_id" binding:"required"`
	OrganizationPatientIdType TrimmedString    `json:"organization_patient_id_type" binding:"required"`
	OrganizationCode          string           `json:"organization_code" binding:"required"`
	LifeStatusCode            string           `json:"life_status_code" binding:"required,oneof=alive deceased unknown"`
	FirstName                 TrimmedString    `json:"first_name,omitempty"`
	LastName                  TrimmedString    `json:"last_name,omitempty"`
	SexCode                   string           `json:"sex_code" binding:"required,oneof=male female unknown"`
	DateOfBirth               *DateOfBirthType `json:"date_of_birth" binding:"required"`
	Jhn                       TrimmedString    `json:"jhn,omitempty"`
}

// CreatePatientBatchBody represents the body required to create a patient batch
// @Description CreatePatientBatchBody represents the body required to create a patient batch
type CreatePatientBatchBody struct {
	Patients []*PatientBatch `json:"patients" validate:"required,min=1,dive,required" binding:"required,min=1,dive,required"`
} //@Name CreatePatientBatchBody
