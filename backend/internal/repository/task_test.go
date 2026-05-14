package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func Test_CreateAndGetTask_OK(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)

		newTask := &types.Task{
			ID:              8888,
			TaskTypeCode:    "radiant_germline_annotation",
			PipelineName:    "dragen",
			PipelineVersion: "4.4.4",
			GenomeBuild:     "GRch38",
		}

		// Test Create
		err := repo.CreateTask(newTask)
		assert.NoError(t, err)

		// Test GetTaskById
		result, err := repo.GetTaskById(8888)
		assert.NoError(t, err)
		assert.Equal(t, 8888, result.ID)
		assert.Equal(t, "radiant_germline_annotation", result.TaskTypeCode)
		assert.Equal(t, "dragen", result.PipelineName)
		assert.Equal(t, "4.4.4", result.PipelineVersion)
		assert.Equal(t, "GRch38", result.GenomeBuild)

		db.Exec("DELETE FROM task WHERE id = 8888")
	})
}

func Test_CreateTask_NilError(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		err := repo.CreateTask(nil)
		assert.Error(t, err)
	})
}

func Test_GetTaskById_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		result, err := repo.GetTaskById(999999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateAndGetTaskContext_OK(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)

		se := 72
		newContext := &types.TaskContext{
			TaskID:                 1,
			CaseID:                 nil,
			SequencingExperimentID: se,
		}

		err := repo.CreateTaskContext(newContext)
		assert.NoError(t, err)

		ctxs, err := repo.GetTaskContextByTaskId(1)
		assert.NoError(t, err)
		assert.Len(t, ctxs, 2)
		assert.Equal(t, 1, ctxs[1].TaskID)
		assert.Equal(t, se, ctxs[1].SequencingExperimentID)
		assert.Nil(t, ctxs[1].CaseID)

		// Clean up
		db.Exec("DELETE FROM task_context WHERE task_id = 1 AND sequencing_experiment_id = 72")
	})
}

func Test_CreateTaskContext_NilError(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		err := repo.CreateTaskContext(nil)
		assert.Error(t, err)
	})
}

func Test_GetTaskContextByTaskId_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		result, err := repo.GetTaskContextByTaskId(999999)
		assert.NoError(t, err)
		assert.Empty(t, result)
	})
}

func Test_CreateAndGetTaskHasDocument_OK(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)

		doc := &types.TaskHasDocument{
			TaskID:     1,
			DocumentID: 265,
			Type:       "output",
		}

		err := repo.CreateTaskHasDocument(doc)
		assert.NoError(t, err)

		thd, err := repo.GetTaskHasDocumentByTaskId(1)
		assert.NoError(t, err)
		assert.Len(t, thd, 6)
		assert.Equal(t, 1, thd[5].TaskID)
		assert.Equal(t, 265, thd[5].DocumentID)
		assert.Equal(t, "output", thd[5].Type)

		// Clean up
		db.Exec("DELETE FROM task_has_document WHERE task_id = 1 AND document_id = 265")
	})
}

func Test_CreateTaskHasDocument_NilError(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		err := repo.CreateTaskHasDocument(nil)
		assert.Error(t, err)
	})
}

func Test_GetTaskTypeCodes(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		result, err := repo.GetTaskTypeCodes()
		assert.NoError(t, err)
		assert.Greater(t, len(result), 0)
	})
}

func Test_GetTaskHasDocumentByTaskId_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		result, err := repo.GetTaskHasDocumentByTaskId(999999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_GetTaskHasDocumentByDocumentId_OK(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		result, err := repo.GetTaskHasDocumentByDocumentId(1)

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
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		result, err := repo.GetTaskHasDocumentByDocumentId(999999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_GetTaskContextBySequencingExperimentId_OK(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		result, err := repo.GetTaskContextBySequencingExperimentId(1)

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
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewTaskRepository(db)
		result, err := repo.GetTaskContextBySequencingExperimentId(999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

// Seed data referenced below (see test/data/clinical/01_task.sql and 05_task_context.sql):
//   - Task 1 (alignment_germline_variant_calling) — task_context (task=1, seq=1, case=NULL)
//   - Task 5 (radiant_germline_annotation)        — task_context (task=5, seq=1, case=1) [and seqs 2, 3]
//   - Task 74 (radiant_somatic_annotation)        — task_context (task=74, seq=73, case=71)

func Test_ListTasksByCaseSeqAndTaskType_GermlineSNV_ReturnsGermlineAnnotationTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(env.Postgres)

		code, _ := types.OccurrenceTypeGermlineSNV.TaskTypeCode()
		result, err := repo.ListTasksByCaseSeqAndTaskType(1, 1, *code)

		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 5, result[0].ID)
		assert.Equal(t, types.RadiantGermlineAnnotationTask, result[0].TaskTypeCode)
		assert.Equal(t, "RADIANT Germline Annotation", result[0].TaskTypeName)
	})
}

func Test_ListTasksByCaseSeqAndTaskType_GermlineCNV_ReturnsGermlineAlignmentTaskAttachedToSequencing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(env.Postgres)

		code, _ := types.OccurrenceTypeGermlineCNV.TaskTypeCode()
		result, err := repo.ListTasksByCaseSeqAndTaskType(1, 1, *code)

		// Task 1 has task_context.case_id = NULL — included via the OR-NULL branch.
		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 1, result[0].ID)
		assert.Equal(t, types.AlignmentGermlineVariantCallingTaskTypeCode, result[0].TaskTypeCode)
	})
}

