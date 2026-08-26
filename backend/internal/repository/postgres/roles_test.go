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

// withScratchTenant runs fn against a tenant of its own, so creating roles never disturbs the
// read tests that assert radiant's and tenant_b's exact role sets in parallel. Dropping the role
// cascades role_action.
func withScratchTenant(t *testing.T, env *testutils.Env, code string, fn func(repo *RolesRepository, tenant string)) {
	t.Helper()
	defer func() {
		env.Postgres.Exec("DELETE FROM role WHERE tenant_code = ?", code)
		env.Postgres.Exec("DELETE FROM tenant WHERE code = ?", code)
	}()
	require.NoError(t, env.Postgres.Exec("INSERT INTO tenant (code, name) VALUES (?, ?)", code, code).Error)
	fn(NewRolesRepository(database.PostgresDB{DB: env.Postgres}), code)
}

func Test_RolesRepository_CreateRole_InsertsRoleWithItsActions(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_mixed", func(repo *RolesRepository, tenant string) {
			err := repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code:        "clinical_reviewer",
				Name:        "Clinical Reviewer",
				Description: "Full clinical work as one role.",
				Actions:     []string{types.ActionSearchCase, types.ActionReadPII},
			})
			require.NoError(t, err)

			created, err := repo.GetTenantRole(t.Context(), tenant, "clinical_reviewer")
			require.NoError(t, err)
			require.NotNil(t, created)

			assert.Equal(t, "clinical_reviewer", created.Code)
			assert.Equal(t, "Clinical Reviewer", created.Name)
			assert.Equal(t, "Full clinical work as one role.", created.Description)
			assert.False(t, created.IsDefault, "a role created through the API is never locked")
			assert.Equal(t, types.RoleScopeMixed, created.Scope, "one tenant- and one org-scoped action")
			assert.EqualValues(t, 0, created.AssignedUsersCount)
			assert.ElementsMatch(t,
				[]string{types.ActionSearchCase, types.ActionReadPII},
				actionCodes(created))
			for _, action := range created.Actions {
				assert.NotEmpty(t, action.Name, "action %q carries its labels, as on the read path", action.Code)
			}
		})
	})
}

func Test_RolesRepository_CreateRole_DerivesTenantScopeFromActions(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_tenant_scope", func(repo *RolesRepository, tenant string) {
			err := repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code:    "browser",
				Name:    "Browser",
				Actions: []string{types.ActionSearchCase, types.ActionViewKb},
			})
			require.NoError(t, err)

			created, err := repo.GetTenantRole(t.Context(), tenant, "browser")
			require.NoError(t, err)
			require.NotNil(t, created)
			assert.Equal(t, types.RoleScopeTenant, created.Scope, "no org-scoped action demands no organization")
		})
	})
}

func Test_RolesRepository_CreateRole_OmittedDescriptionIsStoredAsNull(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_no_desc", func(repo *RolesRepository, tenant string) {
			err := repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code:    "terse",
				Name:    "Terse",
				Actions: []string{types.ActionViewKb},
			})
			require.NoError(t, err)

			created, err := repo.GetTenantRole(t.Context(), tenant, "terse")
			require.NoError(t, err)
			require.NotNil(t, created)
			assert.Empty(t, created.Description)

			var isNull bool
			require.NoError(t, env.Postgres.Raw(
				`SELECT description_en IS NULL FROM role WHERE tenant_code = ? AND code = ?`,
				tenant, "terse").Scan(&isNull).Error)
			assert.True(t, isNull, "an omitted description stays NULL, as on the seeded roles")
		})
	})
}

func Test_RolesRepository_CreateRole_DuplicateCodeIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_dup_code", func(repo *RolesRepository, tenant string) {
			req := types.CreateRoleRequest{Code: "twice", Name: "First", Actions: []string{types.ActionViewKb}}
			err := repo.CreateRole(t.Context(), tenant, req)
			require.NoError(t, err)

			req.Name = "Second"
			err = repo.CreateRole(t.Context(), tenant, req)
			assert.ErrorIs(t, err, types.ErrRoleCodeExists)
		})
	})
}

func Test_RolesRepository_CreateRole_DuplicateNameIsRefusedCaseInsensitively(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_dup_name", func(repo *RolesRepository, tenant string) {
			err := repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code: "reviewer_one", Name: "Clinical Reviewer", Actions: []string{types.ActionViewKb},
			})
			require.NoError(t, err)

			// Different code, same name in different case: identical to a reader, so refused.
			err = repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code: "reviewer_two", Name: "clinical reviewer", Actions: []string{types.ActionViewKb},
			})
			assert.ErrorIs(t, err, types.ErrRoleNameExists)

			var count int64
			require.NoError(t, env.Postgres.Raw(
				`SELECT count(*) FROM role WHERE tenant_code = ?`, tenant).Scan(&count).Error)
			assert.EqualValues(t, 1, count, "the refused create must leave nothing behind")
		})
	})
}

