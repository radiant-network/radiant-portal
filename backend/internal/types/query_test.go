package types

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test_NewAggregationQueryFromSqon_Return_Error_When_Aggregate_Field_Is_Unknown(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op: "and",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
			{Op: ">", Content: LeafContent{Field: "salary", Value: []interface{}{50000}}},
		},
	}

	aggregate := "unknown_field"

	_, err := NewAggregationQueryFromSqon(aggregate, &sqon, allEmpoyeeFields)

	assert.ErrorContains(t, err, "error during build aggregation")
	assert.ErrorContains(t, err, "unknown_field can not be aggregated")
}

func Test_NewAggregationQueryFromSqon_Remove_Aggregate_Field_From_Filters_Or(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op: "or",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
			{Op: ">", Content: LeafContent{Field: "salary", Value: []interface{}{50000}}},
		},
	}

	aggregate := "age"

	query, err := NewAggregationQueryFromSqon(aggregate, &sqon, allEmpoyeeFields)

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

func Test_NewAggregationQueryFromSqon_Remove_Aggregate_Field_From_Filters_Not(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op: "not",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
		},
	}
	aggregate := "age"

	query, err := NewAggregationQueryFromSqon(aggregate, &sqon, allEmpoyeeFields)

	if assert.NoError(t, err) {
		assert.Empty(t, query.Filters(), "filters should be empty")
	}

}

func Test_NewAggregationQueryFromSqon_Return_Empty_Filter_If_Empty_Or(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op: "or",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
		},
	}

	aggregate := "age"

	query, err := NewAggregationQueryFromSqon(aggregate, &sqon, allEmpoyeeFields)

	if assert.NoError(t, err) {
		assert.Empty(t, query.Filters(), "filters should be empty")
	}
}

func Test_NewListQueryFromSqon_HasFieldFromTables_Return_True_If_Contains_Field_In_SelectedList(t *testing.T) {
	t.Parallel()
	fields := []string{"age", "salary", "department_name"}
	query, err := NewListQueryFromSqon(queryConfig, fields, nil, nil, nil)
	if assert.NoError(t, err) {
		assert.True(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func Test_NewListQueryFromSqon_HasFieldFromTables_Return_False_If_Not_Contains_Field_In_SelectedList(t *testing.T) {
	t.Parallel()
	fields := []string{"age", "salary"}
	query, err := NewListQueryFromSqon(queryConfig, fields, nil, nil, nil)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func Test_NewListQueryFromSqon_HasFieldFromTables_Return_True_If_Contains_Field_In_FilerFields(t *testing.T) {
	t.Parallel()
	fields := []string{"department_name"}
	sqon := Sqon{
		Op: "not",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
		},
	}
	query, err := NewListQueryFromSqon(queryConfig, fields, &sqon, nil, nil)
	if assert.NoError(t, err) {
		assert.True(t, query.HasFieldFromTables(EmployeeTable, DepartmentTable))
	}
}

func Test_NewListQueryFromSqon_HasFieldFromTables_Return_True_If_Not_Contains_Field_In_FilerFields_Or_Selected_Fields(t *testing.T) {
	t.Parallel()
	fields := []string{"salary"}
	sqon := Sqon{
		Op: "not",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
		},
	}
	query, err := NewListQueryFromSqon(queryConfig, fields, &sqon, nil, nil)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func Test_NewAggregationQueryFromSqon_HasFieldFromTables_Return_True_If_Contains_Field_Aggregated(t *testing.T) {
	t.Parallel()
	query, err := NewAggregationQueryFromSqon("department_name", nil, allFields)
	if assert.NoError(t, err) {
		assert.True(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func Test_NewAggregationQueryFromSqon_HasFieldFromTables_Agg_Return_False_If_Not_Contains_Field_Aggregated(t *testing.T) {
	t.Parallel()
	query, err := NewAggregationQueryFromSqon("salary", nil, allFields)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func Test_NewAggregationQueryFromSqon_HasFieldFromTables_Return_True_If_Contains_Field_In_FilerFields(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op: "not",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
		},
	}
	query, err := NewAggregationQueryFromSqon("salary", &sqon, allFields)
	if assert.NoError(t, err) {
		assert.True(t, query.HasFieldFromTables(EmployeeTable, DepartmentTable))
	}
}

func Test_NewAggregationQueryFromSqon_HasFieldFromTables_Return_True_If_Not_Contains_Field_In_FilerFields_Or_Aggregated(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op: "not",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
		},
	}
	query, err := NewAggregationQueryFromSqon("salary", &sqon, allFields)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func Test_NewCountQueryFromSqon_HasFieldFromTables_Return_True_If_Contains_Field_In_FilerFields(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op: "not",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
		},
	}
	query, err := NewCountQueryFromSqon(&sqon, allFields)
	if assert.NoError(t, err) {
		assert.True(t, query.HasFieldFromTables(EmployeeTable, DepartmentTable))
	}
}

func Test_NewCountQueryFromSqon_HasFieldFromTables_Return_True_If_Not_Contains_Field_In_FilerFields(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op: "not",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
		},
	}
	query, err := NewCountQueryFromSqon(&sqon, allFields)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(DepartmentTable))
	}
}

