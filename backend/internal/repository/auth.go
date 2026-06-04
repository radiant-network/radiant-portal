package repository

import (
	"fmt"
	"log"
	"slices"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type AuthRepository struct {
	db   *gorm.DB
	orgs OrganizationDAO
}

type AuthRepositoryDAO interface {
	HasAction(email, tenantCode, orgCode, actionCode string) (bool, error)
	GetMemberships(email string) ([]types.TenantMembership, error)
}

func NewAuthRepository(db *gorm.DB) *AuthRepository {
	if db == nil {
		log.Print("AuthRepository: db is nil")
		return nil
	}
	return &AuthRepository{db: db, orgs: NewOrganizationRepository(db)}
}

// HasAction reports whether the user holds an action in the given tenant. Routing is
// by the action's scope, not the grant's org_code (a role may map both scopes): a
// tenant-scoped action matches any grant in the tenant regardless of orgCode; an
// org-scoped action requires a grant at orgCode or the '*' wildcard.
func (r *AuthRepository) HasAction(email, tenantCode, orgCode, actionCode string) (bool, error) {
	var allowed bool
	err := r.db.Raw(`
		SELECT EXISTS (
			SELECT 1
			FROM user_role ur
			JOIN role_action ra ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
			JOIN action a       ON a.code = ra.action_code
			WHERE ur.email = ? AND ur.tenant_code = ? AND ra.action_code = ?
			  AND (a.scope = ? OR (a.scope = ? AND (ur.org_code = ? OR ur.org_code = '*')))
		)`, email, tenantCode, actionCode, types.ActionScopeTenant, types.ActionScopeOrg, orgCode).Scan(&allowed).Error
	if err != nil {
		return false, fmt.Errorf("error checking action %q for %q: %w", actionCode, email, err)
	}
	return allowed, nil
}

type membershipGrant struct {
	TenantCode string
	TenantName string
	OrgCode    *string
	ActionCode string
	RoleCode   string
	Scope      string
}

// GetMemberships returns the user's effective authorization grouped by tenant.
//
// Each action routes by its own scope (a role may map both): tenant-scoped → tenant_actions;
// org-scoped → orgs_by_action, where a specific org_code maps to that org and '*' expands to
// every org in the tenant (ADR §5.4).
func (r *AuthRepository) GetMemberships(email string) ([]types.TenantMembership, error) {
	var grants []membershipGrant
	if err := r.db.Raw(`
		SELECT ur.tenant_code, t.name AS tenant_name, ur.org_code, ra.action_code, a.scope, ra.role_code
		FROM user_role ur
		JOIN tenant t       ON t.code = ur.tenant_code
		JOIN role_action ra ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
		JOIN action a       ON a.code = ra.action_code
		WHERE ur.email = ?
		ORDER BY ur.tenant_code, ra.action_code, ur.org_code`, email).Scan(&grants).Error; err != nil {
		return nil, fmt.Errorf("error loading grants for %q: %w", email, err)
	}

	// The ORDER BY is load-bearing twice over:
	//   - each tenant's grants arrive contiguously, so tenantOrgs (fetched once when the
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
			codes, err := r.orgs.GetOrganizationCodesByTenant(grant.TenantCode)
			if err != nil {
				return nil, err
			}
			tenantOrgs = codes
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
			log.Printf("WARN: Org-scoped action %s should not be applied tenant wide (org_code = NULL) - Verify the role %s for tenant %s.", grant.ActionCode, grant.RoleCode, grant.TenantCode)
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

func appendUnique(values []string, value string) []string {
	if slices.Contains(values, value) {
		return values
	}
	return append(values, value)
}
