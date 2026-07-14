package types

import (
	"context"
	"os"
)

// SharedDatabaseEnv overrides the shared base database name; unset defaults to "radiant".
const SharedDatabaseEnv = "SHARED_DATABASE"

// FederationSchema is the radiant_jdbc catalog schema the API reads when no tenant is bound
// to the request context. It is the prefix every FederationName carries
// ("radiant_jdbc.public.<table>"); until the tenant-views read path is enabled, reads keep
// targeting it, so behavior is unchanged.
const FederationSchema = "radiant_jdbc.public"

// SharedDatabase is the StarRocks base database holding cross-tenant reference/annotation tables
// (snv__variant, snv__consequence, gene panels, population frequencies, ensembl/cytoband, hpo/mondo
// terms, sequencing staging). It is distinct from any tenant's view database (<code>_tenant): the
// per-tenant occurrence tables live in <code>_tenant, everything they join against lives here.
//
// It resolves from the SHARED_DATABASE environment variable (default "radiant") once at package
// load, so a deployment can rename the base database without code changes. It lives here rather than
// behind utils.GetEnvOrDefault because utils imports types (that dependency cannot be reversed).
var SharedDatabase = sharedDatabaseFromEnv()

func sharedDatabaseFromEnv() string {
	if v := os.Getenv(SharedDatabaseEnv); v != "" {
		return v
	}
	return "radiant"
}

type tenantContextKey struct{}

// ContextWithTenant binds a tenant code to ctx so the read path resolves that tenant's view
// database (see TenantSchema). RequireTenantAccess sets it (gated) on the request context.
func ContextWithTenant(ctx context.Context, tenantCode string) context.Context {
	return context.WithValue(ctx, tenantContextKey{}, tenantCode)
}

// TenantFromContext returns the tenant code bound to ctx, if any.
func TenantFromContext(ctx context.Context) (string, bool) {
	code, ok := ctx.Value(tenantContextKey{}).(string)
	return code, ok
}

// TenantSchema returns the StarRocks schema the API should read federated tables from for the
// active request: the tenant's view database (<code>_tenant) when a tenant is bound to ctx,
// else the radiant_jdbc federation (unchanged pre-rollout behavior).
func TenantSchema(ctx context.Context) string {
	if code, ok := TenantFromContext(ctx); ok && code != "" {
		return TenantDatabase(code)
	}
	return FederationSchema
}

// TenantDatabaseOrEmpty returns the tenant view database (<code>_tenant) when a tenant is bound to
// ctx, else "". Unlike TenantSchema it does NOT fall back to radiant_jdbc: native StarRocks tables
// have no federation entry, so with no tenant bound they are addressed by their bare name in the
// shared pool's default database (single-DB legacy behavior).
func TenantDatabaseOrEmpty(ctx context.Context) string {
	if code, ok := TenantFromContext(ctx); ok && code != "" {
		return TenantDatabase(code)
	}
	return ""
}

// SharedDatabaseOrEmpty returns the shared base database (SharedDatabase) when a tenant is bound to
// ctx, else "". Cross-tenant reference/annotation tables move to the shared base database only once
// the tenant read path is active; with no tenant bound they keep their bare name so the generated
// SQL is unchanged (single-DB legacy behavior).
func SharedDatabaseOrEmpty(ctx context.Context) string {
	if code, ok := TenantFromContext(ctx); ok && code != "" {
		return SharedDatabase
	}
	return ""
}
