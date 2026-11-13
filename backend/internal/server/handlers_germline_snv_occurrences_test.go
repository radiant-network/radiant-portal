package server

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) GetOccurrences(context.Context, int, int, int, types.OccurrenceListQuery) ([]types.GermlineSNVOccurrence, error) {
	hasComphet := true
	return []types.GermlineSNVOccurrence{
		{
			SeqId:              1,
			TaskId:             1,
			LocusId:            "1000",
			Locus:              "1_1_1000",
			Filter:             "PASS",
			Zygosity:           "HET",
			GermlinePfWgs:      0.99,
			GermlinePcWgs:      3,
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
			End:                2,
			HasInterpretation:  true,
			HasNote:            true,
			FlagType:           "pin",
			MaxImpactScore:     4,
			TranscriptId:       "T001",
			HasComphet:         &hasComphet,
			ComphetGenes:       types.JsonArray[types.ComphetGene]{{Symbol: "BRCA2", Nb: 2}},
		},
	}, nil
}

func (m *MockRepository) CountOccurrences(context.Context, int, int, int, types.OccurrenceCountQuery) (types.OccurrenceCount, error) {
	return types.OccurrenceCount{Count: 15, FilteredCount: 4}, nil
}

func (m *MockRepository) AggregateOccurrences(context.Context, int, int, int, types.AggQuery) ([]types.Aggregation, error) {
	return []types.Aggregation{
			{Bucket: "insertion", Count: 479564},
			{Bucket: "deletion", Count: 495942},
		},
		nil
}

func (m *MockRepository) GetStatisticsOccurrences(context.Context, int, int, int, types.StatisticsQuery) (*types.Statistics, error) {
	return &types.Statistics{
			Min:  0,
			Max:  100,
			Type: types.IntegerType,
		},
		nil
}

func (m *MockRepository) GetExpandedOccurrence(context.Context, int, int, int, int) (*types.ExpandedGermlineSNVOccurrence, error) {
	return &types.ExpandedGermlineSNVOccurrence{
		LocusId:            "1000",
		Locus:              "locus1",
		Chromosome:         "1",
		Hgvsg:              "hgvsg1",
		SiftPred:           "T",
		SiftScore:          0.1,
		FathmmPred:         "T",
		FathmmScore:        0.1,
		RevelScore:         0.1,
		CaddScore:          0.1,
		CaddPhred:          0.1,
		LrtPred:            "U",
		LrtScore:           float32(0.01),
		Polyphen2HvarPred:  "D",
		Polyphen2HvarScore: float32(0.991),
		SpliceaiDs:         0.1,
		SpliceaiType:       []string{"AG"},
		GnomadPli:          0.1,
		GnomadLoeuf:        0.1,
		GnomadV3Af:         0.01,
		Filter:             "PASS",
		Gq:                 100,
		Consequences:       []string{"splice acceptor"},
		TranscriptId:       "T001",
		Symbol:             "BRAF",
		EnsemblGeneId:      "ENSG00000157764",
	}, nil
}

