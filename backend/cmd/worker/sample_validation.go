package main

import (
	"encoding/json"
	"fmt"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const SampleAlreadyExistCode = "SAMPLE-001"
const SampleExistingSampleDifferentFieldCode = "SAMPLE-002"
const SampleOrgNotExistCode = "SAMPLE-003"
const SampleInvalidOrgPatientCombinationCode = "SAMPLE-004"
const SampleUnknownParentSubmitterSampleIdCode = "SAMPLE-005"
const SampleInvalidValueCode = "SAMPLE-006"

// TODO: Need more details for SAMPLE-007 error code

type SampleValidationRecord struct {
	BaseValidationRecord
	Sample         types.SampleBatch
	OrganizationId int
}

func (r SampleValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r SampleValidationRecord) formatInvalidField(fieldName string, reason string) string {
	message := fmt.Sprintf("Invalid Field %s for sample (%s / %s). Reason: %s", fieldName, r.Sample.OrganizationCode, r.Sample.OrganizationPatientId, reason)
	return message
}

func (r SampleValidationRecord) formatFieldTooLong(fieldName string, maxLength int) string {
	reason := fmt.Sprintf("field is too long, maximum length allowed is %d", maxLength)
	return r.formatInvalidField(fieldName, reason)
}

func (r SampleValidationRecord) formatPath(fieldName string) string {
	if fieldName == "" {
		return fmt.Sprintf("sample[%d]", r.Index)
	}
	return fmt.Sprintf("sample[%d].%s", r.Index, fieldName)
}

// func validateExistingSampleFieldFn[T comparable](
// 	r *SampleValidationRecord,
// 	fieldName string,
// 	existingSampleValue T,
// 	recordValue T,

// ) {
// 	if existingSampleValue != recordValue {
// 		path := r.formatPath(fieldName)
// 		message := fmt.Sprintf("A patient with same ids (%s / %s) has been found  but with a different %s (%v <> %v)",
// 			r.Patient.OrganizationCode,
// 			r.Patient.OrganizationPatientId,
// 			fieldName,
// 			existingPatientValue,
// 			recordValue,
// 		)

// 		r.addWarnings(message, PatientExistingPatientDifferentFieldCode, path)
// 	}
// }

func processSampleBatch(batch *types.Batch, db *gorm.DB, repoOrganization *repository.OrganizationRepository, repoSample *repository.SamplesRepository, repoBatch *repository.BatchRepository) {
	payload := []byte(batch.Payload)
	var samplesbatch []types.SampleBatch

	if unexpectedErr := json.Unmarshal(payload, &samplesbatch); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling sample batch: %v", unexpectedErr), repoBatch)
		return
	}

	records, unexpectedErr := validateSamplesBatch(samplesbatch, repoOrganization, repoSample)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error sample batch validation: %v", unexpectedErr), repoBatch)
		return
	}

	glog.Infof("Sample batch %v processed with %d records", batch.ID, len(records))

	err := persistBatchAndSampleRecords(db, batch, records)
	if err != nil {
		processUnexpectedError(batch, fmt.Errorf("error processing sample batch records: %v", err), repoBatch)
		return
	}
}

func persistBatchAndSampleRecords(db *gorm.DB, batch *types.Batch, records []SampleValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		txRepoSample := repository.NewSamplesRepository(tx)
		txRepoBatch := repository.NewBatchRepository(tx)
		rowsUpdated, unexpectedErrUpdate := updateBatch(batch, records, txRepoBatch)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			/* Logs directly, and return error to trigger rollback if the batch does not exist in db */
			return fmt.Errorf("no rows updated when updating sample batch %v", batch.ID)
		}
		if !batch.DryRun && batch.Status == types.BatchStatusSuccess {
			err := insertSampleRecords(records, txRepoSample)
			if err != nil {
				return fmt.Errorf("error during sample insertion %v", err)
			}
		}
		return nil
	})
}

func insertSampleRecords(records []SampleValidationRecord, repo *repository.SamplesRepository) error {
	for _, record := range records {
		if !record.Skipped {
			sample := types.Sample{

				// TODO: Populate sample fields from record.Sample

			}
			err := repo.CreateSample(&sample)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func validateSamplesBatch(samples []types.SampleBatch, repoOrganization *repository.OrganizationRepository, repoSample *repository.SamplesRepository) ([]SampleValidationRecord, error) {
	var records []SampleValidationRecord
	for index, sample := range samples {
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
	record.Index = index

	// TODO: Implement sample validation logic here

	organization, orgErr := repoOrganization.GetOrganizationByCode(sample.OrganizationCode)
	if orgErr != nil {
		return nil, fmt.Errorf("error getting existing organization: %v", orgErr)
	}

	if organization != nil {
		existingSample, sampleErr := repoSample.GetSampleByOrganizationId(organization.ID, sample.SubmitterSampleId)
		if sampleErr != nil {
			return nil, fmt.Errorf("error getting existing sample: %v", sampleErr)
		} else {
			record.validateExistingSample(existingSample)
		}
	}
	return &record, nil
}
