package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Task = types.Task
type TaskContext = types.TaskContext
type TaskHasDocument = types.TaskHasDocument

type TaskRepository struct {
	db *gorm.DB
}

type TaskDAO interface {
	CreateTask(task *Task) error
	CreateTaskContext(tc *TaskContext) error
	CreateTaskHasDocument(thd *TaskHasDocument) error

	GetTaskById(taskId int) (*Task, error)
	GetTaskContextByTaskId(taskId int) ([]*TaskContext, error)
	GetTaskHasDocumentByTaskId(taskId int) ([]*TaskHasDocument, error)
	GetTaskHasDocumentByDocumentId(documentId int) ([]*TaskHasDocument, error)
}

func NewTaskRepository(db *gorm.DB) *TaskRepository {
	if db == nil {
		log.Print("TaskRepository: db is nil")
		return nil
	}
	return &TaskRepository{db: db}
}

func (r *TaskRepository) CreateTask(task *Task) error {
	return r.db.Create(task).Error
}

func (r *TaskRepository) CreateTaskContext(tc *TaskContext) error {
	return r.db.Create(tc).Error
}

func (r *TaskRepository) CreateTaskHasDocument(thd *TaskHasDocument) error {
	return r.db.Create(thd).Error
}

func (r *TaskRepository) GetTaskById(taskId int) (*Task, error) {
	var task Task
	if err := r.db.Table(types.TaskTable.Name).First(&task, taskId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching task: %w", err)
		} else {
			return nil, nil
		}
	}
	return &task, nil
}

func (r *TaskRepository) GetTaskContextByTaskId(taskId int) ([]*TaskContext, error) {
	var tc []*TaskContext
	if err := r.db.Table(types.TaskContextTable.Name).Where("task_id = ?", taskId).Find(&tc).Error; err != nil {
		return nil, err
	}
	if len(tc) == 0 {
		return nil, nil
	}
	return tc, nil
}

func (r *TaskRepository) GetTaskHasDocumentByTaskId(taskId int) ([]*TaskHasDocument, error) {
	var thd []*TaskHasDocument
	if err := r.db.Table(types.TaskHasDocumentTable.Name).Where("task_id = ?", taskId).Find(&thd).Error; err != nil {
		return nil, err
	}
	if len(thd) == 0 {
		return nil, nil
	}
	return thd, nil
}

func (r *TaskRepository) GetTaskHasDocumentByDocumentId(documentId int) ([]*TaskHasDocument, error) {
	var thd []*TaskHasDocument
	if err := r.db.Table(types.TaskHasDocumentTable.Name).Where("document_id = ?", documentId).Find(&thd).Error; err != nil {
		return nil, err
	}
	if len(thd) == 0 {
		return nil, nil
	}
	return thd, nil
}