func Test_OccurrencesListHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/list", OccurrencesGermlineSNVListHandler(repo))
	body := `{
			"additional_fields":[
				"seq_id","task_id","locus_id","filter","zygosity","germline_pf_wgs","germline_pc_wgs","af","hgvsg","ad_ratio","variant_class", "rsnumber", "aa_change", "picked_consequences"
			]
	}`
	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/list", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
        "seq_id": 1,
		"task_id": 1,
		"chromosome": "1",
		"start": 1,
		"end": 2,
        "is_canonical":false,
		"is_mane_plus":false,
		"is_mane_select":false,
		"locus_id": "1000",
		"locus": "1_1_1000",
        "filter": "PASS",
        "zygosity": "HET",
        "germline_pf_wgs": 0.99,
        "germline_pc_wgs": 3,
        "hgvsg": "hgvsg1",
        "ad_ratio": 1.0,
        "variant_class": "class1",
		"rsnumber": "rs111111111",
		"aa_change": "p.Arg19His",
		"picked_consequences": ["splice acceptor"],
		"genotype_quality": 1,
		"gnomad_v3_af":0.1,
		"has_interpretation": true,
		"has_note": true,
		"flag_type": "pin",
		"max_impact_score":4,
		"exomiser_moi": "",
		"exomiser_acmg_classification": "",
		"exomiser_acmg_evidence": null,
		"exomiser_gene_combined_score": 0,
        "exomiser_variant_score": 0,
		"transcript_id": "T001",
		"has_comphet": true,
		"comphet_genes": [{"symbol": "BRCA2", "nb": 2}]
    }]`, w.Body.String())
}

func Test_OccurrencesCountHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/count", OccurrencesGermlineSNVCountHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/count", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"count":15, "filtered_count":4}`, w.Body.String())
}

