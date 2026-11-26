package types

import (
	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/stretchr/testify/assert"
	"testing"
)

var EmployeeTable = Table{
	Name:  "employee",
	Alias: "e",
}
var ageField = Field{Name: "age", CanBeSelected: true, CanBeFiltered: true, CanBeAggregated: true, DefaultOp: "default", Table: EmployeeTable}
var salaryField = Field{Name: "salary", CanBeSelected: true, CanBeFiltered: true, CanBeAggregated: true, DefaultOp: "default", Table: EmployeeTable}
var cityField = Field{Name: "city", CanBeSelected: true, CanBeFiltered: true, CanBeAggregated: true, DefaultOp: "default", Table: EmployeeTable}
var hobbiesField = Field{Name: "hobbies", CanBeFiltered: true, CanBeAggregated: false, CustomOp: "array_contains", IsArray: true, Table: EmployeeTable}

var allEmpoyeeFields = []Field{
	ageField,
	salaryField,
	cityField,
	hobbiesField,
}

var DepartmentTable = Table{
	Name:  "department",
	Alias: "d",
}

var departmentNameField = Field{Name: "department_name", CanBeSelected: true, CanBeFiltered: true, CanBeAggregated: true, DefaultOp: "default", Table: DepartmentTable}
var allDepartmentFields = []Field{departmentNameField}
var allFields = sliceutils.Merge(allDepartmentFields, allEmpoyeeFields)
var defaultFields = sliceutils.Merge(allEmpoyeeFields)

var defaultSort = []SortField{
	{Field: ageField, Order: "asc"},
}
var idField = salaryField

var queryConfig = QueryConfig{
	AllFields:     allFields,
	DefaultFields: defaultFields,
	DefaultSort:   defaultSort,
	IdField:       idField,
}

func Test_SqonToFilter_Return_Expected_Filters(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op: "and",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
			{Op: ">", Content: LeafContent{Field: "salary", Value: []interface{}{50000}}}},
	}

	ast, fields, err := sqonToFilter(&sqon, allEmpoyeeFields, nil)
	if assert.NoError(t, err) {
		expectedFieldMetadata :=
			[]Field{
				ageField,
				salaryField,
			}
		assert.ElementsMatch(t, expectedFieldMetadata, fields)
		andNode, ok := ast.(*AndNode)
		assert.True(t, ok)
		if assert.Len(t, andNode.Children, 2) {
			compNode1, ok := andNode.Children[0].(*ComparisonNode)
			assert.True(t, ok)
			assert.Equal(t, compNode1.Field, ageField)
			assert.Equal(t, "in", compNode1.Operator)
			assert.Equal(t, []interface{}{30, 40}, compNode1.Value)

			compNode2, ok := andNode.Children[1].(*ComparisonNode)
			assert.True(t, ok)
			assert.Equal(t, compNode2.Field, salaryField)
			assert.Equal(t, ">", compNode2.Operator)
			assert.Equal(t, 50000, compNode2.Value)
		}
	}
}

func Test_SqonToFilter_Return_Error_When_Op_Is_Invalid(t *testing.T) {
	t.Parallel()
	invalidSQON := Sqon{
		Op:      "invalid_op",
		Content: SqonArray{{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}}},
	}

	_, _, err := sqonToFilter(&invalidSQON, allEmpoyeeFields, nil)
	assert.Error(t, err)
	assert.ErrorContains(t, err, "invalid operation: invalid_op")
}

func Test_SqonToFilter_Return_Error_When_Field_Is_Invalid(t *testing.T) {
	t.Parallel()
	invalidFieldSQON := Sqon{
		Op:      "and",
		Content: SqonArray{{Op: "in", Content: LeafContent{Field: "my_field", Value: []interface{}{30, 40}}}},
	}

	_, _, err := sqonToFilter(&invalidFieldSQON, allEmpoyeeFields, nil)
	assert.Error(t, err)
	assert.ErrorContains(t, err, "my_field")
	assert.ErrorContains(t, err, "unauthorized")
}

