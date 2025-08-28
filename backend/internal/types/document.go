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
	DocumentID                    int               `json:"document_id" validate:"required"`
	Name                          string            `json:"name" validate:"required"`
	FormatCode                    string            `json:"format_code" validate:"required"`
	DataTypeCode                  string            `json:"data_type_code" validate:"required"`
	Size                          int               `json:"size" validate:"required"`
	CasesID                       JsonArray[int]    `json:"cases_id" validate:"required"`
	CaseIDList                    string            `json:"-"`
	PerformerLabsCode             JsonArray[string] `json:"performer_labs_code,omitempty"`
	PerformerLabCodeList          string            `json:"-"`
	PerformerLabsName             JsonArray[string] `json:"performer_labs_name,omitempty"`
	PerformerLabNameList          string            `json:"-"`
	RelationshipsToProbandCode    JsonArray[string] `json:"relationships_to_proband" validate:"required"`
	RelationshipToProbandCodeList string            `json:"-"`
	PatientsID                    JsonArray[int]    `json:"patients_id" validate:"required"`
	PatientIDList                 string            `json:"-"`
	SampleSubmittersID            JsonArray[string] `json:"sample_submitters_id,omitempty"`
	SubmitterSampleIDList         string            `json:"-"`
	TasksID                       JsonArray[int]    `json:"tasks_id" validate:"required"`
	TaskIDList                    string            `json:"-"`
	SeqsID                        JsonArray[int]    `json:"seqs_id,omitempty"`
	SeqIDList                     string            `json:"-"`
	Hash                          string            `json:"hash,omitempty"`
	RunsAlias                     JsonArray[string] `json:"runs_alias,omitempty"`
	RunAliasList                  string            `json:"-"`
}

var DocumentFields = []Field{
	CaseIdField,
	CaseProjectIdField,
	CasePerformerLabCodeField,
	CasePerformerLabNameField,
	DocumentIdField,
	DocumentNameField,
	DocumentDataTypeCodeField,
	DocumentFormatCodeField,
	DocumentSizeField,
	DocumentCreatedOnField,
	DocumentHashField,
	FamilyRelationshipToProbandCodeField,
	SampleSubmitterSampleIdField,
	SampleIdField,
	SequencingExperimentIdField,
	SequencingExperimentPatientIdField,
	SequencingExperimentRunAliasField,
	SequencingExperimentRunNameField,
	TaskHasDocumentTaskIdField,
}

var DocumentDefaultFields = []Field{
	DocumentIdField,
	DocumentNameField,
	DocumentDataTypeCodeField,
	DocumentFormatCodeField,
	DocumentSizeField,
	DocumentCreatedOnField,
	FamilyRelationshipToProbandCodeField,
	CaseIdField,
	CasePerformerLabCodeField,
	CasePerformerLabNameField,
	SampleSubmitterSampleIdField,
	SequencingExperimentPatientIdField,
	TaskHasDocumentTaskIdField,
}

var DocumentsDefaultSort = []SortField{{Field: DocumentIdField, Order: "desc"}}

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
	CanBeFiltered: true,
	Table:         DocumentTable,
}

var DocumentNameField = Field{
	Name:          "name",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         DocumentTable,
}

var DocumentDataTypeCodeField = Field{
	Name:          "data_type_code",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         DocumentTable,
}

var DocumentFormatCodeField = Field{
	Name:          "format_code",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
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

var DocumentCreatedOnField = Field{
	Name:          "created_on",
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
