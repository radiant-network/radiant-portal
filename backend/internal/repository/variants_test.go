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
		expanded, err := repo.GetVariantExpandedInterpretedCase(1000, 1, 1, "T002")
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
		expanded, err := repo.GetVariantExpandedInterpretedCase(1000, 1, 2, "T001")
		assert.NoError(t, err)
		assert.Equal(t, 1, (*expanded).PatientID)
		assert.Equal(t, types.JsonArray[string]{"PS1", "PM1", "PP2"}, (*expanded).ClassificationCriterias)
		assert.Equal(t, types.JsonArray[string]{"autosomal_dominant_de_novo", "x_linked_dominant_de_novo"}, (*expanded).Inheritances)
		assert.Equal(t, types.JsonArray[string]{}, (*expanded).PubmedIDs)
		assert.Equal(t, "BRAF", (*expanded).GeneSymbol)
	})
}

func Test_GetVariantUninterpretedCases_DefaultFields(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(5), *count)
		assert.Equal(t, 5, len(*uninterpretedCases))
		assert.Equal(t, 4, (*uninterpretedCases)[1].CaseId)

		case4 := (*uninterpretedCases)[1]

		assert.Equal(t, "proband", case4.RelationshipToProbandCode)
		assert.Equal(t, 10, case4.SeqId)
		assert.Equal(t, "S13233", case4.SubmitterSampleId)
		assert.Equal(t, "Affected", case4.AffectedStatusName)
		assert.Equal(t, 2, len(case4.Phenotypes))
		assert.Equal(t, true, *(case4.FilterIsPass))
		assert.Equal(t, "HOM", case4.Zygosity)
		assert.Equal(t, "autosomal_dominant", case4.TransmissionMode)
		assert.Equal(t, "CQGC", case4.DiagnosisLabCode)
		assert.Equal(t, "Quebec Clinical Genomic Center", case4.DiagnosisLabName)
		assert.Equal(t, "2021-09-12 13:08:00 +0000 UTC", case4.UpdatedOn.String())
	})
}

func Test_GetVariantUninterpretedCases_AdditionalFields(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{
			"primary_condition_id", "primary_condition_name", "analysis_catalog_code", "analysis_catalog_name",
			"info_qd", "genotype_quality", "ad_alt", "ad_total", "ad_ratio", "patient_id", "sex_name",
		}, []types.SearchCriterion{}, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(5), *count)
		assert.Equal(t, 5, len(*uninterpretedCases))
		assert.Equal(t, 4, (*uninterpretedCases)[1].CaseId)

		case4 := (*uninterpretedCases)[1]

		assert.Equal(t, "MONDO:0700092", case4.PrimaryConditionId)
		assert.Equal(t, "neurodevelopmental disorder", case4.PrimaryConditionName)
		assert.Equal(t, "WGA", case4.AnalysisCatalogCode)
		assert.Equal(t, "Whole Genome Analysis", case4.AnalysisCatalogName)
		assert.Equal(t, float32(0.4), case4.InfoQd)
		assert.Equal(t, 100, case4.GenotypeQuality)
		assert.Equal(t, 5, case4.AdAlt)
		assert.Equal(t, 10, case4.AdTotal)
		assert.Equal(t, float32(0.5), case4.AdRatio)
		assert.Equal(t, 10, case4.PatientId)
		assert.Equal(t, "Female", case4.SexName)
	})
}

func Test_GetVariantUninterpretedCases_NoCriteria_NoPagination_DefaultSorted(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(5), *count)
		assert.Equal(t, 5, len(*uninterpretedCases))
		assert.Equal(t, 3, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 4, (*uninterpretedCases)[1].CaseId)
		assert.Equal(t, 5, (*uninterpretedCases)[2].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[3].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[4].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_Add_phenotypes(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, nil, nil)
		uninterpretedCases, _, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, 5, len(*uninterpretedCases))

		assert.Equal(t, 0, len((*uninterpretedCases)[0].Phenotypes))

		assert.Equal(t, 2, len((*uninterpretedCases)[1].Phenotypes))
		assert.ElementsMatch(t,
			[]types.Term{
				{ID: "HP:0100622", Name: "Maternal seizure"},
				{ID: "HP:0001562", Name: "Oligohydramnios"},
			},
			(*uninterpretedCases)[1].Phenotypes,
		)

		assert.Equal(t, 0, len((*uninterpretedCases)[2].Phenotypes))
		assert.Equal(t, 0, len((*uninterpretedCases)[3].Phenotypes))

		assert.Equal(t, 12, len((*uninterpretedCases)[4].Phenotypes))
	})
}