func Test_SqonToFilter_Return_Expected_Filter_With_Only_One_Field(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op:      "in",
		Content: LeafContent{Field: "age", Value: []interface{}{30, 40}},
	}

	_, visitedFields, err := sqonToFilter(&sqon, allEmpoyeeFields, nil)
	assert.NoError(t, err)
	assert.Len(t, visitedFields, 1)
	assert.Equal(t, []Field{ageField}, visitedFields)
}

func Test_SqonToFilter_Return_Error_When_Between_Filter_Is_A_Single_Value(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op:      "between",
		Content: LeafContent{Field: "age", Value: []interface{}{30}},
	}

	_, _, err := sqonToFilter(&sqon, allEmpoyeeFields, nil)
	assert.Error(t, err)
	assert.ErrorContains(t, err, "value array should contain exactly 2 elements when operation is 'between'")
}

func Test_SqonToFilter_Return_Error_When_Between_Filter_Is_An_Array_With_One_Element(t *testing.T) {
	t.Parallel()

	sqon := Sqon{
		Op:      "between",
		Content: LeafContent{Field: "age", Value: []interface{}{30}},
	}

	_, _, err := sqonToFilter(&sqon, allEmpoyeeFields, nil)
	assert.Error(t, err)
	assert.ErrorContains(t, err, "value array should contain exactly 2 elements when operation is 'between'")
}

func Test_SqonToFilter_Return_Error_When_Between_Filter_Is_An_Array_With_More_Than_Two_Elements(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op:      "between",
		Content: LeafContent{Field: "age", Value: []interface{}{30, 40, 50}},
	}

	_, _, err := sqonToFilter(&sqon, allEmpoyeeFields, nil)
	assert.Error(t, err)
	assert.ErrorContains(t, err, "value array should contain exactly 2 elements when operation is 'between'")
}

func Test_SqonToFilter_Return_Error_When_Single_Operator_Is_An_Array(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op:      ">=",
		Content: LeafContent{Field: "age", Value: []interface{}{30, 40, 50}},
	}

	_, _, err := sqonToFilter(&sqon, allEmpoyeeFields, nil)
	assert.Error(t, err)
	assert.ErrorContains(t, err, "operation >= must have exactly one value: age")
}

func Test_SqonToFilter_Return_Error_When_Value_IsEmpty_With_In_Operator(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op:      "in",
		Content: LeafContent{Field: "age"},
	}

	_, _, err := sqonToFilter(&sqon, allEmpoyeeFields, nil)
	assert.Error(t, err)
	assert.ErrorContains(t, err, "value must be defined")
}

func Test_SqonToFilter_Return_Error_When_Not_Operator_Has_More_Than_One_Content(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op: "not",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
			{Op: "in", Content: LeafContent{Field: "salary", Value: []interface{}{30, 40}}},
		},
	}

	_, _, err := sqonToFilter(&sqon, allEmpoyeeFields, nil)
	assert.Error(t, err)
	assert.ErrorContains(t, err, "'not' operation must have exactly one child")
}

