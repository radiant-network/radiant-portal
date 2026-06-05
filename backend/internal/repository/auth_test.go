package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_splitOrgCodes_Empty(t *testing.T) {
	assert.Equal(t, []string{}, splitOrgCodes(""))
}

func Test_splitOrgCodes_Single(t *testing.T) {
	assert.Equal(t, []string{"CHOP"}, splitOrgCodes("CHOP"))
}

func Test_splitOrgCodes_Multiple(t *testing.T) {
	assert.Equal(t, []string{"CHOP", "CQGC", "UCSF"}, splitOrgCodes("CHOP,CQGC,UCSF"))
}

func Test_appendUnique_AddsNewValue(t *testing.T) {
	assert.Equal(t, []string{"a"}, appendUnique(nil, "a"))
	assert.Equal(t, []string{"a", "b"}, appendUnique([]string{"a"}, "b"))
}

func Test_appendUnique_SkipsExistingValue(t *testing.T) {
	assert.Equal(t, []string{"a", "b"}, appendUnique([]string{"a", "b"}, "a"))
}

// These tests read the seeded auth fixtures (see test/data/auth/), which reuse the
// existing radiant orgs (CHOP, CHUSJ, ...) and add a second tenant_b with its own org:
//
//	roles (per tenant): geneticist (org)   → can_read_pii, can_interpret_variant
//	                    researcher (tenant) → can_search_case, can_view_kb
//	grants: alice → geneticist @ CHOP, researcher tenant-wide        [radiant]
//	        wendy → geneticist @ '*'  (every radiant org)            [radiant]
//	        dan   → geneticist @ CHUSJ                               [radiant]
//	        carol → geneticist @ '*' [radiant]; geneticist @ '*' + researcher [tenant_b]

func Test_AuthRepository_HasAction_OrgScoped_SpecificOrg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		atGrantedOrg, err := repo.HasAction("alice@test.authz", "radiant", "CHOP", "can_read_pii")
		assert.NoError(t, err)
		assert.True(t, atGrantedOrg, "alice has can_read_pii at her granted org")

		atOtherOrg, err := repo.HasAction("alice@test.authz", "radiant", "CHUSJ", "can_read_pii")
		assert.NoError(t, err)
		assert.False(t, atOtherOrg, "alice has no grant at CHUSJ")
	})
}

func Test_AuthRepository_HasAction_OrgScoped_Wildcard(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		atChop, err := repo.HasAction("wendy@test.authz", "radiant", "CHOP", "can_read_pii")
		assert.NoError(t, err)
		assert.True(t, atChop)

		atChusj, err := repo.HasAction("wendy@test.authz", "radiant", "CHUSJ", "can_read_pii")
		assert.NoError(t, err)
		assert.True(t, atChusj, "wildcard grant covers every org in the tenant")
	})
}

func Test_AuthRepository_HasAction_TenantScoped_IgnoresOrg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		noOrg, err := repo.HasAction("alice@test.authz", "radiant", "", "can_search_case")
		assert.NoError(t, err)
		assert.True(t, noOrg)

		withIrrelevantOrg, err := repo.HasAction("alice@test.authz", "radiant", "CHUSJ", "can_search_case")
		assert.NoError(t, err)
		assert.True(t, withIrrelevantOrg, "org arg is ignored for a tenant-scoped action")
	})
}

func Test_AuthRepository_HasAction_OrgScoped_IsolatedToGrantedOrg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		// dan is geneticist at CHUSJ only.
		atOwnOrg, err := repo.HasAction("dan@test.authz", "radiant", "CHUSJ", "can_read_pii")
		assert.NoError(t, err)
		assert.True(t, atOwnOrg)

		atOtherOrg, err := repo.HasAction("dan@test.authz", "radiant", "CHOP", "can_read_pii")
		assert.NoError(t, err)
		assert.False(t, atOtherOrg, "dan's grant at CHUSJ must not leak to CHOP")
	})
}

