package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func assertGetUserPreferencesHandler(t *testing.T, repo *postgres.UserPreferencesRepository, auth utils.Auth, status int, key string, expected string) {
	router := tenantRouter()
	router.GET("/users/preferences/:key", server.GetUserPreferencesHandler(repo, auth))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/users/preferences/%s", key), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetUserPreferencesHandler_NotFound(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := postgres.NewUserPreferencesRepository(database.PostgresDB{DB: db})
		auth := &testutils.MockAuth{}
		assertGetUserPreferencesHandler(t, repo, auth, http.StatusNotFound, "table_1", `{"status": 404, "message":"user preferences not found"}`)
	})
}

func Test_GetUserPreferencesHandler_Found(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := postgres.NewUserPreferencesRepository(database.PostgresDB{DB: db})
		auth := &testutils.MockAuth{
			Id: "b3a74785-b0a9-4a45-879e-f13c476976f7",
		}
		expected := `{
					"columnOrder":["row_expand", "clinical_interpretation"], 
					"columnSizing":{"clinical_interpretation":10}, 
					"columnVisibility":{"row_expand":true}, 
					"pagination":{"pageSize":10}
				}`
		assertGetUserPreferencesHandler(t, repo, auth, http.StatusOK, "table_1", expected)
	})
}

func assertUpdateUserPreferencesHandler(t *testing.T, repo *postgres.UserPreferencesRepository, auth utils.Auth, body string, status int, key string, expected string) {
	router := tenantRouter()
	router.POST("/users/preferences/:key", server.UpdateUserPreferencesHandler(repo, auth))

	req, _ := http.NewRequest("POST", fmt.Sprintf("/users/preferences/%s", key), bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_UpdateUserPreferencesHandler(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := postgres.NewUserPreferencesRepository(database.PostgresDB{DB: db})
		auth := &testutils.MockAuth{
			Id: "b3a74785-b0a9-4a45-879e-f13c476976f7",
		}
		body := `{
					"columnOrder":["row_expand", "clinical_interpretation"], 
					"columnSizing":{"clinical_interpretation":10}, 
					"columnVisibility":{"row_expand":true}, 
					"pagination":{"pageSize":20}
				}`
		assertUpdateUserPreferencesHandler(t, repo, auth, body, http.StatusOK, "table_1", body)
	})
}
