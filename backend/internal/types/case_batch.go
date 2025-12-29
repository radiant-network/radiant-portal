package types

const CaseBatchType = "case"

type CaseBatch struct {
	SubmitterCaseId            string                           `json:"submitter_case_id" binding:"required"`
	Type                       string                           `json:"type" binding:"required,oneof=germline somatic"`
	StatusCode                 string                           `json:"status_code" binding:"required"`
	ProjectCode                string                           `json:"project_code" binding:"required"`
	DiagnosticLabCode          string                           `json:"diagnostic_lab_code,omitempty"`
	PrimaryConditionCodeSystem string                           `json:"primary_condition_code_system,omitempty"`
	PrimaryConditionValue      string                           `json:"primary_condition_value,omitempty"`
	PriorityCode               string                           `json:"priority_code,omitempty"`
	CategoryCode               string                           `json:"category_code" binding:"required,oneof=prenatal postnatal"`
	AnalysisCode               string                           `json:"analysis_code,omitempty"`
	ResolutionStatusCode       string                           `json:"resolution_status_code,omitempty"`
	Note                       string                           `json:"note,omitempty"`
	OrderingPhysician          string                           `json:"ordering_physician,omitempty"`
	OrderingOrganizationCode   string                           `json:"ordering_organization_code,omitempty"`
	Patients                   []*CasePatientBatch              `json:"patients" binding:"required,min=1,dive,required"`
	SequencingExperiments      []*CaseSequencingExperimentBatch `json:"sequencing_experiments" binding:"required,min=1,dive,required"`
	Tasks                      []*CaseTaskBatch                 `json:"tasks" binding:"required,min=1,dive,required"`
}

type CasePatientBatch struct {
	AffectedStatusCode      string                         `json:"affected_status_code" binding:"required,oneof=affected unaffected unknown"`
	FamilyHistory           []*FamilyHistoryBatch          `json:"family_history,omitempty" binding:"dive"`           // TODO: should we have min=1 here?
	ObservationsCategorical []*ObservationCategoricalBatch `json:"observations_categorical,omitempty" binding:"dive"` // TODO: should we have min=1 here?
	ObservationsText        []*ObservationTextBatch        `json:"observations_text,omitempty" binding:"dive"`        // TODO: should we have min=1 here?
	SubmitterPatientId      string                         `json:"submitter_patient_id" binding:"required"`
	PatientOrganizationCode string                         `json:"patient_organization_code" binding:"required"`
	RelationToProbandCode   string                         `json:"relation_to_proband_code" binding:"required,oneof=mother father brother sister sibling proband"`
}

type FamilyHistoryBatch struct {
	FamilyMemberCode string `json:"family_member_code" binding:"required"`
	Condition        string `json:"condition" binding:"required"`
}

type ObservationCategoricalBatch struct {
	Code               string `json:"code" binding:"required"`
	System             string `json:"system" binding:"required"`
	Value              string `json:"value" binding:"required"`
	OnsetCode          string `json:"onset_code" binding:"required"`
	InterpretationCode string `json:"interpretation_code" binding:"required,oneof=positive negative"` // TODO: validate interpretation codes / should it be optional?
	Note               string `json:"note,omitempty"`
}

type ObservationTextBatch struct {
	Code string `json:"code" binding:"required"`
	Note string `json:"note" binding:"required"`
}

type CaseSequencingExperimentBatch struct {
	Aliquot                string `json:"aliquot" binding:"required"`
	SampleOrganizationCode string `json:"sample_organization_code" binding:"required"`
	SubmitterSampleId      string `json:"submitter_sample_id" binding:"required"`
}

type CaseTaskBatch struct {
	TypeCode        string                 `json:"type_code" binding:"required"`
	Aliquot         string                 `json:"aliquot,omitempty"`
	InputDocuments  []*InputDocumentBatch  `json:"input_documents,omitempty" binding:"dive"`
	OutputDocuments []*OutputDocumentBatch `json:"output_documents" binding:"required,dive"`
	PipelineName    string                 `json:"pipeline_name,omitempty"`
	PipelineVersion string                 `json:"pipeline_version" binding:"required"`
	GenomeBuild     string                 `json:"genome_build,omitempty"`
}

type InputDocumentBatch struct {
	Url string `json:"url" binding:"required"`
}

type OutputDocumentBatch struct {
	DataCategoryCode string `json:"data_category_code" binding:"required"`
	DataTypeCode     string `json:"data_type_code" binding:"required"`
	FormatCode       string `json:"format_code" binding:"required"`
	Hash             string `json:"hash,omitempty"`
	Name             string `json:"name" binding:"required"`
	Size             int64  `json:"size" binding:"required"`
	Url              string `json:"url" binding:"required"`
}

// CreateCaseBatchBody represents the body required to create a case batch
// @Description CreateCaseBatchBody represents the body required to create a case batch
type CreateCaseBatchBody struct {
	Cases []*CaseBatch `json:"cases" binding:"required,min=1,dive,required"`
} //@Name CreateCaseBatchBody
