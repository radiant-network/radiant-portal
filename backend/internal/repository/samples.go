package repository

import (
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Sample = types.Sample

type SamplesRepository struct {
	db *gorm.DB
}

type SamplesDAO interface {
	GetSampleBySubmitterSampleId(organizationId int, submitterSampleId string) (*Sample, error)
	CreateSample(newSample *Sample) error
}

func NewSamplesRepository(db *gorm.DB) *SamplesRepository {
	return &SamplesRepository{db: db}
}

func (r *SamplesRepository) GetSampleBySubmitterSampleId(organizationId int, submitterSampleId string) (*Sample, error) {
	var sample Sample
	tx := r.db.
		Table("sample").
		Where("organization_id = ? and submitter_sample_id = ?", organizationId, submitterSampleId)
	if err := tx.First(&sample).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve sample its ID: %w", err)
		} else {
			return nil, nil
		}
	}
	return &sample, nil
}

func (r *SamplesRepository) CreateSample(newSample *Sample) error {
	return r.db.Table("sample").Create(newSample).Error
}
