package repository

import (
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var allCNVOccurrencesFields = sliceutils.Map(types.GermlineCNVOccurrencesFields, func(value types.Field, index int, slice []types.Field) string {
	return value.Name
})

var defaultCNVOccurrencesFieldsForTest = []types.Field{
	types.GermlineCNVNameField,
}

var CNVOccurrencesQueryConfigForTest = types.QueryConfig{
	AllFields:     types.GermlineCNVOccurrencesFields,
	DefaultFields: defaultCNVOccurrencesFieldsForTest,
	DefaultSort:   nil,
	IdField:       types.GermlineCNVNameField,
}

func Test_GermlineCNV_GetOccurrences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)
		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqID)
		}
	})
}

func Test_GermlineCNV_GetOccurrences_QualityFilter(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "quality", Value: []interface{}{0.9}}},
			},
			Op: "and",
		}

		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, sqon, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqID)
			assert.Equal(t, "CNV1", occurrences[0].Name)
		}
	})
}

func Test_GermlineCNV_GetOccurrences_PanelFilter(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
			},
			Op: "and",
		}

		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, sqon, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqID)
			assert.Equal(t, "CNV1", occurrences[0].Name)
		}
	})
}

func Test_GermlineCNV_GetOccurrences_PaginationAndSorting(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)

		sortedBody := []types.SortBody{
			{
				Field: "sm",
				Order: "asc",
			},
		}

		pagination := &types.Pagination{
			Limit:  1,
			Offset: 0,
		}

		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, nil, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqID)
			assert.Equal(t, "CNV2", occurrences[0].Name)
		}

		pagination = &types.Pagination{
			Limit:  1,
			Offset: 1,
		}

		query, err = types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, nil, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err = repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqID)
			assert.Equal(t, "CNV1", occurrences[0].Name)
		}
	})
}

func Test_GermlineCNV_CountOccurrences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)
		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, nil, nil, nil)
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(1, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), count)
	})
}

func Test_GermlineCNV_CountOccurrences_With_Filtering(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "quality", Value: []interface{}{0.9}}},
			},
			Op: "and",
		}

		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, sqon, nil, nil)
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(1, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), count)
	})
}

func Test_GermlineCNV_CountOccurrences_PanelFilter(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
			},
			Op: "and",
		}

		query, err := types.NewListQueryFromSqon(CNVOccurrencesQueryConfigForTest, allCNVOccurrencesFields, sqon, nil, nil)
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(1, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), count)
	})
}

func Test_GermlineCNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Gene_Panel(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)
		query, err := types.NewAggregationQueryFromSqon("omim_gene_panel", nil, CNVOccurrencesQueryConfigForTest.AllFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(2, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 4) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "panel4", aggregate[0].Bucket)
			assert.EqualValues(t, 2, aggregate[1].Count)
			assert.Equal(t, "panel2", aggregate[1].Bucket)
			assert.EqualValues(t, 2, aggregate[2].Count)
			assert.Equal(t, "panel3", aggregate[2].Bucket)
			assert.EqualValues(t, 3, aggregate[3].Count)
			assert.Equal(t, "panel1", aggregate[3].Bucket)
		}
	})
}

func Test_GermlineCNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Cytoband(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)
		query, err := types.NewAggregationQueryFromSqon("cytoband", nil, CNVOccurrencesQueryConfigForTest.AllFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(2, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 2) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "p2", aggregate[0].Bucket)
			assert.EqualValues(t, 2, aggregate[1].Count)
			assert.Equal(t, "p1", aggregate[1].Bucket)
		}
	})
}

func Test_GermlineCNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Cytoband_Filter_By_Panel(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineCNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel4"}}},
			},
			Op: "and",
		}
		query, err := types.NewAggregationQueryFromSqon("cytoband", sqon, CNVOccurrencesQueryConfigForTest.AllFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(2, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 2) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "p1", aggregate[0].Bucket)
			assert.EqualValues(t, 1, aggregate[1].Count)
			assert.Equal(t, "p2", aggregate[1].Bucket)

		}
	})
}
