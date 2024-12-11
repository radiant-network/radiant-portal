package types

type Sqon struct {
	Field   string      `json:"field,omitempty"`                                                 // Field to filter on (for leaf nodes)
	Value   interface{} `json:"value,omitempty"`                                                 // Value(s) for the filter
	Content []Sqon      `json:"content,omitempty"`                                               // Nested Sqon
	Op      string      `json:"op,omitempty" enums:"in,and,or,not,between,>,<,>=,<=,not-in,all"` // Operation at this node
}

// ListBody - Body of a list request
// @Description Body of a list request
// @Name ListBody
type ListBody struct {
	SelectedFields []string   `json:"selected_fields"`
	Sqon           *Sqon      `json:"sqon"`
	Limit          int        `json:"limit"`
	Offset         int        `json:"offset"`
	Sort           []SortBody `json:"sort"`
}

type SortBody struct {
	Field string `json:"field"`
	Order string `json:"order" enums:"asc,desc"`
} // @Name SortBody

type CountBody struct {
	Sqon *Sqon `json:"sqon"`
} // @Name CountBody

type AggregationBody struct {
	Field string
	Sqon  *Sqon
	Size  int
} // @Name AggregationBody
