package starrocks

import (
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var allGermlineSNVFields = sliceutils.Map(types.GermlineSNVOccurrencesFields, func(value types.Field, index int, slice []types.Field) string {
	return value.Name
})

var defaultGermlineSNVFieldsForTest = []types.Field{
	types.GermlineSNVLocusIdField,
}

var GermlineSNVQueryConfigForTest = types.QueryConfig{
	AllFields:     types.GermlineSNVOccurrencesFields,
	DefaultFields: defaultGermlineSNVFieldsForTest,
	DefaultSort:   types.GermlineSNVOccurrencesDefaultSort,
	IdField:       types.GermlineSNVLocusIdField,
}

func Test_Germline_SNV_GetOccurrences(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqId)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, "PASS", occurrences[0].Filter)
			assert.Equal(t, "HET", occurrences[0].Zygosity)
			assert.Equal(t, 0.99, occurrences[0].GermlinePfWgs)
			assert.Equal(t, 3, occurrences[0].GermlinePcWgs)
			assert.Equal(t, "hgvsg1", occurrences[0].Hgvsg)
			assert.Equal(t, float32(1.0), occurrences[0].AdRatio)
			assert.Equal(t, "class1", occurrences[0].VariantClass)
			assert.True(t, occurrences[0].HasInterpretation)
			assert.True(t, occurrences[0].HasNote)
			assert.Equal(t, "T001", occurrences[0].TranscriptId)
		}
	})
}

func Test_Germline_SNV_GetOccurrences_Return_Selected_Columns_Only(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		selectedFields := []string{"seq_id", "locus_id", "ad_ratio", "filter"}

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, selectedFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqId)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, "PASS", occurrences[0].Filter)
			assert.Empty(t, occurrences[0].VepImpact)
		}
	})
}

func Test_Germline_SNV_GetOccurrencesReturn_Default_Column_If_No_One_Specified(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {

		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, nil, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 1)

		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Empty(t, occurrences[0].Filter)
		}
	})
}

func Test_Germline_SNV_GetOccurrences_Return_A_Proper_Array_Column(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "clinvar"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		selectedFields := []string{"clinvar"}
		sort := []types.SortBody{
			{Field: "locus_id", Order: "asc"},
		}
		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, selectedFields, nil, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 4) {

			assert.Equal(t, types.JsonArray[string]{"Likely_Pathogenic", "Pathogenic"}, occurrences[0].Clinvar)

		}
	})
}

func Test_Germline_SNV_CountOccurrences(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		count, err := repo.CountOccurrences(t.Context(), 1, 1, 5, nil)
		assert.NoError(t, err)
		assert.EqualValues(t, 1, count.Count)
		assert.EqualValues(t, 1, count.FilteredCount)
	})
}

func Test_Germline_SNV_GetOccurrences_Return_List_Occurrences_When_Filter_By_Exomiser_Gene_Combined_Score(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
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

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.EqualValues(t, 0.7, occurrences[0].ExomiserGeneCombinedScore)
			assert.EqualValues(t, []string{"PS1", "PVS2"}, occurrences[0].ExomiserAcmgEvidence)
		}
	})
}

func Test_Germline_SNV_CountOccurrences_Return_Count_That_Match_Filters(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple"}, func(t *testing.T, env *testutils.Env) {

		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "filter",
				Value: []interface{}{"PASS"},
			},

			Op: "in",
		}
		query, err := types.NewOccurrenceCountQueryFromSqon(sqon, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		c, err2 := repo.CountOccurrences(t.Context(), 1, 1, 5, query)

		if assert.NoError(t, err2) {
			assert.EqualValues(t, 1, c.Count)
			assert.EqualValues(t, 1, c.FilteredCount)
		}
	})
}

func Test_Germline_SNV_GetOccurrences_Return_Occurrences_That_Match_Filters(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple"}, func(t *testing.T, env *testutils.Env) {

		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		sqon := &types.Sqon{
			Content: &types.LeafContent{
				Field: "filter",
				Value: []interface{}{"PASS"},
			},
			Op: "in",
		}
		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, sqon, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqId)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, "PASS", occurrences[0].Filter)
			assert.Equal(t, "HET", occurrences[0].Zygosity)
			assert.Equal(t, 0.99, occurrences[0].GermlinePfWgs)
			assert.Equal(t, 3, occurrences[0].GermlinePcWgs)
			assert.Equal(t, "hgvsg1", occurrences[0].Hgvsg)
			assert.Equal(t, float32(1.0), occurrences[0].AdRatio)
			assert.Equal(t, "class1", occurrences[0].VariantClass)
		}
	})
}

