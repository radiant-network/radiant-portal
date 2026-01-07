package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_CreateAndGetTask_OK(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
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

		// Test GetById
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
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
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
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
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
