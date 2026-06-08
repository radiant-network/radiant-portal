package main

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_grantList_Set_ParsesTenantOrgRole(t *testing.T) {
	var g grantList
	require.NoError(t, g.Set("tenant_a:ORG_A1:geneticist"))
	assert.Equal(t, grantList{{TenantCode: "tenant_a", OrgCode: "ORG_A1", RoleCode: "geneticist"}}, g)
}

func Test_grantList_Set_AllowsWildcardAndEmptyOrg(t *testing.T) {
	var g grantList
	require.NoError(t, g.Set("tenant_a:*:geneticist"))
	require.NoError(t, g.Set("radiant::researcher"))
	assert.Equal(t, grantList{
		{TenantCode: "tenant_a", OrgCode: "*", RoleCode: "geneticist"},
		{TenantCode: "radiant", OrgCode: "", RoleCode: "researcher"},
	}, g)
}

func Test_grantList_Set_RejectsMalformedGrant(t *testing.T) {
	var g grantList
	err := g.Set("tenant_a:geneticist") // missing a field
	require.Error(t, err)
	assert.Contains(t, err.Error(), "tenant:org:role")
}

func Test_demoUsers_MatchSeededGrants(t *testing.T) {
	// Guards against drift from the grants 01_seed_postgres.sql established.
	byEmail := map[string]types.Grant{}
	for _, u := range demoUsers {
		require.Len(t, u.Grants, 1, "each demo user has exactly one grant")
		byEmail[u.Email] = u.Grants[0]
	}
	assert.Equal(t, types.Grant{TenantCode: "tenant_a", OrgCode: "ORG_A1", RoleCode: "geneticist"}, byEmail["alice@demo.org"])
	assert.Equal(t, types.Grant{TenantCode: "tenant_b", OrgCode: "ORG_B1", RoleCode: "geneticist"}, byEmail["bob@demo.org"])
	assert.Equal(t, types.Grant{TenantCode: "tenant_a", OrgCode: "*", RoleCode: "geneticist"}, byEmail["wendy@demo.org"])
}
