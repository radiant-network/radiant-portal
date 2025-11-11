package types

import (
	"encoding/json"
	"log"
	"time"
)

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

type PatientsBatch struct {
	Patients []*PatientBatch `json:"patients" validate:"dive,required"`
}

func (p *PatientsBatch) BatchType() string {
	return "patients"
}

// ToPayload converts the PatientsBatch to its JSON string representation
// to be a valid payload for the patient batch creation API
func (p *PatientsBatch) ToPayload() (string, error) {
	jsonBytes, err := json.Marshal(p)
	if err != nil {
		log.Printf("Error marshalling patients to JSON: %v", err)
		return "", err
	}
	return string(jsonBytes), nil
}

// CreatePatientBatchQueryParam represents the query parameters for creating a patient batch
// @Description CreatePatientBatchQueryParam represents the query parameters for creating a patient batch
type CreatePatientBatchQueryParam struct {
	DryRun bool `form:"dry_run"`
} //@Name CreatePatientBatchQueryParam

// CreatePatientBatchBody represents the body required to create a patient batch
// @Description CreatePatientBatchBody represents the body required to create a patient batch
type CreatePatientBatchBody struct {
	Patients *PatientsBatch `json:"patients" validate:"dive,required"`
} //@Name CreatePatientBatchBody
