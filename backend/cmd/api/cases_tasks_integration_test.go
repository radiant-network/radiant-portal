package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func getCaseOccurrenceTasks(t *testing.T, env *testutils.Env, caseId int, seqId int, dataType string) (int, string) {
	t.Helper()
	repo := postgres.NewTaskRepository(database.PostgresDB{DB: env.Postgres})
	cnvRepo := starrocks.NewGermlineCNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})
	router := tenantRouter()
	router.GET("/:tenant/cases/:case_id/:seq_id/tasks_with_occurrences", server.CaseOccurrenceTasksHandler(repo, cnvRepo))

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
		code, body := getCaseOccurrenceTasks(t, env, 1, 1, "germline_snv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_GermlineCNV_ReturnsAlignmentTaskFromCaseAgnosticContext(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres, Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		// Seeded: task 1 (alignment_germline_variant_calling) attached to seq 1 with case_id=NULL.
		// Should still surface for case 1 via the OR-NULL branch.
		expected := `[{"id":1,"task_type_code":"alignment_germline_variant_calling","task_type_name":"Genome Alignment and Germline Variant Calling","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2021-10-12T13:08:00Z"}]`
		code, body := getCaseOccurrenceTasks(t, env, 1, 1, "germline_cnv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_SomaticSNV_ReturnsSomaticAnnotationTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Seeded: task 74 (radiant_somatic_annotation) attached to case 71 / seq 73.
		expected := `[{"id":74,"task_type_code":"radiant_somatic_annotation","task_type_name":"RADIANT Somatic Annotation","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2026-03-09T13:08:00Z"}]`
		code, body := getCaseOccurrenceTasks(t, env, 71, 73, "somatic_snv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_SomaticCNV_ReturnsTumorOnlyVariantCallingTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Task 85 (tumor_only_variant_calling) shares tumoral seq 74 with the somatic SNV tasks
		// 74 and 82; the task type alone tells them apart.
		expected := `[{"id":85,"task_type_code":"tumor_only_variant_calling","task_type_name":"Somatic Variant Calling by Tumor-Only Sample","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2026-03-11T13:08:00Z"}]`
		code, body := getCaseOccurrenceTasks(t, env, 71, 74, "somatic_cnv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_SomaticSNVTumorOnly_ReturnsTumorOnlyTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Tumoral seq 74 carries both somatic tasks: 74 (paired with normal seq 73) and 82 (unpaired).
		expected := `[{"id":82,"task_type_code":"radiant_somatic_annotation","task_type_name":"RADIANT Somatic Annotation","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2026-03-10T13:08:00Z"}]`
		code, body := getCaseOccurrenceTasks(t, env, 71, 74, "somatic_snv_to")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_SomaticSNVTumorNormal_ExcludesTumorOnlyTaskOnSameTumorSeq(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// End-to-end guard on the "group by task_id alone" rule: were the tumoral/normal counts
		// narrowed to the queried seq 74, task 74 would read 1 tumoral / 0 normal and the two
		// tasks would swap cohorts.
		expected := `[{"id":74,"task_type_code":"radiant_somatic_annotation","task_type_name":"RADIANT Somatic Annotation","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2026-03-09T13:08:00Z"}]`
		code, body := getCaseOccurrenceTasks(t, env, 71, 74, "somatic_snv_tn")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_DeprecatedSomaticSNVAlias_MatchesTumorNormal(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// The alias must keep tumor-only task 82 out of the legacy "SNV (TN)" list.
		expected := `[{"id":74,"task_type_code":"radiant_somatic_annotation","task_type_name":"RADIANT Somatic Annotation","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2026-03-09T13:08:00Z"}]`
		code, body := getCaseOccurrenceTasks(t, env, 71, 74, "somatic_snv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_NoMatchingTask_ReturnsEmptyArray(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Case 2 doesn't share seq 1 with case 1 — annotation task 5 must not leak.
		code, body := getCaseOccurrenceTasks(t, env, 2, 1, "germline_snv")

		assert.Equal(t, http.StatusOK, code)
		assert.Equal(t, "[]", body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_InvalidDataType_Returns400(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		code, _ := getCaseOccurrenceTasks(t, env, 1, 1, "not_a_real_type")
		assert.Equal(t, http.StatusBadRequest, code)
	})
}

// RAD-169. Case 70 has proband 3: seq 70 is the proband's (sample 1), seq 71 a parent's (sample 2).
// CNV annotation task 86 is attached to case 70 on seqs 70, 71 and 72; alignment task 71 is on
// seq 70 and 72 on seq 71. StarRocks `simple` holds the slivar rows of task 86 on seq 70, one
// DRAGEN row of task 91020 on seq 70 (inserted in Postgres by the test that needs it), and none
// for alignment task 71.

const (
	alignmentTaskTypeName = "Genome Alignment and Germline Variant Calling"
	cnvAnnotationTypeName = "RADIANT Germline CNV Annotation"
	cnvAnnotationTaskType = "radiant_germline_cnv_annotation"
	alignmentTaskTypeCode = "alignment_germline_variant_calling"
)

func Test_CaseOccurrenceTasksEndpoint_GermlineCNV_ProbandWithNoDragenRows_ReturnsAnnotationTaskOnly(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres, Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		expected := fmt.Sprintf(`[{"id":86,"task_type_code":%q,"task_type_name":%q,"pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2026-04-01T13:08:00Z"}]`,
			cnvAnnotationTaskType, cnvAnnotationTypeName)
		code, body := getCaseOccurrenceTasks(t, env, 70, 70, "germline_cnv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_GermlineCNV_Parent_ReturnsAlignmentTaskOnly(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres, Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		expected := fmt.Sprintf(`[{"id":72,"task_type_code":%q,"task_type_name":%q,"pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2021-10-12T13:08:00Z"}]`,
			alignmentTaskTypeCode, alignmentTaskTypeName)
		code, body := getCaseOccurrenceTasks(t, env, 70, 71, "germline_cnv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_GermlineCNV_ProbandWithBothSets_ReturnsBothNewestFirst(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		// A DRAGEN set loaded before the slivar VCF arrived: the ETL does not backfill, so it stays.
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code)
				VALUES (91020, 'alignment_germline_variant_calling', 'Dragen', '4.4.4', 'GRch38', '2026-03-01 00:00:00', 'radiant');
			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id) VALUES (91020, 70, NULL);
		`).Error)

		expected := fmt.Sprintf(`[
			{"id":86,"task_type_code":%q,"task_type_name":%q,"pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2026-04-01T13:08:00Z"},
			{"id":91020,"task_type_code":%q,"task_type_name":%q,"pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2026-03-01T00:00:00Z"}
		]`, cnvAnnotationTaskType, cnvAnnotationTypeName, alignmentTaskTypeCode, alignmentTaskTypeName)
		code, body := getCaseOccurrenceTasks(t, env, 70, 70, "germline_cnv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_GermlineCNV_ProbandAnnotationTaskNotLoaded_NotListed(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		// Registered, but no slivar row loaded yet for seq 1: the DRAGEN set of task 1 must stay the default.
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code)
				VALUES (91023, 'radiant_germline_cnv_annotation', 'cnv-post-processing', '1.0.0', 'GRch38', '2026-05-01 00:00:00', 'radiant');
			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id) VALUES (91023, 1, 1);
		`).Error)

		expected := fmt.Sprintf(`[{"id":1,"task_type_code":%q,"task_type_name":%q,"pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2021-10-12T13:08:00Z"}]`,
			alignmentTaskTypeCode, alignmentTaskTypeName)
		code, body := getCaseOccurrenceTasks(t, env, 1, 1, "germline_cnv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}

func Test_CaseOccurrenceTasksEndpoint_GermlineCNV_ProbandNewAlignmentTaskAfterSlivar_NotListed(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		// A re-alignment of the proband after the slivar VCF: the ETL never loads its CNVs.
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code)
				VALUES (91021, 'alignment_germline_variant_calling', 'Dragen', '4.4.4', 'GRch38', '2026-06-01 00:00:00', 'radiant');
			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id) VALUES (91021, 70, NULL);
		`).Error)

		code, body := getCaseOccurrenceTasks(t, env, 70, 70, "germline_cnv")

		assert.Equal(t, http.StatusOK, code)
		assert.NotContains(t, body, `"id":91021`)
		assert.Contains(t, body, `"id":86`)
	})
}

func Test_CaseOccurrenceTasksEndpoint_GermlineCNV_ParentWithTwoAlignmentTasks_ReturnsBoth(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		// The copy step keys on task_id: a re-alignment keeps the old DRAGEN set next to the new one.
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code)
				VALUES (91022, 'alignment_germline_variant_calling', 'Dragen', '4.4.4', 'GRch38', '2026-06-01 00:00:00', 'radiant');
			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id) VALUES (91022, 71, NULL);
		`).Error)

		expected := fmt.Sprintf(`[
			{"id":91022,"task_type_code":%[1]q,"task_type_name":%[2]q,"pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2026-06-01T00:00:00Z"},
			{"id":72,"task_type_code":%[1]q,"task_type_name":%[2]q,"pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2021-10-12T13:08:00Z"}
		]`, alignmentTaskTypeCode, alignmentTaskTypeName)
		code, body := getCaseOccurrenceTasks(t, env, 70, 71, "germline_cnv")

		assert.Equal(t, http.StatusOK, code)
		assert.JSONEq(t, expected, body)
	})
}
