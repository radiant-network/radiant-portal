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
		column := fmt.Sprintf("%s.%s", sort.Field.Table.Alias, sort.Field.GetName())
		nulls := ""
		if sort.Field.SortNullsLast {
			nulls = " NULLS LAST"
		}
		if sort.Field.SortFirstValue != "" {
			firstValueOrder := "DESC"
			if sort.Order == "desc" {
				firstValueOrder = "ASC"
			}
			tx = tx.Order(fmt.Sprintf("%s = '%s' %s%s", column, sort.Field.SortFirstValue, firstValueOrder, nulls))
		}
		tx = tx.Order(fmt.Sprintf("%s %s%s", column, sort.Order, nulls))
	}
}

func AddWhere(userQuery types.Query, tx *gorm.DB) {
	AddWhereWithCaseSearchSQL(userQuery, tx, nil, nil)
}

// A case semi-join field filtered without its rows, or a computed field without its SQL, would leave a broken WHERE:
// the query fails with an explicit error instead.
func AddWhereWithCaseSearchSQL(userQuery types.Query, tx *gorm.DB, semiJoinRows types.CaseSemiJoinRows, computedColumns types.CaseComputedColumns) {
	if userQuery.Filters() == nil {
		return
	}
	for _, table := range types.CaseSemiJoinTables(userQuery.Filters()) {
		if semiJoinRows[table.Alias] == "" {
			_ = tx.AddError(fmt.Errorf("case semi-join table %s is filtered but the query gives none of its rows", table.Alias))
			return
		}
	}
	for _, alias := range types.CaseComputedFieldAliases(userQuery.Filters()) {
		if computedColumns[alias] == "" {
			_ = tx.AddError(fmt.Errorf("computed field %s is filtered but the query gives none of its SQL", alias))
			return
		}
	}
	filters, params := userQuery.Filters().ToSQL(nil, semiJoinRows, computedColumns)
	tx.Where(filters, params...)
}

// AddPagination applies a resolved pagination to any query, whether or not it comes from the
// sqon/criteria machinery. Limit is capped at MaxLimit.
func AddPagination(tx *gorm.DB, pagination *types.Pagination) {
	if pagination == nil {
		tx.Limit(MinLimit)
		return
	}
	l := min(pagination.Limit, MaxLimit)
	if pagination.PageIndex != 0 {
		tx.Limit(l).Offset(pagination.PageIndex * l)
	} else {
		tx.Limit(l).Offset(pagination.Offset)
	}
}

func AddPaginationAndSort(tx *gorm.DB, userQuery types.ListQuery) {
	AddPagination(tx, userQuery.Pagination())
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
	tx = tx.Group("case_id, patient_id, fetus_id")
	tx = tx.Select("obs.case_id as case_id, obs.patient_id as patient_id, obs.fetus_id as fetus_id, GROUP_CONCAT(CONCAT(hpo.id,'__',hpo.name) SEPARATOR '|') as phenotypes_term")

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
