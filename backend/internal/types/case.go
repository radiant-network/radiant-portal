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
	MRN                      string    `json:"mrn,omitempty"`
	PriorityCode             string    `json:"priority_code,omitempty"`
	StatusCode               string    `json:"status_code" validate:"required"`
	CaseAnalysisTypeCode     string    `json:"case_analysis_type_code,omitempty"`
	CaseAnalysisCode         string    `json:"case_analysis_code,omitempty"`
	CaseAnalysisName         string    `json:"case_analysis_name,omitempty"`
	PrimaryConditionID       string    `json:"primary_condition_id,omitempty"`
	PrimaryConditionName     string    `json:"primary_condition_name,omitempty"`
	RequestedByCode          string    `json:"requested_by_code,omitempty"`
	RequestedByName          string    `json:"requested_by_name,omitempty"`
	ProjectCode              string    `json:"project_code,omitempty"`
	CreatedOn                time.Time `json:"created_on" validate:"required"`
	UpdatedOn                time.Time `json:"updated_on" validate:"required"`
	Prescriber               string    `json:"prescriber,omitempty"`
	PerformerLabCode         string    `json:"performer_lab_code,omitempty"`
	PerformerLabName         string    `json:"performer_lab_name,omitempty"`
	RequestID                int       `json:"request_id,omitempty"`
	ManagingOrganizationCode string    `json:"managing_organization_code,omitempty"`
	ManagingOrganizationName string    `json:"managing_organization_name,omitempty"`
}

// CaseEntity - Case Entity data
// @Description Data for Case Entity Page
// @Name CaseEntity
type CaseEntity struct {
	CaseID               int                                       `json:"case_id" validate:"required"`
	ProbandID            int                                       `json:"-"`
	CaseAnalysisCode     string                                    `json:"case_analysis_code,omitempty"`
	CaseAnalysisName     string                                    `json:"case_analysis_name,omitempty"`
	CaseAnalysisType     string                                    `json:"-"`
	CaseType             string                                    `json:"case_type,omitempty"`
	CreatedOn            time.Time                                 `json:"created_on" validate:"required"`
	UpdatedOn            time.Time                                 `json:"updated_on" validate:"required"`
	Prescriber           string                                    `json:"prescriber,omitempty"`
	RequestedByCode      string                                    `json:"requested_by_code,omitempty"`
	RequestedByName      string                                    `json:"requested_by_name,omitempty"`
	PerformerLabCode     string                                    `json:"performer_lab_code,omitempty"`
	PerformerLabName     string                                    `json:"performer_lab_name,omitempty"`
	RequestID            int                                       `json:"request_id,omitempty"`
	PriorityCode         string                                    `json:"priority_code,omitempty"`
	StatusCode           string                                    `json:"status_code" validate:"required"`
	PrimaryConditionID   string                                    `json:"primary_condition_id,omitempty"`
	PrimaryConditionName string                                    `json:"primary_condition_name,omitempty"`
	Note                 string                                    `json:"note,omitempty"`
	Assays               JsonArray[CaseAssay]                      `json:"assays" validate:"required"`
	Members              JsonArray[CasePatientClinicalInformation] `json:"members" validate:"required"`
	Tasks                JsonArray[CaseTask]                       `json:"tasks" validate:"required"`
}

// CaseAssay - Assay to display in a Case
// @Description Assay to display in a Case
// @Name CaseAssay
type CaseAssay struct {
	SeqID                    int       `json:"seq_id" validate:"required"`
	RequestID                int       `json:"request_id,omitempty"`
	PatientID                int       `json:"patient_id" validate:"required"`
	RelationshipToProband    string    `json:"relationship_to_proband,omitempty"`
	SampleID                 int       `json:"sample_id" validate:"required"`
	SampleSubmitterID        string    `json:"sample_submitter_id,omitempty"`
	AffectedStatusCode       string    `json:"affected_status_code,omitempty"`
	HistologyCode            string    `json:"histology_code,omitempty"`
	ExperimentalStrategyCode string    `json:"experimental_strategy_code" validate:"required"`
	StatusCode               string    `json:"status_code" validate:"required"`
	UpdatedOn                time.Time `json:"updated_on" validate:"required"`
	HasVariants              bool      `json:"has_variants" validate:"required"`
}

// CasePatientClinicalInformation - Patient clinical information
// @Description Patient clinical information to display in Case Entity
// @Name CasePatientClinicalInformation
type CasePatientClinicalInformation struct {
	RelationshipToProband    string            `json:"relationship_to_proband,omitempty"`
	AffectedStatusCode       string            `json:"affected_status_code,omitempty"`
	PatientID                int               `json:"patient_id" validate:"required"`
	DateOfBirth              time.Time         `json:"date_of_birth"`
	SexCode                  string            `json:"sex_code" validate:"required"`
	Mrn                      string            `json:"mrn,omitempty"`
	ManagingOrganizationCode string            `json:"managing_organization_code,omitempty"`
	ManagingOrganizationName string            `json:"managing_organization_name,omitempty"`
	EthnicityCodes           JsonArray[string] `json:"ethnicity_codes,omitempty"` // TODO
	ObservedPhenotypes       JsonArray[Term]   `json:"observed_phenotypes,omitempty"`
	NonObservedPhenotypes    JsonArray[Term]   `json:"non_observed_phenotypes,omitempty"`
}

type CaseTask struct {
	ID               int               `json:"id" validate:"required"`
	TypeCode         string            `json:"type_code" validate:"required"`
	CreatedOn        time.Time         `json:"created_on" validate:"required"`
	PatientsUnparsed string            `json:"-"`
	Patients         JsonArray[string] `json:"patients" validate:"required"`
	PatientCount     int64             `json:"-"`
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
