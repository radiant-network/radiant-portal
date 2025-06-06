package server

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/types"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) GetUserSet(userSetId string) (*types.UserSet, error) {
	if userSetId == "set1" {
		return &types.UserSet{
			ID:     userSetId,
			UserId: "user1",
			Name:   "set_name",
			Type:   "set_type",
			Active: true,
			UpdatedAt: time.Date(
				2000, 1, 1, 0, 0, 0, 0, time.UTC),
		}, nil
	} else if userSetId == "set2" {
		return nil, fmt.Errorf("error")
	}
	return nil, nil
}

func assertGetUserSet(t *testing.T, userSetId string, status int, expected string) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/users/sets/:user_set_id", GetUserSet(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/users/sets/%s", userSetId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetUserSet_ok(t *testing.T) {
	assertGetUserSet(t, "set1", http.StatusOK, `{"id":"set1", "user_id":"user1", "name":"set_name", "type": "set_type", "active":true, "updated_at": "2000-01-01T00:00:00Z"}`)
}

func Test_GetUserSet_error(t *testing.T) {
	assertGetUserSet(t, "set2", http.StatusInternalServerError, `{"status": 500, "message":"Internal Server Error", "detail":"error"}`)
}

func Test_GetUserSet_notFound(t *testing.T) {
	assertGetUserSet(t, "set3", http.StatusNotFound, `{"status": 404, "message":"user not found"}`)
}