// Reproduces the cross-task leak scenario: the `multiple` fixture has, at the
// same seq_id=1/part, locus 2000 under BOTH task_id=5 (case 1's annotation) and
// task_id=200 (a second case reusing the same sequencing). Because the list
// query's outer SELECT re-joins the occurrence table, filtering only on seq_id +
// `locus_id IN (<task-filtered subquery>)` is not enough — locus 2000 is IN both
// subqueries, so without an explicit task_id on the outer query each case leaks
// the other's row for that locus.
func Test_Germline_SNV_GetOccurrences_TaskIdScopesToOwningCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil)
		assert.NoError(t, err)

		// Case 1 (task_id=5) sees only its own loci {1000,2000} at seq_id=1, each
		// stamped task_id=5 — never the task_id=200 row for shared locus 2000.
		case1Occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		case1LocusIds := make([]string, 0, len(case1Occurrences))
		for _, occ := range case1Occurrences {
			assert.Equal(t, 5, occ.TaskId, "task_id=5 query leaked an occurrence from another task")
			case1LocusIds = append(case1LocusIds, occ.LocusId)
		}
		assert.ElementsMatch(t, []string{"1000", "2000"}, case1LocusIds)

		// Case 2 (task_id=200, reusing seq_id=1) sees only its locus_id(s) {2000,5000},
		// each stamped task_id=200 — never case 1's task_id=5 row for shared
		// locus 2000.
		case2Occurrences, err := repo.GetOccurrences(t.Context(), 2, 1, 200, query)
		assert.NoError(t, err)
		case2LocusIds := make([]string, 0, len(case2Occurrences))
		for _, occ := range case2Occurrences {
			assert.Equal(t, 200, occ.TaskId, "task_id=200 query leaked an occurrence from another task")
			case2LocusIds = append(case2LocusIds, occ.LocusId)
		}
		assert.ElementsMatch(t, []string{"2000", "5000"}, case2LocusIds)
	})
}

func Test_Germline_SNV_GetOccurrences_Return_List_Occurrences_Matching_Array(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "clinvar"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
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

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 2) {

			assert.Equal(t, types.JsonArray[string]{"Likely_Pathogenic", "Pathogenic"}, occurrences[0].Clinvar)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, types.JsonArray[string]{"Pathogenic"}, occurrences[1].Clinvar)
			assert.EqualValues(t, "1001", occurrences[1].LocusId)

		}
	})
}

func Test_Germline_SNV_GetOccurrences_Return_List_Occurrences_Matching_Array_When_All(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "clinvar"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
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

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {

			assert.Equal(t, types.JsonArray[string]{"Likely_Pathogenic", "Pathogenic"}, occurrences[0].Clinvar)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)

		}
	})
}

func Test_Germline_SNV_GetOccurrences_Return_N_Occurrences_When_Limit_Specified(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {

		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		pagination := &types.Pagination{
			Limit:  5,
			Offset: 0,
		}
		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, nil, nil, pagination, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 5)
	})
}

func Test_Germline_SNV_GetOccurrences_Return_Expected_Occurrences_When_Limit_And_Offset_Specified(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {

		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		sortedBody := []types.SortBody{
			{
				Field: "germline_pf_wgs",
				Order: "desc",
			},
		}
		pagination := &types.Pagination{
			Limit:  12,
			Offset: 5,
		}

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 12) {
			assert.EqualValues(t, "1023", occurrences[0].LocusId)
			assert.EqualValues(t, "1012", occurrences[len(occurrences)-1].LocusId)
		}
	})
}

func Test_Germline_SNV_GetOccurrences_Return_Expected_Occurrences_When_Limit_And_PageIndex_Specified(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {

		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		sortedBody := []types.SortBody{
			{
				Field: "germline_pf_wgs",
				Order: "desc",
			},
		}
		pagination := &types.Pagination{
			Limit:     12,
			PageIndex: 1,
		}

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 12) {
			assert.EqualValues(t, "1016", occurrences[0].LocusId)
			assert.EqualValues(t, "1005", occurrences[len(occurrences)-1].LocusId)
		}
	})
}

func Test_Germline_SNV_GetOccurrences_Return_Expected_Occurrences_When_Filter_By_Impact_Score(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "consequence"}, func(t *testing.T, env *testutils.Env) {

		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
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

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, sqon, nil, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 5) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.EqualValues(t, "1008", occurrences[len(occurrences)-1].LocusId)
		}
	})
}

func Test_Germline_SNV_GetOccurrences_Return_Expected_Occurrences_When_Filter_By_Impact_ScoreAnd_Quality(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "consequence"}, func(t *testing.T, env *testutils.Env) {

		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
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

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, sqon, nil, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
		}
	})
}

func Test_Germline_SNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Zygosity(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewAggregationQueryFromSqon("zygosity", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 2) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "HOM", aggregate[0].Bucket)
			assert.EqualValues(t, 3, aggregate[1].Count)
			assert.Equal(t, "HET", aggregate[1].Bucket)
		}
	})
}

func Test_Germline_SNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Zygosity_With_Filter(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		sqon := &types.Sqon{
			Content: types.LeafContent{
				Field: "filter",
				Value: []interface{}{"PASS"},
			},
			Op: "in",
		}
		query, err := types.NewAggregationQueryFromSqon("zygosity", sqon, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 2) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "HOM", aggregate[0].Bucket)
			assert.EqualValues(t, 2, aggregate[1].Count)
			assert.Equal(t, "HET", aggregate[1].Bucket)
		}
	})
}

