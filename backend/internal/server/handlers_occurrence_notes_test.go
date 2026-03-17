package server

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

var fixedTime = time.Date(2024, 1, 15, 10, 0, 0, 0, time.UTC)

func (m *MockRepository) Create(note types.OccurrenceNote) (*types.OccurrenceNote, error) {
	if note.Content == "trigger-error" {
		return nil, fmt.Errorf("mock create error")
	}
	note.ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
	note.CreatedAt = fixedTime
	note.UpdatedAt = fixedTime
	return &note, nil
}

func (m *MockRepository) GetByOccurrence(noteType string, caseID int, seqID int, occurrenceID int64) ([]types.OccurrenceNote, error) {
	if occurrenceID == 99999 {
		return nil, fmt.Errorf("mock get error")
	}
	if occurrenceID == 88888 {
		return []types.OccurrenceNote{}, nil
	}
	return []types.OccurrenceNote{
		{
			ID:           "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
			Type:         noteType,
			CaseID:       caseID,
			SeqID:        seqID,
			OccurrenceID: occurrenceID,
			UserID:       testutils.DefaultMockUserId,
			UserName:     testutils.DefaultMockFullName,
			Content:      "First note",
			CreatedAt:    fixedTime,
			UpdatedAt:    fixedTime,
		},
	}, nil
}

func Test_PostOccurrenceCNVNoteHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/occurrences/germline/cnv/:case_id/:seq_id/:cnv_id/notes", PostOccurrenceCNVNoteHandler(repo, auth))

	body := `{"content": "CNV note"}`
	req, _ := http.NewRequest("POST", "/occurrences/germline/cnv/1/2/20000/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.JSONEq(t, `{
		"id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		"type": "cnv",
		"case_id": 1,
		"seq_id": 2,
		"occurrence_id": 20000,
		"user_id": "1",
		"user_name": "Mock User",
		"content": "CNV note",
		"created_at": "2024-01-15T10:00:00Z",
		"updated_at": "2024-01-15T10:00:00Z"
	}`, w.Body.String())
}

func Test_PostOccurrenceSNVNoteHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/occurrences/germline/snv/:case_id/:seq_id/:locus_id/notes", PostOccurrenceSNVNoteHandler(repo, auth))

	body := `{"content": "Test note"}`
	req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/2/10000/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.JSONEq(t, `{
		"id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		"type": "snv",
		"case_id": 1,
		"seq_id": 2,
		"occurrence_id": 10000,
		"user_id": "1",
		"user_name": "Mock User",
		"content": "Test note",
		"created_at": "2024-01-15T10:00:00Z",
		"updated_at": "2024-01-15T10:00:00Z"
	}`, w.Body.String())
}

func Test_PostOccurrenceSNVNoteHandler_MissingContent(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/occurrences/germline/snv/:case_id/:seq_id/:locus_id/notes", PostOccurrenceSNVNoteHandler(repo, auth))

	body := `{}`
	req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/2/10000/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostOccurrenceSNVNoteHandler_InvalidCaseID(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/occurrences/germline/snv/:case_id/:seq_id/:locus_id/notes", PostOccurrenceSNVNoteHandler(repo, auth))

	body := `{"content": "Test note"}`
	req, _ := http.NewRequest("POST", "/occurrences/germline/snv/abc/2/10000/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_PostOccurrenceSNVNoteHandler_InvalidSeqID(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/occurrences/germline/snv/:case_id/:seq_id/:locus_id/notes", PostOccurrenceSNVNoteHandler(repo, auth))

	body := `{"content": "Test note"}`
	req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/abc/10000/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_PostOccurrenceSNVNoteHandler_InvalidLocusID(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/occurrences/germline/snv/:case_id/:seq_id/:locus_id/notes", PostOccurrenceSNVNoteHandler(repo, auth))

	body := `{"content": "Test note"}`
	req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/2/abc/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_GetOccurrenceCNVNotesHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/occurrences/germline/cnv/:case_id/:seq_id/:cnv_id/notes", GetOccurrenceCNVNotesHandler(repo))

	req, _ := http.NewRequest("GET", "/occurrences/germline/cnv/1/2/20000/notes", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		"type": "cnv",
		"case_id": 1,
		"seq_id": 2,
		"occurrence_id": 20000,
		"user_id": "1",
		"user_name": "Mock User",
		"content": "First note",
		"created_at": "2024-01-15T10:00:00Z",
		"updated_at": "2024-01-15T10:00:00Z"
	}]`, w.Body.String())
}

func Test_GetOccurrenceSNVNotesHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/occurrences/germline/snv/:case_id/:seq_id/:locus_id/notes", GetOccurrenceSNVNotesHandler(repo))

	req, _ := http.NewRequest("GET", "/occurrences/germline/snv/1/2/10000/notes", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		"type": "snv",
		"case_id": 1,
		"seq_id": 2,
		"occurrence_id": 10000,
		"user_id": "1",
		"user_name": "Mock User",
		"content": "First note",
		"created_at": "2024-01-15T10:00:00Z",
		"updated_at": "2024-01-15T10:00:00Z"
	}]`, w.Body.String())
}

func Test_GetOccurrenceSNVNotesHandler_EmptyResult(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/occurrences/germline/snv/:case_id/:seq_id/:locus_id/notes", GetOccurrenceSNVNotesHandler(repo))

	req, _ := http.NewRequest("GET", "/occurrences/germline/snv/1/2/88888/notes", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[]`, w.Body.String())
}

func Test_GetOccurrenceSNVNotesHandler_InvalidCaseID(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/occurrences/germline/snv/:case_id/:seq_id/:locus_id/notes", GetOccurrenceSNVNotesHandler(repo))

	req, _ := http.NewRequest("GET", "/occurrences/germline/snv/abc/2/10000/notes", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}
