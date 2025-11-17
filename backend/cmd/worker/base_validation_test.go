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

func Test_CopyRecordIntoBatch_Success(t *testing.T) {
	batch := &types.Batch{
		Status: "PROCESSING",
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

	assert.Equal(t, "SUCCESS", batch.Status)
	assert.Equal(t, 2, batch.Summary.Created)
	assert.Equal(t, 0, batch.Summary.Skipped)
	assert.Equal(t, 0, batch.Summary.Errors)
}

func Test_CopyRecordIntoBatch_WithErrors(t *testing.T) {
	batch := &types.Batch{
		Status: "PROCESSING",
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

	assert.Equal(t, "ERROR", batch.Status)
	assert.Equal(t, 0, batch.Summary.Created)
	assert.Equal(t, 1, batch.Summary.Skipped)
	assert.Equal(t, 1, batch.Summary.Errors)
}

func Test_CopyRecordIntoBatch_WithSkipped(t *testing.T) {
	batch := &types.Batch{
		Status: "PROCESSING",
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

	assert.Equal(t, "SUCCESS", batch.Status)
	assert.Equal(t, 1, batch.Summary.Created)
	assert.Equal(t, 1, batch.Summary.Skipped)
	assert.Equal(t, 0, batch.Summary.Errors)
}

func Test_CopyRecordIntoBatch_MixedRecords(t *testing.T) {
	batch := &types.Batch{
		Status: "PROCESSING",
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

	assert.Equal(t, "ERROR", batch.Status)
	assert.Equal(t, 0, batch.Summary.Created)
	assert.Equal(t, 2, batch.Summary.Skipped)
	assert.Equal(t, 2, batch.Summary.Errors)
}

func Test_CopyRecordIntoBatch_EmptyRecords(t *testing.T) {
	batch := &types.Batch{
		Status: "PROCESSING",
		Report: types.BatchReport{},
	}

	records := []TestValidationRecord{}

	copyRecordIntoBatch(batch, records)

	assert.Equal(t, "SUCCESS", batch.Status)
	assert.Equal(t, 0, batch.Summary.Created)
	assert.Equal(t, 0, batch.Summary.Skipped)
	assert.Equal(t, 0, batch.Summary.Errors)
}

func Test_CopyRecordIntoBatch_MultipleMessages(t *testing.T) {
	batch := &types.Batch{
		Status: "PROCESSING",
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

	assert.Equal(t, "ERROR", batch.Status)
	assert.Equal(t, 1, batch.Summary.Errors)
	assert.Equal(t, 0, batch.Summary.Skipped)
}