func Test_Germline_SNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Zygosity_With_Filter_But_Ignore_Self_Filter(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: &types.LeafContent{Field: "filter", Value: []interface{}{"PASS"}}},
				{Op: "in", Content: &types.LeafContent{Field: "zygosity", Value: []interface{}{"HOM"}}},
			},
			Op: "and",
		}
		query, err := types.NewAggregationQueryFromSqon("zygosity", sqon, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 2) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "HOM", aggregate[0].Bucket)
			assert.EqualValues(t, 2, aggregate[1].Count)
			assert.Equal(t, "HET", aggregate[1].Bucket)
		}
	})
}

func Test_Germline_SNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Clinvar(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "clinvar"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewAggregationQueryFromSqon("clinvar", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 1, 1, query)
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

func Test_Germline_SNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Impact_Score(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "consequence"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewAggregationQueryFromSqon("impact_score", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 1, 1, query)
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

func Test_Germline_SNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Impact_Score_Combined_With_Filter(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "consequence"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "filter", Value: []interface{}{"PASS"}}},
				{Op: ">", Content: types.LeafContent{Field: "impact_score", Value: []interface{}{2}}},
			},
			Op: "and",
		}
		query, err := types.NewAggregationQueryFromSqon("impact_score", sqon, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 1, 1, query)
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

func Test_Germline_SNV_GetOccurrences_Return_List_Occurrences_Matching_Gene_panel(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
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

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 3) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.EqualValues(t, "1001", occurrences[1].LocusId)
			assert.EqualValues(t, "1002", occurrences[2].LocusId)

		}
	})
}

func Test_Germline_SNV_GetOccurrences_Return_List_Occurrences_Matching_Gene_panel_And_Impact_Score(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
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

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 2) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.EqualValues(t, "1002", occurrences[1].LocusId)

		}
	})
}

func Test_Germline_SNV_GetOccurrences_Return_List_Occurrences_Matching_Multiple_Gene_panel_And_Impact_Score(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
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

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, selectedFields, sqon, nil, sort)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)

		}
	})
}

func Test_Germline_SNV_CountOccurrences_Return_Number_Occurrences_Matching_Multiple_Gene_panel_And_Impact_Score(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "impact_score", Value: []interface{}{2}}},
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
				{Op: "in", Content: types.LeafContent{Field: "hpo_gene_panel", Value: []interface{}{"Colon cancer(HP:0003003)"}}},
			},
			Op: "and",
		}

		query, err := types.NewOccurrenceCountQueryFromSqon(sqon, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		c, err := repo.CountOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 1, c.Count)
	})
}

func Test_Germline_SNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Gene_Panel(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewAggregationQueryFromSqon("omim_gene_panel", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 1, 1, query)
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

func listGermlineSNVLociMatching(t *testing.T, env *testutils.Env, sqon *types.Sqon) []string {
	t.Helper()
	repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
	sort := []types.SortBody{{Field: "locus_id", Order: "asc"}}
	query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, []string{"locus_id"}, sqon, nil, sort)
	require.NoError(t, err)
	occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 1, query)
	require.NoError(t, err)
	return sliceutils.Map(occurrences, func(o GermlineSNVOccurrence, _ int, _ []GermlineSNVOccurrence) string {
		return o.LocusId
	})
}

func Test_Germline_SNV_GetOccurrences_Return_List_Occurrences_Matching_Tenant_Gene_Panel(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: "in", Content: types.LeafContent{Field: "tenant_gene_panel", Value: []interface{}{"EPILEP"}}}
		assert.Equal(t, []string{"1000", "1002"}, listGermlineSNVLociMatching(t, env, sqon))
	})
}

func Test_Germline_SNV_GetOccurrences_Return_List_Occurrences_Matching_Multiple_Tenant_Gene_Panels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: "in", Content: types.LeafContent{Field: "tenant_gene_panel", Value: []interface{}{"EPILEP", "ONCO"}}}
		assert.Equal(t, []string{"1000", "1001", "1002"}, listGermlineSNVLociMatching(t, env, sqon))
	})
}

func Test_Germline_SNV_GetOccurrences_Return_List_Occurrences_Matching_Tenant_And_Omim_Gene_Panels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{
			Op: "and",
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "tenant_gene_panel", Value: []interface{}{"ONCO"}}},
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel3"}}},
			},
		}
		// ONCO holds BRAF and TP53, OMIM panel3 only TP53: both must match the same consequence.
		assert.Equal(t, []string{"1000", "1001"}, listGermlineSNVLociMatching(t, env, sqon))
	})
}

func Test_Germline_SNV_GetOccurrences_Return_List_Occurrences_Not_In_Tenant_Gene_Panel(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: "not-in", Content: types.LeafContent{Field: "tenant_gene_panel", Value: []interface{}{"EPILEP"}}}
		// Same semantics as the public panels: a consequence in another panel matches, one in no panel does not.
		assert.Equal(t, []string{"1000", "1001", "1002"}, listGermlineSNVLociMatching(t, env, sqon))
	})
}

