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

func (m *MockRepository) GetByID(id string) (*types.OccurrenceNote, error) {
	if id == "not-found-id" {
		return nil, nil
	}
	if id == "error-id" {
		return nil, fmt.Errorf("mock get by id error")
	}
	return &types.OccurrenceNote{
		ID:           id,
		CaseID:       1,
		SeqID:        2,
		TaskID:       1,
		OccurrenceID: "10000",
		UserID:       testutils.DefaultMockUserId,
		UserName:     testutils.DefaultMockFullName,
		Content:      "Original content",
		CreatedAt:    fixedTime,
		UpdatedAt:    fixedTime,
	}, nil
}

func (m *MockRepository) Update(id string, content string) (*types.OccurrenceNote, error) {
	if content == "trigger-update-error" {
		return nil, fmt.Errorf("mock update error")
	}
	return &types.OccurrenceNote{
		ID:           id,
		CaseID:       1,
		SeqID:        2,
		TaskID:       1,
		OccurrenceID: "10000",
		UserID:       testutils.DefaultMockUserId,
		UserName:     testutils.DefaultMockFullName,
		Content:      content,
		CreatedAt:    fixedTime,
		UpdatedAt:    fixedTime.Add(time.Hour),
	}, nil
}

func (m *MockRepository) GetByOccurrence(caseID int, seqID int, taskID int, occurrenceID string) ([]types.OccurrenceNote, error) {
	if occurrenceID == "99999" {
		return nil, fmt.Errorf("mock get error")
	}
	if occurrenceID == "88888" {
		return []types.OccurrenceNote{}, nil
	}
	return []types.OccurrenceNote{
		{
			ID:           "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
			CaseID:       caseID,
			SeqID:        seqID,
			TaskID:       taskID,
			OccurrenceID: occurrenceID,
			UserID:       testutils.DefaultMockUserId,
			UserName:     testutils.DefaultMockFullName,
			Content:      "First note",
			CreatedAt:    fixedTime,
			UpdatedAt:    fixedTime,
		},
	}, nil
}

func Test_PostOccurrenceNoteHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/notes", PostOccurrenceNoteHandler(repo, auth))

	body := `{"case_id": 1, "seq_id": 2, "task_id": 1, "occurrence_id": "10000", "content": "Test note"}`
	req, _ := http.NewRequest("POST", "/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.JSONEq(t, `{
		"id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		"case_id": 1,
		"seq_id": 2,
		"task_id": 1,
		"occurrence_id": "10000",
		"user_id": "1",
		"user_name": "Mock User",
		"content": "Test note",
		"created_at": "2024-01-15T10:00:00Z",
		"updated_at": "2024-01-15T10:00:00Z"
	}`, w.Body.String())
}

func Test_PostOccurrenceNoteHandler_MissingContent(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/notes", PostOccurrenceNoteHandler(repo, auth))

	body := `{"case_id": 1, "seq_id": 2, "task_id": 1, "occurrence_id": "10000"}`
	req, _ := http.NewRequest("POST", "/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostOccurrenceNoteHandler_MissingTaskID(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/notes", PostOccurrenceNoteHandler(repo, auth))

	body := `{"case_id": 1, "seq_id": 2, "occurrence_id": "10000", "content": "Test note"}`
	req, _ := http.NewRequest("POST", "/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostOccurrenceNoteHandler_MissingCaseID(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/notes", PostOccurrenceNoteHandler(repo, auth))

	body := `{"seq_id": 2, "task_id": 1, "occurrence_id": "10000", "content": "Test note"}`
	req, _ := http.NewRequest("POST", "/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostOccurrenceNoteHandler_MissingOccurrenceID(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/notes", PostOccurrenceNoteHandler(repo, auth))

	body := `{"case_id": 1, "seq_id": 2, "task_id": 1, "content": "Test note"}`
	req, _ := http.NewRequest("POST", "/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostOccurrenceNoteHandler_ContentTooLong(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/notes", PostOccurrenceNoteHandler(repo, auth))

	longContent := string(make([]byte, 1001))
	body := fmt.Sprintf(`{"case_id": 1, "seq_id": 2, "task_id": 1, "occurrence_id": "10000", "content": %q}`, longContent)
	req, _ := http.NewRequest("POST", "/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostOccurrenceNoteHandler_ContentSanitized(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/notes", PostOccurrenceNoteHandler(repo, auth))

	body := `{"case_id": 1, "seq_id": 2, "task_id": 1, "occurrence_id": "10000", "content": "<p>Safe text</p><script>alert('xss')</script><img src=x onerror=alert(1)>"}`
	req, _ := http.NewRequest("POST", "/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), `\u003cp\u003eSafe text\u003c/p\u003e`)
	assert.NotContains(t, w.Body.String(), "script")
	assert.NotContains(t, w.Body.String(), "onerror")
}

func Test_PostOccurrenceNoteHandler_ContentWithSafeHTMLPreserved(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/notes", PostOccurrenceNoteHandler(repo, auth))

	body := `{"case_id": 1, "seq_id": 2, "task_id": 1, "occurrence_id": "10000", "content": "<p>Some <strong>bold</strong> text</p>"}`
	req, _ := http.NewRequest("POST", "/notes", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "bold")
}

func Test_GetOccurrenceNotesHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/notes/:case_id/:seq_id/:task_id/:occurrence_id", GetOccurrenceNotesHandler(repo))

	req, _ := http.NewRequest("GET", "/notes/1/2/1/10000", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		"case_id": 1,
		"seq_id": 2,
		"task_id": 1,
		"occurrence_id": "10000",
		"user_id": "1",
		"user_name": "Mock User",
		"content": "First note",
		"created_at": "2024-01-15T10:00:00Z",
		"updated_at": "2024-01-15T10:00:00Z"
	}]`, w.Body.String())
}

