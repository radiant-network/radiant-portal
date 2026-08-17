package types

// Action scopes, matching the action.scope CHECK constraint in the DB.
const (
	ActionScopeOrg    = "org"
	ActionScopeTenant = "tenant"
)

// Role scopes are derived from a role's actions and never stored: a role holding any org-scoped
// action must be granted at an org, one holding only tenant-scoped actions applies tenant-wide,
// and a role mixing both does both (ADR §5.4).
const (
	RoleScopeOrg    = ActionScopeOrg
	RoleScopeTenant = ActionScopeTenant
	RoleScopeMixed  = "mixed"
)

// DefaultTenantCode is the launch tenant created by migration 000009 and used to backfill
// existing rows in 000013. Write paths now derive tenant_code from the request: API handlers
// read the active tenant via GetTenant (the /:tenant path segment) and the worker reads it
// from the batch being processed. This constant remains the seed/default tenant (and the
// value test fixtures attach their rows to).
const DefaultTenantCode = "radiant"

// TenantDatabase is the StarRocks database holding a tenant's views, derived from the
// tenant code (e.g. "radiant" → "radiant_tenant").
func TenantDatabase(tenantCode string) string {
	return tenantCode + "_tenant"
}

// Action codes from the seeded auth catalog (migration 000009).
const (
	ActionSearchCase       = "can_search_case"
	ActionViewKb           = "can_view_kb"
	ActionReadPII          = "can_read_pii"
	ActionInterpretVariant = "can_interpret_variant"
	ActionCommentVariant   = "can_comment_variant"
	ActionFlagVariant      = "can_flag_variant"
	ActionDownloadFile     = "can_download_file"
	ActionIngestData       = "can_ingest_data"
)

// Admin management action codes (tenant-scoped), seeded by migration 000018.
const (
	ActionManageUser = "can_manage_user"
	ActionManageOrg  = "can_manage_org"
	ActionManageRole = "can_manage_role"
)

// ActionResponse carries the action catalog entry. name/description are the English labels for
// now; resolving them by the caller's locale is a separate cross-cutting task.
// @Description Action from the authorization catalog.
type ActionResponse struct {
	Code        string `json:"code"`
	Scope       string `json:"scope"`
	Name        string `json:"name"`
	Description string `json:"description"`
} // @name ActionResponse

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
