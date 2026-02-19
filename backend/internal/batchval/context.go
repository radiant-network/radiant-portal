package batchval

import (
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type BatchValidationContext struct {
	BatchRepo     repository.BatchDAO
	CasesRepo     repository.CasesDAO
	DocRepo       repository.DocumentsDAO
	FamilyRepo    repository.FamilyDAO
	ObsCat        repository.ObservationCategoricalDAO
	OrgRepo       repository.OrganizationDAO
	PatientRepo   repository.PatientsDAO
	ProjectRepo   repository.ProjectDAO
	SampleRepo    repository.SamplesDAO
	SeqExpRepo    repository.SequencingExperimentDAO
	TaskRepo      repository.TaskDAO
	ValueSetsRepo repository.ValueSetsDAO
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
		ObsCat:        repository.NewObservationCategoricalRepository(db),
		TaskRepo:      repository.NewTaskRepository(db),
		S3FS:          s3fs,
	}, nil
}
