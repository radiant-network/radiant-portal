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

	current    *types.TenantUser
	currentErr error
	adminRoles []string
	otherAdmin bool

	gotEmail string
	gotRoles []string

	updated     bool
	gotFirst    string
	gotLast     string
	gotActor    string
	gotAdd      []types.Grant
	gotRemove   []types.Grant
	gotExcluded string

	removed      bool
	gotRemovedID string
	gotRemoveErr error
}

func (m *mockTenantUserStore) TenantUser(_ context.Context, _, _ string) (*types.TenantUser, error) {
	return m.current, m.currentErr
}

func (m *mockTenantUserStore) RolesWithAction(_ context.Context, _, _ string) ([]string, error) {
	return m.adminRoles, m.err
}

func (m *mockTenantUserStore) HasOtherUserWithAnyRole(_ context.Context, _, userID string, _ []string) (bool, error) {
	m.gotExcluded = userID
	return m.otherAdmin, m.err
}

func (m *mockTenantUserStore) UpdateTenantUser(_ context.Context, _, _, firstName, lastName, grantedBy string, add, remove []types.Grant) error {
	if m.err != nil {
		return m.err
	}
	m.updated = true
	m.gotFirst, m.gotLast, m.gotActor = firstName, lastName, grantedBy
	m.gotAdd, m.gotRemove = add, remove
	return nil
}

func (m *mockTenantUserStore) RemoveTenantUser(_ context.Context, _, userID string) error {
	if m.gotRemoveErr != nil {
		return m.gotRemoveErr
	}
	m.removed, m.gotRemovedID = true, userID
	return nil
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

// editedUser is the stored state the edit tests reconcile against: a member of radiant who is also
// a geneticist at CHOP.
func editedUser() *types.TenantUser {
	return &types.TenantUser{
		UserID: "b3f1-keycloak-sub", Email: "grace.chen@chop.edu", FirstName: "Grace", LastName: "Chen",
		Grants: []types.Grant{
			{TenantCode: "radiant", RoleCode: types.RoleMember},
			{TenantCode: "radiant", OrgCode: "CHOP", RoleCode: "geneticist"},
		},
	}
}

func newUpdate(roles ...types.CreateUserRole) types.UpdateUserRequest {
	return types.UpdateUserRequest{FirstName: "Grace", LastName: "Chen", Roles: roles}
}

// updateUser runs UserAdmin's edit path against stubbed stores.
func updateUser(t *testing.T, users *mockTenantUserStore, orgs *mockOrgChecker, req types.UpdateUserRequest) (*mockKeycloak, error) {
	t.Helper()
	keycloak := &mockKeycloak{sub: "b3f1-keycloak-sub"}
	admin := NewUserAdmin(users, orgs, AdminDeps{
		Keycloak:  keycloak,
		Ranger:    &mockRanger{},
		Starrocks: &mockStarrocks{},
		Auth:      &mockAuthStore{},
	})
	return keycloak, admin.UpdateTenantUser(t.Context(), "radiant", "b3f1-keycloak-sub", req, "acting-admin-sub")
}

func Test_UserAdmin_UpdateTenantUser_WritesOnlyTheDifference(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes(), current: editedUser()}
	_, err := updateUser(t, users, &mockOrgChecker{existing: []string{"CHUSJ"}},
		newUpdate(types.CreateUserRole{RoleCode: "geneticist", OrgCodes: []string{"CHUSJ"}}))

	require.NoError(t, err)
	assert.Equal(t, []types.Grant{{TenantCode: "radiant", OrgCode: "CHUSJ", RoleCode: "geneticist"}}, users.gotAdd)
	assert.Equal(t, []types.Grant{{TenantCode: "radiant", OrgCode: "CHOP", RoleCode: "geneticist"}}, users.gotRemove)
	assert.Equal(t, "acting-admin-sub", users.gotActor)
}

func Test_UserAdmin_UpdateTenantUser_KeepsMemberWhenOmitted(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes(), current: editedUser()}
	_, err := updateUser(t, users, &mockOrgChecker{}, newUpdate())

	require.NoError(t, err)
	assert.Empty(t, users.gotAdd)
	assert.Equal(t, []types.Grant{{TenantCode: "radiant", OrgCode: "CHOP", RoleCode: "geneticist"}}, users.gotRemove,
		"member survives an empty payload; the role that was left out does not")
}

