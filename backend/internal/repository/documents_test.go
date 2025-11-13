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
		assert.Equal(t, int64(140), *count)

		document262 := (*documents)[0]
		assert.Equal(t, 262, document262.DocumentID)
		assert.Equal(t, "HG00513.recal.metrics.csv", document262.Name)
		assert.Equal(t, "csv", document262.FormatCode)
		assert.Equal(t, "snv", document262.DataTypeCode)
		assert.Equal(t, 11724, document262.Size)
		assert.Equal(t, 8, document262.CaseID)
		assert.Equal(t, "CQGC", document262.DiagnosisLabCode)
		assert.Equal(t, "Quebec Clinical Genomic Center", document262.DiagnosisLabName)
		assert.Equal(t, "proband", document262.RelationshipToProbandCode)
		assert.Equal(t, 22, document262.PatientID)
		assert.Equal(t, "S14069", document262.SubmitterSampleID)
		assert.Equal(t, 47, document262.TaskID)
		assert.Equal(t, 22, document262.SeqID)
		assert.Equal(t, "5d41402abc4b2a76b9719d911017c853", document262.Hash)
		assert.Equal(t, "A00516_0190", document262.RunAlias)
		assert.NotNil(t, document262.CreatedOn)
	})
}

func Test_SearchDocumentsCustomSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, nil, nil, []types.SortBody{{Field: types.DocumentNameField.Name, Order: "asc"}})
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(140), *count)

		document135 := (*documents)[0]
		assert.Equal(t, 135, document135.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnDocumentId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentIdField.GetAlias(),
				Value:     []interface{}{257},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 3)
		assert.Equal(t, int64(3), *count)

		document257 := (*documents)[0]
		assert.Equal(t, 257, document257.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnDocumentName(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentNameField.GetName(),
				Value:     []interface{}{"FI0005566.S14029.vcf.gz"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 3)
		assert.Equal(t, int64(3), *count)

		document257 := (*documents)[0]
		assert.Equal(t, 257, document257.DocumentID)
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
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

		document127 := (*documents)[0]
		assert.Equal(t, 127, document127.DocumentID)
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
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

		document239 := (*documents)[0]
		assert.Equal(t, 239, document239.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnPatientId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SamplePatientIdField.GetAlias(),
				Value:     []interface{}{6},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

		document127 := (*documents)[0]
		assert.Equal(t, 127, document127.DocumentID)
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
		assert.Len(t, *documents, 5)
		assert.Equal(t, int64(5), *count)

		document262 := (*documents)[0]
		assert.Equal(t, 262, document262.DocumentID)
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
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

		document127 := (*documents)[0]
		assert.Equal(t, 127, document127.DocumentID)
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
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

		document247 := (*documents)[0]
		assert.Equal(t, 247, document247.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnProjectCode(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.ProjectCodeField.GetAlias(),
				Value:     []interface{}{"N1"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(68), *count)

		document262 := (*documents)[0]
		assert.Equal(t, 262, document262.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnDiagnosisLabCode(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseDiagnosisLabCodeField.GetAlias(),
				Value:     []interface{}{"CQGC"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(140), *count)

		document262 := (*documents)[0]
		assert.Equal(t, 262, document262.DocumentID)
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
		assert.Equal(t, int64(45), *count)

		document257 := (*documents)[0]
		assert.Equal(t, 257, document257.DocumentID)
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
		assert.Equal(t, int64(45), *count)

		document257 := (*documents)[0]
		assert.Equal(t, 257, document257.DocumentID)
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
		assert.Equal(t, int64(50), *count)

		document262 := (*documents)[0]
		assert.Equal(t, 262, document262.DocumentID)
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
		assert.Equal(t, int64(64), *count)

		document257 := (*documents)[0]
		assert.Equal(t, 257, document257.DocumentID)
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
		assert.Equal(t, int64(76), *count)

		document262 := (*documents)[0]
		assert.Equal(t, 262, document262.DocumentID)
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
		assert.Equal(t, (*autocompleteResult)[7].Type, "patient_id")
		assert.Equal(t, (*autocompleteResult)[7].Value, "10")
		assert.Equal(t, (*autocompleteResult)[8].Type, "sample_id")
		assert.Equal(t, (*autocompleteResult)[8].Value, "10")
		assert.Equal(t, (*autocompleteResult)[9].Type, "seq_id")
		assert.Equal(t, (*autocompleteResult)[9].Value, "10")
	})
}

func Test_GetDocumentsFilters_WithLabAndProject(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentDataTypeCodeField.GetAlias(),
				Value:     []interface{}{"snv"},
			},
		}
		query, err := types.NewAggregationQueryFromCriteria(searchCriteria, DocumentsQueryConfigForTest.AllFields)
		filters, err := repo.GetDocumentsFilters(query, true)
		assert.NoError(t, err)
		assert.Equal(t, 2, len((*filters).Project))
		assert.Equal(t, 2, len((*filters).DiagnosisLab))
		assert.Equal(t, 6, len((*filters).RelationshipToProband))
		assert.Equal(t, 13, len((*filters).Format))
		assert.Equal(t, 15, len((*filters).DataType))
	})
}

func Test_GetDocumentsFilters_WithoutLabAndProject(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentDataTypeCodeField.GetAlias(),
				Value:     []interface{}{"snv"},
			},
		}
		query, err := types.NewAggregationQueryFromCriteria(searchCriteria, DocumentsQueryConfigForTest.AllFields)
		filters, err := repo.GetDocumentsFilters(query, false)
		assert.NoError(t, err)
		assert.Nil(t, (*filters).Project)
		assert.Nil(t, (*filters).DiagnosisLab)
		assert.Equal(t, 6, len((*filters).RelationshipToProband))
		assert.Equal(t, 13, len((*filters).Format))
		assert.Equal(t, 15, len((*filters).DataType))
	})
}
