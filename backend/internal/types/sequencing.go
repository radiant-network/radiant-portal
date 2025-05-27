package types

/*
+-------------+-------------+----+-----+-------+-----+
|Field        |Type         |Null|Key  |Default|Extra|
+-------------+-------------+----+-----+-------+-----+
|case_id      |int          |NO  |true |null   |     |
|seq_id       |int          |NO  |true |null   |     |
|part         |int          |NO  |false|null   |     |
|analysis_type|varchar(50)  |YES |false|null   |     |
|sample_id    |varchar(255) |YES |false|null   |     |
|patient_id   |varchar(255) |YES |false|null   |     |
|vcf_filepath |varchar(1024)|YES |false|null   |     |
|sex          |varchar(10)  |YES |false|null   |     |
|family_role  |varchar(20)  |YES |false|null   |     |
|is_affected  |boolean      |YES |false|null   |     |
|created_at   |datetime     |YES |false|null   |     |
|updated_at   |datetime     |YES |false|null   |     |
|ingested_at  |datetime     |YES |false|null   |     |
+-------------+-------------+----+-----+-------+-----+

*/

// Sequencing represents a sequencing
// @Description Sequencing represents a sequencing
type Sequencing struct {
	CaseId         int    `json:"case_id,omitempty"`
	SeqId          int    `json:"seq_id,omitempty"`
	AnalysisType   string `json:"analysis_type,omitempty"`
	SampleId       string `json:"sample_id,omitempty"`
	PatientId      string `json:"patient_id,omitempty"`
	VcfFilepath    string `json:"vcf_filepath,omitempty"`
	Sex            string `json:"sex,omitempty"`
	FamilyRole     string `json:"family_role,omitempty"`
	IsAffected     bool   `json:"is_affected"`
	ExperimentType string `json:"experiment_type,omitempty"`
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
