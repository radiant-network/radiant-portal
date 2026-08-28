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

func conflictField(t *testing.T, err error) string {
	t.Helper()
	var conflict *types.RoleConflictError
	require.ErrorAs(t, err, &conflict)
	return conflict.Field
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
			[]string{"tenant_admin", "geneticist", "data_manager", "researcher", "practitioner"},
			codes)
		assert.NotContains(t, codes, types.RoleMember,
			"member is implicit — every user holds it, so it is not part of the assignable catalog")
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
				Code:          "clinical_reviewer",
				NameEn:        "Clinical Reviewer",
				DescriptionEn: "Full clinical work as one role.",
				Actions:       []string{types.ActionSearchCase, types.ActionReadPII},
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
				NameEn:  "Browser",
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
				NameEn:  "Terse",
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

			var frIsNull bool
			require.NoError(t, env.Postgres.Raw(
				`SELECT description_fr IS NULL FROM role WHERE tenant_code = ? AND code = ?`,
				tenant, "terse").Scan(&frIsNull).Error)
			assert.True(t, frIsNull, "the mirrored French description is NULL too, not an empty string")
		})
	})
}

type storedRoleLabels struct {
	NameEn        string
	NameFr        string
	DescriptionEn string
	DescriptionFr string
}

func readRoleLabels(t *testing.T, env *testutils.Env, tenant, code string) storedRoleLabels {
	t.Helper()
	var stored storedRoleLabels
	require.NoError(t, env.Postgres.Raw(
		`SELECT name_en, name_fr, description_en, description_fr
		 FROM role WHERE tenant_code = ? AND code = ?`, tenant, code).Scan(&stored).Error)
	return stored
}

func Test_RolesRepository_CreateRole_StoresTheSuppliedFrenchLabels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_locales_fr", func(repo *RolesRepository, tenant string) {
			err := repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code:          "clinical_reviewer",
				NameEn:        "Clinical Reviewer",
				NameFr:        "Réviseur clinique",
				DescriptionEn: "Full clinical work as one role.",
				DescriptionFr: "Travail clinique complet en un seul rôle.",
				Actions:       []string{types.ActionViewKb},
			})
			require.NoError(t, err)

			stored := readRoleLabels(t, env, tenant, "clinical_reviewer")
			assert.Equal(t, "Clinical Reviewer", stored.NameEn)
			assert.Equal(t, "Réviseur clinique", stored.NameFr)
			assert.Equal(t, "Full clinical work as one role.", stored.DescriptionEn)
			assert.Equal(t, "Travail clinique complet en un seul rôle.", stored.DescriptionFr)
		})
	})
}

func Test_RolesRepository_CreateRole_FallsBackToEnglishLabels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_locales", func(repo *RolesRepository, tenant string) {
			err := repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code:          "clinical_reviewer",
				NameEn:        "Clinical Reviewer",
				DescriptionEn: "Full clinical work as one role.",
				Actions:       []string{types.ActionViewKb},
			})
			require.NoError(t, err)

			stored := readRoleLabels(t, env, tenant, "clinical_reviewer")
			assert.Equal(t, "Clinical Reviewer", stored.NameEn)
			assert.Equal(t, "Clinical Reviewer", stored.NameFr)
			assert.Equal(t, "Full clinical work as one role.", stored.DescriptionEn)
			assert.Equal(t, "Full clinical work as one role.", stored.DescriptionFr)
		})
	})
}

func Test_RolesRepository_CreateRole_DuplicateSuppliedFrenchNameIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_dup_fr", func(repo *RolesRepository, tenant string) {
			err := repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code: "reviewer_one", NameEn: "Reviewer One", NameFr: "Réviseur",
				Actions: []string{types.ActionViewKb},
			})
			require.NoError(t, err)

			// Distinct English names, same French one refused on the name_fr index.
			err = repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code: "reviewer_two", NameEn: "Reviewer Two", NameFr: "réviseur",
				Actions: []string{types.ActionViewKb},
			})
			assert.Equal(t, types.RoleFieldNameFr, conflictField(t, err),
				"the request supplied name_fr, so that is the input to flag")
		})
	})
}

