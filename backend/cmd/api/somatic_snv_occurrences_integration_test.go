package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func testSomaticSNVList(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSomaticSNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/somatic/snv/:case_id/:seq_id/list", server.OccurrencesSomaticSNVListHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/somatic/snv/71/74/list", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}
func testSomaticSNVCount(t *testing.T, data string, body string, expected int) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSomaticSNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/somatic/snv/:case_id/:seq_id/count", server.OccurrencesSomaticSNVCountHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/somatic/snv/71/74/count", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, fmt.Sprintf(`{"count":%d}`, expected), w.Body.String())
	})
}
func testSomaticSNVAggregation(t *testing.T, data string, body string, queryParams []string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSomaticSNVOccurrencesRepository(db)
		facetsRepo := repository.NewFacetsRepository()
		router := gin.Default()
		router.POST("/occurrences/somatic/snv/:case_id/:seq_id/aggregate", server.OccurrencesSomaticSNVAggregateHandler(repo, facetsRepo))
		path := "/occurrences/somatic/snv/71/74/aggregate"
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
func testSomaticSNVStatistics(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSomaticSNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/somatic/snv/:case_id/:seq_id/statistics", server.OccurrencesSomaticSNVStatisticsHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/somatic/snv/71/74/statistics", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_Somatic_SNV_List(t *testing.T) {
	testSomaticSNVList(t, "simple", `{"additional_fields":["locus_id"]}`, `[{"aa_change":"p.Arg19His", "clinvar":["Benign", "Pathogenic"], "germline_pc_wgs":3, "germline_pf_wgs":0.99, "gnomad_v3_af":0.001, "has_interpretation":false, "has_note": true, "hgvsg":"hgvsg1", "hotspot":true, "is_canonical":true, "is_mane_plus":null, "is_mane_select":true, "locus_id":"1000", "omim_inheritance_code":["code1"], "picked_consequences":["splice acceptor"], "rsnumber":"rs111111111", "seq_id":74, "somatic_pc_tn_wgs":6, "somatic_pf_tn_wgs":0.55, "symbol":"BRAF", "task_id":74, "variant_class":"class1", "vep_impact":"MODIFIER"}]`)
}

func Test_Somatic_SNV_List_Return_Filtered_Occurrences_When_Sqon_Specified(t *testing.T) {
	body := `{
			"additional_fields":[
				"ad_ratio"
			],
			"sqon":{
				"op":"in",
				"content":{
					"field": "vep_impact",
					"value": ["MODIFIER"]
				}
		}
		}`
	expected := `[
			{
				"aa_change":"", 
				"ad_ratio":0.66, 
				"clinvar":null, 
				"germline_pc_wgs":3, 
				"germline_pf_wgs":0.99, 
				"gnomad_v3_af":0.001, 
				"has_interpretation":false, 
				"has_note":true, 
				"hgvsg":"hgvsg1", 
				"hotspot": true, 
				"is_canonical":true, 
				"is_mane_plus": null, 
				"is_mane_select":true, 
				"locus_id":"1000", 
				"omim_inheritance_code":["code1"], 
				"picked_consequences": null, 
				"rsnumber":"", 
				"seq_id":74, 
				"somatic_pc_tn_wgs":null, 
				"somatic_pf_tn_wgs":null, 
				"symbol":"BRAF", 
				"task_id":74, 
				"variant_class":"class1", 
				"vep_impact":"MODIFIER"
			}
		]`
	testSomaticSNVList(t, "multiple", body, expected)
}

func Test_Somatic_SNV_Count(t *testing.T) {
	testSomaticSNVCount(t, "simple", "{}", 1)
}

func Test_Somatic_SNV_Count_Return_Expected_Count_When_Sqon_Specified(t *testing.T) {
	body := `{
			"sqon":{
				"op":"in",
				"content":{
					"field": "vep_impact",
					"value": ["MODIFIER"]
				}
		    }
		}`
	testSomaticSNVCount(t, "multiple", body, 1)
}

func Test_Somatic_SNV_Aggregation(t *testing.T) {
	body := `{
			"field": "vep_impact",
			"sqon": {
				"op": "and",
				"content": [
					{
						"op": "in",
						"content":{
							"field": "vep_impact",
							"value": ["LOW"]
						}
					}            
		
				]
			},
			"size": 10
		}`
	expected := `[{"key": "LOW", "count": 1}, {"key": "MODIFIER", "count": 1}]`
	testSomaticSNVAggregation(t, "aggregation", body, []string{}, expected)
}

func Test_Somatic_SNV_Aggregation_With_Dictionary(t *testing.T) {
	body := `{
			"field": "variant_class",
			"sqon": {
				"op": "and",
				"content": []
			},
			"size": 10
		}`
	expected := `[{"key": "class1", "count": 2}, {"key": "insertion", "count": 0}, {"key": "deletion", "count": 0}, {"key": "SNV", "count": 0}, {"key": "indel", "count": 0}, {"key": "substitution", "count": 0}, {"key": "sequence_alteration", "count": 0}]`
	testSomaticSNVAggregation(t, "aggregation", body, []string{"with_dictionary=true"}, expected)
}

func Test_Somatic_SNV_Statistics(t *testing.T) {
	body := `{
			"field": "germline_pf_wgs",
			"sqon": {
				"op": "and",
				"content": [
					{
						"op":"in",
						"content":{
							"field": "filter",
							"value": ["PASS"]
						}
					}        
				]
			}
		}`
	expected := `{"min": 0.01, "max": 0.29, "type": "decimal"}`
	testSomaticSNVStatistics(t, "pagination", body, expected)
}
