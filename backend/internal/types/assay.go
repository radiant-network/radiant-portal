package types

import "time"

type Assay = struct {
	RequestID                int       `json:"request_id,omitempty"`
	StatusCode               string    `json:"status_code,omitempty"`
	CreatedOn                time.Time `json:"created_on,omitempty"`
	UpdatedOn                time.Time `json:"updated_on,omitempty"`
	PerformerLabCode         string    `json:"performer_lab_code,omitempty"`
	PerformerLabName         string    `json:"performer_lab_name,omitempty"`
	Aliquot                  string    `json:"aliquot,omitempty"`
	RunName                  string    `json:"run_name,omitempty"`
	RunAlias                 string    `json:"run_alias,omitempty"`
	RunDate                  time.Time `json:"run_date,omitempty"`
	SeqID                    int       `json:"seq_id,omitempty"`
	ExperimentalStrategyCode string    `json:"experimental_strategy_code,omitempty"`
	ExperimentalStrategyName string    `json:"experimental_strategy_name,omitempty"`
	IsPairedEnd              bool      `json:"is_paired_end" validate:"required"`
	PlatformCode             string    `json:"platform_code,omitempty"`
	CaptureKit               string    `json:"capture_kit,omitempty"`
	ReadLength               int       `json:"read_length,omitempty"`
	ExperimentDescription    string    `json:"experiment_description,omitempty"`
	SampleID                 int       `json:"sample_id,omitempty"`
	SampleTypeCode           string    `json:"sample_type_code,omitempty"`
	TissueSite               string    `json:"tissue_site,omitempty"`
	HistologyCode            string    `json:"histology_code,omitempty"`
	SubmitterSampleID        string    `json:"submitter_sample_id,omitempty"`
} //@Name Assay
