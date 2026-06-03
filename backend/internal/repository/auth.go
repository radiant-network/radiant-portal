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
	Memberships(email string) ([]types.TenantMembership, error)
}

func NewAuthRepository(db *gorm.DB) *AuthRepository {
	if db == nil {
		log.Fatal("AuthRepository: db is nil")
		return nil
	}
	return &AuthRepository{db: db, orgs: NewOrganizationRepository(db)}
}

func (r *AuthRepository) HasAction(email, tenantCode, orgCode, actionCode string) (bool, error) {
	var allowed bool
	err := r.db.Raw(`
		SELECT EXISTS (
			SELECT 1
			FROM user_role ur
			JOIN role_action ra ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
			WHERE ur.email = ? AND ur.tenant_code = ? AND ra.action_code = ?
			  AND (ur.org_code IS NULL OR ur.org_code = ? OR ur.org_code = '*')
		)`, email, tenantCode, actionCode, orgCode).Scan(&allowed).Error
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
}

// Memberships returns the user's effective authorization grouped by tenant.
//
// Each grant routes by its org_code: NULL → tenant_actions; a specific code → that org;
// '*' → every org in the tenant (resolved from the org list, ADR §5.4).
func (r *AuthRepository) Memberships(email string) ([]types.TenantMembership, error) {
	var grants []membershipGrant
	if err := r.db.Raw(`
		SELECT ur.tenant_code, t.name AS tenant_name, ur.org_code, ra.action_code
		FROM user_role ur
		JOIN tenant t       ON t.code = ur.tenant_code
		JOIN role_action ra ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
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

// applyGrant records one grant on the tenant's membership. A NULL org_code is a
// tenant-wide grant; '*' applies the action to every org in tenantOrgs; otherwise it
// applies to the single named org.
func applyGrant(membership *types.TenantMembership, grant membershipGrant, tenantOrgs []string) {
	if grant.OrgCode == nil {
		membership.TenantActions = appendUnique(membership.TenantActions, grant.ActionCode)
	} else if *grant.OrgCode == "*" {
		membership.OrgsByAction[grant.ActionCode] = tenantOrgs
	} else {
		membership.OrgsByAction[grant.ActionCode] = appendUnique(membership.OrgsByAction[grant.ActionCode], *grant.OrgCode)
	}
}

func appendUnique(values []string, value string) []string {
	if slices.Contains(values, value) {
		return values
	}
	return append(values, value)
}
