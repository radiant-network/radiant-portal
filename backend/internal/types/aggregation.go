package types

// Aggregation represents an aggregation result
// @Description Aggregation represents an aggregation result
type Aggregation struct {
	Bucket string `json:"key"`             // Bucket key
	Label  string `json:"label,omitempty"` // Label corresponding to the key
	Count  int64  `json:"count"`           // Count in the bucket
} // @Name Aggregation
