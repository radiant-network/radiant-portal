package main

import (
	"encoding/json"
	"fmt"
	"regexp"
	"slices"
	"strings"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const ExternalIdRegexp = `^[a-zA-Z0-9\- ._'À-ÿ]*$`

var ExternalIdRegexpCompiled = regexp.MustCompile(ExternalIdRegexp)

const NameRegExp = `^[a-zA-Z0-9\- .'À-ÿ]*$`

var NameRegExpCompiled = regexp.MustCompile(NameRegExp)

const TextMaxLength = 100

var AllowedOrganizationCategories = []string{"healthcare_provider", "research_institute"}

const PatientAlreadyExistCode = "PATIENT-001"
const PatientExistingPatientDifferentFieldCode = "PATIENT-002"
const PatientOrganizationNotExistCode = "PATIENT-003"
const PatientInvalidValueCode = "PATIENT-004"
const PatientOrganizationTypeCode = "PATIENT-005"

type PatientValidationRecord struct {
	BaseValidationRecord
	Patient        types.PatientBatch
	OrganizationId int
}

func (r PatientValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r PatientValidationRecord) formatInvalidField(fieldName string, reason string) string {
	message := fmt.Sprintf("Invalid Field %s for patient (%s / %s). Reason: %s", fieldName, r.Patient.OrganizationCode, r.Patient.OrganizationPatientId, reason)
	return message
}

func (r PatientValidationRecord) formatFieldTooLong(fieldName string, maxLength int) string {
	reason := fmt.Sprintf("field is too long, maximum length allowed is %d", maxLength)
	return r.formatInvalidField(fieldName, reason)
}

func (r PatientValidationRecord) formatFieldRegexpMatch(fieldName string, regexp string) string {
	reason := fmt.Sprintf("does not match the regular expression %s", regexp)
	return r.formatInvalidField(fieldName, reason)
}

func (r PatientValidationRecord) formatPath(fieldName string) string {
	if fieldName == "" {
		return fmt.Sprintf("patient[%d]", r.Index)
	}
	return fmt.Sprintf("patient[%d].%s", r.Index, fieldName)
}

func (r *PatientValidationRecord) validateOrganizationPatientId() {
	path := r.formatPath("organization_patient_id")
	if len(r.Patient.OrganizationPatientId) > TextMaxLength {
		message := r.formatFieldTooLong("organization_patient_id", TextMaxLength)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
	if !ExternalIdRegexpCompiled.MatchString(r.Patient.OrganizationPatientId) {
		message := r.formatFieldRegexpMatch("organization_patient_id", ExternalIdRegexp)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateLastName() {
	if r.Patient.LastName == "" {
		return
	}
	path := r.formatPath("last_name")
	if len(r.Patient.LastName) > TextMaxLength {
		message := r.formatFieldTooLong("last_name", TextMaxLength)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
	if !NameRegExpCompiled.MatchString(r.Patient.LastName) {
		message := r.formatFieldRegexpMatch("last_name", NameRegExp)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateFirstName() {
	if r.Patient.FirstName == "" {
		return
	}
	path := r.formatPath("first_name")
	if len(r.Patient.FirstName) > TextMaxLength {
		message := r.formatFieldTooLong("first_name", TextMaxLength)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
	if !NameRegExpCompiled.MatchString(r.Patient.FirstName) {
		message := r.formatFieldRegexpMatch("first_name", NameRegExp)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateJhn() {
	if r.Patient.Jhn == "" {
		return
	}
	path := r.formatPath("jhn")
	if len(r.Patient.Jhn) > TextMaxLength {
		message := r.formatFieldTooLong("jhn", TextMaxLength)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
	if !ExternalIdRegexpCompiled.MatchString(r.Patient.Jhn) {
		message := r.formatFieldRegexpMatch("jhn", ExternalIdRegexp)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateOrganization(organization *types.Organization) {
	path := r.formatPath("organization_patient_code")
	if organization == nil {
		message := fmt.Sprintf("Organization %s for patient %s does not exist.", r.Patient.OrganizationCode, r.Patient.OrganizationPatientId)

		r.addErrors(message, PatientOrganizationNotExistCode, path)
	} else if !slices.Contains(AllowedOrganizationCategories, organization.CategoryCode) {
		message := fmt.Sprintf("Organization type (%s) defined for patient (%s / %s) is not in this list : %s.",
			organization.CategoryCode,
			r.Patient.OrganizationCode,
			r.Patient.OrganizationPatientId,
			strings.Join(AllowedOrganizationCategories, ", "),
		)

		r.addErrors(message, PatientOrganizationTypeCode, path)

	} else {
		r.OrganizationId = organization.ID
	}

}

func (r *PatientValidationRecord) validateExistingPatient(existingPatient *types.Patient) {
	if existingPatient != nil {
		message := fmt.Sprintf("Patient (%s / %s) already exist, skipped.", r.Patient.OrganizationCode, r.Patient.OrganizationPatientId)

		r.addInfos(message, PatientAlreadyExistCode, r.formatPath(""))
		r.Skipped = true
		validateExistingPatientFieldFn(r, "sex_code", existingPatient.SexCode, r.Patient.SexCode)
		validateExistingPatientFieldFn(r, "life_status_code", existingPatient.LifeStatusCode, r.Patient.LifeStatusCode)
		validateExistingPatientFieldFn(r, "date_of_birth", existingPatient.DateOfBirth, r.Patient.DateOfBirth.Time)
		validateExistingPatientFieldFn(r, "last_name", existingPatient.LastName, r.Patient.LastName)
		validateExistingPatientFieldFn(r, "first_name", existingPatient.FirstName, r.Patient.FirstName)
		validateExistingPatientFieldFn(r, "jhn", existingPatient.Jhn, r.Patient.Jhn)
	}

}

func validateExistingPatientFieldFn[T comparable](
	r *PatientValidationRecord,
	fieldName string,
	existingPatientValue T,
	recordValue T,

) {
	if existingPatientValue != recordValue {
		path := r.formatPath(fieldName)
		message := fmt.Sprintf("A patient with same ids (%s / %s) has been found  but with a different %s (%v <> %v)",
			r.Patient.OrganizationCode,
			r.Patient.OrganizationPatientId,
			fieldName,
			existingPatientValue,
			recordValue,
		)

		r.addWarnings(message, PatientExistingPatientDifferentFieldCode, path)
	}
}

func processPatientBatch(batch *types.Batch, db *gorm.DB, repoOrganization *repository.OrganizationRepository, repoPatient *repository.PatientsRepository, repoBatch *repository.BatchRepository) {
	payload := []byte(batch.Payload)
	var batches []types.PatientBatch

	if unexpectedErr := json.Unmarshal(payload, &batches); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling patient batch: %v", unexpectedErr), repoBatch)
		return
	}

	records, unexpectedErr := validatePatientBatch(batches, repoOrganization, repoPatient)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error patient batch validation: %v", unexpectedErr), repoBatch)
		return
	}

	glog.Infof("Patient batch %v processed with %d records", batch.ID, len(records))

	err := persistBatchAndPatientRecords(db, batch, records)
	if err != nil {
		processUnexpectedError(batch, fmt.Errorf("error processing patient batch records: %v", err), repoBatch)
		return
	}
}

func persistBatchAndPatientRecords(db *gorm.DB, batch *types.Batch, records []PatientValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		txRepoPatient := repository.NewPatientsRepository(tx)
		txRepoBatch := repository.NewBatchRepository(tx)
		rowsUpdated, unexpectedErrUpdate := updateBatch(batch, records, txRepoBatch)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			/* Logs directly, and return error to trigger rollback if the batch does not exist in db */
			return fmt.Errorf("no rows updated when updating patient batch %v", batch.ID)
		}
		if !batch.DryRun && batch.Status == "SUCCESS" {
			err := insertPatientRecords(records, txRepoPatient)
			if err != nil {
				return fmt.Errorf("error during patient insertion %v", err)
			}
		}
		return nil
	})
}

func insertPatientRecords(records []PatientValidationRecord, repo *repository.PatientsRepository) error {
	for _, record := range records {
		if !record.Skipped {
			patient := types.Patient{
				OrganizationPatientId:     record.Patient.OrganizationPatientId,
				OrganizationID:            record.OrganizationId,
				OrganizationPatientIdType: record.Patient.OrganizationPatientIdType,
				FirstName:                 record.Patient.FirstName,
				LastName:                  record.Patient.LastName,
				Jhn:                       record.Patient.Jhn,
				SexCode:                   record.Patient.SexCode,
				LifeStatusCode:            record.Patient.LifeStatusCode,
			}
			if record.Patient.DateOfBirth != nil {
				patient.DateOfBirth = record.Patient.DateOfBirth.Time
			}
			err := repo.CreatePatient(&patient)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func validatePatientBatch(batches []types.PatientBatch, repoOrganization *repository.OrganizationRepository, repoPatient *repository.PatientsRepository) ([]PatientValidationRecord, error) {
	var records []PatientValidationRecord
	for index, patient := range batches {
		record, err := validatePatientRecord(patient, index, repoOrganization, repoPatient)
		if err != nil {
			return nil, fmt.Errorf("error during patient validation: %v", err)
		}
		records = append(records, *record)
	}
	return records, nil
}

func validatePatientRecord(patient types.PatientBatch, index int, repoOrganization *repository.OrganizationRepository, repoPatient *repository.PatientsRepository) (*PatientValidationRecord, error) {
	record := PatientValidationRecord{Patient: patient}
	record.Index = index
	record.validateOrganizationPatientId()
	record.validateFirstName()
	record.validateLastName()
	record.validateJhn()

	organization, orgErr := repoOrganization.GetOrganizationByCode(patient.OrganizationCode)
	if orgErr != nil {
		return nil, fmt.Errorf("error getting existing organization: %v", orgErr)
	} else {
		record.validateOrganization(organization)
	}
	if organization != nil {
		existingPatient, patientErr := repoPatient.GetPatientByOrganizationPatientId(organization.ID, patient.OrganizationPatientId)
		if patientErr != nil {
			return nil, fmt.Errorf("error getting existing patient: %v", patientErr)
		} else {
			record.validateExistingPatient(existingPatient)
		}
	}
	return &record, nil
}
