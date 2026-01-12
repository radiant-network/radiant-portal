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

func (m *MockRepository) SearchGenes([]string) (*[]types.GeneResult, error) {
	return &[]types.GeneResult{
		{Name: "BRAF", GeneID: "ENSG00000157764"},
		{Name: "ENSA", GeneID: "ENSG00000143420"},
		{Name: "TNMD", GeneID: "ENSG00000000005"},
		{Name: "TSPAN6", GeneID: "ENSG00000000003"},
	}, nil
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

func Test_SearchGenesHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/genes/search", SearchGenesHandler(repo))

	body := `{"inputs": ["ENSG00000000003", "TNMD", "ensg00000157764", "ensa", "ENSG000000011671111", "BAD_SYMBOL"]}`
	expected := `[
		{"ensembl_gene_id": "ENSG00000157764", "symbol": "BRAF"},
		{"ensembl_gene_id": "ENSG00000143420", "symbol": "ENSA"},
		{"ensembl_gene_id": "ENSG00000000005", "symbol": "TNMD"},
		{"ensembl_gene_id": "ENSG00000000003", "symbol": "TSPAN6"}
	]`
	req, _ := http.NewRequest("POST", "/genes/search", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}
