package postgres

import (
	"context"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func Test_CreateAndGetTask_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		newTask := &types.Task{
			ID:              8888,
			TaskTypeCode:    "radiant_germline_annotation",
			PipelineName:    "dragen",
			PipelineVersion: "4.4.4",
			GenomeBuild:     "GRch38",
			TenantCode:      types.DefaultTenantCode,
		}

		// Test Create
		err := repo.CreateTask(t.Context(), newTask)
		assert.NoError(t, err)

		// Test GetTaskById
		result, err := repo.GetTaskById(t.Context(), 8888)
		assert.NoError(t, err)
		assert.Equal(t, 8888, result.ID)
		assert.Equal(t, "radiant_germline_annotation", result.TaskTypeCode)
		assert.Equal(t, "dragen", result.PipelineName)
		assert.Equal(t, "4.4.4", result.PipelineVersion)
		assert.Equal(t, "GRch38", result.GenomeBuild)

		env.Postgres.Exec("DELETE FROM task WHERE id = 8888")
	})
}

func Test_CreateTask_NilError(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateTask(t.Context(), nil)
		assert.Error(t, err)
	})
}

func Test_GetTaskById_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetTaskById(t.Context(), 999999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateAndGetTaskContext_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		se := 72
		newContext := &types.TaskContext{
			TaskID:                 1,
			CaseID:                 nil,
			SequencingExperimentID: se,
		}

		err := repo.CreateTaskContext(t.Context(), newContext)
		assert.NoError(t, err)

		ctxs, err := repo.GetTaskContextByTaskId(t.Context(), 1)
		assert.NoError(t, err)
		assert.Len(t, ctxs, 2)
		assert.Equal(t, 1, ctxs[1].TaskID)
		assert.Equal(t, se, ctxs[1].SequencingExperimentID)
		assert.Nil(t, ctxs[1].CaseID)

		// Clean up
		env.Postgres.Exec("DELETE FROM task_context WHERE task_id = 1 AND sequencing_experiment_id = 72")
	})
}

func Test_CreateTaskContext_NilError(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateTaskContext(t.Context(), nil)
		assert.Error(t, err)
	})
}

func Test_GetTaskContextByTaskId_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetTaskContextByTaskId(t.Context(), 999999)
		assert.NoError(t, err)
		assert.Empty(t, result)
	})
}

func Test_CreateAndGetTaskHasDocument_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		doc := &types.TaskHasDocument{
			TaskID:     1,
			DocumentID: 265,
			Type:       "output",
		}

		err := repo.CreateTaskHasDocument(t.Context(), doc)
		assert.NoError(t, err)

		thd, err := repo.GetTaskHasDocumentByTaskId(t.Context(), 1)
		assert.NoError(t, err)
		assert.Len(t, thd, 6)
		assert.Equal(t, 1, thd[5].TaskID)
		assert.Equal(t, 265, thd[5].DocumentID)
		assert.Equal(t, "output", thd[5].Type)

		// Clean up
		env.Postgres.Exec("DELETE FROM task_has_document WHERE task_id = 1 AND document_id = 265")
	})
}

func Test_CreateTaskHasDocument_NilError(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateTaskHasDocument(t.Context(), nil)
		assert.Error(t, err)
	})
}

func Test_GetTaskTypeCodes(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetTaskTypeCodes(t.Context())
		assert.NoError(t, err)
		assert.Greater(t, len(result), 0)
	})
}

func Test_GetTaskHasDocumentByTaskId_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetTaskHasDocumentByTaskId(t.Context(), 999999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_GetTaskHasDocumentByDocumentId_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetTaskHasDocumentByDocumentId(t.Context(), 1)

		expected := []*types.TaskHasDocument{
			{
				TaskID:     14,
				DocumentID: 1,
				Type:       "output",
			},
		}

		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, expected, result)
	})
}

func Test_GetTaskHasDocumentByDocumentId_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetTaskHasDocumentByDocumentId(t.Context(), 999999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_GetTaskContextBySequencingExperimentId_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetTaskContextBySequencingExperimentId(t.Context(), 1)

		caseId := 1

		expected := []*types.TaskContext{
			{
				CaseID:                 nil,
				TaskID:                 1,
				SequencingExperimentID: 1,
			},
			{
				CaseID:                 &caseId,
				TaskID:                 4,
				SequencingExperimentID: 1,
			},
			{
				CaseID:                 &caseId,
				TaskID:                 5,
				SequencingExperimentID: 1,
			},
			{
				CaseID:                 &caseId,
				TaskID:                 6,
				SequencingExperimentID: 1,
			},
		}

		assert.NoError(t, err)
		assert.Len(t, result, 4)
		assert.Equal(t, expected, result)
	})
}

