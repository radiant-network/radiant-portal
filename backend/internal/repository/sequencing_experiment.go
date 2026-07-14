package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type SequencingExperiment = types.SequencingExperiment
type SequencingExperimentDetail = types.SequencingExperimentDetail

type SequencingExperimentRepository struct {
	db *gorm.DB
}

func NewSequencingExperimentRepository(db *gorm.DB) *SequencingExperimentRepository {
	return &SequencingExperimentRepository{db: db}
}

func (r *SequencingExperimentRepository) GetSequencingExperimentDetailById(ctx context.Context, seqId int) (*SequencingExperimentDetail, error) {
	var sequencingExperiment SequencingExperimentDetail

	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.TenantQualifiedName(ctx), types.SequencingExperimentTable.Alias))
	tx = utils.JoinSeqExpWithSample(tx)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.experimental_strategy_code = %s.code", types.ExperimentalStrategyTable.TenantQualifiedName(ctx), types.ExperimentalStrategyTable.Alias, types.SequencingExperimentTable.Alias, types.ExperimentalStrategyTable.Alias))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_read_technology_code = %s.code", types.SequencingReadTechnologyTable.TenantQualifiedName(ctx), types.SequencingReadTechnologyTable.Alias, types.SequencingExperimentTable.Alias, types.SequencingReadTechnologyTable.Alias))
	tx = utils.JoinSeqExpWithSequencingLab(tx)
	tx = tx.Where("s.id = ?", seqId)

	tx = tx.Select("s.status_code, s.created_on, s.updated_on, lab.code as sequencing_lab_code, lab.name as sequencing_lab_name, s.aliquot, s.run_name, s.run_alias, s.run_date, s.id as seq_id, s.experimental_strategy_code, exp_str.name_en as experimental_strategy_name, s.platform_code, s.capture_kit, s.sequencing_read_technology_code, seq_read_tech.name_en as sequencing_read_technology_name, s.sample_id, spl.type_code as sample_type_code, spl.tissue_site, spl.histology_code, spl.submitter_sample_id, spl.patient_id")

	if err := tx.Find(&sequencingExperiment).Error; err != nil {
		return nil, fmt.Errorf("error fetching sequencing experiment: %w", err)
	}

	return &sequencingExperiment, nil
}

func (r *SequencingExperimentRepository) CreateSequencingExperiment(ctx context.Context, seqExp *SequencingExperiment) error {
	return r.db.WithContext(ctx).Create(&seqExp).Error
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
