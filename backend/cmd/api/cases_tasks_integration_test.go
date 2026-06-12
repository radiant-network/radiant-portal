package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func getCaseOccurrenceTasks(t *testing.T, db *gorm.DB, caseId int, seqId int, dataType string) (int, string) {
	t.Helper()
	repo := repository.NewTaskRepository(db)
	router := tenantRouter()
	router.GET("/:tenant/cases/:case_id/:seq_id/tasks_with_occurrences", server.CaseOccurrenceTasksHandler(repo))

	url := fmt.Sprintf("/radiant/cases/%d/%d/tasks_with_occurrences?data_type=%s", caseId, seqId, dataType)
	req, _ := http.NewRequest("GET", url, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w.Code, w.Body.String()
}

func Test_CaseOccurrenceTasksEndpoint_GermlineSNV_ReturnsAnnotationTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Seeded: task 5 (radiant_germline_annotation) attached to case 1 / seq 1.
		expected := `[{"id":5,"task_type_code":"radiant_germline_annotation","task_type_name":"RADIANT Germline Annotation","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2021-10-12T13:08:00Z"}]`
		code, body := getCaseOccurrenceTasks(t, env.Postgres, 1, 1, "germline_snv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_GermlineCNV_ReturnsAlignmentTaskFromCaseAgnosticContext(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Seeded: task 1 (alignment_germline_variant_calling) attached to seq 1 with case_id=NULL.
		// Should still surface for case 1 via the OR-NULL branch.
		expected := `[{"id":1,"task_type_code":"alignment_germline_variant_calling","task_type_name":"Genome Alignment and Germline Variant Calling","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2021-10-12T13:08:00Z"}]`
		code, body := getCaseOccurrenceTasks(t, env.Postgres, 1, 1, "germline_cnv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_SomaticSNV_ReturnsSomaticAnnotationTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Seeded: task 74 (radiant_somatic_annotation) attached to case 71 / seq 73.
		expected := `[{"id":74,"task_type_code":"radiant_somatic_annotation","task_type_name":"RADIANT Somatic Annotation","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2026-03-09T13:08:00Z"}]`
		code, body := getCaseOccurrenceTasks(t, env.Postgres, 71, 73, "somatic_snv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_NoMatchingTask_ReturnsEmptyArray(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Case 2 doesn't share seq 1 with case 1 — annotation task 5 must not leak.
		code, body := getCaseOccurrenceTasks(t, env.Postgres, 2, 1, "germline_snv")

		assert.Equal(t, http.StatusOK, code)
		assert.Equal(t, "[]", body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_InvalidDataType_Returns400(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		code, _ := getCaseOccurrenceTasks(t, env.Postgres, 1, 1, "not_a_real_type")
		assert.Equal(t, http.StatusBadRequest, code)
	})
}
