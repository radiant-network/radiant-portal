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
	ArrayType = "array"
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

func (f *Field) IsArray() bool {
	return f.Type == ArrayType
}

// findByAlias returns the field with the given name from the list of fields
func findByAlias(fields []Field, alias string) *Field {
	if fields == nil {
		return nil
	}
	return sliceutils.Find(fields, func(field Field, index int, slice []Field) bool {
		return field.GetAlias() == alias
	})

}

// findByAlias returns the selectable field with the given name from the list of fields
func findSelectableByAlias(fields []Field, alias string) *Field {
	if fields == nil {
		return nil
	}
	return sliceutils.Find(fields, func(field Field, index int, slice []Field) bool {
		return field.GetAlias() == alias && field.CanBeSelected
	})

}

// findSelectedFields returns the fields that can be selected from the list of string field names
func findSelectedFields(fields []Field, selected []string) []Field {
	var selectedFields []Field
	for _, s := range selected {
		field := findSelectableByAlias(fields, s)
		if field != nil {
			selectedFields = append(selectedFields, *field)
		}
	}
	return selectedFields
}

func findAggregatedField(fields []Field, aggregated string) (Field, error) {
	fieldByName := findByAlias(fields, aggregated)

	if fieldByName != nil && fieldByName.CanBeAggregated {
		return *fieldByName, nil
	} else {
		return Field{}, fmt.Errorf("%s can not be aggregated", aggregated)
	}
}

// findSortedFields returns the fields that can be sorted from the list of SortBody
func findSortedFields(fields []Field, sorted []SortBody) []SortField {
	var sortedFields []SortField
	for _, sort := range sorted {
		field := findByAlias(fields, sort.Field)
		if field != nil && field.CanBeSorted && (sort.Order == "asc" || sort.Order == "desc") {
			sortedFields = append(sortedFields, SortField{Field: *field, Order: sort.Order})
		}
	}
	return sortedFields

}
