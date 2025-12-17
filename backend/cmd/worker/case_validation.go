package main

import (
	"encoding/json"
	"fmt"
	"time"

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
	Case types.CaseBatch
}

func (r *CaseValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *CaseValidationRecord) GetResourceType() string {
	return types.CaseBatchType
}

func (r *CaseValidationRecord) preFetchValidationInfo(repoOrg repository.OrganizationDAO, repoSample repository.SamplesDAO) error {
	soc, err := repoOrg.GetPro(r.Case.)
	if err != nil {
		return err
	}
	if soc != nil {
		r.SubmitterOrganizationID = &soc.ID
	}
	sample, err := repoSample.GetSampleBySubmitterSampleId(*r.SubmitterOrganizationID, r.SequencingExperiment.SubmitterSampleId.String())
	if err != nil {
		return err
	}
	if sample != nil {
		r.SampleID = &sample.ID
	}
	sequencingLab, err := repoOrg.GetOrganizationByCode(r.SequencingExperiment.SequencingLabCode)
	if err != nil {
		return err
	}
	if sequencingLab != nil {
		r.SequencingLabID = &sequencingLab.ID
	}
	return nil
}

func validateCaseBatch(cases []types.CaseBatch, repoOrganization repository.OrganizationDAO, repoSample repository.SamplesDAO, repoSeqExp repository.SequencingExperimentDAO) ([]*CaseValidationRecord, error) {
	var records []*CaseValidationRecord
	visited := map[CaseKey]struct{}{}

	for index, c := range cases {
		key := CaseKey{
			ProjectCode:     c.ProjectCode,
			SubmitterCaseId: c.SubmitterCaseId,
		}
		record, err := validateCaseRecord(c, index, repoOrganization, repoSample, repoSeqExp)
		if err != nil {
			return nil, fmt.Errorf("error during case validation: %v", err)
		}
		validateUniquenessInBatch(record, key, visited, IdenticalCaseInBatchCode, []string{c.ProjectCode, c.SubmitterCaseId})
		records = append(records, record)
	}
	return records, nil
}

func validateCaseRecord(c types.CaseBatch, index int, organization repository.OrganizationDAO, sample repository.SamplesDAO, exp repository.SequencingExperimentDAO) (*CaseValidationRecord, error) {
	// FIXME: Not Implemented, will be implemented in follow-up tasks
	return nil, nil
}

func processCaseBatch(batch *types.Batch, db *gorm.DB, context *BatchValidationContext) {
	payload := []byte(batch.Payload)
	var caseBatches []types.CaseBatch

	if unexpectedErr := json.Unmarshal(payload, &caseBatches); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling case batch: %v", unexpectedErr), context.RepoBatch)
		return
	}

	records, unexpectedErr := validateCaseBatch(caseBatches, context.RepoOrganization, context.RepoSample, context.RepoSeqExp)
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
	for _, record := range records {
		if !record.Skipped {
			c := types.Case{
				ProjectCode:     record.Case.ProjectCode,
				SubmitterCaseId: record.Case.SubmitterCaseId,
			}

			err := repo.CreateCase(&c)
			if err != nil {
				return fmt.Errorf("create sequencing experiment :%w", err)
			}
		}
	}
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
