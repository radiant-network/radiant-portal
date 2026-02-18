package validation

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type TestValidationRecord struct {
	BaseValidationRecord
}

func (r *TestValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *TestValidationRecord) GetResourceType() string {
	return "test_resource"
}

func Test_ValidateUniquenessInBatch_NoDuplicate(t *testing.T) {
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	type testKey struct {
		OrgCode string
		ID      string
	}

	seenBatchMap := map[testKey]struct{}{}
	key := testKey{OrgCode: "ORG1", ID: "P1"}

	ValidateUniquenessInBatch(
		record,
		key,
		seenBatchMap,
		"DUPLICATE-001",
		[]string{"ORG1", "P1"},
	)

	assert.Empty(t, record.Errors)
	_, exists := seenBatchMap[key]
	assert.True(t, exists)
}

func Test_ValidateUniquenessInBatch_DuplicateFound(t *testing.T) {
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 5},
	}

	type testKey struct {
		OrgCode string
		ID      string
	}

	seenBatchMap := map[testKey]struct{}{}
	key := testKey{OrgCode: "ORG1", ID: "P1"}
	seenBatchMap[key] = struct{}{}

	ValidateUniquenessInBatch(
		record,
		key,
		seenBatchMap,
		"DUPLICATE-001",
		[]string{"ORG1", "P1"},
	)

	assert.Len(t, record.Errors, 1)
	assert.Equal(t, "DUPLICATE-001", record.Errors[0].Code)
	assert.Equal(t, "Test_resource (ORG1 / P1) appears multiple times in the batch.", record.Errors[0].Message)
	assert.Equal(t, "test_resource[5]", record.Errors[0].Path)
}

func Test_ValidateUniquenessInBatch_MultipleDuplicates(t *testing.T) {
	type testKey struct {
		OrgCode string
		ID      string
	}

	seenBatchMap := map[testKey]struct{}{}
	record1 := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 1},
	}
	key := testKey{OrgCode: "ORG1", ID: "P1"}
	seenBatchMap[key] = struct{}{}
	ValidateUniquenessInBatch(
		record1,
		key,
		seenBatchMap,
		"DUPLICATE-001",
		[]string{"ORG1", "P1"},
	)

	record2 := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 3},
	}
	ValidateUniquenessInBatch(
		record2,
		key,
		seenBatchMap,
		"DUPLICATE-001",
		[]string{"ORG1", "P1"},
	)

	assert.Len(t, record1.Errors, 1)
	assert.Len(t, record2.Errors, 1)
	assert.Equal(t, "test_resource[1]", record1.Errors[0].Path)
	assert.Equal(t, "test_resource[3]", record2.Errors[0].Path)
}

func Test_ValidateUniquenessInBatch_DifferentKeys(t *testing.T) {
	type testKey struct {
		OrgCode string
		ID      string
	}

	seenBatchMap := map[testKey]struct{}{}
	key := testKey{OrgCode: "ORG1", ID: "P1"}
	seenBatchMap[key] = struct{}{}
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 2},
	}
	ValidateUniquenessInBatch(
		record,
		testKey{OrgCode: "ORG1", ID: "P2"}, // Different ID
		seenBatchMap,
		"DUPLICATE-001",
		[]string{"ORG1", "P2"},
	)

	assert.Empty(t, record.Errors)
}

func Test_ValidateUniquenessInBatch_EmptyBatchMap(t *testing.T) {
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	type testKey struct {
		OrgCode string
		ID      string
	}

	seenBatchMap := map[testKey]struct{}{}
	key := testKey{OrgCode: "ORG1", ID: "P1"}

	ValidateUniquenessInBatch(
		record,
		key,
		seenBatchMap,
		"DUPLICATE-001",
		[]string{"ORG1", "P1"},
	)

	assert.Empty(t, record.Errors)
}

func Test_CopyRecordIntoBatch_Success(t *testing.T) {
	batch := &types.Batch{
		Status: types.BatchStatusRunning,
		Report: types.BatchReport{},
	}

	records := []*TestValidationRecord{
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

	CopyRecordIntoBatch(batch, records)

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

	records := []*TestValidationRecord{
		{BaseValidationRecord{
			Index:  0,
			Errors: []types.BatchMessage{{Code: "ERR-001", Message: "Error message", Path: "field1"}},
		}},
		{BaseValidationRecord{
			Index:   1,
			Skipped: false,
		},
		}}

	CopyRecordIntoBatch(batch, records)

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

	records := []*TestValidationRecord{
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

	CopyRecordIntoBatch(batch, records)

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

	records := []*TestValidationRecord{
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

	CopyRecordIntoBatch(batch, records)

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

	records := []*TestValidationRecord{}

	CopyRecordIntoBatch(batch, records)

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

	records := []*TestValidationRecord{
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

	CopyRecordIntoBatch(batch, records)

	assert.Equal(t, types.BatchStatusError, batch.Status)
	assert.Equal(t, 1, batch.Summary.Errors)
	assert.Equal(t, 0, batch.Summary.Skipped)
}