func Test_SqonToFilter_Return_Expected_Filters_When_Sqon_Is_Complex(t *testing.T) {
	t.Parallel()

	sqon := &Sqon{
		Op: "or",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
			{
				Op: "and",
				Content: SqonArray{
					{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{10, 20}}},
					{Op: ">=", Content: LeafContent{Field: "salary", Value: []interface{}{50000}}},
				},
			},
			{Op: "in", Content: LeafContent{Field: "hobbies", Value: []interface{}{"soccer", "hiking"}}},
			{Op: "not",
				Content: SqonArray{
					{Op: "not-in", Content: LeafContent{Field: "city", Value: []interface{}{"New York", "Los Angeles"}}},
				},
			},
		},
	}

	ast, visitedFields, err := sqonToFilter(sqon, allEmpoyeeFields, nil)
	assert.NoError(t, err)
	assert.NotNil(t, ast)
	assert.NotEmpty(t, visitedFields)

	expectedFields := []Field{
		ageField, salaryField, cityField, hobbiesField,
	}
	assert.ElementsMatch(t, expectedFields, visitedFields)
	orNode, ok := ast.(*OrNode)
	assert.True(t, ok)
	assert.Len(t, orNode.Children, 4)

	compNode1, ok := orNode.Children[0].(*ComparisonNode)
	assert.True(t, ok)
	assert.Equal(t, compNode1.Field, ageField)
	assert.Equal(t, "in", compNode1.Operator)
	assert.Equal(t, []interface{}{30, 40}, compNode1.Value)

	andNode, ok := orNode.Children[1].(*AndNode)
	assert.True(t, ok)
	assert.Len(t, andNode.Children, 2)

	compNode2, ok := andNode.Children[0].(*ComparisonNode)
	assert.True(t, ok)
	assert.Equal(t, compNode2.Field, ageField)
	assert.Equal(t, "in", compNode2.Operator)
	assert.Equal(t, []interface{}{10, 20}, compNode2.Value)

	compNode3, ok := andNode.Children[1].(*ComparisonNode)
	assert.True(t, ok)
	assert.Equal(t, compNode3.Field, salaryField)
	assert.Equal(t, ">=", compNode3.Operator)
	assert.Equal(t, 50000, compNode3.Value)

	compNode4, ok := orNode.Children[2].(*ComparisonNode)
	assert.True(t, ok)
	assert.Equal(t, compNode4.Field, hobbiesField)
	assert.Equal(t, "in", compNode4.Operator)
	assert.Equal(t, []interface{}{"soccer", "hiking"}, compNode4.Value)

	notNode, ok := orNode.Children[3].(*NotNode)
	assert.True(t, ok)
	notInNode, ok := notNode.Child.(*ComparisonNode)
	assert.True(t, ok)
	assert.Equal(t, notInNode.Field, cityField)
	assert.Equal(t, "not-in", notInNode.Operator)
	assert.Equal(t, []interface{}{"New York", "Los Angeles"}, notInNode.Value)
}

func Test_SqonToFilter_Return_Direct_Child_When_Or_Operator_With_Single_Child(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op: "or",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
		},
	}

	ast, visitedFields, err := sqonToFilter(&sqon, allEmpoyeeFields, nil)
	assert.NoError(t, err)
	assert.ElementsMatch(t, []Field{ageField}, visitedFields)
	inNode, ok := ast.(*ComparisonNode)
	if assert.True(t, ok) {
		assert.Equal(t, inNode.Field, ageField)
		assert.Equal(t, "in", inNode.Operator)
		assert.Equal(t, []interface{}{30, 40}, inNode.Value)
	}
}

func Test_SqonToFilter_Return_Direct_Child_When_And_Operator_With_Single_Child(t *testing.T) {
	t.Parallel()
	sqon := Sqon{
		Op: "and",
		Content: SqonArray{
			{Op: "in", Content: LeafContent{Field: "age", Value: []interface{}{30, 40}}},
		},
	}

	ast, visitedFields, err := sqonToFilter(&sqon, allEmpoyeeFields, nil)
	assert.NoError(t, err)
	assert.ElementsMatch(t, []Field{ageField}, visitedFields)
	inNode, ok := ast.(*ComparisonNode)
	if assert.True(t, ok) {
		assert.Equal(t, inNode.Field, ageField)
		assert.Equal(t, "in", inNode.Operator)
		assert.Equal(t, []interface{}{30, 40}, inNode.Value)
	}
}

