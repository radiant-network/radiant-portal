package server

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type mockValueSetReader struct {
	items []types.ValueSetItem
	err   error
}

func (m *mockValueSetReader) ListValueSet(_ context.Context, _ string) ([]types.ValueSetItem, error) {
	return m.items, m.err
}

func serveListValueSet(repo valueSetReader, valueSetType string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.GET("/value_sets/:type", ListValueSetHandler(repo))
	req, _ := http.NewRequest("GET", "/value_sets/"+valueSetType, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_ListValueSetHandler(t *testing.T) {
	repo := &mockValueSetReader{items: []types.ValueSetItem{
		{Code: "healthcare_provider", Name: "Healthcare Provider"},
		{Code: "sequencing_center", Name: "Sequencing Center"},
	}}
	w := serveListValueSet(repo, "organization_category")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[
		{"code":"healthcare_provider","name":"Healthcare Provider"},
		{"code":"sequencing_center","name":"Sequencing Center"}
	]`, w.Body.String())
}

func Test_ListValueSetHandler_UnknownType(t *testing.T) {
	repo := &mockValueSetReader{err: types.ErrUnknownValueSet}
	w := serveListValueSet(repo, "not_a_value_set")

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_ListValueSetHandler_RepoError(t *testing.T) {
	repo := &mockValueSetReader{err: errors.New("boom")}
	w := serveListValueSet(repo, "organization_category")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
