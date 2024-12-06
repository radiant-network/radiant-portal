package types

import (
	"fmt"
	"github.com/Goldziher/go-utils/sliceutils"
)

type Query interface {
	Filters() FilterNode
	HasFieldFromTable(table Table) bool
}

type ListQuery interface {
	SelectedFields() []Field
	Filters() FilterNode
	Pagination() *Pagination
	SortedFields() []SortField
	HasFieldFromTable(table Table) bool
}
type listQuery struct {
	filters        FilterNode //Root node of the filter tree
	filteredFields []Field    //Fields used in the filters
	selectedFields []Field    //Fields used for selection
	pagination     *Pagination
	sortedFields   []SortField
}

func (l *listQuery) HasFieldFromTable(table Table) bool {
	return sliceutils.Some(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return field.Table == table
	}) || sliceutils.Some(l.selectedFields, func(field Field, index int, slice []Field) bool {
		return field.Table == table
	})

}

func (l *listQuery) Filters() FilterNode {
	return l.filters
}

func (l *listQuery) SelectedFields() []Field {
	return l.selectedFields
}

func (l *listQuery) Pagination() *Pagination {
	return l.pagination
}

func (l *listQuery) SortedFields() []SortField {
	return l.sortedFields
}

type SortField struct {
	Field Field
	Order string
}

type Pagination struct {
	Limit  int //Limit the number of results
	Offset int //Offset the results
}

func NewListQuery(selected []string, sqon *SQON, fields []Field, pagination *Pagination, sorted []SortBody) (ListQuery, error) {

	// Define allowed selectedCols
	selectedFields := findSelectedFields(fields, selected)

	// Define allowed sortedCols
	sortedField := findSortedFields(fields, sorted)

	if sqon != nil {
		root, visitedFilteredFields, err := sqonToFilter(sqon, fields, nil)
		if err != nil {
			return nil, fmt.Errorf("error during build list query %w", err)
		}
		return &listQuery{selectedFields: selectedFields, filteredFields: visitedFilteredFields, filters: root, pagination: pagination, sortedFields: sortedField}, nil

	} else {
		return &listQuery{selectedFields: selectedFields, pagination: pagination, sortedFields: sortedField}, nil
	}
}

type AggQuery interface {
	Filters() FilterNode
	GetAggregateField() Field
	HasFieldFromTable(table Table) bool
}

type aggQuery struct {
	filters        FilterNode //Root node of the filter tree
	filteredFields []Field    //Fields used in the filters
	aggregateField Field      //Fields used for selection
}

func (l *aggQuery) HasFieldFromTable(table Table) bool {
	return l.aggregateField.Table == table || (l.filteredFields != nil && sliceutils.Some(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return field.Table == table
	}))
}
func (l *aggQuery) Filters() FilterNode {
	return l.filters
}

func (l *aggQuery) GetAggregateField() Field {
	return l.aggregateField
}

func NewAggregationQuery(aggregation string, sqon *SQON, fields []Field) (AggQuery, error) {
	// Define allowed aggregated cols
	aggregate, err := findAggregatedField(fields, aggregation)
	if err != nil {
		return nil, fmt.Errorf("error during build aggregation %w", err)
	}
	selectedFields := []Field{aggregate}

	if sqon != nil {
		root, visitedFilteredFields, err2 := sqonToFilter(sqon, fields, selectedFields)
		return &aggQuery{filters: root, filteredFields: visitedFilteredFields, aggregateField: aggregate}, err2
	} else {
		return &aggQuery{aggregateField: aggregate}, nil
	}
}

type CountQuery interface {
	Filters() FilterNode
	HasFieldFromTable(table Table) bool
}

type countQuery struct {
	filters        FilterNode //Root node of the filter tree
	filteredFields []Field    //Fields used in the filters
}

func (l *countQuery) Filters() FilterNode {
	return l.filters
}

func (l *countQuery) HasFieldFromTable(table Table) bool {
	return sliceutils.Some(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return field.Table == table
	})
}

func NewCountQuery(sqon *SQON, fields []Field) (CountQuery, error) {

	if sqon != nil {
		root, visitedFilteredFields, err := sqonToFilter(sqon, fields, nil)
		if err != nil {
			return nil, fmt.Errorf("error during build list query %w", err)
		}
		return &countQuery{filteredFields: visitedFilteredFields, filters: root}, nil

	} else {
		return &countQuery{}, nil
	}
}
