package types

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

type BatchSummary struct {
	Created int `json:"created"`
	Updated int `json:"updated"`
	Skipped int `json:"skipped"`
	Errors  int `json:"errors"`
}

func (s BatchSummary) Value() (driver.Value, error) {
	return json.Marshal(s)
}

func (s *BatchSummary) Scan(value any) error {
	if value == nil {
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("failed to scan BatchSummary: %v", value)
	}
	return json.Unmarshal(bytes, s)
}

type BatchError struct {
	ErrorCode string `json:"error_code"`
	Message   string `json:"message"`
}

// Slice version, since Errors is []BatchError
type BatchErrorList []BatchError

func (e BatchErrorList) Value() (driver.Value, error) {
	return json.Marshal(e)
}

func (e *BatchErrorList) Scan(value any) error {
	if value == nil {
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("failed to scan BatchErrorList: %v", value)
	}
	return json.Unmarshal(bytes, e)
}

type Batch struct {
	ID         string         `json:"id" validate:"required" gorm:"primary_key; unique; type:uuid; column:id; default:uuid_generate_v4()"`
	DryRun     bool           `json:"dry_run"`
	BatchType  string         `json:"batch_type"`
	Status     string         `json:"status"`
	CreatedOn  time.Time      `json:"created_on"`
	StartedOn  *time.Time     `json:"started_on,omitempty"`
	FinishedOn *time.Time     `json:"finished_on,omitempty"`
	Username   string         `json:"username"`
	Payload    string         `json:"payload"`
	Summary    BatchSummary   `gorm:"column:summary;type:jsonb"`
	Errors     BatchErrorList `gorm:"column:errors;type:jsonb"`
}

var BatchTable = Table{
	Name:  "batch",
	Alias: "b",
}

func (Batch) TableName() string {
	return BatchTable.Name
}

// CreateBatchQueryParam represents the query parameters for creating a batch
// @Description CreateBatchQueryParam represents the query parameters for creating a batch
type CreateBatchQueryParam struct {
	DryRun bool `form:"dry_run"`
} //@Name CreateBatchQueryParam

// CreateBatchResponse represents the response returned when creating a new batch
// @Description CreateBatchResponse represents the response returned when creating a new batch
type CreateBatchResponse struct {
	ID        string    `json:"id"`
	DryRun    bool      `json:"dry_run"`
	BatchType string    `json:"batch_type"`
	Status    string    `json:"status"`
	CreatedOn time.Time `json:"created_on"`
	Username  string    `json:"username"`
} //@Name CreateBatchResponse

// GetBatchResponse represents the response returned when retrieving a batch
// @Description GetBatchResponse represents the response returned when retrieving a batch
type GetBatchResponse struct {
	ID         string         `json:"id"`
	DryRun     bool           `json:"dry_run"`
	BatchType  string         `json:"batch_type"`
	Status     string         `json:"status"`
	CreatedOn  time.Time      `json:"created_on"`
	StartedOn  *time.Time     `json:"started_on,omitempty"`
	FinishedOn *time.Time     `json:"finished_on,omitempty"`
	Username   string         `json:"username"`
	Summary    BatchSummary   `json:"summary"`
	Errors     BatchErrorList `json:"errors,omitempty"`
} //@Name GetBatchResponse