func Test_Germline_SNV_GetOccurrences_Return_Empty_List_When_Unknown_Tenant_Gene_Panel(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: "in", Content: types.LeafContent{Field: "tenant_gene_panel", Value: []interface{}{"UNKNOWN"}}}
		assert.Empty(t, listGermlineSNVLociMatching(t, env, sqon))
	})
}

func Test_Germline_SNV_CountOccurrences_Return_Number_Occurrences_Matching_Tenant_Gene_Panel(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		sqon := &types.Sqon{Op: "in", Content: types.LeafContent{Field: "tenant_gene_panel", Value: []interface{}{"ONCO"}}}
		query, err := types.NewOccurrenceCountQueryFromSqon(sqon, types.GermlineSNVOccurrencesFields)
		require.NoError(t, err)
		c, err := repo.CountOccurrences(t.Context(), 1, 1, 1, query)
		require.NoError(t, err)
		assert.EqualValues(t, 3, c.Count)
	})
}

func Test_Germline_SNV_AggregateOccurrences_Return_Only_Tenant_Gene_Panels_With_Hits(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewAggregationQueryFromSqon("tenant_gene_panel", nil, types.GermlineSNVOccurrencesFields)
		require.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 1, 1, query)
		require.NoError(t, err)
		// CARDIO (MYH7) has no consequence in the case, so it is not a bucket.
		assert.Equal(t, []Aggregation{{Bucket: "EPILEP", Count: 2}, {Bucket: "ONCO", Count: 3}}, aggregate)
	})
}

func Test_Germline_SNV_GetStatisticsOccurrences_Decimal(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("germline_pf_wgs", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 0.01, statistics.Min)
		assert.EqualValues(t, 0.29, statistics.Max)
		assert.EqualValues(t, types.DecimalType, statistics.Type)
	})
}

func Test_Germline_SNV_GetStatisticsOccurrences_Integer(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("germline_pc_wgs", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 3, statistics.Min)
		assert.EqualValues(t, 4, statistics.Max)
		assert.EqualValues(t, types.IntegerType, statistics.Type)
	})
}

func Test_Germline_SNV_GetStatisticsOccurrences_Non_Numeric_Field(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		_, err := types.NewStatisticsQueryFromSqon("hgvsg", nil, types.GermlineSNVOccurrencesFields)
		assert.Error(t, err)
	})
}

func Test_Germline_SNV_GetExpandedOccurrence(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		expandedOccurrence, err := repo.GetExpandedOccurrence(t.Context(), 1, 1, 5, 1000)
		assert.NoError(t, err)
		assert.Equal(t, "1000", expandedOccurrence.LocusId)
		assert.Equal(t, "locus1", expandedOccurrence.Locus)
		assert.Equal(t, float32(0.1), expandedOccurrence.SiftScore)
		assert.Equal(t, "T", expandedOccurrence.SiftPred)
		assert.Equal(t, float32(0.01), expandedOccurrence.LrtScore)
		assert.Equal(t, "U", expandedOccurrence.LrtPred)
		assert.Equal(t, float32(0.991), expandedOccurrence.Polyphen2HvarScore)
		assert.Equal(t, "D", expandedOccurrence.Polyphen2HvarPred)
		assert.Equal(t, 0.7, expandedOccurrence.ExomiserGeneCombinedScore)
		assert.Equal(t, types.JsonArray[string]{"PS1", "PVS2"}, expandedOccurrence.ExomiserAcmgEvidence)
		assert.Equal(t, 3, *expandedOccurrence.GermlinePcWgsAffected)
		assert.Equal(t, 3, *expandedOccurrence.GermlinePnWgsAffected)
		assert.Equal(t, float64(1.0), *expandedOccurrence.GermlinePfWgsAffected)
		assert.Equal(t, 0, *expandedOccurrence.GermlinePcWgsNotAffected)
		assert.Equal(t, 0, *expandedOccurrence.GermlinePnWgsNotAffected)
		assert.Equal(t, float64(0), *expandedOccurrence.GermlinePfWgsNotAffected)
		assert.Equal(t, 3, *expandedOccurrence.GermlinePcWgs)
		assert.Nil(t, expandedOccurrence.GermlinePnWgs)
		assert.Equal(t, 2, *expandedOccurrence.GermlineHomWgs)
		assert.Equal(t, 0.5, *expandedOccurrence.GermlineAfWgs)
		assert.Equal(t, 3, *expandedOccurrence.GermlineHomWgsAffected)
		assert.Equal(t, 1.0, *expandedOccurrence.GermlineAfWgsAffected)
		assert.Equal(t, 0, *expandedOccurrence.GermlineHomWgsNotAffected)
		assert.Equal(t, 0.0, *expandedOccurrence.GermlineAfWgsNotAffected)
		assert.Equal(t, 4, *expandedOccurrence.GermlinePcWxs)
		assert.Equal(t, 10, *expandedOccurrence.GermlinePnWxs)
		assert.Equal(t, 0.4, *expandedOccurrence.GermlinePfWxs)
		assert.Equal(t, 2, *expandedOccurrence.GermlineHomWxs)
		assert.Equal(t, 0.3, *expandedOccurrence.GermlineAfWxs)
		assert.Equal(t, 1, *expandedOccurrence.GermlineHomWxsNotAffected)
		assert.Equal(t, 0.2, *expandedOccurrence.GermlineAfWxsNotAffected)
		assert.Equal(t, 11, *expandedOccurrence.SomaticPnTnWgs)
		assert.Equal(t, 5, *expandedOccurrence.SomaticHomTnWgs)
		assert.Equal(t, 0.125, *expandedOccurrence.SomaticAfTnWxs)
		assert.Equal(t, 3, *expandedOccurrence.SomaticHomToWxs)
		assert.Equal(t, 0.25, *expandedOccurrence.SomaticAfToWxs)
		assert.Equal(t, "UNCERTAIN_SIGNIFICANCE", expandedOccurrence.ExomiserAcmgClassification)
		assert.Equal(t, "T001", expandedOccurrence.TranscriptId)
		assert.Equal(t, "BRAF", expandedOccurrence.Symbol)
		assert.Equal(t, "ENSG00000157764", expandedOccurrence.EnsemblGeneId)
	})
}

