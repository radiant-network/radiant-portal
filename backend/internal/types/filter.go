package types

import (
	"errors"
	"fmt"
	"slices"
	"strings"

	"github.com/Goldziher/go-utils/sliceutils"
)

type CaseSemiJoinRows map[string]string

// CaseComputedColumns gives, by field alias, the SQL a filter writes for a case search field computed from several
// columns, in place of <table alias>.<name>.
type CaseComputedColumns map[string]string

type FilterNode interface {
	ToSQL(overrideTableAliases map[string]string, semiJoinRows CaseSemiJoinRows, computedColumns CaseComputedColumns) (string, []interface{})
}
type FilterNodeWithChildren interface {
	ToSQL(overrideTableAliases map[string]string, semiJoinRows CaseSemiJoinRows, computedColumns CaseComputedColumns) (string, []interface{})
	GetChildren() []FilterNode
}

type AndNode struct {
	Children []FilterNode
}

func (n *AndNode) GetChildren() []FilterNode {
	return n.Children
}

type OrNode struct {
	Children []FilterNode
}

func (n *OrNode) GetChildren() []FilterNode {
	return n.Children
}

type NotNode struct {
	Child FilterNode
}

type ComparisonNode struct {
	Operator string
	Value    interface{}
	Field    Field
}

func (n *AndNode) ToSQL(overrideTableAliases map[string]string, semiJoinRows CaseSemiJoinRows, computedColumns CaseComputedColumns) (string, []interface{}) {
	return childrenToSQL(n, "AND", overrideTableAliases, semiJoinRows, computedColumns)
}

func (n *OrNode) ToSQL(overrideTableAliases map[string]string, semiJoinRows CaseSemiJoinRows, computedColumns CaseComputedColumns) (string, []interface{}) {
	return childrenToSQL(n, "OR", overrideTableAliases, semiJoinRows, computedColumns)
}

func childrenToSQL(n FilterNodeWithChildren, op string, overrideTableAliases map[string]string, semiJoinRows CaseSemiJoinRows, computedColumns CaseComputedColumns) (string, []interface{}) {
	children := n.GetChildren()
	parts := make([]string, len(children))
	var newParams []interface{}
	for i, child := range children {
		part, params := child.ToSQL(overrideTableAliases, semiJoinRows, computedColumns)
		newParams = append(newParams, params...)
		parts[i] = part
	}
	join := strings.Join(parts, fmt.Sprintf(" %s ", op))
	return fmt.Sprintf("(%s)", join), newParams
}

func (n *NotNode) ToSQL(overrideTableAliases map[string]string, semiJoinRows CaseSemiJoinRows, computedColumns CaseComputedColumns) (string, []interface{}) {
	part, params := n.Child.ToSQL(overrideTableAliases, semiJoinRows, computedColumns)
	return fmt.Sprintf("NOT (%s)", part), params
}

func (n *ComparisonNode) ToSQL(overrideTableAliases map[string]string, semiJoinRows CaseSemiJoinRows, computedColumns CaseComputedColumns) (string, []interface{}) {
	if n.Field.Table.CaseSemiJoin {
		return n.semiJoinToSQL(semiJoinRows)
	}
	var (
		field  string
		params []interface{}
	)

	if column := computedColumns[n.Field.GetAlias()]; column != "" {
		field = column
	} else if n.Field.Table.Alias != "" {
		if overrideTableAliases != nil && overrideTableAliases[n.Field.Table.Alias] != "" {
			field = fmt.Sprintf("%s.%s", overrideTableAliases[n.Field.Table.Alias], n.Field.GetAlias())
		} else {
			field = fmt.Sprintf("%s.%s", n.Field.Table.Alias, n.Field.Name)
		}
	} else {
		field = n.Field.Name
	}

	if v, ok := n.Value.([]interface{}); ok {
		params = append(params, v...) // Flatten and append all elements
	} else {
		params = append(params, n.Value) // Append directly if not a slice
	}
	valueLength := len(params)

	switch n.Operator {
	case "in":
		placeholder := placeholders(valueLength)
		operator := "IN"
		if valueLength == 1 {
			if n.Field.IsArray {
				return fmt.Sprintf("array_contains(%s, %s)", field, placeholder), params
			}
			return fmt.Sprintf("%s = %s", field, placeholder), params
		}
		if n.Field.IsArray {
			return fmt.Sprintf("arrays_overlap(%s, [%s])", field, placeholder), params
		}
		return fmt.Sprintf("%s %s (%s)", field, operator, placeholder), params
	case "contains":
		if valueLength > 1 {
			return "", nil //Not supported
		}
		value := strings.ToLower(fmt.Sprintf("%%%s%%", params[0]))
		return fmt.Sprintf("LOWER(%s) like ?", field), []interface{}{value}
	case "not-in":
		placeholder := placeholders(valueLength)
		operator := "NOT IN"
		if valueLength == 1 {
			if n.Field.IsArray {
				return fmt.Sprintf("NOT(array_contains(%s, %s))", field, placeholder), params
			}
			return fmt.Sprintf("%s <> %s", field, placeholder), params
		}
		if n.Field.IsArray {
			return fmt.Sprintf("NOT(arrays_overlap(%s, [%s]))", field, placeholder), params
		}
		return fmt.Sprintf("%s %s (%s)", field, operator, placeholder), params
	case "<=", ">=", "<", ">":
		if n.Field.IsArray {
			return fmt.Sprintf("any_match(x -> x %s ?, %s)", n.Operator, field), params
		}
		return fmt.Sprintf("%s %s ?", field, n.Operator), params
	case "between":
		if n.Field.IsArray {
			return fmt.Sprintf("any_match(x -> x BETWEEN ? AND ?, %s)", field), params
		}
		return fmt.Sprintf("%s BETWEEN ? AND ?", field), params
	case "all":
		if !n.Field.IsArray {
			return "", nil //Not supported
		}
		if valueLength == 1 {
			return fmt.Sprintf("array_contains(%s, ?)", field), params
		}
		placeholder := placeholders(valueLength)
		return fmt.Sprintf("array_contains_all(%s, [%s])", field, placeholder), params
	default:
		return "", nil //should not happen
	}

}

