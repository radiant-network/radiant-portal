package postgres

import (
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
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

func Test_UsersRepository_ListTenantUsers_SearchMatchesFirstNamePrefix(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant("ALI"))
		require.NoError(t, err)
		assert.Equal(t, int64(1), count)
		require.Len(t, users, 1)
		assert.Equal(t, aliceID, users[0].UserID, "a case-insensitive prefix of the first name matches")
	})
}

func Test_UsersRepository_ListTenantUsers_SearchMatchesLastNamePrefix(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant("ada"))
		require.NoError(t, err)
		require.Len(t, users, 1)
		assert.Equal(t, aliceID, users[0].UserID, "Alice Adams matches on her last name")
	})
}

func Test_UsersRepository_ListTenantUsers_SearchMatchesEmailPrefixCaseInsensitively(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant("MIKE@TEST"))
		require.NoError(t, err)
		require.Len(t, users, 1)
		assert.Equal(t, mikeID, users[0].UserID)
	})
}

func Test_UsersRepository_ListTenantUsers_SearchDoesNotMatchMidWord(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// "dams" and "lice" sit inside Adams / Alice: a StartsWith filter must miss them.
		for _, search := range []string{"dams", "lice", "est.authz"} {
			users, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant(search))
			require.NoError(t, err)
			assert.Emptyf(t, users, "search %q matched mid-word", search)
			assert.Equalf(t, int64(0), count, "search %q matched mid-word", search)
		}
	})
}

func Test_UsersRepository_ListTenantUsers_SearchTreatsWildcardsLiterally(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// Unescaped, "%" and "_" would be ILIKE wildcards and match every user.
		for _, search := range []string{"%", "_"} {
			users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant(search))
			require.NoError(t, err)
			assert.Emptyf(t, users, "search %q was treated as a wildcard", search)
		}
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

func withRoles(search string, roles string) types.ListUsersQuery {
	query := wholeTenant(search)
	query.Roles = types.ListUsersParams{Roles: roles}.ToQuery().Roles
	return query
}

func Test_UsersRepository_ListTenantUsers_FiltersByRole(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, withRoles("", "geneticist"))
		require.NoError(t, err)

		// alice, wendy, dan and carol are radiant's geneticists; nobody else holds the role.
		assert.Equal(t, int64(4), count)
		require.Len(t, users, 4)
		for _, user := range users {
			assert.NotNil(t, roleByCode(&user, "geneticist"), "%s was returned without the filtered role", user.UserID)
		}
	})
}

func Test_UsersRepository_ListTenantUsers_FiltersByAnyOfSeveralRoles(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, withRoles("", "member,tenant_admin"))
		require.NoError(t, err)

		// mike holds member, tara holds tenant_admin — the two roles are ORed, not ANDed.
		require.Len(t, users, 2)
		assert.NotNil(t, userByID(users, mikeID))
		assert.NotNil(t, userByID(users, taraID))
	})
}

func Test_UsersRepository_ListTenantUsers_RoleFilterKeepsTheUsersOtherRoles(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, withRoles("", "researcher"))
		require.NoError(t, err)

		alice := userByID(users, aliceID)
		require.NotNil(t, alice, "alice holds researcher")
		assert.NotNil(t, roleByCode(alice, "geneticist"), "filtering selects users, it must not prune their roles")
	})
}

func Test_UsersRepository_ListTenantUsers_RoleFilterCombinesWithSearch(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		matching, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, withRoles("wendy", "geneticist"))
		require.NoError(t, err)
		assert.Equal(t, int64(1), count, "search AND role, not search OR role")
		require.Len(t, matching, 1)
		assert.Equal(t, wendyID, matching[0].UserID)

		// wendy is a geneticist but not a member, so the two filters exclude each other.
		none, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, withRoles("wendy", "member"))
		require.NoError(t, err)
		assert.Equal(t, int64(0), count)
		assert.Empty(t, none)
	})
}

