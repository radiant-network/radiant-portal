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
			CaseID:                   1,
			ProbandID:                3,
			SubmitterProbandId:       "MRN-283775",
			PriorityCode:             "routine",
			StatusCode:               "in_progress",
			CaseTypeCode:             "germline",
			CaseType:                 "germline_family",
			AnalysisCatalogCode:      "WGA",
			AnalysisCatalogName:      "Whole Genome Analysis",
			PrimaryConditionID:       "MONDO:0700092",
			PrimaryConditionName:     "neurodevelopmental disorder",
			OrderingOrganizationCode: "CHUSJ",
			OrderingOrganizationName: "Centre hospitalier universitaire Sainte-Justine",
			ProjectCode:              "N1",
			ProjectName:              "NeuroDev Phase I",
			CreatedOn: time.Date(
				2000, 1, 1, 0, 0, 0, 0, time.UTC),
			UpdatedOn: time.Date(
				2000, 2, 2, 0, 0, 0, 0, time.UTC),
			Prescriber:       "Felix Laflamme",
			DiagnosisLabCode: "CQGC",
			DiagnosisLabName: "Quebec Clinical Genomic Center",
			OrganizationCode: "CHUSJ",
			OrganizationName: "Centre hospitalier universitaire Sainte-Justine",
			HasVariants:      true,
		},
	}, &count, nil
}

func (m *MockRepository) SearchById(prefix string, limit int) (*[]types.AutocompleteResult, error) {
	var result = []types.AutocompleteResult{
		{Type: "case_id", Value: "1"},
		{Type: "patient_id", Value: "10"},
		{Type: "case_id", Value: "10"},
	}
	return &result, nil
}

func (m *MockRepository) GetCasesFilters() (*types.CaseFilters, error) {
	var result = types.CaseFilters{
		Status: []types.FiltersValue{
			{Key: "draft", Label: "Draft"},
			{Key: "in_progress", Label: "In Progress"},
			{Key: "revoke", Label: "Revoke"},
		},
		Priority: []types.FiltersValue{
			{Key: "routine", Label: "Routine"},
			{Key: "asap", Label: "Asap"},
			{Key: "stat", Label: "Stat"},
		},
		AnalysisCatalog: []types.FiltersValue{
			{Key: "WGA", Label: "Whole Genome Analysis"},
			{Key: "IDGD", Label: "Intellectual Deficiency and Global Developmental Delay"},
		},
		Project: []types.FiltersValue{
			{Key: "N1", Label: "NeuroDev Phase I"},
			{Key: "N2", Label: "NeuroDev Phase II"},
		},
		DiagnosisLab: []types.FiltersValue{
			{Key: "CHOP", Label: "Children Hospital of Philadelphia"},
			{Key: "CHUSJ", Label: "Centre hospitalier universitaire Sainte-Justine"},
		},
		OrderingOrganization: []types.FiltersValue{
			{Key: "CHOP", Label: "Children Hospital of Philadelphia"},
			{Key: "CHUSJ", Label: "Centre hospitalier universitaire Sainte-Justine"},
		},
		Panel: []types.FiltersValue{
			{Key: "EPILEP", Label: "Epilepsy"},
			{Key: "HEART", Label: "Heart diseases"},
		},
		LifeStatus: []types.FiltersValue{
			{Key: "alive", Label: "Alive"},
			{Key: "deceased", Label: "Deceased"},
			{Key: "unknown", Label: "Unknown"},
		},
		ResolutionStatus: []types.FiltersValue{
			{Key: "inconclusive", Label: "Inconclusive"},
			{Key: "solved", Label: "Solved"},
			{Key: "unsolved", Label: "Unsolved"},
		},
		CaseCategory: []types.FiltersValue{
			{Key: "prenatal", Label: "Prenatal"},
			{Key: "postnatal", Label: "Postnatal"},
		},
		CaseType: []types.FiltersValue{
			{Key: "germline", Label: "Germline"},
			{Key: "somatic", Label: "Somatic"},
		},
	}
	return &result, nil
}

