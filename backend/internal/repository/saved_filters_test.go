package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetSavedFilterByID(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilter, err := repo.GetSavedFilterByID(1)
		assert.NoError(t, err)
		assert.NotNil(t, savedFilter)

		assert.Equal(t, 1, savedFilter.ID)
		assert.Equal(t, "1", savedFilter.UserID)
		assert.Equal(t, "saved_filter_snv_1", savedFilter.Name)
		assert.Equal(t, types.GERMLINE_SNV_OCCURRENCE, savedFilter.Type)
		assert.Equal(t, false, *(savedFilter.Favorite))
		assert.NotNil(t, savedFilter.CreatedOn)
		assert.NotNil(t, savedFilter.UpdatedOn)
		assert.Len(t, savedFilter.Queries, 1)
	})
}

func Test_GetSavedFilterByID_NotFound(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilter, err := repo.GetSavedFilterByID(42)
		assert.NoError(t, err)
		assert.Nil(t, savedFilter)
	})
}

func Test_GetSavedFiltersByUserID_NotType(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilters, err := repo.GetSavedFiltersByUserID("1", "")
		assert.NoError(t, err)
		assert.NotNil(t, savedFilters)
		assert.Len(t, *savedFilters, 2)
	})
}

func Test_GetSavedFiltersByUserID_UserIdNotFound(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilters, err := repo.GetSavedFiltersByUserID("not_existing_user", "")
		assert.NoError(t, err)
		assert.NotNil(t, savedFilters)
		assert.Len(t, *savedFilters, 0)
	})
}

func Test_GetSavedFiltersByUserID(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilters, err := repo.GetSavedFiltersByUserID("1", types.GERMLINE_SNV_OCCURRENCE)
		assert.NoError(t, err)
		assert.NotNil(t, savedFilters)
		assert.Len(t, *savedFilters, 1)
	})
}

func Test_GetSavedFiltersByUserID_NotFound(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilters, err := repo.GetSavedFiltersByUserID("1", types.SOMATIC_SNV_VARIANT)
		assert.NoError(t, err)
		assert.NotNil(t, savedFilters)
		assert.Len(t, *savedFilters, 0)
	})
}

func Test_CreateSavedFilter(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilterInput := types.SavedFilterCreationInput{
			Name: "new_saved_filter_somatic_snv_occurrence",
			Type: types.SOMATIC_SNV_OCCURRENCE,
			Queries: types.JsonArray[types.Sqon]{
				{
					Op: "and",
					Content: types.SqonArray{
						{
							Op: "in",
							Content: types.LeafContent{
								Field: "chromosome",
								Value: []interface{}{"1"},
							},
						},
					},
				},
			},
		}
		savedFilter, err := repo.CreateSavedFilter(savedFilterInput, "1")
		assert.NoError(t, err)
		assert.NotNil(t, savedFilter)
		assert.Equal(t, savedFilterInput.Name, (*savedFilter).Name)
		assert.Equal(t, savedFilterInput.Type, (*savedFilter).Type)
		assert.Equal(t, savedFilterInput.Queries, (*savedFilter).Queries)
		assert.Equal(t, "1", (*savedFilter).UserID)
		assert.NotEmpty(t, (*savedFilter).CreatedOn)
		assert.NotEmpty(t, (*savedFilter).UpdatedOn)
		assert.NotEmpty(t, (*savedFilter).ID)
		assert.False(t, *((*savedFilter).Favorite))
	})
}

func Test_CreateSavedFilter_ErrorUniqueConstraint(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilterInput := types.SavedFilterCreationInput{
			Name: "new_saved_filter_somatic_snv_occurrence",
			Type: types.SOMATIC_SNV_OCCURRENCE,
			Queries: types.JsonArray[types.Sqon]{
				{
					Op: "and",
					Content: types.SqonArray{
						{
							Op: "in",
							Content: types.LeafContent{
								Field: "chromosome",
								Value: []interface{}{"1"},
							},
						},
					},
				},
			},
		}
		savedFilter1, err1 := repo.CreateSavedFilter(savedFilterInput, "1")
		assert.NoError(t, err1)
		assert.NotNil(t, savedFilter1)

		savedFilter2, err2 := repo.CreateSavedFilter(savedFilterInput, "1")
		assert.Error(t, err2)
		assert.Nil(t, savedFilter2)
	})
}

