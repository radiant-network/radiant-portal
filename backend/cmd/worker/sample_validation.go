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

func (r SampleValidationRecord) formatFieldRegexpMatch(fieldName string, regexp string) string {
	reason := fmt.Sprintf("does not match the regular expression %s", regexp)
	return r.formatInvalidField(fieldName, reason)
}

func (r *SampleValidationRecord) validateFieldLength(fieldName string, fieldValue string) {
	if fieldValue == "" {
		return
	}
	if len(fieldValue) > TextMaxLength {
		path := r.formatPath(fieldName)
		message := r.formatFieldTooLong(fieldName, TextMaxLength)
		r.addErrors(message, SampleInvalidValueCode, path)
	}
}

func (r *SampleValidationRecord) validateOrganizationPatientId() {
	path := r.formatPath("organization_patient_id")
	if len(r.Sample.OrganizationPatientId) > TextMaxLength {
		message := r.formatFieldTooLong("organization_patient_id", TextMaxLength)
		r.addErrors(message, SampleInvalidValueCode, path)
	}
	if !ExternalIdRegexpCompiled.MatchString(r.Sample.OrganizationPatientId) {
		message := r.formatFieldRegexpMatch("organization_patient_id", ExternalIdRegexp)
		r.addErrors(message, SampleInvalidValueCode, path)
	}
}

func (r *SampleValidationRecord) validateExistingSampleInBatch(existingSample *types.SampleBatch) {
	if existingSample != nil {
		message := fmt.Sprintf("Sample (%s / %s) already exist in batch, skipped.", r.Sample.SubmitterOrganizationCode, r.Sample.SubmitterSampleId)
		r.addInfos(message, SampleAlreadyExistCode, r.formatPath(""))
		r.Skipped = true
		validateExistingSampleFieldFn(r, "organization_patient_id", existingSample.OrganizationPatientId, r.Sample.OrganizationPatientId)
		validateExistingSampleFieldFn(r, "type_code", existingSample.TypeCode, r.Sample.TypeCode)
		validateExistingSampleFieldFn(r, "parent_submitter_sample_id", existingSample.ParentSubmitterSampleId, r.Sample.ParentSubmitterSampleId)
		validateExistingSampleFieldFn(r, "tissue_site", existingSample.TissueSite, r.Sample.TissueSite)
		validateExistingSampleFieldFn(r, "histology_code", existingSample.HistologyCode, r.Sample.HistologyCode)
	}
}

func (r *SampleValidationRecord) validateExistingSampleInDb(existingSample *types.Sample) {
	if existingSample != nil {
		message := fmt.Sprintf("Sample (%s / %s) already exists in database, skipped.", r.Sample.SubmitterOrganizationCode, r.Sample.SubmitterSampleId)
		r.addInfos(message, SampleAlreadyExistCode, r.formatPath(""))
		r.Skipped = true
		// TODO: Validate organization_patient_id
		validateExistingSampleFieldFn(r, "type_code", existingSample.TypeCode, r.Sample.TypeCode)
		validateExistingSampleFieldFn(r, "tissue_site", existingSample.TissueType, r.Sample.TissueSite)              // TODO: Check if this is correct
		validateExistingSampleFieldFn(r, "histology_code", existingSample.HistologyTypeCode, r.Sample.HistologyCode) // TODO: Check if this is correct
	}
}

func (r *SampleValidationRecord) validateExistingParentSampleInBatch(samplesMap map[string]*types.SampleBatch, existingSample *types.SampleBatch) {
	if existingSample.ParentSubmitterSampleId != "" {
		_, parentSampleExists := samplesMap[fmt.Sprintf("%s:%s", existingSample.SubmitterOrganizationCode, existingSample.ParentSubmitterSampleId)]
		if !parentSampleExists {
			// Parent sample does not exist in batch, add error message
			path := r.formatPath("parent_submitter_sample_id")
			message := fmt.Sprintf("Parent sample with submitter_sample_id %s does not exist in batch for organization %s", existingSample.ParentSubmitterSampleId, existingSample.SubmitterOrganizationCode)
			r.addErrors(message, SampleUnknownParentSubmitterSampleIdCode, path)
		}
	}
}

