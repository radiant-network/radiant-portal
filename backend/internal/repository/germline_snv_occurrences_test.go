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

var allOccurrencesFields = sliceutils.Map(types.GermlineSNVOccurrencesFields, func(value types.Field, index int, slice []types.Field) string {
	return value.Name
})

var defaultOccurrencesFieldsForTest = []types.Field{
	types.LocusIdField,
}

var OccurrencesQueryConfigForTest = types.QueryConfig{
	AllFields:     types.GermlineSNVOccurrencesFields,
	DefaultFields: defaultOccurrencesFieldsForTest,
	DefaultSort:   types.GermlineSNVOccurrencesDefaultSort,
	IdField:       types.LocusIdField,
}

func Test_GetOccurrences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, allOccurrencesFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqId)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, "PASS", occurrences[0].Filter)
			assert.Equal(t, "HET", occurrences[0].Zygosity)
			assert.Equal(t, 0.99, occurrences[0].PfWgs)
			assert.Equal(t, 3, occurrences[0].PcWgs)
			assert.Equal(t, "hgvsg1", occurrences[0].Hgvsg)
			assert.Equal(t, float32(1.0), occurrences[0].AdRatio)
			assert.Equal(t, "class1", occurrences[0].VariantClass)
			assert.True(t, occurrences[0].HasInterpretation)
		}
	})
}

func Test_GetOccurrences_Return_Selected_Columns_Only(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		selectedFields := []string{"seq_id", "locus_id", "ad_ratio", "filter"}

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, selectedFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqId)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, "PASS", occurrences[0].Filter)
			assert.Empty(t, occurrences[0].VepImpact)
		}
	})
}

func Test_GetOccurrencesReturn_Default_Column_If_No_One_Specified(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {

		repo := NewGermlineSNVOccurrencesRepository(db)
		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, nil, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 1)

		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Empty(t, occurrences[0].Filter)
		}
	})
}

func Test_GetOccurrences_Return_A_Proper_Array_Column(t *testing.T) {
	testutils.ParallelTestWithDb(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		selectedFields := []string{"clinvar"}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, selectedFields, nil, nil, sort)
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
		repo := NewGermlineSNVOccurrencesRepository(db)
		count, err := repo.CountOccurrences(1, nil)
		assert.NoError(t, err)
		assert.EqualValues(t, 1, count)
	})
}

func Test_GetOccurrences_Return_List_Occurrences_When_Filter_By_Exomiser_Gene_Combined_Score(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "exomiser_gene_combined_score", Value: []interface{}{0.5}}},
			},
			Op: "and",
		}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		selectedFields := []string{"locus_id", "exomiser_gene_combined_score", "exomiser_acmg_evidence"}

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.EqualValues(t, 0.7, occurrences[0].ExomiserGeneCombinedScore)
			assert.EqualValues(t, []string{"PS1", "PVS2"}, occurrences[0].ExomiserAcmgEvidence)
		}
	})
}

func Test_CountOccurrences_Return_Count_That_Match_Filters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {

		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "filter",
				Value: []interface{}{"PASS"},
			},

			Op: "in",
		}
		query, err := types.NewCountQueryFromSqon(sqon, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		c, err2 := repo.CountOccurrences(1, query)

		if assert.NoError(t, err2) {
			assert.EqualValues(t, 1, c)
		}
	})
}

func Test_GetOccurrences_Return_Occurrences_That_Match_Filters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {

		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "filter",
				Value: []interface{}{"PASS"},
			},
			Op: "in",
		}
		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, allOccurrencesFields, sqon, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqId)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, "PASS", occurrences[0].Filter)
			assert.Equal(t, "HET", occurrences[0].Zygosity)
			assert.Equal(t, 0.99, occurrences[0].PfWgs)
			assert.Equal(t, 3, occurrences[0].PcWgs)
			assert.Equal(t, "hgvsg1", occurrences[0].Hgvsg)
			assert.Equal(t, float32(1.0), occurrences[0].AdRatio)
			assert.Equal(t, "class1", occurrences[0].VariantClass)
		}
	})
}

func Test_GetOccurrences_Return_List_Occurrences_Matching_Array(t *testing.T) {
	testutils.ParallelTestWithDb(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "clinvar",
				Value: []interface{}{"Pathogenic"},
			},

			Op: "in",
		}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		selectedFields := []string{"locus_id", "clinvar"}

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 2) {

			assert.Equal(t, types.JsonArray[string]{"Likely_Pathogenic", "Pathogenic"}, occurrences[0].Clinvar)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, types.JsonArray[string]{"Pathogenic"}, occurrences[1].Clinvar)
			assert.EqualValues(t, "1001", occurrences[1].LocusId)

		}
	})
}

