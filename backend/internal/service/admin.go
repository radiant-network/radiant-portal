package service

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
)

// KeycloakProvisioner upserts a user in the identity provider and returns its
// stable subject id (the `sub` claim).
type KeycloakProvisioner interface {
	UpsertUser(ctx context.Context, username, email, firstName, lastName, password string) (sub string, err error)
}

// RangerProvisioner manages users and their tenant-role membership in Ranger.
type RangerProvisioner interface {
	EnsureUser(ctx context.Context, name string) error
	AddUserToRole(ctx context.Context, roleName, user string) error
}

// StarrocksProvisioner creates the JWT-authenticated StarRocks user.
type StarrocksProvisioner interface {
	EnsureJWTUser(ctx context.Context, sub string) error
}

// AuthStore writes the Postgres auth model (users registry + role grants). Both
// are keyed on user_id (the Keycloak sub); email is an optional attribute.
type AuthStore interface {
	UpsertUser(ctx context.Context, userID, email, firstName, lastName string) error
	GrantRole(ctx context.Context, userID, tenantCode, orgCode, roleCode, grantedBy string) error
}

// AdminDeps bundles the per-system provisioners ProvisionUser orchestrates.
type AdminDeps struct {
	Keycloak  KeycloakProvisioner
	Ranger    RangerProvisioner
	Starrocks StarrocksProvisioner
	Auth      AuthStore
}

// RangerTenantRole is the Ranger role name a tenant's members belong to. It must
// match the role created by 03_ranger_policies.py (tenant_a -> "tenant_a_user").
func RangerTenantRole(tenantCode string) string {
	return tenantCode + "_user"
}

// ProvisionUser creates the user across all four systems and returns its `sub`.
//
// Order matters: Keycloak first (it mints the sub every other system keys on),
// then Postgres (the auth source of truth), then Ranger membership and the
// StarRocks login that authorization rides on. Every step is idempotent, so a
// re-run converges.
//
// grantedBy records audit attribution for the role grants (who performed the
// provisioning) — the createuser CLI passes "createuser"; a POST /users handler
// would pass the acting admin's identity.
func ProvisionUser(ctx context.Context, deps AdminDeps, in types.UserInput, grantedBy string) (string, error) {
	sub, err := deps.Keycloak.UpsertUser(ctx, in.Username, in.Email, in.FirstName, in.LastName, in.Password)
	if err != nil {
		return "", fmt.Errorf("keycloak: upsert user %q: %w", in.Username, err)
	}

	if err := deps.Auth.UpsertUser(ctx, sub, in.Email, in.FirstName, in.LastName); err != nil {
		return sub, fmt.Errorf("postgres: upsert user %q: %w", sub, err)
	}
	for _, g := range in.Grants {
		if err := deps.Auth.GrantRole(ctx, sub, g.TenantCode, g.OrgCode, g.RoleCode, grantedBy); err != nil {
			return sub, fmt.Errorf("postgres: grant %s/%s/%s to %q: %w", g.TenantCode, g.OrgCode, g.RoleCode, sub, err)
		}
	}

	if err := deps.Ranger.EnsureUser(ctx, sub); err != nil {
		return sub, fmt.Errorf("ranger: ensure user %q: %w", sub, err)
	}
	for _, tenant := range distinctTenants(in.Grants) {
		role := RangerTenantRole(tenant)
		if err := deps.Ranger.AddUserToRole(ctx, role, sub); err != nil {
			return sub, fmt.Errorf("ranger: add %q to role %q: %w", sub, role, err)
		}
	}

	if err := deps.Starrocks.EnsureJWTUser(ctx, sub); err != nil {
		return sub, fmt.Errorf("starrocks: ensure jwt user %q: %w", sub, err)
	}

	return sub, nil
}

// distinctTenants returns the tenant codes referenced by the grants, in first-seen
// order with duplicates removed.
func distinctTenants(grants []types.Grant) []string {
	seen := map[string]bool{}
	tenants := []string{}
	for _, g := range grants {
		if !seen[g.TenantCode] {
			seen[g.TenantCode] = true
			tenants = append(tenants, g.TenantCode)
		}
	}
	return tenants
}
