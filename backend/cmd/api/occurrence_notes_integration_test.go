package main

import (
	"bytes"
	"encoding/json"
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

func assertPostOccurrenceNote(t *testing.T, repo repository.OccurrenceNotesDAO, auth *testutils.MockAuth, noteType string, caseID string, seqID string, occurrenceID string, body string, expectedStatus int) *types.OccurrenceNote {
	t.Helper()
	router := gin.Default()
	if noteType == "snv" {
		router.POST("/occurrences/germline/snv/:case_id/:seq_id/:locus_id/notes", server.PostOccurrenceSNVNoteHandler(repo, auth))
	} else {
		router.POST("/occurrences/germline/cnv/:case_id/:seq_id/:cnv_id/notes", server.PostOccurrenceCNVNoteHandler(repo, auth))
	}

	url := "/occurrences/germline/" + noteType + "/" + caseID + "/" + seqID + "/" + occurrenceID + "/notes"
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer([]byte(body)))
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

func assertGetOccurrenceNotes(t *testing.T, repo repository.OccurrenceNotesDAO, noteType string, caseID string, seqID string, occurrenceID string, expectedStatus int) []types.OccurrenceNote {
	t.Helper()
	router := gin.Default()
	if noteType == "snv" {
		router.GET("/occurrences/germline/snv/:case_id/:seq_id/:locus_id/notes", server.GetOccurrenceSNVNotesHandler(repo))
	} else {
		router.GET("/occurrences/germline/cnv/:case_id/:seq_id/:cnv_id/notes", server.GetOccurrenceCNVNotesHandler(repo))
	}

	url := "/occurrences/germline/" + noteType + "/" + caseID + "/" + seqID + "/" + occurrenceID + "/notes"
	req, _ := http.NewRequest("GET", url, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, expectedStatus, w.Code)
	var notes []types.OccurrenceNote
	err := json.Unmarshal(w.Body.Bytes(), &notes)
	assert.NoError(t, err)
	return notes
}

func Test_PostOccurrenceSNVNote(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrenceNotesRepository(db)
		auth := &testutils.MockAuth{Id: mockUserUUID}

		created := assertPostOccurrenceNote(t, repo, auth, "snv", "1", "1", "10000", `{"content": "Integration test note"}`, http.StatusCreated)

		if assert.NotNil(t, created) {
			assert.NotEmpty(t, created.ID)
			assert.Equal(t, "snv", created.Type)
			assert.Equal(t, 1, created.CaseID)
			assert.Equal(t, 1, created.SeqID)
			assert.Equal(t, int64(10000), created.OccurrenceID)
			assert.Equal(t, mockUserUUID, created.UserID)
			assert.Equal(t, testutils.DefaultMockFullName, created.UserName)
			assert.Equal(t, "Integration test note", created.Content)
			assert.NotZero(t, created.CreatedAt)
			assert.NotZero(t, created.UpdatedAt)
		}
	})
}

func Test_PostOccurrenceSNVNote_MissingContent(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrenceNotesRepository(db)
		auth := &testutils.MockAuth{Id: mockUserUUID}

		assertPostOccurrenceNote(t, repo, auth, "snv", "1", "1", "10000", `{}`, http.StatusBadRequest)
	})
}

func Test_GetOccurrenceSNVNotes_EmptyResult(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrenceNotesRepository(db)

		notes := assertGetOccurrenceNotes(t, repo, "snv", "1", "1", "99999", http.StatusOK)
		assert.Empty(t, notes)
	})
}

func Test_GetOccurrenceSNVNotes(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrenceNotesRepository(db)
		auth := &testutils.MockAuth{Id: mockUserUUID}

		assertPostOccurrenceNote(t, repo, auth, "snv", "1", "1", "10000", `{"content": "First note"}`, http.StatusCreated)
		assertPostOccurrenceNote(t, repo, auth, "snv", "1", "1", "10000", `{"content": "Second note"}`, http.StatusCreated)

		notes := assertGetOccurrenceNotes(t, repo, "snv", "1", "1", "10000", http.StatusOK)

		if assert.Len(t, notes, 2) {
			// Most recently created note should be first (ORDER BY created_at DESC)
			assert.Equal(t, "Second note", notes[0].Content)
			assert.Equal(t, "First note", notes[1].Content)
		}
	})
}

func Test_PostOccurrenceCNVNote(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrenceNotesRepository(db)
		auth := &testutils.MockAuth{Id: mockUserUUID}

		created := assertPostOccurrenceNote(t, repo, auth, "cnv", "1", "1", "20000", `{"content": "CNV integration test note"}`, http.StatusCreated)

		if assert.NotNil(t, created) {
			assert.NotEmpty(t, created.ID)
			assert.Equal(t, "cnv", created.Type)
			assert.Equal(t, int64(20000), created.OccurrenceID)
			assert.Equal(t, "CNV integration test note", created.Content)
		}
	})
}

func Test_GetOccurrenceCNVNotes(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrenceNotesRepository(db)
		auth := &testutils.MockAuth{Id: mockUserUUID}

		assertPostOccurrenceNote(t, repo, auth, "cnv", "1", "1", "20000", `{"content": "CNV note"}`, http.StatusCreated)

		notes := assertGetOccurrenceNotes(t, repo, "cnv", "1", "1", "20000", http.StatusOK)

		if assert.Len(t, notes, 1) {
			assert.Equal(t, "cnv", notes[0].Type)
			assert.Equal(t, "CNV note", notes[0].Content)
		}
	})
}