func Test_GetTaskContextBySequencingExperimentId_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetTaskContextBySequencingExperimentId(t.Context(), 999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

// Seed data referenced below (see test/data/clinical/01_task.sql and 05_task_context.sql):
//   - Task 1 (alignment_germline_variant_calling) — task_context (task=1, seq=1, case=NULL)
//   - Task 5 (radiant_germline_annotation)        — task_context (task=5, seq=1, case=1) [and seqs 2, 3]
//   - Task 74 (radiant_somatic_annotation)        — task_context (task=74, seq=73, case=71) + (task=74, seq=74, case=71)
//   - Task 82 (radiant_somatic_annotation)        — task_context (task=82, seq=74, case=71)
//
// Seq 73 reads sample 124 (histology normal, aliquot NSRX1091646) and seq 74 reads sample 126
// (histology tumoral, aliquot TSRX1091647), so task 74 is tumor-normal and task 82 — sharing
// that same tumoral sequencing — is tumor-only.

func Test_ListTasksByCaseAndSequencing_GermlineSNV_ReturnsGermlineAnnotationTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		selector, _ := types.OccurrenceTypeGermlineSNV.TaskSelector()
		result, err := repo.ListTasksByCaseAndSequencing(t.Context(), 1, 1, selector)

		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 5, result[0].ID)
		assert.Equal(t, types.RadiantGermlineAnnotationTask, result[0].TaskTypeCode)
		assert.Equal(t, "RADIANT Germline Annotation", result[0].TaskTypeName)
	})
}

func Test_ListTasksByCaseAndSequencing_GermlineCNV_ReturnsGermlineAlignmentTaskAttachedToSequencing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		selector, _ := types.OccurrenceTypeGermlineCNV.TaskSelector()
		result, err := repo.ListTasksByCaseAndSequencing(t.Context(), 1, 1, selector)

		// Task 1 has task_context.case_id = NULL — included via the OR-NULL branch.
		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 1, result[0].ID)
		assert.Equal(t, types.AlignmentGermlineVariantCallingTaskTypeCode, result[0].TaskTypeCode)
	})
}

func Test_ListTasksByCaseAndSequencing_SomaticSNV_ReturnsSomaticAnnotationTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		selector, _ := types.OccurrenceTypeSomaticSNVTumorNormal.TaskSelector()
		result, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 73, selector)

		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 74, result[0].ID)
		assert.Equal(t, types.RadiantSomaticAnnotationTask, result[0].TaskTypeCode)
	})
}

func Test_ListTasksByCaseAndSequencing_SomaticTumorOnly_ReturnsTumorOnlyTaskOnly(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		selector, _ := types.OccurrenceTypeSomaticSNVTumorOnly.TaskSelector()
		result, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 74, selector)

		// Tasks 74 and 82 both hang off tumoral seq 74; only 82 lacks a normal counterpart.
		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 82, result[0].ID)
		assert.Equal(t, types.RadiantSomaticAnnotationTask, result[0].TaskTypeCode)
	})
}

func Test_ListTasksByCaseAndSequencing_SomaticTumorNormal_ExcludesTumorOnlyTaskOnSameTumorSeq(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		selector, _ := types.OccurrenceTypeSomaticSNVTumorNormal.TaskSelector()
		result, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 74, selector)

		// Guards the "group by task_id alone" rule: were the counts narrowed to seq 74,
		// task 74 would read 1 tumoral / 0 normal and swap cohorts with task 82.
		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 74, result[0].ID)
	})
}

func Test_ListTasksByCaseAndSequencing_SomaticCNV_ReturnsTumorOnlyVariantCallingTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		selector, _ := types.OccurrenceTypeSomaticCNV.TaskSelector()
		result, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 74, selector)

		// Task 85 hangs off the same tumoral seq 74 as the somatic SNV tasks 74 and 82; only
		// the task type tells them apart, since this selector carries no cohort predicate.
		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 85, result[0].ID)
		assert.Equal(t, types.TumorOnlyVariantCallingTaskTypeCode, result[0].TaskTypeCode)
		assert.Equal(t, "Somatic Variant Calling by Tumor-Only Sample", result[0].TaskTypeName)
	})
}

