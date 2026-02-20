package batchval

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_FormatPath(t *testing.T) {
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 5},
	}

	pathWithField := FormatPath(record, "last_name")
	assert.Equal(t, "test_resource[5].last_name", pathWithField)

	pathWithoutField := FormatPath(record, "")
	assert.Equal(t, "test_resource[5]", pathWithoutField)
}

func Test_FormatIds(t *testing.T) {
	result := FormatIds([]string{})
	assert.Equal(t, "", result)

	result = FormatIds([]string{"ORG1"})
	assert.Equal(t, "ORG1", result)

	result = FormatIds([]string{"ORG1", "P123"})
	assert.Equal(t, "(ORG1 / P123)", result)

	result = FormatIds(nil)
	assert.Equal(t, "", result)
}

func Test_FormatInvalidField(t *testing.T) {
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	messageWithIds := FormatInvalidField(record.GetResourceType(), "tissue_site", "is empty", []string{"ORG1", "S1"})
	expectedMsgWithIds := "Invalid field tissue_site for test_resource (ORG1 / S1). Reason: is empty."
	assert.Equal(t, expectedMsgWithIds, messageWithIds)

	messageWithoutIds := FormatInvalidField(record.GetResourceType(), "type_code", "is unknown", []string{})
	expectedMsgWithoutIds := "Invalid field type_code for test_resource. Reason: is unknown."
	assert.Equal(t, expectedMsgWithoutIds, messageWithoutIds)
}

func Test_FormatFieldTooLong(t *testing.T) {
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 2},
	}

	message := FormatFieldTooLong(record.GetResourceType(), "first_name", 50, []string{"ORG2", "P2"})
	expectedMessage := "Invalid field first_name for test_resource (ORG2 / P2). Reason: field is too long, maximum length allowed is 50."
	assert.Equal(t, expectedMessage, message)
}

func Test_FormatDuplicateInBatch(t *testing.T) {
	record := &TestValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 3},
	}

	message := FormatDuplicateInBatch(record.GetResourceType(), []string{"ORG1", "P123"})
	expected := "Test_resource (ORG1 / P123) appears multiple times in the batch."
	assert.Equal(t, expected, message)
}
