package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func assertGeneAutoComplete(t *testing.T, data string, prefix string, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/genes/autocomplete", server.GetGeneAutoCompleteHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/radiant/genes/autocomplete?prefix=%s", prefix), bytes.NewBuffer([]byte("{}")))
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

func assertSearchGenes(t *testing.T, data string, body string, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.POST("/:tenant/genes/search", server.SearchGenesHandler(repo))

		req, _ := http.NewRequest("POST", "/radiant/genes/search", bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_SearchGenes(t *testing.T) {
	body := `{"inputs": ["ENSG00000000003", "TNMD", "ensg00000157764", "ensa", "ENSG000000011671111", "BAD_SYMBOL"]}`
	expected := `[
		{"ensembl_gene_id": "ENSG00000157764", "symbol": "BRAF"},
		{"ensembl_gene_id": "ENSG00000143420", "symbol": "ENSA"},
		{"ensembl_gene_id": "ENSG00000000005", "symbol": "TNMD"},
		{"ensembl_gene_id": "ENSG00000000003", "symbol": "TSPAN6"}
	]`
	assertSearchGenes(t, "simple", body, expected)
}

func Test_GetGeneTrackHandler(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/genes/track", server.GetGeneTrackHandler(repo))

		req, _ := http.NewRequest("GET", "/radiant/genes/track?chromosome=1&start=10120&end=10130", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `[
			{"gene_id":"ENSG00000000003","symbol":"TSPAN6","chromosome":"1","start":10000,"end":10200,"strand":"-","biotype":"protein_coding","description":"tetraspanin 6","exons":[{"start":10000,"end":10100}],"omim_conditions":[{"omim_phenotype_id":"100000","panel":"Tetraspanin disease"}]},
			{"gene_id":"ENSG00000000005","symbol":"TNMD","chromosome":"1","start":10000,"end":20000,"strand":"+","biotype":"protein_coding","description":"tenomodulin","exons":[{"start":10000,"end":10100},{"start":10150,"end":10250},{"start":10650,"end":10750}],"omim_inheritance_code":["AR","XLR"],"omim_conditions":[{"omim_phenotype_id":"100001","panel":"Tenomodulin disease A","inheritance_code":["AR"]},{"omim_phenotype_id":"100002","panel":"Tenomodulin disease B","inheritance_code":["AR","XLR"]}],"gnomad_pli":0.95,"gnomad_loeuf":0.42}
		]`, w.Body.String())
	})
}
