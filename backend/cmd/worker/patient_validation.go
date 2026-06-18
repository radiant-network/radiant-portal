package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"regexp"
	"slices"
	"strings"
	"time"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const NameRegExp = `^[a-zA-Z0-9()\- .'À-ÿ]*$`

var NameRegExpCompiled = regexp.MustCompile(NameRegExp)

var AllowedOrganizationCategories = []string{"healthcare_provider", "research_institute"}

const (
	PatientAlreadyExistCode                  = "PATIENT-001"
	PatientExistingPatientDifferentFieldCode = "PATIENT-002"
	PatientOrganizationNotExistCode          = "PATIENT-003"
	PatientInvalidValueCode                  = "PATIENT-004"
	PatientOrganizationTypeCode              = "PATIENT-005"
	PatientDuplicateInBatchCode              = "PATIENT-006"
)

type PatientValidationRecord struct {
	batchval.BaseValidationRecord
	Patient          types.PatientBatch
	OrganizationCode string
}

func (r *PatientValidationRecord) GetBase() *batchval.BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *PatientValidationRecord) GetResourceType() string {
	return types.PatientBatchType
}

func (r *PatientValidationRecord) getUniqueIds() []string {
	return []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
}

func (r *PatientValidationRecord) getFormattedPath(fieldName string) string {
	return batchval.FormatPath(r, fieldName)
}

func (r *PatientValidationRecord) validateSubmitterPatientId() {
	path := r.getFormattedPath("submitter_patient_id")
	r.ValidateStringField(r.Patient.SubmitterPatientId.String(), "submitter_patient_id", path, PatientInvalidValueCode, r.GetResourceType(), TextMaxLength, ExternalIdRegexpCompiled, r.getUniqueIds(), true)
}

func (r *PatientValidationRecord) validateSubmitterPatientIdType() {
	path := r.getFormattedPath("submitter_patient_id_type")
	r.ValidateStringField(r.Patient.SubmitterPatientIdType.String(), "submitter_patient_id_type", path, PatientInvalidValueCode, r.GetResourceType(), TextMaxLength, ExternalIdRegexpCompiled, r.getUniqueIds(), true)
}

func (r *PatientValidationRecord) validateLastName() {
	if r.Patient.LastName == "" {
		return
	}
	path := r.getFormattedPath("last_name")
	r.ValidateStringField(r.Patient.LastName.String(), "last_name", path, PatientInvalidValueCode, r.GetResourceType(), TextMaxLength, NameRegExpCompiled, r.getUniqueIds(), false)

}

func (r *PatientValidationRecord) validateFirstName() {
	if r.Patient.FirstName == "" {
		return
	}
	path := r.getFormattedPath("first_name")
	r.ValidateStringField(r.Patient.FirstName.String(), "first_name", path, PatientInvalidValueCode, r.GetResourceType(), TextMaxLength, NameRegExpCompiled, r.getUniqueIds(), false)

}

func (r *PatientValidationRecord) validateJhn() {
	if r.Patient.Jhn == "" {
		return
	}
	path := r.getFormattedPath("jhn")
	r.ValidateStringField(r.Patient.Jhn.String(), "jhn", path, PatientInvalidValueCode, r.GetResourceType(), TextMaxLength, ExternalIdRegexpCompiled, r.getUniqueIds(), false)

}

func (r *PatientValidationRecord) validateOrganization(organization *types.Organization) {
	path := r.getFormattedPath("patient_organization_code")
	if organization == nil {
		message := fmt.Sprintf("Organization %s for patient %s does not exist.", r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId)
		r.AddErrors(message, PatientOrganizationNotExistCode, path)
	} else if !slices.Contains(AllowedOrganizationCategories, organization.CategoryCode) {
		message := fmt.Sprintf("Organization type (%s) defined for patient (%s / %s) is not in this list : %s.",
			organization.CategoryCode,
			r.Patient.PatientOrganizationCode,
			r.Patient.SubmitterPatientId,
			strings.Join(AllowedOrganizationCategories, ", "),
		)
		r.AddErrors(message, PatientOrganizationTypeCode, path)
	} else {
		r.OrganizationCode = organization.Code
	}
}

func (r *PatientValidationRecord) validateDateOfBirth() {
	if r.Patient.DateOfBirth == nil {
		resIds := []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
		message := batchval.FormatInvalidField(r.GetResourceType(), "date_of_birth", "missing value, date of birth is required", resIds)
		r.AddErrors(message, PatientInvalidValueCode, r.getFormattedPath("date_of_birth"))
	}
}

