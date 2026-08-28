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
// custom ones — each with the actions it maps, the number of users holding it and the number of
// organizations it is assigned at. Roles are a small bounded set, so the whole list is returned
// unpaged. Both counts cover the same population as the users list, so they exclude
// machine-to-machine accounts too.
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

const (
	roleCodePrimaryKey    = "role_pkey"
	roleNameEnUniqueIndex = "role_unique_name_en_per_tenant"
	roleNameFrUniqueIndex = "role_unique_name_fr_per_tenant"
)

func roleConflictField(err error) (string, bool) {
	switch {
	case uniqueViolationOn(err, roleCodePrimaryKey):
		return types.RoleFieldCode, true
	case uniqueViolationOn(err, roleNameEnUniqueIndex):
		return types.RoleFieldNameEn, true
	case uniqueViolationOn(err, roleNameFrUniqueIndex):
		return types.RoleFieldNameFr, true
	}
	return "", false
}

// CreateRole inserts a custom role and its action mappings in one transaction, so a role never
// lands without the actions that give it meaning.
//
// Every requested action must exist and be grantable; otherwise nothing is written and the
// offending codes come back wrapped in types.ErrRoleActionsNotGrantable. Refusing reserved
// actions here is what makes can_manage_user impossible to confer through a custom role — and
// tenant_admin, whose only distinguishing action is that one, un-duplicable as a consequence.
func (r *RolesRepository) CreateRole(ctx context.Context, tenantCode string, req types.CreateRoleRequest) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		refused, err := ungrantableActions(tx, req.Actions)
		if err != nil {
			return err
		}
		if len(refused) > 0 {
			return fmt.Errorf("%w: %s", types.ErrRoleActionsNotGrantable, strings.Join(refused, ", "))
		}

		if err := tx.Exec(`
			INSERT INTO role (tenant_code, code, name_en, description_en, name_fr, description_fr, is_default)
			VALUES (?, ?, ?, NULLIF(?, ''), ?, NULLIF(?, ''), false)`,
			tenantCode, req.Code.String(),
			req.NameEn.String(), req.DescriptionEn.String(),
			req.FrenchName(), req.FrenchDescription()).Error; err != nil {
			if field, ok := roleConflictField(err); ok {
				return &types.RoleConflictError{Field: field}
			}
			return fmt.Errorf("error creating role %q in tenant %q: %w", req.Code, tenantCode, err)
		}

		if err := tx.Table("role_action").Create(roleActionMappings(tenantCode, req.Code.String(), req.Actions)).Error; err != nil {
			return fmt.Errorf("error mapping actions to role %q in tenant %q: %w", req.Code, tenantCode, err)
		}
		return nil
	})
}

// UpdateRole replaces a custom role's labels and its whole action set in one transaction, so a
// role is never briefly readable with the new name and the old actions.
//
// Only custom roles are editable: a seeded role comes back as types.ErrRoleIsDefault and a role
// the tenant does not define as types.ErrRoleNotFound, both before anything is written. The
// grantable check is the same one creation applies — otherwise editing a role would be a way in
// for can_manage_user, which is exactly what refusing it at creation prevents.
func (r *RolesRepository) UpdateRole(ctx context.Context, tenantCode, roleCode string, req types.UpdateRoleRequest) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := lockCustomRole(tx, tenantCode, roleCode); err != nil {
			return err
		}

		refused, err := ungrantableActions(tx, req.Actions)
		if err != nil {
			return err
		}
		if len(refused) > 0 {
			return fmt.Errorf("%w: %s", types.ErrRoleActionsNotGrantable, strings.Join(refused, ", "))
		}

		if err := tx.Exec(`
			UPDATE role
			SET name_en = ?, description_en = NULLIF(?, ''), name_fr = ?, description_fr = NULLIF(?, '')
			WHERE tenant_code = ? AND code = ?`,
			req.NameEn.String(), req.DescriptionEn.String(),
			req.FrenchName(), req.FrenchDescription(),
			tenantCode, roleCode).Error; err != nil {
			if field, ok := roleConflictField(err); ok {
				return &types.RoleConflictError{Field: field}
			}
			return fmt.Errorf("error updating role %q in tenant %q: %w", roleCode, tenantCode, err)
		}

		if err := tx.Exec(
			`DELETE FROM role_action WHERE tenant_code = ? AND role_code = ?`,
			tenantCode, roleCode).Error; err != nil {
			return fmt.Errorf("error clearing actions of role %q in tenant %q: %w", roleCode, tenantCode, err)
		}
		if err := tx.Table("role_action").Create(roleActionMappings(tenantCode, roleCode, req.Actions)).Error; err != nil {
			return fmt.Errorf("error mapping actions to role %q in tenant %q: %w", roleCode, tenantCode, err)
		}
		return nil
	})
}

