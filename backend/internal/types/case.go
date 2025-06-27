package types

import "time"

type Case struct {
	ID               int
	ProbandID        int
	Proband          Patient `gorm:"foreignKey:ID;references:ProbandID"`
	ProjectID        int
	Project          Project `gorm:"foreignKey:ID;references:ProjectID"`
	CaseAnalysisID   int
	CaseAnalysis     CaseAnalysis `gorm:"foreignKey:ID;references:CaseAnalysisID"`
	StatusCode       string
	Status           Status `gorm:"foreignKey:Code;references:StatusCode"`
	PrimaryCondition string
	RequestID        int
	Request          Request `gorm:"foreignKey:ID;references:RequestID"`
	PerformerLabID   int
	PerformerLab     Organization `gorm:"foreignKey:ID;references:PerformerLabID"`
	Note             string
	CreatedOn        time.Time
	UpdatedOn        time.Time
}

// CaseResult - Search cases result
// @Description Line represented a case in case list
// @Name CaseResult
type CaseResult struct {
	CaseID                   int       `json:"case_id" validate:"required"`
	PatientID                int       `json:"patient_id,omitempty"`
	MRN                      string    `json:"mrn" validate:"required"`
	PriorityCode             string    `json:"priority_code" validate:"required"`
	StatusCode               string    `json:"status_code" validate:"required"`
	CaseAnalysisTypeCode     string    `json:"case_analysis_type_code" validate:"required"`
	CaseAnalysisCode         string    `json:"case_analysis_code" validate:"required"`
	CaseAnalysisName         string    `json:"case_analysis_name" validate:"required"`
	PrimaryCondition         string    `json:"primary_condition,omitempty"`
	RequestedByCode          string    `json:"requested_by_code" validate:"required"`
	RequestedByName          string    `json:"requested_by_name" validate:"required"`
	ProjectCode              string    `json:"project_code" validate:"required"`
	CreatedOn                time.Time `json:"created_on" validate:"required"`
	UpdatedOn                time.Time `json:"updated_on" validate:"required"`
	Prescriber               string    `json:"prescriber,omitempty"`
	PerformerLabCode         string    `json:"performer_lab_code,omitempty"`
	PerformerLabName         string    `json:"performer_lab_name,omitempty"`
	RequestID                int       `json:"request_id,omitempty"`
	ManagingOrganizationCode string    `json:"managing_organization_code,omitempty"`
	ManagingOrganizationName string    `json:"managing_organization_name,omitempty"`
}

var CaseTable = Table{
	Name:  "`radiant_jdbc`.`public`.`cases`",
	Alias: "c",
}

var PerformerLabTable = Table{
	Name:  OrganizationTable.Name,
	Alias: "lab",
}

func (Case) TableName() string {
	return CaseTable.Name
}

var CasesFields = []Field{
	CaseIdField,
	CaseProbandIdField,
	PatientMrnField,
	RequestPriorityCodeField,
	CaseStatusCodeField,
	CaseAnalysisTypeCodeField,
	CaseAnalysisCodeField,
	CaseAnalysisNameField,
	CasePrimaryConditionField,
	RequestOrderingOrganizationCodeField,
	RequestOrderingOrganizationNameField,
	ProjectCodeField,
	CaseCreatedOnField,
	CaseUpdatedOnField,
	RequestOrderingPhysicianField,
	CaseDiagnosticLabCodeField,
	CaseDiagnosticLabNameField,
	CaseRequestIdField,
	PatientManagingOrganizationCodeField,
	PatientManagingOrganizationNameField,
}

var VariantInterpretedCasesFields = append(CasesFields, GermlineInterpretationClassificationField, GermlineInterpretationUpdatedOnField, GermlineInterpretationConditionField)

var CasesDefaultFields = []Field{
	CaseIdField,
	PatientMrnField,
	RequestPriorityCodeField,
	CaseStatusCodeField,
	CaseAnalysisTypeCodeField,
	CaseAnalysisCodeField,
	CaseAnalysisNameField,
	RequestOrderingOrganizationCodeField,
	RequestOrderingOrganizationNameField,
	ProjectCodeField,
	CaseCreatedOnField,
	CaseUpdatedOnField,
}

var CasesDefaultSort = []SortField{{Field: CaseUpdatedOnField, Order: "desc"}}
var VariantInterpretedCasesDefaultSort = []SortField{{Field: GermlineInterpretationUpdatedOnField, Order: "desc"}}