func Test_ToSQL_Return_Expected_Sql_Filter_When_In(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "in", Value: []interface{}{10, 20}, Field: ageField}

	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `e.age IN (?, ?)`
	expectedParams := []interface{}{10, 20}

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}
func Test_ToSQL_Return_Expected_Sql_Filter_When_In_With_Single_Array(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "in", Value: []interface{}{10}, Field: ageField}

	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `e.age = ?`
	expectedParams := []interface{}{10}

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}
func Test_ToSQL_Return_Expected_Sql_Filter_When_In_With_Single_Value(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "in", Value: 10, Field: ageField}

	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `e.age = ?`
	expectedParams := []interface{}{10}

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}
func Test_ToSQL_Return_Expected_Sql_Filter_With_Alias(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "in", Value: []interface{}{10, 20}, Field: Field{Name: "age", CanBeFiltered: true, Table: Table{Alias: "e"}}}

	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `e.age IN (?, ?)`
	expectedParams := []interface{}{10, 20}

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}
func Test_ToSQL_Return_Expected_Sql_Filter_When_Between(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "between", Value: []interface{}{30, 40}, Field: ageField}

	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `e.age BETWEEN ? AND ?`
	expectedParams := []interface{}{30, 40}

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}
func Test_ToSQL_Return_Expected_Sql_Filter_When_Complex_Filter(t *testing.T) {
	t.Parallel()
	node := &OrNode{
		Children: []FilterNode{
			&ComparisonNode{Operator: "in", Value: []interface{}{30, 40}, Field: ageField},
			&AndNode{
				Children: []FilterNode{
					&ComparisonNode{Operator: "in", Value: []interface{}{10, 20}, Field: ageField},
					&ComparisonNode{Operator: ">=", Value: 50000, Field: salaryField},
				},
			},
			&ComparisonNode{Operator: "in", Value: []interface{}{"soccer", "hiking"}, Field: hobbiesField},
			&NotNode{
				Child: &ComparisonNode{Operator: "not-in", Value: []interface{}{"New York", "Los Angeles"}, Field: cityField},
			},
		},
	}

	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `(e.age IN (?, ?) OR (e.age IN (?, ?) AND e.salary >= ?) OR arrays_overlap(e.hobbies, [?, ?]) OR NOT (e.city NOT IN (?, ?)))`
	expectedParams := []interface{}{30, 40, 10, 20, 50000, "soccer", "hiking", "New York", "Los Angeles"}

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}

func Test_ToSQL_Return_Array_Contains_Sql_Filter_When_Array_Field_And_In_Single_Element(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "in", Value: []interface{}{"Soccer"}, Field: hobbiesField}

	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `array_contains(e.hobbies, ?)`
	expectedParams := []interface{}{"Soccer"}

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}

func Test_ToSQL_Return_Array_Contains_Sql_Filter_When_Array_Field_And_In_Single_Value(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "in", Value: "Soccer", Field: hobbiesField}

	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `array_contains(e.hobbies, ?)`
	expectedParams := []interface{}{"Soccer"}

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}

func Test_ToSQL_Return_Array_Contains_Sql_Filter_When_Array_Field_And_In_Multiple_Value(t *testing.T) {
	t.Parallel()
	expectedParams := []interface{}{"Beats", "Bear", "Battle Star Galactica"}
	node := ComparisonNode{Operator: "in", Value: expectedParams, Field: hobbiesField}
	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `arrays_overlap(e.hobbies, [?, ?, ?])`

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}

func Test_ToSQL_Return_Not_Array_Contains_Sql_Filter_When_Array_Field_And_Not_In_Single_Value(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "not-in", Value: "Soccer", Field: hobbiesField}

	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedParams := []interface{}{"Soccer"}
	expectedSQL := `NOT(array_contains(e.hobbies, ?))`

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}

func Test_ToSQL_Return_Not_Array_Contains_Sql_Filter_When_Array_Field_And_Not_In_Multiple_Value(t *testing.T) {
	t.Parallel()
	expectedParams := []interface{}{"Beats", "Bear", "Battle Star Galactica"}
	node := ComparisonNode{Operator: "not-in", Value: expectedParams, Field: hobbiesField}
	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `NOT(arrays_overlap(e.hobbies, [?, ?, ?]))`

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}

func Test_ToSQL_Return_Any_Match_Sql_Filter_When_Array_Field_And_Single_Operator(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "<", Value: "Soccer", Field: hobbiesField}
	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `any_match(x -> x < ?, e.hobbies)`
	expectedParams := []interface{}{"Soccer"}

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}

func Test_ToSQL_Return_Any_Match_Sql_Filter_When_Array_Field_And_Between_Operator(t *testing.T) {
	t.Parallel()
	expectedParams := []interface{}{"Soccer", "Hockey"}
	node := ComparisonNode{Operator: "between", Value: expectedParams, Field: hobbiesField}
	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `any_match(x -> x BETWEEN ? AND ?, e.hobbies)`

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}

func Test_ToSQL_Return_Array_Contains_Sql_Filter_When_Array_Field_And_All_Operator_Single_value(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "all", Value: "Soccer", Field: hobbiesField}
	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `array_contains(e.hobbies, ?)`
	expectedParams := []interface{}{"Soccer"}

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}

