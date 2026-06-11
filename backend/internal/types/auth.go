package types

// Action scopes, matching the action.scope CHECK constraint in the DB.
const (
	ActionScopeOrg    = "org"
	ActionScopeTenant = "tenant"
)

// DefaultTenantCode is the launch tenant every record is attached to until per-tenant
// request routing lands. Both the batch worker and the API write paths set tenant_code
// to this explicitly (migrations 000009 and 000013 add the column NOT NULL with no DB
// default, so writes must supply it).
// TODO(multi-tenant): once writes can read the active tenant from the request context,
// derive tenant_code from there instead of hardcoding this constant.
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
