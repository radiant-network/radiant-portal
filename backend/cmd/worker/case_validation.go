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
	IdenticalCaseInBatchCode = "CASE-001"
	InvalidNumberOfProbands  = "CASE-007"
	DuplicatePatientInCase   = "CASE-008"
)

// Patients error codes
const (
	InvalidFieldPatientsCode = "PATIENT-004"
	PatientNotFoundCode      = "PATIENT-006"
)

// Observations error codes
const (
	InvalidFieldObservationCode = "OBS-001"
)

var CaseRelatedTaskTypes = map[string]struct{}{
	"family_variant_calling":     {},
	"tumor_only_variant_calling": {},
}

type CaseKey struct {
	ProjectCode     string
	SubmitterCaseID string
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

	// Necessary to persist the case
	Patients              map[string]*types.Patient
	SequencingExperiments map[int]*types.SequencingExperiment
	Documents             map[string]*types.Document
}

func NewCaseValidationRecord(ctx *BatchValidationContext, c types.CaseBatch, index int) *CaseValidationRecord {
	return &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{
			Index: index,
		},
		Case:                  c,
		Context:               ctx,
		Patients:              make(map[string]*types.Patient),
		SequencingExperiments: make(map[int]*types.SequencingExperiment),
		Documents:             make(map[string]*types.Document),
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
		if p.RelationToProbandCode == "proband" {
			if patient, ok := r.Patients[fmt.Sprintf("%s/%s", p.PatientOrganizationCode, p.SubmitterPatientId)]; ok {
				return patient, nil
			}
			return nil, fmt.Errorf("failed to find proband patient for case %q", r.Case.SubmitterCaseId)
		}
	}
	return nil, nil
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
		patients, err := ctx.PatientRepo.GetPatientByOrgCodeAndSubmitterPatientId(cp.PatientOrganizationCode, cp.SubmitterPatientId)
		if err != nil {
			return fmt.Errorf("failed to get patient by org code %q and submitter patient id %q: %w", cp.PatientOrganizationCode, cp.SubmitterPatientId, err)
		}
		if patients != nil {
			r.Patients[fmt.Sprintf("%s/%s", cp.PatientOrganizationCode, cp.SubmitterPatientId)] = patients
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

func (r *CaseValidationRecord) fetchFromTasks(ctx *BatchValidationContext) error {
	for _, t := range r.Case.Tasks {
		seqs, err := ctx.SeqExpRepo.GetSequencingExperimentByAliquot(t.Aliquot)
		if err != nil {
			return fmt.Errorf("failed to get sequencing experiment by aliquot %q: %w", t.Aliquot, err)
		}

		for i := range seqs {
			se := &seqs[i]
			if _, exists := r.SequencingExperiments[se.ID]; !exists {
				r.SequencingExperiments[se.ID] = se
			}
		}

		for _, doc := range t.InputDocuments {
			d, err := ctx.DocRepo.GetDocumentByUrl(doc.Url)
			if err != nil {
				return fmt.Errorf("failed to get document by url %q: %w", doc.Url, err)
			}
			if d != nil {
				r.Documents[doc.Url] = d
			}
		}
	}
	return nil
}

func (r *CaseValidationRecord) fetchValidationInfos() error {

	if err := r.fetchProject(r.Context); err != nil {
		return fmt.Errorf("failed to resolve project: %w", err)
	}
	if err := r.fetchAnalysisCatalog(r.Context); err != nil {
		return fmt.Errorf("failed to resolve analysis catalog: %w", err)
	}
	if err := r.fetchOrganizations(r.Context); err != nil {
		return fmt.Errorf("failed to resolve organizations: %w", err)
	}
	if err := r.fetchPatients(r.Context); err != nil {
		return fmt.Errorf("failed to resolve patients: %w", err)
	}
	if err := r.fetchFromSequencingExperiments(r.Context); err != nil {
		return fmt.Errorf("failed to resolve sequencing experiments: %w", err)
	}
	if err := r.fetchFromTasks(r.Context); err != nil {
		return fmt.Errorf("failed to resolve tasks: %w", err)
	}
	return nil
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

		validateUniquenessInBatch(record, key, visited, IdenticalCaseInBatchCode, []string{c.ProjectCode, c.SubmitterCaseId})
		records = append(records, record)
	}
	return records, nil
}

