package types

import (
	"bytes"
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func Test_ClinVarRCV_ToJSON(t *testing.T) {
	t.Parallel()
	date := DateISO8601(time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC))

	var rcv = ClinvarRCV{
		LocusId:              "12345",
		ClinvarId:            "RCV000123456",
		Accession:            "SCV000123456",
		ClinicalSignificance: []string{"pathogenic"},
		DateLastEvaluated:    &date,
		SubmissionCount:      10,
		ReviewStatus:         "reviewed",
		ReviewStatusStars:    3,
		Version:              1,
		Traits:               []string{"Trait1", "Trait2"},
		Origins:              []string{"origin1", "origin2"},
	}

	var expected = []byte(`{"locus_id":"12345","clinvar_id":"RCV000123456","accession":"SCV000123456","clinical_significance":["pathogenic"],"date_last_evaluated":"2025-01-01","submission_count":10,"review_status":"reviewed","review_status_stars":3,"version":1,"traits":["Trait1","Trait2"],"origins":["origin1","origin2"]}`)
	jsonData, err := json.Marshal(rcv)
	assert.Nil(t, err, "Failed to marshal ClinvarRCV to JSON")

	var is_equal = bytes.Equal(expected, jsonData)
	assert.True(t, is_equal, "ClinvarRCV should contain a valid JSON")
}

func Test_ClinVarRCV_ToJSON_ZeroDateLastEvaluatedOmitted(t *testing.T) {
	t.Parallel()
	rcv := ClinvarRCV{
		LocusId:           "12345",
		ClinvarId:         "RCV000123456",
		ReviewStatusStars: 0,
	}

	jsonData, err := json.Marshal(rcv)
	assert.NoError(t, err)
	assert.JSONEq(t, `{"locus_id":"12345","clinvar_id":"RCV000123456","review_status_stars":0}`, string(jsonData))
}

func Test_ClinVarRCV_FromJSON(t *testing.T) {
	t.Parallel()
	date := DateISO8601(time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC))
	var jsonData = []byte(`{"locus_id":"12345","clinvar_id":"RCV000123456","accession":"SCV000123456","clinical_significance":["pathogenic"],"date_last_evaluated":"2025-01-01","submission_count":10,"review_status":"reviewed","review_status_stars":3,"version":1,"traits":["Trait1","Trait2"],"origins":["origin1","origin2"]}`)
	var expected = ClinvarRCV{
		LocusId:              "12345",
		ClinvarId:            "RCV000123456",
		Accession:            "SCV000123456",
		ClinicalSignificance: JsonArray[string]{"pathogenic"},
		DateLastEvaluated:    &date,
		SubmissionCount:      10,
		ReviewStatus:         "reviewed",
		ReviewStatusStars:    3,
		Version:              1,
		Traits:               JsonArray[string]{"Trait1", "Trait2"},
		Origins:              JsonArray[string]{"origin1", "origin2"},
	}

	var rcv ClinvarRCV
	err := json.Unmarshal(jsonData, &rcv)
	assert.Nil(t, err, "Failed to unmarshal JSON to ClinvarRCV")
	assert.Equal(t, expected, rcv, "Objects should be equal after unmarshalling from JSON")
}
