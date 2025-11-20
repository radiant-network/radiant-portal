package main

import (
	"fmt"
	"math/rand"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func randomString(n int, alphabet string) string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, n)
	for i := range b {
		b[i] = alphabet[r.Intn(len(letters))]
	}
	return string(b)
}

func Test_OrganizationPatientId_Too_Long(t *testing.T) {
	orgPatientId := randomString(120, letters)
	patient := types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: orgPatientId}
	patientValidationRecord := PatientValidationRecord{Patient: patient}
	patientValidationRecord.validateOrganizationPatientId()
	assert.Len(t, patientValidationRecord.Errors, 1)
	assert.Equal(t, fmt.Sprintf("Field organization_patient_id for patient (CHUSJ / %s) is too long ( > 100).", orgPatientId), patientValidationRecord.Errors[0].Message)
	assert.Equal(t, "patient[0].organization_patient_id", patientValidationRecord.Errors[0].Path)
}

func Test_OrganizationPatientId_Special_Characters(t *testing.T) {
	orgPatientId := "id_with_invalid_char_🧪"
	patient := types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: orgPatientId}
	patientValidationRecord := PatientValidationRecord{Patient: patient}
	patientValidationRecord.validateOrganizationPatientId()
	assert.Len(t, patientValidationRecord.Errors, 1)
	assert.Equal(t, fmt.Sprintf("Field organization_patient_id for patient (CHUSJ / %s) does not match the regular expression ^[a-zA-Z0-9\\- ._'À-ÿ]*$.", orgPatientId), patientValidationRecord.Errors[0].Message)
	assert.Equal(t, "patient[0].organization_patient_id", patientValidationRecord.Errors[0].Path)
}

func Test_OrganizationPatientId_Multiple_Errors(t *testing.T) {
	orgPatientId := fmt.Sprintf("%s_🧪", randomString(120, letters))
	patient := types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: orgPatientId}
	patientValidationRecord := PatientValidationRecord{Patient: patient}
	patientValidationRecord.validateOrganizationPatientId()
	assert.Len(t, patientValidationRecord.Errors, 2)
}

func Test_OrganizationPatientId_Valid(t *testing.T) {
	orgPatientId := "valid_patient_id_1"
	patient := types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: orgPatientId}
	patientValidationRecord := PatientValidationRecord{Patient: patient}
	patientValidationRecord.validateOrganizationPatientId()
	assert.Nil(t, patientValidationRecord.Errors)
}
func Test_ValidateLastName(t *testing.T) {
	// Empty last name: no errors
	patient := types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id1", LastName: ""}
	rec := PatientValidationRecord{Patient: patient}
	rec.Index = 0
	rec.validateLastName()
	assert.Nil(t, rec.Errors)

	// Empty last name with spaces: no errors
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id1", LastName: "   "}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateLastName()
	assert.Nil(t, rec.Errors)

	// Too long last name
	longName := randomString(120, letters)
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id2", LastName: longName}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateLastName()
	assert.Len(t, rec.Errors, 1)
	assert.Contains(t, rec.Errors[0].Message, "is too long")
	assert.Equal(t, "patient[0].last_name", rec.Errors[0].Path)

	// Invalid characters
	invalidName := "Smith🧪"
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id3", LastName: invalidName}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateLastName()
	assert.Len(t, rec.Errors, 1)
	assert.Contains(t, rec.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "patient[0].last_name", rec.Errors[0].Path)

	// Both errors
	both := longName + "🧪"
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id4", LastName: both}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateLastName()
	assert.Len(t, rec.Errors, 2)

	// Valid last name
	validName := "Smith-Jones"
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id5", LastName: validName}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateLastName()
	assert.Nil(t, rec.Errors)
}

func Test_ValidateFirstName(t *testing.T) {
	// Empty first name: no errors
	patient := types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id1", FirstName: ""}
	rec := PatientValidationRecord{Patient: patient}
	rec.validateFirstName()
	assert.Nil(t, rec.Errors)

	// Empty first name with spaces: no errors
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id1", FirstName: "   "}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateFirstName()
	assert.Nil(t, rec.Errors)

	// Too long first name
	longName := randomString(120, letters)
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id2", FirstName: longName}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateFirstName()
	assert.Len(t, rec.Errors, 1)
	assert.Contains(t, rec.Errors[0].Message, "is too long")
	assert.Equal(t, "patient[0].first_name", rec.Errors[0].Path)

	// Invalid characters
	invalidName := "John🧪"
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id3", FirstName: invalidName}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateFirstName()
	assert.Len(t, rec.Errors, 1)
	assert.Contains(t, rec.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "patient[0].first_name", rec.Errors[0].Path)

	// Both errors
	both := longName + "🧪"
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id4", FirstName: both}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateFirstName()
	assert.Len(t, rec.Errors, 2)

	// Valid first name
	validName := "John-Paul"
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id5", FirstName: validName}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateFirstName()
	assert.Nil(t, rec.Errors)
}