func Test_ToSQL_Return_Array_Contains_All_Sql_Filter_When_Array_Field_And_All_Operator(t *testing.T) {
	t.Parallel()
	expectedParams := []interface{}{"Beats", "Bear", "Battle Star Galactica"}
	node := ComparisonNode{Operator: "all", Value: expectedParams, Field: hobbiesField}
	sqlQuery, params := node.ToSQL(nil, nil, nil)

	expectedSQL := `array_contains_all(e.hobbies, [?, ?, ?])`

	assert.Equal(t, expectedSQL, sqlQuery)
	assert.Equal(t, expectedParams, params)
}

func Test_ToSQL_Return_Array_Contains_On_Comphet_Join_When_Filter_On_Comphet_Of(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "in", Value: []interface{}{"1000"}, Field: GermlineSNVComphetOfField}

	// Same rendering inside the consequence semi-join: its alias overrides do not touch the comphet join.
	for _, overrides := range []map[string]string{nil, {"cf": "cf"}} {
		sqlQuery, params := node.ToSQL(overrides, nil, nil)

		assert.Equal(t, `array_contains(ch.comphet_of, ?)`, sqlQuery)
		assert.Equal(t, []interface{}{"1000"}, params)
	}
}

var memberRunRows = CaseSemiJoinRows{CaseMemberRunTable.Alias: "SELECT chseq.case_id, s.run_name FROM t1_tenant.case_has_sequencing_experiment chseq INNER JOIN t1_tenant.sequencing_experiment s ON s.id = chseq.sequencing_experiment_id"}

const memberRunSubQuery = "SELECT case_id FROM (SELECT chseq.case_id, s.run_name FROM t1_tenant.case_has_sequencing_experiment chseq INNER JOIN t1_tenant.sequencing_experiment s ON s.id = chseq.sequencing_experiment_id) case_member_run WHERE "

func Test_ToSQL_SemiJoinField_InSingleValue_CaseIdInSubQuery(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "in", Value: []interface{}{"1617"}, Field: CaseMemberRunNameField}

	sqlQuery, params := node.ToSQL(nil, memberRunRows, nil)

	assert.Equal(t, "c.id IN ("+memberRunSubQuery+"case_member_run.run_name = ?)", sqlQuery)
	assert.Equal(t, []interface{}{"1617"}, params)
}

func Test_ToSQL_SemiJoinField_InSeveralValues_CaseIdInSubQuery(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "in", Value: []interface{}{"1617", "1619"}, Field: CaseMemberRunNameField}

	sqlQuery, params := node.ToSQL(nil, memberRunRows, nil)

	assert.Equal(t, "c.id IN ("+memberRunSubQuery+"case_member_run.run_name IN (?, ?))", sqlQuery)
	assert.Equal(t, []interface{}{"1617", "1619"}, params)
}

func Test_ToSQL_SemiJoinField_NotIn_CaseIdNotInSubQuery(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "not-in", Value: []interface{}{"1617", "1619"}, Field: CaseMemberRunNameField}

	sqlQuery, params := node.ToSQL(nil, memberRunRows, nil)

	assert.Equal(t, "c.id NOT IN ("+memberRunSubQuery+"case_member_run.run_name IN (?, ?))", sqlQuery)
	assert.Equal(t, []interface{}{"1617", "1619"}, params)
}

func Test_ToSQL_SemiJoinField_NotInSingleValue_CaseIdNotInSubQuery(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "not-in", Value: []interface{}{"1617"}, Field: CaseMemberRunNameField}

	sqlQuery, params := node.ToSQL(nil, memberRunRows, nil)

	assert.Equal(t, "c.id NOT IN ("+memberRunSubQuery+"case_member_run.run_name = ?)", sqlQuery)
	assert.Equal(t, []interface{}{"1617"}, params)
}

func Test_ToSQL_SemiJoinField_Contains_LowerLikeInSubQuery(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "contains", Value: []interface{}{"A00516"}, Field: CaseMemberRunNameField}

	sqlQuery, params := node.ToSQL(nil, memberRunRows, nil)

	assert.Equal(t, "c.id IN ("+memberRunSubQuery+"LOWER(case_member_run.run_name) like ?)", sqlQuery)
	assert.Equal(t, []interface{}{"%a00516%"}, params)
}

