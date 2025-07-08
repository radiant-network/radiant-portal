package repository

import (
	"errors"
	"fmt"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type GenePanelCondition = types.GenePanelCondition

type GenePanelsRepository struct {
	db *gorm.DB
}

type GenePanelsDAO interface {
	GetVariantGenePanelConditions(genePanelTable types.Table, locusId int) (*map[string][]GenePanelCondition, error)
}

func NewGenePanelsRepository(db *gorm.DB) *GenePanelsRepository {
	if db == nil {
		log.Fatal("GenePanelsRepository: db is nil")
		return nil
	}
	return &GenePanelsRepository{db: db}
}

func (r *GenePanelsRepository) GetVariantGenePanelConditions(genePanelTable types.Table, locusId int) (*map[string][]GenePanelCondition, error) {
	var genePanelConditions []GenePanelCondition
	var genePanelConditionsPerSymbol = make(map[string][]GenePanelCondition)
	txGene := r.db.Table(types.ConsequenceTable.Name).Where("locus_id = ?", locusId).Distinct("symbol")

	tx := r.db.Table(genePanelTable.Name)
	tx = tx.Where("symbol in (?)", txGene)

	switch genePanelTable {
	case types.OmimGenePanelTable:
		tx = tx.Select("symbol, panel as panel_name, inheritance_code, omim_phenotype_id as panel_id")
		break

	case types.HpoGenePanelTable:
		tx = tx.Select("symbol, hpo_term_name as panel_name, hpo_term_id as panel_id")
		break

	case types.DddGenePanelTable:
	case types.CosmicGenePanelTable:
		tx = tx.Select("symbol, panel as panel_name")
		break

	case types.OrphanetGenePanelTable:
		tx = tx.Select("symbol, panel as panel_name, disorder_id as panel_id, type_of_inheritance as inheritance_code")
		break

	default:
		return nil, fmt.Errorf("error while fetching variant gene panel conditions: invalid table")
	}

	if err := tx.Find(&genePanelConditions).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching variant gene panel conditions: %w", err)
		} else {
			return nil, nil
		}
	}

	for _, s := range genePanelConditions {
		if value, ok := genePanelConditionsPerSymbol[s.Symbol]; ok {
			genePanelConditionsPerSymbol[s.Symbol] = append(value, s)
		} else {
			//genePanelConditionsList := make([]GenePanelCondition, 0)
			//genePanelConditionsList = append(genePanelConditionsList, s)
			genePanelConditionsPerSymbol[s.Symbol] = []GenePanelCondition{s}
		}
	}
	return &genePanelConditionsPerSymbol, nil
}
