package starrocks

import (
	"fmt"
	"slices"
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/internal/utils/joins"
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
				Value:     []interface{}{"submitted"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(4), *count)
		assert.Len(t, *cases, 4)
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

func Test_Cases_SearchById_ProbandSubmitterSampleIds_SomaticSuggestsTumoralSamples(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		autocompleteResult, err := repo.SearchById(t.Context(), "srx109164", 10)
		require.NoError(t, err)
		// The normal SRX1091646 is not a proband sample of somatic case 71, so it is not suggested.
		assert.Equal(t, []AutocompleteResult{{Type: "proband_submitter_sample_ids", Value: "SRX1091647"}}, *autocompleteResult)
	})
}

func Test_Cases_SearchById_ProbandSubmitterSampleIds_SharedByCases_SuggestedOnce(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		// S13224 is the proband sample of cases 1 and 70; S13225 and S13226 are the parents'.
		autocompleteResult, err := repo.SearchById(t.Context(), "S1322", 10)
		require.NoError(t, err)
		assert.Contains(t, *autocompleteResult, AutocompleteResult{Type: "proband_submitter_sample_ids", Value: "S13224"})
		assert.NotContains(t, *autocompleteResult, AutocompleteResult{Type: "proband_submitter_sample_ids", Value: "S13225"})
		assert.NotContains(t, *autocompleteResult, AutocompleteResult{Type: "proband_submitter_sample_ids", Value: "S13226"})
		count := 0
		for _, r := range *autocompleteResult {
			if r.Value == "S13224" {
				count++
			}
		}
		assert.Equal(t, 1, count)
	})
}

func Test_Cases_SearchById_ProbandSubmitterSampleIds_SkipsFetusSample(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		autocompleteResult, err := repo.SearchById(t.Context(), "S-PRENAT-72", 10)
		require.NoError(t, err)
		assert.Equal(t, []AutocompleteResult{{Type: "proband_submitter_sample_ids", Value: "S-PRENAT-72-MOTHER"}}, *autocompleteResult)
	})
}

func Test_Cases_SearchById_ProbandSubmitterSampleIds_SuggestsEverySample(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		defer insertProbandSampleCase(t, env, 1102, "S99999-SECOND", "2026-01-01")()
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		second, err := repo.SearchById(t.Context(), "S99999", 10)
		require.NoError(t, err)
		assert.Equal(t, []AutocompleteResult{{Type: "proband_submitter_sample_ids", Value: "S99999-SECOND"}}, *second)

		first, err := repo.SearchById(t.Context(), "S13224", 10)
		require.NoError(t, err)
		assert.Equal(t, []AutocompleteResult{{Type: "proband_submitter_sample_ids", Value: "S13224"}}, *first)
	})
}

func Test_GetCasesFilters(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		filters, err := repo.GetCasesFilters(t.Context())
		assert.NoError(t, err)
		assert.Equal(t, 11, len((*filters).Status))
		assert.Equal(t, len((*filters).Priority), 4)
		assert.Equal(t, len((*filters).AnalysisCatalog), 4)
		assert.Equal(t, len((*filters).Project), 2)
		assert.Equal(t, len((*filters).DiagnosisLab), 2)
		assert.Equal(t, len((*filters).OrderingOrganization), 4)
		assert.Equal(t, 3, len((*filters).LifeStatus))
		assert.Equal(t, 2, len((*filters).CaseCategory))
		assert.Equal(t, 2, len((*filters).Panel))
		assert.Equal(t, 2, len((*filters).CaseType))
	})
}

