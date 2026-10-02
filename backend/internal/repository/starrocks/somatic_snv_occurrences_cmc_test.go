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

func somaticLocusIds(occurrences []SomaticSNVOccurrence) []string {
	return sliceutils.Map(occurrences, func(o SomaticSNVOccurrence, _ int, _ []SomaticSNVOccurrence) string {
		return o.LocusId
	})
}

func getSomaticCmcOccurrences(t *testing.T, env *testutils.Env, sqon *types.Sqon, pagination *types.Pagination, sorted []types.SortBody) []SomaticSNVOccurrence {
	t.Helper()
	repo := NewSomaticSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
	query, err := types.NewOccurrenceListQueryFromSqon(types.SomaticSNVOccurrencesQueryConfig, nil, sqon, pagination, sorted)
	require.NoError(t, err)
	occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 74, query)
	require.NoError(t, err)
	return occurrences
}

func Test_Somatic_SNV_GetOccurrences_Default_Fields_Return_Reference_Alternate_And_Cmc(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		occurrences := getSomaticCmcOccurrences(t, env, nil, nil, nil)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, "A", occurrences[0].Reference)
			assert.Equal(t, "T", occurrences[0].Alternate)
			assert.Equal(t, 12, *occurrences[0].CmcSampleMutated)
			assert.Equal(t, 0.0012, *occurrences[0].CmcSampleRatio)
			assert.Equal(t, "1", *occurrences[0].CmcTier)
			assert.Equal(t, "https://cancer.sanger.ac.uk/cosmic/search?q=COSV1000", *occurrences[0].CmcMutationUrl)
		}
	})
}

func Test_Somatic_SNV_GetOccurrences_Filter_By_Cmc_Tier(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: "in", Content: &types.LeafContent{Field: "cmc_tier", Value: []interface{}{"2"}}}
		occurrences := getSomaticCmcOccurrences(t, env, sqon, nil, nil)
		assert.Equal(t, []string{"2000"}, somaticLocusIds(occurrences))
	})
}

func Test_Somatic_SNV_GetOccurrences_Filter_By_Cmc_Sample_Mutated(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: ">", Content: &types.LeafContent{Field: "cmc_sample_mutated", Value: []interface{}{2}}}
		occurrences := getSomaticCmcOccurrences(t, env, sqon, nil, nil)
		assert.Equal(t, []string{"1000"}, somaticLocusIds(occurrences))
	})
}

func Test_Somatic_SNV_GetOccurrences_Filter_By_Cmc_Sample_Ratio(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		sqon := &types.Sqon{Op: "<", Content: &types.LeafContent{Field: "cmc_sample_ratio", Value: []interface{}{0.0003}}}
		occurrences := getSomaticCmcOccurrences(t, env, sqon, nil, nil)
		assert.Equal(t, []string{"2000"}, somaticLocusIds(occurrences))
	})
}

func Test_Somatic_SNV_GetOccurrences_Sort_By_Cmc_Sample_Mutated_Asc_Puts_Nulls_Last(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		sorted := []types.SortBody{{Field: "cmc_sample_mutated", Order: "asc"}}
		occurrences := getSomaticCmcOccurrences(t, env, nil, &types.Pagination{Limit: 50}, sorted)
		ids := somaticLocusIds(occurrences)
		if assert.Len(t, ids, 29) {
			assert.Equal(t, []string{"1003", "1004"}, ids[:2])
			assert.ElementsMatch(t, []string{"1000", "1001", "1002"}, ids[26:])
			last := occurrences[28]
			assert.Nil(t, last.CmcSampleMutated)
			assert.Nil(t, last.CmcSampleRatio)
			assert.Nil(t, last.CmcTier)
			assert.Nil(t, last.CmcMutationUrl)
		}
	})
}

func Test_Somatic_SNV_GetOccurrences_Sort_By_Cmc_Sample_Mutated_Desc_Puts_Nulls_Last(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		sorted := []types.SortBody{{Field: "cmc_sample_mutated", Order: "desc"}}
		occurrences := getSomaticCmcOccurrences(t, env, nil, &types.Pagination{Limit: 50}, sorted)
		ids := somaticLocusIds(occurrences)
		if assert.Len(t, ids, 29) {
			assert.Equal(t, []string{"1028", "1027"}, ids[:2])
			assert.ElementsMatch(t, []string{"1000", "1001", "1002"}, ids[26:])
		}
	})
}

func Test_Somatic_SNV_AggregateOccurrences_By_Cmc_Tier(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "aggregation"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewAggregationQueryFromSqon("cmc_tier", nil, types.SomaticSNVOccurrencesFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 71, 74, 74, query)
		assert.NoError(t, err)
		assert.Equal(t, []Aggregation{
			{Bucket: "1", Count: 1},
			{Bucket: "2", Count: 1},
		}, aggregate)
	})
}

func Test_Somatic_SNV_GetStatisticsOccurrences_Cmc_Sample_Mutated(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("cmc_sample_mutated", nil, types.SomaticSNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 71, 74, 74, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 3, statistics.Min)
		assert.EqualValues(t, 28, statistics.Max)
		assert.EqualValues(t, types.IntegerType, statistics.Type)
	})
}

func Test_Somatic_SNV_GetStatisticsOccurrences_Cmc_Sample_Ratio(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pagination"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("cmc_sample_ratio", nil, types.SomaticSNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 71, 74, 74, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 0.0003, statistics.Min)
		assert.EqualValues(t, 0.0028, statistics.Max)
		assert.EqualValues(t, types.DecimalType, statistics.Type)
	})
}