func Test_RolesRepository_CreateRole_ClashWithSeededFrenchNameIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		// Precondition: the seeded role carries that French name and an unrelated English one.
		var seeded struct {
			NameEn string
			NameFr string
		}
		require.NoError(t, env.Postgres.Raw(
			`SELECT name_en, name_fr FROM role WHERE tenant_code = ? AND code = 'geneticist'`,
			types.DefaultTenantCode).Scan(&seeded).Error)
		require.Equal(t, "Geneticist", seeded.NameEn)
		require.Equal(t, "Généticien", seeded.NameFr)

		err := repo.CreateRole(t.Context(), types.DefaultTenantCode, types.CreateRoleRequest{
			Code: "zz_clash_fr", NameEn: "Généticien", Actions: []string{types.ActionViewKb},
		})
		// The fallback copied name_en into name_fr, and it is the name_fr index that refuses it.
		assert.Equal(t, types.RoleFieldNameFr, conflictField(t, err),
			"a custom role may not take a seeded role's French name either")

		role, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, "zz_clash_fr")
		require.NoError(t, err)
		assert.Nil(t, role)
	})
}

func Test_RolesRepository_CreateRole_DuplicateCodeIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_dup_code", func(repo *RolesRepository, tenant string) {
			req := types.CreateRoleRequest{Code: "twice", NameEn: "First", Actions: []string{types.ActionViewKb}}
			err := repo.CreateRole(t.Context(), tenant, req)
			require.NoError(t, err)

			req.NameEn = "Second"
			err = repo.CreateRole(t.Context(), tenant, req)
			assert.Equal(t, types.RoleFieldCode, conflictField(t, err))
		})
	})
}

func Test_RolesRepository_CreateRole_DuplicateNameIsRefusedCaseInsensitively(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_create_dup_name", func(repo *RolesRepository, tenant string) {
			err := repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code: "reviewer_one", NameEn: "Clinical Reviewer", Actions: []string{types.ActionViewKb},
			})
			require.NoError(t, err)

			// Different code, same name in different case: identical to a reader, so refused.
			err = repo.CreateRole(t.Context(), tenant, types.CreateRoleRequest{
				Code: "reviewer_two", NameEn: "clinical reviewer", Actions: []string{types.ActionViewKb},
			})
			// The fallback copied name_en into name_fr, so both indexes collide and Postgres
			// reports the first one it checks — name_en, created before name_fr in 000027.
			assert.Equal(t, types.RoleFieldNameEn, conflictField(t, err))

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
			Code: "zz_clash_geneticist", NameEn: "geneticist", Actions: []string{types.ActionViewKb},
		})
		assert.Equal(t, types.RoleFieldNameEn, conflictField(t, err),
			"a custom role may not take a seeded role's name")

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
				NameEn:  "Almost Admin",
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
				NameEn:  "Typo",
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
				req := types.CreateRoleRequest{Code: "shared", NameEn: "Shared", Actions: []string{types.ActionViewKb}}

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

func seedCustomRole(t *testing.T, repo *RolesRepository, tenant string, req types.CreateRoleRequest) {
	t.Helper()
	require.NoError(t, repo.CreateRole(t.Context(), tenant, req))
}

func Test_RolesRepository_UpdateRole_ReplacesLabelsAndActions(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_labels", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code:          "clinical_reviewer",
				NameEn:        "Clinical Reviewer",
				DescriptionEn: "Full clinical work as one role.",
				Actions:       []string{types.ActionSearchCase, types.ActionReadPII},
			})

			err := repo.UpdateRole(t.Context(), tenant, "clinical_reviewer", types.UpdateRoleRequest{
				NameEn:        "Senior Clinical Reviewer",
				NameFr:        "Réviseur clinique principal",
				DescriptionEn: "Now with the knowledge base.",
				DescriptionFr: "Avec la base de connaissances.",
				Actions:       []string{types.ActionViewKb, types.ActionCommentVariant},
			})
			require.NoError(t, err)

			updated, err := repo.GetTenantRole(t.Context(), tenant, "clinical_reviewer")
			require.NoError(t, err)
			require.NotNil(t, updated)
			assert.Equal(t, "clinical_reviewer", updated.Code, "the code is immutable")
			assert.Equal(t, "Senior Clinical Reviewer", updated.Name)
			assert.Equal(t, "Now with the knowledge base.", updated.Description)
			assert.False(t, updated.IsDefault, "an edited custom role stays custom")
			assert.ElementsMatch(t,
				[]string{types.ActionViewKb, types.ActionCommentVariant},
				actionCodes(updated),
				"the payload is the role's whole action set, so the previous two are gone")

			stored := readRoleLabels(t, env, tenant, "clinical_reviewer")
			assert.Equal(t, "Réviseur clinique principal", stored.NameFr)
			assert.Equal(t, "Avec la base de connaissances.", stored.DescriptionFr)
		})
	})
}

