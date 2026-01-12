package main

import (
	"encoding/json"
	"fmt"
	"regexp"
	"slices"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

// FamilyMemberCodeRegExp defines a regular expression pattern that matches strings containing
// uppercase and lowercase letters (A-Z, a-z) and hyphens.
const FamilyMemberCodeRegExp = `^[A-Za-z\- ]+$`

var FamilyMemberCodeRegExpCompiled = regexp.MustCompile(FamilyMemberCodeRegExp)

// TextRegExp defines a regular expression pattern that matches strings containing
// alphanumeric characters (A-Z, a-z, 0-9), hyphens, underscores, periods, commas, colons, and spaces.
const TextRegExp = `^[A-Za-z0-9\-\_\.\,\: ]+$`

var TextRegExpCompiled = regexp.MustCompile(TextRegExp)

const (
	CaseAlreadyExists            = "CASE-001"
	InvalidFieldCase             = "CASE-002"
	UnknownProjectCode           = "CASE-003"
	UnknownDiagnosticLabCode     = "CASE-004"
	UnknownAnalysisCode          = "CASE-005"
	UnknownOrderingOrganization  = "CASE-006"
	InvalidNumberOfProbands      = "CASE-007"
	DuplicatePatientInCase       = "CASE-008"
	SeqExpNotFoundForCasePatient = "CASE-009"
	InvalidSeqExpForCaseType     = "CASE-010"
	IdenticalCaseInBatch         = "CASE-011"
)

// Patients error codes
const (
	InvalidFieldPatients = "PATIENT-004"
	PatientNotFound      = "PATIENT-006"
)

// Observations error codes
const (
	InvalidFieldObservation = "OBS-001"
)

// Sequencing Experiments error codes
const (
	SeqExpNotFound = "SEQ-007"
)

// Documents error codes
const (
	InvalidFieldDocumentCode              = "DOCUMENT-001"
	DocumentNotFoundAtURL                 = "DOCUMENT-002"
	IdenticalDocumentExists               = "DOCUMENT-003"
	DocumentExistsWithDifferentFieldValue = "DOCUMENT-004"
	DocumentAlreadyOutputOfAnotherTask    = "DOCUMENT-005"
	DocumentSizeMismatch                  = "DOCUMENT-006"
	DocumentHashMismatch                  = "DOCUMENT-007"
)

const RelationshipProbandCode = "proband"

var CaseRelatedTaskTypes = map[string]struct{}{
	"family_variant_calling":     {},
	"tumor_only_variant_calling": {},
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
	CasesRepo  *repository.CasesRepository
	DocRepo    *repository.DocumentsRepository
	ObsCatRepo *repository.ObservationCategoricalRepository
	FamilyRepo *repository.FamilyRepository
	TaskRepo   *repository.TaskRepository
}

func NewStorageContext(db *gorm.DB) *StorageContext {
	return &StorageContext{
		CasesRepo:  repository.NewCasesRepository(db),
		DocRepo:    repository.NewDocumentsRepository(db),
		ObsCatRepo: repository.NewObservationCategoricalRepository(db),
		FamilyRepo: repository.NewFamilyRepository(db),
		TaskRepo:   repository.NewTaskRepository(db),
	}
}

type CaseValidationRecord struct {
	BaseValidationRecord
	Context                *BatchValidationContext
	Case                   types.CaseBatch
	CaseID                 *int
	ProjectID              *int
	SubmitterCaseID        string
	AnalysisCatalogID      *int
	OrderingOrganizationID *int
	DiagnosisLabID         *int

	// Codes
	StatusCodes      []string
	ObservationCodes []string
	OnsetCodes       []string

	// Necessary to persist the case
	Patients              map[PatientKey]*types.Patient
	SequencingExperiments map[int]*types.SequencingExperiment
	Documents             map[string]*types.Document
	DocumentsInTasks      map[string][]*DocumentRelation
}

func NewCaseValidationRecord(ctx *BatchValidationContext, c types.CaseBatch, index int) *CaseValidationRecord {
	return &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{
			Index: index,
		},
		Case:                  c,
		Context:               ctx,
		Patients:              make(map[PatientKey]*types.Patient),
		SequencingExperiments: make(map[int]*types.SequencingExperiment),
		Documents:             make(map[string]*types.Document),
		DocumentsInTasks:      make(map[string][]*DocumentRelation),
	}
}

func (r *CaseValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *CaseValidationRecord) GetResourceType() string {
	return types.CaseBatchType
}

func (r *CaseValidationRecord) getProbandFromPatients() (*types.Patient, error) {
	for _, p := range r.Case.Patients {
		if p.RelationToProbandCode != RelationshipProbandCode {
			continue
		}

		key := PatientKey{p.PatientOrganizationCode, p.SubmitterPatientId}
		if patient, ok := r.Patients[key]; ok {
			return patient, nil
		}
		return nil, fmt.Errorf("failed to find proband patient %q for case %q", key, r.Case.SubmitterCaseId)
	}
	return nil, nil
}

func (r *CaseValidationRecord) fetchStatusCodes(ctx *BatchValidationContext) error {
	statusCodes, err := ctx.StatusRepo.GetStatusCodes()
	if err != nil {
		return fmt.Errorf("error retrieving status codes: %v", err)
	}
	r.StatusCodes = statusCodes
	return nil
}

func (r *CaseValidationRecord) fetchObservationCodes(ctx *BatchValidationContext) error {
	observationCodes, err := ctx.ObservationRepo.GetObservationCodes()
	if err != nil {
		return fmt.Errorf("error retrieving observation codes: %v", err)
	}
	r.ObservationCodes = observationCodes
	return nil
}

func (r *CaseValidationRecord) fetchOnsetCodes(ctx *BatchValidationContext) error {
	onsetCodes, err := ctx.OnsetRepo.GetOnsetCodes()
	if err != nil {
		return fmt.Errorf("error retrieving onset codes: %v", err)
	}
	r.OnsetCodes = onsetCodes
	return nil
}

