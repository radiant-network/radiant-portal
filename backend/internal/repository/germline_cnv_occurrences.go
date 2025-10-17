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
	AggregateOccurrences(seqId int, userQuery types.AggQuery) ([]Aggregation, error)
	GetStatisticsOccurrences(seqId int, query types.StatisticsQuery) (*Statistics, error)
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
	tx, err := r.prepareQuery(seqId, userQuery)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	if userQuery != nil && userQuery.Filters() != nil && userQuery.HasFieldFromTables(types.GenePanelsTables...) {
		// We group by name to avoid duplicates when joining with gene panels tables
		// and use any_value for other fields to satisfy sql requirements
		// Example of query :
		// SELECT cnvo.cnv_id as id,any_value(cnvo.seq_id) as seq_id,any_value(cnvo.aliquot) as aliquot,any_value(cnvo.chromosome) as chromosome,...
		// LEFT JOIN omim_gene_panel om ON array_contains(cnvo.symbol, om.symbol)
		// WHERE (seq_id = 1 and part=1) AND om.panel IN ('panel1', 'panel2') GROUP BY `name`
		// ORDER BY name asc LIMIT 10
		tx = tx.Group("cnv_id")
		var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
			if field.Name == "cnv_id" {
				return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
			}

			return fmt.Sprintf("any_value(%s.%s) as %s", field.Table.Alias, field.Name, field.GetAlias())
		})

		tx = tx.Select(columns)
		// We dont use AdddSort because we want to sort on aggregated fields
		for _, sort := range userQuery.SortedFields() {
			s := fmt.Sprintf("%s %s", sort.Field.GetAlias(), sort.Order)
			tx = tx.Order(s)
		}

	} else {
		var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
			return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
		})
		tx = tx.Select(columns)
		utils.AddSort(tx, userQuery)
	}

	utils.AddLimit(tx, userQuery)

	if err = tx.Find(&occurrences).Error; err != nil {
		return nil, fmt.Errorf("error fetching CNV occurrences: %w", err)
	}

	return occurrences, nil
}

func (r *GermlineCNVOccurrencesRepository) CountOccurrences(seqId int, userQuery types.CountQuery) (int64, error) {
	tx, err := r.prepareQuery(seqId, userQuery)
	if err != nil {
		return 0, fmt.Errorf("error during query preparation %w", err)
	}

	if userQuery != nil && userQuery.Filters() != nil && userQuery.HasFieldFromTables(types.GenePanelsTables...) {
		tx = tx.Distinct(fmt.Sprintf("%s.cnv_id", types.GermlineCNVOccurrenceTable.Alias))
	}
	var count int64
	if err = tx.Count(&count).Error; err != nil {
		return 0, fmt.Errorf("error fetching occurrences: %w", err)
	}
	return count, nil
}

func (r *GermlineCNVOccurrencesRepository) prepareQuery(seqId int, userQuery types.Query) (*gorm.DB, error) {
	part, err := utils.GetSequencingPart(seqId, r.db)
	if err != nil {
		return nil, fmt.Errorf("error during partition fetch %w", err)
	}

	tx := r.db.Table(
		fmt.Sprintf("%s %s", types.GermlineCNVOccurrenceTable.Name, types.GermlineCNVOccurrenceTable.Alias),
	).Where("seq_id = ? and part=?", seqId, part)

	if userQuery != nil && userQuery.HasFieldFromTables(types.GenePanelsTables...) {
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

func (r *GermlineCNVOccurrencesRepository) AggregateOccurrences(seqId int, userQuery types.AggQuery) ([]Aggregation, error) {
	tx, err := r.prepareQuery(seqId, userQuery)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	var aggregation []Aggregation
	var aggCol = userQuery.GetAggregateField()
	var sel string
	if aggCol.IsArray {
		//Example :
		// SELECT unnest as bucket, count(distinct cnvo.name) as count
		// FROM germline__cnv__occurrence cnvo join unnest(cnvo.cytoband) as unnest on true
		// WHERE (seq_id = 2 and part=1) AND cnvo.cytoband is not null GROUP BY `bucket` ORDER BY count asc, bucket asc
		unnestJoin := fmt.Sprintf("join unnest(%s.%s) as unnest on true", aggCol.Table.Alias, aggCol.Name)
		tx = tx.Joins(unnestJoin)
		sel = fmt.Sprintf("unnest as bucket, count(distinct %s.cnv_id) as count", types.GermlineCNVOccurrenceTable.Alias)
	} else {
		sel = fmt.Sprintf("%s.%s as bucket, count(distinct %s.cnv_id) as count", aggCol.Table.Alias, aggCol.Name, types.GermlineCNVOccurrenceTable.Alias)
	}

	tx = tx.Select(sel).
		Where(fmt.Sprintf("%s.%s is not null", aggCol.Table.Alias, aggCol.Name)). //We don't want to count null values
		Group("bucket").Order("count asc, bucket asc")
	if err = tx.Find(&aggregation).Error; err != nil {
		return nil, fmt.Errorf("error query aggregation: %w", err)
	}
	return aggregation, nil
}

func (r *GermlineCNVOccurrencesRepository) GetStatisticsOccurrences(seqId int, userQuery types.StatisticsQuery) (*types.Statistics, error) {
	tx, err := r.prepareQuery(seqId, userQuery)
	var statistics types.Statistics
	if err != nil {
		return &statistics, fmt.Errorf("error during query preparation %w", err)
	}
	targetCol := userQuery.GetTargetedField()
	var sel string
	if targetCol.IsArray {
		sel = fmt.Sprintf("MIN(ARRAY_MIN(%s.%s)) as min, MAX(ARRAY_MAX(%s.%s)) as max", targetCol.Table.Alias, targetCol.Name, targetCol.Table.Alias, targetCol.Name)
	} else {
		sel = fmt.Sprintf("MIN(%s.%s) as min, MAX(%s.%s) as max", targetCol.Table.Alias, targetCol.Name, targetCol.Table.Alias, targetCol.Name)
	}
	tx = tx.Select(sel)
	if err = tx.Find(&statistics).Error; err != nil {
		return nil, fmt.Errorf("error query statistics: %w", err)
	}
	statistics.Type = targetCol.Type
	return &statistics, nil
}
