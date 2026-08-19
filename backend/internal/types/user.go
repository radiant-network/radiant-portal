package types

import (
	"errors"
	"fmt"
	"net/mail"
	"strings"
)

// ListUsersParams is the query string of the tenant users list. Roles is comma-separated
// (?roles=member,geneticist) and keeps a user holding any one of them, so a request combining
// both filters reads as search AND (member OR geneticist).
type ListUsersParams struct {
	Search    string `form:"search"`
	Roles     string `form:"roles"`
	Limit     int    `form:"limit"`
	Offset    int    `form:"offset"`
	PageIndex int    `form:"page_index"`
}

func (p ListUsersParams) Validate() error {
	// A negative limit would cancel the LIMIT clause in GORM and return the whole tenant.
	if p.Limit < 0 || p.Offset < 0 || p.PageIndex < 0 {
		return fmt.Errorf("limit, offset and page_index must not be negative")
	}
	return nil
}

func (p ListUsersParams) ToQuery() ListUsersQuery {
	return ListUsersQuery{
		Search:     p.Search,
		Roles:      splitCodes(p.Roles),
		Pagination: ResolvePagination(p.Limit, p.Offset, p.PageIndex),
	}
}

// splitCodes parses a comma-separated query value, dropping blanks so a bare ?roles= reads as no
// filter. It mirrors utils.SplitRemoveEmptyString, which types cannot import (utils depends on
// types), and additionally trims each code.
func splitCodes(value string) []string {
	codes := []string{}
	for _, code := range strings.Split(value, ",") {
		if trimmed := strings.TrimSpace(code); trimmed != "" {
			codes = append(codes, trimmed)
		}
	}
	return codes
}

// ListUsersQuery is the resolved tenant users list request handed to the repository.
type ListUsersQuery struct {
	Search     string
	Roles      []string
	Pagination *Pagination
}

// UserResult - Tenant users list result
// @Description Line representing a user in the tenant users list, with the roles granted to them
// @Description in that tenant
// @Name UserResult
type UserResult struct {
	UserID    string           `json:"user_id" validate:"required"`
	Email     string           `json:"email,omitempty"`
	FirstName string           `json:"first_name,omitempty"`
	LastName  string           `json:"last_name,omitempty"`
	Roles     []UserRoleResult `gorm:"-" json:"roles" validate:"required"`
}

// Errors returned by the user administration paths so a handler can map them to a status code
// without depending on the DB driver or on the provisioning internals.
// The wording of each is chosen so the caller can prefix or suffix the offending code and read as
// one sentence, e.g. fmt.Errorf("role %q %w", code, ErrRoleRequiresOrg).
var (
	ErrUserAlreadyInTenant  = errors.New("a user with this email already has access to this tenant")
	ErrUserNotInTenant      = errors.New("this user has no access to this tenant")
	ErrLastTenantAdmin      = errors.New("this is the last user who can manage the users of this tenant")
	ErrUnknownRole          = errors.New("unknown role")
	ErrUnknownOrganizations = errors.New("unknown organizations")
	ErrRoleRequiresOrg      = errors.New("must be granted at one or more organizations")
	ErrRoleNotOrgScoped     = errors.New("applies to the whole tenant and cannot be granted at an organization")
)

// CreateUserRequest is the Add-user payload. The member role is granted tenant-wide by the
// server and is never listed here; email is the Keycloak username, so it is also the identity
// the identity provider links the account by on first sign-in.
// @Description Payload to add a user to a tenant, with the roles to grant them.
type CreateUserRequest struct {
	Email     string           `json:"email" binding:"required"`
	FirstName string           `json:"first_name" binding:"required"`
	LastName  string           `json:"last_name" binding:"required"`
	Roles     []CreateUserRole `json:"roles"`
} // @name CreateUserRequest

