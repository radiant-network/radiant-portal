package service

import (
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type fakeGeneResolver struct {
	genes     []types.GeneResult
	err       error
	gotInputs []string
}

func (f *fakeGeneResolver) ResolveGenes(_ context.Context, inputs []string) ([]types.GeneResult, error) {
	f.gotInputs = inputs
	return f.genes, f.err
}

type fakeGenePanelStore struct {
	err       error
	called    bool
	gotTenant string
	got       []types.GenePanel
}

func (f *fakeGenePanelStore) ReplaceUploadedGenePanels(_ context.Context, tenantCode string, panels []types.GenePanel) error {
	f.called, f.gotTenant, f.got = true, tenantCode, panels
	return f.err
}

type fakeGenePanelMV struct {
	err       error
	gotTenant string
}

func (f *fakeGenePanelMV) RefreshGenePanelMV(_ context.Context, tenantCode string) error {
	f.gotTenant = tenantCode
	return f.err
}

var (
	scn1a = types.GeneResult{GeneID: "ENSG00000144285", Name: "SCN1A"}
	kcnq2 = types.GeneResult{GeneID: "ENSG00000075043", Name: "KCNQ2"}
)

func newTestUploader(genes ...types.GeneResult) (*GenePanelUploader, *fakeGeneResolver, *fakeGenePanelStore, *fakeGenePanelMV) {
	resolver := &fakeGeneResolver{genes: genes}
	store := &fakeGenePanelStore{}
	mv := &fakeGenePanelMV{}
	return NewGenePanelUploader(resolver, store, mv), resolver, store, mv
}

const tsvHeader = "panel_code\tpanel_name\tsymbol\tensembl_id\n"

func Test_GenePanelUploader_Upload_ReplacesPanelsThenRefreshesMV(t *testing.T) {
	uploader, _, store, mv := newTestUploader(scn1a, kcnq2)

	result, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+
		"EPI\tEpilepsy\tscn1a\t\n"+
		"EPI\tEpilepsy\tKCNQ2\t\n"), false)

	require.NoError(t, err)
	assert.Equal(t, "radiant", store.gotTenant)
	assert.Equal(t, []types.GenePanel{{Code: "EPI", Name: "Epilepsy", Genes: []types.GenePanelGene{
		{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"},
		{EnsemblID: "ENSG00000075043", Symbol: "KCNQ2"},
	}}}, store.got)
	assert.Equal(t, "radiant", mv.gotTenant)
	assert.Equal(t, &types.GenePanelUploadResult{Panels: 1, Genes: 2, Warnings: []types.GenePanelUploadWarning{}}, result)
}

func Test_GenePanelUploader_Upload_LooksUpEnsemblIDOrElseSymbolOncePerValue(t *testing.T) {
	uploader, resolver, _, _ := newTestUploader(scn1a)

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+
		"EPI\tEpilepsy\tSCN1A\tENSG00000144285\n"+
		"NEURO\tNeuro\tkcnq2\t\n"+
		"CARDIO\tCardio\tKCNQ2\t\n"), false)

	require.NoError(t, err)
	assert.Equal(t, []string{"ENSG00000144285", "KCNQ2"}, resolver.gotInputs)
}

func Test_GenePanelUploader_Upload_SkipsAndReportsUnmatchedSymbol(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	result, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+
		"EPI\tEpilepsy\tSCN1A\t\n"+
		"EPI\tEpilepsy\tNOTAGENE\t\n"), false)

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelGene{{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"}}, store.got[0].Genes)
	assert.Equal(t, []types.GenePanelUploadWarning{
		{Line: 3, PanelCode: "EPI", Symbol: "NOTAGENE", Message: "symbol matches no Ensembl gene, row skipped"},
	}, result.Warnings)
	assert.Equal(t, 1, result.Genes)
}

func Test_GenePanelUploader_Upload_SkipsAndReportsUnknownEnsemblID(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	result, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+
		"EPI\tEpilepsy\tSCN1A\tENSG00000000001\n"), false)

	require.NoError(t, err)
	assert.Empty(t, store.got[0].Genes, "an unknown Ensembl ID does not fall back to the symbol")
	assert.Equal(t, []types.GenePanelUploadWarning{
		{Line: 2, PanelCode: "EPI", Symbol: "SCN1A", Message: "ensembl_id ENSG00000000001 matches no Ensembl gene, row skipped"},
	}, result.Warnings)
}

