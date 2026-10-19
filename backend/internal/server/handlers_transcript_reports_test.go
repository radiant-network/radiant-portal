package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/report"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type mockReportBuilder struct {
	reports  []types.TranscriptReport
	err      error
	locusIds []int
	kind     report.Kind
}

func (m *mockReportBuilder) BuildGermline(_ context.Context, _ int, _ int, _ int, locusIds []int) ([]types.TranscriptReport, error) {
	m.locusIds, m.kind = locusIds, report.KindGermline
	return m.reports, m.err
}

func (m *mockReportBuilder) BuildSomatic(_ context.Context, _ int, _ int, _ int, locusIds []int) ([]types.TranscriptReport, error) {
	m.locusIds, m.kind = locusIds, report.KindSomatic
	return m.reports, m.err
}

type mockTranscriptReportRenderer struct {
	out      []byte
	err      error
	tenant   string
	kind     report.Kind
	rendered []types.TranscriptReport
}

func (m *mockTranscriptReportRenderer) Render(tenant string, kind report.Kind, reports []types.TranscriptReport) ([]byte, error) {
	m.tenant, m.kind, m.rendered = tenant, kind, reports
	return m.out, m.err
}

func getTranscriptReportsXlsx(builder transcriptReportBuilder, renderer transcriptReportRenderer, caseId string, seqId string, taskId string, query string) *httptest.ResponseRecorder {
	return getTranscriptReportsXlsxOf("germline", builder, renderer, caseId, seqId, taskId, query)
}

func getTranscriptReportsXlsxOf(kind string, builder transcriptReportBuilder, renderer transcriptReportRenderer, caseId string, seqId string, taskId string, query string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	router.GET("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/reports/transcripts", GetGermlineSNVTranscriptReportsXlsx(builder, renderer))
	router.GET("/:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/reports/transcripts", GetSomaticSNVTranscriptReportsXlsx(builder, renderer))
	req, _ := http.NewRequest("GET", "/qlin/occurrences/"+kind+"/snv/"+caseId+"/"+seqId+"/"+taskId+"/reports/transcripts"+query, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func xlsxReports(hgvsgs ...string) []types.TranscriptReport {
	reports := make([]types.TranscriptReport, len(hgvsgs))
	for i, hgvsg := range hgvsgs {
		reports[i] = types.TranscriptReport{Case: types.ReportCase{CaseID: 140, SubmitterPatientID: "MRN-1"}, Variant: types.ReportVariant{Hgvsg: hgvsg}}
	}
	return reports
}

func Test_GetGermlineSNVTranscriptReportsXlsx(t *testing.T) {
	builder := &mockReportBuilder{reports: xlsxReports("chr1:g.1A>T", "chr1:g.2A>T")}
	renderer := &mockTranscriptReportRenderer{out: []byte("PK-workbook")}

	w := getTranscriptReportsXlsx(builder, renderer, "140", "140", "280", "?locus_ids=1000,2000")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, []int{1000, 2000}, builder.locusIds)
	assert.Equal(t, report.KindGermline, builder.kind)
	assert.Equal(t, "qlin", renderer.tenant)
	assert.Equal(t, report.KindGermline, renderer.kind)
	assert.Equal(t, builder.reports, renderer.rendered)
	assert.Equal(t, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", w.Header().Get("Content-Type"))
	assert.Regexp(t, `^attachment; filename="MRN-1_140_\d{8}T\d{6}Z\.xlsx"$`, w.Header().Get("Content-Disposition"))
	assert.Equal(t, "PK-workbook", w.Body.String())
}

func Test_GetGermlineSNVTranscriptReportsXlsx_DuplicateIdsCollapsed(t *testing.T) {
	builder := &mockReportBuilder{reports: xlsxReports("chr1:g.1A>T")}

	w := getTranscriptReportsXlsx(builder, &mockTranscriptReportRenderer{}, "140", "140", "280", "?locus_ids=1000,%201000,")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, []int{1000}, builder.locusIds)
}

func Test_GetGermlineSNVTranscriptReportsXlsx_HundredIds(t *testing.T) {
	ids := make([]string, 100)
	hgvsgs := make([]string, 100)
	for i := range ids {
		ids[i] = fmt.Sprint(i + 1)
		hgvsgs[i] = fmt.Sprintf("chr1:g.%dA>T", i+1)
	}
	builder := &mockReportBuilder{reports: xlsxReports(hgvsgs...)}

	w := getTranscriptReportsXlsx(builder, &mockTranscriptReportRenderer{}, "140", "140", "280", "?locus_ids="+strings.Join(ids, ","))

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Len(t, builder.locusIds, 100)
}

func Test_GetGermlineSNVTranscriptReportsXlsx_NoId_400(t *testing.T) {
	for _, query := range []string{"", "?locus_ids=", "?locus_ids=,"} {
		w := getTranscriptReportsXlsx(&mockReportBuilder{}, &mockTranscriptReportRenderer{}, "140", "140", "280", query)
		assert.Equal(t, http.StatusBadRequest, w.Code, query)
		assert.JSONEq(t, `{"status":400,"message":"locus_ids: 1 to 100 ids required, got 0"}`, w.Body.String(), query)
	}
}

func Test_GetGermlineSNVTranscriptReportsXlsx_OverCap_400(t *testing.T) {
	ids := make([]string, 101)
	for i := range ids {
		ids[i] = fmt.Sprint(i + 1)
	}

	w := getTranscriptReportsXlsx(&mockReportBuilder{}, &mockTranscriptReportRenderer{}, "140", "140", "280", "?locus_ids="+strings.Join(ids, ","))

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"locus_ids: 1 to 100 ids required, got 101"}`, w.Body.String())
}

func Test_GetGermlineSNVTranscriptReportsXlsx_MalformedId_400(t *testing.T) {
	w := getTranscriptReportsXlsx(&mockReportBuilder{}, &mockTranscriptReportRenderer{}, "140", "140", "280", "?locus_ids=1000,chr1")

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"locus_ids: \"chr1\" is not an id"}`, w.Body.String())
}

