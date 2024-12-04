package types

type SQON struct {
	Field   string      `json:"field,omitempty"`   // Field to filter on (for leaf nodes)
	Value   interface{} `json:"value,omitempty"`   // Value(s) for the filter
	Content []SQON      `json:"content,omitempty"` // Nested SQON (for "not" or nested filters)
	Op      string      `json:"op,omitempty"`      // Operation at this node
}

type ListBody struct {
	SelectedFields []string   `json:"selected_fields"`
	SQON           *SQON      `json:"sqon"`
	Limit          int        `json:"limit"`
	Offset         int        `json:"offset"`
	Sort           []SortBody `json:"sort"`
}

type SortBody struct {
	Field string `json:"field"`
	Order string `json:"order"`
}

type CountBody struct {
	SQON *SQON `json:"sqon"`
}

type AggregationBody struct {
	Field string
	SQON  *SQON
	Size  int
}
