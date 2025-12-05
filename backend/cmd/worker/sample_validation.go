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

const TissueSiteRegExp = `^[A-Za-z\- ]+$`

var TissueSiteRegExpCompiled = regexp.MustCompile(TissueSiteRegExp)

const SampleAlreadyExistCode = "SAMPLE-001"
const SampleExistingSampleDifferentFieldCode = "SAMPLE-002"
const SampleOrgNotExistCode = "SAMPLE-003"
const SamplePatientNotExistCode = "SAMPLE-004"
const SampleUnknownParentSubmitterSampleIdCode = "SAMPLE-005"
const SampleInvalidValueCode = "SAMPLE-006"
const SampleInvalidPatientForParentSampleCode = "SAMPLE-007"
const SampleDuplicateInBatchCode = "SAMPLE-008"

type SampleValidationRecord struct {
	BaseValidationRecord
	Sample         types.SampleBatch
	PatientId      int
	OrganizationId int
	ParentSampleId *int
}

func (r *SampleValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *SampleValidationRecord) GetResourceType() string {
	return types.SampleBatchType
}

func (r *SampleValidationRecord) formatFieldRegexpMatch(fieldName string, regexp string) string {
	reason := fmt.Sprintf("does not match the regular expression %s", regexp)
	return formatInvalidField(r, fieldName, reason, []string{r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId.String()})
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
		message := fmt.Sprintf("Patient (%s / %s) for sample %s does not exist.", r.Sample.PatientOrganizationCode, r.Sample.SubmitterPatientId, r.Sample.SubmitterSampleId)
		r.addErrors(message, SamplePatientNotExistCode, path)
	} else {
		r.PatientId = patient.ID
	}
}

