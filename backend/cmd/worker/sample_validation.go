package main

import (
	"encoding/json"
	"fmt"
	"regexp"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const TissueSiteRegExp = `^[A-Za-z\- ]+$`

var TissueSiteRegExpCompiled = regexp.MustCompile(TissueSiteRegExp)

const (
	SampleAlreadyExistCode                   = "SAMPLE-001"
	SampleExistingSampleDifferentFieldCode   = "SAMPLE-002"
	SampleOrgNotExistCode                    = "SAMPLE-003"
	SamplePatientNotExistCode                = "SAMPLE-004"
	SampleUnknownParentSubmitterSampleIdCode = "SAMPLE-005"
	SampleInvalidValueCode                   = "SAMPLE-006"
	SampleInvalidPatientForParentSampleCode  = "SAMPLE-007"
	SampleDuplicateInBatchCode               = "SAMPLE-008"
)

type SampleKey struct {
	OrganizationCode  string
	SubmitterSampleId string
}

type SampleValidationRecord struct {
	batchval.BaseValidationRecord
	Sample         types.SampleBatch
	PatientId      int
	OrganizationId int
	ParentSampleId *int
}

func (r *SampleValidationRecord) GetBase() *batchval.BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *SampleValidationRecord) GetResourceType() string {
	return types.SampleBatchType
}

func (r *SampleValidationRecord) getUniqueIds() []string {
	return []string{r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId.String()}
}

func (r *SampleValidationRecord) getFormattedPath(fieldName string) string {
	return batchval.FormatPath(r, fieldName)
}

func (r *SampleValidationRecord) validatePatient(patient *types.Patient) {
	if patient == nil {
		path := r.getFormattedPath("submitter_patient_id")
		message := fmt.Sprintf("Patient (%s / %s) for sample %s does not exist.", r.Sample.PatientOrganizationCode, r.Sample.SubmitterPatientId, r.Sample.SubmitterSampleId)
		r.AddErrors(message, SamplePatientNotExistCode, path)
	} else {
		r.PatientId = patient.ID
	}
}

