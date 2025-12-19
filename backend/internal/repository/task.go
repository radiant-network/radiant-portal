package repository

import (
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

	GetTaskById(obsId int) (*Task, error)
	GetTaskContextByTaskId(taskId int) (*TaskContext, error)
	GetTaskHasDocumentByTaskId(taskId int) (*TaskHasDocument, error)
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
		return nil, err
	}
	return &task, nil
}

func (r *TaskRepository) GetTaskContextByTaskId(taskId int) ([]*TaskContext, error) {
	var tc []*TaskContext
	if err := r.db.Table(types.TaskContextTable.Name).Where("task_id = ?", taskId).Find(&tc).Error; err != nil {
		return nil, err
	}
	if len(tc) == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return tc, nil
}

func (r *TaskRepository) GetTaskHasDocumentByTaskId(taskId int) ([]*TaskHasDocument, error) {
	var thd []*TaskHasDocument
	if err := r.db.Table(types.TaskHasDocumentTable.Name).Where("task_id = ?", taskId).Find(&thd).Error; err != nil {
		return nil, err
	}
	if len(thd) == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return thd, nil
}