func Test_GetOccurrences_Return_List_Occurrences_Matching_Array_When_All(t *testing.T) {
	testutils.ParallelTestWithDb(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
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

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {

			assert.Equal(t, types.JsonArray[string]{"Likely_Pathogenic", "Pathogenic"}, occurrences[0].Clinvar)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)

		}
	})
}

func Test_GetOccurrences_Return_N_Occurrences_When_Limit_Specified(t *testing.T) {
	testutils.ParallelTestWithDb(t, "pagination", func(t *testing.T, db *gorm.DB) {

		repo := NewGermlineSNVOccurrencesRepository(db)

		pagination := &types.Pagination{
			Limit:  5,
			Offset: 0,
		}
		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, nil, nil, pagination, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 5)
	})
}

func Test_GetOccurrences_Return_Expected_Occurrences_When_Limit_And_Offset_Specified(t *testing.T) {
	testutils.ParallelTestWithDb(t, "pagination", func(t *testing.T, db *gorm.DB) {

		repo := NewGermlineSNVOccurrencesRepository(db)

		sortedBody := []types.SortBody{
			{
				Field: "pf_wgs",
				Order: "desc",
			},
		}
		pagination := &types.Pagination{
			Limit:  12,
			Offset: 5,
		}

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, allOccurrencesFields, nil, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 12) {
			assert.EqualValues(t, "1023", occurrences[0].LocusId)
			assert.EqualValues(t, "1012", occurrences[len(occurrences)-1].LocusId)
		}
	})
}

func Test_GetOccurrences_Return_Expected_Occurrences_When_Limit_And_PageIndex_Specified(t *testing.T) {
	testutils.ParallelTestWithDb(t, "pagination", func(t *testing.T, db *gorm.DB) {

		repo := NewGermlineSNVOccurrencesRepository(db)

		sortedBody := []types.SortBody{
			{
				Field: "pf_wgs",
				Order: "desc",
			},
		}
		pagination := &types.Pagination{
			Limit:     12,
			PageIndex: 1,
		}

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, allOccurrencesFields, nil, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 12) {
			assert.EqualValues(t, "1016", occurrences[0].LocusId)
			assert.EqualValues(t, "1005", occurrences[len(occurrences)-1].LocusId)
		}
	})
}

func Test_GetOccurrences_Return_Expected_Occurrences_When_Filter_By_Impact_Score(t *testing.T) {
	testutils.ParallelTestWithDb(t, "consequence", func(t *testing.T, db *gorm.DB) {

		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "impact_score",
				Value: []interface{}{2},
			},

			Op: ">",
		}
		sortedBody := []types.SortBody{
			{
				Field: "locus_id",
				Order: "asc",
			},
		}

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, allOccurrencesFields, sqon, nil, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 5) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.EqualValues(t, "1008", occurrences[len(occurrences)-1].LocusId)
		}
	})
}

func Test_GetOccurrences_Return_Expected_Occurrences_When_Filter_By_Impact_ScoreAnd_Quality(t *testing.T) {
	testutils.ParallelTestWithDb(t, "consequence", func(t *testing.T, db *gorm.DB) {

		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: &types.LeafContent{Field: "impact_score", Value: []interface{}{2}}},
				{Op: ">", Content: &types.LeafContent{Field: "genotype_quality", Value: []interface{}{50}}},
			},
			Op: "and",
		}
		sortedBody := []types.SortBody{
			{
				Field: "locus_id",
				Order: "asc",
			},
		}

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, allOccurrencesFields, sqon, nil, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
		}
	})
}

