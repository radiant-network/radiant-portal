package service

import (
	"context"
	"fmt"
	"log/slog"
	"slices"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
)

// TenantUserStore is the authorization store behind user administration: what the create and edit
// paths must check before writing anything — whether the email is already a user of the tenant,
// what scope each requested role implies, who holds the administration action — plus the edit's
// transactional write.
type TenantUserStore interface {
	EmailHasTenantGrant(ctx context.Context, tenantCode, email string) (bool, error)
	RoleScopes(ctx context.Context, tenantCode string, roleCodes []string) (map[string]string, error)
	TenantUser(ctx context.Context, tenantCode, userID string) (*types.TenantUser, error)
	RolesWithAction(ctx context.Context, tenantCode, actionCode string) ([]string, error)
	HasOtherUserWithAnyRole(ctx context.Context, tenantCode, userID string, roleCodes []string) (bool, error)
	UpdateTenantUser(ctx context.Context, tenantCode, userID, firstName, lastName, grantedBy string, add, remove []types.Grant) error
}

// OrganizationChecker resolves which of the requested organization codes exist in the tenant.
type OrganizationChecker interface {
	ExistingOrgCodes(ctx context.Context, tenantCode string, codes []string) ([]string, error)
}

type UserAdmin struct {
	users TenantUserStore
	orgs  OrganizationChecker
	deps  AdminDeps
}

func NewUserAdmin(users TenantUserStore, orgs OrganizationChecker, deps AdminDeps) *UserAdmin {
	return &UserAdmin{users: users, orgs: orgs, deps: deps}
}

// CreateTenantUser adds a user to the tenant: it provisions the identity across all four systems
// and grants them the requested roles, plus the tenant-wide member role every user holds.
//
// Provisioning is not atomic — a failure partway through can leave, say, a Keycloak account with no
// grants. Every step is idempotent, so the caller retrying converges; nothing is rolled back.
//
// actor is the acting administrator's user_id, recorded as granted_by on every row written.
func (a *UserAdmin) CreateTenantUser(ctx context.Context, tenant string, req types.CreateUserRequest, actor string) error {
	// Checked before provisioning: the Keycloak step is an upsert, so going ahead would silently
	// overwrite the existing person's name instead of reporting the conflict.
	taken, err := a.users.EmailHasTenantGrant(ctx, tenant, req.Email)
	if err != nil {
		return err
	}
	if taken {
		return types.ErrUserAlreadyInTenant
	}

	grants, err := a.resolveGrants(ctx, tenant, req.Roles)
	if err != nil {
		return err
	}

	// The email doubles as the Keycloak username; the password stays empty because the realm
	// delegates authentication to an external identity provider.
	sub, err := ProvisionUser(ctx, a.deps, types.UserInput{
		Username:  req.Email,
		Email:     req.Email,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Grants:    grants,
	}, actor)
	if err != nil {
		return err
	}

	logGrants(ctx, actor, sub, grants)
	return nil
}

// UpdateTenantUser applies the edited user: their identity attributes, and the role set they
// should end up with. The payload carries the whole desired set, so a role it omits is revoked —
// except member, which resolveGrants keeps tenant-wide either way.
//
// actor is the acting administrator's user_id, recorded as granted_by on the rows this adds.
func (a *UserAdmin) UpdateTenantUser(ctx context.Context, tenant, userID string, req types.UpdateUserRequest, actor string) error {
	current, err := a.users.TenantUser(ctx, tenant, userID)
	if err != nil {
		return err
	}
	desired, err := a.resolveGrants(ctx, tenant, req.Roles)
	if err != nil {
		return err
	}
	if err := a.assertTenantKeepsAnAdmin(ctx, tenant, current, desired); err != nil {
		return err
	}
	add, remove := diffGrants(current.Grants, desired)

	// Keycloak goes first because the portal serves names from Postgres: a failure here leaves
	// nothing visibly changed and a retry converges, whereas the reverse order would commit the
	// whole edit and still answer with an error. The rename is skipped when the name is unchanged,
	// so editing roles alone never depends on the identity provider being reachable.
	if req.FirstName != current.FirstName || req.LastName != current.LastName {
		if err := a.deps.Keycloak.UpdateUserName(ctx, userID, req.FirstName, req.LastName); err != nil {
			return fmt.Errorf("keycloak: update user %q: %w", userID, err)
		}
	}
	if err := a.users.UpdateTenantUser(ctx, tenant, userID, req.FirstName, req.LastName, actor, add, remove); err != nil {
		return err
	}

	logGrants(ctx, actor, userID, add)
	logRevocations(ctx, actor, userID, remove)
	return nil
}

// assertTenantKeepsAnAdmin refuses an edit that would strip the tenant of its last user able to
// manage users. The action is only ever obtained from a role, and granting a role takes that same
// action, so a tenant that loses its last holder cannot be recovered through the API at all.
func (a *UserAdmin) assertTenantKeepsAnAdmin(ctx context.Context, tenant string, current *types.TenantUser, desired []types.Grant) error {
	adminRoles, err := a.users.RolesWithAction(ctx, tenant, types.ActionManageUser)
	if err != nil {
		return err
	}
	if !holdsAnyRole(current.Grants, adminRoles) || holdsAnyRole(desired, adminRoles) {
		return nil
	}
	other, err := a.users.HasOtherUserWithAnyRole(ctx, tenant, current.UserID, adminRoles)
	if err != nil {
		return err
	}
	if !other {
		return types.ErrLastTenantAdmin
	}
	return nil
}

