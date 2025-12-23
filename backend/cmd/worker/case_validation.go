package main

import (
	"encoding/json"
	"fmt"
	"regexp"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

// FamilyMemberCodeRegExp defines a regular expression pattern that matches strings containing
// uppercase and lowercase letters (A-Z, a-z) and hyphens.
const FamilyMemberCodeRegExp = `^[A-Za-z\- ]+$`

var FamilyMemberCodeRegExpCompiled = regexp.MustCompile(FamilyMemberCodeRegExp)

// ConditionRegExp defines a regular expression pattern that matches strings containing
// alphanumeric characters (A-Z, a-z, 0-9), hyphens, underscores, periods, commas, and spaces.
const ConditionRegExp = `^[A-Za-z0-9\-\_\.\, ]+$`

var ConditionRegExpCompiled = regexp.MustCompile(ConditionRegExp)

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

func validateCaseBatch(cases []types.CaseBatch, projects repository.ProjectDAO) ([]*CaseValidationRecord, error) {
	var records []*CaseValidationRecord
	visited := map[CaseKey]struct{}{}

	for idx, c := range cases {
		key := CaseKey{
			ProjectCode:     c.ProjectCode,
			SubmitterCaseID: c.SubmitterCaseId,
		}

		record, err := validateCaseRecord(c, idx, projects)
		if err != nil {
			return nil, fmt.Errorf("error during case validation: %v", err)
		}

		validateUniquenessInBatch(record, key, visited, IdenticalCaseInBatchCode, []string{c.ProjectCode, c.SubmitterCaseId})
		records = append(records, record)
	}
	return records, nil
}

func (cr *CaseValidationRecord) validateFamilyMemberCode(patientIndex int, fhIndex int) {
	p := cr.Case.Patients[patientIndex]
	fh := cr.Case.Patients[patientIndex].FamilyHistory[fhIndex]

	fieldName := "family_member_code"
	message := fmt.Sprintf("Invalid field %s for case %s - patient %s. Reason:",
		fieldName,
		formatIds([]string{cr.Case.ProjectCode, cr.Case.SubmitterCaseId}),
		formatIds([]string{p.PatientOrganizationCode, p.SubmitterPatientId}),
	)
	path := fmt.Sprintf("case[%d].patients[%d].family_history[%d].%s", cr.Index, patientIndex, fhIndex, fieldName)

	if !FamilyMemberCodeRegExpCompiled.MatchString(fh.FamilyMemberCode) {
		message := fmt.Sprintf("%s does not match the regular expression %s.",
			message,
			FamilyMemberCodeRegExp,
		)
		cr.addErrors(message, InvalidFieldPatientsCode, path)
	}

	if len(fh.FamilyMemberCode) > TextMaxLength {
		message := fmt.Sprintf("%s field is too long, maximum length allowed is %d.",
			message,
			TextMaxLength,
		)
		cr.addErrors(message, InvalidFieldPatientsCode, path)
	}
}

func (cr *CaseValidationRecord) validateCondition(patientIndex int, fhIndex int) {
	p := cr.Case.Patients[patientIndex]
	fh := cr.Case.Patients[patientIndex].FamilyHistory[fhIndex]

	fieldName := "condition"
	message := fmt.Sprintf("Invalid field %s for case %s - patient %s. Reason:",
		fieldName,
		formatIds([]string{cr.Case.ProjectCode, cr.Case.SubmitterCaseId}),
		formatIds([]string{p.PatientOrganizationCode, p.SubmitterPatientId}),
	)
	path := fmt.Sprintf("case[%d].patients[%d].family_history[%d].%s", cr.Index, patientIndex, fhIndex, fieldName)

	if !ConditionRegExpCompiled.MatchString(fh.Condition) {
		message := fmt.Sprintf("%s does not match the regular expression %s.",
			message,
			ConditionRegExp,
		)
		cr.addErrors(message, InvalidFieldPatientsCode, path)
	}

	if len(fh.Condition) > TextMaxLength {
		message := fmt.Sprintf("%s field is too long, maximum length allowed is %d.",
			message,
			TextMaxLength,
		)
		cr.addErrors(message, InvalidFieldPatientsCode, path)
	}
}

func (cr *CaseValidationRecord) validateFamilyHistory(patientIndex int) {
	for fhIndex := range cr.Case.Patients[patientIndex].FamilyHistory {
		cr.validateFamilyMemberCode(patientIndex, fhIndex)
		cr.validateCondition(patientIndex, fhIndex)
	}
}

func (cr *CaseValidationRecord) validateCasePatients(patients []*types.CasePatientBatch) error {
	for patientIndex := range patients {
		// Validate family history
		cr.validateFamilyHistory(patientIndex)
	}
	return nil
}

func validateCaseRecord(c types.CaseBatch, index int, projects repository.ProjectDAO) (*CaseValidationRecord, error) {
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
	if unexpectedErr := cr.validateCasePatients(c.Patients); unexpectedErr != nil {
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

	records, unexpectedErr := validateCaseBatch(caseBatches, ctx.ProjectRepo)
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
