package types

// Action scopes, matching the action.scope CHECK constraint in the DB.
const (
	ActionScopeOrg    = "org"
	ActionScopeTenant = "tenant"
)

// TenantMembership is the caller's effective authorization within a single tenant.
// TenantActions holds tenant-scoped actions; OrgsByAction maps each org-scoped action
// to the org codes where it applies ('*' resolved to all the tenant's orgs).
// @Description Caller's effective authorization within a single tenant
type TenantMembership struct {
	Code          string              `json:"code"`
	Name          string              `json:"name"`
	TenantActions []string            `json:"tenant_actions"`
	OrgsByAction  map[string][]string `json:"orgs_by_action"`
} // @name TenantMembership
