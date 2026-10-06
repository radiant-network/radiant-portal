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

const oneSCN1A = "symbol\tEpilepsy\nSCN1A\ttrue\n"

func Test_GenePanelUploader_Upload_ReplacesPanelsThenRefreshesMV(t *testing.T) {
	uploader, _, store, mv := newTestUploader(scn1a, kcnq2)

	result, err := uploader.Upload(t.Context(), "radiant", strings.NewReader("symbol\tEpilepsy\tCardio\n"+
		"scn1a\ttrue\tfalse\n"+
		"KCNQ2\ttrue\ttrue\n"), false)

	require.NoError(t, err)
	assert.Equal(t, "radiant", store.gotTenant)
	assert.Equal(t, []types.GenePanel{
		{Code: "EPILEPSY", Name: "Epilepsy", Genes: []types.GenePanelGene{
			{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"},
			{EnsemblID: "ENSG00000075043", Symbol: "KCNQ2"},
		}},
		{Code: "CARDIO", Name: "Cardio", Genes: []types.GenePanelGene{
			{EnsemblID: "ENSG00000075043", Symbol: "KCNQ2"},
		}},
	}, store.got)
	assert.Equal(t, "radiant", mv.gotTenant)
	assert.Equal(t, &types.GenePanelUploadResult{Panels: 2, Genes: 3, Warnings: []types.GenePanelUploadWarning{}}, result)
}

func Test_GenePanelUploader_Upload_LooksUpEachSymbolOnceInUpperCase(t *testing.T) {
	uploader, resolver, _, _ := newTestUploader(scn1a)

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader("symbol\tEpilepsy\tNeuro\tCardio\n"+
		"scn1a\ttrue\ttrue\tfalse\n"+
		"MYH7\tfalse\tfalse\tfalse\n"), false)

	require.NoError(t, err)
	assert.Equal(t, []string{"SCN1A"}, resolver.gotInputs, "a gene in no panel is not looked up")
}

func Test_GenePanelUploader_Upload_UnmatchedSymbolInTwoPanelsIsWarnedOnce(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	result, err := uploader.Upload(t.Context(), "radiant", strings.NewReader("symbol\tEpilepsy\tNeuro\n"+
		"SCN1A\ttrue\tfalse\n"+
		"NOTAGENE\ttrue\ttrue\n"), false)

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelGene{{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"}}, store.got[0].Genes)
	assert.Empty(t, store.got[1].Genes)
	assert.Equal(t, []types.GenePanelUploadWarning{
		{Line: 3, Symbol: "NOTAGENE", Message: "symbol matches no Ensembl gene, row skipped"},
	}, result.Warnings)
	assert.Equal(t, 1, result.Genes)
}

func Test_GenePanelUploader_Upload_StrictRejectsUnmatchedSymbolBeforeWriting(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader("symbol\tEpilepsy\tNeuro\n"+
		"SCN1A\ttrue\tfalse\n"+
		"NOTAGENE\ttrue\ttrue\n"), true)

	var unmatched *types.UnmatchedGenesError
	require.True(t, errors.As(err, &unmatched), "want *UnmatchedGenesError, got %v", err)
	assert.Equal(t, []types.GenePanelUploadWarning{
		{Line: 3, Symbol: "NOTAGENE", Message: "symbol matches no Ensembl gene, row skipped"},
	}, unmatched.Warnings)
	assert.False(t, store.called)
}

func Test_GenePanelUploader_Upload_SymbolSharedByTwoGenesKeepsBoth(t *testing.T) {
	other := types.GeneResult{GeneID: "ENSG00000999999", Name: "SCN1A"}
	uploader, _, store, _ := newTestUploader(scn1a, other)

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(oneSCN1A), false)

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelGene{
		{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"},
		{EnsemblID: "ENSG00000999999", Symbol: "SCN1A"},
	}, store.got[0].Genes)
}

func Test_GenePanelUploader_Upload_SymbolThatIsAnEnsemblIDKeepsTheGeneName(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	result, err := uploader.Upload(t.Context(), "radiant", strings.NewReader("symbol\tEpilepsy\nensg00000144285\ttrue\n"), false)

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelGene{{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"}}, store.got[0].Genes)
	assert.Equal(t, []types.GenePanelUploadWarning{
		{Line: 2, Symbol: "ensg00000144285", Message: "Ensembl gene ENSG00000144285 is named SCN1A, SCN1A kept"},
	}, result.Warnings)
}

func Test_GenePanelUploader_Upload_TwoRowsOnOneGeneKeepsTheFirst(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	result, err := uploader.Upload(t.Context(), "radiant", strings.NewReader("symbol\tEpilepsy\n"+
		"SCN1A\ttrue\n"+
		"ENSG00000144285\ttrue\n"), false)

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelGene{{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"}}, store.got[0].Genes)
	assert.Contains(t, result.Warnings, types.GenePanelUploadWarning{
		Line: 3, Symbol: "ENSG00000144285", Message: "same Ensembl gene ENSG00000144285 as line 2, row skipped",
	})
}

func Test_GenePanelUploader_Upload_BadFileWritesNothing(t *testing.T) {
	uploader, _, store, _ := newTestUploader(scn1a)

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader("symbol\n"), false)

	var fileErr *types.GenePanelFileError
	assert.True(t, errors.As(err, &fileErr))
	assert.False(t, store.called)
}

func Test_GenePanelUploader_Upload_ResolverFailureWritesNothing(t *testing.T) {
	uploader, resolver, store, _ := newTestUploader()
	resolver.err = errors.New("starrocks down")

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(oneSCN1A), false)

	assert.ErrorContains(t, err, "starrocks down")
	assert.False(t, store.called)
}

func Test_GenePanelUploader_Upload_StoreErrorIsReturnedAsIs(t *testing.T) {
	uploader, _, store, mv := newTestUploader(scn1a)
	conflict := &types.GenePanelConflictError{Message: "taken"}
	store.err = conflict

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(oneSCN1A), false)

	assert.Same(t, conflict, err)
	assert.Empty(t, mv.gotTenant, "no refresh when the write fails")
}

func Test_GenePanelUploader_Upload_RefreshFailureSaysPanelsAreSaved(t *testing.T) {
	uploader, _, store, mv := newTestUploader(scn1a)
	mv.err = errors.New("jdbc timeout")

	_, err := uploader.Upload(t.Context(), "radiant", strings.NewReader(oneSCN1A), false)

	assert.True(t, store.called)
	assert.ErrorContains(t, err, "gene panels saved, but the gene panel mv refresh failed: jdbc timeout")
}
