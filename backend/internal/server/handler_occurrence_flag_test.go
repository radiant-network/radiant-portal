package server

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) Upsert(flag types.OccurrenceFlag) (*types.OccurrenceFlag, error) {
	if flag.OccurrenceID == "trigger-upsert-error" {
		return nil, fmt.Errorf("mock upsert error")
	}
	return &flag, nil
}

func Test_UpsertOccurrenceFlagHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/flags/1/2/3/10000?flag_type=flag", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_InvalidCaseID(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/flags/abc/2/3/10000?flag_type=flag", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_InvalidSeqID(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/flags/1/abc/3/10000?flag_type=flag", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_InvalidTaskID(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/flags/1/2/abc/10000?flag_type=flag", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_InvalidFlagType(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/flags/1/2/3/10000?flag_type=bogus", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_MissingFlagType(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/flags/1/2/3/10000", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_RepositoryError(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/flags/1/2/3/trigger-upsert-error?flag_type=flag", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}
