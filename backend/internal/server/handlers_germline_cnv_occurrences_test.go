package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type MockCNVRepository struct{}

func (m *MockCNVRepository) GetOccurrences(int, types.ListQuery) ([]types.GermlineCNVOccurrence, error) {
	return []types.GermlineCNVOccurrence{
		{
			Id:         "occ1",
			SeqID:      1,
			Aliquot:    "A1",
			Chromosome: "chr1",
			Start:      1000,
			End:        5000,
			Type:       "deletion",
			Length:     4000,
			Name:       "CNV_1",
			Quality:    99.5,
			Calls:      types.JsonArray[int]{1, 0, 1},
			Filter:     "PASS",
			BC:         10,
			CN:         2,
			PE:         types.JsonArray[int]{5, 3},
			SM:         0.95,
			SVType:     "DEL",
			SVLen:      4000,
			RefLen:     4000,
			CIEnd:      types.JsonArray[int]{-50, 50},
			CIPos:      types.JsonArray[int]{-100, 100},
		},
	}, nil
}

func (m *MockCNVRepository) CountOccurrences(int, types.CountQuery) (int64, error) {
	return 15, nil
}

func Test_CNVOccurrencesListHandler(t *testing.T) {
	repo := &MockCNVRepository{}
	router := gin.Default()
	router.POST("/occurrences/germline/cnv/:seq_id/list", OccurrencesGermlineCNVListHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/germline/cnv/1/list", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"id":"occ1",
		"seq_id":1,
		"aliquot":"A1",
		"chromosome":"chr1",
		"start":1000,
		"end":5000,
		"type":"deletion",
		"length":4000,
		"name":"CNV_1",
		"quality":99.5,
		"calls":[1,0,1],
		"filter":"PASS",
		"bc":10,
		"cn":2,
		"pe":[5,3],
		"sm":0.95,
		"svtype":"DEL",
		"svlen":4000,
		"reflen":4000,
		"ciend":[-50,50],
		"cipos":[-100,100]
	}]`, w.Body.String())
}

func Test_CNVOccurrencesCountHandler(t *testing.T) {
	repo := &MockCNVRepository{}
	router := gin.Default()
	router.POST("/occurrences/germline/cnv/:seq_id/count", OccurrencesGermlineCNVCountHandler(repo))

	req, _ := http.NewRequest("POST", "/occurrences/germline/cnv/1/count", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"count":15}`, w.Body.String())
}
