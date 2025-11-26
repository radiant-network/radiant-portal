package main

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type TestValidationRecord struct {
	BaseValidationRecord
}

func (r TestValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *TestValidationRecord) GetResourceType() string {
	return "test_resource"
}

func Test_formatPath(t *testing.T) {
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 5},
	}

	pathWithField := formatPath(record, "last_name")
	assert.Equal(t, "test_resource[5].last_name", pathWithField)

	pathWithoutField := formatPath(record, "")
	assert.Equal(t, "test_resource[5]", pathWithoutField)
}

func Test_formatInvalidField(t *testing.T) {
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	messageWithIds := formatInvalidField(record, "tissue_site", "is empty", []string{"ORG1", "S1"})
	expectedMsgWithIds := "Invalid Field tissue_site for test_resource (ORG1 / S1). Reason: is empty"
	assert.Equal(t, expectedMsgWithIds, messageWithIds)

	messageWithoutIds := formatInvalidField(record, "type_code", "is unknown", []string{})
	expectedMsgWithoutIds := "Invalid Field type_code for test_resource. Reason: is unknown"
	assert.Equal(t, expectedMsgWithoutIds, messageWithoutIds)
}

func Test_formatFieldTooLong(t *testing.T) {
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 2},
	}

	message := formatFieldTooLong(record, "first_name", 50, []string{"ORG2", "P2"})
	expectedMessage := "Invalid Field first_name for test_resource (ORG2 / P2). Reason: field is too long, maximum length allowed is 50"
	assert.Equal(t, expectedMessage, message)
}

func Test_CopyRecordIntoBatch_Success(t *testing.T) {
	batch := &types.Batch{
		Status: types.BatchStatusRunning,
		Report: types.BatchReport{},
	}

	records := []TestValidationRecord{
		{BaseValidationRecord{
			Index:   0,
			Skipped: false,
			Infos:   []types.BatchMessage{{Code: "INFO-001", Message: "Info message", Path: "field1"}},
		}},
		{BaseValidationRecord{
			Index:    1,
			Skipped:  false,
			Warnings: []types.BatchMessage{{Code: "WARN-001", Message: "Warning message", Path: "field2"}},
		}},
	}

	copyRecordIntoBatch(batch, records)

	assert.Equal(t, types.BatchStatusSuccess, batch.Status)
	assert.Equal(t, 2, batch.Summary.Created)
	assert.Equal(t, 0, batch.Summary.Skipped)
	assert.Equal(t, 0, batch.Summary.Errors)
}

func Test_CopyRecordIntoBatch_WithErrors(t *testing.T) {
	batch := &types.Batch{
		Status: types.BatchStatusRunning,
		Report: types.BatchReport{},
	}

	records := []TestValidationRecord{
		{BaseValidationRecord{
			Index:  0,
			Errors: []types.BatchMessage{{Code: "ERR-001", Message: "Error message", Path: "field1"}},
		}},
		{BaseValidationRecord{
			Index:   1,
			Skipped: false,
		},
		}}

	copyRecordIntoBatch(batch, records)

	assert.Equal(t, types.BatchStatusError, batch.Status)
	assert.Equal(t, 0, batch.Summary.Created)
	assert.Equal(t, 1, batch.Summary.Skipped)
	assert.Equal(t, 1, batch.Summary.Errors)
}

func Test_CopyRecordIntoBatch_WithSkipped(t *testing.T) {
	batch := &types.Batch{
		Status: types.BatchStatusRunning,
		Report: types.BatchReport{},
	}

	records := []TestValidationRecord{
		{BaseValidationRecord{
			Index:   0,
			Skipped: true,
			Infos:   []types.BatchMessage{{Code: "INFO-001", Message: "Skipped record", Path: "field1"}},
		}},
		{BaseValidationRecord{
			Index:   1,
			Skipped: false,
		}},
	}

	copyRecordIntoBatch(batch, records)

	assert.Equal(t, types.BatchStatusSuccess, batch.Status)
	assert.Equal(t, 1, batch.Summary.Created)
	assert.Equal(t, 1, batch.Summary.Skipped)
	assert.Equal(t, 0, batch.Summary.Errors)
}

func Test_CopyRecordIntoBatch_MixedRecords(t *testing.T) {
	batch := &types.Batch{
		Status: types.BatchStatusRunning,
		Report: types.BatchReport{},
	}

	records := []TestValidationRecord{
		{BaseValidationRecord{
			Index:  0,
			Errors: []types.BatchMessage{{Code: "ERR-001", Message: "Error 1", Path: "field1"}},
		}},
		{BaseValidationRecord{
			Index:   1,
			Skipped: true,
		}},
		{BaseValidationRecord{
			Index:   2,
			Skipped: false,
			Infos:   []types.BatchMessage{{Code: "INFO-001", Message: "Created", Path: "field3"}},
		}},
		{BaseValidationRecord{
			Index:  3,
			Errors: []types.BatchMessage{{Code: "ERR-002", Message: "Error 2", Path: "field4"}},
		}},
	}

	copyRecordIntoBatch(batch, records)

	assert.Equal(t, types.BatchStatusError, batch.Status)
	assert.Equal(t, 0, batch.Summary.Created)
	assert.Equal(t, 2, batch.Summary.Skipped)
	assert.Equal(t, 2, batch.Summary.Errors)
}

func Test_CopyRecordIntoBatch_EmptyRecords(t *testing.T) {
	batch := &types.Batch{
		Status: types.BatchStatusRunning,
		Report: types.BatchReport{},
	}

	records := []TestValidationRecord{}

	copyRecordIntoBatch(batch, records)

	assert.Equal(t, types.BatchStatusSuccess, batch.Status)
	assert.Equal(t, 0, batch.Summary.Created)
	assert.Equal(t, 0, batch.Summary.Skipped)
	assert.Equal(t, 0, batch.Summary.Errors)
}

func Test_CopyRecordIntoBatch_MultipleMessages(t *testing.T) {
	batch := &types.Batch{
		Status: types.BatchStatusRunning,
		Report: types.BatchReport{},
	}

	records := []TestValidationRecord{
		{BaseValidationRecord{
			Index: 0,
			Errors: []types.BatchMessage{
				{Code: "ERR-001", Message: "Error 1", Path: "field1"},
				{Code: "ERR-002", Message: "Error 2", Path: "field2"},
			},
			Warnings: []types.BatchMessage{
				{Code: "WARN-001", Message: "Warning 1", Path: "field3"},
			},
		}},
	}

	copyRecordIntoBatch(batch, records)

	assert.Equal(t, types.BatchStatusError, batch.Status)
	assert.Equal(t, 1, batch.Summary.Errors)
	assert.Equal(t, 0, batch.Summary.Skipped)
}
