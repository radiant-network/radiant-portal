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
	glog.Info("Worker started...")
	for {
		processBatch(repoBatch, repoOrganization, repoPatient)
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

func processBatch(repoBatch *repository.BatchRepository, repoOrganization *repository.OrganizationRepository, repoPatient *repository.PatientsRepository) {
	nextBatch, err := repoBatch.ClaimNextBatch()
	if err != nil {
		glog.Errorf("Error claiming next batch: %v", err)
	}
	if nextBatch != nil {
		glog.Info("Processing batch: %v", nextBatch)
		if nextBatch.BatchType == types.PatientBatchType {
			processPatientBatch(nextBatch, repoOrganization, repoPatient, repoBatch)
		} else {
			notSupportedBatch := fmt.Errorf("batch type %v not supported", nextBatch.BatchType)
			processUnexpectedError(nextBatch, notSupportedBatch, repoBatch)
		}
	}
}
