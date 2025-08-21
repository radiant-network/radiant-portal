package repository

import (
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var allDocumentsFields = sliceutils.Map(types.CasesFields, func(value types.Field, index int, slice []types.Field) string {
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
		//assert.Equal(t, "germline", (*cases)[0].CaseAnalysisTypeCode)
		//assert.Equal(t, "MONDO:0700092", (*cases)[0].PrimaryConditionID)
		//assert.Equal(t, "neurodevelopmental disorder", (*cases)[0].PrimaryConditionName)
		//assert.Equal(t, "germline_family", (*cases)[0].CaseType)
		//assert.Equal(t, true, (*cases)[0].HasVariants)
	})
}