var CasesQueryConfig = QueryConfig{
	AllFields:     CasesFields,
	DefaultFields: CasesDefaultFields,
	DefaultSort:   CasesDefaultSort,
	IdField:       CaseIdField,
}

var VariantInterpretedCasesQueryConfig = QueryConfig{
	AllFields:     VariantInterpretedCasesFields,
	DefaultFields: []Field{},
	DefaultSort:   VariantInterpretedCasesDefaultSort,
	IdField:       CaseIdField,
}

var VariantUninterpretedCasesQueryConfig = QueryConfig{
	AllFields:     VariantInterpretedCasesFields,
	DefaultFields: []Field{},
	DefaultSort:   CasesDefaultSort,
	IdField:       CaseIdField,
}

var CaseIdField = Field{
	Name:          "id",
	Alias:         "case_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         CaseTable,
}

var CaseProbandIdField = Field{
	Name:          "proband_id",
	Alias:         "patient_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         CaseTable,
}

var CaseStatusCodeField = Field{
	Name:            "status_code",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           CaseTable,
}

var CasePrimaryConditionField = Field{
	Name:          "primary_condition",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         CaseTable,
}

var CaseCreatedOnField = Field{
	Name:          "created_on",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         CaseTable,
}

var CaseUpdatedOnField = Field{
	Name:          "updated_on",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         CaseTable,
}

var CaseRequestIdField = Field{
	Name:          "request_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         CaseTable,
}

var CaseDiagnosticLabCodeField = Field{
	Name:            "code",
	Alias:           "performer_lab_code",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           PerformerLabTable,
}

var CaseDiagnosticLabNameField = Field{
	Name:          "name",
	Alias:         "performer_lab_name",
	CanBeSelected: true,
	Table:         PerformerLabTable,
}

type CaseFilters struct {
	Status       []Aggregation `json:"status" validate:"required"`
	Priority     []Aggregation `json:"priority" validate:"required"`
	CaseAnalysis []Aggregation `json:"case_analysis" validate:"required"`
	Project      []Aggregation `json:"project" validate:"required"`
	PerformerLab []Aggregation `json:"performer_lab" validate:"required"`
	RequestedBy  []Aggregation `json:"requested_by" validate:"required"`
}

type VariantInterpretedCase = struct {
	SeqId                   int       `json:"seq_id" validate:"required"`
	CaseId                  int       `json:"case_id" validate:"required"`
	TranscriptId            string    `json:"transcript_id" validate:"required"`
	InterpretationUpdatedOn time.Time `json:"interpretation_updated_on" validate:"required"`
	Condition               string    `json:"condition" validate:"required"`
	Classification          string    `json:"classification" validate:"required"`
	Zygosity                string    `json:"zygosity" validate:"required"`
	RequestedByCode         string    `json:"requested_by_code" validate:"required"`
	RequestedByName         string    `json:"requested_by_name" validate:"required"`
	CaseAnalysisCode        string    `json:"case_analysis_code" validate:"required"`
	CaseAnalysisName        string    `json:"case_analysis_name" validate:"required"`
	StatusCode              string    `json:"status_code" validate:"required"`
} // @name VariantInterpretedCase

type VariantUninterpretedCase = struct {
	CaseId           int       `json:"case_id" validate:"required"`
	CreatedOn        time.Time `json:"created_on" validate:"required"`
	UpdatedOn        time.Time `json:"updated_on" validate:"required"`
	PrimaryCondition string    `json:"primary_condition" validate:"required"`
	Zygosity         string    `json:"zygosity" validate:"required"`
	RequestedByCode  string    `json:"requested_by_code" validate:"required"`
	RequestedByName  string    `json:"requested_by_name" validate:"required"`
	CaseAnalysisCode string    `json:"case_analysis_code" validate:"required"`
	CaseAnalysisName string    `json:"case_analysis_name" validate:"required"`
	StatusCode       string    `json:"status_code" validate:"required"`
} // @name VariantUninterpretedCase

type VariantExpendedInterpretedCase = struct {
	PatientID               int    `json:"patient_id" validate:"required"`
	InterpreterName         string `json:"interpreter_name" validate:"required"`
	Interpretation          string `json:"interpretation" validate:"required"`
	GeneSymbol              string `json:"gene_symbol" validate:"required"`
	ClassificationCriterias string `json:"classification_criterias" validate:"required"`
	Inheritances            string `json:"inheritances" validate:"required"`
	PatientSexCode          string `json:"patient_sex_code" validate:"required"`
	PubmedIDs               string `json:"pubmed_ids" validate:"required"`
} // @name VariantExpendedInterpretedCase
