package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

func main() {
	flag.Parse()
	defer glog.Flush()
	dbPostgres, initDbErr := database.NewPostgresDB()
	pollIntervalStr := getEnvOrDefault("POLL_INTERVAL_MS", "1000")
	pollInterval, pollIntervalErr := strconv.Atoi(pollIntervalStr)
	if pollIntervalErr != nil {
		glog.Fatalf("Polling interval defined in env var POLL_INTERVAL_MS (%v) must be an integer ", pollIntervalStr)
	}

	if initDbErr != nil {
		glog.Fatalf("Failed to initialize postgres database: %v", initDbErr)
	}
	repoBatch := repository.NewBatchRepository(dbPostgres)
	repoPatient := repository.NewPatientsRepository(dbPostgres)
	repoOrganization := repository.NewOrganizationRepository(dbPostgres)

	StartHealthProbe(dbPostgres)

	glog.Info("Worker started...")
	for {
		processBatch(dbPostgres, repoBatch, repoOrganization, repoPatient)
		time.Sleep(time.Duration(pollInterval) * time.Millisecond)
	}

}

func getEnvOrDefault(key, fallback string) string {
	value, exists := os.LookupEnv(key)
	if !exists || value == "" { // Check if not exists OR if the value is empty
		return fallback
	}
	return value
}

func processBatch(db *gorm.DB, repoBatch *repository.BatchRepository, repoOrganization *repository.OrganizationRepository, repoPatient *repository.PatientsRepository) {
	nextBatch, err := repoBatch.ClaimNextBatch()
	if err != nil {
		glog.Errorf("Error claiming next batch: %v", err)
	}
	if nextBatch != nil {
		glog.Infof("Processing batch: %v", nextBatch.ID)
		if nextBatch.BatchType == types.PatientBatchType {
			processPatientBatch(nextBatch, db, repoOrganization, repoPatient, repoBatch)
		} else {
			notSupportedBatch := fmt.Errorf("batch type %v not supported", nextBatch.BatchType)
			processUnexpectedError(nextBatch, notSupportedBatch, repoBatch)
		}
	}
}

func StartHealthProbe(db *gorm.DB) {
	port := getEnvOrDefault("PROBE_PORT", "9999")
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

	go func() {
		glog.Infof("Starting health probe on :%s", port)

		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			glog.Fatalf("Failed to start health probe: %v", err)
		}
	}()
}
