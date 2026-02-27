package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/utils"
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
				"document_id":127, 
				"format_code":"vcf", 
				"name":"FI0037864.S13228.vcf.gz", 
				"patient_id":6, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"size":3.06718965e+08, 
				"task_id":12
			}, {
				"case_id":2, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"alignment", 
				"document_id":3, 
				"format_code":"cram", 
				"name":"FI0037665.S13228.cram", 
				"patient_id":6, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"size":1.09940425359e+11, 
				"task_id":12
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
				"document_id":127, 
				"format_code":"vcf", 
				"hash": "5d41402abc4b2a76b9719d911017c718",
				"name":"FI0037864.S13228.vcf.gz", 
				"patient_id":6, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"seq_id": 5,
				"size":3.06718965e+08, 
				"task_id":12
			}, {
				"case_id":2, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"alignment", 
				"document_id":3, 
				"format_code":"cram", 
				"hash": "5d41402abc4b2a76b9719d911017c594",
				"name":"FI0037665.S13228.cram", 
				"patient_id":6, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13228", 
				"seq_id": 5,
				"size":1.09940425359e+11, 
				"task_id":12
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
				"case_id":1, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"snv", 
				"document_id":135, 
				"format_code":"vcf", 
				"name":"CEPH-1463.exomiser.vcf.gz",
				"patient_id":3, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"proband", 
				"submitter_sample_id":"S13224",
				"size":3.03866839e+08, 
				"task_id":6
			},
			{
				"case_id":1, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"snv", 
				"document_id":147, 
				"format_code":"vcf", 
				"name":"CEPH-1463.exomiser.vcf.gz", 
				"patient_id":1, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"submitter_sample_id":"S13225", 
				"size":3.03866839e+08, 
				"task_id":7
			}
		], 
		"count": 144}`
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

func assertGetDocumentsFilters(t *testing.T, data string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewDocumentsRepository(db)
		router := gin.Default()
		router.GET("/documents/filters", server.DocumentsFiltersHandler(repo))

		req, _ := http.NewRequest("GET", "/documents/filters", bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetDocumentsFilters(t *testing.T) {
	expected := `{
		"data_type_code":[
			{"key":"alignment", "label":"Aligned Reads"}, 
			{"key":"cnvvis", "label":"CNV Visualization"}, 
			{"key":"covgene", "label":"Coverage by Gene Report"}, 
			{"key":"exomiser", "label":"Exomiser Report"}, 
			{"key":"exp", "label":"Expression PNG"}, 
			{"key":"gcnv", "label":"Germline CNV"}, 
			{"key":"gsv", "label":"Germline SV"}, 
			{"key":"igv", "label":"IGV Track"}, 
			{"key":"qcrun", "label":"Sequencing Run QC Report"}, 
			{"key":"scnv", "label":"Somatic CNV"}, 
			{"key":"snv", "label":"Germline SNV"}, 
			{"key":"somfu", "label":"Somatic Fusion Dragen VCF"}, 
			{"key":"ssnv", "label":"Somatic SNV"}, 
			{"key":"ssup", "label":"Sequencing Data Supplement"}, 
			{"key":"ssv", "label":"Somatic SV"}
		], 
		"format_code":[
			{"key":"bed", "label":"BED File"}, 
			{"key":"bw", "label":"BW File"}, 
			{"key":"cram", "label":"CRAM File"}, 
			{"key":"csv", "label":"CSV File"}, 
			{"key":"gvcf", "label":"gVCF File"}, 
			{"key":"html", "label":"HTML File"}, 
			{"key":"json", "label":"JSON File"}, 
			{"key":"pdf", "label":"PDF File"}, 
			{"key":"png", "label":"PNG File"}, 
			{"key":"tgz", "label":"TGZ Archive File"}, 
			{"key":"tsv", "label":"TSV File"}, 
			{"key":"txt", "label":"Text File"},
			{"key":"vcf", "label":"VCF File"}
		], 
		"diagnosis_lab_code":[
			{"key":"LDM-CHOP", "label":"Molecular Diagnostic Laboratory, CHOP"}, 
			{"key":"LDM-CHUSJ", "label":"Laboratoire de diagnostic moléculaire, CHU Sainte-Justine"}
		], 
		"project_code":[
			{"key":"N1", "label":"NeuroDev Phase I"}, 
			{"key":"N2", "label":"NeuroDev Phase II"}
		], 
		"relationship_to_proband_code":[
			{"key":"brother", "label":"Brother"}, 
			{"key":"father", "label":"Father"}, 
			{"key":"mother", "label":"Mother"}, 
			{"key":"proband", "label":"Proband"}, 
			{"key":"sibling", "label":"Sibling"},
			{"key":"sister", "label":"Sister"}
		]}`
	assertGetDocumentsFilters(t, "simple", expected)
}

func Test_GetDocumentsDownloadUrl(t *testing.T) {
	testutils.ParallelTestWithAll(t, "simple", func(t *testing.T, client *minio.Client, endpoint string, postgres *gorm.DB, starrocks *gorm.DB) {
		_ = os.Setenv("AWS_REGION", "us-east-1")
		_ = os.Setenv("AWS_ENDPOINT_URL", client.EndpointURL().String())
		_ = os.Setenv("AWS_ACCESS_KEY_ID", "access")
		_ = os.Setenv("AWS_SECRET_ACCESS_KEY", "secret")
		_ = os.Setenv("AWS_USE_SSL", "false")

		repo := repository.NewDocumentsRepository(starrocks)
		router := gin.Default()
		router.GET("/documents/:document_id/download_url", server.GetDocumentsDownloadUrlHandler(repo, nil))

		req, _ := http.NewRequest("GET", "/documents/1/download_url", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusOK, w.Code)

		var actual utils.PreSignedURL
		if err := json.Unmarshal(w.Body.Bytes(), &actual); err != nil {
			assert.NoError(t, err)
		}
		assert.NotEmpty(t, actual.URL)
		assert.Greater(t, actual.URLExpireAt, int64(0))

		expectedURLPrefix := fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/", endpoint)
		assert.True(t, strings.HasPrefix(actual.URL, expectedURLPrefix))
	})
}
