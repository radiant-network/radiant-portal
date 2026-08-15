package server

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository/starrocks"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/stretchr/testify/assert"
)

type MockSomaticCNVRepository struct{}

func (m *MockSomaticCNVRepository) AggregateOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userQuery types.AggQuery) ([]starrocks.Aggregation, error) {
	return []types.Aggregation{
			{Bucket: "GAIN", Count: 2},
			{Bucket: "CNLOH", Count: 1},
		},
		nil
}

func (m *MockSomaticCNVRepository) GetStatisticsOccurrences(context.Context, int, int, int, types.StatisticsQuery) (*types.Statistics, error) {
	return &types.Statistics{
			Min:  0,
			Max:  100,
			Type: types.IntegerType,
		},
		nil
}

// The first row carries the full ASCN block; the second has it entirely NULL, which is what
// DRAGEN 3.10.8 files look like.
func (m *MockSomaticCNVRepository) GetOccurrences(context.Context, int, int, int, types.ListQuery) ([]types.SomaticCNVOccurrence, error) {
	return []types.SomaticCNVOccurrence{
		{
			SeqID:      74,
			TaskID:     85,
			CnvID:      "1",
			Aliquot:    "A1",
			Chromosome: "chr1",
			Start:      1000,
			End:        5000,
			Type:       "GAIN",
			Length:     4000,
			Name:       "SCNV_1",
			Quality:    utils.Float32Ptr(99.5),
			Calls:      types.JsonArray[int]{1, 0, 1},
			Filter:     "PASS",
			BC:         utils.IntPtr(10),
			PE:         types.JsonArray[int]{5, 3},
			SM:         utils.Float32Ptr(0.95),
			SVType:     "DUP",
			SVLen:      utils.IntPtr(4000),
			RefLen:     utils.IntPtr(4000),
			CIEnd:      types.JsonArray[int]{-50, 50},
			CIPos:      types.JsonArray[int]{-100, 100},
			NbSNV:      1,
			CN:         utils.IntPtr(3),
			CNF:        utils.Float32Ptr(3.12),
			CNQ:        utils.Float32Ptr(42.5),
			MCN:        utils.IntPtr(1),
			MCNF:       utils.Float32Ptr(1.04),
			MCNQ:       utils.Float32Ptr(30.2),
			MAF:        utils.Float32Ptr(0.42),
			SD:         utils.Float32Ptr(0.11),
			ASCNAS:     utils.IntPtr(2),
			HasNote:    true,
			FlagType:   "star",
		},
		{
			SeqID:      74,
			TaskID:     85,
			CnvID:      "2",
			Aliquot:    "A1",
			Chromosome: "chr1",
			Start:      6000,
			End:        10000,
			Type:       "CNLOH",
			Length:     4000,
			Name:       "SCNV_2",
			Quality:    utils.Float32Ptr(99.5),
			Calls:      types.JsonArray[int]{1, 0, 1},
			Filter:     "PASS",
			BC:         utils.IntPtr(10),
			PE:         types.JsonArray[int]{5, 3},
			SM:         utils.Float32Ptr(0.95),
			SVType:     "LOH",
			SVLen:      utils.IntPtr(4000),
			RefLen:     utils.IntPtr(4000),
			CIEnd:      types.JsonArray[int]{-50, 50},
			CIPos:      types.JsonArray[int]{-100, 100},
			NbSNV:      0,
			HasNote:    true,
			FlagType:   "star",
		},
	}, nil
}

func (m *MockSomaticCNVRepository) CountOccurrences(context.Context, int, int, int, types.CountQuery) (int64, error) {
	return 15, nil
}

