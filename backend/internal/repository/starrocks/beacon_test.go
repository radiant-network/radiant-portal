package starrocks

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/beacon"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func withBeaconRepo(t *testing.T, fn func(t *testing.T, repo *BeaconVariantsRepository)) {
	testutils.RunTest(t, testutils.Need{Starrocks: "beacon"}, func(t *testing.T, env *testutils.Env) {
		fn(t, NewBeaconVariantsRepository(database.StarrocksDB{DB: env.Starrocks}))
	})
}

// tp53R175H is chr17:7674220 C>T in the table's 1-based coordinates.
var tp53R175H = beacon.VariantQuery{Kind: beacon.KindSequence, Chromosome: "17", Start: 7674220, ReferenceBases: "C", AlternateBases: "T"}

func Test_BeaconVariants_Sequence_Exists(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		exists, err := repo.Exists(t.Context(), tp53R175H)
		require.NoError(t, err)
		assert.True(t, exists)
	})
}

func Test_BeaconVariants_Sequence_WrongAlternate_DoesNotExist(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		q := tp53R175H
		q.AlternateBases = "G"
		exists, err := repo.Exists(t.Context(), q)
		require.NoError(t, err)
		assert.False(t, exists)
		count, err := repo.Count(t.Context(), q)
		require.NoError(t, err)
		assert.Equal(t, int64(0), count)
	})
}

func Test_BeaconVariants_Sequence_OffByOne_DoesNotExist(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		q := tp53R175H
		q.Start = 7674219
		exists, err := repo.Exists(t.Context(), q)
		require.NoError(t, err)
		assert.False(t, exists)
	})
}

func Test_BeaconVariants_Range_CountsOverlaps(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		// Covers the deletion (7673800-7673805), R175H (7674220) and R248Q (7675088), not BRAF on chr7.
		q := beacon.VariantQuery{Kind: beacon.KindRange, Chromosome: "17", Start: 7673000, End: 7676000}
		count, err := repo.Count(t.Context(), q)
		require.NoError(t, err)
		assert.Equal(t, int64(3), count)
	})
}

func Test_BeaconVariants_Range_OverlapsDeletionByEndOnly(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		// The window sits inside the deletion, after its start: only the `end` column can match it.
		q := beacon.VariantQuery{Kind: beacon.KindRange, Chromosome: "17", Start: 7673804, End: 7673804}
		rows, err := repo.List(t.Context(), q, 0, 10)
		require.NoError(t, err)
		require.Len(t, rows, 1)
		assert.Equal(t, int64(1004), rows[0].LocusID)
	})
}

func Test_BeaconVariants_Range_WithVariantClass(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		q := beacon.VariantQuery{Kind: beacon.KindRange, Chromosome: "17", Start: 7673000, End: 7676000, VariantClass: "deletion"}
		rows, err := repo.List(t.Context(), q, 0, 10)
		require.NoError(t, err)
		require.Len(t, rows, 1)
		assert.Equal(t, int64(1004), rows[0].LocusID)
	})
}

func Test_BeaconVariants_Range_WithLengthBounds(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		q := beacon.VariantQuery{Kind: beacon.KindRange, Chromosome: "17", Start: 7673000, End: 7676000, MinLength: 2}
		count, err := repo.Count(t.Context(), q)
		require.NoError(t, err)
		assert.Equal(t, int64(1), count, "only the 6-base deletion is at least 2 bases long")

		q = beacon.VariantQuery{Kind: beacon.KindRange, Chromosome: "17", Start: 7673000, End: 7676000, MaxLength: 1}
		count, err = repo.Count(t.Context(), q)
		require.NoError(t, err)
		assert.Equal(t, int64(2), count)
	})
}

func Test_BeaconVariants_Range_WithAlternateBases(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		q := beacon.VariantQuery{Kind: beacon.KindRange, Chromosome: "17", Start: 7673000, End: 7676000, AlternateBases: "G"}
		rows, err := repo.List(t.Context(), q, 0, 10)
		require.NoError(t, err)
		require.Len(t, rows, 1)
		assert.Equal(t, int64(1004), rows[0].LocusID)
	})
}

