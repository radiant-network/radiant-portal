package repository

import (
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type OccurrenceNotesRepository struct {
	db *gorm.DB
}

type OccurrenceNotesDAO interface {
	Create(note types.OccurrenceNote) (*types.OccurrenceNote, error)
	GetByOccurrence(caseID int, seqID int, taskID int, occurrenceID string) ([]types.OccurrenceNote, error)
}

func NewOccurrenceNotesRepository(db *gorm.DB) *OccurrenceNotesRepository {
	if db == nil {
		log.Fatal("OccurrenceNotesRepository: db is nil")
		return nil
	}
	return &OccurrenceNotesRepository{db: db}
}

func (r *OccurrenceNotesRepository) Create(note types.OccurrenceNote) (*types.OccurrenceNote, error) {
	if err := r.db.Create(&note).Error; err != nil {
		return nil, fmt.Errorf("error creating occurrence note: %w", err)
	}
	return &note, nil
}

// GetByOccurrence returns all non-deleted notes for the given occurrence, ordered by created_at desc.
func (r *OccurrenceNotesRepository) GetByOccurrence(caseID int, seqID int, taskID int, occurrenceID string) ([]types.OccurrenceNote, error) {
	var notes []types.OccurrenceNote
	if err := r.db.
		Where("case_id = ? AND seq_id = ? AND task_id = ? AND occurrence_id = ? AND deleted = false",
			caseID, seqID, taskID, occurrenceID).
		Order("created_at DESC").
		Find(&notes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving occurrence notes: %w", err)
	}
	return notes, nil
}
