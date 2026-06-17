package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Sample = types.Sample

type SamplesRepository struct {
	db *gorm.DB
}

func NewSamplesRepository(db *gorm.DB) *SamplesRepository {
	return &SamplesRepository{db: db}
}

func (r *SamplesRepository) GetSampleById(ctx context.Context, id int) (*Sample, error) {
	var sample Sample
	tx := r.db.WithContext(ctx).Table(types.SampleTable.Name).Where("id = ?", id)
	if err := tx.First(&sample).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving sample by id: %w", err)
		}
		return nil, nil
	}
	return &sample, nil
}

func (r *SamplesRepository) GetSampleByOrgCodeAndSubmitterSampleId(ctx context.Context, organizationCode string, submitterSampleId string) (*Sample, error) {
	var sample Sample
	tx := r.db.WithContext(ctx).
		Table(types.SampleTable.Name).
		Where("submitter_sample_id = ? AND organization_code = ?", submitterSampleId, organizationCode)
	if err := tx.First(&sample).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving sample by org code and submitter sample id: %w", err)
		} else {
			return nil, nil
		}
	}
	return &sample, nil
}

func (r *SamplesRepository) CreateSample(ctx context.Context, newSample *Sample) (*Sample, error) {
	err := r.db.WithContext(ctx).Table(types.SampleTable.Name).Create(newSample).Error
	return newSample, err
}

func (r *SamplesRepository) GetTypeCodes(ctx context.Context) ([]string, error) {
	var typeCodes []string
	tx := r.db.WithContext(ctx).
		Table(types.SampleTypeTable.Name).Select("code").Order("code asc")
	if err := tx.Find(&typeCodes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving sample type codes: %w", err)
	}
	return typeCodes, nil
}
