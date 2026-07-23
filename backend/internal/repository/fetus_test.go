package repository

import (
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_GetFetusById_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewFetusRepository(env.Postgres)
		result, err := repo.GetFetusById(t.Context(), 9999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateFetus_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		newFetus := &types.Fetus{
			ID:             9999,
			MotherID:       1,
			SexCode:        "male",
			LifeStatusCode: "alive",
			TenantCode:     types.DefaultTenantCode,
		}

		repo := NewFetusRepository(env.Postgres)
		err := repo.CreateFetus(t.Context(), newFetus)
		assert.NoError(t, err)
		t.Cleanup(func() { env.Postgres.Exec("DELETE FROM fetus WHERE id=9999") })

		result, err := repo.GetFetusById(t.Context(), 9999)
		assert.NoError(t, err)
		assert.Equal(t, newFetus.ID, result.ID)
		assert.Equal(t, newFetus.MotherID, result.MotherID)
		assert.Equal(t, newFetus.SexCode, result.SexCode)
		assert.Equal(t, newFetus.LifeStatusCode, result.LifeStatusCode)
		assert.Nil(t, result.LastMenstrualPeriod)
		assert.Nil(t, result.EstimatedDueDate)
	})
}

func Test_CreateFetus_WithGestationalDates_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		lmp := time.Date(2026, time.February, 1, 0, 0, 0, 0, time.UTC)
		newFetus := &types.Fetus{
			ID:                  9998,
			MotherID:            1,
			SexCode:             "female",
			LifeStatusCode:      "alive",
			LastMenstrualPeriod: &lmp,
			TenantCode:          types.DefaultTenantCode,
		}

		repo := NewFetusRepository(env.Postgres)
		err := repo.CreateFetus(t.Context(), newFetus)
		assert.NoError(t, err)
		t.Cleanup(func() { env.Postgres.Exec("DELETE FROM fetus WHERE id=9998") })

		result, err := repo.GetFetusById(t.Context(), 9998)
		assert.NoError(t, err)
		assert.NotNil(t, result.LastMenstrualPeriod)
		assert.True(t, lmp.Equal(*result.LastMenstrualPeriod))
		assert.Nil(t, result.EstimatedDueDate)
	})
}

func Test_CreateFetus_NilError(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewFetusRepository(env.Postgres)
		err := repo.CreateFetus(t.Context(), nil)
		assert.Error(t, err)
	})
}

func Test_CreateFetus_InvalidSexCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		newFetus := &types.Fetus{
			ID:             4242,
			MotherID:       1,
			SexCode:        "not-a-sex",
			LifeStatusCode: "alive",
			TenantCode:     types.DefaultTenantCode,
		}

		repo := NewFetusRepository(env.Postgres)
		err := repo.CreateFetus(t.Context(), newFetus)
		assert.Error(t, err)

		result, err := repo.GetFetusById(t.Context(), 4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}
