package batchval

import (
	"context"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type batchProcessor interface {
	ClaimNextBatch(ctx context.Context) (*types.Batch, error)
	UpdateBatch(ctx context.Context, batch types.Batch) (int64, error)
	ReleaseBatch(ctx context.Context, batchId string) (int64, error)
}

type casesReader interface {
	GetCaseAnalysisCatalogIdByCode(ctx context.Context, code string) (*types.AnalysisCatalog, error)
	GetCaseBySubmitterCaseIdAndProjectId(ctx context.Context, submitterCaseId string, projectId int) (*types.Case, error)
}

type documentsReader interface {
	GetDocumentByUrl(ctx context.Context, url string) (*types.Document, error)
}

type sequencingExperimentReader interface {
	GetSequencingExperimentByAliquot(ctx context.Context, aliquot string) ([]types.SequencingExperiment, error)
	GetSequencingExperimentByAliquotAndSubmitterSample(ctx context.Context, aliquot string, submitterSampleId string, sampleOrganizationCode string) (*types.SequencingExperiment, error)
	GetSequencingExperimentsByCaseId(ctx context.Context, caseID int) ([]types.SequencingExperiment, error)
}

type taskReader interface {
	GetTaskContextBySequencingExperimentId(ctx context.Context, seqExpId int) ([]*types.TaskContext, error)
	GetTaskHasDocumentByDocumentId(ctx context.Context, documentId int) ([]*types.TaskHasDocument, error)
}

type familyStore interface {
	CreateFamily(ctx context.Context, family *types.Family) error
}

type organizationReader interface {
	GetOrganizationByCode(ctx context.Context, organizationCode string) (*types.Organization, error)
}

type patientReader interface {
	GetPatientByOrgCodeAndSubmitterPatientId(ctx context.Context, organizationCode string, submitterPatientId string) (*types.Patient, error)
}

type projectReader interface {
	GetProjectByCode(ctx context.Context, code string) (*types.Project, error)
}

type sampleReader interface {
	GetSampleById(ctx context.Context, id int) (*types.Sample, error)
	GetSampleByOrgCodeAndSubmitterSampleId(ctx context.Context, organizationCode string, submitterSampleId string) (*types.Sample, error)
}

type valueSetsReader interface {
	GetCodes(ctx context.Context, vsType postgres.ValueSetType) ([]string, error)
}

type BatchValidationContext struct {
	BatchRepo     batchProcessor
	CasesRepo     casesReader
	DocRepo       documentsReader
	FamilyRepo    familyStore
	OrgRepo       organizationReader
	PatientRepo   patientReader
	ProjectRepo   projectReader
	SampleRepo    sampleReader
	SeqExpRepo    sequencingExperimentReader
	TaskRepo      taskReader
	ValueSetsRepo valueSetsReader
	S3FS          utils.FileMetadataGetter
}

func NewBatchValidationContext(db *gorm.DB) (*BatchValidationContext, error) {

	s3fs, err := utils.NewS3Store()
	if err != nil {
		return nil, err
	}

	postgresDB := database.PostgresDB{DB: db}

	return &BatchValidationContext{
		BatchRepo:     postgres.NewBatchRepository(postgresDB),
		OrgRepo:       postgres.NewOrganizationRepository(postgresDB),
		PatientRepo:   postgres.NewPatientsRepository(postgresDB),
		ProjectRepo:   postgres.NewProjectRepository(postgresDB),
		SampleRepo:    postgres.NewSamplesRepository(postgresDB),
		SeqExpRepo:    repository.NewSequencingExperimentRepository(db),
		ValueSetsRepo: postgres.NewValueSetsRepository(postgresDB),
		CasesRepo:     repository.NewCasesRepository(db),
		DocRepo:       repository.NewDocumentsRepository(db),
		FamilyRepo:    postgres.NewFamilyRepository(postgresDB),
		TaskRepo:      postgres.NewTaskRepository(postgresDB),
		S3FS:          s3fs,
	}, nil
}
