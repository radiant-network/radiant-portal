package server

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) GetGeneAutoComplete(context.Context, string, int) (*[]types.AutoCompleteGene, error) {
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

func (m *MockRepository) SearchGenes(context.Context, []string) (*[]types.GeneResult, error) {
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
	router.GET("/:tenant/genes/autocomplete", GetGeneAutoCompleteHandler(repo))

	req, _ := http.NewRequest("GET", "/radiant/genes/autocomplete?prefix=F", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"source":{"id":"ENSG00000000938", "name":"FGR"}, "highlight":{"id":"ENSG00000000938", "name":"<strong>F</strong>GR"}}]`, w.Body.String())
}

func Test_SearchGenesHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/:tenant/genes/search", SearchGenesHandler(repo))

	body := `{"inputs": ["ENSG00000000003", "TNMD", "ensg00000157764", "ensa", "ENSG000000011671111", "BAD_SYMBOL"]}`
	expected := `[
		{"ensembl_gene_id": "ENSG00000157764", "symbol": "BRAF"},
		{"ensembl_gene_id": "ENSG00000143420", "symbol": "ENSA"},
		{"ensembl_gene_id": "ENSG00000000005", "symbol": "TNMD"},
		{"ensembl_gene_id": "ENSG00000000003", "symbol": "TSPAN6"}
	]`
	req, _ := http.NewRequest("POST", "/radiant/genes/search", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func getGeneTrack(query string) *httptest.ResponseRecorder {
	return getGeneTrackFrom(newGeneTrackRepository(), query)
}

func newGeneTrackRepository() *MockGeneTrackRepository {
	return &MockGeneTrackRepository{genes: []types.GeneTrackGene{
		{GeneID: "ENSG00000012048", Symbol: "BRCA1", Chromosome: "17", Start: 43044295, End: 43125483, Strand: "-", Biotype: "protein_coding",
			Exons: []types.GeneTrackExon{{Start: 43044295, End: 43045802}}},
	}}
}

func getGeneTrackFrom(repo *MockGeneTrackRepository, query string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.GET("/:tenant/genes/track", GetGeneTrackHandler(repo))
	req, _ := http.NewRequest("GET", "/radiant/genes/track?"+query, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_GetGeneTrackHandler_OK(t *testing.T) {
	w := getGeneTrack("chromosome=17&start=43000000&end=43200000")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"gene_id":"ENSG00000012048","symbol":"BRCA1","chromosome":"17","start":43044295,"end":43125483,"strand":"-","biotype":"protein_coding","exons":[{"start":43044295,"end":43045802}]}]`, w.Body.String())
}

func Test_GetGeneTrackHandler_MissingChromosome(t *testing.T) {
	w := getGeneTrack("start=0&end=10")

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"chromosome is required"}`, w.Body.String())
}

func Test_GetGeneTrackHandler_InvalidStart(t *testing.T) {
	w := getGeneTrack("chromosome=17&start=x&end=10")

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_GetGeneTrackHandler_InvalidEnd(t *testing.T) {
	w := getGeneTrack("chromosome=17&start=0")

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_GetGeneTrackHandler_EndBeforeStart(t *testing.T) {
	w := getGeneTrack("chromosome=17&start=10&end=5")

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_GetGeneTrackHandler_RegionTooWide(t *testing.T) {
	w := getGeneTrack("chromosome=17&start=0&end=20000001")

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"region must satisfy 0 <= start <= end and span at most 20000000 bases"}`, w.Body.String())
}

func Test_GetGeneTrackHandler_BySymbol(t *testing.T) {
	repo := newGeneTrackRepository()
	w := getGeneTrackFrom(repo, "symbol=brca1")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "brca1", repo.symbol)
	assert.Contains(t, w.Body.String(), `"symbol":"BRCA1"`)
}