// semiJoinToSQL wraps the rows in a derived table named after the field's table alias, so the inner condition
// is the one a plain field writes. not-in negates the whole sub-query: a case is excluded as soon as one of its
// rows matches, which a NOT on each row cannot do. Missing rows are refused earlier, by utils.AddWhere.
func (n *ComparisonNode) semiJoinToSQL(semiJoinRows CaseSemiJoinRows) (string, []interface{}) {
	rows, ok := semiJoinRows[n.Field.Table.Alias]
	if !ok || rows == "" {
		return "", nil
	}
	membership := "IN"
	inner := *n
	inner.Field.Table.CaseSemiJoin = false
	if n.Operator == "not-in" {
		membership = "NOT IN"
		inner.Operator = "in"
	}
	condition, params := inner.ToSQL(nil, nil, nil)
	if condition == "" {
		return "", nil
	}
	return fmt.Sprintf("%s.id %s (SELECT case_id FROM (%s) %s WHERE %s)", CaseTable.Alias, membership, rows, n.Field.Table.Alias, condition), params
}

// validateCaseSemiJoinCriterion refuses what a semi-join field cannot turn into SQL, so the search answers 400
// instead of failing on an empty condition.
func validateCaseSemiJoinCriterion(field Field, operator string, values []interface{}) error {
	if !field.Table.CaseSemiJoin {
		return nil
	}
	if len(values) == 0 {
		return fmt.Errorf("value must be defined: %s", field.GetAlias())
	}
	switch operator {
	case "in", "not-in":
		return nil
	case "contains":
		if len(values) == 1 {
			return nil
		}
		return fmt.Errorf("operation contains must have exactly one value: %s", field.GetAlias())
	default:
		return fmt.Errorf("operation %s is not supported on field %s", operator, field.GetAlias())
	}
}

// CaseSemiJoinTables returns the case semi-join tables the filter tree reads, once each.
func CaseSemiJoinTables(node FilterNode) []Table {
	var tables []Table
	for _, c := range comparisons(node) {
		if c.Field.Table.CaseSemiJoin && !slices.Contains(tables, c.Field.Table) {
			tables = append(tables, c.Field.Table)
		}
	}
	return tables
}

// CaseComputedFieldAliases returns the aliases of the computed case search fields the filter tree reads, once each.
func CaseComputedFieldAliases(node FilterNode) []string {
	var aliases []string
	for _, c := range comparisons(node) {
		if c.Field.Table == CaseMembersCountTable && !slices.Contains(aliases, c.Field.GetAlias()) {
			aliases = append(aliases, c.Field.GetAlias())
		}
	}
	return aliases
}

func comparisons(node FilterNode) []*ComparisonNode {
	var found []*ComparisonNode
	var walk func(FilterNode)
	walk = func(n FilterNode) {
		switch v := n.(type) {
		case *AndNode:
			for _, child := range v.Children {
				walk(child)
			}
		case *OrNode:
			for _, child := range v.Children {
				walk(child)
			}
		case *NotNode:
			walk(v.Child)
		case *ComparisonNode:
			found = append(found, v)
		}
	}
	if node != nil {
		walk(node)
	}
	return found
}

func placeholders(count int) string {
	return strings.TrimSuffix(strings.Repeat("?, ", count), ", ")
}

