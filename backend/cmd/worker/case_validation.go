package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"regexp"
	"slices"
	"strings"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

const TextMaxLength = 100
const NoteMaxLength = 1000

// Regular expressions for external IDs (Ex: SubmitterPatientId, JHN).
const ExternalIdRegexp = `^[a-zA-Z0-9\- ._'À-ÿ]*$`

var ExternalIdRegexpCompiled = regexp.MustCompile(ExternalIdRegexp)

// FamilyMemberCodeRegExp defines a regular expression pattern that matches strings containing
// uppercase and lowercase letters (A-Z, a-z) and hyphens.
const FamilyMemberCodeRegExp = `^[A-Za-z\- ]+$`

var FamilyMemberCodeRegExpCompiled = regexp.MustCompile(FamilyMemberCodeRegExp)

// TextRegExp defines a regular expression pattern that matches strings containing
// alphanumeric characters (A-Z, a-z, 0-9), hyphens, underscores, periods, commas, colons, and spaces.
const TextRegExp = `^[A-Za-z0-9\-\_\.\,\: ]+$`

var TextRegExpCompiled = regexp.MustCompile(TextRegExp)

const (
	CaseAlreadyExists               = "CASE-001"
	CaseInvalidField                = "CASE-002"
	CaseUnknownProject              = "CASE-003"
	CaseUnknownDiagnosticLab        = "CASE-004"
	CaseUnknownAnalysisCode         = "CASE-005"
	CaseUnknownOrderingOrganization = "CASE-006"
	CaseInvalidNumberOfProbands     = "CASE-007"
	CaseDuplicatePatient            = "CASE-008"
	CaseSeqExpNotFoundForPatient    = "CASE-009"
	CaseInvalidSeqExpForType        = "CASE-010"
	CaseIdenticalInBatch            = "CASE-011"
	CaseNotFoundForAttach           = "CASE-012"
)

// Patients error codes
const (
	PatientInvalidField = "PATIENT-004"
	PatientNotFound     = "PATIENT-006"
)

// Observations error codes
const (
	ObservationInvalidField = "OBS-001"
)

// Sequencing Experiments error codes
const (
	SequencingExperimentNotFound = "SEQ-007"
)

// Tasks error codes
const (
	TaskInvalidField                            = "TASK-001"
	TaskUnknownAliquot                          = "TASK-002"
	TaskMissingInputDocuments                   = "TASK-003"
	TaskMissingOutputDocuments                  = "TASK-004"
	TaskInputDocumentNotFound                   = "TASK-005"
	TaskInputDocumentNotInSequencingExperiments = "TASK-006"
	TaskTypeDoesNotSupportMultipleAliquots      = "TASK-007"
)

// Documents error codes
const (
	DocumentInvalidField                     = "DOCUMENT-001"
	DocumentNotFoundAtURL                    = "DOCUMENT-002"
	DocumentDuplicateInDB                    = "DOCUMENT-003"
	DocumentDuplicateWithDifferentFieldValue = "DOCUMENT-004"
	DocumentAlreadyOutputOfAnotherTask       = "DOCUMENT-005"
	DocumentSizeMismatch                     = "DOCUMENT-006"
	DocumentHashMismatch                     = "DOCUMENT-007"
	DocumentDuplicateInBatch                 = "DOCUMENT-008"
	DocumentNameInconsistency                = "DOCUMENT-009"
)

const RelationshipProbandCode = "proband"

var CaseRelatedTaskTypes = map[string]struct{}{
	"family_variant_calling":            {},
	"tumor_only_variant_calling":        {},
	types.RadiantGermlineAnnotationTask: {},
	types.RadiantSomaticAnnotationTask:  {},
	types.ExomiserTaskTypeCode:          {},
}

var RequiresInputDocumentsTaskTypes = map[string]struct{}{
	"family_variant_calling":            {},
	"somatic_variant_calling":           {},
	"tumor_only_variant_calling":        {},
	types.RadiantGermlineAnnotationTask: {},
	types.RadiantSomaticAnnotationTask:  {},
	types.ExomiserTaskTypeCode:          {},
}

var SingleAliquotTaskTypes = map[string]struct{}{
	types.ExomiserTaskTypeCode:                        {},
	types.AlignmentGermlineVariantCallingTaskTypeCode: {},
	types.AlignmentSomaticVariantCallingTaskTypeCode:  {},
}

type CaseKey struct {
	ProjectCode     string
	SubmitterCaseID string
}

type DocumentRelation struct {
	TaskID int
	Type   string
}

type StorageContext struct {
	CasesRepo         *repository.CasesRepository
	DocRepo           *repository.DocumentsRepository
	ObsCatRepo        *repository.ObservationCategoricalRepository
	ObsStringRepo     *repository.ObservationStringRepository
	FamilyHistoryRepo *repository.FamilyHistoryRepository
	FamilyRepo        *repository.FamilyRepository
	TaskRepo          *repository.TaskRepository
	TenantCode        string
}

func NewStorageContext(db *gorm.DB) *StorageContext {
	return &StorageContext{
		CasesRepo:         repository.NewCasesRepository(db),
		DocRepo:           repository.NewDocumentsRepository(db),
		ObsCatRepo:        repository.NewObservationCategoricalRepository(db),
		ObsStringRepo:     repository.NewObservationStringRepository(db),
		FamilyHistoryRepo: repository.NewFamilyHistoryRepository(db),
		FamilyRepo:        repository.NewFamilyRepository(db),
		TaskRepo:          repository.NewTaskRepository(db),
	}
}

type CaseValidationRecord struct {
	batchval.BaseValidationRecord
	Case                       types.CaseBatch
	CaseID                     *int
	ProjectID                  *int
	SubmitterCaseID            string
	AnalysisCatalogID          *int
	OrderingOrganizationExists bool
	DiagnosisLabExists         bool

	// Codes
	StatusCodes                       []string
	ObservationCodes                  []string
	OnsetCodes                        []string
	InterpretationCodes               []string
	AncestryCodes                     []string
	ConsanguinityCodes                []string
	TaskTypeCodes                     []string
	ResolutionStatusCodes             []string
	PriorityCodes                     []string
	CategoryCodes                     []string
	PatientAffectedStatusCodes        []string
	PatientRelationshipToProbandCodes []string
	DocumentDataCategoryCodes         []string
	DocumentDataTypeCodes             []string
	DocumentFormatCodes               []string

	OutputDocuments map[string]struct{}

	// Necessary to persist the case
	Patients              map[batchval.PatientKey]*types.Patient
	SequencingExperiments map[int]*types.SequencingExperiment
	Documents             map[string]*types.Document
	DocumentsInTasks      map[string][]*DocumentRelation
	TaskContexts          map[int][]*types.TaskContext
}

func NewCaseValidationRecord(ctx *batchval.BatchValidationContext, cache *batchval.BatchValidationCache, c types.CaseBatch, index int) *CaseValidationRecord {
	return &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{
			Context:      ctx,
			Cache:        cache,
			Index:        index,
			ResourceType: types.CreateCaseBatchType,
		},
		Case:                  c,
		OutputDocuments:       make(map[string]struct{}),
		Patients:              make(map[batchval.PatientKey]*types.Patient),
		SequencingExperiments: make(map[int]*types.SequencingExperiment),
		Documents:             make(map[string]*types.Document),
		DocumentsInTasks:      make(map[string][]*DocumentRelation),
		TaskContexts:          make(map[int][]*types.TaskContext),
	}
}

func (r *CaseValidationRecord) GetBase() *batchval.BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *CaseValidationRecord) getProbandFromPatients() (*types.Patient, error) {
	for _, p := range r.Case.Patients {
		if p.RelationToProbandCode != RelationshipProbandCode {
			continue
		}

		key := batchval.PatientKey{OrganizationCode: p.PatientOrganizationCode, SubmitterPatientId: p.SubmitterPatientId}
		if patient, ok := r.Patients[key]; ok {
			return patient, nil
		}
		return nil, fmt.Errorf("failed to find proband patient %q for create_case %d", key, r.Index)
	}
	return nil, nil
}

func (r *CaseValidationRecord) fetchStatusCodes(ctx context.Context) error {
	statusCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetStatus)
	if err != nil {
		return fmt.Errorf("error retrieving status codes: %v", err)
	}
	r.StatusCodes = statusCodes
	return nil
}

func (r *CaseValidationRecord) fetchObservationCodes(ctx context.Context) error {
	observationCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetObservation)
	if err != nil {
		return fmt.Errorf("error retrieving observation codes: %v", err)
	}
	r.ObservationCodes = observationCodes
	return nil
}

func (r *CaseValidationRecord) fetchOnsetCodes(ctx context.Context) error {
	onsetCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetOnset)
	if err != nil {
		return fmt.Errorf("error retrieving onset codes: %v", err)
	}
	r.OnsetCodes = onsetCodes
	return nil
}