// CreateUserRole is one role to grant. OrgCodes follows the user_role semantics: empty for a
// role whose actions are all tenant-scoped, otherwise the organizations the role applies at
// ('*' meaning every organization in the tenant). Whether it must be empty or non-empty is
// derived from the role's actions server-side, never chosen by the caller.
// @Description Role to grant to a user, with the organizations it applies at.
type CreateUserRole struct {
	RoleCode string   `json:"role_code" binding:"required"`
	OrgCodes []string `json:"org_codes"`
} // @name CreateUserRole

// UpdateUserRequest is the Edit-user payload. It carries the full desired state of the user in
// the tenant: the identity attributes an administrator may change, and the complete set of roles
// they should end up with. Email is absent because it is the Keycloak login identity and stays
// read-only; the user is addressed by user_id in the path.
//
// Roles replaces the user's grants rather than adding to them, so omitting a role removes it —
// except member, which the server keeps tenant-wide whether or not it is listed.
// @Description Payload to update a user's identity and role set within a tenant.
type UpdateUserRequest struct {
	FirstName string           `json:"first_name" binding:"required"`
	LastName  string           `json:"last_name" binding:"required"`
	Roles     []CreateUserRole `json:"roles"`
} // @name UpdateUserRequest

func (r UpdateUserRequest) Validate() error {
	if strings.TrimSpace(r.FirstName) == "" || strings.TrimSpace(r.LastName) == "" {
		return fmt.Errorf("first_name and last_name must not be blank")
	}
	return validateRoles(r.Roles)
}

// TenantUser is a user's stored state within one tenant: their identity attributes and every role
// grant they hold there, at the (role, organization) grain the edit diff works on.
type TenantUser struct {
	UserID    string
	Email     string
	FirstName string
	LastName  string
	Grants    []Grant
}

func (r CreateUserRequest) Validate() error {
	// The email is sent to Keycloak as the username verbatim, so only the bare address form is
	// accepted — ParseAddress would otherwise also let through `Grace Chen <grace@chop.edu>`.
	parsed, err := mail.ParseAddress(r.Email)
	if err != nil || parsed.Address != r.Email {
		return fmt.Errorf("email %q is not a valid address", r.Email)
	}
	if strings.TrimSpace(r.FirstName) == "" || strings.TrimSpace(r.LastName) == "" {
		return fmt.Errorf("first_name and last_name must not be blank")
	}
	return validateRoles(r.Roles)
}

// validateRoles checks what the shape of the payload can tell on its own — a role listed twice
// would make the requested set ambiguous, and a blank code cannot name anything. Whether the
// roles exist and whether their scope allows the organizations is settled server-side, against
// the tenant's role catalog.
func validateRoles(roles []CreateUserRole) error {
	seen := map[string]bool{}
	for _, role := range roles {
		if strings.TrimSpace(role.RoleCode) == "" {
			return fmt.Errorf("role_code must not be blank")
		}
		if seen[role.RoleCode] {
			return fmt.Errorf("role %q is listed more than once", role.RoleCode)
		}
		seen[role.RoleCode] = true
		for _, org := range role.OrgCodes {
			if strings.TrimSpace(org) == "" {
				return fmt.Errorf("role %q has a blank org_code", role.RoleCode)
			}
		}
	}
	return nil
}

// UserRoleResult is one role granted to a user in a tenant. OrgCodes carries the grant's
// organizations verbatim: empty for a tenant-wide grant, and the '*' wildcard left as-is rather
// than expanded to every org, so the admin UI can round-trip an "all organizations" grant
// (/auth/me expands it instead, because it reports effective access).
// @Description Role granted to a user in a tenant, with the organizations it applies at
// @Name UserRoleResult
type UserRoleResult struct {
	RoleCode string   `json:"role_code" validate:"required"`
	Name     string   `json:"name" validate:"required"`
	Scope    string   `json:"scope" validate:"required" enums:"tenant,org,mixed"`
	OrgCodes []string `json:"org_codes" validate:"required"`
}
