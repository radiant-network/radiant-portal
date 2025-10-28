package server

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) GetOccurrences(int, types.ListQuery) ([]types.GermlineSNVOccurrence, error) {
	return []types.GermlineSNVOccurrence{
		{
			SeqId:              1,
			TaskId:             1,
			LocusId:            "1000",
			Locus:              "1_1_1000",
			Filter:             "PASS",
			Zygosity:           "HET",
			PfWgs:              0.99,
			PcWgs:              3,
			Hgvsg:              "hgvsg1",
			AdRatio:            1.0,
			VariantClass:       "class1",
			Rsnumber:           "rs111111111",
			AaChange:           "p.Arg19His",
			PickedConsequences: []string{"splice acceptor"},
			GenotypeQuality:    1,
			GnomadV3Af:         0.1,
			Chromosome:         "1",
			Start:              1,
			HasInterpretation:  true,
			MaxImpactScore:     4,
		},
	}, nil
}

func (m *MockRepository) CountOccurrences(int, types.CountQuery) (int64, error) {
	return 15, nil
}

func (m *MockRepository) AggregateOccurrences(int, types.AggQuery) ([]types.Aggregation, error) {
	return []types.Aggregation{
			{Bucket: "HET", Count: 2},
			{Bucket: "HOM", Count: 1},
		},
		nil
}

func (m *MockRepository) GetStatisticsOccurrences(int, types.StatisticsQuery) (*types.Statistics, error) {
	return &types.Statistics{
			Min:  0,
			Max:  100,
			Type: types.IntegerType,
		},
		nil
}

func (m *MockRepository) GetExpandedOccurrence(int, int) (*types.ExpandedGermlineSNVOccurrence, error) {
	return &types.ExpandedGermlineSNVOccurrence{
		LocusId:                          "1000",
		Locus:                            "locus1",
		Chromosome:                       "1",
		Hgvsg:                            "hgvsg1",
		SiftPred:                         "T",
		SiftScore:                        0.1,
		FathmmPred:                       "T",
		FathmmScore:                      0.1,
		RevelScore:                       0.1,
		CaddScore:                        0.1,
		CaddPhred:                        0.1,
		SpliceaiDs:                       0.1,
		SpliceaiType:                     []string{"AG"},
		GnomadPli:                        0.1,
		GnomadLoeuf:                      0.1,
		GnomadV3Af:                       0.01,
		Filter:                           "PASS",
		Gq:                               100,
		Consequences:                     []string{"splice acceptor"},
		CaseId:                           1,
		TranscriptId:                     "T001",
		InterpretationClassificationCode: "LA6668-3",
		InterpretationClassification:     "pathogenic",
	}, nil
}

func Test_OccurrencesListHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/germline/snv/:seq_id/list", OccurrencesGermlineSNVListHandler(repo))
	body := `{
			"additional_fields":[
				"seq_id","task_id","locus_id","filter","zygosity","pf_wgs","pc_wgs","af","hgvsg","ad_ratio","variant_class", "rsnumber", "aa_change", "picked_consequences"
			]
	}`
	req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/list", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
        "seq_id": 1,
		"task_id": 1,
		"chromosome": "1",
		"start": 1,
        "is_canonical":false,
		"is_mane_plus":false,
		"is_mane_select":false,
		"locus_id": "1000",
		"locus": "1_1_1000",
        "filter": "PASS",
        "zygosity": "HET",
        "pf_wgs": 0.99,
        "pc_wgs": 3,
        "hgvsg": "hgvsg1",
        "ad_ratio": 1.0,
        "variant_class": "class1",
		"rsnumber": "rs111111111",
		"aa_change": "p.Arg19His",
		"picked_consequences": ["splice acceptor"],
		"genotype_quality": 1,
		"gnomad_v3_af":0.1,
		"has_interpretation": true,
		"max_impact_score":4,
		"exomiser_moi": "",
		"exomiser_acmg_classification": "",
		"exomiser_acmg_evidence": null,
		"exomiser_gene_combined_score": 0,
        "exomiser_variant_score": 0
    }]`, w.Body.String())
}

func Test_OccurrencesCountHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/germline/snv/:seq_id/count", OccurrencesGermlineSNVCountHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/count", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"count":15}`, w.Body.String())
}