func Test_UpdateSavedFilter(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilterCreationInput := types.SavedFilterCreationInput{
			Name: "new_saved_filter_somatic_snv_occurrence",
			Type: types.SOMATIC_SNV_OCCURRENCE,
			Queries: types.JsonArray[types.Sqon]{
				{
					Op: "and",
					Content: types.SqonArray{
						{
							Op: "in",
							Content: types.LeafContent{
								Field: "chromosome",
								Value: []interface{}{"1"},
							},
						},
					},
				},
			},
		}
		savedFilter, err1 := repo.CreateSavedFilter(savedFilterCreationInput, "1")
		assert.NoError(t, err1)
		assert.NotNil(t, savedFilter)

		savedFilterUpdateInput := types.SavedFilterUpdateInput{
			Name: "new_saved_filter_somatic_snv_occurrence_updated",
			Queries: types.JsonArray[types.Sqon]{
				{
					Op: "and",
					Content: types.SqonArray{
						{
							Op: "in",
							Content: types.LeafContent{
								Field: "chromosome",
								Value: []interface{}{"2"},
							},
						},
					},
				},
			},
			Favorite: utils.BoolPointer(true),
		}

		savedFilterUpdated, err2 := repo.UpdateSavedFilter(savedFilterUpdateInput, savedFilter.ID, "1")
		assert.NoError(t, err2)
		assert.NotNil(t, savedFilterUpdated)
		assert.Equal(t, savedFilterUpdateInput.Name, (*savedFilterUpdated).Name)
		assert.Equal(t, savedFilter.ID, (*savedFilterUpdated).ID)
		assert.Equal(t, savedFilterUpdateInput.Queries, (*savedFilterUpdated).Queries)
		assert.Equal(t, savedFilterUpdateInput.Favorite, (*savedFilterUpdated).Favorite)
	})
}

func Test_UpdateSavedFilter_ErrorUniqueConstraint(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilterCreationInput := types.SavedFilterCreationInput{
			Name:    "new_saved_filter_somatic_snv_occurrence",
			Type:    types.GERMLINE_SNV_OCCURRENCE,
			Queries: types.JsonArray[types.Sqon]{},
		}
		savedFilter, err1 := repo.CreateSavedFilter(savedFilterCreationInput, "1")
		assert.NoError(t, err1)
		assert.NotNil(t, savedFilter)

		savedFilterUpdateInput := types.SavedFilterUpdateInput{
			Name:     "saved_filter_snv_1", // existing name
			Queries:  types.JsonArray[types.Sqon]{},
			Favorite: utils.BoolPointer(true),
		}

		savedFilterUpdated, err2 := repo.UpdateSavedFilter(savedFilterUpdateInput, savedFilter.ID, "1")
		assert.Error(t, err2)
		assert.Nil(t, savedFilterUpdated)
	})
}

func Test_DeleteSavedFilter(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSavedFiltersRepository(db)
		savedFilterCreationInput := types.SavedFilterCreationInput{
			Name:    "new_saved_filter_somatic_snv_occurrence",
			Type:    types.GERMLINE_SNV_OCCURRENCE,
			Queries: types.JsonArray[types.Sqon]{},
		}
		savedFilter, err1 := repo.CreateSavedFilter(savedFilterCreationInput, "1")
		assert.NoError(t, err1)
		assert.NotNil(t, savedFilter)

		err2 := repo.DeleteSavedFilter(savedFilter.ID, "1")
		assert.NoError(t, err2)

		savedFilter, err3 := repo.GetSavedFilterByID(savedFilter.ID)
		assert.NoError(t, err3)
		assert.Nil(t, savedFilter)
	})
}
