package main

import (
	"flag"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type BatchValidationContext struct {
	BatchRepo       repository.BatchDAO
	CasesRepo       repository.CasesDAO
	DocRepo         repository.DocumentsDAO
	FamilyRepo      repository.FamilyDAO
	ObsCat          repository.ObservationCategoricalDAO
	OrgRepo         repository.OrganizationDAO
	PatientRepo     repository.PatientsDAO
	ProjectRepo     repository.ProjectDAO
	SampleRepo      repository.SamplesDAO
	SeqExpRepo      repository.SequencingExperimentDAO
	TaskRepo        repository.TaskDAO
	ObservationRepo repository.ObservationsDAO
	OnsetRepo       repository.OnsetsDAO
	StatusRepo      repository.StatusDAO
	S3FS            *utils.S3Store
}

func NewBatchValidationContext(db *gorm.DB) *BatchValidationContext {
	return &BatchValidationContext{
		BatchRepo:       repository.NewBatchRepository(db),
		OrgRepo:         repository.NewOrganizationRepository(db),
		PatientRepo:     repository.NewPatientsRepository(db),
		ProjectRepo:     repository.NewProjectRepository(db),
		SampleRepo:      repository.NewSamplesRepository(db),
		SeqExpRepo:      repository.NewSequencingExperimentRepository(db),
		ObservationRepo: repository.NewObservationsRepository(db),
		OnsetRepo:       repository.NewOnsetsRepository(db),
		StatusRepo:      repository.NewStatusRepository(db),
		CasesRepo:       repository.NewCasesRepository(db),
		DocRepo:         repository.NewDocumentsRepository(db),
		S3FS:            utils.NewS3Store(),
	}
}

var supportedProcessors = map[string]func(*BatchValidationContext, *types.Batch, *gorm.DB){
	types.PatientBatchType:              processPatientBatch,
	types.SampleBatchType:               processSampleBatch,
	types.SequencingExperimentBatchType: processSequencingExperimentBatch,
	types.CaseBatchType:                 processCaseBatch,
}

func main() {
	flag.Parse()
	defer glog.Flush()

	pollIntervalStr := utils.GetEnvOrDefault("POLL_INTERVAL_MS", "1000")
	pollInterval, pollIntervalErr := strconv.Atoi(pollIntervalStr)
	if pollIntervalErr != nil {
		glog.Fatalf("Polling interval defined in env var POLL_INTERVAL_MS (%v) must be an integer ", pollIntervalStr)
	}

	dbPostgres, initDbErr := database.NewPostgresDB()
	if initDbErr != nil {
		glog.Fatalf("Failed to initialize postgres database: %v", initDbErr)
	}

	context := NewBatchValidationContext(dbPostgres)
	StartHealthProbe(dbPostgres)
	glog.Info("Worker started...")
	for {
		processBatch(dbPostgres, context)
		time.Sleep(time.Duration(pollInterval) * time.Millisecond)
	}
}

func processBatch(db *gorm.DB, ctx *BatchValidationContext) {
	nextBatch, err := ctx.BatchRepo.ClaimNextBatch()
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
		processUnexpectedError(nextBatch, err, ctx.BatchRepo)
		return
	}

	processFn(ctx, nextBatch, db)
}

func StartHealthProbe(db *gorm.DB) {
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

	go func() {
		glog.Infof("Starting health probe on :%s", port)

		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			glog.Fatalf("Failed to start health probe: %v", err)
		}
	}()
}
