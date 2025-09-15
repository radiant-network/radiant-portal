package types

import "time"

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
	CreatedOn        time.Time
}

type DocumentResult struct {
	DocumentID                int       `json:"document_id" validate:"required"`
	Name                      string    `json:"name" validate:"required"`
	FormatCode                string    `json:"format_code" validate:"required"`
	DataTypeCode              string    `json:"data_type_code" validate:"required"`
	Size                      int       `json:"size" validate:"required"`
	CaseID                    int       `json:"case_id" validate:"required"`
	PerformerLabCode          string    `json:"performer_lab_code,omitempty"`
	PerformerLabName          string    `json:"performer_lab_name,omitempty"`
	RelationshipToProbandCode string    `json:"relationship_to_proband_code" validate:"required"`
	PatientID                 int       `json:"patient_id" validate:"required"`
	SubmitterSampleID         string    `json:"submitter_sample_id,omitempty"`
	TaskID                    int       `json:"task_id" validate:"required"`
	SeqID                     int       `json:"seq_id,omitempty"`
	Hash                      string    `json:"hash,omitempty"`
	RunAlias                  string    `json:"run_alias,omitempty"`
	CreatedOn                 time.Time `json:"created_on" validate:"required"`
}

var DocumentFields = []Field{
	CaseIdField,
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
	ProjectCodeField,
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

var DocumentsDefaultSort = []SortField{{Field: DocumentIdField, Order: "desc"}, {Field: FamilyRelationshipToProbandCodeField, Order: "desc"}}

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
	CanBeSorted:   true,
	Table:         DocumentTable,
}

var DocumentNameField = Field{
	Name:          "name",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
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

type DocumentFilters struct {
	Project               []Aggregation `json:"project" validate:"required"`
	PerformerLab          []Aggregation `json:"performer_lab" validate:"required"`
	RelationshipToProband []Aggregation `json:"relationship_to_proband" validate:"required"`
	Format                []Aggregation `json:"format" validate:"required"`
	DataType              []Aggregation `json:"data_type" validate:"required"`
}
