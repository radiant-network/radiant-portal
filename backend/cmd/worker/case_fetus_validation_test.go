package main

import (
	"fmt"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func Test_fetchFetusCodes_OK(t *testing.T) {
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: &CodesMockRepo{}}
	record := CaseValidationRecord{BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Context: mockContext}}
	record.Cache = batchval.NewBatchValidationCache(mockContext)

	err := record.fetchFetusCodes(t.Context())
	assert.NoError(t, err)
	assert.Equal(t, []string{"male", "female", "unknown"}, record.SexCodes)
	assert.Equal(t, []string{"alive", "deceased", "unknown"}, record.LifeStatusCodes)
}

func Test_fetchFetusCodes_SexCodesError(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType postgres.ValueSetType) ([]string, error) {
			if setType == postgres.ValueSetSex {
				return nil, fmt.Errorf("database connection failed")
			}
			return nil, nil
		},
	}
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: mockRepo}
	record := CaseValidationRecord{BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Context: mockContext}}
	record.Cache = batchval.NewBatchValidationCache(mockContext)

	err := record.fetchFetusCodes(t.Context())
	assert.Error(t, err)
	assert.ErrorContains(t, err, "error retrieving sex codes")
}

func Test_fetchFetusCodes_LifeStatusCodesError(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType postgres.ValueSetType) ([]string, error) {
			if setType == postgres.ValueSetLifeStatus {
				return nil, fmt.Errorf("database connection failed")
			}
			return nil, nil
		},
	}
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: mockRepo}
	record := CaseValidationRecord{BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Context: mockContext}}
	record.Cache = batchval.NewBatchValidationCache(mockContext)

	err := record.fetchFetusCodes(t.Context())
	assert.Error(t, err)
	assert.ErrorContains(t, err, "error retrieving life status codes")
}

func Test_fetchPatientCodes_ExcludesFetusRelationship(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType postgres.ValueSetType) ([]string, error) {
			if setType == postgres.ValueSetFamilyRelationship {
				return []string{"proband", "mother", "father", "sibling", "fetus"}, nil
			}
			return []string{"affected", "non_affected", "unknown"}, nil
		},
	}
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: mockRepo}
	record := CaseValidationRecord{BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Context: mockContext}}
	record.Cache = batchval.NewBatchValidationCache(mockContext)

	err := record.fetchPatientCodes(t.Context())
	assert.NoError(t, err)
	assert.ElementsMatch(t, []string{"proband", "mother", "father", "sibling"}, record.PatientRelationshipToProbandCodes)
}

func newFetusValidationRecord(fetuses []*types.CaseFetusBatch) *CaseValidationRecord {
	return &CaseValidationRecord{
		BaseValidationRecord:       batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Index: 0},
		Case:                       types.CaseBatch{Fetuses: fetuses},
		SexCodes:                   []string{"male", "female", "unknown"},
		LifeStatusCodes:            []string{"alive", "deceased", "unknown"},
		PatientAffectedStatusCodes: []string{"affected", "non_affected", "unknown"},
		ObservationCodes:           []string{"phenotype", "note"},
		OnsetCodes:                 []string{"antenatal", "unknown"},
		InterpretationCodes:        []string{"positive", "negative", "abnormal", "normal"},
	}
}

func Test_validateFetusSexCode_Valid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SexCode: "male"}})
	cr.validateFetusSexCode(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusSexCode_Invalid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SexCode: "not-a-sex"}})
	cr.validateFetusSexCode(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].sex_code", cr.Errors[0].Path)
}

func Test_validateFetusSexCode_Missing(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SexCode: ""}})
	cr.validateFetusSexCode(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
}

func Test_validateFetusLifeStatusCode_Valid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "alive"}})
	cr.validateFetusLifeStatusCode(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusLifeStatusCode_Invalid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "not-a-status"}})
	cr.validateFetusLifeStatusCode(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].life_status_code", cr.Errors[0].Path)
}

func Test_validateFetusLifeStatusCode_Missing(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: ""}})
	cr.validateFetusLifeStatusCode(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
}

