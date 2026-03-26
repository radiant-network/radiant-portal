package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OccurrenceNotesRepository struct {
	db *gorm.DB
}

type OccurrenceNotesDAO interface {
	Create(note types.OccurrenceNote) (*types.OccurrenceNote, error)
	GetByID(id string) (*types.OccurrenceNote, error)
	GetByOccurrence(caseID int, seqID int, taskID int, occurrenceID string) ([]types.OccurrenceNote, error)
	CountByOccurrence(caseID int, seqID int, taskID int, occurrenceID string) (int, error)
	Update(id string, content string) (*types.OccurrenceNote, error)
	Delete(id string) error
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

// GetByID returns the non-deleted note with the given ID, or nil if not found.
func (r *OccurrenceNotesRepository) GetByID(id string) (*types.OccurrenceNote, error) {
	var note types.OccurrenceNote
	if err := r.db.Where("id = ? AND deleted = false", id).First(&note).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving occurrence note: %w", err)
		}
		return nil, nil
	}
	return &note, nil
}

// Update sets the content of the note with the given ID and returns the updated note.
func (r *OccurrenceNotesRepository) Update(id string, content string) (*types.OccurrenceNote, error) {
	var note types.OccurrenceNote
	if err := r.db.Model(&note).
		Clauses(clause.Returning{}).
		Where("id = ?", id).
		Update("content", content).Error; err != nil {
		return nil, fmt.Errorf("error updating occurrence note: %w", err)
	}
	return &note, nil
}

// Delete soft-deletes the note with the given ID by setting deleted = true.
func (r *OccurrenceNotesRepository) Delete(id string) error {
	if err := r.db.Model(&types.OccurrenceNote{}).
		Where("id = ?", id).
		Update("deleted", true).Error; err != nil {
		return fmt.Errorf("error deleting occurrence note: %w", err)
	}
	return nil
}

// CountByOccurrence returns the number of non-deleted notes for the given occurrence.
func (r *OccurrenceNotesRepository) CountByOccurrence(caseID int, seqID int, taskID int, occurrenceID string) (int, error) {
	var count int64
	if err := r.db.Model(&types.OccurrenceNote{}).
		Where("case_id = ? AND seq_id = ? AND task_id = ? AND occurrence_id = ? AND deleted = false",
			caseID, seqID, taskID, occurrenceID).
		Count(&count).Error; err != nil {
		return 0, fmt.Errorf("error counting occurrence notes: %w", err)
	}
	return int(count), nil
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