func Test_RolesRepository_UpdateRole_RederivesScopeFromTheNewActions(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_scope", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code:    "shifting",
				NameEn:  "Shifting",
				Actions: []string{types.ActionSearchCase, types.ActionViewKb},
			})
			before, err := repo.GetTenantRole(t.Context(), tenant, "shifting")
			require.NoError(t, err)
			require.Equal(t, types.RoleScopeTenant, before.Scope)

			require.NoError(t, repo.UpdateRole(t.Context(), tenant, "shifting", types.UpdateRoleRequest{
				NameEn:  "Shifting",
				Actions: []string{types.ActionSearchCase, types.ActionReadPII},
			}))

			after, err := repo.GetTenantRole(t.Context(), tenant, "shifting")
			require.NoError(t, err)
			assert.Equal(t, types.RoleScopeMixed, after.Scope,
				"scope is never stored, so adding an org-scoped action moves the role to mixed")
		})
	})
}

func Test_RolesRepository_UpdateRole_ClearedDescriptionBecomesNull(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_no_desc", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code:          "terse",
				NameEn:        "Terse",
				DescriptionEn: "A description that is about to go away.",
				Actions:       []string{types.ActionViewKb},
			})

			require.NoError(t, repo.UpdateRole(t.Context(), tenant, "terse", types.UpdateRoleRequest{
				NameEn:  "Terse",
				Actions: []string{types.ActionViewKb},
			}))

			var isNull bool
			require.NoError(t, env.Postgres.Raw(
				`SELECT description_en IS NULL AND description_fr IS NULL FROM role WHERE tenant_code = ? AND code = ?`,
				tenant, "terse").Scan(&isNull).Error)
			assert.True(t, isNull, "an omitted description clears the column rather than leaving the old text")
		})
	})
}

func Test_RolesRepository_UpdateRole_FallsBackToEnglishLabels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_locales", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code:    "clinical_reviewer",
				NameEn:  "Clinical Reviewer",
				NameFr:  "Réviseur clinique",
				Actions: []string{types.ActionViewKb},
			})

			require.NoError(t, repo.UpdateRole(t.Context(), tenant, "clinical_reviewer", types.UpdateRoleRequest{
				NameEn:        "Senior Reviewer",
				DescriptionEn: "Full clinical work.",
				Actions:       []string{types.ActionViewKb},
			}))

			stored := readRoleLabels(t, env, tenant, "clinical_reviewer")
			assert.Equal(t, "Senior Reviewer", stored.NameEn)
			assert.Equal(t, "Senior Reviewer", stored.NameFr,
				"dropping the French name re-mirrors the English one, never leaves the stale translation")
			assert.Equal(t, "Full clinical work.", stored.DescriptionFr)
		})
	})
}

// The unique name index is per tenant, so an edit that keeps the role's own name must not read as
// a clash with itself.
func Test_RolesRepository_UpdateRole_KeepingItsOwnNameSucceeds(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_same_name", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code:    "clinical_reviewer",
				NameEn:  "Clinical Reviewer",
				NameFr:  "Réviseur clinique",
				Actions: []string{types.ActionViewKb},
			})

			err := repo.UpdateRole(t.Context(), tenant, "clinical_reviewer", types.UpdateRoleRequest{
				NameEn:        "Clinical Reviewer",
				NameFr:        "Réviseur clinique",
				DescriptionEn: "Only the description changed.",
				Actions:       []string{types.ActionViewKb},
			})
			require.NoError(t, err)

			updated, err := repo.GetTenantRole(t.Context(), tenant, "clinical_reviewer")
			require.NoError(t, err)
			assert.Equal(t, "Only the description changed.", updated.Description)
		})
	})
}