func Test_UserAdmin_UpdateTenantUser_UnchangedRoleSetWritesNothing(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes(), current: editedUser()}
	_, err := updateUser(t, users, &mockOrgChecker{existing: []string{"CHOP"}},
		newUpdate(types.CreateUserRole{RoleCode: "geneticist", OrgCodes: []string{"CHOP"}}))

	require.NoError(t, err)
	assert.Empty(t, users.gotAdd)
	assert.Empty(t, users.gotRemove, "resubmitting the same set must not rewrite the grants' audit")
}

func Test_UserAdmin_UpdateTenantUser_RepeatedOrgYieldsOneGrant(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes(), current: editedUser()}
	_, err := updateUser(t, users, &mockOrgChecker{existing: []string{"CHUSJ"}},
		newUpdate(types.CreateUserRole{RoleCode: "geneticist", OrgCodes: []string{"CHUSJ", "CHUSJ"}}))

	require.NoError(t, err)
	assert.Len(t, users.gotAdd, 1)
}

func Test_UserAdmin_UpdateTenantUser_RenamesInKeycloak(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes(), current: editedUser()}
	keycloak, err := updateUser(t, users, &mockOrgChecker{},
		types.UpdateUserRequest{FirstName: "Grace", LastName: "Chen-Lee"})

	require.NoError(t, err)
	assert.Equal(t, [3]string{"b3f1-keycloak-sub", "Grace", "Chen-Lee"}, keycloak.gotRename)
	assert.Equal(t, "Chen-Lee", users.gotLast)
}

func Test_UserAdmin_UpdateTenantUser_UnchangedNameSkipsKeycloak(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes(), current: editedUser()}
	keycloak, err := updateUser(t, users, &mockOrgChecker{}, newUpdate())

	require.NoError(t, err)
	assert.Zero(t, keycloak.gotRename, "editing roles alone must not depend on the identity provider")
}

func Test_UserAdmin_UpdateTenantUser_KeycloakFailureLeavesGrantsUntouched(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes(), current: editedUser()}
	keycloak := &mockKeycloak{renameErr: errors.New("keycloak unreachable")}
	admin := NewUserAdmin(users, &mockOrgChecker{}, AdminDeps{
		Keycloak: keycloak, Ranger: &mockRanger{}, Starrocks: &mockStarrocks{}, Auth: &mockAuthStore{},
	})

	err := admin.UpdateTenantUser(t.Context(), "radiant", "b3f1-keycloak-sub",
		types.UpdateUserRequest{FirstName: "Grace", LastName: "Chen-Lee"}, "acting-admin-sub")

	require.Error(t, err)
	assert.False(t, users.updated, "nothing is committed, so the admin's retry converges")
}

func Test_UserAdmin_UpdateTenantUser_UnknownUserIsReported(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes(), currentErr: types.ErrUserNotInTenant}
	_, err := updateUser(t, users, &mockOrgChecker{}, newUpdate())

	assert.ErrorIs(t, err, types.ErrUserNotInTenant)
	assert.False(t, users.updated)
}

func Test_UserAdmin_UpdateTenantUser_UnknownRoleIsRejected(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes(), current: editedUser()}
	_, err := updateUser(t, users, &mockOrgChecker{}, newUpdate(types.CreateUserRole{RoleCode: "no_such_role"}))

	assert.ErrorIs(t, err, types.ErrUnknownRole)
	assert.False(t, users.updated)
}

// adminUser holds the role carrying can_manage_user, so the invariant applies to them.
func adminUser() *types.TenantUser {
	return &types.TenantUser{
		UserID: "tara-sub", FirstName: "Tara", LastName: "Admin",
		Grants: []types.Grant{
			{TenantCode: "radiant", RoleCode: types.RoleMember},
			{TenantCode: "radiant", RoleCode: "tenant_admin"},
		},
	}
}

