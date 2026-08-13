package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type UsersRepository struct {
	db *gorm.DB
}

func NewUsersRepository(db database.PostgresDB) *UsersRepository {
	return &UsersRepository{db: db.DB}
}

type userGrant struct {
	UserID    string
	RoleCode  string
	RoleName  string
	OrgCode   *string
	HasTenant bool
	HasOrg    bool
}

// ListTenantUsers returns the users holding at least one role in the tenant, each with the roles
// granted to them there, plus the total matching the search before pagination. It reads the auth
// tables in Postgres directly, like the other authorization queries.
func (r *UsersRepository) ListTenantUsers(ctx context.Context, tenantCode string, query types.ListUsersQuery) ([]types.UserResult, int64, error) {
	var count int64
	if err := r.tenantUsers(ctx, tenantCode, query).Count(&count).Error; err != nil {
		return nil, 0, fmt.Errorf("error counting users of tenant %q: %w", tenantCode, err)
	}

	// Roles are loaded by tenantGrants below, which is why UserResult tags them gorm:"-": left
	// parsable, GORM reads the slice as an association and errors out on every scan.
	users := []types.UserResult{}
	tx := r.tenantUsers(ctx, tenantCode, query).
		Select("u.user_id, u.email, u.first_name, u.last_name").
		// user_id breaks ties so a page stays stable across limit/offset calls.
		Order("u.last_name, u.first_name, u.user_id")
	utils.AddPagination(tx, query.Pagination)
	if err := tx.Scan(&users).Error; err != nil {
		return nil, 0, fmt.Errorf("error listing users of tenant %q: %w", tenantCode, err)
	}
	if len(users) == 0 {
		return users, count, nil
	}

	userIDs := make([]string, len(users))
	indexByUser := make(map[string]int, len(users))
	for i, user := range users {
		userIDs[i] = user.UserID
		indexByUser[user.UserID] = i
		users[i].Roles = []types.UserRoleResult{}
	}

	grants, err := r.tenantGrants(ctx, tenantCode, userIDs)
	if err != nil {
		return nil, 0, err
	}
	for _, grant := range grants {
		applyUserGrant(&users[indexByUser[grant.UserID]], grant)
	}
	return users, count, nil
}

// tenantUsers selects the users holding at least one grant in the tenant. A role filter narrows
// that same grant — a user is kept when one of their grants matches, and their other roles are
// unaffected — so combining it with search reads as search AND (any of the roles).
func (r *UsersRepository) tenantUsers(ctx context.Context, tenantCode string, query types.ListUsersQuery) *gorm.DB {
	grant := "SELECT 1 FROM user_role ur WHERE ur.user_id = u.user_id AND ur.tenant_code = ?"
	args := []any{tenantCode}
	if len(query.Roles) > 0 {
		grant += " AND ur.role_code IN ?"
		args = append(args, query.Roles)
	}

	tx := r.db.WithContext(ctx).
		Table("users u").
		Where("EXISTS ("+grant+")", args...)
	if query.Search != "" {
		prefix := likePrefix(query.Search)
		// Parenthesized explicitly so the OR cannot absorb another filter's predicate.
		tx = tx.Where("(u.first_name ILIKE ? OR u.last_name ILIKE ? OR u.email ILIKE ?)", prefix, prefix, prefix)
	}
	return tx
}

// likeEscaper neutralizes the ILIKE wildcards so the term matches literally — an email or a name
// can contain an underscore, which would otherwise match any character.
var likeEscaper = strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`)

// likePrefix builds a case-insensitive StartsWith pattern for ILIKE.
func likePrefix(search string) string {
	return likeEscaper.Replace(search) + "%"
}

// tenantGrants returns the users' grants in the tenant, each carrying the scopes its role's actions
// cover so the caller can derive the role scope. The ORDER BY is load-bearing: grants of the same
// (user, role) arrive contiguously, so grouping them is a single pass.
func (r *UsersRepository) tenantGrants(ctx context.Context, tenantCode string, userIDs []string) ([]userGrant, error) {
	var grants []userGrant
	err := r.db.WithContext(ctx).Raw(`
		SELECT ur.user_id, ur.role_code, r.name_en AS role_name, ur.org_code,
		       rs.has_tenant, rs.has_org
		FROM user_role ur
		JOIN role r ON r.tenant_code = ur.tenant_code AND r.code = ur.role_code
		LEFT JOIN (
			SELECT ra.role_code,
			       bool_or(a.scope = ?) AS has_tenant,
			       bool_or(a.scope = ?) AS has_org
			FROM role_action ra
			JOIN action a ON a.code = ra.action_code
			WHERE ra.tenant_code = ?
			GROUP BY ra.role_code
		) rs ON rs.role_code = ur.role_code
		WHERE ur.tenant_code = ? AND ur.user_id IN ?
		ORDER BY ur.user_id, ur.role_code, ur.org_code`,
		types.ActionScopeTenant, types.ActionScopeOrg, tenantCode, tenantCode, userIDs).Scan(&grants).Error
	if err != nil {
		return nil, fmt.Errorf("error loading role grants of tenant %q: %w", tenantCode, err)
	}
	return grants, nil
}

// applyUserGrant records one grant on the user, merging the several org-scoped rows of the same
// role into a single entry. A NULL org_code is a tenant-wide grant and contributes no org; '*' is
// kept verbatim so an "all organizations" grant survives a round-trip through the admin UI.
func applyUserGrant(user *types.UserResult, grant userGrant) {
	role := findUserRole(user, grant.RoleCode)
	if role == nil {
		user.Roles = append(user.Roles, types.UserRoleResult{
			RoleCode: grant.RoleCode,
			Name:     grant.RoleName,
			Scope:    roleScope(grant.HasTenant, grant.HasOrg),
			OrgCodes: []string{},
		})
		role = &user.Roles[len(user.Roles)-1]
	}
	if grant.OrgCode != nil {
		role.OrgCodes = appendUnique(role.OrgCodes, *grant.OrgCode)
	}
}

func findUserRole(user *types.UserResult, roleCode string) *types.UserRoleResult {
	for i := range user.Roles {
		if user.Roles[i].RoleCode == roleCode {
			return &user.Roles[i]
		}
	}
	return nil
}

// roleScope derives the role's scope from the scopes of its actions. A role holding no action binds
// to nothing, so it is reported as tenant-scoped rather than demanding an organization.
func roleScope(hasTenant, hasOrg bool) string {
	switch {
	case hasTenant && hasOrg:
		return types.RoleScopeMixed
	case hasOrg:
		return types.RoleScopeOrg
	default:
		return types.RoleScopeTenant
	}
}