func (r *CaseValidationRecord) fetchInterpretationCodes(ctx context.Context) error {
	interpretationCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetObservationInterpretation)
	if err != nil {
		return fmt.Errorf("error retrieving interpretation codes: %v", err)
	}
	r.InterpretationCodes = interpretationCodes
	return nil
}

func (r *CaseValidationRecord) fetchAncestryCodes(ctx context.Context) error {
	ancestryCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetAncestry)
	if err != nil {
		return fmt.Errorf("error retrieving ancestry codes: %v", err)
	}
	r.AncestryCodes = ancestryCodes
	return nil
}

func (r *CaseValidationRecord) fetchConsanguinityCodes(ctx context.Context) error {
	consanguinityCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetConsanguinity)
	if err != nil {
		return fmt.Errorf("error retrieving consanguinity codes: %v", err)
	}
	r.ConsanguinityCodes = consanguinityCodes
	return nil
}

func (r *CaseValidationRecord) fetchResolutionStatusCodes(ctx context.Context) error {
	rsCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetResolutionStatus)
	if err != nil {
		return fmt.Errorf("error retrieving resolution status codes: %v", err)
	}
	r.ResolutionStatusCodes = rsCodes
	return nil
}

func (r *CaseValidationRecord) fetchPriorityCodes(ctx context.Context) error {
	priorityCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetPriority)
	if err != nil {
		return fmt.Errorf("error retrieving priority codes: %v", err)
	}
	r.PriorityCodes = priorityCodes
	return nil
}

func (r *CaseValidationRecord) fetchCategoryCodes(ctx context.Context) error {
	categoryCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetCaseCategory)
	if err != nil {
		return fmt.Errorf("error retrieving category codes: %v", err)
	}
	r.CategoryCodes = categoryCodes
	return nil
}

func (r *CaseValidationRecord) fetchPatientCodes(ctx context.Context) error {
	affectedStatusCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetAffectedStatus)
	if err != nil {
		return fmt.Errorf("error retrieving patient affected status codes: %v", err)
	}
	r.PatientAffectedStatusCodes = affectedStatusCodes

	relationshipToProbandCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetFamilyRelationship)
	if err != nil {
		return fmt.Errorf("error retrieving patient relationship to proband codes: %v", err)
	}
	r.PatientRelationshipToProbandCodes = relationshipToProbandCodes
	return nil
}

func (r *CaseValidationRecord) fetchDocumentCodes(ctx context.Context) error {
	dataCategoryCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetDataCategory)
	if err != nil {
		return fmt.Errorf("error retrieving document data category codes: %v", err)
	}
	r.DocumentDataCategoryCodes = dataCategoryCodes

	dataTypeCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetDataType)
	if err != nil {
		return fmt.Errorf("error retrieving document data type codes: %v", err)
	}
	r.DocumentDataTypeCodes = dataTypeCodes

	formatCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetFileFormat)
	if err != nil {
		return fmt.Errorf("error retrieving document format codes: %v", err)
	}
	r.DocumentFormatCodes = formatCodes

	return nil
}

func (r *CaseValidationRecord) fetchCodeInfos(ctx context.Context) error {
	if err := r.fetchStatusCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve status codes: %w", err)
	}
	if err := r.fetchObservationCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve observation codes: %w", err)
	}
	if err := r.fetchOnsetCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve onset codes: %w", err)
	}
	if err := r.fetchInterpretationCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve interpretation codes: %w", err)
	}
	if err := r.fetchAncestryCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve ancestry codes: %w", err)
	}
	if err := r.fetchConsanguinityCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve consanguinity codes: %w", err)
	}
	if err := r.fetchTaskTypeCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve task type codes: %w", err)
	}
	if err := r.fetchResolutionStatusCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve resolution status codes: %w", err)
	}
	if err := r.fetchPriorityCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve priority codes: %w", err)
	}
	if err := r.fetchCategoryCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve category codes: %w", err)
	}
	if err := r.fetchPatientCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve patient codes: %w", err)
	}
	if err := r.fetchDocumentCodes(ctx); err != nil {
		return fmt.Errorf("failed to retrieve document codes: %w", err)
	}
	return nil
}

func (r *CaseValidationRecord) fetchTaskTypeCodes(ctx context.Context) error {
	taskTypeCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetTaskType)
	if err != nil {
		return fmt.Errorf("error retrieving task type codes: %v", err)
	}
	r.TaskTypeCodes = taskTypeCodes
	return nil
}

func (r *CaseValidationRecord) fetchProject(ctx context.Context) error {
	p, err := r.Cache.GetProjectByCode(ctx, r.Case.ProjectCode)
	if err != nil {
		return fmt.Errorf("get project by code %q: %w", r.Case.ProjectCode, err)
	}
	if p != nil {
		r.ProjectID = &p.ID
	}
	return nil
}

func (r *CaseValidationRecord) fetchAnalysisCatalog(ctx context.Context) error {
	a, err := r.Cache.GetCaseAnalysisCatalogByCode(ctx, r.Case.AnalysisCode)
	if err != nil {
		return fmt.Errorf("get analysis catalog by code %q: %w", r.Case.AnalysisCode, err)
	}
	if a != nil {
		r.AnalysisCatalogID = &a.ID
	}
	return nil
}

// resolveOrganizations records whether the case's ordering organization and
// diagnosis lab codes refer to existing organizations. The codes themselves
// come straight from the batch payload; this only records existence so
// validateCase can emit a friendly error before the (code, tenant_code) FK
// would reject the insert.
func (r *CaseValidationRecord) resolveOrganizations(ctx context.Context) error {
	if r.Case.OrderingOrganizationCode != "" {
		org, err := r.Cache.GetOrganizationByCode(ctx, r.Case.OrderingOrganizationCode)
		if err != nil {
			return fmt.Errorf("get organization by code %q: %w", r.Case.OrderingOrganizationCode, err)
		}
		r.OrderingOrganizationExists = org != nil
	}

	if r.Case.DiagnosticLabCode != "" {
		diagnosisLabOrg, err := r.Cache.GetOrganizationByCode(ctx, r.Case.DiagnosticLabCode)
		if err != nil {
			return fmt.Errorf("get organization by code %q: %w", r.Case.DiagnosticLabCode, err)
		}
		r.DiagnosisLabExists = diagnosisLabOrg != nil
	}
	return nil
}

func (r *CaseValidationRecord) fetchPatients(ctx context.Context) error {
	for _, cp := range r.Case.Patients {
		patient, err := r.Cache.GetPatientByOrgCodeAndSubmitterPatientId(ctx, cp.PatientOrganizationCode, cp.SubmitterPatientId)
		if err != nil {
			return fmt.Errorf("failed to get patient by org code %q and submitter patient id %q: %w", cp.PatientOrganizationCode, cp.SubmitterPatientId, err)
		}

		key := batchval.PatientKey{OrganizationCode: cp.PatientOrganizationCode, SubmitterPatientId: cp.SubmitterPatientId}
		if patient != nil {
			r.Patients[key] = patient
		}
	}
	return nil
}

func (r *CaseValidationRecord) fetchFromSequencingExperiments(ctx context.Context) error {
	for _, se := range r.Case.SequencingExperiments {
		seqExp, err := r.Cache.GetSequencingExperimentByAliquotAndSubmitterSample(ctx, se.Aliquot, se.SubmitterSampleId, se.SampleOrganizationCode)
		if err != nil {
			return fmt.Errorf("failed to get sequencing experiment: %w", err)
		}

		if seqExp != nil {
			if _, exists := r.SequencingExperiments[seqExp.ID]; !exists {
				r.SequencingExperiments[seqExp.ID] = seqExp
			}
		}
	}
	return nil
}

func (cr *CaseValidationRecord) fetchSequencingExperimentsInTask(ctx context.Context, task *types.CaseTaskBatch) error {
	for _, aliquot := range task.Aliquots {
		seqs, err := cr.Cache.GetSequencingExperimentByAliquot(ctx, aliquot)
		if err != nil {
			return fmt.Errorf("failed to get sequencing experiment by aliquot %q: %w", aliquot, err)
		}

		for i := range seqs {
			se := seqs[i]
			if _, exists := cr.SequencingExperiments[se.ID]; !exists {
				cr.SequencingExperiments[se.ID] = &se
			}
		}
	}
	return nil
}

func (cr *CaseValidationRecord) fetchTaskContextFromSequencingExperiments(ctx context.Context) error {
	for _, se := range cr.SequencingExperiments {
		tcs, err := cr.Cache.GetTaskContextBySequencingExperimentId(ctx, se.ID)
		if err != nil {
			return err
		}
		for _, tc := range tcs {
			cr.TaskContexts[tc.TaskID] = append(cr.TaskContexts[tc.TaskID], tc)
		}
	}
	return nil
}

