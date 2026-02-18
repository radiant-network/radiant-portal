package main

import (
	"encoding/json"
	"fmt"
	"regexp"
	"slices"
	"strings"
	"time"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/validation"
	"gorm.io/gorm"
)

const NameRegExp = `^[a-zA-Z0-9\- .'À-ÿ]*$`

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

type PatientKey struct {
	OrganizationCode   string
	SubmitterPatientId string
}

type PatientValidationRecord struct {
	validation.BaseValidationRecord
	Patient        types.PatientBatch
	OrganizationId int
}

func (r *PatientValidationRecord) GetBase() *validation.BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *PatientValidationRecord) GetResourceType() string {
	return types.PatientBatchType
}

func (r *PatientValidationRecord) validateSubmitterPatientId() {
	resIds := []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
	path := validation.FormatPath(r, "submitter_patient_id")
	if len(r.Patient.SubmitterPatientId) > TextMaxLength {
		message := validation.FormatFieldTooLong(r, "submitter_patient_id", TextMaxLength, resIds)
		r.AddErrors(message, PatientInvalidValueCode, path)
	}
	if !ExternalIdRegexpCompiled.MatchString(r.Patient.SubmitterPatientId.String()) {
		message := validation.FormatFieldRegexpMatch(r, "submitter_patient_id", ExternalIdRegexp, resIds)
		r.AddErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateSubmitterPatientIdType() {
	resIds := []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
	path := validation.FormatPath(r, "submitter_patient_id_type")
	if len(r.Patient.SubmitterPatientIdType) > TextMaxLength {
		message := validation.FormatFieldTooLong(r, "submitter_patient_id_type", TextMaxLength, resIds)
		r.AddErrors(message, PatientInvalidValueCode, path)
	}
	if !ExternalIdRegexpCompiled.MatchString(r.Patient.SubmitterPatientIdType.String()) {
		message := validation.FormatFieldRegexpMatch(r, "submitter_patient_id_type", ExternalIdRegexp, resIds)
		r.AddErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateLastName() {
	if r.Patient.LastName == "" {
		return
	}
	resIds := []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
	path := validation.FormatPath(r, "last_name")
	if len(r.Patient.LastName) > TextMaxLength {
		message := validation.FormatFieldTooLong(r, "last_name", TextMaxLength, resIds)
		r.AddErrors(message, PatientInvalidValueCode, path)
	}
	if !NameRegExpCompiled.MatchString(r.Patient.LastName.String()) {
		message := validation.FormatFieldRegexpMatch(r, "last_name", NameRegExp, resIds)
		r.AddErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateFirstName() {
	if r.Patient.FirstName == "" {
		return
	}
	resIds := []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
	path := validation.FormatPath(r, "first_name")
	if len(r.Patient.FirstName) > TextMaxLength {
		message := validation.FormatFieldTooLong(r, "first_name", TextMaxLength, resIds)
		r.AddErrors(message, PatientInvalidValueCode, path)
	}
	if !NameRegExpCompiled.MatchString(r.Patient.FirstName.String()) {
		message := validation.FormatFieldRegexpMatch(r, "first_name", NameRegExp, resIds)
		r.AddErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateJhn() {
	if r.Patient.Jhn == "" {
		return
	}
	resIds := []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
	path := validation.FormatPath(r, "jhn")
	if len(r.Patient.Jhn) > TextMaxLength {
		message := validation.FormatFieldTooLong(r, "jhn", TextMaxLength, resIds)
		r.AddErrors(message, PatientInvalidValueCode, path)
	}
	if !ExternalIdRegexpCompiled.MatchString(r.Patient.Jhn.String()) {
		message := validation.FormatFieldRegexpMatch(r, "jhn", ExternalIdRegexp, resIds)
		r.AddErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateOrganization(organization *types.Organization) {
	path := validation.FormatPath(r, "patient_organization_code")
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
		r.OrganizationId = organization.ID
	}
}

func (r *PatientValidationRecord) validateDateOfBirth() {
	if r.Patient.DateOfBirth == nil {
		resIds := []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
		message := validation.FormatInvalidField(r, "date_of_birth", "missing value, date of birth is required", resIds)
		r.AddErrors(message, PatientInvalidValueCode, validation.FormatPath(r, "date_of_birth"))
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
		r.AddInfos(message, PatientAlreadyExistCode, validation.FormatPath(r, ""))
	}
}

func (r *PatientValidationRecord) validateLifeStatusCode() error {
	codes, err := r.Context.ValueSetsRepo.GetCodes(repository.ValueSetLifeStatus)
	if err != nil {
		return fmt.Errorf("error getting life status codes: %v", err)
	}
	if r.Patient.LifeStatusCode == "" || !slices.Contains(codes, r.Patient.LifeStatusCode) {
		resIds := []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
		message := validation.FormatInvalidField(r, "life_status_code", fmt.Sprintf("value %q must be one of the allowed codes: [%s]", r.Patient.LifeStatusCode, strings.Join(codes, ", ")), resIds)
		r.AddErrors(message, PatientInvalidValueCode, validation.FormatPath(r, "life_status_code"))
	}
	return nil
}

func (r *PatientValidationRecord) validateSexCode() error {
	codes, err := r.Context.ValueSetsRepo.GetCodes(repository.ValueSetSex)
	if err != nil {
		return err
	}
	if r.Patient.SexCode == "" || !slices.Contains(codes, r.Patient.SexCode) {
		resIds := []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
		message := validation.FormatInvalidField(r, "sex_code", fmt.Sprintf("value %q must be one of the allowed codes: [%s]", r.Patient.SexCode, strings.Join(codes, ", ")), resIds)
		r.AddErrors(message, PatientInvalidValueCode, validation.FormatPath(r, "sex_code"))
	}
	return nil
}

func validateIsDifferentExistingPatientField[T comparable](
	r *PatientValidationRecord,
	fieldName string,
	existingPatientValue T,
	recordValue T,
) bool {
	if existingPatientValue != recordValue {
		path := validation.FormatPath(r, fieldName)
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

func processPatientBatch(ctx *validation.BatchValidationContext, batch *types.Batch, db *gorm.DB) {
	payload := []byte(batch.Payload)
	var patients []types.PatientBatch

	if unexpectedErr := json.Unmarshal(payload, &patients); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling patient batch: %v", unexpectedErr), ctx.BatchRepo)
		return
	}

	records, unexpectedErr := validatePatientsBatch(ctx, patients)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error patient batch validation: %v", unexpectedErr), ctx.BatchRepo)
		return
	}

	glog.Infof("Patient batch %v processed with %d records", batch.ID, len(records))

	err := persistBatchAndPatientRecords(db, batch, records)
	if err != nil {
		processUnexpectedError(batch, fmt.Errorf("error processing patient batch records: %v", err), ctx.BatchRepo)
		return
	}
}

func persistBatchAndPatientRecords(db *gorm.DB, batch *types.Batch, records []*PatientValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		txRepoPatient := repository.NewPatientsRepository(tx)
		txRepoBatch := repository.NewBatchRepository(tx)
		rowsUpdated, unexpectedErrUpdate := validation.UpdateBatch(batch, records, txRepoBatch)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			/* Logs directly, and return error to trigger rollback if the batch does not exist in db */
			return fmt.Errorf("no rows updated when updating patient batch %v", batch.ID)
		}
		if !batch.DryRun && batch.Status == types.BatchStatusSuccess {
			err := insertPatientRecords(records, txRepoPatient)
			if err != nil {
				return fmt.Errorf("error during patient insertion %v", err)
			}
		}
		return nil
	})
}

func insertPatientRecords(records []*PatientValidationRecord, repo repository.PatientsDAO) error {
	for _, record := range records {
		if !record.Skipped {
			patient := types.Patient{
				SubmitterPatientId:     record.Patient.SubmitterPatientId.String(),
				OrganizationId:         record.OrganizationId,
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
			err := repo.CreatePatient(&patient)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func validatePatientsBatch(ctx *validation.BatchValidationContext, patients []types.PatientBatch) ([]*PatientValidationRecord, error) {
	var records []*PatientValidationRecord
	seenPatients := map[PatientKey]struct{}{}
	for index, patient := range patients {
		record, err := validatePatientRecord(ctx, patient, index, seenPatients)
		if err != nil {
			return nil, fmt.Errorf("error during patient validation: %v", err)
		}
		records = append(records, record)
	}
	return records, nil
}

func validatePatientRecord(ctx *validation.BatchValidationContext, patient types.PatientBatch, index int, seenPatients map[PatientKey]struct{}) (*PatientValidationRecord, error) {
	record := &PatientValidationRecord{
		BaseValidationRecord: validation.BaseValidationRecord{
			Context: ctx,
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

	if err := record.validateLifeStatusCode(); err != nil {
		return nil, fmt.Errorf("error validating life status code: %v", err)
	}
	if err := record.validateSexCode(); err != nil {
		return nil, fmt.Errorf("error validating sex code: %v", err)
	}

	validation.ValidateUniquenessInBatch(record,
		PatientKey{
			OrganizationCode:   patient.PatientOrganizationCode,
			SubmitterPatientId: patient.SubmitterPatientId.String(),
		},
		seenPatients,
		PatientDuplicateInBatchCode,
		[]string{patient.PatientOrganizationCode, patient.SubmitterPatientId.String()},
	)

	organization, orgErr := ctx.OrgRepo.GetOrganizationByCode(patient.PatientOrganizationCode)
	if orgErr != nil {
		return nil, fmt.Errorf("error getting existing organization: %v", orgErr)
	} else {
		record.validateOrganization(organization)
	}
	if organization != nil {
		existingPatient, patientErr := ctx.PatientRepo.GetPatientBySubmitterPatientId(organization.ID, patient.SubmitterPatientId.String())
		if patientErr != nil {
			return nil, fmt.Errorf("error getting existing patient: %v", patientErr)
		} else {
			record.validateExistingPatient(existingPatient)
		}
	}
	return record, nil
}
