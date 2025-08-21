package types

type Document struct {
	ID               int
	Name             string
	DataCategoryCode string
	DataCategory     DataCategory `gorm:"foreignKey:code;references:DataCategoryCode"`
	DataTypeCode     string
	DataType         DataType `gorm:"foreignKey:code;references:DataTypeCode"`
	FileFormatCode   string
	FileFormat       FileFormat `gorm:"foreignKey:code;references:FileFormatCode"`
	Size             int
	Url              string
	Hash             string
	Patients         []Patient `gorm:"many2many:radiant_jdbc.public.document_has_patient;"`
}

type DocumentResult struct {
	ID                    int    `json:"document_id" validate:"required"`
	Name                  string `json:"name" validate:"required"`
	FormatCode            string `json:"format_code" validate:"required"`
	DataTypeCode          string `json:"data_type_code" validate:"required"`
	Size                  int    `json:"size" validate:"required"`
	CaseID                int    `json:"case_id" validate:"required"`
	PerformerLabCode      string `json:"performer_lab_code,omitempty"`
	PerformerLabName      string `json:"performer_lab_name,omitempty"`
	ProbandID             int    `json:"proband_id" validate:"required"`
	RelationshipToProband string `json:"relationship_to_proband" validate:"required"`
	PatientID             int    `json:"patient_id" validate:"required"`
	SampleSubmitterID     string `json:"sample_submitter_id,omitempty"`
	TaskID                int    `json:"task_id" validate:"required"`
	SeqID                 int    `json:"seq_id" validate:"required"`
	Hash                  string `json:"hash" validate:"required"`
	RunAlias              string `json:"run_alias,omitempty"`
}

var DocumentFields = []Field{
	DocumentIdField,
	DocumentNameField,
	DocumentFormatCodeField,
	DocumentSizeField,
	CaseIdField,
	CasePerformerLabCodeField,
	CasePerformerLabNameField,
	SampleSubmitterSampleIdField,
	TaskIdField,
	SequencingExperimentIdField,
	DocumentHashField,
	SequencingExperimentRunAliasField,
}

var DocumentDefaultFields = []Field{
	DocumentIdField,
	DocumentNameField,
	DocumentFormatCodeField,
	DocumentSizeField,
	CaseIdField,
	CasePerformerLabCodeField,
	CasePerformerLabNameField,
	SampleSubmitterSampleIdField,
	TaskIdField,
}

var DocumentsDefaultSort = []SortField{{Field: DocumentNameField, Order: "asc"}}

var DocumentsQueryConfig = QueryConfig{
	AllFields:     DocumentFields,
	DefaultFields: DocumentDefaultFields,
	DefaultSort:   DocumentsDefaultSort,
	IdField:       DocumentIdField,
}

var DocumentIdField = Field{
	Name:          "id",
	Alias:         "document_id",
	CanBeSelected: true,
	Table:         DocumentTable,
}

var DocumentNameField = Field{
	Name:          "name",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         DocumentTable,
}

var DocumentFormatCodeField = Field{
	Name:          "format_code",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         DocumentTable,
}

var DocumentSizeField = Field{
	Name:          "size",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         DocumentTable,
}

var DocumentHashField = Field{
	Name:          "hash",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         DocumentTable,
}

var DocumentTable = Table{
	Name:  "radiant_jdbc.public.document",
	Alias: "doc",
}

var DocumentHasPatientTable = Table{
	Name:  "radiant_jdbc.public.document_has_patient",
	Alias: "dhp",
}

func (Document) TableName() string {
	return DocumentTable.Name
}
