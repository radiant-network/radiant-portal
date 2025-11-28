package main

import (
	"time"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
)

func processUnexpectedError(batch *types.Batch, unexpectedErr error, repoBatch repository.BatchDAO) {
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