func Test_GetGermlineSNVTranscriptReportsXlsx_InvalidPathIds_404(t *testing.T) {
	for _, ids := range [][3]string{{"x", "140", "280"}, {"140", "x", "280"}, {"140", "140", "x"}} {
		w := getTranscriptReportsXlsx(&mockReportBuilder{}, &mockTranscriptReportRenderer{}, ids[0], ids[1], ids[2], "?locus_ids=1")
		assert.Equal(t, http.StatusNotFound, w.Code)
	}
}

func Test_GetGermlineSNVTranscriptReportsXlsx_ForeignLocus_404(t *testing.T) {
	builder := &mockReportBuilder{reports: xlsxReports("chr1:g.1A>T")}

	w := getTranscriptReportsXlsx(builder, &mockTranscriptReportRenderer{}, "140", "140", "280", "?locus_ids=1000,2000")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"occurrence not found"}`, w.Body.String())
}

func Test_GetGermlineSNVTranscriptReportsXlsx_TaskNotOfCase_404(t *testing.T) {
	w := getTranscriptReportsXlsx(&mockReportBuilder{reports: nil}, &mockTranscriptReportRenderer{}, "140", "140", "280", "?locus_ids=1000")

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_GetGermlineSNVTranscriptReportsXlsx_TemplateMissing_503(t *testing.T) {
	builder := &mockReportBuilder{reports: xlsxReports("chr1:g.1A>T")}
	renderer := &mockTranscriptReportRenderer{err: fmt.Errorf("%w %q (germline)", report.ErrTemplateMissing, "qlin")}

	w := getTranscriptReportsXlsx(builder, renderer, "140", "140", "280", "?locus_ids=1000")

	assert.Equal(t, http.StatusServiceUnavailable, w.Code)
	assert.JSONEq(t, `{"status":503,"message":"report template missing for tenant \"qlin\" (germline)"}`, w.Body.String())
}

func Test_GetGermlineSNVTranscriptReportsXlsx_BuilderError_500(t *testing.T) {
	w := getTranscriptReportsXlsx(&mockReportBuilder{err: errors.New("boom")}, &mockTranscriptReportRenderer{}, "140", "140", "280", "?locus_ids=1000")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
	assert.NotEmpty(t, w.Header().Get("X-Correlation-ID"))
}

func Test_GetGermlineSNVTranscriptReportsXlsx_RenderError_500(t *testing.T) {
	builder := &mockReportBuilder{reports: xlsxReports("chr1:g.1A>T")}

	w := getTranscriptReportsXlsx(builder, &mockTranscriptReportRenderer{err: errors.New("boom")}, "140", "140", "280", "?locus_ids=1000")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func Test_GetSomaticSNVTranscriptReportsXlsx(t *testing.T) {
	builder := &mockReportBuilder{reports: xlsxReports("chr1:g.1A>T")}
	renderer := &mockTranscriptReportRenderer{out: []byte("PK-workbook")}

	w := getTranscriptReportsXlsxOf("somatic", builder, renderer, "140", "140", "280", "?locus_ids=1000")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, report.KindSomatic, builder.kind)
	assert.Equal(t, report.KindSomatic, renderer.kind)
	assert.Equal(t, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", w.Header().Get("Content-Type"))
	assert.Regexp(t, `^attachment; filename="MRN-1_140_\d{8}T\d{6}Z\.xlsx"$`, w.Header().Get("Content-Disposition"))
}

func Test_GetSomaticSNVTranscriptReportsXlsx_TemplateMissing_503(t *testing.T) {
	builder := &mockReportBuilder{reports: xlsxReports("chr1:g.1A>T")}
	renderer := &mockTranscriptReportRenderer{err: fmt.Errorf("%w %q (somatic)", report.ErrTemplateMissing, "qlin")}

	w := getTranscriptReportsXlsxOf("somatic", builder, renderer, "140", "140", "280", "?locus_ids=1000")

	assert.Equal(t, http.StatusServiceUnavailable, w.Code)
	assert.JSONEq(t, `{"status":503,"message":"report template missing for tenant \"qlin\" (somatic)"}`, w.Body.String())
}
