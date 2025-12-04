package types

const PatientBatchType = "patient"

type PatientBatch struct {
	SubmitterPatientId      TrimmedString `json:"submitter_patient_id" binding:"required"`
	SubmitterPatientIdType  TrimmedString `json:"submitter_patient_id_type" binding:"required"`
	PatientOrganizationCode string        `json:"patient_organization_code" binding:"required"`
	LifeStatusCode          string        `json:"life_status_code" binding:"required,oneof=alive deceased unknown"`
	FirstName               TrimmedString `json:"first_name,omitempty"`
	LastName                TrimmedString `json:"last_name,omitempty"`
	SexCode                 string        `json:"sex_code" binding:"required,oneof=male female unknown"`
	DateOfBirth             *DateISO8601  `json:"date_of_birth" binding:"required" swaggertype:"string" format:"date" example:"2020-01-31"`
	Jhn                     TrimmedString `json:"jhn,omitempty"`
}

// CreatePatientBatchBody represents the body required to create a patient batch
// @Description CreatePatientBatchBody represents the body required to create a patient batch
type CreatePatientBatchBody struct {
	Patients []*PatientBatch `json:"patients" validate:"required,min=1,dive,required" binding:"required,min=1,dive,required"`
} //@Name CreatePatientBatchBody
