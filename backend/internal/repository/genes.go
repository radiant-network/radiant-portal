package repository

import (
	"errors"
	"fmt"
	"log"
	"regexp"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Gene = types.Gene
type AutoCompleteGene = types.AutoCompleteGene

type GenesRepository struct {
	db *gorm.DB
}

type GenesDAO interface {
	GetGeneAutoComplete(prefix string, limit int) (*[]AutoCompleteGene, error)
}

func NewGenesRepository(db *gorm.DB) *GenesRepository {
	if db == nil {
		log.Print("GenesRepository: db is nil")
		return nil
	}
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

	//SELECT gene_id, name, (case WHEN name LIKE 'F%' THEN 1 ELSE (CASE WHEN gene_id LIKE 'F%' THEN 2 ELSE (CASE WHEN array_length(array_filter(alias, x -> UPPER(x) LIKE 'F%')) > 0 THEN 3 ELSE 4 END) END) END) weight
	//FROM ensembl_gene
	//WHERE UPPER(name) like 'F%' or UPPER(gene_id) like 'F%' or array_length(array_filter(alias, x -> UPPER(x) LIKE 'F%')) > 0
	//ORDER BY weight ASC, name ASC
	//LIMIT 10;

	like := fmt.Sprintf("%s%%", strings.ToUpper(prefix))
	tx := r.db.Table(types.EnsemblGeneTable.Name)
	tx = tx.Select("gene_id, name, (case WHEN name LIKE ? THEN 1 ELSE (CASE WHEN gene_id LIKE ? THEN 2 ELSE (CASE WHEN array_length(array_filter(alias, x -> UPPER(x) LIKE ?)) > 0 THEN 3 ELSE 4 END) END) END) weight", like, like, like)
	tx = tx.Where("UPPER(name) like ? or UPPER(gene_id) like ? or array_length(array_filter(alias, x -> UPPER(x) LIKE ?)) > 0", like, like, like)
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
