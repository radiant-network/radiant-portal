package types

import (
	"fmt"
	"github.com/Goldziher/go-utils/sliceutils"
)

type Table struct {
	Name  string // Name of the table
	Alias string // Alias of the table to use in query
}

const (
	ArrayType   = "array"
	NumericType = "numeric"
)

type Field struct {
	Name            string // Name of the field, correspond to column name
	Alias           string // Alias of the field to use in query
	CanBeSelected   bool   // Whether the field is authorized for selection
	CanBeFiltered   bool   // Whether the field is authorized for filtering
	CanBeSorted     bool   // Whether the field is authorized for sorting
	CanBeAggregated bool   // Whether the field is authorized for aggregation
	CustomOp        string // Custom operation, e.g., "array_contains"
	DefaultOp       string // Default operation to use if no custom one exists
	Table           Table  // Table to which the field belongs
	Type            string // Type of the field
}

// GetAlias returns the alias of the field if it is set, otherwise returns the name
func (f *Field) GetAlias() string {
	if f.Alias != "" {
		return f.Alias
	} else {
		return f.Name
	}
}

// GetName returns the name of the field
func (f *Field) GetName() string {
	return f.Name
}

func (f *Field) IsArray() bool {
	return f.Type == ArrayType
}
func (f *Field) IsNumeric() bool {
	return f.Type == NumericType
}

// findSortableByAlias returns the sortable field with the given name from the list of fields
func findSortableByAlias(fields []Field, alias string) *Field {
	if fields == nil {
		return nil
	}
	return sliceutils.Find(fields, func(field Field, index int, slice []Field) bool {
		return field.GetAlias() == alias && field.CanBeSorted
	})
}

// findFilterByAlias returns the filter field with the given name from the list of fields
func findFilterByAlias(fields []Field, alias string) *Field {
	if fields == nil {
		return nil
	}
	return sliceutils.Find(fields, func(field Field, index int, slice []Field) bool {
		return field.GetAlias() == alias && field.CanBeFiltered
	})
}

// findSelectableByAlias returns the selectable field with the given name from the list of fields
func findSelectableByAlias(fields []Field, alias string) *Field {
	if fields == nil {
		return nil
	}
	return sliceutils.Find(fields, func(field Field, index int, slice []Field) bool {
		return field.GetAlias() == alias && field.CanBeSelected
	})
}

// findAggregableByAlias returns the aggregable field with the given name from the list of fields
func findAggregableByAlias(fields []Field, alias string) *Field {
	if fields == nil {
		return nil
	}
	return sliceutils.Find(fields, func(field Field, index int, slice []Field) bool {
		return field.GetAlias() == alias && field.CanBeAggregated
	})
}

// findNumericByAlias returns the numeric field with the given name from the list of fields
func findNumericByAlias(fields []Field, alias string) *Field {
	if fields == nil {
		return nil
	}
	return sliceutils.Find(fields, func(field Field, index int, slice []Field) bool {
		return field.GetAlias() == alias && field.IsNumeric()
	})
}

// findSelectedFields returns the fields that can be selected from the list of string field names
func findSelectedFields(fields []Field, additional []string, defaultFields []Field) []Field {
	var selectedFields []Field
	for _, s := range defaultFields {
		selectedFields = append(selectedFields, s)
	}
	for _, s := range additional {
		field := findSelectableByAlias(fields, s)
		if field != nil {
			selectedFields = append(selectedFields, *field)
		}
	}
	return selectedFields
}

func findAggregatedField(fields []Field, aggregated string) (Field, error) {
	fieldByName := findAggregableByAlias(fields, aggregated)

	if fieldByName != nil {
		return *fieldByName, nil
	} else {
		return Field{}, fmt.Errorf("%s can not be aggregated", aggregated)
	}
}

// findSortedFields returns the fields that can be sorted from the list of SortBody
func findSortedFields(fields []Field, sorted []SortBody, defaultSort []SortField, idField Field) []SortField {
	var sortedFields []SortField
	if len(sorted) == 0 {
		sortedFields = append(sortedFields, defaultSort...)
		sortedFields = append(sortedFields, SortField{Field: idField, Order: "asc"})
		return sortedFields
	}
	for _, sort := range sorted {
		field := findSortableByAlias(fields, sort.Field)
		if field != nil && (sort.Order == "asc" || sort.Order == "desc") {
			sortedFields = append(sortedFields, SortField{Field: *field, Order: sort.Order})
		}
	}
	sortedFields = append(sortedFields, SortField{Field: idField, Order: "asc"})
	return sortedFields
}
