package service

import (
	"context"
	"errors"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

// --- mocks -----------------------------------------------------------------

type mockKeycloak struct {
	sub string
	err error
}

func (m *mockKeycloak) UpsertUser(_ context.Context, _, _, _, _, _ string) (string, error) {
	return m.sub, m.err
}

type mockRanger struct {
	ensured  []string
	roleAdds [][2]string // {role, user}
	err      error
}

func (m *mockRanger) EnsureUser(_ context.Context, name string) error {
	if m.err != nil {
		return m.err
	}
	m.ensured = append(m.ensured, name)
	return nil
}

func (m *mockRanger) AddUserToRole(_ context.Context, roleName, user string) error {
	if m.err != nil {
		return m.err
	}
	m.roleAdds = append(m.roleAdds, [2]string{roleName, user})
	return nil
}

type mockStarrocks struct {
	subs []string
	err  error
}

func (m *mockStarrocks) EnsureJWTUser(_ context.Context, sub string) error {
	if m.err != nil {
		return m.err
	}
	m.subs = append(m.subs, sub)
	return nil
}

type mockAuthStore struct {
	users  [][2]string // {userID, email}
	grants [][4]string // {tenant, org, role, grantedBy}
	err    error
}

func (m *mockAuthStore) UpsertUser(_ context.Context, userID, email, _, _ string) error {
	if m.err != nil {
		return m.err
	}
	m.users = append(m.users, [2]string{userID, email})
	return nil
}

func (m *mockAuthStore) GrantRole(_ context.Context, _, tenantCode, orgCode, roleCode, grantedBy string) error {
	if m.err != nil {
		return m.err
	}
	m.grants = append(m.grants, [4]string{tenantCode, orgCode, roleCode, grantedBy})
	return nil
}

func newMockDeps() (*mockKeycloak, *mockRanger, *mockStarrocks, *mockAuthStore, AdminDeps) {
	kc := &mockKeycloak{sub: "11111111-2222-3333-4444-555555555555"}
	rg := &mockRanger{}
	sr := &mockStarrocks{}
	auth := &mockAuthStore{}
	return kc, rg, sr, auth, AdminDeps{Keycloak: kc, Ranger: rg, Starrocks: sr, Auth: auth}
}

// --- RangerTenantRole ------------------------------------------------------

func Test_RangerTenantRole(t *testing.T) {
	assert.Equal(t, "tenant_a_user", RangerTenantRole("tenant_a"))
}

// --- distinctTenants -------------------------------------------------------

func Test_distinctTenants_DedupesPreservingOrder(t *testing.T) {
	grants := []types.Grant{
		{TenantCode: "tenant_a"},
		{TenantCode: "tenant_b"},
		{TenantCode: "tenant_a"},
	}
	assert.Equal(t, []string{"tenant_a", "tenant_b"}, distinctTenants(grants))
}

func Test_distinctTenants_Empty(t *testing.T) {
	assert.Equal(t, []string{}, distinctTenants(nil))
}

// --- ProvisionUser ---------------------------------------------------------

func Test_ProvisionUser_PropagatesSubToEverySystem(t *testing.T) {
	kc, rg, sr, auth, deps := newMockDeps()
	in := types.UserInput{
		Username: "alice", Email: "alice@demo.org", FirstName: "Alice", LastName: "Demo", Password: "pw",
		Grants: []types.Grant{{TenantCode: "tenant_a", OrgCode: "ORG_A1", RoleCode: "geneticist"}},
	}

	sub, err := ProvisionUser(context.Background(), deps, in, "test-admin")

	assert.NoError(t, err)
	assert.Equal(t, kc.sub, sub)
	// Postgres user_id is the sub; email is the optional attribute.
	assert.Equal(t, [][2]string{{kc.sub, "alice@demo.org"}}, auth.users)
	// grantedBy is threaded through to the grant for audit attribution.
	assert.Equal(t, [][4]string{{"tenant_a", "ORG_A1", "geneticist", "test-admin"}}, auth.grants)
	// Ranger user + tenant-role membership both keyed on the sub.
	assert.Equal(t, []string{kc.sub}, rg.ensured)
	assert.Equal(t, [][2]string{{"tenant_a_user", kc.sub}}, rg.roleAdds)
	// StarRocks user named by the sub.
	assert.Equal(t, []string{kc.sub}, sr.subs)
}

func Test_ProvisionUser_AddsUserToEachDistinctTenantRoleOnce(t *testing.T) {
	kc, rg, _, _, deps := newMockDeps()
	in := types.UserInput{
		Username: "carol", Email: "carol@demo.org", FirstName: "Carol", LastName: "Demo",
		Grants: []types.Grant{
			{TenantCode: "tenant_a", OrgCode: "*", RoleCode: "geneticist"},
			{TenantCode: "tenant_b", OrgCode: "*", RoleCode: "geneticist"},
			{TenantCode: "tenant_a", OrgCode: "*", RoleCode: "researcher"},
		},
	}

	_, err := ProvisionUser(context.Background(), deps, in, "createuser")

	assert.NoError(t, err)
	assert.Equal(t, []string{kc.sub}, rg.ensured, "ranger user ensured exactly once")
	assert.Equal(t, [][2]string{{"tenant_a_user", kc.sub}, {"tenant_b_user", kc.sub}}, rg.roleAdds)
}

func Test_ProvisionUser_StopsWhenKeycloakFails(t *testing.T) {
	_, rg, sr, auth, deps := newMockDeps()
	deps.Keycloak = &mockKeycloak{err: errors.New("boom")}

	sub, err := ProvisionUser(context.Background(), deps, types.UserInput{Username: "alice", Email: "a@b.c"}, "createuser")

	assert.Error(t, err)
	assert.Empty(t, sub)
	assert.Empty(t, auth.users, "no downstream writes after keycloak fails")
	assert.Empty(t, rg.ensured)
	assert.Empty(t, sr.subs)
}

func Test_ProvisionUser_ReturnsSubEvenWhenLaterStepFails(t *testing.T) {
	kc, _, _, _, deps := newMockDeps()
	deps.Ranger = &mockRanger{err: errors.New("ranger down")}

	sub, err := ProvisionUser(context.Background(), deps, types.UserInput{
		Username: "alice", Email: "a@b.c",
		Grants: []types.Grant{{TenantCode: "tenant_a", OrgCode: "ORG_A1", RoleCode: "geneticist"}},
	}, "createuser")

	assert.Error(t, err)
	assert.Equal(t, kc.sub, sub, "sub is returned so a re-run/caller can still see it")
}
