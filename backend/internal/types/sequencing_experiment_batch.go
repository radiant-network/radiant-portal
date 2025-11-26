package types

import "time"

type SequencingExperimentBatch struct {
	Aliquot                      TrimmedString `json:"aliquot" binding:"required"`
	SampleOrganizationCode       string        `json:"sample_organization_code" binding:"required"`
	SubmitterSampleId            TrimmedString `json:"submitter_sample_id" binding:"required"`
	CaptureKit                   TrimmedString `json:"capture_kit,omitempty"`
	ExperimentalStrategyCode     string        `json:"experimental_strategy_code" binding:"required,oneof=wgs wxs rnaseq targeted_dna"`
	SequencingReadTechnologyCode string        `json:"sequencing_read_technology_code" binding:"required,oneof=short_read long_read"`
	PlatformCode                 string        `json:"platform_code" binding:"required"`
	SequencingLabCode            string        `json:"sequencing_lab_code" binding:"required"`
	RunAlias                     TrimmedString `json:"run_alias,omitempty"`
	RunDate                      *time.Time    `json:"run_date,omitempty" format:"date-time" example:"2023-10-01T00:00:00Z"`
	StatusCode                   string        `json:"status_code" binding:"required,oneof=unknown draft revoke completed incomplete submitted in_progress"`
}

// CreateSequencingExperimentBatchBody represents the body required to create a sequencing experiment batch
// @Description CreateSequencingExperimentBatchBody represents the body required to create a sequencing experiment batch
type CreateSequencingExperimentBatchBody struct {
	SequencingExperiments []*SequencingExperimentBatch `json:"sequencing_experiments" binding:"required,min=1,dive,required"`
} //@Name CreateSequencingExperimentBatchBody