func Test_UsersRepository_ListTenantUsers_UnknownRoleReturnsEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, withRoles("", "no_such_role"))
		require.NoError(t, err)
		assert.Empty(t, users)
		assert.Equal(t, int64(0), count)
	})
}

func Test_UsersRepository_EmailHasTenantGrant_FindsGrantedUser(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		exists, err := repo.EmailHasTenantGrant(t.Context(), types.DefaultTenantCode, "alice@test.authz")
		require.NoError(t, err)
		assert.True(t, exists)
	})
}

func Test_UsersRepository_EmailHasTenantGrant_IsCaseInsensitive(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		exists, err := repo.EmailHasTenantGrant(t.Context(), types.DefaultTenantCode, "Alice@Test.Authz")
		require.NoError(t, err)
		assert.True(t, exists, "an email differing only in case is the same account")
	})
}

func Test_UsersRepository_EmailHasTenantGrant_IgnoresUnknownEmail(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		exists, err := repo.EmailHasTenantGrant(t.Context(), types.DefaultTenantCode, "nobody@test.authz")
		require.NoError(t, err)
		assert.False(t, exists)
	})
}

func Test_UsersRepository_EmailHasTenantGrant_IsScopedToTheTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// alice is granted in radiant only; carol is granted in both tenants.
		alice, err := repo.EmailHasTenantGrant(t.Context(), "tenant_b", "alice@test.authz")
		require.NoError(t, err)
		assert.False(t, alice, "a grant in another tenant is not access to this one")

		carol, err := repo.EmailHasTenantGrant(t.Context(), "tenant_b", "carol@test.authz")
		require.NoError(t, err)
		assert.True(t, carol)
	})
}

func Test_UsersRepository_RoleScopes_DerivesScopeFromActions(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		scopes, err := repo.RoleScopes(t.Context(), types.DefaultTenantCode,
			[]string{"geneticist", "researcher", "practitioner"})
		require.NoError(t, err)
		assert.Equal(t, map[string]string{
			"geneticist":   types.RoleScopeOrg,
			"researcher":   types.RoleScopeTenant,
			"practitioner": types.RoleScopeMixed,
		}, scopes)
	})
}

func Test_UsersRepository_RoleScopes_OmitsUnknownRole(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		scopes, err := repo.RoleScopes(t.Context(), types.DefaultTenantCode, []string{"member", "no_such_role"})
		require.NoError(t, err)
		assert.Equal(t, map[string]string{"member": types.RoleScopeTenant}, scopes,
			"an unknown role is absent rather than defaulting to a scope")
	})
}

func Test_UsersRepository_RoleScopes_IsScopedToTheTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// practitioner exists in radiant only; tenant_b defines its own geneticist.
		scopes, err := repo.RoleScopes(t.Context(), "tenant_b", []string{"geneticist", "practitioner"})
		require.NoError(t, err)
		assert.Equal(t, map[string]string{"geneticist": types.RoleScopeOrg}, scopes)
	})
}

func Test_UsersRepository_RoleScopes_NoRolesRequestedIsEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		scopes, err := repo.RoleScopes(t.Context(), types.DefaultTenantCode, nil)
		require.NoError(t, err)
		assert.Empty(t, scopes)
	})
}

// seedTenantUser provisions a user the write tests own, so they stay parallel-safe: users and
// user_role are outside testutils.cleanUp's reach, hence the explicit teardown.
func seedTenantUser(t *testing.T, db *gorm.DB, userID string, grants ...types.Grant) {
	t.Helper()
	t.Cleanup(func() {
		db.Exec(`DELETE FROM user_role WHERE user_id = ?`, userID)
		db.Exec(`DELETE FROM users WHERE user_id = ?`, userID)
	})
	require.NoError(t, db.Exec(`
		INSERT INTO users (user_id, email, first_name, last_name)
		VALUES (?, ?, 'Edit', 'Target')`, userID, userID+"@test.authz").Error)
	for _, grant := range grants {
		var org any
		if grant.OrgCode != "" {
			org = grant.OrgCode
		}
		require.NoError(t, db.Exec(`
			INSERT INTO user_role (user_id, tenant_code, org_code, role_code, granted_by)
			VALUES (?, ?, ?, ?, 'seed')`, userID, grant.TenantCode, org, grant.RoleCode).Error)
	}
}

