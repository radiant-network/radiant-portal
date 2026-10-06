package service

import (
	"context"
	"fmt"
	"io"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
)

type GeneResolver interface {
	ResolveGenes(ctx context.Context, inputs []string) ([]types.GeneResult, error)
}

type UploadedGenePanelStore interface {
	ReplaceUploadedGenePanels(ctx context.Context, tenantCode string, panels []types.GenePanel) error
}

type GenePanelMVRefresher interface {
	RefreshGenePanelMV(ctx context.Context, tenantCode string) error
}

type GenePanelUploader struct {
	genes  GeneResolver
	store  UploadedGenePanelStore
	mviews GenePanelMVRefresher
}

func NewGenePanelUploader(genes GeneResolver, store UploadedGenePanelStore, mviews GenePanelMVRefresher) *GenePanelUploader {
	return &GenePanelUploader{genes: genes, store: store, mviews: mviews}
}

// Upload replaces the tenant's uploaded gene panels with the panels of the file, then refreshes the
// tenant's gene panel MV. A row that matches no Ensembl gene is skipped and reported, or, when
// strict, rejects the file with a *types.UnmatchedGenesError. The MV refresh runs after the commit:
// if it fails, the panels are saved and the same upload can be sent again.
func (u *GenePanelUploader) Upload(ctx context.Context, tenantCode string, file io.Reader, strict bool) (*types.GenePanelUploadResult, error) {
	inputs, err := ParseGenePanelTSV(file)
	if err != nil {
		return nil, err
	}
	resolved, err := u.genes.ResolveGenes(ctx, genePanelLookupKeys(inputs))
	if err != nil {
		return nil, fmt.Errorf("resolve gene panel symbols: %w", err)
	}
	panels, warnings, unmatched := resolveGenePanels(inputs, indexGenes(resolved))
	if strict && len(unmatched) > 0 {
		return nil, &types.UnmatchedGenesError{Warnings: unmatched}
	}

	if err := u.store.ReplaceUploadedGenePanels(ctx, tenantCode, panels); err != nil {
		return nil, err
	}
	if err := u.mviews.RefreshGenePanelMV(ctx, tenantCode); err != nil {
		return nil, fmt.Errorf("gene panels saved, but the gene panel mv refresh failed: %w", err)
	}

	genes := 0
	for _, p := range panels {
		genes += len(p.Genes)
	}
	return &types.GenePanelUploadResult{Panels: len(panels), Genes: genes, Warnings: warnings}, nil
}

// genePanelLookupKeys returns each symbol once, in upper case.
func genePanelLookupKeys(inputs []types.GenePanelInput) []string {
	seen := map[string]bool{}
	var keys []string
	for _, panel := range inputs {
		for _, row := range panel.Rows {
			key := strings.ToUpper(row.Symbol)
			if !seen[key] {
				seen[key] = true
				keys = append(keys, key)
			}
		}
	}
	return keys
}

type geneIndex struct {
	byID     map[string]types.GeneResult
	bySymbol map[string][]types.GeneResult
}

func indexGenes(genes []types.GeneResult) geneIndex {
	idx := geneIndex{byID: map[string]types.GeneResult{}, bySymbol: map[string][]types.GeneResult{}}
	for _, g := range genes {
		idx.byID[strings.ToUpper(g.GeneID)] = g
		symbol := strings.ToUpper(g.Name)
		idx.bySymbol[symbol] = append(idx.bySymbol[symbol], g)
	}
	return idx
}

// lookup returns the genes of a row: the Ensembl genes named by its symbol (all of them when
// several share it), else the gene whose Ensembl ID the symbol is.
func (idx geneIndex) lookup(row types.GenePanelRow) []types.GeneResult {
	if genes := idx.bySymbol[strings.ToUpper(row.Symbol)]; len(genes) > 0 {
		return genes
	}
	if g, ok := idx.byID[strings.ToUpper(row.Symbol)]; ok {
		return []types.GeneResult{g}
	}
	return nil
}

// resolveGenePanels maps each row to its Ensembl genes. A row is in as many panels as it has true
// cells, so each row is resolved and warned about once. It returns the panels, all the warnings,
// and the subset of the warnings for rows that match no gene.
func resolveGenePanels(inputs []types.GenePanelInput, idx geneIndex) ([]types.GenePanel, []types.GenePanelUploadWarning, []types.GenePanelUploadWarning) {
	panels := make([]types.GenePanel, 0, len(inputs))
	warnings := []types.GenePanelUploadWarning{}
	var unmatched []types.GenePanelUploadWarning
	genesByLine := map[int][]types.GeneResult{}
	warned := map[types.GenePanelUploadWarning]bool{}
	warn := func(row types.GenePanelRow, message string) types.GenePanelUploadWarning {
		w := types.GenePanelUploadWarning{Line: row.Line, Symbol: row.Symbol, Message: message}
		if !warned[w] {
			warned[w] = true
			warnings = append(warnings, w)
		}
		return w
	}
	resolve := func(row types.GenePanelRow) []types.GeneResult {
		if genes, done := genesByLine[row.Line]; done {
			return genes
		}
		genes := idx.lookup(row)
		genesByLine[row.Line] = genes
		if len(genes) == 0 {
			unmatched = append(unmatched, warn(row, "symbol matches no Ensembl gene, row skipped"))
		}
		for _, g := range genes {
			if !strings.EqualFold(g.Name, row.Symbol) {
				warn(row, fmt.Sprintf("Ensembl gene %s is named %s, %s kept", g.GeneID, g.Name, g.Name))
			}
		}
		return genes
	}

	for _, input := range inputs {
		panel := types.GenePanel{Code: input.Code, Name: input.Name}
		lineByID := map[string]int{}
		for _, row := range input.Rows {
			for _, g := range resolve(row) {
				if prev, dup := lineByID[g.GeneID]; dup {
					warn(row, fmt.Sprintf("same Ensembl gene %s as line %d, row skipped", g.GeneID, prev))
					continue
				}
				lineByID[g.GeneID] = row.Line
				panel.Genes = append(panel.Genes, types.GenePanelGene{EnsemblID: g.GeneID, Symbol: g.Name})
			}
		}
		panels = append(panels, panel)
	}
	return panels, warnings, unmatched
}