func Test_validateFetusAffectedStatusCode_Valid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{AffectedStatusCode: "unknown"}})
	cr.validateFetusAffectedStatusCode(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusAffectedStatusCode_Invalid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{AffectedStatusCode: "super-affected"}})
	cr.validateFetusAffectedStatusCode(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
}

func Test_validateFetusObservationsCategorical_Valid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{
		ObservationsCategorical: []*types.ObservationCategoricalBatch{
			{Code: "phenotype", System: "HPO", Value: "HP:0001631", OnsetCode: "antenatal", InterpretationCode: "positive"},
		},
	}})
	cr.validateFetusObservationsCategorical(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusObservationsCategorical_InvalidCode(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{
		ObservationsCategorical: []*types.ObservationCategoricalBatch{
			{Code: "not-a-code", System: "HPO", Value: "HP:0001631", OnsetCode: "antenatal", InterpretationCode: "positive"},
		},
	}})
	cr.validateFetusObservationsCategorical(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, ObservationInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].observations_categorical[0].code", cr.Errors[0].Path)
}

func Test_validateFetusObservationsText_Valid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{
		ObservationsText: []*types.ObservationTextBatch{{Code: "note", Value: "Free text note"}},
	}})
	cr.validateFetusObservationsText(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusObservationsText_InvalidCode(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{
		ObservationsText: []*types.ObservationTextBatch{{Code: "not-a-code", Value: "Free text note"}},
	}})
	cr.validateFetusObservationsText(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, ObservationInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].observations_text[0].code", cr.Errors[0].Path)
}

func Test_validateCaseFetuses_MultipleFetuses(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{
		{SexCode: "male", LifeStatusCode: "alive", AffectedStatusCode: "unknown"},
		{SexCode: "not-a-sex", LifeStatusCode: "not-a-status", AffectedStatusCode: "unknown"},
	})
	err := cr.validateCaseFetuses()
	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 2)
	assert.Equal(t, "create_case[0].fetuses[1].sex_code", cr.Errors[0].Path)
	assert.Equal(t, "create_case[0].fetuses[1].life_status_code", cr.Errors[1].Path)
}

// `dive` without `required` lets a null entry through binding, so the worker must report it as a
// validation error rather than nil-deref on it.
func Test_validateCaseFetuses_NullEntry(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{nil})
	err := cr.validateCaseFetuses()
	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0]", cr.Errors[0].Path)
}

func Test_validateFetusObservationsCategorical_NullEntry(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{
		{ObservationsCategorical: []*types.ObservationCategoricalBatch{nil}},
	})
	cr.validateFetusObservationsCategorical(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, ObservationInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].observations_categorical[0]", cr.Errors[0].Path)
}

func Test_validateFetusObservationsText_NullEntry(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{
		{ObservationsText: []*types.ObservationTextBatch{nil}},
	})
	cr.validateFetusObservationsText(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, ObservationInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].observations_text[0]", cr.Errors[0].Path)
}

// A valid fetus whose observation entries are null: validateCaseFetuses reaches both arrays in the
// same pass, so it must survive them together.
func Test_validateCaseFetuses_NullObservationEntries(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{
		{
			SexCode:                 "male",
			LifeStatusCode:          "alive",
			AffectedStatusCode:      "affected",
			ObservationsCategorical: []*types.ObservationCategoricalBatch{nil},
			ObservationsText:        []*types.ObservationTextBatch{nil},
		},
	})
	err := cr.validateCaseFetuses()
	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 2)
	assert.Equal(t, "create_case[0].fetuses[0].observations_categorical[0]", cr.Errors[0].Path)
	assert.Equal(t, "create_case[0].fetuses[0].observations_text[0]", cr.Errors[1].Path)
}

func Test_dateISO8601ToTimePtr_Nil(t *testing.T) {
	assert.Nil(t, dateISO8601ToTimePtr(nil))
}

func Test_dateISO8601ToTimePtr_Value(t *testing.T) {
	d := types.DateISO8601(time.Date(2026, time.February, 1, 0, 0, 0, 0, time.UTC))
	result := dateISO8601ToTimePtr(&d)
	assert.NotNil(t, result)
	assert.True(t, time.Time(d).Equal(*result))
}