func (cr *CaseValidationRecord) fetchDocumentsFromURLs(ctx context.Context, urls []string) error {
	for _, url := range urls {
		d, err := cr.Cache.GetDocumentByUrl(ctx, url)
		if err != nil {
			return fmt.Errorf("failed to get document by url %q: %w", url, err)
		}
		if d == nil {
			continue
		}

		cr.Documents[url] = d
		docs, err := cr.Cache.GetTaskHasDocumentByDocumentId(ctx, d.ID)
		if err != nil {
			return fmt.Errorf("failed to get task has document by document id %d: %w", d.ID, err)
		}

		for _, do := range docs {
			if _, ok := cr.DocumentsInTasks[url]; ok {
				cr.DocumentsInTasks[url] = append(cr.DocumentsInTasks[url], &DocumentRelation{
					TaskID: do.TaskID,
					Type:   do.Type,
				})
			} else {
				cr.DocumentsInTasks[url] = []*DocumentRelation{
					{
						TaskID: do.TaskID,
						Type:   do.Type,
					},
				}
			}
		}
	}
	return nil
}

func (cr *CaseValidationRecord) fetchInputDocumentsFromTask(ctx context.Context, task *types.CaseTaskBatch) error {
	var urls []string
	for _, doc := range task.InputDocuments {
		urls = append(urls, doc.Url)
	}
	return cr.fetchDocumentsFromURLs(ctx, urls)
}

func (cr *CaseValidationRecord) fetchOutputDocumentsFromTask(ctx context.Context, task *types.CaseTaskBatch) error {
	var urls []string
	for _, doc := range task.OutputDocuments {
		urls = append(urls, doc.Url)
	}
	return cr.fetchDocumentsFromURLs(ctx, urls)
}

func (cr *CaseValidationRecord) fetchFromTasks(ctx context.Context) error {
	for _, t := range cr.Case.Tasks {
		if err := cr.fetchSequencingExperimentsInTask(ctx, t); err != nil {
			return fmt.Errorf("failed to fetch sequencing experiments from task: %w", err)
		}

		if err := cr.fetchTaskContextFromSequencingExperiments(ctx); err != nil {
			return fmt.Errorf("failed to fetch task context from sequencing experiments: %w", err)
		}

		if err := cr.fetchInputDocumentsFromTask(ctx, t); err != nil {
			return fmt.Errorf("failed to fetch input documents from task: %w", err)
		}

		if err := cr.fetchOutputDocumentsFromTask(ctx, t); err != nil {
			return fmt.Errorf("failed to fetch output documents from task: %w", err)
		}
	}
	return nil
}

func (cr *CaseValidationRecord) fetchValidationInfos(ctx context.Context) error {
	if err := cr.fetchProject(ctx); err != nil {
		return fmt.Errorf("failed to resolve project: %w", err)
	}
	if err := cr.fetchAnalysisCatalog(ctx); err != nil {
		return fmt.Errorf("failed to resolve analysis catalog: %w", err)
	}
	if err := cr.resolveOrganizations(ctx); err != nil {
		return fmt.Errorf("failed to resolve organizations: %w", err)
	}
	if err := cr.fetchPatients(ctx); err != nil {
		return fmt.Errorf("failed to resolve patients: %w", err)
	}
	if err := cr.fetchFromSequencingExperiments(ctx); err != nil {
		return fmt.Errorf("failed to resolve sequencing experiments: %w", err)
	}
	if err := cr.fetchFromTasks(ctx); err != nil {
		return fmt.Errorf("failed to resolve tasks: %w", err)
	}
	return nil
}

func (cr *CaseValidationRecord) formatTaskFieldErrorMessage(fieldName string, caseIndex, taskIndex int) string {
	return fmt.Sprintf("Invalid field %s for create_case %d - task %d. Reason:", fieldName, caseIndex, taskIndex)
}

func (cr *CaseValidationRecord) formatFieldPath(entityType string, entityIndex *int, collectionName string, collectionIndex *int) string {
	var path string
	if entityType != "" {
		path = fmt.Sprintf("create_case[%d].%s", cr.Index, entityType)
		if entityIndex != nil {
			path = fmt.Sprintf("%s[%d]", path, *entityIndex)
		}
		if collectionName != "" {
			path = fmt.Sprintf("%s.%s", path, collectionName)
			if collectionIndex != nil {
				path = fmt.Sprintf("%s[%d]", path, *collectionIndex)
			}
		}
	} else {
		path = fmt.Sprintf("create_case[%d]", cr.Index)
	}
	return path
}

func (cr *CaseValidationRecord) formatPatientsFieldPath(patientIndex *int, collectionName string, collectionIndex *int) string {
	return cr.formatFieldPath("patients", patientIndex, collectionName, collectionIndex)
}

func (cr *CaseValidationRecord) formatSeqExpFieldPath(seqExpIndex *int) string {
	return cr.formatFieldPath("sequencing_experiments", seqExpIndex, "", nil)
}

// Family History validation

func (cr *CaseValidationRecord) validateFamilyMemberCode(patientIndex int, fhIndex int) {
	fh := cr.Case.Patients[patientIndex].FamilyHistory[fhIndex]
	fieldName := "family_member_code"
	path := cr.formatPatientsFieldPath(&patientIndex, "family_history", &fhIndex)
	cr.ValidateStringField(fh.FamilyMemberCode, fieldName, path, PatientInvalidField, cr.GetResourceType(), TextMaxLength, FamilyMemberCodeRegExpCompiled, []string{}, true)
}

func (cr *CaseValidationRecord) validateCondition(patientIndex int, fhIndex int) {
	fh := cr.Case.Patients[patientIndex].FamilyHistory[fhIndex]
	fieldName := "condition"
	path := cr.formatPatientsFieldPath(&patientIndex, "family_history", &fhIndex)
	cr.ValidateStringField(fh.Condition, fieldName, path, PatientInvalidField, cr.GetResourceType(), TextMaxLength, TextRegExpCompiled, []string{}, true)

}

func (cr *CaseValidationRecord) validateFamilyHistory(patientIndex int) {
	for fhIndex := range cr.Case.Patients[patientIndex].FamilyHistory {
		cr.validateFamilyMemberCode(patientIndex, fhIndex)
		cr.validateCondition(patientIndex, fhIndex)
	}
}

// Observations Categorical validation

// observationValueCodes returns the values allowed for this observation code,
// or nil when the value is validated by format only.
func (cr *CaseValidationRecord) observationValueCodes(code string) []string {
	switch code {
	case types.ObsCodeAncestry:
		return cr.AncestryCodes
	case types.ObsCodeConsanguinity:
		return cr.ConsanguinityCodes
	default:
		return nil
	}
}

func (cr *CaseValidationRecord) validateObservationsCategorical(patientIndex int) error {
	for obsIndex := range cr.Case.Patients[patientIndex].ObservationsCategorical {
		obsPath := cr.formatPatientsFieldPath(&patientIndex, "observations_categorical", &obsIndex)
		obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
		res := fmt.Sprintf("create_case %d - patient %d - observations_categorical %d", cr.Index, patientIndex, obsIndex)

		onsetAndInterpretationRequired := types.ObservationRequiresOnsetAndInterpretation(obs.Code)
		onsetRequired := onsetAndInterpretationRequired && obs.ExamCode == ""

		cr.ValidateCode(res, obsPath+".code", "code", ObservationInvalidField, obs.Code, cr.ObservationCodes, []string{}, true)
		cr.ValidateCode(res, obsPath+".onset_code", "onset_code", ObservationInvalidField, obs.OnsetCode, cr.OnsetCodes, []string{}, onsetRequired)
		cr.ValidateCode(res, obsPath+".interpretation_code", "interpretation_code", ObservationInvalidField, obs.InterpretationCode, cr.InterpretationCodes, []string{}, onsetAndInterpretationRequired)

		cr.ValidateStringField(obs.System, "system", obsPath+".system", ObservationInvalidField, res, TextMaxLength, TextRegExpCompiled, []string{}, true)
		if valueCodes := cr.observationValueCodes(obs.Code); valueCodes != nil {
			cr.ValidateCode(res, obsPath+".value", "value", ObservationInvalidField, obs.Value, valueCodes, []string{}, true)
		} else {
			cr.ValidateStringField(obs.Value, "value", obsPath+".value", ObservationInvalidField, res, TextMaxLength, TextRegExpCompiled, []string{}, true)
		}
		cr.ValidateStringField(obs.Note, "note", obsPath+".note", ObservationInvalidField, res, NoteMaxLength, TextRegExpCompiled, []string{}, false)
	}
	return nil
}

// Observations Text validation

func (cr *CaseValidationRecord) validateObsTextValue(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsText[obsIndex]
	fieldName := "value"
	path := cr.formatPatientsFieldPath(&patientIndex, "observations_text", &obsIndex)
	res := fmt.Sprintf("create_case %d - patient %d - observations_text %d - value: %q", cr.Index, patientIndex, obsIndex, obs.Value)
	cr.ValidateStringField(obs.Value, fieldName, path, ObservationInvalidField, res, TextMaxLength, TextRegExpCompiled, []string{}, true)
}

