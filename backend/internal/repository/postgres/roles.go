package postgres

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type RolesRepository struct {
	db *gorm.DB
}

func NewRolesRepository(db database.PostgresDB) *RolesRepository {
	return &RolesRepository{db: db.DB}
}

type roleAction struct {
	RoleCode    string
	Code        string
	Name        string
	Description string
	Scope       string
}

// ListTenantRoles returns every role defined in the tenant — the seeded ones and the tenant's own
// custom ones — each with the actions it maps and the number of users holding it. Roles are a
// small bounded set, so the whole list is returned unpaged.
func (r *RolesRepository) ListTenantRoles(ctx context.Context, tenantCode string) ([]types.RoleResult, error) {
	roles := []types.RoleResult{}
	err := r.db.WithContext(ctx).Raw(`
		SELECT r.code, r.name_en AS name, r.description_en AS description, r.is_default,
		       COALESCE(h.holders, 0) AS assigned_users_count
		FROM role r
		LEFT JOIN (
			SELECT role_code, COUNT(DISTINCT user_id) AS holders
			FROM user_role
			WHERE tenant_code = ?
			GROUP BY role_code
		) h ON h.role_code = r.code
		WHERE r.tenant_code = ?
		ORDER BY r.is_default DESC, r.name_en, r.code`,
		tenantCode, tenantCode).Scan(&roles).Error
	if err != nil {
		return nil, fmt.Errorf("error listing roles of tenant %q: %w", tenantCode, err)
	}
	if len(roles) == 0 {
		return roles, nil
	}

	// Actions are loaded by tenantRoleActions below, which is why RoleResult tags them gorm:"-":
	// left parsable, GORM reads the slice as an association and errors out on every scan.
	actions, err := r.tenantRoleActions(ctx, tenantCode)
	if err != nil {
		return nil, err
	}

	// Group by role, tracking the scopes seen so the role's own scope falls out of the same pass.
	type roleActions struct {
		list              []types.RoleActionResult
		hasTenant, hasOrg bool
	}
	byRole := make(map[string]roleActions, len(roles))
	for _, action := range actions {
		grouped := byRole[action.RoleCode]
		grouped.list = append(grouped.list, types.RoleActionResult{
			Code:        action.Code,
			Name:        action.Name,
			Description: action.Description,
			Scope:       action.Scope,
		})
		grouped.hasTenant = grouped.hasTenant || action.Scope == types.ActionScopeTenant
		grouped.hasOrg = grouped.hasOrg || action.Scope == types.ActionScopeOrg
		byRole[action.RoleCode] = grouped
	}

	for i := range roles {
		grouped := byRole[roles[i].Code] // zero value: a role mapping no action, hence tenant scope
		roles[i].Actions = grouped.list
		if roles[i].Actions == nil {
			roles[i].Actions = []types.RoleActionResult{}
		}
		roles[i].Scope = roleScope(grouped.hasTenant, grouped.hasOrg)
	}
	return roles, nil
}

// tenantRoleActions loads the actions of all the tenant's roles at once, so listing stays two
// statements whatever the number of roles.
func (r *RolesRepository) tenantRoleActions(ctx context.Context, tenantCode string) ([]roleAction, error) {
	var actions []roleAction
	err := r.db.WithContext(ctx).Raw(`
		SELECT ra.role_code, a.code, a.name_en AS name, a.description_en AS description, a.scope
		FROM role_action ra
		JOIN action a ON a.code = ra.action_code
		WHERE ra.tenant_code = ?
		ORDER BY a.scope, a.code`, tenantCode).Scan(&actions).Error
	if err != nil {
		return nil, fmt.Errorf("error listing role actions of tenant %q: %w", tenantCode, err)
	}
	return actions, nil
}
