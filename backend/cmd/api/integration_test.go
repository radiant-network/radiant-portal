package main

import (
	"bytes"
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/repository"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/server"
	"github.com/Ferlab-Ste-Justine/radiant-api/test/testutils"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func testList(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.New(db)
		router := gin.Default()
		router.POST("/occurrences/:seq_id/list", server.OccurrencesListHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/1/list", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}
func testCount(t *testing.T, data string, body string, expected int) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.New(db)
		router := gin.Default()
		router.POST("/occurrences/:seq_id/count", server.OccurrencesCountHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/1/count", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, fmt.Sprintf(`{"count":%d}`, expected), w.Body.String())
	})
}
func testAggregation(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.New(db)
		router := gin.Default()
		router.POST("/occurrences/:seq_id/aggregate", server.OccurrencesAggregateHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/1/aggregate", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_OccurrencesList(t *testing.T) {
	testList(t, "simple", "{}", `[{"locus_id":1000}]`)
}

func Test_OccurrencesList_Return_Filtered_Occurrences_When_Sqon_Specified(t *testing.T) {
	body := `{
			"selected_fields":[
				"seq_id","locus_id","filter","zygosity","pf","af","hgvsg","ad_ratio","variant_class"
			],
			"sqon":{
				"op":"in",
				"field": "filter",
				"value": "PASS"
		}
		}`
	expected := `[{"ad_ratio":1, "af":0.01, "filter":"PASS", "hgvsg":"hgvsg1", "locus_id":1000, "pf":0.99, "seq_id":1, "variant_class":"class1", "zygosity":"HET"}]`
	testList(t, "multiple", body, expected)

}

func Test_OccurrencesCount(t *testing.T) {
	testCount(t, "simple", "{}", 1)

}
func Test_OccurrencesCount_Return_Expected_Count_When_Sqon_Specified(t *testing.T) {
	body := `{
			"selected_fields":[
				"seq_id","locus_id","filter","zygosity","pf","af","hgvsg","ad_ratio","variant_class"
			],
			"sqon":{
				"op":"in",
				"field": "filter",
				"value": "PASS"
		    }
		}`
	testCount(t, "multiple", body, 1)
}

func Test_Aggregation(t *testing.T) {
	body := `{
			"field": "zygosity",
			"sqon": {
				"op": "and",
				"content": [
					{
						"op":"in",
						"field": "filter",
						"value": "PASS"
					},
					{
						"op": "in",
						"field": "zygosity",
						"value": "HOM"
					}            
		
				]
			},
			"size": 10
		}`
	expected := `[{"key": "HOM", "count": 1}, {"key": "HET", "count": 2}]`
	testAggregation(t, "aggregation", body, expected)
}

func Test_Filter_On_Consequence_Column(t *testing.T) {
	body := `{
			"selected_fields":[
				"seq_id","locus_id","filter","zygosity","pf","af","hgvsg","ad_ratio","variant_class"
			],
			"sqon": {
				"op": "and",
				"content": [
					{
						"op": "in",
						"field": "impact_score",
						"value": "3"
					}            
		
				]
			},
			"size": 10
		}`
	expected := `[{"ad_ratio":1, "af":0.01, "filter":"PASS", "hgvsg":"hgvsg1", "locus_id":1000, "pf":0.99, "seq_id":1, "variant_class":"class1", "zygosity":"HET"}]`
	testList(t, "multiple", body, expected)
}

func TestMain(m *testing.M) {
	testutils.SetupContainer()
	code := m.Run()
	testutils.StopContainer()
	os.Exit(code)
}
