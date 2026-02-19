package batchval

import (
	"slices"
	"time"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
)

func CopyRecordIntoBatch[T interface{ GetBase() *BaseValidationRecord }](batch *types.Batch, records []T) {
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

func ProcessUnexpectedError(batch *types.Batch, unexpectedErr error, repoBatch repository.BatchDAO) {
	glog.Errorf("unexpected error for batch %v: %v", batch.ID, unexpectedErr)
	now := time.Now()
	batch.FinishedOn = &now
	batch.Status = types.BatchStatusError
	errorMessage := types.BatchMessage{
		Code:    "GLOBAL-000",
		Message: unexpectedErr.Error(),
	}
	report := types.BatchReport{Errors: []types.BatchMessage{errorMessage}}
	batch.Report = report
	rowsUpdated, updateErr := repoBatch.UpdateBatch(*batch)
	if updateErr != nil {
		glog.Errorf("failed to update batch %v status to ERROR: %v", batch.ID, updateErr)
		return
	}
	if rowsUpdated == 0 {
		glog.Warningf("no rows updated when setting batch %v status to ERROR", batch.ID)
	}
}

func UpdateBatch[T interface{ GetBase() *BaseValidationRecord }](batch *types.Batch, records []T, r *repository.BatchRepository) (int64, error) {
	CopyRecordIntoBatch(batch, records)
	now := time.Now()
	batch.FinishedOn = &now
	return r.UpdateBatch(*batch)
}

func ValidateUniquenessInBatch[K comparable](
	record ValidationRecord,
	key K,
	seenBatchMap map[K]struct{},
	duplicateCode string,
	ids []string,
) {
	if _, exists := seenBatchMap[key]; exists {
		message := FormatDuplicateInBatch(record.GetResourceType(), ids)
		path := FormatPath(record, "")
		record.GetBase().AddErrors(message, duplicateCode, path)
	} else {
		seenBatchMap[key] = struct{}{}
	}
}
