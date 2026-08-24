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

type mockActionsReader struct {
	actions []types.ActionResponse
	err     error
}

func (m *mockActionsReader) ListActions(_ context.Context) ([]types.ActionResponse, error) {
	return m.actions, m.err
}

func serveListActions(repo actionsReader) *httptest.ResponseRecorder {
	router := gin.Default()
	router.GET("/actions", ListActionsHandler(repo))
	req, _ := http.NewRequest("GET", "/actions", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_ListActionsHandler(t *testing.T) {
	repo := &mockActionsReader{actions: []types.ActionResponse{
		{Code: "can_manage_org", Scope: "tenant", Name: "Manage organizations", Description: "Create and edit organizations in the network.", Grantable: true},
	}}
	w := serveListActions(repo)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[
		{"code":"can_manage_org","scope":"tenant","name":"Manage organizations","description":"Create and edit organizations in the network.","grantable":true}
	]`, w.Body.String())
}

func Test_ListActionsHandler_RepoError(t *testing.T) {
	repo := &mockActionsReader{err: errors.New("boom")}
	w := serveListActions(repo)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
