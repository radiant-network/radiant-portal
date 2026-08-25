package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func roleByCodeIn(roles []types.RoleResult, code string) *types.RoleResult {
	for i := range roles {
		if roles[i].Code == code {
			return &roles[i]
		}
	}
	return nil
}

func actionCodes(role *types.RoleResult) []string {
	codes := make([]string, len(role.Actions))
	for i, action := range role.Actions {
		codes[i] = action.Code
	}
	return codes
}

func Test_RolesRepository_ListTenantRoles_ReturnsSeededAndCustomRoles(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.ListTenantRoles(t.Context(), types.DefaultTenantCode)
		require.NoError(t, err)

		codes := make([]string, len(roles))
		for i, role := range roles {
			codes[i] = role.Code
		}
		assert.ElementsMatch(t,
			[]string{"tenant_admin", "member", "geneticist", "data_manager", "researcher", "practitioner"},
			codes)
	})
}

func Test_RolesRepository_ListTenantRoles_FlagsSeededRolesAsDefault(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.ListTenantRoles(t.Context(), types.DefaultTenantCode)
		require.NoError(t, err)

		geneticist := roleByCodeIn(roles, "geneticist")
		require.NotNil(t, geneticist)
		assert.True(t, geneticist.IsDefault, "geneticist is seeded by migration 000012, so it is locked")
		assert.Equal(t, "Geneticist", geneticist.Name)
		assert.NotEmpty(t, geneticist.Description)

		researcher := roleByCodeIn(roles, "researcher")
		require.NotNil(t, researcher)
		assert.False(t, researcher.IsDefault, "a role the tenant defined itself stays editable")
	})
}

func Test_RolesRepository_ListTenantRoles_ReturnsActionsWithTheirLabels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.ListTenantRoles(t.Context(), types.DefaultTenantCode)
		require.NoError(t, err)

		admin := roleByCodeIn(roles, "tenant_admin")
		require.NotNil(t, admin)
		assert.ElementsMatch(t,
			[]string{types.ActionManageUser, types.ActionManageOrg, types.ActionManageRole},
			actionCodes(admin))
		for _, action := range admin.Actions {
			assert.Equal(t, types.ActionScopeTenant, action.Scope)
			assert.NotEmpty(t, action.Name, "action %q carries its labels so the list needs no second call", action.Code)
			assert.NotEmpty(t, action.Description, "action %q carries its labels so the list needs no second call", action.Code)
		}
	})
}

func Test_RolesRepository_ListTenantRoles_DerivesScopeFromActions(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.ListTenantRoles(t.Context(), types.DefaultTenantCode)
		require.NoError(t, err)

		// researcher maps tenant-scoped actions only, geneticist org-scoped ones only, and
		// practitioner mixes both (test/data/auth/04_role_action.sql).
		researcher := roleByCodeIn(roles, "researcher")
		require.NotNil(t, researcher)
		assert.Equal(t, types.RoleScopeTenant, researcher.Scope)

		geneticist := roleByCodeIn(roles, "geneticist")
		require.NotNil(t, geneticist)
		assert.Equal(t, types.RoleScopeOrg, geneticist.Scope)

		practitioner := roleByCodeIn(roles, "practitioner")
		require.NotNil(t, practitioner)
		assert.Equal(t, types.RoleScopeMixed, practitioner.Scope)
	})
}

func Test_RolesRepository_ListTenantRoles_IsolatesTenants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.ListTenantRoles(t.Context(), "tenant_b")
		require.NoError(t, err)

		codes := make([]string, len(roles))
		for i, role := range roles {
			codes[i] = role.Code
		}
		assert.ElementsMatch(t, []string{"geneticist", "researcher"}, codes,
			"radiant's roles must not leak into another tenant")

		// tenant_b defines its own geneticist with its own actions; same code, different role.
		geneticist := roleByCodeIn(roles, "geneticist")
		require.NotNil(t, geneticist)
		assert.False(t, geneticist.IsDefault)
		assert.ElementsMatch(t,
			[]string{types.ActionReadPII, types.ActionInterpretVariant},
			actionCodes(geneticist))
	})
}

func Test_RolesRepository_ListTenantRoles_UnknownTenantReturnsEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.ListTenantRoles(t.Context(), "no_such_tenant")
		require.NoError(t, err)
		assert.Empty(t, roles)
	})
}

// Holder counts read shared grant rows, which the parallel provisioning tests add to — hence
// ExclusivePostgres.
func Test_RolesRepository_ListTenantRoles_CountsHoldersAcrossOrganizations(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.ListTenantRoles(t.Context(), types.DefaultTenantCode)
		require.NoError(t, err)

		// alice, wendy, dan and carol hold geneticist in radiant, at a specific org or at '*'.
		geneticist := roleByCodeIn(roles, "geneticist")
		require.NotNil(t, geneticist)
		assert.EqualValues(t, 4, geneticist.AssignedUsersCount)

		// carol also holds tenant_b's geneticist; the count stays within the tenant.
		practitioner := roleByCodeIn(roles, "practitioner")
		require.NotNil(t, practitioner)
		assert.EqualValues(t, 2, practitioner.AssignedUsersCount, "pat at CHUSJ and tw tenant-wide")
	})
}