func Test_GetCasesFilters_LeavesOutUploadedPanels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		require.NoError(t, env.Postgres.Exec("INSERT INTO panel (code, name, type_code, tenant_code) VALUES ('GPFILTER', 'GPFILTER', 'uploaded', 'radiant')").Error)
		t.Cleanup(func() { env.Postgres.Exec("DELETE FROM panel WHERE code = 'GPFILTER' AND tenant_code = 'radiant'") })
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		filters, err := repo.GetCasesFilters(t.Context())

		require.NoError(t, err)
		keys := make([]string, len(filters.Panel))
		for i, p := range filters.Panel {
			keys[i] = p.Key
		}
		assert.ElementsMatch(t, []string{"EPILEP", "HEART"}, keys)
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

func Test_RetrieveCasePatients_FetusGestationalDates(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		soloMembers, err := repo.retrieveCasePatients(t.Context(), 72)
		assert.NoError(t, err)
		fetus1 := findMemberByFetusID(*soloMembers, 1)
		require.NotNil(t, fetus1)
		require.NotNil(t, fetus1.LastMenstrualPeriod)
		assert.Equal(t, "2026-02-01 00:00:00 +0000 UTC", fetus1.LastMenstrualPeriod.String())
		assert.Nil(t, fetus1.EstimatedDueDate)
		assert.Nil(t, fetus1.DateOfBirth)

		twinMembers, err := repo.retrieveCasePatients(t.Context(), 73)
		assert.NoError(t, err)

		fetus2 := findMemberByFetusID(*twinMembers, 2)
		require.NotNil(t, fetus2)
		assert.Nil(t, fetus2.LastMenstrualPeriod)
		require.NotNil(t, fetus2.EstimatedDueDate)
		assert.Equal(t, "2026-10-15 00:00:00 +0000 UTC", fetus2.EstimatedDueDate.String())

		fetus3 := findMemberByFetusID(*twinMembers, 3)
		require.NotNil(t, fetus3)
		assert.Nil(t, fetus3.LastMenstrualPeriod)
		assert.Nil(t, fetus3.EstimatedDueDate)

		mother := findMemberByRelationship(*twinMembers, "proband")
		require.NotNil(t, mother)
		assert.Nil(t, mother.LastMenstrualPeriod)
		assert.Nil(t, mother.EstimatedDueDate)
	})
}

func Test_RetrieveCasePatients_ParaclinicalExams(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		members, err := repo.retrieveCasePatients(t.Context(), 74)
		assert.NoError(t, err)

		mother := findMemberByRelationship(*members, "proband")
		require.NotNil(t, mother)
		require.Len(t, mother.Exams, 4)

		assert.Equal(t, "eeg", mother.Exams[0].ExamCode)
		assert.Equal(t, "Electroencephalogram (EEG)", mother.Exams[0].Name)
		assert.Equal(t, "normal", mother.Exams[0].InterpretationCode)
		assert.Equal(t, "normal", mother.Exams[0].Value)
		assert.Empty(t, mother.Exams[0].ValueName)
		assert.Empty(t, mother.Exams[0].CodingSystem)

		assert.Equal(t, "emg", mother.Exams[1].ExamCode)
		assert.Equal(t, "Electromyography (EMG)", mother.Exams[1].Name)
		assert.Equal(t, "abnormal", mother.Exams[1].InterpretationCode)
		assert.Equal(t, "HP:0003457", mother.Exams[1].Value)
		assert.Equal(t, "EMG abnormality", mother.Exams[1].ValueName)
		assert.Equal(t, "HPO", mother.Exams[1].CodingSystem)

		assert.Equal(t, "emg", mother.Exams[2].ExamCode)
		assert.Equal(t, "HP:0003458", mother.Exams[2].Value)
		assert.Equal(t, "EMG: myopathic abnormalities", mother.Exams[2].ValueName)

		assert.Equal(t, "other", mother.Exams[3].ExamCode)
		assert.Equal(t, "Other", mother.Exams[3].Name)
		assert.Equal(t, "Ophthalmology consult 2026", mother.Exams[3].Value)
		assert.Empty(t, mother.Exams[3].InterpretationCode)

		fetus := findMemberByFetusID(*members, 4)
		require.NotNil(t, fetus)
		require.Len(t, fetus.Exams, 2)

		// Both exams of a member come back in exam_code order.
		assert.Equal(t, "eeg", fetus.Exams[0].ExamCode)
		assert.Equal(t, "Electroencephalogram (EEG)", fetus.Exams[0].Name)
		assert.Equal(t, "abnormal", fetus.Exams[0].InterpretationCode)
		assert.Equal(t, "abnormal", fetus.Exams[0].Value)

		assert.Equal(t, "other", fetus.Exams[1].ExamCode)
		assert.Equal(t, "Other", fetus.Exams[1].Name)
		assert.Equal(t, "abnormal", fetus.Exams[1].InterpretationCode)
		assert.Equal(t, "Bilateral ventriculomegaly", fetus.Exams[1].Value)
	})
}

