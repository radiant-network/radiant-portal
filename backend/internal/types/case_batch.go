package types

const (
	CreateCaseBatchType = "create_case"
	PatchCaseBatchType  = "patch_case"
	UpdateCaseBatchType = "update_case"
)

const (
	ObsCodeAncestry      = "ancestry"
	ObsCodeConsanguinity = "consanguinity"
	ObsCodeExam          = "exam"
)

func ObservationRequiresOnsetAndInterpretation(code string) bool {
	switch code {
	case ObsCodeAncestry, ObsCodeConsanguinity:
		return false
	default:
		return true
	}
}

type CaseBatch struct {
	SubmitterCaseId            string                           `json:"submitter_case_id,omitempty" toml:"submitter_case_id"`
	Type                       string                           `json:"type" toml:"type" binding:"required,oneof=germline somatic"`
	StatusCode                 string                           `json:"status_code" toml:"status_code" binding:"required"`
	ProjectCode                string                           `json:"project_code" toml:"project_code" binding:"required"`
	DiagnosticLabCode          string                           `json:"diagnostic_lab_code" toml:"diagnostic_lab_code" binding:"required"`
	PrimaryConditionCodeSystem string                           `json:"primary_condition_code_system,omitempty" toml:"primary_condition_code_system"`
	PrimaryConditionValue      string                           `json:"primary_condition_value,omitempty" toml:"primary_condition_value"`
	PriorityCode               string                           `json:"priority_code,omitempty" toml:"priority_code"`
	CategoryCode               string                           `json:"category_code" toml:"category_code" binding:"required,oneof=prenatal postnatal"`
	AnalysisCode               string                           `json:"analysis_code" toml:"analysis_code" binding:"required"`
	ResolutionStatusCode       string                           `json:"resolution_status_code,omitempty" toml:"resolution_status_code"`
	Note                       string                           `json:"note,omitempty" toml:"note"`
	OrderingPhysician          string                           `json:"ordering_physician,omitempty" toml:"ordering_physician"`
	Supervisor                 string                           `json:"supervisor,omitempty" toml:"supervisor"`
	OrderingOrganizationCode   string                           `json:"ordering_organization_code" toml:"ordering_organization_code" binding:"required"`
	Patients                   []*CasePatientBatch              `json:"patients" toml:"patients" binding:"required,min=1,dive,required"`
	Fetuses                    []*CaseFetusBatch                `json:"fetuses,omitempty" toml:"fetuses" binding:"omitempty,dive,notnull"`
	SequencingExperiments      []*CaseSequencingExperimentBatch `json:"sequencing_experiments,omitempty" toml:"sequencing_experiments" binding:"omitempty,dive,required"`
	// Optional. Sequencing services ordered for this case's members, delivered or not.
	SequencingRequests []*CaseSequencingRequestBatch `json:"sequencing_requests,omitempty" toml:"sequencing_requests" binding:"omitempty,dive"` // no `required` in the dive: swaggo would then mark the whole field required
	Tasks              []*CaseTaskBatch              `json:"tasks" toml:"tasks" binding:"required,dive,required"`
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

// A case's fetuses always belong to its proband, so — unlike CasePatientBatch — no mother
// reference or relation-to-proband is carried here.
type CaseFetusBatch struct {
	// SubmitterFetusId identifies the fetus across batches, scoped to its mother. Required, like
	// submitter_patient_id: without it an update could not resolve which fetus to modify and would
	// have to delete and recreate — which sample.fetus_id forbids once a sample is attached.
	SubmitterFetusId        TrimmedString                  `json:"submitter_fetus_id" toml:"submitter_fetus_id" binding:"required"`
	SexCode                 string                         `json:"sex_code" toml:"sex_code" binding:"required,oneof=male female unknown"`
	LifeStatusCode          string                         `json:"life_status_code" toml:"life_status_code" binding:"required,oneof=alive deceased unknown"`
	AffectedStatusCode      string                         `json:"affected_status_code" toml:"affected_status_code" binding:"required,oneof=affected non_affected unknown"`
	LastMenstrualPeriod     *DateISO8601                   `json:"last_menstrual_period,omitempty" toml:"last_menstrual_period" swaggertype:"string" format:"date" example:"2026-02-01"`
	EstimatedDueDate        *DateISO8601                   `json:"estimated_due_date,omitempty" toml:"estimated_due_date" swaggertype:"string" format:"date" example:"2026-11-08"`
	ObservationsCategorical []*ObservationCategoricalBatch `json:"observations_categorical,omitempty" toml:"observations_categorical" binding:"dive,notnull"`
	ObservationsText        []*ObservationTextBatch        `json:"observations_text,omitempty" toml:"observations_text" binding:"dive,notnull"`
}

type FamilyHistoryBatch struct {
	FamilyMemberCode string `json:"family_member_code" toml:"family_member_code" binding:"required"`
	Condition        string `json:"condition" toml:"condition" binding:"required"`
}

type ObservationCategoricalBatch struct {
	Code               string `json:"code" toml:"code" binding:"required"`
	System             string `json:"system" toml:"system" binding:"required"`
	Value              string `json:"value" toml:"value" binding:"required"`
	OnsetCode          string `json:"onset_code,omitempty" toml:"onset_code"`
	InterpretationCode string `json:"interpretation_code,omitempty" toml:"interpretation_code" binding:"omitempty,oneof=positive negative abnormal normal"`
	Note               string `json:"note,omitempty" toml:"note"`
	ExamCode           string `json:"exam_code,omitempty" toml:"exam_code"`
}

type ObservationTextBatch struct {
	Code               string `json:"code" toml:"code" binding:"required"`
	Value              string `json:"value" toml:"value" binding:"required"`
	ExamCode           string `json:"exam_code,omitempty" toml:"exam_code"`
	InterpretationCode string `json:"interpretation_code,omitempty" toml:"interpretation_code" binding:"omitempty,oneof=positive negative abnormal normal"`
}

// This struct is shared by the create, patch and update paths, so
// SubmitterSequencingRequestId makes the delivery loop available on all three endpoints.
type CaseSequencingExperimentBatch struct {
	Aliquot                string `json:"aliquot" toml:"aliquot" binding:"required"`
	SampleOrganizationCode string `json:"sample_organization_code" toml:"sample_organization_code" binding:"required"`
	SubmitterSampleId      string `json:"submitter_sample_id" toml:"submitter_sample_id" binding:"required"`
	// Optional. The sequencing request of the same case this experiment fulfills, if any.
	SubmitterSequencingRequestId string `json:"submitter_sequencing_request_id,omitempty" toml:"submitter_sequencing_request_id"`
}

// CaseSequencingRequestBatch is a sequencing service ordered for a case member. No requester
// fields: they belong to the case and are read by join through the mandatory case_id.
type CaseSequencingRequestBatch struct {
	SubmitterSequencingRequestId string `json:"submitter_sequencing_request_id" toml:"submitter_sequencing_request_id" binding:"required"`
	ServiceCode                  string `json:"service_code" toml:"service_code" binding:"required"`
	SubmitterPatientId           string `json:"submitter_patient_id" toml:"submitter_patient_id" binding:"required"`
	PatientOrganizationCode      string `json:"patient_organization_code" toml:"patient_organization_code" binding:"required"`
	StatusCode                   string `json:"status_code" toml:"status_code" binding:"required"`
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
	Size             *int64 `json:"size" toml:"size" binding:"required" swaggertype:"integer" format:"int64"`
	Url              string `json:"url" toml:"url" binding:"required"`
}

type CreateCaseBatchBody struct {
	Cases []*CaseBatch `json:"cases" toml:"cases" binding:"required,min=1,dive,required"`
}

type CaseBatchPatch struct {
	ProjectCode           string                           `json:"project_code" toml:"project_code" binding:"required"`
	SubmitterCaseId       string                           `json:"submitter_case_id" toml:"submitter_case_id" binding:"required"`
	DiagnosticLabCode     string                           `json:"diagnostic_lab_code,omitempty" toml:"diagnostic_lab_code"`
	SequencingExperiments []*CaseSequencingExperimentBatch `json:"sequencing_experiments,omitempty" toml:"sequencing_experiments" binding:"omitempty,dive"`
	Tasks                 []*CaseTaskBatch                 `json:"tasks,omitempty" toml:"tasks" binding:"omitempty,dive"`
}

type PatchCaseBatchBody struct {
	Cases []*CaseBatchPatch `json:"cases" toml:"cases" binding:"required,min=1,dive,required"`
}

// UpdateCaseBatch replaces a case's scalar fields and clinical patient data (family,
// observations, family history). SequencingExperiments and Tasks are merge-if-present: when
// the payload carries them they are attached like the POST path does; when omitted/empty they
// are left untouched (never cleared) — see PutCaseBatchHandler.
type UpdateCaseBatch struct {
	ProjectCode                string              `json:"project_code" toml:"project_code" binding:"required"`
	SubmitterCaseId            string              `json:"submitter_case_id" toml:"submitter_case_id" binding:"required"`
	Type                       string              `json:"type" toml:"type" binding:"required,oneof=germline somatic"`
	StatusCode                 string              `json:"status_code" toml:"status_code" binding:"required"`
	DiagnosticLabCode          string              `json:"diagnostic_lab_code" toml:"diagnostic_lab_code" binding:"required"`
	PrimaryConditionCodeSystem string              `json:"primary_condition_code_system,omitempty" toml:"primary_condition_code_system"`
	PrimaryConditionValue      string              `json:"primary_condition_value,omitempty" toml:"primary_condition_value"`
	PriorityCode               string              `json:"priority_code,omitempty" toml:"priority_code"`
	CategoryCode               string              `json:"category_code" toml:"category_code" binding:"required,oneof=prenatal postnatal"`
	AnalysisCode               string              `json:"analysis_code" toml:"analysis_code" binding:"required"`
	ResolutionStatusCode       string              `json:"resolution_status_code,omitempty" toml:"resolution_status_code"`
	Note                       string              `json:"note,omitempty" toml:"note"`
	OrderingOrganizationCode   string              `json:"ordering_organization_code" toml:"ordering_organization_code" binding:"required"`
	OrderingPhysician          string              `json:"ordering_physician,omitempty" toml:"ordering_physician"`
	Supervisor                 string              `json:"supervisor,omitempty" toml:"supervisor"`
	Patients                   []*CasePatientBatch `json:"patients" toml:"patients" binding:"required,min=1,dive,required"`
	// Replaced like the clinical children above, and matched by submitter_fetus_id: a fetus already
	// on the case is updated in place, a new key is created, and a key the payload drops is deleted
	// — refused when a sample still points at it.
	Fetuses               []*CaseFetusBatch                `json:"fetuses,omitempty" toml:"fetuses" binding:"omitempty,dive,notnull"`
	SequencingExperiments []*CaseSequencingExperimentBatch `json:"sequencing_experiments,omitempty" toml:"sequencing_experiments" binding:"omitempty,dive"`
	SequencingRequests    []*CaseSequencingRequestBatch    `json:"sequencing_requests,omitempty" toml:"sequencing_requests" binding:"omitempty,dive"`
	Tasks                 []*CaseTaskBatch                 `json:"tasks,omitempty" toml:"tasks" binding:"omitempty,dive"`
}

type UpdateCaseBatchBody struct {
	Cases []*UpdateCaseBatch `json:"cases" toml:"cases" binding:"required,min=1,dive,required"`
}
