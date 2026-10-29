package starrocks

import (
	"context"
	"database/sql"
	"fmt"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_GetGeneAutoComplete(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "F", 10)
		assert.NoError(t, err)
		assert.Equal(t, 4, len(*genes))
		assert.Equal(t, "ENSG00000000938", (*genes)[0].Source.ID)
		assert.Equal(t, "FGR", (*genes)[0].Source.Name)
		assert.Equal(t, "ENSG00000000938", (*genes)[0].HighLight.ID)
		assert.Equal(t, "<strong>F</strong>GR", (*genes)[0].HighLight.Name)
		assert.Equal(t, "ENSG00000000460", (*genes)[1].Source.ID)
		assert.Equal(t, "ENSG00000001036", (*genes)[2].Source.ID)
		assert.Equal(t, "ENSG00000000971", (*genes)[3].Source.ID)
	})
}

func Test_GetGeneAutoComplete_FindOnGeneId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "ENSG000000004", 10)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*genes))
		assert.Equal(t, "ENSG00000000419", (*genes)[0].Source.ID)
		assert.Equal(t, "ENSG00000000460", (*genes)[1].Source.ID)
		assert.Equal(t, "ENSG00000000457", (*genes)[2].Source.ID)
	})
}

func Test_GetGeneAutoComplete_FindOnNameFirst(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "ENS", 10)
		assert.NoError(t, err)
		assert.Equal(t, 10, len(*genes))
		assert.Equal(t, "ENSA", (*genes)[0].Source.Name)
		assert.Equal(t, "BRAF", (*genes)[1].Source.Name)
		assert.Equal(t, "ENSG00000157764", (*genes)[1].Source.ID)
	})
}

func Test_GetGeneAutoComplete_FindOnAlias(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "HF", 10)
		assert.NoError(t, err)
		assert.Equal(t, 1, len(*genes))
		assert.Equal(t, "CFH", (*genes)[0].Source.Name)
	})
}

func Test_GetGeneAutoComplete_FindOnAliasNotFirst(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		// "ARMS1" is not the first element of CFH's alias array (["ARMD4","ARMS1",...]),
		// so this exercises the ||-delimiter boundary of the collapsed-string match.
		genes, err := repo.GetGeneAutoComplete(t.Context(), "ARMS1", 10)
		assert.NoError(t, err)
		assert.Equal(t, 1, len(*genes))
		assert.Equal(t, "CFH", (*genes)[0].Source.Name)
	})
}

func Test_GetGeneAutoComplete_WithLimit(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "F", 1)
		assert.NoError(t, err)
		assert.Equal(t, 1, len(*genes))
		assert.Equal(t, "ENSG00000000938", (*genes)[0].Source.ID)
		assert.Equal(t, "FGR", (*genes)[0].Source.Name)
		assert.Equal(t, "ENSG00000000938", (*genes)[0].HighLight.ID)
		assert.Equal(t, "<strong>F</strong>GR", (*genes)[0].HighLight.Name)
	})
}

func Test_GetGeneAutoComplete_NoResult(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "not_here", 20)
		assert.NoError(t, err)
		assert.Equal(t, 0, len(*genes))
	})
}

func Test_SearchGenes(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.SearchGenes(t.Context(), []string{"ENSG00000000003", "TNMD", "ensg00000157764", "ensa", "ENSG000000011671111", "BAD_SYMBOL"})
		assert.NoError(t, err)
		assert.Equal(t, 4, len(*genes))
		assert.Equal(t, "BRAF", (*genes)[0].Name)
		assert.Equal(t, "ENSA", (*genes)[1].Name)
		assert.Equal(t, "TNMD", (*genes)[2].Name)
		assert.Equal(t, "TSPAN6", (*genes)[3].Name)
	})
}

func Test_SearchGenes_NoResult(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.SearchGenes(t.Context(), []string{"ENSG000000011671111", "BAD_SYMBOL"})
		assert.NoError(t, err)
		assert.Equal(t, 0, len(*genes))
	})
}

func Test_SearchGenes_NoInput(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.SearchGenes(t.Context(), []string{})
		assert.NoError(t, err)
		assert.Equal(t, 0, len(*genes))
	})
}

// withClosedUserPool binds a closed per-user pool to ctx: a query routed to it fails, so a
// query that succeeds ran on the root pool.
func withClosedUserPool(t *testing.T, ctx context.Context) context.Context {
	t.Helper()
	pool, err := sql.Open("mysql", "nobody@tcp(127.0.0.1:1)/none")
	require.NoError(t, err)
	require.NoError(t, pool.Close())
	return database.ContextWithUserPool(ctx, pool)
}

