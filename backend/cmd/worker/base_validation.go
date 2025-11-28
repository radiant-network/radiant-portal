package main

import (
	"fmt"
	"slices"
	"strings"
	"time"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
)

const TextMaxLength = 100

type ValidationRecord interface {
	GetBase() *BaseValidationRecord
	GetResourceType() string
}

type BaseValidationRecord struct {
	Index    int
	Skipped  bool
	Errors   []types.BatchMessage
	Warnings []types.BatchMessage
	Infos    []types.BatchMessage
}

func (r *BaseValidationRecord) addErrors(message string, code string, path string) {
	r.Errors = append(r.Errors, types.BatchMessage{
		Code:    code,
		Message: message,
		Path:    path,
	})
}

func (r *BaseValidationRecord) addWarnings(message string, code string, path string) {
	r.Warnings = append(r.Warnings, types.BatchMessage{
		Code:    code,
		Message: message,
		Path:    path,
	})
}

func (r *BaseValidationRecord) addInfos(message string, code string, path string) {
	r.Infos = append(r.Infos, types.BatchMessage{
		Code:    code,
		Message: message,
		Path:    path,
	})
}

func formatPath(r ValidationRecord, fieldName string) string {
	if fieldName == "" {
		return fmt.Sprintf("%s[%d]", r.GetResourceType(), r.GetBase().Index)
	}
	return fmt.Sprintf("%s[%d].%s", r.GetResourceType(), r.GetBase().Index, fieldName)
}

func formatInvalidField(r ValidationRecord, fieldName string, reason string, resourceIds []string) string {
	formatResourceIds := ""
	if len(resourceIds) > 0 {
		formatResourceIds = fmt.Sprintf(" (%s)", strings.Join(resourceIds, " / "))
	}
	message := fmt.Sprintf("Invalid Field %s for %s%s. Reason: %s", fieldName, r.GetResourceType(), formatResourceIds, reason)
	return message
}

func formatFieldTooLong(r ValidationRecord, fieldName string, maxLength int, resourceIds []string) string {
	reason := fmt.Sprintf("field is too long, maximum length allowed is %d", maxLength)
	return formatInvalidField(r, fieldName, reason, resourceIds)
}

func updateBatch[T interface{ GetBase() *BaseValidationRecord }](batch *types.Batch, records []T, r *repository.BatchRepository) (int64, error) {
	copyRecordIntoBatch(batch, records)
	now := time.Now()
	batch.FinishedOn = &now
	return r.UpdateBatch(*batch)
}

func copyRecordIntoBatch[T interface{ GetBase() *BaseValidationRecord }](batch *types.Batch, records []T) {
	skipped := 0
	created := 0
	errors := 0

	for _, record := range records {
		base := record.GetBase()
		batch.Report.Infos = slices.Concat(batch.Report.Infos, base.Infos)
		batch.Report.Errors = slices.Concat(batch.Report.Errors, base.Errors)
		batch.Report.Warnings = slices.Concat(batch.Report.Warnings, base.Warnings)

		if len(base.Errors) > 0 {
			errors += 1
			continue
		}
		if base.Skipped {
			skipped += 1
		} else if !batch.DryRun {
			created += 1
		}
	}
	if errors > 0 {
		skipped = len(records) - errors
		created = 0
	}
	summary := types.BatchSummary{Created: created, Skipped: skipped, Errors: errors}
	batch.Summary = summary
	if errors > 0 {
		batch.Status = types.BatchStatusError
	} else {
		batch.Status = types.BatchStatusSuccess
	}
}
