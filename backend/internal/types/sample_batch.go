package types

const SampleBatchType = "sample"

type SampleBatch struct {
	OrganizationPatientId     string `json:"organization_patient_id" binding:"required"`
	OrganizationCode          string `json:"organization_code" binding:"required"`
	TypeCode                  string `json:"type_code" binding:"required"`
	ParentSubmitterSampleId   string `json:"parent_submitter_sample_id,omitempty"`
	TissueSite                string `json:"tissue_site,omitempty"`
	HistologyCode             string `json:"histology_code" binding:"required,oneof=tumoral normal"`
	SubmitterSampleId         string `json:"submitter_sample_id" binding:"required"`
	SubmitterOrganizationCode string `json:"submitter_organization_code" binding:"required"`
}

// CreateSampleBatchBody represents the body required to create a sample batch
// @Description CreateSampleBatchBody represents the body required to create a sample batch
type CreateSampleBatchBody struct {
	Samples []*SampleBatch `json:"samples" validate:"required,min=1,dive,required" binding:"required,min=1,dive,required"`
} //@Name CreateSampleBatchBody
