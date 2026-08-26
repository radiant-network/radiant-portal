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

// EmailHasTenantGrant reports whether a user with this email already holds a role in the tenant.
// Identity is keyed on user_id, so the same email can legitimately exist in the registry while
// having no access here — only a grant in this tenant counts as "already a user of this tenant".
func (r *UsersRepository) EmailHasTenantGrant(ctx context.Context, tenantCode, email string) (bool, error) {
	var exists bool
	err := r.db.WithContext(ctx).Raw(`
		SELECT EXISTS (
			SELECT 1 FROM users u
			JOIN user_role ur ON ur.user_id = u.user_id
			WHERE lower(u.email) = lower(?) AND ur.tenant_code = ?
		)`, email, tenantCode).Scan(&exists).Error
	if err != nil {
		return false, fmt.Errorf("error checking email %q in tenant %q: %w", email, tenantCode, err)
	}
	return exists, nil
}

// RoleScopes maps each of the tenant's requested roles to the scope derived from its actions. A
// role absent from the result does not exist in the tenant — the caller decides what that means,
// rather than this returning a zero scope that would read as tenant-wide.
func (r *UsersRepository) RoleScopes(ctx context.Context, tenantCode string, roleCodes []string) (map[string]string, error) {
	scopes := map[string]string{}
	if len(roleCodes) == 0 {
		return scopes, nil
	}

	var rows []struct {
		RoleCode  string
		HasTenant bool
		HasOrg    bool
	}
	err := r.db.WithContext(ctx).Raw(`
		SELECT r.code AS role_code, rs.has_tenant, rs.has_org
		FROM role r
		LEFT JOIN (
			SELECT ra.role_code,
			       bool_or(a.scope = ?) AS has_tenant,
			       bool_or(a.scope = ?) AS has_org
			FROM role_action ra
			JOIN action a ON a.code = ra.action_code
			WHERE ra.tenant_code = ?
			GROUP BY ra.role_code
		) rs ON rs.role_code = r.code
		WHERE r.tenant_code = ? AND r.code IN ?`,
		types.ActionScopeTenant, types.ActionScopeOrg, tenantCode, tenantCode, roleCodes).Scan(&rows).Error
	if err != nil {
		return nil, fmt.Errorf("error loading scopes of roles %v in tenant %q: %w", roleCodes, tenantCode, err)
	}
	for _, row := range rows {
		scopes[row.RoleCode] = roleScope(row.HasTenant, row.HasOrg)
	}
	return scopes, nil
}