// The role keeps its holders across an edit: only the actions those holders get change, which is
// what makes the UI's "changes access for N users" warning the whole story.
func Test_RolesRepository_UpdateRole_PreservesTheGrantsOfItsHolders(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_grants", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code:    "held",
				NameEn:  "Held",
				Actions: []string{types.ActionViewKb},
			})
			require.NoError(t, env.Postgres.Exec(
				`INSERT INTO user_role (user_id, tenant_code, org_code, role_code)
				 VALUES ('25286548-fbef-4e93-b3c4-c659e6169396', ?, NULL, 'held')`, tenant).Error)

			require.NoError(t, repo.UpdateRole(t.Context(), tenant, "held", types.UpdateRoleRequest{
				NameEn:  "Held",
				Actions: []string{types.ActionSearchCase},
			}))

			updated, err := repo.GetTenantRole(t.Context(), tenant, "held")
			require.NoError(t, err)
			assert.EqualValues(t, 1, updated.AssignedUsersCount, "the holder keeps the role, only its actions moved")
			assert.Equal(t, []string{types.ActionSearchCase}, actionCodes(updated))
		})
	})
}

func Test_RolesRepository_UpdateRole_UnknownRoleIsNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_missing", func(repo *RolesRepository, tenant string) {
			err := repo.UpdateRole(t.Context(), tenant, "no_such_role", types.UpdateRoleRequest{
				NameEn:  "No Such Role",
				Actions: []string{types.ActionViewKb},
			})
			assert.ErrorIs(t, err, types.ErrRoleNotFound)
		})
	})
}

// A role of another tenant reads as absent here, exactly as it does on the read path: the role key
// is (tenant_code, code), so an edit can never cross a tenant boundary.
func Test_RolesRepository_UpdateRole_RoleOfAnotherTenantIsNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_cross", func(repo *RolesRepository, tenant string) {
			err := repo.UpdateRole(t.Context(), tenant, "researcher", types.UpdateRoleRequest{
				NameEn:  "Hijacked",
				Actions: []string{types.ActionViewKb},
			})
			require.ErrorIs(t, err, types.ErrRoleNotFound, "radiant's researcher is invisible from another tenant")

			stored := readRoleLabels(t, env, types.DefaultTenantCode, "researcher")
			assert.Equal(t, "Researcher", stored.NameEn, "radiant's own role is untouched")
		})
	})
}

func Test_RolesRepository_UpdateRole_DefaultRoleIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		// geneticist is seeded by migration 000012 with is_default = true, so it is locked.
		err := repo.UpdateRole(t.Context(), types.DefaultTenantCode, "geneticist", types.UpdateRoleRequest{
			NameEn:  "Geneticist Redefined",
			Actions: []string{types.ActionViewKb},
		})
		require.ErrorIs(t, err, types.ErrRoleIsDefault)

		stored := readRoleLabels(t, env, types.DefaultTenantCode, "geneticist")
		assert.Equal(t, "Geneticist", stored.NameEn, "the refusal happens before anything is written")

		role, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, "geneticist")
		require.NoError(t, err)
		assert.NotEmpty(t, role.Actions, "its action mappings survive too")
	})
}

