package server

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type mockGermlineReportBuilder struct {
	reports  []types.TranscriptReport
	err      error
	locusIds []int
}

func (m *mockGermlineReportBuilder) Build(_ context.Context, _ int, _ int, _ int, locusIds []int) ([]types.TranscriptReport, error) {
	m.locusIds = locusIds
	return m.reports, m.err
}

func getTranscriptReport(builder germlineReportBuilder, caseId string, seqId string, taskId string, locusId string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.GET("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/:locus_id/report", GetGermlineSNVTranscriptReport(builder))
	req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/snv/"+caseId+"/"+seqId+"/"+taskId+"/"+locusId+"/report", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_GetGermlineSNVTranscriptReport(t *testing.T) {
	builder := &mockGermlineReportBuilder{reports: []types.TranscriptReport{{
		Case:       types.ReportCase{CaseID: 1, SeqID: 1, TaskID: 5, SubmitterPatientID: "MRN-1", SubmitterSampleID: "S-1", IsProband: true, GenomeBuild: "GRCh38"},
		Variant:    types.ReportVariant{LocusID: "1000", Hgvsg: "chr7:g.140753336A>T", Symbol: "BRAF", Gnomad: &types.ReportGnomad{Af: 0.5, Ac: 1, An: 2, Hom: 0}},
		Occurrence: types.ReportOccurrence{Zygosity: "HET", ParentalOrigin: "mother"},
		Genes:      []types.ReportGene{{Symbol: "BRAF", Omim: []types.ReportOmim{}}},
		Transcripts: []types.ReportTranscript{{
			TranscriptID: "ENST1", Source: "Ensembl", Version: "6", Symbol: "BRAF", IsManeSelect: true, RefseqIDs: []string{"NM_1.6"},
			DnaChange: "c.1799T>A", ExonRank: "15", ExonTotal: "18",
			Interpretation: &types.ReportGermlineInterpretation{Classification: "LA6668-3", Pubmed: []types.InterpretationPubmed{{CitationID: "1", Citation: "format1"}}},
		}},
	}}}

	w := getTranscriptReport(builder, "1", "1", "5", "1000")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, []int{1000}, builder.locusIds)
	assert.JSONEq(t, `{
		"case": {"case_id": 1, "seq_id": 1, "task_id": 5, "submitter_patient_id": "MRN-1", "submitter_sample_id": "S-1", "is_proband": true, "genome_build": "GRCh38"},
		"variant": {"locus_id": "1000", "hgvsg": "chr7:g.140753336A>T", "symbol": "BRAF", "gnomad": {"af": 0.5, "ac": 1, "an": 2, "hom": 0}},
		"occurrence": {"zygosity": "HET", "parental_origin": "mother"},
		"genes": [{"symbol": "BRAF", "omim": []}],
		"transcripts": [{
			"transcript_id": "ENST1", "source": "Ensembl", "version": "6", "symbol": "BRAF",
			"is_mane_select": true, "is_mane_plus": false, "is_canonical": false, "refseq_ids": ["NM_1.6"],
			"dna_change": "c.1799T>A", "exon_rank": "15", "exon_total": "18",
			"interpretation": {"classification": "LA6668-3", "pubmed": [{"citation_id": "1", "citation": "format1"}]}
		}]
	}`, w.Body.String())
}

func Test_GetGermlineSNVTranscriptReport_NoReport_NotFound(t *testing.T) {
	w := getTranscriptReport(&mockGermlineReportBuilder{reports: []types.TranscriptReport{}}, "1", "1", "5", "1000")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404, "message":"occurrence not found"}`, w.Body.String())
}

func Test_GetGermlineSNVTranscriptReport_NilReports_NotFound(t *testing.T) {
	w := getTranscriptReport(&mockGermlineReportBuilder{}, "1", "1", "77", "1000")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404, "message":"occurrence not found"}`, w.Body.String())
}

func Test_GetGermlineSNVTranscriptReport_BuilderError_InternalError(t *testing.T) {
	w := getTranscriptReport(&mockGermlineReportBuilder{err: errors.New("boom")}, "1", "1", "5", "1000")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500, "message":"Internal Server Error"}`, w.Body.String())
	assert.NotEmpty(t, w.Header().Get("X-Correlation-ID"))
}

func Test_GetGermlineSNVTranscriptReport_InvalidLocusId_NotFound(t *testing.T) {
	w := getTranscriptReport(&mockGermlineReportBuilder{}, "1", "1", "5", "not-a-number")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404, "message":"locus_id not found"}`, w.Body.String())
}

func Test_GetGermlineSNVTranscriptReport_InvalidCaseId_NotFound(t *testing.T) {
	w := getTranscriptReport(&mockGermlineReportBuilder{}, "x", "1", "5", "1000")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404, "message":"case_id not found"}`, w.Body.String())
}