func (r *SampleValidationRecord) validateOrganization(organization *types.Organization) {
	if organization == nil {
		path := r.getFormattedPath("sample_organization_code")
		message := fmt.Sprintf("Organization %s for sample %s does not exist.", r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
		r.AddErrors(message, SampleOrgNotExistCode, path)
	} else {
		r.OrganizationId = organization.ID
	}
}

func (r *SampleValidationRecord) validateExistingSampleInDb(existingSample *types.Sample) {
	if existingSample != nil {
		r.Skipped = true
		different := validateIsDifferentExistingSampleField(r, "type_code", existingSample.TypeCode, r.Sample.TypeCode)
		different = validateIsDifferentExistingSampleField(r, "tissue_site", existingSample.TissueSite, r.Sample.TissueSite.String()) || different
		different = validateIsDifferentExistingSampleField(r, "histology_code", existingSample.HistologyCode, r.Sample.HistologyCode) || different

		if !different {
			message := fmt.Sprintf("Sample (%s / %s) already exists, skipped.", r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId)
			r.AddInfos(message, SampleAlreadyExistCode, r.getFormattedPath(""))
		}
	}
}

func (r *SampleValidationRecord) validateExistingParentSampleInDb(existingParentSample *types.Sample) {
	fieldName := "submitter_parent_sample_id"
	path := r.getFormattedPath(fieldName)
	if existingParentSample != nil {
		if existingParentSample.PatientID != r.PatientId {
			message := fmt.Sprintf("Invalid field %s for sample (%s / %s). Reason: Invalid parent sample %s for this sample.", fieldName, r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId, r.Sample.SubmitterParentSampleId.String())
			r.AddErrors(message, SampleInvalidPatientForParentSampleCode, path)
		} else {
			validateIsDifferentExistingSampleField(r, fieldName, existingParentSample.SubmitterSampleId, r.Sample.SubmitterParentSampleId.String())
		}
	}
}

func (r *SampleValidationRecord) validateExistingParentSampleInBatch(parentSampleInBatch bool) {
	fieldName := "submitter_parent_sample_id"
	path := r.getFormattedPath(fieldName)
	if !parentSampleInBatch {
		message := fmt.Sprintf("Sample %s does not exist.", r.Sample.SubmitterParentSampleId)
		r.AddErrors(message, SampleUnknownParentSubmitterSampleIdCode, path)
	}
}

func validateIsDifferentExistingSampleField[T comparable](
	r *SampleValidationRecord,
	fieldName string,
	existingSampleValue T,
	recordValue T,
) bool {
	if existingSampleValue != recordValue {
		path := r.getFormattedPath(fieldName)
		message := fmt.Sprintf("A sample with same ids (%s / %s) has been found but with a different %s (%v <> %v).",
			r.Sample.SampleOrganizationCode,
			r.Sample.SubmitterSampleId,
			fieldName,
			existingSampleValue,
			recordValue,
		)
		r.AddWarnings(message, SampleExistingSampleDifferentFieldCode, path)
		return true
	}
	return false
}

func processSampleBatch(ctx *batchval.BatchValidationContext, batch *types.Batch, db *gorm.DB) {
	payload := []byte(batch.Payload)
	var samplesbatch []types.SampleBatch

	if unexpectedErr := json.Unmarshal(payload, &samplesbatch); unexpectedErr != nil {
		batchval.ProcessUnexpectedError(batch, fmt.Errorf("error unmarshalling sample batch: %v", unexpectedErr), ctx.BatchRepo)
		return
	}

	records, unexpectedErr := validateSamplesBatch(ctx, samplesbatch)
	if unexpectedErr != nil {
		batchval.ProcessUnexpectedError(batch, fmt.Errorf("error sample batch validation: %v", unexpectedErr), ctx.BatchRepo)
		return
	}

	glog.Infof("Sample batch %v processed with %d records", batch.ID, len(records))

	err := persistBatchAndSampleRecords(db, batch, records)
	if err != nil {
		batchval.ProcessUnexpectedError(batch, fmt.Errorf("error processing sample batch records: %v", err), ctx.BatchRepo)
		return
	}
}

func persistBatchAndSampleRecords(db *gorm.DB, batch *types.Batch, records []*SampleValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		txRepoSample := repository.NewSamplesRepository(tx)
		txRepoBatch := repository.NewBatchRepository(tx)
		rowsUpdated, unexpectedErrUpdate := batchval.UpdateBatch(batch, records, txRepoBatch)
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
	createdSamples := make(map[SampleKey]int)

	for _, record := range records {
		if !record.Skipped {
			var parentSampleId *int
			if record.ParentSampleId != nil {
				parentSampleId = record.ParentSampleId
			} else if record.Sample.SubmitterParentSampleId != "" {
				parentKey := SampleKey{
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

			sampleKey := SampleKey{
				OrganizationCode:  record.Sample.SampleOrganizationCode,
				SubmitterSampleId: record.Sample.SubmitterSampleId.String(),
			}
			createdSamples[sampleKey] = newSample.ID
		}
	}
	return nil
}

func samplesMap(samples []types.SampleBatch) map[SampleKey]*types.SampleBatch {
	samplesMap := make(map[SampleKey]*types.SampleBatch)
	for i := range samples {
		key := SampleKey{
			OrganizationCode:  samples[i].SampleOrganizationCode,
			SubmitterSampleId: samples[i].SubmitterSampleId.String(),
		}
		samplesMap[key] = &samples[i]
	}
	return samplesMap
}

func getSampleKey(orgCode, sampleId string) SampleKey {
	return SampleKey{
		OrganizationCode:  orgCode,
		SubmitterSampleId: sampleId,
	}
}

func reorderSampleRecords(records []*SampleValidationRecord) []*SampleValidationRecord {
	byKey := make(map[SampleKey][]*SampleValidationRecord)
	for _, r := range records {
		key := getSampleKey(r.Sample.SampleOrganizationCode, r.Sample.SubmitterSampleId.String())
		byKey[key] = append(byKey[key], r)
	}

	reordered := make([]*SampleValidationRecord, 0, len(records))
	visited := make(map[*SampleValidationRecord]bool)

	var reorder func(r *SampleValidationRecord)
	reorder = func(r *SampleValidationRecord) {
		if visited[r] {
			return
		}
		visited[r] = true

		if parentID := r.Sample.SubmitterParentSampleId.String(); parentID != "" {
			parentKey := getSampleKey(r.Sample.SampleOrganizationCode, parentID)
			for _, parent := range byKey[parentKey] {
				reorder(parent)
			}
		}
		reordered = append(reordered, r)
	}

	for _, r := range records {
		reorder(r)
	}

	return reordered
}

func (r *SampleValidationRecord) validateSubmitterPatientId() {
	path := r.getFormattedPath("submitter_patient_id")
	r.ValidateStringField(r.Sample.SubmitterPatientId.String(), "submitter_patient_id", path, SampleInvalidValueCode, r.GetResourceType(), TextMaxLength, ExternalIdRegexpCompiled, r.getUniqueIds(), true)
}

func (r *SampleValidationRecord) validateSubmitterSampleId() {
	path := r.getFormattedPath("submitter_sample_id")
	r.ValidateStringField(r.Sample.SubmitterSampleId.String(), "submitter_sample_id", path, SampleInvalidValueCode, r.GetResourceType(), TextMaxLength, ExternalIdRegexpCompiled, r.getUniqueIds(), true)
}

func (r *SampleValidationRecord) validateSubmitterParentSampleId() {
	path := r.getFormattedPath("submitter_parent_sample_id")
	r.ValidateStringField(r.Sample.SubmitterParentSampleId.String(), "submitter_parent_sample_id", path, SampleInvalidValueCode, r.GetResourceType(), TextMaxLength, ExternalIdRegexpCompiled, r.getUniqueIds(), false)
}

func (r *SampleValidationRecord) validateTissueSite() {
	path := r.getFormattedPath("tissue_site")
	r.ValidateStringField(r.Sample.TissueSite.String(), "tissue_site", path, SampleInvalidValueCode, r.GetResourceType(), TextMaxLength, TissueSiteRegExpCompiled, r.getUniqueIds(), false)
}

func (r *SampleValidationRecord) validateTypeCode() error {
	codes, err := r.Context.ValueSetsRepo.GetCodes(repository.ValueSetSampleType)
	if err != nil {
		return fmt.Errorf("error retrieving sample type codes: %v", err)
	}
	r.ValidateCode(r.GetResourceType(), r.getFormattedPath("type_code"), "type_code", SampleInvalidValueCode, r.Sample.TypeCode, codes, r.getUniqueIds(), true)
	return nil
}

func (r *SampleValidationRecord) validateHistologyCode() error {
	codes, err := r.Context.ValueSetsRepo.GetCodes(repository.ValueSetHistologyType)
	if err != nil {
		return fmt.Errorf("error retrieving sample histology codes: %v", err)
	}
	r.ValidateCode(r.GetResourceType(), r.getFormattedPath("histology_code"), "histology_code", SampleInvalidValueCode, r.Sample.HistologyCode, codes, r.getUniqueIds(), true)
	return nil
}

func validateSamplesBatch(ctx *batchval.BatchValidationContext, samples []types.SampleBatch) ([]*SampleValidationRecord, error) {
	records := make([]*SampleValidationRecord, 0, len(samples))
	samplesMap := samplesMap(samples)
	seenSamples := make(map[SampleKey]struct{})

	for index, sample := range samples {
		record := &SampleValidationRecord{
			BaseValidationRecord: batchval.BaseValidationRecord{
				Context: ctx,
				Index:   index,
			},
			Sample: sample,
		}

		// 1. Validate fields
		record.validateSubmitterPatientId()
		record.validateSubmitterSampleId()
		record.validateSubmitterParentSampleId()
		record.validateTissueSite()

		if err := record.validateTypeCode(); err != nil {
			return nil, err
		}
		if err := record.validateHistologyCode(); err != nil {
			return nil, err
		}

		// 2. Validate duplicates in batch
		batchval.ValidateUniquenessInBatch(
			record,
			SampleKey{
				OrganizationCode:  sample.SampleOrganizationCode,
				SubmitterSampleId: sample.SubmitterSampleId.String(),
			},
			seenSamples,
			SampleDuplicateInBatchCode,
			[]string{sample.SampleOrganizationCode, sample.SubmitterSampleId.String()},
		)

		// 3. Validate patient
		patient, patientErr := ctx.PatientRepo.GetPatientByOrgCodeAndSubmitterPatientId(sample.PatientOrganizationCode, sample.SubmitterPatientId.String())
		if patientErr != nil {
			return nil, fmt.Errorf("error getting existing patient: %v", patientErr)
		}
		record.validatePatient(patient)

		// 4. Validate organization
		organization, orgErr := ctx.OrgRepo.GetOrganizationByCode(sample.SampleOrganizationCode)
		if orgErr != nil {
			return nil, fmt.Errorf("error getting existing sample organization: %v", orgErr)
		}
		record.validateOrganization(organization)

		// 5. Validate if sample exists in DB
		if organization != nil {
			existingSample, sampleErr := ctx.SampleRepo.GetSampleBySubmitterSampleId(organization.ID, sample.SubmitterSampleId.String())
			if sampleErr != nil {
				return nil, fmt.Errorf("error getting existing sample: %v", sampleErr)
			}
			// 6. If exists, check if all fields are identical, and add error messages
			record.validateExistingSampleInDb(existingSample)

			// 7. Validate parent sample in DB if provided
			if sample.SubmitterParentSampleId != "" {
				existingParentSample, parentSampleErr := ctx.SampleRepo.GetSampleBySubmitterSampleId(organization.ID, sample.SubmitterParentSampleId.String())
				if parentSampleErr != nil {
					return nil, fmt.Errorf("error getting existing parent sample: %v", parentSampleErr)
				}
				record.validateExistingParentSampleInDb(existingParentSample)

				if existingParentSample == nil {
					// 8. If parent sample does not exist in DB, check if it exists in the current batch
					_, parentSampleIsInBatch := samplesMap[SampleKey{
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

	reordered := reorderSampleRecords(records)
	return reordered, nil
}
