package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetObservationStringById_OK(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewObservationStringRepository(db)
		result, err := repo.GetById(1)
		assert.NoError(t, err)
		assert.Equal(t, 1, result.ID)
		assert.Equal(t, 16, result.CaseID)
		assert.Equal(t, 44, result.PatientID)
		assert.Equal(t, "phenotype", result.ObservationCode)
		assert.Equal(t, "HP:0001263", result.Value)
	})
}

func Test_GetObservationStringById_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewObservationStringRepository(db)
		result, err := repo.GetById(999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateObservationString_OK(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		newObs := &types.ObsString{
			ID:              9999,
			CaseID:          1,
			PatientID:       1,
			ObservationCode: "phenotype",
			Value:           "HP:00314159",
		}

		repo := NewObservationStringRepository(db)
		err := repo.CreateObservationString(newObs)
		assert.NoError(t, err)

		result, err := repo.GetById(9999)
		assert.NoError(t, err)
		assert.Equal(t, 9999, result.ID)
		assert.Equal(t, 1, result.CaseID)
		assert.Equal(t, 1, result.PatientID)
		assert.Equal(t, "phenotype", result.ObservationCode)
		assert.Equal(t, "HP:00314159", result.Value)

		db.Exec("DELETE FROM obs_string WHERE id=9999")
	})
}

func Test_CreateObservationString_NilError(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewObservationStringRepository(db)
		err := repo.CreateObservationString(nil)
		assert.Error(t, err)
	})
}

func Test_CreateObservationString_CaseNotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		newObs := &types.ObsString{
			ID:              4242,
			CaseID:          9876,
			PatientID:       1,
			ObservationCode: "phenotype",
			Value:           "HP:00314159",
		}

		repo := NewObservationStringRepository(db)
		err := repo.CreateObservationString(newObs)
		assert.Error(t, err)

		result, err := repo.GetById(4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateObservationString_PatientNotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		newObs := &types.ObsString{
			ID:              4242,
			CaseID:          1,
			PatientID:       9876,
			ObservationCode: "phenotype",
			Value:           "HP:00314159",
		}

		repo := NewObservationStringRepository(db)
		err := repo.CreateObservationString(newObs)
		assert.Error(t, err)

		result, err := repo.GetById(4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}
