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

var flagFixedTime = time.Date(2024, 1, 15, 10, 0, 0, 0, time.UTC)

type MockVariantFlagsRepository struct{}

func (m *MockVariantFlagsRepository) Upsert(flag types.VariantFlag) (*types.VariantFlag, error) {
	if flag.OccurrenceID == "trigger-upsert-error" {
		return nil, fmt.Errorf("mock upsert error")
	}
	flag.CreatedAt = flagFixedTime
	flag.UpdatedAt = flagFixedTime
	return &flag, nil
}

func (m *MockVariantFlagsRepository) GetByCase(caseID int) ([]types.VariantFlag, error) {
	if caseID == 99 {
		return nil, fmt.Errorf("mock get by case error")
	}
	if caseID == 88 {
		return []types.VariantFlag{}, nil
	}
	return []types.VariantFlag{
		{
			CaseID:       caseID,
			OccurrenceID: "occ-1",
			FlagType:     "flag",
			UserID:       testutils.DefaultMockUserId,
			UserName:     testutils.DefaultMockFullName,
			CreatedAt:    flagFixedTime,
			UpdatedAt:    flagFixedTime,
		},
	}, nil
}

func (m *MockVariantFlagsRepository) GetByCaseOccurrence(caseID int, occurrenceID string) (*types.VariantFlag, error) {
	if occurrenceID == "not-found-occ" {
		return nil, nil
	}
	if occurrenceID == "error-occ" {
		return nil, fmt.Errorf("mock get by case+occurrence error")
	}
	return &types.VariantFlag{
		CaseID:       caseID,
		OccurrenceID: occurrenceID,
		FlagType:     "pin",
		UserID:       testutils.DefaultMockUserId,
		UserName:     testutils.DefaultMockFullName,
		CreatedAt:    flagFixedTime,
		UpdatedAt:    flagFixedTime,
	}, nil
}

func (m *MockVariantFlagsRepository) Delete(caseID int, occurrenceID string) error {
	if occurrenceID == "error-delete-occ" {
		return fmt.Errorf("mock delete error")
	}
	return nil
}

// --- PUT ----------------------------------------------------------------

func Test_PutVariantFlagHandler(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.PUT("/variant-flags/:case_id/:occurrence_id", PutVariantFlagHandler(repo, auth))

	body := `{"flag_type": "star"}`
	req, _ := http.NewRequest("PUT", "/variant-flags/1/occ-A", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"case_id": 1,
		"occurrence_id": "occ-A",
		"flag_type": "star",
		"user_id": "1",
		"user_name": "Mock User",
		"created_at": "2024-01-15T10:00:00Z",
		"updated_at": "2024-01-15T10:00:00Z"
	}`, w.Body.String())
}

func Test_PutVariantFlagHandler_InvalidCaseID(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.PUT("/variant-flags/:case_id/:occurrence_id", PutVariantFlagHandler(repo, auth))

	req, _ := http.NewRequest("PUT", "/variant-flags/abc/occ-A", bytes.NewBuffer([]byte(`{"flag_type": "flag"}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_PutVariantFlagHandler_MissingFlagType(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.PUT("/variant-flags/:case_id/:occurrence_id", PutVariantFlagHandler(repo, auth))

	req, _ := http.NewRequest("PUT", "/variant-flags/1/occ-A", bytes.NewBuffer([]byte(`{}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PutVariantFlagHandler_InvalidFlagType(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.PUT("/variant-flags/:case_id/:occurrence_id", PutVariantFlagHandler(repo, auth))

	req, _ := http.NewRequest("PUT", "/variant-flags/1/occ-A", bytes.NewBuffer([]byte(`{"flag_type": "bookmark"}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PutVariantFlagHandler_RepoError(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.PUT("/variant-flags/:case_id/:occurrence_id", PutVariantFlagHandler(repo, auth))

	req, _ := http.NewRequest("PUT", "/variant-flags/1/trigger-upsert-error", bytes.NewBuffer([]byte(`{"flag_type": "flag"}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

// --- DELETE -------------------------------------------------------------

func Test_DeleteVariantFlagHandler(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.DELETE("/variant-flags/:case_id/:occurrence_id", DeleteVariantFlagHandler(repo))

	req, _ := http.NewRequest("DELETE", "/variant-flags/1/occ-A", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)
}

func Test_DeleteVariantFlagHandler_InvalidCaseID(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.DELETE("/variant-flags/:case_id/:occurrence_id", DeleteVariantFlagHandler(repo))

	req, _ := http.NewRequest("DELETE", "/variant-flags/abc/occ-A", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_DeleteVariantFlagHandler_RepoError(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.DELETE("/variant-flags/:case_id/:occurrence_id", DeleteVariantFlagHandler(repo))

	req, _ := http.NewRequest("DELETE", "/variant-flags/1/error-delete-occ", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

// --- GET (by case) ------------------------------------------------------

func Test_GetVariantFlagsByCaseHandler(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.GET("/variant-flags/:case_id", GetVariantFlagsByCaseHandler(repo))

	req, _ := http.NewRequest("GET", "/variant-flags/1", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"case_id": 1,
		"occurrence_id": "occ-1",
		"flag_type": "flag",
		"user_id": "1",
		"user_name": "Mock User",
		"created_at": "2024-01-15T10:00:00Z",
		"updated_at": "2024-01-15T10:00:00Z"
	}]`, w.Body.String())
}

func Test_GetVariantFlagsByCaseHandler_EmptyResult(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.GET("/variant-flags/:case_id", GetVariantFlagsByCaseHandler(repo))

	req, _ := http.NewRequest("GET", "/variant-flags/88", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[]`, w.Body.String())
}

func Test_GetVariantFlagsByCaseHandler_InvalidCaseID(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.GET("/variant-flags/:case_id", GetVariantFlagsByCaseHandler(repo))

	req, _ := http.NewRequest("GET", "/variant-flags/abc", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_GetVariantFlagsByCaseHandler_RepoError(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.GET("/variant-flags/:case_id", GetVariantFlagsByCaseHandler(repo))

	req, _ := http.NewRequest("GET", "/variant-flags/99", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

// --- GET (single) -------------------------------------------------------

func Test_GetVariantFlagHandler(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.GET("/variant-flags/:case_id/:occurrence_id", GetVariantFlagHandler(repo))

	req, _ := http.NewRequest("GET", "/variant-flags/1/occ-A", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"case_id": 1,
		"occurrence_id": "occ-A",
		"flag_type": "pin",
		"user_id": "1",
		"user_name": "Mock User",
		"created_at": "2024-01-15T10:00:00Z",
		"updated_at": "2024-01-15T10:00:00Z"
	}`, w.Body.String())
}

func Test_GetVariantFlagHandler_NotFound(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.GET("/variant-flags/:case_id/:occurrence_id", GetVariantFlagHandler(repo))

	req, _ := http.NewRequest("GET", "/variant-flags/1/not-found-occ", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_GetVariantFlagHandler_RepoError(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.GET("/variant-flags/:case_id/:occurrence_id", GetVariantFlagHandler(repo))

	req, _ := http.NewRequest("GET", "/variant-flags/1/error-occ", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_GetVariantFlagHandler_InvalidCaseID(t *testing.T) {
	repo := &MockVariantFlagsRepository{}
	router := gin.Default()
	router.GET("/variant-flags/:case_id/:occurrence_id", GetVariantFlagHandler(repo))

	req, _ := http.NewRequest("GET", "/variant-flags/abc/occ-A", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}
