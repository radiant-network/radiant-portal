package server

import (
	"bytes"
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"
)

func (m *MockRepository) GetVariantHeader(int) (*types.VariantHeader, error) {
	return &types.VariantHeader{
		Hgvsg:           "hgvsg1",
		AssemblyVersion: "GRCh38",
		Source:          []string{"WGS"},
	}, nil
}

func (m *MockRepository) GetVariantOverview(int) (*types.VariantOverview, error) {
	return &types.VariantOverview{
		Locus:        "locus1",
		PfWgs:        0.99,
		PcWgs:        3,
		SiftPred:     "T",
		SiftScore:    0.1,
		FathmmPred:   "T",
		FathmmScore:  0.1,
		RevelScore:   0.1,
		CaddScore:    0.1,
		CaddPhred:    0.1,
		SpliceaiDs:   0.1,
		SpliceaiType: []string{"AG"},
		GnomadPli:    0.1,
		GnomadLoeuf:  0.1,
		GnomadV3Af:   0.01,
		Consequences: []string{"splice acceptor"},
	}, nil
}

func (r *MockRepository) GetVariantConsequences(int) (*[]types.VariantConsequence, error) {
	var transcriptsBRAF = []types.Transcript{{TranscriptId: "T001"}, {TranscriptId: "T002"}}
	var transcriptsBRAC = []types.Transcript{{TranscriptId: "T003"}}
	return &[]types.VariantConsequence{
		{Symbol: "BRAF", IsPicked: true, Transcripts: transcriptsBRAF},
		{Symbol: "BRAC", IsPicked: false, Transcripts: transcriptsBRAC},
	}, nil
}

func (m *MockRepository) GetVariantInterpretedCases(int, types.ListQuery) (*[]types.VariantInterpretedCase, *int64, error) {
	var count = int64(3)
	return &[]types.VariantInterpretedCase{
		{CaseId: 1, SeqId: 1, TranscriptId: "T002",
			InterpretationUpdatedOn: time.Date(2025, 6, 30, 15, 51, 29, 0, time.UTC),
			ConditionId:             "MONDO:0000002", ConditionName: "blood vessel neoplasm", Classification: "benign",
			ClassificationCode: "LA6675-8", Zygosity: "HET",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "active",
			Phenotypes: types.JsonArray[types.Term]{{ID: "HP:0100622", Name: "Maternal seizure"}}},
		{CaseId: 1, SeqId: 2, TranscriptId: "T001",
			InterpretationUpdatedOn: time.Date(2025, 6, 27, 19, 51, 0, 0, time.UTC),
			ConditionId:             "MONDO:0000001", ConditionName: "blood group incompatibility", Classification: "likelyPathogenic",
			ClassificationCode: "LA26332-9", Zygosity: "HET",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "active", Phenotypes: make(types.JsonArray[types.Term], 0)},
		{CaseId: 1, SeqId: 1, TranscriptId: "T001",
			InterpretationUpdatedOn: time.Date(2025, 5, 23, 14, 57, 36, 0, time.UTC),
			ConditionId:             "MONDO:0000001", ConditionName: "blood group incompatibility", Classification: "pathogenic",
			ClassificationCode: "LA6668-3", Zygosity: "HET",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "active", Phenotypes: make(types.JsonArray[types.Term], 0)},
	}, &count, nil
}

func (m *MockRepository) GetVariantUninterpretedCases(int, types.ListQuery) (*[]types.VariantUninterpretedCase, *int64, error) {
	var count = int64(3)
	return &[]types.VariantUninterpretedCase{
		{CaseId: 3,
			PrimaryConditionId: "MONDO:0700092", PrimaryConditionName: "neurodevelopmental disorder",
			CreatedOn:        time.Date(2021, 9, 12, 12, 8, 0, 0, time.UTC),
			UpdatedOn:        time.Date(2021, 9, 12, 12, 8, 0, 0, time.UTC),
			Zygosity:         "HET",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "incomplete", Phenotypes: make(types.JsonArray[types.Term], 0)},
		{CaseId: 4,
			PrimaryConditionId: "MONDO:0700092", PrimaryConditionName: "neurodevelopmental disorder",
			CreatedOn:        time.Date(2021, 9, 12, 12, 8, 0, 0, time.UTC),
			UpdatedOn:        time.Date(2021, 9, 12, 12, 8, 0, 0, time.UTC),
			Zygosity:         "HOM",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "incomplete", Phenotypes: make(types.JsonArray[types.Term], 0)},
		{CaseId: 5,
			PrimaryConditionId: "MONDO:0700092", PrimaryConditionName: "neurodevelopmental disorder",
			CreatedOn:        time.Date(2021, 9, 12, 12, 8, 0, 0, time.UTC),
			UpdatedOn:        time.Date(2021, 9, 12, 12, 8, 0, 0, time.UTC),
			Zygosity:         "HOM",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "active",
			Phenotypes: types.JsonArray[types.Term]{{ID: "HP:0100622", Name: "Maternal seizure"}, {ID: "HP:0001562", Name: "Oligohydramnios"}}},
	}, &count, nil
}

