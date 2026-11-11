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

// Exclusive: it asserts tenant_b holds exactly one user, and the parallel tests that check a write
// is tenant-scoped grant themselves a second tenant_b role to prove it.
func Test_UsersRepository_ListTenantUsers_IsolatesTenants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
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

// seedSearchableUser adds a radiant researcher whose name the search tests match on. researcher
// is deliberate: it is the one seeded role no test counts exactly, so an extra holder is harmless.
func seedSearchableUser(t *testing.T, db *gorm.DB, userID, firstName, lastName, email string) {
	t.Helper()
	t.Cleanup(func() {
		db.Exec(`DELETE FROM user_role WHERE user_id = ?`, userID)
		db.Exec(`DELETE FROM users WHERE user_id = ?`, userID)
	})
	require.NoError(t, db.Exec(`
		INSERT INTO users (user_id, email, first_name, last_name)
		VALUES (?, ?, ?, ?)`, userID, email, firstName, lastName).Error)
	require.NoError(t, db.Exec(`
		INSERT INTO user_role (user_id, tenant_code, org_code, role_code, granted_by)
		VALUES (?, 'radiant', NULL, 'researcher', 'seed')`, userID).Error)
}

// Exclusive rather than added to the shared fixture: an accented last name sorts between its
// unaccented neighbours in Postgres but after every ASCII name byte-wise, which is what the
// SortsByName assertion compares.
func Test_UsersRepository_ListTenantUsers_SearchIgnoresAccentsOnBothSides(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		const (
			accentedID   = "f5e4d3c2-b1a0-4988-8776-655443322110"
			unaccentedID = "0112233a-4455-4667-8899-aabbccddeeff"
		)
		seedSearchableUser(t, env.Postgres, accentedID, "Frédéric", "Lévesque", "frederic.levesque@accent.test")
		seedSearchableUser(t, env.Postgres, unaccentedID, "Frederic", "Levesque", "flevesque@accent.test")

		// Every combination of an accented/unaccented term against an accented/unaccented value.
		for _, search := range []string{"fre", "fré", "lev", "lév", "Frédéric", "Frederic"} {
			users, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant(search))
			require.NoError(t, err)
			assert.Equalf(t, int64(2), count, "search %q", search)
			assert.NotNilf(t, userByID(users, accentedID), "search %q missed the accented member", search)
			assert.NotNilf(t, userByID(users, unaccentedID), "search %q missed the unaccented member", search)
		}
	})
}

// Exclusive for the same reason as the test above.
func Test_UsersRepository_ListTenantUsers_SearchIgnoresEveryDiacritic(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		const francoisID = "aabbccdd-eeff-4001-8223-334455667788"
		seedSearchableUser(t, env.Postgres, francoisID, "François", "Côté", "françois.côté@accent.test")

		// Cedilla, circumflex and acute, matched on the first name, the last name and the email —
		// and the email folds on the stored side too, being the one field that carries the accents.
		for _, search := range []string{"francois", "François", "cot", "Côté", "francois.cote@", "françois.côté@"} {
			users, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant(search))
			require.NoError(t, err)
			assert.Equalf(t, int64(1), count, "search %q", search)
			require.Lenf(t, users, 1, "search %q", search)
			assert.Equalf(t, francoisID, users[0].UserID, "search %q", search)
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

// systemUserID is the fixture machine-to-machine account: a grant in radiant, but no email or
// name (test/data/auth/05_users.sql).
const systemUserID = "c0ffee00-1111-4222-8333-444455556666"

func Test_UsersRepository_ListTenantUsers_ExcludesSystemUsers(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		users, _, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, wholeTenant(""))
		require.NoError(t, err)
		assert.Nil(t, userByID(users, systemUserID), "a machine-to-machine account is not administered by a person")

		// The role filter must not reintroduce it: it holds data_manager, like gabe.
		managers, count, err := repo.ListTenantUsers(t.Context(), types.DefaultTenantCode, withRoles("", "data_manager"))
		require.NoError(t, err)
		assert.Nil(t, userByID(managers, systemUserID))
		assert.Equal(t, int64(len(managers)), count, "count and page agree on the exclusion")
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

// Exclusive for the same reason as the pagination test: it asserts an exact count over the shared
// seed data, which the parallel grant-writing tests would perturb.
func Test_UsersRepository_ListTenantUsers_FiltersByRole(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
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
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
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

func Test_UsersRepository_TenantUserGrants_ReturnsEveryGrantInTheTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		grants, err := repo.TenantUserGrants(t.Context(), types.DefaultTenantCode, aliceID)
		require.NoError(t, err)

		assert.Equal(t, []types.Grant{
			radiantGrant("CHOP", "geneticist"),
			radiantGrant("", "researcher"),
		}, grants, "a tenant-wide grant reads as an empty org code")
	})
}

func Test_UsersRepository_TenantUserGrants_UnknownUserIsNotInTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		_, err := repo.TenantUserGrants(t.Context(), types.DefaultTenantCode, "00000000-0000-4000-8000-000000000000")
		assert.ErrorIs(t, err, types.ErrUserNotInTenant)
	})
}

func Test_UsersRepository_TenantUserGrants_IsScopedToTheTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// alice holds roles in radiant only, so she is not a user of tenant_b.
		_, err := repo.TenantUserGrants(t.Context(), "tenant_b", aliceID)
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