func Test_ListTasksByCaseAndSequencing_SomaticCNV_ExcludedFromSomaticSNVCohorts(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		// The CNV task carries a tumoral sequencing and no normal one, so it would satisfy the
		// tumor-only cohort predicate — the task type is what keeps it out of the SNV tab.
		selector, _ := types.OccurrenceTypeSomaticSNVTumorOnly.TaskSelector()
		result, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 74, selector)

		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 82, result[0].ID)
	})
}

func Test_ListTasksByCaseAndSequencing_DeprecatedSomaticSNVAlias_MatchesTumorNormal(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		// Spelled as the wire value rather than the deprecated constant, since that is all a
		// legacy client still sends.
		selector, _ := types.OccurrenceType("somatic_snv").TaskSelector()
		result, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 74, selector)

		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 74, result[0].ID)
	})
}

func Test_ListTasksByCaseAndSequencing_MalformedTaskWithNoTumoralSeq_ExcludedFromBothCohorts(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		// A somatic task covering only the normal sequencing: 0 tumoral / 1 normal.
		require.NoError(t, db.Exec(`
			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code)
				VALUES (91101, 'radiant_somatic_annotation', 'Dragen', '4.4.4', 'GRch38', '2026-03-11 00:00:00', 'radiant');
			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id)
				VALUES (91101, 73, 71);
		`).Error)

		repo := NewTaskRepository(database.PostgresDB{DB: db})

		tumorNormal, _ := types.OccurrenceTypeSomaticSNVTumorNormal.TaskSelector()
		resultTN, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 73, tumorNormal)
		assert.NoError(t, err)
		assert.Len(t, resultTN, 1)
		assert.Equal(t, 74, resultTN[0].ID)

		tumorOnly, _ := types.OccurrenceTypeSomaticSNVTumorOnly.TaskSelector()
		resultTO, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 73, tumorOnly)
		assert.NoError(t, err)
		assert.Empty(t, resultTO)
	})
}

func Test_ListTasksByCaseAndSequencing_MalformedTaskWithTwoTumoralSeqs_ExcludedFromBothCohorts(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		// A somatic task covering two tumoral sequencings and no normal: 2 tumoral / 0 normal.
		// This is what keeps the tumor-only predicate at n_tumoral = 1 rather than n_tumoral > 0.
		require.NoError(t, db.Exec(`
			INSERT INTO sample (id, type_code, parent_sample_id, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
				VALUES (91100, 'dna', 125, 'brain', 'tumoral', 'SRX1091648', 62, 'LDM-CHUSJ', 'radiant');
			INSERT INTO sequencing_experiment (id, sample_id, status_code, aliquot, sequencing_lab_code, tenant_code, run_name, run_alias, run_date, capture_kit, created_on, updated_on, experimental_strategy_code, sequencing_read_technology_code, platform_code)
				VALUES (91100, 91100, 'completed', 'TSRX1091648', 'CQGC', 'radiant', 1680, 'TSRX1091648_1680', '2026-03-08', 'SureSelect Custom DNA Target', '2026-03-09T13:08:00-04:00', '2026-03-09T13:08:00-04:00', 'wgs', 'short_read', 'illumina');
			INSERT INTO case_has_sequencing_experiment (sequencing_experiment_id, case_id) VALUES (91100, 71);

			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code)
				VALUES (91102, 'radiant_somatic_annotation', 'Dragen', '4.4.4', 'GRch38', '2026-03-11 00:00:00', 'radiant');
			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id) VALUES
				(91102, 74, 71),
				(91102, 91100, 71);
		`).Error)
		// cleanUp deletes sample and sequencing_experiment BEFORE task_context, so those
		// deletes fail on the FKs, and it never touches a case_has_sequencing_experiment row
		// on case 71. Undo in FK order here — t.Cleanup fires after cleanUp has removed the
		// task_context rows.
		t.Cleanup(func() {
			db.Exec("DELETE FROM case_has_sequencing_experiment WHERE sequencing_experiment_id = 91100")
			db.Exec("DELETE FROM sequencing_experiment WHERE id = 91100")
			db.Exec("DELETE FROM sample WHERE id = 91100")
		})

		repo := NewTaskRepository(database.PostgresDB{DB: db})

		tumorOnly, _ := types.OccurrenceTypeSomaticSNVTumorOnly.TaskSelector()
		resultTO, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 74, tumorOnly)
		assert.NoError(t, err)
		assert.Len(t, resultTO, 1)
		assert.Equal(t, 82, resultTO[0].ID)

		tumorNormal, _ := types.OccurrenceTypeSomaticSNVTumorNormal.TaskSelector()
		resultTN, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 74, tumorNormal)
		assert.NoError(t, err)
		assert.Len(t, resultTN, 1)
		assert.Equal(t, 74, resultTN[0].ID)
	})
}

