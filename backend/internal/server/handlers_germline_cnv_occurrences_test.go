package server

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type MockCNVRepository struct{}

func (m *MockCNVRepository) AggregateOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userQuery types.AggQuery) ([]repository.Aggregation, error) {
	return []types.Aggregation{
			{Bucket: "GAIN", Count: 2},
			{Bucket: "LOSS", Count: 1},
		},
		nil
}

func (m *MockCNVRepository) GetStatisticsOccurrences(context.Context, int, int, int, types.StatisticsQuery) (*types.Statistics, error) {
	return &types.Statistics{
			Min:  0,
			Max:  100,
			Type: types.IntegerType,
		},
		nil
}

func (m *MockCNVRepository) GetOccurrences(context.Context, int, int, int, types.ListQuery) ([]types.GermlineCNVOccurrence, error) {
	quality := float32(99.5)
	bc := 10
	cn := 2
	sm := float32(0.95)
	svLen := 4000
	refLen := 4000
	return []types.GermlineCNVOccurrence{
		{
			SeqID:      1,
			TaskID:     1,
			CnvID:      "1",
			Aliquot:    "A1",
			Chromosome: "chr1",
			Start:      1000,
			End:        5000,
			Type:       "deletion",
			Length:     4000,
			Name:       "CNV_1",
			Quality:    &quality,
			Calls:      types.JsonArray[int]{1, 0, 1},
			Filter:     "PASS",
			BC:         &bc,
			CN:         &cn,
			PE:         types.JsonArray[int]{5, 3},
			SM:         &sm,
			SVType:     "DEL",
			SVLen:      &svLen,
			RefLen:     &refLen,
			CIEnd:      types.JsonArray[int]{-50, 50},
			CIPos:      types.JsonArray[int]{-100, 100},
			NbSNV:      1,
			HasNote:    true,
			FlagType:   "star",
		},
		{
			SeqID:      1,
			TaskID:     1,
			CnvID:      "2",
			Aliquot:    "A1",
			Chromosome: "chr1",
			Start:      6000,
			End:        10000,
			Type:       "deletion",
			Length:     4000,
			Name:       "CNV_2",
			Quality:    &quality,
			Calls:      types.JsonArray[int]{1, 0, 1},
			Filter:     "PASS",
			BC:         &bc,
			CN:         &cn,
			PE:         types.JsonArray[int]{5, 3},
			SM:         &sm,
			SVType:     "DEL",
			SVLen:      &svLen,
			RefLen:     &refLen,
			CIEnd:      types.JsonArray[int]{-50, 50},
			CIPos:      types.JsonArray[int]{-100, 100},
			NbSNV:      0,
			HasNote:    true,
			FlagType:   "star",
		},
	}, nil
}

func (m *MockCNVRepository) CountOccurrences(context.Context, int, int, int, types.CountQuery) (int64, error) {
	return 15, nil
}

func (m *MockCNVRepository) GetGenesOverlap(ctx context.Context, caseId int, seqId int, taskId int, cnvId int) ([]types.CNVGeneOverlap, error) {
	return []types.CNVGeneOverlap{
		{
			Symbol:                 "GENE1",
			GeneId:                 "ENSG000001",
			GeneLength:             100,
			NbOverlapBases:         10,
			Cytoband:               []string{"p1.1", "p1.2"},
			NbExons:                1,
			OverlappingGenePercent: 10,
			OverlappingCNVPercent:  5,
			OverlapType:            "partial",
		},
	}, nil
}

func Test_CNVOccurrencesListHandler(t *testing.T) {
	repo := &MockCNVRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/list", OccurrencesGermlineCNVListHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/cnv/1/1/1/list", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"seq_id":1,
		"task_id":1,
		"cnv_id":"1",
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
		"cipos":[-100,100],
		"nb_snv": 1,
		"has_note": true,
		"flag_type": "star"
	},{
		"seq_id":1,
		"task_id":1,
		"cnv_id":"2",
		"aliquot":"A1",
		"chromosome":"chr1",
		"start":6000,
		"end":10000,
		"type":"deletion",
		"length":4000,
		"name":"CNV_2",
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
		"cipos":[-100,100],
		"nb_snv": 0,
		"has_note": true,
		"flag_type": "star"
	}]`, w.Body.String())
}

func Test_CNVOccurrencesCountHandler(t *testing.T) {
	repo := &MockCNVRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/count", OccurrencesGermlineCNVCountHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/cnv/1/1/1/count", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"count":15}`, w.Body.String())
}

func Test_CNVOccurrencesAggregateHandler(t *testing.T) {
	repo := &MockCNVRepository{}
	facetsRepo := &MockFacetsRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/aggregate", OccurrencesGermlineCNVAggregateHandler(repo, facetsRepo))

	body := `{
			"field": "type",
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		    },
			"size": 10
	}`
	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/cnv/1/1/1/aggregate", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"key": "GAIN", "count": 2}, {"key": "LOSS", "count": 1}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_CNVOccurrencesAggregateHandler_withDictionary(t *testing.T) {
	repo := &MockCNVRepository{}
	facetsRepo := &MockFacetsRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/aggregate", OccurrencesGermlineCNVAggregateHandler(repo, facetsRepo))

	body := `{
			"field": "type",
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		    },
			"size": 10
	}`
	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/cnv/1/1/1/aggregate?with_dictionary=true", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"key": "GAIN", "count": 2}, {"key": "LOSS", "count": 1}, {"key": "GAINLOH", "count": 0}, {"key": "CNLOH", "count": 0}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_CNVOccurrencesStatisticsHandler(t *testing.T) {
	repo := &MockCNVRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/statistics", OccurrencesGermlineCNVStatisticsHandler(repo))

	body := `{
			"field": "length",
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		    },
			"size": 10
	}`
	req, _ := http.NewRequest("POST", "/radiant/occurrences/germline/cnv/1/1/1/statistics", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `{"min": 0, "max": 100, "type": "integer"}`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_CNVOccurrencesGenesOverlapHandler(t *testing.T) {
	repo := &MockCNVRepository{}
	router := gin.Default()
	router.GET("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/:cnv_id/genes_overlap", OccurrencesGermlineCNVGenesOverlapHandler(repo))

	req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/cnv/1/1/1/1/genes_overlap", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[
		{
			"symbol": "GENE1",
			"gene_id": "ENSG000001",
			"gene_length": 100,	
			"nb_overlap_bases": 10,
			"cytoband": ["p1.1", "p1.2"],
			"nb_exons": 1,
			"overlapping_gene_percent": 10,
			"overlapping_cnv_percent": 5,
			"overlap_type": "partial"
		}
	]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}