func Test_OccurrencesAggregateHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/germline/snv/:seq_id/aggregate", OccurrencesGermlineSNVAggregateHandler(repo))

	body := `{
			"field": "zygosity",
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		    },
			"size": 10
	}`
	req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/aggregate", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"key": "HET", "count": 2}, {"key": "HOM", "count": 1}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_OccurrencesStatisticsHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/germline/snv/:seq_id/statistics", OccurrencesGermlineSNVStatisticsHandler(repo))

	body := `{
			"field": "pf_wgs",
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		    }
	}`
	req, _ := http.NewRequest("POST", "/occurrences/germline/snv/1/statistics", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `{"min": 0, "max": 100, "type": "integer"}`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetExpandedOccurrenceHandler_withExomiserACMGCounts(t *testing.T) {
	repo := &MockRepository{}
	exomiserRepo := &MockExomiserRepository{}
	interpretationRepo := &MockRepository{}
	router := gin.Default()
	router.GET("/occurrences/germline/snv/:seq_id/:locus_id/expanded", GetExpandedGermlineSNVOccurrence(repo, exomiserRepo, interpretationRepo))

	req, _ := http.NewRequest("GET", "/occurrences/germline/snv/1/1000/expanded", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"cadd_phred":0.1, 
		"cadd_score":0.1,
		"case_id": 1,
		"chromosome":"1",
		"exomiser_acmg_classification_counts":{"Benign":2, "Pathogenic":1},
		"fathmm_pred":"T",
		"fathmm_score":0.1, 
		"filter":"PASS", 
		"genotype_quality":100, 
		"gnomad_loeuf":0.1, 
		"gnomad_pli":0.1, 
		"gnomad_v3_af":0.01, 
		"hgvsg":"hgvsg1", 
		"interpretation_classification": "pathogenic",
		"interpretation_classification_counts":{"benign":2, "pathogenic":1},
		"is_canonical":false,
		"is_mane_plus":false,
		"is_mane_select":false,
		"locus_id":"1000",
		"locus": "locus1",
		"picked_consequences":["splice acceptor"], 
		"revel_score":0.1, 
		"sift_pred":"T", 
		"sift_score":0.1, 
		"spliceai_ds":0.1, 
		"spliceai_type":["AG"],
		"transcript_id": "T001",
		"exomiser_acmg_evidence": null,
		"exomiser_gene_combined_score": 0
	}`, w.Body.String())
}

func Test_GetExpandedOccurrenceHandler_emptyExomiserACMGCounts(t *testing.T) {
	repo := &MockRepository{}
	exomiserRepo := &MockEmptyExomiserRepository{}
	interpretationRepo := &MockRepository{}
	router := gin.Default()
	router.GET("/occurrences/germline/snv/:seq_id/:locus_id/expanded", GetExpandedGermlineSNVOccurrence(repo, exomiserRepo, interpretationRepo))

	req, _ := http.NewRequest("GET", "/occurrences/germline/snv/1/1000/expanded", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"cadd_phred":0.1, 
		"cadd_score":0.1,
		"case_id": 1,
		"chromosome":"1",
		"fathmm_pred":"T",
		"fathmm_score":0.1, 
		"filter":"PASS", 
		"genotype_quality":100, 
		"gnomad_loeuf":0.1, 
		"gnomad_pli":0.1, 
		"gnomad_v3_af":0.01, 
		"hgvsg":"hgvsg1", 
		"interpretation_classification": "pathogenic",
		"interpretation_classification_counts":{"benign":2, "pathogenic":1},
		"is_canonical":false,
		"is_mane_plus":false,
		"is_mane_select":false,
		"locus_id":"1000",
		"locus": "locus1",
		"picked_consequences":["splice acceptor"], 
		"revel_score":0.1, 
		"sift_pred":"T", 
		"sift_score":0.1, 
		"spliceai_ds":0.1, 
		"spliceai_type":["AG"],
		"transcript_id": "T001",
		"exomiser_acmg_evidence": null,
		"exomiser_gene_combined_score": 0
	}`, w.Body.String())
}

type MockFacetsRepository struct{}

func (m *MockFacetsRepository) GetFacets(facetNames []string) ([]types.Facet, error) {
	for _, name := range facetNames {
		if name != "variant_class" && name != "lrt_pred" {
			return nil, fmt.Errorf("error")
		}
	}

	return []types.Facet{
		{
			Name: "variant_class",
			Values: []string{
				"insertion",
				"deletion",
				"SNV",
				"indel",
				"substitution",
				"sequence_alteration",
			},
		},
		{
			Name: "lrt_pred",
			Values: []string{
				"D",
				"N",
				"U",
			},
		},
	}, nil
}

func Test_GetGermlineSNVDictionaryHandler_withFacets(t *testing.T) {
	repo := &MockFacetsRepository{}
	router := gin.Default()
	router.GET("/occurrences/germline/snv/dictionary", GetGermlineSNVDictionary(repo))

	req, _ := http.NewRequest("GET", "/occurrences/germline/snv/dictionary?facets=variant_class&facets=lrt_pred", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[
		{
			"name": "variant_class",
			"values": [
				"insertion", 
				"deletion", 
				"SNV", 
				"indel", 
				"substitution",
				"sequence_alteration"
			]
		},
		{
			"name": "lrt_pred",
			"values": [
				"D", 
				"N", 
				"U"
			]
		}
	]`, w.Body.String())
}

func Test_GetGermlineSNVDictionaryHandler_facetNotFound(t *testing.T) {
	repo := &MockFacetsRepository{}
	router := gin.Default()
	router.GET("/occurrences/germline/snv/dictionary", GetGermlineSNVDictionary(repo))

	req, _ := http.NewRequest("GET", "/occurrences/germline/snv/dictionary?facets=invalid", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{
    			"status": 404,
    			"message": "facet not found"
		}`, w.Body.String())
}
