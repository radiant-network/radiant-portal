package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/report"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/xuri/excelize/v2"
)

// radiantTemplateDir serves the qlin files under the "radiant" tenant of the test routes.
func radiantTemplateDir(t *testing.T) string {
	t.Helper()
	dir := t.TempDir()
	for _, kind := range []string{"germline", "somatic"} {
		source, err := os.ReadFile(filepath.Join("..", "..", "internal", "report", "testdata", "transcripts_"+kind+"_qlin.xlsx"))
		require.NoError(t, err)
		require.NoError(t, os.WriteFile(filepath.Join(dir, "transcripts_"+kind+"_radiant.xlsx"), source, 0o600))
	}
	return dir
}

func getGermlineTranscriptReportsXlsx(t *testing.T, caseId int, seqId int, taskId int, query string, assertResponse func(w *httptest.ResponseRecorder)) {
	getTranscriptReportsXlsx(t, "germline", caseId, seqId, taskId, query, assertResponse)
}

func getTranscriptReportsXlsx(t *testing.T, kind string, caseId int, seqId int, taskId int, query string, assertResponse func(w *httptest.ResponseRecorder)) {
	testutils.RunTest(t, testutils.Need{Starrocks: "transcript_report", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repoTranscriptReport := starrocks.NewTranscriptReportRepository(database.StarrocksDB{DB: env.Starrocks})
		repoInterpretations := postgres.NewInterpretationsRepository(database.PostgresDB{DB: env.Postgres}, &MockExternalClient{})
		builder := report.NewBuilder(repoTranscriptReport, repoInterpretations)
		templates := report.LoadTemplates(radiantTemplateDir(t))
		router := tenantRouter()
		router.GET("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/reports/transcripts", server.GetGermlineSNVTranscriptReportsXlsx(builder, templates))
		router.GET("/:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/reports/transcripts", server.GetSomaticSNVTranscriptReportsXlsx(builder, templates))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/radiant/occurrences/%s/snv/%d/%d/%d/reports/transcripts%s", kind, caseId, seqId, taskId, query), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		assertResponse(w)
	})
}

func Test_GetGermlineSNVTranscriptReportsXlsx_Integration(t *testing.T) {
	getGermlineTranscriptReportsXlsx(t, 1, 1, 5, "?locus_ids=1000,2000", func(w *httptest.ResponseRecorder) {
		require.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", w.Header().Get("Content-Type"))
		assert.Regexp(t, `^attachment; filename="MRN-283775_1_\d{8}T\d{6}Z\.xlsx"$`, w.Header().Get("Content-Disposition"))

		f, err := excelize.OpenReader(bytes.NewReader(w.Body.Bytes()))
		require.NoError(t, err)
		defer func() { _ = f.Close() }()
		assert.Equal(t, []string{"chr7_g.140753336A>T", "chr1_g.1000A>G"}, f.GetSheetList())
		rows, err := f.GetRows("chr7_g.140753336A>T")
		require.NoError(t, err)
		require.Len(t, rows, 3)
		assert.Equal(t, "chr7:g.140753336A>T\nGène : BRAF\nNM_004333.6\nc.1799T>A\np.Val600Glu\nExon: 15/18", rows[1][0])
		assert.Equal(t, "Heterozygous\n(Mother het, Father ref)", rows[1][1])
		assert.Equal(t, "2 / 152000 allèles (0 hom) 0.0000123", rows[1][2])
		assert.Equal(t, "Pathogenic, Likely pathogenic\n(ID : 13961)", rows[1][4])
		assert.Equal(t, "Noonan syndrome 7\n(MIM: 613706, AD)\nLEOPARD syndrome 3\n(MIM: 613707, AD)", rows[1][5])
		assert.Equal(t, "Pathogenic", rows[2][6])
		assert.Equal(t, "S13224", rows[1][9])
		rows, err = f.GetRows("chr1_g.1000A>G")
		require.NoError(t, err)
		assert.Len(t, rows, 1)
	})
}

func Test_GetGermlineSNVTranscriptReportsXlsx_Integration_ForeignLocus_NotFound(t *testing.T) {
	getGermlineTranscriptReportsXlsx(t, 1, 1, 5, "?locus_ids=1000,3000", func(w *httptest.ResponseRecorder) {
		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.JSONEq(t, `{"status":404, "message":"occurrence not found"}`, w.Body.String())
	})
}

func Test_GetGermlineSNVTranscriptReportsXlsx_Integration_NoId_BadRequest(t *testing.T) {
	getGermlineTranscriptReportsXlsx(t, 1, 1, 5, "", func(w *httptest.ResponseRecorder) {
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func Test_GetGermlineSNVTranscriptReportsXlsx_Integration_TaskNotOfCase_NotFound(t *testing.T) {
	getGermlineTranscriptReportsXlsx(t, 1, 1, 77, "?locus_ids=1000", func(w *httptest.ResponseRecorder) {
		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.JSONEq(t, `{"status":404, "message":"occurrence not found"}`, w.Body.String())
	})
}

func Test_GetSomaticSNVTranscriptReportsXlsx_Integration(t *testing.T) {
	getTranscriptReportsXlsx(t, "somatic", 1, 1, 5, "?locus_ids=1000,2000", func(w *httptest.ResponseRecorder) {
		require.Equal(t, http.StatusOK, w.Code)
		assert.Regexp(t, `^attachment; filename="MRN-283775_1_\d{8}T\d{6}Z\.xlsx"$`, w.Header().Get("Content-Disposition"))

		f, err := excelize.OpenReader(bytes.NewReader(w.Body.Bytes()))
		require.NoError(t, err)
		defer func() { _ = f.Close() }()
		assert.Equal(t, []string{"chr7_g.140753336A>T", "chr1_g.1000A>G"}, f.GetSheetList())
		rows, err := f.GetRows("chr7_g.140753336A>T")
		require.NoError(t, err)
		require.Len(t, rows, 3)
		assert.Equal(t, "chr7:g.140753336A>T\nGène : BRAF\nNM_004333.6\nc.1799T>A\np.Val600Glu\nExon: 15/18", rows[1][0])
		assert.Equal(t, "50%\n(17/34 lectures)", rows[1][1])
		assert.Equal(t, "Somatique", rows[1][2])
		assert.Equal(t, "0.0000123\n(2 / 152000 allèles)", rows[1][3])
		assert.Equal(t, "99\n(COSV56056643)", rows[1][4])
		assert.Equal(t, "COSMIC : Tier 1", rows[1][6])
		assert.Equal(t, "Oui", rows[1][8])
		assert.Equal(t, "Non", rows[2][8])
		// The seeded somatic interpretation on T001 holds legacy labels, not codes: its cells stay empty.
		assert.Equal(t, "COSMIC : Tier 1", rows[2][6])
		rows, err = f.GetRows("chr1_g.1000A>G")
		require.NoError(t, err)
		assert.Len(t, rows, 1)
	})
}

func Test_GetSomaticSNVTranscriptReportsXlsx_Integration_ForeignLocus_NotFound(t *testing.T) {
	getTranscriptReportsXlsx(t, "somatic", 1, 1, 5, "?locus_ids=1000,3000", func(w *httptest.ResponseRecorder) {
		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}
