package main

import (
	"fmt"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/stretchr/testify/assert"
)

// -----------------------------------------------------------------------------
// fetchFetusCodes
// -----------------------------------------------------------------------------

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
		GetCodesFunc: func(setType repository.ValueSetType) ([]string, error) {
			if setType == repository.ValueSetSex {
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
		GetCodesFunc: func(setType repository.ValueSetType) ([]string, error) {
			if setType == repository.ValueSetLifeStatus {
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

// -----------------------------------------------------------------------------
// fetchPatientCodes must exclude the worker-internal "fetus" relationship code
// -----------------------------------------------------------------------------

func Test_fetchPatientCodes_ExcludesFetusRelationship(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType repository.ValueSetType) ([]string, error) {
			if setType == repository.ValueSetFamilyRelationship {
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
	assert.NotContains(t, record.PatientRelationshipToProbandCodes, RelationshipFetusCode)
	assert.ElementsMatch(t, []string{"proband", "mother", "father", "sibling"}, record.PatientRelationshipToProbandCodes)
}

// -----------------------------------------------------------------------------
// Fetus field validation
// -----------------------------------------------------------------------------

func newFetusValidationRecord(fetus *types.CaseFetusBatch) *CaseValidationRecord {
	return &CaseValidationRecord{
		BaseValidationRecord:       batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Index: 0},
		Case:                       types.CaseBatch{Fetus: fetus},
		SexCodes:                   []string{"male", "female", "unknown"},
		LifeStatusCodes:            []string{"alive", "deceased", "unknown"},
		PatientAffectedStatusCodes: []string{"affected", "non_affected", "unknown"},
		ObservationCodes:           []string{"phenotype", "note"},
		OnsetCodes:                 []string{"antenatal", "unknown"},
		InterpretationCodes:        []string{"positive", "negative", "abnormal", "normal"},
	}
}

func Test_validateFetusSexCode_Valid(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{SexCode: "male"})
	cr.validateFetusSexCode()
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusSexCode_Invalid(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{SexCode: "not-a-sex"})
	cr.validateFetusSexCode()
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetus.sex_code", cr.Errors[0].Path)
}

func Test_validateFetusSexCode_Missing(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{SexCode: ""})
	cr.validateFetusSexCode()
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
}

func Test_validateFetusLifeStatusCode_Valid(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{LifeStatusCode: "alive"})
	cr.validateFetusLifeStatusCode()
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusLifeStatusCode_Invalid(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{LifeStatusCode: "not-a-status"})
	cr.validateFetusLifeStatusCode()
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetus.life_status_code", cr.Errors[0].Path)
}

func Test_validateFetusLifeStatusCode_Missing(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{LifeStatusCode: ""})
	cr.validateFetusLifeStatusCode()
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
}

func Test_validateFetusAffectedStatusCode_Valid(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{AffectedStatusCode: "unknown"})
	cr.validateFetusAffectedStatusCode()
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusAffectedStatusCode_Invalid(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{AffectedStatusCode: "super-affected"})
	cr.validateFetusAffectedStatusCode()
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
}

func Test_validateFetusObservationsCategorical_Valid(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{
		ObservationsCategorical: []*types.ObservationCategoricalBatch{
			{Code: "phenotype", System: "HPO", Value: "HP:0001631", OnsetCode: "antenatal", InterpretationCode: "positive"},
		},
	})
	cr.validateFetusObservationsCategorical()
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusObservationsCategorical_InvalidCode(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{
		ObservationsCategorical: []*types.ObservationCategoricalBatch{
			{Code: "not-a-code", System: "HPO", Value: "HP:0001631", OnsetCode: "antenatal", InterpretationCode: "positive"},
		},
	})
	cr.validateFetusObservationsCategorical()
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, ObservationInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetus.observations_categorical[0].code", cr.Errors[0].Path)
}

func Test_validateFetusObservationsText_Valid(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{
		ObservationsText: []*types.ObservationTextBatch{{Code: "note", Value: "Free text note"}},
	})
	cr.validateFetusObservationsText()
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusObservationsText_InvalidCode(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{
		ObservationsText: []*types.ObservationTextBatch{{Code: "not-a-code", Value: "Free text note"}},
	})
	cr.validateFetusObservationsText()
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, ObservationInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetus.observations_text[0].code", cr.Errors[0].Path)
}

func Test_validateCaseFetuses_NoFetus(t *testing.T) {
	cr := newFetusValidationRecord(nil)
	err := cr.validateCaseFetuses()
	assert.NoError(t, err)
	assert.Empty(t, cr.Errors)
}

func Test_validateCaseFetuses_InvalidFetus(t *testing.T) {
	cr := newFetusValidationRecord(&types.CaseFetusBatch{SexCode: "not-a-sex", LifeStatusCode: "not-a-status", AffectedStatusCode: "unknown"})
	err := cr.validateCaseFetuses()
	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 2)
	assert.Equal(t, "create_case[0].fetus.sex_code", cr.Errors[0].Path)
	assert.Equal(t, "create_case[0].fetus.life_status_code", cr.Errors[1].Path)
}

// -----------------------------------------------------------------------------
// exactlyOneSubjectSet
// -----------------------------------------------------------------------------

func Test_exactlyOneSubjectSet_OnlyPatient(t *testing.T) {
	assert.True(t, exactlyOneSubjectSet(utils.IntPtr(1), nil))
}

func Test_exactlyOneSubjectSet_OnlyFetus(t *testing.T) {
	assert.True(t, exactlyOneSubjectSet(nil, utils.IntPtr(1)))
}

func Test_exactlyOneSubjectSet_BothNil(t *testing.T) {
	assert.False(t, exactlyOneSubjectSet(nil, nil))
}

func Test_exactlyOneSubjectSet_BothSet(t *testing.T) {
	assert.False(t, exactlyOneSubjectSet(utils.IntPtr(1), utils.IntPtr(2)))
}

// -----------------------------------------------------------------------------
// dateISO8601ToTimePtr
// -----------------------------------------------------------------------------

func Test_dateISO8601ToTimePtr_Nil(t *testing.T) {
	assert.Nil(t, dateISO8601ToTimePtr(nil))
}

func Test_dateISO8601ToTimePtr_Value(t *testing.T) {
	d := types.DateISO8601(time.Date(2026, time.February, 1, 0, 0, 0, 0, time.UTC))
	result := dateISO8601ToTimePtr(&d)
	assert.NotNil(t, result)
	assert.True(t, time.Time(d).Equal(*result))
}