func (cr *CaseValidationRecord) validateObservationsText(patientIndex int) error {
	for obsIndex := range cr.Case.Patients[patientIndex].ObservationsText {
		obs := cr.Case.Patients[patientIndex].ObservationsText[obsIndex]
		res := fmt.Sprintf("create_case %d - patient %d - observations_text %d", cr.Index, patientIndex, obsIndex)

		path := cr.formatPatientsFieldPath(&patientIndex, "observations_text", &obsIndex)
		cr.ValidateCode(res, path+".code", "code", ObservationInvalidField, obs.Code, cr.ObservationCodes, []string{}, true)
		cr.validateObsTextValue(patientIndex, obsIndex)
	}
	return nil
}

// Case patient validation

func (cr *CaseValidationRecord) validatePatient(patientIndex int) {
	p := cr.Case.Patients[patientIndex]
	_, exists := cr.Patients[batchval.PatientKey{OrganizationCode: p.PatientOrganizationCode, SubmitterPatientId: p.SubmitterPatientId}]
	if !exists {
		path := cr.formatPatientsFieldPath(&patientIndex, "", nil)
		message := fmt.Sprintf("Patient (%s / %s) for create_case %d - patient %d does not exist.",
			p.PatientOrganizationCode,
			p.SubmitterPatientId,
			cr.Index,
			patientIndex,
		)
		cr.AddErrors(message, PatientNotFound, path)
	}
}

func (cr *CaseValidationRecord) validatePatientUniquenessInCase(patientIndex int, visited map[batchval.PatientKey]struct{}) {
	p := cr.Case.Patients[patientIndex]
	patientKey := batchval.PatientKey{
		OrganizationCode:   p.PatientOrganizationCode,
		SubmitterPatientId: p.SubmitterPatientId,
	}
	if _, exists := visited[patientKey]; exists {
		path := cr.formatPatientsFieldPath(nil, "", nil)
		message := fmt.Sprintf("Duplicate patient (%s / %s) for create_case %d.",
			p.PatientOrganizationCode,
			p.SubmitterPatientId,
			cr.Index,
		)
		cr.AddErrors(message, CaseDuplicatePatient, path)
	}
	visited[patientKey] = struct{}{}
}

func (cr *CaseValidationRecord) validateAffectedStatusCode(path string, resourceIds []string, patientIndex int) {
	cr.ValidateCode("", path, "affected_status_code", PatientInvalidField, cr.Case.Patients[patientIndex].AffectedStatusCode, cr.PatientAffectedStatusCodes, resourceIds, true)
}

func (cr *CaseValidationRecord) validateRelationshipToProbandCode(path string, resourceIds []string, patientIndex int) {
	cr.ValidateCode("", path, "relation_to_proband_code", PatientInvalidField, cr.Case.Patients[patientIndex].RelationToProbandCode, cr.PatientRelationshipToProbandCodes, resourceIds, true)

}

func (cr *CaseValidationRecord) validateCasePatients() error {
	nbProband := 0
	visitedPatients := map[batchval.PatientKey]struct{}{}

	for patientIndex := range cr.Case.Patients {

		patientPath := cr.formatPatientsFieldPath(&patientIndex, "", nil)
		res := fmt.Sprintf("create_case %d - patient %d", cr.Index, patientIndex)
		cr.ValidateStringField(cr.Case.Patients[patientIndex].SubmitterPatientId, "submitter_patient_id", patientPath+".submitter_patient_id", PatientInvalidField, res, TextMaxLength, TextRegExpCompiled, []string{}, true)

		// Validate uniqueness of patients in case
		cr.validatePatientUniquenessInCase(patientIndex, visitedPatients)

		// Validate patient exists in organization
		cr.validatePatient(patientIndex)

		if cr.Case.Patients[patientIndex].RelationToProbandCode == "proband" {
			nbProband++
		}
		cr.validateAffectedStatusCode(patientPath+".affected_status_code", []string{res}, patientIndex)
		cr.validateRelationshipToProbandCode(patientPath+".relation_to_proband_code", []string{res}, patientIndex)

		// Validate family history
		cr.validateFamilyHistory(patientIndex)

		// Validate observations categorical
		err := cr.validateObservationsCategorical(patientIndex)
		if err != nil {
			return fmt.Errorf("error validating observations categorical for patient index %d: %v", patientIndex, err)
		}

		// Validate observations text
		err = cr.validateObservationsText(patientIndex)
		if err != nil {
			return fmt.Errorf("error validating observations text for patient index %d: %v", patientIndex, err)
		}
	}

	// Validate number of probands
	if nbProband != 1 {
		message := fmt.Sprintf("Case %d must have exactly 1 proband.", cr.Index)
		path := cr.formatFieldPath("patients", nil, "", nil)
		cr.AddErrors(message, CaseInvalidNumberOfProbands, path)
	}

	return nil
}

func (cr *CaseValidationRecord) validateSeqExpExists(ctx context.Context, seqExpIndex int) (error, bool) {
	se := cr.Case.SequencingExperiments[seqExpIndex]
	seqExp, err := cr.Cache.GetSequencingExperimentByAliquotAndSubmitterSample(ctx, se.Aliquot, se.SubmitterSampleId, se.SampleOrganizationCode)
	if err != nil {
		return fmt.Errorf("error getting existing sequencing experiment: %v", err), false
	}
	if seqExp == nil {
		path := cr.formatSeqExpFieldPath(&seqExpIndex)
		message := fmt.Sprintf("Sequencing experiment (%s / %s / %s) does not exist.",
			se.SampleOrganizationCode,
			se.SubmitterSampleId,
			se.Aliquot,
		)
		cr.AddErrors(message, SequencingExperimentNotFound, path)
		return nil, false
	}
	return nil, true
}

func (cr *CaseValidationRecord) validateSeqExpSample(ctx context.Context, seqExpIndex int) (*types.Sample, error) {
	se := cr.Case.SequencingExperiments[seqExpIndex]
	sample, err := cr.Cache.GetSampleByOrgCodeAndSubmitterSampleId(ctx, se.SampleOrganizationCode, se.SubmitterSampleId)
	if err != nil {
		return nil, fmt.Errorf("error getting existing sample: %v", err)
	}
	return sample, nil
}

func (cr *CaseValidationRecord) validateSeqExpPatientInCase(seqExpIndex int, sample *types.Sample) error {
	if sample == nil {
		return nil
	}

	se := cr.Case.SequencingExperiments[seqExpIndex]
	patientFound := false
	for key := range cr.Patients {
		if cr.Patients[key].ID == sample.PatientID {
			patientFound = true
			break
		}
	}
	if !patientFound {
		path := cr.formatSeqExpFieldPath(&seqExpIndex)
		message := fmt.Sprintf("Sequencing experiment (%s / %s / %s) does not belong to any patient from create_case %d.",
			se.SampleOrganizationCode,
			se.SubmitterSampleId,
			se.Aliquot,
			cr.Index,
		)
		cr.AddErrors(message, CaseSeqExpNotFoundForPatient, path)
	}

	return nil
}

func (cr *CaseValidationRecord) validateSeqExpCaseType(seqExpIndex int, sample *types.Sample) error {
	if sample == nil {
		return nil
	}

	se := cr.Case.SequencingExperiments[seqExpIndex]
	if cr.Case.Type == "germline" && sample.HistologyCode == "tumoral" {
		path := cr.formatSeqExpFieldPath(&seqExpIndex)
		message := fmt.Sprintf("Tumor sequencing experiment (%s / %s / %s) should not be sequenced in a germline case for create_case %d - sequencing experiment %d.",
			se.SampleOrganizationCode,
			se.SubmitterSampleId,
			se.Aliquot,
			cr.Index,
			seqExpIndex,
		)
		cr.AddErrors(message, CaseInvalidSeqExpForType, path)
	}
	return nil
}

func (cr *CaseValidationRecord) validateCaseSequencingExperiments(ctx context.Context) error {
	for seqExpIndex := range cr.Case.SequencingExperiments {
		err, exists := cr.validateSeqExpExists(ctx, seqExpIndex)
		if err != nil {
			return fmt.Errorf("error validating sequencing experiment in organization for sequencing experiment index %d: %v", seqExpIndex, err)
		}
		if !exists {
			continue
		}
		sample, err := cr.validateSeqExpSample(ctx, seqExpIndex)
		if err != nil {
			return fmt.Errorf("error validating sequencing experiment sample for sequencing experiment index %d: %v", seqExpIndex, err)
		}
		err = cr.validateSeqExpCaseType(seqExpIndex, sample)
		if err != nil {
			return fmt.Errorf("error validating sequencing experiment for wrong case type for sequencing experiment index %d: %v", seqExpIndex, err)
		}
		err = cr.validateSeqExpPatientInCase(seqExpIndex, sample)
		if err != nil {
			return fmt.Errorf("error validating sequencing experiment patient in case for sequencing experiment index %d: %v", seqExpIndex, err)
		}
	}
	return nil
}

