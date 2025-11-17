package types

import "time"

type Assay = struct {
	StatusCode                   string    `json:"status_code,omitempty"`
	CreatedOn                    time.Time `json:"created_on,omitempty"`
	UpdatedOn                    time.Time `json:"updated_on,omitempty"`
	SequencingLabCode            string    `json:"sequencing_lab_code,omitempty"`
	SequencingLabName            string    `json:"sequencing_lab_name,omitempty"`
	Aliquot                      string    `json:"aliquot,omitempty"`
	RunName                      string    `json:"run_name,omitempty"`
	RunAlias                     string    `json:"run_alias,omitempty"`
	RunDate                      time.Time `json:"run_date,omitempty"`
	SeqID                        int       `json:"seq_id,omitempty"`
	ExperimentalStrategyCode     string    `json:"experimental_strategy_code,omitempty"`
	ExperimentalStrategyName     string    `json:"experimental_strategy_name,omitempty"`
	PlatformCode                 string    `json:"platform_code,omitempty"`
	CaptureKit                   string    `json:"capture_kit,omitempty"`
	SequencingReadTechnologyCode string    `json:"sequencing_read_technology_code,omitempty"`
	SequencingReadTechnologyName string    `json:"sequencing_read_technology_name,omitempty"`
	SampleID                     int       `json:"sample_id,omitempty"`
	SampleTypeCode               string    `json:"sample_type_code,omitempty"`
	TissueSite                   string    `json:"tissue_site,omitempty"`
	HistologyCode                string    `json:"histology_code,omitempty"`
	SubmitterSampleID            string    `json:"submitter_sample_id,omitempty"`
} //@Name Assay
