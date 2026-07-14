package types

import (
	"context"
	"os"
)

// SharedDatabaseEnv overrides the shared base database name defaults to "radiant".
const SharedDatabaseEnv = "SHARED_DATABASE"

// FederationSchema is the radiant_jdbc catalog schema the API reads when no tenant is bound
// to the request context. It is the prefix every FederationName carries
// ("radiant_jdbc.public.<table>"); until the tenant-views read path is enabled, reads keep
// targeting it, so behavior is unchanged.
const FederationSchema = "radiant_jdbc.public"

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

// TenantDatabaseOrEmpty returns tenant prefix if in context, otherwise returns empty.
// This is useful for keeping legacy single-database deployment.
func TenantDatabaseOrEmpty(ctx context.Context) string {
	if code, ok := TenantFromContext(ctx); ok && code != "" {
		return TenantDatabase(code)
	}
	return ""
}

// SharedDatabaseOrEmpty returns shared database prefix if in context, otherwise returns empty.
// This is useful for keeping legacy single-database deployment.
func SharedDatabaseOrEmpty(ctx context.Context) string {
	if code, ok := TenantFromContext(ctx); ok && code != "" {
		return SharedDatabase
	}
	return ""
}