func radiantGrant(orgCode, roleCode string) types.Grant {
	return types.Grant{TenantCode: types.DefaultTenantCode, OrgCode: orgCode, RoleCode: roleCode}
}

func Test_UsersRepository_TenantUser_ReturnsIdentityAndGrants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		user, err := repo.TenantUser(t.Context(), types.DefaultTenantCode, aliceID)
		require.NoError(t, err)

		assert.Equal(t, "alice@test.authz", user.Email)
		assert.Equal(t, "Alice", user.FirstName)
		assert.Equal(t, "Adams", user.LastName)
		assert.Equal(t, []types.Grant{
			radiantGrant("CHOP", "geneticist"),
			radiantGrant("", "researcher"),
		}, user.Grants, "a tenant-wide grant reads as an empty org code")
	})
}

func Test_UsersRepository_TenantUser_UnknownUserIsNotInTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		_, err := repo.TenantUser(t.Context(), types.DefaultTenantCode, "00000000-0000-4000-8000-000000000000")
		assert.ErrorIs(t, err, types.ErrUserNotInTenant)
	})
}

func Test_UsersRepository_TenantUser_IsScopedToTheTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// alice holds roles in radiant only, so she is not a user of tenant_b.
		_, err := repo.TenantUser(t.Context(), "tenant_b", aliceID)
		assert.ErrorIs(t, err, types.ErrUserNotInTenant)
	})
}

func Test_UsersRepository_RolesWithAction_ReturnsTheRolesHoldingIt(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.RolesWithAction(t.Context(), types.DefaultTenantCode, types.ActionManageUser)
		require.NoError(t, err)
		assert.Equal(t, []string{"tenant_admin"}, roles)
	})
}

func Test_UsersRepository_RolesWithAction_UnknownActionIsEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.RolesWithAction(t.Context(), types.DefaultTenantCode, "can_do_nothing")
		require.NoError(t, err)
		assert.Empty(t, roles)
	})
}

func Test_UsersRepository_HasOtherUserWithAnyRole_ExcludesTheUserItself(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// tara is radiant's only tenant_admin (test/data/auth/06_user_role.sql).
		other, err := repo.HasOtherUserWithAnyRole(t.Context(), types.DefaultTenantCode, taraID, []string{"tenant_admin"})
		require.NoError(t, err)
		assert.False(t, other)

		other, err = repo.HasOtherUserWithAnyRole(t.Context(), types.DefaultTenantCode, mikeID, []string{"tenant_admin"})
		require.NoError(t, err)
		assert.True(t, other, "tara holds it, and she is not the excluded user")
	})
}

func Test_UsersRepository_HasOtherUserWithAnyRole_NoRolesIsFalse(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		other, err := repo.HasOtherUserWithAnyRole(t.Context(), types.DefaultTenantCode, taraID, nil)
		require.NoError(t, err)
		assert.False(t, other, "no role confers the action, so nobody can hold it")
	})
}

// storedGrant mirrors a user_role row, with the audit columns the diff must leave alone.
type storedGrant struct {
	RoleCode  string
	OrgCode   *string
	GrantedBy string
	GrantedAt time.Time
}

func storedGrants(t *testing.T, db *gorm.DB, userID string) []storedGrant {
	t.Helper()
	var grants []storedGrant
	require.NoError(t, db.Raw(`
		SELECT role_code, org_code, granted_by, granted_at FROM user_role
		WHERE user_id = ? AND tenant_code = ?
		ORDER BY role_code, org_code`, userID, types.DefaultTenantCode).Scan(&grants).Error)
	return grants
}

