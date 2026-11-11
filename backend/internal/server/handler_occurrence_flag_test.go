package server

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type mockOccurrenceFlagsRepo struct {
	upsertErr      error
	deleteAffected int64
	deleteErr      error
}

func (m *mockOccurrenceFlagsRepo) Upsert(ctx context.Context, flag types.OccurrenceFlag) (*types.OccurrenceFlag, error) {
	return &flag, m.upsertErr
}

func (m *mockOccurrenceFlagsRepo) Delete(ctx context.Context, caseID, seqID, taskID int, occurrenceID string) (int64, error) {
	return m.deleteAffected, m.deleteErr
}

func Test_UpsertOccurrenceFlagHandler(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{}
	router := tenantRouter()
	router.POST("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/flags/1/2/3/10000?flag_type=flag", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_InvalidCaseID(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{}
	router := tenantRouter()
	router.POST("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/flags/abc/2/3/10000?flag_type=flag", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_InvalidSeqID(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{}
	router := tenantRouter()
	router.POST("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/flags/1/abc/3/10000?flag_type=flag", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_InvalidTaskID(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{}
	router := tenantRouter()
	router.POST("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/flags/1/2/abc/10000?flag_type=flag", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_InvalidFlagType(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{}
	router := tenantRouter()
	router.POST("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/flags/1/2/3/10000?flag_type=bogus", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_MissingFlagType(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{}
	router := tenantRouter()
	router.POST("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/flags/1/2/3/10000", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_UpsertOccurrenceFlagHandler_RepositoryError(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{upsertErr: fmt.Errorf("mock upsert error")}
	router := tenantRouter()
	router.POST("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", UpsertOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/flags/1/2/3/10000?flag_type=flag", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_DeleteOccurrenceFlagHandler(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{deleteAffected: 1}
	router := tenantRouter()
	router.DELETE("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", DeleteOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("DELETE", "/radiant/occurrences/flags/1/2/3/10000", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)
}

func Test_DeleteOccurrenceFlagHandler_NotFound(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{deleteAffected: 0}
	router := tenantRouter()
	router.DELETE("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", DeleteOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("DELETE", "/radiant/occurrences/flags/1/2/3/10000", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_DeleteOccurrenceFlagHandler_InvalidCaseID(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{}
	router := tenantRouter()
	router.DELETE("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", DeleteOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("DELETE", "/radiant/occurrences/flags/abc/2/3/10000", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_DeleteOccurrenceFlagHandler_InvalidSeqID(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{}
	router := tenantRouter()
	router.DELETE("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", DeleteOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("DELETE", "/radiant/occurrences/flags/1/abc/3/10000", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_DeleteOccurrenceFlagHandler_InvalidTaskID(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{}
	router := tenantRouter()
	router.DELETE("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", DeleteOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("DELETE", "/radiant/occurrences/flags/1/2/abc/10000", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_DeleteOccurrenceFlagHandler_RepositoryError(t *testing.T) {
	repo := &mockOccurrenceFlagsRepo{deleteErr: fmt.Errorf("mock delete error")}
	router := tenantRouter()
	router.DELETE("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", DeleteOccurrenceFlagHandler(repo))

	req, _ := http.NewRequest("DELETE", "/radiant/occurrences/flags/1/2/3/10000", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}
