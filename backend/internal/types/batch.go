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

func (s *BatchSummary) Scan(value interface{}) error {
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

func (e *BatchErrorList) Scan(value interface{}) error {
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
	ID         string
	DryRun     bool
	BatchType  string
	Status     string
	CreatedOn  time.Time
	StartedOn  *time.Time
	FinishedOn *time.Time
	Username   string
	Payload    string
	Summary    BatchSummary   `gorm:"column:summary;type:jsonb"`
	Errors     BatchErrorList `gorm:"column:errors;type:jsonb"`
}
