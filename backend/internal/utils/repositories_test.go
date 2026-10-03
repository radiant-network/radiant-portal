package utils

import (
	"context"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
	"gorm.io/gorm/utils/tests"
)

func Test_CtxOf_ReturnsStatementContext(t *testing.T) {
	t.Parallel()
	ctx := types.ContextWithTenant(context.Background(), "tenant1")
	tx := &gorm.DB{Statement: &gorm.Statement{Context: ctx}}
	code, ok := types.TenantFromContext(CtxOf(tx))
	assert.True(t, ok)
	assert.Equal(t, "tenant1", code)
}

func Test_CtxOf_NilOrEmpty_ReturnsBackground(t *testing.T) {
	t.Parallel()
	_, ok := types.TenantFromContext(CtxOf(nil))
	assert.False(t, ok)

	_, ok = types.TenantFromContext(CtxOf(&gorm.DB{}))
	assert.False(t, ok)
}

func sortedQuery(t *testing.T, field string, order string) string {
	t.Helper()
	db, err := gorm.Open(tests.DummyDialector{}, &gorm.Config{DryRun: true})
	require.NoError(t, err)

	config := types.QueryConfig{
		AllFields:     []types.Field{types.CmcSampleRatioField, types.GnomadV3AfField},
		DefaultFields: []types.Field{types.GnomadV3AfField},
		IdField:       types.GnomadV3AfField,
	}
	query, err := types.NewListQueryFromCriteria(config, nil, nil, nil, []types.SortBody{{Field: field, Order: order}})
	require.NoError(t, err)

	var rows []map[string]any
	tx := db.Session(&gorm.Session{DryRun: true}).Table("snv__variant v")
	AddSort(tx, query)
	return tx.Find(&rows).Statement.SQL.String()
}

func Test_AddSort_NullsLastField_Asc_AppendsNullsLast(t *testing.T) {
	t.Parallel()
	assert.Contains(t, sortedQuery(t, "cmc_sample_ratio", "asc"), "ORDER BY v.cmc_sample_ratio asc NULLS LAST")
}

func Test_AddSort_NullsLastField_Desc_AppendsNullsLast(t *testing.T) {
	t.Parallel()
	assert.Contains(t, sortedQuery(t, "cmc_sample_ratio", "desc"), "ORDER BY v.cmc_sample_ratio desc NULLS LAST")
}

func Test_AddSort_RegularField_KeepsDefaultNullOrdering(t *testing.T) {
	t.Parallel()
	sql := sortedQuery(t, "gnomad_v3_af", "asc")
	assert.Contains(t, sql, "ORDER BY v.gnomad_v3_af asc")
	assert.NotContains(t, sql, "NULLS")
}
