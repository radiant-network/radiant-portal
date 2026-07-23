package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Sample = types.Sample

type SamplesRepository struct {
	db *gorm.DB
}

func NewSamplesRepository(db database.PostgresDB) *SamplesRepository {
	return &SamplesRepository{db: db.DB}
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

func (r *SamplesRepository) UpdateSample(ctx context.Context, sample *Sample) error {
	// The natural key (organization_code, submitter_sample_id) is the lookup key and is never
	// updated; neither is tenant_code. patient_id is the resolved owning patient — it is
	// deliberately NOT updated here: a sample must not be re-pointed to a different patient
	// (equivalent to changing submitter_patient_id), which is immutable across updates.
	tx := r.db.WithContext(ctx).
		Table(types.SampleTable.Name).
		Where("organization_code = ? AND submitter_sample_id = ?", sample.OrganizationCode, sample.SubmitterSampleId).
		Updates(map[string]any{
			"type_code":        sample.TypeCode,
			"tissue_site":      sample.TissueSite,
			"histology_code":   sample.HistologyCode,
			"parent_sample_id": sample.ParentSampleID,
		})
	if tx.Error != nil {
		return fmt.Errorf("error updating sample: %w", tx.Error)
	}
	return nil
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
