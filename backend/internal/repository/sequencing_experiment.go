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
	GetSequencingExperimentBySample(sampleID int) ([]SequencingExperiment, error)
}

func NewSequencingExperimentRepo(db *gorm.DB) *SequencingExperimentRepository {
	return &SequencingExperimentRepository{db: db}
}

func (r *SequencingExperimentRepository) GetSequencingExperimentBySampleID(sampleID int) ([]SequencingExperiment, error) {
	var seqExps []SequencingExperiment
	result := r.db.Table(types.SequencingExperimentTable.Name).Where("sample_id = ?", sampleID).Order("id").Find(&seqExps)
	return seqExps, result.Error
}
