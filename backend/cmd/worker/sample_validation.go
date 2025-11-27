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

func (r SampleValidationRecord) GetResourceType() string {
	return types.SampleBatchType
}

func (r *SampleValidationRecord) validateFieldLength(fieldName string, fieldValue string) {
	if fieldValue == "" {
		return
	}
	if len(fieldValue) > TextMaxLength {
		path := formatPath(r, fieldName)
		message := formatFieldTooLong(r, fieldName, TextMaxLength, []string{r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId.String()})
		r.addErrors(message, SampleInvalidValueCode, path)
	}
}

func (r *SampleValidationRecord) validatePatient(patient *types.Patient) {
	if patient == nil {
		path := formatPath(r, "submitter_patient_id")
		message := fmt.Sprintf("Patient %s / %s for sample %s does not exist", r.Sample.PatientOrganizationCode, r.Sample.SubmitterPatientId, r.Sample.SubmitterSampleId)
		r.addErrors(message, SamplePatientNotExistCode, path)
	} else {
		r.PatientId = patient.ID
	}
}

func (r *SampleValidationRecord) validateOrganization(organization *types.Organization) {
	if organization == nil {
		path := formatPath(r, "sample_organization_code")
		message := fmt.Sprintf("Organization %s for sample %s does not exist", r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
		r.addErrors(message, SampleOrgNotExistCode, path)
	} else {
		r.OrganizationId = organization.ID
	}
}

func (r *SampleValidationRecord) validateExistingSampleInDb(existingSample *types.Sample) {
	if existingSample != nil {
		message := fmt.Sprintf("Sample (%s / %s) already exists in database, skipped.", r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
		r.addInfos(message, SampleAlreadyExistCode, formatPath(r, ""))
		r.Skipped = true
		validateExistingSampleField(r, "type_code", existingSample.TypeCode, r.Sample.TypeCode)
		validateExistingSampleField(r, "tissue_site", existingSample.TissueSite, r.Sample.TissueSite.String())
		validateExistingSampleField(r, "histology_code", existingSample.HistologyCode, r.Sample.HistologyCode)
	}
}

func (r *SampleValidationRecord) validateExistingParentSampleInDb(existingParentSample *types.Sample) {
	fieldName := "submitter_parent_sample_id"
	path := formatPath(r, fieldName)
	if existingParentSample != nil {
		if existingParentSample.PatientID != r.PatientId {
			message := fmt.Sprintf("Invalid parent sample %s for sample (%s / %s)", r.Sample.SubmitterParentSampleId, r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
			r.addErrors(message, SampleInvalidPatientForParentSampleCode, path)
		} else {
			validateExistingSampleField(r, fieldName, existingParentSample.SubmitterSampleId, r.Sample.SubmitterParentSampleId.String())
		}
	}
}

func (r *SampleValidationRecord) validateExistingParentSampleInBatch(parentSampleInBatch bool) {
	fieldName := "submitter_parent_sample_id"
	path := formatPath(r, fieldName)
	if !parentSampleInBatch {
		message := fmt.Sprintf("Sample %s does not exist", r.Sample.SubmitterParentSampleId)
		r.addErrors(message, SampleUnknownParentSubmitterSampleIdCode, path)
	}
}

func validateExistingSampleField[T comparable](
	r *SampleValidationRecord,
	fieldName string,
	existingSampleValue T,
	recordValue T,
) {
	if existingSampleValue != recordValue {
		path := formatPath(r, fieldName)
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

func persistBatchAndSampleRecords(db *gorm.DB, batch *types.Batch, records []*SampleValidationRecord) error {
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

func insertSampleRecords(records []*SampleValidationRecord, repo repository.SamplesDAO) error {
	for _, record := range records {
		if !record.Skipped {
			sample := types.Sample{
				TypeCode:          record.Sample.TypeCode,
				SubmitterSampleId: record.Sample.SubmitterSampleId.String(),
				TissueSite:        record.Sample.TissueSite.String(),
				HistologyCode:     record.Sample.HistologyCode,
				OrganizationId:    record.OrganizationId,
			}
			err := repo.CreateSample(&sample)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func samplesMap(samples []types.SampleBatch) map[string]*types.SampleBatch {
	samplesMap := make(map[string]*types.SampleBatch)
	for i := range samples {
		key := fmt.Sprintf("%s:%s", samples[i].SampleOrganizationCode, samples[i].SubmitterSampleId)
		samplesMap[key] = &samples[i]
	}
	return samplesMap
}

func reorderSampleRecords(records []*SampleValidationRecord) {
	makeKey := func(r *SampleValidationRecord) string {
		return fmt.Sprintf("%s:%s", r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
	}

	keyToRecord := make(map[string]*SampleValidationRecord, len(records))
	for _, r := range records {
		keyToRecord[makeKey(r)] = r
	}

	visited := make(map[string]bool, len(records))
	var sorted []*SampleValidationRecord
	var visit func(*SampleValidationRecord)
	visit = func(r *SampleValidationRecord) {
		id := makeKey(r)
		if visited[id] {
			return
		}
		visited[id] = true
		if r.Sample.SubmitterParentSampleId != "" {
			parentID := fmt.Sprintf("%s:%s", r.Sample.SampleOrganizationCode, r.Sample.SubmitterParentSampleId)
			if parent, ok := keyToRecord[parentID]; ok {
				visit(parent)
			}
		}
		sorted = append(sorted, r)
	}

	for _, r := range records {
		visit(r)
	}
	copy(records, sorted)
}

func validateSamplesBatch(samples []types.SampleBatch, repoOrganization repository.OrganizationDAO, repoPatient repository.PatientsDAO, repoSample repository.SamplesDAO) ([]*SampleValidationRecord, error) {
	records := make([]*SampleValidationRecord, 0, len(samples))
	samplesMap := samplesMap(samples)

	for index, sample := range samples {
		record := &SampleValidationRecord{
			BaseValidationRecord: BaseValidationRecord{Index: index},
			Sample:               sample,
		}

		// 1. Validate fields
		record.validateFieldLength("submitter_parent_sample_id", sample.SubmitterParentSampleId.String())
		record.validateFieldLength("tissue_site", sample.TissueSite.String())

		// 2. Validate patient
		patient, patientErr := repoPatient.GetPatientByOrgCodeAndSubmitterPatientId(sample.PatientOrganizationCode, sample.SubmitterPatientId.String())
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
			existingSample, sampleErr := repoSample.GetSampleBySubmitterSampleId(organization.ID, sample.SubmitterSampleId.String())
			if sampleErr != nil {
				return nil, fmt.Errorf("error getting existing sample: %v", sampleErr)
			} else if existingSample != nil {
				// 5. If exists, check if all fields are identical, and add error messages
				record.validateExistingSampleInDb(existingSample)
			}

			// 6. Validate parent sample in DB if provided
			if sample.SubmitterParentSampleId != "" {
				existingParentSample, parentSampleErr := repoSample.GetSampleBySubmitterSampleId(organization.ID, sample.SubmitterParentSampleId.String())
				if parentSampleErr != nil {
					return nil, fmt.Errorf("error getting existing parent sample: %v", parentSampleErr)
				}
				record.validateExistingParentSampleInDb(existingParentSample)

				if existingParentSample == nil {
					// 7. If parent sample does not exist in DB, check if it exists in the current batch
					_, parentSampleIsInBatch := samplesMap[fmt.Sprintf("%s:%s", sample.SampleOrganizationCode, sample.SubmitterParentSampleId)]
					record.validateExistingParentSampleInBatch(parentSampleIsInBatch)
				}
			}
		}
		records = append(records, record)
	}

	reorderSampleRecords(records)
	return records, nil
}