func Test_NewListQueryFromCriteria_Empty_Criteria(t *testing.T) {
	t.Parallel()
	fields := []string{"salary"}
	searchCriteria := make([]SearchCriterion, 0)
	query, err := NewListQueryFromCriteria(queryConfig, fields, searchCriteria, nil, nil)
	if assert.NoError(t, err) {
		assert.Nil(t, query.Filters())
	}
}

func Test_NewListQueryFromCriteria_Unknown_Field(t *testing.T) {
	t.Parallel()
	fields := []string{"salary"}
	searchCriteria := []SearchCriterion{{FieldName: "unknown", Value: []interface{}{"a", "b", "c"}}}
	_, err := NewListQueryFromCriteria(queryConfig, fields, searchCriteria, nil, nil)
	assert.ErrorContains(t, err, "error during build list query from search criteria")
	assert.ErrorContains(t, err, "unknown can not be filtered")
}

func Test_NewListQueryFromCriteria_Valid_Criteria(t *testing.T) {
	t.Parallel()
	fields := []string{"salary", "age"}
	searchCriteria := []SearchCriterion{{FieldName: "department_name", Value: []interface{}{"a", "b", "c"}}}
	query, err := NewListQueryFromCriteria(queryConfig, fields, searchCriteria, nil, nil)
	if assert.NoError(t, err) {
		assert.NotNil(t, query.Filters())
		assert.True(t, query.HasFieldFromTables(DepartmentTable, EmployeeTable))
	}
}

func Test_NewCountQueryFromCriteria_Empty_Criteria(t *testing.T) {
	t.Parallel()
	searchCriteria := make([]SearchCriterion, 0)
	query, err := NewCountQueryFromCriteria(searchCriteria, queryConfig.AllFields)
	if assert.NoError(t, err) {
		assert.Nil(t, query.Filters())
	}
}

func Test_NewCountQueryFromCriteria_Unknown_Field(t *testing.T) {
	t.Parallel()
	searchCriteria := []SearchCriterion{{FieldName: "unknown", Value: []interface{}{"a", "b", "c"}}}
	_, err := NewCountQueryFromCriteria(searchCriteria, queryConfig.AllFields)
	assert.ErrorContains(t, err, "error during build count query from search criteria")
	assert.ErrorContains(t, err, "unknown can not be filtered")
}

func Test_NewCountQueryFromCriteria_Valid_Criteria(t *testing.T) {
	t.Parallel()
	searchCriteria := []SearchCriterion{{FieldName: "department_name", Value: []interface{}{"a", "b", "c"}}}
	query, err := NewCountQueryFromCriteria(searchCriteria, queryConfig.AllFields)
	if assert.NoError(t, err) {
		assert.NotNil(t, query.Filters())
		assert.True(t, query.HasFieldFromTables(DepartmentTable, EmployeeTable))
	}
}

func Test_NewAggregationQueryFromCriteria_Unknown_Field(t *testing.T) {
	t.Parallel()
	searchCriteria := []SearchCriterion{{FieldName: "unknown", Value: []interface{}{"a", "b", "c"}}}
	_, err := NewAggregationQueryFromCriteria(searchCriteria, queryConfig.AllFields)
	assert.ErrorContains(t, err, "error during build agg query from search criteria")
	assert.ErrorContains(t, err, "unknown can not be filtered")
}
func Test_NewAggregationQueryFromCriteria_Valid_Criteria(t *testing.T) {
	t.Parallel()
	searchCriteria := []SearchCriterion{{FieldName: "department_name", Value: []interface{}{"a", "b", "c"}}}
	query, err := NewAggregationQueryFromCriteria(searchCriteria, queryConfig.AllFields)
	if assert.NoError(t, err) {
		assert.NotNil(t, query.Filters())
		assert.True(t, query.HasFieldFromTables(DepartmentTable, EmployeeTable))
	}
}
