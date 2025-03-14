package repository

import (
	"os"
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/Ferlab-Ste-Justine/radiant-api/test/testutils"
	"github.com/Goldziher/go-utils/sliceutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var allFields = sliceutils.Map(types.OccurrencesFields, func(value types.Field, index int, slice []types.Field) string {
	return value.Name
})

func Test_CheckDatabaseConnection_Return_up(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		status := repo.CheckDatabaseConnection()
		assert.Equal(t, "up", status)

	})
}

func Test_GetOccurrences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		query, err := types.NewListQuery(allFields, nil, types.OccurrencesFields, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqId)
			assert.EqualValues(t, 1000, occurrences[0].LocusId)
			assert.Equal(t, "PASS", occurrences[0].Filter)
			assert.Equal(t, "HET", occurrences[0].Zygosity)
			assert.Equal(t, 0.99, occurrences[0].Pf)
			assert.Equal(t, 3, occurrences[0].Pc)
			assert.Equal(t, 0.01, occurrences[0].Af)
			assert.Equal(t, "hgvsg1", occurrences[0].Hgvsg)
			assert.Equal(t, 1.0, occurrences[0].AdRatio)
			assert.Equal(t, "class1", occurrences[0].VariantClass)
		}
	})
}

func Test_GetOccurrences_Return_Selected_Columns_Only(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		selectedFields := []string{"seq_id", "locus_id", "ad_ratio", "filter"}

		query, err := types.NewListQuery(selectedFields, nil, types.OccurrencesFields, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqId)
			assert.EqualValues(t, 1000, occurrences[0].LocusId)
			assert.Equal(t, "PASS", occurrences[0].Filter)
			assert.Empty(t, occurrences[0].VepImpact)
		}
	})
}

func Test_GetOccurrencesReturn_Default_Column_If_No_One_Specified(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {

		repo := NewStarrocksRepository(db)
		query, err := types.NewListQuery(nil, nil, types.OccurrencesFields, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 1)

		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, 1000, occurrences[0].LocusId)
			assert.Empty(t, occurrences[0].Filter)
		}
	})
}

func Test_GetOccurrences_Return_A_Proper_Array_Column(t *testing.T) {
	testutils.ParallelTestWithDb(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		selectedFields := []string{"clinvar"}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		query, err := types.NewListQuery(selectedFields, nil, types.OccurrencesFields, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 4) {

			assert.Equal(t, types.JsonArray[string]{"Likely_Pathogenic", "Pathogenic"}, occurrences[0].Clinvar)

		}
	})
}

func Test_CountOccurrences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		count, err := repo.CountOccurrences(1, nil)
		assert.NoError(t, err)
		assert.EqualValues(t, 1, count)
	})
}

func Test_CountOccurrences_Return_Count_That_Match_Filters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {

		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "filter",
				Value: "PASS",
			},

			Op: "in",
		}
		query, err := types.NewCountQuery(sqon, types.OccurrencesFields)
		assert.NoError(t, err)
		c, err2 := repo.CountOccurrences(1, query)

		if assert.NoError(t, err2) {
			assert.EqualValues(t, 1, c)
		}
	})
}

func Test_GetOccurrences_Return_Occurrences_That_Match_Filters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {

		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "filter",
				Value: "PASS",
			},
			Op: "in",
		}
		query, err := types.NewListQuery(allFields, sqon, types.OccurrencesFields, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqId)
			assert.EqualValues(t, 1000, occurrences[0].LocusId)
			assert.Equal(t, "PASS", occurrences[0].Filter)
			assert.Equal(t, "HET", occurrences[0].Zygosity)
			assert.Equal(t, 0.99, occurrences[0].Pf)
			assert.Equal(t, 3, occurrences[0].Pc)
			assert.Equal(t, 0.01, occurrences[0].Af)
			assert.Equal(t, "hgvsg1", occurrences[0].Hgvsg)
			assert.Equal(t, 1.0, occurrences[0].AdRatio)
			assert.Equal(t, "class1", occurrences[0].VariantClass)
		}
	})
}

