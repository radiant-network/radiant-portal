package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func testList(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/:seq_id/list", server.OccurrencesGermlineListHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/germline/1/list", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}
func testCount(t *testing.T, data string, body string, expected int) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/:seq_id/count", server.OccurrencesGermlineCountHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/germline/1/count", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, fmt.Sprintf(`{"count":%d}`, expected), w.Body.String())
	})
}
func testAggregation(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/:seq_id/aggregate", server.OccurrencesGermlineAggregateHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/germline/1/aggregate", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}
func testStatistics(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrencesRepository(db)
		router := gin.Default()
		router.POST("/occurrences/germline/:seq_id/statistics", server.OccurrencesGermlineStatisticsHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/germline/1/statistics", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_OccurrencesList(t *testing.T) {
	testList(t, "simple", `{"additional_fields":["locus_id"]}`, `[{"aa_change":"p.Arg19His", "ad_ratio":1, "chromosome":"1", "clinvar":["Benign", "Pathogenic"], "genotype_quality":100, "gnomad_v3_af":0.001, "hgvsg":"hgvsg1", "locus_id":"1000", "is_canonical":false, "is_mane_plus":false, "is_mane_select":true, "pf_wgs":0.99, "picked_consequences":["splice acceptor"], "seq_id":1, "task_id":1, "start":1111, "symbol":"BRAF", "variant_class":"class1", "vep_impact":"impact1", "zygosity":"HET"}]`)
}

func Test_OccurrencesList_Return_Filtered_Occurrences_When_Sqon_Specified(t *testing.T) {
	body := `{
			"additional_fields":[
				"seq_id","locus_id","filter","zygosity","pf_wgs","pc_wgs","hgvsg","ad_ratio","variant_class"
			],
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		}
		}`
	expected := `[{"ad_ratio":1, "chromosome": "1", "filter":"PASS", "genotype_quality":100, "gnomad_v3_af":0.001, "hgvsg":"hgvsg1", "locus_id":"1000", "is_canonical":false, "is_mane_plus":false, "is_mane_select":true, "pc_wgs":3, "pf_wgs":0.99, "picked_consequences": null, "seq_id":1, "task_id":1, "start": 1111, "symbol":"symbol1", "variant_class":"class1", "vep_impact":"impact1", "zygosity":"HET"}]`
	testList(t, "multiple", body, expected)

}

func Test_OccurrencesCount(t *testing.T) {
	testCount(t, "simple", "{}", 1)

}
func Test_OccurrencesCount_Return_Expected_Count_When_Sqon_Specified(t *testing.T) {
	body := `{
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		    }
		}`
	testCount(t, "multiple", body, 1)
}

func Test_Aggregation(t *testing.T) {
	body := `{
			"field": "zygosity",
			"sqon": {
				"op": "and",
				"content": [
					{
						"op":"in",
						"content":{
							"field": "filter",
							"value": ["PASS"]
						}
					},
					{
						"op": "in",
						"content":{
							"field": "zygosity",
							"value": ["HOM"]
						}
					}            
		
				]
			},
			"size": 10
		}`
	expected := `[{"key": "HOM", "count": 1}, {"key": "HET", "count": 2}]`
	testAggregation(t, "aggregation", body, expected)
}

func Test_Statistics(t *testing.T) {
	body := `{
			"field": "pf_wgs",
			"sqon": {
				"op": "and",
				"content": [
					{
						"op":"in",
						"content":{
							"field": "filter",
							"value": ["PASS"]
						}
					}        
				]
			}
		}`
	expected := `{"min": 0.01, "max": 0.29}`
	testStatistics(t, "pagination", body, expected)
}

func Test_Filter_On_Consequence_Column(t *testing.T) {
	body := `{
			"additional_fields":[
				"seq_id","task_id","locus_id","filter","zygosity","pf_wgs","pc_wgs","hgvsg","ad_ratio","variant_class"
			],
			"sqon": {
				"op": "and",
				"content": [
					{
						"op": "in",
						"content": {
							"field": "impact_score",
							"value": ["3"]
						}
					}            
		
				]
			},
			"size": 10
		}`
	expected := `[{"ad_ratio":1, "chromosome": "1", "filter":"PASS", "genotype_quality":100, "gnomad_v3_af":0.001, "hgvsg":"hgvsg1", "locus_id":"1000", "is_canonical":false, "is_mane_plus":false, "is_mane_select":true, "pc_wgs":3, "pf_wgs":0.99, "picked_consequences": null, "seq_id":1, "task_id":1, "start": 1111, "symbol":"symbol1", "variant_class":"class1", "vep_impact":"impact1", "zygosity":"HET"}]`
	testList(t, "multiple", body, expected)
}

type MockExternalClient struct{}

func (m *MockExternalClient) GetCitationById(id string) (*types.PubmedCitation, error) {
	if id == "1" {
		return &types.PubmedCitation{
			ID: "1",
			Nlm: types.PubmedCitationDetails{
				Format: "format1",
			},
		}, nil
	} else if id == "2" {
		return nil, fmt.Errorf("error")
	} else if id == "3" {
		return &types.PubmedCitation{ID: "3"}, nil
	}
	return nil, nil
}

func Test_GetInterpretationGermline(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		pubmedService := &MockExternalClient{}
		repo := repository.NewPostgresRepository(db, pubmedService)
		// not found
		assertGetInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusNotFound, `{"status": 404, "message":"interpretation not found"}`)
		// create
		interpretation := &types.InterpretationGermline{}
		actual := assertPostInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.NotEmpty(t, actual.ID)
		// update
		interpretation.Condition = "one condition"
		interpretation.Metadata.AnalysisId = "analysis1"
		actual = assertPostInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.Equal(t, actual.Condition, "one condition")
		assert.Equal(t, actual.Metadata.AnalysisId, "analysis1")
		// Update with unknown pubmed
		interpretation.Pubmed = append(interpretation.Pubmed, types.InterpretationPubmed{CitationID: "2"})
		assertPostInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusBadRequest, interpretation, `{"status": 400, "message":"pubmed citation not found: 2"}`)
		// Update with known pubmed
		interpretation.Pubmed[0].CitationID = "1"
		actual = assertPostInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.NotEmpty(t, actual.ID)
	})
}