func Test_OccurrencesAggregateHandler(t *testing.T) {
	repo := &MockRepository{}
	facetsRepo := &MockFacetsRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/aggregate", OccurrencesGermlineSNVAggregateHandler(repo, facetsRepo))

	body := `{
			"field": "variant_class",
			"sqon":{
				"op":"and",
				"content":[]
		    },
			"size": 10
	}`
	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/aggregate", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"key": "insertion", "count": 479564}, {"key": "deletion", "count": 495942}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_OccurrencesAggregateHandler_withDictionary(t *testing.T) {
	repo := &MockRepository{}
	facetsRepo := &MockFacetsRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/aggregate", OccurrencesGermlineSNVAggregateHandler(repo, facetsRepo))

	body := `{
			"field": "variant_class",
			"sqon":{
				"op":"and",
				"content":[]
		    },
			"size": 10
	}`
	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/aggregate?with_dictionary=true", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"key": "insertion", "count": 479564}, {"key": "deletion", "count": 495942}, {"key": "SNV", "count": 0}, {"key": "indel", "count": 0}, {"key": "substitution", "count": 0}, {"key": "sequence_alteration", "count": 0}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_OccurrencesStatisticsHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/statistics", OccurrencesGermlineSNVStatisticsHandler(repo))

	body := `{
			"field": "germline_pf_wgs",
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		    }
	}`
	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/statistics", bytes.NewBuffer([]byte(body)))
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
	router.GET("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/:locus_id/expanded", GetExpandedGermlineSNVOccurrence(repo, exomiserRepo, interpretationRepo))

	req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/snv/1/1/1/1000/expanded", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"cadd_phred":0.1,
		"cadd_score":0.1,
		"chromosome":"1",
		"ensembl_gene_id": "ENSG00000157764",
		"exomiser_acmg_classification_counts":{"Benign":2, "Pathogenic":1},
		"fathmm_pred":"T",
		"fathmm_score":0.1,
		"filter":"PASS",
		"genotype_quality":100,
		"gnomad_loeuf":0.1,
		"gnomad_pli":0.1,
		"gnomad_v3_af":0.01,
		"hgvsg":"hgvsg1",
		"interpretation_classification_counts":{"benign":2, "pathogenic":1},
		"is_canonical":false,
		"is_mane_plus":false,
		"is_mane_select":false,
		"locus_id":"1000",
		"locus": "locus1",
		"lrt_pred": "U",
		"lrt_score":0.01,
		"picked_consequences":["splice acceptor"],
		"polyphen2_hvar_pred": "D",
		"polyphen2_hvar_score":0.991,
		"revel_score":0.1,
		"sift_pred":"T",
		"sift_score":0.1,
		"spliceai_ds":0.1,
		"spliceai_type":["AG"],
		"symbol": "BRAF",
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
	router.GET("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/:locus_id/expanded", GetExpandedGermlineSNVOccurrence(repo, exomiserRepo, interpretationRepo))

	req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/snv/1/1/1/1000/expanded", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"cadd_phred":0.1,
		"cadd_score":0.1,
		"chromosome":"1",
		"ensembl_gene_id":"ENSG00000157764",
		"fathmm_pred":"T",
		"fathmm_score":0.1,
		"filter":"PASS",
		"genotype_quality":100,
		"gnomad_loeuf":0.1,
		"gnomad_pli":0.1,
		"gnomad_v3_af":0.01,
		"hgvsg":"hgvsg1",
		"interpretation_classification_counts":{"benign":2, "pathogenic":1},
		"is_canonical":false,
		"is_mane_plus":false,
		"is_mane_select":false,
		"locus_id":"1000",
		"locus": "locus1",
		"lrt_pred": "U",
		"lrt_score":0.01,
		"picked_consequences":["splice acceptor"],
		"polyphen2_hvar_pred": "D",
		"polyphen2_hvar_score":0.991,
		"revel_score":0.1,
		"sift_pred":"T",
		"sift_score":0.1,
		"spliceai_ds":0.1,
		"spliceai_type":["AG"],
		"symbol": "BRAF",
		"transcript_id": "T001",
		"exomiser_acmg_evidence": null,
		"exomiser_gene_combined_score": 0
	}`, w.Body.String())
}

type MockFacetsRepository struct{}

func (m *MockFacetsRepository) GetFacets(ctx context.Context, facetNames []string) ([]types.Facet, error) {
	var variantClassFacet = types.Facet{
		Name: "variant_class",
		Values: []string{
			"insertion",
			"deletion",
			"SNV",
			"indel",
			"substitution",
			"sequence_alteration",
		},
	}

	var lrtPredFacet = types.Facet{
		Name: "lrt_pred",
		Values: []string{
			"D",
			"N",
			"U",
		},
	}

	var cnvTypeFacet = types.Facet{
		Name: "type",
		Values: []string{
			"GAIN",
			"LOSS",
			"GAINLOH",
			"CNLOH",
		},
	}

	if len(facetNames) == 2 {
		return []types.Facet{variantClassFacet, lrtPredFacet}, nil
	}

	if len(facetNames) == 1 && facetNames[0] == "variant_class" {
		return []types.Facet{variantClassFacet}, nil
	}

	if len(facetNames) == 1 && facetNames[0] == "lrt_pred" {
		return []types.Facet{lrtPredFacet}, nil
	}

	if len(facetNames) == 1 && facetNames[0] == "type" {
		return []types.Facet{cnvTypeFacet}, nil
	}

	return nil, fmt.Errorf("error")
}

func Test_GetGermlineSNVDictionaryHandler_withFacets(t *testing.T) {
	repo := &MockFacetsRepository{}
	router := gin.Default()
	router.GET("/:tenant/occurrences/germline/snv/dictionary", GetGermlineSNVDictionary(repo))

	req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/snv/dictionary?facets=variant_class&facets=lrt_pred", nil)
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

func Test_GetGermlineSNVDictionaryHandler_noFacets(t *testing.T) {
	repo := &MockFacetsRepository{}
	router := gin.Default()
	router.GET("/:tenant/occurrences/germline/snv/dictionary", GetGermlineSNVDictionary(repo))

	req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/snv/dictionary", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{
				"status": 400,
				"message": "Key: 'FacetsQueryParam.Facets' Error:Field validation for 'Facets' failed on the 'required' tag"
		}`, w.Body.String())
}

