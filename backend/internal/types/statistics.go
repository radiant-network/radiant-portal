package types

// Statistics represents statistics about a column
// @Description Statistics represents statistics about a column
type Statistics struct {
	Min float64 `json:"min"` // Min for numeric facet
	Max float64 `json:"max"` // Max for numeric facet
} // @Name Statistics
