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

func Test_NewOccurrenceCountQueryFromSqon_Accept_TenantGenePanel(t *testing.T) {
	t.Parallel()

	query, err := NewOccurrenceCountQueryFromSqon(tenantGenePanelSqon(), GermlineSNVOccurrencesFields)

	require.NoError(t, err)
	assert.True(t, query.HasFieldFromTables(TenantGenePanelTable))
}

func Test_NewAggregationQueryFromSqon_Accept_TenantGenePanel(t *testing.T) {
	t.Parallel()

	query, err := NewAggregationQueryFromSqon("tenant_gene_panel", nil, SomaticSNVOccurrencesFields)

	require.NoError(t, err)
	assert.Equal(t, TenantGenePanelField, query.GetAggregateField())
}