func (cr *CaseValidationRecord) formatPatientsErrorMessage(fieldName string, patientIndex int) string {
	p := cr.Case.Patients[patientIndex]
	return fmt.Sprintf("Invalid field %s for case %s - patient %s. Reason:",
		fieldName,
		formatIds([]string{cr.Case.ProjectCode, cr.Case.SubmitterCaseId}),
		formatIds([]string{p.PatientOrganizationCode, p.SubmitterPatientId}),
	)
}

func (cr *CaseValidationRecord) formatPatientsFieldPath(patientIndex int, collectionName string, collectionIndex int, fieldName string) string {
	path := fmt.Sprintf("case[%d].patients[%d]", cr.Index, patientIndex)
	if collectionName != "" {
		path = fmt.Sprintf("%s.%s[%d]", path, collectionName, collectionIndex)
	}
	if fieldName != "" {
		path = fmt.Sprintf("%s.%s", path, fieldName)
	}
	return path
}

func (cr *CaseValidationRecord) validateTextField(value, fieldName, path string, patientIndex int, regExp *regexp.Regexp, regExpStr string, required bool) {
	if !required && value == "" {
		return
	}

	message := cr.formatPatientsErrorMessage(fieldName, patientIndex)

	if !regExp.MatchString(value) {
		msg := fmt.Sprintf("%s does not match the regular expression %s.", message, regExpStr)
		cr.addErrors(msg, InvalidFieldPatientsCode, path)
	}

	if len(value) > TextMaxLength {
		msg := fmt.Sprintf("%s field is too long, maximum length allowed is %d.", message, TextMaxLength)
		cr.addErrors(msg, InvalidFieldPatientsCode, path)
	}
}

func (cr *CaseValidationRecord) validateCodeField(code, fieldName, path, codeType string, patientIndex int, validCodes []string) {
	if !slices.Contains(validCodes, code) {
		message := cr.formatPatientsErrorMessage(fieldName, patientIndex)
		msg := fmt.Sprintf("%s %s %q is not a valid %s.", message, codeType, code, codeType)
		cr.addErrors(msg, InvalidFieldObservationCode, path) // OBS-001
	}
}

// Family History validation

func (cr *CaseValidationRecord) validateFamilyMemberCode(patientIndex int, fhIndex int) {
	fh := cr.Case.Patients[patientIndex].FamilyHistory[fhIndex]
	fieldName := "family_member_code"
	path := cr.formatPatientsFieldPath(patientIndex, "family_history", fhIndex, fieldName)
	cr.validateTextField(fh.FamilyMemberCode, fieldName, path, patientIndex, FamilyMemberCodeRegExpCompiled, FamilyMemberCodeRegExp, true)
}

func (cr *CaseValidationRecord) validateCondition(patientIndex int, fhIndex int) {
	fh := cr.Case.Patients[patientIndex].FamilyHistory[fhIndex]
	fieldName := "condition"
	path := cr.formatPatientsFieldPath(patientIndex, "family_history", fhIndex, fieldName)
	cr.validateTextField(fh.Condition, fieldName, path, patientIndex, TextRegExpCompiled, TextRegExp, true)
}

func (cr *CaseValidationRecord) validateFamilyHistory(patientIndex int) {
	for fhIndex := range cr.Case.Patients[patientIndex].FamilyHistory {
		cr.validateFamilyMemberCode(patientIndex, fhIndex)
		cr.validateCondition(patientIndex, fhIndex)
	}
}

// Observations Categorical validation

func (cr *CaseValidationRecord) validateObsCategoricalCode(patientIndex int, obsIndex int, validObservationCodes []string) {
	obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
	fieldName := "code"
	path := cr.formatPatientsFieldPath(patientIndex, "observations_categorical", obsIndex, fieldName)
	cr.validateCodeField(obs.Code, fieldName, path, "observation code", patientIndex, validObservationCodes)
}

func (cr *CaseValidationRecord) validateSystem(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
	fieldName := "system"
	path := cr.formatPatientsFieldPath(patientIndex, "observations_categorical", obsIndex, fieldName)
	cr.validateTextField(obs.System, fieldName, path, patientIndex, TextRegExpCompiled, TextRegExp, true)
}

func (cr *CaseValidationRecord) validateValue(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
	fieldName := "value"
	path := cr.formatPatientsFieldPath(patientIndex, "observations_categorical", obsIndex, fieldName)
	cr.validateTextField(obs.Value, fieldName, path, patientIndex, TextRegExpCompiled, TextRegExp, true)
}

