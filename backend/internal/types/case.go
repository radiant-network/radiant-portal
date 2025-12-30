package types

import "time"

type Case struct {
	ID                     int `gorm:"unique;primaryKey;autoIncrement"`
	ProbandID              int
	Proband                Patient `gorm:"foreignKey:ID;references:ProbandID"`
	ProjectID              int
	Project                Project `gorm:"foreignKey:ID;references:ProjectID"`
	AnalysisCatalogID      int
	AnalysisCatalog        AnalysisCatalog `gorm:"foreignKey:ID;references:AnalysisCatalogID"`
	CaseTypeCode           string
	CaseType               CaseType `gorm:"foreignKey:Code;references:CaseTypeCode"`
	CaseCategoryCode       string
	CaseCategory           CaseCategory `gorm:"foreignKey:Code;references:CaseCategoryCode"`
	PriorityCode           string
	Priority               Priority `gorm:"foreignKey:Code;references:PriorityCode"`
	StatusCode             string
	Status                 Status `gorm:"foreignKey:Code;references:StatusCode"`
	ResolutionStatusCode   string
	ResolutionStatus       ResolutionStatus `gorm:"foreignKey:Code;references:ResolutionStatusCode"`
	PrimaryCondition       string
	ConditionCodeSystem    string
	OrderingPhysician      string
	OrderingOrganizationID int
	OrderingOrganization   Organization `gorm:"foreignKey:ID;references:OrderingOrganizationID"`
	DiagnosisLabID         int
	DiagnosisLab           Organization `gorm:"foreignKey:ID;references:DiagnosisLabID"`
	SubmitterCaseID        string
	Note                   string
	CreatedOn              time.Time
	UpdatedOn              time.Time
}

// CaseResult - Search cases result
// @Description Line represented a case in case list
// @Name CaseResult
type CaseResult struct {
	CaseID                   int       `json:"case_id" validate:"required"`
	ProbandID                int       `json:"proband_id,omitempty"`
	SubmitterProbandId       string    `json:"submitter_proband_id,omitempty"`
	PriorityCode             string    `json:"priority_code,omitempty"`
	StatusCode               string    `json:"status_code" validate:"required"`
	CaseTypeCode             string    `json:"-"`
	AnalysisCatalogCode      string    `json:"analysis_catalog_code,omitempty"`
	AnalysisCatalogName      string    `json:"analysis_catalog_name,omitempty"`
	CaseType                 string    `json:"case_type,omitempty"`
	PrimaryConditionID       string    `json:"primary_condition_id,omitempty"`
	PrimaryConditionName     string    `json:"primary_condition_name,omitempty"`
	OrderingOrganizationCode string    `json:"ordering_organization_code,omitempty"`
	OrderingOrganizationName string    `json:"ordering_organization_name,omitempty"`
	ProjectCode              string    `json:"project_code,omitempty"`
	ProjectName              string    `json:"project_name,omitempty"`
	CreatedOn                time.Time `json:"created_on" validate:"required"`
	UpdatedOn                time.Time `json:"updated_on" validate:"required"`
	Prescriber               string    `json:"prescriber,omitempty"`
	DiagnosisLabCode         string    `json:"diagnosis_lab_code,omitempty"`
	DiagnosisLabName         string    `json:"diagnosis_lab_name,omitempty"`
	OrganizationCode         string    `json:"organization_code,omitempty"`
	OrganizationName         string    `json:"organization_name,omitempty"`
	HasVariants              bool      `json:"has_variants" validate:"required"`
	PanelCode                string    `json:"panel_code,omitempty"`
	PanelName                string    `json:"panel_name,omitempty"`
	ResolutionStatusCode     string    `json:"resolution_status_code,omitempty"`
	CaseCategoryCode         string    `json:"case_category_code,omitempty"`
	ProbandJhn               string    `json:"proband_jhn,omitempty"`
	ProbandLifeStatusCode    string    `json:"proband_life_status_code,omitempty"`
	ProbandFirstName         string    `json:"proband_first_name,omitempty"`
	ProbandLastName          string    `json:"proband_last_name,omitempty"`
}

