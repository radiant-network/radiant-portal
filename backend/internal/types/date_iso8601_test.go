package types

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_UnmarshalJSON_ValidDate(t *testing.T) {
	inputJSON := `"1990-05-15"`
	expectedDate := time.Date(1990, 5, 15, 0, 0, 0, 0, time.UTC)

	var date DateISO8601
	err := json.Unmarshal([]byte(inputJSON), &date)

	assert.NoError(t, err)
	assert.Equal(t, expectedDate, time.Time(date))
}

func Test_UnmarshalJSON_NullValue(t *testing.T) {
	inputJSON := `"null"`

	var date DateISO8601
	err := json.Unmarshal([]byte(inputJSON), &date)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error parsing date")
}

func Test_UnmarshalJSON_InvalidFormat(t *testing.T) {
	inputJSON := `"15-05-1990"`

	var date DateISO8601
	err := json.Unmarshal([]byte(inputJSON), &date)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "invalid date format, expected ISO8601 (e.g. 2020-01-31)")
}

func Test_UnmarshalJSON_NotADate(t *testing.T) {
	inputJSON := `"not-a-date"`

	var date DateISO8601
	err := json.Unmarshal([]byte(inputJSON), &date)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "invalid date format, expected ISO8601 (e.g. 2020-01-31)")
}

func Test_UnmarshalJSON_EmptyString(t *testing.T) {
	inputJSON := `""`

	var date DateISO8601
	err := json.Unmarshal([]byte(inputJSON), &date)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error parsing date")
}

func Test_MarshalJSON(t *testing.T) {
	const input = `"1980-05-12"`
	expectedDate, _ := time.Parse(DateISO8601Format, "1980-05-12")

	date := DateISO8601(expectedDate)

	output, err := json.Marshal(&date)
	require.NoError(t, err)
	require.Equal(t, input, string(output))
}

func Test_MarshalJSON_ZeroValue(t *testing.T) {
	var date DateISO8601 // Zero time
	output, err := json.Marshal(&date)
	require.NoError(t, err)
	require.Equal(t, `""`, string(output))
}

func Test_Scan_TimeValue(t *testing.T) {
	var date DateISO8601
	err := date.Scan(time.Date(2020, 7, 8, 0, 0, 0, 0, time.UTC))

	require.NoError(t, err)
	assert.Equal(t, time.Date(2020, 7, 8, 0, 0, 0, 0, time.UTC), time.Time(date))
}

func Test_Scan_BytesValue(t *testing.T) {
	var date DateISO8601
	err := date.Scan([]byte("2020-07-08"))

	require.NoError(t, err)
	assert.Equal(t, time.Date(2020, 7, 8, 0, 0, 0, 0, time.UTC), time.Time(date))
}

func Test_Scan_StringValue(t *testing.T) {
	var date DateISO8601
	err := date.Scan("2020-07-08")

	require.NoError(t, err)
	assert.Equal(t, time.Date(2020, 7, 8, 0, 0, 0, 0, time.UTC), time.Time(date))
}

func Test_Scan_NilValue(t *testing.T) {
	date := DateISO8601(time.Date(2020, 7, 8, 0, 0, 0, 0, time.UTC))
	err := date.Scan(nil)

	require.NoError(t, err)
	assert.True(t, time.Time(date).IsZero())
}

func Test_Scan_InvalidString(t *testing.T) {
	var date DateISO8601
	err := date.Scan("08-07-2020")

	assert.Error(t, err)
}

func Test_Scan_EmptyString(t *testing.T) {
	var date DateISO8601
	err := date.Scan("")

	assert.Error(t, err)
}

func Test_Scan_UnsupportedType(t *testing.T) {
	var date DateISO8601
	err := date.Scan(int64(20200708))

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "cannot scan int64 into DateISO8601")
}

func Test_MarshalJSON_MidnightUTCKeepsCalendarDay(t *testing.T) {
	date := DateISO8601(time.Date(2020, 7, 8, 0, 0, 0, 0, time.UTC))

	output, err := json.Marshal(&date)
	require.NoError(t, err)
	require.Equal(t, `"2020-07-08"`, string(output))
}
