package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) SearchCases(userQuery types.ListQuery) (*[]types.CaseResult, *int64, error) {
	var count = int64(1)
	return &[]types.CaseResult{
		{
			CaseID:               1,
			ProbandID:            3,
			ProbandMRN:           "MRN-283775",
			PriorityCode:         "routine",
			StatusCode:           "in_progress",
			CaseAnalysisTypeCode: "germline",
			CaseType:             "germline_family",
			CaseAnalysisCode:     "WGA",
			CaseAnalysisName:     "Whole Genome Analysis",
			PrimaryConditionID:   "MONDO:0700092",
			PrimaryConditionName: "neurodevelopmental disorder",
			RequestedByCode:      "CHUSJ",
			RequestedByName:      "Centre hospitalier universitaire Sainte-Justine",
			ProjectCode:          "N1",
			ProjectName:          "NeuroDev Phase I",
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
			HasVariants:              true,
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
			{Bucket: "in_progress", Label: "In Progress"},
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
		CreatedOn: time.Date(
			2000, 1, 1, 0, 0, 0, 0, time.UTC),
		UpdatedOn: time.Date(
			2000, 2, 2, 0, 0, 0, 0, time.UTC),
		Prescriber:           "Felix Laflamme",
		PerformerLabCode:     "CQGC",
		PerformerLabName:     "Quebec Clinical Genomic Center",
		RequestID:            1,
		PrimaryConditionID:   "MONDO:0700092",
		PrimaryConditionName: "neurodevelopmental disorder",
		RequestedByCode:      "CHUSJ",
		RequestedByName:      "Centre hospitalier universitaire Sainte-Justine",
		ProjectCode:          "N1",
		ProjectName:          "NeuroDev Phase I",
		Assays: types.JsonArray[types.CaseAssay]{
			{SeqID: 1, RequestID: 22, PatientID: 3, RelationshipToProband: "proband", AffectedStatusCode: "affected", SampleID: 1, SampleSubmitterID: "S13224", SampleTypeCode: "dna", HistologyCode: "normal", HasVariants: true},
			{SeqID: 2, RequestID: 23, PatientID: 1, RelationshipToProband: "mother", AffectedStatusCode: "affected", SampleID: 2, SampleSubmitterID: "S13225", SampleTypeCode: "dna", HistologyCode: "normal", HasVariants: true},
			{SeqID: 3, RequestID: 24, PatientID: 2, RelationshipToProband: "father", AffectedStatusCode: "non_affected", SampleID: 3, SampleSubmitterID: "S13226", SampleTypeCode: "dna", HistologyCode: "normal", HasVariants: false},
		},
		Tasks: types.JsonArray[types.CaseTask]{
			{ID: 1, TypeCode: "ngba", TypeName: "Normal Germline Bioinformatics Analysis", CreatedOn: time.Date(2021, 10, 12, 13, 8, 0, 0, time.UTC), PatientCount: 3, PatientsUnparsed: "mother, father", Patients: types.JsonArray[string]{"father", "mother", "proband"}},
		},
		Members: types.JsonArray[types.CasePatientClinicalInformation]{
			{PatientID: 3, RelationshipToProband: "proband", AffectedStatusCode: "affected", Mrn: "MRN-283775", SexCode: "male", ManagingOrganizationCode: "CHUSJ", ManagingOrganizationName: "Centre hospitalier universitaire Sainte-Justine", DateOfBirth: time.Date(1973, 3, 23, 0, 0, 0, 0, time.UTC), NonObservedPhenotypes: types.JsonArray[types.Term]{{ID: "HP:0000717", Name: "Autism", OnsetCode: "childhood"}, {ID: "HP:0001263", Name: "Global developmental delay", OnsetCode: "childhood"}}},
			{PatientID: 1, RelationshipToProband: "mother", AffectedStatusCode: "affected", Mrn: "MRN-283773", SexCode: "female", ManagingOrganizationCode: "CHUSJ", ManagingOrganizationName: "Centre hospitalier universitaire Sainte-Justine", DateOfBirth: time.Date(2012, 2, 3, 0, 0, 0, 0, time.UTC)},
			{PatientID: 2, RelationshipToProband: "father", AffectedStatusCode: "non_affected", Mrn: "MRN-283774", SexCode: "male", ManagingOrganizationCode: "CHUSJ", ManagingOrganizationName: "Centre hospitalier universitaire Sainte-Justine", DateOfBirth: time.Date(1970, 1, 30, 0, 0, 0, 0, time.UTC)},
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
			"case_type": "germline_family",
			"case_id":1,
			"created_on":"2000-01-01T00:00:00Z",
			"managing_organization_code":"CHUSJ",
			"managing_organization_name":"Centre hospitalier universitaire Sainte-Justine",
			"proband_mrn":"MRN-283775",
			"proband_id":3,
			"performer_lab_code":"CQGC",
			"performer_lab_name":"Quebec Clinical Genomic Center",
			"prescriber":"Felix Laflamme",
			"primary_condition_id":"MONDO:0700092",
			"primary_condition_name":"neurodevelopmental disorder",
			"priority_code":"routine",
			"project_code":"N1",
			"project_name":"NeuroDev Phase I",
			"request_id":1,
			"requested_by_code":"CHUSJ",
			"requested_by_name":"Centre hospitalier universitaire Sainte-Justine",
			"status_code":"in_progress",
			"updated_on":"2000-02-02T00:00:00Z",
			"has_variants": true
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
			{"count":0, "key":"in_progress", "label":"In Progress"},
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
		"assays":[
			{"affected_status_code":"affected", "experimental_strategy_code":"", "patient_id":3, "relationship_to_proband":"proband", "request_id":22, "sample_id":1, "sample_submitter_id":"S13224", "sample_type_code": "dna", "seq_id":1, "status_code":"", "updated_on":"0001-01-01T00:00:00Z", "histology_code": "normal", "has_variants": true}, 
			{"affected_status_code":"affected", "experimental_strategy_code":"", "patient_id":1, "relationship_to_proband":"mother", "request_id":23, "sample_id":2, "sample_submitter_id":"S13225", "sample_type_code": "dna", "seq_id":2, "status_code":"", "updated_on":"0001-01-01T00:00:00Z", "histology_code": "normal", "has_variants": true},
			{"affected_status_code":"non_affected", "experimental_strategy_code":"", "patient_id":2, "relationship_to_proband":"father", "request_id":24, "sample_id":3, "sample_submitter_id":"S13226", "sample_type_code": "dna", "seq_id":3, "status_code":"", "updated_on":"0001-01-01T00:00:00Z", "histology_code": "normal", "has_variants": false}
		],
		"case_analysis_code":"WGA",
		"case_analysis_name":"Whole Genome Analysis",
		"case_id":1,
		"case_type":"germline_family", 
		"created_on":"2000-01-01T00:00:00Z", 
		"members":[
			{
				"affected_status_code":"affected", 
				"date_of_birth":"1973-03-23T00:00:00Z",
				"managing_organization_code":"CHUSJ", 
				"managing_organization_name":"Centre hospitalier universitaire Sainte-Justine", 
				"mrn":"MRN-283775", 
				"patient_id":3, 
				"relationship_to_proband":"proband",
				"sex_code":"male", 
				"non_observed_phenotypes": [{"id": "HP:0000717", "name": "Autism", "onset_code": "childhood"}, {"id": "HP:0001263", "name": "Global developmental delay", "onset_code": "childhood"}]
			},
			{
				"affected_status_code":"affected", 
				"date_of_birth":"2012-02-03T00:00:00Z", 
				"managing_organization_code":"CHUSJ", 
				"managing_organization_name":"Centre hospitalier universitaire Sainte-Justine", 
				"mrn":"MRN-283773", 
				"patient_id":1, 
				"relationship_to_proband":"mother", "sex_code":"female"
			},
			{
				"affected_status_code":"non_affected", 
				"date_of_birth":"1970-01-30T00:00:00Z", 
				"managing_organization_code":"CHUSJ", 
				"managing_organization_name":"Centre hospitalier universitaire Sainte-Justine", 
				"mrn":"MRN-283774", 
				"patient_id":2, 
				"relationship_to_proband":"father", 
				"sex_code":"male"
			}
		], 
		"performer_lab_code":"CQGC", 
		"performer_lab_name":"Quebec Clinical Genomic Center", 
		"prescriber":"Felix Laflamme", 
		"primary_condition_id":"MONDO:0700092", 
		"primary_condition_name":"neurodevelopmental disorder", 
		"project_code": "N1",
		"project_name": "NeuroDev Phase I",
		"request_id":1, 
		"requested_by_code":"CHUSJ", 
		"requested_by_name":"Centre hospitalier universitaire Sainte-Justine", 
		"status_code":"", 
		"tasks":[
			{"id": 1, "type_code": "ngba", "type_name": "Normal Germline Bioinformatics Analysis", "created_on": "2021-10-12T13:08:00Z", "patients": ["father", "mother", "proband"]}
		],
		"updated_on":"2000-02-02T00:00:00Z"
	}`, w.Body.String())
}

func Test_CaseEntityDocumentsSearchHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/cases/:case_id/documents/search", CaseEntityDocumentsSearchHandler(repo))
	body := `{
			"additional_fields":[]
	}`
	req, _ := http.NewRequest("POST", "/cases/1/documents/search", bytes.NewBuffer([]byte(body)))
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
			"performer_lab_code":"CQGC", 
			"performer_lab_name":"Quebec Clinical Genomic Center", 
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

func Test_CaseEntityDocumentsFiltersHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/cases/:case_id/documents/filters", CaseEntityDocumentsFiltersHandler(repo))

	req, _ := http.NewRequest("POST", "/cases/1/documents/filters", bytes.NewBuffer([]byte("{}")))
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