func Test_ListTasksByCaseSeqAndTaskType_SomaticSNV_ReturnsSomaticAnnotationTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(env.Postgres)

		code, _ := types.OccurrenceTypeSomaticSNV.TaskTypeCode()
		result, err := repo.ListTasksByCaseSeqAndTaskType(71, 73, *code)

		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, 74, result[0].ID)
		assert.Equal(t, types.RadiantSomaticAnnotationTask, result[0].TaskTypeCode)
	})
}

func Test_ListTasksByCaseSeqAndTaskType_EmptyWhenCaseHasNoMatchingTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTaskRepository(env.Postgres)

		// Case 2 has its own sequencings (4, 5, 6) — querying with seq 1 (which
		// belongs to case 1) must not leak case 1's annotation task (task 5).
		code, _ := types.OccurrenceTypeGermlineSNV.TaskTypeCode()
		result, err := repo.ListTasksByCaseSeqAndTaskType(2, 1, *code)

		assert.NoError(t, err)
		assert.Empty(t, result)
	})
}

func Test_ListTasksByCaseSeqAndTaskType_SortedByCreatedOnDesc(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		require.NoError(t, db.Exec(`
			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on) VALUES
				(91001, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2024-01-01 00:00:00'),
				(91002, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2025-01-01 00:00:00');
			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id) VALUES
				(91001, 1, 1),
				(91002, 1, 1);
		`).Error)

		repo := NewTaskRepository(db)
		code, _ := types.OccurrenceTypeGermlineSNV.TaskTypeCode()
		result, err := repo.ListTasksByCaseSeqAndTaskType(1, 1, *code)

		assert.NoError(t, err)
		assert.Len(t, result, 3) // seeded task 5 (2021) + inserted 91001 (2024) + 91002 (2025)
		assert.Equal(t, 91002, result[0].ID)
		assert.Equal(t, 91001, result[1].ID)
		assert.Equal(t, 5, result[2].ID)
	})
}

func Test_ListTasksByCaseSeqAndTaskType_ExcludesTaskAttachedToDifferentCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		// Insert a right-type task attached to (case=70, seq=70). Case 70 + seq 70
		// is a real case_has_sequencing_experiment pair, so the FK is satisfied.
		require.NoError(t, db.Exec(`
			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on)
				VALUES (91003, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2025-01-01 00:00:00');
			INSERT INTO task_context (task_id, sequencing_experiment_id, case_id)
				VALUES (91003, 70, 70);
		`).Error)

		repo := NewTaskRepository(db)
		code, _ := types.OccurrenceTypeGermlineSNV.TaskTypeCode()

		// Querying with a *different* case on the same sequencing must not see
		// the case-scoped task we just inserted.
		resultOtherCase, err := repo.ListTasksByCaseSeqAndTaskType(71, 70, *code)
		assert.NoError(t, err)
		assert.Empty(t, resultOtherCase)

		// Sanity check: querying with the right case does see it.
		resultRightCase, err := repo.ListTasksByCaseSeqAndTaskType(70, 70, *code)
		assert.NoError(t, err)
		assert.Len(t, resultRightCase, 1)
		assert.Equal(t, 91003, resultRightCase[0].ID)
	})
}

func Test_ListTasksByCaseSeqAndTaskType_CaseAgnosticTaskReturnedForBothCasesSharingSequencing(t *testing.T) {
	// The core of the original bug: two cases reuse the same sequencing.
	// A case-agnostic task on that sequencing must be returned for BOTH cases,
	// while a case-specific task must be returned ONLY for its case.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		require.NoError(t, db.Exec(`
			-- Make seq 1 (already linked to case 1 in seed) also linked to case 70.
			INSERT INTO case_has_sequencing_experiment (sequencing_experiment_id, case_id) VALUES (1, 70);

			INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on) VALUES
				(91010, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2024-01-01 00:00:00'),
				(91011, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2025-01-01 00:00:00');

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

		repo := NewTaskRepository(db)
		code, _ := types.OccurrenceTypeGermlineSNV.TaskTypeCode()

		// Case 1 sees: seeded task 5 (case=1) + case-agnostic 91010. Not 91011 (case=70).
		fromCase1, err := repo.ListTasksByCaseSeqAndTaskType(1, 1, *code)
		assert.NoError(t, err)
		assert.Len(t, fromCase1, 2)
		assert.Equal(t, 91010, fromCase1[0].ID) // 2024 > 2021
		assert.Equal(t, 5, fromCase1[1].ID)

		// Case 70 sees: case-specific 91011 + case-agnostic 91010. Not task 5 (case=1).
		fromCase70, err := repo.ListTasksByCaseSeqAndTaskType(70, 1, *code)
		assert.NoError(t, err)
		assert.Len(t, fromCase70, 2)
		assert.Equal(t, 91011, fromCase70[0].ID) // 2025 > 2024
		assert.Equal(t, 91010, fromCase70[1].ID)
	})
}
