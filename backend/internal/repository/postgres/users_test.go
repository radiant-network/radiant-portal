package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// tara holds tenant_admin tenant-wide in radiant; mike holds the seeded member role at '*'
// (test/data/auth/06_user_role.sql).
const (
	taraID = "a1a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
	mikeID = "9f1d2c3b-4a5e-4f60-8c71-2d3e4f5a6b7c"
)

// wholeTenant mirrors what the handler passes for an unpaged request, minus the default page size:
// parallel provisioning tests add users to radiant, so a test looking for a fixture user must not
// be limited to the first page.
func wholeTenant(search string) types.ListUsersQuery {
	return types.ListUsersParams{Search: search, Limit: utils.MaxLimit}.ToQuery()
}

func userByID(users []types.UserResult, userID string) *types.UserResult {
	for i := range users {
		if users[i].UserID == userID {
			return &users[i]
		}
	}
	return nil
}

func roleByCode(user *types.UserResult, roleCode string) *types.UserRoleResult {
	return findUserRole(user, roleCode)
}

func Test_UsersRepository_ListTenantUsers_GroupsRolesOfOneUser(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant(""))
		require.NoError(t, err)

		alice := userByID(users, aliceID)
		require.NotNil(t, alice, "alice holds two roles in radiant")
		assert.Equal(t, "alice@test.authz", alice.Email)
		assert.Equal(t, "Alice", alice.FirstName)
		assert.Equal(t, "Adams", alice.LastName)

		geneticist := roleByCode(alice, "geneticist")
		require.NotNil(t, geneticist)
		assert.Equal(t, "Geneticist", geneticist.Name)
		assert.Equal(t, types.RoleScopeOrg, geneticist.Scope)
		assert.Equal(t, []string{"CHOP"}, geneticist.OrgCodes)

		researcher := roleByCode(alice, "researcher")
		require.NotNil(t, researcher)
		assert.Equal(t, types.RoleScopeTenant, researcher.Scope)
		assert.Equal(t, []string{}, researcher.OrgCodes, "a tenant-wide grant carries no org")
	})
}

func Test_UsersRepository_ListTenantUsers_KeepsWildcardOrgVerbatim(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant(""))
		require.NoError(t, err)

		wendy := userByID(users, wendyID)
		require.NotNil(t, wendy)
		geneticist := roleByCode(wendy, "geneticist")
		require.NotNil(t, geneticist)
		assert.Equal(t, []string{"*"}, geneticist.OrgCodes, "'*' is not expanded to every org")
	})
}

func Test_UsersRepository_ListTenantUsers_DerivesMixedRoleScope(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant(""))
		require.NoError(t, err)

		pat := userByID(users, patID)
		require.NotNil(t, pat)
		practitioner := roleByCode(pat, "practitioner")
		require.NotNil(t, practitioner)
		assert.Equal(t, types.RoleScopeMixed, practitioner.Scope, "practitioner maps org- and tenant-scoped actions")
		assert.Equal(t, "Practitioner", practitioner.Name)

		tara := userByID(users, taraID)
		require.NotNil(t, tara)
		admin := roleByCode(tara, "tenant_admin")
		require.NotNil(t, admin)
		assert.Equal(t, types.RoleScopeTenant, admin.Scope)
		assert.Equal(t, "Administrator", admin.Name)
	})
}

func Test_UsersRepository_ListTenantUsers_IsolatesTenants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, count, err := repo.ListTenantUsers(t.Context(), "tenant_b", wholeTenant(""))
		require.NoError(t, err)

		// carol is the only user granted in tenant_b, and alice/tara are radiant-only.
		assert.Equal(t, int64(1), count)
		require.Len(t, users, 1)
		assert.Equal(t, carolID, users[0].UserID)
		assert.Len(t, users[0].Roles, 2, "carol holds geneticist and researcher in tenant_b")
		assert.Nil(t, roleByCode(&users[0], "member"), "her radiant grants must not leak in")
	})
}

func Test_UsersRepository_ListTenantUsers_UnknownTenantReturnsEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, count, err := repo.ListTenantUsers(t.Context(), "no_such_tenant", wholeTenant(""))
		require.NoError(t, err)
		assert.Empty(t, users)
		assert.Equal(t, int64(0), count)
	})
}

func Test_UsersRepository_ListTenantUsers_SearchMatchesFullName(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant("ice ada"))
		require.NoError(t, err)
		assert.Equal(t, int64(1), count)
		require.Len(t, users, 1)
		assert.Equal(t, aliceID, users[0].UserID)
	})
}

func Test_UsersRepository_ListTenantUsers_SearchMatchesEmailCaseInsensitively(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant("MIKE@TEST"))
		require.NoError(t, err)
		require.Len(t, users, 1)
		assert.Equal(t, mikeID, users[0].UserID)
	})
}

func Test_UsersRepository_ListTenantUsers_SearchWithoutMatchReturnsEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant("zzz-nobody"))
		require.NoError(t, err)
		assert.Empty(t, users)
		assert.Equal(t, int64(0), count)
	})
}

// Exclusive because it asserts on an exact page and count over the shared seed data, which the
// parallel grant-writing tests would otherwise perturb.
func Test_UsersRepository_ListTenantUsers_PaginatesWithoutAffectingCount(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		all, total, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant(""))
		require.NoError(t, err)
		require.Greater(t, len(all), 3)

		page, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode,
			types.ListUsersParams{Limit: 2, Offset: 1}.ToQuery())
		require.NoError(t, err)

		assert.Equal(t, total, count, "count ignores limit/offset")
		require.Len(t, page, 2)
		assert.Equal(t, all[1].UserID, page[0].UserID, "offset 1 skips the first user of the sorted list")
		assert.Equal(t, all[2].UserID, page[1].UserID)
	})
}

func Test_UsersRepository_ListTenantUsers_SortsByName(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant(""))
		require.NoError(t, err)

		lastNames := []string{}
		for _, user := range users {
			lastNames = append(lastNames, user.LastName)
		}
		assert.IsNonDecreasing(t, lastNames)
	})
}
