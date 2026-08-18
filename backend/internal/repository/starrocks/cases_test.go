package starrocks

import (
	"slices"
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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

func Test_GetCaseType(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		caseType, err := repo.GetCaseType(t.Context(), 70)
		assert.NoError(t, err)
		assert.Equal(t, "germline", caseType)

		caseType, err = repo.GetCaseType(t.Context(), 71)
		assert.NoError(t, err)
		assert.Equal(t, "somatic", caseType)
	})
}

func Test_SearchCasesNoFilters(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, nil, nil, nil)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *cases, 10)
		assert.Equal(t, int64(26), *count)
		assert.Equal(t, "somatic", (*cases)[0].CaseTypeCode)
		assert.Equal(t, "somatic", (*cases)[0].CaseType)
		assert.Equal(t, true, (*cases)[0].HasVariants)

		assert.Equal(t, "germline", (*cases)[1].CaseTypeCode)
		assert.Equal(t, "MONDO:0700092", (*cases)[1].PrimaryConditionID)
		assert.Equal(t, "neurodevelopmental disorder", (*cases)[1].PrimaryConditionName)
		assert.Equal(t, "germline_family", (*cases)[1].CaseType)
		assert.Equal(t, true, (*cases)[1].HasVariants)
		assert.Equal(t, "Centre hospitalier universitaire Sainte-Justine", (*cases)[1].OrganizationName)
		assert.Equal(t, "CHUSJ", (*cases)[1].OrganizationCode)
		assert.Equal(t, "LAM7303233380", (*cases)[1].ProbandJhn)
		assert.Equal(t, "alive", (*cases)[1].ProbandLifeStatusCode)
		assert.Equal(t, "Marie", (*cases)[1].ProbandFirstName)
		assert.Equal(t, "Lambert", (*cases)[1].ProbandLastName)
		assert.Equal(t, "EPILEP", (*cases)[1].PanelCode)
		assert.Equal(t, "Epilepsy", (*cases)[1].PanelName)
		assert.Equal(t, "postnatal", (*cases)[1].CaseCategoryCode)
		assert.Equal(t, "unsolved", (*cases)[1].ResolutionStatusCode)
	})
}

func Test_SearchCasesNoResult(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CasePriorityCodeField.GetAlias(),
				Value:     []interface{}{"urgent"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(0), *count)
		assert.Len(t, *cases, 0)
	})
}

func Test_SearchCases(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseStatusCodeField.GetAlias(),
				Value:     []interface{}{"incomplete"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), *count)
		assert.Len(t, *cases, 2)
	})
}

func Test_SearchCases_OnProbandOrganizationID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SubmitterPatientIdField.GetAlias(),
				Value:     []interface{}{"MRN-283775"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), *count)
		assert.Len(t, *cases, 2)
		assert.Equal(t, 3, (*cases)[0].ProbandID)
		assert.Equal(t, "MRN-283775", (*cases)[0].SubmitterProbandId)
	})
}

func Test_SearchCases_OnPatientMRN(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SubmitterPatientIdField.GetAlias(),
				Value:     []interface{}{"MRN-283773"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), *count)
		assert.Len(t, *cases, 2)
		assert.Equal(t, 3, (*cases)[0].ProbandID)
		assert.Equal(t, "MRN-283775", (*cases)[0].SubmitterProbandId)
	})
}

func Test_SearchCases_OnProbandID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.PatientIdField.GetAlias(),
				Value:     []interface{}{"3"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), *count)
		assert.Len(t, *cases, 2)
		assert.Equal(t, 3, (*cases)[0].ProbandID)
		assert.Equal(t, "MRN-283775", (*cases)[0].SubmitterProbandId)
	})
}

func Test_SearchCases_OnPatientID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.PatientIdField.GetAlias(),
				Value:     []interface{}{"1"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), *count)
		assert.Len(t, *cases, 2)
		assert.Equal(t, 3, (*cases)[0].ProbandID)
		assert.Equal(t, "MRN-283775", (*cases)[0].SubmitterProbandId)
	})
}