func (cr *CaseValidationRecord) validateCaseField(value, fieldName, path string, regExp *regexp.Regexp, maxLength int, required bool) {
	cr.ValidateStringField(value, fieldName, path, CaseInvalidField, fmt.Sprintf("%s %d", cr.GetResourceType(), cr.Index), maxLength, regExp, []string{}, required)
}

func (cr *CaseValidationRecord) validateCodes() {
	resIds := []string{fmt.Sprintf("%d", cr.Index)}
	path := cr.formatFieldPath("", nil, "", nil)
	cr.ValidateCode(cr.GetResourceType(), path+".status_code", "status_code", CaseInvalidField, cr.Case.StatusCode, cr.StatusCodes, resIds, true)
	cr.ValidateCode(cr.GetResourceType(), path+".resolution_status_code", "resolution_status_code", CaseInvalidField, cr.Case.ResolutionStatusCode, cr.ResolutionStatusCodes, resIds, false)
	cr.ValidateCode(cr.GetResourceType(), path+".priority_code", "priority_code", CaseInvalidField, cr.Case.PriorityCode, cr.PriorityCodes, resIds, false)
	cr.ValidateCode(cr.GetResourceType(), path+".category_code", "category_code", CaseInvalidField, cr.Case.CategoryCode, cr.CategoryCodes, resIds, false)
}

func (cr *CaseValidationRecord) validateCase(ctx context.Context) error {

	path := batchval.FormatPath(cr, "")

	// Validate case uniqueness in DB
	if cr.ProjectID != nil && cr.Case.SubmitterCaseId != "" {
		c, err := cr.Cache.GetCaseBySubmitterCaseIdAndProjectId(ctx, cr.Case.SubmitterCaseId, *cr.ProjectID)
		if err != nil {
			return fmt.Errorf("error checking for existing case with submitter_case_id %q and project_id %d: %v", cr.Case.SubmitterCaseId, *cr.ProjectID, err)
		}
		if c != nil {
			cr.Skipped = true
			message := fmt.Sprintf("Case (%d / %s) already exists, skipped.", *cr.ProjectID, cr.Case.SubmitterCaseId)
			cr.AddInfos(message, CaseAlreadyExists, path) // CASE-001
			return nil
		}
	}

	// Validate data in DB
	if cr.ProjectID == nil {
		message := fmt.Sprintf("Project %s for create_case %d does not exist.", cr.Case.ProjectCode, cr.Index)
		cr.AddErrors(message, CaseUnknownProject, path) // CASE-003
	}

	cr.validateCaseCommonFields(path)
	return nil
}

// validateCaseCommonFields validates diagnostic lab/analysis catalog/ordering organization
// existence and the case's scalar field formats. Shared by the POST (validateCase) and
// PUT (validateUpdateCaseRecord) paths — these checks apply identically whether the case is
// being created or updated.
func (cr *CaseValidationRecord) validateCaseCommonFields(path string) {
	if !cr.DiagnosisLabExists {
		message := fmt.Sprintf("Diagnostic lab %q for create_case %d does not exist.", cr.Case.DiagnosticLabCode, cr.Index)
		cr.AddErrors(message, CaseUnknownDiagnosticLab, path) // CASE-004
	}
	if cr.AnalysisCatalogID == nil {
		message := fmt.Sprintf("Analysis %q for create_case %d does not exist.", cr.Case.AnalysisCode, cr.Index)
		cr.AddErrors(message, CaseUnknownAnalysisCode, path) // CASE-005
	}
	if !cr.OrderingOrganizationExists {
		message := fmt.Sprintf("Ordering organization %q for create_case %d does not exist.", cr.Case.OrderingOrganizationCode, cr.Index)
		cr.AddErrors(message, CaseUnknownOrderingOrganization, path) // CASE-006
	}

	// Validate fields
	if cr.Case.SubmitterCaseId != "" {
		cr.validateCaseField(cr.Case.SubmitterCaseId, "submitter_case_id", path, ExternalIdRegexpCompiled, TextMaxLength, false)
	}
	cr.validateCodes()

	if cr.Case.PrimaryConditionCodeSystem != "" {
		cr.validateCaseField(cr.Case.PrimaryConditionCodeSystem, "primary_condition_code_system", path, TextRegExpCompiled, TextMaxLength, false)
	}
	if cr.Case.PrimaryConditionValue != "" {
		cr.validateCaseField(cr.Case.PrimaryConditionValue, "primary_condition_value", path, TextRegExpCompiled, TextMaxLength, false)
	}
	if cr.Case.ResolutionStatusCode != "" {
		cr.validateCaseField(cr.Case.ResolutionStatusCode, "resolution_status_code", path, TextRegExpCompiled, TextMaxLength, false)
	}
	if cr.Case.Note != "" {
		cr.validateCaseField(cr.Case.Note, "note", path, nil, NoteMaxLength, false)
	}
	if cr.Case.OrderingPhysician != "" {
		cr.validateCaseField(cr.Case.OrderingPhysician, "ordering_physician", path, NameRegExpCompiled, TextMaxLength, false)
	}
}

// Tasks validation

func (cr *CaseValidationRecord) validateTaskTextField(fieldValue, fieldName string, taskIndex int, regExp *regexp.Regexp, required bool) {
	path := cr.formatFieldPath("tasks", &taskIndex, fieldName, nil)
	if !required && fieldValue == "" {
		return
	}
	res := fmt.Sprintf("create_case %d - task %d", cr.Index, taskIndex)
	cr.ValidateStringField(fieldValue, fieldName, path, TaskInvalidField, res, TextMaxLength, regExp, []string{}, required)
}

func (cr *CaseValidationRecord) validateTaskTypeCode(typeCode string, taskIndex int) {
	if !slices.Contains(cr.TaskTypeCodes, typeCode) {
		path := cr.formatFieldPath("tasks", &taskIndex, "type_code", nil)
		msg := cr.formatTaskFieldErrorMessage("type_code", cr.Index, taskIndex) + " invalid task type code `" + typeCode + "`. Valid codes are: [" + strings.Join(cr.TaskTypeCodes, ", ") + "]."
		cr.AddErrors(msg+"", TaskInvalidField, path)
	}
}

func (cr *CaseValidationRecord) validateTaskAliquot(taskIndex int) {
	task := cr.Case.Tasks[taskIndex]
	if len(task.Aliquots) == 0 {
		path := cr.formatFieldPath("tasks", &taskIndex, "aliquots", nil)
		msg := cr.formatTaskFieldErrorMessage("aliquots", cr.Index, taskIndex)
		cr.AddErrors(fmt.Sprintf("%s aliquots must contain at least one value.", msg), TaskInvalidField, path)
		return
	}

	if _, ok := SingleAliquotTaskTypes[task.TypeCode]; ok && len(task.Aliquots) > 1 {
		path := cr.formatFieldPath("tasks", &taskIndex, "", nil)
		msg := fmt.Sprintf("Task type %s doesn't support being associated with more than 1 aliquot value.", task.TypeCode)
		cr.AddErrors(msg, TaskTypeDoesNotSupportMultipleAliquots, path)
		return
	}

	existingAliquots := make(map[string]struct{}, len(cr.Case.SequencingExperiments))
	for _, se := range cr.Case.SequencingExperiments {
		existingAliquots[se.Aliquot] = struct{}{}
	}

	for _, aliquot := range task.Aliquots {
		if _, found := existingAliquots[aliquot]; !found {
			path := cr.formatFieldPath("tasks", &taskIndex, "", nil)
			message := fmt.Sprintf("Sequencing %q is not defined for create_case %d - task %d.", aliquot, cr.Index, taskIndex)
			cr.AddErrors(message, TaskUnknownAliquot, path)
		}
	}
}

func (cr *CaseValidationRecord) getOriginTaskForInputDocument(url string) (*types.CaseTaskBatch, *types.OutputDocumentBatch) {
	for _, task := range cr.Case.Tasks {
		for _, outdoc := range task.OutputDocuments {
			if outdoc.Url == url {
				return task, outdoc
			}
		}
	}
	return nil, nil
}

func (cr *CaseValidationRecord) addMissingExperimentError(url, baseMsg, path string) {
	msg := fmt.Sprintf("Input document with URL %s for %s was produced by a sequencing experiment not defined in this case.", url, baseMsg)
	cr.AddErrors(msg, TaskInputDocumentNotInSequencingExperiments, path)
}