// CaseEntity - Case Entity data
// @Description Data for Case Entity Page
// @Name CaseEntity
type CaseEntity struct {
	CaseID                   int                                       `json:"case_id" validate:"required"`
	ProbandID                int                                       `json:"-"`
	CaseType                 string                                    `json:"case_type,omitempty"`
	AnalysisCatalogCode      string                                    `json:"analysis_catalog_code,omitempty"`
	AnalysisCatalogName      string                                    `json:"analysis_catalog_name,omitempty"`
	CaseTypeCode             string                                    `json:"-"`
	CaseCategoryCode         string                                    `json:"case_category_code" validate:"required"`
	CaseCategoryName         string                                    `json:"case_category_name" validate:"required"`
	CreatedOn                time.Time                                 `json:"created_on" validate:"required"`
	UpdatedOn                time.Time                                 `json:"updated_on" validate:"required"`
	Prescriber               string                                    `json:"prescriber,omitempty"`
	OrderingOrganizationCode string                                    `json:"ordering_organization_code,omitempty"`
	OrderingOrganizationName string                                    `json:"ordering_organization_name,omitempty"`
	DiagnosisLabCode         string                                    `json:"diagnosis_lab_code,omitempty"`
	DiagnosisLabName         string                                    `json:"diagnosis_lab_name,omitempty"`
	PriorityCode             string                                    `json:"priority_code,omitempty"`
	StatusCode               string                                    `json:"status_code" validate:"required"`
	PrimaryConditionID       string                                    `json:"primary_condition_id,omitempty"`
	PrimaryConditionName     string                                    `json:"primary_condition_name,omitempty"`
	Note                     string                                    `json:"note,omitempty"`
	ProjectCode              string                                    `json:"project_code,omitempty"`
	ProjectName              string                                    `json:"project_name,omitempty"`
	PanelCode                string                                    `json:"panel_code,omitempty"`
	PanelName                string                                    `json:"panel_name,omitempty"`
	Assays                   JsonArray[CaseAssay]                      `json:"assays" validate:"required"`
	Members                  JsonArray[CasePatientClinicalInformation] `json:"members" validate:"required"`
	Tasks                    JsonArray[CaseTask]                       `json:"tasks" validate:"required"`
}

// CaseAssay - Assay to display in a Case
// @Description Assay to display in a Case
// @Name CaseAssay
type CaseAssay struct {
	SeqID                    int       `json:"seq_id" validate:"required"`
	PatientID                int       `json:"patient_id" validate:"required"`
	RelationshipToProband    string    `json:"relationship_to_proband" validate:"required"`
	SampleID                 int       `json:"sample_id" validate:"required"`
	SampleSubmitterID        string    `json:"sample_submitter_id,omitempty"`
	SampleTypeCode           string    `json:"sample_type_code,omitempty"`
	AffectedStatusCode       string    `json:"affected_status_code" validate:"required"`
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
	RelationshipToProband string            `json:"relationship_to_proband" validate:"required"`
	AffectedStatusCode    string            `json:"affected_status_code" validate:"required"`
	PatientID             int               `json:"patient_id" validate:"required"`
	FirstName             string            `json:"first_name,omitempty"`
	LastName              string            `json:"last_name,omitempty"`
	DateOfBirth           time.Time         `json:"date_of_birth"`
	LifeStatusCode        string            `json:"life_status_code" validate:"required"`
	SexCode               string            `json:"sex_code" validate:"required"`
	SubmitterPatientId    string            `json:"submitter_patient_id,omitempty"`
	Jhn                   string            `json:"jhn,omitempty"`
	OrganizationCode      string            `json:"organization_code,omitempty"`
	OrganizationName      string            `json:"organization_name,omitempty"`
	EthnicityCodes        JsonArray[string] `json:"ethnicity_codes,omitempty"` // TODO
	ObservedPhenotypes    JsonArray[Term]   `json:"observed_phenotypes,omitempty"`
	NonObservedPhenotypes JsonArray[Term]   `json:"non_observed_phenotypes,omitempty"`
}

type CaseTask struct {
	ID               int               `json:"id" validate:"required"`
	TypeCode         string            `json:"type_code" validate:"required"`
	TypeName         string            `json:"type_name" validate:"required"`
	CreatedOn        time.Time         `json:"created_on" validate:"required"`
	PatientsUnparsed string            `json:"-"`
	Patients         JsonArray[string] `json:"patients" validate:"required"`
	PatientCount     int64             `json:"-"`
}

type CaseHasSequencingExperiment struct {
	CaseID                 int
	SequencingExperimentID int
}

var CaseTable = Table{
	Name:           "cases",
	FederationName: "radiant_jdbc.public.cases",
	Alias:          "c",
}

var CaseHasSequencingExperimentTable = Table{
	Name:           "case_has_sequencing_experiment",
	FederationName: "radiant_jdbc.public.case_has_sequencing_experiment",
	Alias:          "chseq",
}

