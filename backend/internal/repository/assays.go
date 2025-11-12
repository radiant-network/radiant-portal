package repository

import (
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
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

	tx := r.db.Table("radiant_jdbc.public.sequencing_experiment s")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.sample spl ON spl.id = s.sample_id")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.experimental_strategy expstr ON s.experimental_strategy_code = expstr.code")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.sequencing_read_technology seqrtech ON s.sequencing_read_technology_code = seqrtech.code")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.organization org ON s.sequencing_lab_id = org.id")
	tx = tx.Where("s.id = ?", seqId)

	tx = tx.Select("s.status_code, s.created_on, s.updated_on, org.code as sequencing_lab_code, org.name as sequencing_lab_name, s.aliquot, s.run_name, s.run_alias, s.run_date, s.id as seq_id, s.experimental_strategy_code, expstr.name_en as experimental_strategy_name, s.platform_code, s.capture_kit, s.sequencing_read_technology_code, seqrtech.name_en as sequencing_read_technology_name, s.sample_id, spl.type_code as sample_type_code, spl.tissue_site, spl.histology_code, spl.submitter_sample_id")

	if err := tx.Find(&assay).Error; err != nil {
		return nil, fmt.Errorf("error fetching assay: %w", err)
	}

	return &assay, nil
}
