package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func assertGetUserSet(t *testing.T, repo *repository.UserSetsRepository, userSetId string, status int, expected string) {
	router := tenantRouter()
	router.GET("/users/sets/:user_set_id", server.GetUserSet(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/users/sets/%s", userSetId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetUserSet(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewUserSetsRepository(database.PostgresDB{DB: db})
		// not found
		assertGetUserSet(t, repo, "bce3b031-c691-4680-878f-f43d661f9a9f", http.StatusNotFound, `{"status": 404, "message":"user not found"}`)
	})
}
