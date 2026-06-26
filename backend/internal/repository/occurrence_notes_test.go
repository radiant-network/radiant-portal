package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_CreateOccurrenceNote(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)
		note := types.OccurrenceNote{
			CaseID:       2,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: "10000",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			TenantCode:   types.DefaultTenantCode,
			Content:      "This is a test note",
		}

		created, err := repo.Create(t.Context(), note)

		assert.NoError(t, err)
		if assert.NotNil(t, created) {
			assert.NotEmpty(t, created.ID)
			assert.Equal(t, 2, created.CaseID)
			assert.Equal(t, 1, created.SeqID)
			assert.Equal(t, 1, created.TaskID)
			assert.Equal(t, "10000", created.OccurrenceID)
			assert.Equal(t, "11111111-1111-1111-1111-111111111111", created.UserID)
			assert.Equal(t, "John Doe", created.UserName)
			assert.Equal(t, "This is a test note", created.Content)
			assert.NotZero(t, created.CreatedAt)
			assert.NotZero(t, created.UpdatedAt)
		}
	})
}

func Test_GetByOccurrence(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)

		note1 := types.OccurrenceNote{
			CaseID:       2,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: "10000",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			TenantCode:   types.DefaultTenantCode,
			Content:      "First note",
		}
		note2 := types.OccurrenceNote{
			CaseID:       2,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: "10000",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			TenantCode:   types.DefaultTenantCode,
			Content:      "Second note",
		}

		_, err := repo.Create(t.Context(), note1)
		assert.NoError(t, err)
		_, err = repo.Create(t.Context(), note2)
		assert.NoError(t, err)

		notes, err := repo.GetByOccurrence(t.Context(), 2, 1, 1, "10000")

		assert.NoError(t, err)
		assert.Len(t, notes, 2)
		// Most recently created note should be first (ORDER BY created_at DESC)
		assert.Equal(t, "Second note", notes[0].Content)
		assert.Equal(t, "First note", notes[1].Content)
	})
}

func Test_GetByOccurrence_EmptyResult(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)

		notes, err := repo.GetByOccurrence(t.Context(), 1, 1, 1, "99999")

		assert.NoError(t, err)
		assert.Empty(t, notes)
	})
}

func Test_GetByID(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)
		note := types.OccurrenceNote{
			CaseID:       2,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: "10000",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			TenantCode:   types.DefaultTenantCode,
			Content:      "Test note",
		}
		created, err := repo.Create(t.Context(), note)
		assert.NoError(t, err)

		found, err := repo.GetByID(t.Context(), created.ID)

		assert.NoError(t, err)
		if assert.NotNil(t, found) {
			assert.Equal(t, created.ID, found.ID)
			assert.Equal(t, "Test note", found.Content)
		}
	})
}

// A note created under the radiant tenant must be invisible to a caller acting in another
// tenant (the handler surfaces nil as 404), and visible to the radiant tenant itself.
func Test_GetByID_CrossTenantIsInvisible(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOccurrenceNotesRepository(env.Postgres)
		created, err := repo.Create(t.Context(), types.OccurrenceNote{
			CaseID: 2, SeqID: 1, TaskID: 1, OccurrenceID: "10000",
			UserID: "11111111-1111-1111-1111-111111111111", UserName: "John Doe",
			TenantCode: types.DefaultTenantCode, Content: "radiant note",
		})
		assert.NoError(t, err)

		other := types.ContextWithTenant(t.Context(), "tenant_b")
		got, err := repo.GetByID(other, created.ID)
		assert.NoError(t, err)
		assert.Nil(t, got, "radiant note must be invisible to another tenant")

		radiant := types.ContextWithTenant(t.Context(), types.DefaultTenantCode)
		got, err = repo.GetByID(radiant, created.ID)
		assert.NoError(t, err)
		assert.NotNil(t, got, "radiant note must be visible to the radiant tenant")
	})
}