func Test_GetOccurrences_Return_List_Occurrences_Matching_Array(t *testing.T) {
	testutils.ParallelTestWithDb(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "clinvar",
				Value: "Pathogenic",
			},

			Op: "in",
		}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		selectedFields := []string{"locus_id", "clinvar"}

		query, err := types.NewListQuery(selectedFields, sqon, types.OccurrencesFields, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 2) {

			assert.Equal(t, types.JsonArray[string]{"Likely_Pathogenic", "Pathogenic"}, occurrences[0].Clinvar)
			assert.EqualValues(t, 1000, occurrences[0].LocusId)
			assert.Equal(t, types.JsonArray[string]{"Pathogenic"}, occurrences[1].Clinvar)
			assert.EqualValues(t, 1001, occurrences[1].LocusId)

		}
	})
}

func Test_GetOccurrences_Return_List_Occurrences_Matching_Array_When_All(t *testing.T) {
	testutils.ParallelTestWithDb(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "clinvar",
				Value: []interface{}{"Pathogenic", "Likely_Pathogenic"},
			},

			Op: "all",
		}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		selectedFields := []string{"locus_id", "clinvar"}

		query, err := types.NewListQuery(selectedFields, sqon, types.OccurrencesFields, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {

			assert.Equal(t, types.JsonArray[string]{"Likely_Pathogenic", "Pathogenic"}, occurrences[0].Clinvar)
			assert.EqualValues(t, 1000, occurrences[0].LocusId)

		}
	})
}

func Test_GetOccurrences_Return_N_Occurrences_When_Limit_Specified(t *testing.T) {
	testutils.ParallelTestWithDb(t, "pagination", func(t *testing.T, db *gorm.DB) {

		repo := NewStarrocksRepository(db)

		pagination := &types.Pagination{
			Limit:  5,
			Offset: 0,
		}
		query, err := types.NewListQuery(nil, nil, types.OccurrencesFields, pagination, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 5)
	})
}

func Test_GetOccurrences_Return_Expected_Occurrences_When_Limit_And_Offset_Specified(t *testing.T) {
	testutils.ParallelTestWithDb(t, "pagination", func(t *testing.T, db *gorm.DB) {

		repo := NewStarrocksRepository(db)

		sortedBody := []types.SortBody{
			{
				Field: "pf",
				Order: "desc",
			},
		}
		pagination := &types.Pagination{
			Limit:  12,
			Offset: 5,
		}

		query, err := types.NewListQuery(allFields, nil, types.OccurrencesFields, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 12) {
			assert.EqualValues(t, 1023, occurrences[0].LocusId)
			assert.EqualValues(t, 1012, occurrences[len(occurrences)-1].LocusId)
		}
	})
}

func Test_GetOccurrences_Return_Expected_Occurrences_When_Limit_And_PageIndex_Specified(t *testing.T) {
	testutils.ParallelTestWithDb(t, "pagination", func(t *testing.T, db *gorm.DB) {

		repo := NewStarrocksRepository(db)

		sortedBody := []types.SortBody{
			{
				Field: "pf",
				Order: "desc",
			},
		}
		pagination := &types.Pagination{
			Limit:     12,
			PageIndex: 1,
		}

		query, err := types.NewListQuery(allFields, nil, types.OccurrencesFields, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 12) {
			assert.EqualValues(t, 1016, occurrences[0].LocusId)
			assert.EqualValues(t, 1005, occurrences[len(occurrences)-1].LocusId)
		}
	})
}

