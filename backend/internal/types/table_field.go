package types

import (
	"context"
	"fmt"

	"github.com/Goldziher/go-utils/sliceutils"
)

type Table struct {
	Name           string // Name of the table
	Alias          string // Alias of the table to use in query
	FederationName string // FederationName name through Starrocks federation
	PerTenant      bool   // If the table lives in the tenant DB (true) or the shared DB (false).
}

// In qualifies the table by a StarRocks schema (database), e.g.
// CaseTable.In("radiant_jdbc.public") → "radiant_jdbc.public.cases" and
// CaseTable.In("demo_tenant") → "demo_tenant.cases". Combined with TenantSchema it
// replaces the static FederationName on read paths so the active tenant's views are used.
func (t Table) In(schema string) string {
	return schema + "." + t.Name
}

// TenantQualifiedName returns the table name to write into SQL for the active request. Residency is
// declared once on the Table (FederationName / PerTenant) and read here.
func (t Table) TenantQualifiedName(ctx context.Context) string {
	switch {
	case t.FederationName != "":
		return t.In(TenantSchema(ctx))
	case t.PerTenant:
		return t.qualifyWith(TenantDatabaseOrEmpty(ctx))
	default:
		return t.qualifyWith(SharedDatabaseOrEmpty(ctx))
	}
}

func (t Table) qualifyWith(database string) string {
	if database == "" {
		return t.Name
	}
	return database + "." + t.Name
}

const (
	IntegerType = "integer"
	DecimalType = "decimal"
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
	IsArray         bool   // Whether the field is an array
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

func (f *Field) IsNumeric() bool {
	return f.Type == IntegerType || f.Type == DecimalType
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
	selectedFields = append(selectedFields, defaultFields...)
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
