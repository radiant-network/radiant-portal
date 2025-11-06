package repository

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type Batch = types.Batch

type BatchRepository struct {
	db *gorm.DB
}

type BatchRepositoryDAO interface {
	CreateBatch(batch Batch) (*string, error)
	GetBatchByID(batchId string) (*Batch, error)
	GetNextBatch() (*Batch, error)
}

func NewBatchRepository(db *gorm.DB) *BatchRepository {
	if db == nil {
		log.Fatal("BatchRepository: db is nil")
		return nil
	}
	return &BatchRepository{db: db}
}
