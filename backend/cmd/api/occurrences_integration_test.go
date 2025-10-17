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

func testList(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGermlineSNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/snv/:seq_id/list", server.OccurrencesGermlineSNVListHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/list", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}
func testCount(t *testing.T, data string, body string, expected int) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGermlineSNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/snv/:seq_id/count", server.OccurrencesGermlineSNVCountHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/count", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, fmt.Sprintf(`{"count":%d}`, expected), w.Body.String())
	})
}
func testAggregation(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGermlineSNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/snv/:seq_id/aggregate", server.OccurrencesGermlineSNVAggregateHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/aggregate", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}
func testStatistics(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGermlineSNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/snv/:seq_id/statistics", server.OccurrencesGermlineSNVStatisticsHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/statistics", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_SNVOccurrences_List(t *testing.T) {
	testList(t, "simple", `{"additional_fields":["locus_id"]}`, `[{"aa_change":"p.Arg19His", "ad_ratio":1, "chromosome":"1", "clinvar":["Benign", "Pathogenic"], "exomiser_acmg_classification":"UNCERTAIN_SIGNIFICANCE", "exomiser_acmg_evidence":["PS1", "PVS2"], "exomiser_gene_combined_score":0.7, "exomiser_moi":"", "exomiser_variant_score":0, "genotype_quality":100, "gnomad_v3_af":0.001, "has_interpretation": true, "hgvsg":"hgvsg1", "locus":"locus1", "locus_id":"1000", "is_canonical":false, "is_mane_plus":false, "is_mane_select":true, "max_impact_score":4, "pf_wgs":0.99, "picked_consequences":["splice acceptor"], "seq_id":1, "task_id":1, "start":1111, "symbol":"BRAF", "variant_class":"class1", "vep_impact":"impact1", "zygosity":"HET"}]`)
}

func Test_SNVOccurrences_List_Return_Filtered_Occurrences_When_Sqon_Specified(t *testing.T) {
	body := `{
			"additional_fields":[
				"seq_id","locus_id","filter","zygosity","pf_wgs","pc_wgs","hgvsg","ad_ratio","variant_class"
			],
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		}
		}`
	expected := `[
			{
				"ad_ratio": 1,
				"chromosome": "1",
				"filter": "PASS",
				"exomiser_acmg_classification": "",
				"exomiser_acmg_evidence": null,
				"exomiser_gene_combined_score": 0,
				"exomiser_moi": "",
				"exomiser_variant_score": 0,
				"genotype_quality": 100,
				"gnomad_v3_af": 0.001,
				"has_interpretation": true,
				"hgvsg": "hgvsg1",
				"locus": "locus_1_1000",
				"locus_id": "1000",
				"max_impact_score": 4,
				"is_canonical": false,
				"is_mane_plus": false,
				"is_mane_select": true,
				"pc_wgs": 3,
				"pf_wgs": 0.99,
				"picked_consequences": null,
				"seq_id": 1,
				"task_id": 1,
				"start": 1111,
				"symbol": "symbol1",
				"variant_class": "class1",
				"vep_impact": "impact1",
				"zygosity": "HET"
			}
		]`
	testList(t, "multiple", body, expected)
}

func Test_SNVOccurrences_Count(t *testing.T) {
	testCount(t, "simple", "{}", 1)
}

func Test_SNVOccurrences_Count_Return_Expected_Count_When_Sqon_Specified(t *testing.T) {
	body := `{
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		    }
		}`
	testCount(t, "multiple", body, 1)
}

func Test_SNVOccurrence_Aggregation(t *testing.T) {
	body := `{
			"field": "zygosity",
			"sqon": {
				"op": "and",
				"content": [
					{
						"op":"in",
						"content":{
							"field": "filter",
							"value": ["PASS"]
						}
					},
					{
						"op": "in",
						"content":{
							"field": "zygosity",
							"value": ["HOM"]
						}
					}            
		
				]
			},
			"size": 10
		}`
	expected := `[{"key": "HOM", "count": 1}, {"key": "HET", "count": 2}]`
	testAggregation(t, "aggregation", body, expected)
}

func Test_SNVOccurrence_Statistics(t *testing.T) {
	body := `{
			"field": "pf_wgs",
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
	testStatistics(t, "pagination", body, expected)
}

func Test_SNVOccurrence_List_Filter_On_Consequence_Column(t *testing.T) {
	body := `{
			"additional_fields":[
				"seq_id","task_id","locus_id","filter","zygosity","pf_wgs","pc_wgs","hgvsg","ad_ratio","variant_class"
			],
			"sqon": {
				"op": "and",
				"content": [
					{
						"op": "in",
						"content": {
							"field": "impact_score",
							"value": ["3"]
						}
					}            
		
				]
			},
			"size": 10
		}`
	expected := `[
		{
			"ad_ratio": 1,
			"chromosome": "1",
			"filter": "PASS",
			"exomiser_acmg_classification": "",
			"exomiser_acmg_evidence": null,
			"exomiser_gene_combined_score": 0,
			"exomiser_moi": "",
			"exomiser_variant_score": 0,
			"genotype_quality": 100,
			"gnomad_v3_af": 0.001,
			"has_interpretation": true,
			"hgvsg": "hgvsg1",
			"locus": "locus_1_1000",
			"locus_id": "1000",
			"max_impact_score": 4,
			"is_canonical": false,
			"is_mane_plus": false,
			"is_mane_select": true,
			"pc_wgs": 3,
			"pf_wgs": 0.99,
			"picked_consequences": null,
			"seq_id": 1,
			"task_id": 1,
			"start": 1111,
			"symbol": "symbol1",
			"variant_class": "class1",
			"vep_impact": "impact1",
			"zygosity": "HET"
		}
	]`
	testList(t, "multiple", body, expected)
}

func Test_CNVOccurrence_List(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGermlineCNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/cnv/:seq_id/list", server.OccurrencesGermlineCNVListHandler(repo))

		body := `{}`
		req, _ := http.NewRequest("POST", "/occurrences/germline/cnv/1/list", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		expected := `[
			{"chromosome":"1", "cn":2, "end":10500, "length":500, "name":"CNV1", "seq_id":1, "cnv_id":1, "start":10000, "type":"DEL"},
			{"chromosome":"2", "cn":3, "end":20500, "length":500, "name":"CNV2", "seq_id":1, "cnv_id":2, "start":20000, "type":"DUP"}
		]`
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_CNVOccurrence_List_Filter_On_Chromosome(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGermlineCNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/cnv/:seq_id/list", server.OccurrencesGermlineCNVListHandler(repo))

		body := `
		{
			"sqon": {
				"op": "and",
				"content": [
					{
						"op": "in",
						"content": {
							"field": "chromosome",
							"value": ["2"]
						}
					}
				]
			}
		}`
		req, _ := http.NewRequest("POST", "/occurrences/germline/cnv/1/list", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		expected := `[
			{
				"chromosome":"2", 
				"cn":3, 
				"end":20500, 
				"length":500, 
				"name":"CNV2", 
				"seq_id":1, 
				"cnv_id":2, 
				"start":20000, 
				"type":"DUP"
			}
		]`
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_CNVOccurrence_Count(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGermlineCNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/cnv/:seq_id/count", server.OccurrencesGermlineCNVCountHandler(repo))

		body := `{}`
		req, _ := http.NewRequest("POST", "/occurrences/germline/cnv/1/count", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		expected := `{"count":2}`
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_CNVOccurrence_Count_Filter_On_Quality(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGermlineCNVOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/cnv/:seq_id/count", server.OccurrencesGermlineCNVCountHandler(repo))

		body := `{
			"sqon": {
				"op": "and",
				"content": [
					{
						"op": ">",
						"content": {
							"field": "quality",
							"value": [0.9]
						}
					}
				]
			}
		}`
		req, _ := http.NewRequest("POST", "/occurrences/germline/cnv/1/count", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		expected := `{"count":1}`
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func assertGetExpandedOccurrence(t *testing.T, data string, seqId int, locusId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGermlineSNVOccurrencesRepository(db)
		router := gin.Default()
		router.GET("/occurrences/germline/snv/:seq_id/:locus_id/expanded", server.GetExpandedGermlineSNVOccurrence(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/occurrences/germline/snv/%d/%d/expanded", seqId, locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetExpandedOccurrence(t *testing.T) {
	expected := `{"aa_change":"p.Arg19His", "case_id": 1, "cadd_phred":0.1, "cadd_score":0.1, "chromosome":"1", "clinvar":["Benign", "Pathogenic"], "exomiser_acmg_classification":"UNCERTAIN_SIGNIFICANCE", "exomiser_acmg_evidence":["PS1", "PVS2"], "exomiser_gene_combined_score":0.7, "fathmm_pred":"T", "fathmm_score":0.1, "filter":"PASS", "genotype_quality":100, "gnomad_loeuf":0.1, "gnomad_pli":0.1, "gnomad_v3_af":0.001, "hgvsg":"hgvsg1", "is_canonical":true, "is_mane_plus":false, "is_mane_select":true, "locus":"locus1", "locus_id":"1000", "is_mane_select":true, "omim_conditions":[{"inheritance_code":["AD"], "omim_phenotype_id":"613706", "panel":"Noonan syndrome 7"}, {"inheritance_code":["AD"], "omim_phenotype_id":"613707", "panel":"LEOPARD syndrome 3"}], "pc_wgs_affected":3, "pf_wgs":0.99, "pf_wgs_affected":1, "picked_consequences":["splice acceptor"], "pn_wgs_affected":3, "revel_score":0.1, "sift_pred":"T", "sift_score":0.1, "spliceai_ds":0.1, "spliceai_type":["AG"], "start":1111, "symbol":"BRAF", "vep_impact":"impact1", "zygosity":"HET"}`
	assertGetExpandedOccurrence(t, "simple", 1, 1000, expected)
}