func Test_GetInterpretationGermlineWithPartialContent(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		pubmedService := &MockExternalClient{}
		repo := repository.NewPostgresRepository(db, pubmedService)
		interpretation := &types.InterpretationGermline{}
		interpretation.Pubmed = append(interpretation.Pubmed, types.InterpretationPubmed{CitationID: "3"})
		assertPostInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assertGetInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusPartialContent, "")
	})
}

func assertGetInterpretationGermline(t *testing.T, repo repository.InterpretationsDAO, sequencingId string, locusId string, transcriptId string, status int, expected string) {
	router := gin.Default()
	router.GET("/interpretations/germline/:sequencing_id/:locus_id/:transcript_id", server.GetInterpretationGermline(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/interpretations/germline/%s/%s/%s", sequencingId, locusId, transcriptId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	if expected != "" {
		assert.JSONEq(t, expected, w.Body.String())
	}
}

func assertPostInterpretationGermline(t *testing.T, repo repository.InterpretationsDAO, sequencingId string, locusId string, transcriptId string, status int, interpretation *types.InterpretationGermline, expected string) *types.InterpretationGermline {
	router := gin.Default()
	router.POST("/interpretations/germline/:sequencing_id/:locus_id/:transcript_id", server.PostInterpretationGermline(repo))

	body, _ := json.Marshal(interpretation)
	req, _ := http.NewRequest("POST", fmt.Sprintf("/interpretations/germline/%s/%s/%s", sequencingId, locusId, transcriptId), bytes.NewReader(body))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	if expected != "" {
		assert.JSONEq(t, expected, w.Body.String())
	}
	if status == http.StatusOK { // dont try to parse if not 200
		actual := &types.InterpretationGermline{}
		json.Unmarshal(w.Body.Bytes(), actual)
		return actual
	}
	return nil
}

func Test_GetInterpretationsomatic(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		pubmedService := &MockExternalClient{}
		repo := repository.NewPostgresRepository(db, pubmedService)
		// not found
		assertGetInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusNotFound, `{"status": 404, "message":"interpretation not found"}`)
		// create
		interpretation := &types.InterpretationSomatic{}
		actual := assertPostInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.NotEmpty(t, actual.ID)
		// update
		interpretation.Oncogenicity = "one Oncogenicity"
		interpretation.Metadata.AnalysisId = "analysis1"
		actual = assertPostInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.Equal(t, actual.Oncogenicity, "one Oncogenicity")
		assert.Equal(t, actual.Metadata.AnalysisId, "analysis1")
		// Update with unknown pubmed
		interpretation.Pubmed = append(interpretation.Pubmed, types.InterpretationPubmed{CitationID: "2"})
		assertPostInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusBadRequest, interpretation, `{"status": 400, "message":"pubmed citation not found: 2"}`)
		// Update with known pubmed
		interpretation.Pubmed[0].CitationID = "1"
		actual = assertPostInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.NotEmpty(t, actual.ID)
	})
}

