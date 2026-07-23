package utils

import (
	"context"
	"fmt"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const (
	MinLimit = 10
	MaxLimit = 200
)

// CtxOf returns the context carried on the query or context.Background() when none is bound.
// Useful to infer table qualification (tenant or shared).
func CtxOf(tx *gorm.DB) context.Context {
	if tx == nil || tx.Statement == nil || tx.Statement.Context == nil {
		return context.Background()
	}
	return tx.Statement.Context
}

func AddSort(tx *gorm.DB, userQuery types.ListQuery) {
	for _, sort := range userQuery.SortedFields() {
		s := fmt.Sprintf("%s.%s %s", sort.Field.Table.Alias, sort.Field.GetName(), sort.Order)
		tx = tx.Order(s)
	}
}

func AddWhere(userQuery types.Query, tx *gorm.DB) {
	if userQuery.Filters() != nil {
		filters, params := userQuery.Filters().ToSQL(nil)
		tx.Where(filters, params...)
	}
}

func AddLimit(tx *gorm.DB, userQuery types.ListQuery) {
	if userQuery.Pagination() != nil {
		var l int
		if userQuery.Pagination().Limit < MaxLimit {
			l = userQuery.Pagination().Limit
		} else {
			l = MaxLimit
		}
		if userQuery.Pagination().PageIndex != 0 {
			tx.Limit(l).Offset(userQuery.Pagination().PageIndex * l)
		} else {
			tx.Limit(l).Offset(userQuery.Pagination().Offset)
		}
	} else {
		tx.Limit(MinLimit)
	}
}

func AddLimitAndSort(tx *gorm.DB, userQuery types.ListQuery) {
	AddLimit(tx, userQuery)
	AddSort(tx, userQuery)
}

func GetDistinctTablesFromFields(fields []types.Field) []types.Table {
	tables := sliceutils.Unique(sliceutils.Map(fields, func(field types.Field, index int, slice []types.Field) types.Table {
		return field.Table
	}))
	return tables
}

func GetAggregatedPhenotypes(db *gorm.DB) *gorm.DB {
	tx := db.Table(fmt.Sprintf("%s obs", types.ObsCategoricalTable.TenantQualifiedName(CtxOf(db))))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s hpo ON hpo.id = obs.code_value", types.HPOTable.TenantQualifiedName(CtxOf(db))))
	tx = tx.Where("obs.observation_code = 'phenotype' AND obs.interpretation_code = 'positive'")
	tx = tx.Group("case_id, patient_id")
	tx = tx.Select("obs.case_id as case_id, obs.patient_id as patient_id, GROUP_CONCAT(CONCAT(hpo.id,'__',hpo.name) SEPARATOR '|') as phenotypes_term")

	return tx
}

func GetSequencingPart(seqId int, db *gorm.DB) (int, error) {
	tx := db.Table(types.SequencingTable.TenantQualifiedName(CtxOf(db))).Where("seq_id = ?", seqId).Select("part")
	var part int
	if err := tx.Scan(&part).Error; err != nil {
		return part, fmt.Errorf("error fetching part: %w", err)
	}
	return part, nil
}

func GetFilter(db *gorm.DB, filterTable types.Table, filterLabelColumn string, filterCondition *string) ([]types.FiltersValue, error) {
	var filter []types.FiltersValue
	tx := db.Table(fmt.Sprintf("%s %s", filterTable.TenantQualifiedName(CtxOf(db)), filterTable.Alias))
	tx = tx.Select(fmt.Sprintf("%s.code as `key`, %s.%s as label", filterTable.Alias, filterTable.Alias, filterLabelColumn))
	tx = tx.Order("`key` asc")
	if filterCondition != nil {
		tx = tx.Where(*filterCondition)
	}

	if err := tx.Find(&filter).Error; err != nil {
		return nil, fmt.Errorf("error fetching filter %s: %w", filterTable.Name, err)
	}
	return filter, nil
}
