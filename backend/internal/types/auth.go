package types

// Action scopes, matching the action.scope CHECK constraint in the DB.
const (
	ActionScopeOrg    = "org"
	ActionScopeTenant = "tenant"
)

// DefaultTenantCode is the launch tenant created by migration 000009 and used to backfill
// existing rows in 000013. Write paths now derive tenant_code from the request: API handlers
// read the active tenant via GetTenant (the /:tenant path segment) and the worker reads it
// from the batch being processed. This constant remains the seed/default tenant (and the
// value test fixtures attach their rows to).
const DefaultTenantCode = "radiant"

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