func Test_RetrieveCasePatients_ValueSetObservationsNotesAndFamilyHistory(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		members, err := repo.retrieveCasePatients(t.Context(), 74)
		assert.NoError(t, err)

		mother := findMemberByRelationship(*members, "proband")
		require.NotNil(t, mother)

		require.Len(t, mother.Ethnicities, 2)
		assert.Equal(t, "BLK", mother.Ethnicities[0].Code)
		assert.Equal(t, "Black", mother.Ethnicities[0].Name)
		assert.Equal(t, "MIX", mother.Ethnicities[1].Code)
		assert.Equal(t, "Mixed", mother.Ethnicities[1].Name)

		require.NotNil(t, mother.Consanguinity)
		assert.Equal(t, "consanguinity", mother.Consanguinity.Code)
		assert.Equal(t, "Consanguinity in family", mother.Consanguinity.Name)

		require.Len(t, mother.Notes, 1)
		assert.Equal(t, "High-risk pregnancy follow-up", mother.Notes[0])

		require.Len(t, mother.FamilyHistory, 2)
		assert.Equal(t, "brother", mother.FamilyHistory[0].FamilyMemberCode)
		assert.Equal(t, "Epilepsy", mother.FamilyHistory[0].Condition)
		assert.Equal(t, "mother", mother.FamilyHistory[1].FamilyMemberCode)
		assert.Equal(t, "Myotonic dystrophy", mother.FamilyHistory[1].Condition)

		fetus := findMemberByFetusID(*members, 4)
		require.NotNil(t, fetus)
		require.Len(t, fetus.Notes, 1)
		assert.Equal(t, "Findings on the second-trimester ultrasound", fetus.Notes[0])
		assert.Empty(t, fetus.Ethnicities)
		assert.Nil(t, fetus.Consanguinity)
		assert.Empty(t, fetus.FamilyHistory)

		father := findMemberByRelationship(*members, "father")
		require.NotNil(t, father)
		assert.Empty(t, father.Notes)
		assert.Empty(t, father.Ethnicities)
		assert.Nil(t, father.Consanguinity)
	})
}

func Test_GetCaseEntity_DiagnosisHypothesis(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		caseEntity, err := repo.GetCaseEntity(t.Context(), 74)
		assert.NoError(t, err)
		assert.Equal(t, "Suspected congenital myotonic dystrophy", caseEntity.DiagnosisHypothesis)

		withoutHypothesis, err := repo.GetCaseEntity(t.Context(), 1)
		assert.NoError(t, err)
		assert.Empty(t, withoutHypothesis.DiagnosisHypothesis)
	})
}

func Test_RetrieveCasePatients_CaseWithoutExams(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		members, err := repo.retrieveCasePatients(t.Context(), 1)
		assert.NoError(t, err)
		require.Len(t, *members, 3)
		for _, member := range *members {
			assert.Empty(t, member.Exams)
			assert.NotNil(t, member.Exams)
		}
	})
}

func findMemberByFetusID(members []types.CasePatientClinicalInformation, fetusID int) *types.CasePatientClinicalInformation {
	for i := range members {
		if members[i].FetusID != nil && *members[i].FetusID == fetusID {
			return &members[i]
		}
	}
	return nil
}

