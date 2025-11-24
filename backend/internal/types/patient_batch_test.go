package types

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// A helper struct to test unmarshalling date of birth
type dateOfBirthContainer struct {
	DateOfBirth DateOfBirthType `json:"date_of_birth"`
}

func TestDateOfBirthType_UnmarshalJSON_ValidDate(t *testing.T) {
	inputJSON := `{"date_of_birth": "1990-05-15"}`
	expectedTime := time.Date(1990, 5, 15, 0, 0, 0, 0, time.UTC)

	var container dateOfBirthContainer
	err := json.Unmarshal([]byte(inputJSON), &container)

	assert.NoError(t, err)
	assert.True(t, expectedTime.Equal(container.DateOfBirth.Time))
}

func TestDateOfBirthType_UnmarshalJSON_NullValue(t *testing.T) {
	inputJSON := `{"date_of_birth": null}`

	var container dateOfBirthContainer
	err := json.Unmarshal([]byte(inputJSON), &container)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error parsing date of birth")
}

func TestDateOfBirthType_UnmarshalJSON_InvalidFormat(t *testing.T) {
	inputJSON := `{"date_of_birth": "15-05-1990"}`

	var container dateOfBirthContainer
	err := json.Unmarshal([]byte(inputJSON), &container)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "invalid date format for date of birth, expected YYYY-MM-DD")
}

func TestDateOfBirthType_UnmarshalJSON_NotADate(t *testing.T) {
	inputJSON := `{"date_of_birth": "not-a-date"}`

	var container dateOfBirthContainer
	err := json.Unmarshal([]byte(inputJSON), &container)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "invalid date format for date of birth, expected YYYY-MM-DD")
}

func TestDateOfBirthType_UnmarshalJSON_EmptyString(t *testing.T) {
	inputJSON := `{"date_of_birth": ""}`

	var container dateOfBirthContainer
	err := json.Unmarshal([]byte(inputJSON), &container)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error parsing date of birth")
}

func TestDateOfBirthType_UnmarshalJSON_MissingField(t *testing.T) {
	inputJSON := `{}`

	var container dateOfBirthContainer
	err := json.Unmarshal([]byte(inputJSON), &container)

	assert.NoError(t, err)
	assert.True(t, container.DateOfBirth.Time.IsZero())
}

func TestDateOfBirthType_Marshal(t *testing.T) {
	const input = `"1980-05-12"`
	expectedTime, _ := time.Parse(DateOfBirthFormat, "1980-05-12")

	// ---- Unmarshal ----
	dob := DateOfBirthType{Time: expectedTime}

	// ---- Marshal ----
	output, err := json.Marshal(dob)
	require.NoError(t, err)
	require.Equal(t, input, string(output))
}

func TestDateOfBirthType_Marshal_ZeroValue(t *testing.T) {
	dob := DateOfBirthType{} // Zero time

	output, err := json.Marshal(dob)
	require.NoError(t, err)
	require.Equal(t, `""`, string(output))
}

func TestPatientBatch_JSON_BlankJHN(t *testing.T) {
	inputJSON := `{
        "submitter_patient_id": "  MRN-001 ",
        "submitter_patient_id_type": "  mrn  ",
        "patient_organization_code": "FERLAB",
        "life_status_code": "alive",
        "first_name": "   John   ",
        "last_name": "  Doe ",
        "sex_code": "male",
        "date_of_birth": "1980-05-12",
        "jhn": "      "
    }`

	expectedDOB, _ := time.Parse(DateOfBirthFormat, "1980-05-12")

	var batch PatientBatch
	err := json.Unmarshal([]byte(inputJSON), &batch)
	require.NoError(t, err)

	// ---- TrimmedString fields ----
	require.Equal(t, TrimmedString("MRN-001"), batch.SubmitterPatientId)
	require.Equal(t, TrimmedString("mrn"), batch.SubmitterPatientIdType)
	require.Equal(t, "FERLAB", batch.PatientOrganizationCode)
	require.Equal(t, TrimmedString("John"), batch.FirstName)
	require.Equal(t, TrimmedString("Doe"), batch.LastName)

	// ---- JHN should be EMPTY ----
	require.Equal(t, TrimmedString(""), batch.Jhn)

	// ---- Date ----
	require.NotNil(t, batch.DateOfBirth)
	require.True(t, batch.DateOfBirth.Time.Equal(expectedDOB))

	// ---- Marshal ----
	outputJSON, err := json.Marshal(batch)
	require.NoError(t, err)

	expectedJSON := `{
        "submitter_patient_id": "MRN-001",
        "submitter_patient_id_type": "mrn",
        "patient_organization_code": "FERLAB",
        "life_status_code": "alive",
        "first_name": "John",
        "last_name": "Doe",
        "sex_code": "male",
        "date_of_birth": "1980-05-12"
    }`

	require.JSONEq(t, expectedJSON, string(outputJSON))
}
