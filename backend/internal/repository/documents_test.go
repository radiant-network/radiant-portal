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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, nil, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(148), *count)

		document270 := (*documents)[0]
		assert.Equal(t, 270, document270.DocumentID)
		assert.Equal(t, "SRX1091647-T.recal.cram", document270.Name)
		assert.Equal(t, "cram", document270.FormatCode)
		assert.Equal(t, "alignment", document270.DataTypeCode)
		assert.Equal(t, 49126489623, document270.Size)
		assert.Equal(t, 71, document270.CaseID)
		assert.Equal(t, "CQGC", document270.DiagnosisLabCode)
		assert.Equal(t, "Quebec Clinical Genomic Center", document270.DiagnosisLabName)
		assert.Equal(t, "proband", document270.RelationshipToProbandCode)
		assert.Equal(t, 62, document270.PatientID)
		assert.Equal(t, "SRX1091647", document270.SubmitterSampleID)
		assert.Equal(t, 76, document270.TaskID)
		assert.Equal(t, 74, document270.SeqID)
		assert.Equal(t, "72a59834feee767b29f6279562f164b5-9371", document270.Hash)
		assert.Equal(t, "TSRX1091647_1679", document270.RunAlias)
		assert.NotNil(t, document270.CreatedOn)
	})
}