func findMemberByRelationship(members []types.CasePatientClinicalInformation, relationship string) *types.CasePatientClinicalInformation {
	for i := range members {
		if members[i].RelationshipToProband == relationship {
			return &members[i]
		}
	}
	return nil
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

func insertCaseGroup(t *testing.T, env *testutils.Env, name string, caseIDs ...int) {
	t.Helper()
	var id int
	require.NoError(t, env.Postgres.Raw("INSERT INTO case_group (tenant_code, name, created_by) VALUES ('radiant', ?, 'it') RETURNING id", name).Scan(&id).Error)
	for _, caseID := range caseIDs {
		require.NoError(t, env.Postgres.Exec("INSERT INTO case_group_case (case_group_id, case_id) VALUES (?, ?)", id, caseID).Error)
	}
	t.Cleanup(func() { env.Postgres.Exec("DELETE FROM case_group WHERE tenant_code = 'radiant' AND name = ?", name) })
}

func Test_SearchCases_OnCaseGroup(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		insertCaseGroup(t, env, "it_repo_cg_a", 1, 2)
		insertCaseGroup(t, env, "it_repo_cg_b", 1)
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		search := func(names ...interface{}) ([]int, int64) {
			criteria := []types.SearchCriterion{{FieldName: types.CaseGroupField.GetAlias(), Value: names}}
			sort := []types.SortBody{{Field: types.CaseIdField.GetAlias(), Order: "asc"}}
			query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, criteria, nil, sort)
			require.NoError(t, err)
			cases, count, err := repo.SearchCases(t.Context(), query)
			require.NoError(t, err)
			ids := make([]int, len(*cases))
			for i, c := range *cases {
				ids[i] = c.CaseID
			}
			return ids, *count
		}

		ids, count := search("it_repo_cg_a")
		assert.Equal(t, []int{1, 2}, ids)
		assert.Equal(t, int64(2), count)

		// Case 1 is in both groups: one row, counted once.
		ids, count = search("it_repo_cg_a", "it_repo_cg_b")
		assert.Equal(t, []int{1, 2}, ids)
		assert.Equal(t, int64(2), count)

		ids, count = search("it_repo_cg_missing")
		assert.Empty(t, ids)
		assert.Equal(t, int64(0), count)
	})
}

func searchCaseById(t *testing.T, repo *CasesRepository, caseID int) CaseResult {
	t.Helper()
	criteria := []types.SearchCriterion{{FieldName: types.CaseIdField.GetAlias(), Value: []interface{}{caseID}}}
	query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, criteria, nil, nil)
	require.NoError(t, err)
	cases, _, err := repo.SearchCases(t.Context(), query)
	require.NoError(t, err)
	require.Len(t, *cases, 1)
	return (*cases)[0]
}

func Test_SearchCases_ProbandSubmitterSampleIds_GermlineShowsOnlyProbandSample(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		// Case 1 is a trio: S13225 (mother) and S13226 (father) are left out.
		assert.Equal(t, types.JsonArray[string]{"S13224"}, searchCaseById(t, repo, 1).ProbandSubmitterSampleIds)
	})
}

func Test_SearchCases_ProbandSubmitterSampleIds_SomaticShowsTumoralSample(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		// Case 71 sequenced the proband's normal SRX1091646 and tumoral SRX1091647.
		assert.Equal(t, types.JsonArray[string]{"SRX1091647"}, searchCaseById(t, repo, 71).ProbandSubmitterSampleIds)
	})
}

func Test_SearchCases_ProbandSubmitterSampleIds_PrenatalShowsMotherSample(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		// Case 72 sequenced the mother's S-PRENAT-72-MOTHER and the fetus's S-PRENAT-72, which also
		// carries the mother's patient_id.
		assert.Equal(t, types.JsonArray[string]{"S-PRENAT-72-MOTHER"}, searchCaseById(t, repo, 72).ProbandSubmitterSampleIds)
	})
}

