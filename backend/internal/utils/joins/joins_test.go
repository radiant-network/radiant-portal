package joins

import (
	"context"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
)

func Test_Starrocks_Resolve_Unbound_UsesFederationName(t *testing.T) {
	got := Starrocks().resolve(types.CaseTable, context.Background())
	if want := "radiant_jdbc.public.cases"; got != want {
		t.Errorf("Starrocks().resolve(CaseTable, bg) = %q; want %q", got, want)
	}
}

func Test_Starrocks_Resolve_TenantBound_UsesTenantDatabase(t *testing.T) {
	ctx := types.ContextWithTenant(context.Background(), "tenant1")
	got := Starrocks().resolve(types.CaseTable, ctx)
	if want := "tenant1_tenant.cases"; got != want {
		t.Errorf("Starrocks().resolve(CaseTable, tenant1) = %q; want %q", got, want)
	}
}

func Test_Postgres_Resolve_UsesBareName(t *testing.T) {
	ctx := types.ContextWithTenant(context.Background(), "tenant1")
	if got := Postgres().resolve(types.CaseTable, ctx); got != "cases" {
		t.Errorf("Postgres().resolve(CaseTable, tenant1) = %q; want %q", got, "cases")
	}
}