func (m *MockRepository) GetCaseEntity(caseId int) (*types.CaseEntity, error) {
	return &types.CaseEntity{
		CaseID:              1,
		AnalysisCatalogCode: "WGA",
		AnalysisCatalogName: "Whole Genome Analysis",
		CaseType:            "germline_family",
		CaseCategoryCode:    "postnatal",
		CaseCategoryName:    "Postnatal",
		CreatedOn: time.Date(
			2000, 1, 1, 0, 0, 0, 0, time.UTC),
		UpdatedOn: time.Date(
			2000, 2, 2, 0, 0, 0, 0, time.UTC),
		Prescriber:               "Felix Laflamme",
		DiagnosisLabCode:         "CQGC",
		DiagnosisLabName:         "Quebec Clinical Genomic Center",
		PrimaryConditionID:       "MONDO:0700092",
		PrimaryConditionName:     "neurodevelopmental disorder",
		OrderingOrganizationCode: "CHUSJ",
		OrderingOrganizationName: "Centre hospitalier universitaire Sainte-Justine",
		ProjectCode:              "N1",
		ProjectName:              "NeuroDev Phase I",
		PanelCode:                "EPILEP",
		PanelName:                "Epilepsy",
		SequencingExperiments: types.JsonArray[types.CaseSequencingExperiment]{
			{SeqID: 1, PatientID: 3, RelationshipToProband: "proband", AffectedStatusCode: "affected", SampleID: 1, SampleSubmitterID: "S13224", SampleTypeCode: "dna", HistologyCode: "normal", HasVariants: true},
			{SeqID: 2, PatientID: 1, RelationshipToProband: "mother", AffectedStatusCode: "affected", SampleID: 2, SampleSubmitterID: "S13225", SampleTypeCode: "dna", HistologyCode: "normal", HasVariants: true},
			{SeqID: 3, PatientID: 2, RelationshipToProband: "father", AffectedStatusCode: "non_affected", SampleID: 3, SampleSubmitterID: "S13226", SampleTypeCode: "dna", HistologyCode: "normal", HasVariants: false},
		},
		Tasks: types.JsonArray[types.CaseTask]{
			{ID: 1, TypeCode: "alignment", TypeName: "Alignment", CreatedOn: time.Date(2021, 10, 12, 13, 8, 0, 0, time.UTC), PatientCount: 3, PatientsUnparsed: "proband, mother, father", Patients: types.JsonArray[string]{"father", "mother", "proband"}},
		},
		Members: types.JsonArray[types.CasePatientClinicalInformation]{
			{PatientID: 3, FirstName: "Marie", LastName: "Lambert", RelationshipToProband: "proband", AffectedStatusCode: "affected", LifeStatusCode: "alive", SubmitterPatientId: "MRN-283775", Jhn: "LAM7303233380", SexCode: "male", OrganizationCode: "CHUSJ", OrganizationName: "Centre hospitalier universitaire Sainte-Justine", DateOfBirth: time.Date(1973, 3, 23, 0, 0, 0, 0, time.UTC), NonObservedPhenotypes: types.JsonArray[types.Term]{{ID: "HP:0000717", Name: "Autism", OnsetCode: "childhood"}, {ID: "HP:0001263", Name: "Global developmental delay", OnsetCode: "childhood"}}},
			{PatientID: 1, FirstName: "Juliette", LastName: "Gagnon", RelationshipToProband: "mother", AffectedStatusCode: "affected", LifeStatusCode: "alive", SubmitterPatientId: "MRN-283773", Jhn: "GAG1202030277", SexCode: "female", OrganizationCode: "CHUSJ", OrganizationName: "Centre hospitalier universitaire Sainte-Justine", DateOfBirth: time.Date(2012, 2, 3, 0, 0, 0, 0, time.UTC)},
			{PatientID: 2, FirstName: "Antoine", LastName: "Lefebvre", RelationshipToProband: "father", AffectedStatusCode: "non_affected", LifeStatusCode: "alive", SubmitterPatientId: "MRN-283774", Jhn: "LEF7001303889", SexCode: "male", OrganizationCode: "CHUSJ", OrganizationName: "Centre hospitalier universitaire Sainte-Justine", DateOfBirth: time.Date(1970, 1, 30, 0, 0, 0, 0, time.UTC)},
		},
	}, nil
}

func (m *MockRepository) CreateCase(*types.Case) error { return nil }

func (m *MockRepository) GetCaseBySubmitterCaseIdAndProjectId(submitterCaseId string, projectId int) (*types.Case, error) {
	return nil, nil
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
			"analysis_catalog_code":"WGA",
			"analysis_catalog_name":"Whole Genome Analysis",
			"case_type": "germline_family",
			"case_id":1,
			"created_on":"2000-01-01T00:00:00Z",
			"ordering_organization_code":"CHUSJ",
			"ordering_organization_name":"Centre hospitalier universitaire Sainte-Justine",
			"submitter_proband_id":"MRN-283775",
			"proband_id":3,
			"diagnosis_lab_code":"CQGC",
			"diagnosis_lab_name":"Quebec Clinical Genomic Center",
			"prescriber":"Felix Laflamme",
			"primary_condition_id":"MONDO:0700092",
			"primary_condition_name":"neurodevelopmental disorder",
			"priority_code":"routine",
			"project_code":"N1",
			"project_name":"NeuroDev Phase I",
			"organization_code":"CHUSJ",
			"organization_name":"Centre hospitalier universitaire Sainte-Justine",
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
}

