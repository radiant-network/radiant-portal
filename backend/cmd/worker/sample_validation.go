package main

import (
	"encoding/json"
	"fmt"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Batch = types.Batch
type SampleBatch = types.SampleBatch

type SampleValidationRecord struct {
	BaseValidationRecord
	Sample SampleBatch
}

func (r SampleValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func processSampleBatch(batch *Batch, db *gorm.DB, repoOrganization *repository.OrganizationRepository, repoSample *repository.SamplesRepository, repoBatch *repository.BatchRepository) {
	payload := []byte(batch.Payload)
	var batches []types.SampleBatch

	if unexpectedErr := json.Unmarshal(payload, &batches); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling sample batches: %v", unexpectedErr), repoBatch)
		return
	}

	records, unexpectedErr := validateSampleBatch(batches, repoOrganization, repoSample)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error sample batch validation: %v", unexpectedErr), repoBatch)
		return
	}

	glog.Infof("Sample batch %v processed with %d records", batch.ID, len(records))

	rowsUpdated, unexpectedErr := updateBatch(batch, records, repoBatch)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error updating sample batch: %v", unexpectedErr), repoBatch)
		return
	}
	if rowsUpdated == 0 {
		glog.Warningf("no rows updated when updating sample batch %v", batch.ID)
	}
}

func validateSampleBatch(batches []types.SampleBatch, repoOrganization *repository.OrganizationRepository, repoSample *repository.SamplesRepository) ([]SampleValidationRecord, error) {
	var records []SampleValidationRecord
	for index, sample := range batches {
		record, err := validateSampleRecord(sample, index, repoOrganization, repoSample)
		if err != nil {
			return nil, fmt.Errorf("error during sample validation: %v", err)
		}
		records = append(records, *record)
	}
	return records, nil
}

func validateSampleRecord(sample types.SampleBatch, index int, repoOrganization *repository.OrganizationRepository, repoSample *repository.SamplesRepository) (*SampleValidationRecord, error) {
	record := SampleValidationRecord{Sample: sample}
	return &record, nil
}