func (Case) TableName() string {
	return CaseTable.Name
}

var CasesFields = []Field{
	CaseIdField,
	CaseProbandIdField,
	PatientIdField,
	SubmitterPatientIdField,
	SubmitterProbandIdField,
	PatientMrnField,
	CasePriorityCodeField,
	CaseStatusCodeField,
	CaseTypeCodeField,
	AnalysisCatalogCodeField,
	AnalysisCatalogNameField,
	CasePrimaryConditionIdField,
	CasePrimaryConditionNameField,
	ProjectCodeField,
	ProjectNameField,
	CaseCreatedOnField,
	CaseUpdatedOnField,
	CaseOrderingPhysicianField,
	CaseOrderingOrganizationNameField,
	CaseOrderingOrganizationCodeField,
	CaseDiagnosisLabCodeField,
	CaseDiagnosisLabNameField,
	PatientOrganizationCodeField,
	PatientOrganizationNameField,
	CaseSequencingExperimentIdField,
	PanelCodeField,
	PanelNameField,
	CaseCategoryCodeField,
	CaseResolutionStatusCodeField,
	ProbandJhnField,
	ProbandLifeStatusCodeField,
	ProbandFirstNameField,
	ProbandLastNameField,
}

var CasesDefaultFields = []Field{
	CaseIdField,
	CaseProbandIdField,
	SubmitterProbandIdField,
	CasePriorityCodeField,
	CaseStatusCodeField,
	CaseTypeCodeField,
	AnalysisCatalogCodeField,
	AnalysisCatalogNameField,
	CaseOrderingOrganizationCodeField,
	CaseOrderingOrganizationNameField,
	ProjectCodeField,
	ProjectNameField,
	CaseCreatedOnField,
	CaseUpdatedOnField,
}

var CasesDefaultSort = []SortField{{Field: CaseUpdatedOnField, Order: "desc"}}

var CasePriorityCodeField = Field{
	Name:            "priority_code",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           CaseTable,
}

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
	CanBeSelected: true,
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

var CaseDiagnosisLabCodeField = Field{
	Name:            "code",
	Alias:           "diagnosis_lab_code",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           SequencingLabTable,
}

var CaseDiagnosisLabNameField = Field{
	Name:          "name",
	Alias:         "diagnosis_lab_name",
	CanBeSelected: true,
	Table:         SequencingLabTable,
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

var CaseTypeCodeField = Field{
	Name:          "case_type_code",
	Alias:         "case_type_code",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         CaseTable,
}

var CaseOrderingPhysicianField = Field{
	Name:          "ordering_physician",
	Alias:         "prescriber",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         CaseTable,
}

var CaseOrderingOrganizationCodeField = Field{
	Name:            "code",
	Alias:           "ordering_organization_code",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           OrderingOrganizationTable,
}

var CaseOrderingOrganizationNameField = Field{
	Name:          "name",
	Alias:         "ordering_organization_name",
	CanBeSelected: true,
	Table:         OrderingOrganizationTable,
}

var CaseSequencingExperimentIdField = Field{
	Name:          "sequencing_experiment_id",
	Alias:         "sequencing_experiment_id",
	CanBeFiltered: true,
	Table:         CaseHasSequencingExperimentTable,
}

var CaseCategoryCodeField = Field{
	Name:          "case_category_code",
	Alias:         "case_category_code",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         CaseTable,
}

var CaseResolutionStatusCodeField = Field{
	Name:          "resolution_status_code",
	Alias:         "resolution_status_code",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         CaseTable,
}

type CaseFilters struct {
	Status               []Aggregation `json:"status_code" validate:"required"`
	Priority             []Aggregation `json:"priority_code" validate:"required"`
	AnalysisCatalog      []Aggregation `json:"analysis_catalog_code" validate:"required"`
	Project              []Aggregation `json:"project_code" validate:"required"`
	DiagnosisLab         []Aggregation `json:"diagnosis_lab_code" validate:"required"`
	OrderingOrganization []Aggregation `json:"ordering_organization_code" validate:"required"`
	ResolutionStatus     []Aggregation `json:"resolution_status_code" validate:"required"`
	Panel                []Aggregation `json:"panel_code" validate:"required"`
	LifeStatus           []Aggregation `json:"life_status_code" validate:"required"`
	CaseCategory         []Aggregation `json:"case_category_code" validate:"required"`
	CaseType             []Aggregation `json:"case_type_code" validate:"required"`
}
