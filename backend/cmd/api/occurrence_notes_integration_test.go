package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

const mockUserUUID = "11111111-1111-1111-1111-111111111111"

func assertPostOccurrenceNote(t *testing.T, repo repository.OccurrenceNotesDAO, auth *testutils.MockAuth, body string, expectedStatus int) *types.OccurrenceNote {
	t.Helper()
	router := gin.Default()
	router.POST("/notes", server.PostOccurrenceNoteHandler(repo, auth))

	req, _ := http.NewRequest("POST", "/notes", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, expectedStatus, w.Code)
	if expectedStatus == http.StatusCreated {
		var note types.OccurrenceNote
		err := json.Unmarshal(w.Body.Bytes(), &note)
		assert.NoError(t, err)
		return &note
	}
	return nil
}

func assertGetOccurrenceNotes(t *testing.T, repo repository.OccurrenceNotesDAO, caseID int, seqID int, taskID int, occurrenceID int64, expectedStatus int) []types.OccurrenceNote {
	t.Helper()
	router := gin.Default()
	router.GET("/notes/:case_id/:seq_id/:task_id/:occurrence_id", server.GetOccurrenceNotesHandler(repo))

	url := fmt.Sprintf("/notes/%d/%d/%d/%d", caseID, seqID, taskID, occurrenceID)
	req, _ := http.NewRequest("GET", url, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, expectedStatus, w.Code)
	var notes []types.OccurrenceNote
	err := json.Unmarshal(w.Body.Bytes(), &notes)
	assert.NoError(t, err)
	return notes
}

func Test_PostOccurrenceNote(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrenceNotesRepository(db)
		auth := &testutils.MockAuth{Id: mockUserUUID}

		created := assertPostOccurrenceNote(t, repo, auth, `{"case_id": 1, "seq_id": 1, "task_id": 1, "occurrence_id": 20000, "content": "Integration test note"}`, http.StatusCreated)

		if assert.NotNil(t, created) {
			assert.NotEmpty(t, created.ID)
			assert.Equal(t, 1, created.CaseID)
			assert.Equal(t, 1, created.SeqID)
			assert.Equal(t, 1, created.TaskID)
			assert.Equal(t, int64(20000), created.OccurrenceID)
			assert.Equal(t, mockUserUUID, created.UserID)
			assert.Equal(t, testutils.DefaultMockFullName, created.UserName)
			assert.Equal(t, "Integration test note", created.Content)
			assert.NotZero(t, created.CreatedAt)
			assert.NotZero(t, created.UpdatedAt)
		}
	})
}

func Test_PostOccurrenceNote_MissingContent(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrenceNotesRepository(db)
		auth := &testutils.MockAuth{Id: mockUserUUID}

		assertPostOccurrenceNote(t, repo, auth, `{"case_id": 1, "seq_id": 1, "task_id": 1, "occurrence_id": 10000}`, http.StatusBadRequest)
	})
}

func Test_GetOccurrenceNotes_EmptyResult(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrenceNotesRepository(db)

		notes := assertGetOccurrenceNotes(t, repo, 1, 1, 1, 99999, http.StatusOK)
		assert.Empty(t, notes)
	})
}

func Test_GetOccurrenceNotes(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrenceNotesRepository(db)
		auth := &testutils.MockAuth{Id: mockUserUUID}

		assertPostOccurrenceNote(t, repo, auth, `{"case_id": 1, "seq_id": 1, "task_id": 1, "occurrence_id": 10000, "content": "First note"}`, http.StatusCreated)
		assertPostOccurrenceNote(t, repo, auth, `{"case_id": 1, "seq_id": 1, "task_id": 1, "occurrence_id": 10000, "content": "Second note"}`, http.StatusCreated)

		notes := assertGetOccurrenceNotes(t, repo, 1, 1, 1, 10000, http.StatusOK)

		if assert.Len(t, notes, 2) {
			// Most recently created note should be first (ORDER BY created_at DESC)
			assert.Equal(t, "Second note", notes[0].Content)
			assert.Equal(t, "First note", notes[1].Content)
		}
	})
}