// DeleteRole removes a custom role from the tenant. Its action mappings and every grant of it go
// with it through the two ON DELETE CASCADE foreign keys, which is the whole point: deleting is the
// explicit cascade the administrator confirmed after seeing how many users hold the role. Holders
// keep their other roles and simply lose the actions this one gave them.
//
// Only custom roles are deletable — a seeded role comes back as types.ErrRoleIsDefault and a role
// the tenant does not define as types.ErrRoleNotFound, both before anything is written.
func (r *RolesRepository) DeleteRole(ctx context.Context, tenantCode, roleCode string) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := lockCustomRole(tx, tenantCode, roleCode); err != nil {
			return err
		}

		if err := tx.Exec(
			`DELETE FROM role WHERE tenant_code = ? AND code = ?`,
			tenantCode, roleCode).Error; err != nil {
			return fmt.Errorf("error deleting role %q in tenant %q: %w", roleCode, tenantCode, err)
		}
		return nil
	})
}

func lockCustomRole(tx *gorm.DB, tenantCode, roleCode string) error {
	isDefault := []bool{}
	if err := tx.Raw(
		`SELECT is_default FROM role WHERE tenant_code = ? AND code = ? FOR UPDATE`,
		tenantCode, roleCode).Scan(&isDefault).Error; err != nil {
		return fmt.Errorf("error loading role %q of tenant %q: %w", roleCode, tenantCode, err)
	}
	if len(isDefault) == 0 {
		return types.ErrRoleNotFound
	}
	if isDefault[0] {
		return types.ErrRoleIsDefault
	}
	return nil
}

func roleActionMappings(tenantCode, roleCode string, actions []string) []map[string]any {
	mappings := make([]map[string]any, 0, len(actions))
	for _, action := range actions {
		mappings = append(mappings, map[string]any{
			"tenant_code": tenantCode,
			"role_code":   roleCode,
			"action_code": action,
		})
	}
	return mappings
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
// their holder and organization counts. An empty roleCode returns the whole catalog; a non-empty
// one narrows to that single role, so both reads share one definition of what a role looks like.
//
// The organization count is the number of the tenant's organizations where at least one user holds
// the role, so the join expands a '*' grant to every organization of the tenant, exactly like
// GetMemberships resolves the wildcard. A tenant-wide grant (org_code NULL) and an org_code naming
// no existing organization both join to nothing, and COUNT(DISTINCT o.code) skips those rows.
func (r *RolesRepository) tenantRoles(ctx context.Context, tenantCode, roleCode string) ([]types.RoleResult, error) {
	roles := []types.RoleResult{}
	query := `
		SELECT r.code, r.name_en AS name, r.description_en AS description, r.is_default,
		       COALESCE(g.holders, 0) AS assigned_users_count,
		       COALESCE(g.orgs, 0) AS assigned_orgs_count
		FROM role r
		LEFT JOIN (
			SELECT ur.role_code,
			       COUNT(DISTINCT ur.user_id) AS holders,
			       COUNT(DISTINCT o.code) AS orgs
			FROM user_role ur
			JOIN users u ON u.user_id = ur.user_id
			LEFT JOIN organization o ON o.tenant_code = ur.tenant_code
			     AND (ur.org_code = ? OR o.code = ur.org_code)
			WHERE ur.tenant_code = ? AND ` + personalAccount + `
			GROUP BY ur.role_code
		) g ON g.role_code = r.code
		WHERE r.tenant_code = ?`
	args := []any{types.WildcardOrg, tenantCode, tenantCode}
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
