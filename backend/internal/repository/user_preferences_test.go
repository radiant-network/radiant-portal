package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetUserPreference(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewUserPreferencesRepository(db)

		userId := "b3a74785-b0a9-4a45-879e-f13c476976f7"
		userPreference, err := repo.GetUserPreferences(userId)
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)
	})
}

func Test_GetUserPreference_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewUserPreferencesRepository(db)
		userPreference, err := repo.GetUserPreferences("not_found")
		assert.NoError(t, err)
		assert.Nil(t, userPreference)
	})
}

func Test_UpdateUserPreference_Create(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewUserPreferencesRepository(db)

		userId := "610de5c4-a192-45f9-aeac-bb1d5728a006"
		tableConfig := map[string]types.TableConfig{
			"table_1": {
				Pagination: &types.PaginationConfig{PageSize: 25},
			},
		}
		userPref := UserPreference{
			TableDisplay: tableConfig,
		}

		userPreference, err := repo.GetUserPreferences(userId) // No existing preferences
		assert.NoError(t, err)
		assert.Nil(t, userPreference)

		userPreference, err = repo.UpdateUserPreferences(userId, userPref)
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)

		userPreference, err = repo.GetUserPreferences(userId) // Preferences have been inserted
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)
		assert.Len(t, userPreference.TableDisplay, 1)
	})
}

func Test_UpdateUserPreference_Update(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewUserPreferencesRepository(db)

		userId := "a86f047c-eb72-4e24-a344-e15944ca42be"
		tableConfig := map[string]types.TableConfig{
			"table_1": {
				Pagination: &types.PaginationConfig{PageSize: 25},
			},
		}
		userPref := UserPreference{
			TableDisplay: tableConfig,
		}

		userPreference, err := repo.GetUserPreferences(userId) // No existing preferences
		assert.NoError(t, err)
		assert.Nil(t, userPreference)

		userPreference, err = repo.UpdateUserPreferences(userId, userPref)
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)

		userPreference, err = repo.GetUserPreferences(userId) // Preferences have been inserted
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)
		assert.Len(t, userPreference.TableDisplay, 1)

		tableConfig["table_2"] = TableConfig{}

		userPreference, err = repo.UpdateUserPreferences(userId, userPref)
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)

		userPreference, err = repo.GetUserPreferences(userId) // Preferences have been updated
		assert.NoError(t, err)
		assert.NotNil(t, userPreference)
		assert.Len(t, userPreference.TableDisplay, 2)

	})
}
