package types

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
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
