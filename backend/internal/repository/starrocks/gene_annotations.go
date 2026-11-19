package starrocks

import (
	"context"
	"fmt"
	"slices"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type geneConstraint struct {
	GeneID string
	Pli    *float32
	Loeuf  *float32
}

// geneConstraints gives the gnomAD constraint of each gene id, that of its reference transcript, as
// gnomAD reports it: the values of a minor transcript rest on few expected variants. A gene with no
// reference transcript has none.
func geneConstraints(ctx context.Context, db *gorm.DB, geneIDs []string) (map[string]geneConstraint, error) {
	constraints := map[string]geneConstraint{}
	if len(geneIDs) == 0 {
		return constraints, nil
	}
	rt, gc := types.GeneReferenceTranscriptTable, types.GnomadConstraintTable
	var rows []geneConstraint
	err := db.WithContext(ctx).
		Table(fmt.Sprintf("%s %s", rt.TenantQualifiedName(ctx), rt.Alias)).
		Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.transcript_id = %s.ensembl_transcript_id", gc.TenantQualifiedName(ctx), gc.Alias, gc.Alias, rt.Alias)).
		Where(fmt.Sprintf("%s.ensembl_gene_id IN ?", rt.Alias), geneIDs).
		Select(fmt.Sprintf("%s.ensembl_gene_id AS gene_id, %[2]s.pli, %[2]s.loeuf", rt.Alias, gc.Alias)).
		Find(&rows).Error
	if err != nil {
		return nil, fmt.Errorf("error fetching gene constraint: %w", err)
	}
	for _, row := range rows {
		constraints[row.GeneID] = row
	}
	return constraints, nil
}

// omimInheritanceCodes gives the OMIM inheritance modes of each gene symbol, over all its phenotypes,
// without duplicates and in the order of the phenotypes.
func omimInheritanceCodes(ctx context.Context, db *gorm.DB, symbols []string) (map[string][]string, error) {
	codes := map[string][]string{}
	if len(symbols) == 0 {
		return codes, nil
	}
	var panels []struct {
		Symbol          string
		InheritanceCode types.JsonArray[string] `gorm:"type:json"`
	}
	tx := db.WithContext(ctx).Table(types.OmimGenePanelTable.TenantQualifiedName(ctx))
	tx = tx.Select("symbol, inheritance_code").Where("symbol IN ? AND omim_phenotype_id IS NOT NULL", symbols)
	tx = tx.Order("symbol, omim_phenotype_id, panel")
	if err := tx.Find(&panels).Error; err != nil {
		return nil, fmt.Errorf("error fetching omim phenotypes: %w", err)
	}
	for _, p := range panels {
		for _, code := range p.InheritanceCode {
			if !slices.Contains(codes[p.Symbol], code) {
				codes[p.Symbol] = append(codes[p.Symbol], code)
			}
		}
	}
	return codes, nil
}
