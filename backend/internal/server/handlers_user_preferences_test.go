package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) GetUserPreferences(userId string, key string) (*types.JsonMap[string, interface{}], error) {
	return &types.JsonMap[string, interface{}]{
		"columnOrder": types.JsonArray[string]{"column_1", "column_2"},
		"columnPinning": types.JsonMap[string, interface{}]{
			"left":  types.JsonArray[string]{"column_1"},
			"right": types.JsonArray[string]{"column_10"},
		},
		"columnSizing": types.JsonMap[string, interface{}]{
			"column_1":  1,
			"column_10": 10,
			"column_2":  2,
		},
		"columnVisibility": types.JsonMap[string, interface{}]{
			"column_1":  true,
			"column_10": true,
			"column_2":  true,
			"column_3":  false,
		},
		"pagination": types.JsonMap[string, interface{}]{
			"pageSize": 15,
		},
	}, nil
}

func (m *MockRepository) UpdateUserPreferences(userId string, key string, content types.JsonMap[string, interface{}]) (*types.JsonMap[string, interface{}], error) {
	return &content, nil
}

func Test_GetUserPreferencesHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.GET("/users/preferences/:key", GetUserPreferencesHandler(repo, auth))

	req, _ := http.NewRequest("GET", "/users/preferences/table_1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
				"columnOrder":["column_1", "column_2"], 
				"columnPinning":{"left":["column_1"], "right":["column_10"]}, 
				"columnSizing":{"column_1":1, "column_10":10, "column_2":2}, 
				"columnVisibility":{"column_1":true, "column_10":true, "column_2":true, "column_3":false}, 
				"pagination":{"pageSize":15}
	}`, w.Body.String())
}

func Test_UpdateUserPreferencesHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/users/preferences/:key", UpdateUserPreferencesHandler(repo, auth))

	body := `{
				"columnOrder":["column_1", "column_2"], 
				"columnPinning":{"left":["column_1"], "right":["column_10"]}, 
				"columnSizing":{"column_1":1, "column_10":10, "column_2":2}, 
				"columnVisibility":{"column_1":true, "column_10":true, "column_2":true, "column_3":false}, 
				"pagination":{"pageSize":20}
			}`
	req, _ := http.NewRequest("POST", "/users/preferences/table_1", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
				"columnOrder":["column_1", "column_2"], 
				"columnPinning":{"left":["column_1"], "right":["column_10"]}, 
				"columnSizing":{"column_1":1, "column_10":10, "column_2":2}, 
				"columnVisibility":{"column_1":true, "column_10":true, "column_2":true, "column_3":false}, 
				"pagination":{"pageSize":20}
			}`, w.Body.String())
}
