package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type SequencingExperiment = types.SequencingExperiment

type SequencingExperimentRepository struct {
	db *gorm.DB
}

func NewSequencingExperimentRepository(db database.PostgresDB) *SequencingExperimentRepository {
	return &SequencingExperimentRepository{db: db.DB}
}

func (r *SequencingExperimentRepository) CreateSequencingExperiment(ctx context.Context, seqExp *SequencingExperiment) error {
	return r.db.WithContext(ctx).Create(&seqExp).Error
}

// UpdateSequencingExperiment matches on (sample_id, aliquot) — the natural key, since sample_id is
// already resolved from (sample_organization_code, submitter_sample_id) by the caller.
func (r *SequencingExperimentRepository) UpdateSequencingExperiment(ctx context.Context, seqExp *SequencingExperiment) error {
	tx := r.db.WithContext(ctx).
		Table(types.SequencingExperimentTable.Name).
		Where("sample_id = ? AND aliquot = ?", seqExp.SampleID, seqExp.Aliquot).
		Updates(map[string]any{
			"status_code":                     seqExp.StatusCode,
			"sequencing_lab_code":             seqExp.SequencingLabCode,
			"run_name":                        seqExp.RunName,
			"run_alias":                       seqExp.RunAlias,
			"run_date":                        seqExp.RunDate,
			"capture_kit":                     seqExp.CaptureKit,
			"experimental_strategy_code":      seqExp.ExperimentalStrategyCode,
			"sequencing_read_technology_code": seqExp.SequencingReadTechnologyCode,
			"platform_code":                   seqExp.PlatformCode,
		})
	if tx.Error != nil {
		return fmt.Errorf("error updating sequencing experiment: %w", tx.Error)
	}
	return nil
}

func (r *SequencingExperimentRepository) GetSequencingExperimentBySampleID(ctx context.Context, sampleID int) ([]SequencingExperiment, error) {
	var seqExps []SequencingExperiment
	result := r.db.WithContext(ctx).Table(types.SequencingExperimentTable.Name).Where("sample_id = ?", sampleID).Order("id").Find(&seqExps)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}
	return seqExps, nil
}

func (r *SequencingExperimentRepository) GetSequencingExperimentsByCaseId(ctx context.Context, caseID int) ([]SequencingExperiment, error) {
	var seqExps []SequencingExperiment
	result := r.db.WithContext(ctx).
		Table(fmt.Sprintf("%s se", types.SequencingExperimentTable.Name)).
		Joins(fmt.Sprintf("JOIN %s chse ON chse.sequencing_experiment_id = se.id", types.CaseHasSequencingExperimentTable.Name)).
		Where("chse.case_id = ?", caseID).
		Order("se.id").
		Select("se.*").
		Find(&seqExps)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}
	return seqExps, nil
}

func (r *SequencingExperimentRepository) GetSequencingExperimentByAliquot(ctx context.Context, aliquot string) ([]SequencingExperiment, error) {
	var seqExps []SequencingExperiment
	result := r.db.WithContext(ctx).Table(types.SequencingExperimentTable.Name).Where("aliquot = ?", aliquot).Order("id").Find(&seqExps)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}
	return seqExps, nil
}

func (r *SequencingExperimentRepository) GetSequencingExperimentByAliquotAndSubmitterSample(ctx context.Context, aliquot string, submitterSampleID string, sampleOrganizationCode string) (*SequencingExperiment, error) {
	var seqExp SequencingExperiment
	txSeqExp := r.db.WithContext(ctx).Table(fmt.Sprintf("%s se", types.SequencingExperimentTable.Name))
	txSeqExp.Joins(fmt.Sprintf("LEFT JOIN %s sa ON sa.id = se.sample_id", types.SampleTable.Name))
	txSeqExp.Where("se.aliquot = ? AND sa.submitter_sample_id = ? AND sa.organization_code = ?", aliquot, submitterSampleID, sampleOrganizationCode)
	result := txSeqExp.First(&seqExp)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}
	return &seqExp, result.Error
}
