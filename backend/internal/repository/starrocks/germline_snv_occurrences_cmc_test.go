package starrocks

import (
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

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
