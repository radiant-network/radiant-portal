package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

type MockRepository struct{}

func (m *MockRepository) CheckDatabaseConnection() string {
	return "up"
}

func (m *MockRepository) GetOccurrences(int, types.ListQuery) ([]types.Occurrence, error) {
	return []types.Occurrence{
		{
			SeqId:        1,
			LocusId:      1000,
			Filter:       "PASS",
			Zygosity:     "HET",
			Pf:           0.99,
			Af:           0.01,
			Hgvsg:        "hgvsg1",
			AdRatio:      1.0,
			VariantClass: "class1",
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

func (m *MockRepository) FindInterpretationGermline(sequencingId string, locus string, transcriptId string) (*types.InterpretationGerminal, error) {
	return &types.InterpretationGerminal{SequencingID: "SR00001", LocusID: "locus1", TranscriptID: "transcript1"}, nil
}

func (m *MockRepository) CreateInterpretationGermline(interpretation *types.InterpretationGerminal) error {
	return nil
}

func (m *MockRepository) UpdateInterpretationGermline(interpretation *types.InterpretationGerminal) error {
	return nil
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

func Test_OccurrencesListHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/:seq_id/list", OccurrencesListHandler(repo))
	body := `{
			"selected_fields":[
				"seq_id","locus_id","filter","zygosity","pf","af","hgvsg","ad_ratio","variant_class"
			]
	}`
	req, _ := http.NewRequest("POST", "/occurrences/1/list", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
        "seq_id": 1,
        "locus_id": 1000,
        "filter": "PASS",
        "zygosity": "HET",
        "pf": 0.99,
        "af": 0.01,
        "hgvsg": "hgvsg1",
        "ad_ratio": 1.0,
        "variant_class": "class1"
    }]`, w.Body.String())
}

func Test_OccurrencesCountHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/:seq_id/count", OccurrencesCountHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/1/count", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"count":15}`, w.Body.String())
}

func Test_OccurrencesAggregateHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/occurrences/:seq_id/aggregate", OccurrencesAggregateHandler(repo))

	body := `{
			"field": "zygosity",
			"sqon":{
				"op":"in",
				"field": "filter",
				"value": "PASS"
		    },
			"size": 10
	}`
	req, _ := http.NewRequest("POST", "/occurrences/1/aggregate", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"key": "HET", "count": 2}, {"key": "HOM", "count": 1}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}
