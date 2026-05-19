package repository

import (
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OccurrenceFlagsRepository struct {
	db *gorm.DB
}

type OccurrenceFlagsDAO interface {
	Upsert(flag types.OccurrenceFlag) (*types.OccurrenceFlag, error)
}

func NewOccurrenceFlagsRepository(db *gorm.DB) *OccurrenceFlagsRepository {
	if db == nil {
		log.Fatal("OccurrenceFlagsRepository: db is nil")
		return nil
	}
	return &OccurrenceFlagsRepository{db: db}
}

func (r *OccurrenceFlagsRepository) Upsert(flag types.OccurrenceFlag) (*types.OccurrenceFlag, error) {
	if err := r.db.
		Clauses(
			clause.OnConflict{
				Columns:   []clause.Column{{Name: "case_id"}, {Name: "occurrence_id"}, {Name: "task_id"}, {Name: "seq_id"}},
				DoUpdates: clause.AssignmentColumns([]string{"flag_type"}),
			},
			clause.Returning{},
		).
		Create(&flag).Error; err != nil {
		return nil, fmt.Errorf("error upserting occurrence flag: %w", err)
	}
	return &flag, nil
}
