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

func NewSamplesRepository(db *gorm.DB) *SamplesRepository {
	return &SamplesRepository{db: db}
}

func (r *SamplesRepository) GetSampleById(id int) (*Sample, error) {
	var sample Sample
	tx := r.db.Table(types.SampleTable.Name).Where("id = ?", id)
	if err := tx.First(&sample).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving sample by id: %w", err)
		}
		return nil, nil
	}
	return &sample, nil
}

func (r *SamplesRepository) GetSampleByOrgCodeAndSubmitterSampleId(organizationCode string, submitterSampleId string) (*Sample, error) {
	var sample Sample
	tx := r.db.
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

func (r *SamplesRepository) CreateSample(newSample *Sample) (*Sample, error) {
	err := r.db.Table(types.SampleTable.Name).Create(newSample).Error
	return newSample, err
}

func (r *SamplesRepository) GetTypeCodes() ([]string, error) {
	var typeCodes []string
	tx := r.db.
		Table(types.SampleTypeTable.Name).Select("code").Order("code asc")
	if err := tx.Find(&typeCodes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving sample type codes: %w", err)
	}
	return typeCodes, nil
}