func Test_GetVariantUninterpretedCases_NoCriteria_WithPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		pagination := types.Pagination{Limit: 2}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, &pagination, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(5), *count)
		assert.Equal(t, 2, len(*uninterpretedCases))
		assert.Equal(t, 3, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 4, (*uninterpretedCases)[1].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_NoCriteria_WithPagination_CustomSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		pagination := types.Pagination{Limit: 2}
		sort := types.SortBody{Field: types.FamilyRelationshipToProbandCodeField.Name, Order: "asc"}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, []types.SearchCriterion{}, &pagination, []types.SortBody{sort})
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(5), *count)
		assert.Equal(t, 2, len(*uninterpretedCases))
		assert.Equal(t, 5, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[1].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_WithCriteria_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.PatientSexCodeField.Name, Value: []interface{}{"female"}},
			{FieldName: types.AggregatedPhenotypeTermField.Alias, Value: []interface{}{"seizure"}, Operator: "contains"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), *count)
		assert.Equal(t, 2, len(*uninterpretedCases))
		assert.Equal(t, 4, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[1].CaseId)
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
		assert.Equal(t, int64(2), *count)
		assert.Equal(t, 2, len(*uninterpretedCases))
		assert.Equal(t, 4, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[1].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_WithDiagnosticLabCriteria_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.CaseDiagnosisLabCodeField.Alias, Value: []interface{}{"CQGC"}, Operator: "in"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(5), *count)
		assert.Equal(t, 5, len(*uninterpretedCases))
		assert.Equal(t, 3, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 4, (*uninterpretedCases)[1].CaseId)
		assert.Equal(t, 5, (*uninterpretedCases)[2].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[3].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[4].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_WithFilterCriteria_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.GermlineSNVFilterIsPassField.Alias, Value: []interface{}{true}, Operator: "in"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(4), *count)
		assert.Equal(t, 4, len(*uninterpretedCases))
		assert.Equal(t, 3, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, true, *((*uninterpretedCases)[0].FilterIsPass))
		assert.Equal(t, 4, (*uninterpretedCases)[1].CaseId)
		assert.Equal(t, true, *((*uninterpretedCases)[1].FilterIsPass))
		assert.Equal(t, 5, (*uninterpretedCases)[2].CaseId)
		assert.Equal(t, true, *((*uninterpretedCases)[2].FilterIsPass))
		assert.Equal(t, 7, (*uninterpretedCases)[3].CaseId)
		assert.Equal(t, 19, (*uninterpretedCases)[3].SeqId)
		assert.Equal(t, true, *((*uninterpretedCases)[3].FilterIsPass))
	})
}

func Test_GetVariantUninterpretedCases_WithZygosityCriteria_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.GermlineSNVZygosityField.Name, Value: []interface{}{"HOM"}, Operator: "in"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), *count)
		assert.Equal(t, 2, len(*uninterpretedCases))
		assert.Equal(t, 4, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 5, (*uninterpretedCases)[1].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_WithTransmissionModeCriteria_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.GermlineSNVTransmissionModeField.Name, Value: []interface{}{"autosomal_dominant"}, Operator: "in"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), *count)
		assert.Equal(t, 1, len(*uninterpretedCases))
		assert.Equal(t, 4, (*uninterpretedCases)[0].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_WithCaseAnalysisCriteria_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.AnalysisCatalogCodeField.Alias, Value: []interface{}{"IDGD"}, Operator: "in"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), *count)
		assert.Equal(t, 1, len(*uninterpretedCases))
		assert.Equal(t, 3, (*uninterpretedCases)[0].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_WithPatientSexCodeCriteria_NoPagination_DefaultSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.PatientSexCodeField.Name, Value: []interface{}{"female"}, Operator: "in"},
		}
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, []string{}, criteria, nil, nil)
		uninterpretedCases, count, err := repo.GetVariantUninterpretedCases(1000, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(3), *count)
		assert.Equal(t, 3, len(*uninterpretedCases))
		assert.Equal(t, 4, (*uninterpretedCases)[0].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[1].CaseId)
		assert.Equal(t, 7, (*uninterpretedCases)[2].CaseId)
	})
}

func Test_GetVariantUninterpretedCases_NoResult(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		criteria := []types.SearchCriterion{
			{FieldName: types.AggregatedPhenotypeTermField.Alias, Value: []interface{}{"not found"}, Operator: "contains"},
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
		assert.Equal(t, int64(3), counts.CountInterpreted)
		assert.Equal(t, int64(5), counts.CountUninterpreted)
	})
}