func Test_SearchCases_OnSequencingExperimentID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseSequencingExperimentIdField.GetAlias(),
				Value:     []interface{}{"1"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), *count)
		assert.Len(t, *cases, 1)
		assert.Equal(t, 1, (*cases)[0].CaseID)
	})
}

func Test_SearchCases_OnResolutionStatusCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseResolutionStatusCodeField.GetAlias(),
				Value:     []interface{}{"unsolved"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(26), *count)

		searchCriteria = []types.SearchCriterion{
			{
				FieldName: types.CaseResolutionStatusCodeField.GetAlias(),
				Value:     []interface{}{"solved"},
			},
		}
		query, err = types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err = repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(0), *count)
	})
}

func Test_SearchCases_OnPrimaryConditionId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CasePrimaryConditionIdField.GetAlias(),
				Value:     []interface{}{"MONDO:0700092"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(24), *count)

		searchCriteria = []types.SearchCriterion{
			{
				FieldName: types.CasePrimaryConditionIdField.GetAlias(),
				Value:     []interface{}{"MONDO:0700099"},
			},
		}
		query, err = types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err = repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(0), *count)
	})
}

func Test_SearchCases_OnPanelCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.PanelCodeField.GetAlias(),
				Value:     []interface{}{"EPILEP"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(20), *count)
	})
}

func Test_SearchCases_OnProbandLifeStatusCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.ProbandLifeStatusCodeField.GetAlias(),
				Value:     []interface{}{"alive"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(26), *count)

		searchCriteria = []types.SearchCriterion{
			{
				FieldName: types.ProbandLifeStatusCodeField.GetAlias(),
				Value:     []interface{}{"deceased"},
			},
		}
		query, err = types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err = repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(0), *count)
	})
}

func Test_SearchCases_OnCaseCategoryCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseCategoryCodeField.GetAlias(),
				Value:     []interface{}{"postnatal"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(23), *count)

		searchCriteria = []types.SearchCriterion{
			{
				FieldName: types.CaseCategoryCodeField.GetAlias(),
				Value:     []interface{}{"prenatal"},
			},
		}
		query, err = types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err = repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(3), *count)
	})
}

func Test_SearchCases_OnCaseTypeCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseTypeCodeField.GetAlias(),
				Value:     []interface{}{"germline"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(25), *count)

		searchCriteria = []types.SearchCriterion{
			{
				FieldName: types.CaseTypeCodeField.GetAlias(),
				Value:     []interface{}{"somatic"},
			},
		}
		query, err = types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err = repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), *count)
	})
}

func Test_SearchCases_OnSubmitterCaseId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseSubmitterCaseIdField.GetAlias(),
				Value:     []interface{}{"1:8"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		assert.NoError(t, err)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), *count)
		assert.Len(t, *cases, 1)
		assert.Equal(t, 8, (*cases)[0].CaseID)
		assert.Equal(t, "submitted", (*cases)[0].StatusCode)
	})
}

func Test_SearchCases_OnSubmitterCaseId_NoResult(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseSubmitterCaseIdField.GetAlias(),
				Value:     []interface{}{"does-not-exist"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		assert.NoError(t, err)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(0), *count)
	})
}

func Test_SearchCases_PrenatalSoloCase_CountsMotherAndFetusAsTwoMembers(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseSubmitterCaseIdField.GetAlias(),
				Value:     []interface{}{"1:72"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		assert.NoError(t, err)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		require.Equal(t, int64(1), *count)
		require.Len(t, *cases, 1)
		// Case 72 is a solo prenatal case: one family row for the mother (proband) and one for
		// her fetus — two distinct members, so it must get the "_family" suffix like any other
		// case with more than one member, not be misclassified as a singleton.
		assert.Equal(t, "germline_family", (*cases)[0].CaseType)
	})
}

func Test_Cases_SearchById(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		autocompleteResult, err := repo.SearchById(t.Context(), "1", 5)
		assert.NoError(t, err)
		assert.Equal(t, len(*autocompleteResult), 5)
		assert.Equal(t, "1", (*autocompleteResult)[0].Value)
		assert.Equal(t, "1", (*autocompleteResult)[1].Value)
		assert.Equal(t, "1", (*autocompleteResult)[2].Value)
		assert.Equal(t, "10", (*autocompleteResult)[3].Value)
		assert.Equal(t, "10", (*autocompleteResult)[4].Value)
	})
}