func Test_Germline_SNV_GetOccurrences_HasNote_False_When_Note_Is_Deleted(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		notesRepo := postgres.NewOccurrenceNotesRepository(database.PostgresDB{DB: env.Postgres})

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil)
		assert.NoError(t, err)

		note, err := notesRepo.Create(t.Context(), types.OccurrenceNote{
			CaseID:       3,
			SeqID:        7,
			TaskID:       77,
			OccurrenceID: "1000",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "Test User",
			TenantCode:   types.DefaultTenantCode,
			Content:      "Test note",
		})
		assert.NoError(t, err)

		occurrences, err := repo.GetOccurrences(t.Context(), 3, 7, 77, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.True(t, occurrences[0].HasNote)
		}

		err = notesRepo.Delete(t.Context(), note.ID)
		assert.NoError(t, err)

		occurrences, err = repo.GetOccurrences(t.Context(), 3, 7, 77, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.False(t, occurrences[0].HasNote)
		}
	})
}

func Test_Germline_SNV_GetOccurrences_WithNote_Keeps_Only_Occurrences_Having_A_Note(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 2)

		queryWithNote, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil, types.WithNoteFilter(true))
		assert.NoError(t, err)
		occurrences, err = repo.GetOccurrences(t.Context(), 1, 1, 5, queryWithNote)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.True(t, occurrences[0].HasNote)
		}
	})
}

func Test_Germline_SNV_CountOccurrences_WithNote_Counts_Only_Occurrences_Having_A_Note(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		query, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 2, count.Count)
		assert.EqualValues(t, 2, count.FilteredCount)

		queryWithNote, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields, types.WithNoteFilter(true))
		assert.NoError(t, err)
		count, err = repo.CountOccurrences(t.Context(), 1, 1, 5, queryWithNote)
		assert.NoError(t, err)
		assert.EqualValues(t, 1, count.FilteredCount)
		assert.EqualValues(t, 2, count.Count)
	})
}

func Test_Germline_SNV_CountOccurrences_WithNote_Ignores_Notes_Of_Another_Case(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		queryWithNote, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields, types.WithNoteFilter(true))
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(t.Context(), 999, 1, 5, queryWithNote)
		assert.NoError(t, err)
		assert.EqualValues(t, 0, count.FilteredCount)
	})
}

func Test_Germline_SNV_GetOccurrences_WithInterpretation_Keeps_Only_Interpreted_Occurrences(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 2)

		queryWithInterpretation, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil, types.WithInterpretationFilter(true))
		assert.NoError(t, err)
		occurrences, err = repo.GetOccurrences(t.Context(), 1, 1, 5, queryWithInterpretation)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.True(t, occurrences[0].HasInterpretation)
		}
	})
}

func Test_Germline_SNV_CountOccurrences_WithInterpretation_Counts_Only_Interpreted_Occurrences(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		query, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields, types.WithInterpretationFilter(true))
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 1, count.FilteredCount)
		assert.EqualValues(t, 2, count.Count)
	})
}

func Test_Germline_SNV_CountOccurrences_WithInterpretation_Ignores_Interpretations_Of_Another_Case(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		query, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields, types.WithInterpretationFilter(true))
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(t.Context(), 999, 1, 5, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 0, count.FilteredCount)
	})
}

