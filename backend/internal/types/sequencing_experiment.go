package types

import "time"

type SequencingExperiment struct {
	ID             int
	CaseID         int
	Case           Case `gorm:"foreignKey:ID;references:CaseID"`
	PatientID      int
	Patient        Patient `gorm:"foreignKey:ID;references:PatientID"`
	SampleID       int
	Sample         Sample `gorm:"foreignKey:ID;references:SampleID"`
	ExperimentID   int
	Experiment     Experiment `gorm:"foreignKey:ID;references:ExperimentID"`
	StatusCode     string
	Status         Status `gorm:"foreignKey:Code;references:StatusCode"`
	Aliquot        string
	RequestID      int
	Request        Request `gorm:"foreignKey:ID;references:RequestID"`
	PerformerLabID int
	PerformerLab   Organization `gorm:"foreignKey:ID;references:PerformerLabID"`
	RunName        string
	RunAlias       string
	RunDate        time.Time `gorm:"type:DATE"`
	CaptureKit     string
	IsPairedEnd    bool
	ReadLength     int
	CreatedOn      time.Time
	UpdatedOn      time.Time
}

var SequencingExperimentIdField = Field{
	Name:          "id",
	Alias:         "seq_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         SequencingExperimentTable,
}

var SequencingExperimentPatientIdField = Field{
	Name:          "patient_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         SequencingExperimentTable,
}

var SequencingExperimentRunAliasField = Field{
	Name:          "run_alias",
	CanBeSelected: true,
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