func Test_RolesRepository_UpdateRole_UngrantableActionIsRefusedAndChangesNothing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_reserved", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code:    "almost_admin",
				NameEn:  "Almost Admin",
				Actions: []string{types.ActionViewKb},
			})

			// Editing is not a way in for can_manage_user: refusing it here is what keeps
			// tenant_admin un-duplicable after creation too.
			err := repo.UpdateRole(t.Context(), tenant, "almost_admin", types.UpdateRoleRequest{
				NameEn:  "Actually Admin",
				Actions: []string{types.ActionViewKb, types.ActionManageUser},
			})
			require.ErrorIs(t, err, types.ErrRoleActionsNotGrantable)
			assert.Contains(t, err.Error(), types.ActionManageUser)

			unchanged, err := repo.GetTenantRole(t.Context(), tenant, "almost_admin")
			require.NoError(t, err)
			assert.Equal(t, "Almost Admin", unchanged.Name, "the transaction rolled back the whole edit")
			assert.Equal(t, []string{types.ActionViewKb}, actionCodes(unchanged))
		})
	})
}

func Test_RolesRepository_UpdateRole_UnknownActionIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_unknown_action", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code:    "reviewer",
				NameEn:  "Reviewer",
				Actions: []string{types.ActionViewKb},
			})

			err := repo.UpdateRole(t.Context(), tenant, "reviewer", types.UpdateRoleRequest{
				NameEn:  "Reviewer",
				Actions: []string{"can_do_anything"},
			})
			require.ErrorIs(t, err, types.ErrRoleActionsNotGrantable)
			assert.Contains(t, err.Error(), "can_do_anything")
		})
	})
}

func Test_RolesRepository_UpdateRole_DuplicateEnglishNameIsConflict(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_clash_en", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code: "taken", NameEn: "Taken Name", Actions: []string{types.ActionViewKb},
			})
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code: "mover", NameEn: "Mover", Actions: []string{types.ActionViewKb},
			})

			// Case-insensitive: the index is on lower(name_en).
			err := repo.UpdateRole(t.Context(), tenant, "mover", types.UpdateRoleRequest{
				NameEn:  "taken name",
				Actions: []string{types.ActionViewKb},
			})
			assert.Equal(t, types.RoleFieldNameEn, conflictField(t, err))
		})
	})
}

func Test_RolesRepository_UpdateRole_DuplicateFrenchNameIsConflict(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_update_clash_fr", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code: "taken", NameEn: "Taken", NameFr: "Nom pris", Actions: []string{types.ActionViewKb},
			})
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code: "mover", NameEn: "Mover", NameFr: "Déménageur", Actions: []string{types.ActionViewKb},
			})

			err := repo.UpdateRole(t.Context(), tenant, "mover", types.UpdateRoleRequest{
				NameEn:  "Mover",
				NameFr:  "Nom pris",
				Actions: []string{types.ActionViewKb},
			})
			assert.Equal(t, types.RoleFieldNameFr, conflictField(t, err))
		})
	})
}

func Test_RolesRepository_DeleteRole_RemovesTheRoleAndItsActions(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_delete_role", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code:          "clinical_reviewer",
				NameEn:        "Clinical Reviewer",
				DescriptionEn: "Full clinical work as one role.",
				Actions:       []string{types.ActionSearchCase, types.ActionReadPII},
			})

			require.NoError(t, repo.DeleteRole(t.Context(), tenant, "clinical_reviewer"))

			deleted, err := repo.GetTenantRole(t.Context(), tenant, "clinical_reviewer")
			require.NoError(t, err)
			assert.Nil(t, deleted, "the role is gone from the catalog")

			var mappings int64
			require.NoError(t, env.Postgres.Raw(
				`SELECT COUNT(*) FROM role_action WHERE tenant_code = ? AND role_code = ?`,
				tenant, "clinical_reviewer").Scan(&mappings).Error)
			assert.EqualValues(t, 0, mappings, "role_action cascades, so no mapping outlives the role")
		})
	})
}

