package main

import (
	"encoding/json"
	"fmt"
	"slices"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const SampleAlreadyExistCode = "SAMPLE-001"
const SampleExistingSampleDifferentFieldCode = "SAMPLE-002"
const SampleOrgNotExistCode = "SAMPLE-003"
const SamplePatientNotExistCode = "SAMPLE-004"
const SampleUnknownParentSubmitterSampleIdCode = "SAMPLE-005"
const SampleInvalidValueCode = "SAMPLE-006"
const SampleInvalidPatientForParentSampleCode = "SAMPLE-007"

type SampleValidationRecord struct {
	BaseValidationRecord
	Sample         types.SampleBatch
	PatientId      int
	OrganizationId int
}

func (r SampleValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r SampleValidationRecord) formatInvalidField(fieldName string, reason string) string {
	message := fmt.Sprintf("Invalid Field %s for sample (%s / %s). Reason: %s", fieldName, r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId, reason)
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

func (r *SampleValidationRecord) validatePatient(patient *types.Patient) {
	if patient == nil {
		path := r.formatPath("submitter_patient_id")
		message := fmt.Sprintf("Patient %s / %s for sample %s does not exist", r.Sample.PatientOrganizationCode, r.Sample.SubmitterPatientId, r.Sample.SubmitterSampleId)
		r.addErrors(message, SamplePatientNotExistCode, path)
	} else {
		r.PatientId = patient.ID
	}
}

func (r *SampleValidationRecord) validateOrganization(organization *types.Organization) {
	if organization == nil {
		path := r.formatPath("sample_organization_code")
		message := fmt.Sprintf("Organization %s for sample %s does not exist", r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
		r.addErrors(message, SampleOrgNotExistCode, path)
	} else {
		r.OrganizationId = organization.ID
	}
}

func (r *SampleValidationRecord) validateExistingSampleInDb(existingSample *types.Sample) {
	if existingSample != nil {
		message := fmt.Sprintf("Sample (%s / %s) already exists in database, skipped.", r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
		r.addInfos(message, SampleAlreadyExistCode, r.formatPath(""))
		r.Skipped = true
		validateExistingSampleFieldFn(r, "type_code", existingSample.TypeCode, r.Sample.TypeCode)
		validateExistingSampleFieldFn(r, "tissue_site", existingSample.TissueType, r.Sample.TissueSite)              // TODO: Check if this is correct
		validateExistingSampleFieldFn(r, "histology_code", existingSample.HistologyTypeCode, r.Sample.HistologyCode) // TODO: Check if this is correct
	}
}

func (r *SampleValidationRecord) validateExistingParentSampleInDb(existingParentSample *types.Sample) {
	fieldName := "submitter_parent_sample_id"
	path := r.formatPath(fieldName)
	if existingParentSample != nil {
		if existingParentSample.PatientID != r.PatientId {
			message := fmt.Sprintf("Invalid parent sample %s for sample (%s / %s)", r.Sample.SubmitterParentSampleId, r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
			r.addErrors(message, SampleInvalidPatientForParentSampleCode, path)
		} else {
			// TODO: Check if necessary
			validateExistingSampleFieldFn(r, fieldName, existingParentSample.SubmitterSampleId, r.Sample.SubmitterParentSampleId)
		}
	}
}

func (r *SampleValidationRecord) validateExistingParentSampleInBatch(parentSampleInBatch bool) {
	fieldName := "submitter_parent_sample_id"
	path := r.formatPath(fieldName)
	if !parentSampleInBatch {
		message := fmt.Sprintf("Sample %s does not exist", r.Sample.SubmitterParentSampleId)
		r.addErrors(message, SampleUnknownParentSubmitterSampleIdCode, path)
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
			r.Sample.SampleOrganizationCode,
			r.Sample.SubmitterSampleId,
			fieldName,
			existingSampleValue,
			recordValue,
		)
		r.addWarnings(message, SampleExistingSampleDifferentFieldCode, path)
	}
}

func processSampleBatch(batch *types.Batch, db *gorm.DB, repoOrganization repository.OrganizationDAO, repoPatient repository.PatientsDAO, repoSample repository.SamplesDAO, repoBatch repository.BatchDAO) {
	payload := []byte(batch.Payload)
	var samplesbatch []types.SampleBatch

	if unexpectedErr := json.Unmarshal(payload, &samplesbatch); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling sample batch: %v", unexpectedErr), repoBatch)
		return
	}

	records, unexpectedErr := validateSamplesBatch(samplesbatch, repoOrganization, repoPatient, repoSample)
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

func insertSampleRecords(records []SampleValidationRecord, repo repository.SamplesDAO) error {
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

func validateSamplesBatch(samples []types.SampleBatch, repoOrganization repository.OrganizationDAO, repoPatient repository.PatientsDAO, repoSample repository.SamplesDAO) ([]SampleValidationRecord, error) {
	var records []SampleValidationRecord

	for index, sample := range samples {
		record := &SampleValidationRecord{
			Sample: sample,
			BaseValidationRecord: BaseValidationRecord{
				Index: index,
			},
		}

		// 1. Validate fields
		record.validateFieldLength("submitter_parent_sample_id", sample.SubmitterParentSampleId)
		record.validateFieldLength("tissue_site", sample.TissueSite)

		// 2. Validate patient
		patient, patientErr := repoPatient.GetPatientByOrgCodeAndOrgPatientId(sample.PatientOrganizationCode, sample.SubmitterPatientId)
		if patientErr != nil {
			return nil, fmt.Errorf("error getting existing patient: %v", patientErr)
		}
		record.validatePatient(patient)

		// 3. Validate organization
		organization, orgErr := repoOrganization.GetOrganizationByCode(sample.SampleOrganizationCode)
		if orgErr != nil {
			return nil, fmt.Errorf("error getting existing sample organization: %v", orgErr)
		}
		record.validateOrganization(organization)

		// 4. Validate if sample exists in DB
		if organization != nil {
			existingSample, sampleErr := repoSample.GetSampleBySubmitterSampleId(organization.ID, sample.SubmitterSampleId)
			if sampleErr != nil {
				return nil, fmt.Errorf("error getting existing sample: %v", sampleErr)
			} else if existingSample != nil {
				// 5. If exists, check if all fields are identical, and add error messages
				record.validateExistingSampleInDb(existingSample)
			}

			// 6. Validate parent sample in DB if provided
			if sample.SubmitterParentSampleId != "" {
				existingParentSample, parentSampleErr := repoSample.GetSampleBySubmitterSampleId(organization.ID, sample.SubmitterParentSampleId)
				if parentSampleErr != nil {
					return nil, fmt.Errorf("error getting existing parent sample: %v", parentSampleErr)
				}
				record.validateExistingParentSampleInDb(existingParentSample)

				if existingParentSample == nil {
					// 7. If parent sample does not exist in DB, check if it exists in the current batch
					parentSampleInBatch := slices.ContainsFunc(samples, func(s types.SampleBatch) bool {
						return s.SubmitterSampleId == sample.SubmitterParentSampleId && s.SampleOrganizationCode == sample.SampleOrganizationCode
					})
					record.validateExistingParentSampleInBatch(parentSampleInBatch)
				}
			}
		}
		records = append(records, *record)
	}
	return records, nil
}