func (cr *CaseValidationRecord) validateTaskDocumentsContext(url, path, baseMsg string, isOriginMissing bool) {
	usages, ok := cr.DocumentsInTasks[url]
	if !ok {
		return
	}

	for _, usage := range usages {
		if usage.Type == "input" {
			continue
		}

		contexts, ok := cr.TaskContexts[usage.TaskID]

		if !ok && isOriginMissing {
			cr.addMissingExperimentError(url, baseMsg, path)
			break
		}

		for _, tc := range contexts {
			if _, exists := cr.SequencingExperiments[tc.SequencingExperimentID]; !exists {
				cr.addMissingExperimentError(url, baseMsg, path)
				return
			}
		}
	}
}

func (cr *CaseValidationRecord) validateTaskDocuments(task *types.CaseTaskBatch, taskIndex int) {
	path := cr.formatFieldPath("tasks", &taskIndex, "", nil)
	baseMsg := fmt.Sprintf("create_case %d - task %d", cr.Index, taskIndex)

	if _, ok := RequiresInputDocumentsTaskTypes[task.TypeCode]; ok {
		if len(task.InputDocuments) == 0 {
			message := fmt.Sprintf("Missing input documents for create_case %d - task %d of type %s.", cr.Index, taskIndex, task.TypeCode)
			cr.AddErrors(message, TaskMissingInputDocuments, path)
		}
	}

	if len(task.OutputDocuments) == 0 {
		message := fmt.Sprintf("Missing output documents for create_case %d - task %d of type %s.", cr.Index, taskIndex, task.TypeCode)
		cr.AddErrors(message, TaskMissingOutputDocuments, path)
	}

	for _, indoc := range task.InputDocuments {
		url := indoc.Url
		_, existsInDocs := cr.Documents[url]
		_, originTask := cr.getOriginTaskForInputDocument(url)

		if !existsInDocs && originTask == nil {
			cr.AddErrors(fmt.Sprintf("Input document with URL %s does not exist for %s.", url, baseMsg), TaskInputDocumentNotFound, path)
			continue
		}
		cr.validateTaskDocumentsContext(url, path, baseMsg, originTask == nil)
	}
}

func (cr *CaseValidationRecord) validateTasks() error {
	for taskIndex, task := range cr.Case.Tasks {

		for _, aliquot := range task.Aliquots {
			cr.validateTaskTextField(aliquot, "aliquots", taskIndex, TextRegExpCompiled, true)
		}

		cr.validateTaskTextField(task.TypeCode, "type_code", taskIndex, TextRegExpCompiled, true)
		cr.validateTaskTypeCode(task.TypeCode, taskIndex)
		cr.validateTaskTextField(task.PipelineVersion, "pipeline_version", taskIndex, TextRegExpCompiled, true)
		cr.validateTaskAliquot(taskIndex)
		cr.validateTaskDocuments(task, taskIndex)

		// Optional fields
		if task.GenomeBuild != "" {
			cr.validateTaskTextField(task.GenomeBuild, "genome_build", taskIndex, TextRegExpCompiled, true)
		}
		if task.PipelineName != "" {
			cr.validateTaskTextField(task.PipelineName, "pipeline_name", taskIndex, TextRegExpCompiled, true)
		}
	}
	return nil
}

// Documents validation

func (cr *CaseValidationRecord) validateDocumentExists(new *types.OutputDocumentBatch, existing *types.Document, path string) {
	hasDiff := false

	check := func(name string, newVal, existingVal any) {
		if newVal != existingVal {
			hasDiff = true
			msg := fmt.Sprintf("A document with same url %s has been found but with a different %s (%v <> %v).",
				new.Url, name, existingVal, newVal)
			cr.AddWarnings(msg, DocumentDuplicateWithDifferentFieldValue, path)
		}
	}

	check("format_code", new.FormatCode, existing.FileFormatCode)
	check("name", new.Name, existing.Name)
	check("data_type_code", new.DataTypeCode, existing.DataTypeCode)
	check("data_category_code", new.DataCategoryCode, existing.DataCategoryCode)
	check("hash", new.Hash, existing.Hash)

	if new.Size == nil {
		hasDiff = true
		msg := fmt.Sprintf("A document with same url %s has been found but with a different size (%d <> nil).", new.Url, existing.Size)
		cr.AddWarnings(msg, DocumentDuplicateWithDifferentFieldValue, path)
	} else if existing.Size != *new.Size {
		hasDiff = true
		msg := fmt.Sprintf("A document with same url %s has been found but with a different size (%d <> %d).", new.Url, existing.Size, *new.Size)
		cr.AddWarnings(msg, DocumentDuplicateWithDifferentFieldValue, path)
	}

	if !hasDiff {
		msg := "Document " + new.Url + " already exists, skipped."
		cr.AddInfos(msg, DocumentDuplicateInDB, path)
	}
}

func (cr *CaseValidationRecord) validateDocumentTextField(fieldValue, fieldName string, path string, taskIndex int, documentIndex int, regExp *regexp.Regexp, required bool) {
	if !required && fieldValue == "" {
		return
	}
	res := fmt.Sprintf("create_case %d - task %d - output document %d", cr.Index, taskIndex, documentIndex)
	cr.ValidateStringField(fieldValue, fieldName, path, DocumentInvalidField, res, TextMaxLength, regExp, []string{}, required)
}

func (cr *CaseValidationRecord) validateDocumentIsOutputOfAnotherTask(doc *types.Document, path string) {
	relatedDocs := cr.DocumentsInTasks[doc.Url]

	for _, dr := range relatedDocs {
		if dr.Type == "output" {
			msg := "A document with same url " + doc.Url + " has been found in the output of a different task."
			cr.AddErrors(msg, DocumentAlreadyOutputOfAnotherTask, path)
			return
		}
	}
}

func (cr *CaseValidationRecord) validateDocumentMetadata(doc *types.OutputDocumentBatch, path string, taskIndex, docIndex int) error {
	metadata, err := cr.Context.S3FS.GetMetadata(doc.Url)
	if err != nil {
		return err
	}
	if metadata == nil {
		cr.AddErrors(
			fmt.Sprintf(
				"No document can be found on the URL %s for create_case %d - task %d - output document %d.",
				doc.Url,
				cr.Index,
				taskIndex,
				docIndex,
			), DocumentNotFoundAtURL, path)
		return nil
	}

	docNameFromUrl, err := utils.ExtractFileName(doc.Url)
	if err != nil {
		return err
	}
	if *docNameFromUrl != doc.Name {
		msg := fmt.Sprintf("Document name %s is not consistent with URL %s for create_case %d - task %d - output document %d.", doc.Name, doc.Url, cr.Index, taskIndex, docIndex)
		cr.AddErrors(msg, DocumentNameInconsistency, path)
	}

	if doc.Size == nil || metadata.Size != *doc.Size {
		msg := fmt.Sprintf("Document size does not match the actual size of the document %s for create_case %d - task %d - output document %d.", doc.Url, cr.Index, taskIndex, docIndex)
		cr.AddErrors(msg, DocumentSizeMismatch, path)
	}

	// Hash is optional, validate only if provided
	if doc.Hash != "" {
		if metadata.Hash != doc.Hash {
			msg := fmt.Sprintf("Document hash does not match the actual hash of the document %s for create_case %d - task %d - output document %d.", doc.Url, cr.Index, taskIndex, docIndex)
			cr.AddErrors(msg, DocumentHashMismatch, path)
		}
	}
	return nil
}

func (cr *CaseValidationRecord) validateDocumentDuplicate(doc *types.OutputDocumentBatch, path string) {
	if _, exists := cr.OutputDocuments[doc.Url]; exists {
		msg := fmt.Sprintf("Duplicate output document with URL %s found.", doc.Url)
		cr.AddErrors(msg, DocumentDuplicateInBatch, path)
	} else {
		cr.OutputDocuments[doc.Url] = struct{}{}
	}
}

func (cr *CaseValidationRecord) validateDocumentCodes(doc *types.OutputDocumentBatch, taskIndex int, docIndex int) {
	path := fmt.Sprintf("create_case[%d].tasks[%d].output_documents[%d]", cr.Index, taskIndex, docIndex)

	if doc.DataTypeCode != "" && !slices.Contains(cr.DocumentDataTypeCodes, doc.DataTypeCode) {
		msg := fmt.Sprintf("%s data type code %q is not a valid data type code. Valid values [%s].", cr.FormatCasesInvalidFieldMessage("data_type_code", fmt.Sprintf("create_case %d", cr.Index)), doc.DataTypeCode, strings.Join(cr.DocumentDataTypeCodes, ", "))
		cr.AddErrors(msg, DocumentInvalidField, path)
	}
	if doc.DataCategoryCode != "" && !slices.Contains(cr.DocumentDataCategoryCodes, doc.DataCategoryCode) {
		msg := fmt.Sprintf("%s data category code %q is not a valid data category code. Valid values [%s].", cr.FormatCasesInvalidFieldMessage("data_category_code", fmt.Sprintf("create_case %d", cr.Index)), doc.DataCategoryCode, strings.Join(cr.DocumentDataCategoryCodes, ", "))
		cr.AddErrors(msg, DocumentInvalidField, path)
	}
	if doc.FormatCode != "" && !slices.Contains(cr.DocumentFormatCodes, doc.FormatCode) {
		msg := fmt.Sprintf("%s format code %q is not a valid format code. Valid values [%s].", cr.FormatCasesInvalidFieldMessage("format_code", fmt.Sprintf("create_case %d", cr.Index)), doc.FormatCode, strings.Join(cr.DocumentFormatCodes, ", "))
		cr.AddErrors(msg, DocumentInvalidField, path)
	}
}

