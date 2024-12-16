package types

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test_NewAggregationQuery_Return_Error_When_Aggregate_Field_Is_Unknown(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op: "and",
		Content: []Sqon{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
			{Op: ">", Field: "salary", Value: 50000},
		},
	}

	aggregate := "unknown_field"

	_, err := NewAggregationQuery(aggregate, &sqon, allEmpoyeeFields)

	assert.ErrorContains(t, err, "error during build aggregation")
	assert.ErrorContains(t, err, "unknown_field can not be aggregated")
}

func Test_NewAggregationQuery_Remove_Aggregate_Field_From_Filters_Or(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op: "or",
		Content: []Sqon{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
			{Op: ">", Field: "salary", Value: 50000},
		},
	}

	aggregate := "age"

	query, err := NewAggregationQuery(aggregate, &sqon, allEmpoyeeFields)

	if assert.NoError(t, err) {

		orNode, ok := query.Filters().(*OrNode)
		assert.True(t, ok)
		assert.Len(t, orNode.Children, 1)

		compNode1, ok := orNode.Children[0].(*ComparisonNode)
		assert.True(t, ok)
		assert.Equal(t, compNode1.Field, salaryField)
		assert.Equal(t, ">", compNode1.Operator)
		assert.Equal(t, 50000, compNode1.Value)

	}
}

func Test_NewAggregationQuery_Remove_Aggregate_Field_From_Filters_Not(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op: "not",
		Content: []Sqon{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
		},
	}

	aggregate := "age"

	query, err := NewAggregationQuery(aggregate, &sqon, allEmpoyeeFields)

	if assert.NoError(t, err) {
		assert.Empty(t, query.Filters(), "filters should be empty")
	}

}

func Test_NewAggregationQuery_Return_Empty_Filter_If_Empty_Or(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op: "or",
		Content: []Sqon{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
		},
	}

	aggregate := "age"

	query, err := NewAggregationQuery(aggregate, &sqon, allEmpoyeeFields)

	if assert.NoError(t, err) {
		assert.Empty(t, query.Filters(), "filters should be empty")
	}
}

func TestListQuery_HasFieldFromTables_Return_True_If_Contains_Field_In_SelectedList(t *testing.T) {
	t.Parallel()
	fields := []string{"age", "salary", "department_name"}
	query, err := NewListQuery(fields, nil, allFields, nil, nil)
	if assert.NoError(t, err) {
		assert.True(t, query.HasFieldFromTables(DepartmentTable))
	}
}
func TestListQuery_HasFieldFromTables_Return_False_If_Not_Contains_Field_In_SelectedList(t *testing.T) {
	t.Parallel()
	fields := []string{"age", "salary"}
	query, err := NewListQuery(fields, nil, allFields, nil, nil)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func TestListQuery_HasFieldFromTables_Return_True_If_Contains_Field_In_FilerFields(t *testing.T) {
	t.Parallel()
	fields := []string{"department_name"}
	sqon := Sqon{
		Op: "not",
		Content: []Sqon{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
		},
	}
	query, err := NewListQuery(fields, &sqon, allFields, nil, nil)
	if assert.NoError(t, err) {
		assert.True(t, query.HasFieldFromTables(EmployeeTable, DepartmentTable))
	}
}

func TestListQuery_HasFieldFromTables_Return_True_If_Not_Contains_Field_In_FilerFields_Or_Selected_Fields(t *testing.T) {
	t.Parallel()
	fields := []string{"salary"}
	sqon := Sqon{
		Op: "not",
		Content: []Sqon{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
		},
	}
	query, err := NewListQuery(fields, &sqon, allFields, nil, nil)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func TestAggQuery_HasFieldFromTables_Return_True_If_Contains_Field_Aggregated(t *testing.T) {
	t.Parallel()
	query, err := NewAggregationQuery("department_name", nil, allFields)
	if assert.NoError(t, err) {
		assert.True(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func TestAggQuery_HasFieldFromTables_Agg_Return_False_If_Not_Contains_Field_Aggregated(t *testing.T) {
	t.Parallel()
	query, err := NewAggregationQuery("salary", nil, allFields)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func TestAggQuery_HasFieldFromTables_Return_True_If_Contains_Field_In_FilerFields(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op: "not",
		Content: []Sqon{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
		},
	}
	query, err := NewAggregationQuery("salary", &sqon, allFields)
	if assert.NoError(t, err) {
		assert.True(t, query.HasFieldFromTables(EmployeeTable, DepartmentTable))
	}
}

func TestAggQuery_HasFieldFromTables_Return_True_If_Not_Contains_Field_In_FilerFields_Or_Aggregated(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op: "not",
		Content: []Sqon{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
		},
	}
	query, err := NewAggregationQuery("salary", &sqon, allFields)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func TestCountQuery_HasFieldFromTables_Return_True_If_Contains_Field_In_FilerFields(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op: "not",
		Content: []Sqon{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
		},
	}
	query, err := NewCountQuery(&sqon, allFields)
	if assert.NoError(t, err) {
		assert.True(t, query.HasFieldFromTables(EmployeeTable, DepartmentTable))
	}
}

func TestCountQuery_HasFieldFromTables_Return_True_If_Not_Contains_Field_In_FilerFields(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op: "not",
		Content: []Sqon{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
		},
	}
	query, err := NewCountQuery(&sqon, allFields)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(DepartmentTable))
	}
}
