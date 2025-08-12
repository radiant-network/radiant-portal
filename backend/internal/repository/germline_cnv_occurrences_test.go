package repository

import (
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var allCNVOccurrencesFields = sliceutils.Map(types.GermlineCNVOccurrencesFields, func(value types.Field, index int, slice []types.Field) string {
	return value.Name
})

var defaultCNVOccurrencesFieldsForTest = []types.Field{
	types.GermlineCNVIdField,
}

var CNVOccurrencesQueryConfigForTest = types.QueryConfig{
	AllFields:     types.GermlineCNVOccurrencesFields,
	DefaultFields: defaultCNVOccurrencesFieldsForTest,
	DefaultSort:   nil,
	IdField:       types.GermlineCNVIdField,
}

func Test_GermlineCNV_GetOccurrences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)
		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqID)
		}
	})
}

func Test_GermlineCNV_GetOccurrences_QualityFilter(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "quality", Value: []interface{}{0.9}}},
			},
			Op: "and",
		}

		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, sqon, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqID)
			assert.Equal(t, "CNV1_1", occurrences[0].Id)
		}
	})
}

func Test_GermlineCNV_GetOccurrences_PaginationAndSorting(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)

		sortedBody := []types.SortBody{
			{
				Field: "sm",
				Order: "asc",
			},
		}

		pagination := &types.Pagination{
			Limit:  1,
			Offset: 0,
		}

		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, nil, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqID)
			assert.Equal(t, "CNV2_1", occurrences[0].Id)
		}

		pagination = &types.Pagination{
			Limit:  1,
			Offset: 1,
		}

		query, err = types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, nil, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err = repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqID)
			assert.Equal(t, "CNV1_1", occurrences[0].Id)
		}
	})
}

func Test_GermlineCNV_CountOccurrences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)
		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, nil, nil, nil)
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(1, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), count)
	})
}

func Test_GermlineCNV_CountOccurrences_With_Filtering(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "quality", Value: []interface{}{0.9}}},
			},
			Op: "and",
		}

		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, sqon, nil, nil)
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(1, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), count)
	})
}