func Test_GetGermlineSNVDictionaryHandler_facetNotFound(t *testing.T) {
	repo := &MockFacetsRepository{}
	router := gin.Default()
	router.GET("/:tenant/occurrences/germline/snv/dictionary", GetGermlineSNVDictionary(repo))

	req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/snv/dictionary?facets=invalid", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{
    			"status": 404,
    			"message": "facet not found"
		}`, w.Body.String())
}

// occurrenceFiltersRecorder captures the queries the handlers build so the wiring of the with_note body flag
// can be asserted without a database.
type occurrenceFiltersRecorder struct {
	MockRepository
	listQuery  types.OccurrenceListQuery
	countQuery types.OccurrenceCountQuery
}

func (m *occurrenceFiltersRecorder) GetOccurrences(_ context.Context, _ int, _ int, _ int, query types.OccurrenceListQuery) ([]types.GermlineSNVOccurrence, error) {
	m.listQuery = query
	return nil, nil
}

func (m *occurrenceFiltersRecorder) CountOccurrences(_ context.Context, _ int, _ int, _ int, query types.OccurrenceCountQuery) (types.OccurrenceCount, error) {
	m.countQuery = query
	return types.OccurrenceCount{}, nil
}

func Test_OccurrencesListHandler_Forwards_WithNote(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/list", OccurrencesGermlineSNVListHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/list", bytes.NewBuffer([]byte(`{"with_note":true}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.listQuery) {
		assert.True(t, repo.listQuery.WithNote())
	}
}

