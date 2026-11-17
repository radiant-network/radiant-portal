package types

import (
	"errors"
	"fmt"
	"slices"
	"strings"

	"github.com/Goldziher/go-utils/sliceutils"
)

// SemiJoinRows holds, by table alias, the SQL of the rows of each semi-join table (see Table.SemiJoin).
type SemiJoinRows map[string]string

type FilterNode interface {
	ToSQL(overrideTableAliases map[string]string, semiJoinRows SemiJoinRows) (string, []interface{})
}
type FilterNodeWithChildren interface {
	ToSQL(overrideTableAliases map[string]string, semiJoinRows SemiJoinRows) (string, []interface{})
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

func (n *AndNode) ToSQL(overrideTableAliases map[string]string, semiJoinRows SemiJoinRows) (string, []interface{}) {
	return childrenToSQL(n, "AND", overrideTableAliases, semiJoinRows)
}

func (n *OrNode) ToSQL(overrideTableAliases map[string]string, semiJoinRows SemiJoinRows) (string, []interface{}) {
	return childrenToSQL(n, "OR", overrideTableAliases, semiJoinRows)
}

func childrenToSQL(n FilterNodeWithChildren, op string, overrideTableAliases map[string]string, semiJoinRows SemiJoinRows) (string, []interface{}) {
	children := n.GetChildren()
	parts := make([]string, len(children))
	var newParams []interface{}
	for i, child := range children {
		part, params := child.ToSQL(overrideTableAliases, semiJoinRows)
		newParams = append(newParams, params...)
		parts[i] = part
	}
	join := strings.Join(parts, fmt.Sprintf(" %s ", op))
	return fmt.Sprintf("(%s)", join), newParams
}

func (n *NotNode) ToSQL(overrideTableAliases map[string]string, semiJoinRows SemiJoinRows) (string, []interface{}) {
	part, params := n.Child.ToSQL(overrideTableAliases, semiJoinRows)
	return fmt.Sprintf("NOT (%s)", part), params
}

func (n *ComparisonNode) ToSQL(overrideTableAliases map[string]string, semiJoinRows SemiJoinRows) (string, []interface{}) {
	if n.Field.Table.SemiJoin {
		return n.semiJoinToSQL(semiJoinRows)
	}
	var (
		field  string
		params []interface{}
	)

	if n.Field.Table.Alias != "" {
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
// rows matches, which a NOT on each row cannot do. Without rows (a query that does not provide them), it returns
// no SQL, as an unsupported operator does; such a field is kept out of the query's fields.
func (n *ComparisonNode) semiJoinToSQL(semiJoinRows SemiJoinRows) (string, []interface{}) {
	rows, ok := semiJoinRows[n.Field.Table.Alias]
	if !ok || rows == "" {
		return "", nil
	}
	membership := "IN"
	inner := *n
	inner.Field.Table.SemiJoin = false
	if n.Operator == "not-in" {
		membership = "NOT IN"
		inner.Operator = "in"
	}
	condition, params := inner.ToSQL(nil, nil)
	if condition == "" {
		return "", nil
	}
	return fmt.Sprintf("%s.id %s (SELECT case_id FROM (%s) %s WHERE %s)", CaseTable.Alias, membership, rows, n.Field.Table.Alias, condition), params
}

// validateSemiJoinCriterion refuses what a semi-join field cannot turn into SQL, so the search answers 400
// instead of failing on an empty condition.
func validateSemiJoinCriterion(field Field, operator string, values []interface{}) error {
	if !field.Table.SemiJoin {
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

		if err := validateSemiJoinCriterion(*meta, sqon.Op, sqon.Content.Leaf().Value); err != nil {
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
			if err := validateSemiJoinCriterion(*filteredField, operator, criterion.Value); err != nil {
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
