package types

const SampleBatchType = "sample"

type SampleBatch struct {
	SubmitterPatientId      TrimmedString `json:"submitter_patient_id" binding:"required"`
	PatientOrganizationCode string        `json:"patient_organization_code" binding:"required"`
	TypeCode                string        `json:"type_code" binding:"required"`
	SubmitterParentSampleId TrimmedString `json:"submitter_parent_sample_id,omitempty"`
	TissueSite              TrimmedString `json:"tissue_site,omitempty"`
	HistologyCode           string        `json:"histology_code" binding:"required,oneof=tumoral normal"`
	SubmitterSampleId       TrimmedString `json:"submitter_sample_id" binding:"required"`
	SampleOrganizationCode  string        `json:"sample_organization_code" binding:"required"`
}

// CreateSampleBatchBody represents the body required to create a sample batch
// @Description CreateSampleBatchBody represents the body required to create a sample batch
type CreateSampleBatchBody struct {
	Samples []*SampleBatch `json:"samples" binding:"required,min=1,dive,required"`
} //@Name CreateSampleBatchBody