// A refused create writes nothing, so this can run against radiant without disturbing the read
// tests that assert its exact role set.
func Test_RolesRepository_CreateRole_ClashWithSeededRoleNameIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.CreateRole(t.Context(), types.DefaultTenantCode, types.CreateRoleRequest{
			Code: "zz_clash_geneticist", Name: "geneticist", Actions: []string{types.ActionViewKb},
		})
		assert.ErrorIs(t, err, types.ErrRoleNameExists, "a custom role may not take a seeded role's name")

		role, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, "zz_clash_geneticist")
		require.NoError(t, err)
		assert.Nil(t, role)
	})
}

func Test_RolesRepository_CreateRole_ReservedActionIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_reserved", func(repo *RolesRepository, tenant string) {
			// can_manage_user is grantable = false, which is what blocks duplicating tenant_admin.
			err := repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code:    "almost_admin",
				Name:    "Almost Admin",
				Actions: []string{types.ActionManageOrg, types.ActionManageUser},
			})
			require.ErrorIs(t, err, types.ErrRoleActionsNotGrantable)
			assert.Contains(t, err.Error(), types.ActionManageUser, "the refused action is named")
			assert.NotContains(t, err.Error(), types.ActionManageOrg, "a grantable action is not")

			role, err := repo.GetTenantRole(t.Context(), tenant, "almost_admin")
			require.NoError(t, err)
			assert.Nil(t, role, "nothing is written when an action is refused")
		})
	})
}

func Test_RolesRepository_CreateRole_UnknownActionIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_unknown", func(repo *RolesRepository, tenant string) {
			err := repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code:    "typo",
				Name:    "Typo",
				Actions: []string{types.ActionViewKb, "can_do_everything"},
			})
			require.ErrorIs(t, err, types.ErrRoleActionsNotGrantable)
			assert.Contains(t, err.Error(), "can_do_everything")

			role, err := repo.GetTenantRole(t.Context(), tenant, "typo")
			require.NoError(t, err)
			assert.Nil(t, role)
		})
	})
}

// The name index is per tenant, so the same role name in two tenants is not a clash.
func Test_RolesRepository_CreateRole_SameNameInAnotherTenantIsAllowed(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_iso_a", func(repo *RolesRepository, tenantA string) {
			withScratchTenant(t, env, "zz_create_iso_b", func(_ *RolesRepository, tenantB string) {
				req := types.CreateRoleRequest{Code: "shared", Name: "Shared", Actions: []string{types.ActionViewKb}}

				err := repo.CreateRole(t.Context(), tenantA, req)
				require.NoError(t, err)
				err = repo.CreateRole(t.Context(), tenantB, req)
				assert.NoError(t, err, "roles are keyed per tenant, so this is a different role")
			})
		})
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
		assert.EqualValues(t, 0, role.AssignedOrgsCount)
	})
}

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
		assert.EqualValues(t, 0, roles[0].AssignedOrgsCount)
	})
}

// Organization counts read the same shared grant rows as the holder counts, so they run
// exclusively too. radiant has 6 organizations (CHOP, UCSF, CHUSJ, LDM-CHUSJ, LDM-CHOP, CQGC).
func Test_RolesRepository_ListTenantRoles_CountsOrganizationsAndExpandsWildcardGrants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		roles, err := repo.ListTenantRoles(t.Context(), types.DefaultTenantCode)
		require.NoError(t, err)

		// wendy and carol hold geneticist at '*', which reaches every organization of the tenant.
		geneticist := roleByCodeIn(roles, "geneticist")
		require.NotNil(t, geneticist)
		assert.EqualValues(t, 6, geneticist.AssignedOrgsCount)

		// pat holds practitioner at CHUSJ; tw holds it tenant-wide, which is no organization.
		practitioner := roleByCodeIn(roles, "practitioner")
		require.NotNil(t, practitioner)
		assert.EqualValues(t, 1, practitioner.AssignedOrgsCount, "only pat's CHUSJ grant names an org")

		// alice's researcher grant is tenant-wide (org_code NULL).
		researcher := roleByCodeIn(roles, "researcher")
		require.NotNil(t, researcher)
		assert.EqualValues(t, 0, researcher.AssignedOrgsCount)
	})
}

// Exclusive for the same reason as the counts above.
func Test_RolesRepository_ListTenantRoles_OrganizationCountStaysWithinTheTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		// carol holds tenant_b's geneticist at '*', and tenant_b owns a single organization —
		// so the wildcard must expand within tenant_b, not over radiant's 6 orgs.
		roles, err := repo.ListTenantRoles(t.Context(), "tenant_b")
		require.NoError(t, err)

		geneticist := roleByCodeIn(roles, "geneticist")
		require.NotNil(t, geneticist)
		assert.EqualValues(t, 1, geneticist.AssignedOrgsCount)
	})
}

// Exclusive for the same reason as the counts above.
func Test_RolesRepository_GetTenantRole_CountsOrganizationsAndExpandsWildcardGrants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		role, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, "geneticist")
		require.NoError(t, err)
		require.NotNil(t, role)
		assert.EqualValues(t, 6, role.AssignedOrgsCount, "alice at CHOP, dan at CHUSJ, wendy and carol at '*'")
	})
}
