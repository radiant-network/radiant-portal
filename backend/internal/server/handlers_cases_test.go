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

func (m *MockRepository) SearchCases(userQuery types.ListQuery) (*[]types.CaseResult, *int64, error) {
	var count = int64(1)
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
			PrimaryConditionID:   "MONDO:0700092",
			PrimaryConditionName: "neurodevelopmental disorder",
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
	}, &count, nil
}

func (m *MockRepository) SearchById(prefix string, limit int) (*[]types.AutocompleteResult, error) {
	var result = []types.AutocompleteResult{
		{Type: "case_id", Value: "1"},
		//{Type: "request_id", Value: "1"},
		{Type: "patient_id", Value: "10"},
		//{Type: "request_id", Value: "10"},
		{Type: "case_id", Value: "10"},
	}
	return &result, nil
}

func (m *MockRepository) GetCasesFilters(query types.AggQuery) (*types.CaseFilters, error) {
	var result = types.CaseFilters{
		Status: []types.Aggregation{
			{Bucket: "draft", Label: "Draft"},
			{Bucket: "active", Label: "Active"},
			{Bucket: "revoke", Label: "Revoke"},
		},
		Priority: []types.Aggregation{
			{Bucket: "routine", Label: "Routine"},
			{Bucket: "asap", Label: "Asap"},
			{Bucket: "stat", Label: "Stat"},
		},
		CaseAnalysis: []types.Aggregation{
			{Bucket: "WGA", Label: "Whole Genome Analysis"},
			{Bucket: "IDGD", Label: "Intellectual Deficiency and Global Developmental Delay"},
		},
		Project: []types.Aggregation{
			{Bucket: "N1", Label: "NeuroDev Phase I"},
			{Bucket: "N2", Label: "NeuroDev Phase II"},
		},
		PerformerLab: []types.Aggregation{
			{Bucket: "CHOP", Label: "Children Hospital of Philadelphia"},
			{Bucket: "CHUSJ", Label: "Centre hospitalier universitaire Sainte-Justine"},
		},
		RequestedBy: []types.Aggregation{
			{Bucket: "CHOP", Label: "Children Hospital of Philadelphia"},
			{Bucket: "CHUSJ", Label: "Centre hospitalier universitaire Sainte-Justine"},
		},
	}
	return &result, nil
}

func (m *MockRepository) GetCaseEntity(caseId int) (*types.CaseEntity, error) {
	return &types.CaseEntity{
		CaseID:           1,
		CaseAnalysisCode: "WGA",
		CaseAnalysisName: "Whole Genome Analysis",
		CaseType:         "germline_family",
		SequencingExperiments: types.JsonArray[types.CaseSequencingExperiment]{
			{SeqID: 1, PatientID: 3, RelationshipToProband: "", AffectedStatusCode: "", SampleID: 1},
			{SeqID: 3, PatientID: 2, RelationshipToProband: "father", AffectedStatusCode: "non_affected", SampleID: 3},
			{SeqID: 2, PatientID: 1, RelationshipToProband: "mother", AffectedStatusCode: "affected", SampleID: 2},
		},
	}, nil
}

func Test_SearchCasesHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/cases/search", SearchCasesHandler(repo))
	body := `{
			"additional_fields":[]
	}`
	req, _ := http.NewRequest("POST", "/cases/search", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"list": [{
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
			"primary_condition_id":"MONDO:0700092",
			"primary_condition_name":"neurodevelopmental disorder",
			"priority_code":"routine",
			"project_code":"N1",
			"request_id":1,
			"requested_by_code":"CHUSJ",
			"requested_by_name":"Centre hospitalier universitaire Sainte-Justine",
			"status_code":"active",
			"updated_on":"2000-02-02T00:00:00Z"
		}],
		"count": 1
	}`, w.Body.String())
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
		{"type":"patient_id", "value":"10"},
		{"type":"case_id", "value":"10"}
	]`, w.Body.String())
	//assert.JSONEq(t, `[
	//	{"type":"case_id", "value":"1"},
	//	{"type":"request_id", "value":"1"},
	//	{"type":"patient_id", "value":"10"},
	//	{"type":"request_id", "value":"10"},
	//	{"type":"case_id", "value":"10"}
	//]`, w.Body.String())
}

func Test_CasesFiltersHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/cases/filters", CasesFiltersHandler(repo))

	req, _ := http.NewRequest("POST", "/cases/filters", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"case_analysis":[
			{"count":0, "key":"WGA", "label":"Whole Genome Analysis"}, 
			{"count":0, "key":"IDGD", "label":"Intellectual Deficiency and Global Developmental Delay"}
		], "performer_lab":[
			{"count":0, "key":"CHOP", "label":"Children Hospital of Philadelphia"},
			{"count":0, "key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"}
		], "priority":[
			{"count":0, "key":"routine", "label":"Routine"},
			{"count":0, "key":"asap", "label":"Asap"},
			{"count":0, "key":"stat", "label":"Stat"}
		], "project":[
			{"count":0, "key":"N1", "label":"NeuroDev Phase I"},
			{"count":0, "key":"N2", "label":"NeuroDev Phase II"}
		], "requested_by":[
			{"count":0, "key":"CHOP", "label":"Children Hospital of Philadelphia"},
			{"count":0, "key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"}
		], "status":[
			{"count":0, "key":"draft", "label":"Draft"},
			{"count":0, "key":"active", "label":"Active"},
			{"count":0, "key":"revoke", "label":"Revoke"}
		]
	}`, w.Body.String())
}

func Test_CaseEntityHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/cases/:case_id", CaseEntityHandler(repo))

	req, _ := http.NewRequest("GET", "/cases/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"case_id": 1,
		"case_analysis_code": "WGA",
		"case_analysis_name": "Whole Genome Analysis",
		"case_type": "germline_family",
		"sequencing_experiments": [
			{"seq_id": 1, "patient_id": 3, "sample_id": 1},
			{"seq_id": 3, "patient_id": 2, "relationship_to_proband": "father", "affected_status_code": "non_affected", "sample_id": 3},
			{"seq_id": 2, "patient_id": 1, "relationship_to_proband": "mother", "affected_status_code": "affected", "sample_id": 2}
		]
	}`, w.Body.String())
}
