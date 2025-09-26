package repository

import (
	"fmt"
	"github.com/radiant-network/radiant-api/internal/utils"
	"log"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type GermlineCNVOccurrence = types.GermlineCNVOccurrence

type GermlineCNVOccurrencesRepository struct {
	db *gorm.DB
}

type GermlineCNVOccurrencesDAO interface {
	GetOccurrences(seqId int, userFilter types.ListQuery) ([]GermlineCNVOccurrence, error)
	CountOccurrences(seqId int, userFilter types.CountQuery) (int64, error)
}

func NewGermlineCNVOccurrencesRepository(db *gorm.DB) *GermlineCNVOccurrencesRepository {
	if db == nil {
		log.Print("GermlineCNVOccurrencesRepository: db is nil")
		return nil
	}
	return &GermlineCNVOccurrencesRepository{db: db}
}

func (r *GermlineCNVOccurrencesRepository) GetOccurrences(seqId int, userQuery types.ListQuery) ([]GermlineCNVOccurrence, error) {
	var occurrences []GermlineCNVOccurrence
	tx, err := r.prepareListOrCountQuery(seqId, userQuery)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	if userQuery != nil && userQuery.Filters() != nil && userQuery.HasFieldFromTables(types.GenePanelsTables...) {
		// We group by name to avoid duplicates when joining with gene panels tables
		// and use any_value for other fields to satisfy sql requirements
		// Example of query :
		// SELECT cnvo.name as name,any_value(cnvo.seq_id) as seq_id,any_value(cnvo.aliquot) as aliquot,any_value(cnvo.chromosome) as chromosome,...
		// LEFT JOIN omim_gene_panel om ON array_contains(cnvo.symbol, om.symbol)
		// WHERE (seq_id = 1 and part=1) AND om.panel IN ('panel1', 'panel2') GROUP BY `name`
		// ORDER BY cnvo.name asc LIMIT 10
		tx = tx.Group("name")
		var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
			if field.Name == "name" {
				return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
			}

			return fmt.Sprintf("any_value(%s.%s) as %s", field.Table.Alias, field.Name, field.GetAlias())
		})

		tx = tx.Select(columns)
	} else {
		var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
			return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
		})
		tx = tx.Select(columns)
	}

	utils.AddLimit(tx, userQuery)
	utils.AddSort(tx, userQuery)

	if err = tx.Find(&occurrences).Error; err != nil {
		return nil, fmt.Errorf("error fetching CNV occurrences: %w", err)
	}

	return occurrences, nil
}

func (r *GermlineCNVOccurrencesRepository) CountOccurrences(seqId int, userQuery types.CountQuery) (int64, error) {
	tx, err := r.prepareListOrCountQuery(seqId, userQuery)
	if err != nil {
		return 0, fmt.Errorf("error during query preparation %w", err)
	}

	if userQuery != nil && userQuery.Filters() != nil && userQuery.HasFieldFromTables(types.GenePanelsTables...) {
		tx = tx.Distinct(fmt.Sprintf("%s.name", types.GermlineCNVOccurrenceTable.Alias))
	}
	var count int64
	if err = tx.Count(&count).Error; err != nil {
		return 0, fmt.Errorf("error fetching occurrences: %w", err)
	}
	return count, nil
}

func (r *GermlineCNVOccurrencesRepository) prepareListOrCountQuery(seqId int, userQuery types.Query) (*gorm.DB, error) {
	part, err := utils.GetSequencingPart(seqId, r.db)
	if err != nil {
		return nil, fmt.Errorf("error during partition fetch %w", err)
	}

	tx := r.db.Table(
		fmt.Sprintf("%s %s", types.GermlineCNVOccurrenceTable.Name, types.GermlineCNVOccurrenceTable.Alias),
	).Where("seq_id = ? and part=?", seqId, part)

	if userQuery != nil && userQuery.Filters() != nil && userQuery.HasFieldFromTables(types.GenePanelsTables...) {
		selectedPanelsField := userQuery.GetFieldsFromTables(types.GenePanelsTables...)
		selectedPanelsTables := utils.GetDistinctTablesFromFields(selectedPanelsField)
		for _, panelsTable := range selectedPanelsTables {
			tx = tx.
				Joins(fmt.Sprintf("LEFT JOIN %s %s ON array_contains(%s.symbol, %s.symbol)", panelsTable.Name, panelsTable.Alias, types.GermlineCNVOccurrenceTable.Alias, panelsTable.Alias))
		}
	}
	utils.AddWhere(userQuery, tx)
	return tx, nil
}