func (cr *CaseValidationRecord) validateDocuments() error {
	for tid, t := range cr.Case.Tasks {
		for did, doc := range t.OutputDocuments {
			path := fmt.Sprintf("create_case[%d].tasks[%d].output_documents[%d]", cr.Index, tid, did)
			if d, ok := cr.Documents[doc.Url]; ok {
				cr.validateDocumentExists(doc, d, path)
				cr.validateDocumentIsOutputOfAnotherTask(d, path)
				continue
			}

			if doc.Hash != "" {
				cr.validateDocumentTextField(doc.Hash, "hash", path, tid, did, TextRegExpCompiled, true)
			}
			cr.validateDocumentTextField(doc.Name, "name", path, tid, did, TextRegExpCompiled, true)

			cr.validateDocumentCodes(doc, tid, did)
			if doc.Size != nil && *doc.Size < 0 {
				msg := batchval.FormatInvalidField(cr.GetResourceType(), "size", "size is invalid, must be non-negative", []string{})
				cr.AddErrors(msg, DocumentInvalidField, path)
			}

			if err := cr.validateDocumentMetadata(doc, path, tid, did); err != nil {
				return fmt.Errorf("error validating file metadata for create_case %d - document %d: %v", cr.Index, tid, err)
			}
			cr.validateDocumentDuplicate(doc, path)
		}
	}
	return nil
}

func validateCaseRecord(
	ctx context.Context,
	bv *batchval.BatchValidationContext,
	cache *batchval.BatchValidationCache,
	c types.CaseBatch,
	index int,
) (*CaseValidationRecord, error) {
	cr := NewCaseValidationRecord(bv, cache, c, index)

	// TODO: optimize by fetching all codes at once outside of the record
	if err := cr.fetchCodeInfos(ctx); err != nil {
		return nil, fmt.Errorf("error during pre-fetching code infos: %v", err)
	}

	if err := cr.fetchValidationInfos(ctx); err != nil {
		return nil, fmt.Errorf("error during pre-fetching case validation info: %v", err)
	}

	// 1. Validate Case fields
	if err := cr.validateCase(ctx); err != nil {
		return nil, fmt.Errorf("error during case validation: %v", err)
	}
	if cr.Skipped {
		return cr, nil
	}

	// 2. Validate Case Patients
	if err := cr.validateCasePatients(); err != nil {
		return nil, fmt.Errorf("error during case patients validation: %v", err)
	}

	// 3. Validate Case Sequencing Experiments
	if err := cr.validateCaseSequencingExperiments(ctx); err != nil {
		return nil, fmt.Errorf("error during case sequencing experiments validation: %v", err)
	}

	// 4. Validate Case Tasks
	if err := cr.validateTasks(); err != nil {
		return nil, fmt.Errorf("error during case tasks validation: %v", err)
	}

	// 5. Validate Case Documents
	if err := cr.validateDocuments(); err != nil {
		return nil, fmt.Errorf("error validating documents: %w", err)
	}

	return cr, nil
}

func processCreateCaseBatch(ctx context.Context, bv *batchval.BatchValidationContext, batch *types.Batch, db *gorm.DB) error {
	payload := []byte(batch.Payload)
	var caseBatches []types.CaseBatch

	if unexpectedErr := json.Unmarshal(payload, &caseBatches); unexpectedErr != nil {
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error unmarshalling case batch: %v", unexpectedErr), bv.BatchRepo)
		return nil
	}

	records, unexpectedErr := validateCaseBatch(ctx, bv, caseBatches)
	if unexpectedErr != nil {
		if errors.Is(unexpectedErr, context.Canceled) {
			return unexpectedErr
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error case batch validation: %v", unexpectedErr), bv.BatchRepo)
		return nil
	}

	slog.InfoContext(ctx, "case batch processed", slog.String("batch_id", batch.ID), slog.Int("records", len(records)))

	if err := persistBatchAndCaseRecords(ctx, db, batch, records); err != nil {
		if errors.Is(err, context.Canceled) {
			return err
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error processing case batch records: %v", err), bv.BatchRepo)
		return nil
	}
	return nil
}

func persistBatchAndCaseRecords(ctx context.Context, db *gorm.DB, batch *types.Batch, records []*CaseValidationRecord) error {
	return db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		batchRepo := repository.NewBatchRepository(tx)
		txCtx := NewStorageContext(tx)
		txCtx.TenantCode = batch.TenantCode
		rowsUpdated, unexpectedErrUpdate := batchval.UpdateBatch(ctx, batch, records, batchRepo)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating case batch %v", batch.ID)
		}
		if batch.DryRun || batch.Status != types.BatchStatusSuccess {
			return nil
		}

		if err := persistCaseRecords(ctx, txCtx, records); err != nil {
			return fmt.Errorf("error during case insertion %w", err)
		}

		return nil
	})
}

func persistCase(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord) error {
	if cr.ProjectID == nil {
		return fmt.Errorf("project ID is nil for create_case %d", cr.Index)
	}

	if cr.AnalysisCatalogID == nil {
		return fmt.Errorf("analysis catalog ID is nil for case %q", cr.Case.SubmitterCaseId)
	}

	if !cr.OrderingOrganizationExists {
		return fmt.Errorf("ordering organization is missing or unknown for case %q", cr.Case.SubmitterCaseId)
	}

	if !cr.DiagnosisLabExists {
		return fmt.Errorf("diagnosis lab is missing or unknown for create_case %d", cr.Index)
	}

	proband, err := cr.getProbandFromPatients()
	if err != nil {
		return fmt.Errorf("failed to get proband patient %w", err)
	}
	if proband == nil {
		return fmt.Errorf("proband patient not found for create_case %d", cr.Index)
	}

	c := types.Case{
		ProbandID:                proband.ID,
		ProjectID:                *cr.ProjectID,
		AnalysisCatalogID:        *cr.AnalysisCatalogID,
		CaseTypeCode:             cr.Case.Type,
		CaseCategoryCode:         cr.Case.CategoryCode,
		PriorityCode:             cr.Case.PriorityCode,
		StatusCode:               cr.Case.StatusCode,
		ResolutionStatusCode:     cr.Case.ResolutionStatusCode,
		PrimaryCondition:         cr.Case.PrimaryConditionValue,
		ConditionCodeSystem:      cr.Case.PrimaryConditionCodeSystem,
		OrderingPhysician:        cr.Case.OrderingPhysician,
		SubmitterCaseID:          cr.Case.SubmitterCaseId,
		Note:                     cr.Case.Note,
		TenantCode:               sc.TenantCode,
		OrderingOrganizationCode: &cr.Case.OrderingOrganizationCode,
		DiagnosisLabCode:         &cr.Case.DiagnosticLabCode,
	}

	if err := sc.CasesRepo.CreateCase(ctx, &c); err != nil {
		return fmt.Errorf("failed to persist case %w", err)
	}

	cr.CaseID = &c.ID

	return persistCaseHasSequencingExperiments(ctx, sc, cr)
}

func persistCaseHasSequencingExperiments(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord) error {
	if cr.CaseID == nil {
		return fmt.Errorf("case ID is nil when persisting case_has_sequencing_experiment for create_case %d", cr.Index)
	}
	for _, se := range cr.SequencingExperiments {
		chse := types.CaseHasSequencingExperiment{
			CaseID:                 *cr.CaseID,
			SequencingExperimentID: se.ID,
		}

		if err := sc.CasesRepo.CreateCaseHasSequencingExperiment(ctx, &chse); err != nil {
			return fmt.Errorf("failed to persist case has sequencing experiment for create_case %d and sequencing experiment %q: %w", cr.Index, se.ID, err)
		}
	}
	return nil
}

func persistCaseRecords(
	ctx context.Context,
	sc *StorageContext,
	records []*CaseValidationRecord,
) error {
	for _, record := range records {
		if record.Skipped {
			continue
		}
		if err := persistCase(ctx, sc, record); err != nil {
			return fmt.Errorf("failed to persist case for create_case %d: %w", record.Index, err)
		}
		if record.CaseID == nil {
			return fmt.Errorf("case ID is nil after persisting case for create_case %d", record.Index)
		}
		if err := persistFamily(ctx, sc, record); err != nil {
			return fmt.Errorf("failed to persist family for create_case %d: %w", record.Index, err)
		}
		if err := persistObservationCategorical(ctx, sc, record); err != nil {
			return fmt.Errorf("failed to persist observations categorical for create_case %d: %w", record.Index, err)
		}
		if err := persistObservationText(ctx, sc, record); err != nil {
			return fmt.Errorf("failed to persist observations text for create_case %d: %w", record.Index, err)
		}
		if err := persistFamilyHistory(ctx, sc, record); err != nil {
			return fmt.Errorf("failed to persist family history for create_case %d: %w", record.Index, err)
		}
		if err := persistTask(ctx, sc, record); err != nil {
			return fmt.Errorf("failed to persist tasks for create_case %d: %w", record.Index, err)
		}
	}
	return nil
}

