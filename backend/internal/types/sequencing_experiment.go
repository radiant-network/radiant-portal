package types

import "time"

type SequencingExperiment struct {
	ID                       int
	CaseID                   int
	Case                     Case `gorm:"foreignKey:ID;references:CaseID"`
	PatientID                int
	Patient                  Patient `gorm:"foreignKey:ID;references:PatientID"`
	SampleID                 int
	Sample                   Sample `gorm:"foreignKey:ID;references:SampleID"`
	ExperimentalStrategyCode string
	ExperimentalStrategy     ExperimentalStrategy `gorm:"foreignKey:code;references:ExperimentalStrategyCode"`
	StatusCode               string
	Status                   Status `gorm:"foreignKey:Code;references:StatusCode"`
	Aliquot                  string
	RequestID                int
	Request                  Request `gorm:"foreignKey:ID;references:RequestID"`
	PerformerLabID           int
	PerformerLab             Organization `gorm:"foreignKey:ID;references:PerformerLabID"`
	RunName                  string
	RunAlias                 string
	RunDate                  time.Time `gorm:"type:DATE"`
	PlatformCode             string
	Platform                 Platform `gorm:"foreignKey:code;references:PlatformCode"`
	CaptureKit               string
	IsPairedEnd              bool
	ReadLength               int
	CreatedOn                time.Time
	UpdatedOn                time.Time
}

var SequencingExperimentTable = Table{
	Name: "radiant_jdbc.public.sequencing_experiment",
}

func (SequencingExperiment) TableName() string {
	return SequencingExperimentTable.Name
}
