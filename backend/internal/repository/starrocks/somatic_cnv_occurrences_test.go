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
)

var allSomaticCnvFields = sliceutils.Map(types.SomaticCNVOccurrencesFields, func(value types.Field, index int, slice []types.Field) string {
	return value.Name
})

var defaultSomaticCnvFieldsForTest = []types.Field{
	types.SomaticCNVNameField,
}

var SomaticCnvQueryConfigForTest = types.QueryConfig{
	AllFields:     types.SomaticCNVOccurrencesFields,
	DefaultFields: defaultSomaticCnvFieldsForTest,
	DefaultSort:   nil,
	IdField:       types.SomaticCNVNameField,
}

func somaticCnvNames(occurrences []SomaticCNVOccurrence) []string {
	return sliceutils.Map(occurrences, func(o SomaticCNVOccurrence, index int, slice []SomaticCNVOccurrence) string {
		return o.Name
	})
}

func Test_SomaticCNV_GetOccurrences(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 3) {
			assert.ElementsMatch(t, []string{"SCNV1", "SCNV2", "SCNV3"}, somaticCnvNames(occurrences))
			for _, occ := range occurrences {
				assert.Equal(t, 74, occ.SeqID)
				assert.Equal(t, 85, occ.TaskID)
				assert.False(t, occ.HasNote)
			}
		}
	})
}

// The tumor sequencing id binds to seq_id, not tumor_seq_id: a query for the normal sequencing
// 73 must return that sequencing's own segment, never the tumoral one's.
func Test_SomaticCNV_GetOccurrences_ScopesToSeqId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 71, 73, 85, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, "SCNV5", occurrences[0].Name)
			assert.Equal(t, 73, occurrences[0].SeqID)
		}
	})
}

func Test_SomaticCNV_GetOccurrences_ScopesToTaskId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 86, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, "SCNV4", occurrences[0].Name)
			assert.Equal(t, 86, occurrences[0].TaskID)
		}
	})
}

func Test_SomaticCNV_GetOccurrences_AscnBlockReturnedWhenRequested(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "name", Value: []interface{}{"SCNV1"}}},
			},
			Op: "and",
		}
		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, sqon, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			occ := occurrences[0]
			if assert.NotNil(t, occ.CN) {
				assert.Equal(t, 3, *occ.CN)
			}
			if assert.NotNil(t, occ.MCN) {
				assert.Equal(t, 1, *occ.MCN)
			}
			if assert.NotNil(t, occ.MAF) {
				assert.InDelta(t, 0.42, *occ.MAF, 0.001)
			}
			if assert.NotNil(t, occ.ASCNAS) {
				assert.Equal(t, 2, *occ.ASCNAS)
			}
		}
	})
}

// DRAGEN 3.10.8 emits no ASCN block at all, so an all-NULL row must round-trip as nil rather
// than as zero values.
func Test_SomaticCNV_GetOccurrences_AscnBlockAllNull(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "name", Value: []interface{}{"SCNV3"}}},
			},
			Op: "and",
		}
		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, sqon, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			occ := occurrences[0]
			assert.Equal(t, "GAINLOH", occ.Type)
			assert.Nil(t, occ.CN)
			assert.Nil(t, occ.CNF)
			assert.Nil(t, occ.CNQ)
			assert.Nil(t, occ.MCN)
			assert.Nil(t, occ.MCNF)
			assert.Nil(t, occ.MCNQ)
			assert.Nil(t, occ.MAF)
			assert.Nil(t, occ.SD)
			assert.Nil(t, occ.ASCNAS)
		}
	})
}

// The ASCN block is deliberately out of the default field set: a client that asks for nothing
// extra must not pay for it.
func Test_SomaticCNV_GetOccurrences_DefaultFieldsExcludeAscnBlock(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewListQueryFromSqon(types.SomaticCNVOccurrencesQueryConfig, nil, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 3) {
			for _, occ := range occurrences {
				assert.Nilf(t, occ.CN, "cn must not be selected by default, got %v", occ.CN)
				assert.Nilf(t, occ.MAF, "maf must not be selected by default, got %v", occ.MAF)
				assert.Nilf(t, occ.ASCNAS, "ascn_as must not be selected by default, got %v", occ.ASCNAS)
				assert.NotEmpty(t, occ.Type)
			}
		}
	})
}