func Test_GetOccurrenceNotesHandler_EmptyResult(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/notes/:case_id/:seq_id/:task_id/:occurrence_id", GetOccurrenceNotesHandler(repo))

	req, _ := http.NewRequest("GET", "/notes/1/2/1/88888", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[]`, w.Body.String())
}

func Test_GetOccurrenceNotesHandler_InvalidCaseID(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/notes/:case_id/:seq_id/:task_id/:occurrence_id", GetOccurrenceNotesHandler(repo))

	req, _ := http.NewRequest("GET", "/notes/abc/2/1/10000", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_PutOccurrenceNoteHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.PUT("/notes/:id", PutOccurrenceNoteHandler(repo, auth))

	body := `{"content": "Updated content"}`
	req, _ := http.NewRequest("PUT", "/notes/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		"case_id": 1,
		"seq_id": 2,
		"task_id": 1,
		"occurrence_id": "10000",
		"user_id": "1",
		"user_name": "Mock User",
		"content": "Updated content",
		"created_at": "2024-01-15T10:00:00Z",
		"updated_at": "2024-01-15T11:00:00Z"
	}`, w.Body.String())
}

func Test_PutOccurrenceNoteHandler_MissingContent(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.PUT("/notes/:id", PutOccurrenceNoteHandler(repo, auth))

	body := `{}`
	req, _ := http.NewRequest("PUT", "/notes/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PutOccurrenceNoteHandler_ContentTooLong(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.PUT("/notes/:id", PutOccurrenceNoteHandler(repo, auth))

	longContent := string(make([]byte, 1001))
	body := fmt.Sprintf(`{"content": %q}`, longContent)
	req, _ := http.NewRequest("PUT", "/notes/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PutOccurrenceNoteHandler_NoteNotFound(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.PUT("/notes/:id", PutOccurrenceNoteHandler(repo, auth))

	body := `{"content": "Updated content"}`
	req, _ := http.NewRequest("PUT", "/notes/not-found-id", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_PutOccurrenceNoteHandler_Forbidden(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{Id: "other-user-id"}
	router := gin.Default()
	router.PUT("/notes/:id", PutOccurrenceNoteHandler(repo, auth))

	body := `{"content": "Updated content"}`
	req, _ := http.NewRequest("PUT", "/notes/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
}