func (cr *CaseValidationRecord) validateOnsetCode(patientIndex int, obsIndex int, validOnsetCodes []string) {
	obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
	fieldName := "onset_code"
	path := cr.formatPatientsFieldPath(patientIndex, "observations_categorical", obsIndex, fieldName)
	cr.validateCodeField(obs.OnsetCode, fieldName, path, "onset code", patientIndex, validOnsetCodes)
}

func (cr *CaseValidationRecord) validateObsCategoricalNote(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsCategorical[obsIndex]
	fieldName := "note"
	path := cr.formatPatientsFieldPath(patientIndex, "observations_categorical", obsIndex, fieldName)
	cr.validateTextField(obs.Note, fieldName, path, patientIndex, TextRegExpCompiled, TextRegExp, false)
}

func (cr *CaseValidationRecord) validateObservationsCategorical(patientIndex int, observations repository.ObservationsDAO, onsets repository.OnsetsDAO) error {
	validObservationCodes, err := observations.GetObservationCodes()
	if err != nil {
		return fmt.Errorf("error retrieving observation codes: %v", err)
	}

	validOnsetCodes, err := onsets.GetOnsetCodes()
	if err != nil {
		return fmt.Errorf("error retrieving onset codes: %v", err)
	}

	for obsIndex := range cr.Case.Patients[patientIndex].ObservationsCategorical {
		cr.validateObsCategoricalCode(patientIndex, obsIndex, validObservationCodes)
		cr.validateSystem(patientIndex, obsIndex)
		cr.validateValue(patientIndex, obsIndex)
		cr.validateOnsetCode(patientIndex, obsIndex, validOnsetCodes)
		cr.validateObsCategoricalNote(patientIndex, obsIndex)
	}
	return nil
}

// Observations Text validation

func (cr *CaseValidationRecord) validateObsTextCode(patientIndex int, obsIndex int, validObservationCodes []string) {
	obs := cr.Case.Patients[patientIndex].ObservationsText[obsIndex]
	fieldName := "code"
	path := cr.formatPatientsFieldPath(patientIndex, "observations_text", obsIndex, fieldName)
	cr.validateCodeField(obs.Code, fieldName, path, "observation code", patientIndex, validObservationCodes)
}

func (cr *CaseValidationRecord) validateObsTextValue(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsText[obsIndex]
	fieldName := "value"
	path := cr.formatPatientsFieldPath(patientIndex, "observations_text", obsIndex, fieldName)
	cr.validateTextField(obs.Value, fieldName, path, patientIndex, TextRegExpCompiled, TextRegExp, true)
}

func (cr *CaseValidationRecord) validateObservationsText(patientIndex int, observations repository.ObservationsDAO) error {
	validObservationCodes, err := observations.GetObservationCodes()
	if err != nil {
		return fmt.Errorf("error retrieving observation codes: %v", err)
	}
	for obsIndex := range cr.Case.Patients[patientIndex].ObservationsText {
		cr.validateObsTextCode(patientIndex, obsIndex, validObservationCodes)
		cr.validateObsTextValue(patientIndex, obsIndex)
	}
	return nil
}

// Case patient validation

func (cr *CaseValidationRecord) validatePatientInOrg(patientIndex int, patients repository.PatientsDAO) error {
	p := cr.Case.Patients[patientIndex]
	patient, err := patients.GetPatientByOrgCodeAndSubmitterPatientId(p.PatientOrganizationCode, p.SubmitterPatientId)
	if err != nil {
		return fmt.Errorf("error getting existing patient: %v", err)
	}
	if patient == nil {
		path := cr.formatPatientsFieldPath(patientIndex, "", 0, "")
		message := fmt.Sprintf("Patient (%s / %s) for case %d - patient %d does not exist.",
			p.PatientOrganizationCode,
			p.SubmitterPatientId,
			cr.Index,
			patientIndex,
		)
		cr.addErrors(message, PatientNotFoundCode, path)
	}
	return nil
}

func (cr *CaseValidationRecord) validatePatientUniquenessInCase(patientIndex int, visited map[patientsKey]struct{}) {
	p := cr.Case.Patients[patientIndex]
	patientKey := patientsKey{
		OrganizationCode:   p.PatientOrganizationCode,
		SubmitterPatientId: p.SubmitterPatientId,
	}
	if _, exists := visited[patientKey]; exists {
		path := fmt.Sprintf("case[%d].patients", cr.Index)
		message := fmt.Sprintf("Duplicate patient (%s / %s) for case %d.",
			p.PatientOrganizationCode,
			p.SubmitterPatientId,
			cr.Index,
		)
		cr.addErrors(message, DuplicatePatientInCase, path)
	}
	visited[patientKey] = struct{}{}
}

