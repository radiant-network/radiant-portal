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

func assertGeneAutoComplete(t *testing.T, data string, prefix string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGenesRepository(db)
		router := gin.Default()
		router.GET("/genes/autocomplete", server.GetGeneAutoCompleteHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/genes/autocomplete?prefix=%s", prefix), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GeneAutoComplete(t *testing.T) {
	expected := `[
		{"highlight":{"id":"ENSG00000000938", "name":"<strong>F</strong>GR"}, "source":{"id":"ENSG00000000938", "name":"FGR"}},
		{"highlight":{"id":"ENSG00000000460", "name":"<strong>F</strong>IRRM"}, "source":{"id":"ENSG00000000460", "name":"FIRRM"}},
		{"highlight":{"id":"ENSG00000001036", "name":"<strong>F</strong>UCA2"}, "source":{"id":"ENSG00000001036", "name":"FUCA2"}},
		{"highlight":{"id":"ENSG00000000971", "name":"CFH"}, "source":{"id":"ENSG00000000971", "name":"CFH"}}
	]`
	assertGeneAutoComplete(t, "simple", "F", expected)
}
