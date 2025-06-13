package server

import (
	"bytes"
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func (m *MockRepository) SearchCases(userQuery types.ListQuery) (*[]types.CaseResult, error) {
	return &[]types.CaseResult{
		{
			CaseID:               1,
			PatientID:            3,
			MRN:                  "MRN-283775",
			PriorityCode:         "routine",
			StatusCode:           "active",
			CaseAnalysisTypeCode: "germline",
			CaseAnalysisCode:     "WGA",
			CaseAnalysisName:     "Whole Genome Analysis",
			PrimaryCondition:     "neurodevelopmental disorder (MONDO:0700092)",
			RequestedByCode:      "CHUSJ",
			RequestedByName:      "Centre hospitalier universitaire Sainte-Justine",
			ProjectCode:          "N1",
			CreatedOn: time.Date(
				2000, 1, 1, 0, 0, 0, 0, time.UTC),
			UpdatedOn: time.Date(
				2000, 2, 2, 0, 0, 0, 0, time.UTC),
			Prescriber:               "Felix Laflamme",
			PerformerLabCode:         "CQGC",
			PerformerLabName:         "Quebec Clinical Genomic Center",
			RequestID:                1,
			ManagingOrganizationCode: "CHUSJ",
			ManagingOrganizationName: "Centre hospitalier universitaire Sainte-Justine",
		},
	}, nil
}

func (m *MockRepository) CountCases(userQuery types.CountQuery) (*int64, error) {
	var c = int64(15)
	return &c, nil
}

func (m *MockRepository) SearchById(prefix string, limit int) (*[]types.AutocompleteResult, error) {
	var result = []types.AutocompleteResult{
		{Type: "case_id", Value: "1"},
		{Type: "request_id", Value: "1"},
		{Type: "patient_id", Value: "10"},
		{Type: "request_id", Value: "10"},
		{Type: "case_id", Value: "10"},
	}
	return &result, nil
}

func Test_CasesListHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/cases/list", CasesListHandler(repo))
	body := `{
			"additional_fields":[]
	}`
	req, _ := http.NewRequest("POST", "/cases/list", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
        "case_analysis_code":"WGA",
		"case_analysis_name":"Whole Genome Analysis",
		"case_analysis_type_code":"germline",
		"case_id":1,
		"created_on":"2000-01-01T00:00:00Z",
		"managing_organization_code":"CHUSJ",
		"managing_organization_name":"Centre hospitalier universitaire Sainte-Justine",
		"mrn":"MRN-283775",
		"patient_id":3,
		"performer_lab_code":"CQGC",
		"performer_lab_name":"Quebec Clinical Genomic Center",
		"prescriber":"Felix Laflamme",
		"primary_condition":"neurodevelopmental disorder (MONDO:0700092)",
		"priority_code":"routine",
		"project_code":"N1",
		"request_id":1,
		"requested_by_code":"CHUSJ",
		"requested_by_name":"Centre hospitalier universitaire Sainte-Justine",
		"status_code":"active",
		"updated_on":"2000-02-02T00:00:00Z"
    }]`, w.Body.String())
}

func Test_CasesCountHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/cases/count", CasesCountHandler(repo))

	req, _ := http.NewRequest("POST", "/cases/count", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"count":15}`, w.Body.String())
}

func Test_CasesAutocompleteHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/cases/autocomplete", CasesAutocompleteHandler(repo))

	req, _ := http.NewRequest("GET", "/cases/autocomplete?prefix=1&limit=5", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[
		{"type":"case_id", "value":"1"},
		{"type":"request_id", "value":"1"},
		{"type":"patient_id", "value":"10"},
		{"type":"request_id", "value":"10"},
		{"type":"case_id", "value":"10"}
	]`, w.Body.String())
}