func Test_CasesFiltersHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/cases/filters", CasesFiltersHandler(repo))

	req, _ := http.NewRequest("GET", "/cases/filters", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"analysis_catalog_code":[
			{"key":"WGA", "label":"Whole Genome Analysis"}, 
			{"key":"IDGD", "label":"Intellectual Deficiency and Global Developmental Delay"}
		], "diagnosis_lab_code":[
			{"key":"CHOP", "label":"Children Hospital of Philadelphia"},
			{"key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"}
		], "priority_code":[
			{"key":"routine", "label":"Routine"},
			{"key":"asap", "label":"Asap"},
			{"key":"stat", "label":"Stat"}
		], "project_code":[
			{"key":"N1", "label":"NeuroDev Phase I"},
			{"key":"N2", "label":"NeuroDev Phase II"}
		], "ordering_organization_code":[
			{"key":"CHOP", "label":"Children Hospital of Philadelphia"},
			{"key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"}
		], "status_code":[
			{"key":"draft", "label":"Draft"},
			{"key":"in_progress", "label":"In Progress"},
			{"key":"revoke", "label":"Revoke"}
		], "resolution_status_code":[
			{"key":"inconclusive", "label":"Inconclusive"},
			{"key":"solved", "label":"Solved"},
			{"key":"unsolved", "label":"Unsolved"}
		], "life_status_code":[
			{"key":"alive", "label":"Alive"},
			{"key":"deceased", "label":"Deceased"},
			{"key":"unknown", "label":"Unknown"}
		], "case_category_code":[
			{"key":"prenatal", "label":"Prenatal"},
			{"key":"postnatal", "label":"Postnatal"}
		], "panel_code":[
			{"key":"EPILEP", "label":"Epilepsy"},
			{"key":"HEART", "label":"Heart diseases"}
		], "case_type_code":[
			{"key":"germline", "label":"Germline"},
			{"key":"somatic", "label":"Somatic"}
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
		"sequencing_experiments":[
			{"affected_status_code":"affected", "experimental_strategy_code":"", "patient_id":3, "relationship_to_proband":"proband", "sample_id":1, "sample_submitter_id":"S13224", "sample_type_code": "dna", "seq_id":1, "status_code":"", "updated_on":"0001-01-01T00:00:00Z", "histology_code": "normal", "has_variants": true}, 
			{"affected_status_code":"affected", "experimental_strategy_code":"", "patient_id":1, "relationship_to_proband":"mother", "sample_id":2, "sample_submitter_id":"S13225", "sample_type_code": "dna", "seq_id":2, "status_code":"", "updated_on":"0001-01-01T00:00:00Z", "histology_code": "normal", "has_variants": true},
			{"affected_status_code":"non_affected", "experimental_strategy_code":"", "patient_id":2, "relationship_to_proband":"father", "sample_id":3, "sample_submitter_id":"S13226", "sample_type_code": "dna", "seq_id":3, "status_code":"", "updated_on":"0001-01-01T00:00:00Z", "histology_code": "normal", "has_variants": false}
		],
		"analysis_catalog_code":"WGA",
		"analysis_catalog_name":"Whole Genome Analysis",
		"case_category_code": "postnatal",
		"case_category_name": "Postnatal",
		"case_id":1,
		"case_type":"germline_family", 
		"created_on":"2000-01-01T00:00:00Z", 
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
		"diagnosis_lab_code":"CQGC", 
		"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
		"panel_code": "EPILEP",
		"panel_name": "Epilepsy",		
		"prescriber":"Felix Laflamme", 
		"primary_condition_id":"MONDO:0700092", 
		"primary_condition_name":"neurodevelopmental disorder", 
		"project_code": "N1",
		"project_name": "NeuroDev Phase I", 
		"ordering_organization_code":"CHUSJ", 
		"ordering_organization_name":"Centre hospitalier universitaire Sainte-Justine", 
		"status_code":"", 
		"tasks":[
			{"id": 1, "type_code": "alignment", "type_name": "Alignment", "created_on": "2021-10-12T13:08:00Z", "patients": ["father", "mother", "proband"]}
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

func Test_CaseEntityDocumentsFiltersHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/cases/:case_id/documents/filters", CaseEntityDocumentsFiltersHandler(repo))

	req, _ := http.NewRequest("GET", "/cases/1/documents/filters", bytes.NewBuffer([]byte("{}")))
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
