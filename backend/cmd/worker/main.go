package main

import (
	"flag"
	"fmt"
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
	if initDbErr != nil {
		glog.Fatalf("Failed to initialize postgres database: %v", initDbErr)
	}
	repoBatch := repository.NewBatchRepository(dbPostgres)
	repoPatient := repository.NewPatientsRepository(dbPostgres)
	repoOrganization := repository.NewOrganizationRepository(dbPostgres)
	glog.Info("Worker started...")
	for {
		processBatch(repoBatch, repoOrganization, repoPatient)
		time.Sleep(1 * time.Second)
	}

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
