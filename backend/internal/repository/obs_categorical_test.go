package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetObservationCategoricalById_OK(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewObservationCategoricalRepository(db)
		result, err := repo.GetById(1)
		assert.NoError(t, err)
		assert.Equal(t, 1, result.ID)
		assert.Equal(t, 16, result.CaseID)
		assert.Equal(t, 44, result.PatientID)
		assert.Equal(t, "phenotype", result.ObservationCode)
		assert.Equal(t, "HPO", result.CodingSystem)
		assert.Equal(t, "HP:0001263", result.CodeValue)
		assert.Equal(t, "unknown", result.OnsetCode)
		assert.Equal(t, "negative", result.InterpretationCode)
		assert.Equal(t, "Clinical comment", result.Note)
	})
}

func Test_GetObservationCategoricalById_HandlesError(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewObservationCategoricalRepository(db)
		result, err := repo.GetById(999)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
		assert.Nil(t, result)
	})
}

func Test_CreateObservationCategorical_OK(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		newObs := &types.ObsCategorical{
			ID:                 9999,
			CaseID:             1,
			PatientID:          1,
			ObservationCode:    "phenotype",
			CodingSystem:       "HPO",
			CodeValue:          "HP:00314159",
			OnsetCode:          "unknown",
			InterpretationCode: "negative",
			Note:               "Super note",
		}

		repo := NewObservationCategoricalRepository(db)
		err := repo.CreateObservationCategorical(newObs)
		assert.NoError(t, err)

		result, err := repo.GetById(9999)
		assert.NoError(t, err)
		assert.Equal(t, 9999, result.ID)
		assert.Equal(t, 1, result.CaseID)
		assert.Equal(t, 1, result.PatientID)
		assert.Equal(t, "phenotype", result.ObservationCode)
		assert.Equal(t, "HPO", result.CodingSystem)
		assert.Equal(t, "HP:00314159", result.CodeValue)
		assert.Equal(t, "unknown", result.OnsetCode)
		assert.Equal(t, "negative", result.InterpretationCode)
		assert.Equal(t, "Super note", result.Note)

		db.Exec("DELETE FROM obs_categorical WHERE id=9999")
	})
}
