package types

// Count represents a count result
// @Description Count represents count result
type Count struct {
	Count int64 `json:"count"` // Number of results
} // @name Count

// OccurrenceCount represents an occurrence count result
// @Description OccurrenceCount holds both totals of an occurrence count: the query builder total and the one left by the annotation filters
type OccurrenceCount struct {
	Count         int64 `json:"count"`          // Number of results matching the sqon, ignoring the annotation filters
	FilteredCount int64 `json:"filtered_count"` // Number of results also matching with_note / with_flag / with_interpretation; equal to count when none is set
} // @name OccurrenceCount
