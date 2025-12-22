package repository

import (
	"errors"
	"fmt"

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
	GetSequencingExperimentByAliquotAndSubmitterSample(aliquot string, submitterSampleId string, sampleOrganizationCode string) (*SequencingExperiment, error)
}

func NewSequencingExperimentRepository(db *gorm.DB) *SequencingExperimentRepository {
	return &SequencingExperimentRepository{db: db}
}

func (r *SequencingExperimentRepository) CreateSequencingExperiment(seqExp *SequencingExperiment) error {
	return r.db.Create(&seqExp).Error
}

func (r *SequencingExperimentRepository) GetSequencingExperimentBySampleID(sampleID int) ([]SequencingExperiment, error) {
	var seqExps []SequencingExperiment
	result := r.db.Table(types.SequencingExperimentTable.Name).Where("sample_id = ?", sampleID).Order("id").Find(&seqExps)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}
	return seqExps, nil
}

func (r *SequencingExperimentRepository) GetSequencingExperimentByAliquot(aliquot string) ([]SequencingExperiment, error) {
	var seqExps []SequencingExperiment
	result := r.db.Table(types.SequencingExperimentTable.Name).Where("aliquot = ?", aliquot).Order("id").Find(&seqExps)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}
	return seqExps, nil
}

func (r *SequencingExperimentRepository) GetSequencingExperimentByAliquotAndSubmitterSample(aliquot string, submitterSampleID string, sampleOrganizationCode string) (*SequencingExperiment, error) {
	var seqExp SequencingExperiment
	txSeqExp := r.db.Table(fmt.Sprintf("%s se", types.SequencingExperimentTable.Name))
	txSeqExp.Joins(fmt.Sprintf("LEFT JOIN %s sa ON sa.id = se.sample_id", types.SampleTable.Name))
	txSeqExp.Joins(fmt.Sprintf("LEFT JOIN %s o ON o.id = sa.organization_id", types.OrganizationTable.Name))
	txSeqExp.Where("se.aliquot = ? AND sa.submitter_sample_id = ? AND o.code = ?", aliquot, submitterSampleID, sampleOrganizationCode)
	result := txSeqExp.First(&seqExp)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}
	return &seqExp, result.Error
}
