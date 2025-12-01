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

// Regular expressions for external IDs (Ex: SubmitterPatientId, JHN).
const ExternalIdRegexp = `^[a-zA-Z0-9\- ._'À-ÿ]*$`

var ExternalIdRegexpCompiled = regexp.MustCompile(ExternalIdRegexp)

const NameRegExp = `^[a-zA-Z0-9\- .'À-ÿ]*$`

var NameRegExpCompiled = regexp.MustCompile(NameRegExp)

var AllowedOrganizationCategories = []string{"healthcare_provider", "research_institute"}

const PatientAlreadyExistCode = "PATIENT-001"
const PatientExistingPatientDifferentFieldCode = "PATIENT-002"
const PatientOrganizationNotExistCode = "PATIENT-003"
const PatientInvalidValueCode = "PATIENT-004"
const PatientOrganizationTypeCode = "PATIENT-005"
const PatientDuplicateInBatchCode = "PATIENT-006"

type PatientValidationRecord struct {
	BaseValidationRecord
	Patient        types.PatientBatch
	OrganizationId int
}

func (r *PatientValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *PatientValidationRecord) GetResourceType() string {
	return types.PatientBatchType
}

func (r *PatientValidationRecord) formatFieldRegexpMatch(fieldName string, regexp string) string {
	reason := fmt.Sprintf("does not match the regular expression %s", regexp)
	return formatInvalidField(r, fieldName, reason, []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()})
}

