package server

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) GetCitationById(id string) (*types.PubmedCitation, error) {
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

func (m *MockRepository) FirstGermline(caseId string, sequencingId string, locusId string, transcriptId string) (*types.InterpretationGermline, error) {
	var uniqueId = fmt.Sprintf("%s-%s-%s-%s", caseId, sequencingId, locusId, transcriptId)
	if uniqueId == "10-seq1-locus1-trans1" {
		return &types.InterpretationGermline{
			Condition: "MONDO:0000001",
			InterpretationCommon: types.InterpretationCommon{
				ID:           uniqueId,
				CaseId:       caseId,
				SequencingId: sequencingId,
				LocusId:      locusId,
				TranscriptId: transcriptId,
			},
		}, nil
	} else if uniqueId == "10-seq1-locus1-trans2" {
		return nil, fmt.Errorf("error")
	}
	return nil, nil
}
func (m *MockRepository) CreateOrUpdateGermline(interpretation *types.InterpretationGermline) error {
	if interpretation.ID == "" {
		interpretation.ID = "uuid1"
	} else if interpretation.ID == "uuid2" {
		return fmt.Errorf("pubmed citation not found")
	}
	return nil
}
func (m *MockRepository) FirstSomatic(caseId string, sequencingId string, locusId string, transcriptId string) (*types.InterpretationSomatic, error) {
	var uniqueId = fmt.Sprintf("%s-%s-%s-%s", caseId, sequencingId, locusId, transcriptId)
	if uniqueId == "11-seq1-locus1-trans1" {
		return &types.InterpretationSomatic{
			InterpretationCommon: types.InterpretationCommon{
				ID:           uniqueId,
				CaseId:       caseId,
				SequencingId: sequencingId,
				LocusId:      locusId,
				TranscriptId: transcriptId,
			},
		}, nil
	} else if uniqueId == "11-seq1-locus1-trans2" {
		return nil, fmt.Errorf("error")
	}
	return nil, nil
}
func (m *MockRepository) CreateOrUpdateSomatic(interpretation *types.InterpretationSomatic) error {
	if interpretation.ID == "" {
		interpretation.ID = "uuid1"
	} else if interpretation.ID == "uuid2" {
		return fmt.Errorf("pubmed citation not found")
	}
	return nil
}
func (m *MockRepository) SearchGermline(analysisId []string, patientId []string, variantHash []string) ([]*types.InterpretationGermline, error) {
	return nil, nil
}
func (m *MockRepository) SearchSomatic(analysisId []string, patientId []string, variantHash []string) ([]*types.InterpretationSomatic, error) {
	return nil, nil
}

func (m *MockRepository) RetrieveGermlineInterpretationClassificationCounts(locusId int) (types.JsonMap[string, int], error) {
	return types.JsonMap[string, int]{
		"benign":     2,
		"pathogenic": 1,
	}, nil
}

func assertGetInterpretationGermline(t *testing.T, caseId string, sequencingId string, locusId string, transcriptId string, status int, expected string) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/interpretations/v2/germline/:case_id/:sequencing_id/:locus_id/:transcript_id", GetInterpretationGermline(repo, repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/interpretations/v2/germline/%s/%s/%s/%s", caseId, sequencingId, locusId, transcriptId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetInterpretationGermline_ok(t *testing.T) {
	assertGetInterpretationGermline(t, "10", "seq1", "locus1", "trans1", http.StatusOK, `{"case_id":"10", "condition":"MONDO:0000001", "condition_name":"blood group incompatibility", "created_at":"0001-01-01T00:00:00Z", "id":"10-seq1-locus1-trans1", "locus_id":"locus1", "metadata": {}, "sequencing_id":"seq1", "transcript_id":"trans1", "updated_at":"0001-01-01T00:00:00Z"}`)
}

func Test_GetInterpretationGermline_error(t *testing.T) {
	assertGetInterpretationGermline(t, "10", "seq1", "locus1", "trans2", http.StatusInternalServerError, `{"status":500, "message":"Internal Server Error", "detail":"error"}`)
}

func Test_GetInterpretationGermline_notFound(t *testing.T) {
	assertGetInterpretationGermline(t, "10", "seq1", "locus1", "trans3", http.StatusNotFound, `{"status": 404, "message":"interpretation not found"}`)
}

func assertPostInterpretationGermline(t *testing.T, caseId string, sequencingId string, locusId string, transcriptId string, status int, body string, expected string) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/interpretations/v2/germline/:case_id/:sequencing_id/:locus_id/:transcript_id", PostInterpretationGermline(repo))

	req, _ := http.NewRequest("POST", fmt.Sprintf("/interpretations/v2/germline/%s/%s/%s/%s", caseId, sequencingId, locusId, transcriptId), bytes.NewBufferString(body))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_PostInterpretationGermline_create_ok(t *testing.T) {
	body := `{
			}`
	assertPostInterpretationGermline(t, "10", "seq1", "locus1", "trans1", http.StatusOK, body, `{"case_id":"10", "created_at":"0001-01-01T00:00:00Z", "id":"uuid1", "locus_id":"locus1", "metadata": {}, "sequencing_id":"seq1", "transcript_id":"trans1", "updated_at":"0001-01-01T00:00:00Z"}`)
}

func Test_PostInterpretationGermline_update_ok(t *testing.T) {
	body := `{
				"id":"uuid1"
			}`
	assertPostInterpretationGermline(t, "10", "seq1", "locus1", "trans1", http.StatusOK, body, `{"case_id":"10", "created_at":"0001-01-01T00:00:00Z", "id":"uuid1", "locus_id":"locus1", "metadata": {},  "sequencing_id":"seq1", "transcript_id":"trans1", "updated_at":"0001-01-01T00:00:00Z"}`)
}

func Test_PostInterpretationGermline_error(t *testing.T) {
	body := `{
				"id":"uuid2"
			}`
	assertPostInterpretationGermline(t, "10", "seq1", "locus1", "trans1", http.StatusBadRequest, body, `{"status": 400, "message":"pubmed citation not found"}`)
}

func assertGetInterpretationSomatic(t *testing.T, caseId string, sequencingId string, locusId string, transcriptId string, status int, expected string) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/interpretations/v2/somatic/:case_id/:sequencing_id/:locus_id/:transcript_id", GetInterpretationSomatic(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/interpretations/v2/somatic/%s/%s/%s/%s", caseId, sequencingId, locusId, transcriptId), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetInterpretationSomatic_ok(t *testing.T) {
	assertGetInterpretationSomatic(t, "11", "seq1", "locus1", "trans1", http.StatusOK, `{"case_id":"11", "created_at":"0001-01-01T00:00:00Z", "id":"11-seq1-locus1-trans1", "locus_id":"locus1", "metadata": {}, "sequencing_id":"seq1", "transcript_id":"trans1", "updated_at":"0001-01-01T00:00:00Z"}`)
}

