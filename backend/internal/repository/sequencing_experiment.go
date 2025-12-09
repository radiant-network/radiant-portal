package repository

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type SequencingExperiment = types.SequencingExperiment

type SequencingExperimentRepository struct {
	db *gorm.DB
}

type SequencingExperimentDAO interface {
	CreateSequencingExperiment(*SequencingExperiment) error
	GetSequencingExperimentBySampleID(sampleID int) ([]SequencingExperiment, error)
	GetSequencingExperimentByAliquot(aliquot string) ([]SequencingExperiment, error)
}

func NewSequencingExperimentRepository(db *gorm.DB) *SequencingExperimentRepository {
	return &SequencingExperimentRepository{db: db}
}

func (r *SequencingExperimentRepository) CreateSequencingExperiment(seqExp *SequencingExperiment) error {
	return r.db.Create(&seqExp).Error
}

func (r *SequencingExperimentRepository) GetSequencingExperimentBySampleID(sampleID int) ([]SequencingExperiment, error) {
	var seqExps []SequencingExperiment
	result := r.db.Table(types.ClinicalSequencingExperimentTable.Name).Where("sample_id = ?", sampleID).Order("id").Find(&seqExps)
	return seqExps, result.Error
}

func (r *SequencingExperimentRepository) GetSequencingExperimentByAliquot(aliquot string) ([]SequencingExperiment, error) {
	var seqExps []SequencingExperiment
	result := r.db.Table(types.ClinicalSequencingExperimentTable.Name).Where("aliquot = ?", aliquot).Order("id").Find(&seqExps)
	return seqExps, result.Error
}