func (r *PatientValidationRecord) validateSubmitterPatientId() {
	path := formatPath(r, "submitter_patient_id")
	if len(r.Patient.SubmitterPatientId) > TextMaxLength {
		message := formatFieldTooLong(r, "submitter_patient_id", TextMaxLength, []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()})
		r.addErrors(message, PatientInvalidValueCode, path)
	}
	if !ExternalIdRegexpCompiled.MatchString(r.Patient.SubmitterPatientId.String()) {
		message := r.formatFieldRegexpMatch("submitter_patient_id", ExternalIdRegexp)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateLastName() {
	if r.Patient.LastName == "" {
		return
	}
	path := formatPath(r, "last_name")
	if len(r.Patient.LastName) > TextMaxLength {
		message := formatFieldTooLong(r, "last_name", TextMaxLength, []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()})
		r.addErrors(message, PatientInvalidValueCode, path)
	}
	if !NameRegExpCompiled.MatchString(r.Patient.LastName.String()) {
		message := r.formatFieldRegexpMatch("last_name", NameRegExp)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateFirstName() {
	if r.Patient.FirstName == "" {
		return
	}
	path := formatPath(r, "first_name")
	if len(r.Patient.FirstName) > TextMaxLength {
		message := formatFieldTooLong(r, "first_name", TextMaxLength, []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()})
		r.addErrors(message, PatientInvalidValueCode, path)
	}
	if !NameRegExpCompiled.MatchString(r.Patient.FirstName.String()) {
		message := r.formatFieldRegexpMatch("first_name", NameRegExp)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateJhn() {
	if r.Patient.Jhn == "" {
		return
	}
	path := formatPath(r, "jhn")
	if len(r.Patient.Jhn) > TextMaxLength {
		message := formatFieldTooLong(r, "jhn", TextMaxLength, []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()})
		r.addErrors(message, PatientInvalidValueCode, path)
	}
	if !ExternalIdRegexpCompiled.MatchString(r.Patient.Jhn.String()) {
		message := r.formatFieldRegexpMatch("jhn", ExternalIdRegexp)
		r.addErrors(message, PatientInvalidValueCode, path)
	}
}

func (r *PatientValidationRecord) validateOrganization(organization *types.Organization) {
	path := formatPath(r, "patient_organization_code")
	if organization == nil {
		message := fmt.Sprintf("Organization %s for patient %s does not exist.", r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId)
		r.addErrors(message, PatientOrganizationNotExistCode, path)
	} else if !slices.Contains(AllowedOrganizationCategories, organization.CategoryCode) {
		message := fmt.Sprintf("Organization type (%s) defined for patient (%s / %s) is not in this list : %s.",
			organization.CategoryCode,
			r.Patient.PatientOrganizationCode,
			r.Patient.SubmitterPatientId,
			strings.Join(AllowedOrganizationCategories, ", "),
		)
		r.addErrors(message, PatientOrganizationTypeCode, path)
	} else {
		r.OrganizationId = organization.ID
	}
}

func (r *PatientValidationRecord) validateExistingPatient(existingPatient *types.Patient) {
	if existingPatient != nil {
		message := fmt.Sprintf("Patient (%s / %s) already exist, skipped.", r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId)

		r.addInfos(message, PatientAlreadyExistCode, formatPath(r, ""))
		r.Skipped = true
		validateExistingPatientField(r, "sex_code", existingPatient.SexCode, r.Patient.SexCode)
		validateExistingPatientField(r, "life_status_code", existingPatient.LifeStatusCode, r.Patient.LifeStatusCode)
		validateExistingPatientField(r, "date_of_birth", existingPatient.DateOfBirth, r.Patient.DateOfBirth.Time)
		validateExistingPatientField(r, "last_name", existingPatient.LastName, r.Patient.LastName.String())
		validateExistingPatientField(r, "first_name", existingPatient.FirstName, r.Patient.FirstName.String())
		validateExistingPatientField(r, "jhn", existingPatient.Jhn, r.Patient.Jhn.String())
	}
}

func validateExistingPatientField[T comparable](
	r *PatientValidationRecord,
	fieldName string,
	existingPatientValue T,
	recordValue T,

) {
	if existingPatientValue != recordValue {
		path := formatPath(r, fieldName)
		message := fmt.Sprintf("A patient with same ids (%s / %s) has been found  but with a different %s (%v <> %v)",
			r.Patient.PatientOrganizationCode,
			r.Patient.SubmitterPatientId,
			fieldName,
			existingPatientValue,
			recordValue,
		)
		r.addWarnings(message, PatientExistingPatientDifferentFieldCode, path)
	}
}

func processPatientBatch(batch *types.Batch, db *gorm.DB, repoOrganization repository.OrganizationDAO, repoPatient repository.PatientsDAO, repoBatch repository.BatchDAO) {
	payload := []byte(batch.Payload)
	var patients []types.PatientBatch

	if unexpectedErr := json.Unmarshal(payload, &patients); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling patient batch: %v", unexpectedErr), repoBatch)
		return
	}

	records, unexpectedErr := validatePatientsBatch(patients, repoOrganization, repoPatient)
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

func persistBatchAndPatientRecords(db *gorm.DB, batch *types.Batch, records []*PatientValidationRecord) error {
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

func validatePatientsBatch(patients []types.PatientBatch, repoOrganization repository.OrganizationDAO, repoPatient repository.PatientsDAO) ([]*PatientValidationRecord, error) {
	var records []*PatientValidationRecord
	seenPatients := map[patientsKey]struct{}{}
	for index, patient := range patients {
		record, err := validatePatientRecord(patient, index, seenPatients, repoOrganization, repoPatient)
		if err != nil {
			return nil, fmt.Errorf("error during patient validation: %v", err)
		}
		records = append(records, record)
	}
	return records, nil
}

type patientsKey struct {
	OrganizationCode   string
	SubmitterPatientId string
}

func validatePatientRecord(patient types.PatientBatch, index int, seenPatients map[patientsKey]struct{}, repoOrganization repository.OrganizationDAO, repoPatient repository.PatientsDAO) (*PatientValidationRecord, error) {
	record := &PatientValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: index},
		Patient:              patient,
	}
	record.validateSubmitterPatientId()
	record.validateFirstName()
	record.validateLastName()
	record.validateJhn()

	validateUniquenessInBatch(record,
		patientsKey{
			OrganizationCode:   patient.PatientOrganizationCode,
			SubmitterPatientId: patient.SubmitterPatientId.String(),
		},
		seenPatients,
		PatientAlreadyExistCode,
		[]string{patient.PatientOrganizationCode, patient.SubmitterPatientId.String()},
	)

	organization, orgErr := repoOrganization.GetOrganizationByCode(patient.PatientOrganizationCode)
	if orgErr != nil {
		return nil, fmt.Errorf("error getting existing organization: %v", orgErr)
	} else {
		record.validateOrganization(organization)
	}
	if organization != nil {
		existingPatient, patientErr := repoPatient.GetPatientBySubmitterPatientId(organization.ID, patient.SubmitterPatientId.String())
		if patientErr != nil {
			return nil, fmt.Errorf("error getting existing patient: %v", patientErr)
		} else {
			record.validateExistingPatient(existingPatient)
		}
	}
	return record, nil
}