func (r *SampleValidationRecord) validateExistingParentSampleInDb(sample types.SampleBatch, organizationId int, repoSample repository.SamplesDAO) error {
	if sample.ParentSubmitterSampleId != "" {
		parentSample, parentSampleErr := repoSample.GetSampleBySubmitterSampleId(organizationId, sample.ParentSubmitterSampleId)
		if parentSampleErr != nil {
			return fmt.Errorf("error getting parent sample: %v", parentSampleErr)
		} else if parentSample == nil {
			// Parent sample does not exist, add error message
			path := r.formatPath("parent_submitter_sample_id")
			message := fmt.Sprintf("Parent sample with submitter_sample_id %s does not exist for organization %s", sample.ParentSubmitterSampleId, sample.SubmitterOrganizationCode)
			r.addErrors(message, SampleUnknownParentSubmitterSampleIdCode, path)
		}
	}
	return nil
}

func (r *SampleValidationRecord) validateSubmitterOrganization(organization *types.Organization) {
	if organization == nil {
		path := r.formatPath("submitter_organization_code")
		message := fmt.Sprintf("Organization with code %s does not exist for sample with submitter_sample_id %s", r.Sample.SubmitterOrganizationCode, r.Sample.SubmitterSampleId)
		r.addErrors(message, SampleOrgNotExistCode, path)
	}
}

func validateExistingSampleFieldFn[T comparable](
	r *SampleValidationRecord,
	fieldName string,
	existingSampleValue T,
	recordValue T,

) {
	if existingSampleValue != recordValue {
		path := r.formatPath(fieldName)
		message := fmt.Sprintf("A sample with same ids (%s / %s) has been found  but with a different %s (%v <> %v)",
			r.Sample.SubmitterOrganizationCode,
			r.Sample.SubmitterSampleId,
			fieldName,
			existingSampleValue,
			recordValue,
		)
		r.addWarnings(message, SampleExistingSampleDifferentFieldCode, path)
	}
}

func processSampleBatch(batch *types.Batch, db *gorm.DB, repoOrganization repository.OrganizationDAO, repoSample repository.SamplesDAO, repoBatch *repository.BatchRepository) {
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
				// TODO: Make sure all fields are correctly mapped
				TypeCode:                record.Sample.TypeCode,
				SubmitterSampleId:       record.Sample.SubmitterSampleId,
				TissueType:              record.Sample.TissueSite,
				HistologyTypeCode:       record.Sample.HistologyCode,
				SubmitterOrganizationId: record.OrganizationId,
			}
			err := repo.CreateSample(&sample)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func validateSamplesBatch(samples []types.SampleBatch, repoOrganization repository.OrganizationDAO, repoSample repository.SamplesDAO) ([]SampleValidationRecord, error) {
	var records []SampleValidationRecord
	samplesMap := make(map[string]*types.SampleBatch)

	for index, sample := range samples {
		record := &SampleValidationRecord{Sample: sample}
		record.Index = index

		// 1. Validate fields
		record.validateOrganizationPatientId()
		record.validateFieldLength("parent_submitter_sample_id", sample.ParentSubmitterSampleId)
		record.validateFieldLength("tissue_site", sample.TissueSite)

		// 2. Check if there's already a sample with same key submitter_organization_id:submitter_sample_id in map
		key := fmt.Sprintf("%s:%s", sample.SubmitterOrganizationCode, sample.SubmitterSampleId)
		existingSample, exists := samplesMap[key]
		if exists {
			// 3. If yes, check if all fields are identical, if not add error messages
			record.validateExistingSampleInBatch(existingSample)
			// Validate parent_submitter_sample_id in batch if provided
			record.validateExistingParentSampleInBatch(samplesMap, existingSample)
		}

		// 4. If no, check if sample exists in DB
		organization, orgErr := repoOrganization.GetOrganizationByCode(sample.SubmitterOrganizationCode)
		if orgErr != nil {
			return nil, fmt.Errorf("error getting existing organization: %v", orgErr)
		}
		if organization != nil {
			existingSample, sampleErr := repoSample.GetSampleBySubmitterSampleId(organization.ID, sample.SubmitterSampleId)
			if sampleErr != nil {
				return nil, fmt.Errorf("error getting existing sample: %v", sampleErr)
			} else if existingSample != nil {
				// 5. If exists, check if all fields are identical, if not add error messages
				record.validateExistingSampleInDb(existingSample)
			}
			// Validate parent_submitter_sample_id in DB if provided
			parentSampleErr := record.validateExistingParentSampleInDb(sample, organization.ID, repoSample)
			if parentSampleErr != nil {
				return nil, fmt.Errorf("error validating parent sample id: %v", parentSampleErr)
			}
		}
		record.validateSubmitterOrganization(organization)

		// 6. Add to records and to sample map
		samplesMap[key] = &sample
		records = append(records, *record)
	}
	return records, nil
}
