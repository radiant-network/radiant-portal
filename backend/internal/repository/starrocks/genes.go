package starrocks

import (
	"context"
	"errors"
	"fmt"
	"regexp"
	"strings"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Gene = types.Gene
type GeneResult = types.GeneResult
type AutoCompleteGene = types.AutoCompleteGene

type GenesRepository struct {
	db *gorm.DB
}

func NewGenesRepository(db database.StarrocksDB) *GenesRepository {
	return &GenesRepository{db: db.DB}
}

func mapToAutoCompleteGene(gene *Gene, input string) AutoCompleteGene {
	regex := regexp.MustCompile("^(?i)" + input)
	geneId := ""
	name := ""
	if len(input) > 0 {
		geneId = regex.ReplaceAllString(gene.GeneID, "<strong>"+strings.ToUpper(input)+"</strong>")
		name = regex.ReplaceAllString(gene.Name, "<strong>"+strings.ToUpper(input)+"</strong>")
	} else {
		geneId = gene.GeneID
		name = gene.Name
	}
	return types.AutoCompleteGene{
		HighLight: types.Term{
			ID:   geneId,
			Name: name,
		},
		Source: types.Term{
			ID:   gene.GeneID,
			Name: gene.Name,
		},
	}
}

func (r *GenesRepository) GetGeneAutoComplete(ctx context.Context, prefix string, limit int) (*[]AutoCompleteGene, error) {

	// Alias match collapses the array to a string rather than array_filter(alias, x -> ...):
	// a derived ARRAY crossing the ORDER BY exchange crashes the StarRocks 3.5.18 CN.
	//SELECT gene_id, name, (case WHEN name LIKE 'F%' THEN 1 ELSE (CASE WHEN gene_id LIKE 'F%' THEN 2 ELSE (CASE WHEN UPPER(CONCAT('||', array_join(alias, '||'))) LIKE '%||F%' THEN 3 ELSE 4 END) END) END) weight
	//FROM ensembl_gene
	//WHERE UPPER(name) like 'F%' or UPPER(gene_id) like 'F%' or UPPER(CONCAT('||', array_join(alias, '||'))) LIKE '%||F%'
	//ORDER BY weight ASC, name ASC
	//LIMIT 10;

	like := fmt.Sprintf("%s%%", strings.ToUpper(prefix))
	aliasLike := fmt.Sprintf("%%||%s%%", strings.ToUpper(prefix))
	tx := r.db.WithContext(ctx).Table(types.EnsemblGeneTable.TenantQualifiedName(ctx))
	tx = tx.Select("gene_id, name, (case WHEN name LIKE ? THEN 1 ELSE (CASE WHEN gene_id LIKE ? THEN 2 ELSE (CASE WHEN UPPER(CONCAT('||', array_join(alias, '||'))) LIKE ? THEN 3 ELSE 4 END) END) END) weight", like, like, aliasLike)
	tx = tx.Where("UPPER(name) like ? or UPPER(gene_id) like ? or UPPER(CONCAT('||', array_join(alias, '||'))) LIKE ?", like, like, aliasLike)
	tx = tx.Order("weight ASC, name ASC")
	tx = tx.Limit(limit)

	var genes []Gene
	if err := tx.Find(&genes).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching genes: %w", err)
		} else {
			return nil, nil
		}
	}

	output := make([]AutoCompleteGene, len(genes))
	for i, gene := range genes {
		output[i] = mapToAutoCompleteGene(&gene, prefix)
	}

	return &output, nil
}

func (r *GenesRepository) SearchGenes(ctx context.Context, inputs []string) (*[]GeneResult, error) {
	upperInputs := make([]string, 0)

	for _, input := range inputs {
		upperInputs = append(upperInputs, strings.ToUpper(input))
	}

	tx := r.db.WithContext(ctx).Table(types.EnsemblGeneTable.TenantQualifiedName(ctx))
	tx = tx.Select("gene_id, name")
	tx = tx.Where("UPPER(name) IN ? OR UPPER(gene_id) IN ?", upperInputs, upperInputs)
	tx = tx.Order("name ASC")

	var genes []GeneResult

	if err := tx.Find(&genes).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching genes: %w", err)
		} else {
			return nil, nil
		}
	}

	return &genes, nil
}

