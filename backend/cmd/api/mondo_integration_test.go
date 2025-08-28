package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func assertMondoTermAutoComplete(t *testing.T, data string, prefix string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewTermsRepository(db)
		router := gin.Default()
		router.GET("/mondo/autocomplete", server.GetMondoTermAutoComplete(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/mondo/autocomplete?prefix=%s", prefix), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_MondoTermAutoComplete(t *testing.T) {
	expected := `[{"source":{"id":"MONDO:0000001", "name":"blood group incompatibility"}, "highlight":{"id":"MONDO:0000001", "name":"<strong>blood</strong> group incompatibility"}}, {"source":{"id":"MONDO:0000002", "name":"blood vessel neoplasm"}, "highlight":{"id":"MONDO:0000002", "name":"<strong>blood</strong> vessel neoplasm"}}]`
	assertMondoTermAutoComplete(t, "simple", "blood", expected)
}