func (r *CaseValidationRecord) fetchCodeInfos() error {
	if err := r.fetchStatusCodes(r.Context); err != nil {
		return fmt.Errorf("failed to retrieve status codes: %w", err)
	}
	if err := r.fetchObservationCodes(r.Context); err != nil {
		return fmt.Errorf("failed to retrieve observation codes: %w", err)
	}
	if err := r.fetchOnsetCodes(r.Context); err != nil {
		return fmt.Errorf("failed to retrieve onset codes: %w", err)
	}
	return nil
}

func (r *CaseValidationRecord) fetchProject(ctx *BatchValidationContext) error {
	p, err := ctx.ProjectRepo.GetProjectByCode(r.Case.ProjectCode)
	if err != nil {
		return fmt.Errorf("get project by code %q: %w", r.Case.ProjectCode, err)
	}
	if p != nil {
		r.ProjectID = &p.ID
	}
	return nil
}

func (r *CaseValidationRecord) fetchAnalysisCatalog(ctx *BatchValidationContext) error {
	a, err := ctx.CasesRepo.GetCaseAnalysisCatalogIdByCode(r.Case.AnalysisCode)
	if err != nil {
		return fmt.Errorf("get analysis catalog by code %q: %w", r.Case.AnalysisCode, err)
	}
	if a != nil {
		r.AnalysisCatalogID = &a.ID
	}
	return nil
}

func (r *CaseValidationRecord) fetchOrganizations(ctx *BatchValidationContext) error {
	org, err := ctx.OrgRepo.GetOrganizationByCode(r.Case.OrderingOrganizationCode)
	if err != nil {
		return fmt.Errorf("get organization by code %q: %w", r.Case.OrderingOrganizationCode, err)
	}
	if org != nil {
		r.OrderingOrganizationID = &org.ID
	}

	diagnosisLabOrg, err := ctx.OrgRepo.GetOrganizationByCode(r.Case.DiagnosticLabCode)
	if err != nil {
		return fmt.Errorf("get organization by code %q: %w", r.Case.DiagnosticLabCode, err)
	}
	if diagnosisLabOrg != nil {
		r.DiagnosisLabID = &diagnosisLabOrg.ID
	}
	return nil
}

func (r *CaseValidationRecord) fetchPatients(ctx *BatchValidationContext) error {
	for _, cp := range r.Case.Patients {
		patient, err := ctx.PatientRepo.GetPatientByOrgCodeAndSubmitterPatientId(cp.PatientOrganizationCode, cp.SubmitterPatientId)
		if err != nil {
			return fmt.Errorf("failed to get patient by org code %q and submitter patient id %q: %w", cp.PatientOrganizationCode, cp.SubmitterPatientId, err)
		}

		key := PatientKey{cp.PatientOrganizationCode, cp.SubmitterPatientId}
		if patient != nil {
			r.Patients[key] = patient
		}
	}
	return nil
}