func Test_SearchCases_ProbandSubmitterSampleIds_EmptyArrayWithoutProbandSample(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO cases (id, proband_id, project_id, analysis_catalog_id, status_code, diagnosis_lab_code, tenant_code, created_on, updated_on, priority_code, case_type_code, case_category_code, ordering_organization_code, submitter_case_id)
			VALUES (1100, 3, 1, 1, 'in_progress', 'CQGC', 'radiant', now(), now(), 'routine', 'germline', 'postnatal', 'CHUSJ', 'PROBAND-SAMPLE-NONE'),
			       (1101, 62, 1, 1, 'in_progress', 'CQGC', 'radiant', now(), now(), 'routine', 'somatic', 'postnatal', 'CHUSJ', 'PROBAND-SAMPLE-NORMAL-ONLY')
		`).Error)
		// Case 1101 sequenced only the proband's normal sample.
		require.NoError(t, env.Postgres.Exec("INSERT INTO case_has_sequencing_experiment (sequencing_experiment_id, case_id) VALUES (73, 1101)").Error)
		// The shared cleanUp deletes cases before their sequencing links, which the FK refuses.
		defer env.Postgres.Exec("DELETE FROM cases WHERE id IN (1100, 1101)")
		defer env.Postgres.Exec("DELETE FROM case_has_sequencing_experiment WHERE case_id = 1101")
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		assert.Equal(t, types.JsonArray[string]{}, searchCaseById(t, repo, 1100).ProbandSubmitterSampleIds)
		assert.Equal(t, types.JsonArray[string]{}, searchCaseById(t, repo, 1101).ProbandSubmitterSampleIds)
	})
}

// insertProbandSampleCase adds a germline case whose proband (patient 3) has S13224, run in 2021 (seq 1), and
// a second sample sequenced with runDate (nil for none). Case, sample and sequencing all take id. It returns
// the cleanup to defer.
func insertProbandSampleCase(t *testing.T, env *testutils.Env, id int, submitterSampleID string, runDate any) func() {
	t.Helper()
	require.NoError(t, env.Postgres.Exec(`
		INSERT INTO cases (id, proband_id, project_id, analysis_catalog_id, status_code, diagnosis_lab_code, tenant_code, created_on, updated_on, priority_code, case_type_code, case_category_code, ordering_organization_code, submitter_case_id)
		VALUES (?, 3, 1, 1, 'in_progress', 'CQGC', 'radiant', now(), now(), 'routine', 'germline', 'postnatal', 'CHUSJ', ?)
	`, id, submitterSampleID).Error)
	require.NoError(t, env.Postgres.Exec(`
		INSERT INTO sample (id, type_code, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
		VALUES (?, 'dna', 'normal', ?, 3, 'CQGC', 'radiant')
	`, id, submitterSampleID).Error)
	require.NoError(t, env.Postgres.Exec(`
		INSERT INTO sequencing_experiment (id, sample_id, status_code, aliquot, sequencing_lab_code, tenant_code, run_name, run_alias, run_date, capture_kit, created_on, updated_on, experimental_strategy_code, sequencing_read_technology_code, platform_code)
		VALUES (?, ?, 'completed', ?, 'CQGC', 'radiant', 9999, ?, ?, 'SureSelect Custom DNA Target', now(), now(), 'wgs', 'short_read', 'illumina')
	`, id, id, submitterSampleID, submitterSampleID, runDate).Error)
	require.NoError(t, env.Postgres.Exec("INSERT INTO case_has_sequencing_experiment (sequencing_experiment_id, case_id) VALUES (1, ?), (?, ?)", id, id, id).Error)
	return func() {
		env.Postgres.Exec("DELETE FROM case_has_sequencing_experiment WHERE case_id = ?", id)
		env.Postgres.Exec("DELETE FROM sequencing_experiment WHERE id = ?", id)
		env.Postgres.Exec("DELETE FROM sample WHERE id = ?", id)
		env.Postgres.Exec("DELETE FROM cases WHERE id = ?", id)
	}
}

func Test_SearchCases_ProbandSubmitterSampleIds_SeveralSamples_MostRecentFirst(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		defer insertProbandSampleCase(t, env, 1102, "S99999-SECOND", "2026-01-01")()
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		// S99999-SECOND sorts after S13224, so an alphabetical order would fail.
		assert.Equal(t, types.JsonArray[string]{"S99999-SECOND", "S13224"}, searchCaseById(t, repo, 1102).ProbandSubmitterSampleIds)
	})
}

func Test_SearchCases_ProbandSubmitterSampleIds_OrderedByRunDateNotLoadDate(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		// Loaded into the portal now, but run before S13224's 2021 run.
		defer insertProbandSampleCase(t, env, 1104, "S99999-OLD-RUN", "2020-01-01")()
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		assert.Equal(t, types.JsonArray[string]{"S13224", "S99999-OLD-RUN"}, searchCaseById(t, repo, 1104).ProbandSubmitterSampleIds)
	})
}

func Test_SearchCases_ProbandSubmitterSampleIds_NoRunDateComesLast(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		defer insertProbandSampleCase(t, env, 1105, "S99999-NO-RUN-DATE", nil)()
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		assert.Equal(t, types.JsonArray[string]{"S13224", "S99999-NO-RUN-DATE"}, searchCaseById(t, repo, 1105).ProbandSubmitterSampleIds)
	})
}

func Test_SearchCases_ProbandSubmitterSampleIds_SomaticShowsEveryTumoralSample(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		defer env.Postgres.Exec("DELETE FROM cases WHERE id = 1103")
		defer env.Postgres.Exec("DELETE FROM sample WHERE id = 1103")
		defer env.Postgres.Exec("DELETE FROM sequencing_experiment WHERE id = 1103")
		defer env.Postgres.Exec("DELETE FROM case_has_sequencing_experiment WHERE case_id = 1103")
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO cases (id, proband_id, project_id, analysis_catalog_id, status_code, diagnosis_lab_code, tenant_code, created_on, updated_on, priority_code, case_type_code, case_category_code, ordering_organization_code, submitter_case_id)
			VALUES (1103, 62, 1, 1, 'in_progress', 'CQGC', 'radiant', now(), now(), 'routine', 'somatic', 'postnatal', 'CHUSJ', 'PROBAND-SAMPLE-TWO-TUMORS')
		`).Error)
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO sample (id, type_code, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
			VALUES (1103, 'dna', 'tumoral', 'SRX9999999-RELAPSE', 62, 'LDM-CHUSJ', 'radiant')
		`).Error)
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO sequencing_experiment (id, sample_id, status_code, aliquot, sequencing_lab_code, tenant_code, run_name, run_alias, run_date, capture_kit, created_on, updated_on, experimental_strategy_code, sequencing_read_technology_code, platform_code)
			VALUES (1103, 1103, 'completed', 'RELAPSE', 'CQGC', 'radiant', 9998, 'RELAPSE_9998', '2026-09-01', 'SureSelect Custom DNA Target', now(), now(), 'wgs', 'short_read', 'illumina')
		`).Error)
		// Seq 73 is the proband's normal SRX1091646, seq 74 its tumoral SRX1091647, run on 2026-03-08 before the relapse.
		require.NoError(t, env.Postgres.Exec("INSERT INTO case_has_sequencing_experiment (sequencing_experiment_id, case_id) VALUES (73, 1103), (74, 1103), (1103, 1103)").Error)
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		assert.Equal(t, types.JsonArray[string]{"SRX9999999-RELAPSE", "SRX1091647"}, searchCaseById(t, repo, 1103).ProbandSubmitterSampleIds)
	})
}