func Test_Germline_SNV_GetOccurrences_WithFlag_Keeps_Only_Occurrences_Flagged_With_A_Listed_Type(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		flagsRepo := postgres.NewOccurrenceFlagsRepository(database.PostgresDB{DB: env.Postgres})

		_, err := flagsRepo.Upsert(t.Context(), types.OccurrenceFlag{
			CaseID:       2,
			SeqID:        1,
			TaskID:       5,
			OccurrenceID: "1000",
			FlagType:     types.OccurrenceFlagTypePin,
			TenantCode:   types.DefaultTenantCode,
		})
		assert.NoError(t, err)

		pinned, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil, types.WithFlagFilter([]types.OccurrenceFlagType{types.OccurrenceFlagTypePin}))
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 2, 1, 5, pinned)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, types.OccurrenceFlagTypePin, occurrences[0].FlagType)
		}

		starred, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil, types.WithFlagFilter([]types.OccurrenceFlagType{types.OccurrenceFlagTypeStar}))
		assert.NoError(t, err)
		occurrences, err = repo.GetOccurrences(t.Context(), 2, 1, 5, starred)
		assert.NoError(t, err)
		assert.Empty(t, occurrences)

		either, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil, types.WithFlagFilter([]types.OccurrenceFlagType{types.OccurrenceFlagTypeStar, types.OccurrenceFlagTypePin}))
		assert.NoError(t, err)
		occurrences, err = repo.GetOccurrences(t.Context(), 2, 1, 5, either)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 1)
	})
}

func Test_Germline_SNV_CountOccurrences_WithFlag_Counts_Only_Occurrences_Flagged_With_A_Listed_Type(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		flagsRepo := postgres.NewOccurrenceFlagsRepository(database.PostgresDB{DB: env.Postgres})

		_, err := flagsRepo.Upsert(t.Context(), types.OccurrenceFlag{
			CaseID:       2,
			SeqID:        1,
			TaskID:       5,
			OccurrenceID: "1000",
			FlagType:     types.OccurrenceFlagTypePin,
			TenantCode:   types.DefaultTenantCode,
		})
		assert.NoError(t, err)

		baseline, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(t.Context(), 2, 1, 5, baseline)
		assert.NoError(t, err)
		assert.EqualValues(t, 2, count.Count)
		assert.EqualValues(t, 2, count.FilteredCount)

		pinned, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields, types.WithFlagFilter([]types.OccurrenceFlagType{types.OccurrenceFlagTypePin}))
		assert.NoError(t, err)
		count, err = repo.CountOccurrences(t.Context(), 2, 1, 5, pinned)
		assert.NoError(t, err)
		assert.EqualValues(t, 1, count.FilteredCount)
		assert.EqualValues(t, 2, count.Count)

		starred, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields, types.WithFlagFilter([]types.OccurrenceFlagType{types.OccurrenceFlagTypeStar}))
		assert.NoError(t, err)
		count, err = repo.CountOccurrences(t.Context(), 2, 1, 5, starred)
		assert.NoError(t, err)
		assert.EqualValues(t, 0, count.FilteredCount)
		assert.EqualValues(t, 2, count.Count)
	})
}

func Test_Germline_SNV_GetOccurrences_NoteAndFlagFilters_Are_Ored(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		notesRepo := postgres.NewOccurrenceNotesRepository(database.PostgresDB{DB: env.Postgres})
		flagsRepo := postgres.NewOccurrenceFlagsRepository(database.PostgresDB{DB: env.Postgres})

		_, err := notesRepo.Create(t.Context(), types.OccurrenceNote{
			CaseID:       2,
			SeqID:        1,
			TaskID:       5,
			OccurrenceID: "1000",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "Test User",
			TenantCode:   types.DefaultTenantCode,
			Content:      "Test note",
		})
		assert.NoError(t, err)

		_, err = flagsRepo.Upsert(t.Context(), types.OccurrenceFlag{
			CaseID:       2,
			SeqID:        1,
			TaskID:       5,
			OccurrenceID: "2000",
			FlagType:     types.OccurrenceFlagTypeStar,
			TenantCode:   types.DefaultTenantCode,
		})
		assert.NoError(t, err)

		noted, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil, types.WithNoteFilter(true))
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 2, 1, 5, noted)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
		}

		starred, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil, types.WithFlagFilter([]types.OccurrenceFlagType{types.OccurrenceFlagTypeStar}))
		assert.NoError(t, err)
		occurrences, err = repo.GetOccurrences(t.Context(), 2, 1, 5, starred)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "2000", occurrences[0].LocusId)
		}

		// No occurrence carries both, so an AND would keep none.
		notedOrStarred, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil, types.WithNoteFilter(true), types.WithFlagFilter([]types.OccurrenceFlagType{types.OccurrenceFlagTypeStar}))
		assert.NoError(t, err)
		occurrences, err = repo.GetOccurrences(t.Context(), 2, 1, 5, notedOrStarred)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 2)
	})
}

