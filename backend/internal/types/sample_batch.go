package types

type SampleBatch struct {
	SubmitterPatientId      string `json:"submitter_patient_id" binding:"required"`
	PatientOrganizationCode string `json:"patient_organization_code" binding:"required"`
	TypeCode                string `json:"type_code" binding:"required"`
	SubmitterParentSampleId string `json:"submitter_parent_sample_id,omitempty"`
	TissueSite              string `json:"tissue_site,omitempty"`
	HistologyCode           string `json:"histology_code" binding:"required,oneof=tumoral normal"`
	SubmitterSampleId       string `json:"submitter_sample_id" binding:"required"`
	SampleOrganizationCode  string `json:"sample_organization_code" binding:"required"`
}

// CreateSampleBatchBody represents the body required to create a sample batch
// @Description CreateSampleBatchBody represents the body required to create a sample batch
type CreateSampleBatchBody struct {
	Samples []*SampleBatch `json:"samples" validate:"required,min=1,dive,required" binding:"required,min=1,dive,required"`
} //@Name CreateSampleBatchBody
