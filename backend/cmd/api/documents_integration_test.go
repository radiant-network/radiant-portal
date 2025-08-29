package main

import (
	"bytes"
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
				"data_type_code":"snv", 
				"document_id":185, 
				"format_code":"vcf", 
				"name":"FI0037896.S14858.vcf.gz", 
				"patient_id":6, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"size":3.04716185e+08, 
				"task_id":2
			}, {
				"case_id":2, 
				"data_type_code":"snv", 
				"document_id":124, 
				"format_code":"tbi", 
				"name":"FI0037862.S14747.vcf.gz.tbi", 
				"patient_id":6, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"size":2.411724e+06, 
				"task_id":2
			}, {
				"case_id":2, 
				"data_type_code":"alignment", 
				"document_id":63, 
				"format_code":"cram", 
				"name":"FI0037766.S14747.cram", 
				"patient_id":6, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"size":6.7881958113e+10, 
				"task_id":2
			}, {
				"case_id":2, 
				"data_type_code":"alignment", 
				"document_id":2, 
				"format_code":"crai", 
				"name":"FI0037662.S13230.cram.crai", 
				"patient_id":6, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"size":2.453667e+06, 
				"task_id":2
			}
		], 
		"count": 4}`
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
				"data_type_code":"snv", 
				"document_id":185, 
				"format_code":"vcf", 
				"hash": "5d41402abc4b2a76b9719d911017c776",
				"name":"FI0037896.S14858.vcf.gz", 
				"patient_id":6, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"seq_id": 5,
				"size":3.04716185e+08, 
				"task_id":2
			}, {
				"case_id":2, 
				"data_type_code":"snv", 
				"document_id":124, 
				"format_code":"tbi", 
				"hash": "5d41402abc4b2a76b9719d911017c715",
				"name":"FI0037862.S14747.vcf.gz.tbi", 
				"patient_id":6, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228",
				"seq_id": 5,
				"size":2.411724e+06, 
				"task_id":2
			}, {
				"case_id":2, 
				"data_type_code":"alignment", 
				"document_id":63, 
				"format_code":"cram", 
				"hash": "5d41402abc4b2a76b9719d911017c654",
				"name":"FI0037766.S14747.cram", 
				"patient_id":6, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"seq_id": 5,
				"size":6.7881958113e+10, 
				"task_id":2
			}, {
				"case_id":2, 
				"data_type_code":"alignment", 
				"document_id":2, 
				"format_code":"crai", 
				"hash": "5d41402abc4b2a76b9719d911017c593",
				"name":"FI0037662.S13230.cram.crai", 
				"patient_id":6, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"seq_id": 5,
				"size":2.453667e+06, 
				"task_id":2
			}
		], 
		"count": 4}`
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
				"case_id":1, 
				"data_type_code":"alignment", 
				"document_id":62, 
				"format_code":"crai", 
				"name":"NA12892.recal.crai", 
				"patient_id":1, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13225", 
				"size":2.474639e+06, 
				"task_id":1
			}, {
				"case_id":1, 
				"data_type_code":"alignment", 
				"document_id":62, 
				"format_code":"crai", 
				"name":"NA12892.recal.crai",
				"patient_id":2, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"father", 
				"submitter_sample_id":"S13226",
				"size":2.474639e+06, 
				"task_id":1
			}
		], 
		"count": 244}`
	body := `{
			"additional_fields":[],
			"sort":[{"field": "name", "order": "desc"}, {"field": "relationship_to_proband_code", "order": "desc"}],
			"limit": 2
		}`
	assertDocumentsSearchHandler(t, "simple", body, expected)
}