func Test_OccurrencesListHandler_Defaults_WithNote_To_False(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/list", OccurrencesGermlineSNVListHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/list", bytes.NewBuffer([]byte(`{}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.listQuery) {
		assert.False(t, repo.listQuery.WithNote())
	}
}

func Test_OccurrencesCountHandler_Forwards_WithNote(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/count", OccurrencesGermlineSNVCountHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/count", bytes.NewBuffer([]byte(`{"with_note":true}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.countQuery) {
		assert.True(t, repo.countQuery.WithNote())
	}
}

func Test_OccurrencesCountHandler_Defaults_WithNote_To_False(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/count", OccurrencesGermlineSNVCountHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/count", bytes.NewBuffer([]byte(`{}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.countQuery) {
		assert.False(t, repo.countQuery.WithNote())
	}
}

func Test_OccurrencesListHandler_Forwards_WithFlag(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/list", OccurrencesGermlineSNVListHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/list", bytes.NewBuffer([]byte(`{"with_flag":["pin","star"]}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.listQuery) {
		assert.Equal(t, []types.OccurrenceFlagType{"pin", "star"}, repo.listQuery.WithFlag())
	}
}

func Test_OccurrencesListHandler_Defaults_WithFlag_To_Empty(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/list", OccurrencesGermlineSNVListHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/list", bytes.NewBuffer([]byte(`{}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.listQuery) {
		assert.Empty(t, repo.listQuery.WithFlag())
	}
}

func Test_OccurrencesListHandler_Rejects_Unknown_Flag_Type(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/list", OccurrencesGermlineSNVListHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/list", bytes.NewBuffer([]byte(`{"with_flag":["bogus"]}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "invalid flag type")
	assert.Nil(t, repo.listQuery)
}

func Test_OccurrencesCountHandler_Forwards_WithFlag(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/count", OccurrencesGermlineSNVCountHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/count", bytes.NewBuffer([]byte(`{"with_flag":["flag"]}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.countQuery) {
		assert.Equal(t, []types.OccurrenceFlagType{"flag"}, repo.countQuery.WithFlag())
	}
}

func Test_OccurrencesListHandler_Forwards_WithInterpretation(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/list", OccurrencesGermlineSNVListHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/list", bytes.NewBuffer([]byte(`{"with_interpretation":true}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.listQuery) {
		assert.True(t, repo.listQuery.WithInterpretation())
	}
}

func Test_OccurrencesCountHandler_Forwards_WithInterpretation(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/count", OccurrencesGermlineSNVCountHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/count", bytes.NewBuffer([]byte(`{"with_interpretation":true}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.countQuery) {
		assert.True(t, repo.countQuery.WithInterpretation())
	}
}

func (m *MockRepository) SearchOccurrencesByVariantIdentifier(context.Context, int, int, int, types.VariantIdentifier) ([]types.VariantSearchHit, error) {
	return []types.VariantSearchHit{
		{Hgvsg: "chr11:g.5227002T>A", Locus: "11-5227002-T-A", Rsnumber: "rs334", ClinvarId: "15333", Symbol: "HBB", AaChange: "p.Glu7Val"},
		{Hgvsg: "chr11:g.5227002T>G", Locus: "11-5227002-T-G", Rsnumber: "rs334"},
	}, nil
}

type MockNotFoundGermlineSNVSearchRepository struct {
	MockRepository
}

func (m *MockNotFoundGermlineSNVSearchRepository) SearchOccurrencesByVariantIdentifier(context.Context, int, int, int, types.VariantIdentifier) ([]types.VariantSearchHit, error) {
	return nil, nil
}

type MockErrorGermlineSNVSearchRepository struct {
	MockRepository
}

func (m *MockErrorGermlineSNVSearchRepository) SearchOccurrencesByVariantIdentifier(context.Context, int, int, int, types.VariantIdentifier) ([]types.VariantSearchHit, error) {
	return nil, fmt.Errorf("starrocks down")
}

func Test_OccurrencesGermlineSNVSearchHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/search", OccurrencesGermlineSNVSearchHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/search", bytes.NewBuffer([]byte(`{"input":"RS334"}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"status": "found",
		"matched_field": "rsnumber",
		"normalized_input": "rs334",
		"variants": [
			{"hgvsg": "chr11:g.5227002T>A", "locus": "11-5227002-T-A", "rsnumber": "rs334", "clinvar_id": "15333", "symbol": "HBB", "aa_change": "p.Glu7Val"},
			{"hgvsg": "chr11:g.5227002T>G", "locus": "11-5227002-T-G", "rsnumber": "rs334"}
		]
	}`, w.Body.String())
}

func Test_OccurrencesGermlineSNVSearchHandler_notFoundInRun(t *testing.T) {
	repo := &MockNotFoundGermlineSNVSearchRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/search", OccurrencesGermlineSNVSearchHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/search", bytes.NewBuffer([]byte(`{"input":"8:43159045:g:a"}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"status": "not_found_in_run", "matched_field": "locus", "normalized_input": "8-43159045-G-A", "variants": []}`, w.Body.String())
}

func Test_OccurrencesGermlineSNVSearchHandler_unrecognizedFormat(t *testing.T) {
	for _, body := range []string{`{"input":"("}`, `{"input":""}`, `{}`} {
		repo := &MockRepository{}
		router := gin.Default()
		router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/search", OccurrencesGermlineSNVSearchHandler(repo))

		req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/search", bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code, body)
		assert.JSONEq(t, `{"status": "unrecognized_format", "variants": []}`, w.Body.String(), body)
	}
}

func Test_OccurrencesGermlineSNVSearchHandler_malformedBody(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/search", OccurrencesGermlineSNVSearchHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/search", bytes.NewBuffer([]byte(`{"input":`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_OccurrencesGermlineSNVSearchHandler_invalidIds(t *testing.T) {
	for path, param := range map[string]string{"abc/1/1": "case_id", "1/abc/1": "seq_id", "1/1/abc": "task_id"} {
		repo := &MockRepository{}
		router := gin.Default()
		router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/search", OccurrencesGermlineSNVSearchHandler(repo))

		req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/"+path+"/search", bytes.NewBuffer([]byte(`{"input":"rs334"}`)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code, path)
		assert.JSONEq(t, `{"status":404, "message":"`+param+` not found"}`, w.Body.String(), path)
	}
}

func Test_OccurrencesGermlineSNVSearchHandler_repositoryError(t *testing.T) {
	repo := &MockErrorGermlineSNVSearchRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/search", OccurrencesGermlineSNVSearchHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/snv/1/1/1/search", bytes.NewBuffer([]byte(`{"input":"rs334"}`)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