func Test_RolesRepository_DeleteRole_RevokesTheGrantsOfItsHolders(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_delete_grants", func(repo *RolesRepository, tenant string) {
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code:    "held",
				NameEn:  "Held",
				Actions: []string{types.ActionViewKb},
			})
			require.NoError(t, env.Postgres.Exec(
				`INSERT INTO user_role (user_id, tenant_code, org_code, role_code)
				 VALUES ('25286548-fbef-4e93-b3c4-c659e6169396', ?, NULL, 'held')`, tenant).Error)

			require.NoError(t, repo.DeleteRole(t.Context(), tenant, "held"))

			var grants int64
			require.NoError(t, env.Postgres.Raw(
				`SELECT COUNT(*) FROM user_role WHERE tenant_code = ? AND role_code = ?`,
				tenant, "held").Scan(&grants).Error)
			assert.EqualValues(t, 0, grants, "user_role cascades: the holder simply no longer has the role")

			var stillAUser int64
			require.NoError(t, env.Postgres.Raw(
				`SELECT COUNT(*) FROM users WHERE user_id = '25286548-fbef-4e93-b3c4-c659e6169396'`).
				Scan(&stillAUser).Error)
			assert.EqualValues(t, 1, stillAUser, "deleting a role never deletes the users holding it")
		})
	})
}

func Test_RolesRepository_DeleteRole_UnknownRoleIsNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_delete_missing", func(repo *RolesRepository, tenant string) {
			err := repo.DeleteRole(t.Context(), tenant, "no_such_role")
			assert.ErrorIs(t, err, types.ErrRoleNotFound)
		})
	})
}

func Test_RolesRepository_DeleteRole_RoleOfAnotherTenantIsNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_delete_cross", func(repo *RolesRepository, tenant string) {
			err := repo.DeleteRole(t.Context(), tenant, "researcher")
			require.ErrorIs(t, err, types.ErrRoleNotFound, "radiant's researcher is invisible from another tenant")

			survivor, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, "researcher")
			require.NoError(t, err)
			assert.NotNil(t, survivor, "radiant's own role is untouched")
		})
	})
}

func Test_RolesRepository_DeleteRole_DefaultRoleIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.DeleteRole(t.Context(), types.DefaultTenantCode, "geneticist")
		require.ErrorIs(t, err, types.ErrRoleIsDefault)

		survivor, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, "geneticist")
		require.NoError(t, err)
		require.NotNil(t, survivor, "the refusal happens before anything is written")
		assert.NotEmpty(t, survivor.Actions, "its action mappings survive too")
	})
}

// member is what guarantees every user holds at least one role, so it has to be locked like the
// rest of the seeded catalog — it is the one delete that could break the minimum-role invariant.
func Test_RolesRepository_DeleteRole_MemberRoleIsRefused(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewRolesRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.DeleteRole(t.Context(), types.DefaultTenantCode, types.RoleMember)
		require.ErrorIs(t, err, types.ErrRoleIsDefault)

		survivor, err := repo.GetTenantRole(t.Context(), types.DefaultTenantCode, types.RoleMember)
		require.NoError(t, err)
		assert.NotNil(t, survivor, "member stays in the catalog, so every user keeps a role to fall back on")
	})
}

// The minimum-role invariant end to end: because member is a default role it survives any
// custom-role delete, so cascading the grants away can never leave a holder with no role at all.
func Test_RolesRepository_DeleteRole_HoldersKeepTheirMemberRole(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		withScratchTenant(t, env, "zz_delete_minimum", func(repo *RolesRepository, tenant string) {
			require.NoError(t, NewTenantRepository(database.PostgresDB{DB: env.Postgres}).
				SeedDefaultRoles(t.Context(), tenant))
			seedCustomRole(t, repo, tenant, types.CreateRoleRequest{
				Code: "extra", NameEn: "Extra", Actions: []string{types.ActionViewKb},
			})

			const holder = "25286548-fbef-4e93-b3c4-c659e6169396"
			require.NoError(t, env.Postgres.Exec(
				`INSERT INTO user_role (user_id, tenant_code, org_code, role_code)
				 VALUES (?, ?, NULL, ?), (?, ?, NULL, 'extra')`,
				holder, tenant, types.RoleMember, holder, tenant).Error)

			require.NoError(t, repo.DeleteRole(t.Context(), tenant, "extra"))

			var remaining []string
			require.NoError(t, env.Postgres.Raw(
				`SELECT role_code FROM user_role WHERE user_id = ? AND tenant_code = ?`, holder, tenant).
				Scan(&remaining).Error)
			assert.Equal(t, []string{types.RoleMember}, remaining,
				"the cascade takes the deleted role's grant only, never the baseline one")
		})
	})
}