func Test_AuthRepository_HasAction_UnknownActionOrUser(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		unknownAction, err := repo.HasAction("alice@test.authz", "radiant", "CHOP", "can_do_nothing")
		assert.NoError(t, err)
		assert.False(t, unknownAction)

		unknownUser, err := repo.HasAction("ghost@test.authz", "radiant", "CHOP", "can_read_pii")
		assert.NoError(t, err)
		assert.False(t, unknownUser)
	})
}

func Test_AuthRepository_HasTenantAccess_Member(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		// alice holds roles in radiant.
		allowed, err := repo.HasTenantAccess("alice@test.authz", "radiant")
		assert.NoError(t, err)
		assert.True(t, allowed)
	})
}

func Test_AuthRepository_HasTenantAccess_NonMember(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		// alice has no grant in tenant_b.
		allowed, err := repo.HasTenantAccess("alice@test.authz", "tenant_b")
		assert.NoError(t, err)
		assert.False(t, allowed)
	})
}

func Test_AuthRepository_HasTenantAccess_MultiTenantMember(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		// carol belongs to both tenants.
		inRadiant, err := repo.HasTenantAccess("carol@test.authz", "radiant")
		assert.NoError(t, err)
		assert.True(t, inRadiant)

		inTenantB, err := repo.HasTenantAccess("carol@test.authz", "tenant_b")
		assert.NoError(t, err)
		assert.True(t, inTenantB)
	})
}

func Test_AuthRepository_HasTenantAccess_UnknownUser(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		allowed, err := repo.HasTenantAccess("ghost@test.authz", "radiant")
		assert.NoError(t, err)
		assert.False(t, allowed)
	})
}

// HasTenantAccess is org-agnostic: any grant shape makes the caller a member. These guard
// against a future regression that accidentally filters HasTenantAccess by org_code.
func Test_AuthRepository_HasTenantAccess_OrgScopeShapesAllCountAsMember(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		// wendy's only grant is a wildcard ('*') org role.
		wildcardOnly, err := repo.HasTenantAccess("wendy@test.authz", "radiant")
		assert.NoError(t, err)
		assert.True(t, wildcardOnly, "wildcard-org grant counts as membership")

		// dan's only grant is a single specific-org role (CHUSJ).
		specificOrgOnly, err := repo.HasTenantAccess("dan@test.authz", "radiant")
		assert.NoError(t, err)
		assert.True(t, specificOrgOnly, "specific-org grant counts as membership")

		// alice holds a tenant-wide (org_code NULL) grant alongside an org one.
		tenantWide, err := repo.HasTenantAccess("alice@test.authz", "radiant")
		assert.NoError(t, err)
		assert.True(t, tenantWide, "tenant-wide (NULL org) grant counts as membership")
	})
}

func Test_AuthRepository_GetMemberships_SpecificOrgAndTenantGrants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		got, err := repo.GetMemberships("alice@test.authz")
		assert.NoError(t, err)
		assert.Equal(t, []types.TenantMembership{
			{
				Code:          "radiant",
				Name:          "Radiant",
				TenantActions: []string{"can_search_case", "can_view_kb"},
				OrgsByAction: map[string][]string{
					"can_interpret_variant": {"CHOP"},
					"can_read_pii":          {"CHOP"},
				},
			},
		}, got)
	})
}

func Test_AuthRepository_GetMemberships_WildcardResolvesToAllTenantOrgs(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		// Expected wildcard expansion is exactly the tenant's full org list.
		var radiantOrgs []string
		err := env.Postgres.Raw(`SELECT code FROM organization WHERE tenant_code = ? ORDER BY code`, "radiant").Scan(&radiantOrgs).Error
		assert.NoError(t, err)

		got, err := repo.GetMemberships("wendy@test.authz")
		assert.NoError(t, err)
		assert.Equal(t, []types.TenantMembership{
			{
				Code:          "radiant",
				Name:          "Radiant",
				TenantActions: []string{},
				OrgsByAction: map[string][]string{
					"can_interpret_variant": radiantOrgs,
					"can_read_pii":          radiantOrgs,
				},
			},
		}, got)
	})
}