func Test_RolesRepository_GetTenantRole_ReturnsRoleWithItsActions(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		role, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, "geneticist")
		require.NoError(t, err)
		require.NotNil(t, role)

		assert.Equal(t, "geneticist", role.Code)
		assert.Equal(t, "Geneticist", role.Name)
		assert.NotEmpty(t, role.Description)
		assert.True(t, role.IsDefault, "geneticist is seeded by migration 000012, so it is locked")
		assert.Equal(t, types.RoleScopeOrg, role.Scope)
		assert.ElementsMatch(t,
			[]string{types.ActionReadPII, types.ActionInterpretVariant, types.ActionCommentVariant, types.ActionFlagVariant, types.ActionDownloadFile},
			actionCodes(role))
		for _, action := range role.Actions {
			assert.NotEmpty(t, action.Name, "action %q carries its labels so the detail needs no second call", action.Code)
			assert.NotEmpty(t, action.Description, "action %q carries its labels so the detail needs no second call", action.Code)
		}
	})
}

func Test_RolesRepository_GetTenantRole_DerivesMixedScopeFromActions(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		role, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, "practitioner")
		require.NoError(t, err)
		require.NotNil(t, role)

		assert.False(t, role.IsDefault, "a role the tenant defined itself stays editable")
		assert.Equal(t, types.RoleScopeMixed, role.Scope, "practitioner maps org- and tenant-scoped actions")
	})
}

func Test_RolesRepository_GetTenantRole_UnknownRoleReturnsNil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		role, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, "no_such_role")
		require.NoError(t, err, "an absent role is not an error — the caller answers 404")
		assert.Nil(t, role)
	})
}

func Test_RolesRepository_GetTenantRole_IsolatesTenants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		// practitioner exists in radiant only, so reading it from tenant_b must not find it.
		role, err := repo.GetTenantRole(t.Context(), "tenant_b", "practitioner")
		require.NoError(t, err)
		assert.Nil(t, role, "radiant's roles must not leak into another tenant")

		// tenant_b defines its own geneticist with its own actions; same code, different role.
		role, err = repo.GetTenantRole(t.Context(), "tenant_b", "geneticist")
		require.NoError(t, err)
		require.NotNil(t, role)
		assert.False(t, role.IsDefault)
		assert.ElementsMatch(t,
			[]string{types.ActionReadPII, types.ActionInterpretVariant},
			actionCodes(role))
	})
}

// Holder counts read shared grant rows, which the parallel provisioning tests add to — hence
// ExclusivePostgres.
func Test_RolesRepository_GetTenantRole_CountsHoldersAcrossOrganizations(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		// alice, wendy, dan and carol hold geneticist in radiant, at a specific org or at '*'.
		role, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, "geneticist")
		require.NoError(t, err)
		require.NotNil(t, role)
		assert.EqualValues(t, 4, role.AssignedUsersCount)
	})
}

// No seeded or fixture role maps zero actions, so this builds one in a tenant of its own — the
// read tests above assert radiant's and tenant_b's exact role sets and run in parallel.
func Test_RolesRepository_GetTenantRole_RoleWithoutActionIsTenantScoped(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const tenant = "zz_actionless_detail"
		defer func() {
			env.Postgres.Exec("DELETE FROM role WHERE tenant_code = ?", tenant)
			env.Postgres.Exec("DELETE FROM tenant WHERE code = ?", tenant)
		}()
		require.NoError(t, env.Postgres.Exec("INSERT INTO tenant (code, name) VALUES (?, ?)", tenant, "Actionless").Error)
		require.NoError(t, env.Postgres.Exec(
			"INSERT INTO role (tenant_code, code, name_en) VALUES (?, ?, ?)", tenant, "empty", "Empty").Error)

		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})
		role, err := repo.GetTenantRole(t.Context(), tenant, "empty")
		require.NoError(t, err)
		require.NotNil(t, role)

		assert.Equal(t, types.RoleScopeTenant, role.Scope, "binding to no action demands no organization")
		assert.Equal(t, []types.RoleActionResult{}, role.Actions, "must serialize as [], not null")
		assert.EqualValues(t, 0, role.AssignedUsersCount)
// Exclusive for the same reason as the holder-count test above.
func Test_RolesRepository_ListTenantRoles_HolderCountExcludesSystemUsers(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.ListTenantRoles(t.Context(), types.DefaultTenantCode)
		require.NoError(t, err)

		// gabe and the machine-to-machine account both hold data_manager; only gabe is counted.
		dataManager := roleByCodeIn(roles, "data_manager")
		require.NotNil(t, dataManager)
		assert.EqualValues(t, 1, dataManager.AssignedUsersCount)
	})
}

// No seeded or fixture role maps zero actions, so this builds one in a tenant of its own — the
// read tests above assert radiant's and tenant_b's exact role sets and run in parallel.
func Test_RolesRepository_ListTenantRoles_RoleWithoutActionIsTenantScoped(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const tenant = "zz_actionless"
		defer func() {
			env.Postgres.Exec("DELETE FROM role WHERE tenant_code = ?", tenant)
			env.Postgres.Exec("DELETE FROM tenant WHERE code = ?", tenant)
		}()
		require.NoError(t, env.Postgres.Exec("INSERT INTO tenant (code, name) VALUES (?, ?)", tenant, "Actionless").Error)
		require.NoError(t, env.Postgres.Exec(
			"INSERT INTO role (tenant_code, code, name_en) VALUES (?, ?, ?)", tenant, "empty", "Empty").Error)

		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})
		roles, err := repo.ListTenantRoles(t.Context(), tenant)
		require.NoError(t, err)

		require.Len(t, roles, 1)
		assert.Equal(t, types.RoleScopeTenant, roles[0].Scope, "binding to no action demands no organization")
		assert.Equal(t, []types.RoleActionResult{}, roles[0].Actions, "must serialize as [], not null")
		assert.EqualValues(t, 0, roles[0].AssignedUsersCount)
	})
}