func Test_SearchById_CaseInsensitive(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		autocompleteResultLower, errLower := repo.SearchById(t.Context(), "mrn", 5)
		autocompleteResultUpper, errUpper := repo.SearchById(t.Context(), "MRN", 5)
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
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		filters, err := repo.GetCasesFilters(t.Context())
		assert.NoError(t, err)
		assert.Equal(t, len((*filters).Status), 7)
		assert.Equal(t, len((*filters).Priority), 4)
		assert.Equal(t, len((*filters).AnalysisCatalog), 4)
		assert.Equal(t, len((*filters).Project), 2)
		assert.Equal(t, len((*filters).DiagnosisLab), 2)
		assert.Equal(t, len((*filters).OrderingOrganization), 4)
		assert.Equal(t, 3, len((*filters).ResolutionStatus))
		assert.Equal(t, 3, len((*filters).LifeStatus))
		assert.Equal(t, 2, len((*filters).CaseCategory))
		assert.Equal(t, 2, len((*filters).Panel))
		assert.Equal(t, 2, len((*filters).CaseType))
	})
}

func Test_GetCaseEntity(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		caseEntity, err := repo.GetCaseEntity(t.Context(), 1)
		assert.NoError(t, err)
		assert.Equal(t, 1, (*caseEntity).CaseID)
		assert.Equal(t, "germline_family", (*caseEntity).CaseType)
		assert.Len(t, (*caseEntity).SequencingExperiments, 3)
		assert.Len(t, (*caseEntity).Members, 3)
		assert.Len(t, (*caseEntity).Tasks, 8)
	})
}

func Test_RetrieveCaseLevelData(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		caseEntity, err := repo.retrieveCaseLevelData(t.Context(), 1)
		assert.NoError(t, err)
		assert.Equal(t, 1, (*caseEntity).CaseID)
		assert.Equal(t, 3, (*caseEntity).ProbandID)
		assert.Equal(t, "WGA", (*caseEntity).AnalysisCatalogCode)
		assert.Equal(t, "Whole Genome Analysis", (*caseEntity).AnalysisCatalogName)
		assert.Equal(t, "germline", (*caseEntity).CaseTypeCode)
		assert.Equal(t, "postnatal", (*caseEntity).CaseCategoryCode)
		assert.Equal(t, "Postnatal", (*caseEntity).CaseCategoryName)
		assert.Equal(t, "2021-09-12 13:08:00 +0000 UTC", (*caseEntity).CreatedOn.String())
		assert.Equal(t, "2021-09-12 13:08:00 +0000 UTC", (*caseEntity).UpdatedOn.String())
		assert.Equal(t, "Felix Laflamme", (*caseEntity).Prescriber)
		assert.Equal(t, "CHUSJ", (*caseEntity).OrderingOrganizationCode)
		assert.Equal(t, "Centre hospitalier universitaire Sainte-Justine", (*caseEntity).OrderingOrganizationName)
		assert.Equal(t, "CQGC", (*caseEntity).DiagnosisLabCode)
		assert.Equal(t, "Quebec Clinical Genomic Center", (*caseEntity).DiagnosisLabName)
		assert.Equal(t, "routine", (*caseEntity).PriorityCode)
		assert.Equal(t, "in_progress", (*caseEntity).StatusCode)
		assert.Equal(t, "MONDO:0700092", (*caseEntity).PrimaryConditionID)
		assert.Equal(t, "neurodevelopmental disorder", (*caseEntity).PrimaryConditionName)
		assert.Equal(t, "Administrative comment", (*caseEntity).Note)
		assert.Equal(t, "N1", (*caseEntity).ProjectCode)
		assert.Equal(t, "NeuroDev Phase I", (*caseEntity).ProjectName)
		assert.Equal(t, "EPILEP", (*caseEntity).PanelCode)
		assert.Equal(t, "Epilepsy", (*caseEntity).PanelName)
	})
}