func adminScopes() map[string]string {
	scopes := defaultScopes()
	scopes["tenant_admin"] = types.RoleScopeTenant
	return scopes
}

func editAdmin(t *testing.T, users *mockTenantUserStore, roles ...types.CreateUserRole) error {
	t.Helper()
	admin := NewUserAdmin(users, &mockOrgChecker{}, AdminDeps{
		Keycloak: &mockKeycloak{}, Ranger: &mockRanger{}, Starrocks: &mockStarrocks{}, Auth: &mockAuthStore{},
	})
	return admin.UpdateTenantUser(t.Context(), "radiant", "tara-sub",
		types.UpdateUserRequest{FirstName: "Tara", LastName: "Admin", Roles: roles}, "tara-sub")
}

func Test_UserAdmin_UpdateTenantUser_LastAdminCannotLoseTheRole(t *testing.T) {
	users := &mockTenantUserStore{scopes: adminScopes(), current: adminUser(), adminRoles: []string{"tenant_admin"}}

	err := editAdmin(t, users)

	assert.ErrorIs(t, err, types.ErrLastTenantAdmin)
	assert.False(t, users.updated)
	assert.Equal(t, "tara-sub", users.gotExcluded, "the user being edited does not count as their own replacement")
}

func Test_UserAdmin_UpdateTenantUser_AdminCanLoseTheRoleWhenAnotherHoldsIt(t *testing.T) {
	users := &mockTenantUserStore{scopes: adminScopes(), current: adminUser(),
		adminRoles: []string{"tenant_admin"}, otherAdmin: true}

	err := editAdmin(t, users)

	require.NoError(t, err)
	assert.Equal(t, []types.Grant{{TenantCode: "radiant", RoleCode: "tenant_admin"}}, users.gotRemove)
}

func Test_UserAdmin_UpdateTenantUser_LastAdminKeepingTheRoleIsAllowed(t *testing.T) {
	users := &mockTenantUserStore{scopes: adminScopes(), current: adminUser(), adminRoles: []string{"tenant_admin"}}

	err := editAdmin(t, users, types.CreateUserRole{RoleCode: "tenant_admin"})

	require.NoError(t, err)
	assert.Empty(t, users.gotRemove)
	assert.Empty(t, users.gotExcluded, "an edit that keeps the role never has to look for another admin")
}

func Test_UserAdmin_UpdateTenantUser_NonAdminIsUnaffectedByTheInvariant(t *testing.T) {
	users := &mockTenantUserStore{scopes: defaultScopes(), current: editedUser(), adminRoles: []string{"tenant_admin"}}

	_, err := updateUser(t, users, &mockOrgChecker{}, newUpdate())

	require.NoError(t, err)
	assert.Empty(t, users.gotExcluded)
}

// --- RemoveTenantUser -------------------------------------------------------

// removeUser runs UserAdmin's revoke path against stubbed stores, returning the Ranger stand-in so
// the test can assert the tenant-role membership was dropped alongside the grants.
func removeUser(t *testing.T, users *mockTenantUserStore, userID string) (*mockRanger, error) {
	t.Helper()
	ranger := &mockRanger{}
	admin := NewUserAdmin(users, &mockOrgChecker{}, AdminDeps{
		Keycloak:  &mockKeycloak{sub: "b3f1-keycloak-sub"},
		Ranger:    ranger,
		Starrocks: &mockStarrocks{},
		Auth:      &mockAuthStore{},
	})
	return ranger, admin.RemoveTenantUser(t.Context(), "radiant", userID, "acting-admin-sub")
}

func Test_UserAdmin_RemoveTenantUser_RevokesEveryGrantAndTheRangerMembership(t *testing.T) {
	users := &mockTenantUserStore{current: editedUser()}

	ranger, err := removeUser(t, users, "b3f1-keycloak-sub")

	require.NoError(t, err)
	assert.True(t, users.removed)
	assert.Equal(t, "b3f1-keycloak-sub", users.gotRemovedID)
	assert.Equal(t, [][2]string{{"radiant_user", "b3f1-keycloak-sub"}}, ranger.roleRemoves,
		"the tenant's Ranger role loses the member, so Postgres and Ranger stay aligned")
}