func (m *MockSomaticCNVRepository) GetGenesOverlap(ctx context.Context, caseId int, seqId int, taskId int, cnvId int) ([]types.CNVGeneOverlap, error) {
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

func Test_SomaticCNVOccurrencesListHandler(t *testing.T) {
	repo := &MockSomaticCNVRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/list", OccurrencesSomaticCNVListHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/somatic/cnv/71/74/85/list", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"seq_id":74,
		"task_id":85,
		"cnv_id":"1",
		"aliquot":"A1",
		"chromosome":"chr1",
		"start":1000,
		"end":5000,
		"type":"GAIN",
		"length":4000,
		"name":"SCNV_1",
		"quality":99.5,
		"calls":[1,0,1],
		"filter":"PASS",
		"bc":10,
		"pe":[5,3],
		"sm":0.95,
		"svtype":"DUP",
		"svlen":4000,
		"reflen":4000,
		"ciend":[-50,50],
		"cipos":[-100,100],
		"nb_snv": 1,
		"cn": 3,
		"cnf": 3.12,
		"cnq": 42.5,
		"mcn": 1,
		"mcnf": 1.04,
		"mcnq": 30.2,
		"maf": 0.42,
		"sd": 0.11,
		"ascn_as": 2,
		"has_note": true,
		"flag_type": "star"
	},{
		"seq_id":74,
		"task_id":85,
		"cnv_id":"2",
		"aliquot":"A1",
		"chromosome":"chr1",
		"start":6000,
		"end":10000,
		"type":"CNLOH",
		"length":4000,
		"name":"SCNV_2",
		"quality":99.5,
		"calls":[1,0,1],
		"filter":"PASS",
		"bc":10,
		"pe":[5,3],
		"sm":0.95,
		"svtype":"LOH",
		"svlen":4000,
		"reflen":4000,
		"ciend":[-50,50],
		"cipos":[-100,100],
		"nb_snv": 0,
		"has_note": true,
		"flag_type": "star"
	}]`, w.Body.String())
}

func Test_SomaticCNVOccurrencesCountHandler(t *testing.T) {
	repo := &MockSomaticCNVRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/count", OccurrencesSomaticCNVCountHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/somatic/cnv/71/74/85/count", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"count":15}`, w.Body.String())
}

func Test_SomaticCNVOccurrencesAggregateHandler(t *testing.T) {
	repo := &MockSomaticCNVRepository{}
	facetsRepo := &MockFacetsRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/aggregate", OccurrencesSomaticCNVAggregateHandler(repo, facetsRepo))

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
	req, _ := http.NewRequest("POST", "/radiant/occurrences/somatic/cnv/71/74/85/aggregate", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"key": "GAIN", "count": 2}, {"key": "CNLOH", "count": 1}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

// Both LOH values must be offered as zero-count buckets — they are somatic CNV's own domain.
func Test_SomaticCNVOccurrencesAggregateHandler_withDictionary(t *testing.T) {
	repo := &MockSomaticCNVRepository{}
	facetsRepo := &MockFacetsRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/aggregate", OccurrencesSomaticCNVAggregateHandler(repo, facetsRepo))

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
	req, _ := http.NewRequest("POST", "/radiant/occurrences/somatic/cnv/71/74/85/aggregate?with_dictionary=true", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `[{"key": "GAIN", "count": 2}, {"key": "CNLOH", "count": 1}, {"key": "LOSS", "count": 0}, {"key": "GAINLOH", "count": 0}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_SomaticCNVOccurrencesStatisticsHandler(t *testing.T) {
	repo := &MockSomaticCNVRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/statistics", OccurrencesSomaticCNVStatisticsHandler(repo))

	body := `{
			"field": "maf",
			"sqon":{
				"op":"in",
				"content":{
					"field": "filter",
					"value": ["PASS"]
				}
		    },
			"size": 10
	}`
	req, _ := http.NewRequest("POST", "/radiant/occurrences/somatic/cnv/71/74/85/statistics", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	expected := `{"min": 0, "max": 100, "type": "integer"}`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_SomaticCNVOccurrencesGenesOverlapHandler(t *testing.T) {
	repo := &MockSomaticCNVRepository{}
	router := gin.Default()
	router.GET("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/:cnv_id/genes_overlap", OccurrencesSomaticCNVGenesOverlapHandler(repo))

	req, _ := http.NewRequest("GET", "/radiant/occurrences/somatic/cnv/71/74/85/1/genes_overlap", nil)
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

func Test_SomaticCNVOccurrencesListHandler_NonNumericSeqId_Returns404(t *testing.T) {
	repo := &MockSomaticCNVRepository{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/list", OccurrencesSomaticCNVListHandler(repo))

	req, _ := http.NewRequest("POST", "/radiant/occurrences/somatic/cnv/71/not-a-number/85/list", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}