func Test_ToSQL_SemiJoinField_InsideAndNode_RowsPassedDown(t *testing.T) {
	t.Parallel()
	node := AndNode{Children: []FilterNode{
		&ComparisonNode{Operator: "in", Value: []interface{}{"1617"}, Field: CaseMemberRunNameField},
		&NotNode{Child: &ComparisonNode{Operator: "in", Value: []interface{}{"1619"}, Field: CaseMemberRunNameField}},
	}}

	sqlQuery, params := node.ToSQL(nil, memberRunRows, nil)

	assert.Equal(t, "(c.id IN ("+memberRunSubQuery+"case_member_run.run_name = ?) AND NOT (c.id IN ("+memberRunSubQuery+"case_member_run.run_name = ?)))", sqlQuery)
	assert.Equal(t, []interface{}{"1617", "1619"}, params)
}

func Test_ToSQL_SemiJoinField_OverrideAliasIgnored(t *testing.T) {
	t.Parallel()
	node := ComparisonNode{Operator: "in", Value: []interface{}{"1617"}, Field: CaseMemberRunNameField}

	sqlQuery, _ := node.ToSQL(map[string]string{CaseMemberRunTable.Alias: "other"}, memberRunRows, nil)

	assert.Equal(t, "c.id IN ("+memberRunSubQuery+"case_member_run.run_name = ?)", sqlQuery)
}

func Test_CriteriaToFilter_SemiJoinField_InDefaultOperator_Accepted(t *testing.T) {
	t.Parallel()
	criteria := []SearchCriterion{{FieldName: "run_name", Value: []interface{}{"1617"}}}

	_, visitedFields, err := criteriaToFilter(criteria, CasesFields)

	assert.NoError(t, err)
	assert.Equal(t, []Field{CaseMemberRunNameField}, visitedFields)
}

func Test_CriteriaToFilter_SemiJoinField_NotIn_Accepted(t *testing.T) {
	t.Parallel()
	criteria := []SearchCriterion{{FieldName: "run_name", Operator: "not-in", Value: []interface{}{"1617", "1619"}}}

	_, _, err := criteriaToFilter(criteria, CasesFields)

	assert.NoError(t, err)
}

func Test_CriteriaToFilter_SemiJoinField_ContainsOneValue_Accepted(t *testing.T) {
	t.Parallel()
	criteria := []SearchCriterion{{FieldName: "run_name", Operator: "contains", Value: []interface{}{"161"}}}

	_, _, err := criteriaToFilter(criteria, CasesFields)

	assert.NoError(t, err)
}

func Test_CriteriaToFilter_SemiJoinField_ContainsSeveralValues_Error(t *testing.T) {
	t.Parallel()
	criteria := []SearchCriterion{{FieldName: "run_name", Operator: "contains", Value: []interface{}{"1617", "1619"}}}

	_, _, err := criteriaToFilter(criteria, CasesFields)

	assert.EqualError(t, err, "operation contains must have exactly one value: run_name")
}

func Test_CriteriaToFilter_SemiJoinField_All_Error(t *testing.T) {
	t.Parallel()
	criteria := []SearchCriterion{{FieldName: "run_name", Operator: "all", Value: []interface{}{"1617"}}}

	_, _, err := criteriaToFilter(criteria, CasesFields)

	assert.EqualError(t, err, "operation all is not supported on field run_name")
}

func Test_CriteriaToFilter_SemiJoinField_Between_Error(t *testing.T) {
	t.Parallel()
	criteria := []SearchCriterion{{FieldName: "run_name", Operator: "between", Value: []interface{}{"1617", "1619"}}}

	_, _, err := criteriaToFilter(criteria, CasesFields)

	assert.EqualError(t, err, "operation between is not supported on field run_name")
}

func Test_CriteriaToFilter_SemiJoinField_Comparison_Error(t *testing.T) {
	t.Parallel()
	criteria := []SearchCriterion{{FieldName: "run_name", Operator: ">", Value: []interface{}{"1617"}}}

	_, _, err := criteriaToFilter(criteria, CasesFields)

	assert.EqualError(t, err, "operation > is not supported on field run_name")
}

