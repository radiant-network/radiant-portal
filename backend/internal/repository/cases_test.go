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
		assert.Equal(t, "germline_family", (*cases)[0].CaseType)
		assert.Equal(t, true, (*cases)[0].HasVariants)
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

func Test_SearchCases_OnProbandMRN(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.PatientMrnField.GetAlias(),
				Value:     []interface{}{"MRN-283775"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, count, err := repo.SearchCases(query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), *count)
		assert.Len(t, *cases, 1)
		assert.Equal(t, 3, (*cases)[0].ProbandID)
		assert.Equal(t, "MRN-283775", (*cases)[0].ProbandMRN)
	})
}

func Test_SearchCases_OnPatientMRN(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.PatientMrnField.GetAlias(),
				Value:     []interface{}{"MRN-283773"},
			},
		}
		query, err := types.NewListQueryFromCriteria(CasesQueryConfigForTest, allCasesFields, searchCriteria, nil, nil)
		cases, count, err := repo.SearchCases(query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), *count)
		assert.Len(t, *cases, 1)
		assert.Equal(t, 3, (*cases)[0].ProbandID)
		assert.Equal(t, "MRN-283775", (*cases)[0].ProbandMRN)
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
		assert.Equal(t, len((*filters).Status), 7)
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
		assert.Equal(t, "germline_family", (*caseEntity).CaseType)
		assert.Len(t, (*caseEntity).Assays, 3)
		assert.Len(t, (*caseEntity).Members, 3)
		assert.Len(t, (*caseEntity).Tasks, 3)
	})
}

func Test_RetrieveCaseLevelData(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		caseEntity, err := repo.retrieveCaseLevelData(1)
		assert.NoError(t, err)
		assert.Equal(t, 1, (*caseEntity).CaseID)
		assert.Equal(t, 3, (*caseEntity).ProbandID)
		assert.Equal(t, "WGA", (*caseEntity).CaseAnalysisCode)
		assert.Equal(t, "Whole Genome Analysis", (*caseEntity).CaseAnalysisName)
		assert.Equal(t, "germline", (*caseEntity).CaseAnalysisType)
		assert.Equal(t, "2021-09-12 13:08:00 +0000 UTC", (*caseEntity).CreatedOn.String())
		assert.Equal(t, "2021-09-12 13:08:00 +0000 UTC", (*caseEntity).UpdatedOn.String())
		assert.Equal(t, "Felix Laflamme", (*caseEntity).Prescriber)
		assert.Equal(t, "CHUSJ", (*caseEntity).RequestedByCode)
		assert.Equal(t, "Centre hospitalier universitaire Sainte-Justine", (*caseEntity).RequestedByName)
		assert.Equal(t, "CQGC", (*caseEntity).PerformerLabCode)
		assert.Equal(t, "Quebec Clinical Genomic Center", (*caseEntity).PerformerLabName)
		assert.Equal(t, 1, (*caseEntity).RequestID)
		assert.Equal(t, "routine", (*caseEntity).PriorityCode)
		assert.Equal(t, "in_progress", (*caseEntity).StatusCode)
		assert.Equal(t, "MONDO:0700092", (*caseEntity).PrimaryConditionID)
		assert.Equal(t, "neurodevelopmental disorder", (*caseEntity).PrimaryConditionName)
		assert.Equal(t, "Administrative comment", (*caseEntity).Note)
		assert.Equal(t, "N1", (*caseEntity).ProjectCode)
		assert.Equal(t, "NeuroDev Phase I", (*caseEntity).ProjectName)
	})
}

func Test_RetrieveCaseAssays(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		assays, err := repo.retrieveCaseAssays(1)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*assays))

		// Proband first
		assert.Equal(t, "proband", (*assays)[0].RelationshipToProband)
		assert.Equal(t, 1, (*assays)[0].SeqID)
		assert.Equal(t, 22, (*assays)[0].RequestID)
		assert.Equal(t, 3, (*assays)[0].PatientID)
		assert.Equal(t, "affected", (*assays)[0].AffectedStatusCode)
		assert.Equal(t, 1, (*assays)[0].SampleID)
		assert.Equal(t, "S13224", (*assays)[0].SampleSubmitterID)
		assert.Equal(t, "dna", (*assays)[0].SampleTypeCode)
		assert.Equal(t, "normal", (*assays)[0].HistologyCode)
		assert.True(t, (*assays)[0].HasVariants)

		// Affected then non_affected
		assert.Equal(t, "mother", (*assays)[1].RelationshipToProband)
		assert.Equal(t, 2, (*assays)[1].SeqID)
		assert.Equal(t, 23, (*assays)[1].RequestID)
		assert.Equal(t, 1, (*assays)[1].PatientID)
		assert.Equal(t, "affected", (*assays)[1].AffectedStatusCode)
		assert.Equal(t, 2, (*assays)[1].SampleID)
		assert.Equal(t, "S13225", (*assays)[1].SampleSubmitterID)
		assert.Equal(t, "dna", (*assays)[1].SampleTypeCode)
		assert.Equal(t, "normal", (*assays)[1].HistologyCode)
		assert.True(t, (*assays)[1].HasVariants)

		assert.Equal(t, "father", (*assays)[2].RelationshipToProband)
		assert.Equal(t, 3, (*assays)[2].SeqID)
		assert.Equal(t, 24, (*assays)[2].RequestID)
		assert.Equal(t, 2, (*assays)[2].PatientID)
		assert.Equal(t, "non_affected", (*assays)[2].AffectedStatusCode)
		assert.Equal(t, 3, (*assays)[2].SampleID)
		assert.Equal(t, "S13226", (*assays)[2].SampleSubmitterID)
		assert.Equal(t, "dna", (*assays)[2].SampleTypeCode)
		assert.Equal(t, "normal", (*assays)[2].HistologyCode)
		assert.False(t, (*assays)[2].HasVariants)
	})
}

