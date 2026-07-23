package starrocks

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils/joins"
	"gorm.io/gorm"
)

type SequencingExperimentDetail = types.SequencingExperimentDetail

type SequencingExperimentRepository struct {
	db     *gorm.DB
	joiner joins.Joiner
}

func NewSequencingExperimentRepository(db database.StarrocksDB) *SequencingExperimentRepository {
	return &SequencingExperimentRepository{db: db.DB, joiner: joins.Starrocks()}
}

func (r *SequencingExperimentRepository) GetSequencingExperimentDetailById(ctx context.Context, seqId int) (*SequencingExperimentDetail, error) {
	var sequencingExperiment SequencingExperimentDetail

	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.TenantQualifiedName(ctx), types.SequencingExperimentTable.Alias))
	tx = r.joiner.SeqExpWithSample(tx)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.experimental_strategy_code = %s.code", types.ExperimentalStrategyTable.TenantQualifiedName(ctx), types.ExperimentalStrategyTable.Alias, types.SequencingExperimentTable.Alias, types.ExperimentalStrategyTable.Alias))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_read_technology_code = %s.code", types.SequencingReadTechnologyTable.TenantQualifiedName(ctx), types.SequencingReadTechnologyTable.Alias, types.SequencingExperimentTable.Alias, types.SequencingReadTechnologyTable.Alias))
	tx = r.joiner.SeqExpWithSequencingLab(tx)
	tx = tx.Where("s.id = ?", seqId)

	tx = tx.Select("s.status_code, s.created_on, s.updated_on, lab.code as sequencing_lab_code, lab.name as sequencing_lab_name, s.aliquot, s.run_name, s.run_alias, s.run_date, s.id as seq_id, s.experimental_strategy_code, exp_str.name_en as experimental_strategy_name, s.platform_code, s.capture_kit, s.sequencing_read_technology_code, seq_read_tech.name_en as sequencing_read_technology_name, s.sample_id, spl.type_code as sample_type_code, spl.tissue_site, spl.histology_code, spl.submitter_sample_id, spl.patient_id")

	if err := tx.Find(&sequencingExperiment).Error; err != nil {
		return nil, fmt.Errorf("error fetching sequencing experiment: %w", err)
	}

	return &sequencingExperiment, nil
}