// The cohort counts feed a subquery, so their shape cannot be observed through results alone.
// Render the SQL without executing it.
func somaticCohortCountsSQL(ctx context.Context, db *gorm.DB) string {
	var rows []map[string]any
	tx := NewTaskRepository(database.PostgresDB{DB: db}).
		somaticCohortCounts(ctx).
		Session(&gorm.Session{DryRun: true}).
		Find(&rows)
	return tx.Statement.SQL.String()
}

func Test_SomaticCohortCounts_GroupsByTaskIdAlone(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		sql := somaticCohortCountsSQL(context.Background(), env.Postgres)

		// Narrowing the grouping to a sequencing experiment or case would reclassify every
		// tumor-normal task as tumor-only.
		assert.Contains(t, sql, "GROUP BY")
		assert.NotContains(t, sql, "sequencing_experiment_id =")
		assert.NotContains(t, sql, "case_id")
		assert.Equal(t, 1, strings.Count(sql, "GROUP BY"))
		groupBy := sql[strings.Index(sql, "GROUP BY"):]
		assert.NotContains(t, groupBy, ",", "group by must carry task_id and nothing else")
	})
}

func Test_SomaticCohortCounts_ScopesSubqueryToBoundTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		ctx := types.ContextWithTenant(context.Background(), "demo")
		sql := somaticCohortCountsSQL(ctx, env.Postgres)

		assert.Contains(t, sql, "k_task.tenant_code", "the subquery's task join must be tenant-scoped too")
	})
}

func Test_SomaticCohortCounts_NoTenantPredicate_WhenNoTenantBound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		sql := somaticCohortCountsSQL(context.Background(), env.Postgres)

		assert.NotContains(t, sql, "tenant_code")
	})
}

func Test_SomaticCohortPredicate_TumorNormalRequiresBothSides(t *testing.T) {
	predicate, err := somaticCohortPredicate(types.SomaticCohortTumorNormal)

	assert.NoError(t, err)
	assert.Equal(t, "k.n_tumoral > 0 AND k.n_normal > 0", predicate)
}

func Test_SomaticCohortPredicate_TumorOnlyRequiresExactlyOneTumoralAndNoNormal(t *testing.T) {
	predicate, err := somaticCohortPredicate(types.SomaticCohortTumorOnly)

	assert.NoError(t, err)
	assert.Equal(t, "k.n_tumoral = 1 AND k.n_normal = 0", predicate)
}

func Test_SomaticCohortPredicate_UnknownCohort_ReturnsError(t *testing.T) {
	predicate, err := somaticCohortPredicate(types.SomaticCohort("tumor_maybe"))

	assert.Error(t, err)
	assert.Empty(t, predicate)
}

func Test_SomaticCohortPredicate_EmptyCohort_ReturnsError(t *testing.T) {
	predicate, err := somaticCohortPredicate(types.SomaticCohortNone)

	assert.Error(t, err)
	assert.Empty(t, predicate)
}

func Test_ListTasksByCaseAndSequencing_EmptyWhenCaseHasNoMatchingTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(database.PostgresDB{DB: env.Postgres})

		// Case 2 has its own sequencings (4, 5, 6) — querying with seq 1 (which
		// belongs to case 1) must not leak case 1's annotation task (task 5).
		selector, _ := types.OccurrenceTypeGermlineSNV.TaskSelector()
		result, err := repo.ListTasksByCaseAndSequencing(t.Context(), 2, 1, selector)

		assert.NoError(t, err)
		assert.Empty(t, result)
	})
}

