package types

import (
	"time"
)

type SequencingExperiment struct {
	ID                           int
	SampleID                     int
	Sample                       Sample `gorm:"foreignKey:ID;references:SampleID"`
	StatusCode                   string
	Status                       Status `gorm:"foreignKey:Code;references:StatusCode"`
	Aliquot                      string
	SequencingLabID              int
	SequencingLab                Organization `gorm:"foreignKey:ID;references:SequencingLabID"`
	RunName                      string
	RunAlias                     string
	RunDate                      time.Time `gorm:"type:timestamptz"`
	CaptureKit                   string
	CreatedOn                    time.Time
	UpdatedOn                    time.Time
	ExperimentalStrategyCode     string
	ExperimentalStrategy         ExperimentalStrategy `gorm:"foreignKey:Code;references:ExperimentalStrategyCode"`
	SequencingReadTechnologyCode string
	SequencingReadTechnology     SequencingReadTechnology `gorm:"foreignKey:Code;references:SequencingReadTechnologyCode"`
	PlatformCode                 string
	Platform                     Platform `gorm:"foreignKey:Code;references:PlatformCode"`
}

type SequencingExperimentDetail = struct {
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
	PatientID                    int       `json:"patient_id" validate:"required"`
} //@Name SequencingExperimentDetail

var SequencingExperimentIdField = Field{
	Name:          "id",
	Alias:         "seq_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         SequencingExperimentTable,
}

var SequencingExperimentRunAliasField = Field{
	Name:          "run_alias",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         SequencingExperimentTable,
}

var SequencingExperimentRunNameField = Field{
	Name:          "run_name",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         SequencingExperimentTable,
}

var SequencingExperimentTable = Table{
	Name:           "sequencing_experiment",
	FederationName: "radiant_jdbc.public.sequencing_experiment",
	Alias:          "s",
}

func (SequencingExperiment) TableName() string {
	return SequencingExperimentTable.Name // We only create when we are in clinical context
}
