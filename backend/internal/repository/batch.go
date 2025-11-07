package repository

import (
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Batch = types.Batch

type BatchRepository struct {
	db *gorm.DB
}

type BatchRepositoryDAO interface {
	CreateBatch(batch Batch) (string, error)
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

func (r *BatchRepository) CreateBatch(batch Batch) (string, error) {
	return "", nil
}

func (r *BatchRepository) GetBatchByID(batchId string) (*Batch, error) {
	var batch Batch
	return &batch, nil
}

func (r *BatchRepository) GetNextBatch() (*Batch, error) {
	var batch Batch
	return &batch, nil
}