func Test_GetInterpretationSomatic_error(t *testing.T) {
	assertGetInterpretationSomatic(t, "11", "seq1", "locus1", "trans2", http.StatusInternalServerError, `{"status": 500, "message":"Internal Server Error", "detail": "error"}`)
}

func Test_GetInterpretationSomatic_notFound(t *testing.T) {
	assertGetInterpretationSomatic(t, "11", "seq1", "locus1", "trans3", http.StatusNotFound, `{"status": 404, "message":"interpretation not found"}`)
}

func assertPostInterpretationSomatic(t *testing.T, caseId string, sequencingId string, locusId string, transcriptId string, status int, body string, expected string) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/interpretations/v2/somatic/:case_id/:sequencing_id/:locus_id/:transcript_id", PostInterpretationSomatic(repo))

	req, _ := http.NewRequest("POST", fmt.Sprintf("/interpretations/v2/somatic/%s/%s/%s/%s", caseId, sequencingId, locusId, transcriptId), bytes.NewBufferString(body))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_PostInterpretationSomatic_create_ok(t *testing.T) {
	body := `{
			}`
	assertPostInterpretationSomatic(t, "11", "seq1", "locus1", "trans1", http.StatusOK, body, `{"case_id":"11", "created_at":"0001-01-01T00:00:00Z", "id":"uuid1", "locus_id":"locus1", "metadata": {}, "sequencing_id":"seq1", "transcript_id":"trans1", "updated_at":"0001-01-01T00:00:00Z"}`)
}

func Test_PostInterpretationSomatic_update_ok(t *testing.T) {
	body := `{
				"id":"uuid1"
			}`
	assertPostInterpretationSomatic(t, "11", "seq1", "locus1", "trans1", http.StatusOK, body, `{"case_id":"11", "created_at":"0001-01-01T00:00:00Z", "id":"uuid1", "locus_id":"locus1", "metadata": {},  "sequencing_id":"seq1", "transcript_id":"trans1", "updated_at":"0001-01-01T00:00:00Z"}`)
}

func Test_PostInterpretationSomatic_error(t *testing.T) {
	body := `{
				"id":"uuid2"
			}`
	assertPostInterpretationSomatic(t, "11", "seq1", "locus1", "trans1", http.StatusBadRequest, body, `{"status": 400, "message":"pubmed citation not found"}`)
}

func assertGetPubmedCitation(t *testing.T, id string, status int, expected string) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/interpretations/pubmed/:citation_id", GetPubmedCitation(repo))

	req, _ := http.NewRequest("GET", fmt.Sprintf("/interpretations/pubmed/%s", id), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, status, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_GetPubmedCitation_ok(t *testing.T) {
	assertGetPubmedCitation(t, "1", http.StatusOK, `{"id":"1", "nlm":{"format":"format1"}}`)
}

func Test_GetPubmedCitation_error(t *testing.T) {
	assertGetPubmedCitation(t, "2", http.StatusInternalServerError, `{"status": 500, "message":"Internal Server Error", "detail": "error"}`)
}

func Test_GetPubmedCitation_notFound(t *testing.T) {
	assertGetPubmedCitation(t, "3", http.StatusNotFound, `{"status": 404, "message":"citation not found"}`)
}
