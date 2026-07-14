package repository

import (
	"fmt"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// buildSNVSQL compiles (without executing) the SQL a germline SNV occurrences query generates for
// the given request context, so table qualification can be asserted directly.
func buildSNVSQL(db *gorm.DB) string {
	tx := AddImplicitSNVOccurrencesFilters(types.GermlineSNVOccurrenceTable, 1, 5, db, 0)
	tx = JoinSNVOccurrencesWithVariants(types.GermlineSNVOccurrenceTable, tx)
	var dest []map[string]any
	return tx.Find(&dest).Statement.SQL.String()
}

// Test_SingleRowLookup_BoundTenant_NoBrokenImplicitOrderBy guards a bound-tenant regression the
// unbound integration tests can't see: GORM First() appends ORDER BY <pk>, and on a db-qualified
// table (radiant.snv__variant v) it mis-quotes the qualifier to `.`hgvsg`, which StarRocks rejects
// as a syntax error. The variant header/overview/frequency lookups (and terms/documents by-id) use
// Take() instead — no implicit ORDER BY. This mirrors GetVariantHeader's builder; if it (or a
// sibling) reverts to First(), the broken `.` qualifier reappears here.
func Test_SingleRowLookup_BoundTenant_NoBrokenImplicitOrderBy(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		ctx := types.ContextWithTenant(env.Ctx, "cbtn")
		db := env.Starrocks.Session(&gorm.Session{DryRun: true}).WithContext(ctx)
		tx := db.Table(fmt.Sprintf("%s %s", types.VariantTable.TenantQualifiedName(ctx), types.VariantTable.Alias)).
			Where("v.locus_id = ?", -1).
			Select("v.hgvsg")
		var vh types.VariantHeader
		sql := tx.Take(&vh).Statement.SQL.String()

		assert.Contains(t, sql, "radiant.snv__variant")
		assert.NotContains(t, sql, "`.`") // the empty table qualifier First()'s ORDER BY produces
	})
}

// Test_SNVOccurrences_TenantIsolation is the SJRA-1460 acceptance check: a query built for tenant
// "cbtn" addresses cbtn_tenant.* for the per-tenant occurrence table and radiant.* for shared
// reference tables, and never references another tenant's database.
func Test_SNVOccurrences_TenantIsolation(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		db := env.Starrocks.Session(&gorm.Session{DryRun: true}).
			WithContext(types.ContextWithTenant(env.Ctx, "cbtn"))

		sql := buildSNVSQL(db)

		assert.Contains(t, sql, "cbtn_tenant.germline__snv__occurrence")
		assert.Contains(t, sql, "radiant.snv__variant")
		assert.NotContains(t, sql, "udn_tenant")
	})
}

// Test_SNVOccurrences_NoTenant_KeepsBareNames guarantees the flag-off / single-DB path is byte
// unchanged: with no tenant bound, tables stay bare (no database prefix).
func Test_SNVOccurrences_NoTenant_KeepsBareNames(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		db := env.Starrocks.Session(&gorm.Session{DryRun: true}).WithContext(env.Ctx)

		sql := buildSNVSQL(db)

		assert.NotContains(t, sql, "_tenant.")
		assert.NotContains(t, sql, "radiant.")
		assert.Contains(t, sql, "germline__snv__occurrence")
		assert.Contains(t, sql, "snv__variant")
	})
}
