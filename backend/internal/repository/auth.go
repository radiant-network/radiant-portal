package repository

import (
	"context"
	"fmt"
	"log/slog"
	"slices"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type AuthRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

// HasAction reports whether the user holds an action in the given tenant. Routing is
// by the action's scope, not the grant's org_code (a role may map both scopes): a
// tenant-scoped action matches any grant in the tenant regardless of orgCode; an
// org-scoped action requires a grant at orgCode or the '*' wildcard.
func (r *AuthRepository) HasAction(ctx context.Context, userID, tenantCode, orgCode, actionCode string) (bool, error) {
	var allowed bool
	err := r.db.WithContext(ctx).Raw(`
		SELECT EXISTS (
			SELECT 1
			FROM user_role ur
			JOIN role_action ra ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
			JOIN action a       ON a.code = ra.action_code
			WHERE ur.user_id = ? AND ur.tenant_code = ? AND ra.action_code = ?
			  AND (a.scope = ? OR (a.scope = ? AND (ur.org_code = ? OR ur.org_code = '*')))
		)`, userID, tenantCode, actionCode, types.ActionScopeTenant, types.ActionScopeOrg, orgCode).Scan(&allowed).Error
	if err != nil {
		return false, fmt.Errorf("error checking action %q for %q: %w", actionCode, userID, err)
	}
	return allowed, nil
}

// TenantExists reports whether a tenant with the given code exists. It backs the
// tenant-routing middleware: an unknown tenant in the URL path becomes a 404 instead of
// reaching a write and surfacing as a foreign-key violation (a 500) downstream.
func (r *AuthRepository) TenantExists(tenantCode string) (bool, error) {
	var exists bool
	err := r.db.Raw(`
		SELECT EXISTS (
			SELECT 1 FROM tenant WHERE code = ?
		)`, tenantCode).Scan(&exists).Error
	if err != nil {
		return false, fmt.Errorf("error checking tenant existence for %q: %w", tenantCode, err)
	}
	return exists, nil
}

// HasTenantAccess reports whether the user holds at least one role in the given tenant.
// It backs the tenant-routing middleware: any grant (org-scoped or tenant-wide) makes the
// caller a member of the tenant.
func (r *AuthRepository) HasTenantAccess(ctx context.Context, userID, tenantCode string) (bool, error) {
	var allowed bool
	err := r.db.WithContext(ctx).Raw(`
		SELECT EXISTS (
			SELECT 1 FROM user_role ur
			WHERE ur.user_id = ? AND ur.tenant_code = ?
		)`, userID, tenantCode).Scan(&allowed).Error
	if err != nil {
		return false, fmt.Errorf("error checking tenant access for %q in %q: %w", userID, tenantCode, err)
	}
	return allowed, nil
}

type membershipGrant struct {
	TenantCode     string
	TenantName     string
	OrgCode        *string
	ActionCode     string
	RoleCode       string
	Scope          string
	TenantOrgCodes string
}

// GetMemberships returns the user's effective authorization grouped by tenant.
//
// Each action routes by its own scope (a role may map both): tenant-scoped → tenant_actions;
// org-scoped → orgs_by_action, where a specific org_code maps to that org and '*' expands to
// every org in the tenant (ADR §5.4).
func (r *AuthRepository) GetMemberships(ctx context.Context, userID string) ([]types.TenantMembership, error) {
	var grants []membershipGrant
	if err := r.db.WithContext(ctx).Raw(`
		SELECT ur.tenant_code, t.name AS tenant_name, ur.org_code, ra.action_code, a.scope, ra.role_code,
		       o.org_codes AS tenant_org_codes
		FROM user_role ur
		JOIN tenant t       ON t.code = ur.tenant_code
		JOIN role_action ra ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
		JOIN action a       ON a.code = ra.action_code
		LEFT JOIN (
			SELECT tenant_code, string_agg(code, ',' ORDER BY code) AS org_codes
			FROM organization
			GROUP BY tenant_code
		) o ON o.tenant_code = ur.tenant_code
		WHERE ur.user_id = ?
		ORDER BY ur.tenant_code, ra.action_code, ur.org_code`, userID).Scan(&grants).Error; err != nil {
		return nil, fmt.Errorf("error loading grants for %q: %w", userID, err)
	}

	// The ORDER BY is load-bearing twice over:
	//   - each tenant's grants arrive contiguously, so tenantOrgs (read once when the
	//     tenant is first seen) stays correct for the rest of that tenant's block;
	//   - actions and orgs accumulate in sorted order, so no separate sort pass is needed.
	memberships := []types.TenantMembership{}
	indexByTenant := map[string]int{}
	tenantOrgs := []string{}
	for _, grant := range grants {
		index, exists := indexByTenant[grant.TenantCode]
		if !exists {
			index = len(memberships)
			indexByTenant[grant.TenantCode] = index
			tenantOrgs = splitOrgCodes(grant.TenantOrgCodes)
			memberships = append(memberships, types.TenantMembership{
				Code:          grant.TenantCode,
				Name:          grant.TenantName,
				TenantActions: []string{},
				OrgsByAction:  map[string][]string{},
			})
		}
		applyGrant(&memberships[index], grant, tenantOrgs)
	}
	return memberships, nil
}

// applyGrant records one grant's action on the tenant's membership, routed by the
// action's scope (a role may map both scopes).
func applyGrant(membership *types.TenantMembership, grant membershipGrant, tenantOrgs []string) {
	switch grant.Scope {
	case types.ActionScopeTenant:
		// Tenant-scoped action applies tenant-wide, whatever the grant's org_code is.
		membership.TenantActions = appendUnique(membership.TenantActions, grant.ActionCode)
	case types.ActionScopeOrg:
		if grant.OrgCode == nil {
			// Org-scoped action on a tenant-wide grant (org_code NULL) so this action applies to no specific org and is intentionally dropped.
			slog.Warn("org-scoped action should not be applied tenant wide (org_code = NULL)",
				slog.String("action", grant.ActionCode),
				slog.String("role", grant.RoleCode),
				slog.String("tenant", grant.TenantCode),
			)
			return
		} else if *grant.OrgCode == "*" {
			// Wildcard: the action applies at every org in the tenant.
			membership.OrgsByAction[grant.ActionCode] = tenantOrgs
		} else {
			// Specific org.
			membership.OrgsByAction[grant.ActionCode] = appendUnique(membership.OrgsByAction[grant.ActionCode], *grant.OrgCode)
		}
	}
}

// splitOrgCodes turns the query's string_agg'd "a,b,c" into a slice. An empty string
// (a tenant with no orgs, where string_agg yields NULL) becomes an empty slice, not [""].
func splitOrgCodes(aggregated string) []string {
	if aggregated == "" {
		return []string{}
	}
	return strings.Split(aggregated, ",")
}

func appendUnique(values []string, value string) []string {
	if slices.Contains(values, value) {
		return values
	}
	return append(values, value)
}

// UpsertUser inserts the user or, on user_id conflict, converges its email and
// name. user_id (the Keycloak sub) is the identity key; email is an optional
// attribute. This is the write side used at provisioning time, paired with the
// read side above. Idempotent.
func (r *AuthRepository) UpsertUser(ctx context.Context, userID, email, firstName, lastName string) error {
	err := r.db.WithContext(ctx).Exec(`
		INSERT INTO public.users (user_id, email, first_name, last_name)
		VALUES (?, ?, ?, ?)
		ON CONFLICT (user_id) DO UPDATE
		SET email = EXCLUDED.email,
		    first_name = EXCLUDED.first_name,
		    last_name = EXCLUDED.last_name`,
		userID, email, firstName, lastName).Error
	if err != nil {
		return fmt.Errorf("upsert user %q: %w", userID, err)
	}
	return nil
}

// GrantRole grants a role to the user within a tenant. An empty orgCode is stored
// as NULL (a tenant-wide grant); "*" and specific codes are stored verbatim. The
// role must already exist (FK to public.role). grantedBy records audit attribution
// for the grant (who performed it). Idempotent via ON CONFLICT DO NOTHING, which
// catches either partial-unique index (NULL vs non-NULL org_code).
func (r *AuthRepository) GrantRole(ctx context.Context, userID, tenantCode, orgCode, roleCode, grantedBy string) error {
	var org any
	if orgCode != "" {
		org = orgCode
	}
	err := r.db.WithContext(ctx).Exec(`
		INSERT INTO public.user_role (user_id, tenant_code, org_code, role_code, granted_by)
		VALUES (?, ?, ?, ?, ?)
		ON CONFLICT DO NOTHING`,
		userID, tenantCode, org, roleCode, grantedBy).Error
	if err != nil {
		return fmt.Errorf("grant %s/%s/%s to %q: %w", tenantCode, orgCode, roleCode, userID, err)
	}
	return nil
}
