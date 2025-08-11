package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetVariantHeader(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		variantHeader, err := repo.GetVariantHeader(1000)
		assert.NoError(t, err)
		assert.Equal(t, "hgvsg1", variantHeader.Hgvsg)
		assert.Equal(t, "GRCh38", variantHeader.AssemblyVersion)
		assert.Equal(t, 1, len(variantHeader.Source))
	})
}

func Test_GetVariantOverview(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		variantOverview, err := repo.GetVariantOverview(1000)
		assert.NoError(t, err)
		assert.Equal(t, "locus1", variantOverview.Locus)
		assert.Equal(t, float32(0.1), variantOverview.SiftScore)
		assert.Equal(t, "T", variantOverview.SiftPred)
		assert.Equal(t, 2, len(variantOverview.OmimConditions))
		assert.False(t, variantOverview.IsManePlus)
		assert.Len(t, variantOverview.InterpretationClassificationCounts, 3)
		assert.Equal(t, 1, variantOverview.InterpretationClassificationCounts["likelyPathogenic"])
		assert.Equal(t, 1, variantOverview.InterpretationClassificationCounts["pathogenic"])
		assert.Equal(t, 1, variantOverview.InterpretationClassificationCounts["benign"])
	})
}

func Test_GetVariantConsequences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		variantConsequences, err := repo.GetVariantConsequences(1000)
		assert.NoError(t, err)
		assert.Equal(t, 2, len(*variantConsequences))
		assert.Equal(t, true, (*variantConsequences)[0].IsPicked)
		assert.Equal(t, false, (*variantConsequences)[1].IsPicked)
	})
}

func Test_GetVariantInterpretedCases_NoCriteria_NoPagination_DefaultSorted(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		query, err := types.NewListQueryFromCriteria(types.VariantInterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, nil, nil)
		interpretedCases, count, err := repo.GetVariantInterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(3), *count)
		assert.Equal(t, 3, len(*interpretedCases))
		assert.Equal(t, "LA6675-8", (*interpretedCases)[0].ClassificationCode)
		assert.Equal(t, "benign", (*interpretedCases)[0].Classification)
		assert.Equal(t, "LA26332-9", (*interpretedCases)[1].ClassificationCode)
		assert.Equal(t, "likelyPathogenic", (*interpretedCases)[1].Classification)
		assert.Equal(t, "LA6668-3", (*interpretedCases)[2].ClassificationCode)
		assert.Equal(t, "pathogenic", (*interpretedCases)[2].Classification)
	})
}

func Test_GetVariantInterpretedCases_NoCriteria_WithPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		pagination := types.Pagination{Limit: 2}
		query, err := types.NewListQueryFromCriteria(types.VariantInterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, &pagination, nil)
		interpretedCases, count, err := repo.GetVariantInterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(3), *count)
		assert.Equal(t, 2, len(*interpretedCases))
		assert.Equal(t, "LA6675-8", (*interpretedCases)[0].ClassificationCode)
		assert.Equal(t, "LA26332-9", (*interpretedCases)[1].ClassificationCode)
	})
}

func Test_GetVariantInterpretedCases_NoCriteria_WithPagination_CustomSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		pagination := types.Pagination{Limit: 2}
		sort := types.SortBody{Field: types.ConditionIdField.Alias, Order: "asc"}
		query, err := types.NewListQueryFromCriteria(types.VariantInterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, &pagination, []types.SortBody{sort})
		interpretedCases, count, err := repo.GetVariantInterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(3), *count)
		assert.Equal(t, 2, len(*interpretedCases))
		assert.Equal(t, "MONDO:0000001", (*interpretedCases)[0].ConditionId)
		assert.Equal(t, "MONDO:0000001", (*interpretedCases)[1].ConditionId)
	})
}

func Test_GetVariantInterpretedCases_WithCriteria_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.ConditionTermField.Alias, Value: []interface{}{"incompatibility"}, Operator: "contains"},
			{FieldName: types.GermlineInterpretationClassificationField.Name, Value: []interface{}{"LA26332-9"}},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantInterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		interpretedCases, count, err := repo.GetVariantInterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), *count)
		assert.Equal(t, 1, len(*interpretedCases))
		assert.Equal(t, "MONDO:0000001", (*interpretedCases)[0].ConditionId)
		assert.Equal(t, "LA26332-9", (*interpretedCases)[0].ClassificationCode)
	})
}

func Test_GetVariantInterpretedCases_NoResult(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.ConditionTermField.Alias, Value: []interface{}{"not found"}, Operator: "contains"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantInterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		interpretedCases, count, err := repo.GetVariantInterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(0), *count)
		assert.Equal(t, 0, len(*interpretedCases))
	})
}