func Test_SomaticCNV_GetOccurrences_NbSnv(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, nil, nil, nil)
		assert.NoError(t, err)

		occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		byName := map[string]int{}
		for _, occ := range occurrences {
			byName[occ.Name] = occ.NbSNV
		}
		assert.Equal(t, 0, byName["SCNV1"], "nb_snv NULL in DB must read 0")
		assert.Equal(t, 3, byName["SCNV2"])
		assert.Equal(t, 1, byName["SCNV3"])
	})
}

func Test_SomaticCNV_GetOccurrences_HasNote_False_When_Note_Is_Deleted(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		notesRepo := postgres.NewOccurrenceNotesRepository(database.PostgresDB{DB: env.Postgres})

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "name", Value: []interface{}{"SCNV1"}}},
			},
			Op: "and",
		}
		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, sqon, nil, nil)
		assert.NoError(t, err)

		note, err := notesRepo.Create(t.Context(), types.OccurrenceNote{
			CaseID:       71,
			SeqID:        74,
			TaskID:       85,
			OccurrenceID: "1",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "Test User",
			TenantCode:   types.DefaultTenantCode,
			Content:      "Test note",
		})
		assert.NoError(t, err)

		occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.True(t, occurrences[0].HasNote)
		}

		err = notesRepo.Delete(t.Context(), note.ID)
		assert.NoError(t, err)

		occurrences, err = repo.GetOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.False(t, occurrences[0].HasNote)
		}
	})
}

func Test_SomaticCNV_GetOccurrences_QualityFilter(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: ">", Content: types.LeafContent{Field: "quality", Value: []interface{}{0.9}}},
			},
			Op: "and",
		}

		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, sqon, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, "SCNV1", occurrences[0].Name)
		}
	})
}

func Test_SomaticCNV_GetOccurrences_PaginationAndSorting(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		sortedBody := []types.SortBody{{Field: "length", Order: "desc"}}

		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, nil, &types.Pagination{Limit: 1, Offset: 0}, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, "SCNV2", occurrences[0].Name, "longest segment sorts first")
		}

		query, err = types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, nil, &types.Pagination{Limit: 2, Offset: 1}, sortedBody)
		assert.NoError(t, err)
		occurrences, err = repo.GetOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 2)
	})
}

func Test_SomaticCNV_CountOccurrences(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, nil, nil, nil)
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(3), count)
	})
}

func Test_SomaticCNV_CountOccurrences_With_Filtering(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "type", Value: []interface{}{"CNLOH", "GAINLOH"}}},
			},
			Op: "and",
		}

		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, sqon, nil, nil)
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(2), count)
	})
}

// The LOH values are somatic-only: germline CNV only ever stores GAIN and LOSS.
func Test_SomaticCNV_AggregateOccurrences_ByType_ReturnsLohBuckets(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewAggregationQueryFromSqon("type", nil, SomaticCnvQueryConfigForTest.AllFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 3) {
			assert.Equal(t, "CNLOH", aggregate[0].Bucket)
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "GAIN", aggregate[1].Bucket)
			assert.EqualValues(t, 1, aggregate[1].Count)
			assert.Equal(t, "GAINLOH", aggregate[2].Bucket)
			assert.EqualValues(t, 1, aggregate[2].Count)
		}
	})
}

func Test_SomaticCNV_GetStatisticsOccurrences_Length(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("length", nil, types.SomaticCNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 500, statistics.Min)
		assert.EqualValues(t, 1500, statistics.Max)
		assert.EqualValues(t, types.IntegerType, statistics.Type)
	})
}

// /statistics is how a client gets a range for an ASCN column, since none of them are aggregable.
func Test_SomaticCNV_GetStatisticsOccurrences_Maf(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("maf", nil, types.SomaticCNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		assert.InDelta(t, 0, statistics.Min, 0.001)
		assert.InDelta(t, 0.42, statistics.Max, 0.001)
		assert.EqualValues(t, types.DecimalType, statistics.Type)
	})
}