func (cr *CaseValidationRecord) validateCasePatients(ctx *BatchValidationContext, patientsBatch []*types.CasePatientBatch) error {
	nbProband := 0

	visitedPatients := map[patientsKey]struct{}{}

	for patientIndex := range patientsBatch {
		err := cr.validatePatientInOrg(patientIndex, ctx.PatientRepo)
		if err != nil {
			return fmt.Errorf("error validating patient in organization for patient index %d: %v", patientIndex, err)
		}

		// Validate uniqueness of patients in case
		cr.validatePatientUniquenessInCase(patientIndex, visitedPatients)

		if patientsBatch[patientIndex].RelationToProbandCode == "proband" {
			nbProband++
		}

		// Validate family history
		cr.validateFamilyHistory(patientIndex)

		// Validate observations categorical
		err = cr.validateObservationsCategorical(patientIndex, ctx.ObservationRepo, ctx.OnsetRepo)
		if err != nil {
			return fmt.Errorf("error validating observations categorical for patient index %d: %v", patientIndex, err)
		}

		// Validate observations text
		err = cr.validateObservationsText(patientIndex, ctx.ObservationRepo)
		if err != nil {
			return fmt.Errorf("error validating observations text for patient index %d: %v", patientIndex, err)
		}
	}

	if nbProband != 1 {
		message := fmt.Sprintf("Case %d should have exactly 1 proband.", cr.Index)
		path := fmt.Sprintf("case[%d].patients", cr.Index)
		cr.addErrors(message, InvalidNumberOfProbands, path)
	}
	return nil
}

func validateCaseRecord(
	ctx *BatchValidationContext,
	c types.CaseBatch,
	index int,
) (*CaseValidationRecord, error) {
	cr := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: index},
		Case:                 c,
		ProjectID:            nil,
		SubmitterCaseID:      "",
		Patients:             make(map[string]*types.Patient),
		Context:              ctx,
	}

	if unexpectedErr := cr.fetchValidationInfos(); unexpectedErr != nil {
		return nil, fmt.Errorf("error during pre-fetching case validation info: %v", unexpectedErr)
	}

	// 1. Validate Case Fields

	// 2. Validate Case Patients
	if unexpectedErr := cr.validateCasePatients(ctx, c.Patients); unexpectedErr != nil {
		return nil, fmt.Errorf("error during case patients validation: %v", unexpectedErr)
	}

	return &cr, nil
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

func (r *CaseValidationRecord) getProbandFromPatients() (*types.Patient, error) {
	for _, p := range r.Case.Patients {
		if p.RelationToProbandCode == "proband" {
			if patient, ok := r.Patients[fmt.Sprintf("%s/%s", p.PatientOrganizationCode, p.SubmitterPatientId)]; ok {
				return patient, nil
			} else {
				return nil, fmt.Errorf("failed to find proband patient for case %q", r.Case.SubmitterCaseId)
			}
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

	// Gorm automatically sets the ID on the struct after creation
	cr.CaseID = &c.ID

	// Persist CaseHasSequencingExperiment relationships
	for _, se := range cr.SequencingExperiments {
		chse := types.CaseHasSequencingExperiment{
			CaseID:                 *cr.CaseID,
			SequencingExperimentID: se.ID,
		}

		err := ctx.CasesRepo.CreateCaseHasSequencingExperiment(&chse)
		if err != nil {
			return fmt.Errorf("failed to persist case has sequencing experiment for case %q and sequencing experiment %q: %w", cr.Case.SubmitterCaseId, se.ID, err)
		}
	}

	return nil
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
		patient, ok := cr.Patients[fmt.Sprintf("%s/%s", p.PatientOrganizationCode, p.SubmitterPatientId)]
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

		patient, ok := cr.Patients[fmt.Sprintf("%s/%s", p.PatientOrganizationCode, p.SubmitterPatientId)]
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
				SequencingExperimentID: &se.ID,
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

		validateUniquenessInBatch(record, key, visited, IdenticalCaseInBatchCode, []string{c.ProjectCode, c.SubmitterCaseId})
		records = append(records, record)
	}
	return records, nil
}