func persistFamily(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord) error {
	for _, p := range cr.Case.Patients {

		key := batchval.PatientKey{OrganizationCode: p.PatientOrganizationCode, SubmitterPatientId: p.SubmitterPatientId}
		patient, ok := cr.Patients[key]
		if !ok {
			return fmt.Errorf("failed to find patient for family member %q in case %d", p.SubmitterPatientId, cr.Index)
		}
		familyMember := types.Family{
			CaseID:                    *cr.CaseID,
			FamilyMemberID:            patient.ID,
			RelationshipToProbandCode: p.RelationToProbandCode,
			AffectedStatusCode:        p.AffectedStatusCode,
			TenantCode:                sc.TenantCode,
		}
		if err := sc.FamilyRepo.CreateFamily(ctx, &familyMember); err != nil {
			return fmt.Errorf("failed to persist family member %q for create_case %d: %w", p.SubmitterPatientId, cr.Index, err)
		}
	}
	return nil
}

func persistObservationCategorical(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord) error {
	for _, p := range cr.Case.Patients {

		key := batchval.PatientKey{OrganizationCode: p.PatientOrganizationCode, SubmitterPatientId: p.SubmitterPatientId}
		patient, ok := cr.Patients[key]
		if !ok {
			return fmt.Errorf("failed to find patient for observations categorical for patient %s in case %d", p.SubmitterPatientId, cr.Index)
		}

		for _, o := range p.ObservationsCategorical {
			obs := types.ObsCategorical{
				CaseID:             *cr.CaseID,
				PatientID:          patient.ID,
				ObservationCode:    o.Code,
				CodingSystem:       o.System,
				CodeValue:          o.Value,
				OnsetCode:          utils.NilIfEmpty(o.OnsetCode),
				InterpretationCode: utils.NilIfEmpty(o.InterpretationCode),
				Note:               o.Note,
				ExamCode:           utils.NilIfEmpty(o.ExamCode),
				TenantCode:         sc.TenantCode,
			}

			if err := sc.ObsCatRepo.CreateObservationCategorical(ctx, &obs); err != nil {
				return fmt.Errorf("failed to persist observation categorical for patient %q in case %d: %w", p.SubmitterPatientId, cr.Index, err)
			}
		}
	}
	return nil
}

func persistObservationText(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord) error {
	for _, p := range cr.Case.Patients {

		key := batchval.PatientKey{OrganizationCode: p.PatientOrganizationCode, SubmitterPatientId: p.SubmitterPatientId}
		patient, ok := cr.Patients[key]
		if !ok {
			return fmt.Errorf("failed to find patient for observations text for patient %s in case %d", p.SubmitterPatientId, cr.Index)
		}

		for _, o := range p.ObservationsText {
			obs := types.ObsString{
				CaseID:             *cr.CaseID,
				PatientID:          patient.ID,
				ObservationCode:    o.Code,
				Value:              o.Value,
				InterpretationCode: utils.NilIfEmpty(o.InterpretationCode),
				ExamCode:           utils.NilIfEmpty(o.ExamCode),
				TenantCode:         sc.TenantCode,
			}

			if err := sc.ObsStringRepo.CreateObservationString(ctx, &obs); err != nil {
				return fmt.Errorf("failed to persist observation text for patient %q in case %d: %w", p.SubmitterPatientId, cr.Index, err)
			}
		}
	}
	return nil
}

func persistFamilyHistory(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord) error {
	for _, p := range cr.Case.Patients {

		key := batchval.PatientKey{OrganizationCode: p.PatientOrganizationCode, SubmitterPatientId: p.SubmitterPatientId}
		patient, ok := cr.Patients[key]
		if !ok {
			return fmt.Errorf("failed to find patient for family history for patient %s in case %d", p.SubmitterPatientId, cr.Index)
		}

		for _, o := range p.FamilyHistory {
			familyHistory := types.FamilyHistory{
				CaseID:           *cr.CaseID,
				PatientID:        patient.ID,
				FamilyMemberCode: o.FamilyMemberCode,
				Condition:        o.Condition,
				TenantCode:       sc.TenantCode,
			}

			if err := sc.FamilyHistoryRepo.CreateFamilyHistory(ctx, &familyHistory); err != nil {
				return fmt.Errorf("failed to persist family history for patient %q in case %d: %w", p.SubmitterPatientId, cr.Index, err)
			}
		}
	}
	return nil
}

func persistTask(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord) error {
	for _, t := range cr.Case.Tasks {
		task := types.Task{
			TaskTypeCode:    t.TypeCode,
			PipelineName:    t.PipelineName,
			PipelineVersion: t.PipelineVersion,
			GenomeBuild:     t.GenomeBuild,
			TenantCode:      sc.TenantCode,
		}
		err := sc.TaskRepo.CreateTask(ctx, &task)
		if err != nil {
			return fmt.Errorf("failed to persist task for create_case %d: %w", cr.Index, err)
		}

		for _, se := range cr.SequencingExperiments {
			for _, al := range t.Aliquots {

				if al != se.Aliquot {
					continue
				}

				var c *int
				if _, isCaseRelated := CaseRelatedTaskTypes[t.TypeCode]; isCaseRelated {
					c = cr.CaseID
				}

				err := sc.TaskRepo.CreateTaskContext(ctx, &types.TaskContext{
					TaskID:                 task.ID,
					SequencingExperimentID: se.ID,
					CaseID:                 c,
				})
				if err != nil {
					return fmt.Errorf("failed to persist task context for create_case %d and task %s: %w", cr.Index, t.TypeCode, err)
				}
			}
		}

		for _, doc := range t.InputDocuments {
			d, ok := cr.Documents[doc.Url]
			if !ok {
				return fmt.Errorf("failed to find input document by url %q for task %q in case %d", doc.Url, t.TypeCode, cr.Index)
			}

			err := sc.TaskRepo.CreateTaskHasDocument(ctx, &types.TaskHasDocument{
				TaskID:     task.ID,
				DocumentID: d.ID,
				Type:       "input",
			})
			if err != nil {
				return fmt.Errorf("failed to persist task has document for create_case %d and task %q: %w", cr.Index, t.TypeCode, err)
			}
		}

		for _, doc := range t.OutputDocuments {
			d := types.Document{
				Name:             doc.Name,
				DataCategoryCode: doc.DataCategoryCode,
				DataTypeCode:     doc.DataTypeCode,
				FileFormatCode:   doc.FormatCode,
				Size:             *doc.Size,
				Url:              doc.Url,
				Hash:             doc.Hash,
				TenantCode:       sc.TenantCode,
			}
			err := sc.DocRepo.CreateDocument(ctx, &d)
			if err != nil {
				return fmt.Errorf("failed to persist document %q for create_case %d: %w", doc.Name, cr.Index, err)
			}
			cr.Documents[doc.Url] = &d

			err = sc.TaskRepo.CreateTaskHasDocument(ctx, &types.TaskHasDocument{
				TaskID:     task.ID,
				DocumentID: d.ID,
				Type:       "output",
			})
			if err != nil {
				return fmt.Errorf("failed to persist task has document for create_case %d and task %q: %w", cr.Index, t.TypeCode, err)
			}
			cr.DocumentsInTasks[doc.Url] = append(cr.DocumentsInTasks[doc.Url], &DocumentRelation{task.ID, "output"})
		}
	}
	return nil
}

func validateCaseBatch(ctx context.Context, bv *batchval.BatchValidationContext, cases []types.CaseBatch) ([]*CaseValidationRecord, error) {
	var records []*CaseValidationRecord
	cache := batchval.NewBatchValidationCache(bv)

	visited := map[CaseKey]struct{}{}

	for idx, c := range cases {
		if err := ctx.Err(); err != nil {
			return nil, err
		}
		key := CaseKey{
			ProjectCode:     c.ProjectCode,
			SubmitterCaseID: c.SubmitterCaseId,
		}

		record, err := validateCaseRecord(ctx, bv, cache, c, idx)
		if err != nil {
			return nil, fmt.Errorf("error during case validation: %v", err)
		}

		if c.ProjectCode != "" && c.SubmitterCaseId != "" {
			batchval.ValidateUniquenessInBatch(record, key, visited, CaseIdenticalInBatch, []string{c.ProjectCode, c.SubmitterCaseId})
		}
		records = append(records, record)
	}
	return records, nil
}
