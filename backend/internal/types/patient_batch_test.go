package types

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

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

	expectedDOB, _ := time.Parse(DateISO8601Format, "1980-05-12")

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
	require.True(t, time.Time(*batch.DateOfBirth).Equal(expectedDOB))

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
