package postgres

import (
	"context"
	"fmt"
	"strings"

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
	return r.tenantRoles(ctx, tenantCode, "")
}

// GetTenantRole returns one role of the tenant in the same shape the list serves it. A role the
// tenant does not define is reported as a nil result rather than an error, so the caller answers
// 404 without inspecting the error — and a role of another tenant reads as absent here, since the
// role key is (tenant_code, code).
func (r *RolesRepository) GetTenantRole(ctx context.Context, tenantCode, roleCode string) (*types.RoleResult, error) {
	roles, err := r.tenantRoles(ctx, tenantCode, roleCode)
	if err != nil {
		return nil, err
	}
	if len(roles) == 0 {
		return nil, nil
	}
	return &roles[0], nil
}

const roleNameUniqueIndex = "role_unique_name_per_tenant"

// CreateRole inserts a custom role and its action mappings, then returns the role in the same
// shape the reads serve it. The insert is one transaction, so a role never lands without the
// actions that give it meaning.
//
// Every requested action must exist and be grantable; otherwise nothing is written and the
// offending codes come back wrapped in types.ErrRoleActionsNotGrantable. Refusing reserved
// actions here is what makes can_manage_user impossible to confer through a custom role — and
// tenant_admin, whose only distinguishing action is that one, un-duplicable as a consequence.
func (r *RolesRepository) CreateRole(ctx context.Context, tenantCode string, req types.CreateRoleRequest) (*types.RoleResult, error) {
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		refused, err := ungrantableActions(tx, req.Actions)
		if err != nil {
			return err
		}
		if len(refused) > 0 {
			return fmt.Errorf("%w: %s", types.ErrRoleActionsNotGrantable, strings.Join(refused, ", "))
		}

		if err := tx.Exec(`
			INSERT INTO role (tenant_code, code, name_en, description_en, is_default)
			VALUES (?, ?, ?, NULLIF(?, ''), false)`,
			tenantCode, req.Code, req.Name, req.Description).Error; err != nil {
			switch {
			case uniqueViolationOn(err, roleNameUniqueIndex):
				return types.ErrRoleNameExists
			case isUniqueViolation(err):
				return types.ErrRoleCodeExists
			}
			return fmt.Errorf("error creating role %q in tenant %q: %w", req.Code, tenantCode, err)
		}

		mappings := make([]map[string]any, 0, len(req.Actions))
		for _, action := range req.Actions {
			mappings = append(mappings, map[string]any{
				"tenant_code": tenantCode,
				"role_code":   req.Code,
				"action_code": action,
			})
		}
		if err := tx.Table("role_action").Create(mappings).Error; err != nil {
			return fmt.Errorf("error mapping actions to role %q in tenant %q: %w", req.Code, tenantCode, err)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	return r.GetTenantRole(ctx, tenantCode, req.Code)
}

// ungrantableActions returns the requested codes a custom role may not map, in the order given —
// those absent from the catalog and those reserved (grantable = false) are equally refused, since
// from the caller's side both mean "this action is not on offer".
func ungrantableActions(tx *gorm.DB, actions []string) ([]string, error) {
	allowed := []string{}
	if err := tx.Raw(
		`SELECT code FROM action WHERE code IN ? AND grantable`, actions).Scan(&allowed).Error; err != nil {
		return nil, fmt.Errorf("error checking actions %v: %w", actions, err)
	}

	grantable := make(map[string]bool, len(allowed))
	for _, code := range allowed {
		grantable[code] = true
	}
	refused := []string{}
	for _, action := range actions {
		if !grantable[action] {
			refused = append(refused, action)
		}
	}
	return refused, nil
}

// tenantRoles loads the tenant's roles with their actions, the scope those actions derive, and
// their holder count. An empty roleCode returns the whole catalog; a non-empty one narrows to that
// single role, so both reads share one definition of what a role looks like.
func (r *RolesRepository) tenantRoles(ctx context.Context, tenantCode, roleCode string) ([]types.RoleResult, error) {
	roles := []types.RoleResult{}
	query := `
		SELECT r.code, r.name_en AS name, r.description_en AS description, r.is_default,
		       COALESCE(h.holders, 0) AS assigned_users_count
		FROM role r
		LEFT JOIN (
			SELECT role_code, COUNT(DISTINCT user_id) AS holders
			FROM user_role
			WHERE tenant_code = ?
			GROUP BY role_code
		) h ON h.role_code = r.code
		WHERE r.tenant_code = ?`
	args := []any{tenantCode, tenantCode}
	if roleCode != "" {
		query += ` AND r.code = ?`
		args = append(args, roleCode)
	}
	query += `
		ORDER BY r.is_default DESC, r.name_en, r.code`

	if err := r.db.WithContext(ctx).Raw(query, args...).Scan(&roles).Error; err != nil {
		return nil, fmt.Errorf("error loading roles of tenant %q: %w", tenantCode, err)
	}
	if len(roles) == 0 {
		return roles, nil
	}

	// Actions are loaded by roleActions below, which is why RoleResult tags them gorm:"-":
	// left parsable, GORM reads the slice as an association and errors out on every scan.
	actions, err := r.roleActions(ctx, tenantCode, roleCode)
	if err != nil {
		return nil, err
	}
	applyRoleActions(roles, actions)
	return roles, nil
}

// roleActions loads the actions of the tenant's roles in one statement — of every role when
// roleCode is empty, so listing stays two statements whatever the number of roles.
func (r *RolesRepository) roleActions(ctx context.Context, tenantCode, roleCode string) ([]roleAction, error) {
	var actions []roleAction
	query := `
		SELECT ra.role_code, a.code, a.name_en AS name, a.description_en AS description, a.scope
		FROM role_action ra
		JOIN action a ON a.code = ra.action_code
		WHERE ra.tenant_code = ?`
	args := []any{tenantCode}
	if roleCode != "" {
		query += ` AND ra.role_code = ?`
		args = append(args, roleCode)
	}
	query += `
		ORDER BY a.scope, a.code`

	if err := r.db.WithContext(ctx).Raw(query, args...).Scan(&actions).Error; err != nil {
		return nil, fmt.Errorf("error loading role actions of tenant %q: %w", tenantCode, err)
	}
	return actions, nil
}

// applyRoleActions attaches each role the actions it maps and the scope they derive, grouping in a
// single pass — tracking the scopes seen per role is what makes the role's own scope fall out of it.
func applyRoleActions(roles []types.RoleResult, actions []roleAction) {
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
}
