package repository

import (
	"errors"
	"fmt"
	"regexp"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Gene = types.Gene
type GeneResult = types.GeneResult
type AutoCompleteGene = types.AutoCompleteGene

type GenesRepository struct {
	db *gorm.DB
}

func NewGenesRepository(db *gorm.DB) *GenesRepository {
	return &GenesRepository{db: db}
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

func (r *GenesRepository) GetGeneAutoComplete(prefix string, limit int) (*[]AutoCompleteGene, error) {

	// Alias match collapses the array to a string rather than array_filter(alias, x -> ...):
	// a derived ARRAY crossing the ORDER BY exchange crashes the StarRocks 3.5.18 CN.
	//SELECT gene_id, name, (case WHEN name LIKE 'F%' THEN 1 ELSE (CASE WHEN gene_id LIKE 'F%' THEN 2 ELSE (CASE WHEN UPPER(CONCAT('||', array_join(alias, '||'))) LIKE '%||F%' THEN 3 ELSE 4 END) END) END) weight
	//FROM ensembl_gene
	//WHERE UPPER(name) like 'F%' or UPPER(gene_id) like 'F%' or UPPER(CONCAT('||', array_join(alias, '||'))) LIKE '%||F%'
	//ORDER BY weight ASC, name ASC
	//LIMIT 10;

	like := fmt.Sprintf("%s%%", strings.ToUpper(prefix))
	aliasLike := fmt.Sprintf("%%||%s%%", strings.ToUpper(prefix))
	tx := r.db.Table(types.EnsemblGeneTable.Name)
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

func (r *GenesRepository) SearchGenes(inputs []string) (*[]GeneResult, error) {
	upperInputs := make([]string, 0)

	for _, input := range inputs {
		upperInputs = append(upperInputs, strings.ToUpper(input))
	}

	tx := r.db.Table(types.EnsemblGeneTable.Name)
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
