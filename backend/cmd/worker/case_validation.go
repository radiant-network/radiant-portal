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
	SubmitterCaseId string
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

func (r *CaseValidationRecord) preFetchValidationInfo(repoProject repository.ProjectDAO) error {
	prj, err := repoProject.GetProjectByCode(r.Case.ProjectCode)
	if err != nil {
		return err
	}
	if prj != nil {
		r.ProjectID = &prj.ID
	}
	return nil
}

func validateCaseBatch(cases []types.CaseBatch, project repository.ProjectDAO) ([]*CaseValidationRecord, error) {
	var records []*CaseValidationRecord
	visited := map[CaseKey]struct{}{}

	for index, c := range cases {
		key := CaseKey{
			ProjectCode:     c.ProjectCode,
			SubmitterCaseId: c.SubmitterCaseId,
		}
		record, err := validateCaseRecord(c, index, project)
		if err != nil {
			return nil, fmt.Errorf("error during case validation: %v", err)
		}
		validateUniquenessInBatch(record, key, visited, IdenticalCaseInBatchCode, []string{c.ProjectCode, c.SubmitterCaseId})
		records = append(records, record)
	}
	return records, nil
}

func validateCaseRecord(c types.CaseBatch, index int, project repository.ProjectDAO) (*CaseValidationRecord, error) {
	// FIXME: Not Implemented, will be implemented in follow-up tasks
	cr := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: index},
		Case:                 types.CaseBatch{},
		ProjectID:            nil,
		SubmitterCaseID:      "",
	}
	return &cr, nil
}

func processCaseBatch(batch *types.Batch, db *gorm.DB, context *BatchValidationContext) {
	payload := []byte(batch.Payload)
	var caseBatches []types.CaseBatch

	if unexpectedErr := json.Unmarshal(payload, &caseBatches); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling case batch: %v", unexpectedErr), context.RepoBatch)
		return
	}

	records, unexpectedErr := validateCaseBatch(caseBatches, context.RepoProject)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error case batch validation: %v", unexpectedErr), context.RepoBatch)
		return
	}

	glog.Infof("Case batch %v processed with %d records", batch.ID, len(records))

	err := persistBatchAndCaseRecords(db, batch, records)
	if err != nil {
		processUnexpectedError(batch, fmt.Errorf("error processing case batch records: %v", err), context.RepoBatch)
		return
	}
}

func insertCaseRecords(records []*CaseValidationRecord, repo repository.CasesDAO) error {
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
