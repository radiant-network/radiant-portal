package service

import (
	"context"
	"errors"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockTenantUserStore struct {
	taken  bool
	scopes map[string]string
	err    error

	gotEmail string
	gotRoles []string
}

func (m *mockTenantUserStore) EmailHasTenantGrant(_ context.Context, _, email string) (bool, error) {
	m.gotEmail = email
	return m.taken, m.err
}

func (m *mockTenantUserStore) RoleScopes(_ context.Context, _ string, roleCodes []string) (map[string]string, error) {
	m.gotRoles = roleCodes
	if m.err != nil {
		return nil, m.err
	}
	return m.scopes, nil
}

type mockOrgChecker struct {
	existing []string
	err      error
	gotCodes []string
}

func (m *mockOrgChecker) ExistingOrgCodes(_ context.Context, _ string, codes []string) ([]string, error) {
	m.gotCodes = codes
	return m.existing, m.err
}

// defaultScopes mirrors radiant's seeded roles: member/researcher are tenant-scoped, geneticist is
// org-scoped, practitioner mixes both.
func defaultScopes() map[string]string {
	return map[string]string{
		types.RoleMember: types.RoleScopeTenant,
		"researcher":     types.RoleScopeTenant,
		"geneticist":     types.RoleScopeOrg,
		"practitioner":   types.RoleScopeMixed,
	}
}

func newRequest(roles ...types.CreateUserRole) types.CreateUserRequest {
	return types.CreateUserRequest{
		Email: "grace.chen@chop.edu", FirstName: "Grace", LastName: "Chen", Roles: roles,
	}
}

// createUser runs UserAdmin against stubbed stores, returning the provisioning input it produced.
func createUser(t *testing.T, users *mockTenantUserStore, orgs *mockOrgChecker, req types.CreateUserRequest) (*mockKeycloak, *mockAuthStore, error) {
	t.Helper()
	keycloak := &mockKeycloak{sub: "b3f1-keycloak-sub"}
	store := &mockAuthStore{}
	admin := NewUserAdmin(users, orgs, AdminDeps{
		Keycloak:  keycloak,
		Ranger:    &mockRanger{},
		Starrocks: &mockStarrocks{},
		Auth:      store,
	})
	return keycloak, store, admin.CreateTenantUser(t.Context(), "radiant", req, "acting-admin-sub")
}

func Test_UserAdmin_CreateTenantUser_GrantsMemberAndRequestedRoles(t *testing.T) {
	_, store, err := createUser(t,
		&mockTenantUserStore{scopes: defaultScopes()},
		&mockOrgChecker{existing: []string{"CHOP", "CHUSJ"}},
		newRequest(types.CreateUserRole{RoleCode: "geneticist", OrgCodes: []string{"CHOP", "CHUSJ"}}))

	require.NoError(t, err)
	assert.Equal(t, [][4]string{
		{"radiant", "", "member", "acting-admin-sub"},
		{"radiant", "CHOP", "geneticist", "acting-admin-sub"},
		{"radiant", "CHUSJ", "geneticist", "acting-admin-sub"},
	}, store.grants, "one row per org, plus the tenant-wide member grant")
}

func Test_UserAdmin_CreateTenantUser_GrantsMemberWhenNoRoleRequested(t *testing.T) {
	_, store, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()}, &mockOrgChecker{}, newRequest())

	require.NoError(t, err)
	assert.Equal(t, [][4]string{{"radiant", "", "member", "acting-admin-sub"}}, store.grants)
}

func Test_UserAdmin_CreateTenantUser_UsesEmailAsKeycloakUsernameWithoutPassword(t *testing.T) {
	keycloak, _, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()}, &mockOrgChecker{}, newRequest())

	require.NoError(t, err)
	assert.Equal(t, "grace.chen@chop.edu", keycloak.gotUsername)
	assert.Empty(t, keycloak.gotPassword, "the MVP authenticates through the IdP only")
}

func Test_UserAdmin_CreateTenantUser_KeepsWildcardOrgVerbatim(t *testing.T) {
	orgs := &mockOrgChecker{}

	_, store, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()}, orgs,
		newRequest(types.CreateUserRole{RoleCode: "geneticist", OrgCodes: []string{types.WildcardOrg}}))

	require.NoError(t, err)
	assert.Equal(t, [][4]string{
		{"radiant", "", "member", "acting-admin-sub"},
		{"radiant", "*", "geneticist", "acting-admin-sub"},
	}, store.grants)
	assert.Empty(t, orgs.gotCodes, "the wildcard is not an organization code to look up")
}

func Test_UserAdmin_CreateTenantUser_MixedScopeRoleIsGrantedAtItsOrgs(t *testing.T) {
	_, store, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()},
		&mockOrgChecker{existing: []string{"CHUSJ"}},
		newRequest(types.CreateUserRole{RoleCode: "practitioner", OrgCodes: []string{"CHUSJ"}}))

	require.NoError(t, err)
	assert.Equal(t, [][4]string{
		{"radiant", "", "member", "acting-admin-sub"},
		{"radiant", "CHUSJ", "practitioner", "acting-admin-sub"},
	}, store.grants, "a role holding any org-scoped action binds to its orgs")
}

