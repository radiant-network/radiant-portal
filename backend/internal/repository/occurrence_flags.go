package repository

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OccurrenceFlagsRepository struct {
	db *gorm.DB
}

func NewOccurrenceFlagsRepository(db *gorm.DB) *OccurrenceFlagsRepository {
	return &OccurrenceFlagsRepository{db: db}
}

func (r *OccurrenceFlagsRepository) Upsert(ctx context.Context, flag types.OccurrenceFlag) (*types.OccurrenceFlag, error) {
	if err := r.db.WithContext(ctx).
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

func (r *OccurrenceFlagsRepository) Delete(ctx context.Context, caseID, seqID, taskID int, occurrenceID string) (int64, error) {
	result := r.db.WithContext(ctx).
		Scopes(WithTenant(ctx)).
		Where("case_id = ? AND seq_id = ? AND task_id = ? AND occurrence_id = ?", caseID, seqID, taskID, occurrenceID).
		Delete(&types.OccurrenceFlag{})
	if result.Error != nil {
		return 0, fmt.Errorf("error deleting occurrence flag: %w", result.Error)
	}
	return result.RowsAffected, nil
}
