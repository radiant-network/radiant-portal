package repository

import (
	"errors"
	"fmt"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type Pipeline = types.Pipeline

type PipelinesRepository struct {
	db *gorm.DB
}

type PipelinesDAO interface {
	GetPipelines() (*[]Pipeline, error)
}

func NewPipelinesRepository(db *gorm.DB) *PipelinesRepository {
	if db == nil {
		log.Fatal("PipelinesRepository: db is nil")
		return nil
	}
	return &PipelinesRepository{db: db}
}

func (r *PipelinesRepository) GetPipelines() (*[]Pipeline, error) {
	tx := r.db.Table(types.PipelineTable.Name)
	var pipelines []Pipeline
	if err := tx.Find(&pipelines).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching pipelines: %w", err)
		} else {
			return nil, nil
		}
	}

	return &pipelines, nil
}