func (m *MockRepository) GetVariantExpendedInterpretedCase(int, int, string) (*types.VariantExpendedInterpretedCase, error) {
	return &types.VariantExpendedInterpretedCase{
		PatientID:               3,
		GeneSymbol:              "BRAF",
		ClassificationCriterias: types.JsonArray[string]{"PM1", "PM2"},
		Inheritances:            types.JsonArray[string]{"autosomal_dominant_de_novo"},
		PatientSexCode:          "male",
		PubmedIDs:               types.JsonArray[string]{},
	}, nil
}

func (m *MockRepository) GetVariantCasesCount(int) (*types.VariantCasesCount, error) {
	return &types.VariantCasesCount{
		CountTotalCases:         int64(4),
		CountInterpretedCases:   int64(1),
		CountUninterpretedCases: int64(3),
		CountInterpretations:    int64(3),
	}, nil
}

func (m *MockRepository) GetVariantCasesFilters() (*types.VariantCasesFilters, error) {
	return &types.VariantCasesFilters{
		Classification: []types.Aggregation{
			{Bucket: "LA6668-3", Label: "pathogenic"},
			{Bucket: "LA26332-9", Label: "likelyPathogenic"},
			{Bucket: "LA26333-7", Label: "vus"},
			{Bucket: "LA26334-5", Label: "likelyBenign"},
			{Bucket: "LA6675-8", Label: "benign"},
		},
		CaseAnalysis: []types.Aggregation{
			{Bucket: "WGA", Label: "Whole Genome Analysis"},
			{Bucket: "IDGD", Label: "Intellectual Deficiency and Global Developmental Delay"},
		},
		PerformerLab: []types.Aggregation{
			{Bucket: "CHOP", Label: "Children Hospital of Philadelphia"},
			{Bucket: "CHUSJ", Label: "Centre hospitalier universitaire Sainte-Justine"},
		},
	}, nil
}

func (m *MockRepository) GetVariantGenePanelConditions(panelType string, locusId int, conditionFilter string) (*types.GenePanelConditions, error) {
	conditions := make(map[string][]types.GenePanelCondition)
	conditions["BRAF"] = []types.GenePanelCondition{{Symbol: "BRAF", PanelName: "Name 1", PanelID: "1"}, {Symbol: "BRAF", PanelName: "Name 2", PanelID: "2"}}
	conditions["BRCA2"] = []types.GenePanelCondition{{Symbol: "BRCA2", PanelName: "Name 3", PanelID: "3", InheritanceCode: []string{"AD", "AR"}}}

	return &types.GenePanelConditions{
		Count:      3,
		Conditions: conditions,
	}, nil
}

func (m *MockRepository) GetVariantClinvarConditions(locusId int) ([]types.ClinvarRCV, error) {
	return []types.ClinvarRCV{
		{
			LocusId:              strconv.Itoa(locusId),
			ClinvarId:            "123456",
			Accession:            "RCV000123456",
			ClinicalSignificance: types.JsonArray[string]{"Pathogenic"},
			DateLastEvaluated:    time.Date(2023, 1, 1, 0, 0, 0, 0, time.UTC),
			SubmissionCount:      1,
			ReviewStatus:         "criteria_provided",
			ReviewStatusStars:    3,
			Version:              1,
			Traits:               types.JsonArray[string]{"Trait1", "Trait2"},
			Origins:              types.JsonArray[string]{"somatic"},
		},
	}, nil
}

