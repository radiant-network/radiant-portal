package main

import (
	"encoding/json"
	"fmt"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const (
	IdenticalCaseInBatchCode = "CASE-001"
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

	// TODO: Add field-level validations here

	return &cr, nil
}

func processCaseBatch(batch *types.Batch, db *gorm.DB, context *BatchValidationContext) {
	payload := []byte(batch.Payload)
	var caseBatches []types.CaseBatch

	if unexpectedErr := json.Unmarshal(payload, &caseBatches); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling case batch: %v", unexpectedErr), context.BatchRepo)
		return
	}

	records, unexpectedErr := validateCaseBatch(caseBatches, context.ProjectRepo)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error case batch validation: %v", unexpectedErr), context.BatchRepo)
		return
	}

	glog.Infof("Case batch %v processed with %d records", batch.ID, len(records))

	err := persistBatchAndCaseRecords(db, batch, records)
	if err != nil {
		processUnexpectedError(batch, fmt.Errorf("error processing case batch records: %v", err), context.BatchRepo)
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
