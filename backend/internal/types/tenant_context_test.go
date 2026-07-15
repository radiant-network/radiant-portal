package types

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_TenantSchema_NoTenant_ReturnsFederationSchema(t *testing.T) {
	t.Parallel()
	assert.Equal(t, FederationSchema, TenantSchema(context.Background()))
}

func Test_TenantSchema_WithTenant_ReturnsTenantDatabase(t *testing.T) {
	t.Parallel()
	ctx := ContextWithTenant(context.Background(), "demo")
	assert.Equal(t, "demo_tenant", TenantSchema(ctx))
}

func Test_TenantSchema_EmptyTenant_ReturnsFederationSchema(t *testing.T) {
	t.Parallel()
	// An empty code must not produce the degenerate "_tenant" database.
	ctx := ContextWithTenant(context.Background(), "")
	assert.Equal(t, FederationSchema, TenantSchema(ctx))
}

func Test_TenantDatabaseOrEmpty_WithTenant_ReturnsTenantDatabase(t *testing.T) {
	t.Parallel()
	ctx := ContextWithTenant(context.Background(), "tenant1")
	assert.Equal(t, "tenant1_tenant", TenantDatabaseOrEmpty(ctx))
}

func Test_TenantDatabaseOrEmpty_NoTenant_ReturnsEmpty(t *testing.T) {
	t.Parallel()
	assert.Equal(t, "", TenantDatabaseOrEmpty(context.Background()))
	assert.Equal(t, "", TenantDatabaseOrEmpty(ContextWithTenant(context.Background(), "")))
}

func Test_SharedDatabaseOrEmpty_WithTenant_ReturnsSharedDatabase(t *testing.T) {
	t.Parallel()
	ctx := ContextWithTenant(context.Background(), "tenant1")
	assert.Equal(t, SharedDatabase, SharedDatabaseOrEmpty(ctx))
}

func Test_SharedDatabaseOrEmpty_NoTenant_ReturnsEmpty(t *testing.T) {
	t.Parallel()
	assert.Equal(t, "", SharedDatabaseOrEmpty(context.Background()))
	assert.Equal(t, "", SharedDatabaseOrEmpty(ContextWithTenant(context.Background(), "")))
}

func Test_SharedDatabaseFromEnv_DefaultsToRadiant(t *testing.T) {
	t.Setenv(SharedDatabaseEnv, "")
	assert.Equal(t, "radiant", sharedDatabaseFromEnv())
}

func Test_SharedDatabaseFromEnv_ReadsOverride(t *testing.T) {
	t.Setenv(SharedDatabaseEnv, "base_kb")
	assert.Equal(t, "base_kb", sharedDatabaseFromEnv())
}

func Test_TenantFromContext_RoundTrips(t *testing.T) {
	t.Parallel()
	code, ok := TenantFromContext(ContextWithTenant(context.Background(), "demo"))
	assert.True(t, ok)
	assert.Equal(t, "demo", code)

	_, ok = TenantFromContext(context.Background())
	assert.False(t, ok)
}
