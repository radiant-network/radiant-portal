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
//
// Sub short-circuits the Keycloak step: set it for a user that already exists in
// the identity provider (has logged in at least once) to provision Postgres,
// Ranger and StarRocks only. In that mode Username and Password are unused, and
// the name/email attributes are optional — an empty one leaves whatever Postgres
// already holds untouched rather than blanking it.
type UserInput struct {
	Sub       string
	Username  string
	Email     string
	FirstName string
	LastName  string
	Password  string
	Grants    []Grant
}