func Test_UsersRepository_UpdateTenantUser_AppliesIdentityAndGrantDiff(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d1a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID, radiantGrant("", "member"), radiantGrant("CHOP", "geneticist"))
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.UpdateTenantUser(t.Context(), types.DefaultTenantCode, userID, "Edited", "Name", taraID,
			[]types.Grant{radiantGrant("CHUSJ", "geneticist")},
			[]types.Grant{radiantGrant("CHOP", "geneticist")}))

		user, err := repo.TenantUser(t.Context(), types.DefaultTenantCode, userID)
		require.NoError(t, err)
		assert.Equal(t, "Edited", user.FirstName)
		assert.Equal(t, "Name", user.LastName)
		assert.Equal(t, []types.Grant{
			radiantGrant("CHUSJ", "geneticist"),
			radiantGrant("", "member"),
		}, user.Grants)
	})
}

func Test_UsersRepository_UpdateTenantUser_PreservesTheAuditOfUntouchedGrants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d2a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID, radiantGrant("", "member"))
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})
		before := storedGrants(t, env.Postgres, userID)
		require.Len(t, before, 1)

		require.NoError(t, repo.UpdateTenantUser(t.Context(), types.DefaultTenantCode, userID, "Edit", "Target", taraID,
			[]types.Grant{radiantGrant("", "researcher")}, nil))

		after := storedGrants(t, env.Postgres, userID)
		require.Len(t, after, 2)
		assert.Equal(t, "member", after[0].RoleCode)
		assert.Equal(t, before[0].GrantedBy, after[0].GrantedBy, "an unchanged grant keeps its original author")
		assert.Equal(t, before[0].GrantedAt, after[0].GrantedAt)
		assert.Equal(t, "researcher", after[1].RoleCode)
		assert.Equal(t, taraID, after[1].GrantedBy, "a new grant is attributed to the acting admin")
	})
}

func Test_UsersRepository_UpdateTenantUser_RevokesATenantWideGrant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d3a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID, radiantGrant("", "member"), radiantGrant("", "researcher"))
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// The revoked row stores a NULL org_code, which no equality test would match.
		require.NoError(t, repo.UpdateTenantUser(t.Context(), types.DefaultTenantCode, userID, "Edit", "Target", taraID,
			nil, []types.Grant{radiantGrant("", "researcher")}))

		user, err := repo.TenantUser(t.Context(), types.DefaultTenantCode, userID)
		require.NoError(t, err)
		assert.Equal(t, []types.Grant{radiantGrant("", "member")}, user.Grants)
	})
}

func Test_UsersRepository_UpdateTenantUser_LeavesOtherTenantsAlone(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d4a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID,
			radiantGrant("", "member"),
			types.Grant{TenantCode: "tenant_b", OrgCode: "*", RoleCode: "geneticist"})
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// The same role code exists in tenant_b, so a revoke that forgot the tenant would hit it.
		require.NoError(t, repo.UpdateTenantUser(t.Context(), types.DefaultTenantCode, userID, "Edit", "Target", taraID,
			nil, []types.Grant{{TenantCode: types.DefaultTenantCode, OrgCode: "*", RoleCode: "geneticist"}}))

		elsewhere, err := repo.TenantUser(t.Context(), "tenant_b", userID)
		require.NoError(t, err)
		assert.Equal(t, []types.Grant{{TenantCode: "tenant_b", OrgCode: "*", RoleCode: "geneticist"}}, elsewhere.Grants)
	})
}

func Test_UsersRepository_UpdateTenantUser_NoDiffOnlyUpdatesIdentity(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d5a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID, radiantGrant("", "member"))
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.UpdateTenantUser(t.Context(), types.DefaultTenantCode, userID, "Renamed", "Only", taraID, nil, nil))

		user, err := repo.TenantUser(t.Context(), types.DefaultTenantCode, userID)
		require.NoError(t, err)
		assert.Equal(t, "Renamed", user.FirstName)
		assert.Equal(t, []types.Grant{radiantGrant("", "member")}, user.Grants)
	})
}
