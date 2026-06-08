package types

// Grant is one role assignment for a user within a tenant. OrgCode follows the
// user_role semantics: "" = not org-scoped (tenant-wide), "*" = every org in the
// tenant, a specific code = that org only.
type Grant struct {
	TenantCode string
	OrgCode    string
	RoleCode   string
}

// UserInput is everything needed to provision one regular user end-to-end across
// Keycloak, Postgres, Ranger, and StarRocks.
type UserInput struct {
	Username  string
	Email     string
	FirstName string
	LastName  string
	Password  string
	Grants    []Grant
}