// personalAccount keeps only the users an administrator manages, excluding the machine-to-machine
// accounts provisioned from a Keycloak client's service account: those carry no email and no name.
// Every human path (POST /{tenant}/users, createuser -email) requires an email, so its absence is
// what distinguishes them — the registry has no dedicated flag. It assumes the users alias `u`.
const personalAccount = "COALESCE(u.email, '') <> ''"

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
		Where(personalAccount).
		Where("EXISTS ("+grant+")", args...)
	if query.Search != "" {
		prefix := likePrefix(query.Search)
		// Folded on both sides so accents are ignored in the term as well as in the stored value:
		// "fre" and "fré" both reach Frédéric, and either reaches an unaccented Frederic.
		clauses := make([]string, 0, 3)
		args := make([]any, 0, 3)
		for _, column := range []string{"u.first_name", "u.last_name", "u.email"} {
			clauses = append(clauses, unaccented(column)+" ILIKE "+unaccented("?"))
			args = append(args, prefix)
		}
		// Parenthesized explicitly so the OR cannot absorb another filter's predicate.
		tx = tx.Where("("+strings.Join(clauses, " OR ")+")", args...)
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

// unaccented wraps a text SQL expression in an accent-folding one: NFD decomposes an accented
// letter into its base letter plus a combining mark, and the U+0300-U+036F mark range is then
// dropped, so every diacritic goes — not just the acute accent. It stands in for the unaccent
// extension, which the app role cannot install on managed Postgres (see migration 000023).
func unaccented(expr string) string {
	return `regexp_replace(normalize(` + expr + `, NFD), '[\u0300-\u036f]', '', 'g')`
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

// TenantUser returns the user's stored state within the tenant: their identity attributes and
// every grant they hold there. Holding no grant is what "not a user of this tenant" means, so
// that case is reported as types.ErrUserNotInTenant rather than as an empty grant list.
func (r *UsersRepository) TenantUser(ctx context.Context, tenantCode, userID string) (*types.TenantUser, error) {
	var grants []struct {
		RoleCode string
		OrgCode  *string
	}
	err := r.db.WithContext(ctx).Raw(`
		SELECT ur.role_code, ur.org_code
		FROM user_role ur
		WHERE ur.tenant_code = ? AND ur.user_id = ?
		ORDER BY ur.role_code, ur.org_code`, tenantCode, userID).Scan(&grants).Error
	if err != nil {
		return nil, fmt.Errorf("error loading grants of user %q in tenant %q: %w", userID, tenantCode, err)
	}
	if len(grants) == 0 {
		return nil, types.ErrUserNotInTenant
	}

	var identity struct {
		Email     string
		FirstName string
		LastName  string
	}
	if err := r.db.WithContext(ctx).Raw(`
		SELECT u.email, u.first_name, u.last_name FROM users u WHERE u.user_id = ?`, userID).
		Scan(&identity).Error; err != nil {
		return nil, fmt.Errorf("error loading user %q: %w", userID, err)
	}

	user := types.TenantUser{
		UserID:    userID,
		Email:     identity.Email,
		FirstName: identity.FirstName,
		LastName:  identity.LastName,
		Grants:    make([]types.Grant, 0, len(grants)),
	}
	for _, grant := range grants {
		org := ""
		if grant.OrgCode != nil {
			org = *grant.OrgCode
		}
		user.Grants = append(user.Grants, types.Grant{TenantCode: tenantCode, OrgCode: org, RoleCode: grant.RoleCode})
	}
	return &user, nil
}

// RolesWithAction returns the tenant's roles holding the action, which is how a caller reaches an
// action-level invariant: grants name roles, so the roles conferring the action have to be
// resolved before a user's grants can be read as holding it.
func (r *UsersRepository) RolesWithAction(ctx context.Context, tenantCode, actionCode string) ([]string, error) {
	roles := []string{}
	err := r.db.WithContext(ctx).Raw(`
		SELECT ra.role_code FROM role_action ra
		WHERE ra.tenant_code = ? AND ra.action_code = ?
		ORDER BY ra.role_code`, tenantCode, actionCode).Scan(&roles).Error
	if err != nil {
		return nil, fmt.Errorf("error loading roles holding %q in tenant %q: %w", actionCode, tenantCode, err)
	}
	return roles, nil
}

// HasOtherUserWithAnyRole reports whether someone other than userID holds one of the roles in the
// tenant.
func (r *UsersRepository) HasOtherUserWithAnyRole(ctx context.Context, tenantCode, userID string, roleCodes []string) (bool, error) {
	if len(roleCodes) == 0 {
		return false, nil
	}
	var exists bool
	err := r.db.WithContext(ctx).Raw(`
		SELECT EXISTS (
			SELECT 1 FROM user_role ur
			WHERE ur.tenant_code = ? AND ur.user_id <> ? AND ur.role_code IN ?
		)`, tenantCode, userID, roleCodes).Scan(&exists).Error
	if err != nil {
		return false, fmt.Errorf("error looking for another holder of roles %v in tenant %q: %w", roleCodes, tenantCode, err)
	}
	return exists, nil
}

// UpdateTenantUser applies an edited user in one transaction: the identity attributes, then the
// grants to revoke and the grants to add. Only the difference is written, so the grants the edit
// left alone keep the granted_at / granted_by of their original assignment.
func (r *UsersRepository) UpdateTenantUser(ctx context.Context, tenantCode, userID, firstName, lastName, grantedBy string, add, remove []types.Grant) error {
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Exec(`
			UPDATE users SET first_name = ?, last_name = ? WHERE user_id = ?`,
			firstName, lastName, userID).Error; err != nil {
			return err
		}
		if err := revokeGrants(tx, tenantCode, userID, remove); err != nil {
			return err
		}
		return addGrants(tx, tenantCode, userID, grantedBy, add)
	})
	if err != nil {
		return fmt.Errorf("error updating user %q in tenant %q: %w", userID, tenantCode, err)
	}
	return nil
}

// RemoveTenantUser deletes every grant the user holds in the tenant, member included — the
// per-tenant revoke. It touches neither the users registry nor the grants the same user holds in
// other tenants, so the identity outlives its access here. The affected row count is deliberately
// not checked: the caller establishes the membership first, and a concurrent revoke reaching zero
// rows has already produced the intended state.
func (r *UsersRepository) RemoveTenantUser(ctx context.Context, tenantCode, userID string) error {
	err := r.db.WithContext(ctx).Exec(`
		DELETE FROM user_role WHERE tenant_code = ? AND user_id = ?`, tenantCode, userID).Error
	if err != nil {
		return fmt.Errorf("error removing user %q from tenant %q: %w", userID, tenantCode, err)
	}
	return nil
}

// revokeGrants deletes the listed (role, organization) pairs. A tenant-wide grant stores a NULL
// org_code, which no equality test matches, so both sides are folded to ” — a value an
// organization code can never take.
func revokeGrants(tx *gorm.DB, tenantCode, userID string, remove []types.Grant) error {
	if len(remove) == 0 {
		return nil
	}
	keys := make([]string, 0, len(remove))
	args := []any{tenantCode, userID}
	for _, grant := range remove {
		keys = append(keys, "(?, ?)")
		args = append(args, grant.RoleCode, grant.OrgCode)
	}
	return tx.Exec(`
		DELETE FROM user_role
		WHERE tenant_code = ? AND user_id = ?
		  AND (role_code, COALESCE(org_code, '')) IN (`+strings.Join(keys, ", ")+`)`, args...).Error
}

func addGrants(tx *gorm.DB, tenantCode, userID, grantedBy string, add []types.Grant) error {
	if len(add) == 0 {
		return nil
	}
	rows := make([]string, 0, len(add))
	args := []any{}
	for _, grant := range add {
		rows = append(rows, "(?, ?, ?, ?, ?)")
		var org any
		if grant.OrgCode != "" {
			org = grant.OrgCode
		}
		args = append(args, userID, tenantCode, org, grant.RoleCode, grantedBy)
	}
	return tx.Exec(`
		INSERT INTO user_role (user_id, tenant_code, org_code, role_code, granted_by)
		VALUES `+strings.Join(rows, ", ")+`
		ON CONFLICT DO NOTHING`, args...).Error
}
