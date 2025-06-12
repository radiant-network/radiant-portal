package types

import (
	"fmt"
	"github.com/Goldziher/go-utils/sliceutils"
	"slices"
)

type Query interface {
	Filters() FilterNode
	HasFieldFromTables(tables ...Table) bool
	GetFieldsFromTables(tables ...Table) []Field
}

type QueryConfig struct {
	AllFields     []Field
	DefaultFields []Field
	DefaultSort   []SortField
	IdField       Field
}

type ListQuery interface {
	SelectedFields() []Field
	Filters() FilterNode
	Pagination() *Pagination
	SortedFields() []SortField
	HasFieldFromTables(tables ...Table) bool
	GetFieldsFromTables(tables ...Table) []Field
}
type listQuery struct {
	filters        FilterNode //Root node of the filter tree
	filteredFields []Field    //Fields used in the filters
	selectedFields []Field    //Fields used for selection
	pagination     *Pagination
	sortedFields   []SortField
}

func (l *listQuery) HasFieldFromTables(tables ...Table) bool {
	return sliceutils.Some(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return slices.Contains(tables, field.Table)
	}) || sliceutils.Some(l.selectedFields, func(field Field, index int, slice []Field) bool {
		return slices.Contains(tables, field.Table)
	})

}

func (l *listQuery) GetFieldsFromTables(tables ...Table) []Field {
	filtered := sliceutils.Filter(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return slices.Contains(tables, field.Table)
	})
	selected := sliceutils.Filter(l.selectedFields, func(field Field, index int, slice []Field) bool {
		return slices.Contains(tables, field.Table)
	})
	return sliceutils.Unique(sliceutils.Merge(filtered, selected))
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
	Limit     int //Limit the number of results
	Offset    int //Offset the results in case it's an infinite scroll
	PageIndex int //PageIndex the page index in case there is pagination
}

func ResolvePagination(limit int, offset int, pageIndex int) *Pagination {
	var p Pagination
	if limit != 0 && pageIndex != 0 {
		p = Pagination{Limit: limit, PageIndex: pageIndex}
	} else if limit != 0 && offset != 0 {
		p = Pagination{Limit: limit, Offset: offset}
	} else if limit != 0 {
		p = Pagination{Limit: limit, Offset: 0}
	} else {
		p = Pagination{Limit: 10, Offset: 0}
	}
	return &p
}

func NewListQueryFromSqon(config QueryConfig, additional []string, sqon *Sqon, pagination *Pagination, sorted []SortBody) (ListQuery, error) {

	// Define allowed selectedCols
	selectedFields := findSelectedFields(config.AllFields, additional, config.DefaultFields)

	// Define allowed sortedCols
	sortedField := findSortedFields(config.AllFields, sorted, config.DefaultSort, config.IdField)

	if sqon != nil {
		root, visitedFilteredFields, err := sqonToFilter(sqon, config.AllFields, nil)
		if err != nil {
			return nil, fmt.Errorf("error during build list query from sqon %w", err)
		}
		return &listQuery{selectedFields: selectedFields, filteredFields: visitedFilteredFields, filters: root, pagination: pagination, sortedFields: sortedField}, nil

	} else {
		return &listQuery{selectedFields: selectedFields, pagination: pagination, sortedFields: sortedField}, nil
	}
}

func NewListQueryFromCriteria(config QueryConfig, additional []string, searchCriteria []SearchCriterion, pagination *Pagination, sorted []SortBody) (ListQuery, error) {

	// Define allowed selectedCols
	selectedFields := findSelectedFields(config.AllFields, additional, config.DefaultFields)

	// Define allowed sortedCols
	sortedField := findSortedFields(config.AllFields, sorted, config.DefaultSort, config.IdField)

	if len(searchCriteria) != 0 {
		root, visitedFilteredFields, err := criteriaToFilter(searchCriteria, config.AllFields)
		if err != nil {
			return nil, fmt.Errorf("error during build list query from search criteria %w", err)
		}
		return &listQuery{selectedFields: selectedFields, filteredFields: visitedFilteredFields, filters: root, pagination: pagination, sortedFields: sortedField}, nil

	} else {
		return &listQuery{selectedFields: selectedFields, pagination: pagination, sortedFields: sortedField}, nil
	}
}

type AggQuery interface {
	Filters() FilterNode
	GetAggregateField() Field
	HasFieldFromTables(tables ...Table) bool
	GetFieldsFromTables(tables ...Table) []Field
}

