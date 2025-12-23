package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

type MockRepository struct{}

func (m *MockRepository) GetDocumentByUrl(url string) (*repository.Document, error) {
	return nil, nil
}

func (m *MockRepository) CreateDocument(document *repository.Document) error {
	return nil
}

func (m *MockRepository) CreateCaseHasSequencingExperiment(caseHasSeqExp *types.CaseHasSequencingExperiment) error {
	return nil
}

func (m *MockRepository) GetCaseAnalysisCatalogIdByCode(code string) (*repository.AnalysisCatalog, error) {
	return &repository.AnalysisCatalog{}, nil
}

func (m *MockRepository) CheckDatabaseConnection() string {
	return "up"
}

func (m *MockRepository) GetSequencing(int) (*types.Sequencing, error) {
	return &types.Sequencing{
		SeqId:                1,
		ExperimentalStrategy: "WGS",
		AnalysisType:         "germline",
		AffectedStatus:       "not_affected",
	}, nil
}

func (m *MockRepository) GetTermAutoComplete(string, string, int) (*[]types.AutoCompleteTerm, error) {
	return &[]types.AutoCompleteTerm{
			{Source: types.Term{
				ID:   "MONDO:0000001",
				Name: "blood group incompatibility",
			}, HighLight: types.Term{
				ID:   "MONDO:0000001",
				Name: "<strong>blood</strong> group incompatibility",
			}},
		},
		nil
}

func (m *MockRepository) GetOrganizations() (*[]string, error) {
	return &[]string{"CHOP"}, nil
}

func Test_StatusHandler(t *testing.T) {
	repoStarrocks := &MockRepository{}
	repoPostgres := &MockRepository{}
	router := gin.Default()
	router.GET("/status", StatusHandler(repoStarrocks, repoPostgres))

	req, _ := http.NewRequest("GET", "/status", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"status": {"starrocks": "up", "postgres": "up"}}`, w.Body.String())
}

func Test_GetSequencingHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/sequencing/:seq_id", GetSequencing(repo))

	req, _ := http.NewRequest("GET", "/sequencing/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"seq_id":1, "experimental_strategy":"WGS", "affected_status":"not_affected", "analysis_type": "germline"}`, w.Body.String())
}

func Test_MondoTermAutoCompleteHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/mondo/autocomplete", GetMondoTermAutoComplete(repo))

	req, _ := http.NewRequest("GET", "/mondo/autocomplete?prefix=blood", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"source":{"id":"MONDO:0000001", "name":"blood group incompatibility"}, "highlight":{"id":"MONDO:0000001", "name":"<strong>blood</strong> group incompatibility"}}]`, w.Body.String())
}

func Test_MondoTermAutoCompleteHandlerWithLimit(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/mondo/autocomplete", GetMondoTermAutoComplete(repo))

	req, _ := http.NewRequest("GET", "/mondo/autocomplete?prefix=blood&limit=10", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"source":{"id":"MONDO:0000001", "name":"blood group incompatibility"}, "highlight":{"id":"MONDO:0000001", "name":"<strong>blood</strong> group incompatibility"}}]`, w.Body.String())
}

func Test_MondoTermAutoCompleteHandlerWithInvalidLimit(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/mondo/autocomplete", GetMondoTermAutoComplete(repo))

	req, _ := http.NewRequest("GET", "/mondo/autocomplete?prefix=blood&limit=a", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"source":{"id":"MONDO:0000001", "name":"blood group incompatibility"}, "highlight":{"id":"MONDO:0000001", "name":"<strong>blood</strong> group incompatibility"}}]`, w.Body.String())
}
