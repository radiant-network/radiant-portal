package postgres

import (
	"database/sql"
	"strconv"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// countLoci returns four loci from base. Each test takes its own base, so the tenant-wide counts see only its rows.
// The rows sit in case 1, which cleanUp keeps: a parallel test's cleanup would delete any other case mid-test.
func countLoci(base int) []string {
	return []string{strconv.Itoa(base + 1), strconv.Itoa(base + 2), strconv.Itoa(base + 3), strconv.Itoa(base + 4)}
}

// The first locus has two distinct classifications, the second a known one, a null one and an empty one,
// the third only a null and an unknown one, the fourth none.
func insertGermlineCountInterpretations(t *testing.T, db *gorm.DB, loci []string) {
	err := db.Exec(`INSERT INTO interpretation_germline (sequencing_id, case_id, locus_id, transcript_id, classification, updated_at, tenant_code)
		VALUES ('2781', '1', @l1, 'T1', 'LA6668-3', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2782', '1', @l1, 'T1', 'LA6668-3', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2783', '1', @l1, 'T1', 'LA6675-8', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2781', '1', @l2, 'T1', 'LA26333-7', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2782', '1', @l2, 'T1', NULL, '2025-05-23 14:57:36.0', 'radiant'),
		       ('2783', '1', @l2, 'T1', '', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2781', '1', @l3, 'T1', NULL, '2025-05-23 14:57:36.0', 'radiant'),
		       ('2782', '1', @l3, 'T1', 'unknown', '2025-05-23 14:57:36.0', 'radiant')
		ON CONFLICT DO NOTHING`,
		sql.Named("l1", loci[0]), sql.Named("l2", loci[1]), sql.Named("l3", loci[2])).Error
	assert.NoError(t, err)
}

// The first locus stores oncogenic as its LOINC code, as the older key and in title case, the second a known one
// and an empty one, the third only a null and an unknown one, the fourth none.
func insertSomaticCountInterpretations(t *testing.T, db *gorm.DB, loci []string) {
	err := db.Exec(`INSERT INTO interpretation_somatic (sequencing_id, case_id, locus_id, transcript_id, oncogenicity, updated_at, tenant_code)
		VALUES ('2781', '1', @l1, 'T1', 'LA6668-3', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2782', '1', @l1, 'T1', 'LA6668-3', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2783', '1', @l1, 'T1', 'oncogenic', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2784', '1', @l1, 'T1', 'Oncogenic', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2785', '1', @l1, 'T1', 'likely_oncogenic', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2786', '1', @l1, 'T1', 'Likely Oncogenic', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2781', '1', @l2, 'T1', 'LA26334-5', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2782', '1', @l2, 'T1', '', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2781', '1', @l3, 'T1', NULL, '2025-05-23 14:57:36.0', 'radiant'),
		       ('2782', '1', @l3, 'T1', 'tier_1', '2025-05-23 14:57:36.0', 'radiant')
		ON CONFLICT DO NOTHING`,
		sql.Named("l1", loci[0]), sql.Named("l2", loci[1]), sql.Named("l3", loci[2])).Error
	assert.NoError(t, err)
}

func Test_Interpretations_ListGermlineClassificationCounts_GroupsPerLocus(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		loci := countLoci(2780000)
		insertGermlineCountInterpretations(t, env.Postgres, loci)
		repo := newTestInterpretationsRepo(env.Postgres)

		counts, err := repo.ListGermlineInterpretationClassificationCounts(types.ContextWithTenant(t.Context(), types.DefaultTenantCode), loci)

		assert.NoError(t, err)
		assert.Equal(t, map[string]types.JsonMap[string, int]{
			loci[0]: {"pathogenic": 2, "benign": 1},
			loci[1]: {"vus": 1},
		}, counts)
	})
}

func Test_Interpretations_ListGermlineClassificationCounts_OtherTenantSeesNothing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		loci := countLoci(2780010)
		insertGermlineCountInterpretations(t, env.Postgres, loci)
		repo := newTestInterpretationsRepo(env.Postgres)

		radiant, err := repo.ListGermlineInterpretationClassificationCounts(types.ContextWithTenant(t.Context(), types.DefaultTenantCode), loci)
		assert.NoError(t, err)
		assert.Len(t, radiant, 2)

		other, err := repo.ListGermlineInterpretationClassificationCounts(types.ContextWithTenant(t.Context(), "tenant_b"), loci)
		assert.NoError(t, err)
		assert.Empty(t, other)
	})
}

func Test_Interpretations_ListGermlineClassificationCounts_NoLoci(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := newTestInterpretationsRepo(env.Postgres)

		counts, err := repo.ListGermlineInterpretationClassificationCounts(t.Context(), nil)

		assert.NoError(t, err)
		assert.Empty(t, counts)
	})
}

func Test_Interpretations_ListSomaticClassificationCounts_GroupsPerLocus(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		loci := countLoci(2780020)
		insertSomaticCountInterpretations(t, env.Postgres, loci)
		repo := newTestInterpretationsRepo(env.Postgres)

		counts, err := repo.ListSomaticInterpretationClassificationCounts(types.ContextWithTenant(t.Context(), types.DefaultTenantCode), loci)

		assert.NoError(t, err)
		assert.Equal(t, map[string]types.JsonMap[string, int]{
			loci[0]: {"oncogenic": 4, "likely_oncogenic": 2},
			loci[1]: {"likely_benign": 1},
		}, counts)
	})
}

func Test_Interpretations_ListSomaticClassificationCounts_OtherTenantSeesNothing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		loci := countLoci(2780030)
		insertSomaticCountInterpretations(t, env.Postgres, loci)
		repo := newTestInterpretationsRepo(env.Postgres)

		other, err := repo.ListSomaticInterpretationClassificationCounts(types.ContextWithTenant(t.Context(), "tenant_b"), loci)

		assert.NoError(t, err)
		assert.Empty(t, other)
	})
}