func Test_GetInterpretationSomaticWithPartialContent(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		pubmedService := &MockExternalClient{}
		repo := repository.NewPostgresRepository(db, pubmedService)
		interpretation := &types.InterpretationSomatic{}
		interpretation.Pubmed = append(interpretation.Pubmed, types.InterpretationPubmed{CitationID: "3"})
		assertPostInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assertGetInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusPartialContent, "")
	})
}

func assertGetInterpretationSomatic(t *testing.T, repo repository.InterpretationsDAO, sequencingId string, locusId string, transcriptId string, status int, expected string) {
	router := gin.Default()
	router.GET("/interpretations/somatic/:sequencing_id/:locus_id/:transcript_id", server.GetInterpretationSomatic(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/interpretations/somatic/%s/%s/%s", sequencingId, locusId, transcriptId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	if expected != "" {
		assert.JSONEq(t, expected, w.Body.String())
	}
}

func assertPostInterpretationSomatic(t *testing.T, repo repository.InterpretationsDAO, sequencingId string, locusId string, transcriptId string, status int, interpretation *types.InterpretationSomatic, expected string) *types.InterpretationSomatic {
	router := gin.Default()
	router.POST("/interpretations/somatic/:sequencing_id/:locus_id/:transcript_id", server.PostInterpretationSomatic(repo))

	body, _ := json.Marshal(interpretation)
	req, _ := http.NewRequest("POST", fmt.Sprintf("/interpretations/somatic/%s/%s/%s", sequencingId, locusId, transcriptId), bytes.NewReader(body))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	if expected != "" {
		assert.JSONEq(t, expected, w.Body.String())
	}
	if status == http.StatusOK { // dont try to parse if not 200
		actual := &types.InterpretationSomatic{}
		json.Unmarshal(w.Body.Bytes(), actual)
		return actual
	}
	return nil
}

func assertGetUserSet(t *testing.T, repo repository.UserSetsDAO, userSetId string, status int, expected string) {
	router := gin.Default()
	router.GET("/users/sets/:user_set_id", server.GetUserSet(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/users/sets/%s", userSetId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetUserSet(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		pubmedService := &MockExternalClient{}
		repo := repository.NewPostgresRepository(db, pubmedService)
		// not found
		assertGetUserSet(t, repo.UserSets, "bce3b031-c691-4680-878f-f43d661f9a9f", http.StatusNotFound, `{"status": 404, "message":"user not found"}`)
	})
}

func assertGetSequencing(t *testing.T, data string, seqId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewSequencingRepository(db)
		router := gin.Default()
		router.GET("/sequencing/:seq_id", server.GetSequencing(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/sequencing/%d", seqId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetSequencing(t *testing.T) {
	expected := `{"affected_status":"affected", "analysis_type":"germline", "case_id":1, "experimental_strategy":"WGS", "part":1, "seq_id":1, "task_id":1}`
	assertGetSequencing(t, "simple", 1, expected)
}

func assertMondoTermAutoComplete(t *testing.T, data string, prefix string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewTermsRepository(db)
		router := gin.Default()
		router.GET("/mondo/autocomplete", server.GetMondoTermAutoComplete(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/mondo/autocomplete?prefix=%s", prefix), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_MondoTermAutoComplete(t *testing.T) {
	expected := `[{"source":{"id":"MONDO:0000001", "name":"blood group incompatibility"}, "highlight":{"id":"MONDO:0000001", "name":"<strong>blood</strong> group incompatibility"}}, {"source":{"id":"MONDO:0000002", "name":"blood vessel neoplasm"}, "highlight":{"id":"MONDO:0000002", "name":"<strong>blood</strong> vessel neoplasm"}}]`
	assertMondoTermAutoComplete(t, "simple", "blood", expected)
}

func Test_SearchGermline(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		// db + repo
		pubmedService := &MockExternalClient{}
		repo := repository.NewPostgresRepository(db, pubmedService).Interpretations

		// search empty
		assertSearchInterpretationGermline(t, repo, "analysis_id=foo,bar&analysis_id=toto", http.StatusOK, 0)

		// add interpretations
		interpretation1 := &types.InterpretationGermline{InterpretationCommon: types.InterpretationCommon{Metadata: types.InterpretationMetadata{AnalysisId: "foo"}}}
		interpretation2 := &types.InterpretationGermline{InterpretationCommon: types.InterpretationCommon{Metadata: types.InterpretationMetadata{AnalysisId: "toto"}}}
		assertPostInterpretationGermline(t, repo, "seq1", "locus1", "trans1", http.StatusOK, interpretation1, "")
		assertPostInterpretationGermline(t, repo, "seq2", "locus1", "trans1", http.StatusOK, interpretation2, "")

		// search again
		assertSearchInterpretationGermline(t, repo, "analysis_id=foo,bar&analysis_id=toto", http.StatusOK, 2)
	})
}

func assertSearchInterpretationGermline(t *testing.T, repo repository.InterpretationsDAO, queryParams string, status int, count int) {
	router := gin.Default()
	router.GET("/interpretations/germline", server.SearchInterpretationGermline(repo))

	req, _ := http.NewRequest("GET", "/interpretations/germline?"+queryParams, bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	if count > 0 {
		var items = []types.InterpretationGermline{}
		json.Unmarshal(w.Body.Bytes(), &items)
		assert.Equal(t, count, len(items))
	}
}

func Test_SearchSomatic(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		// db + repo
		pubmedService := &MockExternalClient{}
		repo := repository.NewPostgresRepository(db, pubmedService).Interpretations

		// search empty
		assertSearchInterpretationSomatic(t, repo, "analysis_id=foo,bar&analysis_id=toto", http.StatusOK, 0)

		// add interpretations
		interpretation1 := &types.InterpretationSomatic{InterpretationCommon: types.InterpretationCommon{Metadata: types.InterpretationMetadata{AnalysisId: "foo"}}}
		interpretation2 := &types.InterpretationSomatic{InterpretationCommon: types.InterpretationCommon{Metadata: types.InterpretationMetadata{AnalysisId: "toto"}}}
		assertPostInterpretationSomatic(t, repo, "seq1", "locus1", "trans1", http.StatusOK, interpretation1, "")
		assertPostInterpretationSomatic(t, repo, "seq2", "locus1", "trans1", http.StatusOK, interpretation2, "")

		// search again
		assertSearchInterpretationSomatic(t, repo, "analysis_id=foo,bar&analysis_id=toto", http.StatusOK, 2)
	})
}

func assertSearchInterpretationSomatic(t *testing.T, repo repository.InterpretationsDAO, queryParams string, status int, count int) {
	router := gin.Default()
	router.GET("/interpretations/somatic", server.SearchInterpretationSomatic(repo))

	req, _ := http.NewRequest("GET", "/interpretations/somatic?"+queryParams, bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	if count > 0 {
		var items = []types.InterpretationSomatic{}
		json.Unmarshal(w.Body.Bytes(), &items)
		assert.Equal(t, count, len(items))
	}
}

func assertGetExpendedOccurrence(t *testing.T, data string, seqId int, locusId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewOccurrencesRepository(db)
		router := gin.Default()
		router.GET("/occurrences/germline/:seq_id/:locus_id/expended", server.GetExpendedGermlineOccurrence(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/occurrences/germline/%d/%d/expended", seqId, locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetExpendedOccurrence(t *testing.T) {
	expected := `{"aa_change":"p.Arg19His", "cadd_phred":0.1, "cadd_score":0.1, "chromosome":"1", "clinvar":["Benign", "Pathogenic"], "fathmm_pred":"T", "fathmm_score":0.1, "filter":"PASS", "genotype_quality":100, "gnomad_loeuf":0.1, "gnomad_pli":0.1, "gnomad_v3_af":0.001, "hgvsg":"hgvsg1", "is_canonical":true, "is_mane_plus":false, "is_mane_select":true, "locus_id":"1000", "is_mane_select":true, "omim_conditions":[{"inheritance_code":["AD"], "omim_phenotype_id":"613706", "panel":"Noonan syndrome 7"}, {"inheritance_code":["AD"], "omim_phenotype_id":"613707", "panel":"LEOPARD syndrome 3"}], "pf_wgs":0.99, "picked_consequences":["splice acceptor"], "revel_score":0.1, "sift_pred":"T", "sift_score":0.1, "spliceai_ds":0.1, "spliceai_type":["AG"], "start":1111, "symbol":"BRAF", "vep_impact":"impact1", "zygosity":"HET"}`
	assertGetExpendedOccurrence(t, "simple", 1, 1000, expected)
}

func assertGetVariantHeader(t *testing.T, data string, locusId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/header", server.GetGermlineVariantHeader(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/header", locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantHeader(t *testing.T) {
	expected := `{"hgvsg":"hgvsg1", "assembly_version": "GRCh38", "source": ["WGS"]}`
	assertGetVariantHeader(t, "simple", 1000, expected)
}

func assertGetVariantOverview(t *testing.T, data string, locusId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/overview", server.GetGermlineVariantOverview(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/overview", locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantOverview(t *testing.T) {
	expected := `{"aa_change":"p.Arg19His", "cadd_phred":0.1, "cadd_score":0.1, "is_canonical":true, "clinvar": ["Benign", "Pathogenic"], "fathmm_pred":"T", "fathmm_score":0.1, "gnomad_loeuf":0.1, "gnomad_pli":0.1, "gnomad_v3_af":0.001, "locus":"locus1", "is_mane_select":true, "omim_conditions": [{"inheritance_code": ["AD"], "panel": "Noonan syndrome 7", "omim_phenotype_id": "613706"}, {"inheritance_code": ["AD"], "panel":"LEOPARD syndrome 3", "omim_phenotype_id":"613707"}], "pc_wgs":3, "pf_wgs":0.99, "picked_consequences":["csq10"], "revel_score":0.1, "sift_pred":"T", "sift_score":0.1, "spliceai_ds":0.1, "spliceai_type":["AG"], "symbol":"BRAF", "transcript_id":"T001", "vep_impact":"impact1"}`
	assertGetVariantOverview(t, "simple", 1000, expected)
}

func assertGetVariantConsequences(t *testing.T, data string, locusId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/consequences", server.GetGermlineVariantConsequences(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/consequences", locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantConsequences(t *testing.T) {
	expected := `[{"biotype":"IG_C_gene", "gnomad_loeuf":0.1, "gnomad_pli":0.1, "is_picked":true, "spliceai_ds":0.1, "spliceai_type":["AG"], "symbol":"BRAF", "transcripts":[{"cadd_phred":0.1, "cadd_score":0.1, "consequences": ["csq10"], "fathmm_pred":"T", "fathmm_score":0.1, "is_canonical":false, "is_mane_plus":false, "is_mane_select":false, "revel_score":0.1, "sift_pred":"T", "sift_score":0.1, "transcript_id":"T001"}]}, {"biotype":"IG_C_pseudogene", "gnomad_loeuf":0.1, "gnomad_pli":0.1, "spliceai_ds":0.2, "spliceai_type":["AT"], "symbol":"BRAC", "is_picked":false, "transcripts":[{"cadd_phred":0.2, "cadd_score":0.2, "consequences": ["csq11"], "fathmm_pred":"T", "fathmm_score":0.2, "is_canonical":false, "is_mane_plus":false, "is_mane_select":false, "revel_score":0.2, "sift_pred":"T", "sift_score":0.2, "transcript_id":"T002"}]}]`
	assertGetVariantConsequences(t, "simple", 1000, expected)
}

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
	expected := `{"list": [{"case_analysis_code":"WGA", "case_analysis_name":"Whole Genome Analysis", "case_analysis_type_code":"germline", "case_id":8, "created_on":"2021-09-12T13:08:00Z", "mrn":"MRN-283794", "priority_code":"routine", "project_code":"N1", "requested_by_code":"CHOP", "requested_by_name":"Children Hospital of Philadelphia", "status_code":"on-hold", "updated_on":"2021-09-12T13:08:00Z"}], "count": 1}`
	body := `{
			"additional_fields":[],
			"search_criteria":[{"field": "status_code", "value": ["on-hold"]}]
		}`
	assertSearchCasesHandler(t, "simple", body, expected)
}

func Test_SearchCasesHandler_WithAdditionalFields(t *testing.T) {
	expected := `{"list": [{"case_analysis_code":"WGA", "case_analysis_name":"Whole Genome Analysis", "case_analysis_type_code":"germline", "case_id":8, "created_on":"2021-09-12T13:08:00Z", "managing_organization_code":"CHUSJ", "mrn":"MRN-283794", "primary_condition_id":"MONDO:0700092", "primary_condition_name":"neurodevelopmental disorder", "priority_code":"routine", "project_code":"N1", "requested_by_code":"CHOP", "requested_by_name":"Children Hospital of Philadelphia", "status_code":"on-hold", "updated_on":"2021-09-12T13:08:00Z"}], "count": 1}`
	body := `{
			"additional_fields":["primary_condition_id", "primary_condition_name", "managing_organization_code"],
			"search_criteria":[{"field": "status_code", "value": ["on-hold"]}]
		}`
	assertSearchCasesHandler(t, "simple", body, expected)
}

func Test_SearchCasesHandler_WithSortAndLimit(t *testing.T) {
	expected := `{"list": [{"case_analysis_code":"IDGD", "case_analysis_name":"Intellectual Deficiency and Global Developmental Delay", "case_analysis_type_code":"germline", "case_id":21, "created_on":"2020-09-12T13:08:00Z", "mrn":"MRN-283832", "priority_code":"routine", "project_code":"N2", "requested_by_code":"CHUSJ", "requested_by_name":"Centre hospitalier universitaire Sainte-Justine", "status_code":"active", "updated_on":"2020-09-12T13:08:00Z"}, {"case_analysis_code":"IDGD", "case_analysis_name":"Intellectual Deficiency and Global Developmental Delay", "case_analysis_type_code":"germline", "case_id":20, "created_on":"2020-09-12T13:08:00Z", "mrn":"MRN-283830", "priority_code":"routine", "project_code":"N2", "requested_by_code":"CHUSJ", "requested_by_name":"Centre hospitalier universitaire Sainte-Justine", "status_code":"completed", "updated_on":"2020-09-12T13:08:00Z"}], "count": 21}`
	body := `{
			"additional_fields":[],
			"sort":[{"field": "patient_id", "order": "desc"}],
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
	expected := `[{"type":"case_id", "value":"1"}, {"type":"case_id", "value":"10"}, {"type":"patient_id", "value":"10"}, {"type":"case_id", "value":"11"}, {"type":"case_id", "value":"12"}]`
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
			{"count":1, "key":"CQGC", "label":"Quebec Clinical Genomic Center"},
			{"count":0, "key":"CHOP", "label":"Children Hospital of Philadelphia"}, 
			{"count":0, "key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"}, 
			{"count":0, "key":"LDM-CHOP", "label":"Molecular Diagnostic Laboratory, CHOP"},
			{"count":0, "key":"LDM-CHUSJ", "label":"Laboratoire de diagnostic moléculaire, CHU Sainte-Justine"}, 
			{"count":0, "key":"UCSF", "label":"University of California San-Francisco"}], 
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
			{"count":0, "key":"active", "label":"Active"}, 
			{"count":0, "key":"completed", "label":"Completed"},
			{"count":0, "key":"incomplete", "label":"Incomplete"}, 
			{"count":0, "key":"on-hold", "label":"On-hold"}, 
			{"count":0, "key":"revoke", "label":"Revoke"},
			{"count":0, "key":"submitted", "label":"Submitted"},
			{"count":0, "key":"unknown", "label":"Unknown"}]	
		}`
	assertGetCasesFilters(t, "simple", body, expected)
}

func assertGetVariantInterpretedCases(t *testing.T, data string, locusId int, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.POST("/variants/germline/:locus_id/cases/interpreted", server.GetGermlineVariantInterpretedCases(repo))

		req, _ := http.NewRequest("POST", fmt.Sprintf("/variants/germline/%d/cases/interpreted", locusId), bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantInterpretedCases(t *testing.T) {
	body := `{
			"search_criteria":[{"field": "condition_term", "value": ["vessel"], "operator": "contains"}]
		}`
	expected := `{
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
			}
		], "count": 1
	}`
	assertGetVariantInterpretedCases(t, "simple", 1000, body, expected)
}
func assertGetVariantUninterpretedCases(t *testing.T, data string, locusId int, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.POST("/variants/germline/:locus_id/cases/uninterpreted", server.GetGermlineVariantUninterpretedCases(repo))

		req, _ := http.NewRequest("POST", fmt.Sprintf("/variants/germline/%d/cases/uninterpreted", locusId), bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantUninterpretedCases(t *testing.T) {
	body := `{
			"search_criteria":[{"field": "status_code", "value": ["active"]}]
		}`
	expected := `{
		"list": [
			{
				"case_analysis_code":"WGA", 
				"case_analysis_name":"Whole Genome Analysis", 
				"case_id":5, 
				"created_on":"2021-09-12T13:08:00Z", 
				"performer_lab_code":"CQGC", 
				"performer_lab_name":"Quebec Clinical Genomic Center", 
				"primary_condition_id":"MONDO:0700092", 
				"primary_condition_name":"neurodevelopmental disorder", 
				"status_code":"active", 
				"updated_on":"2021-09-12T13:08:00Z",
				"zygosity":"HOM"
			}
		],
		"count": 1
	}`
	assertGetVariantUninterpretedCases(t, "simple", 1000, body, expected)
}

func assertGetExpendedVariantInterpretedCase(t *testing.T, data string, locusId int, seqId int, transcriptId string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.GET("variants/germline/:locus_id/cases/interpreted/:seq_id/:transcript_id", server.GetExpendedGermlineVariantInterpretedCase(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/cases/interpreted/%d/%s", locusId, seqId, transcriptId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetExpendedVariantInterpretedCase(t *testing.T) {
	expected := `{
		"classification_criterias":["PM1","PM2"],
		"gene_symbol":"BRAF",
		"inheritances":["autosomal_dominant_de_novo"],
		"interpretation":"",
		"interpreter_name":"", 
		"patient_id":3, 
		"patient_sex_code":"male", 
		"pubmed_ids":[]
	}`
	assertGetExpendedVariantInterpretedCase(t, "simple", 1000, 1, "T002", expected)
}

func assertGetVariantCasesCount(t *testing.T, data string, locusId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.GET("variants/germline/:locus_id/cases/count", server.GetGermlineVariantCasesCount(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/cases/count", locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantCasesCount(t *testing.T) {
	expected := `{"count":4}`
	assertGetVariantCasesCount(t, "simple", 1000, expected)
}

func assertGetVariantCasesFilters(t *testing.T, data string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.GET("variants/germline/cases/filters", server.GetGermlineVariantCasesFilters(repo))

		req, _ := http.NewRequest("GET", "/variants/germline/cases/filters", bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantCasesFilters(t *testing.T) {
	expected := `{
		"case_analysis":[
			{"count":0, "key":"WGA", "label":"Whole Genome Analysis"}, 
			{"count":0, "key":"IDGD", "label":"Intellectual Deficiency and Global Developmental Delay"},
			{"count":0, "key":"MYOC", "label":"Congenital Myopathies"},
			{"count":0, "key":"HYPM", "label":"Malignant Hyperthermia"}], 
		"classification": [
			{"count": 0, "key":"LA6668-3", "label":"pathogenic"}, 
			{"count": 0, "key":"LA26332-9", "label":"likelyPathogenic"}, 
			{"count": 0, "key":"LA26333-7", "label":"vus"}, 
			{"count": 0, "key":"LA26334-5", "label":"likelyBenign"}, 
			{"count": 0, "key":"LA6675-8", "label":"benign"} 
		],
		"performer_lab":[
			{"count":0, "key":"CHOP", "label":"Children Hospital of Philadelphia"}, 
			{"count":0, "key":"UCSF", "label":"University of California San-Francisco"},
			{"count":0, "key":"CHUSJ", "label":"Centre hospitalier universitaire Sainte-Justine"}, 
			{"count":0, "key":"LDM-CHUSJ", "label":"Laboratoire de diagnostic moléculaire, CHU Sainte-Justine"}, 			
			{"count":0, "key":"LDM-CHOP", "label":"Molecular Diagnostic Laboratory, CHOP"},
			{"count":0, "key":"CQGC", "label":"Quebec Clinical Genomic Center"}]
	}`
	assertGetVariantCasesFilters(t, "simple", expected)
}

func TestMain(m *testing.M) {
	testutils.StartAllContainers()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
