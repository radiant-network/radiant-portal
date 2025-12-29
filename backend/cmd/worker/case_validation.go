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
)

// Patients error codes
const (
	InvalidFieldPatientsCode = "PATIENT-004"
)

type CaseKey struct {
	ProjectCode     string
	SubmitterCaseID string
}

type CaseValidationRecord struct {
	BaseValidationRecord
	Case            types.CaseBatch
	ProjectID       *int
	SubmitterCaseID string
}

func (r *CaseValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *CaseValidationRecord) GetResourceType() string {
	return types.CaseBatchType
}

func (r *CaseValidationRecord) preFetchValidationInfo(projects repository.ProjectDAO) error {
	p, err := projects.GetProjectByCode(r.Case.ProjectCode)
	if err != nil {
		return fmt.Errorf("get project by code %q: %w", r.Case.ProjectCode, err)
	}
	if p != nil {
		r.ProjectID = &p.ID
	}
	return nil
}

func validateCaseBatch(cases []types.CaseBatch,
	projects repository.ProjectDAO,
	observations repository.ObservationsDAO,
	onsets repository.OnsetsDAO,
) ([]*CaseValidationRecord, error) {
	var records []*CaseValidationRecord
	visited := map[CaseKey]struct{}{}

	for idx, c := range cases {
		key := CaseKey{
			ProjectCode:     c.ProjectCode,
			SubmitterCaseID: c.SubmitterCaseId,
		}

		record, err := validateCaseRecord(c, idx, projects, observations, onsets)
		if err != nil {
			return nil, fmt.Errorf("error during case validation: %v", err)
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
	if collectionName == "" {
		return fmt.Sprintf("case[%d].patients[%d].%s", cr.Index, patientIndex, fieldName)
	}
	return fmt.Sprintf("case[%d].patients[%d].%s[%d].%s", cr.Index, patientIndex, collectionName, collectionIndex, fieldName)
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
		cr.addErrors(msg, InvalidFieldPatientsCode, path)
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
		// TODO: make sure interpretation oneof tag is containing valid codes
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

func (cr *CaseValidationRecord) validateObsTextNote(patientIndex int, obsIndex int) {
	obs := cr.Case.Patients[patientIndex].ObservationsText[obsIndex]
	fieldName := "note"
	path := cr.formatPatientsFieldPath(patientIndex, "observations_text", obsIndex, fieldName)
	cr.validateTextField(obs.Note, fieldName, path, patientIndex, TextRegExpCompiled, TextRegExp, false) // TODO: should note be required?
}

func (cr *CaseValidationRecord) validateObservationsText(patientIndex int, observations repository.ObservationsDAO) error {
	validObservationCodes, err := observations.GetObservationCodes()
	if err != nil {
		return fmt.Errorf("error retrieving observation codes: %v", err)
	}

	for obsIndex := range cr.Case.Patients[patientIndex].ObservationsText {
		cr.validateObsTextCode(patientIndex, obsIndex, validObservationCodes)
		cr.validateObsTextNote(patientIndex, obsIndex)
	}

	return nil
}

// Case patient validation

func (cr *CaseValidationRecord) validateCasePatients(patients []*types.CasePatientBatch, observations repository.ObservationsDAO, onsets repository.OnsetsDAO) error {
	for patientIndex := range patients {
		// Validate family history
		cr.validateFamilyHistory(patientIndex)

		// Validate observations categorical
		err := cr.validateObservationsCategorical(patientIndex, observations, onsets)
		if err != nil {
			return fmt.Errorf("error validating observations categorical for patient index %d: %v", patientIndex, err)
		}

		// Validate observations text
		err = cr.validateObservationsText(patientIndex, observations)
		if err != nil {
			return fmt.Errorf("error validating observations text for patient index %d: %v", patientIndex, err)
		}

		// Validate other patient fields
	}
	return nil
}

func validateCaseRecord(c types.CaseBatch, index int, projects repository.ProjectDAO, observations repository.ObservationsDAO, onsets repository.OnsetsDAO) (*CaseValidationRecord, error) {
	// FIXME: Not Implemented, will be implemented in follow-up tasks
	cr := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: index},
		Case:                 types.CaseBatch{},
		ProjectID:            nil,
		SubmitterCaseID:      "",
	}

	if unexpectedErr := cr.preFetchValidationInfo(projects); unexpectedErr != nil {
		return nil, fmt.Errorf("error during pre-fetching case validation info: %v", unexpectedErr)
	}

	// 1. Validate Case Fields

	// 2. Validate Case Patients
	if unexpectedErr := cr.validateCasePatients(c.Patients, observations, onsets); unexpectedErr != nil {
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

	records, unexpectedErr := validateCaseBatch(caseBatches, ctx.ProjectRepo, ctx.ObservationRepo, ctx.OnsetRepo)
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

func insertCaseRecords(records []*CaseValidationRecord, cases repository.CasesDAO) error {
	// FIXME: Not Implemented, will be implemented in follow-up ticket
	return nil
}

func persistBatchAndCaseRecords(db *gorm.DB, batch *types.Batch, records []*CaseValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		txRepoCase := repository.NewCasesRepository(tx)
		txRepoBatch := repository.NewBatchRepository(tx)
		rowsUpdated, unexpectedErrUpdate := updateBatch(batch, records, txRepoBatch)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating case batch %v", batch.ID)
		}
		if !batch.DryRun && batch.Status == types.BatchStatusSuccess {
			err := insertCaseRecords(records, txRepoCase)
			if err != nil {
				return fmt.Errorf("error during case insertion %w", err)
			}
		}
		return nil
	})
}
