package repository

import (
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var allCasesFields = sliceutils.Map(types.CasesFields, func(value types.Field, index int, slice []types.Field) string {
	return value.GetAlias()
})

var defaultCaseFieldsForTest = []types.Field{
	types.CaseIdField,
}

var CasesQueryConfigForTest = types.QueryConfig{
	AllFields:     types.CasesFields,
	DefaultFields: defaultCaseFieldsForTest,
	DefaultSort:   types.CasesDefaultSort,
	IdField:       types.CaseIdField,
}

func Test_SearchCasesNoFilters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, nil, nil, nil)
		cases, err := repo.SearchCases(query)
		assert.NoError(t, err)
		assert.Len(t, *cases, 10)
		assert.Equal(t, "germline", (*cases)[0].CaseAnalysisTypeCode)
	})
}

func Test_SearchCasesNoResult(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.RequestPriorityCodeField.GetAlias(),
				Value:     []interface{}{"stat", "urgent"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, err := repo.SearchCases(query)
		assert.NoError(t, err)
		assert.Len(t, *cases, 0)
	})
}

func Test_SearchCases(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseStatusCodeField.GetAlias(),
				Value:     []interface{}{"incomplete"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, err := repo.SearchCases(query)
		assert.NoError(t, err)
		assert.Len(t, *cases, 2)
	})
}

func Test_CountCasesNoFilters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		query, err := types.NewCountQueryFromSqon(nil, CasesQueryConfigForTest.AllFields)
		count, err := repo.CountCases(query)
		assert.NoError(t, err)
		assert.Equal(t, *count, int64(21))
	})
}

func Test_CountCasesNoResult(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.RequestPriorityCodeField.GetAlias(),
				Value:     []interface{}{"stat", "urgent"},
			},
		}
		query, err := types.NewCountQueryFromCriteria(searchCriteria, CasesQueryConfigForTest.AllFields)
		count, err := repo.CountCases(query)
		assert.NoError(t, err)
		assert.Equal(t, *count, int64(0))
	})
}

func Test_CountCases(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.RequestPriorityCodeField.GetAlias(),
				Value:     []interface{}{"routine"},
			},
		}
		query, err := types.NewCountQueryFromCriteria(searchCriteria, CasesQueryConfigForTest.AllFields)
		count, err := repo.CountCases(query)
		assert.NoError(t, err)
		assert.Equal(t, *count, int64(21))
	})
}
