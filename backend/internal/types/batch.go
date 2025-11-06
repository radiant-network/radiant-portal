package types

import "time"

type SummaryBatch struct {
	Created int
	Updated int
	Skipped int
	Errors  int
}

type ErrorBatch struct {
	ErrorCode string
	Message   string
}

type Batch struct {
	ID         string
	DryRun     bool
	BatchType  string
	Status     string
	CreatedOn  time.Time
	StartedOn  time.Time
	FinishedOn time.Time
	Username   string
	Payload    string
	Summary    SummaryBatch
	Errors     []ErrorBatch
}
