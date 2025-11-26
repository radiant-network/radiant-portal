package types

import "time"

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
	Name:  "radiant_jdbc.public.sequencing_experiment",
	Alias: "s",
}

func (SequencingExperiment) TableName() string {
	return SequencingExperimentTable.Name
}
