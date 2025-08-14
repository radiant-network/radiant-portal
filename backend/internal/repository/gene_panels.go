package repository

import (
	"errors"
	"fmt"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
	"strings"
)

type GenePanelCondition = types.GenePanelCondition
type GenePanelConditions = types.GenePanelConditions

type GenePanelsRepository struct {
	db *gorm.DB
}

type GenePanelsDAO interface {
	GetVariantGenePanelConditions(panelType string, locusId int, conditionFilter string) (*GenePanelConditions, error)
}

func NewGenePanelsRepository(db *gorm.DB) *GenePanelsRepository {
	if db == nil {
		log.Print("GenePanelsRepository: db is nil")
		return nil
	}
	return &GenePanelsRepository{db: db}
}

func (r *GenePanelsRepository) GetVariantGenePanelConditions(panelType string, locusId int, conditionFilter string) (*GenePanelConditions, error) {
	var genePanelConditions []GenePanelCondition
	var genePanelConditionsPerSymbol = make(map[string][]GenePanelCondition)
	like := fmt.Sprintf("%%%s%%", conditionFilter)
	panelColumnName := "panel"

	table, err := retrieveTableByPanelType(panelType)
	if err != nil {
		return nil, fmt.Errorf("error while fetching variant gene panel conditions: %s", err)
	}

	txGene := r.db.Table(types.ConsequenceTable.Name).Where("locus_id = ?", locusId).Distinct("symbol")

	tx := r.db.Table((*table).Name)
	tx = tx.Where("symbol in (?)", txGene)

	switch *table {
	case types.OmimGenePanelTable:
		tx = tx.Select("symbol, panel as panel_name, inheritance_code, omim_phenotype_id as panel_id")
		break

	case types.HpoGenePanelTable:
		tx = tx.Select("symbol, hpo_term_name as panel_name, hpo_term_id as panel_id")
		panelColumnName = "hpo_term_name"
		break

	case types.OrphanetGenePanelTable:
		tx = tx.Select("symbol, panel as panel_name, disorder_id as panel_id, inheritance_code")
		break

	default:
		return nil, fmt.Errorf("error while fetching variant gene panel conditions: invalid table")
	}

	if len(conditionFilter) > 0 {
		tx = tx.Where(fmt.Sprintf("LOWER(%s) like ?", panelColumnName), strings.ToLower(like))
	}

	tx = tx.Order("panel_name asc")

	countOmim, err := r.CountGenePanel(types.OmimGenePanelTable, "panel", conditionFilter, txGene)
	if err != nil {
		return nil, fmt.Errorf("error while counting gene panel: %w", err)
	}

	countOrphanet, err := r.CountGenePanel(types.OrphanetGenePanelTable, "panel", conditionFilter, txGene)
	if err != nil {
		return nil, fmt.Errorf("error while counting gene panel: %w", err)
	}

	countHpo, err := r.CountGenePanel(types.HpoGenePanelTable, "hpo_term_name", conditionFilter, txGene)
	if err != nil {
		return nil, fmt.Errorf("error while counting gene panel: %w", err)
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
			genePanelConditionsPerSymbol[s.Symbol] = []GenePanelCondition{s}
		}
	}
	return &GenePanelConditions{
		CountOmim:     *countOmim,
		CountOrphanet: *countOrphanet,
		CountHpo:      *countHpo,
		Conditions:    genePanelConditionsPerSymbol,
	}, nil
}

func retrieveTableByPanelType(panelType string) (*types.Table, error) {
	switch panelType {
	case "omim":
		return &types.OmimGenePanelTable, nil
	case "hpo":
		return &types.HpoGenePanelTable, nil
	case "ddd":
		return &types.DddGenePanelTable, nil
	case "cosmic":
		return &types.CosmicGenePanelTable, nil
	case "orphanet":
		return &types.OrphanetGenePanelTable, nil
	default:
		return nil, fmt.Errorf("error while retrieving gene panel table: invalid panel type")
	}
}

func (r *GenePanelsRepository) CountGenePanel(table types.Table, panelColumnName string, conditionFilter string, geneFilter *gorm.DB) (*int64, error) {
	var count int64
	like := fmt.Sprintf("%%%s%%", conditionFilter)
	txCount := r.db.Table(table.Name).Where("symbol in (?)", geneFilter)
	if len(conditionFilter) > 0 {
		txCount = txCount.Where(fmt.Sprintf("LOWER(%s) like ?", panelColumnName), strings.ToLower(like))
	}
	if err := txCount.Count(&count).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while counting %s gene panel conditions: %w", table.Name, err)
		} else {
			return nil, nil
		}
	}
	return &count, nil
}
