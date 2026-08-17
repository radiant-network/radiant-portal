package types

import (
	"fmt"
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
