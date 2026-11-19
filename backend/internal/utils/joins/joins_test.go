package joins

import (
	"context"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
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

func Test_Starrocks_CaseAssignees_ReadsTenantViewsWithNotAssignedRow(t *testing.T) {
	ctx := types.ContextWithTenant(context.Background(), "tenant1")
	tx := &gorm.DB{Statement: &gorm.Statement{Context: ctx}}
	got := Starrocks().CaseAssignees(tx)
	want := "SELECT ac.id AS case_id, COALESCE(assignment.user_id, 'not-assign') AS assignee_id FROM tenant1_tenant.cases ac LEFT JOIN tenant1_tenant.case_assignment assignment ON assignment.case_id = ac.id"
	if got != want {
		t.Errorf("Starrocks().CaseAssignees(tenant1) = %q; want %q", got, want)
	}
}

func Test_Starrocks_CaseAssignees_Unbound_UsesFederation(t *testing.T) {
	got := Starrocks().CaseAssignees(&gorm.DB{Statement: &gorm.Statement{Context: context.Background()}})
	want := "SELECT ac.id AS case_id, COALESCE(assignment.user_id, 'not-assign') AS assignee_id FROM radiant_jdbc.public.cases ac LEFT JOIN radiant_jdbc.public.case_assignment assignment ON assignment.case_id = ac.id"
	if got != want {
		t.Errorf("Starrocks().CaseAssignees(unbound) = %q; want %q", got, want)
	}
}
