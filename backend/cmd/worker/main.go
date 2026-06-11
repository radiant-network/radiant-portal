package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os/signal"
	"strconv"
	"sync"
	"syscall"
	"time"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

var supportedProcessors = map[string]func(context.Context, *batchval.BatchValidationContext, *types.Batch, *gorm.DB) error{
	types.PatientBatchType:              processPatientBatch,
	types.SampleBatchType:               processSampleBatch,
	types.SequencingExperimentBatchType: processSequencingExperimentBatch,
	types.CaseBatchType:                 processCaseBatch,
	types.PatchCaseBatchType:            processPatchCaseBatch,
}

func main() {
	flag.Parse()
	defer glog.Flush()

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	pollIntervalStr := utils.GetEnvOrDefault("POLL_INTERVAL_MS", "1000")
	pollInterval, pollIntervalErr := strconv.Atoi(pollIntervalStr)
	if pollIntervalErr != nil {
		glog.Fatalf("Polling interval defined in env var POLL_INTERVAL_MS (%v) must be an integer ", pollIntervalStr)
	}

	dbPostgres, initDbErr := database.NewPostgresDB()
	if initDbErr != nil {
		glog.Fatalf("Failed to initialize postgres database: %v", initDbErr)
	}

	bv, err := batchval.NewBatchValidationContext(dbPostgres)
	if err != nil {
		glog.Fatalf("Failed to initialize batch validation context: %v", err)
	}

	var wg sync.WaitGroup
	StartHealthProbe(ctx, &wg, dbPostgres)
	StartCleanUpWorker(ctx, &wg, dbPostgres)

	glog.Info("Worker started...")
	runPollLoop(ctx, dbPostgres, bv, time.Duration(pollInterval)*time.Millisecond)

	// Wait for the background goroutines (health probe, cleanup worker) to stop before exiting.
	wg.Wait()
	glog.Info("Worker shut down cleanly")
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
	nextBatch, err := bv.BatchRepo.ClaimNextBatch()
	if err != nil {
		glog.Errorf("Error claiming next batch: %v", err)
		return
	}
	if nextBatch == nil {
		return
	}

	glog.Infof("Processing batch: %v", nextBatch.ID)
	processFn, ok := supportedProcessors[nextBatch.BatchType]
	if !ok {
		err = fmt.Errorf("batch type %v not supported", nextBatch.BatchType)
		batchval.ProcessUnexpectedError(nextBatch, err, bv.BatchRepo)
		return
	}

	// On a graceful shutdown the processor aborts before committing and returns context.Canceled;
	// release the claim back to PENDING so the batch is reprocessed cleanly instead of left RUNNING.
	if procErr := processFn(ctx, bv, nextBatch, db); errors.Is(procErr, context.Canceled) {
		glog.Infof("Shutdown during batch %v; releasing it back to PENDING", nextBatch.ID)
		if _, relErr := bv.BatchRepo.ReleaseBatch(nextBatch.ID); relErr != nil {
			glog.Errorf("Failed to release batch %v: %v", nextBatch.ID, relErr)
		}
	}
}

func StartHealthProbe(ctx context.Context, wg *sync.WaitGroup, db *gorm.DB) {
	port := utils.GetEnvOrDefault("PROBE_PORT", "9999")
	if _, err := strconv.Atoi(port); err != nil {
		glog.Fatalf("Probe port defined in env var PROBE_PORT (%v) must be an integer ", port)
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
		Addr:    ":" + port,
		Handler: mux,
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		glog.Infof("Starting health probe on :%s", port)

		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			glog.Errorf("Health probe stopped unexpectedly: %v", err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), utils.ShutdownTimeout())
		defer cancel()
		if err := srv.Shutdown(shutdownCtx); err != nil {
			glog.Errorf("Health probe shutdown error: %v", err)
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
			glog.Fatalf("Polling interval defined in env var CLEAN_UP_INTERVAL_POLL_HOUR (%v) must be an integer ", cleanUpIntervalPollHourStr)
		}

		duration := time.Duration(pollInterval) * time.Hour

		glog.Infof("Starting clean-up worker with interval: %v", duration)

		ticker := time.NewTicker(duration)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				glog.Info("Clean up worker started...")
				batchRepo := repository.NewBatchRepository(db)
				rowUpdated, err := batchRepo.UpdateStuckBatch()
				if err != nil {
					glog.Errorf("Error executing batch clean up: %v", err)
					continue
				}
				glog.Info("Stuck batches updated: ", rowUpdated)
			}
		}
	}()
}
