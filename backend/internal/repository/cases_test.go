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
		cases, count, err := repo.SearchCases(query)
		assert.NoError(t, err)
		assert.Len(t, *cases, 10)
		assert.Equal(t, int64(21), *count)
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
		cases, count, err := repo.SearchCases(query)
		assert.NoError(t, err)
		assert.Equal(t, int64(0), *count)
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
		cases, count, err := repo.SearchCases(query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), *count)
		assert.Len(t, *cases, 2)
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

func Test_SearchById_CaseInsensitive(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		autocompleteResultLower, errLower := repo.SearchById("mrn", 5)
		autocompleteResultUpper, errUpper := repo.SearchById("MRN", 5)
		assert.NoError(t, errLower)
		assert.NoError(t, errUpper)
		assert.Equal(t, len(*autocompleteResultLower), len(*autocompleteResultUpper))
		assert.Equal(t, (*autocompleteResultLower)[0].Value, (*autocompleteResultUpper)[0].Value)
		assert.Equal(t, (*autocompleteResultLower)[1].Value, (*autocompleteResultUpper)[1].Value)
		assert.Equal(t, (*autocompleteResultLower)[2].Value, (*autocompleteResultUpper)[2].Value)
		assert.Equal(t, (*autocompleteResultLower)[3].Value, (*autocompleteResultUpper)[3].Value)
		assert.Equal(t, (*autocompleteResultLower)[4].Value, (*autocompleteResultUpper)[4].Value)
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

func Test_GetCaseEntity(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		caseEntity, err := repo.GetCaseEntity(1)
		assert.NoError(t, err)
		assert.Equal(t, 1, (*caseEntity).CaseID)
		assert.Equal(t, "WGA", (*caseEntity).CaseAnalysisCode)
		assert.Equal(t, "Whole Genome Analysis", (*caseEntity).CaseAnalysisName)
		assert.Equal(t, "germline_family", (*caseEntity).CaseType)
		assert.Equal(t, 3, len((*caseEntity).SequencingExperiments))

		// Proband first
		assert.Equal(t, "", (*caseEntity).SequencingExperiments[0].RelationshipToProband)
		assert.Equal(t, 1, (*caseEntity).SequencingExperiments[0].SeqID)
		assert.Equal(t, 3, (*caseEntity).SequencingExperiments[0].PatientID)

		// Father then Mother then Siblings
		assert.Equal(t, "father", (*caseEntity).SequencingExperiments[1].RelationshipToProband)
		assert.Equal(t, 3, (*caseEntity).SequencingExperiments[1].SeqID)
		assert.Equal(t, 2, (*caseEntity).SequencingExperiments[1].PatientID)

		assert.Equal(t, "mother", (*caseEntity).SequencingExperiments[2].RelationshipToProband)
		assert.Equal(t, 2, (*caseEntity).SequencingExperiments[2].SeqID)
		assert.Equal(t, 1, (*caseEntity).SequencingExperiments[2].PatientID)
	})
}
