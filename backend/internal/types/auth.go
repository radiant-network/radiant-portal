package types

// TenantMembership is the caller's effective authorization within a single tenant.
// TenantActions holds tenant-scoped actions; OrgActions maps each org-scoped action
// to the org codes where it applies ('*' resolved to all the tenant's orgs).
// @Description Caller's effective authorization within a single tenant
type TenantMembership struct {
	Code          string              `json:"code"`
	Name          string              `json:"name"`
	TenantActions []string            `json:"tenant_actions"`
	OrgActions    map[string][]string `json:"org_actions"`
} // @name TenantMembership
