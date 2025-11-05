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

func assertDocumentsSearchHandler(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewDocumentsRepository(db)
		router := gin.Default()
		router.POST("/documents/search", server.SearchDocumentsHandler(repo))

		req, _ := http.NewRequest("POST", "/documents/search", bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_SearchDocumentsHandler_WithCriteria(t *testing.T) {
	expected := `{
		"list": [
			{
				"case_id":2, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"snv", 
				"document_id":185, 
				"format_code":"vcf", 
				"name":"FI0037896.S14858.vcf.gz", 
				"patient_id":6, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"size":3.04716185e+08, 
				"task_id":2
			}, {
				"case_id":2, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"alignment", 
				"document_id":63, 
				"format_code":"cram", 
				"name":"FI0037766.S14747.cram", 
				"patient_id":6, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"size":6.7881958113e+10, 
				"task_id":2
			}
		], 
		"count": 2}`
	body := `{
			"additional_fields":[],
			"search_criteria":[{"field": "run_name", "value": ["1621"]}]
		}`
	assertDocumentsSearchHandler(t, "simple", body, expected)
}

func Test_SearchDocumentsHandler_WithAdditionalFields(t *testing.T) {
	expected := `{
		"list": [
			{
				"case_id":2, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"snv", 
				"document_id":185, 
				"format_code":"vcf", 
				"hash": "5d41402abc4b2a76b9719d911017c776",
				"name":"FI0037896.S14858.vcf.gz", 
				"patient_id":6, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"seq_id": 5,
				"size":3.04716185e+08, 
				"task_id":2
			}, {
				"case_id":2, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"alignment", 
				"document_id":63, 
				"format_code":"cram", 
				"hash": "5d41402abc4b2a76b9719d911017c654",
				"name":"FI0037766.S14747.cram", 
				"patient_id":6, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"seq_id": 5,
				"size":6.7881958113e+10, 
				"task_id":2
			}
		], 
		"count": 2}`
	body := `{
			"additional_fields":["hash", "seq_id"],
			"search_criteria":[{"field": "run_name", "value": ["1621"]}]
		}`
	assertDocumentsSearchHandler(t, "simple", body, expected)
}

func Test_SearchDocumentsHandler_WithSortAndLimit(t *testing.T) {
	expected := `{
		"list": [
			{
				"case_id":13, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"snv", 
				"document_id":135, 
				"format_code":"vcf", 
				"name":"CEPH-1463.exomiser.vcf.gz",
				"patient_id":37, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"proband", 
				"submitter_sample_id":"S14711",
				"size":3.03866839e+08, 
				"task_id":13
			},
			{
				"case_id":13, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"snv", 
				"document_id":135, 
				"format_code":"vcf", 
				"name":"CEPH-1463.exomiser.vcf.gz", 
				"patient_id":36, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S14712", 
				"size":3.03866839e+08, 
				"task_id":13
			}
		], 
		"count": 125}`
	body := `{
			"additional_fields":[],
			"sort":[{"field": "name", "order": "asc"}, {"field": "relationship_to_proband_code", "order": "desc"}],
			"limit": 2
		}`
	assertDocumentsSearchHandler(t, "simple", body, expected)
}

func assertDocumentIdsAutoComplete(t *testing.T, data string, prefix string, limit int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewDocumentsRepository(db)
		router := gin.Default()
		router.GET("/documents/autocomplete", server.DocumentsAutocompleteHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/documents/autocomplete?prefix=%s&limit=%d", prefix, limit), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_DocumentIdsAutoComplete(t *testing.T) {
	expected := `[{"type":"case_id", "value":"1"}, {"type":"document_id", "value":"1"}, {"type":"patient_id", "value":"1"}, {"type":"sample_id", "value":"1"}, {"type":"seq_id", "value":"1"}]`
	assertDocumentIdsAutoComplete(t, "simple", "1", 5, expected)
}

func assertGetDocumentsFilters(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewDocumentsRepository(db)
		router := gin.Default()
		router.POST("/documents/filters", server.DocumentsFiltersHandler(repo))

		req, _ := http.NewRequest("POST", "/documents/filters", bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetDocumentsFilters(t *testing.T) {
	body := `{
			"search_criteria":[{"field": "format_code", "value": ["vcf"]}]
		}`
	expected := `{
		"data_type":[
			{"count":21, "key":"snv", "label":"Germline SNV"}, 
			{"count":0, "key":"alignment", "label":"Aligned Reads"}, 
			{"count":0, "key":"cnvvis", "label":"CNV Visualization"}, 
			{"count":0, "key":"covgene", "label":"Coverage by Gene Report"}, 
			{"count":0, "key":"exomiser", "label":"Exomiser Report"}, 
			{"count":0, "key":"exp", "label":"Expression PNG"}, 
			{"count":0, "key":"gcnv", "label":"Germline CNV"}, 
			{"count":0, "key":"gsv", "label":"Germline SV"}, 
			{"count":0, "key":"igv", "label":"IGV Track"}, 
			{"count":0, "key":"qcrun", "label":"Sequencing Run QC Report"}, 
			{"count":0, "key":"scnv", "label":"Somatic CNV"}, 
			{"count":0, "key":"somfu", "label":"Somatic Fusion Dragen VCF"}, 
			{"count":0, "key":"ssnv", "label":"Somatic SNV"}, 
			{"count":0, "key":"ssup", "label":"Sequencing Data Supplement"}, 
			{"count":0, "key":"ssv", "label":"Somatic SV"}
		], 
		"format":[
			{"count":21, "key":"vcf", "label":"VCF File"}, 
			{"count":0, "key":"bed", "label":"BED File"}, 
			{"count":0, "key":"bw", "label":"BW File"}, 
			{"count":0, "key":"cram", "label":"CRAM File"}, 
			{"count":0, "key":"csv", "label":"CSV File"}, 
			{"count":0, "key":"gvcf", "label":"gVCF File"}, 
			{"count":0, "key":"html", "label":"HTML File"}, 
			{"count":0, "key":"json", "label":"JSON File"}, 
			{"count":0, "key":"pdf", "label":"PDF File"}, 
			{"count":0, "key":"png", "label":"PNG File"}, 
			{"count":0, "key":"tgz", "label":"TGZ Archive File"}, 
			{"count":0, "key":"tsv", "label":"TSV File"}, 
			{"count":0, "key":"txt", "label":"Text File"}
		], 
		"diagnosis_lab":[
			{"count":0, "key":"LDM-CHOP", "label":"Molecular Diagnostic Laboratory, CHOP"}, 
			{"count":0, "key":"LDM-CHUSJ", "label":"Laboratoire de diagnostic moléculaire, CHU Sainte-Justine"}
		], 
		"project":[
			{"count":12, "key":"N2", "label":"NeuroDev Phase II"}, 
			{"count":9, "key":"N1", "label":"NeuroDev Phase I"}
		], 
		"relationship_to_proband":[
			{"count":21, "key":"proband", "label":"Proband"}, 
			{"count":20, "key":"father", "label":"Father"}, 
			{"count":20, "key":"mother", "label":"Mother"}, 
			{"count":0, "key":"brother", "label":"Brother"}, 
			{"count":0, "key":"sibling", "label":"Sibling"},
			{"count":0, "key":"sister", "label":"Sister"}
		]}`
	assertGetDocumentsFilters(t, "simple", body, expected)
}