func searchCasesByProbandSubmitterSampleIds(t *testing.T, repo *CasesRepository, sampleIDs ...interface{}) (*[]CaseResult, int64) {
	t.Helper()
	criteria := []types.SearchCriterion{{FieldName: types.CaseProbandSubmitterSampleIdsField.GetAlias(), Value: sampleIDs}}
	query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, criteria, nil, nil)
	require.NoError(t, err)
	cases, count, err := repo.SearchCases(t.Context(), query)
	require.NoError(t, err)
	return cases, *count
}

func Test_SearchCases_OnProbandSubmitterSampleIds(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		// Cases 1 and 70 both sequenced the proband's S13224.
		cases, count := searchCasesByProbandSubmitterSampleIds(t, repo, "S13224")
		assert.Equal(t, int64(2), count)
		require.Len(t, *cases, 2)
		assert.ElementsMatch(t, []int{1, 70}, []int{(*cases)[0].CaseID, (*cases)[1].CaseID})
	})
}

func Test_SearchCases_OnProbandSubmitterSampleIds_SeveralValues(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		cases, count := searchCasesByProbandSubmitterSampleIds(t, repo, "S13224", "SRX1091647")
		assert.Equal(t, int64(3), count)
		require.Len(t, *cases, 3)
		caseIDs := []int{(*cases)[0].CaseID, (*cases)[1].CaseID, (*cases)[2].CaseID}
		assert.ElementsMatch(t, []int{1, 70, 71}, caseIDs)
	})
}

