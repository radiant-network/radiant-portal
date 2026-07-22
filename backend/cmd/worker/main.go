package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"syscall"
	"time"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/observability"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

var supportedProcessors = map[string]func(context.Context, *batchval.BatchValidationContext, *types.Batch, *gorm.DB) error{
	types.CreatePatientBatchType:              processCreatePatientBatch,
	types.CreateSampleBatchType:               processCreateSampleBatch,
	types.CreateSequencingExperimentBatchType: processCreateSequencingExperimentBatch,
	types.CreateCaseBatchType:                 processCreateCaseBatch,
	types.PatchCaseBatchType:                  processPatchCaseBatch,
	types.UpdateCaseBatchType:                 processUpdateCaseBatch,
	types.UpdatePatientBatchType:              processUpdatePatientBatch,
	types.UpdateSampleBatchType:               processUpdateSampleBatch,
	types.UpdateSequencingExperimentBatchType: processUpdateSequencingExperimentBatch,
}

func main() {
	observability.Setup()

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	pollIntervalStr := utils.GetEnvOrDefault("POLL_INTERVAL_MS", "1000")
	pollInterval, pollIntervalErr := strconv.Atoi(pollIntervalStr)
	if pollIntervalErr != nil {
		slog.Error("POLL_INTERVAL_MS must be an integer", slog.String("value", pollIntervalStr))
		os.Exit(1)
	}

	dbPostgres, initDbErr := database.NewPostgresDB()
	if initDbErr != nil {
		slog.Error("failed to initialize postgres database", slog.Any("error", initDbErr))
		os.Exit(1)
	}

	bv, err := batchval.NewBatchValidationContext(dbPostgres)
	if err != nil {
		slog.Error("failed to initialize batch validation context", slog.Any("error", err))
		os.Exit(1)
	}

	var wg sync.WaitGroup
	StartHealthProbe(ctx, &wg, dbPostgres)
	StartCleanUpWorker(ctx, &wg, dbPostgres)

	slog.Info("worker started")
	runPollLoop(ctx, dbPostgres, bv, time.Duration(pollInterval)*time.Millisecond)

	// Wait for the background goroutines (health probe, cleanup worker) to stop before exiting.
	wg.Wait()
	slog.Info("worker shut down cleanly")
}

// runPollLoop claims and processes batches until ctx is cancelled. It checks ctx before claiming a
// new batch (so a shutdown signal stops it taking on more work); processBatch itself requeues an
// interrupted in-flight batch back to PENDING.
func runPollLoop(ctx context.Context, db *gorm.DB, bv *batchval.BatchValidationContext, pollInterval time.Duration) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}
		processBatch(ctx, db, bv)
		select {
		case <-ctx.Done():
			return
		case <-time.After(pollInterval):
		}
	}
}

func processBatch(ctx context.Context, db *gorm.DB, bv *batchval.BatchValidationContext) {
	nextBatch, err := bv.BatchRepo.ClaimNextBatch(ctx)
	if err != nil {
		slog.ErrorContext(ctx, "error claiming next batch", slog.Any("error", err))
		return
	}
	if nextBatch == nil {
		return
	}

	slog.InfoContext(ctx, "processing batch", slog.String("batch_id", nextBatch.ID), slog.String("batch_type", nextBatch.BatchType))
	processFn, ok := supportedProcessors[nextBatch.BatchType]
	if !ok {
		err = fmt.Errorf("batch type %v not supported", nextBatch.BatchType)
		batchval.ProcessUnexpectedError(ctx, nextBatch, err, bv.BatchRepo)
		return
	}

	// On a graceful shutdown the processor aborts before committing and returns context.Canceled;
	// release the claim back to PENDING so the batch is reprocessed cleanly instead of left RUNNING.
	if procErr := processFn(ctx, bv, nextBatch, db); errors.Is(procErr, context.Canceled) {
		slog.InfoContext(ctx, "shutdown during batch; releasing back to PENDING", slog.String("batch_id", nextBatch.ID))
		if _, relErr := bv.BatchRepo.ReleaseBatch(ctx, nextBatch.ID); relErr != nil {
			slog.ErrorContext(ctx, "failed to release batch", slog.String("batch_id", nextBatch.ID), slog.Any("error", relErr))
		}
	}
}

func StartHealthProbe(ctx context.Context, wg *sync.WaitGroup, db *gorm.DB) {
	port := utils.GetEnvOrDefault("PROBE_PORT", "9999")
	if _, err := strconv.Atoi(port); err != nil {
		slog.Error("PROBE_PORT must be an integer", slog.String("value", port))
		os.Exit(1)
	}
	mux := http.NewServeMux()

	mux.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		sqlDb, err := db.DB()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if err = sqlDb.Ping(); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		slog.Info("starting health probe", slog.String("port", port))

		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("health probe stopped unexpectedly", slog.Any("error", err))
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), utils.ShutdownTimeout())
		defer cancel()
		if err := srv.Shutdown(shutdownCtx); err != nil {
			slog.Error("health probe shutdown error", slog.Any("error", err))
		}
	}()
}

func StartCleanUpWorker(ctx context.Context, wg *sync.WaitGroup, db *gorm.DB) {
	wg.Add(1)
	go func() {
		defer wg.Done()
		cleanUpIntervalPollHourStr := utils.GetEnvOrDefault("CLEAN_UP_INTERVAL_POLL_HOUR", "24")
		pollInterval, pollIntervalErr := strconv.Atoi(cleanUpIntervalPollHourStr)
		if pollIntervalErr != nil {
			slog.Error("CLEAN_UP_INTERVAL_POLL_HOUR must be an integer", slog.String("value", cleanUpIntervalPollHourStr))
			os.Exit(1)
		}

		duration := time.Duration(pollInterval) * time.Hour

		slog.Info("starting clean-up worker", slog.Duration("interval", duration))

		ticker := time.NewTicker(duration)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				slog.Info("clean-up worker started")
				batchRepo := repository.NewBatchRepository(database.PostgresDB{DB: db})
				rowUpdated, err := batchRepo.UpdateStuckBatch(ctx)
				if err != nil {
					slog.Error("error executing batch clean up", slog.Any("error", err))
					continue
				}
				slog.Info("stuck batches updated", slog.Int64("rows_updated", rowUpdated))
			}
		}
	}()
}