func Test_SomaticCNV_GetStatisticsOccurrences_Pe(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewStatisticsQueryFromSqon("pe", nil, types.SomaticCNVOccurrencesFields)
		assert.NoError(t, err)
		statistics, err := repo.GetStatisticsOccurrences(t.Context(), 71, 74, 85, query)
		assert.NoError(t, err)
		assert.EqualValues(t, 1, statistics.Min)
		assert.EqualValues(t, 5, statistics.Max)
		assert.EqualValues(t, types.IntegerType, statistics.Type)
	})
}

func Test_SomaticCNV_GetOccurrences_PanelFilter(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
			},
			Op: "and",
		}

		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, sqon, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 1, occurrences[0].SeqID)
			assert.Equal(t, 1, occurrences[0].TaskID)
			assert.Equal(t, "SCNV1", occurrences[0].Name)
		}
	})
}

func Test_SomaticCNV_CountOccurrences_PanelFilter(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: types.LeafContent{Field: "omim_gene_panel", Value: []interface{}{"panel1", "panel2"}}},
			},
			Op: "and",
		}

		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, sqon, nil, nil)
		assert.NoError(t, err)
		count, err := repo.CountOccurrences(t.Context(), 1, 1, 1, query)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), count)
	})
}

func Test_SomaticCNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Gene_Panel(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewAggregationQueryFromSqon("omim_gene_panel", nil, SomaticCnvQueryConfigForTest.AllFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 2, 2, query)
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

func Test_SomaticCNV_AggregateOccurrences_Return_Expected_Aggregate_When_Agg_By_Cytoband(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "gene_panels"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewAggregationQueryFromSqon("cytoband", nil, SomaticCnvQueryConfigForTest.AllFields)
		assert.NoError(t, err)
		aggregate, err := repo.AggregateOccurrences(t.Context(), 1, 2, 2, query)
		assert.NoError(t, err)
		if assert.Len(t, aggregate, 2) {
			assert.EqualValues(t, 1, aggregate[0].Count)
			assert.Equal(t, "p2", aggregate[0].Bucket)
			assert.EqualValues(t, 2, aggregate[1].Count)
			assert.Equal(t, "p1", aggregate[1].Bucket)
		}
	})
}

// The `multiple` fixture attaches two tasks to the same tumoral seq 74, one per case: the
// repository must filter on task_id so neither case sees the other's segment.
func Test_SomaticCNV_GetOccurrences_TaskIdScopesToOwningCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		query, err := types.NewListQueryFromSqon(SomaticCnvQueryConfigForTest, allSomaticCnvFields, nil, nil, nil)
		assert.NoError(t, err)

		case71Occurrences, err := repo.GetOccurrences(t.Context(), 71, 74, 74, query)
		assert.NoError(t, err)
		assert.ElementsMatch(t, []string{"SCNV1", "SCNV2"}, somaticCnvNames(case71Occurrences))

		case72Occurrences, err := repo.GetOccurrences(t.Context(), 72, 74, 202, query)
		assert.NoError(t, err)
		if assert.Len(t, case72Occurrences, 1) {
			assert.Equal(t, "SCNV_SHARED", case72Occurrences[0].Name)
		}
	})
}

func Test_SomaticCNV_GetGenesOverlap(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		overlaps, err := repo.GetGenesOverlap(t.Context(), 71, 74, 85, 1)
		if assert.NoError(t, err) {
			if assert.Len(t, overlaps, 3) {
				fullGeneOverlap := overlaps[0]
				assert.Equal(t, "TSPAN6", fullGeneOverlap.Symbol)
				assert.EqualValues(t, 200, fullGeneOverlap.GeneLength)
				assert.EqualValues(t, 200, fullGeneOverlap.NbOverlapBases)
				assert.EqualValues(t, 40, fullGeneOverlap.OverlappingCNVPercent)
				assert.EqualValues(t, 100, fullGeneOverlap.OverlappingGenePercent)
				assert.EqualValues(t, "full_gene", fullGeneOverlap.OverlapType)
				assert.EqualValues(t, 1, fullGeneOverlap.NbExons)
				assert.EqualValues(t, "ENSG00000000003", fullGeneOverlap.GeneId)
				assert.EqualValues(t, types.JsonArray[string]{"p1.1"}, fullGeneOverlap.Cytoband)
			}
		}
	})
}