func Test_GetOccurrences_Return_Expected_Occurrences_When_Filter_By_Impact_Score(t *testing.T) {
	testutils.ParallelTestWithDb(t, "consequence", func(t *testing.T, db *gorm.DB) {

		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "impact_score",
				Value: 2,
			},

			Op: ">",
		}
		sortedBody := []types.SortBody{
			{
				Field: "locus_id",
				Order: "asc",
			},
		}

		query, err := types.NewListQuery(allFields, sqon, types.OccurrencesFields, nil, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 5) {
			assert.EqualValues(t, 1000, occurrences[0].LocusId)
			assert.EqualValues(t, 1008, occurrences[len(occurrences)-1].LocusId)
		}
	})
}

func Test_GetOccurrences_Return_Expected_Occurrences_When_Filter_By_Impact_ScoreAnd_Quality(t *testing.T) {
	testutils.ParallelTestWithDb(t, "consequence", func(t *testing.T, db *gorm.DB) {

		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: &types.LeafContent{Field: "impact_score", Value: 2}},
				{Op: ">", Content: &types.LeafContent{Field: "genotype_quality", Value: 50}},
			},
			Op: "and",
		}
		sortedBody := []types.SortBody{
			{
				Field: "locus_id",
				Order: "asc",
			},
		}

		query, err := types.NewListQuery(allFields, sqon, types.OccurrencesFields, nil, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, 1000, occurrences[0].LocusId)
		}
	})
}

func Test_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Zygosity(t *testing.T) {
	testutils.ParallelTestWithDb(t, "aggregation", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		query, err := types.NewAggregationQuery("zygosity", nil, types.OccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 2) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "HOM", aggregate[0].Bucket)
			assert.EqualValues(t, 3, aggregate[1].Count)
			assert.Equal(t, "HET", aggregate[1].Bucket)
		}
	})
}

func Test_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Zygosity_With_Filter(t *testing.T) {
	testutils.ParallelTestWithDb(t, "aggregation", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: types.LeafContent{
				Field: "filter",
				Value: "PASS",
			},
			Op: "in",
		}
		query, err := types.NewAggregationQuery("zygosity", sqon, types.OccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 2) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "HOM", aggregate[0].Bucket)
			assert.EqualValues(t, 2, aggregate[1].Count)
			assert.Equal(t, "HET", aggregate[1].Bucket)
		}
	})
}

func Test_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Zygosity_With_Filter_But_Ignore_Self_Filter(t *testing.T) {
	testutils.ParallelTestWithDb(t, "aggregation", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: &types.LeafContent{Field: "filter", Value: "PASS"}},
				{Op: "in", Content: &types.LeafContent{Field: "zygosity", Value: "HOM"}},
			},
			Op: "and",
		}
		query, err := types.NewAggregationQuery("zygosity", sqon, types.OccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 2) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "HOM", aggregate[0].Bucket)
			assert.EqualValues(t, 2, aggregate[1].Count)
			assert.Equal(t, "HET", aggregate[1].Bucket)
		}
	})
}

func Test_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Clinvar(t *testing.T) {
	testutils.ParallelTestWithDb(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		query, err := types.NewAggregationQuery("clinvar", nil, types.OccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 3) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "Benign", aggregate[0].Bucket)
			assert.EqualValues(t, 1, aggregate[1].Count)
			assert.Equal(t, "Likely_Pathogenic", aggregate[1].Bucket)
			assert.EqualValues(t, 2, aggregate[2].Count)
			assert.Equal(t, "Pathogenic", aggregate[2].Bucket)
		}
	})
}

func Test_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Impact_Score(t *testing.T) {
	testutils.ParallelTestWithDb(t, "consequence", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		query, err := types.NewAggregationQuery("impact_score", nil, types.OccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(1, query)
		assert.NoError(t, err)

		if assert.Len(t, aggregate, 3) {
			assert.Equal(t, "4", aggregate[0].Bucket)
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "3", aggregate[1].Bucket)
			assert.EqualValues(t, 5, aggregate[1].Count)
			assert.Equal(t, "1", aggregate[2].Bucket)
			assert.EqualValues(t, 7, aggregate[2].Count)
		}
	})
}

