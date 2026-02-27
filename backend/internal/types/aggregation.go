package types

// Aggregation represents an aggregation result
// @Description Aggregation represents an aggregation result
type Aggregation struct {
	Bucket string `json:"key" validate:"required"`   // Bucket key
	Label  string `json:"label,omitempty"`           // Label corresponding to the key
	Count  int64  `json:"count" validate:"required"` // Count in the bucket
} // @Name Aggregation

// AggregationQueryParam represents the query parameters for an aggregation
// @Description AggregationQueryParam represents the query parameters for an aggregation
type AggregationQueryParam struct {
	WithDictionary bool `form:"with_dictionary"` // Whether to include all possible facet values
} // @Name AggregationQueryParam
