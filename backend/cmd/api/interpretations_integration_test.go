package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

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
		assertGetInterpretationGermline(t, repo.Interpretations, "10", "seq1", "locus1", "trans1", http.StatusNotFound, `{"status": 404, "message":"interpretation not found"}`)
		// create
		interpretation := &types.InterpretationGermline{}
		actual := assertPostInterpretationGermline(t, repo.Interpretations, "10", "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.NotEmpty(t, actual.ID)
		// update
		interpretation.Condition = "one condition"
		interpretation.Metadata.AnalysisId = "analysis1"
		actual = assertPostInterpretationGermline(t, repo.Interpretations, "10", "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.Equal(t, actual.Condition, "one condition")
		assert.Equal(t, actual.Metadata.AnalysisId, "analysis1")
		// Update with unknown pubmed
		interpretation.Pubmed = append(interpretation.Pubmed, types.InterpretationPubmed{CitationID: "2"})
		assertPostInterpretationGermline(t, repo.Interpretations, "10", "seq1", "locus1", "trans1", http.StatusBadRequest, interpretation, `{"status": 400, "message":"pubmed citation not found: 2"}`)
		// Update with known pubmed
		interpretation.Pubmed[0].CitationID = "1"
		actual = assertPostInterpretationGermline(t, repo.Interpretations, "10", "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.NotEmpty(t, actual.ID)
	})
}

func Test_GetInterpretationGermlineWithPartialContent(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		pubmedService := &MockExternalClient{}
		repo := repository.NewPostgresRepository(db, pubmedService)
		interpretation := &types.InterpretationGermline{}
		interpretation.Pubmed = append(interpretation.Pubmed, types.InterpretationPubmed{CitationID: "3"})
		assertPostInterpretationGermline(t, repo.Interpretations, "10", "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assertGetInterpretationGermline(t, repo.Interpretations, "10", "seq1", "locus1", "trans1", http.StatusPartialContent, "")
	})
}

func assertGetInterpretationGermline(t *testing.T, repo repository.InterpretationsDAO, caseId string, sequencingId string, locusId string, transcriptId string, status int, expected string) {
	router := gin.Default()
	router.GET("/interpretations/v2/germline/:case_id/:sequencing_id/:locus_id/:transcript_id", server.GetInterpretationGermline(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/interpretations/v2/germline/%s/%s/%s/%s", caseId, sequencingId, locusId, transcriptId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	if expected != "" {
		assert.JSONEq(t, expected, w.Body.String())
	}
}

func assertPostInterpretationGermline(t *testing.T, repo repository.InterpretationsDAO, caseId string, sequencingId string, locusId string, transcriptId string, status int, interpretation *types.InterpretationGermline, expected string) *types.InterpretationGermline {
	router := gin.Default()
	router.POST("/interpretations/v2/germline/:case_id/:sequencing_id/:locus_id/:transcript_id", server.PostInterpretationGermline(repo))

	body, _ := json.Marshal(interpretation)
	req, _ := http.NewRequest("POST", fmt.Sprintf("/interpretations/v2/germline/%s/%s/%s/%s", caseId, sequencingId, locusId, transcriptId), bytes.NewReader(body))
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
		assertGetInterpretationSomatic(t, repo.Interpretations, "11", "seq1", "locus1", "trans1", http.StatusNotFound, `{"status": 404, "message":"interpretation not found"}`)
		// create
		interpretation := &types.InterpretationSomatic{}
		actual := assertPostInterpretationSomatic(t, repo.Interpretations, "11", "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.NotEmpty(t, actual.ID)
		// update
		interpretation.Oncogenicity = "one Oncogenicity"
		interpretation.Metadata.AnalysisId = "analysis1"
		actual = assertPostInterpretationSomatic(t, repo.Interpretations, "11", "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.Equal(t, actual.Oncogenicity, "one Oncogenicity")
		assert.Equal(t, actual.Metadata.AnalysisId, "analysis1")
		// Update with unknown pubmed
		interpretation.Pubmed = append(interpretation.Pubmed, types.InterpretationPubmed{CitationID: "2"})
		assertPostInterpretationSomatic(t, repo.Interpretations, "11", "seq1", "locus1", "trans1", http.StatusBadRequest, interpretation, `{"status": 400, "message":"pubmed citation not found: 2"}`)
		// Update with known pubmed
		interpretation.Pubmed[0].CitationID = "1"
		actual = assertPostInterpretationSomatic(t, repo.Interpretations, "11", "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assert.NotEmpty(t, actual.ID)
	})
}

func Test_GetInterpretationSomaticWithPartialContent(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		pubmedService := &MockExternalClient{}
		repo := repository.NewPostgresRepository(db, pubmedService)
		interpretation := &types.InterpretationSomatic{}
		interpretation.Pubmed = append(interpretation.Pubmed, types.InterpretationPubmed{CitationID: "3"})
		assertPostInterpretationSomatic(t, repo.Interpretations, "11", "seq1", "locus1", "trans1", http.StatusOK, interpretation, "")
		assertGetInterpretationSomatic(t, repo.Interpretations, "11", "seq1", "locus1", "trans1", http.StatusPartialContent, "")
	})
}

func assertGetInterpretationSomatic(t *testing.T, repo repository.InterpretationsDAO, caseId string, sequencingId string, locusId string, transcriptId string, status int, expected string) {
	router := gin.Default()
	router.GET("/interpretations/v2/somatic/:case_id/:sequencing_id/:locus_id/:transcript_id", server.GetInterpretationSomatic(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/interpretations/v2/somatic/%s/%s/%s/%s", caseId, sequencingId, locusId, transcriptId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	if expected != "" {
		assert.JSONEq(t, expected, w.Body.String())
	}
}

func assertPostInterpretationSomatic(t *testing.T, repo repository.InterpretationsDAO, caseId string, sequencingId string, locusId string, transcriptId string, status int, interpretation *types.InterpretationSomatic, expected string) *types.InterpretationSomatic {
	router := gin.Default()
	router.POST("/interpretations/v2/somatic/:case_id/:sequencing_id/:locus_id/:transcript_id", server.PostInterpretationSomatic(repo))

	body, _ := json.Marshal(interpretation)
	req, _ := http.NewRequest("POST", fmt.Sprintf("/interpretations/v2/somatic/%s/%s/%s/%s", caseId, sequencingId, locusId, transcriptId), bytes.NewReader(body))
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
		assertPostInterpretationGermline(t, repo, "10", "seq1", "locus1", "trans1", http.StatusOK, interpretation1, "")
		assertPostInterpretationGermline(t, repo, "10", "seq2", "locus1", "trans1", http.StatusOK, interpretation2, "")

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
		assertPostInterpretationSomatic(t, repo, "11", "seq1", "locus1", "trans1", http.StatusOK, interpretation1, "")
		assertPostInterpretationSomatic(t, repo, "11", "seq2", "locus1", "trans1", http.StatusOK, interpretation2, "")

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
