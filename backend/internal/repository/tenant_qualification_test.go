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
