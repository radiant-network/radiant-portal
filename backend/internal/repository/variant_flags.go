package repository

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type VariantFlagsRepository struct {
	db *gorm.DB
}

type VariantFlagsDAO interface {
	Upsert(flag types.VariantFlag) (*types.VariantFlag, error)
	GetByCase(caseID int) ([]types.VariantFlag, error)
	GetByCaseOccurrence(caseID int, occurrenceID string) (*types.VariantFlag, error)
	Delete(caseID int, occurrenceID string) error
}

func NewVariantFlagsRepository(db *gorm.DB) *VariantFlagsRepository {
	if db == nil {
		log.Fatal("VariantFlagsRepository: db is nil")
		return nil
	}
	return &VariantFlagsRepository{db: db}
}

// Upsert inserts a flag or updates the existing one keyed by (case_id, occurrence_id).
func (r *VariantFlagsRepository) Upsert(flag types.VariantFlag) (*types.VariantFlag, error) {
	flag.UpdatedAt = time.Now()
	if err := r.db.
		Clauses(
			clause.OnConflict{
				Columns:   []clause.Column{{Name: "case_id"}, {Name: "occurrence_id"}},
				DoUpdates: clause.AssignmentColumns([]string{"flag_type", "user_id", "user_name", "updated_at"}),
			},
			clause.Returning{},
		).
		Create(&flag).Error; err != nil {
		return nil, fmt.Errorf("error upserting variant flag: %w", err)
	}
	return &flag, nil
}

// GetByCase returns all flags for a case, for bulk table decoration.
func (r *VariantFlagsRepository) GetByCase(caseID int) ([]types.VariantFlag, error) {
	var flags []types.VariantFlag
	if err := r.db.Where("case_id = ?", caseID).Find(&flags).Error; err != nil {
		return nil, fmt.Errorf("error retrieving variant flags: %w", err)
	}
	return flags, nil
}

// GetByCaseOccurrence returns the flag for a single occurrence, or nil if not flagged.
func (r *VariantFlagsRepository) GetByCaseOccurrence(caseID int, occurrenceID string) (*types.VariantFlag, error) {
	var flag types.VariantFlag
	if err := r.db.Where("case_id = ? AND occurrence_id = ?", caseID, occurrenceID).First(&flag).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving variant flag: %w", err)
		}
		return nil, nil
	}
	return &flag, nil
}

// Delete removes the flag for a single occurrence. Idempotent: no error if the row does not exist.
func (r *VariantFlagsRepository) Delete(caseID int, occurrenceID string) error {
	if err := r.db.
		Where("case_id = ? AND occurrence_id = ?", caseID, occurrenceID).
		Delete(&types.VariantFlag{}).Error; err != nil {
		return fmt.Errorf("error deleting variant flag: %w", err)
	}
	return nil
}
