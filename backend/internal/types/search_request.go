package types

import (
	"encoding/json"
	"errors"
	"strings"
)

// Sqon represents a node in the tree.
// Every Sqon has an operator (op) and content.
type Sqon struct {
	Op      string      `json:"op" enums:"in,and,or,not,between,>,<,>=,<=,not-in,all"`
	Content SqonContent `json:"content" oneOf:"LeafContent,SqonArray"`
}

// SqonContent represents the content of a Sqon.
// It can either be a leaf (an object with condition details)
// or an array of nested Sqon nodes.
type SqonContent interface {
	IsLeaf() bool
	Children() SqonArray
	Leaf() *LeafContent
}

type SqonArray []Sqon

// IsLeaf implements the SqonContent interface.
func (SqonArray) IsLeaf() bool { return false }

// LeafContent represents a leaf condition.
type LeafContent struct {
	Field string        `json:"field"`
	Value []interface{} `json:"value"`
}

func (LeafContent) IsLeaf() bool { return true }

func (a LeafContent) Leaf() *LeafContent { return &a }

func (SqonArray) Leaf() *LeafContent { return nil }

func (a LeafContent) Children() SqonArray { return nil }

func (a SqonArray) Children() SqonArray { return a }

// UnmarshalJSON implements custom unmarshaling for Sqon.
func (s *Sqon) UnmarshalJSON(data []byte) error {
	// Create an alias to avoid recursion.
	type sqonAlias struct {
		Op      string          `json:"op"`
		Content json.RawMessage `json:"content"`
	}
	var aux sqonAlias
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	s.Op = aux.Op

	// Trim any leading whitespace.
	trimmed := strings.TrimSpace(string(aux.Content))
	if len(trimmed) == 0 {
		return errors.New("Sqon: content field is empty")
	}

	switch trimmed[0] {
	case '{':
		// It's a leaf content.
		var leaf LeafContent
		if err := json.Unmarshal(aux.Content, &leaf); err != nil {
			return err
		}
		s.Content = leaf
	case '[':
		// It's an array of nested Sqon.
		var arr SqonArray
		if err := json.Unmarshal(aux.Content, &arr); err != nil {
			return err
		}
		s.Content = arr
	default:
		return errors.New("Sqon: invalid JSON for content (expected object or array)")
	}
	return nil
}

// ListBodyWithSqon - Body of a list request
// @Description Body of a list request
// @Name ListBodyWithSqon
type ListBodyWithSqon struct {
	AdditionalFields []string   `json:"additional_fields"`
	Sqon             *Sqon      `json:"sqon"`
	Limit            int        `json:"limit"`
	Offset           int        `json:"offset"`
	PageIndex        int        `json:"page_index"`
	Sort             []SortBody `json:"sort"`
}

type SortBody struct {
	Field string `json:"field"`
	Order string `json:"order" enums:"asc,desc"`
} // @Name SortBody

type CountBodyWithSqon struct {
	Sqon *Sqon `json:"sqon"`
} // @Name CountBodyWithSqon

type AggregationBodyWithSqon struct {
	Field string
	Sqon  *Sqon
	Size  int
} // @Name AggregationBodyWithSqon

type StatisticsBodyWithSqon struct {
	Field string
	Sqon  *Sqon
} // @Name StatisticsBodyWithSqon

type ArraySqon []Sqon

type SearchCriterion struct {
	FieldName string        `json:"field"`
	Value     []interface{} `json:"value"`
}

// ListBodyWithCriteria - Body of a list request with search criteria
// @Description Body of a list request with search criteria
// @Name ListBodyWithCriteria
type ListBodyWithCriteria struct {
	AdditionalFields []string          `json:"additional_fields"`
	SearchCriteria   []SearchCriterion `json:"search_criteria"`
	Limit            int               `json:"limit"`
	Offset           int               `json:"offset"`
	PageIndex        int               `json:"page_index"`
	Sort             []SortBody        `json:"sort"`
}

type CountBodyWithCriteria struct {
	SearchCriteria []SearchCriterion `json:"search_criteria"`
} // @Name CountBodyWithCriteria

type FiltersBodyWithCriteria struct {
	SearchCriteria []SearchCriterion `json:"search_criteria"`
} // @Name FiltersBodyWithCriteria
