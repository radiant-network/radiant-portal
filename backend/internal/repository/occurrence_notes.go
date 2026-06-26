package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OccurrenceNotesRepository struct {
	db *gorm.DB
}

func NewOccurrenceNotesRepository(db *gorm.DB) *OccurrenceNotesRepository {
	return &OccurrenceNotesRepository{db: db}
}

func (r *OccurrenceNotesRepository) Create(ctx context.Context, note types.OccurrenceNote) (*types.OccurrenceNote, error) {
	if err := r.db.WithContext(ctx).Create(&note).Error; err != nil {
		return nil, fmt.Errorf("error creating occurrence note: %w", err)
	}
	return &note, nil
}

// GetByID returns the non-deleted note with the given ID, or nil if not found.
func (r *OccurrenceNotesRepository) GetByID(ctx context.Context, id string) (*types.OccurrenceNote, error) {
	var note types.OccurrenceNote
	if err := r.db.WithContext(ctx).Scopes(WithTenant(ctx)).Where("id = ? AND deleted = false", id).First(&note).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving occurrence note: %w", err)
		}
		return nil, nil
	}
	return &note, nil
}

// Update sets the content of the note with the given ID and returns the updated note.
func (r *OccurrenceNotesRepository) Update(ctx context.Context, id string, content string) (*types.OccurrenceNote, error) {
	var note types.OccurrenceNote
	if err := r.db.WithContext(ctx).Model(&note).
		Clauses(clause.Returning{}).
		Scopes(WithTenant(ctx)).
		Where("id = ?", id).
		Update("content", content).Error; err != nil {
		return nil, fmt.Errorf("error updating occurrence note: %w", err)
	}
	return &note, nil
}

// Delete soft-deletes the note with the given ID by setting deleted = true.
func (r *OccurrenceNotesRepository) Delete(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).Model(&types.OccurrenceNote{}).
		Scopes(WithTenant(ctx)).
		Where("id = ?", id).
		Update("deleted", true).Error; err != nil {
		return fmt.Errorf("error deleting occurrence note: %w", err)
	}
	return nil
}

// CountByOccurrence returns the number of non-deleted notes for the given occurrence.
func (r *OccurrenceNotesRepository) CountByOccurrence(ctx context.Context, caseID int, seqID int, taskID int, occurrenceID string) (int, error) {
	var count int64
	if err := r.db.WithContext(ctx).Model(&types.OccurrenceNote{}).
		Scopes(WithTenant(ctx)).
		Where("case_id = ? AND seq_id = ? AND task_id = ? AND occurrence_id = ? AND deleted = false",
			caseID, seqID, taskID, occurrenceID).
		Count(&count).Error; err != nil {
		return 0, fmt.Errorf("error counting occurrence notes: %w", err)
	}
	return int(count), nil
}

// GetByOccurrence returns all non-deleted notes for the given occurrence, ordered by created_at desc.
func (r *OccurrenceNotesRepository) GetByOccurrence(ctx context.Context, caseID int, seqID int, taskID int, occurrenceID string) ([]types.OccurrenceNote, error) {
	var notes []types.OccurrenceNote
	if err := r.db.WithContext(ctx).Scopes(WithTenant(ctx)).
		Where("case_id = ? AND seq_id = ? AND task_id = ? AND occurrence_id = ? AND deleted = false",
			caseID, seqID, taskID, occurrenceID).
		Order("created_at DESC").
		Find(&notes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving occurrence notes: %w", err)
	}
	return notes, nil
}
