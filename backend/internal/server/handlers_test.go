package server

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

type MockRepository struct {
	caseType string
}

type MockIGVRepository struct {
	igvTracks []types.IGVTrack
	err       error
}

func (m *MockRepository) GetDocumentByUrl(url string) (*types.Document, error) {
	return nil, nil
}

func (m *MockRepository) CreateDocument(document *types.Document) error {
	return nil
}

func (m *MockRepository) CreateCaseHasSequencingExperiment(caseHasSeqExp *types.CaseHasSequencingExperiment) error {
	return nil
}

func (m *MockRepository) GetCaseAnalysisCatalogIdByCode(code string) (*types.AnalysisCatalog, error) {
	return &types.AnalysisCatalog{}, nil
}

func (m *MockRepository) CheckDatabaseConnection() string {
	return "up"
}

func (m *MockRepository) GetTermAutoComplete(ctx context.Context, termsTable string, input string, limit int) (*[]types.AutoCompleteTerm, error) {
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

func (m *MockRepository) GetTermNameById(ctx context.Context, termsTable string, id string) (*string, error) {
	if termsTable == types.MondoTable.Name && id == "MONDO:0000001" {
		name := "blood group incompatibility"
		return &name, nil
	}
	if termsTable == types.MondoTable.Name && id == "MONDO:0000002" {
		name := "blood vessel neoplasm"
		return &name, nil
	}
	if termsTable == types.MondoTable.Name && id == "MONDO:0000003" {
		name := "colorblindness, partial"
		return &name, nil
	}
	if termsTable == types.MondoTable.Name && id == "MONDO:0700092" {
		name := "neurodevelopmental disorder"
		return &name, nil
	}
	return nil, nil
}

func (m *MockRepository) GetOrganizations() (*[]string, error) {
	return &[]string{"CHOP"}, nil
}

func (r *MockIGVRepository) GetIGV(ctx context.Context, caseID int) ([]types.IGVTrack, error) {
	return r.igvTracks, r.err
}

func (m *MockRepository) GetCaseType(ctx context.Context, caseID int) (string, error) {
	return m.caseType, nil
}

func Test_StatusHandler(t *testing.T) {
	repoStarrocks := &MockRepository{}
	repoPostgres := &MockRepository{}
	router := gin.Default()
	router.GET("/status", StatusHandler(repoStarrocks, repoPostgres, stubTemplateStatus("ok"), stubTemplateStatus("ok")))

	req, _ := http.NewRequest("GET", "/status", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"status": {"starrocks": "up", "postgres": "up", "notification_templates": "ok", "report_templates": "ok"}}`, w.Body.String())
}

type stubTemplateStatus string

func (s stubTemplateStatus) Status() string { return string(s) }

func Test_StatusHandler_TemplateWarning_Still200(t *testing.T) {
	router := gin.Default()
	router.GET("/status", StatusHandler(&MockRepository{}, &MockRepository{}, stubTemplateStatus("warning"), stubTemplateStatus("error")))

	w := httptest.NewRecorder()
	router.ServeHTTP(w, httptest.NewRequest("GET", "/status", nil))

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"status": {"starrocks": "up", "postgres": "up", "notification_templates": "warning", "report_templates": "error"}}`, w.Body.String())
}

func Test_MondoTermAutoCompleteHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/:tenant/mondo/autocomplete", GetMondoTermAutoComplete(repo))

	req, _ := http.NewRequest("GET", "/radiant/mondo/autocomplete?prefix=blood", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"source":{"id":"MONDO:0000001", "name":"blood group incompatibility"}, "highlight":{"id":"MONDO:0000001", "name":"<strong>blood</strong> group incompatibility"}}]`, w.Body.String())
}

func Test_MondoTermAutoCompleteHandlerWithLimit(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/:tenant/mondo/autocomplete", GetMondoTermAutoComplete(repo))

	req, _ := http.NewRequest("GET", "/radiant/mondo/autocomplete?prefix=blood&limit=10", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"source":{"id":"MONDO:0000001", "name":"blood group incompatibility"}, "highlight":{"id":"MONDO:0000001", "name":"<strong>blood</strong> group incompatibility"}}]`, w.Body.String())
}

func Test_MondoTermAutoCompleteHandlerWithInvalidLimit(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/:tenant/mondo/autocomplete", GetMondoTermAutoComplete(repo))

	req, _ := http.NewRequest("GET", "/radiant/mondo/autocomplete?prefix=blood&limit=a", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"source":{"id":"MONDO:0000001", "name":"blood group incompatibility"}, "highlight":{"id":"MONDO:0000001", "name":"<strong>blood</strong> group incompatibility"}}]`, w.Body.String())
}

type MockCNVProfileRepository struct {
	documents []types.CNVProfileDocument
	segments  []types.CNVProfileSegment
	cytobands []types.Cytoband
	err       error
}

func (m *MockCNVProfileRepository) GetCNVProfileDocuments(ctx context.Context, seqID int) ([]types.CNVProfileDocument, error) {
	return m.documents, m.err
}

func (m *MockCNVProfileRepository) GetCNVProfileSegments(ctx context.Context, seqID int, taskID int) ([]types.CNVProfileSegment, error) {
	return m.segments, nil
}

func (m *MockCNVProfileRepository) GetCytobands(ctx context.Context) ([]types.Cytoband, error) {
	return m.cytobands, nil
}

// MockObjectStore serves objects from memory, keyed by S3 URL.
type MockObjectStore struct {
	objects map[string][]byte
	err     error
}

func (m *MockObjectStore) GetObject(ctx context.Context, url string, maxBytes int64) ([]byte, error) {
	if m.err != nil {
		return nil, m.err
	}
	data, ok := m.objects[url]
	if !ok {
		return nil, fmt.Errorf("get object %s: not found", url)
	}
	return data, nil
}

type MockGeneTrackRepository struct {
	genes  []types.GeneTrackGene
	symbol string
}

func (m *MockGeneTrackRepository) GetGeneTrack(ctx context.Context, chromosome string, start int, end int) ([]types.GeneTrackGene, error) {
	return m.genes, nil
}

func (m *MockGeneTrackRepository) GetGeneTrackBySymbol(ctx context.Context, symbol string) ([]types.GeneTrackGene, error) {
	m.symbol = symbol
	return m.genes, nil
}
