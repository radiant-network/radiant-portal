package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetSavedFilterByID(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilter, err := repo.GetSavedFilterByID(1)
		assert.NoError(t, err)
		assert.NotNil(t, savedFilter)

		assert.Equal(t, 1, savedFilter.ID)
		assert.Equal(t, "1", savedFilter.UserID)
		assert.Equal(t, "saved_filter_snv_1", savedFilter.Name)
		assert.Equal(t, types.GERMLINE_SNV_OCCURRENCE, savedFilter.Type)
		assert.Equal(t, false, savedFilter.Favorite)
		assert.NotNil(t, savedFilter.CreatedOn)
		assert.NotNil(t, savedFilter.UpdatedOn)
		assert.Len(t, savedFilter.Queries, 1)
	})
}

func Test_GetSavedFilterByID_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilter, err := repo.GetSavedFilterByID(42)
		assert.NoError(t, err)
		assert.Nil(t, savedFilter)
	})
}

func Test_GetSavedFiltersByUserID(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilters, err := repo.GetSavedFiltersByUserID("1")
		assert.NoError(t, err)
		assert.NotNil(t, savedFilters)
		assert.Len(t, *savedFilters, 2)
	})
}

func Test_GetSavedFiltersByUserID_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilters, err := repo.GetSavedFiltersByUserID("not_existing_user")
		assert.NoError(t, err)
		assert.NotNil(t, savedFilters)
		assert.Len(t, *savedFilters, 0)
	})
}

func Test_GetSavedFiltersByUserIDAndType(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilters, err := repo.GetSavedFiltersByUserIDAndType("1", types.GERMLINE_SNV_OCCURRENCE)
		assert.NoError(t, err)
		assert.NotNil(t, savedFilters)
		assert.Len(t, *savedFilters, 1)
	})
}

func Test_GetSavedFiltersByUserIDAndType_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilters, err := repo.GetSavedFiltersByUserIDAndType("1", types.SOMATIC_SNV_VARIANT)
		assert.NoError(t, err)
		assert.NotNil(t, savedFilters)
		assert.Len(t, *savedFilters, 0)
	})
}
