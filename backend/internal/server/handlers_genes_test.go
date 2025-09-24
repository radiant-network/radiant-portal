package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) GetGeneAutoComplete(string, int) (*[]types.AutoCompleteGene, error) {
	return &[]types.AutoCompleteGene{
			{Source: types.Term{
				ID:   "ENSG00000000938",
				Name: "FGR",
			}, HighLight: types.Term{
				ID:   "ENSG00000000938",
				Name: "<strong>F</strong>GR",
			}},
		},
		nil
}

func Test_GetGeneAutoCompleteHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/genes/autocomplete", GetGeneAutoCompleteHandler(repo))

	req, _ := http.NewRequest("GET", "/genes/autocomplete?prefix=F", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"source":{"id":"ENSG00000000938", "name":"FGR"}, "highlight":{"id":"ENSG00000000938", "name":"<strong>F</strong>GR"}}]`, w.Body.String())
}