func (r *PatientValidationRecord) validateExistingPatient(existingPatient *types.Patient) {
	if existingPatient == nil {
		return
	}

	r.Skipped = true
	anyDifference := validateIsDifferentExistingPatientField(r, "sex_code", existingPatient.SexCode, r.Patient.SexCode)
	anyDifference = validateIsDifferentExistingPatientField(r, "life_status_code", existingPatient.LifeStatusCode, r.Patient.LifeStatusCode) || anyDifference
	if r.Patient.DateOfBirth != nil {
		anyDifference = validateIsDifferentExistingPatientField(r, "date_of_birth", existingPatient.DateOfBirth, time.Time(*r.Patient.DateOfBirth)) || anyDifference
	} else {
		anyDifference = validateIsDifferentExistingPatientField(r, "date_of_birth", existingPatient.DateOfBirth, time.Time{}) || anyDifference
	}
	anyDifference = validateIsDifferentExistingPatientField(r, "last_name", existingPatient.LastName, r.Patient.LastName.String()) || anyDifference
	anyDifference = validateIsDifferentExistingPatientField(r, "first_name", existingPatient.FirstName, r.Patient.FirstName.String()) || anyDifference
	anyDifference = validateIsDifferentExistingPatientField(r, "jhn", existingPatient.Jhn, r.Patient.Jhn.String()) || anyDifference

	if !anyDifference {
		message := fmt.Sprintf("Patient (%s / %s) already exists, skipped.",
			r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId)
		r.AddInfos(message, PatientAlreadyExistCode, r.getFormattedPath(""))
	}
}

func (r *PatientValidationRecord) validateLifeStatusCode(ctx context.Context) error {
	codes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetLifeStatus)
	if err != nil {
		return fmt.Errorf("error getting life status codes: %v", err)
	}
	r.ValidateCode(r.GetResourceType(), r.getFormattedPath("life_status_code"), "life_status_code", PatientInvalidValueCode, r.Patient.LifeStatusCode, codes, r.getUniqueIds(), true)
	return nil
}

func (r *PatientValidationRecord) validateSexCode(ctx context.Context) error {
	codes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetSex)
	if err != nil {
		return err
	}
	r.ValidateCode(r.GetResourceType(), r.getFormattedPath("sex_code"), "sex_code", PatientInvalidValueCode, r.Patient.SexCode, codes, r.getUniqueIds(), true)
	return nil
}

func validateIsDifferentExistingPatientField[T comparable](
	r *PatientValidationRecord,
	fieldName string,
	existingPatientValue T,
	recordValue T,
) bool {
	if existingPatientValue != recordValue {
		path := r.getFormattedPath(fieldName)
		message := fmt.Sprintf("A patient with same ids (%s / %s) has been found but with a different %s (%v <> %v).",
			r.Patient.PatientOrganizationCode,
			r.Patient.SubmitterPatientId,
			fieldName,
			existingPatientValue,
			recordValue,
		)
		r.AddWarnings(message, PatientExistingPatientDifferentFieldCode, path)
		return true
	}
	return false
}

func processPatientBatch(ctx context.Context, bv *batchval.BatchValidationContext, batch *types.Batch, db *gorm.DB) error {
	payload := []byte(batch.Payload)
	var patients []types.PatientBatch

	if unexpectedErr := json.Unmarshal(payload, &patients); unexpectedErr != nil {
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error unmarshalling patient batch: %v", unexpectedErr), bv.BatchRepo)
		return nil
	}

	records, unexpectedErr := validatePatientsBatch(ctx, bv, patients)
	if unexpectedErr != nil {
		if errors.Is(unexpectedErr, context.Canceled) {
			return unexpectedErr
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error patient batch validation: %v", unexpectedErr), bv.BatchRepo)
		return nil
	}

	slog.InfoContext(ctx, "patient batch processed", slog.String("batch_id", batch.ID), slog.Int("records", len(records)))

	if err := persistBatchAndPatientRecords(ctx, db, batch, records); err != nil {
		if errors.Is(err, context.Canceled) {
			return err
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error processing patient batch records: %v", err), bv.BatchRepo)
		return nil
	}
	return nil
}

func persistBatchAndPatientRecords(ctx context.Context, db *gorm.DB, batch *types.Batch, records []*PatientValidationRecord) error {
	return db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		txRepoPatient := repository.NewPatientsRepository(tx)
		txRepoBatch := repository.NewBatchRepository(tx)
		rowsUpdated, unexpectedErrUpdate := batchval.UpdateBatch(ctx, batch, records, txRepoBatch)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			/* Logs directly, and return error to trigger rollback if the batch does not exist in db */
			return fmt.Errorf("no rows updated when updating patient batch %v", batch.ID)
		}
		if !batch.DryRun && batch.Status == types.BatchStatusSuccess {
			err := insertPatientRecords(ctx, records, txRepoPatient, batch.TenantCode)
			if err != nil {
				return fmt.Errorf("error during patient insertion %v", err)
			}
		}
		return nil
	})
}

