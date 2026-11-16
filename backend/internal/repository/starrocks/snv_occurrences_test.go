package starrocks

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_SnvSeqIdColumn_Germline(t *testing.T) {
	got, err := snvSeqIdColumn(types.GermlineSNVOccurrenceTable)
	assert.NoError(t, err)
	assert.Equal(t, "seq_id", got)
}

func Test_SnvSeqIdColumn_Somatic(t *testing.T) {
	got, err := snvSeqIdColumn(types.SomaticSNVOccurrenceTable)
	assert.NoError(t, err)
	assert.Equal(t, "tumor_seq_id", got)
}

func Test_SnvSeqIdColumn_UnknownTable(t *testing.T) {
	got, err := snvSeqIdColumn(types.VariantPartitionedTable)
	assert.Error(t, err)
	assert.Empty(t, got)
}

func Test_SnvSeqIdColumn_EmptyTable(t *testing.T) {
	got, err := snvSeqIdColumn(types.Table{})
	assert.Error(t, err)
	assert.Empty(t, got)
}

func implicitFiltersSQL(t *testing.T, env *testutils.Env, snvTable types.Table) (string, error) {
	t.Helper()
	db := env.Starrocks.Session(&gorm.Session{DryRun: true}).WithContext(env.Ctx)
	var dest []map[string]any
	tx := AddImplicitSNVOccurrencesFilters(snvTable, 1, 5, db, 0).Find(&dest)
	return tx.Statement.SQL.String(), tx.Error
}

func Test_AddImplicitSNVOccurrencesFilters_GermlineFiltersOnSeqId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		sql, err := implicitFiltersSQL(t, env, types.GermlineSNVOccurrenceTable)
		assert.NoError(t, err)
		assert.Contains(t, sql, "g_snv_o.seq_id = ? AND g_snv_o.task_id = ? AND g_snv_o.part=?")
	})
}

func Test_AddImplicitSNVOccurrencesFilters_SomaticFiltersOnTumorSeqId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		sql, err := implicitFiltersSQL(t, env, types.SomaticSNVOccurrenceTable)
		assert.NoError(t, err)
		assert.Contains(t, sql, "s_snv_o.tumor_seq_id = ? AND s_snv_o.task_id = ? AND s_snv_o.part=?")
	})
}

func Test_AddImplicitSNVOccurrencesFilters_UnknownTableFailsTheQuery(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		_, err := implicitFiltersSQL(t, env, types.VariantPartitionedTable)
		assert.Error(t, err)
	})
}
