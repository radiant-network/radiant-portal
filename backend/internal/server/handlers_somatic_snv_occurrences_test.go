package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type MockSomaticSNVOccurrencesRepository struct{}

func (m *MockSomaticSNVOccurrencesRepository) CountOccurrences(caseId int, seqId int, userQuery types.CountQuery) (int64, error) {
	return 1111, nil
}

func (m *MockSomaticSNVOccurrencesRepository) AggregateOccurrences(caseId int, seqId int, userQuery types.AggQuery) ([]repository.Aggregation, error) {
	return []types.Aggregation{
			{Bucket: "insertion", Count: 479564},
			{Bucket: "deletion", Count: 495942},
		},
		nil
}

func (m *MockSomaticSNVOccurrencesRepository) GetStatisticsOccurrences(caseId int, seqId int, userQuery types.StatisticsQuery) (*repository.Statistics, error) {
	return &types.Statistics{
			Min:  0,
			Max:  100,
			Type: types.IntegerType,
		},
		nil
}

func (m *MockSomaticSNVOccurrencesRepository) GetExpandedOccurrence(int, int, int) (*types.ExpandedSomaticSNVOccurrence, error) {
	return &types.ExpandedSomaticSNVOccurrence{
		LocusId:    "1000",
		Locus:      "locus1",
		Chromosome: "1",
		Hgvsg:      "hgvsg1",
		Symbol:     "BRAF",
	}, nil
}

func (m *MockSomaticSNVOccurrencesRepository) GetOccurrences(int, int, types.ListQuery) ([]types.SomaticSNVOccurrence, error) {
	somaticPfTn := 0.55
	somaticPcTn := 6
	germlinePf := 0.99
	germlinePc := 3
	adRatio := float32(1.0)
	gnomadV3Af := 0.1
	isCanonical := true
	isManeSelect := true
	hotspot := true
	return []types.SomaticSNVOccurrence{
		{
			LocusId:             "1000",
			SeqId:               74,
			TaskId:              74,
			HasInterpretation:   false,
			HasNote:             false,
			Hgvsg:               "hgvsg1",
			Chromosome:          "1",
			Start:               int64(1000),
			End:                 int64(1001),
			Symbol:              "BRAF",
			AaChange:            "p.Arg19His",
			VariantClass:        "class1",
			VepImpact:           types.MODIFIER,
			PickedConsequences:  types.JsonArray[string]{"Benign", "Pathogenic"},
			IsCanonical:         &isCanonical,
			IsManeSelect:        &isManeSelect,
			Rsnumber:            "rs111111111",
			OmimInheritanceCode: types.JsonArray[string]{"code1"},
			Hotspot:             &hotspot,
			Clinvar:             types.JsonArray[string]{"splice acceptor"},
			GnomadV3Af:          &gnomadV3Af,
			GermlinePcWgs:       &germlinePc,
			GermlinePfWgs:       &germlinePf,
			SomaticPfTnWgs:      &somaticPfTn,
			SomaticPcTnWgs:      &somaticPcTn,
			AdRatio:             &adRatio,
			TranscriptId:        "T001",
		},
	}, nil
}

func Test_SomaticSNVListHandler(t *testing.T) {
	repo := &MockSomaticSNVOccurrencesRepository{}
	router := gin.Default()
	router.POST("/occurrences/somatic/snv/:case_id/:seq_id/list", OccurrencesSomaticSNVListHandler(repo))
	body := `{
			"additional_fields":[
				"ad_ratio"
			]
	}`
	req, _ := http.NewRequest("POST", "/occurrences/somatic/snv/1/1/list", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"aa_change":"p.Arg19His", 
		"ad_ratio":1, 
		"chromosome": "1",
		"clinvar":["splice acceptor"], 
		"end": 1001,
		"germline_pc_wgs":3, 
		"germline_pf_wgs":0.99, 
		"gnomad_v3_af":0.1, 
		"has_interpretation":false, 
		"has_note":false, 
		"hgvsg":"hgvsg1", 
		"hotspot": true, 
		"is_canonical":true, 
		"is_mane_plus": null, 
		"is_mane_select":true, 
		"locus_id":"1000", 
		"omim_inheritance_code":["code1"], 
		"picked_consequences":["Benign", "Pathogenic"], 
		"rsnumber":"rs111111111", 
		"seq_id":74, 
		"somatic_pc_tn_wgs":6, 
		"somatic_pf_tn_wgs":0.55, 
		"start": 1000,
		"symbol":"BRAF", 
		"task_id":74,
		"transcript_id":"T001",
		"variant_class":"class1", 
		"vep_impact":"MODIFIER"
	}]`, w.Body.String())
}

func Test_SomaticSNVCountHandler(t *testing.T) {
	repo := &MockSomaticSNVOccurrencesRepository{}
	router := gin.Default()
	router.POST("/occurrences/somatic/snv/:case_id/:seq_id/count", OccurrencesSomaticSNVCountHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/somatic/snv/1/1/count", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"count":1111}`, w.Body.String())
}

