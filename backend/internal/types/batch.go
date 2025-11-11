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

// Batcheable represents an interface for types that can be used as batch payloads
type Batcheable interface {
	// BatchType returns the type of the batch as a string
	BatchType() string
	// ToPayload converts the batch to its JSON string representation
	ToPayload() (string, error)
}

var BatchTable = Table{
	Name:  "batch",
	Alias: "b",
}

func (Batch) TableName() string {
	return BatchTable.Name
}

// CreateBatchResponse represents the response returned when creating a new batch
// @Description CreateBatchResponse represents the response returned when creating a new batch
type CreateBatchResponse struct {
	ID        string
	BatchType string
	Status    string
	CreatedOn time.Time
	Username  string
	DryRun    bool
} //@Name CreateBatchResponse

// GetBatchResponse represents the response returned when retrieving a batch
// @Description GetBatchResponse represents the response returned when retrieving a batch
type GetBatchResponse struct {
	ID         string
	DryRun     bool
	BatchType  string
	Status     string
	CreatedOn  time.Time
	StartedOn  time.Time
	FinishedOn time.Time
	Username   string
	Summary    SummaryBatch
	Errors     []ErrorBatch
} //@Name GetBatchResponse
