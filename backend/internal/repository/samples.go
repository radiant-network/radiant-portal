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
	GetSampleByOrgCodeAndSubmitterSampleId(organizationCode string, submitterSampleId string) (*Sample, error)
	CreateSample(newSample *Sample) (*Sample, error)
	GetTypeCodes() ([]string, error)
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

func (r *SamplesRepository) GetSampleByOrgCodeAndSubmitterSampleId(organizationCode string, submitterSampleId string) (*Sample, error) {
	var sample Sample
	tx := r.db.
		Table("sample").
		Joins("JOIN organization o ON o.id = sample.organization_id").
		Where("sample.submitter_sample_id = ? AND o.code = ?", submitterSampleId, organizationCode)
	if err := tx.First(&sample).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve sample its ID: %w", err)
		} else {
			return nil, nil
		}
	}
	return &sample, nil
}

func (r *SamplesRepository) CreateSample(newSample *Sample) (*Sample, error) {
	err := r.db.Table("sample").Create(newSample).Error
	return newSample, err
}

func (r *SamplesRepository) GetTypeCodes() ([]string, error) {
	var typeCodes []string
	tx := r.db.
		Table("sample_type").
		Select("code").
		Order("code asc")
	if err := tx.Find(&typeCodes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving sample type codes: %w", err)
	}
	return typeCodes, nil
}
