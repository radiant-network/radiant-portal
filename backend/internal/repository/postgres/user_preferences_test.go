package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_GetUserPreference(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUserPreferencesRepository(database.PostgresDB{DB: env.Postgres})

		userId := "b3a74785-b0a9-4a45-879e-f13c476976f7"
		userPreference, err := repo.GetUserPreferences(t.Context(), userId, "table_1")
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)
	})
}

func Test_GetUserPreference_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUserPreferencesRepository(database.PostgresDB{DB: env.Postgres})
		userId := "b3a74785-b0a9-4a45-879e-f13c476976f7"
		userPreference, err := repo.GetUserPreferences(t.Context(), userId, "not_found")
		assert.NoError(t, err)
		assert.Nil(t, userPreference)
	})
}

func Test_UpdateUserPreference_Create(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUserPreferencesRepository(database.PostgresDB{DB: env.Postgres})

		userId := "610de5c4-a192-45f9-aeac-bb1d5728a006"
		userPref := types.JsonMap[string, interface{}]{
			"content": "test content",
		}

		userPreference, err := repo.GetUserPreferences(t.Context(), userId, "table_1") // No existing preferences
		assert.NoError(t, err)
		assert.Nil(t, userPreference)

		userPreference, err = repo.UpdateUserPreferences(t.Context(), userId, "table_1", userPref)
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)

		userPreference, err = repo.GetUserPreferences(t.Context(), userId, "table_1") // Preferences have been inserted
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)
		assert.Equal(t, types.JsonMap[string, interface{}]{
			"content": "test content",
		}, *userPreference)
	})
}

func Test_UpdateUserPreference_Update(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUserPreferencesRepository(database.PostgresDB{DB: env.Postgres})

		userId := "a86f047c-eb72-4e24-a344-e15944ca42be"
		userPref := types.JsonMap[string, interface{}]{
			"content": "test content",
		}

		userPreference, err := repo.GetUserPreferences(t.Context(), userId, "table_1") // No existing preferences
		assert.NoError(t, err)
		assert.Nil(t, userPreference)

		userPreference, err = repo.UpdateUserPreferences(t.Context(), userId, "table_1", userPref)
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)

		userPreference, err = repo.GetUserPreferences(t.Context(), userId, "table_1") // Preferences have been inserted
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)
		assert.Equal(t, types.JsonMap[string, interface{}]{
			"content": "test content",
		}, *userPreference)

		updatedContent := types.JsonMap[string, interface{}]{
			"content": "test content updated",
		}

		userPreference, err = repo.UpdateUserPreferences(t.Context(), userId, "table_1", updatedContent)
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)

		userPreference, err = repo.GetUserPreferences(t.Context(), userId, "table_1") // Preferences have been updated
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)
		assert.Equal(t, types.JsonMap[string, interface{}]{
			"content": "test content updated",
		}, *userPreference)
	})
}