func Test_SearchCases_OnProbandSubmitterSampleIds_AnySampleMatches(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		defer insertProbandSampleCase(t, env, 1102, "S99999-SECOND", "2026-01-01")()
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		// Case 1102 has S99999-SECOND too, and its S13224 still matches.
		cases, count := searchCasesByProbandSubmitterSampleIds(t, repo, "S13224")
		assert.Equal(t, int64(3), count)
		require.Len(t, *cases, 3)
		assert.ElementsMatch(t, []int{1, 70, 1102}, []int{(*cases)[0].CaseID, (*cases)[1].CaseID, (*cases)[2].CaseID})
	})
}

func Test_SearchCases_NotInProbandSubmitterSampleIds_KeepsCasesWithoutSample(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO cases (id, proband_id, project_id, analysis_catalog_id, status_code, diagnosis_lab_code, tenant_code, created_on, updated_on, priority_code, case_type_code, case_category_code, ordering_organization_code, submitter_case_id)
			VALUES (1100, 3, 1, 1, 'in_progress', 'CQGC', 'radiant', now(), now(), 'routine', 'germline', 'postnatal', 'CHUSJ', 'PROBAND-SAMPLE-NONE')
		`).Error)
		defer env.Postgres.Exec("DELETE FROM cases WHERE id = 1100")
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})

		criteria := []types.SearchCriterion{
			{FieldName: types.CaseProbandSubmitterSampleIdsField.GetAlias(), Operator: "not-in", Value: []interface{}{"S13224"}},
			{FieldName: types.CaseIdField.GetAlias(), Value: []interface{}{1, 1100}},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, criteria, nil, nil)
		require.NoError(t, err)
		cases, count, err := repo.SearchCases(t.Context(), query)
		require.NoError(t, err)
		// Case 1 has S13224 and is excluded; case 1100 has no proband sample and stays.
		assert.Equal(t, int64(1), *count)
		require.Len(t, *cases, 1)
		assert.Equal(t, 1100, (*cases)[0].CaseID)
		assert.Equal(t, types.JsonArray[string]{}, (*cases)[0].ProbandSubmitterSampleIds)
	})
}

func Test_SearchCases_OnProbandSubmitterSampleIds_NonProbandSample_NoResult(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		// SRX1091646 is case 71's normal sample and S-PRENAT-72 its fetus's: neither is a proband sample.
		_, count := searchCasesByProbandSubmitterSampleIds(t, repo, "SRX1091646", "S-PRENAT-72")
		assert.Equal(t, int64(0), count)
	})
}

func caseRunAliases(t *testing.T, env *testutils.Env, caseID int) types.JsonArray[string] {
	t.Helper()
	tx := env.Starrocks.WithContext(t.Context()).Table(fmt.Sprintf("%s %s", types.CaseTable.TenantQualifiedName(t.Context()), types.CaseTable.Alias))
	tx = joins.Starrocks().CaseWithRuns(tx)
	var rows []struct {
		RunAliases types.JsonArray[string]
	}
	require.NoError(t, tx.Select(fmt.Sprintf("%s.%s AS run_aliases", types.CaseRunTable.Alias, types.CaseRunAliasesField.Name)).Where(fmt.Sprintf("%s.id = ?", types.CaseTable.Alias), caseID).Scan(&rows).Error)
	require.Len(t, rows, 1)
	return rows[0].RunAliases
}

func Test_CaseWithRuns_TrioCase_ListsEveryMemberRun(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		// Case 1 sequenced the proband, mother and father on the same day: the latest sequencing comes first.
		assert.Equal(t, types.JsonArray[string]{"A00516_0171", "A00516_0170", "A00516_0169"}, caseRunAliases(t, env, 1))
	})
}

func Test_CaseWithRuns_MostRecentRunFirst(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		defer insertProbandSampleCase(t, env, 1110, "RUN-2026", "2026-01-01")()

		assert.Equal(t, types.JsonArray[string]{"RUN-2026", "A00516_0169"}, caseRunAliases(t, env, 1110))
	})
}

func Test_CaseWithRuns_OrderedByRunDateNotSequencingId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		// Sequencing 1111 is the latest loaded, but its run is older than A00516_0169's 2021 run.
		defer insertProbandSampleCase(t, env, 1111, "RUN-2020", "2020-01-01")()

		assert.Equal(t, types.JsonArray[string]{"A00516_0169", "RUN-2020"}, caseRunAliases(t, env, 1111))
	})
}

func Test_CaseWithRuns_NoRunDateComesLast(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		defer insertProbandSampleCase(t, env, 1112, "RUN-NO-DATE", nil)()

		assert.Equal(t, types.JsonArray[string]{"A00516_0169", "RUN-NO-DATE"}, caseRunAliases(t, env, 1112))
	})
}

func Test_CaseWithRuns_RunSharedBySequencings_ListedOnce(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		// The second sequencing ran on A00516_0169 too, like sequencing 1.
		defer insertProbandSampleCase(t, env, 1113, "A00516_0169", "2021-08-17")()

		assert.Equal(t, types.JsonArray[string]{"A00516_0169"}, caseRunAliases(t, env, 1113))
	})
}

func Test_CaseWithRuns_EmptyArrayWithoutRun(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO cases (id, proband_id, project_id, analysis_catalog_id, status_code, diagnosis_lab_code, tenant_code, created_on, updated_on, priority_code, case_type_code, case_category_code, ordering_organization_code, submitter_case_id)
			VALUES (1114, 3, 1, 1, 'in_progress', 'CQGC', 'radiant', now(), now(), 'routine', 'germline', 'postnatal', 'CHUSJ', 'CASE-RUN-NONE')
		`).Error)
		defer env.Postgres.Exec("DELETE FROM cases WHERE id = 1114")

		assert.Equal(t, types.JsonArray[string]{}, caseRunAliases(t, env, 1114))
	})
}

func Test_SearchCases_RunAliases_TrioCase_ListsEveryMemberRun(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		assert.Equal(t, types.JsonArray[string]{"A00516_0171", "A00516_0170", "A00516_0169"}, searchCaseById(t, repo, 1).RunAliases)
	})
}