func Test_Germline_SNV_CountOccurrences_NoteAndFlagFilters_Are_Ored(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		notesRepo := postgres.NewOccurrenceNotesRepository(database.PostgresDB{DB: env.Postgres})
		flagsRepo := postgres.NewOccurrenceFlagsRepository(database.PostgresDB{DB: env.Postgres})

		_, err := notesRepo.Create(t.Context(), types.OccurrenceNote{
			CaseID:       2,
			SeqID:        1,
			TaskID:       5,
			OccurrenceID: "1000",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "Test User",
			TenantCode:   types.DefaultTenantCode,
			Content:      "Test note",
		})
		assert.NoError(t, err)

		_, err = flagsRepo.Upsert(t.Context(), types.OccurrenceFlag{
			CaseID:       2,
			SeqID:        1,
			TaskID:       5,
			OccurrenceID: "2000",
			FlagType:     types.OccurrenceFlagTypeStar,
			TenantCode:   types.DefaultTenantCode,
		})
		assert.NoError(t, err)

		notedOrStarred, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields, types.WithNoteFilter(true), types.WithFlagFilter([]types.OccurrenceFlagType{types.OccurrenceFlagTypeStar}))
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(t.Context(), 2, 1, 5, notedOrStarred)
		assert.NoError(t, err)
		assert.EqualValues(t, 2, count.FilteredCount)
		assert.EqualValues(t, 2, count.Count)
	})
}

func Test_Germline_SNV_GetOccurrences_InterpretationAndFlagFilters_Are_Ored(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		flagsRepo := postgres.NewOccurrenceFlagsRepository(database.PostgresDB{DB: env.Postgres})

		err := env.Postgres.Exec(`INSERT INTO interpretation_germline (sequencing_id, case_id, locus_id, transcript_id, condition, classification, classification_criterias, transmission_modes, updated_at, tenant_code)
			VALUES ('1', '2', '2000', 'T001', 'MONDO:0000001', 'LA6668-3', 'PM1', 'autosomal_dominant_de_novo', '2025-05-23 14:57:36.0', ?)`, types.DefaultTenantCode).Error
		assert.NoError(t, err)

		_, err = flagsRepo.Upsert(t.Context(), types.OccurrenceFlag{
			CaseID:       2,
			SeqID:        1,
			TaskID:       5,
			OccurrenceID: "1000",
			FlagType:     types.OccurrenceFlagTypeStar,
			TenantCode:   types.DefaultTenantCode,
		})
		assert.NoError(t, err)

		interpreted, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil, types.WithInterpretationFilter(true))
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 2, 1, 5, interpreted)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "2000", occurrences[0].LocusId)
		}

		// No occurrence carries both, so an AND would keep none.
		interpretedOrStarred, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, nil, nil, nil, types.WithInterpretationFilter(true), types.WithFlagFilter([]types.OccurrenceFlagType{types.OccurrenceFlagTypeStar}))
		assert.NoError(t, err)
		occurrences, err = repo.GetOccurrences(t.Context(), 2, 1, 5, interpretedOrStarred)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 2)
	})
}

func germlineLocusIds(occurrences []GermlineSNVOccurrence) []string {
	return sliceutils.Map(occurrences, func(o GermlineSNVOccurrence, _ int, _ []GermlineSNVOccurrence) string {
		return o.LocusId
	})
}

func getGermlineCmcOccurrences(t *testing.T, env *testutils.Env, sqon *types.Sqon, pagination *types.Pagination, sorted []types.SortBody) []GermlineSNVOccurrence {
	t.Helper()
	repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
	query, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, sqon, pagination, sorted)
	require.NoError(t, err)
	occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 5, query)
	require.NoError(t, err)
	return occurrences
}

func Test_Germline_SNV_GetOccurrences_Returns_Cmc_Fields(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: "in", Content: &types.LeafContent{Field: "locus_id", Value: []interface{}{"1002"}}}
		occurrences := getGermlineCmcOccurrences(t, env, sqon, nil, nil)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 3, *occurrences[0].CmcSampleMutated)
			assert.Equal(t, 0.0003, *occurrences[0].CmcSampleRatio)
			assert.Equal(t, "Other", *occurrences[0].CmcTier)
			assert.Equal(t, "https://cancer.sanger.ac.uk/cosmic/search?q=COSV1002", *occurrences[0].CmcMutationUrl)
		}
	})
}

func Test_Germline_SNV_GetOccurrences_Filter_By_Cmc_Tier(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: "in", Content: &types.LeafContent{Field: "cmc_tier", Value: []interface{}{"1"}}}
		occurrences := getGermlineCmcOccurrences(t, env, sqon, nil, nil)
		assert.ElementsMatch(t, []string{"1000", "1001"}, germlineLocusIds(occurrences))
	})
}

func Test_Germline_SNV_GetOccurrences_Filter_By_Cmc_Sample_Mutated(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: ">=", Content: &types.LeafContent{Field: "cmc_sample_mutated", Value: []interface{}{4}}}
		occurrences := getGermlineCmcOccurrences(t, env, sqon, nil, nil)
		assert.ElementsMatch(t, []string{"1000", "1001"}, germlineLocusIds(occurrences))
	})
}

func Test_Germline_SNV_GetOccurrences_Filter_By_Cmc_Sample_Ratio(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: "between", Content: &types.LeafContent{Field: "cmc_sample_ratio", Value: []interface{}{0.0002, 0.0003}}}
		occurrences := getGermlineCmcOccurrences(t, env, sqon, nil, nil)
		assert.ElementsMatch(t, []string{"1002", "2000"}, germlineLocusIds(occurrences))
	})
}