func Test_ListTasksByCaseAndSequencing_SortedByCreatedOnDesc(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		require.NoError(t, db.Exec(`
			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code) VALUES
				(91001, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2024-01-01 00:00:00', 'radiant'),
				(91002, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2025-01-01 00:00:00', 'radiant');
			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id) VALUES
				(91001, 1, 1),
				(91002, 1, 1);
		`).Error)

		repo := NewTaskRepository(database.PostgresDB{DB: db})
		selector, _ := types.OccurrenceTypeGermlineSNV.TaskSelector()
		result, err := repo.ListTasksByCaseAndSequencing(t.Context(), 1, 1, selector)

		assert.NoError(t, err)
		assert.Len(t, result, 3) // seeded task 5 (2021) + inserted 91001 (2024) + 91002 (2025)
		assert.Equal(t, 91002, result[0].ID)
		assert.Equal(t, 91001, result[1].ID)
		assert.Equal(t, 5, result[2].ID)
	})
}

func Test_ListTasksByCaseAndSequencing_ExcludesTaskAttachedToDifferentCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		// Insert a right-type task attached to (case=70, seq=70). Case 70 + seq 70
		// is a real case_has_sequencing_experiment pair, so the FK is satisfied.
		require.NoError(t, db.Exec(`
			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code)
				VALUES (91003, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2025-01-01 00:00:00', 'radiant');
			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id)
				VALUES (91003, 70, 70);
		`).Error)

		repo := NewTaskRepository(database.PostgresDB{DB: db})
		selector, _ := types.OccurrenceTypeGermlineSNV.TaskSelector()

		// Querying with a *different* case on the same sequencing must not see
		// the case-scoped task we just inserted.
		resultOtherCase, err := repo.ListTasksByCaseAndSequencing(t.Context(), 71, 70, selector)
		assert.NoError(t, err)
		assert.Empty(t, resultOtherCase)

		// Sanity check: querying with the right case does see it.
		resultRightCase, err := repo.ListTasksByCaseAndSequencing(t.Context(), 70, 70, selector)
		assert.NoError(t, err)
		assert.Len(t, resultRightCase, 1)
		assert.Equal(t, 91003, resultRightCase[0].ID)
	})
}

func Test_ListTasksByCaseAndSequencing_CaseAgnosticTaskReturnedForBothCasesSharingSequencing(t *testing.T) {
	// The core of the original bug: two cases reuse the same sequencing.
	// A case-agnostic task on that sequencing must be returned for BOTH cases,
	// while a case-specific task must be returned ONLY for its case.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		require.NoError(t, db.Exec(`
			-- Make seq 1 (already linked to case 1 in seed) also linked to case 70.
			INSERT INTO case_has_sequencing_experiment (sequencing_experiment_id, case_id) VALUES (1, 70);

			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code) VALUES
				(91010, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2024-01-01 00:00:00', 'radiant'),
				(91011, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2025-01-01 00:00:00', 'radiant');

			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id) VALUES
				(91010, 1, NULL),  -- case-agnostic on seq 1
				(91011, 1, 70);    -- case-specific to case 70 on seq 1
		`).Error)
		// Global cleanUp only removes case_has_sequencing_experiment rows with
		// case_id >= 1000; our row uses case 70. Schedule a delete that fires
		// AFTER cleanUp has removed the referencing task_context rows.
		t.Cleanup(func() {
			db.Exec("DELETE FROM case_has_sequencing_experiment WHERE sequencing_experiment_id = 1 AND case_id = 70")
		})

		repo := NewTaskRepository(database.PostgresDB{DB: db})
		selector, _ := types.OccurrenceTypeGermlineSNV.TaskSelector()

		// Case 1 sees: seeded task 5 (case=1) + case-agnostic 91010. Not 91011 (case=70).
		fromCase1, err := repo.ListTasksByCaseAndSequencing(t.Context(), 1, 1, selector)
		assert.NoError(t, err)
		assert.Len(t, fromCase1, 2)
		assert.Equal(t, 91010, fromCase1[0].ID) // 2024 > 2021
		assert.Equal(t, 5, fromCase1[1].ID)

		// Case 70 sees: case-specific 91011 + case-agnostic 91010. Not task 5 (case=1).
		fromCase70, err := repo.ListTasksByCaseAndSequencing(t.Context(), 70, 1, selector)
		assert.NoError(t, err)
		assert.Len(t, fromCase70, 2)
		assert.Equal(t, 91011, fromCase70[0].ID) // 2025 > 2024
		assert.Equal(t, 91010, fromCase70[1].ID)
	})
}
