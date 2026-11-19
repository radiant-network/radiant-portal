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

// GetGeneTrack lists the genes of every biotype overlapping a region, each with the exons of its
// reference transcript.
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
	exonsByGene, err := geneExons(ctx, r.db, geneIDs)
	if err != nil {
		return nil, fmt.Errorf("error fetching gene track exons: %w", err)
	}
	symbols := make([]string, len(genes))
	for i, g := range genes {
		symbols[i] = g.Symbol
	}
	omim, err := omimGenes(ctx, r.db, symbols)
	if err != nil {
		return nil, fmt.Errorf("error fetching gene track omim phenotypes: %w", err)
	}
	constraints, err := geneConstraints(ctx, r.db, geneIDs)
	if err != nil {
		return nil, fmt.Errorf("error fetching gene track constraint: %w", err)
	}
	for i := range genes {
		genes[i].Exons = exonsByGene[genes[i].GeneID]
		if genes[i].Exons == nil {
			genes[i].Exons = []types.GeneTrackExon{}
		}
		genes[i].OmimInheritanceCode = omim[genes[i].Symbol].InheritanceCodes
		genes[i].OmimConditions = omim[genes[i].Symbol].Conditions
		genes[i].GnomadPli, genes[i].GnomadLoeuf = constraints[genes[i].GeneID].Pli, constraints[genes[i].GeneID].Loeuf
	}
	return genes, nil
}

// geneExons gives the exons of the reference transcript of each gene, the transcript the CNV
// genes_overlap counts its exons on, so that the drawn and the counted exons are the same. A gene
// with no reference transcript has none.
func geneExons(ctx context.Context, db *gorm.DB, geneIDs []string) (map[string][]types.GeneTrackExon, error) {
	exonsByGene := map[string][]types.GeneTrackExon{}
	if len(geneIDs) == 0 {
		return exonsByGene, nil
	}
	e, rt := types.EnsemblExonByGeneTable, types.GeneReferenceTranscriptTable
	var exons []struct {
		GeneID string
		Start  int
		End    int
	}
	err := db.WithContext(ctx).
		Table(fmt.Sprintf("%s %s", e.TenantQualifiedName(ctx), e.Alias)).
		Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.ensembl_gene_id = %s.gene_id AND array_contains(%s.transcript_ids, %s.ensembl_transcript_id)",
			rt.TenantQualifiedName(ctx), rt.Alias, rt.Alias, e.Alias, e.Alias, rt.Alias)).
		Where(fmt.Sprintf("%s.gene_id IN ?", e.Alias), geneIDs).
		Distinct(fmt.Sprintf("%[1]s.gene_id, %[1]s.start, %[1]s.end", e.Alias)).
		Order(fmt.Sprintf("%[1]s.gene_id, %[1]s.start, %[1]s.end", e.Alias)).
		Find(&exons).Error
	if err != nil {
		return nil, fmt.Errorf("error fetching exons: %w", err)
	}
	for _, x := range exons {
		exonsByGene[x.GeneID] = append(exonsByGene[x.GeneID], types.GeneTrackExon{Start: x.Start, End: x.End})
	}
	return exonsByGene, nil
}
