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
		AllFields:     []types.Field{types.CmcSampleRatioField, types.GnomadV3AfField, types.FamilyRelationshipToProbandCodeField},
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
	assert.NotContains(t, sql, "DESC")
}

func Test_AddSort_SortFirstValueField_Asc_PutsValueFirst(t *testing.T) {
	t.Parallel()
	assert.Contains(t, sortedQuery(t, "relationship_to_proband_code", "asc"), "ORDER BY f.relationship_to_proband_code = 'proband' DESC NULLS LAST,f.relationship_to_proband_code asc NULLS LAST")
}

func Test_AddSort_SortFirstValueField_Desc_PutsValueLast(t *testing.T) {
	t.Parallel()
	assert.Contains(t, sortedQuery(t, "relationship_to_proband_code", "desc"), "ORDER BY f.relationship_to_proband_code = 'proband' ASC NULLS LAST,f.relationship_to_proband_code desc NULLS LAST")
}

func caseTypeSortedQuery(t *testing.T, computedColumns types.CaseComputedColumns) *gorm.DB {
	t.Helper()
	db, err := gorm.Open(tests.DummyDialector{}, &gorm.Config{DryRun: true})
	require.NoError(t, err)
	query, err := types.NewListQueryFromCriteria(types.CasesQueryConfig, nil, nil, nil, []types.SortBody{{Field: types.CaseTypeField.GetAlias(), Order: "desc"}})
	require.NoError(t, err)

	var rows []map[string]any
	tx := db.Session(&gorm.Session{DryRun: true}).Table("cases c")
	AddSortWithCaseSearchSQL(tx, query, computedColumns)
	return tx.Find(&rows)
}

func Test_AddSortWithCaseSearchSQL_WithComputedColumn_SortsOnTheColumn(t *testing.T) {
	t.Parallel()
	tx := caseTypeSortedQuery(t, types.CaseComputedColumns{types.CaseTypeField.GetAlias(): "CONCAT(c.a, c.b)"})

	require.NoError(t, tx.Error)
	assert.Contains(t, tx.Statement.SQL.String(), "ORDER BY CONCAT(c.a, c.b) desc,c.id asc")
}

func Test_AddSortWithCaseSearchSQL_WithoutComputedColumn_QueryFails(t *testing.T) {
	t.Parallel()
	tx := caseTypeSortedQuery(t, nil)

	require.Error(t, tx.Error)
	assert.Contains(t, tx.Error.Error(), "computed field case_type is sorted but the query gives none of its SQL")
}

func whereQuery(t *testing.T, field types.Field, semiJoinRows types.CaseSemiJoinRows, computedColumns types.CaseComputedColumns) *gorm.DB {
	t.Helper()
	db, err := gorm.Open(tests.DummyDialector{}, &gorm.Config{DryRun: true})
	require.NoError(t, err)
	criteria := []types.SearchCriterion{{FieldName: field.GetAlias(), Value: []interface{}{"1617"}}}
	query, err := types.NewListQueryFromCriteria(types.CasesQueryConfig, nil, criteria, nil, nil)
	require.NoError(t, err)

	var rows []map[string]any
	tx := db.Session(&gorm.Session{DryRun: true}).Table("cases c")
	AddWhereWithCaseSearchSQL(query, tx, semiJoinRows, computedColumns)
	return tx.Find(&rows)
}

func Test_AddWhereWithCaseSearchSQL_WithRows_CaseIdInSubQuery(t *testing.T) {
	t.Parallel()
	tx := whereQuery(t, types.CaseMemberRunNameField, types.CaseSemiJoinRows{types.CaseMemberRunTable.Alias: "SELECT case_id, run_name FROM runs"}, nil)

	require.NoError(t, tx.Error)
	assert.Contains(t, tx.Statement.SQL.String(), "WHERE (c.id IN (SELECT case_id FROM (SELECT case_id, run_name FROM runs) case_member_run WHERE case_member_run.run_name = ?))")
}

func Test_AddWhereWithCaseSearchSQL_WithoutRows_QueryFails(t *testing.T) {
	t.Parallel()
	tx := whereQuery(t, types.CaseMemberRunNameField, nil, nil)

	require.Error(t, tx.Error)
	assert.Contains(t, tx.Error.Error(), "case semi-join table case_member_run is filtered but the query gives none of its rows")
}

func Test_AddWhereWithCaseSearchSQL_RowsOfAnotherTable_QueryFails(t *testing.T) {
	t.Parallel()
	tx := whereQuery(t, types.CaseMemberRunNameField, types.CaseSemiJoinRows{"other": "SELECT case_id FROM other"}, nil)

	require.Error(t, tx.Error)
}

func Test_AddWhereWithCaseSearchSQL_WithComputedColumn_ColumnInPlaceOfTheField(t *testing.T) {
	t.Parallel()
	tx := whereQuery(t, types.CaseTypeField, nil, types.CaseComputedColumns{types.CaseTypeField.GetAlias(): "CONCAT(c.a, c.b)"})

	require.NoError(t, tx.Error)
	assert.Contains(t, tx.Statement.SQL.String(), "CONCAT(c.a, c.b) = ?")
}

func Test_AddWhereWithCaseSearchSQL_WithoutComputedColumn_QueryFails(t *testing.T) {
	t.Parallel()
	tx := whereQuery(t, types.CaseTypeField, nil, nil)

	require.Error(t, tx.Error)
	assert.Contains(t, tx.Error.Error(), "computed field case_type is filtered but the query gives none of its SQL")
}