func Test_RetrieveCasePatients(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		members, err := repo.retrieveCasePatients(1)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*members))

		// Proband first
		assert.Equal(t, "proband", (*members)[0].RelationshipToProband)
		assert.Equal(t, 3, (*members)[0].PatientID)
		assert.Equal(t, "affected", (*members)[0].AffectedStatusCode)
		assert.Equal(t, "1973-03-23 00:00:00 +0000 UTC", (*members)[0].DateOfBirth.String())
		assert.Equal(t, "MRN-283775", (*members)[0].Mrn)
		assert.Equal(t, "male", (*members)[0].SexCode)
		assert.Equal(t, "CHUSJ", (*members)[0].ManagingOrganizationCode)
		assert.Equal(t, "Centre hospitalier universitaire Sainte-Justine", (*members)[0].ManagingOrganizationName)
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
		assert.Equal(t, "affected", (*members)[1].AffectedStatusCode)
		assert.Equal(t, "2012-02-03 00:00:00 +0000 UTC", (*members)[1].DateOfBirth.String())
		assert.Equal(t, "MRN-283773", (*members)[1].Mrn)
		assert.Equal(t, "female", (*members)[1].SexCode)
		assert.Equal(t, "CHUSJ", (*members)[1].ManagingOrganizationCode)
		assert.Equal(t, "Centre hospitalier universitaire Sainte-Justine", (*members)[1].ManagingOrganizationName)
		assert.Len(t, (*members)[1].ObservedPhenotypes, 0)
		assert.Len(t, (*members)[1].NonObservedPhenotypes, 0)

		assert.Equal(t, "father", (*members)[2].RelationshipToProband)
		assert.Equal(t, 2, (*members)[2].PatientID)
		assert.Equal(t, "non_affected", (*members)[2].AffectedStatusCode)
		assert.Equal(t, "1970-01-30 00:00:00 +0000 UTC", (*members)[2].DateOfBirth.String())
		assert.Equal(t, "MRN-283774", (*members)[2].Mrn)
		assert.Equal(t, "male", (*members)[2].SexCode)
		assert.Equal(t, "CHUSJ", (*members)[2].ManagingOrganizationCode)
		assert.Equal(t, "Centre hospitalier universitaire Sainte-Justine", (*members)[2].ManagingOrganizationName)
		assert.Len(t, (*members)[2].ObservedPhenotypes, 0)
		assert.Len(t, (*members)[2].NonObservedPhenotypes, 0)
	})
}

func Test_RetrieveCaseTasks(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewCasesRepository(db)
		tasks, err := repo.retrieveCaseTasks(1)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*tasks))

		assert.Equal(t, 1, (*tasks)[0].ID)
		assert.Equal(t, "ngba", (*tasks)[0].TypeCode)
		assert.Equal(t, "2021-10-12 13:08:00 +0000 UTC", (*tasks)[0].CreatedOn.String())
		assert.Equal(t, int64(3), (*tasks)[0].PatientCount)
		assert.Equal(t, 3, len((*tasks)[0].Patients))
		assert.Equal(t, "father", (*tasks)[0].Patients[0])
		assert.Equal(t, "mother", (*tasks)[0].Patients[1])
		assert.Equal(t, "proband", (*tasks)[0].Patients[2])
		assert.Equal(t, 1, len((*tasks)[1].Patients))
		assert.Equal(t, "mother", (*tasks)[1].Patients[0])
		assert.Equal(t, 1, len((*tasks)[2].Patients))
		assert.Equal(t, "mother", (*tasks)[2].Patients[0])
	})
}
