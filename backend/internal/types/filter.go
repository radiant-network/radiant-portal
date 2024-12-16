package types

import (
	"fmt"
	"github.com/Goldziher/go-utils/sliceutils"
	"slices"
	"strings"
)

type FilterNode interface {
	ToSQL(overrideTableAliases map[string]string) (string, []interface{})
}
type FilterNodeWithChildren interface {
	ToSQL(overrideTableAliases map[string]string) (string, []interface{})
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

func (n *AndNode) ToSQL(overrideTableAliases map[string]string) (string, []interface{}) {
	return childrenToSQL(n, "AND", overrideTableAliases)
}

func (n *OrNode) ToSQL(overrideTableAliases map[string]string) (string, []interface{}) {
	return childrenToSQL(n, "OR", overrideTableAliases)
}

func childrenToSQL(n FilterNodeWithChildren, op string, overrideTableAliases map[string]string) (string, []interface{}) {
	children := n.GetChildren()
	parts := make([]string, len(children))
	var newParams []interface{}
	for i, child := range children {
		part, params := child.ToSQL(overrideTableAliases)
		newParams = append(newParams, params...)
		parts[i] = part
	}
	join := strings.Join(parts, fmt.Sprintf(" %s ", op))
	return fmt.Sprintf("(%s)", join), newParams
}

func (n *NotNode) ToSQL(overrideTableAliases map[string]string) (string, []interface{}) {
	part, params := n.Child.ToSQL(overrideTableAliases)
	return fmt.Sprintf("NOT (%s)", part), params
}

func (n *ComparisonNode) ToSQL(overrideTableAliases map[string]string) (string, []interface{}) {
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
			if n.Field.IsArray() {
				return fmt.Sprintf("array_contains(%s, %s)", field, placeholder), params
			}
			return fmt.Sprintf("%s = %s", field, placeholder), params
		}
		if n.Field.IsArray() {
			return fmt.Sprintf("arrays_overlap(%s, [%s])", field, placeholder), params
		}
		return fmt.Sprintf("%s %s (%s)", field, operator, placeholder), params
	case "not-in":
		placeholder := placeholders(valueLength)
		operator := "NOT IN"
		if valueLength == 1 {
			if n.Field.IsArray() {
				return fmt.Sprintf("NOT(array_contains(%s, %s))", field, placeholder), params
			}
			return fmt.Sprintf("%s <> %s", field, placeholder), params
		}
		if n.Field.IsArray() {
			return fmt.Sprintf("NOT(arrays_overlap(%s, [%s]))", field, placeholder), params
		}
		return fmt.Sprintf("%s %s (%s)", field, operator, placeholder), params
	case "<=", ">=", "<", ">":
		if n.Field.IsArray() {
			return fmt.Sprintf("any_match(x -> x %s ?, %s)", n.Operator, field), params
		}
		return fmt.Sprintf("%s %s ?", field, n.Operator), params
	case "between":
		if n.Field.IsArray() {
			return fmt.Sprintf("any_match(x -> x BETWEEN ? AND ?, %s)", field), params
		}
		return fmt.Sprintf("%s BETWEEN ? AND ?", field), params
	case "all":
		if !n.Field.IsArray() {
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
func placeholders(count int) string {
	return strings.TrimSuffix(strings.Repeat("?, ", count), ", ")
}

func sqonToFilter(sqon *Sqon, fields []Field, excludedFields []Field) (FilterNode, []Field, error) {
	if sqon.Field != "" && sqon.Content != nil {
		return nil, nil, fmt.Errorf("a sqon cannot have both content and field defined: %s", sqon.Field)
	}
	switch sqon.Op {

	case "and", "or":
		if len(sqon.Content) == 1 { // Flatten single child AND/OR nodes
			return sqonToFilter(&sqon.Content[0], fields, excludedFields)
		}
		var children []FilterNode
		var newVisitedFields []Field
		for _, item := range sqon.Content {
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
		if len(sqon.Content) != 1 {
			return nil, nil, fmt.Errorf("'not' operation must have exactly one child: %s", sqon.Field)
		}
		ast, meta, err := sqonToFilter(&sqon.Content[0], fields, excludedFields)
		if err != nil {
			return nil, nil, err
		}
		if meta != nil && ast != nil {
			return &NotNode{Child: ast}, meta, nil
		}
		// Children Nodes are empty (excluded)
		return nil, nil, nil

	case "in", "not-in", "<", ">", "<=", ">=", "between", "all":
		if sqon.Value == nil {
			return nil, nil, fmt.Errorf("value must be defined: %s", sqon.Field)
		}
		meta := findByAlias(fields, sqon.Field)

		if meta == nil || !meta.CanBeFiltered {
			return nil, nil, fmt.Errorf("unauthorized or unknown field: %s", sqon.Field)
		}

		//Field is in list of excludedFields, return empty node
		if excludedFields != nil && slices.Contains(excludedFields, *meta) {
			return nil, nil, nil
		}

		if sqon.Op == "between" {
			values, ok := sqon.Value.([]interface{})
			if !ok {
				return nil, nil, fmt.Errorf("value should be an array of 2 elements when operation is 'between': %s", sqon.Field)
			}
			if len(values) != 2 {
				return nil, nil, fmt.Errorf("value array should contain exactly 2 elements when operation is 'between': %s", sqon.Field)
			}
		}

		_, isMultipleValue := sqon.Value.([]interface{})
		if sqon.Op != "in" && sqon.Op != "not-in" && sqon.Op != "all" && isMultipleValue {
			return nil, nil, fmt.Errorf("operation %s must have exactly one value: %s", sqon.Op, sqon.Field)
		}

		return &ComparisonNode{
			Operator: sqon.Op,
			Value:    sqon.Value,
			Field:    *meta,
		}, []Field{*meta}, nil

	default:
		return nil, nil, fmt.Errorf("invalid operation: %s", sqon.Op)
	}
}
