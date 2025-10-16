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

func (m *MockRepository) GetUserPreferences(userId string) (*types.UserPreference, error) {
	return &types.UserPreference{
		UserID: userId,
		TableDisplay: types.JsonMap[string, types.TableConfig]{
			"table_1": {
				ColumnOrder:   []string{"column_1", "column_2"},
				ColumnPinning: &types.ColumnPinningConfig{Left: types.JsonArray[string]{"column_1"}, Right: types.JsonArray[string]{"column_10"}},
				ColumnSizing: map[string]int{
					"column_1":  1,
					"column_2":  2,
					"column_10": 10,
				},
				ColumnVisibility: map[string]bool{
					"column_1":  true,
					"column_2":  true,
					"column_3":  false,
					"column_10": true,
				},
				Pagination: &types.PaginationConfig{
					PageSize: 15,
				},
			},
			"table_2": {},
		},
	}, nil
}

func (m *MockRepository) UpdateUserPreferences(userId string, userPreference types.UserPreference) (*types.UserPreference, error) {
	return &userPreference, nil
}

func Test_GetUserPreferencesHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.GET("/users/preferences", GetUserPreferencesHandler(repo, auth))

	req, _ := http.NewRequest("GET", "/users/preferences", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"table_display":{
			"table_1":{
				"columnOrder":["column_1", "column_2"], 
				"columnPinning":{"left":["column_1"], "right":["column_10"]}, 
				"columnSizing":{"column_1":1, "column_10":10, "column_2":2}, 
				"columnVisibility":{"column_1":true, "column_10":true, "column_2":true, "column_3":false}, 
				"pagination":{"pageSize":15}
			}, 
			"table_2":{}
		}, 
		"user_id":"1"
	}`, w.Body.String())
}

func Test_UpdateUserPreferencesHandler(t *testing.T) {
	repo := &MockRepository{}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.POST("/users/preferences", UpdateUserPreferencesHandler(repo, auth))

	body := `{
		"table_display":{
			"table_1":{
				"columnOrder":["column_1", "column_2"], 
				"columnPinning":{"left":["column_1"], "right":["column_10"]}, 
				"columnSizing":{"column_1":1, "column_10":10, "column_2":2}, 
				"columnVisibility":{"column_1":true, "column_10":true, "column_2":true, "column_3":false}, 
				"pagination":{"pageSize":20}
			}, 
			"table_2":{},
			"table_3":{}
		}, 
		"user_id":"1"
	}`
	req, _ := http.NewRequest("POST", "/users/preferences", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"table_display":{
			"table_1":{
				"columnOrder":["column_1", "column_2"], 
				"columnPinning":{"left":["column_1"], "right":["column_10"]}, 
				"columnSizing":{"column_1":1, "column_10":10, "column_2":2}, 
				"columnVisibility":{"column_1":true, "column_10":true, "column_2":true, "column_3":false}, 
				"pagination":{"pageSize":20}
			}, 
			"table_2":{},
			"table_3":{}
		}, 
		"user_id":"1"
	}`, w.Body.String())
}
