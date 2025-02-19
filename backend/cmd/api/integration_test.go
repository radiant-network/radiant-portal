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

func Test_OccurrencesList(t *testing.T) {
	testList(t, "simple", "{}", `[{"locus_id":1000}]`)
}

func Test_OccurrencesList_Return_Filtered_Occurrences_When_Sqon_Specified(t *testing.T) {
	body := `{
			"selected_fields":[
				"seq_id","locus_id","filter","zygosity","pf","af","hgvsg","ad_ratio","variant_class"
			],
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": "PASS"
				}
		}
		}`
	expected := `[{"ad_ratio":1, "af":0.01, "filter":"PASS", "hgvsg":"hgvsg1", "locus_id":1000, "pf":0.99, "seq_id":1, "variant_class":"class1", "zygosity":"HET"}]`
	testList(t, "multiple", body, expected)

}

func Test_OccurrencesCount(t *testing.T) {
	testCount(t, "simple", "{}", 1)

}
func Test_OccurrencesCount_Return_Expected_Count_When_Sqon_Specified(t *testing.T) {
	body := `{
			"selected_fields":[
				"seq_id","locus_id","filter","zygosity","pf","af","hgvsg","ad_ratio","variant_class"
			],
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": "PASS"
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
							"value": "PASS"
						}
					},
					{
						"op": "in",
						"content":{
							"field": "zygosity",
							"value": "HOM"
						}
					}            
		
				]
			},
			"size": 10
		}`
	expected := `[{"key": "HOM", "count": 1}, {"key": "HET", "count": 2}]`
	testAggregation(t, "aggregation", body, expected)
}

func Test_Filter_On_Consequence_Column(t *testing.T) {
	body := `{
			"selected_fields":[
				"seq_id","locus_id","filter","zygosity","pf","af","hgvsg","ad_ratio","variant_class"
			],
			"sqon": {
				"op": "and",
				"content": [
					{
						"op": "in",
						"content": {
							"field": "impact_score",
							"value": "3"
						}
					}            
		
				]
			},
			"size": 10
		}`
	expected := `[{"ad_ratio":1, "af":0.01, "filter":"PASS", "hgvsg":"hgvsg1", "locus_id":1000, "pf":0.99, "seq_id":1, "variant_class":"class1", "zygosity":"HET"}]`
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
	testutils.ParallelPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
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
		actual = assertPostInterpretationGermline(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.Equal(t, actual.Condition, "one condition")
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
	testutils.ParallelPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
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
		actual = assertPostInterpretationSomatic(t, repo.Interpretations, "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.Equal(t, actual.Oncogenicity, "one Oncogenicity")
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

func TestMain(m *testing.M) {
	testutils.StartAllContainers()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