func Test_GetVariantHeaderHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/:locus_id/header", GetGermlineVariantHeader(repo))

	req, _ := http.NewRequest("GET", "/variants/1000/header", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"hgvsg":"hgvsg1", "assembly_version": "GRCh38", "source": ["WGS"]}`, w.Body.String())
}

func Test_GetVariantOverviewHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/:locus_id/overview", GetGermlineVariantOverview(repo))

	req, _ := http.NewRequest("GET", "/variants/1000/overview", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"cadd_phred":0.1,
		"cadd_score":0.1,
		"fathmm_pred":"T",
		"fathmm_score":0.1,
		"gnomad_loeuf":0.1,
		"gnomad_pli":0.1,
		"gnomad_v3_af":0.01,
		"is_canonical":false,
		"is_mane_select":false, 
		"locus":"locus1",
		"pc_wgs":3, "pf_wgs":0.99,
		"picked_consequences":["splice acceptor"],
		"revel_score":0.1,
		"sift_pred":"T",
		"sift_score":0.1,
		"spliceai_ds":0.1,
		"spliceai_type":["AG"]
	}`, w.Body.String())
}

func Test_GetVariantConsequencesHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/:locus_id/consequences", GetGermlineVariantConsequences(repo))

	req, _ := http.NewRequest("GET", "/variants/1000/consequences", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[
		{
			"symbol":"BRAF",
			"is_picked": true,
			"transcripts":[
				{"is_canonical":false, "is_mane_plus":false, "is_mane_select":false, "transcript_id": "T001"},
				{"is_canonical":false, "is_mane_plus":false, "is_mane_select":false, "transcript_id": "T002"}
			]
		}, 
		{
			"symbol":"BRAC",
			"is_picked": false, 
			"transcripts":[
				{"is_canonical":false, "is_mane_plus":false, "is_mane_select":false, "transcript_id": "T003"}
			]
		}
	]`, w.Body.String())
}

func Test_GetGermlineVariantInterpretedCasesHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/variants/germline/:locus_id/cases/interpreted", GetGermlineVariantInterpretedCases(repo))
	body := `{}`
	req, _ := http.NewRequest("POST", "/variants/germline/1000/cases/interpreted", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"list":[
			{
				"case_analysis_code":"WGA", 
				"case_analysis_name":"Whole Genome Analysis", 
				"case_id":1, 
				"classification":"benign", 
				"condition_id":"MONDO:0000002", 
				"condition_name":"blood vessel neoplasm", 
				"interpretation_updated_on":"2025-06-30T15:51:29Z", 
				"observed_phenotypes": [{"id": "HP:0100622", "name": "Maternal seizure"}],
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"seq_id":1, 
				"status_code":"active", 
				"transcript_id":"T002", 
				"zygosity":"HET"
			}, {
				"case_analysis_code":"WGA", 
				"case_analysis_name":"Whole Genome Analysis", 
				"case_id":1, 
				"classification":"likelyPathogenic", 
				"condition_id":"MONDO:0000001", 
				"condition_name":"blood group incompatibility", 
				"interpretation_updated_on":"2025-06-27T19:51:00Z",
				"observed_phenotypes": [],
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"seq_id":2, 
				"status_code":"active", 
				"transcript_id":"T001", 
				"zygosity":"HET"
			}, {
				"case_analysis_code":"WGA", 
				"case_analysis_name":"Whole Genome Analysis", 
				"case_id":1, 
				"classification":"pathogenic", 
				"condition_id":"MONDO:0000001", 
				"condition_name":"blood group incompatibility", 
				"interpretation_updated_on":"2025-05-23T14:57:36Z",
				"observed_phenotypes": [],
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"seq_id":1, 
				"status_code":"active", 
				"transcript_id":"T001", 
				"zygosity":"HET"
			}
		],
		"count": 3
	}`, w.Body.String())
}

