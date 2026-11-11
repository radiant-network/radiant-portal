package main

import (
	"testing"

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