func Test_RetrieveCaseSequencingExperiments_Germline(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		sequencingExperiments, err := repo.retrieveCaseSequencingExperiments(t.Context(), 1)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*sequencingExperiments))

		// Proband first
		assert.Equal(t, "proband", (*sequencingExperiments)[0].RelationshipToProband)
		assert.Equal(t, 1, (*sequencingExperiments)[0].SeqID)
		assert.Equal(t, 3, (*sequencingExperiments)[0].PatientID)
		assert.Equal(t, "affected", (*sequencingExperiments)[0].AffectedStatusCode)
		assert.Equal(t, 1, (*sequencingExperiments)[0].SampleID)
		assert.Equal(t, "S13224", (*sequencingExperiments)[0].SampleSubmitterID)
		assert.Equal(t, "dna", (*sequencingExperiments)[0].SampleTypeCode)
		assert.Equal(t, "normal", (*sequencingExperiments)[0].HistologyCode)
		assert.True(t, (*sequencingExperiments)[0].HasVariants)

		// Affected then non_affected
		assert.Equal(t, "mother", (*sequencingExperiments)[1].RelationshipToProband)
		assert.Equal(t, 2, (*sequencingExperiments)[1].SeqID)
		assert.Equal(t, 1, (*sequencingExperiments)[1].PatientID)
		assert.Equal(t, "affected", (*sequencingExperiments)[1].AffectedStatusCode)
		assert.Equal(t, 2, (*sequencingExperiments)[1].SampleID)
		assert.Equal(t, "S13225", (*sequencingExperiments)[1].SampleSubmitterID)
		assert.Equal(t, "dna", (*sequencingExperiments)[1].SampleTypeCode)
		assert.Equal(t, "normal", (*sequencingExperiments)[1].HistologyCode)
		assert.True(t, (*sequencingExperiments)[1].HasVariants)

		assert.Equal(t, "father", (*sequencingExperiments)[2].RelationshipToProband)
		assert.Equal(t, 3, (*sequencingExperiments)[2].SeqID)
		assert.Equal(t, 2, (*sequencingExperiments)[2].PatientID)
		assert.Equal(t, "non_affected", (*sequencingExperiments)[2].AffectedStatusCode)
		assert.Equal(t, 3, (*sequencingExperiments)[2].SampleID)
		assert.Equal(t, "S13226", (*sequencingExperiments)[2].SampleSubmitterID)
		assert.Equal(t, "dna", (*sequencingExperiments)[2].SampleTypeCode)
		assert.Equal(t, "normal", (*sequencingExperiments)[2].HistologyCode)
		assert.False(t, (*sequencingExperiments)[2].HasVariants)
	})
}

func Test_RetrieveCaseSequencingExperiments_Somatic(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		sequencingExperiments, err := repo.retrieveCaseSequencingExperiments(t.Context(), 71)
		assert.NoError(t, err)
		assert.Equal(t, 2, len(*sequencingExperiments))

		assert.Equal(t, "proband", (*sequencingExperiments)[0].RelationshipToProband)
		assert.Equal(t, 74, (*sequencingExperiments)[0].SeqID)
		assert.Equal(t, 62, (*sequencingExperiments)[0].PatientID)
		assert.Equal(t, "affected", (*sequencingExperiments)[0].AffectedStatusCode)
		assert.Equal(t, 126, (*sequencingExperiments)[0].SampleID)
		assert.Equal(t, "dna", (*sequencingExperiments)[0].SampleTypeCode)
		assert.Equal(t, "tumoral", (*sequencingExperiments)[0].HistologyCode)
		assert.True(t, (*sequencingExperiments)[0].HasVariants)

		assert.Equal(t, "proband", (*sequencingExperiments)[1].RelationshipToProband)
		assert.Equal(t, 73, (*sequencingExperiments)[1].SeqID)
		assert.Equal(t, 62, (*sequencingExperiments)[1].PatientID)
		assert.Equal(t, "affected", (*sequencingExperiments)[1].AffectedStatusCode)
		assert.Equal(t, 124, (*sequencingExperiments)[1].SampleID)
		assert.Equal(t, "dna", (*sequencingExperiments)[1].SampleTypeCode)
		assert.Equal(t, "normal", (*sequencingExperiments)[1].HistologyCode)
		assert.False(t, (*sequencingExperiments)[1].HasVariants)
	})
}

