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
		assert.Equal(t, "MONDO:0700092", (*cases)[0].PrimaryConditionID)
		assert.Equal(t, "neurodevelopmental disorder", (*cases)[0].PrimaryConditionName)
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

func Test_SearchById(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		autocompleteResult, err := repo.SearchById("1", 5)
		assert.NoError(t, err)
		assert.Equal(t, len(*autocompleteResult), 5)
		assert.Equal(t, (*autocompleteResult)[0].Value, "1")
		assert.Equal(t, (*autocompleteResult)[1].Value, "10")
		assert.Equal(t, (*autocompleteResult)[2].Value, "10")
		assert.Equal(t, (*autocompleteResult)[3].Value, "11")
		assert.Equal(t, (*autocompleteResult)[4].Value, "12")
	})
}

func Test_GetCasesFilters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.RequestPriorityCodeField.GetAlias(),
				Value:     []interface{}{"routine"},
			},
		}
		query, err := types.NewAggregationQueryFromCriteria(searchCriteria, CasesQueryConfigForTest.AllFields)
		filters, err := repo.GetCasesFilters(query)
		assert.NoError(t, err)
		assert.Equal(t, len((*filters).Status), 8)
		assert.Equal(t, len((*filters).Priority), 4)
		assert.Equal(t, len((*filters).CaseAnalysis), 4)
		assert.Equal(t, len((*filters).Project), 2)
		assert.Equal(t, len((*filters).PerformerLab), 6)
		assert.Equal(t, len((*filters).RequestedBy), 6)
	})
}