func Test_BeaconVariants_Gene_OrderedByPosition(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		q := beacon.VariantQuery{Kind: beacon.KindGene, GeneSymbol: "TP53"}
		rows, err := repo.List(t.Context(), q, 0, 10)
		require.NoError(t, err)
		require.Len(t, rows, 3)
		assert.Equal(t, []int64{1004, 1001, 1002}, []int64{rows[0].LocusID, rows[1].LocusID, rows[2].LocusID})
	})
}

func Test_BeaconVariants_Gene_Pagination(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		q := beacon.VariantQuery{Kind: beacon.KindGene, GeneSymbol: "TP53"}
		rows, err := repo.List(t.Context(), q, 1, 1)
		require.NoError(t, err)
		require.Len(t, rows, 1)
		assert.Equal(t, int64(1001), rows[0].LocusID)
		count, err := repo.Count(t.Context(), q)
		require.NoError(t, err)
		assert.Equal(t, int64(3), count, "count ignores pagination")
	})
}

func Test_BeaconVariants_Gene_Unknown_Empty(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		rows, err := repo.List(t.Context(), beacon.VariantQuery{Kind: beacon.KindGene, GeneSymbol: "NOPE"}, 0, 10)
		require.NoError(t, err)
		assert.Equal(t, 0, len(rows))
		assert.NotNil(t, rows)
	})
}

func Test_BeaconVariants_Aminoacid(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		rows, err := repo.List(t.Context(), beacon.VariantQuery{Kind: beacon.KindAminoacid, AminoacidChange: "p.Val600Glu"}, 0, 10)
		require.NoError(t, err)
		require.Len(t, rows, 1)
		assert.Equal(t, "BRAF", rows[0].Symbol)
	})
}

func Test_BeaconVariants_GeneWithAminoacid_RestrictsToGene(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		exists, err := repo.Exists(t.Context(), beacon.VariantQuery{Kind: beacon.KindGene, GeneSymbol: "TP53", AminoacidChange: "p.Val600Glu"})
		require.NoError(t, err)
		assert.False(t, exists)
	})
}

func Test_BeaconVariants_GetByLocusID_Found(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		row, err := repo.GetByLocusID(t.Context(), 1001)
		require.NoError(t, err)
		require.NotNil(t, row)
		assert.Equal(t, "17", row.Chromosome)
		assert.Equal(t, int64(7674220), row.Start)
		require.NotNil(t, row.End)
		assert.Equal(t, int64(7674220), *row.End)
		assert.Equal(t, "TP53", row.Symbol)
		assert.Equal(t, "p.Arg175His", row.AaChange)
		assert.Equal(t, "VCV000012374", row.ClinvarName)
		assert.Equal(t, []string{"missense_variant"}, []string(row.Consequences))
		require.NotNil(t, row.GermlinePcWgs)
		assert.Equal(t, 3, *row.GermlinePcWgs)
		require.NotNil(t, row.GermlinePfWgs)
		assert.InDelta(t, 0.0073, *row.GermlinePfWgs, 1e-9)
		require.NotNil(t, row.GnomadV3Af)
	})
}

func Test_BeaconVariants_GetByLocusID_NullColumns(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		row, err := repo.GetByLocusID(t.Context(), 1006)
		require.NoError(t, err)
		require.NotNil(t, row)
		assert.Empty(t, row.AaChange)
		assert.Nil(t, row.GnomadV3Af)
		assert.Nil(t, row.Consequences)
	})
}

func Test_BeaconVariants_GetByLocusID_NotFound(t *testing.T) {
	withBeaconRepo(t, func(t *testing.T, repo *BeaconVariantsRepository) {
		row, err := repo.GetByLocusID(t.Context(), 9999)
		require.NoError(t, err)
		assert.Nil(t, row)
	})
}
