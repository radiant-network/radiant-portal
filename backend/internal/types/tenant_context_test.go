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

func Test_TenantFromContext_RoundTrips(t *testing.T) {
	t.Parallel()
	code, ok := TenantFromContext(ContextWithTenant(context.Background(), "demo"))
	assert.True(t, ok)
	assert.Equal(t, "demo", code)

	_, ok = TenantFromContext(context.Background())
	assert.False(t, ok)
}