func Test_GetVariantCasesFilters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		filters, err := repo.GetVariantCasesFilters()
		assert.NoError(t, err)
		assert.Equal(t, 5, len((*filters).Classification))
		assert.Equal(t, 4, len((*filters).AnalysisCatalog))
		assert.Equal(t, 2, len((*filters).DiagnosisLab))
	})
}

func Test_GetVariantExternalFrequencies(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		externalFrequencies, err := repo.GetVariantExternalFrequencies(1000)
		assert.NoError(t, err)
		assert.Equal(t, "locus1", (*externalFrequencies).Locus)
		assert.Equal(t, 3, len((*externalFrequencies).ExternalFrequencies))

		topmed := (*externalFrequencies).ExternalFrequencies[0]
		gnomadV3 := (*externalFrequencies).ExternalFrequencies[1]
		thousandGenomes := (*externalFrequencies).ExternalFrequencies[2]

		assert.Equal(t, "topmed_bravo", topmed.Cohort)
		assert.Equal(t, 0.001, *(topmed.Af))
		assert.Equal(t, 1, *(topmed.Ac))
		assert.Equal(t, 1000, *(topmed.An))
		assert.Equal(t, 0, *(topmed.Hom))

		assert.Equal(t, "gnomad_genomes_v3", gnomadV3.Cohort)
		assert.Equal(t, 0.01, *(gnomadV3.Af))
		assert.Equal(t, 1, *(gnomadV3.Ac))
		assert.Equal(t, 100, *(gnomadV3.An))
		assert.Equal(t, 0, *(gnomadV3.Hom))

		assert.Equal(t, "1000_genomes", thousandGenomes.Cohort)
		assert.Equal(t, 0.0001, *(thousandGenomes.Af))
		assert.Equal(t, 1, *(thousandGenomes.Ac))
		assert.Equal(t, 10000, *(thousandGenomes.An))
		assert.Nil(t, thousandGenomes.Hom)
	})
}

func Test_GetVariantExternalFrequencies_PartialFound(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		externalFrequencies, err := repo.GetVariantExternalFrequencies(3000)
		assert.NoError(t, err)
		assert.Equal(t, "locus3", (*externalFrequencies).Locus)
		assert.Equal(t, 3, len((*externalFrequencies).ExternalFrequencies))

		topmed := (*externalFrequencies).ExternalFrequencies[0]
		gnomadV3 := (*externalFrequencies).ExternalFrequencies[1]
		thousandGenomes := (*externalFrequencies).ExternalFrequencies[2]

		assert.Equal(t, "topmed_bravo", topmed.Cohort)
		assert.Nil(t, topmed.Af)
		assert.Nil(t, topmed.Ac)
		assert.Nil(t, topmed.An)
		assert.Nil(t, topmed.Hom)

		assert.Equal(t, "gnomad_genomes_v3", gnomadV3.Cohort)
		assert.Equal(t, 0.03, *(gnomadV3.Af))
		assert.Equal(t, 2, *(gnomadV3.Ac))
		assert.Equal(t, 600, *(gnomadV3.An))
		assert.Equal(t, 1, *(gnomadV3.Hom))

		assert.Equal(t, "1000_genomes", thousandGenomes.Cohort)
		assert.Nil(t, thousandGenomes.Af)
		assert.Nil(t, thousandGenomes.Ac)
		assert.Nil(t, thousandGenomes.An)
		assert.Nil(t, thousandGenomes.Hom)
	})
}

func Test_GetVariantExternalFrequencies_VariantNotFound(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		externalFrequencies, err := repo.GetVariantExternalFrequencies(4000)
		assert.NoError(t, err)
		assert.Nil(t, externalFrequencies)
	})
}

func Test_GetVariantGlobalInternalFrequencies_VariantNotFound(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		globalFrequencies, err := repo.GetVariantGlobalInternalFrequencies(4000)
		assert.NoError(t, err)
		assert.Nil(t, globalFrequencies)
	})
}

func Test_GetVariantGlobalInternalFrequencies(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		globalFrequencies, err := repo.GetVariantGlobalInternalFrequencies(1000)
		assert.NoError(t, err)
		assert.NotNil(t, globalFrequencies)
		assert.Equal(t, 3, *(globalFrequencies).PcAll)
		assert.Equal(t, 0.99, *(globalFrequencies).PfAll)
		assert.Nil(t, globalFrequencies.PnAll)
		assert.Nil(t, globalFrequencies.HomAll)
		assert.Equal(t, 3, *(globalFrequencies).PcAffected)
		assert.Equal(t, 1.0, *(globalFrequencies).PfAffected)
		assert.Equal(t, 3, *(globalFrequencies).PnAffected)
		assert.Nil(t, globalFrequencies.HomAffected)
		assert.Equal(t, 0, *(globalFrequencies).PcNonAffected)
		assert.Equal(t, 0.0, *(globalFrequencies).PfNonAffected)
		assert.Equal(t, 0, *(globalFrequencies).PnNonAffected)
		assert.Nil(t, globalFrequencies.HomNonAffected)
	})
}

