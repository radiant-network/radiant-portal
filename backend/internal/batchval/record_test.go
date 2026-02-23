package batchval

import (
	"regexp"
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

func Test_VerifyStringField_RequiredMissing(t *testing.T) {
	r := &BaseValidationRecord{
		Index: 0,
	}
	r.ValidateStringField("", "foobar", "type[0].foobar", "ERROR-001", "resourceType", 100, nil, []string{"res1", "res2"}, true)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "ERROR-001", r.Errors[0].Code)
	assert.Equal(t, "Invalid field foobar for resourceType (res1 / res2). Reason: field is empty.", r.Errors[0].Message)
	assert.Equal(t, "type[0].foobar", r.Errors[0].Path)
}

func Test_VerifyStringField_TooLong(t *testing.T) {
	r := &BaseValidationRecord{
		Index: 0,
	}
	r.ValidateStringField("0123456789", "foobar", "type[0].field", "ERROR-001", "resourceType", 5, nil, []string{"res1", "res2"}, true)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "ERROR-001", r.Errors[0].Code)
	assert.Equal(t, "Invalid field foobar for resourceType (res1 / res2). Reason: field is too long, maximum length allowed is 5.", r.Errors[0].Message)
	assert.Equal(t, "type[0].field", r.Errors[0].Path)
}

func Test_VerifyStringField_RegexpMismatch(t *testing.T) {
	r := &BaseValidationRecord{
		Index: 0,
	}
	re := regexp.MustCompile(`^[A-Z]+$`)
	r.ValidateStringField("abc", "foobar", "type[0].field", "ERROR-001", "resourceType", 5, re, []string{"res1", "res2"}, true)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "ERROR-001", r.Errors[0].Code)
	assert.Equal(t, "Invalid field foobar for resourceType (res1 / res2). Reason: does not match the regular expression `^[A-Z]+$`.", r.Errors[0].Message)
	assert.Equal(t, "type[0].field", r.Errors[0].Path)
}

func Test_ValidateCode_Valid(t *testing.T) {
	r := &BaseValidationRecord{}
	validCodes := []string{"code1", "code2"}
	r.ValidateCode("resource", "path.to.field", "status_code", "ERR001", "code1", validCodes, []string{"ID1"}, true)
	assert.Empty(t, r.Errors)
}

func Test_ValidateCode_Invalid(t *testing.T) {
	r := &BaseValidationRecord{}
	validCodes := []string{"code1", "code2"}
	r.ValidateCode("resource", "path.to.field", "status_code", "ERR001", "invalid", validCodes, []string{"ID1"}, true)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "ERR001", r.Errors[0].Code)
	assert.Equal(t, "path.to.field", r.Errors[0].Path)
	assert.Equal(t, "Invalid field status_code for resource ID1. Reason: \"invalid\" is not a valid status code. Valid values [code1, code2].", r.Errors[0].Message)
}

func Test_ValidateCode_EmptyNotRequired(t *testing.T) {
	r := &BaseValidationRecord{}
	validCodes := []string{"code1", "code2"}
	r.ValidateCode("resource", "path.to.field", "status_code", "ERR001", "", validCodes, []string{"ID1"}, false)
	assert.Empty(t, r.Errors)
}

func Test_ValidateCode_EmptyRequired(t *testing.T) {
	r := &BaseValidationRecord{}
	validCodes := []string{"code1", "code2"}
	r.ValidateCode("resource", "path.to.field", "status_code", "ERR001", "", validCodes, []string{"ID1"}, true)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "ERR001", r.Errors[0].Code)
	assert.Equal(t, "path.to.field", r.Errors[0].Path)
	assert.Equal(t, "Invalid field status_code for resource ID1. Reason: \"\" is not a valid status code. Valid values [code1, code2].", r.Errors[0].Message)
}

func Test_ValidateCode_LabelFormatting(t *testing.T) {
	r := &BaseValidationRecord{}
	validCodes := []string{"A"}
	r.ValidateCode("resource", "path.to.field", "very_long_field_name", "ERR001", "B", validCodes, []string{"ID"}, true)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "ERR001", r.Errors[0].Code)
	assert.Equal(t, "path.to.field", r.Errors[0].Path)
	assert.Equal(t, r.Errors[0].Message, "Invalid field very_long_field_name for resource ID. Reason: \"B\" is not a valid very long field name. Valid values [A].")
}
