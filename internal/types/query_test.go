package types

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test_NewAggregationQuery_Return_Error_When_Aggregate_Field_Is_Unknown(t *testing.T) {
	t.Parallel()

	sqon := SQON{
		Op: "and",
		Content: []SQON{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
			{Op: ">", Field: "salary", Value: 50000},
		},
	}

	aggregate := "unknown_field"

	_, err := NewAggregationQuery(aggregate, &sqon, allFields)

	assert.ErrorContains(t, err, "error during build aggregation")
	assert.ErrorContains(t, err, "unknown_field can not be aggregated")
}

func Test_NewAggregationQuery_Remove_Aggregate_Field_From_Filters_Or(t *testing.T) {
	t.Parallel()

	sqon := SQON{
		Op: "or",
		Content: []SQON{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
			{Op: ">", Field: "salary", Value: 50000},
		},
	}

	aggregate := "age"

	query, err := NewAggregationQuery(aggregate, &sqon, allFields)

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

	sqon := SQON{
		Op: "not",
		Content: []SQON{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
		},
	}

	aggregate := "age"

	query, err := NewAggregationQuery(aggregate, &sqon, allFields)

	if assert.NoError(t, err) {
		assert.Empty(t, query.Filters(), "filters should be empty")
	}

}

func Test_NewAggregationQuery_Return_Empty_Filter_If_Empty_Or(t *testing.T) {
	t.Parallel()

	sqon := SQON{
		Op: "or",
		Content: []SQON{
			{Op: "in", Field: "age", Value: []interface{}{30, 40}},
		},
	}

	aggregate := "age"

	query, err := NewAggregationQuery(aggregate, &sqon, allFields)

	if assert.NoError(t, err) {
		assert.Empty(t, query.Filters(), "filters should be empty")
	}
}
