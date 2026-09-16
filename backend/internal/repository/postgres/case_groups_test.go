package postgres

import (
	"errors"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// Cases 1 and 2 are seeded fixtures that cleanUp preserves (ids >= 1000 are wiped by any parallel
// test's teardown). Group names are unique per test and each test deletes its own row: a global cleanUp rule would
// run from a parallel test's teardown and wipe rows a still-running test is about to read.
func trackCaseGroup(t *testing.T, db *gorm.DB, tenantCode, name string) {
	t.Helper()
	t.Cleanup(func() { db.Exec("DELETE FROM case_group WHERE tenant_code = ? AND name = ?", tenantCode, name) })
}

func Test_UpsertCaseGroup_CreatesGroup(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_create")

		group, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_create", []int{2, 1}, "user-sub")
		require.NoError(t, err)
		assert.Equal(t, "radiant", group.TenantCode)
		assert.Equal(t, "cg_create", group.Name)
		assert.Equal(t, "1,2", group.CaseIDs)
		assert.Equal(t, "user-sub", group.CreatedBy)
		assert.False(t, group.CreatedOn.IsZero())
	})
}

func Test_UpsertCaseGroup_OverwritesCaseIds(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_create")

		first, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_overwrite", []int{1, 2}, "first-sub")
		require.NoError(t, err)
		second, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_overwrite", []int{2}, "second-sub")
		require.NoError(t, err)

		assert.Equal(t, "2", second.CaseIDs)
		// Overwrite keeps the original provenance.
		assert.Equal(t, "first-sub", second.CreatedBy)
		assert.Equal(t, first.CreatedOn, second.CreatedOn)
	})
}

func Test_UpsertCaseGroup_EmptyCaseIds(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_create")

		group, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_empty", []int{}, "user-sub")
		require.NoError(t, err)
		assert.Equal(t, "", group.CaseIDs)
	})
}

func Test_UpsertCaseGroup_UnknownCaseId_Error(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_create")

		group, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_unknown", []int{1, 999999, 999998}, "user-sub")
		assert.Nil(t, group)
		var unknown *types.UnknownCaseIDsError
		require.True(t, errors.As(err, &unknown))
		assert.Equal(t, []int{999998, 999999}, unknown.IDs)

		stored, err := repo.GetCaseGroupByName(t.Context(), "radiant", "cg_unknown")
		require.NoError(t, err)
		assert.Nil(t, stored, "nothing must be written when a case id is unknown")
	})
}

func Test_UpsertCaseGroup_CaseFromOtherTenant_Unknown(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_create")

		_, err := repo.UpsertCaseGroup(t.Context(), "tenant_b", "cg_other_tenant", []int{1}, "user-sub")
		var unknown *types.UnknownCaseIDsError
		require.True(t, errors.As(err, &unknown))
		assert.Equal(t, []int{1}, unknown.IDs)
	})
}

func Test_UpsertCaseGroup_SameNameOtherTenant_Independent(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_create")

		_, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_shared_name", []int{1}, "user-sub")
		require.NoError(t, err)
		other, err := repo.UpsertCaseGroup(t.Context(), "tenant_b", "cg_shared_name", []int{}, "user-sub")
		require.NoError(t, err)
		assert.Equal(t, "", other.CaseIDs)

		radiant, err := repo.GetCaseGroupByName(t.Context(), "radiant", "cg_shared_name")
		require.NoError(t, err)
		assert.Equal(t, "1", radiant.CaseIDs)
	})
}

func Test_GetCaseGroupByName_NotFound_Nil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_create")

		group, err := repo.GetCaseGroupByName(t.Context(), "radiant", "cg_does_not_exist")
		require.NoError(t, err)
		assert.Nil(t, group)
	})
}

func Test_GetCaseGroupByName_OtherTenant_Nil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_create")
		_, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_tenant_scoped", []int{}, "user-sub")
		require.NoError(t, err)

		group, err := repo.GetCaseGroupByName(t.Context(), "tenant_b", "cg_tenant_scoped")
		require.NoError(t, err)
		assert.Nil(t, group)
	})
}

func Test_ListCaseGroupsByCaseID_ReturnsContainingGroupsSortedByName(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		for _, name := range []string{"cg_rev_b", "cg_rev_a", "cg_rev_other"} {
			trackCaseGroup(t, env.Postgres, "radiant", name)
		}
		trackCaseGroup(t, env.Postgres, "tenant_b", "cg_rev_tenant_b")
		_, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_rev_b", []int{1, 2}, "user-sub")
		require.NoError(t, err)
		_, err = repo.UpsertCaseGroup(t.Context(), "radiant", "cg_rev_a", []int{1}, "user-sub")
		require.NoError(t, err)
		_, err = repo.UpsertCaseGroup(t.Context(), "radiant", "cg_rev_other", []int{2}, "user-sub")
		require.NoError(t, err)
		// Same case id in another tenant must not leak into the radiant result.
		_, err = repo.UpsertCaseGroup(t.Context(), "tenant_b", "cg_rev_tenant_b", []int{}, "user-sub")
		require.NoError(t, err)
		env.Postgres.Exec("UPDATE case_group SET case_ids = '1' WHERE tenant_code = 'tenant_b' AND name = 'cg_rev_tenant_b'")

		groups, err := repo.ListCaseGroupsByCaseID(t.Context(), "radiant", 1)
		require.NoError(t, err)
		names := make([]string, 0, len(groups))
		for _, g := range groups {
			names = append(names, g.Name)
		}
		// Other parallel tests may hold case 1 in their own groups; assert on ours only.
		assert.Subset(t, names, []string{"cg_rev_a", "cg_rev_b"})
		assert.NotContains(t, names, "cg_rev_other")
		assert.NotContains(t, names, "cg_rev_tenant_b")
		assert.IsIncreasing(t, names)
	})
}

func Test_ListCaseGroupsByCaseID_NoMatch_EmptyNotNil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})

		groups, err := repo.ListCaseGroupsByCaseID(t.Context(), "radiant", 987654321)
		require.NoError(t, err)
		assert.NotNil(t, groups)
		assert.Empty(t, groups)
	})
}

// The planner only takes the GIN index when the query expression is byte-identical to the index
// expression; this pins that match. The tenant_code predicate is left out on purpose (the PK btree
// would win it on a tiny table) and enable_seqscan is off, so the GIN index is the only path left.
func Test_ListCaseGroupsByCaseID_UsesGinIndex(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		var plan []string
		err := env.Postgres.Transaction(func(tx *gorm.DB) error {
			if err := tx.Exec("SET LOCAL enable_seqscan = off").Error; err != nil {
				return err
			}
			return tx.Raw("EXPLAIN SELECT * FROM case_group WHERE string_to_array(case_ids, ',')::int[] @> ARRAY[?]::int[]", 1).
				Scan(&plan).Error
		})
		require.NoError(t, err)
		assert.Contains(t, strings.Join(plan, "\n"), "case_group_case_ids_idx")
	})
}
