package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

// These tests read the seeded auth fixtures (see test/data/auth/), which reuse the
// existing radiant orgs (CHOP, CHUSJ, ...) and add an org-less tenant_b:
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

func Test_AuthRepository_Memberships_SpecificOrgAndTenantGrants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		got, err := repo.Memberships("alice@test.authz")
		assert.NoError(t, err)
		assert.Equal(t, []types.TenantMembership{
			{
				Code:          "radiant",
				Name:          "Radiant",
				TenantActions: []string{"can_search_case", "can_view_kb"},
				OrgActions: map[string][]string{
					"can_interpret_variant": {"CHOP"},
					"can_read_pii":          {"CHOP"},
				},
			},
		}, got)
	})
}

func Test_AuthRepository_Memberships_WildcardResolvesToAllTenantOrgs(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		// Expected wildcard expansion is exactly the tenant's full org list.
		radiantOrgs, err := NewOrganizationRepository(env.Postgres).GetOrganizationCodesByTenant("radiant")
		assert.NoError(t, err)

		got, err := repo.Memberships("wendy@test.authz")
		assert.NoError(t, err)
		assert.Equal(t, []types.TenantMembership{
			{
				Code:          "radiant",
				Name:          "Radiant",
				TenantActions: []string{},
				OrgActions: map[string][]string{
					"can_interpret_variant": radiantOrgs,
					"can_read_pii":          radiantOrgs,
				},
			},
		}, got)
	})
}

// carol belongs to both tenants; each tenant's wildcard must resolve to its own orgs.
// radiant's orgs must not bleed into the org-less tenant_b.
func Test_AuthRepository_Memberships_MultipleTenantsNoCollision(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewAuthRepository(env.Postgres)

		radiantOrgs, err := NewOrganizationRepository(env.Postgres).GetOrganizationCodesByTenant("radiant")
		assert.NoError(t, err)

		got, err := repo.Memberships("carol@test.authz")
		assert.NoError(t, err)
		assert.Equal(t, []types.TenantMembership{
			{
				Code:          "radiant",
				Name:          "Radiant",
				TenantActions: []string{},
				OrgActions: map[string][]string{
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
				OrgActions: map[string][]string{
					"can_interpret_variant": {"TENANT_B_ORG"},
					"can_read_pii":          {"TENANT_B_ORG"},
				},
			},
		}, got)
	})
}
