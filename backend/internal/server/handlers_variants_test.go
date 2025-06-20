package server

import (
	"bytes"
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func (m *MockRepository) GetVariantHeader(int) (*types.VariantHeader, error) {
	return &types.VariantHeader{
		Hgvsg:           "hgvsg1",
		AssemblyVersion: "GRCh38",
		Source:          []string{"WGS"},
	}, nil
}

func (m *MockRepository) GetVariantOverview(int) (*types.VariantOverview, error) {
	return &types.VariantOverview{
		Locus:        "locus1",
		PfWgs:        0.99,
		PcWgs:        3,
		SiftPred:     "T",
		SiftScore:    0.1,
		FathmmPred:   "T",
		FathmmScore:  0.1,
		RevelScore:   0.1,
		CaddScore:    0.1,
		CaddPhred:    0.1,
		SpliceaiDs:   0.1,
		SpliceaiType: []string{"AG"},
		GnomadPli:    0.1,
		GnomadLoeuf:  0.1,
		GnomadV3Af:   0.01,
		Consequences: []string{"splice acceptor"},
	}, nil
}

func (r *MockRepository) GetVariantConsequences(int) (*[]types.VariantConsequence, error) {
	var transcriptsBRAF = []types.Transcript{{TranscriptId: "T001"}, {TranscriptId: "T002"}}
	var transcriptsBRAC = []types.Transcript{{TranscriptId: "T003"}}
	return &[]types.VariantConsequence{
		{Symbol: "BRAF", IsPicked: true, Transcripts: transcriptsBRAF},
		{Symbol: "BRAC", IsPicked: false, Transcripts: transcriptsBRAC},
	}, nil
}

func Test_GetVariantHeaderHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/:locus_id/header", GetGermlineVariantHeader(repo))

	req, _ := http.NewRequest("GET", "/variants/1000/header", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"hgvsg":"hgvsg1", "assembly_version": "GRCh38", "source": ["WGS"]}`, w.Body.String())
}

func Test_GetVariantOverviewHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/:locus_id/overview", GetGermlineVariantOverview(repo))

	req, _ := http.NewRequest("GET", "/variants/1000/overview", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"cadd_phred":0.1,
		"cadd_score":0.1,
		"fathmm_pred":"T",
		"fathmm_score":0.1,
		"gnomad_loeuf":0.1,
		"gnomad_pli":0.1,
		"gnomad_v3_af":0.01,
		"is_canonical":false,
		"is_mane_select":false, 
		"locus":"locus1",
		"pc_wgs":3, "pf_wgs":0.99,
		"picked_consequences":["splice acceptor"],
		"revel_score":0.1,
		"sift_pred":"T",
		"sift_score":0.1,
		"spliceai_ds":0.1,
		"spliceai_type":["AG"]
	}`, w.Body.String())
}

func Test_GetVariantConsequencesHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/variants/:locus_id/consequences", GetGermlineVariantConsequences(repo))

	req, _ := http.NewRequest("GET", "/variants/1000/consequences", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[
		{
			"symbol":"BRAF",
			"is_picked": true,
			"transcripts":[
				{"is_canonical":false, "is_mane_plus":false, "is_mane_select":false, "transcript_id": "T001"},
				{"is_canonical":false, "is_mane_plus":false, "is_mane_select":false, "transcript_id": "T002"}
			]
		}, 
		{
			"symbol":"BRAC",
			"is_picked": false, 
			"transcripts":[
				{"is_canonical":false, "is_mane_plus":false, "is_mane_select":false, "transcript_id": "T003"}
			]
		}
	]`, w.Body.String())
}