// Tumoral seq 74 of case 71 is staged under both tumor-normal task 74 and tumor-only task 82.
func Test_RetrieveCaseSequencingExperiments_TumorSeqInBothCohorts_NotDuplicated(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		sequencingExperiments, err := repo.retrieveCaseSequencingExperiments(t.Context(), 71)
		assert.NoError(t, err)

		var tumoral []CaseSequencingExperiment
		for _, seqExp := range *sequencingExperiments {
			if seqExp.SeqID == 74 {
				tumoral = append(tumoral, seqExp)
			}
		}
		if assert.Len(t, tumoral, 1, "seq 74 must appear once even though two somatic tasks stage it") {
			assert.True(t, tumoral[0].HasVariants)
		}
	})
}

func Test_RetrieveCasePatients(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		members, err := repo.retrieveCasePatients(t.Context(), 1)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*members))

		// Proband first
		assert.Equal(t, "proband", (*members)[0].RelationshipToProband)
		require.NotNil(t, (*members)[0].PatientID)
		assert.Equal(t, 3, *(*members)[0].PatientID)
		assert.Nil(t, (*members)[0].FetusID)
		assert.Equal(t, "Marie", (*members)[0].FirstName)
		assert.Equal(t, "Lambert", (*members)[0].LastName)
		assert.Equal(t, "affected", (*members)[0].AffectedStatusCode)
		assert.Equal(t, "1973-03-23 00:00:00 +0000 UTC", (*members)[0].DateOfBirth.String())
		assert.Equal(t, "alive", (*members)[0].LifeStatusCode)
		assert.Equal(t, "MRN-283775", (*members)[0].SubmitterPatientId)
		assert.Equal(t, "LAM7303233380", (*members)[0].Jhn)
		assert.Equal(t, "male", (*members)[0].SexCode)
		assert.Equal(t, "CHUSJ", (*members)[0].OrganizationCode)
		assert.Equal(t, "Centre hospitalier universitaire Sainte-Justine", (*members)[0].OrganizationName)
		assert.Len(t, (*members)[0].ObservedPhenotypes, 0)
		assert.Len(t, (*members)[0].NonObservedPhenotypes, 2)
		assert.Equal(t, "HP:0000717", (*members)[0].NonObservedPhenotypes[0].ID)
		assert.Equal(t, "Autism", (*members)[0].NonObservedPhenotypes[0].Name)
		assert.Equal(t, "childhood", (*members)[0].NonObservedPhenotypes[0].OnsetCode)
		assert.Equal(t, "HP:0001263", (*members)[0].NonObservedPhenotypes[1].ID)
		assert.Equal(t, "Global developmental delay", (*members)[0].NonObservedPhenotypes[1].Name)
		assert.Equal(t, "childhood", (*members)[0].NonObservedPhenotypes[1].OnsetCode)

		// Affected then non_affected
		assert.Equal(t, "mother", (*members)[1].RelationshipToProband)
		require.NotNil(t, (*members)[1].PatientID)
		assert.Equal(t, 1, *(*members)[1].PatientID)
		assert.Equal(t, "Juliette", (*members)[1].FirstName)
		assert.Equal(t, "Gagnon", (*members)[1].LastName)
		assert.Equal(t, "affected", (*members)[1].AffectedStatusCode)
		assert.Equal(t, "2012-02-03 00:00:00 +0000 UTC", (*members)[1].DateOfBirth.String())
		assert.Equal(t, "alive", (*members)[1].LifeStatusCode)
		assert.Equal(t, "MRN-283773", (*members)[1].SubmitterPatientId)
		assert.Equal(t, "GAG1202030277", (*members)[1].Jhn)
		assert.Equal(t, "female", (*members)[1].SexCode)
		assert.Equal(t, "CHUSJ", (*members)[1].OrganizationCode)
		assert.Equal(t, "Centre hospitalier universitaire Sainte-Justine", (*members)[1].OrganizationName)
		assert.Len(t, (*members)[1].ObservedPhenotypes, 0)
		assert.Len(t, (*members)[1].NonObservedPhenotypes, 0)

		assert.Equal(t, "father", (*members)[2].RelationshipToProband)
		require.NotNil(t, (*members)[2].PatientID)
		assert.Equal(t, 2, *(*members)[2].PatientID)
		assert.Equal(t, "Antoine", (*members)[2].FirstName)
		assert.Equal(t, "Lefebvre", (*members)[2].LastName)
		assert.Equal(t, "non_affected", (*members)[2].AffectedStatusCode)
		assert.Equal(t, "1970-01-30 00:00:00 +0000 UTC", (*members)[2].DateOfBirth.String())
		assert.Equal(t, "alive", (*members)[2].LifeStatusCode)
		assert.Equal(t, "MRN-283774", (*members)[2].SubmitterPatientId)
		assert.Equal(t, "LEF7001303889", (*members)[2].Jhn)
		assert.Equal(t, "male", (*members)[2].SexCode)
		assert.Equal(t, "CHUSJ", (*members)[2].OrganizationCode)
		assert.Equal(t, "Centre hospitalier universitaire Sainte-Justine", (*members)[2].OrganizationName)
		assert.Len(t, (*members)[2].ObservedPhenotypes, 0)
		assert.Len(t, (*members)[2].NonObservedPhenotypes, 0)
	})
}

