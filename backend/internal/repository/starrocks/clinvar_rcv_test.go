package starrocks

import (
	"sort"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_GetClinvarRCV(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "clinvar"}, func(t *testing.T, env *testutils.Env) {
		repo := NewClinvarRCVRepository(database.StarrocksDB{DB: env.Starrocks})
		clinvarRcv, err := repo.GetVariantClinvarConditions(t.Context(), 1000)
		assert.NoError(t, err)

		// Sort result by DateLastEvaluated descending
		sort.Slice(clinvarRcv, func(i, j int) bool {
			return time.Time(*clinvarRcv[i].DateLastEvaluated).After(time.Time(*clinvarRcv[j].DateLastEvaluated))
		})

		if assert.Len(t, clinvarRcv, 2) {
			assert.Equal(t, "123456", clinvarRcv[0].ClinvarId)
			assert.Equal(t, types.JsonArray[string]{"Pathogenic"}, clinvarRcv[0].ClinicalSignificance)
			assert.Equal(t, 1, clinvarRcv[0].SubmissionCount)
			assert.Equal(t, time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC), time.Time(*clinvarRcv[0].DateLastEvaluated))
			assert.Equal(t, time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC), time.Time(*clinvarRcv[1].DateLastEvaluated))
		}
	})
}

func Test_GetClinvarRCV_ExcludesRowsWithNullOrZeroSubmissionCount(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "clinvar"}, func(t *testing.T, env *testutils.Env) {
		repo := NewClinvarRCVRepository(database.StarrocksDB{DB: env.Starrocks})
		clinvarRcv, err := repo.GetVariantClinvarConditions(t.Context(), 1000)
		assert.NoError(t, err)

		for _, rcv := range clinvarRcv {
			assert.NotContains(t, []string{"RCV000004", "RCV000005"}, rcv.Accession)
			assert.Positive(t, rcv.SubmissionCount)
		}
	})
}

func Test_GetClinvarRCV_NullDateLastEvaluated_IsNil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "clinvar"}, func(t *testing.T, env *testutils.Env) {
		repo := NewClinvarRCVRepository(database.StarrocksDB{DB: env.Starrocks})
		clinvarRcv, err := repo.GetVariantClinvarConditions(t.Context(), 2000)
		assert.NoError(t, err)

		if assert.Len(t, clinvarRcv, 1) {
			assert.Equal(t, "RCV000006", clinvarRcv[0].Accession)
			assert.Nil(t, clinvarRcv[0].DateLastEvaluated)
		}
	})
}

func Test_GetClinvarRCV_EmptyVariant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "clinvar"}, func(t *testing.T, env *testutils.Env) {
		repo := NewClinvarRCVRepository(database.StarrocksDB{DB: env.Starrocks})
		clinvarRcv, err := repo.GetVariantClinvarConditions(t.Context(), 42)
		assert.NoError(t, err)
		assert.Len(t, clinvarRcv, 0)
	})
}

func Test_GetClinvarRCV_EmptyClinvarRCV(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "clinvar"}, func(t *testing.T, env *testutils.Env) {
		repo := NewClinvarRCVRepository(database.StarrocksDB{DB: env.Starrocks})
		clinvarRcv, err := repo.GetVariantClinvarConditions(t.Context(), 1003)
		assert.NoError(t, err)
		assert.Len(t, clinvarRcv, 0)
	})
}
