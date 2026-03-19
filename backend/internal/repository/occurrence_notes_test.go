package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_CreateOccurrenceNote(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)
		note := types.OccurrenceNote{
			CaseID:       1,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: 10000,
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			Content:      "This is a test note",
		}

		created, err := repo.Create(note)

		assert.NoError(t, err)
		if assert.NotNil(t, created) {
			assert.NotEmpty(t, created.ID)
			assert.Equal(t, 1, created.CaseID)
			assert.Equal(t, 1, created.SeqID)
			assert.Equal(t, 1, created.TaskID)
			assert.Equal(t, int64(10000), created.OccurrenceID)
			assert.Equal(t, "11111111-1111-1111-1111-111111111111", created.UserID)
			assert.Equal(t, "John Doe", created.UserName)
			assert.Equal(t, "This is a test note", created.Content)
			assert.NotZero(t, created.CreatedAt)
			assert.NotZero(t, created.UpdatedAt)
		}
	})
}

func Test_GetByOccurrence(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)

		note1 := types.OccurrenceNote{
			CaseID:       1,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: 10000,
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			Content:      "First note",
		}
		note2 := types.OccurrenceNote{
			CaseID:       1,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: 10000,
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			Content:      "Second note",
		}

		_, err := repo.Create(note1)
		assert.NoError(t, err)
		_, err = repo.Create(note2)
		assert.NoError(t, err)

		notes, err := repo.GetByOccurrence(1, 1, 1, 10000)

		assert.NoError(t, err)
		assert.Len(t, notes, 2)
		// Most recently created note should be first (ORDER BY created_at DESC)
		assert.Equal(t, "Second note", notes[0].Content)
		assert.Equal(t, "First note", notes[1].Content)
	})
}

func Test_GetByOccurrence_EmptyResult(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)

		notes, err := repo.GetByOccurrence(1, 1, 1, 99999)

		assert.NoError(t, err)
		assert.Empty(t, notes)
	})
}

func Test_GetByOccurrence_IgnoresDeletedNotes(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)

		note := types.OccurrenceNote{
			CaseID:       1,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: 10000,
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			Content:      "Note to be deleted",
		}
		created, err := repo.Create(note)
		assert.NoError(t, err)

		db.Model(&types.OccurrenceNote{}).Where("id = ?", created.ID).Update("deleted", true)

		notes, err := repo.GetByOccurrence(1, 1, 1, 10000)

		assert.NoError(t, err)
		assert.Empty(t, notes)
	})
}
