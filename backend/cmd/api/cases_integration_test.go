package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func assertSearchCasesHandler(t *testing.T, data string, body string, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.POST("/:tenant/cases/search", server.SearchCasesHandler(repo))

		req, _ := http.NewRequest("POST", "/radiant/cases/search", bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_SearchCasesHandler_WithCriteria(t *testing.T) {
	expected := `{"list": [{"analysis_catalog_code":"WGA", "analysis_catalog_name":"Whole Genome Analysis", "case_type":"germline_family", "case_id":7, "created_on":"2021-09-12T13:08:00Z", "proband_id":20, "submitter_proband_id":"MRN-283792", "priority_code":"routine", "project_code":"N2", "project_name":"NeuroDev Phase II", "ordering_organization_code":"CHOP", "ordering_organization_name":"Children Hospital of Philadelphia", "status_code":"revoked", "updated_on":"2021-09-12T13:08:00Z", "has_variants":true}], "count": 1}`
	body := `{
			"additional_fields":[],
			"search_criteria":[{"field": "status_code", "value": ["revoked"]}]
		}`
	assertSearchCasesHandler(t, "simple", body, expected)
}

func Test_SearchCasesHandler_WithAdditionalFields(t *testing.T) {
	expected := `{"list": [{"analysis_catalog_code":"WGA", "analysis_catalog_name":"Whole Genome Analysis", "case_type":"germline_family", "case_id":7, "created_on":"2021-09-12T13:08:00Z", "organization_code":"CHUSJ", "proband_id":20, "submitter_proband_id":"MRN-283792", "primary_condition_id":"MONDO:0000003", "primary_condition_name":"colorblindness, partial", "priority_code":"routine", "project_code":"N2", "project_name":"NeuroDev Phase II", "ordering_organization_code":"CHOP", "ordering_organization_name":"Children Hospital of Philadelphia", "status_code":"revoked", "updated_on":"2021-09-12T13:08:00Z", "has_variants":true}], "count": 1}`
	body := `{
			"additional_fields":["primary_condition_id", "primary_condition_name", "organization_code"],
			"search_criteria":[{"field": "status_code", "value": ["revoked"]}]
		}`
	assertSearchCasesHandler(t, "simple", body, expected)
}

func Test_SearchCasesHandler_WithSortAndLimit(t *testing.T) {
	// case_id 74/73 (CLIN-6117 prenatal fixtures) now sort first here: their mothers (patient
	// 65/64) have the highest proband_id in the fixture set. has_variants is false because no
	// StarRocks staging_sequencing_experiment row backs their (Postgres-only) sequencing
	// experiments. Case 73 (twins) is correctly "germline_family" — a fixed COUNT DISTINCT bug
	// (see SearchCases's distinct_members_count) previously miscounted its 2 fetuses as 0 real
	// members, wrongly leaving it classified as a singleton.
	expected := `{"list": [{"analysis_catalog_code":"WGA", "analysis_catalog_name":"Whole Genome Analysis", "case_type":"germline_family", "case_id":74, "created_on":"2019-01-03T13:08:00Z", "proband_id":65, "submitter_proband_id":"MRN-283837", "priority_code":"asap", "project_code":"N1", "project_name":"NeuroDev Phase I", "ordering_organization_code":"CHUSJ", "ordering_organization_name":"Centre hospitalier universitaire Sainte-Justine", "status_code":"in_progress", "updated_on":"2019-01-03T13:08:00Z", "has_variants":false}, {"analysis_catalog_code":"WGA", "analysis_catalog_name":"Whole Genome Analysis", "case_type":"germline_family", "case_id":73, "created_on":"2019-01-02T13:08:00Z", "proband_id":64, "submitter_proband_id":"MRN-283836", "priority_code":"asap", "project_code":"N1", "project_name":"NeuroDev Phase I", "ordering_organization_code":"CHUSJ", "ordering_organization_name":"Centre hospitalier universitaire Sainte-Justine", "status_code":"in_progress", "updated_on":"2019-01-02T13:08:00Z", "has_variants":false}], "count": 26}`
	body := `{
			"additional_fields":[],
			"sort":[{"field": "proband_id", "order": "desc"}],
			"limit": 2
		}`
	assertSearchCasesHandler(t, "simple", body, expected)
}

func Test_SearchCasesHandler_WithVariants(t *testing.T) {
	expected := `{"list":[{"case_id":1,"proband_id":3, "submitter_proband_id":"MRN-283775","priority_code":"routine","status_code":"in_progress","analysis_catalog_code":"WGA","analysis_catalog_name":"Whole Genome Analysis","case_type":"germline_family","ordering_organization_code":"CHUSJ","ordering_organization_name":"Centre hospitalier universitaire Sainte-Justine","project_code":"N1","project_name":"NeuroDev Phase I","created_on":"2021-09-12T13:08:00Z","updated_on":"2021-09-12T13:08:00Z","has_variants":true},{"case_id":2, "proband_id":4, "submitter_proband_id":"MRN-283776","priority_code":"routine","status_code":"in_progress","analysis_catalog_code":"WGA","analysis_catalog_name":"Whole Genome Analysis","case_type":"germline_family","ordering_organization_code":"CHUSJ","ordering_organization_name":"Centre hospitalier universitaire Sainte-Justine","project_code":"N1","project_name":"NeuroDev Phase I", "created_on":"2021-09-12T13:08:00Z","updated_on":"2021-09-12T13:08:00Z","has_variants":false}],"count":26}`
	body := `{
			"additional_fields":[],
			"sort":[{"field": "case_id", "order": "asc"}],
			"limit": 2
		}`
	assertSearchCasesHandler(t, "simple", body, expected)
}

func assertCaseIdsAutoComplete(t *testing.T, data string, prefix string, limit int, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/cases/autocomplete", server.CasesAutocompleteHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/radiant/cases/autocomplete?prefix=%s&limit=%d", prefix, limit), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_CaseIdsAutoComplete(t *testing.T) {
	expected := `[{"type":"case_id", "value":"1"}, {"type":"patient_id", "value":"1"}, {"type":"sequencing_experiment_id", "value":"1"}, {"type":"case_id", "value":"10"}, {"type":"patient_id", "value":"10"}]`
	assertCaseIdsAutoComplete(t, "simple", "1", 5, expected)
}

func assertGetCasesFilters(t *testing.T, data string, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/cases/filters", server.CasesFiltersHandler(repo))

		req, _ := http.NewRequest("GET", "/radiant/cases/filters", bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetCasesFilters(t *testing.T) {
	expected := `{
		"analysis_catalog_code":[
			{"key":"HYPM", "label":"Malignant Hyperthermia"},
			{"key":"IDGD", "label":"Intellectual Deficiency and Global Developmental Delay"},
			{"key":"MYOC", "label":"Congenital Myopathies"},
			{"key":"WGA", "label":"Whole Genome Analysis"}], 
		"diagnosis_lab_code":[
			{"key":"LDM-CHOP", "label":"Molecular Diagnostic Laboratory, CHOP"},
			{"key":"LDM-CHUSJ", "label":"Laboratoire de diagnostic moléculaire, CHU Sainte-Justine"}],
		"priority_code":[
			{"key":"asap", "label":"Asap"},
			{"key":"routine", "label":"Routine"},
			{"key":"stat", "label":"Stat"},
			{"key":"urgent", "label":"Urgent"}], 
		"project_code":[
			{"key":"N1", "label":"NeuroDev Phase I"}, 
			{"key":"N2", "label":"NeuroDev Phase II"}], 
		"ordering_organization_code":[
			{"key":"CHOP", "label":"Children Hospital of Philadelphia"}, 
			{"key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"},
			{"key":"TENANT_B_ORG", "label":"Tenant B Org"},
			{"key":"UCSF", "label":"University of California San-Francisco"}], 
		"status_code":[
			{"key":"completed", "label":"Closed"},
			{"key":"in_progress", "label":"In Progress"},
			{"key":"in_review", "label":"In Review"},
			{"key":"inconclusive", "label":"Inconclusive"},
			{"key":"processing", "label":"Processing"},
			{"key":"reopened", "label":"Reopened"},
			{"key":"resolved", "label":"Resolved"},
			{"key":"revoked", "label":"Cancelled"},
			{"key":"submitted", "label":"Pending"},
			{"key":"unresolved", "label":"Unresolved"}],
		"resolution_status_code":[
			{"key":"inconclusive", "label":"Inconclusive"},
			{"key":"solved", "label":"Solved"},
			{"key":"unsolved", "label":"Unsolved"}],
		"life_status_code":[
			{"key":"alive", "label":"Alive"},
			{"key":"deceased", "label":"Deceased"},
			{"key":"unknown", "label":"Unknown"}],
		"case_category_code":[
			{"key":"postnatal", "label":"Postnatal"},
			{"key":"prenatal", "label":"Prenatal"}],
		"panel_code":[
			{"key":"EPILEP", "label":"Epilepsy"},
			{"key":"HEART", "label":"Heart diseases"}],
		"case_type_code":[
			{"key":"germline", "label":"Germline"},
			{"key":"somatic", "label":"Somatic"}]
		}`
	assertGetCasesFilters(t, "simple", expected)
}

func assertCaseEntityHandler(t *testing.T, data string, caseId int, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		igvRepo := starrocks.NewIGVRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/cases/:case_id", server.CaseEntityHandler(repo, igvRepo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/radiant/cases/%d", caseId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_CaseEntityHandler_PrenatalCaseWithExams(t *testing.T) {
	expected := `{
		"case_id":74,
		"case_type":"germline_family",
		"diagnosis_hypothesis":"Suspected congenital myotonic dystrophy",
		"analysis_catalog_code":"WGA",
		"analysis_catalog_name":"Whole Genome Analysis",
		"case_category_code":"prenatal",
		"case_category_name":"Prenatal",
		"created_on":"2019-01-03T13:08:00Z",
		"updated_on":"2019-01-03T13:08:00Z",
		"prescriber":"Felix Laflamme",
		"ordering_organization_code":"CHUSJ",
		"ordering_organization_name":"Centre hospitalier universitaire Sainte-Justine",
		"diagnosis_lab_code":"CQGC",
		"diagnosis_lab_name":"Quebec Clinical Genomic Center",
		"priority_code":"asap",
		"status_code":"in_progress",
		"primary_condition_id":"MONDO:0700092",
		"primary_condition_name":"neurodevelopmental disorder",
		"note":"Administrative comment",
		"project_code":"N1",
		"project_name":"NeuroDev Phase I",
		"panel_code":"EPILEP",
		"panel_name":"Epilepsy",
		"sequencing_experiments":[
			{"seq_id":77, "patient_id":65, "relationship_to_proband":"fetus", "sample_id":129, "sample_submitter_id":"S-PRENAT-74", "sample_type_code":"dna", "affected_status_code":"unknown", "histology_code":"normal", "experimental_strategy_code":"wxs", "status_code":"completed", "updated_on":"2026-04-03T13:08:00Z", "has_variants":false}
		],
		"members":[
			{
				"relationship_to_proband":"proband",
				"affected_status_code":"affected",
				"patient_id":65,
				"first_name":"Léa",
				"last_name":"Bernier",
				"date_of_birth":"1990-06-15T00:00:00Z",
				"life_status_code":"alive",
				"sex_code":"female",
				"submitter_patient_id":"MRN-283837",
				"jhn":"BER9006157788",
				"organization_code":"CHUSJ",
				"organization_name":"Centre hospitalier universitaire Sainte-Justine",
				"observed_phenotypes":[{"id":"HP:0000822", "onset_code":"unknown"}],
				"ethnicities":[
					{"code":"BLK", "name":"Black"},
					{"code":"MIX", "name":"Mixed"}
				],
				"consanguinity":{"code":"consanguinity", "name":"Consanguinity in family"},
				"notes":["High-risk pregnancy follow-up"],
				"family_history":[
					{"family_member_code":"brother", "condition":"Epilepsy"},
					{"family_member_code":"mother", "condition":"Myotonic dystrophy"}
				],
				"exams":[
					{"exam_code":"eeg", "name":"Electroencephalogram (EEG)", "interpretation_code":"normal", "value":"normal"},
					{"exam_code":"emg", "name":"Electromyography (EMG)", "interpretation_code":"abnormal", "value":"HP:0003457", "value_name":"EMG abnormality", "coding_system":"HPO"},
					{"exam_code":"emg", "name":"Electromyography (EMG)", "interpretation_code":"abnormal", "value":"HP:0003458", "value_name":"EMG: myopathic abnormalities", "coding_system":"HPO"},
					{"exam_code":"other", "name":"Other", "value":"Ophthalmology consult 2026"}
				]
			},
			{
				"relationship_to_proband":"father",
				"affected_status_code":"non_affected",
				"patient_id":66,
				"first_name":"Nicolas",
				"last_name":"Fortin",
				"date_of_birth":"1987-02-20T00:00:00Z",
				"life_status_code":"alive",
				"sex_code":"male",
				"submitter_patient_id":"MRN-283838",
				"jhn":"FOR8702204321",
				"organization_code":"CHUSJ",
				"organization_name":"Centre hospitalier universitaire Sainte-Justine"
			},
			{
				"relationship_to_proband":"fetus",
				"affected_status_code":"unknown",
				"fetus_id":4,
				"last_menstrual_period":"2026-03-01T00:00:00Z",
				"life_status_code":"alive",
				"sex_code":"male",
				"observed_phenotypes":[{"id":"HP:0001631", "onset_code":"antenatal"}],
				"notes":["Findings on the second-trimester ultrasound"],
				"exams":[
					{"exam_code":"eeg", "name":"Electroencephalogram (EEG)", "interpretation_code":"abnormal", "value":"abnormal"},
					{"exam_code":"other", "name":"Other", "interpretation_code":"abnormal", "value":"Bilateral ventriculomegaly"}
				]
			}
		],
		"tasks":[],
		"has_igv_files":false
	}`
	assertCaseEntityHandler(t, "simple", 74, expected)
}

func Test_CaseEntityHandler(t *testing.T) {
	expected := `{
		"sequencing_experiments":[
			{"affected_status_code":"affected", "experimental_strategy_code":"wgs", "patient_id":3, "relationship_to_proband":"proband", "sample_id":1, "sample_submitter_id":"S13224", "sample_type_code": "dna", "seq_id":1, "status_code":"completed", "updated_on":"2021-09-12T13:08:00Z", "histology_code": "normal", "has_variants": true}, 
			{"affected_status_code":"affected", "experimental_strategy_code":"wgs", "patient_id":1, "relationship_to_proband":"mother", "sample_id":2, "sample_submitter_id":"S13225", "sample_type_code": "dna", "seq_id":2, "status_code":"completed", "updated_on":"2021-09-12T13:08:00Z", "histology_code": "normal", "has_variants": true},
			{"affected_status_code":"non_affected", "experimental_strategy_code":"wgs", "patient_id":2, "relationship_to_proband":"father", "sample_id":3, "sample_submitter_id":"S13226", "sample_type_code": "dna", "seq_id":3, "status_code":"completed", "updated_on":"2021-09-12T13:08:00Z", "histology_code": "normal", "has_variants": false}
		],
		"analysis_catalog_code":"WGA",
		"analysis_catalog_name":"Whole Genome Analysis",
		"case_category_code": "postnatal",
		"case_category_name": "Postnatal",
		"case_id":1,
		"case_type":"germline_family", 
		"created_on":"2021-09-12T13:08:00Z", 
		"members":[
			{
				"affected_status_code":"affected", 
				"date_of_birth":"1973-03-23T00:00:00Z",
				"organization_code":"CHUSJ", 
				"organization_name":"Centre hospitalier universitaire Sainte-Justine", 
				"submitter_patient_id":"MRN-283775", 
				"patient_id":3, 
				"relationship_to_proband":"proband",
				"sex_code":"male", 
				"first_name":"Marie",
				"jhn":"LAM7303233380",
				"last_name":"Lambert",
				"life_status_code":"alive",
				"non_observed_phenotypes": [{"id": "HP:0000717", "name": "Autism", "onset_code": "childhood"}, {"id": "HP:0001263", "name": "Global developmental delay", "onset_code": "childhood"}]
			},
			{
				"affected_status_code":"affected", 
				"date_of_birth":"2012-02-03T00:00:00Z", 
				"organization_code":"CHUSJ", 
				"organization_name":"Centre hospitalier universitaire Sainte-Justine", 
				"submitter_patient_id":"MRN-283773", 
				"patient_id":1, 
				"relationship_to_proband":"mother",
				"sex_code":"female",
				"first_name":"Juliette",
				"jhn":"GAG1202030277",
				"last_name":"Gagnon",
				"life_status_code":"alive"
			},
			{
				"affected_status_code":"non_affected", 
				"date_of_birth":"1970-01-30T00:00:00Z", 
				"organization_code":"CHUSJ", 
				"organization_name":"Centre hospitalier universitaire Sainte-Justine", 
				"submitter_patient_id":"MRN-283774", 
				"patient_id":2, 
				"relationship_to_proband":"father", 
				"sex_code":"male",
				"first_name":"Antoine",
				"jhn":"LEF7001303889",
				"last_name":"Lefebvre",
				"life_status_code":"alive"
			}
		], 
		"note": "Administrative comment",
		"diagnosis_lab_code": "CQGC",
		"diagnosis_lab_name": "Quebec Clinical Genomic Center",
		"has_igv_files": true,
		"panel_code": "EPILEP",
		"panel_name": "Epilepsy",		
		"prescriber": "Felix Laflamme",
		"primary_condition_id": "MONDO:0700092",
		"primary_condition_name": "neurodevelopmental disorder",
		"priority_code": "routine",
		"project_code": "N1",
		"project_name": "NeuroDev Phase I",
		"ordering_organization_code": "CHUSJ",
		"ordering_organization_name": "Centre hospitalier universitaire Sainte-Justine",
		"status_code":"in_progress", 
		"tasks":[
			{"id": 1, "type_code": "alignment_germline_variant_calling", "type_name": "Genome Alignment and Germline Variant Calling", "created_on": "2021-10-12T13:08:00Z", "patients": ["proband"]},
			{"id": 2, "type_code": "alignment_germline_variant_calling", "type_name": "Genome Alignment and Germline Variant Calling", "created_on": "2021-10-12T13:08:00Z", "patients": ["mother"]},
			{"id": 3, "type_code": "alignment_germline_variant_calling", "type_name": "Genome Alignment and Germline Variant Calling", "created_on": "2021-10-12T13:08:00Z", "patients": ["father"]},
			{"id": 4, "type_code": "family_variant_calling", "type_name": "Family Joint Genotyping", "created_on": "2021-10-12T13:08:00Z", "patients": ["father", "mother", "proband"]},
			{"id": 5, "type_code": "radiant_germline_annotation", "type_name": "RADIANT Germline Annotation", "created_on": "2021-10-12T13:08:00Z", "patients": ["father", "mother", "proband"]},
			{"id": 6, "type_code": "exomiser", "type_name": "Exomiser", "created_on": "2021-10-12T13:08:00Z", "patients": ["proband"]},
			{"id": 7, "type_code": "exomiser", "type_name": "Exomiser", "created_on": "2021-10-12T13:08:00Z", "patients": ["mother"]},
			{"id": 8, "type_code": "exomiser", "type_name": "Exomiser", "created_on": "2021-10-12T13:08:00Z", "patients": ["father"]}
		],
		"updated_on":"2021-09-12T13:08:00Z"
	}`
	assertCaseEntityHandler(t, "simple", 1, expected)
}

func assertCaseEntityDocumentsSearchHandler(t *testing.T, data string, caseId int, body string, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewDocumentsRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.POST("/:tenant/cases/:case_id/documents/search", server.CaseEntityDocumentsSearchHandler(repo))

		req, _ := http.NewRequest("POST", fmt.Sprintf("/radiant/cases/%d/documents/search", caseId), bytes.NewBuffer([]byte(body)))
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
				"document_id":47, 
				"format_code":"cram", 
				"name":"FI0037732.S14857.cram", 
				"patient_id":60, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"proband", 
				"size":1.02778567393e+11, 
				"submitter_sample_id":"S14857", 
				"task_id":68
			}, {
				"case_id":21, 
				"created_on":"2021-09-12T13:08:00Z",
				"data_type_code":"alignment", 
				"document_id":59, 
				"format_code":"cram", 
				"name":"FI0037755.S14858.cram", 
				"patient_id":61, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband_code":"mother", 
				"size":1.03970420817e+11, 
				"submitter_sample_id":"S14858", 
				"task_id":69
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

func assertCaseEntityDocumentsFiltersHandler(t *testing.T, data string, caseId int, expected string) {
	testutils.RunTest(t, testutils.Need{Starrocks: data}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewDocumentsRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/cases/:case_id/documents/filters", server.CaseEntityDocumentsFiltersHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/radiant/cases/%d/documents/filters", caseId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_CaseEntityDocumentsFiltersHandler(t *testing.T) {
	expected := `{
		"data_type_code":[
			{"key":"aggqc", "label":"Aggregate Quality Control Report"},
			{"key":"alignment", "label":"Aligned Reads"},
			{"key":"clinical_report", "label":"Clinical Report"},
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
			{"key":"vcf", "label":"VCF File"},
			{"key":"zip", "label":"ZIP Archive File"}
		], 
		"relationship_to_proband_code":[
			{"key":"brother", "label":"Brother"},
			{"key":"father", "label":"Father"},
			{"key":"fetus", "label":"Fetus"},
			{"key":"mother", "label":"Mother"},
			{"key":"proband", "label":"Proband"},
			{"key":"sibling", "label":"Sibling"}, 
			{"key":"sister", "label":"Sister"}
		]}`
	assertCaseEntityDocumentsFiltersHandler(t, "simple", 21, expected)
}