func Test_GetVariantExpandedInterpretedCase_Proband(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		expanded, err := repo.GetVariantExpandedInterpretedCase(1000, 1, "T002")
		assert.NoError(t, err)
		assert.Equal(t, 3, (*expanded).PatientID)
		assert.Equal(t, types.JsonArray[string]{"PM1", "PM2"}, (*expanded).ClassificationCriterias)
		assert.Equal(t, types.JsonArray[string]{"autosomal_dominant_de_novo"}, (*expanded).Inheritances)
		assert.Equal(t, types.JsonArray[string]{}, (*expanded).PubmedIDs)
		assert.Equal(t, "BRAF", (*expanded).GeneSymbol)
	})
}
func Test_GetVariantExpandedInterpretedCase_OtherMember(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		expanded, err := repo.GetVariantExpandedInterpretedCase(1000, 2, "T001")
		assert.NoError(t, err)
		assert.Equal(t, 1, (*expanded).PatientID)
		assert.Equal(t, types.JsonArray[string]{"PS1", "PM1", "PP2"}, (*expanded).ClassificationCriterias)
		assert.Equal(t, types.JsonArray[string]{"autosomal_dominant_de_novo", "x_linked_dominant_de_novo"}, (*expanded).Inheritances)
		assert.Equal(t, types.JsonArray[string]{}, (*expanded).PubmedIDs)
		assert.Equal(t, "BRAF", (*expanded).GeneSymbol)
	})
}
func Test_GetVariantUninterpretedCases_NoCriteria_NoPagination_DefaultSorted(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(4), *count)
		assert.Equal(t, 4, len(*uninterpretedCases))
		assert.Equal(t, 3, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 4, (*uninterpretedCases)[1].CaseId)
		assert.Equal(t, 5, (*uninterpretedCases)[2].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[3].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_Add_phenotypes(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, nil, nil)
		uninterpretedCases, _, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, 4, len(*uninterpretedCases))

		assert.Equal(t, 0, len((*uninterpretedCases)[0].Phenotypes))

		assert.Equal(t, 2, len((*uninterpretedCases)[1].Phenotypes))
		assert.Equal(t, "HP:0100622", (*uninterpretedCases)[1].Phenotypes[0].ID)
		assert.Equal(t, "Maternal seizure", (*uninterpretedCases)[1].Phenotypes[0].Name)
		assert.Equal(t, "HP:0001562", (*uninterpretedCases)[1].Phenotypes[1].ID)
		assert.Equal(t, "Oligohydramnios", (*uninterpretedCases)[1].Phenotypes[1].Name)

		assert.Equal(t, 2, len((*uninterpretedCases)[2].Phenotypes))
		assert.Equal(t, "HP:0009800", (*uninterpretedCases)[2].Phenotypes[0].ID)
		assert.Equal(t, "Maternal diabetes", (*uninterpretedCases)[2].Phenotypes[0].Name)
		assert.Equal(t, "HP:0100622", (*uninterpretedCases)[2].Phenotypes[1].ID)
		assert.Equal(t, "Maternal seizure", (*uninterpretedCases)[2].Phenotypes[1].Name)

		assert.Equal(t, 12, len((*uninterpretedCases)[3].Phenotypes))
	})
}

func Test_GetVariantUninterpretedCases_NoCriteria_WithPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		pagination := types.Pagination{Limit: 2}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, &pagination, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(4), *count)
		assert.Equal(t, 2, len(*uninterpretedCases))
		assert.Equal(t, 3, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 4, (*uninterpretedCases)[1].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_NoCriteria_WithPagination_CustomSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		pagination := types.Pagination{Limit: 2}
		sort := types.SortBody{Field: types.CaseStatusCodeField.Name, Order: "asc"}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, &pagination, []types.SortBody{sort})
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(4), *count)
		assert.Equal(t, 2, len(*uninterpretedCases))
		assert.Equal(t, 5, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 3, (*uninterpretedCases)[1].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_WithCriteria_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.CaseStatusCodeField.Name, Value: []interface{}{"incomplete"}},
			{FieldName: types.ConditionTermField.Alias, Value: []interface{}{"disorder"}, Operator: "contains"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), *count)
		assert.Equal(t, 2, len(*uninterpretedCases))
		assert.Equal(t, 3, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 4, (*uninterpretedCases)[1].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_WithPhenotypeCriteria_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.AggregatedPhenotypeTermField.Alias, Value: []interface{}{"seizure"}, Operator: "contains"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(3), *count)
		assert.Equal(t, 3, len(*uninterpretedCases))
		assert.Equal(t, 4, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 5, (*uninterpretedCases)[1].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[2].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_WithExomiserACMGClassification_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "exomiser", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.AggregatedPhenotypeTermField.Alias, Value: []interface{}{"seizure"}, Operator: "contains"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(3), *count)
		assert.Equal(t, 3, len(*uninterpretedCases))
		for _, caseItem := range *uninterpretedCases {
			assert.Equal(t, "Pathogenic", caseItem.ExomiserACMGClassification)
			assert.Equal(t, types.JsonArray[string]{"PS1", "PVS2"}, caseItem.ExomiserACMGEvidence)
		}
	})
}

func Test_GetVariantUninterpretedCases_NoResult(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.ConditionTermField.Alias, Value: []interface{}{"not found"}, Operator: "contains"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(2000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(0), *count)
		assert.Equal(t, 0, len(*uninterpretedCases))
	})
}

func Test_GetVariantCasesCount(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		counts, err := repo.GetVariantCasesCount(1000)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), counts.CountInterpreted)
		assert.Equal(t, int64(4), counts.CountUninterpreted)
	})
}

func Test_GetVariantCasesFilters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		filters, err := repo.GetVariantCasesFilters()
		assert.NoError(t, err)
		assert.Equal(t, 5, len((*filters).Classification))
		assert.Equal(t, 4, len((*filters).CaseAnalysis))
		assert.Equal(t, 6, len((*filters).PerformerLab))
	})
}