func Test_UserAdmin_RemoveTenantUser_LeavesTheKeycloakIdentityAlone(t *testing.T) {
	users := &mockTenantUserStore{current: editedUser()}
	keycloak := &mockKeycloak{sub: "b3f1-keycloak-sub"}
	admin := NewUserAdmin(users, &mockOrgChecker{}, AdminDeps{
		Keycloak: keycloak, Ranger: &mockRanger{}, Starrocks: &mockStarrocks{}, Auth: &mockAuthStore{},
	})

	require.NoError(t, admin.RemoveTenantUser(t.Context(), "radiant", "b3f1-keycloak-sub", "acting-admin-sub"))

	assert.Zero(t, keycloak.gotRename, "revoking tenant access is not an account deletion")
}

func Test_UserAdmin_RemoveTenantUser_RemovingYourselfIsRejected(t *testing.T) {
	users := &mockTenantUserStore{current: editedUser()}

	ranger, err := removeUser(t, users, "acting-admin-sub")

	assert.ErrorIs(t, err, types.ErrCannotRemoveSelf)
	assert.False(t, users.removed, "nothing is revoked")
	assert.Empty(t, ranger.roleRemoves)
}

func Test_UserAdmin_RemoveTenantUser_UnknownUserIsReported(t *testing.T) {
	users := &mockTenantUserStore{currentErr: types.ErrUserNotInTenant}

	ranger, err := removeUser(t, users, "b3f1-keycloak-sub")

	assert.ErrorIs(t, err, types.ErrUserNotInTenant)
	assert.False(t, users.removed)
	assert.Empty(t, ranger.roleRemoves)
}

func Test_UserAdmin_RemoveTenantUser_LastAdminCannotBeRemoved(t *testing.T) {
	current := editedUser()
	current.Grants = append(current.Grants, types.Grant{TenantCode: "radiant", RoleCode: "tenant_admin"})
	users := &mockTenantUserStore{current: current, adminRoles: []string{"tenant_admin"}, otherAdmin: false}

	ranger, err := removeUser(t, users, "b3f1-keycloak-sub")

	assert.ErrorIs(t, err, types.ErrLastTenantAdmin)
	assert.False(t, users.removed)
	assert.Empty(t, ranger.roleRemoves)
}

func Test_UserAdmin_RemoveTenantUser_AdminCanBeRemovedWhenAnotherHoldsTheRole(t *testing.T) {
	current := editedUser()
	current.Grants = append(current.Grants, types.Grant{TenantCode: "radiant", RoleCode: "tenant_admin"})
	users := &mockTenantUserStore{current: current, adminRoles: []string{"tenant_admin"}, otherAdmin: true}

	_, err := removeUser(t, users, "b3f1-keycloak-sub")

	require.NoError(t, err)
	assert.True(t, users.removed)
	assert.Equal(t, "b3f1-keycloak-sub", users.gotExcluded, "the invariant looks for an admin other than the removed user")
}

func Test_UserAdmin_RemoveTenantUser_RangerFailureLeavesTheGrantsUntouched(t *testing.T) {
	users := &mockTenantUserStore{current: editedUser()}
	admin := NewUserAdmin(users, &mockOrgChecker{}, AdminDeps{
		Keycloak:  &mockKeycloak{sub: "b3f1-keycloak-sub"},
		Ranger:    &mockRanger{err: errors.New("ranger down")},
		Starrocks: &mockStarrocks{},
		Auth:      &mockAuthStore{},
	})

	err := admin.RemoveTenantUser(t.Context(), "radiant", "b3f1-keycloak-sub", "acting-admin-sub")

	require.Error(t, err)
	assert.Contains(t, err.Error(), "ranger")
	assert.False(t, users.removed, "the grants are what a retry finds the user by, so they must survive")
}

func Test_UserAdmin_RemoveTenantUser_PropagatesStoreError(t *testing.T) {
	users := &mockTenantUserStore{current: editedUser(), gotRemoveErr: errors.New("boom")}

	_, err := removeUser(t, users, "b3f1-keycloak-sub")

	require.Error(t, err)
	assert.Contains(t, err.Error(), "boom")
}
