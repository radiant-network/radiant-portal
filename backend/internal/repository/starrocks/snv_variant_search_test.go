package starrocks

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

var locus1Hit = types.VariantSearchHit{Hgvsg: "hgvsg1", Locus: "locus1", Rsnumber: "rs111111111", ClinvarId: "11111", Symbol: "BRAF", AaChange: "p.Arg19His"}
var locus2Hit = types.VariantSearchHit{Hgvsg: "hgvsg2", Locus: "locus2", Rsnumber: "rs222222222", Symbol: "symbol1", AaChange: "p.Arg19His"}

func searchGermline(t *testing.T, env *testutils.Env, seqId int, taskId int, field types.VariantSearchField, value string) []types.VariantSearchHit {
	t.Helper()
	repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
	hits, err := repo.SearchVariants(t.Context(), seqId, taskId, types.VariantIdentifier{Field: field, Value: value})
	assert.NoError(t, err)
	return hits
}

func Test_Germline_SNV_SearchVariants_ByRsnumber(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		hits := searchGermline(t, env, 1, 5, types.VariantSearchFieldRsnumber, "rs111111111")
		assert.Equal(t, []types.VariantSearchHit{locus1Hit}, hits)
	})
}

func Test_Germline_SNV_SearchVariants_ByLocus(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		hits := searchGermline(t, env, 1, 5, types.VariantSearchFieldLocus, "locus1")
		assert.Equal(t, []types.VariantSearchHit{locus1Hit}, hits)
	})
}

func Test_Germline_SNV_SearchVariants_ByHgvsg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		hits := searchGermline(t, env, 1, 5, types.VariantSearchFieldHgvsg, "hgvsg1")
		assert.Equal(t, []types.VariantSearchHit{locus1Hit}, hits)
	})
}

func Test_Germline_SNV_SearchVariants_ByClinvarId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		hits := searchGermline(t, env, 1, 5, types.VariantSearchFieldClinvarId, "11111")
		assert.Equal(t, []types.VariantSearchHit{locus1Hit}, hits)
	})
}

func Test_Germline_SNV_SearchVariants_OmitsUnsetClinvarId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		hits := searchGermline(t, env, 46, 81, types.VariantSearchFieldLocus, "locus2")
		assert.Equal(t, []types.VariantSearchHit{locus2Hit}, hits)
	})
}

func Test_Germline_SNV_SearchVariants_IgnoresVariantsOfOtherRuns(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		// rs222222222 is carried by locus2 (run 46/81) and locus3 (runs 75/83 and 78/84).
		hits := searchGermline(t, env, 46, 81, types.VariantSearchFieldRsnumber, "rs222222222")
		assert.Equal(t, []types.VariantSearchHit{locus2Hit}, hits)
	})
}

func Test_Germline_SNV_SearchVariants_NotInRun(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		hits := searchGermline(t, env, 46, 81, types.VariantSearchFieldRsnumber, "rs111111111")
		assert.Empty(t, hits)
	})
}

func Test_Germline_SNV_SearchVariants_ReadsOnlyTheRunVariantPart(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		// locus2 is in run 46/81 (occurrence part 4, variant part 0); this value only exists in variant part 1.
		hits := searchGermline(t, env, 46, 81, types.VariantSearchFieldHgvsg, "hgvsg2-other-part")
		assert.Empty(t, hits)
	})
}

func Test_Germline_SNV_SearchVariants_UnknownValue(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		hits := searchGermline(t, env, 1, 5, types.VariantSearchFieldRsnumber, "rs999999999")
		assert.Empty(t, hits)
	})
}

func Test_Germline_SNV_SearchVariants_UnknownField(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		hits, err := repo.SearchVariants(t.Context(), 1, 5, types.VariantIdentifier{Field: "symbol", Value: "BRAF"})
		assert.Error(t, err)
		assert.Nil(t, hits)
	})
}

func Test_Somatic_SNV_SearchVariants_ByRsnumber(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		hits, err := repo.SearchVariants(t.Context(), 74, 74, types.VariantIdentifier{Field: types.VariantSearchFieldRsnumber, Value: "rs111111111"})
		assert.NoError(t, err)
		assert.Equal(t, []types.VariantSearchHit{locus1Hit}, hits)
	})
}

func Test_Somatic_SNV_SearchVariants_NotInRun(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewSomaticSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		hits, err := repo.SearchVariants(t.Context(), 74, 74, types.VariantIdentifier{Field: types.VariantSearchFieldRsnumber, Value: "rs222222222"})
		assert.NoError(t, err)
		assert.Empty(t, hits)
	})
}
