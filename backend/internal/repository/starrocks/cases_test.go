package starrocks

import (
	"slices"
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
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

func Test_GetCaseType(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})

		caseType, err := repo.GetCaseType(t.Context(), 70)
		assert.NoError(t, err)
		assert.Equal(t, "germline", caseType)

		caseType, err = repo.GetCaseType(t.Context(), 71)
		assert.NoError(t, err)
		assert.Equal(t, "somatic", caseType)
	})
}

func Test_SearchCasesNoFilters(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, nil, nil, nil)
		cases, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *cases, 10)
		assert.Equal(t, int64(23), *count)
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseResolutionStatusCodeField.GetAlias(),
				Value:     []interface{}{"unsolved"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(23), *count)

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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CasePrimaryConditionIdField.GetAlias(),
				Value:     []interface{}{"MONDO:0700092"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(21), *count)

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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.PanelCodeField.GetAlias(),
				Value:     []interface{}{"EPILEP"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(17), *count)
	})
}

func Test_SearchCases_OnProbandLifeStatusCode(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.ProbandLifeStatusCodeField.GetAlias(),
				Value:     []interface{}{"alive"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(23), *count)

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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
		assert.Equal(t, int64(0), *count)
	})
}

func Test_SearchCases_OnCaseTypeCode(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseTypeCodeField.GetAlias(),
				Value:     []interface{}{"germline"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		_, count, err := repo.SearchCases(t.Context(), query)
		assert.NoError(t, err)
		assert.Equal(t, int64(22), *count)

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

func Test_Cases_SearchById(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
		filters, err := repo.GetCasesFilters(t.Context())
		assert.NoError(t, err)
		assert.Equal(t, len((*filters).Status), 7)
		assert.Equal(t, len((*filters).Priority), 4)
		assert.Equal(t, len((*filters).AnalysisCatalog), 4)
		assert.Equal(t, len((*filters).Project), 2)
		assert.Equal(t, len((*filters).DiagnosisLab), 2)
		assert.Equal(t, len((*filters).OrderingOrganization), 7)
		assert.Equal(t, 3, len((*filters).ResolutionStatus))
		assert.Equal(t, 3, len((*filters).LifeStatus))
		assert.Equal(t, 2, len((*filters).CaseCategory))
		assert.Equal(t, 2, len((*filters).Panel))
		assert.Equal(t, 2, len((*filters).CaseType))
	})
}

func Test_GetCaseEntity(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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

func Test_RetrieveCasePatients(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
		members, err := repo.retrieveCasePatients(t.Context(), 1)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*members))

		// Proband first
		assert.Equal(t, "proband", (*members)[0].RelationshipToProband)
		assert.Equal(t, 3, (*members)[0].PatientID)
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
		assert.Equal(t, 1, (*members)[1].PatientID)
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
		assert.Equal(t, 2, (*members)[2].PatientID)
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

func Test_RetrieveCaseTasks(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(database.StarrocksDB{DB: db})
		tasks, err := repo.retrieveCaseTasks(t.Context(), 71)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*tasks))

		assert.Equal(t, 74, (*tasks)[0].ID)
		assert.Equal(t, "radiant_somatic_annotation", (*tasks)[0].TypeCode)
		assert.Equal(t, 1, len((*tasks)[0].Patients))
		assert.True(t, slices.Contains((*tasks)[0].Patients, "proband"))
	})
}