func Test_GetVariantInternalFrequenciesSplitBy_ByProject(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		splitRows, err := repo.GetVariantInternalFrequenciesSplitBy(1000, types.SPLIT_BY_PROJECT)
		assert.NoError(t, err)
		assert.NotNil(t, splitRows)
		assert.Len(t, *splitRows, 2)

		project1 := (*splitRows)[0]
		project2 := (*splitRows)[1]

		assert.Equal(t, "N1", project1.SplitValueCode)
		assert.Equal(t, "NeuroDev Phase I", project1.SplitValueName)
		assert.Equal(t, 5, *(project1.Frequencies.PcAll))
		assert.Equal(t, 5, *(project1.Frequencies.PnAll))
		assert.Equal(t, 1.0, *(project1.Frequencies.PfAll))
		assert.Equal(t, 2, *(project1.Frequencies.HomAll))
		assert.Equal(t, 4, *(project1.Frequencies.PcAffected))
		assert.Equal(t, 4, *(project1.Frequencies.PnAffected))
		assert.Equal(t, 1.0, *(project1.Frequencies.PfAffected))
		assert.Equal(t, 1, *(project1.Frequencies.HomAffected))
		assert.Equal(t, 1, *(project1.Frequencies.PcNonAffected))
		assert.Equal(t, 1, *(project1.Frequencies.PnNonAffected))
		assert.Equal(t, 1.0, *(project1.Frequencies.PfNonAffected))
		assert.Equal(t, 1, *(project1.Frequencies.HomNonAffected))

		assert.Equal(t, "N2", project2.SplitValueCode)
		assert.Equal(t, "NeuroDev Phase II", project2.SplitValueName)
		assert.Equal(t, 1, *(project2.Frequencies.PcAll))
		assert.Equal(t, 2, *(project2.Frequencies.PnAll))
		assert.Equal(t, 0.5, *(project2.Frequencies.PfAll))
		assert.Equal(t, 0, *(project2.Frequencies.HomAll))
		assert.Equal(t, 1, *(project2.Frequencies.PcAffected))
		assert.Equal(t, 1, *(project2.Frequencies.PnAffected))
		assert.Equal(t, 1.0, *(project2.Frequencies.PfAffected))
		assert.Equal(t, 0, *(project2.Frequencies.HomAffected))
		assert.Equal(t, 0, *(project2.Frequencies.PcNonAffected))
		assert.Equal(t, 1, *(project2.Frequencies.PnNonAffected))
		assert.Equal(t, 0.0, *(project2.Frequencies.PfNonAffected))
		assert.Equal(t, 0, *(project2.Frequencies.HomNonAffected))
	})
}