type aggQuery struct {
	filters        FilterNode //Root node of the filter tree
	filteredFields []Field    //Fields used in the filters
	aggregateField Field      //Fields used for selection
}

func (l *aggQuery) HasFieldFromTables(tables ...Table) bool {
	return slices.Contains(tables, l.aggregateField.Table) || (l.filteredFields != nil && sliceutils.Some(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return slices.Contains(tables, field.Table)
	}))
}

func (l *aggQuery) GetFieldsFromTables(tables ...Table) []Field {
	filtered := sliceutils.Filter(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return slices.Contains(tables, field.Table)
	})

	if slices.Contains(tables, l.aggregateField.Table) {
		return sliceutils.Unique(append(filtered, l.aggregateField))
	}
	return sliceutils.Unique(filtered)
}

func (l *aggQuery) Filters() FilterNode {
	return l.filters
}

func (l *aggQuery) GetAggregateField() Field {
	return l.aggregateField
}

func NewAggregationQueryFromSqon(aggregation string, sqon *Sqon, fields []Field) (AggQuery, error) {
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
	HasFieldFromTables(tables ...Table) bool
	GetFieldsFromTables(tables ...Table) []Field
}

type countQuery struct {
	filters        FilterNode //Root node of the filter tree
	filteredFields []Field    //Fields used in the filters
}

func (l *countQuery) Filters() FilterNode {
	return l.filters
}

func (l *countQuery) HasFieldFromTables(tables ...Table) bool {
	return sliceutils.Some(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return slices.Contains(tables, field.Table)
	})
}
func (l *countQuery) GetFieldsFromTables(tables ...Table) []Field {
	filtered := sliceutils.Filter(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return slices.Contains(tables, field.Table)
	})

	return sliceutils.Unique(filtered)
}

func NewCountQueryFromSqon(sqon *Sqon, fields []Field) (CountQuery, error) {

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

func NewCountQueryFromCriteria(searchCriteria []SearchCriterion, fields []Field) (CountQuery, error) {

	if len(searchCriteria) != 0 {
		root, visitedFilteredFields, err := criteriaToFilter(searchCriteria, fields)
		if err != nil {
			return nil, fmt.Errorf("error during build count query from search criteria %w", err)
		}
		return &countQuery{filteredFields: visitedFilteredFields, filters: root}, nil

	} else {
		return &countQuery{}, nil
	}
}

type StatisticsQuery interface {
	Filters() FilterNode
	GetTargetedField() *Field
	HasFieldFromTables(tables ...Table) bool
	GetFieldsFromTables(tables ...Table) []Field
}

type statisticsQuery struct {
	filters        FilterNode //Root node of the filter tree
	filteredFields []Field    //Fields used in the filters
	targetedField  *Field     //Field targeted for statistics
}

func (l *statisticsQuery) Filters() FilterNode {
	return l.filters
}

func (l *statisticsQuery) GetTargetedField() *Field {
	return l.targetedField
}

func (l *statisticsQuery) HasFieldFromTables(tables ...Table) bool {
	return slices.Contains(tables, l.targetedField.Table) || (l.filteredFields != nil && sliceutils.Some(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return slices.Contains(tables, field.Table)
	}))
}

func (l *statisticsQuery) GetFieldsFromTables(tables ...Table) []Field {
	filtered := sliceutils.Filter(l.filteredFields, func(field Field, index int, slice []Field) bool {
		return slices.Contains(tables, field.Table)
	})

	if slices.Contains(tables, l.targetedField.Table) {
		return sliceutils.Unique(append(filtered, *l.targetedField))
	}
	return sliceutils.Unique(filtered)
}

func NewStatisticsQueryFromSqon(field string, sqon *Sqon, fields []Field) (StatisticsQuery, error) {
	// Define allowed target col
	target := findNumericByAlias(fields, field)
	if target != nil {
		if sqon != nil {
			root, visitedFilteredFields, err := sqonToFilter(sqon, fields, nil)
			if err != nil {
				return nil, fmt.Errorf("error during build statistics query %w", err)
			}
			return &statisticsQuery{filteredFields: visitedFilteredFields, filters: root, targetedField: target}, nil

		} else {
			return &statisticsQuery{targetedField: target}, nil
		}
	} else {
		return nil, fmt.Errorf("%s is not a numeric field", field)
	}
}