// pat holds the mixed-scope practitioner role at a specific org (CHUSJ). The action's
// own scope must decide placement: tenant-scoped actions go to tenant_actions even
// though the grant is org-specific, and only org-scoped actions go to orgs_by_action.
func Test_AuthRepository_GetMemberships_MixedScopeRole_RoutesByActionScope(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		got, err := repo.GetMemberships("pat@test.authz")
		assert.NoError(t, err)
		assert.Equal(t, []types.TenantMembership{
			{
				Code:          "radiant",
				Name:          "Radiant",
				TenantActions: []string{"can_search_case", "can_view_kb"},
				OrgsByAction: map[string][]string{
					"can_interpret_variant": {"CHUSJ"},
					"can_read_pii":          {"CHUSJ"},
				},
			},
		}, got)
	})
}

// tw holds the mixed-scope practitioner role tenant-wide (org_code NULL). Only its
// tenant-scoped actions apply; its org-scoped actions have no org and are omitted.
func Test_AuthRepository_GetMemberships_OrgActionGrantedTenantWide_OmittedFromOrgsByAction(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		got, err := repo.GetMemberships("tw@test.authz")
		assert.NoError(t, err)
		assert.Equal(t, []types.TenantMembership{
			{
				Code:          "radiant",
				Name:          "Radiant",
				TenantActions: []string{"can_search_case", "can_view_kb"},
				OrgsByAction:  map[string][]string{},
			},
		}, got)
	})
}

func Test_AuthRepository_HasAction_MixedScopeRole(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		// pat's grant is org-specific (CHUSJ), but a tenant-scoped action applies tenant-wide.
		tenantAction, err := repo.HasAction("pat@test.authz", "radiant", "", "can_search_case")
		assert.NoError(t, err)
		assert.True(t, tenantAction, "tenant-scoped action holds even when checked without an org")

		atGrantedOrg, err := repo.HasAction("pat@test.authz", "radiant", "CHUSJ", "can_read_pii")
		assert.NoError(t, err)
		assert.True(t, atGrantedOrg)

		atOtherOrg, err := repo.HasAction("pat@test.authz", "radiant", "CHOP", "can_read_pii")
		assert.NoError(t, err)
		assert.False(t, atOtherOrg, "org-scoped action stays scoped to the granted org")
	})
}

// carol belongs to both tenants; each tenant's wildcard must resolve to its own orgs.
// radiant's orgs must not bleed into the org-less tenant_b.
func Test_AuthRepository_GetMemberships_MultipleTenantsNoCollision(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		var radiantOrgs []string
		err := env.Postgres.Raw(`SELECT code FROM organization WHERE tenant_code = ? ORDER BY code`, "radiant").Scan(&radiantOrgs).Error
		assert.NoError(t, err)

		got, err := repo.GetMemberships("carol@test.authz")
		assert.NoError(t, err)
		assert.Equal(t, []types.TenantMembership{
			{
				Code:          "radiant",
				Name:          "Radiant",
				TenantActions: []string{},
				OrgsByAction: map[string][]string{
					"can_interpret_variant": radiantOrgs,
					"can_read_pii":          radiantOrgs,
				},
			},
			{
				Code:          "tenant_b",
				Name:          "Tenant B",
				TenantActions: []string{"can_search_case", "can_view_kb"},
				// tenant_b's wildcard resolves to tenant_b's own org only —
				// radiant's orgs do not leak in.
				OrgsByAction: map[string][]string{
					"can_interpret_variant": {"TENANT_B_ORG"},
					"can_read_pii":          {"TENANT_B_ORG"},
				},
			},
		}, got)
	})
}