func Test_UsersRepository_UpdateTenantUserRoles_AppliesTheGrantDiff(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d1a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID, radiantGrant("", "member"), radiantGrant("CHOP", "geneticist"))
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.UpdateTenantUserRoles(t.Context(), types.DefaultTenantCode, userID, taraID,
			[]types.Grant{radiantGrant("CHUSJ", "geneticist")},
			[]types.Grant{radiantGrant("CHOP", "geneticist")}))

		grants, err := repo.TenantUserGrants(t.Context(), types.DefaultTenantCode, userID)
		require.NoError(t, err)
		assert.Equal(t, []types.Grant{
			radiantGrant("CHUSJ", "geneticist"),
			radiantGrant("", "member"),
		}, grants)
	})
}

func Test_UsersRepository_UpdateTenantUserRoles_PreservesTheAuditOfUntouchedGrants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d2a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID, radiantGrant("", "member"))
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})
		before := storedGrants(t, env.Postgres, userID)
		require.Len(t, before, 1)

		require.NoError(t, repo.UpdateTenantUserRoles(t.Context(), types.DefaultTenantCode, userID, taraID,
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

func Test_UsersRepository_UpdateTenantUserRoles_RevokesATenantWideGrant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d3a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID, radiantGrant("", "member"), radiantGrant("", "researcher"))
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// The revoked row stores a NULL org_code, which no equality test would match.
		require.NoError(t, repo.UpdateTenantUserRoles(t.Context(), types.DefaultTenantCode, userID, taraID,
			nil, []types.Grant{radiantGrant("", "researcher")}))

		grants, err := repo.TenantUserGrants(t.Context(), types.DefaultTenantCode, userID)
		require.NoError(t, err)
		assert.Equal(t, []types.Grant{radiantGrant("", "member")}, grants)
	})
}

func Test_UsersRepository_UpdateTenantUserRoles_LeavesOtherTenantsAlone(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d4a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID,
			radiantGrant("", "member"),
			types.Grant{TenantCode: "tenant_b", OrgCode: "*", RoleCode: "geneticist"})
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// The same role code exists in tenant_b, so a revoke that forgot the tenant would hit it.
		require.NoError(t, repo.UpdateTenantUserRoles(t.Context(), types.DefaultTenantCode, userID, taraID,
			nil, []types.Grant{{TenantCode: types.DefaultTenantCode, OrgCode: "*", RoleCode: "geneticist"}}))

		elsewhere, err := repo.TenantUserGrants(t.Context(), "tenant_b", userID)
		require.NoError(t, err)
		assert.Equal(t, []types.Grant{{TenantCode: "tenant_b", OrgCode: "*", RoleCode: "geneticist"}}, elsewhere)
	})
}

func Test_UsersRepository_UpdateTenantUserRoles_EmptyDiffLeavesTheGrantsAlone(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d5a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID, radiantGrant("", "member"))
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})
		before := storedGrants(t, env.Postgres, userID)

		require.NoError(t, repo.UpdateTenantUserRoles(t.Context(), types.DefaultTenantCode, userID, taraID, nil, nil))

		assert.Equal(t, before, storedGrants(t, env.Postgres, userID), "an edit that changes no role touches no row")
	})
}

func Test_UsersRepository_RemoveTenantUser_RevokesEveryGrantIncludingMember(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d6a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID,
			radiantGrant("", "member"), radiantGrant("CHOP", "geneticist"), radiantGrant("", "researcher"))
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.RemoveTenantUser(t.Context(), types.DefaultTenantCode, userID))

		_, err := repo.TenantUserGrants(t.Context(), types.DefaultTenantCode, userID)
		assert.ErrorIs(t, err, types.ErrUserNotInTenant, "member is revoked too — the user is out of the tenant")
	})
}

func Test_UsersRepository_RemoveTenantUser_KeepsTheIdentity(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d7a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID, radiantGrant("", "member"))
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.RemoveTenantUser(t.Context(), types.DefaultTenantCode, userID))

		var remaining int64
		require.NoError(t, env.Postgres.Raw(`SELECT count(*) FROM users WHERE user_id = ?`, userID).Scan(&remaining).Error)
		assert.Equal(t, int64(1), remaining, "the identity registry outlives the tenant access")
	})
}

func Test_UsersRepository_RemoveTenantUser_LeavesOtherTenantsAlone(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d8a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID,
			radiantGrant("", "member"),
			types.Grant{TenantCode: "tenant_b", OrgCode: "*", RoleCode: "geneticist"})
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.RemoveTenantUser(t.Context(), types.DefaultTenantCode, userID))

		elsewhere, err := repo.TenantUserGrants(t.Context(), "tenant_b", userID)
		require.NoError(t, err)
		assert.Equal(t, []types.Grant{{TenantCode: "tenant_b", OrgCode: "*", RoleCode: "geneticist"}}, elsewhere)
	})
}

func Test_UsersRepository_RemoveTenantUser_UserWithoutGrantsIsNotAnError(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const userID = "d9a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"
		seedTenantUser(t, env.Postgres, userID)
		repo := NewUsersRepository(database.PostgresDB{DB: env.Postgres})

		// A revoke retried after a partial failure finds nothing left to delete.
		assert.NoError(t, repo.RemoveTenantUser(t.Context(), types.DefaultTenantCode, userID))
	})
}