func sqonToFilter(sqon *Sqon, fields []Field, excludedFields []Field) (FilterNode, []Field, error) {
	if sqon.Content.Leaf() != nil && sqon.Content.Children() != nil {
		return nil, nil, fmt.Errorf("a sqon cannot have both content and field defined: %s", sqon.Content.Leaf().Field)
	}
	switch sqon.Op {

	case "and", "or":
		if len(sqon.Content.Children()) == 1 { // Flatten single child AND/OR nodes
			return sqonToFilter(&sqon.Content.Children()[0], fields, excludedFields)
		}
		var children []FilterNode
		var newVisitedFields []Field
		for _, item := range sqon.Content.Children() {
			child, meta, err := sqonToFilter(&item, fields, excludedFields)
			if err != nil {
				return nil, nil, err
			}
			if meta != nil && child != nil {
				children = append(children, child)
				newVisitedFields = sliceutils.Unique(append(newVisitedFields, meta...))
			}
		}
		if children != nil && newVisitedFields != nil {
			if sqon.Op == "and" {
				return &AndNode{Children: children}, newVisitedFields, nil
			} else {
				return &OrNode{Children: children}, newVisitedFields, nil
			}
		}
		// Children Nodes are empty (excluded)
		return nil, nil, nil

	case "not":
		if len(sqon.Content.Children()) != 1 {
			return nil, nil, errors.New("'not' operation must have exactly one child")
		}
		ast, meta, err := sqonToFilter(&sqon.Content.Children()[0], fields, excludedFields)
		if err != nil {
			return nil, nil, err
		}
		if meta != nil && ast != nil {
			return &NotNode{Child: ast}, meta, nil
		}
		// Children Nodes are empty (excluded)
		return nil, nil, nil

	case "in", "not-in", "<", ">", "<=", ">=", "between", "all":
		if sqon.Content.Leaf().Value == nil || (sqon.Content.Leaf().Value != nil && len(sqon.Content.Leaf().Value) == 0) {
			return nil, nil, fmt.Errorf("value must be defined: %s", sqon.Content.Leaf().Field)
		}
		meta := findFilterByAlias(fields, sqon.Content.Leaf().Field)

		if meta == nil || !meta.CanBeFiltered {
			return nil, nil, fmt.Errorf("unauthorized or unknown field: %s", sqon.Content.Leaf().Field)
		}

		//Field is in list of excludedFields, return empty node
		if excludedFields != nil && slices.Contains(excludedFields, *meta) {
			return nil, nil, nil
		}

		if err := validateCaseSemiJoinCriterion(*meta, sqon.Op, sqon.Content.Leaf().Value); err != nil {
			return nil, nil, err
		}

		if sqon.Op == "between" {
			if len(sqon.Content.Leaf().Value) != 2 {
				return nil, nil, fmt.Errorf("value array should contain exactly 2 elements when operation is 'between': %s", sqon.Content.Leaf().Field)
			}
		}

		isMultipleValue := len(sqon.Content.Leaf().Value) > 1
		if sqon.Op != "in" && sqon.Op != "not-in" && sqon.Op != "all" && sqon.Op != "between" && isMultipleValue {
			return nil, nil, fmt.Errorf("operation %s must have exactly one value: %s", sqon.Op, sqon.Content.Leaf().Field)
		}

		if sqon.Op == "<" || sqon.Op == ">" || sqon.Op == "<=" || sqon.Op == ">=" {
			return &ComparisonNode{
				Operator: sqon.Op,
				Value:    sqon.Content.Leaf().Value[0],
				Field:    *meta,
			}, []Field{*meta}, nil
		}

		return &ComparisonNode{
			Operator: sqon.Op,
			Value:    sqon.Content.Leaf().Value,
			Field:    *meta,
		}, []Field{*meta}, nil

	default:
		return nil, nil, fmt.Errorf("invalid operation: %s", sqon.Op)
	}
}

func criteriaToFilter(searchCriteria []SearchCriterion, fields []Field) (FilterNode, []Field, error) {
	visitedFilteredFields := make([]Field, 0)
	filters := make([]FilterNode, 0)
	for _, criterion := range searchCriteria {
		filteredField := findFilterByAlias(fields, criterion.FieldName)
		if filteredField != nil {
			visitedFilteredFields = append(visitedFilteredFields, *filteredField)
			operator := "in"
			if criterion.Operator != "" {
				operator = criterion.Operator
			}
			if err := validateCaseSemiJoinCriterion(*filteredField, operator, criterion.Value); err != nil {
				return nil, nil, err
			}
			filters = append(filters, &ComparisonNode{
				Operator: operator,
				Value:    criterion.Value,
				Field:    *filteredField,
			})
		} else {
			return nil, nil, fmt.Errorf("%s can not be filtered", criterion.FieldName)
		}
	}
	root := &AndNode{
		Children: filters,
	}
	return root, visitedFilteredFields, nil
}
