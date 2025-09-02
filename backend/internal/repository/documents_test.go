package repository

import (
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var allDocumentsFields = sliceutils.Map(types.DocumentFields, func(value types.Field, index int, slice []types.Field) string {
	return value.GetAlias()
})

var defaultDocumentFieldsForTest = []types.Field{
	types.DocumentIdField,
}

var DocumentsQueryConfigForTest = types.QueryConfig{
	AllFields:     types.DocumentFields,
	DefaultFields: defaultDocumentFieldsForTest,
	DefaultSort:   types.DocumentsDefaultSort,
	IdField:       types.DocumentIdField,
}

func Test_SearchDocumentsNoFilters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, nil, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(244), *count)

		document204 := (*documents)[0]
		assert.Equal(t, 204, document204.DocumentID)
		assert.Equal(t, "FI0037905.S14786.vcf.gz.tbi", document204.Name)
		assert.Equal(t, "tbi", document204.FormatCode)
		assert.Equal(t, "snv", document204.DataTypeCode)
		assert.Equal(t, 2432696, document204.Size)
		assert.Equal(t, 21, document204.CaseID)
		assert.Equal(t, "CQGC", document204.PerformerLabCode)
		assert.Equal(t, "Quebec Clinical Genomic Center", document204.PerformerLabName)
		assert.Equal(t, "proband", document204.RelationshipToProbandCode)
		assert.Equal(t, 60, document204.PatientID)
		assert.Equal(t, "S14857", document204.SubmitterSampleID)
		assert.Equal(t, 21, document204.TaskID)
		assert.Equal(t, 59, document204.SeqID)
		assert.Equal(t, "5d41402abc4b2a76b9719d911017c795", document204.Hash)
		assert.Equal(t, "A00516_0227", document204.RunAlias)
	})
}

func Test_SearchDocumentsCustomSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, nil, nil, []types.SortBody{{Field: types.DocumentNameField.Name, Order: "desc"}})
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(244), *count)

		document62 := (*documents)[0]
		assert.Equal(t, 62, document62.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnDocumentId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentIdField.GetAlias(),
				Value:     []interface{}{62},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 3)
		assert.Equal(t, int64(3), *count)

		document62 := (*documents)[0]
		assert.Equal(t, 62, document62.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnRunName(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SequencingExperimentRunNameField.GetName(),
				Value:     []interface{}{"1621"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 4)
		assert.Equal(t, int64(4), *count)

		document185 := (*documents)[0]
		assert.Equal(t, 185, document185.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnSampleId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SampleIdField.GetAlias(),
				Value:     []interface{}{12},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 4)
		assert.Equal(t, int64(4), *count)

		document187 := (*documents)[0]
		assert.Equal(t, 187, document187.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnPatientId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SequencingExperimentPatientIdField.GetAlias(),
				Value:     []interface{}{6},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 4)
		assert.Equal(t, int64(4), *count)

		document185 := (*documents)[0]
		assert.Equal(t, 185, document185.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnCaseId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseIdField.GetAlias(),
				Value:     []interface{}{8},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 4)
		assert.Equal(t, int64(4), *count)

		document191 := (*documents)[0]
		assert.Equal(t, 191, document191.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnSeqId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SequencingExperimentIdField.GetAlias(),
				Value:     []interface{}{5},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 4)
		assert.Equal(t, int64(4), *count)

		document185 := (*documents)[0]
		assert.Equal(t, 185, document185.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnTaskId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.TaskHasDocumentTaskIdField.GetName(),
				Value:     []interface{}{2},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(12), *count)

		document185 := (*documents)[0]
		assert.Equal(t, 185, document185.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnProjectId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseProjectIdField.GetName(),
				Value:     []interface{}{1},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(100), *count)

		document192 := (*documents)[0]
		assert.Equal(t, 192, document192.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnPerformerLabCode(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CasePerformerLabCodeField.GetAlias(),
				Value:     []interface{}{"CQGC"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(244), *count)

		document204 := (*documents)[0]
		assert.Equal(t, 204, document204.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnRelationshipToProbandMother(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.FamilyRelationshipToProbandCodeField.GetName(),
				Value:     []interface{}{"mother"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(80), *count)

		document204 := (*documents)[0]
		assert.Equal(t, 204, document204.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnRelationshipToProbandFather(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.FamilyRelationshipToProbandCodeField.GetName(),
				Value:     []interface{}{"father"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(80), *count)

		document204 := (*documents)[0]
		assert.Equal(t, 204, document204.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnRelationshipToProbandProband(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.FamilyRelationshipToProbandCodeField.GetName(),
				Value:     []interface{}{"proband"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(84), *count)

		document204 := (*documents)[0]
		assert.Equal(t, 204, document204.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnFormatCode(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentFormatCodeField.GetName(),
				Value:     []interface{}{"vcf"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(61), *count)

		document203 := (*documents)[0]
		assert.Equal(t, 203, document203.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnDataTypeCode(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentDataTypeCodeField.GetName(),
				Value:     []interface{}{"snv"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(122), *count)

		document204 := (*documents)[0]
		assert.Equal(t, 204, document204.DocumentID)
	})
}

func Test_Documents_SearchById(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		autocompleteResult, err := repo.SearchById("1", 10)
		assert.NoError(t, err)
		assert.Equal(t, len(*autocompleteResult), 10)
		assert.Equal(t, (*autocompleteResult)[0].Type, "case_id")
		assert.Equal(t, (*autocompleteResult)[0].Value, "1")
		assert.Equal(t, (*autocompleteResult)[1].Type, "document_id")
		assert.Equal(t, (*autocompleteResult)[1].Value, "1")
		assert.Equal(t, (*autocompleteResult)[2].Type, "patient_id")
		assert.Equal(t, (*autocompleteResult)[2].Value, "1")
		assert.Equal(t, (*autocompleteResult)[3].Type, "sample_id")
		assert.Equal(t, (*autocompleteResult)[3].Value, "1")
		assert.Equal(t, (*autocompleteResult)[4].Type, "seq_id")
		assert.Equal(t, (*autocompleteResult)[4].Value, "1")
		assert.Equal(t, (*autocompleteResult)[5].Type, "task_id")
		assert.Equal(t, (*autocompleteResult)[5].Value, "1")
		assert.Equal(t, (*autocompleteResult)[6].Type, "case_id")
		assert.Equal(t, (*autocompleteResult)[6].Value, "10")
		assert.Equal(t, (*autocompleteResult)[7].Type, "document_id")
		assert.Equal(t, (*autocompleteResult)[7].Value, "10")
		assert.Equal(t, (*autocompleteResult)[8].Type, "patient_id")
		assert.Equal(t, (*autocompleteResult)[8].Value, "10")
		assert.Equal(t, (*autocompleteResult)[9].Type, "sample_id")
		assert.Equal(t, (*autocompleteResult)[9].Value, "10")
	})
}
