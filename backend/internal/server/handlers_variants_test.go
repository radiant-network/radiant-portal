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
			ConditionId:             "MONDO:0000002", ConditionName: "blood vessel neoplasm",
			Classification: "LA6675-8", Zygosity: "HET",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "active"},
		{CaseId: 1, SeqId: 2, TranscriptId: "T001",
			InterpretationUpdatedOn: time.Date(2025, 6, 27, 19, 51, 0, 0, time.UTC),
			ConditionId:             "MONDO:0000001", ConditionName: "blood group incompatibility",
			Classification: "LA26332-9", Zygosity: "HET",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "active"},
		{CaseId: 1, SeqId: 1, TranscriptId: "T001",
			InterpretationUpdatedOn: time.Date(2025, 5, 23, 14, 57, 36, 0, time.UTC),
			ConditionId:             "MONDO:0000001", ConditionName: "blood group incompatibility",
			Classification: "LA6668-3", Zygosity: "HET",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "active"},
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
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "incomplete"},
		{CaseId: 4,
			PrimaryConditionId: "MONDO:0700092", PrimaryConditionName: "neurodevelopmental disorder",
			CreatedOn:        time.Date(2021, 9, 12, 12, 8, 0, 0, time.UTC),
			UpdatedOn:        time.Date(2021, 9, 12, 12, 8, 0, 0, time.UTC),
			Zygosity:         "HOM",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "incomplete"},
		{CaseId: 5,
			PrimaryConditionId: "MONDO:0700092", PrimaryConditionName: "neurodevelopmental disorder",
			CreatedOn:        time.Date(2021, 9, 12, 12, 8, 0, 0, time.UTC),
			UpdatedOn:        time.Date(2021, 9, 12, 12, 8, 0, 0, time.UTC),
			Zygosity:         "HOM",
			PerformerLabCode: "CQGC", PerformerLabName: "Quebec Clinical Genomic Center",
			CaseAnalysisCode: "WGA", CaseAnalysisName: "Whole Genome Analysis", StatusCode: "active"},
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
				"classification":"LA6675-8", 
				"condition_id":"MONDO:0000002", 
				"condition_name":"blood vessel neoplasm", 
				"interpretation_updated_on":"2025-06-30T15:51:29Z", 
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
				"classification":"LA26332-9", 
				"condition_id":"MONDO:0000001", 
				"condition_name":"blood group incompatibility", 
				"interpretation_updated_on":"2025-06-27T19:51:00Z", 
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
				"classification":"LA6668-3", 
				"condition_id":"MONDO:0000001", 
				"condition_name":"blood group incompatibility", 
				"interpretation_updated_on":"2025-05-23T14:57:36Z", 
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