type patientStore interface {
	CreatePatient(ctx context.Context, newPatient *types.Patient) error
}

func insertPatientRecords(ctx context.Context, records []*PatientValidationRecord, repo patientStore, tenantCode string) error {
	for _, record := range records {
		if !record.Skipped {
			patient := types.Patient{
				SubmitterPatientId:     record.Patient.SubmitterPatientId.String(),
				OrganizationCode:       record.OrganizationCode,
				TenantCode:             tenantCode,
				SubmitterPatientIdType: record.Patient.SubmitterPatientIdType.String(),
				FirstName:              record.Patient.FirstName.String(),
				LastName:               record.Patient.LastName.String(),
				Jhn:                    record.Patient.Jhn.String(),
				SexCode:                record.Patient.SexCode,
				LifeStatusCode:         record.Patient.LifeStatusCode,
			}
			if record.Patient.DateOfBirth != nil {
				patient.DateOfBirth = time.Time(*record.Patient.DateOfBirth)
			}
			err := repo.CreatePatient(ctx, &patient)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func validatePatientsBatch(ctx context.Context, bv *batchval.BatchValidationContext, patients []types.PatientBatch) ([]*PatientValidationRecord, error) {
	var records []*PatientValidationRecord
	cache := batchval.NewBatchValidationCache(bv)
	seenPatients := map[batchval.PatientKey]struct{}{}
	for index, patient := range patients {
		if err := ctx.Err(); err != nil {
			return nil, err
		}
		record, err := validatePatientRecord(ctx, bv, cache, patient, index, seenPatients)
		if err != nil {
			return nil, fmt.Errorf("error during patient validation: %v", err)
		}
		records = append(records, record)
	}
	return records, nil
}

func validatePatientRecord(ctx context.Context, bv *batchval.BatchValidationContext, cache *batchval.BatchValidationCache, patient types.PatientBatch, index int, seenPatients map[batchval.PatientKey]struct{}) (*PatientValidationRecord, error) {
	record := &PatientValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{
			Context: bv,
			Cache:   cache,
			Index:   index,
		},
		Patient: patient,
	}
	record.validateSubmitterPatientId()
	record.validateSubmitterPatientIdType()
	record.validateFirstName()
	record.validateLastName()
	record.validateJhn()
	record.validateDateOfBirth()

	if err := record.validateLifeStatusCode(ctx); err != nil {
		return nil, fmt.Errorf("error validating life status code: %v", err)
	}
	if err := record.validateSexCode(ctx); err != nil {
		return nil, fmt.Errorf("error validating sex code: %v", err)
	}

	batchval.ValidateUniquenessInBatch(record,
		batchval.PatientKey{
			OrganizationCode:   patient.PatientOrganizationCode,
			SubmitterPatientId: patient.SubmitterPatientId.String(),
		},
		seenPatients,
		PatientDuplicateInBatchCode,
		[]string{patient.PatientOrganizationCode, patient.SubmitterPatientId.String()},
	)

	organization, orgErr := bv.OrgRepo.GetOrganizationByCode(ctx, patient.PatientOrganizationCode)
	if orgErr != nil {
		return nil, fmt.Errorf("error getting existing organization: %v", orgErr)
	} else {
		record.validateOrganization(organization)
	}
	if organization != nil {
		existingPatient, patientErr := bv.PatientRepo.GetPatientByOrgCodeAndSubmitterPatientId(ctx, organization.Code, patient.SubmitterPatientId.String())
		if patientErr != nil {
			return nil, fmt.Errorf("error getting existing patient: %v", patientErr)
		} else {
			record.validateExistingPatient(existingPatient)
		}
	}
	return record, nil
}
