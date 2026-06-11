package batchval

import (
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type batchProcessor interface {
	ClaimNextBatch() (*types.Batch, error)
	UpdateBatch(batch types.Batch) (int64, error)
	ReleaseBatch(batchId string) (int64, error)
}

type casesReader interface {
	GetCaseAnalysisCatalogIdByCode(code string) (*types.AnalysisCatalog, error)
	GetCaseBySubmitterCaseIdAndProjectId(submitterCaseId string, projectId int) (*types.Case, error)
}

type documentsReader interface {
	GetDocumentByUrl(url string) (*types.Document, error)
}

type sequencingExperimentReader interface {
	GetSequencingExperimentByAliquot(aliquot string) ([]types.SequencingExperiment, error)
	GetSequencingExperimentByAliquotAndSubmitterSample(aliquot string, submitterSampleId string, sampleOrganizationCode string) (*types.SequencingExperiment, error)
	GetSequencingExperimentsByCaseId(caseID int) ([]types.SequencingExperiment, error)
}

type taskReader interface {
	GetTaskContextBySequencingExperimentId(seqExpId int) ([]*types.TaskContext, error)
	GetTaskHasDocumentByDocumentId(documentId int) ([]*types.TaskHasDocument, error)
}

type familyStore interface {
	CreateFamily(family *types.Family) error
}

type organizationReader interface {
	GetOrganizationByCode(organizationCode string) (*types.Organization, error)
}

type patientReader interface {
	GetPatientByOrgCodeAndSubmitterPatientId(organizationCode string, submitterPatientId string) (*types.Patient, error)
}

type projectReader interface {
	GetProjectByCode(code string) (*types.Project, error)
}

type sampleReader interface {
	GetSampleById(id int) (*types.Sample, error)
	GetSampleByOrgCodeAndSubmitterSampleId(organizationCode string, submitterSampleId string) (*types.Sample, error)
}

type valueSetsReader interface {
	GetCodes(vsType repository.ValueSetType) ([]string, error)
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

	return &BatchValidationContext{
		BatchRepo:     repository.NewBatchRepository(db),
		OrgRepo:       repository.NewOrganizationRepository(db),
		PatientRepo:   repository.NewPatientsRepository(db),
		ProjectRepo:   repository.NewProjectRepository(db),
		SampleRepo:    repository.NewSamplesRepository(db),
		SeqExpRepo:    repository.NewSequencingExperimentRepository(db),
		ValueSetsRepo: repository.NewValueSetsRepository(db),
		CasesRepo:     repository.NewCasesRepository(db),
		DocRepo:       repository.NewDocumentsRepository(db),
		FamilyRepo:    repository.NewFamilyRepository(db),
		TaskRepo:      repository.NewTaskRepository(db),
		S3FS:          s3fs,
	}, nil
}