func Test_ResolveGenes_MatchesSymbolsAndIDsAcrossChunks(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		inputs := []string{"TNMD"}
		for i := 0; i < resolveGenesChunkSize+10; i++ {
			inputs = append(inputs, fmt.Sprintf("NOGENE%d", i))
		}
		inputs = append(inputs, "ENSG00000157764")

		genes, err := repo.ResolveGenes(t.Context(), inputs)

		require.NoError(t, err)
		names := make([]string, len(genes))
		for i, g := range genes {
			names[i] = g.Name
		}
		assert.ElementsMatch(t, []string{"TNMD", "BRAF"}, names)
	})
}

func Test_ResolveGenes_NoInput(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})

		genes, err := repo.ResolveGenes(t.Context(), nil)

		require.NoError(t, err)
		assert.Empty(t, genes)
	})
}

func Test_ResolveGenes_RunsOnRootPoolEvenWithAUserPoolBound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})

		genes, err := repo.ResolveGenes(withClosedUserPool(t, t.Context()), []string{"TNMD"})

		require.NoError(t, err)
		assert.Len(t, genes, 1)
	})
}

func Test_GetGeneTrack_GenesOfEveryBiotypeWithTranscriptExonsOmimInheritanceAndConstraint(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneTrack(t.Context(), "1", 10100, 10600)
		require.NoError(t, err)
		assert.Equal(t, []types.GeneTrackGene{
			{GeneID: "ENSG00000000003", Symbol: "TSPAN6", Chromosome: "1", Start: 10000, End: 10200, Strand: "-", Biotype: "protein_coding", Description: "tetraspanin 6",
				Exons:          []types.GeneTrackExon{{Start: 10000, End: 10100}},
				OmimConditions: []types.OmimGenePanel{{OmimPhenotypeId: "100000", Panel: "Tetraspanin disease"}}},
			{GeneID: "ENSG00000000005", Symbol: "TNMD", Chromosome: "1", Start: 10000, End: 20000, Strand: "+", Biotype: "protein_coding", Description: "tenomodulin",
				// ENST00000000005 has the most exons; the retained intron exon of ENST00000000008 fuses none.
				Exons:               []types.GeneTrackExon{{Start: 10000, End: 10100}, {Start: 10150, End: 10250}, {Start: 10650, End: 10750}},
				OmimInheritanceCode: []string{"AR", "XLR"},
				OmimConditions: []types.OmimGenePanel{
					{OmimPhenotypeId: "100001", Panel: "Tenomodulin disease A", InheritanceCode: types.JsonArray[string]{"AR"}},
					{OmimPhenotypeId: "100002", Panel: "Tenomodulin disease B", InheritanceCode: types.JsonArray[string]{"AR", "XLR"}},
				},
				// The highest pLI and the lowest LOEUF come from two transcripts.
				GnomadPli: ptr(float32(0.95)), GnomadLoeuf: ptr(float32(0.31))},
			{GeneID: "ENSG00000000419", Symbol: "DPM1", Chromosome: "1", Start: 10250, End: 10750, Strand: "-", Biotype: "lncRNA", Description: "dolichyl-phosphate mannosyltransferase subunit 1",
				Exons: []types.GeneTrackExon{{Start: 10600, End: 10700}}, GnomadPli: ptr(float32(0.5))},
		}, genes)
	})
}

func Test_GetGeneTrack_EmptyRegion(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneTrack(t.Context(), "2", 0, 1000000)
		require.NoError(t, err)
		assert.Equal(t, []types.GeneTrackGene{}, genes)
	})
}

func Test_GetGeneTrackBySymbol_IgnoresCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneTrackBySymbol(t.Context(), "tspan6")
		require.NoError(t, err)
		assert.Equal(t, []types.GeneTrackGene{
			{GeneID: "ENSG00000000003", Symbol: "TSPAN6", Chromosome: "1", Start: 10000, End: 10200, Strand: "-", Biotype: "protein_coding", Description: "tetraspanin 6",
				Exons:          []types.GeneTrackExon{{Start: 10000, End: 10100}},
				OmimConditions: []types.OmimGenePanel{{OmimPhenotypeId: "100000", Panel: "Tetraspanin disease"}}},
		}, genes)
	})
}

func Test_GetGeneTrackBySymbol_AnyBiotype(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneTrackBySymbol(t.Context(), "DPM1")
		require.NoError(t, err)
		assert.Equal(t, []types.GeneTrackGene{
			{GeneID: "ENSG00000000419", Symbol: "DPM1", Chromosome: "1", Start: 10250, End: 10750, Strand: "-", Biotype: "lncRNA", Description: "dolichyl-phosphate mannosyltransferase subunit 1",
				Exons: []types.GeneTrackExon{{Start: 10600, End: 10700}}, GnomadPli: ptr(float32(0.5))},
		}, genes)
	})
}

func Test_GetGeneTrackBySymbol_UnknownSymbol(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		genes, err := repo.GetGeneTrackBySymbol(t.Context(), "NOPE1")
		require.NoError(t, err)
		assert.Equal(t, []types.GeneTrackGene{}, genes)
	})
}