func Test_ValidateJhn(t *testing.T) {
	// Empty JHN: no errors
	patient := types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id1", Jhn: ""}
	rec := PatientValidationRecord{Patient: patient}
	rec.validateJhn()
	assert.Nil(t, rec.Errors)

	// JHN with only spaces: no errors
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id1", Jhn: "   "}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateJhn()
	assert.Nil(t, rec.Errors)

	// Too long JHN
	longJhn := randomString(120, letters)
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id2", Jhn: longJhn}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateJhn()
	assert.Len(t, rec.Errors, 1)
	assert.Contains(t, rec.Errors[0].Message, "is too long")
	assert.Equal(t, "patient[0].jhn", rec.Errors[0].Path)

	// Invalid characters
	invalidJhn := "JHN🧪"
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id3", Jhn: invalidJhn}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateJhn()
	assert.Len(t, rec.Errors, 1)
	assert.Contains(t, rec.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "patient[0].jhn", rec.Errors[0].Path)

	// Both errors
	both := longJhn + "🧪"
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id4", Jhn: both}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateJhn()
	assert.Len(t, rec.Errors, 2)

	// Valid JHN
	validJhn := "JHN-1234"
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id5", Jhn: validJhn}
	rec = PatientValidationRecord{Patient: patient}
	rec.validateJhn()
	assert.Nil(t, rec.Errors)
}

func Test_ValidateOrganization(t *testing.T) {
	// Nil organization: should have error
	patient := types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id1"}
	rec := PatientValidationRecord{Patient: patient}
	rec.validateOrganization(nil)
	assert.Len(t, rec.Errors, 1)
	assert.Contains(t, rec.Errors[0].Message, "does not exist")
	assert.Equal(t, rec.Errors[0].Code, OrganizationNotExistCode)

	// Invalid organization category: should have error
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id2"}
	rec = PatientValidationRecord{Patient: patient}
	invalidOrg := &types.Organization{CategoryCode: "invalid_category"}
	rec.validateOrganization(invalidOrg)
	assert.Len(t, rec.Errors, 1)
	assert.Contains(t, rec.Errors[0].Message, "is not in this list")
	assert.Equal(t, rec.Errors[0].Code, OrganizationTypeCode)

	// Valid organization with healthcare_provider category: no errors
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id3"}
	rec = PatientValidationRecord{Patient: patient}
	validOrg := &types.Organization{CategoryCode: "healthcare_provider"}
	rec.validateOrganization(validOrg)
	assert.Nil(t, rec.Errors)

	// Valid organization with research_institute category: no errors
	patient = types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id4"}
	rec = PatientValidationRecord{Patient: patient}
	validOrg2 := &types.Organization{CategoryCode: "research_institute"}
	rec.validateOrganization(validOrg2)
	assert.Nil(t, rec.Errors)
}

func Test_ValidateExistingPatient_Nil(t *testing.T) {
	patient := types.PatientBatch{OrganizationCode: "CHUSJ", OrganizationPatientId: "id1"}
	rec := PatientValidationRecord{Patient: patient}
	rec.validateExistingPatient(nil)
	assert.False(t, rec.Skipped)
	assert.Nil(t, rec.Infos)
	assert.Nil(t, rec.Warnings)
}

func Test_ValidateExistingPatient_SameValues(t *testing.T) {
	dob := time.Date(2000, 1, 2, 0, 0, 0, 0, time.UTC)
	patient := types.PatientBatch{
		OrganizationCode:      "CHUSJ",
		OrganizationPatientId: "id2",
		SexCode:               "M",
		LifeStatusCode:        "alive",
		DateOfBirth:           &types.DateOfBirthType{Time: dob},
		LastName:              "Doe",
		FirstName:             "John",
		Jhn:                   "JHN-123",
	}
	existing := &types.Patient{
		OrganizationPatientId: "id2",
		SexCode:               "M",
		LifeStatusCode:        "alive",
		DateOfBirth:           dob,
		LastName:              "Doe",
		FirstName:             "John",
		Jhn:                   "JHN-123",
	}
	rec := PatientValidationRecord{Patient: patient}
	rec.validateExistingPatient(existing)
	assert.True(t, rec.Skipped)
	assert.Len(t, rec.Infos, 1)
	assert.Equal(t, PatientAlreadyExistCode, rec.Infos[0].Code)
	assert.Nil(t, rec.Warnings)
}

func Test_ValidateExistingPatient_DifferentValues(t *testing.T) {
	dobExisting := time.Date(1990, 5, 6, 0, 0, 0, 0, time.UTC)
	dobRecord := time.Date(1991, 7, 8, 0, 0, 0, 0, time.UTC)
	patient := types.PatientBatch{
		OrganizationCode:      "CHUSJ",
		OrganizationPatientId: "id3",
		SexCode:               "F",
		LifeStatusCode:        "deceased",
		DateOfBirth:           &types.DateOfBirthType{Time: dobRecord},
		LastName:              "Smith",
		FirstName:             "Alice",
		Jhn:                   "JHN-999",
	}
	existing := &types.Patient{
		OrganizationPatientId: "id3",
		SexCode:               "M",
		LifeStatusCode:        "alive",
		DateOfBirth:           dobExisting,
		LastName:              "Jones",
		FirstName:             "Bob",
		Jhn:                   "JHN-123",
	}
	rec := PatientValidationRecord{Patient: patient}
	rec.validateExistingPatient(existing)
	assert.True(t, rec.Skipped)
	assert.Len(t, rec.Infos, 1)
	// All 6 differing fields should produce 6 warnings
	assert.Len(t, rec.Warnings, 6)
	for _, w := range rec.Warnings {
		assert.Equal(t, ExistingPatientDifferentFieldCode, w.Code)
	}
}
