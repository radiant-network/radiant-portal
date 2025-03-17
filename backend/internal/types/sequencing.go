package types

// Sequencing represents a sequencing
// @Description Sequencing represents a sequencing
type Sequencing struct {
	SeqId          int    `json:"seq_id,omitempty"`
	PatientId      int    `json:"patient_id,omitempty"`
	SampleId       int    `json:"sample_id,omitempty"`
	ExperimentType string `json:"experiment_type,omitempty"`
	AnalysisType   string `json:"analysis_type,omitempty"`
} // @name Sequencing

var SequencingTable = Table{
	Name:  "sequencing_experiment",
	Alias: "s",
}

var ExperimentTypeField = Field{
	Name:          "experiment_type",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         SequencingTable,
}

var AnalysisTypeField = Field{
	Name:          "analysis_type",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         SequencingTable,
}