func Test_SearchDocumentsCustomSort(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, nil, nil, []types.SortBody{{Field: types.DocumentNameField.Name, Order: "asc"}})
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(148), *count)

		document135 := (*documents)[0]
		assert.Equal(t, 135, document135.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnDocumentId(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentIdField.GetAlias(),
				Value:     []interface{}{257},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 3)
		assert.Equal(t, int64(3), *count)

		document257 := (*documents)[0]
		assert.Equal(t, 257, document257.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnDocumentName(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentNameField.GetName(),
				Value:     []interface{}{"FI0005566.S14029.vcf.gz"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 3)
		assert.Equal(t, int64(3), *count)

		document257 := (*documents)[0]
		assert.Equal(t, 257, document257.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnRunName(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SequencingExperimentRunNameField.GetName(),
				Value:     []interface{}{"1621"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

		document127 := (*documents)[0]
		assert.Equal(t, 127, document127.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnSampleId(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SampleIdField.GetAlias(),
				Value:     []interface{}{12},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

		document239 := (*documents)[0]
		assert.Equal(t, 239, document239.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnPatientId(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SamplePatientIdField.GetAlias(),
				Value:     []interface{}{6},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

		document127 := (*documents)[0]
		assert.Equal(t, 127, document127.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnCaseId(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseIdField.GetAlias(),
				Value:     []interface{}{8},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 6)
		assert.Equal(t, int64(6), *count)

		document264 := (*documents)[0]
		assert.Equal(t, 264, document264.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnSeqId(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.SequencingExperimentIdField.GetAlias(),
				Value:     []interface{}{5},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 2)
		assert.Equal(t, int64(2), *count)

		document127 := (*documents)[0]
		assert.Equal(t, 127, document127.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnTaskId(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.TaskHasDocumentTaskIdField.GetName(),
				Value:     []interface{}{2},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 3)
		assert.Equal(t, int64(3), *count)

		document252 := (*documents)[0]
		assert.Equal(t, 252, document252.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnProjectCode(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.ProjectCodeField.GetAlias(),
				Value:     []interface{}{"N1"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(70), *count)

		document270 := (*documents)[0]
		assert.Equal(t, 270, document270.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnDiagnosisLabCode(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.CaseDiagnosisLabCodeField.GetAlias(),
				Value:     []interface{}{"CQGC"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(148), *count)

		document270 := (*documents)[0]
		assert.Equal(t, 270, document270.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnRelationshipToProbandMother(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.FamilyRelationshipToProbandCodeField.GetName(),
				Value:     []interface{}{"mother"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(46), *count)

		document257 := (*documents)[0]
		assert.Equal(t, 257, document257.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnRelationshipToProbandFather(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.FamilyRelationshipToProbandCodeField.GetName(),
				Value:     []interface{}{"father"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(46), *count)

		document257 := (*documents)[0]
		assert.Equal(t, 257, document257.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnRelationshipToProbandProband(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.FamilyRelationshipToProbandCodeField.GetName(),
				Value:     []interface{}{"proband"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(56), *count)

		document270 := (*documents)[0]
		assert.Equal(t, 270, document270.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnFormatCode(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentFormatCodeField.GetName(),
				Value:     []interface{}{"vcf"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(71), *count)

		document266 := (*documents)[0]
		assert.Equal(t, 266, document266.DocumentID)
	})
}

func Test_SearchDocumentsFilterOnDataTypeCode(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		searchCriteria := []types.SearchCriterion{
			{
				FieldName: types.DocumentDataTypeCodeField.GetName(),
				Value:     []interface{}{"snv"},
			},
		}
		query, err := types.NewListQueryFromCriteria(DocumentsQueryConfigForTest, allDocumentsFields, searchCriteria, nil, nil)
		documents, count, err := repo.SearchDocuments(t.Context(), query)
		assert.NoError(t, err)
		assert.Len(t, *documents, 10)
		assert.Equal(t, int64(82), *count)

		document266 := (*documents)[0]
		assert.Equal(t, 266, document266.DocumentID)
	})
}

func Test_Documents_SearchById(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		autocompleteResult, err := repo.SearchById(t.Context(), "1", 10)
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		filters, err := repo.GetDocumentsFilters(t.Context(), true)
		assert.NoError(t, err)
		assert.Equal(t, 2, len((*filters).Project))
		assert.Equal(t, 2, len((*filters).DiagnosisLab))
		assert.Equal(t, 7, len((*filters).RelationshipToProband))
		assert.Equal(t, 13, len((*filters).Format))
		assert.Equal(t, 15, len((*filters).DataType))
	})
}

func Test_GetDocumentsFilters_WithoutLabAndProject(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		filters, err := repo.GetDocumentsFilters(t.Context(), false)
		assert.NoError(t, err)
		assert.Nil(t, (*filters).Project)
		assert.Nil(t, (*filters).DiagnosisLab)
		assert.Equal(t, 7, len((*filters).RelationshipToProband))
		assert.Equal(t, 13, len((*filters).Format))
		assert.Equal(t, 15, len((*filters).DataType))
	})
}

func Test_GetById_Success(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		document, err := repo.GetById(t.Context(), 264)
		assert.NoError(t, err)
		assert.NotNil(t, document)
		assert.Equal(t, 264, document.ID)
		assert.Equal(t, "FI0005568.S14359.vcf.gz", document.Name)
		assert.Equal(t, "vcf", document.FileFormatCode)
	})
}

func Test_GetById_NotFound(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		document, err := repo.GetById(t.Context(), 999999)
		assert.NoError(t, err)
		assert.Nil(t, document)
	})
}

func Test_GetById_FilteredIndexFile(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		var indexDoc Document
		db.Table("document doc").Where("doc.format_code IN ('crai', 'tbi')").First(&indexDoc)
		if indexDoc.ID > 0 {
			document, err := repo.GetById(t.Context(), indexDoc.ID)
			assert.NoError(t, err)
			assert.Nil(t, document)
		}
	})
}

func Test_GetByUrl_Success(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		document, err := repo.GetDocumentByUrl(t.Context(), "s3://cqdg-prod-file-workspace/Postprocessing/exomiser/SH032.exomiser.vcf.gz.tbi")
		assert.NoError(t, err)
		assert.NotNil(t, document)
		assert.Equal(t, 236, document.ID)
		assert.Equal(t, "SH032.exomiser.vcf.gz.tbi", document.Name)
		assert.Equal(t, "tbi", document.FileFormatCode)
	})
}

func Test_GetByUrl_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(db)
		document, err := repo.GetDocumentByUrl(t.Context(), "s3://radiant-data-test/case_999999/Fi9999999/S99999/Fi9999999.S99999.vcf.gz")
		assert.NoError(t, err)
		assert.Nil(t, document)
	})
}
