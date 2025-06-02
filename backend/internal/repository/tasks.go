package repository

import (
	"errors"
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type Task = types.Task

type TasksRepository struct {
	db *gorm.DB
}

type TasksDAO interface {
	GetRequests() (*[]Task, error)
}

func NewTasksRepository(db *gorm.DB) *TasksRepository {
	if db == nil {
		log.Fatal("TasksRepository: db is nil")
		return nil
	}
	return &TasksRepository{db: db}
}

func (r *TasksRepository) GetTasks() (*[]Task, error) {
	tx := r.db.Table(types.TaskTable.Name).
		Preload("Type").
		Preload("Pipeline").
		Preload("SequencingExperiments").
		Preload("RelatedTasks").
		Preload("Documents")
	var tasks []Task
	if err := tx.Find(&tasks).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching tasks: %w", err)
		} else {
			return nil, nil
		}
	}

	return &tasks, nil
}
