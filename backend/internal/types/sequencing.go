package types

/*
+------------------------+---------------------+------+-----+---------+-------+
| Field                  | Type                | Null | Key | Default | Extra |
+------------------------+---------------------+------+-----+---------+-------+
| case_id                | int                 | NO   | YES | null    |       |
| seq_id                 | int                 | NO   | YES | null    |       |
| task_id                | int                 | NO   | YES | null    |       |
| part                   | int                 | NO   |     | null    |       |
| analysis_type          | varchar(50)         | YES  |     | null    |       |
| sample_id              | varchar(255)        | YES  |     | null    |       |
| patient_id             | varchar(255)        | YES  |     | null    |       |
| experimental_strategy  | varchar(50)         | YES  |     | null    |       |
| request_priority       | varchar(20)         | YES  |     | null    |       |
| vcf_filepath           | varchar(1024)       | YES  |     | null    |       |
| sex                    | varchar(10)         | YES  |     | null    |       |
| family_role            | varchar(20)         | YES  |     | null    |       |
| affected_status        | varchar(20)         | YES  |     | null    |       |
| created_at             | datetime            | YES  |     | null    |       |
| updated_at             | datetime            | YES  |     | null    |       |
| ingested_at            | datetime            | YES  |     | null    |       |
+------------------------+---------------------+------+-----+---------+-------+

*/

// Sequencing represents a sequencing
// @Description Sequencing represents a sequencing
type Sequencing struct {
	CaseId               int    `json:"case_id,omitempty"`
	SeqId                int    `json:"seq_id,omitempty"`
	TaskId               int    `json:"task_id,omitempty"`
	Part                 int    `json:"part,omitempty"`
	AnalysisType         string `json:"analysis_type,omitempty"`
	SampleId             int    `json:"sample_id,omitempty"`
	PatientId            int    `json:"patient_id,omitempty"`
	ExperimentalStrategy string `json:"experimental_strategy,omitempty"`
	RequestPriority      string `json:"request_priority,omitempty"`
	VcfFilepath          string `json:"vcf_filepath,omitempty"`
	Sex                  string `json:"sex,omitempty"`
	FamilyRole           string `json:"family_role,omitempty"`
	AffectedStatus       string `json:"affected_status,omitempty"`
	CreatedAt            string `json:"created_at,omitempty"`
	UpdatedAt            string `json:"updated_at,omitempty"`
} // @name Sequencing

var SequencingTable = Table{
	Name:  "staging_sequencing_experiment",
	Alias: "s",
}

var ExperimentTypeField = Field{
	Name:          "experimental_strategy",
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