func Test_GetByID_NotFound(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)

		found, err := repo.GetByID(t.Context(), "00000000-0000-0000-0000-000000000000")

		assert.NoError(t, err)
		assert.Nil(t, found)
	})
}

func Test_UpdateOccurrenceNote(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)
		note := types.OccurrenceNote{
			CaseID:       2,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: "10000",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			TenantCode:   types.DefaultTenantCode,
			Content:      "Original content",
		}
		created, err := repo.Create(t.Context(), note)
		assert.NoError(t, err)

		updated, err := repo.Update(t.Context(), created.ID, "Updated content")

		assert.NoError(t, err)
		if assert.NotNil(t, updated) {
			assert.Equal(t, created.ID, updated.ID)
			assert.Equal(t, "Updated content", updated.Content)
			assert.True(t, updated.UpdatedAt.After(created.UpdatedAt) || updated.UpdatedAt.Equal(created.UpdatedAt))
		}
	})
}

func Test_DeleteOccurrenceNote(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)
		note := types.OccurrenceNote{
			CaseID:       2,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: "10000",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			TenantCode:   types.DefaultTenantCode,
			Content:      "Note to delete",
		}
		created, err := repo.Create(t.Context(), note)
		assert.NoError(t, err)

		err = repo.Delete(t.Context(), created.ID)
		assert.NoError(t, err)

		found, err := repo.GetByID(t.Context(), created.ID)
		assert.NoError(t, err)
		assert.Nil(t, found)
	})
}

func Test_CountByOccurrence(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)

		_, err := repo.Create(t.Context(), types.OccurrenceNote{CaseID: 2, SeqID: 1, TaskID: 1, OccurrenceID: "10000", UserID: "11111111-1111-1111-1111-111111111111", UserName: "John Doe", TenantCode: types.DefaultTenantCode, Content: "Note 1"})
		assert.NoError(t, err)
		_, err = repo.Create(t.Context(), types.OccurrenceNote{CaseID: 2, SeqID: 1, TaskID: 1, OccurrenceID: "10000", UserID: "11111111-1111-1111-1111-111111111111", UserName: "John Doe", TenantCode: types.DefaultTenantCode, Content: "Note 2"})
		assert.NoError(t, err)

		count, err := repo.CountByOccurrence(t.Context(), 2, 1, 1, "10000")

		assert.NoError(t, err)
		assert.Equal(t, 2, count)
	})
}

func Test_CountByOccurrence_IgnoresDeletedNotes(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)

		created, err := repo.Create(t.Context(), types.OccurrenceNote{CaseID: 2, SeqID: 1, TaskID: 1, OccurrenceID: "10000", UserID: "11111111-1111-1111-1111-111111111111", UserName: "John Doe", TenantCode: types.DefaultTenantCode, Content: "Deleted note"})
		assert.NoError(t, err)
		db.Model(&types.OccurrenceNote{}).Where("id = ?", created.ID).Update("deleted", true)

		count, err := repo.CountByOccurrence(t.Context(), 2, 1, 1, "10000")

		assert.NoError(t, err)
		assert.Equal(t, 0, count)
	})
}

func Test_GetByOccurrence_IgnoresDeletedNotes(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOccurrenceNotesRepository(db)

		note := types.OccurrenceNote{
			CaseID:       2,
			SeqID:        1,
			TaskID:       1,
			OccurrenceID: "10000",
			UserID:       "11111111-1111-1111-1111-111111111111",
			UserName:     "John Doe",
			TenantCode:   types.DefaultTenantCode,
			Content:      "Note to be deleted",
		}
		created, err := repo.Create(t.Context(), note)
		assert.NoError(t, err)

		db.Model(&types.OccurrenceNote{}).Where("id = ?", created.ID).Update("deleted", true)

		notes, err := repo.GetByOccurrence(t.Context(), 2, 1, 1, "10000")

		assert.NoError(t, err)
		assert.Empty(t, notes)
	})
}
