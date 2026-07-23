package repository

import (
	"fmt"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func buildSNVSQL(db *gorm.DB) string {
	tx := AddImplicitSNVOccurrencesFilters(types.GermlineSNVOccurrenceTable, 1, 5, db, 0)
	tx = JoinSNVOccurrencesWithVariants(types.GermlineSNVOccurrenceTable, tx)
	var dest []map[string]any
	return tx.Find(&dest).Statement.SQL.String()
}

func Test_SingleRowLookup_BoundTenant_NoBrokenImplicitOrderBy(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		ctx := types.ContextWithTenant(env.Ctx, "tenant1")
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

func Test_SNVOccurrences_TenantIsolation(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		db := env.Starrocks.Session(&gorm.Session{DryRun: true}).
			WithContext(types.ContextWithTenant(env.Ctx, "tenant1"))

		sql := buildSNVSQL(db)

		assert.Contains(t, sql, "tenant1_tenant.germline__snv__occurrence")
		assert.Contains(t, sql, "radiant.snv__variant")
		assert.NotContains(t, sql, "tenant2_tenant")
	})
}

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

func runGermlineSNVJoin(t *testing.T, db *gorm.DB, seqID int) []map[string]any {
	t.Helper()
	tx := AddImplicitSNVOccurrencesFilters(types.GermlineSNVOccurrenceTable, seqID, 5, db, 1)
	tx = JoinSNVOccurrencesWithVariants(types.GermlineSNVOccurrenceTable, tx)
	var dest []map[string]any
	if err := tx.Select("g_snv_o.seq_id, g_snv_o.locus_id, v.hgvsg").Find(&dest).Error; err != nil {
		t.Fatalf("query germline SNV occurrences (seq_id=%d): %v", seqID, err)
	}
	return dest
}

func Test_SNVOccurrences_TenantIsolation_Executes(t *testing.T) {
	testutils.RunTest(t, testutils.Need{
		Starrocks:        "simple",
		Tenants:          []string{"tenant1", "tenant2"},
		TenantKeyColumns: []string{"seq_id"}, // offset only seq_id; the query still filters task_id=5
	},
		func(t *testing.T, env *testutils.Env) {
			t1 := env.Starrocks.Session(&gorm.Session{}).WithContext(env.TenantCtx("tenant1"))
			t2 := env.Starrocks.Session(&gorm.Session{}).WithContext(env.TenantCtx("tenant2"))

			// tenant1's seq_id=1 rows live only in tenant1_tenant.
			assert.NotEmpty(t, runGermlineSNVJoin(t, t1, 1),
				"tenant1 must see its own seq_id=1 rows")
			assert.Empty(t, runGermlineSNVJoin(t, t2, 1),
				"tenant2 must NOT see tenant1's seq_id=1 rows")

			// tenant2's rows are offset and live only in tenant2_tenant.
			offsetSeqID := 1 + testutils.TenantKeyOffset
			assert.NotEmpty(t, runGermlineSNVJoin(t, t2, offsetSeqID),
				"tenant2 must see its own offset rows")
			assert.Empty(t, runGermlineSNVJoin(t, t1, offsetSeqID),
				"tenant1 must NOT see tenant2's offset rows")
		})
}