func Test_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Zygosity(t *testing.T) {
	testutils.ParallelTestWithDb(t, "aggregation", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		query, err := types.NewAggregationQueryFromSqon("zygosity", nil, types.GermlineSNVOccurrencesFields)
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
		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: types.LeafContent{
				Field: "filter",
				Value: []interface{}{"PASS"},
			},
			Op: "in",
		}
		query, err := types.NewAggregationQueryFromSqon("zygosity", sqon, types.GermlineSNVOccurrencesFields)
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
		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: &types.LeafContent{Field: "filter", Value: []interface{}{"PASS"}}},
				{Op: "in", Content: &types.LeafContent{Field: "zygosity", Value: []interface{}{"HOM"}}},
			},
			Op: "and",
		}
		query, err := types.NewAggregationQueryFromSqon("zygosity", sqon, types.GermlineSNVOccurrencesFields)
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
		repo := NewGermlineSNVOccurrencesRepository(db)
		query, err := types.NewAggregationQueryFromSqon("clinvar", nil, types.GermlineSNVOccurrencesFields)
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
		repo := NewGermlineSNVOccurrencesRepository(db)
		query, err := types.NewAggregationQueryFromSqon("impact_score", nil, types.GermlineSNVOccurrencesFields)
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
		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "filter", Value: []interface{}{"PASS"}}},
				{Op: ">", Content: types.LeafContent{Field: "impact_score", Value: []interface{}{2}}},
			},
			Op: "and",
		}
		query, err := types.NewAggregationQueryFromSqon("impact_score", sqon, types.GermlineSNVOccurrencesFields)
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
		repo := NewGermlineSNVOccurrencesRepository(db)
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

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 3) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.EqualValues(t, "1001", occurrences[1].LocusId)
			assert.EqualValues(t, "1002", occurrences[2].LocusId)

		}
	})
}

func Test_GetOccurrences_Return_List_Occurrences_Matching_Gene_panel_And_Impact_Score(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "impact_score", Value: []interface{}{2}}},
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
			},
			Op: "and",
		}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		selectedFields := []string{"locus_id"}

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 2) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.EqualValues(t, "1002", occurrences[1].LocusId)

		}
	})
}

func Test_GetOccurrences_Return_List_Occurrences_Matching_Multiple_Gene_panel_And_Impact_Score(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "impact_score", Value: []interface{}{2}}},
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
				{Op: "in", Content: types.LeafContent{Field: "hpo_gene_panel", Value: []interface{}{"Colon cancer(HP:0003003)"}}},
			},
			Op: "and",
		}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		selectedFields := []string{"locus_id"}

		query, err := types.NewListQueryFromSqon(OccurrencesQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)

		}
	})
}

func Test_CountOccurrences_Return_Number_Occurrences_Matching_Multiple_Gene_panel_And_Impact_Score(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "impact_score", Value: []interface{}{2}}},
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
				{Op: "in", Content: types.LeafContent{Field: "hpo_gene_panel", Value: []interface{}{"Colon cancer(HP:0003003)"}}},
			},
			Op: "and",
		}

		query, err := types.NewCountQueryFromSqon(sqon, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		c, err := repo.CountOccurrences(1, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 1, c)
	})
}

func Test_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Gene_Panel(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		query, err := types.NewAggregationQueryFromSqon("omim_gene_panel", nil, types.GermlineSNVOccurrencesFields)
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

func Test_GetStatisticsOccurrences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "pagination", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		query, err := types.NewStatisticsQueryFromSqon("pf_wgs", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(1, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 0.01, statistics.Min)
		assert.EqualValues(t, 0.29, statistics.Max)
	})
}

func Test_GetStatisticsOccurrences_Non_Numeric_Field(t *testing.T) {
	testutils.ParallelTestWithDb(t, "pagination", func(t *testing.T, db *gorm.DB) {
		_, err := types.NewStatisticsQueryFromSqon("hgvsg", nil, types.GermlineSNVOccurrencesFields)
		assert.Error(t, err)
	})
}

func Test_GetExpandedOccurrence(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGermlineSNVOccurrencesRepository(db)
		expandedOccurrence, err := repo.GetExpandedOccurrence(1, 1000)
		assert.NoError(t, err)
		assert.Equal(t, "1000", expandedOccurrence.LocusId)
		assert.Equal(t, "locus1", expandedOccurrence.Locus)
		assert.Equal(t, float32(0.1), expandedOccurrence.SiftScore)
		assert.Equal(t, "T", expandedOccurrence.SiftPred)
		assert.Equal(t, 0.7, expandedOccurrence.ExomiserGeneCombinedScore)
		assert.Equal(t, types.JsonArray[string]{"PS1", "PVS2"}, expandedOccurrence.ExomiserAcmgEvidence)
		assert.Equal(t, 3, expandedOccurrence.PcWgsAffected)
		assert.Equal(t, 3, expandedOccurrence.PnWgsAffected)
		assert.Equal(t, float64(1.0), expandedOccurrence.PfWgsAffected)
		assert.Equal(t, 0, expandedOccurrence.PcWgsNotAffected)
		assert.Equal(t, 0, expandedOccurrence.PnWgsNotAffected)
		assert.Equal(t, float64(0), expandedOccurrence.PfWgsNotAffected)
		assert.Equal(t, "UNCERTAIN_SIGNIFICANCE", expandedOccurrence.ExomiserAcmgClassification)
	})
}
