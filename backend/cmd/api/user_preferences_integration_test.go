package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
	"gorm.io/gorm"
)

func assertGetUserPreferencesHandler(t *testing.T, repo repository.UserPreferencesDAO, auth utils.Auth, status int, expected string) {
	router := gin.Default()
	router.GET("/users/preferences", server.GetUserPreferencesHandler(repo, auth))

	req, _ := http.NewRequest("GET", "/users/preferences", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetUserPreferencesHandler_NotFound(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewUserPreferencesRepository(db)
		auth := &testutils.MockAuth{}
		assertGetUserPreferencesHandler(t, repo, auth, http.StatusNotFound, `{"status": 404, "message":"user preferences not found"}`)
	})
}

func Test_GetUserPreferencesHandler_Found(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewUserPreferencesRepository(db)
		auth := &testutils.MockAuth{
			Id:  "b3a74785-b0a9-4a45-879e-f13c476976f7",
			Azp: "mock-azp",
			ResourceAccess: map[string]ginkeycloak.ServiceRole{
				"mock-azp": {
					Roles: []string{"mock-role"},
				},
			},
			Username: "mock-username",
		}
		expected := `{
			"table_display":{
				"table_1":{
					"columnOrder":["row_expand", "clinical_interpretation"], 
					"columnSizing":{"clinical_interpretation":10}, 
					"columnVisibility":{"row_expand":true}, 
					"pagination":{"pageSize":10}
				}
			}, 
			"user_id":"b3a74785-b0a9-4a45-879e-f13c476976f7"
		}`
		assertGetUserPreferencesHandler(t, repo, auth, http.StatusOK, expected)
	})
}

func assertUpdateUserPreferencesHandler(t *testing.T, repo repository.UserPreferencesDAO, auth utils.Auth, body string, status int, expected string) {
	router := gin.Default()
	router.POST("/users/preferences", server.UpdateUserPreferencesHandler(repo, auth))

	req, _ := http.NewRequest("POST", "/users/preferences", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_UpdateUserPreferencesHandler(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewUserPreferencesRepository(db)
		auth := &testutils.MockAuth{
			Id:  "b3a74785-b0a9-4a45-879e-f13c476976f7",
			Azp: "mock-azp",
			ResourceAccess: map[string]ginkeycloak.ServiceRole{
				"mock-azp": {
					Roles: []string{"mock-role"},
				},
			},
			Username: "mock-username",
		}
		body := `{
			"table_display":{
				"table_1":{
					"columnOrder":["row_expand", "clinical_interpretation"], 
					"columnSizing":{"clinical_interpretation":10}, 
					"columnVisibility":{"row_expand":true}, 
					"pagination":{"pageSize":20}
				}
			}, 
			"user_id":"b3a74785-b0a9-4a45-879e-f13c476976f7"
		}`
		assertUpdateUserPreferencesHandler(t, repo, auth, body, http.StatusOK, body)
	})
}
