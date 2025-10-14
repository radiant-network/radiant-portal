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

func assertSearchCasesHandler(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewCasesRepository(db)
		router := gin.Default()
		router.POST("/cases/search", server.SearchCasesHandler(repo))

		req, _ := http.NewRequest("POST", "/cases/search", bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_SearchCasesHandler_WithCriteria(t *testing.T) {
	expected := `{"list": [{"case_analysis_code":"WGA", "case_analysis_name":"Whole Genome Analysis", "case_type":"germline_family", "case_id":7, "created_on":"2021-09-12T13:08:00Z", "proband_id":20, "proband_mrn":"MRN-283792", "priority_code":"routine", "project_code":"N1", "project_name":"NeuroDev Phase I", "requested_by_code":"CHOP", "requested_by_name":"Children Hospital of Philadelphia", "status_code":"revoke", "updated_on":"2021-09-12T13:08:00Z", "has_variants":true}], "count": 1}`
	body := `{
			"additional_fields":[],
			"search_criteria":[{"field": "status_code", "value": ["revoke"]}]
		}`
	assertSearchCasesHandler(t, "simple", body, expected)
}

func Test_SearchCasesHandler_WithAdditionalFields(t *testing.T) {
	expected := `{"list": [{"case_analysis_code":"WGA", "case_analysis_name":"Whole Genome Analysis", "case_type":"germline_family", "case_id":7, "created_on":"2021-09-12T13:08:00Z", "managing_organization_code":"CHUSJ", "proband_id":20, "proband_mrn":"MRN-283792", "primary_condition_id":"MONDO:0700092", "primary_condition_name":"neurodevelopmental disorder", "priority_code":"routine", "project_code":"N1", "project_name":"NeuroDev Phase I", "requested_by_code":"CHOP", "requested_by_name":"Children Hospital of Philadelphia", "status_code":"revoke", "updated_on":"2021-09-12T13:08:00Z", "has_variants":true}], "count": 1}`
	body := `{
			"additional_fields":["primary_condition_id", "primary_condition_name", "managing_organization_code"],
			"search_criteria":[{"field": "status_code", "value": ["revoke"]}]
		}`
	assertSearchCasesHandler(t, "simple", body, expected)
}

func Test_SearchCasesHandler_WithSortAndLimit(t *testing.T) {
	expected := `{"list": [{"case_analysis_code":"IDGD", "case_analysis_name":"Intellectual Deficiency and Global Developmental Delay", "case_type":"germline_family", "case_id":21, "created_on":"2020-09-12T13:08:00Z", "proband_id":60, "proband_mrn":"MRN-283832", "priority_code":"routine", "project_code":"N2", "project_name":"NeuroDev Phase II", "requested_by_code":"CHUSJ", "requested_by_name":"Centre hospitalier universitaire Sainte-Justine", "status_code":"in_progress", "updated_on":"2020-09-12T13:08:00Z", "has_variants":false}, {"case_analysis_code":"IDGD", "case_analysis_name":"Intellectual Deficiency and Global Developmental Delay", "case_type":"germline_family", "case_id":20, "created_on":"2020-09-12T13:08:00Z", "proband_id":58, "proband_mrn":"MRN-283830", "priority_code":"routine", "project_code":"N2", "project_name":"NeuroDev Phase II", "requested_by_code":"CHUSJ", "requested_by_name":"Centre hospitalier universitaire Sainte-Justine", "status_code":"completed", "updated_on":"2020-09-12T13:08:00Z", "has_variants":false}], "count": 21}`
	body := `{
			"additional_fields":[],
			"sort":[{"field": "proband_id", "order": "desc"}],
			"limit": 2
		}`
	assertSearchCasesHandler(t, "simple", body, expected)
}

func Test_SearchCasesHandler_WithVariants(t *testing.T) {
	expected := `{"list":[{"case_id":1,"proband_id":3, "proband_mrn":"MRN-283775","priority_code":"routine","status_code":"in_progress","case_analysis_code":"WGA","case_analysis_name":"Whole Genome Analysis","case_type":"germline_family","requested_by_code":"CHUSJ","requested_by_name":"Centre hospitalier universitaire Sainte-Justine","project_code":"N1","project_name":"NeuroDev Phase I","created_on":"2021-09-12T13:08:00Z","updated_on":"2021-09-12T13:08:00Z","has_variants":true},{"case_id":2, "proband_id":4, "proband_mrn":"MRN-283776","priority_code":"routine","status_code":"in_progress","case_analysis_code":"WGA","case_analysis_name":"Whole Genome Analysis","case_type":"germline_family","requested_by_code":"CHUSJ","requested_by_name":"Centre hospitalier universitaire Sainte-Justine","project_code":"N1","project_name":"NeuroDev Phase I", "created_on":"2021-09-12T13:08:00Z","updated_on":"2021-09-12T13:08:00Z","has_variants":false}],"count":21}`
	body := `{
			"additional_fields":[],
			"sort":[{"field": "case_id", "order": "asc"}],
			"limit": 2
		}`
	assertSearchCasesHandler(t, "simple", body, expected)
}

func assertCaseIdsAutoComplete(t *testing.T, data string, prefix string, limit int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewCasesRepository(db)
		router := gin.Default()
		router.GET("/cases/autocomplete", server.CasesAutocompleteHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/cases/autocomplete?prefix=%s&limit=%d", prefix, limit), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_CaseIdsAutoComplete(t *testing.T) {
	expected := `[{"type":"case_id", "value":"1"}, {"type":"patient_id", "value":"1"}, {"type":"case_id", "value":"10"}, {"type":"patient_id", "value":"10"}, {"type":"case_id", "value":"11"}]`
	//expected := `[{"type":"case_id", "value":"1"}, {"type":"request_id", "value":"1"}, {"type":"case_id", "value":"10"}, {"type":"patient_id", "value":"10"}, {"type":"request_id", "value":"10"}]`
	assertCaseIdsAutoComplete(t, "simple", "1", 5, expected)
}

func assertGetCasesFilters(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewCasesRepository(db)
		router := gin.Default()
		router.POST("/cases/filters", server.CasesFiltersHandler(repo))

		req, _ := http.NewRequest("POST", "/cases/filters", bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetCasesFilters(t *testing.T) {
	body := `{
			"search_criteria":[{"field": "status_code", "value": ["draft"]}]
		}`
	expected := `{
		"case_analysis":[
			{"count":1, "key":"WGA", "label":"Whole Genome Analysis"}, 
			{"count":0, "key":"HYPM", "label":"Malignant Hyperthermia"},
			{"count":0, "key":"IDGD", "label":"Intellectual Deficiency and Global Developmental Delay"},
			{"count":0, "key":"MYOC", "label":"Congenital Myopathies"}], 
		"performer_lab":[
			{"count":0, "key":"LDM-CHOP", "label":"Molecular Diagnostic Laboratory, CHOP"},
			{"count":0, "key":"LDM-CHUSJ", "label":"Laboratoire de diagnostic moléculaire, CHU Sainte-Justine"}],
		"priority":[
			{"count":1, "key":"routine", "label":"Routine"}, 
			{"count":0, "key":"asap", "label":"Asap"},
			{"count":0, "key":"stat", "label":"Stat"},
			{"count":0, "key":"urgent", "label":"Urgent"}], 
		"project":[
			{"count":1, "key":"N1", "label":"NeuroDev Phase I"}, 
			{"count":0, "key":"N2", "label":"NeuroDev Phase II"}], 
		"requested_by":[
			{"count":1, "key":"CHOP", "label":"Children Hospital of Philadelphia"}, 
			{"count":0, "key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"}, 
			{"count":0, "key":"CQGC", "label":"Quebec Clinical Genomic Center"},
			{"count":0, "key":"LDM-CHOP", "label":"Molecular Diagnostic Laboratory, CHOP"},
			{"count":0, "key":"LDM-CHUSJ", "label":"Laboratoire de diagnostic moléculaire, CHU Sainte-Justine"}, 
			{"count":0, "key":"UCSF", "label":"University of California San-Francisco"}], 
		"status":[
			{"count":1, "key":"draft", "label":"Draft"}, 
			{"count":0, "key":"completed", "label":"Completed"},
			{"count":0, "key":"in_progress", "label":"In Progress"}, 
			{"count":0, "key":"incomplete", "label":"Incomplete"}, 
			{"count":0, "key":"revoke", "label":"Revoke"},
			{"count":0, "key":"submitted", "label":"Submitted"},
			{"count":0, "key":"unknown", "label":"Unknown"}]	
		}`
	assertGetCasesFilters(t, "simple", body, expected)
}

func assertCaseEntityHandler(t *testing.T, data string, caseId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewCasesRepository(db)
		router := gin.Default()
		router.GET("/cases/:case_id", server.CaseEntityHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/cases/%d", caseId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_CaseEntityHandler(t *testing.T) {
	expected := `{
		"assays":[
			{"affected_status_code":"affected", "experimental_strategy_code":"wxs", "patient_id":3, "relationship_to_proband":"proband", "request_id":22, "sample_id":1, "sample_submitter_id":"S13224", "sample_type_code": "dna", "seq_id":1, "status_code":"completed", "updated_on":"2021-09-12T13:08:00Z", "histology_code": "normal", "has_variants": true}, 
			{"affected_status_code":"affected", "experimental_strategy_code":"wxs", "patient_id":1, "relationship_to_proband":"mother", "request_id":23, "sample_id":2, "sample_submitter_id":"S13225", "sample_type_code": "dna", "seq_id":2, "status_code":"completed", "updated_on":"2021-09-12T13:08:00Z", "histology_code": "normal", "has_variants": true},
			{"affected_status_code":"non_affected", "experimental_strategy_code":"wxs", "patient_id":2, "relationship_to_proband":"father", "request_id":24, "sample_id":3, "sample_submitter_id":"S13226", "sample_type_code": "dna", "seq_id":3, "status_code":"completed", "updated_on":"2021-09-12T13:08:00Z", "histology_code": "normal", "has_variants": false}
		],
		"case_analysis_code":"WGA",
		"case_analysis_name":"Whole Genome Analysis",
		"case_id":1,
		"case_type":"germline_family", 
		"created_on":"2021-09-12T13:08:00Z", 
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
		"note": "Administrative comment",
		"performer_lab_code": "CQGC",
		"performer_lab_name": "Quebec Clinical Genomic Center",
		"prescriber": "Felix Laflamme",
		"primary_condition_id": "MONDO:0700092",
		"primary_condition_name": "neurodevelopmental disorder",
		"priority_code": "routine",
		"project_code": "N1",
		"project_name": "NeuroDev Phase I",
		"request_id": 1,
		"requested_by_code": "CHUSJ",
		"requested_by_name": "Centre hospitalier universitaire Sainte-Justine",
		"status_code":"in_progress", 
		"tasks":[
			{"id": 1, "type_code": "ngba", "type_name": "Normal Germline Bioinformatics Analysis", "created_on": "2021-10-12T13:08:00Z", "patients": ["father", "mother", "proband"]},
			{"id" : 62, "type_code" : "ngba", "type_name": "Normal Germline Bioinformatics Analysis", "created_on" : "2021-10-12T13:08:00Z", "patients" : [ "mother" ]},
 			{"id" : 63, "type_code" : "ngba", "type_name": "Normal Germline Bioinformatics Analysis", "created_on" : "2021-10-12T13:08:00Z", "patients" : [ "mother" ]} 
		],
		"updated_on":"2021-09-12T13:08:00Z"
	}`
	assertCaseEntityHandler(t, "simple", 1, expected)
}

func assertCaseEntityDocumentsSearchHandler(t *testing.T, data string, caseId int, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewDocumentsRepository(db)
		router := gin.Default()
		router.POST("/cases/:case_id/documents/search", server.CaseEntityDocumentsSearchHandler(repo))

		req, _ := http.NewRequest("POST", fmt.Sprintf("/cases/%d/documents/search", caseId), bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_CaseEntityDocumentsSearchHandler_WithSortAndLimit(t *testing.T) {
	expected := `{
		"list": [
			{
				"case_id":21, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"alignment", 
				"document_id":21, 
				"format_code":"cram", 
				"name":"FI0037702.S13229.cram", 
				"patient_id":60, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"proband", 
				"size":9.1235842785e+10, 
				"submitter_sample_id":"S14857", 
				"task_id":21
			}, {
				"case_id":21, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"alignment", 
				"document_id":21, 
				"format_code":"cram", 
				"name":"FI0037702.S13229.cram", 
				"patient_id":61, 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"size":9.1235842785e+10, 
				"submitter_sample_id":"S14858", 
				"task_id":21
			}
		], 
		"count": 6}`
	body := `{
			"additional_fields":[],
			"sort":[{"field": "name", "order": "asc"}, {"field": "relationship_to_proband_code", "order": "desc"}],
			"limit": 2
		}`
	assertCaseEntityDocumentsSearchHandler(t, "simple", 21, body, expected)
}

func assertCaseEntityDocumentsFiltersHandler(t *testing.T, data string, caseId int, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewDocumentsRepository(db)
		router := gin.Default()
		router.POST("/cases/:case_id/documents/filters", server.CaseEntityDocumentsFiltersHandler(repo))

		req, _ := http.NewRequest("POST", fmt.Sprintf("/cases/%d/documents/filters", caseId), bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_CaseEntityDocumentsFiltersHandler(t *testing.T) {
	body := `{
			"search_criteria":[{"field": "format_code", "value": ["vcf"]}]
		}`
	expected := `{
		"data_type":[
			{"count":1, "key":"snv", "label":"Germline SNV"}, 
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
			{"count":1, "key":"vcf", "label":"VCF File"}, 
			{"count":0, "key":"bed", "label":"BED File"}, 
			{"count":0, "key":"bw", "label":"BW File"}, 
			{"count":0, "key":"crai", "label":"CRAI Index File"}, 
			{"count":0, "key":"cram", "label":"CRAM File"}, 
			{"count":0, "key":"csv", "label":"CSV File"}, 
			{"count":0, "key":"gvcf", "label":"gVCF File"}, 
			{"count":0, "key":"html", "label":"HTML File"}, 
			{"count":0, "key":"json", "label":"JSON File"}, 
			{"count":0, "key":"pdf", "label":"PDF File"}, 
			{"count":0, "key":"png", "label":"PNG File"}, 
			{"count":0, "key":"tbi", "label":"TBI Index File"}, 
			{"count":0, "key":"tgz", "label":"TGZ Archive File"}, 
			{"count":0, "key":"tsv", "label":"TSV File"}, 
			{"count":0, "key":"txt", "label":"Text File"}
		], 
		"relationship_to_proband":[
			{"count":1, "key":"father", "label":"Father"}, 
			{"count":1, "key":"mother", "label":"Mother"},
			{"count":1, "key":"proband", "label":"Proband"}, 
			{"count":0, "key":"brother", "label":"Brother"}, 
			{"count":0, "key":"sibling", "label":"Sibling"}, 
			{"count":0, "key":"sister", "label":"Sister"}
		]}`
	assertCaseEntityDocumentsFiltersHandler(t, "simple", 21, body, expected)
}