func Test_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Impact_Score_Combined_With_Filter(t *testing.T) {
	testutils.ParallelTestWithDb(t, "consequence", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "filter", Value: "PASS"}},
				{Op: ">", Content: types.LeafContent{Field: "impact_score", Value: 2}},
			},
			Op: "and",
		}
		query, err := types.NewAggregationQuery("impact_score", sqon, types.OccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(1, query)
		assert.NoError(t, err)

		if assert.Len(t, aggregate, 3) {
			assert.Equal(t, "4", aggregate[0].Bucket)
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "3", aggregate[1].Bucket)
			assert.EqualValues(t, 4, aggregate[1].Count)
			assert.Equal(t, "1", aggregate[2].Bucket)
			assert.EqualValues(t, 7, aggregate[2].Count)
		}
	})
}

func Test_GetOccurrences_Return_List_Occurrences_Matching_Gene_panel(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: types.LeafContent{
				Field: "omim_gene_panel",
				Value: []interface{}{"panel1", "panel2"},
			},
			Op: "in",
		}

		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		selectedFields := []string{"locus_id"}

		query, err := types.NewListQuery(selectedFields, sqon, types.OccurrencesFields, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 3) {
			assert.EqualValues(t, 1000, occurrences[0].LocusId)
			assert.EqualValues(t, 1001, occurrences[1].LocusId)
			assert.EqualValues(t, 1002, occurrences[2].LocusId)

		}
	})
}

func Test_GetOccurrences_Return_List_Occurrences_Matching_Gene_panel_And_Impact_Score(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "impact_score", Value: 2}},
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
			},
			Op: "and",
		}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		selectedFields := []string{"locus_id"}

		query, err := types.NewListQuery(selectedFields, sqon, types.OccurrencesFields, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 2) {
			assert.EqualValues(t, 1000, occurrences[0].LocusId)
			assert.EqualValues(t, 1002, occurrences[1].LocusId)

		}
	})
}

func Test_GetOccurrences_Return_List_Occurrences_Matching_Multiple_Gene_panel_And_Impact_Score(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "impact_score", Value: 2}},
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
				{Op: "in", Content: types.LeafContent{Field: "hpo_gene_panel", Value: []interface{}{"hpo_panel1"}}},
			},
			Op: "and",
		}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		selectedFields := []string{"locus_id"}

		query, err := types.NewListQuery(selectedFields, sqon, types.OccurrencesFields, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, 1000, occurrences[0].LocusId)

		}
	})
}

func Test_CountOccurrences_Return_Number_Occurrences_Matching_Multiple_Gene_panel_And_Impact_Score(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "impact_score", Value: 2}},
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
				{Op: "in", Content: types.LeafContent{Field: "hpo_gene_panel", Value: []interface{}{"hpo_panel1"}}},
			},
			Op: "and",
		}

		query, err := types.NewCountQuery(sqon, types.OccurrencesFields)
		assert.NoError(t, err)
		c, err := repo.CountOccurrences(1, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 1, c)
	})
}

func Test_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Gene_Panel(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		query, err := types.NewAggregationQuery("omim_gene_panel", nil, types.OccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 4) {
			assert.EqualValues(t, 2, aggregate[0].Count)
			assert.Equal(t, "panel2", aggregate[0].Bucket)
			assert.EqualValues(t, 2, aggregate[1].Count)
			assert.Equal(t, "panel3", aggregate[1].Bucket)
			assert.EqualValues(t, 3, aggregate[2].Count)
			assert.Equal(t, "panel1", aggregate[2].Bucket)
			assert.EqualValues(t, 10, aggregate[3].Count)
			assert.Equal(t, "panel4", aggregate[3].Bucket)

		}
	})
}

func TestMain(m *testing.M) {
	testutils.StartStarrocksContainer()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
