package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Task = types.Task
type TaskContext = types.TaskContext
type TaskHasDocument = types.TaskHasDocument

type TaskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) CreateTask(ctx context.Context, task *Task) error {
	return r.db.WithContext(ctx).Create(task).Error
}

func (r *TaskRepository) CreateTaskContext(ctx context.Context, tc *TaskContext) error {
	return r.db.WithContext(ctx).Create(tc).Error
}

func (r *TaskRepository) CreateTaskHasDocument(ctx context.Context, thd *TaskHasDocument) error {
	return r.db.WithContext(ctx).Create(thd).Error
}

func (r *TaskRepository) GetTaskTypeCodes(ctx context.Context) ([]types.TaskType, error) {
	var taskTypeCodes []types.TaskType
	if err := r.db.WithContext(ctx).Table(types.TaskTypeTable.Name).Find(&taskTypeCodes).Error; err != nil {
		return nil, fmt.Errorf("error while fetching task type codes: %w", err)
	}
	return taskTypeCodes, nil
}

func (r *TaskRepository) GetTaskById(ctx context.Context, taskId int) (*Task, error) {
	var task Task
	if err := r.db.WithContext(ctx).Table(types.TaskTable.Name).Scopes(WithTenant(ctx)).First(&task, taskId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching task: %w", err)
		} else {
			return nil, nil
		}
	}
	return &task, nil
}

func (r *TaskRepository) GetTaskContextByTaskId(ctx context.Context, taskId int) ([]*TaskContext, error) {
	var tc []*TaskContext
	if err := r.db.WithContext(ctx).Table(types.TaskContextTable.Name).Where("task_id = ?", taskId).Find(&tc).Error; err != nil {
		return nil, err
	}
	if len(tc) == 0 {
		return nil, nil
	}
	return tc, nil
}

func (r *TaskRepository) GetTaskHasDocumentByTaskId(ctx context.Context, taskId int) ([]*TaskHasDocument, error) {
	var thd []*TaskHasDocument
	if err := r.db.WithContext(ctx).Table(types.TaskHasDocumentTable.Name).Where("task_id = ?", taskId).Find(&thd).Error; err != nil {
		return nil, err
	}
	if len(thd) == 0 {
		return nil, nil
	}
	return thd, nil
}

func (r *TaskRepository) GetTaskContextBySequencingExperimentId(ctx context.Context, seqExpId int) ([]*TaskContext, error) {
	var tc []*TaskContext
	if err := r.db.WithContext(ctx).Table(types.TaskContextTable.Name).Where("sequencing_experiment_id = ?", seqExpId).Find(&tc).Error; err != nil {
		return nil, err
	}
	if len(tc) == 0 {
		return nil, nil
	}
	return tc, nil
}

func (r *TaskRepository) GetTaskHasDocumentByDocumentId(ctx context.Context, documentId int) ([]*TaskHasDocument, error) {
	var thd []*TaskHasDocument
	if err := r.db.WithContext(ctx).Table(types.TaskHasDocumentTable.Name).Where("document_id = ?", documentId).Find(&thd).Error; err != nil {
		return nil, err
	}
	if len(thd) == 0 {
		return nil, nil
	}
	return thd, nil
}

func joinTaskContextWithTask(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id = %s.id",
		types.TaskTable.Name, types.TaskTable.Alias,
		types.TaskContextTable.Alias, types.TaskTable.Alias))
}

func joinTaskWithTaskType(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("JOIN %s %s ON %s.task_type_code = %s.code",
		types.TaskTypeTable.Name, types.TaskTypeTable.Alias,
		types.TaskTable.Alias, types.TaskTypeTable.Alias))
}

// ListTasksByCaseSeqAndTaskType returns the tasks attached to the given
// (case, sequencing) pair whose task_type matches taskTypeCode, sorted by
// created_on DESC.
//
// A task_context row counts as "attached to this case" when its case_id equals
// caseId OR is NULL. NULL case_id is how per-sequencing tasks (e.g.
// alignment_germline_variant_calling) are modeled in the ETL: they belong to
// the sequencing experiment itself and are shared across every case that
// reuses that sequencing.
func (r *TaskRepository) ListTasksByCaseSeqAndTaskType(ctx context.Context, caseId int, seqId int, taskTypeCode string) ([]types.TaskOccurrenceType, error) {
	var tasks []types.TaskOccurrenceType
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.TaskContextTable.Name, types.TaskContextTable.Alias))
	tx = joinTaskContextWithTask(tx)
	tx = joinTaskWithTaskType(tx)
	tx = tx.Scopes(WithTenantOn(ctx, types.TaskTable.Alias)) // task_context has no tenant_code; scope the joined task
	tx = tx.Select("id, task_type_code, name_en AS task_type_name, pipeline_name, pipeline_version, genome_build, created_on")
	tx = tx.Where("sequencing_experiment_id = ? AND (case_id = ? OR case_id IS NULL) AND task_type_code = ?", seqId, caseId, taskTypeCode)
	tx = tx.Order("created_on DESC, id DESC")

	if err := tx.Find(&tasks).Error; err != nil {
		return nil, fmt.Errorf("error listing tasks for case %d / seq %d / type %s: %w", caseId, seqId, taskTypeCode, err)
	}
	return tasks, nil
}