func Test_Germline_SNV_GetOccurrences_Filter_By_Cmc_Mutation_Url_Is_Rejected(t *testing.T) {
	sqon := &types.Sqon{Op: "in", Content: &types.LeafContent{Field: "cmc_mutation_url", Value: []interface{}{"https://cancer.sanger.ac.uk"}}}
	_, err := types.NewOccurrenceListQueryFromSqon(GermlineSNVQueryConfigForTest, allGermlineSNVFields, sqon, nil, nil)
	assert.ErrorContains(t, err, "unauthorized or unknown field: cmc_mutation_url")
}

func Test_Germline_SNV_GetOccurrences_Sort_By_Cmc_Sample_Ratio_Asc_Puts_Nulls_Last(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		sorted := []types.SortBody{{Field: "cmc_sample_ratio", Order: "asc"}}
		occurrences := getGermlineCmcOccurrences(t, env, nil, &types.Pagination{Limit: 50}, sorted)
		ids := germlineLocusIds(occurrences)
		if assert.Len(t, ids, 29) {
			assert.Equal(t, []string{"1003", "1004"}, ids[:2])
			assert.ElementsMatch(t, []string{"1000", "1001", "1002"}, ids[26:])
		}
	})
}

func Test_Germline_SNV_GetOccurrences_Sort_By_Cmc_Sample_Ratio_Desc_Puts_Nulls_Last(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		sorted := []types.SortBody{{Field: "cmc_sample_ratio", Order: "desc"}}
		occurrences := getGermlineCmcOccurrences(t, env, nil, &types.Pagination{Limit: 50}, sorted)
		ids := germlineLocusIds(occurrences)
		if assert.Len(t, ids, 29) {
			assert.Equal(t, []string{"1028", "1027"}, ids[:2])
			assert.ElementsMatch(t, []string{"1000", "1001", "1002"}, ids[26:])
		}
	})
}

func Test_Germline_SNV_GetOccurrences_Sort_By_Cmc_Sample_Ratio_Asc_First_Page_Skips_Nulls(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		sorted := []types.SortBody{{Field: "cmc_sample_ratio", Order: "asc"}}
		occurrences := getGermlineCmcOccurrences(t, env, nil, &types.Pagination{Limit: 3}, sorted)
		assert.Equal(t, []string{"1003", "1004", "1005"}, germlineLocusIds(occurrences))
	})
}

func Test_Germline_SNV_AggregateOccurrences_By_Cmc_Tier(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewAggregationQueryFromSqon("cmc_tier", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.Equal(t, []Aggregation{
			{Bucket: "2", Count: 1},
			{Bucket: "Other", Count: 1},
			{Bucket: "1", Count: 2},
		}, aggregate)
	})
}

func Test_Germline_SNV_GetStatisticsOccurrences_Cmc_Sample_Mutated(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("cmc_sample_mutated", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 3, statistics.Min)
		assert.EqualValues(t, 28, statistics.Max)
		assert.EqualValues(t, types.IntegerType, statistics.Type)
	})
}

func Test_Germline_SNV_GetStatisticsOccurrences_Cmc_Sample_Ratio(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("cmc_sample_ratio", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 0.0003, statistics.Min)
		assert.EqualValues(t, 0.0028, statistics.Max)
		assert.EqualValues(t, types.DecimalType, statistics.Type)
	})
}

func Test_Germline_SNV_GetStatisticsOccurrences_Germline_Af_Wgs_Affected(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("germline_af_wgs_affected", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 0.05, statistics.Min)
		assert.EqualValues(t, 0.5, statistics.Max)
		assert.EqualValues(t, types.DecimalType, statistics.Type)
	})
}

func Test_Germline_SNV_GetStatisticsOccurrences_Somatic_Hom_To_Wxs(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("somatic_hom_to_wxs", nil, types.GermlineSNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 1, 1, 5, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 0, statistics.Min)
		assert.EqualValues(t, 6, statistics.Max)
		assert.EqualValues(t, types.IntegerType, statistics.Type)
	})
}

func Test_Germline_SNV_GetOccurrences_Filter_By_Germline_Af_Wgs_Affected(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: ">=", Content: &types.LeafContent{Field: "germline_af_wgs_affected", Value: []interface{}{0.5}}}
		occurrences := getGermlineCmcOccurrences(t, env, sqon, &types.Pagination{Limit: 50}, nil)
		assert.ElementsMatch(t, []string{"1009", "1019"}, germlineLocusIds(occurrences))
		for _, o := range occurrences {
			assert.Equal(t, 0.5, *o.GermlineAfWgsAffected)
		}
	})
}

func Test_Germline_SNV_GetOccurrences_Sort_By_Somatic_Hom_To_Wxs_Desc(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		sorted := []types.SortBody{{Field: "somatic_hom_to_wxs", Order: "desc"}}
		occurrences := getGermlineCmcOccurrences(t, env, nil, &types.Pagination{Limit: 4}, sorted)
		assert.ElementsMatch(t, []string{"1006", "1013", "1020", "1027"}, germlineLocusIds(occurrences))
	})
}