func Test_GenePanelUploader_Upload_StrictRejectsUnmatchedSymbolBeforeWriting(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+
		"EPI\tEpilepsy\tSCN1A\t\n"+
		"EPI\tEpilepsy\tNOTAGENE\t\n"), true)

	var unmatched *types.UnmatchedGenesError
	require.True(t, errors.As(err, &unmatched), "want *UnmatchedGenesError, got %v", err)
	assert.Equal(t, []types.GenePanelUploadWarning{
		{Line: 3, PanelCode: "EPI", Symbol: "NOTAGENE", Message: "symbol matches no Ensembl gene, row skipped"},
	}, unmatched.Warnings)
	assert.False(t, store.called)
}

func Test_GenePanelUploader_Upload_StrictAcceptsRenamedGene(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	result, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+
		"EPI\tEpilepsy\tSCN1A_OLD\tENSG00000144285\n"), true)

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelGene{{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"}}, store.got[0].Genes)
	assert.Equal(t, []types.GenePanelUploadWarning{
		{Line: 2, PanelCode: "EPI", Symbol: "SCN1A_OLD", Message: "Ensembl gene ENSG00000144285 is named SCN1A, SCN1A kept"},
	}, result.Warnings)
}

func Test_GenePanelUploader_Upload_SymbolSharedByTwoGenesKeepsBoth(t *testing.T) {
	other := types.GeneResult{GeneID: "ENSG00000999999", Name: "SCN1A"}
	uploader, _, store, _ := newTestUploader(scn1a, other)

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+"EPI\tEpilepsy\tSCN1A\t\n"), false)

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelGene{
		{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"},
		{EnsemblID: "ENSG00000999999", Symbol: "SCN1A"},
	}, store.got[0].Genes)
}

func Test_GenePanelUploader_Upload_SymbolThatIsAnEnsemblIDResolves(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+"EPI\tEpilepsy\tensg00000144285\t\n"), false)

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelGene{{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"}}, store.got[0].Genes)
}

func Test_GenePanelUploader_Upload_TwoRowsOnOneGeneKeepsTheFirst(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	result, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+
		"EPI\tEpilepsy\tSCN1A\t\n"+
		"EPI\tEpilepsy\tSCN1A_OLD\tENSG00000144285\n"), false)

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelGene{{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"}}, store.got[0].Genes)
	assert.Equal(t, []types.GenePanelUploadWarning{
		{Line: 3, PanelCode: "EPI", Symbol: "SCN1A_OLD", Message: "same Ensembl gene ENSG00000144285 as line 2, row skipped"},
	}, result.Warnings)
}

func Test_GenePanelUploader_Upload_BadFileWritesNothing(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader("panel_code\tsymbol\n"), false)

	var fileErr *types.GenePanelFileError
	assert.True(t, errors.As(err, &fileErr))
	assert.False(t, store.called)
}

func Test_GenePanelUploader_Upload_ResolverFailureWritesNothing(t *testing.T) {
	uploader, resolver, store, _ := newTestUploader()
	resolver.err = errors.New("starrocks down")

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+"EPI\tEpilepsy\tSCN1A\t\n"), false)

	assert.ErrorContains(t, err, "starrocks down")
	assert.False(t, store.called)
}

func Test_GenePanelUploader_Upload_StoreErrorIsReturnedAsIs(t *testing.T) {
	uploader, _, store, mv := newTestUploader(scn1a)
	conflict := &types.GenePanelConflictError{Message: "taken"}
	store.err = conflict

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+"EPI\tEpilepsy\tSCN1A\t\n"), false)

	assert.Same(t, conflict, err)
	assert.Empty(t, mv.gotTenant, "no refresh when the write fails")
}

func Test_GenePanelUploader_Upload_RefreshFailureSaysPanelsAreSaved(t *testing.T) {
	uploader, _, store, mv := newTestUploader(scn1a)
	mv.err = errors.New("jdbc timeout")

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(tsvHeader+"EPI\tEpilepsy\tSCN1A\t\n"), false)

	assert.True(t, store.called)
	assert.ErrorContains(t, err, "gene panels saved, but the gene panel mv refresh failed: jdbc timeout")
}