func Test_GetVariantInternalFrequenciesSplitBy_ByPrimaryCondition(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		splitRows, err := repo.GetVariantInternalFrequenciesSplitBy(1000, types.SPLIT_BY_PRIMARY_CONDITION)
		assert.NoError(t, err)
		assert.NotNil(t, splitRows)
		assert.Len(t, *splitRows, 2)

		mondo0000003 := (*splitRows)[0]
		mondo0700092 := (*splitRows)[1]

		assert.Equal(t, "MONDO:0000003", mondo0000003.SplitValueCode)
		assert.Equal(t, "colorblindness, partial", mondo0000003.SplitValueName)
		assert.Equal(t, 1, *(mondo0000003.Frequencies.PcAll))
		assert.Equal(t, 1, *(mondo0000003.Frequencies.PnAll))
		assert.Equal(t, 1.0, *(mondo0000003.Frequencies.PfAll))
		assert.Equal(t, 0, *(mondo0000003.Frequencies.HomAll))
		assert.Equal(t, 1, *(mondo0000003.Frequencies.PcAffected))
		assert.Equal(t, 1, *(mondo0000003.Frequencies.PnAffected))
		assert.Equal(t, 1.0, *(mondo0000003.Frequencies.PfAffected))
		assert.Equal(t, 0, *(mondo0000003.Frequencies.HomAffected))
		assert.Nil(t, mondo0000003.Frequencies.PcNonAffected)
		assert.Nil(t, mondo0000003.Frequencies.PnNonAffected)
		assert.Nil(t, mondo0000003.Frequencies.PfNonAffected)
		assert.Nil(t, mondo0000003.Frequencies.HomNonAffected)

		assert.Equal(t, "MONDO:0700092", mondo0700092.SplitValueCode)
		assert.Equal(t, "neurodevelopmental disorder", mondo0700092.SplitValueName)
		assert.Equal(t, 5, *(mondo0700092.Frequencies.PcAll))
		assert.Equal(t, 6, *(mondo0700092.Frequencies.PnAll))
		assert.Equal(t, 0.8333333333333334, *(mondo0700092.Frequencies.PfAll))
		assert.Equal(t, 2, *(mondo0700092.Frequencies.HomAll))
		assert.Equal(t, 4, *(mondo0700092.Frequencies.PcAffected))
		assert.Equal(t, 4, *(mondo0700092.Frequencies.PnAffected))
		assert.Equal(t, 1.0, *(mondo0700092.Frequencies.PfAffected))
		assert.Equal(t, 1, *(mondo0700092.Frequencies.HomAffected))
		assert.Equal(t, 1, *(mondo0700092.Frequencies.PcNonAffected))
		assert.Equal(t, 2, *(mondo0700092.Frequencies.PnNonAffected))
		assert.Equal(t, 0.5, *(mondo0700092.Frequencies.PfNonAffected))
		assert.Equal(t, 1, *(mondo0700092.Frequencies.HomNonAffected))
	})
}

func Test_GetVariantInternalFrequenciesSplitBy_ByAnalysis(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		splitRows, err := repo.GetVariantInternalFrequenciesSplitBy(1000, types.SPLIT_BY_ANALYSIS)
		assert.NoError(t, err)
		assert.NotNil(t, splitRows)
		assert.Len(t, *splitRows, 2)

		IDGD := (*splitRows)[0]
		WGA := (*splitRows)[1]

		assert.Equal(t, "IDGD", IDGD.SplitValueCode)
		assert.Equal(t, "Intellectual Deficiency and Global Developmental Delay", IDGD.SplitValueName)
		assert.Equal(t, 1, *(IDGD.Frequencies.PcAll))
		assert.Equal(t, 1, *(IDGD.Frequencies.PnAll))
		assert.Equal(t, 1.0, *(IDGD.Frequencies.PfAll))
		assert.Equal(t, 0, *(IDGD.Frequencies.HomAll))
		assert.Equal(t, 1, *(IDGD.Frequencies.PcAffected))
		assert.Equal(t, 1, *(IDGD.Frequencies.PnAffected))
		assert.Equal(t, 1.0, *(IDGD.Frequencies.PfAffected))
		assert.Equal(t, 0, *(IDGD.Frequencies.HomAffected))
		assert.Nil(t, IDGD.Frequencies.PcNonAffected)
		assert.Nil(t, IDGD.Frequencies.PnNonAffected)
		assert.Nil(t, IDGD.Frequencies.PfNonAffected)
		assert.Nil(t, IDGD.Frequencies.HomNonAffected)

		assert.Equal(t, "WGA", WGA.SplitValueCode)
		assert.Equal(t, "Whole Genome Analysis", WGA.SplitValueName)
		assert.Equal(t, 5, *(WGA.Frequencies.PcAll))
		assert.Equal(t, 6, *(WGA.Frequencies.PnAll))
		assert.Equal(t, 0.8333333333333334, *(WGA.Frequencies.PfAll))
		assert.Equal(t, 2, *(WGA.Frequencies.HomAll))
		assert.Equal(t, 4, *(WGA.Frequencies.PcAffected))
		assert.Equal(t, 4, *(WGA.Frequencies.PnAffected))
		assert.Equal(t, 1.0, *(WGA.Frequencies.PfAffected))
		assert.Equal(t, 1, *(WGA.Frequencies.HomAffected))
		assert.Equal(t, 1, *(WGA.Frequencies.PcNonAffected))
		assert.Equal(t, 2, *(WGA.Frequencies.PnNonAffected))
		assert.Equal(t, 0.5, *(WGA.Frequencies.PfNonAffected))
		assert.Equal(t, 1, *(WGA.Frequencies.HomNonAffected))
	})
}

func Test_GetVariantInternalFrequenciesSplitBy_IncorrectSplit(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		splitRows, err := repo.GetVariantInternalFrequenciesSplitBy(1000, "incorrect")
		assert.Nil(t, splitRows)
		assert.Error(t, err)
	})
}
