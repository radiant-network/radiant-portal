package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Task = types.Task
type TaskContext = types.TaskContext
type TaskHasDocument = types.TaskHasDocument

type TaskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db database.PostgresDB) *TaskRepository {
	return &TaskRepository{db: db.DB}
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

// somaticCohortCounts aggregates, per somatic task, how many distinct tumoral and normal
// aliquots it covers.
//
// Grouped by task_id ALONE — it must never be narrowed to one sequencing experiment, case or
// part. Narrowing leaves every tumor-normal task looking like 1 tumoral / 0 normal, which
// reclassifies the whole tumor-normal cohort as tumor-only. Mirrors the pipeline's
// radiant/dags/sql/radiant/somatic_snv_staging_variant_freq_insert.sql.
func (r *TaskRepository) somaticCohortCounts(ctx context.Context) *gorm.DB {
	return r.db.WithContext(ctx).
		Table(fmt.Sprintf("%s k_tctx", types.TaskContextTable.Name)).
		Select("k_tctx.task_id, "+
			"COUNT(DISTINCT CASE WHEN k_spl.histology_code = 'tumoral' THEN k_se.aliquot END) AS n_tumoral, "+
			"COUNT(DISTINCT CASE WHEN k_spl.histology_code = 'normal' THEN k_se.aliquot END) AS n_normal").
		Joins(fmt.Sprintf("JOIN %s k_se ON k_se.id = k_tctx.sequencing_experiment_id", types.SequencingExperimentTable.Name)).
		Joins(fmt.Sprintf("JOIN %s k_spl ON k_spl.id = k_se.sample_id", types.SampleTable.Name)).
		Joins(fmt.Sprintf("JOIN %s k_task ON k_task.id = k_tctx.task_id", types.TaskTable.Name)).
		Where("k_task.task_type_code = ?", types.RadiantSomaticAnnotationTask).
		Scopes(WithTenantOn(ctx, "k_task")).
		Group("k_tctx.task_id")
}

// somaticCohortPredicate maps a cohort to its predicate over somaticCohortCounts. The two
// cohorts are independent, not complements: a malformed task (2 tumoral / 0 normal, or
// 0 tumoral / 1 normal) satisfies neither. Never express one as the negation of the other.
func somaticCohortPredicate(cohort types.SomaticCohort) (string, error) {
	switch cohort {
	case types.SomaticCohortTumorNormal:
		return "k.n_tumoral > 0 AND k.n_normal > 0", nil
	case types.SomaticCohortTumorOnly:
		return "k.n_tumoral = 1 AND k.n_normal = 0", nil
	default:
		return "", fmt.Errorf("unknown somatic cohort %q", string(cohort))
	}
}

// ListTasksByCaseAndSequencing returns the tasks attached to the given (case, sequencing)
// pair that match the selector, sorted by created_on DESC.
//
// A task_context row counts as "attached to this case" when its case_id equals
// caseId OR is NULL. NULL case_id is how per-sequencing tasks (e.g.
// alignment_germline_variant_calling) are modeled in the ETL: they belong to
// the sequencing experiment itself and are shared across every case that
// reuses that sequencing.
func (r *TaskRepository) ListTasksByCaseAndSequencing(ctx context.Context, caseId int, seqId int, selector types.TaskSelector) ([]types.TaskOccurrenceType, error) {
	var tasks []types.TaskOccurrenceType
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.TaskContextTable.Name, types.TaskContextTable.Alias))
	tx = joinTaskContextWithTask(tx)
	tx = joinTaskWithTaskType(tx)
	tx = tx.Scopes(WithTenantOn(ctx, types.TaskTable.Alias)) // task_context has no tenant_code; scope the joined task
	tx = tx.Select("id, task_type_code, name_en AS task_type_name, pipeline_name, pipeline_version, genome_build, created_on")
	tx = tx.Where("sequencing_experiment_id = ? AND (case_id = ? OR case_id IS NULL) AND task_type_code = ?", seqId, caseId, selector.TaskTypeCode)

	if selector.SomaticCohort != types.SomaticCohortNone {
		predicate, err := somaticCohortPredicate(selector.SomaticCohort)
		if err != nil {
			return nil, err
		}
		tx = tx.Joins(fmt.Sprintf("JOIN (?) k ON k.task_id = %s.id", types.TaskTable.Alias), r.somaticCohortCounts(ctx))
		tx = tx.Where(predicate)
	}

	tx = tx.Order("created_on DESC, id DESC")

	if err := tx.Find(&tasks).Error; err != nil {
		return nil, fmt.Errorf("error listing tasks for case %d / seq %d / type %s / cohort %s: %w",
			caseId, seqId, selector.TaskTypeCode, selector.SomaticCohort, err)
	}
	return tasks, nil
}
