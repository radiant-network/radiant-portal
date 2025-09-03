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

func (m *MockRepository) SearchDocuments(userQuery types.ListQuery) (*[]types.DocumentResult, *int64, error) {
	var count = int64(1)
	return &[]types.DocumentResult{
		{
			DocumentID:                204,
			Name:                      "FI0037905.S14786.vcf.gz.tbi",
			FormatCode:                "tbi",
			DataTypeCode:              "snv",
			Size:                      2432696,
			CaseID:                    21,
			PerformerLabCode:          "CQGC",
			PerformerLabName:          "Quebec Clinical Genomic Center",
			RelationshipToProbandCode: "proband",
			PatientID:                 60,
			SubmitterSampleID:         "S14857",
			TaskID:                    21,
			SeqID:                     59,
			Hash:                      "5d41402abc4b2a76b9719d911017c795",
			RunAlias:                  "A00516_0227",
		},
	}, &count, nil
}

func (m *MockRepository) GetDocumentsFilters(query types.AggQuery) (*types.DocumentFilters, error) {
	var result = types.DocumentFilters{
		Project: []types.Aggregation{
			{Bucket: "N1", Label: "NeuroDev Phase I"},
			{Bucket: "N2", Label: "NeuroDev Phase II"},
		},
		PerformerLab: []types.Aggregation{
			{Bucket: "CHOP", Label: "Children Hospital of Philadelphia"},
			{Bucket: "CHUSJ", Label: "Centre hospitalier universitaire Sainte-Justine"},
		},
		RelationshipToProband: []types.Aggregation{
			{Bucket: "proband", Label: "Proband"},
			{Bucket: "father", Label: "Father"},
			{Bucket: "mother", Label: "Mother"},
		},
		Format: []types.Aggregation{
			{Bucket: "cram", Label: "CRAM File"},
			{Bucket: "crai", Label: "CRAI Index File"},
			{Bucket: "vcf", Label: "VCF File"},
		},
		DataType: []types.Aggregation{
			{Bucket: "alignment", Label: "Aligned Reads"},
			{Bucket: "snv", Label: "Germline SNV"},
			{Bucket: "ssnv", Label: "Somatic SNV"},
		},
	}
	return &result, nil
}

func Test_SearchDocumentsHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/documents/search", SearchDocumentsHandler(repo))
	body := `{
			"additional_fields":[]
	}`
	req, _ := http.NewRequest("POST", "/documents/search", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"list": [{
			"case_id":21, 
			"data_type_code":"snv", 
			"document_id":204, 
			"format_code":"tbi", 
			"hash":"5d41402abc4b2a76b9719d911017c795", 
			"name":"FI0037905.S14786.vcf.gz.tbi", 
			"patient_id":60, 
			"performer_lab_code":"CQGC", 
			"performer_lab_name":"Quebec Clinical Genomic Center", 
			"relationship_to_proband_code":"proband", 
			"run_alias":"A00516_0227", 
			"submitter_sample_id":"S14857", 
			"seq_id":59, 
			"size":2432696, 
			"task_id":21
		}],
		"count": 1
	}`, w.Body.String())
}

func Test_DocumentsAutocompleteHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/documents/autocomplete", DocumentsAutocompleteHandler(repo))

	req, _ := http.NewRequest("GET", "/documents/autocomplete?prefix=1&limit=5", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[
		{"type":"case_id", "value":"1"},
		{"type":"patient_id", "value":"10"},
		{"type":"case_id", "value":"10"}
	]`, w.Body.String())
}

func Test_DocumentsFiltersHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/documents/filters", DocumentsFiltersHandler(repo))

	req, _ := http.NewRequest("POST", "/documents/filters", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"data_type":[
			{"count":0, "key":"alignment", "label":"Aligned Reads"}, 
			{"count":0, "key":"snv", "label":"Germline SNV"}, 
			{"count":0, "key":"ssnv", "label":"Somatic SNV"}
		], 
		"format":[
			{"count":0, "key":"cram", "label":"CRAM File"}, 
			{"count":0, "key":"crai", "label":"CRAI Index File"}, 
			{"count":0, "key":"vcf", "label":"VCF File"}
		], 
		"performer_lab":[
			{"count":0, "key":"CHOP", "label":"Children Hospital of Philadelphia"}, 
			{"count":0, "key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"}
		], 
		"project":[
			{"count":0, "key":"N1", "label":"NeuroDev Phase I"}, 
			{"count":0, "key":"N2", "label":"NeuroDev Phase II"}
		], 
		"relationship_to_proband":[
			{"count":0, "key":"proband", "label":"Proband"}, 
			{"count":0, "key":"father", "label":"Father"}, 
			{"count":0, "key":"mother", "label":"Mother"}
		]}`, w.Body.String())
}