func Test_UserAdmin_CreateTenantUser_MemberInPayloadIsNotGrantedTwice(t *testing.T) {
	_, store, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()}, &mockOrgChecker{},
		newRequest(types.CreateUserRole{RoleCode: types.RoleMember}))

	require.NoError(t, err)
	assert.Equal(t, [][4]string{{"radiant", "", "member", "acting-admin-sub"}}, store.grants)
}

func Test_UserAdmin_CreateTenantUser_AlwaysResolvesTheMemberScope(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes()}

	_, _, err := createUser(t, users, &mockOrgChecker{existing: []string{"CHOP"}},
		newRequest(types.CreateUserRole{RoleCode: "geneticist", OrgCodes: []string{"CHOP"}}))

	require.NoError(t, err)
	assert.Equal(t, []string{types.RoleMember, "geneticist"}, users.gotRoles)
}

func Test_UserAdmin_CreateTenantUser_RejectsOrgScopedRoleWithoutOrg(t *testing.T) {
	keycloak, store, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()}, &mockOrgChecker{},
		newRequest(types.CreateUserRole{RoleCode: "geneticist"}))

	require.ErrorIs(t, err, types.ErrRoleRequiresOrg)
	assert.Empty(t, keycloak.gotUsername, "nothing is provisioned when the request is rejected")
	assert.Empty(t, store.grants)
}

func Test_UserAdmin_CreateTenantUser_RejectsTenantScopedRoleWithOrg(t *testing.T) {
	_, _, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()},
		&mockOrgChecker{existing: []string{"CHOP"}},
		newRequest(types.CreateUserRole{RoleCode: "researcher", OrgCodes: []string{"CHOP"}}))

	require.ErrorIs(t, err, types.ErrRoleNotOrgScoped)
}

func Test_UserAdmin_CreateTenantUser_RejectsMemberWithOrg(t *testing.T) {
	_, _, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()},
		&mockOrgChecker{existing: []string{"CHOP"}},
		newRequest(types.CreateUserRole{RoleCode: types.RoleMember, OrgCodes: []string{"CHOP"}}))

	require.ErrorIs(t, err, types.ErrRoleNotOrgScoped)
}

func Test_UserAdmin_CreateTenantUser_RejectsUnknownRole(t *testing.T) {
	_, _, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()}, &mockOrgChecker{},
		newRequest(types.CreateUserRole{RoleCode: "no_such_role"}))

	require.ErrorIs(t, err, types.ErrUnknownRole)
	assert.Contains(t, err.Error(), "no_such_role")
}

func Test_UserAdmin_CreateTenantUser_RejectsUnknownOrganization(t *testing.T) {
	keycloak, _, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()},
		&mockOrgChecker{existing: []string{"CHOP"}},
		newRequest(types.CreateUserRole{RoleCode: "geneticist", OrgCodes: []string{"CHOP", "NOWHERE"}}))

	require.ErrorIs(t, err, types.ErrUnknownOrganizations)
	assert.Contains(t, err.Error(), "NOWHERE")
	assert.NotContains(t, err.Error(), "CHOP", "only the codes that do not exist are named")
	assert.Empty(t, keycloak.gotUsername)
}

func Test_UserAdmin_CreateTenantUser_ReportsEachUnknownOrganizationOnce(t *testing.T) {
	_, _, err := createUser(t, &mockTenantUserStore{scopes: defaultScopes()}, &mockOrgChecker{},
		newRequest(
			types.CreateUserRole{RoleCode: "geneticist", OrgCodes: []string{"NOWHERE"}},
			types.CreateUserRole{RoleCode: "practitioner", OrgCodes: []string{"NOWHERE"}}))

	require.ErrorIs(t, err, types.ErrUnknownOrganizations)
	assert.Equal(t, "unknown organizations: NOWHERE", err.Error(), "requested by two roles, reported once")
}

func Test_UserAdmin_CreateTenantUser_ExistingTenantUserIsRejectedBeforeProvisioning(t *testing.T) {
	users := &mockTenantUserStore{taken: true, scopes: defaultScopes()}

	keycloak, store, err := createUser(t, users, &mockOrgChecker{}, newRequest())

	require.ErrorIs(t, err, types.ErrUserAlreadyInTenant)
	assert.Equal(t, "grace.chen@chop.edu", users.gotEmail)
	assert.Empty(t, keycloak.gotUsername, "the Keycloak upsert must not overwrite the existing account")
	assert.Empty(t, store.grants)
}

func Test_UserAdmin_CreateTenantUser_PropagatesStoreError(t *testing.T) {
	users := &mockTenantUserStore{err: errors.New("connection reset")}

	_, _, err := createUser(t, users, &mockOrgChecker{}, newRequest())

	require.Error(t, err)
	assert.Contains(t, err.Error(), "connection reset")
}

func Test_UserAdmin_CreateTenantUser_PropagatesProvisioningError(t *testing.T) {
	admin := NewUserAdmin(&mockTenantUserStore{scopes: defaultScopes()}, &mockOrgChecker{}, AdminDeps{
		Keycloak:  &mockKeycloak{err: errors.New("connection refused")},
		Ranger:    &mockRanger{},
		Starrocks: &mockStarrocks{},
		Auth:      &mockAuthStore{},
	})

	err := admin.CreateTenantUser(t.Context(), "radiant", newRequest(), "acting-admin-sub")

	require.Error(t, err)
	assert.Contains(t, err.Error(), "keycloak")
}
