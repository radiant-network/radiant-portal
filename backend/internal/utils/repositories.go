package utils

import (
	"fmt"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const (
	MinLimit = 10
	MaxLimit = 200
)

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

func AddLimitAndSort(tx *gorm.DB, userQuery types.ListQuery) {
	if userQuery.Pagination() != nil {
		var l int
		if userQuery.Pagination().Limit < MaxLimit {
			l = userQuery.Pagination().Limit
		} else {
			l = MaxLimit
		}
		if userQuery.Pagination().PageIndex != 0 {
			tx = tx.Limit(l).Offset(userQuery.Pagination().PageIndex * l)
		} else {
			tx = tx.Limit(l).Offset(userQuery.Pagination().Offset)
		}
	} else {
		tx = tx.Limit(MinLimit)
	}
	AddSort(tx, userQuery)
}

func GetDistinctTablesFromFields(fields []types.Field) []types.Table {
	tables := sliceutils.Unique(sliceutils.Map(fields, func(field types.Field, index int, slice []types.Field) types.Table {
		return field.Table
	}))
	return tables
}
