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
		assert.Equal(t, int64(125), *count)

		document203 := (*documents)[0]
		assert.Equal(t, 203, document203.DocumentID)
		assert.Equal(t, "FI0037905.S14786.vcf.gz", document203.Name)
		assert.Equal(t, "vcf", document203.FormatCode)
		assert.Equal(t, "snv", document203.DataTypeCode)
		assert.Equal(t, 325362647, document203.Size)
		assert.Equal(t, 20, document203.CaseID)
		assert.Equal(t, "CQGC", document203.DiagnosisLabCode)
		assert.Equal(t, "Quebec Clinical Genomic Center", document203.DiagnosisLabName)
		assert.Equal(t, "proband", document203.RelationshipToProbandCode)
		assert.Equal(t, 58, document203.PatientID)
		assert.Equal(t, "S14786", document203.SubmitterSampleID)
		assert.Equal(t, 20, document203.TaskID)
		assert.Equal(t, 56, document203.SeqID)
		assert.Equal(t, "5d41402abc4b2a76b9719d911017c794", document203.Hash)
		assert.Equal(t, "A00516_0224", document203.RunAlias)
		assert.NotNil(t, document203.CreatedOn)
	})
}

func Test_SearchDocumentsCustomSort(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, nil, nil, []types.SortBody{{Field: types.DocumentNameField.Name, Order: "asc"}})
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(125), *count)

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
				Value:     []interface{}{203},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 3)
		assert.Equal(t, int64(3), *count)

		document203 := (*documents)[0]
		assert.Equal(t, 203, document203.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnDocumentName(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentNameField.GetName(),
				Value:     []interface{}{"FI0037905.S14786.vcf.gz"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 3)
		assert.Equal(t, int64(3), *count)

		document203 := (*documents)[0]
		assert.Equal(t, 203, document203.DocumentID)
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
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

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
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

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
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

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
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

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
		assert.Len(t, *documents, 6)
		assert.Equal(t, int64(6), *count)

		document185 := (*documents)[0]
		assert.Equal(t, 185, document185.DocumentID)
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
		assert.Equal(t, int64(53), *count)

		document191 := (*documents)[0]
		assert.Equal(t, 191, document191.DocumentID)
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
		assert.Equal(t, int64(125), *count)

		document203 := (*documents)[0]
		assert.Equal(t, 203, document203.DocumentID)
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
		assert.Equal(t, int64(40), *count)

		document203 := (*documents)[0]
		assert.Equal(t, 203, document203.DocumentID)
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
		assert.Equal(t, int64(40), *count)

		document203 := (*documents)[0]
		assert.Equal(t, 203, document203.DocumentID)
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
		assert.Equal(t, int64(42), *count)

		document203 := (*documents)[0]
		assert.Equal(t, 203, document203.DocumentID)
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
		assert.Equal(t, int64(61), *count)

		document203 := (*documents)[0]
		assert.Equal(t, 203, document203.DocumentID)
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