func Test_RetrieveCasePatients_TwinFetusCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		members, err := repo.retrieveCasePatients(t.Context(), 73)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*members))

		// affected_status_code/relationship_to_proband_code tie between the two fetuses, so their
		// relative order is undefined SQL-side — look up by FetusID rather than by position.
		findByFetusID := func(fetusID int) *types.CasePatientClinicalInformation {
			for i := range *members {
				if (*members)[i].FetusID != nil && *(*members)[i].FetusID == fetusID {
					return &(*members)[i]
				}
			}
			return nil
		}

		var mother *types.CasePatientClinicalInformation
		for i := range *members {
			if (*members)[i].RelationshipToProband == "proband" {
				mother = &(*members)[i]
			}
		}
		require.NotNil(t, mother)
		require.NotNil(t, mother.PatientID)
		assert.Equal(t, 64, *mother.PatientID)
		assert.Nil(t, mother.FetusID)
		assert.Equal(t, "female", mother.SexCode)

		fetus2 := findByFetusID(2)
		require.NotNil(t, fetus2)
		assert.Nil(t, fetus2.PatientID)
		require.NotNil(t, fetus2.FetusID)
		assert.Equal(t, 2, *fetus2.FetusID)
		assert.Equal(t, "alive", fetus2.LifeStatusCode)
		assert.Equal(t, "female", fetus2.SexCode)
		assert.Empty(t, fetus2.SubmitterPatientId)
		assert.Empty(t, fetus2.Jhn)
		// HP:0001631 has no matching hpo_term row in this fixture set — phenotype_name comes
		// back empty, confirming the join tolerates an unmatched code without erroring.
		assert.Len(t, fetus2.ObservedPhenotypes, 1)
		assert.Equal(t, "HP:0001631", fetus2.ObservedPhenotypes[0].ID)
		assert.Empty(t, fetus2.ObservedPhenotypes[0].Name)

		fetus3 := findByFetusID(3)
		require.NotNil(t, fetus3)
		assert.Nil(t, fetus3.PatientID)
		require.NotNil(t, fetus3.FetusID)
		assert.Equal(t, 3, *fetus3.FetusID)
		assert.Equal(t, "deceased", fetus3.LifeStatusCode)
		assert.Equal(t, "unknown", fetus3.SexCode)
		assert.Len(t, fetus3.ObservedPhenotypes, 1)
		assert.Equal(t, "HP:0001561", fetus3.ObservedPhenotypes[0].ID)
		assert.Equal(t, "Polyhydramnios", fetus3.ObservedPhenotypes[0].Name)
		assert.Equal(t, "antenatal", fetus3.ObservedPhenotypes[0].OnsetCode)
	})
}