func Test_CriteriaToFilter_SemiJoinField_EmptyValue_Error(t *testing.T) {
	t.Parallel()
	criteria := []SearchCriterion{{FieldName: "run_name", Value: []interface{}{}}}

	_, _, err := criteriaToFilter(criteria, CasesFields)

	assert.EqualError(t, err, "value must be defined: run_name")
}

func Test_CriteriaToFilter_SemiJoinField_NilValue_Error(t *testing.T) {
	t.Parallel()
	criteria := []SearchCriterion{{FieldName: "run_name"}}

	_, _, err := criteriaToFilter(criteria, CasesFields)

	assert.EqualError(t, err, "value must be defined: run_name")
}

func Test_SqonToFilter_SemiJoinField_All_Error(t *testing.T) {
	t.Parallel()
	sqon := Sqon{Op: "all", Content: LeafContent{Field: "run_name", Value: []interface{}{"1617"}}}

	_, _, err := sqonToFilter(&sqon, CasesFields, nil)

	assert.EqualError(t, err, "operation all is not supported on field run_name")
}

func Test_SqonToFilter_SemiJoinField_In_Accepted(t *testing.T) {
	t.Parallel()
	sqon := Sqon{Op: "in", Content: LeafContent{Field: "run_name", Value: []interface{}{"1617"}}}

	_, _, err := sqonToFilter(&sqon, CasesFields, nil)

	assert.NoError(t, err)
}

func Test_CasesFields_RunName_FilterOnly(t *testing.T) {
	t.Parallel()
	assert.Contains(t, CasesFields, CaseMemberRunNameField)
	assert.True(t, CaseMemberRunNameField.CanBeFiltered)
	assert.False(t, CaseMemberRunNameField.CanBeSelected)
	assert.False(t, CaseMemberRunNameField.CanBeSorted)
}

func Test_ComparisonNode_ToSQL_ComputedColumn_InPlaceOfTheColumn(t *testing.T) {
	t.Parallel()
	node := &ComparisonNode{Operator: "not-in", Value: []interface{}{"germline", "somatic"}, Field: CaseTypeField}

	sqlQuery, params := node.ToSQL(nil, nil, CaseComputedColumns{CaseTypeField.GetAlias(): "CONCAT(c.a, c.b)"})

	assert.Equal(t, "CONCAT(c.a, c.b) NOT IN (?, ?)", sqlQuery)
	assert.Equal(t, []interface{}{"germline", "somatic"}, params)
}

func Test_CasesFields_CaseType_FilterOnly(t *testing.T) {
	t.Parallel()
	assert.Contains(t, CasesFields, CaseTypeField)
	assert.True(t, CaseTypeField.CanBeFiltered)
	assert.False(t, CaseTypeField.CanBeSelected)
	assert.False(t, CaseTypeField.CanBeSorted)
}

func Test_CasesFields_CaseTypeCode_NotFilterable(t *testing.T) {
	t.Parallel()
	assert.Contains(t, CasesFields, CaseTypeCodeField)
	assert.False(t, CaseTypeCodeField.CanBeFiltered)
	assert.True(t, CaseTypeCodeField.CanBeSelected)
	assert.True(t, CaseTypeCodeField.CanBeSorted)
}

func Test_VariantInterpretedCasesFields_LeavesCaseSearchOnlyFieldsOut(t *testing.T) {
	t.Parallel()
	assert.NotContains(t, VariantInterpretedCasesFields, CaseMemberRunNameField)
	assert.NotContains(t, VariantInterpretedCasesFields, CaseTypeField)
}

func Test_VariantInterpretedCasesFields_KeepsEveryOtherCaseField(t *testing.T) {
	t.Parallel()
	for _, field := range CasesFields {
		if !field.Table.CaseSemiJoin && field.Table != CaseMembersCountTable {
			assert.Contains(t, VariantInterpretedCasesFields, field, field.GetAlias())
		}
	}
}

