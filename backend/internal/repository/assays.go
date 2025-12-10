package repository

import (
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type Assay = types.Assay

type AssaysRepository struct {
	db *gorm.DB
}

type AssaysDAO interface {
	GetAssayBySeqId(seqId int) (*Assay, error)
}

func NewAssaysRepository(db *gorm.DB) *AssaysRepository {
	if db == nil {
		log.Print("AssaysRepository: db is nil")
		return nil
	}
	return &AssaysRepository{db: db}
}

func (r *AssaysRepository) GetAssayBySeqId(seqId int) (*Assay, error) {
	var assay Assay

	tx := r.db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.FederationName, types.SequencingExperimentTable.Alias))
	tx = utils.JoinSeqExpWithSample(tx)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.experimental_strategy_code = %s.code", types.ExperimentalStrategyTable.FederationName, types.ExperimentalStrategyTable.Alias, types.SequencingExperimentTable.Alias, types.ExperimentalStrategyTable.Alias))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_read_technology_code = %s.code", types.SequencingReadTechnologyTable.FederationName, types.SequencingReadTechnologyTable.Alias, types.SequencingExperimentTable.Alias, types.SequencingReadTechnologyTable.Alias))
	tx = utils.JoinSeqExpWithSequencingLab(tx)
	tx = tx.Where("s.id = ?", seqId)

	tx = tx.Select("s.status_code, s.created_on, s.updated_on, lab.code as sequencing_lab_code, lab.name as sequencing_lab_name, s.aliquot, s.run_name, s.run_alias, s.run_date, s.id as seq_id, s.experimental_strategy_code, exp_str.name_en as experimental_strategy_name, s.platform_code, s.capture_kit, s.sequencing_read_technology_code, seq_read_tech.name_en as sequencing_read_technology_name, s.sample_id, spl.type_code as sample_type_code, spl.tissue_site, spl.histology_code, spl.submitter_sample_id")

	if err := tx.Find(&assay).Error; err != nil {
		return nil, fmt.Errorf("error fetching assay: %w", err)
	}

	return &assay, nil
}