func Test_SomaticSNVAggregateHandler(t *testing.T) {
	repo := &MockSomaticSNVOccurrencesRepository{}
	facetsRepo := &MockFacetsRepository{}
	router := gin.Default()
	router.POST("/occurrences/somatic/snv/:case_id/:seq_id/aggregate", OccurrencesSomaticSNVAggregateHandler(repo, facetsRepo))

	body := `{
			"field": "variant_class",
			"sqon":{
				"op":"and",
				"content":[]
		    },
			"size": 10
	}`
	req, _ := http.NewRequest("POST", "/occurrences/somatic/snv/1/1/aggregate", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"key": "insertion", "count": 479564}, {"key": "deletion", "count": 495942}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_SomaticSNVAggregateHandler_withDictionary(t *testing.T) {
	repo := &MockSomaticSNVOccurrencesRepository{}
	facetsRepo := &MockFacetsRepository{}
	router := gin.Default()
	router.POST("/occurrences/somatic/snv/:case_id/:seq_id/aggregate", OccurrencesSomaticSNVAggregateHandler(repo, facetsRepo))

	body := `{
			"field": "variant_class",
			"sqon":{
				"op":"and",
				"content":[]
		    },
			"size": 10
	}`
	req, _ := http.NewRequest("POST", "/occurrences/somatic/snv/1/1/aggregate?with_dictionary=true", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"key": "insertion", "count": 479564}, {"key": "deletion", "count": 495942}, {"key": "SNV", "count": 0}, {"key": "indel", "count": 0}, {"key": "substitution", "count": 0}, {"key": "sequence_alteration", "count": 0}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

type MockNotFoundSomaticSNVOccurrencesRepository struct {
	MockSomaticSNVOccurrencesRepository
}

func (m *MockNotFoundSomaticSNVOccurrencesRepository) GetExpandedOccurrence(int, int, int) (*types.ExpandedSomaticSNVOccurrence, error) {
	return nil, nil
}

type MockEmptyInterpretationsRepository struct {
	MockRepository
}

func (m *MockEmptyInterpretationsRepository) RetrieveSomaticInterpretationClassificationCounts(locusId int) (types.JsonMap[string, int], error) {
	return nil, nil
}

func Test_GetExpandedSomaticSNVOccurrenceHandler_withInterpretationCounts(t *testing.T) {
	repo := &MockSomaticSNVOccurrencesRepository{}
	interpretationRepo := &MockRepository{}
	router := gin.Default()
	router.GET("/occurrences/somatic/snv/:case_id/:seq_id/:locus_id/expanded", GetExpandedSomaticSNVOccurrence(repo, interpretationRepo))

	req, _ := http.NewRequest("GET", "/occurrences/somatic/snv/1/1/1000/expanded", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"chromosome":"1",
		"end":0,
		"hgvsg":"hgvsg1",
		"interpretation_classification_counts":{"Oncogenic":2, "Likely Oncogenic":1},
		"locus":"locus1",
		"locus_id":"1000",
		"start":0,
		"symbol":"BRAF"
	}`, w.Body.String())
}

func Test_GetExpandedSomaticSNVOccurrenceHandler_emptyInterpretationCounts(t *testing.T) {
	repo := &MockSomaticSNVOccurrencesRepository{}
	interpretationRepo := &MockEmptyInterpretationsRepository{}
	router := gin.Default()
	router.GET("/occurrences/somatic/snv/:case_id/:seq_id/:locus_id/expanded", GetExpandedSomaticSNVOccurrence(repo, interpretationRepo))

	req, _ := http.NewRequest("GET", "/occurrences/somatic/snv/1/1/1000/expanded", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"chromosome":"1",
		"end":0,
		"hgvsg":"hgvsg1",
		"locus":"locus1",
		"locus_id":"1000",
		"start":0,
		"symbol":"BRAF"
	}`, w.Body.String())
}

func Test_GetExpandedSomaticSNVOccurrenceHandler_notFound(t *testing.T) {
	repo := &MockNotFoundSomaticSNVOccurrencesRepository{}
	interpretationRepo := &MockRepository{}
	router := gin.Default()
	router.GET("/occurrences/somatic/snv/:case_id/:seq_id/:locus_id/expanded", GetExpandedSomaticSNVOccurrence(repo, interpretationRepo))

	req, _ := http.NewRequest("GET", "/occurrences/somatic/snv/1/1/9999/expanded", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404, "message":"occurrence not found"}`, w.Body.String())
}

func Test_GetExpandedSomaticSNVOccurrenceHandler_invalidLocusId(t *testing.T) {
	repo := &MockSomaticSNVOccurrencesRepository{}
	interpretationRepo := &MockRepository{}
	router := gin.Default()
	router.GET("/occurrences/somatic/snv/:case_id/:seq_id/:locus_id/expanded", GetExpandedSomaticSNVOccurrence(repo, interpretationRepo))

	req, _ := http.NewRequest("GET", "/occurrences/somatic/snv/1/1/abc/expanded", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404, "message":"locus_id not found"}`, w.Body.String())
}

func Test_SomaticSNVStatisticsHandler(t *testing.T) {
	repo := &MockSomaticSNVOccurrencesRepository{}
	router := gin.Default()
	router.POST("/occurrences/somatic/snv/:case_id/:seq_id/statistics", OccurrencesSomaticSNVStatisticsHandler(repo))

	body := `{
			"field": "somatic_pf_tn_wgs",
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		    }
	}`
	req, _ := http.NewRequest("POST", "/occurrences/somatic/snv/1/1/statistics", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `{"min": 0, "max": 100, "type": "integer"}`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}
