package types

import (
	"github.com/magiconair/properties/assert"
	"testing"
)

func Test_FieldGetAlias_Return_Alias_If_Not_Empty(t *testing.T) {
	t.Parallel()
	f := Field{
		Name:  "name",
		Alias: "alias",
	}
	assert.Equal(t, f.GetAlias(), "alias")
}

func Test_FieldGetAlias_Return_Name_If_Empty(t *testing.T) {
	t.Parallel()
	f := Field{
		Name: "name",
	}
	assert.Equal(t, f.GetAlias(), "name")
}

func Test_FindSortedFields_Return_Only_Valid_Field_And_Field_That_Can_Be_Sorted(t *testing.T) {
	t.Parallel()
	fields := []Field{
		{Name: "field1", CanBeSorted: true},
		{Name: "field2", CanBeSorted: false},
		{Name: "field3", CanBeSorted: true},
		LocusIdField,
	}
	sorted := []SortBody{
		{Field: "field1", Order: "asc"},
		{Field: "field2", Order: "desc"},
		{Field: "field3", Order: "asc"},
		{Field: "field4", Order: "asc"},
	}
	expected := []SortField{
		{Field: fields[0], Order: "asc"},
		{Field: fields[2], Order: "asc"},
		{Field: fields[3], Order: "asc"},
	}
	result := findSortedFields(fields, sorted)
	assert.Equal(t, result, expected)
}

func Test_FindSortedFields_Filter_out_Field_With_Bad_Order(t *testing.T) {
	t.Parallel()
	fields := []Field{
		{Name: "field1", CanBeSorted: true},
		{Name: "field2", CanBeSorted: false},
		{Name: "field3", CanBeSorted: true},
		LocusIdField,
	}
	sorted := []SortBody{
		{Field: "field1", Order: "bad"},
		{Field: "field2", Order: "desc"},
		{Field: "field3", Order: "asc"},
		{Field: "field4", Order: "asc"},
	}
	expected := []SortField{
		{Field: fields[2], Order: "asc"},
		{Field: fields[3], Order: "asc"},
	}
	result := findSortedFields(fields, sorted)
	assert.Equal(t, result, expected)
}
