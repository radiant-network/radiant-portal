package repository

import (
	"fmt"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
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
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.request r ON r.id = s.request_id")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.sample spl ON spl.id = s.sample_id")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.experiment exp ON exp.id = s.experiment_id")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.experimental_strategy expstr ON exp.experimental_strategy_code = expstr.code")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.organization org ON s.performer_lab_id = org.id")
	tx = tx.Where("s.id = ?", seqId)

	tx = tx.Select("s.status_code, s.created_on, s.updated_on, org.code as diagnosis_lab_code, org.name as diagnosis_lab_name, s.aliquot, s.run_name, s.run_alias, s.run_date, s.id as seq_id, exp.experimental_strategy_code, expstr.name_en as experimental_strategy_name, s.is_paired_end, exp.platform_code, s.capture_kit, s.read_length, exp.description as experiment_description, s.sample_id, spl.category_code, spl.type_code as sample_type_code, spl.tissue_site, spl.histology_code, spl.submitter_sample_id")

	if err := tx.Find(&assay).Error; err != nil {
		return nil, fmt.Errorf("error fetching assay: %w", err)
	}

	return &assay, nil
}
