package types

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func tenantGenePanelSqon() *Sqon {
	return &Sqon{Op: "in", Content: LeafContent{Field: "tenant_gene_panel", Value: []any{"ONCO"}}}
}

func Test_TenantGenePanelTable_TenantQualifiedName_Is_Tenant_MV(t *testing.T) {
	t.Parallel()
	ctx := ContextWithTenant(context.Background(), "tenant1")
	assert.Equal(t, "tenant1_tenant.gene_panel_mv", TenantGenePanelTable.TenantQualifiedName(ctx))
}

func Test_TenantGenePanelTable_Is_A_Gene_Panel_Table(t *testing.T) {
	t.Parallel()
	assert.Contains(t, GenePanelsTables, TenantGenePanelTable)
}

func Test_SNVOccurrencesFields_Contain_TenantGenePanelField(t *testing.T) {
	t.Parallel()
	assert.Contains(t, GermlineSNVOccurrencesFields, TenantGenePanelField)
	assert.Contains(t, SomaticSNVOccurrencesFields, TenantGenePanelField)
}

func Test_CNVOccurrencesFields_Do_Not_Contain_TenantGenePanelField(t *testing.T) {
	t.Parallel()
	assert.NotContains(t, GermlineCNVOccurrencesFields, TenantGenePanelField)
	assert.NotContains(t, SomaticCNVOccurrencesFields, TenantGenePanelField)
}

func Test_FieldsForContext_Drops_TenantOnly_Fields_When_No_Tenant(t *testing.T) {
	t.Parallel()
	fields := FieldsForContext(context.Background(), []Field{OmimGenePanelField, TenantGenePanelField})
	assert.Equal(t, []Field{OmimGenePanelField}, fields)
}

func Test_FieldsForContext_Drops_TenantOnly_Fields_When_Empty_Tenant(t *testing.T) {
	t.Parallel()
	ctx := ContextWithTenant(context.Background(), "")
	fields := FieldsForContext(ctx, []Field{OmimGenePanelField, TenantGenePanelField})
	assert.Equal(t, []Field{OmimGenePanelField}, fields)
}

func Test_FieldsForContext_Keeps_All_Fields_When_Tenant_Bound(t *testing.T) {
	t.Parallel()
	ctx := ContextWithTenant(context.Background(), "tenant1")
	fields := FieldsForContext(ctx, []Field{OmimGenePanelField, TenantGenePanelField})
	assert.Equal(t, []Field{OmimGenePanelField, TenantGenePanelField}, fields)
}

func Test_QueryConfig_ForContext_Drops_TenantOnly_Fields_Without_Mutating_Config(t *testing.T) {
	t.Parallel()
	config := QueryConfig{AllFields: []Field{OmimGenePanelField, TenantGenePanelField}, IdField: GermlineSNVLocusIdField}

	restricted := config.ForContext(context.Background())

	assert.Equal(t, []Field{OmimGenePanelField}, restricted.AllFields)
	assert.Equal(t, GermlineSNVLocusIdField, restricted.IdField)
	assert.Equal(t, []Field{OmimGenePanelField, TenantGenePanelField}, config.AllFields)
}

func Test_NewOccurrenceCountQueryFromSqon_Reject_TenantGenePanel_When_No_Tenant(t *testing.T) {
	t.Parallel()
	fields := FieldsForContext(context.Background(), GermlineSNVOccurrencesFields)

	_, err := NewOccurrenceCountQueryFromSqon(tenantGenePanelSqon(), fields)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "unauthorized or unknown field: tenant_gene_panel")
}

func Test_NewOccurrenceCountQueryFromSqon_Accept_TenantGenePanel_When_Tenant_Bound(t *testing.T) {
	t.Parallel()
	fields := FieldsForContext(ContextWithTenant(context.Background(), "tenant1"), GermlineSNVOccurrencesFields)

	query, err := NewOccurrenceCountQueryFromSqon(tenantGenePanelSqon(), fields)

	require.NoError(t, err)
	assert.True(t, query.HasFieldFromTables(TenantGenePanelTable))
}

func Test_NewAggregationQueryFromSqon_Reject_TenantGenePanel_When_No_Tenant(t *testing.T) {
	t.Parallel()
	fields := FieldsForContext(context.Background(), SomaticSNVOccurrencesFields)

	_, err := NewAggregationQueryFromSqon("tenant_gene_panel", nil, fields)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "tenant_gene_panel can not be aggregated")
}

func Test_NewAggregationQueryFromSqon_Accept_TenantGenePanel_When_Tenant_Bound(t *testing.T) {
	t.Parallel()
	fields := FieldsForContext(ContextWithTenant(context.Background(), "tenant1"), SomaticSNVOccurrencesFields)

	query, err := NewAggregationQueryFromSqon("tenant_gene_panel", nil, fields)

	require.NoError(t, err)
	assert.Equal(t, TenantGenePanelField, query.GetAggregateField())
}
