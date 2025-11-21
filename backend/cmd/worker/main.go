package main

import (
	"flag"
	"fmt"
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

	pollIntervalStr := getEnvOrDefault("POLL_INTERVAL_MS", "1000")
	pollInterval, pollIntervalErr := strconv.Atoi(pollIntervalStr)
	if pollIntervalErr != nil {
		glog.Fatalf("Polling interval defined in env var POLL_INTERVAL_MS (%v) must be an integer ", pollIntervalStr)
	}

	dbPostgres, initDbErr := database.NewPostgresDB()
	if initDbErr != nil {
		glog.Fatalf("Failed to initialize postgres database: %v", initDbErr)
	}

	repoBatch := repository.NewBatchRepository(dbPostgres)
	repoOrganization := repository.NewOrganizationRepository(dbPostgres)
	repoPatient := repository.NewPatientsRepository(dbPostgres)
	repoSample := repository.NewSamplesRepository(dbPostgres)

	glog.Info("Worker started...")
	for {
		processBatch(dbPostgres, repoBatch, repoOrganization, repoPatient, repoSample)
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

func processBatch(db *gorm.DB, repoBatch *repository.BatchRepository, repoOrganization *repository.OrganizationRepository, repoPatient *repository.PatientsRepository, repoSample *repository.SamplesRepository) {
	nextBatch, err := repoBatch.ClaimNextBatch()
	if err != nil {
		glog.Errorf("Error claiming next batch: %v", err)
	}
	if nextBatch != nil {
		glog.Info("Processing batch: %v", nextBatch.ID)
		switch nextBatch.BatchType {
		case types.PatientBatchType:
			processPatientBatch(nextBatch, db, repoOrganization, repoPatient, repoBatch)
		case types.SampleBatchType:
			processSampleBatch(nextBatch, db, repoOrganization, repoSample, repoBatch)
		default:
			notSupportedBatch := fmt.Errorf("batch type %v not supported", nextBatch.BatchType)
			processUnexpectedError(nextBatch, notSupportedBatch, repoBatch)
		}
	}
}
