package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/repository"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/server"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/Ferlab-Ste-Justine/radiant-api/test/testutils"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func testList(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewStarrocksRepository(db)
		router := gin.Default()
		router.POST("/occurrences/:seq_id/list", server.OccurrencesListHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/1/list", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}
func testCount(t *testing.T, data string, body string, expected int) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewStarrocksRepository(db)
		router := gin.Default()
		router.POST("/occurrences/:seq_id/count", server.OccurrencesCountHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/1/count", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, fmt.Sprintf(`{"count":%d}`, expected), w.Body.String())
	})
}
func testAggregation(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewStarrocksRepository(db)
		router := gin.Default()
		router.POST("/occurrences/:seq_id/aggregate", server.OccurrencesAggregateHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/1/aggregate", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}
func testStatistics(t *testing.T, data string, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewStarrocksRepository(db)
		router := gin.Default()
		router.POST("/occurrences/:seq_id/statistics", server.OccurrencesStatisticsHandler(repo))

		req, _ := http.NewRequest("POST", "/occurrences/1/statistics", bytes.NewBufferString(body))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_OccurrencesList(t *testing.T) {
	testList(t, "simple", `{"additional_fields":["locus_id"]}`, `[{"aa_change":"p.Arg19His", "ad_ratio":1, "clinvar":["Benign", "Pathogenic"], "genotype_quality":100, "gnomad_v3_af":0.001, "hgvsg":"hgvsg1", "locus_id":1000, "mane_select":true, "pf":0.99, "picked_consequences":["splice acceptor"], "seq_id":1, "symbol":"symbol1", "variant_class":"class1", "vep_impact":"impact1", "zygosity":"HET"}]`)
}

func Test_OccurrencesList_Return_Filtered_Occurrences_When_Sqon_Specified(t *testing.T) {
	body := `{
			"additional_fields":[
				"seq_id","locus_id","filter","zygosity","pf","pc","af","hgvsg","ad_ratio","variant_class"
			],
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		}
		}`
	expected := `[{"ad_ratio":1, "af":0.01, "filter":"PASS", "genotype_quality":100, "gnomad_v3_af":0.001, "hgvsg":"hgvsg1", "locus_id":1000, "mane_select":true, "pc":3, "pf":0.99, "picked_consequences": null, "seq_id":1, "symbol":"symbol1", "variant_class":"class1", "vep_impact":"impact1", "zygosity":"HET"}]`
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
			"field": "pf",
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
				"seq_id","locus_id","filter","zygosity","pf","pc","af","hgvsg","ad_ratio","variant_class"
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
	expected := `[{"ad_ratio":1, "af":0.01, "filter":"PASS", "genotype_quality":100, "gnomad_v3_af":0.001, "hgvsg":"hgvsg1", "locus_id":1000, "mane_select":true, "pc":3, "pf":0.99, "picked_consequences": null, "seq_id":1, "symbol":"symbol1", "variant_class":"class1", "vep_impact":"impact1", "zygosity":"HET"}]`
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
	}
	return nil, nil
}

func Test_GetInterpretationGermline(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		pubmedService := &MockExternalClient{}
		repo := repository.NewPostgresRepository(db, pubmedService)
		// not found
		assertGetInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusNotFound, `{"error":"not found"}`)
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
		assertPostInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusBadRequest, interpretation, `{"error":"pubmed citation not found: 2"}`)
		// Update with known pubmed
		interpretation.Pubmed[0].CitationID = "1"
		actual = assertPostInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.NotEmpty(t, actual.ID)
	})
}

func assertGetInterpretationGermline(t *testing.T, repo repository.InterpretationsDAO, sequencingId string, locusId string, transcriptId string, status int, expected string) {
	router := gin.Default()
	router.GET("/interpretations/germline/:sequencing_id/:locus_id/:transcript_id", server.GetInterpretationGermline(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/interpretations/germline/%s/%s/%s", sequencingId, locusId, transcriptId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
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
		assertGetInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusNotFound, `{"error":"not found"}`)
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
		assertPostInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusBadRequest, interpretation, `{"error":"pubmed citation not found: 2"}`)
		// Update with known pubmed
		interpretation.Pubmed[0].CitationID = "1"
		actual = assertPostInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.NotEmpty(t, actual.ID)
	})
}

func assertGetInterpretationSomatic(t *testing.T, repo repository.InterpretationsDAO, sequencingId string, locusId string, transcriptId string, status int, expected string) {
	router := gin.Default()
	router.GET("/interpretations/somatic/:sequencing_id/:locus_id/:transcript_id", server.GetInterpretationSomatic(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/interpretations/somatic/%s/%s/%s", sequencingId, locusId, transcriptId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
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
		assertGetUserSet(t, repo.UserSets, "bce3b031-c691-4680-878f-f43d661f9a9f", http.StatusNotFound, `{"error":"not found"}`)
	})
}

func assertGetSequencing(t *testing.T, data string, seqId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewStarrocksRepository(db)
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
	expected := `{"seq_id":1, "experiment_type":"WGS", "analysis_type":"germline"}`
	assertGetSequencing(t, "simple", 1, expected)
}

func assertMondoTermAutoComplete(t *testing.T, data string, prefix string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewStarrocksRepository(db)
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

func TestMain(m *testing.M) {
	testutils.StartAllContainers()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
