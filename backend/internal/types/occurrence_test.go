package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_OccurrenceType_TaskTypeCode_GermlineSNV(t *testing.T) {
	code, err := OccurrenceTypeGermlineSNV.TaskTypeCode()

	assert.NoError(t, err)
	if assert.NotNil(t, code) {
		assert.Equal(t, RadiantGermlineAnnotationTask, *code)
	}
}

func Test_OccurrenceType_TaskTypeCode_GermlineCNV(t *testing.T) {
	code, err := OccurrenceTypeGermlineCNV.TaskTypeCode()

	assert.NoError(t, err)
	if assert.NotNil(t, code) {
		assert.Equal(t, AlignmentGermlineVariantCallingTaskTypeCode, *code)
	}
}

func Test_OccurrenceType_TaskTypeCode_SomaticSNV(t *testing.T) {
	code, err := OccurrenceTypeSomaticSNV.TaskTypeCode()

	assert.NoError(t, err)
	if assert.NotNil(t, code) {
		assert.Equal(t, RadiantSomaticAnnotationTask, *code)
	}
}

func Test_OccurrenceType_TaskTypeCode_Unknown(t *testing.T) {
	code, err := OccurrenceType("not_a_real_type").TaskTypeCode()

	assert.Error(t, err)
	assert.Nil(t, code)
	assert.Contains(t, err.Error(), "not_a_real_type")
}

func Test_OccurrenceType_TaskTypeCode_Empty(t *testing.T) {
	code, err := OccurrenceType("").TaskTypeCode()

	assert.Error(t, err)
	assert.Nil(t, code)
}