func Test_RetrieveCaseTasks(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		tasks, err := repo.retrieveCaseTasks(t.Context(), 1)
		assert.NoError(t, err)
		assert.Equal(t, 8, len(*tasks))

		assert.Equal(t, 1, (*tasks)[0].ID)
		assert.Equal(t, "alignment_germline_variant_calling", (*tasks)[0].TypeCode)
		assert.Equal(t, "2021-10-12 13:08:00 +0000 UTC", (*tasks)[0].CreatedOn.String())
		assert.Equal(t, int64(1), (*tasks)[0].PatientCount)
		assert.Equal(t, 1, len((*tasks)[0].Patients))
		assert.Equal(t, "proband", (*tasks)[0].Patients[0])
		assert.Equal(t, 1, len((*tasks)[1].Patients))
		assert.Equal(t, "mother", (*tasks)[1].Patients[0])
		assert.Equal(t, 1, len((*tasks)[2].Patients))
		assert.Equal(t, "father", (*tasks)[2].Patients[0])
		assert.Equal(t, 3, len((*tasks)[3].Patients))
		assert.True(t, slices.Contains((*tasks)[3].Patients, "proband"))
		assert.True(t, slices.Contains((*tasks)[3].Patients, "mother"))
		assert.True(t, slices.Contains((*tasks)[3].Patients, "father"))
	})
}

func Test_RetrieveCaseTasks_DeduplicatePatients(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		tasks, err := repo.retrieveCaseTasks(t.Context(), 71)
		assert.NoError(t, err)
		// Tasks 74 (somatic TN), 75, 76 (alignments), 82 (somatic TO) and 85 (somatic CNV),
		// ordered by id.
		assert.Equal(t, 5, len(*tasks))

		assert.Equal(t, 74, (*tasks)[0].ID)
		assert.Equal(t, "radiant_somatic_annotation", (*tasks)[0].TypeCode)
		assert.Equal(t, 1, len((*tasks)[0].Patients))
		assert.True(t, slices.Contains((*tasks)[0].Patients, "proband"))
	})
}

func Test_RetrieveCaseTasks_PrenatalCase_CountsMotherAndFetusAsTwoDistinctIndividuals(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		tasks, err := repo.retrieveCaseTasks(t.Context(), 72)
		assert.NoError(t, err)
		require.Len(t, *tasks, 2)

		fetusOnlyTask := (*tasks)[0]
		assert.Equal(t, 83, fetusOnlyTask.ID)
		assert.Equal(t, int64(1), fetusOnlyTask.PatientCount)
		assert.Equal(t, 1, len(fetusOnlyTask.Patients))
		assert.True(t, slices.Contains(fetusOnlyTask.Patients, "fetus"))

		// Task 84 covers both the fetus's sequencing (sample 127) and the mother's own,
		// separate sequencing (sample 130) — both samples share patient_id 63, but must still
		// count as 2 distinct individuals, not 1.
		motherAndFetusTask := (*tasks)[1]
		assert.Equal(t, 84, motherAndFetusTask.ID)
		assert.Equal(t, int64(2), motherAndFetusTask.PatientCount)
		assert.True(t, slices.Contains(motherAndFetusTask.Patients, "fetus"))
		assert.True(t, slices.Contains(motherAndFetusTask.Patients, "proband"))
	})
}

func Test_subjectKey_FetusRowTaggedAsFetus(t *testing.T) {
	assert.Equal(t, "f:7", subjectKey(nil, utils.IntPtr(7)))
}

func Test_subjectKey_PatientRowTaggedAsPatient(t *testing.T) {
	assert.Equal(t, "p:7", subjectKey(utils.IntPtr(7), nil))
}

// A patient id and a fetus id can be the same integer — the tag is what keeps their rows apart.
func Test_subjectKey_SameIdDifferentSubjectsDoNotCollide(t *testing.T) {
	assert.NotEqual(t, subjectKey(utils.IntPtr(7), nil), subjectKey(nil, utils.IntPtr(7)))
}

// Neither set means a data anomaly (dangling FK, unresolved federated join). It must not panic,
// and must not be mistaken for a real subject.
func Test_subjectKey_NeitherSetDoesNotPanic(t *testing.T) {
	key := subjectKey(nil, nil)
	assert.Equal(t, "unresolved", key)
	assert.NotEqual(t, subjectKey(utils.IntPtr(0), nil), key)
	assert.NotEqual(t, subjectKey(nil, utils.IntPtr(0)), key)
}
