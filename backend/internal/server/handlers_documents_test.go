package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) SearchDocuments(userQuery types.ListQuery) (*[]types.DocumentResult, *int64, error) {
	var count = int64(1)
	return &[]types.DocumentResult{
		{
			DocumentID:                203,
			Name:                      "FI0037905.S14786.vcf.gz",
			FormatCode:                "vcf",
			DataTypeCode:              "snv",
			Size:                      325362647,
			CaseID:                    20,
			DiagnosisLabCode:          "CQGC",
			DiagnosisLabName:          "Quebec Clinical Genomic Center",
			RelationshipToProbandCode: "proband",
			PatientID:                 58,
			SubmitterSampleID:         "S14786",
			TaskID:                    20,
			SeqID:                     56,
			Hash:                      "5d41402abc4b2a76b9719d911017c794",
			RunAlias:                  "A00516_0224",
			CreatedOn: time.Date(
				2000, 1, 1, 0, 0, 0, 0, time.UTC),
		},
	}, &count, nil
}

func (m *MockRepository) GetDocumentsFilters(withLabAndProject bool) (*types.DocumentFilters, error) {
	var result = types.DocumentFilters{
		Project: []types.FiltersValue{
			{Key: "N1", Label: "NeuroDev Phase I"},
			{Key: "N2", Label: "NeuroDev Phase II"},
		},
		DiagnosisLab: []types.FiltersValue{
			{Key: "CHOP", Label: "Children Hospital of Philadelphia"},
			{Key: "CHUSJ", Label: "Centre hospitalier universitaire Sainte-Justine"},
		},
		RelationshipToProband: []types.FiltersValue{
			{Key: "proband", Label: "Proband"},
			{Key: "father", Label: "Father"},
			{Key: "mother", Label: "Mother"},
		},
		Format: []types.FiltersValue{
			{Key: "cram", Label: "CRAM File"},
			{Key: "vcf", Label: "VCF File"},
		},
		DataType: []types.FiltersValue{
			{Key: "alignment", Label: "Aligned Reads"},
			{Key: "snv", Label: "Germline SNV"},
			{Key: "ssnv", Label: "Somatic SNV"},
		},
	}
	return &result, nil
}

func (m *MockRepository) GetById(id int) (*types.Document, error) {
	if id == 999999 {
		return nil, nil
	}
	return &types.Document{
		ID:               203,
		Name:             "FI0037905.S14786.vcf.gz",
		DataCategoryCode: "genomic_data",
		DataTypeCode:     "snv",
		FileFormatCode:   "vcf",
		Size:             325362647,
		Url:              "s3://example.com/document/203/download",
		Hash:             "5d41402abc4b2a76b9719d911017c794",
		CreatedOn:        time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC),
	}, nil
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
			"case_id":20, 
			"created_on": "2000-01-01T00:00:00Z",
			"data_type_code":"snv", 
			"document_id":203, 
			"format_code":"vcf", 
			"hash":"5d41402abc4b2a76b9719d911017c794", 
			"name":"FI0037905.S14786.vcf.gz", 
			"patient_id":58, 
			"diagnosis_lab_code":"CQGC", 
			"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
			"relationship_to_proband_code":"proband", 
			"run_alias":"A00516_0224", 
			"submitter_sample_id":"S14786", 
			"seq_id":56, 
			"size":325362647, 
			"task_id":20
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
	router.GET("/documents/filters", DocumentsFiltersHandler(repo))

	req, _ := http.NewRequest("GET", "/documents/filters", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"data_type_code":[
			{"key":"alignment", "label":"Aligned Reads"}, 
			{"key":"snv", "label":"Germline SNV"}, 
			{"key":"ssnv", "label":"Somatic SNV"}
		], 
		"format_code":[
			{"key":"cram", "label":"CRAM File"}, 
			{"key":"vcf", "label":"VCF File"}
		], 
		"diagnosis_lab_code":[
			{"key":"CHOP", "label":"Children Hospital of Philadelphia"}, 
			{"key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"}
		], 
		"project_code":[
			{"key":"N1", "label":"NeuroDev Phase I"}, 
			{"key":"N2", "label":"NeuroDev Phase II"}
		], 
		"relationship_to_proband_code":[
			{"key":"proband", "label":"Proband"}, 
			{"key":"father", "label":"Father"}, 
			{"key":"mother", "label":"Mother"}
		]}`, w.Body.String())
}

func Test_GetDocumentsDownloadUrlHandler_Success(t *testing.T) {
	repo := &MockRepository{}
	presigner := testutils.NewMockS3PreSigner()
	router := gin.Default()
	router.GET("/documents/:document_id/download_url", GetDocumentsDownloadUrlHandler(repo, presigner))

	req, _ := http.NewRequest("GET", "/documents/203/download_url", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"url": "presigned.s3://example.com/document/203/download",
		"expires_at": 1234567890
	}`, w.Body.String())
}

func Test_GetDocumentsDownloadUrlHandler_InvalidDocumentId(t *testing.T) {
	repo := &MockRepository{}
	presigner := testutils.NewMockS3PreSigner()
	router := gin.Default()
	router.GET("/documents/:document_id/download_url", GetDocumentsDownloadUrlHandler(repo, presigner))

	req, _ := http.NewRequest("GET", "/documents/invalid/download_url", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_GetDocumentsDownloadUrlHandler_DocumentNotFound(t *testing.T) {
	repo := &MockRepository{}
	presigner := testutils.NewMockS3PreSigner()
	router := gin.Default()
	router.GET("/documents/:document_id/download_url", GetDocumentsDownloadUrlHandler(repo, presigner))

	req, _ := http.NewRequest("GET", "/documents/999999/download_url", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}
