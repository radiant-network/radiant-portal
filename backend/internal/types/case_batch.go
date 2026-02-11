package types

const CaseBatchType = "case"

type CaseBatch struct {
	SubmitterCaseId            string                           `json:"submitter_case_id,omitempty" toml:"submitter_case_id"`
	Type                       string                           `json:"type" toml:"type" binding:"required,oneof=germline somatic"`
	StatusCode                 string                           `json:"status_code" toml:"status_code" binding:"required"`
	ProjectCode                string                           `json:"project_code" toml:"project_code" binding:"required"`
	DiagnosticLabCode          string                           `json:"diagnostic_lab_code,omitempty" toml:"diagnostic_lab_code"`
	PrimaryConditionCodeSystem string                           `json:"primary_condition_code_system,omitempty" toml:"primary_condition_code_system"`
	PrimaryConditionValue      string                           `json:"primary_condition_value,omitempty" toml:"primary_condition_value"`
	PriorityCode               string                           `json:"priority_code,omitempty" toml:"priority_code"`
	CategoryCode               string                           `json:"category_code" toml:"category_code" binding:"required,oneof=prenatal postnatal"`
	AnalysisCode               string                           `json:"analysis_code" toml:"analysis_code" binding:"required"`
	ResolutionStatusCode       string                           `json:"resolution_status_code,omitempty" toml:"resolution_status_code"`
	Note                       string                           `json:"note,omitempty" toml:"note"`
	OrderingPhysician          string                           `json:"ordering_physician,omitempty" toml:"ordering_physician"`
	OrderingOrganizationCode   string                           `json:"ordering_organization_code,omitempty" toml:"ordering_organization_code"`
	Patients                   []*CasePatientBatch              `json:"patients" toml:"patients" binding:"required,min=1,dive,required"`
	SequencingExperiments      []*CaseSequencingExperimentBatch `json:"sequencing_experiments" toml:"sequencing_experiments" binding:"required,min=1,dive,required"`
	Tasks                      []*CaseTaskBatch                 `json:"tasks" toml:"tasks" binding:"required,dive,required"`
}

type CasePatientBatch struct {
	AffectedStatusCode      string                         `json:"affected_status_code" toml:"affected_status_code" binding:"required,oneof=affected non_affected unknown"`
	FamilyHistory           []*FamilyHistoryBatch          `json:"family_history,omitempty" toml:"family_history" binding:"dive"`
	ObservationsCategorical []*ObservationCategoricalBatch `json:"observations_categorical,omitempty" toml:"observations_categorical" binding:"dive"`
	ObservationsText        []*ObservationTextBatch        `json:"observations_text,omitempty" toml:"observations_text" binding:"dive"`
	SubmitterPatientId      string                         `json:"submitter_patient_id" toml:"submitter_patient_id" binding:"required"`
	PatientOrganizationCode string                         `json:"patient_organization_code" toml:"patient_organization_code" binding:"required"`
	RelationToProbandCode   string                         `json:"relation_to_proband_code" toml:"relation_to_proband_code" binding:"required,oneof=mother father brother sister sibling proband"`
}

type FamilyHistoryBatch struct {
	FamilyMemberCode string `json:"family_member_code" toml:"family_member_code" binding:"required"`
	Condition        string `json:"condition" toml:"condition" binding:"required"`
}

type ObservationCategoricalBatch struct {
	Code               string `json:"code" toml:"code" binding:"required"`
	System             string `json:"system" toml:"system" binding:"required"`
	Value              string `json:"value" toml:"value" binding:"required"`
	OnsetCode          string `json:"onset_code" toml:"onset_code" binding:"required"`
	InterpretationCode string `json:"interpretation_code,omitempty" toml:"interpretation_code" binding:"oneof=positive negative"`
	Note               string `json:"note,omitempty" toml:"note"`
}

type ObservationTextBatch struct {
	Code  string `json:"code" toml:"code" binding:"required"`
	Value string `json:"value" toml:"value" binding:"required"`
}

type CaseSequencingExperimentBatch struct {
	Aliquot                string `json:"aliquot" toml:"aliquot" binding:"required"`
	SampleOrganizationCode string `json:"sample_organization_code" toml:"sample_organization_code" binding:"required"`
	SubmitterSampleId      string `json:"submitter_sample_id" toml:"submitter_sample_id" binding:"required"`
}

type CaseTaskBatch struct {
	TypeCode        string                 `json:"type_code" toml:"type_code" binding:"required"`
	Aliquots        []string               `json:"aliquots" toml:"aliquots" binding:"required"`
	InputDocuments  []*InputDocumentBatch  `json:"input_documents,omitempty" toml:"input_documents" binding:"dive"`
	OutputDocuments []*OutputDocumentBatch `json:"output_documents" toml:"output_documents" binding:"required,dive"`
	PipelineName    string                 `json:"pipeline_name,omitempty" toml:"pipeline_name"`
	PipelineVersion string                 `json:"pipeline_version" toml:"pipeline_version" binding:"required"`
	GenomeBuild     string                 `json:"genome_build,omitempty" toml:"genome_build"`
}

type InputDocumentBatch struct {
	Url string `json:"url" toml:"url" binding:"required"`
}

type OutputDocumentBatch struct {
	DataCategoryCode string `json:"data_category_code" toml:"data_category_code" binding:"required"`
	DataTypeCode     string `json:"data_type_code" toml:"data_type_code" binding:"required"`
	FormatCode       string `json:"format_code" toml:"format_code" binding:"required"`
	Hash             string `json:"hash,omitempty" toml:"hash"`
	Name             string `json:"name" toml:"name" binding:"required"`
	Size             *int64 `json:"size" toml:"size" binding:"required"`
	Url              string `json:"url" toml:"url" binding:"required"`
}

type CreateCaseBatchBody struct {
	Cases []*CaseBatch `json:"cases" toml:"cases" binding:"required,min=1,dive,required"`
}
