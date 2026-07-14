package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_GetObservationCategoricalById_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewObservationCategoricalRepository(env.Postgres)
		result, err := repo.GetById(t.Context(), 1)
		assert.NoError(t, err)
		assert.Equal(t, 1, result.ID)
		assert.Equal(t, 16, result.CaseID)
		assert.Equal(t, 44, result.PatientID)
		assert.Equal(t, "phenotype", result.ObservationCode)
		assert.Equal(t, "HPO", result.CodingSystem)
		assert.Equal(t, "HP:0001263", result.CodeValue)
		assert.Equal(t, utils.NilIfEmpty("unknown"), result.OnsetCode)
		assert.Equal(t, utils.NilIfEmpty("negative"), result.InterpretationCode)
		assert.Equal(t, "Clinical comment", result.Note)
	})
}

func Test_GetObservationCategoricalById_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewObservationCategoricalRepository(env.Postgres)
		result, err := repo.GetById(t.Context(), 999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateObservationCategorical_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		newObs := &types.ObsCategorical{
			ID:                 9999,
			CaseID:             1,
			PatientID:          1,
			ObservationCode:    "phenotype",
			CodingSystem:       "HPO",
			CodeValue:          "HP:00314159",
			OnsetCode:          utils.NilIfEmpty("unknown"),
			InterpretationCode: utils.NilIfEmpty("negative"),
			Note:               "Super note",
			TenantCode:         types.DefaultTenantCode,
		}

		repo := NewObservationCategoricalRepository(env.Postgres)
		err := repo.CreateObservationCategorical(t.Context(), newObs)
		assert.NoError(t, err)

		result, err := repo.GetById(t.Context(), 9999)
		assert.NoError(t, err)
		assert.Equal(t, 9999, result.ID)
		assert.Equal(t, 1, result.CaseID)
		assert.Equal(t, 1, result.PatientID)
		assert.Equal(t, "phenotype", result.ObservationCode)
		assert.Equal(t, "HPO", result.CodingSystem)
		assert.Equal(t, "HP:00314159", result.CodeValue)
		assert.Equal(t, utils.NilIfEmpty("unknown"), result.OnsetCode)
		assert.Equal(t, utils.NilIfEmpty("negative"), result.InterpretationCode)
		assert.Equal(t, "Super note", result.Note)

		env.Postgres.Exec("DELETE FROM obs_categorical WHERE id=9999")
	})
}

func Test_CreateObservationCategorical_NilError(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewObservationCategoricalRepository(env.Postgres)
		err := repo.CreateObservationCategorical(t.Context(), nil)
		assert.Error(t, err)
	})
}

func Test_CreateObservationCategorical_CaseNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		newObs := &types.ObsCategorical{
			ID:                 4242,
			CaseID:             9876,
			PatientID:          1,
			ObservationCode:    "phenotype",
			CodingSystem:       "HPO",
			CodeValue:          "HP:00314159",
			OnsetCode:          utils.NilIfEmpty("unknown"),
			InterpretationCode: utils.NilIfEmpty("negative"),
			Note:               "Super note",
			TenantCode:         types.DefaultTenantCode,
		}

		repo := NewObservationCategoricalRepository(env.Postgres)
		err := repo.CreateObservationCategorical(t.Context(), newObs)
		assert.Error(t, err)

		result, err := repo.GetById(t.Context(), 4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateObservationCategorical_PatientNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		newObs := &types.ObsCategorical{
			ID:                 4242,
			CaseID:             1,
			PatientID:          9876,
			ObservationCode:    "phenotype",
			CodingSystem:       "HPO",
			CodeValue:          "HP:00314159",
			OnsetCode:          utils.NilIfEmpty("unknown"),
			InterpretationCode: utils.NilIfEmpty("negative"),
			Note:               "Super note",
			TenantCode:         types.DefaultTenantCode,
		}

		repo := NewObservationCategoricalRepository(env.Postgres)
		err := repo.CreateObservationCategorical(t.Context(), newObs)
		assert.Error(t, err)

		result, err := repo.GetById(t.Context(), 4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}