func Test_GetExpendedGermlineVariantInterpretedCaseHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/germline/:locus_id/cases/interpreted/:seq_id/:transcript_id", GetExpendedGermlineVariantInterpretedCase(repo))

	req, _ := http.NewRequest("GET", "/variants/germline/1000/cases/interpreted/1/T002", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"classification_criterias":["PM1","PM2"],
		"gene_symbol":"BRAF",
		"inheritances":["autosomal_dominant_de_novo"],
		"interpretation":"",
		"interpreter_name":"", 
		"patient_id":3, 
		"patient_sex_code":"male", 
		"pubmed_ids":[]
	}`, w.Body.String())
}

func Test_GetGermlineVariantUninterpretedCasesHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/variants/germline/:locus_id/cases/uninterpreted", GetGermlineVariantUninterpretedCases(repo))
	body := `{}`
	req, _ := http.NewRequest("POST", "/variants/germline/1000/cases/uninterpreted", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"list": [
			{
				"case_analysis_code":"WGA", 
				"case_analysis_name":"Whole Genome Analysis", 
				"case_id":3, 
				"created_on":"2021-09-12T12:08:00Z", 
				"observed_phenotypes": [],
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"primary_condition_id":"MONDO:0700092", 
				"primary_condition_name":"neurodevelopmental disorder", 
				"status_code":"incomplete", 
				"updated_on":"2021-09-12T12:08:00Z",
				"zygosity":"HET"
			}, {
				"case_analysis_code":"WGA", 
				"case_analysis_name":"Whole Genome Analysis", 
				"case_id":4, 
				"created_on":"2021-09-12T12:08:00Z", 
				"observed_phenotypes": [],
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"primary_condition_id":"MONDO:0700092", 
				"primary_condition_name":"neurodevelopmental disorder", 
				"status_code":"incomplete", 
				"updated_on":"2021-09-12T12:08:00Z",
				"zygosity":"HOM"
			}, {
				"case_analysis_code":"WGA", 
				"case_analysis_name":"Whole Genome Analysis", 
				"case_id":5, 
				"created_on":"2021-09-12T12:08:00Z", 
				"observed_phenotypes": [{"id": "HP:0100622", "name": "Maternal seizure"}, {"id": "HP:0001562", "name": "Oligohydramnios"}],
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"primary_condition_id":"MONDO:0700092", 
				"primary_condition_name":"neurodevelopmental disorder", 
				"status_code":"active", 
				"updated_on":"2021-09-12T12:08:00Z",
				"zygosity":"HOM"
			}
		],
		"count": 3
	}`, w.Body.String())
}

func Test_GetGermlineVariantCasesCountHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/germline/:locus_id/cases/count", GetGermlineVariantCasesCount(repo))

	req, _ := http.NewRequest("GET", "/variants/germline/1000/cases/count", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"count_total_cases":4, "count_interpreted_cases": 1, "count_uninterpreted_cases": 3, "count_interpretations": 3}`, w.Body.String())
}

func Test_GetGermlineVariantCasesFiltersHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/germline/cases/filters", GetGermlineVariantCasesFilters(repo))

	req, _ := http.NewRequest("GET", "/variants/germline/cases/filters", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"case_analysis":[
			{"count": 0, "key":"WGA", "label":"Whole Genome Analysis"}, 
			{"count": 0, "key":"IDGD", "label":"Intellectual Deficiency and Global Developmental Delay"}
		],
		"classification": [
			{"count": 0, "key":"LA6668-3", "label":"pathogenic"}, 
			{"count": 0, "key":"LA26332-9", "label":"likelyPathogenic"}, 
			{"count": 0, "key":"LA26333-7", "label":"vus"}, 
			{"count": 0, "key":"LA26334-5", "label":"likelyBenign"}, 
			{"count": 0, "key":"LA6675-8", "label":"benign"} 
		],
		"performer_lab":[
			{"count": 0, "key":"CHOP", "label":"Children Hospital of Philadelphia"},
			{"count": 0, "key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"}
		]
	}`, w.Body.String())
}

func Test_GetGermlineVariantConditions(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/germline/:locus_id/conditions/:panel_type", GetGermlineVariantConditions(repo))

	req, _ := http.NewRequest("GET", "/variants/germline/1000/conditions/omim", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"count":3, 
		"conditions": { 
			"BRAF": [{"panel_id":"1", "panel_name":"Name 1"}, {"panel_id":"2", "panel_name":"Name 2"}], 
			"BRCA2": [{"panel_id":"3", "panel_name":"Name 3", "inheritance_code": ["AD", "AR"]}]
		}
	}`, w.Body.String())
}

func Test_GetGermlineVariantConditionsClinvar(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/germline/:locus_id/conditions/clinvar", GetGermlineVariantConditionsClinvar(repo))

	req, _ := http.NewRequest("GET", "/variants/germline/1000/conditions/clinvar", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"locus_id":"1000","clinvar_id":"123456","accession":"RCV000123456","clinical_significance":["Pathogenic"],"date_last_evaluated":"2023-01-01T00:00:00Z","submission_count":1,"review_status":"criteria_provided","review_status_stars":3,"version":1,"traits":["Trait1","Trait2"],"origins":["somatic"]}]`

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}
