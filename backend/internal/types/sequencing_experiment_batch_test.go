package types

import (
	"bytes"
	"encoding/json"
	"testing"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/stretchr/testify/assert"
)

func Test_SequencingExperimentBatch_ToJSON(t *testing.T) {

	rfc3339 := "2025-12-15T12:00:00Z"
	runDate, _ := time.Parse(time.RFC3339, rfc3339)

	var seqBatch = SequencingExperimentBatch{
		Aliquot:                      "ALIQUOT-123",
		SampleOrganizationCode:       "ORG-123",
		SubmitterSampleId:            "SAMPLE-123",
		CaptureKit:                   "CPT-123",
		ExperimentalStrategyCode:     "wgs",
		SequencingReadTechnologyCode: "short_read",
		PlatformCode:                 "illumina",
		SequencingLabCode:            "CHUSJ",
		RunAlias:                     "RUN-ALIAS-1",
		RunDate:                      (*DateRFC3339)(&runDate),
		RunName:                      "RUN-1",
		StatusCode:                   "in_progress",
	}

	var expected = []byte(`{"aliquot":"ALIQUOT-123","sample_organization_code":"ORG-123","submitter_sample_id":"SAMPLE-123","capture_kit":"CPT-123","experimental_strategy_code":"wgs","sequencing_read_technology_code":"short_read","platform_code":"illumina","sequencing_lab_code":"CHUSJ","run_alias":"RUN-ALIAS-1","run_date":"2025-12-15T12:00:00Z","run_name":"RUN-1","status_code":"in_progress"}`)
	jsonData, err := json.Marshal(seqBatch)
	assert.Nil(t, err, "Failed to marshal Sequencing Experiment Batch to JSON")

	var isEqual = bytes.Equal(expected, jsonData)
	assert.True(t, isEqual, "Objects should be equal after unmarshalling from JSON")
}

func Test_SequencingExperimentBatch_FromJSON(t *testing.T) {
	var jsonData = []byte(`{"aliquot":"ALIQUOT-123","sample_organization_code":"ORG-123","submitter_sample_id":"SAMPLE-123","capture_kit":"CPT-123","experimental_strategy_code":"wgs","sequencing_read_technology_code":"short_read","platform_code":"illumina","sequencing_lab_code":"CHUSJ","run_alias":"RUN-ALIAS-1","run_date":"2025-12-15T12:00:00Z","run_name":"RUN-1","status_code":"in_progress"}`)

	rfc3339 := "2025-12-15T12:00:00Z"
	runDate, _ := time.Parse(time.RFC3339, rfc3339)

	expected := SequencingExperimentBatch{
		Aliquot:                      "ALIQUOT-123",
		SampleOrganizationCode:       "ORG-123",
		SubmitterSampleId:            "SAMPLE-123",
		CaptureKit:                   "CPT-123",
		ExperimentalStrategyCode:     "wgs",
		SequencingReadTechnologyCode: "short_read",
		PlatformCode:                 "illumina",
		SequencingLabCode:            "CHUSJ",
		RunAlias:                     "RUN-ALIAS-1",
		RunDate:                      (*DateRFC3339)(&runDate),
		RunName:                      "RUN-1",
		StatusCode:                   "in_progress",
	}

	var seq SequencingExperimentBatch
	err := json.Unmarshal(jsonData, &seq)
	assert.Nil(t, err, "Failed to unmarshal JSON to Sequencing Experiment Batch")
	assert.Equal(t, expected, seq, "Objects should be equal after unmarshalling from JSON")

}

// bindingValidator mirrors how gin configures go-playground/validator, so these tests exercise
// the same `binding` tags the batch handlers reject payloads on.
func bindingValidator() *validator.Validate {
	v := validator.New()
	v.SetTagName("binding")
	return v
}

func validSequencingExperimentBatch(statusCode string) SequencingExperimentBatch {
	return SequencingExperimentBatch{
		Aliquot:                      "ALIQUOT-123",
		SampleOrganizationCode:       "ORG-123",
		SubmitterSampleId:            "SAMPLE-123",
		ExperimentalStrategyCode:     "wgs",
		SequencingReadTechnologyCode: "short_read",
		PlatformCode:                 "illumina",
		SequencingLabCode:            "CHUSJ",
		StatusCode:                   statusCode,
	}
}

func Test_SequencingExperimentBatch_StatusCode_AcceptsEveryDictionaryCode(t *testing.T) {
	// Must stay in sync with public.status (migration 000029_seed_target_case_status_enum).
	codes := []string{
		"submitted", "processing", "in_progress", "in_review", "completed",
		"resolved", "unresolved", "inconclusive", "reopened", "revoked",
	}

	for _, code := range codes {
		err := bindingValidator().Struct(validSequencingExperimentBatch(code))
		assert.NoErrorf(t, err, "status_code = %q; want accepted", code)
	}
}

func Test_SequencingExperimentBatch_StatusCode_RejectsRetiredCode(t *testing.T) {
	for _, code := range []string{"unknown", "draft", "incomplete", "revoke"} {
		err := bindingValidator().Struct(validSequencingExperimentBatch(code))
		assert.Errorf(t, err, "status_code = %q; want rejected", code)
	}
}

func Test_SequencingExperimentBatch_StatusCode_RejectsEmpty(t *testing.T) {
	err := bindingValidator().Struct(validSequencingExperimentBatch(""))
	assert.Error(t, err, `status_code = ""; want rejected`)
}
