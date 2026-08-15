package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func testSomaticCNVList(t *testing.T, data string, seqId string, taskId string, body string, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.POST("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/list", server.OccurrencesSomaticCNVListHandler(repo))

		req, _ := http.NewRequest("POST", fmt.Sprintf("/radiant/occurrences/somatic/cnv/71/%s/%s/list", seqId, taskId), bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func testSomaticCNVCount(t *testing.T, data string, body string, expected int) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.POST("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/count", server.OccurrencesSomaticCNVCountHandler(repo))

		req, _ := http.NewRequest("POST", "/radiant/occurrences/somatic/cnv/71/74/85/count", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, fmt.Sprintf(`{"count":%d}`, expected), w.Body.String())
	})
}

func testSomaticCNVAggregation(t *testing.T, data string, body string, queryParams []string, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		facetsRepo := starrocks.NewFacetsRepository()
		router := tenantRouter()
		router.POST("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/aggregate", server.OccurrencesSomaticCNVAggregateHandler(repo, facetsRepo))
		path := "/radiant/occurrences/somatic/cnv/71/74/85/aggregate"
		if len(queryParams) > 0 {
			path += "?" + strings.Join(queryParams, "&")
		}
		req, _ := http.NewRequest("POST", path, bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func testSomaticCNVStatistics(t *testing.T, data string, body string, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.POST("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/statistics", server.OccurrencesSomaticCNVStatisticsHandler(repo))

		req, _ := http.NewRequest("POST", "/radiant/occurrences/somatic/cnv/71/74/85/statistics", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_Somatic_CNV_List(t *testing.T) {
	body := `{"sort":[{"field":"start","order":"asc"}]}`
	expected := `[
		{"seq_id":74,"task_id":85,"cnv_id":"1","chromosome":"1","start":10000,"end":10500,"type":"GAIN","length":500,"name":"SCNV1","nb_snv":0,"has_note":false},
		{"seq_id":74,"task_id":85,"cnv_id":"2","chromosome":"2","start":20000,"end":21500,"type":"CNLOH","length":1500,"name":"SCNV2","nb_snv":3,"has_note":false},
		{"seq_id":74,"task_id":85,"cnv_id":"3","chromosome":"X","start":30000,"end":30500,"type":"GAINLOH","length":500,"name":"SCNV3","nb_snv":1,"has_note":false}
	]`
	testSomaticCNVList(t, "simple", "74", "85", body, expected)
}

// The ASCN block is out of the default field set, so it only shows up when asked for.
func Test_Somatic_CNV_List_Returns_Ascn_Columns_When_Requested(t *testing.T) {
	body := `{
		"additional_fields":["cn","maf","mcn","ascn_as"],
		"sqon":{"op":"in","content":{"field":"name","value":["SCNV1"]}}
	}`
	expected := `[
		{"seq_id":74,"task_id":85,"cnv_id":"1","chromosome":"1","start":10000,"end":10500,"type":"GAIN","length":500,"name":"SCNV1","nb_snv":0,"cn":3,"maf":0.42,"mcn":1,"ascn_as":2,"has_note":false}
	]`
	testSomaticCNVList(t, "simple", "74", "85", body, expected)
}

// DRAGEN 3.10.8 emits no ASCN block: the columns must be absent from the payload, not zeroed.
func Test_Somatic_CNV_List_Omits_Ascn_Columns_When_Null(t *testing.T) {
	body := `{
		"additional_fields":["cn","maf","mcn","ascn_as"],
		"sqon":{"op":"in","content":{"field":"name","value":["SCNV3"]}}
	}`
	expected := `[
		{"seq_id":74,"task_id":85,"cnv_id":"3","chromosome":"X","start":30000,"end":30500,"type":"GAINLOH","length":500,"name":"SCNV3","nb_snv":1,"has_note":false}
	]`
	testSomaticCNVList(t, "simple", "74", "85", body, expected)
}

// seq_id carries the tumor sequencing id: asking for the normal sequencing 73 returns its own
// segment, never the tumoral one's.
func Test_Somatic_CNV_List_ScopesToSeqId(t *testing.T) {
	body := `{}`
	expected := `[
		{"seq_id":73,"task_id":85,"cnv_id":"5","chromosome":"4","start":50000,"end":50800,"type":"GAIN","length":800,"name":"SCNV5","nb_snv":0,"has_note":false}
	]`
	testSomaticCNVList(t, "simple", "73", "85", body, expected)
}

func Test_Somatic_CNV_Count(t *testing.T) {
	testSomaticCNVCount(t, "simple", `{}`, 3)
}

func Test_Somatic_CNV_Count_Return_Filtered_Count_When_Sqon_Specified(t *testing.T) {
	body := `{"sqon":{"op":"in","content":{"field":"type","value":["CNLOH","GAINLOH"]}}}`
	testSomaticCNVCount(t, "simple", body, 2)
}

func Test_Somatic_CNV_Aggregation_By_Type(t *testing.T) {
	body := `{"field":"type"}`
	expected := `[{"key":"CNLOH","count":1},{"key":"GAIN","count":1},{"key":"GAINLOH","count":1}]`
	testSomaticCNVAggregation(t, "simple", body, nil, expected)
}

// The facet dictionary already carries all four somatic type values, LOSS included.
func Test_Somatic_CNV_Aggregation_By_Type_With_Dictionary(t *testing.T) {
	body := `{"field":"type"}`
	expected := `[{"key":"CNLOH","count":1},{"key":"GAIN","count":1},{"key":"GAINLOH","count":1},{"key":"LOSS","count":0}]`
	testSomaticCNVAggregation(t, "simple", body, []string{"with_dictionary=true"}, expected)
}

func Test_Somatic_CNV_Statistics_Length(t *testing.T) {
	body := `{"field":"length"}`
	testSomaticCNVStatistics(t, "simple", body, `{"min":500,"max":1500,"type":"integer"}`)
}

// /statistics is the only way to get a range for an ASCN column: none of them are aggregable.
func Test_Somatic_CNV_Statistics_Maf(t *testing.T) {
	body := `{"field":"maf"}`
	testSomaticCNVStatistics(t, "simple", body, `{"min":0,"max":0.42,"type":"decimal"}`)
}

func Test_Somatic_CNV_GenesOverlap(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewSomaticCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/:cnv_id/genes_overlap", server.OccurrencesSomaticCNVGenesOverlapHandler(repo))

		req, _ := http.NewRequest("GET", "/radiant/occurrences/somatic/cnv/71/74/85/1/genes_overlap", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "TSPAN6")
	})
}