func Test_CriteriaToFilter_VariantInterpretedCases_RunName_Error(t *testing.T) {
	t.Parallel()
	criteria := []SearchCriterion{{FieldName: "run_name", Value: []interface{}{"1617"}}}

	_, _, err := criteriaToFilter(criteria, VariantInterpretedCasesFields)

	assert.EqualError(t, err, "run_name can not be filtered")
}

func Test_CaseSemiJoinTables_NestedFilters_EachTableOnce(t *testing.T) {
	t.Parallel()
	node := &AndNode{Children: []FilterNode{
		&ComparisonNode{Operator: "in", Value: []interface{}{"1"}, Field: CaseIdField},
		&OrNode{Children: []FilterNode{
			&ComparisonNode{Operator: "in", Value: []interface{}{"1617"}, Field: CaseMemberRunNameField},
			&NotNode{Child: &ComparisonNode{Operator: "in", Value: []interface{}{"1619"}, Field: CaseMemberRunNameField}},
		}},
	}}

	assert.Equal(t, []Table{CaseMemberRunTable}, CaseSemiJoinTables(node))
}

func Test_CaseSemiJoinTables_NoSemiJoinField_Empty(t *testing.T) {
	t.Parallel()
	node := &AndNode{Children: []FilterNode{&ComparisonNode{Operator: "in", Value: []interface{}{"1"}, Field: CaseIdField}}}

	assert.Empty(t, CaseSemiJoinTables(node))
}

func Test_CaseSemiJoinTables_NilFilter_Empty(t *testing.T) {
	t.Parallel()
	assert.Empty(t, CaseSemiJoinTables(nil))
}

func Test_CaseComputedFieldAliases_NestedFilters_EachAliasOnce(t *testing.T) {
	t.Parallel()
	node := &AndNode{Children: []FilterNode{
		&ComparisonNode{Operator: "in", Value: []interface{}{"1"}, Field: CaseIdField},
		&OrNode{Children: []FilterNode{
			&ComparisonNode{Operator: "in", Value: []interface{}{"germline"}, Field: CaseTypeField},
			&NotNode{Child: &ComparisonNode{Operator: "in", Value: []interface{}{"somatic"}, Field: CaseTypeField}},
		}},
	}}

	assert.Equal(t, []string{CaseTypeField.GetAlias()}, CaseComputedFieldAliases(node))
}

func Test_CaseComputedFieldAliases_NoComputedField_Empty(t *testing.T) {
	t.Parallel()
	node := &AndNode{Children: []FilterNode{&ComparisonNode{Operator: "in", Value: []interface{}{"1"}, Field: CaseIdField}}}

	assert.Empty(t, CaseComputedFieldAliases(node))
}

// Only the case search gives the semi-join rows, the members count join and the computed columns (CasesRepository.prepareQuery).
// Such a field in any other field list would be accepted as a filter and then fail the query: leave it out, as
// VariantInterpretedCasesFields does.
func Test_QueryConfigs_OnlyCasesHaveCaseSearchOnlyFields(t *testing.T) {
	t.Parallel()
	others := map[string]QueryConfig{
		"GermlineSNVOccurrences":    GermlineSNVOccurrencesQueryConfig,
		"SomaticSNVOccurrences":     SomaticSNVOccurrencesQueryConfig,
		"GermlineCNVOccurrences":    GermlineCNVOccurrencesQueryConfig,
		"SomaticCNVOccurrences":     SomaticCNVOccurrencesQueryConfig,
		"Documents":                 DocumentsQueryConfig,
		"PcxPatients":               PcxPatientsQueryConfig,
		"VariantInterpretedCases":   VariantInterpretedCasesQueryConfig,
		"VariantUninterpretedCases": VariantUninterpretedCasesQueryConfig,
	}
	for name, config := range others {
		for _, field := range config.AllFields {
			assert.False(t, field.Table.CaseSemiJoin, "%s exposes the case semi-join field %s", name, field.GetAlias())
			assert.NotEqual(t, CaseMembersCountTable, field.Table, "%s exposes the computed field %s", name, field.GetAlias())
		}
	}
	assert.Contains(t, CasesQueryConfig.AllFields, CaseMemberRunNameField)
	assert.Contains(t, CasesQueryConfig.AllFields, CaseTypeField)
}
