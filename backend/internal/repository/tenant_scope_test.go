package repository

import (
	"context"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// builtSQL renders the SQL a tenant-scoped query produces under WithTenant, without executing it
// (DryRun), so the scope's effect can be asserted on the statement.
func builtSQL(ctx context.Context, db *gorm.DB) (string, []any) {
	var rows []map[string]any
	tx := db.Session(&gorm.Session{DryRun: true}).
		WithContext(ctx).
		Table("interpretation_germline").
		Scopes(WithTenant(ctx)).
		Where("locus_id = ?", 1).
		Find(&rows)
	return tx.Statement.SQL.String(), tx.Statement.Vars
}

func Test_WithTenant_AddsTenantPredicate_WhenTenantBound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		ctx := types.ContextWithTenant(context.Background(), "demo")
		sql, vars := builtSQL(ctx, env.Postgres)
		assert.Contains(t, sql, "tenant_code", "a bound tenant must add a tenant_code predicate")
		assert.Contains(t, vars, "demo", "the bound tenant code must be the predicate value")
	})
}

func Test_WithTenant_NoPredicate_WhenNoTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		sql, _ := builtSQL(context.Background(), env.Postgres)
		assert.NotContains(t, sql, "tenant_code", "no tenant in context (e.g. the worker) must not add a tenant filter")
	})
}

func Test_WithTenant_NoPredicate_WhenEmptyTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		ctx := types.ContextWithTenant(context.Background(), "")
		sql, _ := builtSQL(ctx, env.Postgres)
		assert.NotContains(t, sql, "tenant_code", "an empty tenant code must not produce a degenerate filter")
	})
}