func (r *CaseValidationRecord) fetchFromSequencingExperiments(ctx *BatchValidationContext) error {
	for _, se := range r.Case.SequencingExperiments {
		seqExp, err := ctx.SeqExpRepo.GetSequencingExperimentByAliquotAndSubmitterSample(se.Aliquot, se.SubmitterSampleId, se.SampleOrganizationCode)
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

func (cr *CaseValidationRecord) fetchSequencingExperimentsInTask(ctx *BatchValidationContext, task *types.CaseTaskBatch) error {
	seqs, err := ctx.SeqExpRepo.GetSequencingExperimentByAliquot(task.Aliquot)
	if err != nil {
		return fmt.Errorf("failed to get sequencing experiment by aliquot %q: %w", task.Aliquot, err)
	}

	for i := range seqs {
		se := &seqs[i]
		if _, exists := cr.SequencingExperiments[se.ID]; !exists {
			cr.SequencingExperiments[se.ID] = se
		}
	}

	return nil
}

func (cr *CaseValidationRecord) fetchInputDocumentsFromTask(ctx *BatchValidationContext, task *types.CaseTaskBatch) error {
	for _, doc := range task.InputDocuments {
		d, err := ctx.DocRepo.GetDocumentByUrl(doc.Url)
		if err != nil {
			return fmt.Errorf("failed to get input document by url %q: %w", doc.Url, err)
		}
		if d != nil {
			cr.Documents[doc.Url] = d
		}
	}
	return nil
}

func (cr *CaseValidationRecord) fetchOutputDocumentsFromTask(ctx *BatchValidationContext, task *types.CaseTaskBatch) error {
	for _, doc := range task.OutputDocuments {
		d, err := ctx.DocRepo.GetDocumentByUrl(doc.Url)
		if err != nil {
			return fmt.Errorf("failed to get output document by url %q: %w", doc.Url, err)
		}
		if d == nil {
			continue
		}

		cr.Documents[doc.Url] = d
		docs, err := ctx.TaskRepo.GetTaskHasDocumentByDocumentId(d.ID)
		if err != nil {
			return fmt.Errorf("failed to get task has document by document id %d: %w", d.ID, err)
		}

		for _, do := range docs {
			if _, ok := cr.DocumentsInTasks[doc.Url]; ok {
				cr.DocumentsInTasks[doc.Url] = append(cr.DocumentsInTasks[doc.Url], &DocumentRelation{
					TaskID: do.TaskID,
					Type:   do.Type,
				})
			} else {
				cr.DocumentsInTasks[doc.Url] = []*DocumentRelation{
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

func (cr *CaseValidationRecord) fetchFromTasks(ctx *BatchValidationContext) error {
	for _, t := range cr.Case.Tasks {
		if err := cr.fetchSequencingExperimentsInTask(ctx, t); err != nil {
			return fmt.Errorf("failed to fetch sequencing experiments from task: %w", err)
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

func (cr *CaseValidationRecord) fetchValidationInfos() error {

	if err := cr.fetchProject(cr.Context); err != nil {
		return fmt.Errorf("failed to resolve project: %w", err)
	}
	if err := cr.fetchAnalysisCatalog(cr.Context); err != nil {
		return fmt.Errorf("failed to resolve analysis catalog: %w", err)
	}
	if err := cr.fetchOrganizations(cr.Context); err != nil {
		return fmt.Errorf("failed to resolve organizations: %w", err)
	}
	if err := cr.fetchPatients(cr.Context); err != nil {
		return fmt.Errorf("failed to resolve patients: %w", err)
	}
	if err := cr.fetchFromSequencingExperiments(cr.Context); err != nil {
		return fmt.Errorf("failed to resolve sequencing experiments: %w", err)
	}
	if err := cr.fetchFromTasks(cr.Context); err != nil {
		return fmt.Errorf("failed to resolve tasks: %w", err)
	}
	return nil
}

func (cr *CaseValidationRecord) validateRegexPattern(path, value, code, message string, regExp *regexp.Regexp) {
	if !regExp.MatchString(value) {
		cr.addErrors(fmt.Sprintf("%s does not match the regular expression %s.", message, regExp.String()), code, path)
	}
}

func (cr *CaseValidationRecord) validateTextLength(path, value, code, message string, maxLength int) {
	if len(value) > maxLength {
		cr.addErrors(fmt.Sprintf("%s field is too long, maximum length allowed is %d.", message, maxLength), code, path)
	}
}

func (cr *CaseValidationRecord) formatPatientsInvalidFieldMessage(fieldName string, patientIndex int) string {
	return fmt.Sprintf("Invalid field %s for case %d - patient %d. Reason:",
		fieldName,
		cr.Index,
		patientIndex,
	)
}

func (cr *CaseValidationRecord) formatObservationInvalidFieldMessage(fieldName string, patientIndex int, observationType string, obsIndex int) string {
	return fmt.Sprintf("Invalid field %s for case %d - patient %d - %s %d. Reason:",
		fieldName,
		cr.Index,
		patientIndex,
		observationType,
		obsIndex,
	)
}

func (cr *CaseValidationRecord) formatTaskDocumentFieldErrorMessage(fieldName string, caseIndex, taskIndex, documentIndex int) string {
	return fmt.Sprintf("Invalid Field %s for case %d - task %d - output document %d. Reason:", fieldName, caseIndex, taskIndex, documentIndex)
}

func (cr *CaseValidationRecord) formatFieldPath(entityType string, entityIndex *int, collectionName string, collectionIndex *int) string {
	var path string
	if entityType != "" {
		path = fmt.Sprintf("case[%d].%s", cr.Index, entityType)
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
		path = fmt.Sprintf("case[%d]", cr.Index)
	}
	return path
}

func (cr *CaseValidationRecord) formatPatientsFieldPath(patientIndex *int, collectionName string, collectionIndex *int) string {
	return cr.formatFieldPath("patients", patientIndex, collectionName, collectionIndex)
}

func (cr *CaseValidationRecord) formatSeqExpFieldPath(seqExpIndex *int) string {
	return cr.formatFieldPath("sequencing_experiments", seqExpIndex, "", nil)
}

func (cr *CaseValidationRecord) validatePatientsTextField(value, fieldName, path string, patientIndex int, regExp *regexp.Regexp, observationType string, obsIndex int, required bool) {
	if !required && value == "" {
		return
	}

	var code string
	var message string
	if observationType != "" {
		code = InvalidFieldObservation
		message = cr.formatObservationInvalidFieldMessage(fieldName, patientIndex, observationType, obsIndex)
	} else {
		code = InvalidFieldPatients
		message = cr.formatPatientsInvalidFieldMessage(fieldName, patientIndex)
	}
	cr.validateRegexPattern(path, value, code, message, regExp)
	cr.validateTextLength(path, value, code, message, TextMaxLength)
}

func (cr *CaseValidationRecord) validatePatientTextField(value, fieldName, path string, patientIndex int, regExp *regexp.Regexp, regExpStr string, required bool) {
	message := cr.formatPatientsInvalidFieldMessage(fieldName, patientIndex)
	cr.validateTextField(value, path, regExp, regExpStr, required, message, InvalidFieldPatients)
}

func (cr *CaseValidationRecord) validateObservationTextField(value, fieldName, path string, patientIndex int, regExp *regexp.Regexp, regExpStr string, required bool, observationType string, obsIndex int) {
	message := cr.formatObservationInvalidFieldMessage(fieldName, patientIndex, observationType, obsIndex)
	cr.validateTextField(value, path, regExp, regExpStr, required, message, InvalidFieldObservation)
}

func (cr *CaseValidationRecord) validateCodeField(code, fieldName, path, codeType string, patientIndex int, validCodes []string, observationType string, obsIndex int) {
	if !slices.Contains(validCodes, code) {
		var message string
		message = cr.formatObservationInvalidFieldMessage(fieldName, patientIndex, observationType, obsIndex)
		msg := fmt.Sprintf("%s %s %q is not a valid %s.", message, codeType, code, codeType)
		cr.addErrors(msg, InvalidFieldObservation, path) // OBS-001
	}
}

// Family History validation

func (cr *CaseValidationRecord) validateFamilyMemberCode(patientIndex int, fhIndex int) {
	fh := cr.Case.Patients[patientIndex].FamilyHistory[fhIndex]
	fieldName := "family_member_code"
	path := cr.formatPatientsFieldPath(&patientIndex, "family_history", &fhIndex)
	cr.validateTextField(fh.FamilyMemberCode, fieldName, path, patientIndex, FamilyMemberCodeRegExpCompiled, "", 0, true)
}

func (cr *CaseValidationRecord) validateCondition(patientIndex int, fhIndex int) {
	fh := cr.Case.Patients[patientIndex].FamilyHistory[fhIndex]
	fieldName := "condition"
	path := cr.formatPatientsFieldPath(&patientIndex, "family_history", &fhIndex)
	cr.validatePatientsTextField(fh.Condition, fieldName, path, patientIndex, TextRegExpCompiled, "", 0, true)
}

func (cr *CaseValidationRecord) validateFamilyHistory(patientIndex int) {
	for fhIndex := range cr.Case.Patients[patientIndex].FamilyHistory {
		cr.validateFamilyMemberCode(patientIndex, fhIndex)
		cr.validateCondition(patientIndex, fhIndex)
	}
}

// Observations Categorical validation

func (cr *CaseValidationRecord) validateObsCategoricalCode(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
	fieldName := "code"
	path := cr.formatPatientsFieldPath(&patientIndex, "observations_categorical", &obsIndex)
	cr.validateCodeField(obs.Code, fieldName, path, "observation code", patientIndex, cr.ObservationCodes, "observations_categorical", obsIndex)
}

func (cr *CaseValidationRecord) validateSystem(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
	fieldName := "system"
	path := cr.formatPatientsFieldPath(&patientIndex, "observations_categorical", &obsIndex)
	cr.validatePatientsTextField(obs.System, fieldName, path, patientIndex, TextRegExpCompiled, "observations_categorical", obsIndex, true)
}

func (cr *CaseValidationRecord) validateValue(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
	fieldName := "value"
	path := cr.formatPatientsFieldPath(&patientIndex, "observations_categorical", &obsIndex)
	cr.validatePatientsTextField(obs.Value, fieldName, path, patientIndex, TextRegExpCompiled, "observations_categorical", obsIndex, true)
}

func (cr *CaseValidationRecord) validateOnsetCode(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
	fieldName := "onset_code"
	path := cr.formatPatientsFieldPath(&patientIndex, "observations_categorical", &obsIndex)
	cr.validateCodeField(obs.OnsetCode, fieldName, path, "onset code", patientIndex, cr.OnsetCodes, "observations_categorical", obsIndex)
}

func (cr *CaseValidationRecord) validateObsCategoricalNote(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
	fieldName := "note"
	path := cr.formatPatientsFieldPath(&patientIndex, "observations_categorical", &obsIndex)
	cr.validatePatientsTextField(obs.Note, fieldName, path, patientIndex, TextRegExpCompiled, "observations_categorical", obsIndex, false)
}

func (cr *CaseValidationRecord) validateObservationsCategorical(patientIndex int) error {
	for obsIndex := range cr.Case.Patients[patientIndex].ObservationsCategorical {
		cr.validateObsCategoricalCode(patientIndex, obsIndex)
		cr.validateSystem(patientIndex, obsIndex)
		cr.validateValue(patientIndex, obsIndex)
		cr.validateOnsetCode(patientIndex, obsIndex)
		cr.validateObsCategoricalNote(patientIndex, obsIndex)
	}
	return nil
}

// Observations Text validation

func (cr *CaseValidationRecord) validateObsTextCode(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsText[obsIndex]
	fieldName := "code"
	path := cr.formatPatientsFieldPath(&patientIndex, "observations_text", &obsIndex)
	cr.validateCodeField(obs.Code, fieldName, path, "observation code", patientIndex, cr.ObservationCodes, "observations_text", obsIndex)
}

func (cr *CaseValidationRecord) validateObsTextValue(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsText[obsIndex]
	fieldName := "value"
	path := cr.formatPatientsFieldPath(&patientIndex, "observations_text", &obsIndex)
	cr.validatePatientsTextField(obs.Value, fieldName, path, patientIndex, TextRegExpCompiled, "observations_text", obsIndex, true)
}

func (cr *CaseValidationRecord) validateObservationsText(patientIndex int) error {
	for obsIndex := range cr.Case.Patients[patientIndex].ObservationsText {
		cr.validateObsTextCode(patientIndex, obsIndex)
		cr.validateObsTextValue(patientIndex, obsIndex)
	}
	return nil
}

// Case patient validation

func (cr *CaseValidationRecord) validatePatient(patientIndex int) {
	p := cr.Case.Patients[patientIndex]
	_, exists := cr.Patients[PatientKey{p.PatientOrganizationCode, p.SubmitterPatientId}]
	if !exists {
		path := cr.formatPatientsFieldPath(&patientIndex, "", nil)
		message := fmt.Sprintf("Patient (%s / %s) for case %d - patient %d does not exist.",
			p.PatientOrganizationCode,
			p.SubmitterPatientId,
			cr.Index,
			patientIndex,
		)
		cr.addErrors(message, PatientNotFound, path)
	}
}

func (cr *CaseValidationRecord) validatePatientUniquenessInCase(patientIndex int, visited map[PatientKey]struct{}) {
	p := cr.Case.Patients[patientIndex]
	patientKey := PatientKey{
		OrganizationCode:   p.PatientOrganizationCode,
		SubmitterPatientId: p.SubmitterPatientId,
	}
	if _, exists := visited[patientKey]; exists {
		path := cr.formatPatientsFieldPath(nil, "", nil)
		message := fmt.Sprintf("Duplicate patient (%s / %s) for case %d.",
			p.PatientOrganizationCode,
			p.SubmitterPatientId,
			cr.Index,
		)
		cr.addErrors(message, DuplicatePatientInCase, path)
	}
	visited[patientKey] = struct{}{}
}

func (cr *CaseValidationRecord) validateCasePatients() error {
	nbProband := 0
	visitedPatients := map[PatientKey]struct{}{}

	for patientIndex := range cr.Case.Patients {
		// Validate uniqueness of patients in case
		cr.validatePatientUniquenessInCase(patientIndex, visitedPatients)

		// Validate patient exists in organization
		cr.validatePatient(patientIndex)

		if cr.Case.Patients[patientIndex].RelationToProbandCode == "proband" {
			nbProband++
		}

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
		message := fmt.Sprintf("Case %d should have exactly 1 proband.", cr.Index)
		path := cr.formatFieldPath("patients", nil, "", nil)
		cr.addErrors(message, InvalidNumberOfProbands, path)
	}

	return nil
}

func (cr *CaseValidationRecord) validateSeqExp(seqExpIndex int) error {
	se := cr.Case.SequencingExperiments[seqExpIndex]
	seqExp, err := cr.Context.SeqExpRepo.GetSequencingExperimentByAliquotAndSubmitterSample(se.Aliquot, se.SubmitterSampleId, se.SampleOrganizationCode) // TODO use cache from context
	if err != nil {
		return fmt.Errorf("error getting existing sequencing experiment: %v", err)
	}
	if seqExp == nil {
		path := cr.formatSeqExpFieldPath(&seqExpIndex)
		message := fmt.Sprintf("Sequencing experiment (%s / %s / %s) does not exist.",
			se.SampleOrganizationCode,
			se.SubmitterSampleId,
			se.Aliquot,
		)
		cr.addErrors(message, SeqExpNotFound, path)
	}
	return nil
}

func (cr *CaseValidationRecord) validateSeqExpSample(seqExpIndex int) (*types.Sample, error) {
	se := cr.Case.SequencingExperiments[seqExpIndex]
	sample, err := cr.Context.SampleRepo.GetSampleByOrgCodeAndSubmitterSampleId(se.SampleOrganizationCode, se.SubmitterSampleId) // TODO use cache from context
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
		message := fmt.Sprintf("Sequencing experiment (%s / %s / %s) does not belong to any patient from case %d.",
			se.SampleOrganizationCode,
			se.SubmitterSampleId,
			se.Aliquot,
			cr.Index,
		)
		cr.addErrors(message, SeqExpNotFoundForCasePatient, path)
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
		message := fmt.Sprintf("Tumor sequencing experiment (%s / %s / %s) should not be sequenced in a germline case for case %d - sequencing experiment %d.",
			se.SampleOrganizationCode,
			se.SubmitterSampleId,
			se.Aliquot,
			cr.Index,
			seqExpIndex,
		)
		cr.addErrors(message, InvalidSeqExpForCaseType, path)
	}
	return nil
}

func (cr *CaseValidationRecord) validateCaseSequencingExperiments() error {
	for seqExpIndex := range cr.Case.SequencingExperiments {
		err := cr.validateSeqExp(seqExpIndex)
		if err != nil {
			return fmt.Errorf("error validating sequencing experiment in organization for sequencing experiment index %d: %v", seqExpIndex, err)
		}
		sample, err := cr.validateSeqExpSample(seqExpIndex)
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

func (cr *CaseValidationRecord) formatCasesInvalidFieldMessage(fieldName string) string {
	return fmt.Sprintf("Invalid field %s for case %d. Reason:",
		fieldName,
		cr.Index,
	)
}

func (cr *CaseValidationRecord) validateCaseField(value, fieldName, path string, regExp *regexp.Regexp, maxLength int, required bool) {
	if !required && value == "" {
		return
	}

	var message string
	message = cr.formatCasesInvalidFieldMessage(fieldName)
	cr.validateRegexPattern(path, value, InvalidFieldCase, message, regExp)
	cr.validateTextLength(path, value, InvalidFieldCase, message, maxLength)
}

func (cr *CaseValidationRecord) validateStatusCode() {
	if !slices.Contains(cr.StatusCodes, cr.Case.StatusCode) {
		path := formatPath(cr, "")
		message := fmt.Sprintf("%s status code %q is not a valid status code.", cr.formatCasesInvalidFieldMessage("status_code"), cr.Case.StatusCode)
		cr.addErrors(message, InvalidFieldCase, path)
	}
}

func (cr *CaseValidationRecord) validateCase() error {
	path := formatPath(cr, "")

	// Validate data in DB
	if cr.ProjectID == nil {
		message := fmt.Sprintf("Project %s for case %d does not exist.", cr.Case.ProjectCode, cr.Index)
		cr.addErrors(message, UnknownProjectCode, path) // CASE-003
	}
	if cr.Case.DiagnosticLabCode != "" && cr.DiagnosisLabID == nil {
		message := fmt.Sprintf("Diagnostic lab %q for case %d does not exist.", cr.Case.DiagnosticLabCode, cr.Index)
		cr.addErrors(message, UnknownDiagnosticLabCode, path) // CASE-004
	}
	if cr.Case.AnalysisCode != "" && cr.AnalysisCatalogID == nil {
		message := fmt.Sprintf("Analysis %q for case %d does not exist.", cr.Case.AnalysisCode, cr.Index)
		cr.addErrors(message, UnknownAnalysisCode, path) // CASE-005
	}
	if cr.Case.OrderingOrganizationCode != "" && cr.OrderingOrganizationID == nil {
		message := fmt.Sprintf("Ordering organization %q for case %d does not exist.", cr.Case.OrderingOrganizationCode, cr.Index)
		cr.addErrors(message, UnknownOrderingOrganization, path) // CASE-006
	}

	// Validate fields
	cr.validateCaseField(cr.Case.SubmitterCaseId, "submitter_case_id", path, ExternalIdRegexpCompiled, TextMaxLength, false)
	cr.validateStatusCode()
	cr.validateCaseField(cr.Case.PrimaryConditionCodeSystem, "primary_condition_code_system", path, TextRegExpCompiled, TextMaxLength, false) // TODO: validate regex
	cr.validateCaseField(cr.Case.PrimaryConditionValue, "primary_condition_value", path, TextRegExpCompiled, TextMaxLength, false)            // TODO: validate regex
	cr.validateCaseField(cr.Case.ResolutionStatusCode, "resolution_status_code", path, TextRegExpCompiled, TextMaxLength, false)              // TODO: validate regex
	cr.validateCaseField(cr.Case.Note, "note", path, TextRegExpCompiled, TextMaxLength, false)                                                // TODO: validate regex
	cr.validateCaseField(cr.Case.OrderingPhysician, "ordering_physician", path, TextRegExpCompiled, TextMaxLength, false)                     // TODO: validate regex

	// Validate case uniqueness in DB
	if cr.ProjectID != nil && cr.Case.SubmitterCaseId != "" {
		c, err := cr.Context.CasesRepo.GetCaseBySubmitterCaseIdAndProjectId(cr.Case.SubmitterCaseId, *cr.ProjectID)
		if err != nil {
			return fmt.Errorf("error checking for existing case with submitter_case_id %q and project_id %d: %v", cr.Case.SubmitterCaseId, *cr.ProjectID, err)
		}
		if c != nil {
			cr.Skipped = true
			message := fmt.Sprintf("Case (%d / %s) already exists, skipped.", *cr.ProjectID, cr.Case.SubmitterCaseId)
			cr.addErrors(message, CaseAlreadyExists, path) // CASE-001
		}
	}
	return nil
}

// Documents validation

func (cr *CaseValidationRecord) validateExistingDocument(new *types.OutputDocumentBatch, existing *types.Document, path string) {
	diffs := []struct {
		name     string
		new      interface{}
		existing interface{}
	}{
		{"format_code", new.FormatCode, existing.FileFormatCode},
		{"name", new.Name, existing.Name},
		{"data_type_code", new.DataTypeCode, existing.DataTypeCode},
		{"data_category_code", new.DataCategoryCode, existing.DataCategoryCode},
		{"size", new.Size, existing.Size},
		{"hash", new.Hash, existing.Hash},
	}

	var isDiff bool
	for _, d := range diffs {
		if d.new != d.existing {
			isDiff = true
			msg := fmt.Sprintf("A document with same url %s has been found but with a different %s (%v <> %v).", new.Url, d.name, d.existing, d.new)
			cr.addWarnings(msg, DocumentExistsWithDifferentFieldValue, path)
		}
	}

	if !isDiff {
		msg := fmt.Sprintf("Document %s already exists, skipped.", new.Url)
		cr.addInfos(msg, IdenticalDocumentExists, path)
	}
}

func (cr *CaseValidationRecord) validateDocumentTextField(fieldValue, fieldName string, path string, taskIndex int, documentIndex int, regExp *regexp.Regexp, regExpStr string, required bool) {
	msg := cr.formatTaskDocumentFieldErrorMessage(fieldName, fieldValue, cr.Index, taskIndex, documentIndex)
	cr.validateTextField(fieldValue, path, regExp, regExpStr, required, msg, InvalidFieldDocumentCode)
}

func (cr *CaseValidationRecord) validateDocumentIsOutputOfAnotherTask(doc *types.Document, path string) {
	relatedDocs := cr.DocumentsInTasks[doc.Url]

	isOutput := false
	for _, dr := range relatedDocs {
		if dr.Type == "output" {
			isOutput = true
			break
		}
	}

	if isOutput {
		msg := fmt.Sprintf("A document with same url %s has been found in the output of a different task.", doc.Url)
		cr.addErrors(msg, DocumentAlreadyOutputOfAnotherTask, path)
	}
}

func (cr *CaseValidationRecord) validateFileMetadata(doc *types.OutputDocumentBatch, path string, taskIndex, docIndex int) error {
	metadata, err := cr.Context.S3FS.GetMetadata(doc.Url)
	if err != nil {
		return err
	}
	if metadata == nil {
		cr.addErrors(
			fmt.Sprintf(
				"No document can be found on the URL %s for case %d - task %d - output document %d.",
				doc.Url,
				cr.Index,
				taskIndex,
				docIndex,
			), DocumentNotFoundAtURL, path)
		return nil
	}

	if metadata.Size != doc.Size {
		msg := fmt.Sprintf("Document size does not match the actual size of the document %s for case %d - task %d - output document %d.", doc.Url, cr.Index, taskIndex, docIndex)
		cr.addErrors(msg, DocumentSizeMismatch, path)
	}

	if metadata.Hash != doc.Hash {
		msg := fmt.Sprintf("Document hash does not match the actual hash of the document %s for case %d - task %d - output document %d.", doc.Url, cr.Index, taskIndex, docIndex)
		cr.addErrors(msg, DocumentHashMismatch, path)
	}
	return nil
}

func (cr *CaseValidationRecord) validateDocuments() error {
	for tid, t := range cr.Case.Tasks {
		for did, doc := range t.OutputDocuments {
			path := fmt.Sprintf("case[%d].tasks[%d].output_documents[%d]", cr.Index, tid, did)
			if d, ok := cr.Documents[doc.Url]; ok {
				cr.validateExistingDocument(doc, d, path)
				cr.validateDocumentIsOutputOfAnotherTask(d, path)
				continue
			}

			cr.validateDocumentTextField(doc.Url, "url", path, tid, did, nil, "", true)
			cr.validateDocumentTextField(doc.Hash, "hash", path, tid, did, nil, "", true)
			cr.validateDocumentTextField(doc.FormatCode, "format_code", path, tid, did, nil, "", true)
			cr.validateDocumentTextField(doc.Name, "name", path, tid, did, nil, "", true)
			cr.validateDocumentTextField(doc.DataTypeCode, "data_type_code", path, tid, did, nil, "", true)
			cr.validateDocumentTextField(doc.DataCategoryCode, "data_category_code", path, tid, did, nil, "", true)

			if doc.Size < 0 {
				msg := fmt.Sprintf(
					"%s size is invalid, must be non-negative.",
					cr.formatTaskDocumentFieldErrorMessage("size", fmt.Sprintf("%d", doc.Size), cr.Index, tid, did),
				)
				cr.addErrors(msg, InvalidFieldDocumentCode, path)
			}

			if err := cr.validateFileMetadata(doc, path, tid, did); err != nil {
				return fmt.Errorf("error validating file metadata for case %d - document %d: %v", cr.Index, tid, err)
			}
		}
	}
	return nil
}

func validateCaseRecord(
	ctx *BatchValidationContext,
	c types.CaseBatch,
	index int,
) (*CaseValidationRecord, error) {
	cr := NewCaseValidationRecord(ctx, c, index)

	// TODO: optimize by fetching all codes at once outside of the record
	if unexpectedErr := cr.fetchCodeInfos(); unexpectedErr != nil {
		return nil, fmt.Errorf("error during pre-fetching code infos: %v", unexpectedErr)
	}

	if unexpectedErr := cr.fetchValidationInfos(); unexpectedErr != nil {
		return nil, fmt.Errorf("error during pre-fetching case validation info: %v", unexpectedErr)
	}

	// 1. Validate Case fields
	unexpectedErr := cr.validateCase()
	if unexpectedErr != nil {
		return nil, fmt.Errorf("error during case validation: %v", unexpectedErr)
	}

	// 2. Validate Case Patients
	unexpectedErr = cr.validateCasePatients()
	if unexpectedErr != nil {
		return nil, fmt.Errorf("error during case patients validation: %v", unexpectedErr)
	}

	// 3. Validate Case Sequencing Experiments
	if unexpectedErr := cr.validateCaseSequencingExperiments(); unexpectedErr != nil {
		return nil, fmt.Errorf("error during case sequencing experiments validation: %v", unexpectedErr)
	}

	// 4. Validate Case Tasks

	// 5. Validate Case Documents
	if err := cr.validateDocuments(); err != nil {
		return nil, fmt.Errorf("error validating documents: %w", err)
	}

	return cr, nil
}

func processCaseBatch(ctx *BatchValidationContext, batch *types.Batch, db *gorm.DB) {
	payload := []byte(batch.Payload)
	var caseBatches []types.CaseBatch

	if unexpectedErr := json.Unmarshal(payload, &caseBatches); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling case batch: %v", unexpectedErr), ctx.BatchRepo)
		return
	}

	records, unexpectedErr := validateCaseBatch(ctx, caseBatches)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error case batch validation: %v", unexpectedErr), ctx.BatchRepo)
		return
	}

	glog.Infof("Case batch %v processed with %d records", batch.ID, len(records))

	err := persistBatchAndCaseRecords(db, batch, records)
	if err != nil {
		processUnexpectedError(batch, fmt.Errorf("error processing case batch records: %v", err), ctx.BatchRepo)
		return
	}
}

func persistBatchAndCaseRecords(db *gorm.DB, batch *types.Batch, records []*CaseValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		batchRepo := repository.NewBatchRepository(tx)
		txCtx := NewStorageContext(tx)
		rowsUpdated, unexpectedErrUpdate := updateBatch(batch, records, batchRepo)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating case batch %v", batch.ID)
		}
		if batch.DryRun || batch.Status != types.BatchStatusSuccess {
			return nil
		}

		if err := persistCaseRecords(txCtx, records); err != nil {
			return fmt.Errorf("error during case insertion %w", err)
		}

		return nil
	})
}

func persistCase(ctx *StorageContext, cr *CaseValidationRecord) error {
	if cr.ProjectID == nil {
		return fmt.Errorf("project ID is nil for case %q", cr.Case.SubmitterCaseId)
	}

	if cr.AnalysisCatalogID == nil {
		return fmt.Errorf("analysis catalog ID is nil for case %q", cr.Case.SubmitterCaseId)
	}

	if cr.OrderingOrganizationID == nil {
		return fmt.Errorf("ordering organization ID is nil for case %q", cr.Case.SubmitterCaseId)
	}

	if cr.DiagnosisLabID == nil {
		return fmt.Errorf("diagnosis lab ID is nil for case %q", cr.Case.SubmitterCaseId)
	}

	proband, err := cr.getProbandFromPatients()
	if err != nil {
		return fmt.Errorf("failed to get proband patient %w", err)
	}
	if proband == nil {
		return fmt.Errorf("proband patient not found for case %q", cr.Case.SubmitterCaseId)
	}

	c := types.Case{
		ProbandID:              proband.ID,
		ProjectID:              *cr.ProjectID,
		AnalysisCatalogID:      *cr.AnalysisCatalogID,
		CaseTypeCode:           cr.Case.Type,
		CaseCategoryCode:       cr.Case.CategoryCode,
		PriorityCode:           cr.Case.PriorityCode,
		StatusCode:             cr.Case.StatusCode,
		ResolutionStatusCode:   cr.Case.ResolutionStatusCode,
		PrimaryCondition:       cr.Case.PrimaryConditionValue,
		ConditionCodeSystem:    cr.Case.PrimaryConditionCodeSystem,
		OrderingPhysician:      cr.Case.OrderingPhysician,
		OrderingOrganizationID: *cr.OrderingOrganizationID,
		DiagnosisLabID:         *cr.DiagnosisLabID,
		SubmitterCaseID:        cr.Case.SubmitterCaseId,
		Note:                   cr.Case.Note,
	}

	if err := ctx.CasesRepo.CreateCase(&c); err != nil {
		return fmt.Errorf("failed to persist case %w", err)
	}

	cr.CaseID = &c.ID

	// Persist CaseHasSequencingExperiment relationships
	for _, se := range cr.SequencingExperiments {
		chse := types.CaseHasSequencingExperiment{
			CaseID:                 c.ID, // Gorm automatically sets the ID on the struct after creation
			SequencingExperimentID: se.ID,
		}

		err := ctx.CasesRepo.CreateCaseHasSequencingExperiment(&chse)
		if err != nil {
			return fmt.Errorf("failed to persist case has sequencing experiment for case %q and sequencing experiment %q: %w", cr.Case.SubmitterCaseId, se.ID, err)
		}
	}

	return nil
}

func persistCaseRecords(
	ctx *StorageContext,
	records []*CaseValidationRecord,
) error {
	for _, record := range records {
		if record.Skipped {
			continue
		}
		if err := persistCase(ctx, record); err != nil {
			return fmt.Errorf("failed to persist case for case %q: %w", record.Case.SubmitterCaseId, err)
		}
		if record.CaseID == nil {
			return fmt.Errorf("case ID is nil after persisting case for case %q", record.Case.SubmitterCaseId)
		}
		if err := persistFamily(ctx, record); err != nil {
			return fmt.Errorf("failed to persist family for case %q: %w", record.Case.SubmitterCaseId, err)
		}
		if err := persistObservationCategorical(ctx, record); err != nil {
			return fmt.Errorf("failed to persist observations for case %q: %w", record.Case.SubmitterCaseId, err)
		}
		if err := persistTask(ctx, record); err != nil {
			return fmt.Errorf("failed to persist tasks for case %q: %w", record.Case.SubmitterCaseId, err)
		}
	}
	return nil
}

func persistFamily(ctx *StorageContext, cr *CaseValidationRecord) error {
	for _, p := range cr.Case.Patients {

		key := PatientKey{p.PatientOrganizationCode, p.SubmitterPatientId}
		patient, ok := cr.Patients[key]
		if !ok {
			return fmt.Errorf("failed to find patient for family member %q in case %q", p.SubmitterPatientId, cr.Case.SubmitterCaseId)
		}
		familyMember := types.Family{
			CaseID:                    *cr.CaseID,
			FamilyMemberID:            patient.ID,
			RelationshipToProbandCode: p.RelationToProbandCode,
			AffectedStatusCode:        p.AffectedStatusCode,
		}
		if err := ctx.FamilyRepo.CreateFamily(&familyMember); err != nil {
			return fmt.Errorf("failed to persist family member %q for case %q: %w", p.SubmitterPatientId, cr.Case.SubmitterCaseId, err)
		}
	}
	return nil
}

func persistObservationCategorical(ctx *StorageContext, cr *CaseValidationRecord) error {
	for _, p := range cr.Case.Patients {

		key := PatientKey{p.PatientOrganizationCode, p.SubmitterPatientId}
		patient, ok := cr.Patients[key]
		if !ok {
			return fmt.Errorf("failed to find patient for observations for patient %q in case %q", p.SubmitterPatientId, cr.Case.SubmitterCaseId)
		}

		for _, o := range p.ObservationsCategorical {
			obs := types.ObsCategorical{
				CaseID:             *cr.CaseID,
				PatientID:          patient.ID,
				ObservationCode:    o.Code,
				CodingSystem:       o.System,
				CodeValue:          o.Value,
				OnsetCode:          o.OnsetCode,
				InterpretationCode: o.InterpretationCode,
				Note:               o.Note,
			}

			if err := ctx.ObsCatRepo.CreateObservationCategorical(&obs); err != nil {
				return fmt.Errorf("failed to persist observation categorical for patient %q in case %q: %w", p.SubmitterPatientId, cr.Case.SubmitterCaseId, err)
			}
		}
	}
	return nil
}

func persistTask(ctx *StorageContext, cr *CaseValidationRecord) error {
	for _, t := range cr.Case.Tasks {
		task := types.Task{
			TaskTypeCode:    t.TypeCode,
			PipelineName:    t.PipelineName,
			PipelineVersion: t.PipelineVersion,
			GenomeBuild:     t.GenomeBuild,
		}
		err := ctx.TaskRepo.CreateTask(&task)
		if err != nil {
			return fmt.Errorf("failed to persist task for case %q: %w", cr.Case.SubmitterCaseId, err)
		}

		for _, se := range cr.SequencingExperiments {

			// Aliquot must match to create TaskContext relationship with SequencingExperiment and Task
			if se.Aliquot != t.Aliquot {
				continue
			}

			var c *int
			if _, isCaseRelated := CaseRelatedTaskTypes[t.TypeCode]; isCaseRelated {
				c = cr.CaseID
			}

			err := ctx.TaskRepo.CreateTaskContext(&types.TaskContext{
				TaskID:                 task.ID,
				SequencingExperimentID: se.ID,
				CaseID:                 c,
			})
			if err != nil {
				return fmt.Errorf("failed to persist task context for case %q and task %q: %w", cr.Case.SubmitterCaseId, t.TypeCode, err)
			}
		}

		for _, doc := range t.InputDocuments {
			d, ok := cr.Documents[doc.Url]
			if !ok {
				return fmt.Errorf("failed to find input document by url %q for task %q in case %q", doc.Url, t.TypeCode, cr.Case.SubmitterCaseId)
			}

			err := ctx.TaskRepo.CreateTaskHasDocument(&types.TaskHasDocument{
				TaskID:     task.ID,
				DocumentID: d.ID,
				Type:       "input",
			})
			if err != nil {
				return fmt.Errorf("failed to persist task has document for case %q and task %q: %w", cr.Case.SubmitterCaseId, t.TypeCode, err)
			}
		}

		for _, doc := range t.OutputDocuments {
			d := types.Document{
				Name:             doc.Name,
				DataCategoryCode: doc.DataCategoryCode,
				DataTypeCode:     doc.DataTypeCode,
				FileFormatCode:   doc.FormatCode,
				Size:             doc.Size,
				Url:              doc.Url,
				Hash:             doc.Hash,
			}
			err := ctx.DocRepo.CreateDocument(&d)
			if err != nil {
				return fmt.Errorf("failed to persist document %q for case %q: %w", doc.Name, cr.Case.SubmitterCaseId, err)
			}

			err = ctx.TaskRepo.CreateTaskHasDocument(&types.TaskHasDocument{
				TaskID:     task.ID,
				DocumentID: d.ID,
				Type:       "output",
			})
			if err != nil {
				return fmt.Errorf("failed to persist task has document for case %q and task %q: %w", cr.Case.SubmitterCaseId, t.TypeCode, err)
			}
		}
	}
	return nil
}

func validateCaseBatch(ctx *BatchValidationContext, cases []types.CaseBatch) ([]*CaseValidationRecord, error) {
	var records []*CaseValidationRecord
	visited := map[CaseKey]struct{}{}

	for idx, c := range cases {
		key := CaseKey{
			ProjectCode:     c.ProjectCode,
			SubmitterCaseID: c.SubmitterCaseId,
		}

		record, err := validateCaseRecord(ctx, c, idx)
		if err != nil {
			return nil, fmt.Errorf("error during case validation: %v", err)
		}

		validateUniquenessInBatch(record, key, visited, IdenticalCaseInBatch, []string{c.ProjectCode, c.SubmitterCaseId})
		records = append(records, record)
	}
	return records, nil
}