const resolveGenesChunkSize = 1000

// ResolveGenes runs SearchGenes in chunks on the root pool. ensembl_gene is public reference
// data, so this reads no tenant data, and the caller (the ETL account) needs no StarRocks access.
func (r *GenesRepository) ResolveGenes(ctx context.Context, inputs []string) ([]GeneResult, error) {
	ctx = database.ContextWithRootPool(ctx)
	var genes []GeneResult
	for start := 0; start < len(inputs); start += resolveGenesChunkSize {
		chunk, err := r.SearchGenes(ctx, inputs[start:min(start+resolveGenesChunkSize, len(inputs))])
		if err != nil {
			return nil, err
		}
		if chunk != nil {
			genes = append(genes, *chunk...)
		}
	}
	return genes, nil
}

// GetGeneTrack lists the genes of every biotype overlapping a region, each with its exons merged
// over all its transcripts (ensembl_exon_by_gene holds no MANE or coding bounds).
func (r *GenesRepository) GetGeneTrack(ctx context.Context, chromosome string, start int, end int) ([]types.GeneTrackGene, error) {
	return r.geneTrack(ctx, "chromosome = ? AND end >= ? AND start <= ?", chromosome, start, end)
}

// GetGeneTrackBySymbol finds a gene of the gene track by its symbol, ignoring case.
func (r *GenesRepository) GetGeneTrackBySymbol(ctx context.Context, symbol string) ([]types.GeneTrackGene, error) {
	return r.geneTrack(ctx, "UPPER(name) = ?", strings.ToUpper(symbol))
}

func (r *GenesRepository) geneTrack(ctx context.Context, where string, args ...any) ([]types.GeneTrackGene, error) {
	tx := r.db.WithContext(ctx).Table(types.EnsemblGeneTable.TenantQualifiedName(ctx))
	tx = tx.Select("gene_id, name AS symbol, chromosome, start, end, strand, biotype, description")
	tx = tx.Where(where, args...)
	tx = tx.Order("start, gene_id")

	var genes []types.GeneTrackGene
	if err := tx.Find(&genes).Error; err != nil {
		return nil, fmt.Errorf("error fetching gene track genes: %w", err)
	}
	if len(genes) == 0 {
		return []types.GeneTrackGene{}, nil
	}

	geneIDs := make([]string, len(genes))
	for i, g := range genes {
		geneIDs[i] = g.GeneID
	}
	var exons []struct {
		GeneID string
		Start  int
		End    int
	}
	tx = r.db.WithContext(ctx).Table(types.EnsemblExonByGeneTable.TenantQualifiedName(ctx))
	tx = tx.Select("DISTINCT gene_id, start, end").Where("gene_id IN ?", geneIDs).Order("gene_id, start, end")
	if err := tx.Find(&exons).Error; err != nil {
		return nil, fmt.Errorf("error fetching gene track exons: %w", err)
	}

	exonsByGene := map[string][]types.GeneTrackExon{}
	for _, e := range exons {
		exonsByGene[e.GeneID] = append(exonsByGene[e.GeneID], types.GeneTrackExon{Start: e.Start, End: e.End})
	}
	for i := range genes {
		genes[i].Exons = mergeExons(exonsByGene[genes[i].GeneID])
	}
	return genes, nil
}

// mergeExons merges overlapping exons, given sorted by start.
func mergeExons(exons []types.GeneTrackExon) []types.GeneTrackExon {
	merged := []types.GeneTrackExon{}
	for _, e := range exons {
		if n := len(merged); n > 0 && e.Start <= merged[n-1].End {
			merged[n-1].End = max(merged[n-1].End, e.End)
			continue
		}
		merged = append(merged, e)
	}
	return merged
}