func holdsAnyRole(grants []types.Grant, roleCodes []string) bool {
	for _, grant := range grants {
		if slices.Contains(roleCodes, grant.RoleCode) {
			return true
		}
	}
	return false
}

// diffGrants reduces the desired set to the rows that actually have to be written, at the
// (role, organization) grain. Leaving the unchanged rows out of both lists is what preserves their
// granted_at / granted_by — a delete-all-then-reinsert would rewrite the audit of every grant.
func diffGrants(current, desired []types.Grant) (add, remove []types.Grant) {
	held := map[grantKey]bool{}
	for _, grant := range current {
		held[keyOf(grant)] = true
	}
	wanted := map[grantKey]bool{}
	for _, grant := range desired {
		key := keyOf(grant)
		if wanted[key] {
			// The same organization can be listed twice for one role; the grant is still one row.
			continue
		}
		wanted[key] = true
		if !held[key] {
			add = append(add, grant)
		}
	}
	for _, grant := range current {
		if !wanted[keyOf(grant)] {
			remove = append(remove, grant)
		}
	}
	return add, remove
}

type grantKey struct {
	roleCode string
	orgCode  string
}

func keyOf(grant types.Grant) grantKey {
	return grantKey{roleCode: grant.RoleCode, orgCode: grant.OrgCode}
}

// resolveGrants turns the requested roles into user_role rows, with the tenant-wide member grant
// prepended. A role's scope decides the shape of its grants, so the caller never picks it: a
// tenant-scoped role yields one row with no org, an org-scoped one a row per organization.
func (a *UserAdmin) resolveGrants(ctx context.Context, tenant string, roles []types.CreateUserRole) ([]types.Grant, error) {
	roleCodes := make([]string, 0, len(roles)+1)
	roleCodes = append(roleCodes, types.RoleMember)
	for _, role := range roles {
		if role.RoleCode != types.RoleMember {
			roleCodes = append(roleCodes, role.RoleCode)
		}
	}
	scopes, err := a.users.RoleScopes(ctx, tenant, roleCodes)
	if err != nil {
		return nil, err
	}

	grants := []types.Grant{{TenantCode: tenant, RoleCode: types.RoleMember}}
	requestedOrgs := []string{}
	for _, role := range roles {
		if role.RoleCode == types.RoleMember {
			// Granted tenant-wide above; a payload entry only has to not contradict that.
			if len(role.OrgCodes) > 0 {
				return nil, fmt.Errorf("role %q %w", role.RoleCode, types.ErrRoleNotOrgScoped)
			}
			continue
		}
		scope, known := scopes[role.RoleCode]
		if !known {
			return nil, fmt.Errorf("%w %q", types.ErrUnknownRole, role.RoleCode)
		}
		if scope == types.RoleScopeTenant {
			if len(role.OrgCodes) > 0 {
				return nil, fmt.Errorf("role %q %w", role.RoleCode, types.ErrRoleNotOrgScoped)
			}
			grants = append(grants, types.Grant{TenantCode: tenant, RoleCode: role.RoleCode})
			continue
		}
		if len(role.OrgCodes) == 0 {
			return nil, fmt.Errorf("role %q %w", role.RoleCode, types.ErrRoleRequiresOrg)
		}
		for _, org := range role.OrgCodes {
			if org != types.WildcardOrg {
				requestedOrgs = append(requestedOrgs, org)
			}
			grants = append(grants, types.Grant{TenantCode: tenant, OrgCode: org, RoleCode: role.RoleCode})
		}
	}

	if err := a.assertOrgsExist(ctx, tenant, requestedOrgs); err != nil {
		return nil, err
	}
	return grants, nil
}

func (a *UserAdmin) assertOrgsExist(ctx context.Context, tenant string, codes []string) error {
	if len(codes) == 0 {
		return nil
	}
	existing, err := a.orgs.ExistingOrgCodes(ctx, tenant, codes)
	if err != nil {
		return err
	}
	seen := make(map[string]bool, len(existing))
	for _, code := range existing {
		seen[code] = true
	}
	// The same org can be requested by several roles, so seen doubles as the already-reported set.
	missing := []string{}
	for _, code := range codes {
		if !seen[code] {
			seen[code] = true
			missing = append(missing, code)
		}
	}
	if len(missing) > 0 {
		return fmt.Errorf("%w: %s", types.ErrUnknownOrganizations, strings.Join(missing, ", "))
	}
	return nil
}

func logRevocations(ctx context.Context, actor, sub string, grants []types.Grant) {
	for _, grant := range grants {
		slog.InfoContext(ctx, "role revoked",
			slog.String("actor", actor),
			slog.String("user_id", sub),
			slog.String("tenant", grant.TenantCode),
			slog.String("org", grant.OrgCode),
			slog.String("role", grant.RoleCode),
		)
	}
}

// logGrants records who granted what to whom. Permission changes are audited through the logs
// rather than a table (Admin MVP decision), so this line is the only trace of the grant's author.
func logGrants(ctx context.Context, actor, sub string, grants []types.Grant) {
	for _, grant := range grants {
		slog.InfoContext(ctx, "role granted",
			slog.String("actor", actor),
			slog.String("user_id", sub),
			slog.String("tenant", grant.TenantCode),
			slog.String("org", grant.OrgCode),
			slog.String("role", grant.RoleCode),
		)
	}
}
