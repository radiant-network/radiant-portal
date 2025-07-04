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
	PrimaryConditionID       string    `json:"primary_condition_id,omitempty"`
	PrimaryConditionName     string    `json:"primary_condition_name,omitempty"`
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
	CasePrimaryConditionIdField,
	CasePrimaryConditionNameField,
	RequestOrderingOrganizationCodeField,
	RequestOrderingOrganizationNameField,
	ProjectCodeField,
	CaseCreatedOnField,
	CaseUpdatedOnField,
	RequestOrderingPhysicianField,
	CasePerformerLabCodeField,
	CasePerformerLabNameField,
	CaseRequestIdField,
	PatientManagingOrganizationCodeField,
	PatientManagingOrganizationNameField,
}

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

var CasesQueryConfig = QueryConfig{
	AllFields:     CasesFields,
	DefaultFields: CasesDefaultFields,
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

var CasePerformerLabCodeField = Field{
	Name:            "code",
	Alias:           "performer_lab_code",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           PerformerLabTable,
}

var CasePerformerLabNameField = Field{
	Name:          "name",
	Alias:         "performer_lab_name",
	CanBeSelected: true,
	Table:         PerformerLabTable,
}

var CasePrimaryConditionIdField = Field{
	Name:          "id",
	Alias:         "primary_condition_id",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         MondoTable,
}

var CasePrimaryConditionNameField = Field{
	Name:          "name",
	Alias:         "primary_condition_name",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         MondoTable,
}

type CaseFilters struct {
	Status       []Aggregation `json:"status" validate:"required"`
	Priority     []Aggregation `json:"priority" validate:"required"`
	CaseAnalysis []Aggregation `json:"case_analysis" validate:"required"`
	Project      []Aggregation `json:"project" validate:"required"`
	PerformerLab []Aggregation `json:"performer_lab" validate:"required"`
	RequestedBy  []Aggregation `json:"requested_by" validate:"required"`
}