func (r *SampleValidationRecord) validateOrganization(organization *types.Organization) {
	if organization == nil {
		path := formatPath(r, "sample_organization_code")
		message := fmt.Sprintf("Organization %s for sample %s does not exist.", r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
		r.addErrors(message, SampleOrgNotExistCode, path)
	} else {
		r.OrganizationId = organization.ID
	}
}

func (r *SampleValidationRecord) validateExistingSampleInDb(existingSample *types.Sample) {
	if existingSample != nil {
		message := fmt.Sprintf("Sample (%s / %s) already exists, skipped.", r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
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
			message := fmt.Sprintf("Invalid field %s for sample (%s / %s). Reason: Invalid parent sample %s for this sample.", fieldName, r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId, r.Sample.SubmitterParentSampleId.String())
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
		message := fmt.Sprintf("Sample %s does not exist.", r.Sample.SubmitterParentSampleId)
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
		message := fmt.Sprintf("A sample with same ids (%s / %s) has been found but with a different %s (%v <> %v).",
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
	createdSamples := make(map[samplesKey]int)

	for _, record := range records {
		if !record.Skipped {
			var parentSampleId *int
			if record.ParentSampleId != nil {
				parentSampleId = record.ParentSampleId
			} else if record.Sample.SubmitterParentSampleId != "" {
				parentKey := samplesKey{
					OrganizationCode:  record.Sample.SampleOrganizationCode,
					SubmitterSampleId: record.Sample.SubmitterParentSampleId.String(),
				}
				if parentId, exists := createdSamples[parentKey]; exists {
					parentSampleId = &parentId
				}
			}

			sample := types.Sample{
				TypeCode:          record.Sample.TypeCode,
				SubmitterSampleId: record.Sample.SubmitterSampleId.String(),
				TissueSite:        record.Sample.TissueSite.String(),
				HistologyCode:     record.Sample.HistologyCode,
				OrganizationId:    record.OrganizationId,
				PatientID:         record.PatientId,
				ParentSampleID:    parentSampleId,
			}
			newSample, err := repo.CreateSample(&sample)
			if err != nil {
				return err
			}

			sampleKey := samplesKey{
				OrganizationCode:  record.Sample.SampleOrganizationCode,
				SubmitterSampleId: record.Sample.SubmitterSampleId.String(),
			}
			createdSamples[sampleKey] = newSample.ID
		}
	}
	return nil
}

type samplesKey struct {
	OrganizationCode  string
	SubmitterSampleId string
}

func samplesMap(samples []types.SampleBatch) map[samplesKey]*types.SampleBatch {
	samplesMap := make(map[samplesKey]*types.SampleBatch)
	for i := range samples {
		key := samplesKey{
			OrganizationCode:  samples[i].SampleOrganizationCode,
			SubmitterSampleId: samples[i].SubmitterSampleId.String(),
		}
		samplesMap[key] = &samples[i]
	}
	return samplesMap
}

func reorderSampleRecords(records []*SampleValidationRecord) {
	keyToRecord := make(map[samplesKey]*SampleValidationRecord, len(records))
	for _, r := range records {
		key := samplesKey{
			OrganizationCode:  r.Sample.SampleOrganizationCode,
			SubmitterSampleId: r.Sample.SubmitterSampleId.String(),
		}
		keyToRecord[key] = r
	}

	visited := make(map[samplesKey]bool, len(records))
	var sorted []*SampleValidationRecord
	var visit func(*SampleValidationRecord)
	visit = func(r *SampleValidationRecord) {
		id := samplesKey{
			OrganizationCode:  r.Sample.SampleOrganizationCode,
			SubmitterSampleId: r.Sample.SubmitterSampleId.String(),
		}
		if visited[id] {
			return
		}
		visited[id] = true
		if r.Sample.SubmitterParentSampleId != "" {
			parentID := samplesKey{
				OrganizationCode:  r.Sample.SampleOrganizationCode,
				SubmitterSampleId: r.Sample.SubmitterParentSampleId.String(),
			}
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

func (r *SampleValidationRecord) validateFieldWithRegexp(fieldName string, fieldValue string, regexpCompiled *regexp.Regexp, regexpStr string, required bool) {
	if !required && fieldValue == "" {
		return
	}
	r.validateFieldLength(fieldName, fieldValue)
	if !regexpCompiled.MatchString(fieldValue) {
		message := r.formatFieldRegexpMatch(fieldName, regexpStr)
		path := formatPath(r, fieldName)
		r.addErrors(message, SampleInvalidValueCode, path)
	}
}

func (r *SampleValidationRecord) validateSubmitterPatientId() {
	r.validateFieldWithRegexp("submitter_patient_id", r.Sample.SubmitterPatientId.String(), ExternalIdRegexpCompiled, ExternalIdRegexp, true)
}

func (r *SampleValidationRecord) validateSubmitterSampleId() {
	r.validateFieldWithRegexp("submitter_sample_id", r.Sample.SubmitterSampleId.String(), ExternalIdRegexpCompiled, ExternalIdRegexp, true)
}

func (r *SampleValidationRecord) validateSubmitterParentSampleId() {
	r.validateFieldWithRegexp("submitter_parent_sample_id", r.Sample.SubmitterParentSampleId.String(), ExternalIdRegexpCompiled, ExternalIdRegexp, false)
}

func (r *SampleValidationRecord) validateTissueSite() {
	r.validateFieldWithRegexp("tissue_site", r.Sample.TissueSite.String(), TissueSiteRegExpCompiled, TissueSiteRegExp, false)
}

func validateSamplesBatch(samples []types.SampleBatch, repoOrganization repository.OrganizationDAO, repoPatient repository.PatientsDAO, repoSample repository.SamplesDAO) ([]*SampleValidationRecord, error) {
	records := make([]*SampleValidationRecord, 0, len(samples))
	samplesMap := samplesMap(samples)
	seenSamples := make(map[samplesKey]struct{})

	for index, sample := range samples {
		record := &SampleValidationRecord{
			BaseValidationRecord: BaseValidationRecord{Index: index},
			Sample:               sample,
		}

		// 1. Validate fields
		record.validateSubmitterPatientId()
		record.validateSubmitterSampleId()
		record.validateSubmitterParentSampleId()
		record.validateTissueSite()

		// 2. Validate duplicates in batch
		validateUniquenessInBatch(
			record,
			samplesKey{
				OrganizationCode:  sample.SampleOrganizationCode,
				SubmitterSampleId: sample.SubmitterSampleId.String(),
			},
			seenSamples,
			SampleDuplicateInBatchCode,
			[]string{sample.SampleOrganizationCode, sample.SubmitterSampleId.String()},
		)

		// 3. Validate patient
		patient, patientErr := repoPatient.GetPatientByOrgCodeAndSubmitterPatientId(sample.PatientOrganizationCode, sample.SubmitterPatientId.String())
		if patientErr != nil {
			return nil, fmt.Errorf("error getting existing patient: %v", patientErr)
		}
		record.validatePatient(patient)

		// 4. Validate organization
		organization, orgErr := repoOrganization.GetOrganizationByCode(sample.SampleOrganizationCode)
		if orgErr != nil {
			return nil, fmt.Errorf("error getting existing sample organization: %v", orgErr)
		}
		record.validateOrganization(organization)

		// 5. Validate if sample exists in DB
		if organization != nil {
			existingSample, sampleErr := repoSample.GetSampleBySubmitterSampleId(organization.ID, sample.SubmitterSampleId.String())
			if sampleErr != nil {
				return nil, fmt.Errorf("error getting existing sample: %v", sampleErr)
			}
			// 6. If exists, check if all fields are identical, and add error messages
			record.validateExistingSampleInDb(existingSample)

			// 7. Validate parent sample in DB if provided
			if sample.SubmitterParentSampleId != "" {
				existingParentSample, parentSampleErr := repoSample.GetSampleBySubmitterSampleId(organization.ID, sample.SubmitterParentSampleId.String())
				if parentSampleErr != nil {
					return nil, fmt.Errorf("error getting existing parent sample: %v", parentSampleErr)
				}
				record.validateExistingParentSampleInDb(existingParentSample)

				if existingParentSample == nil {
					// 8. If parent sample does not exist in DB, check if it exists in the current batch
					_, parentSampleIsInBatch := samplesMap[samplesKey{
						OrganizationCode:  sample.SampleOrganizationCode,
						SubmitterSampleId: sample.SubmitterParentSampleId.String(),
					}]
					record.validateExistingParentSampleInBatch(parentSampleIsInBatch)
				} else {
					// Parent sample exists in DB, set the parent sample ID
					record.ParentSampleId = &existingParentSample.ID
				}
			}
		}
		records = append(records, record)
	}

	reorderSampleRecords(records)
	return records, nil
}
