package repository

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Batch = types.Batch
type IBatch = types.Batchable

type BatchRepository struct {
	db *gorm.DB
}

type BatchRepositoryDAO interface {
	CreateBatch(batch IBatch, username string, dryRun bool) (*Batch, error)
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

func (r *BatchRepository) CreateBatch(batch IBatch, username string, dryRun bool) (*Batch, error) {
	payload, err := batch.ToPayload()
	if err != nil {
		return nil, err
	}

	newBatch := &Batch{
		DryRun:    dryRun,
		BatchType: batch.BatchType(),
		Status:    "PENDING",
		Username:  username,
		Payload:   payload,
		CreatedOn: time.Now(),
	}

	if !dryRun {
		if err := r.db.Create(newBatch).Error; err != nil {
			return nil, fmt.Errorf("error creating batch: %w", err)
		}
	} else {
		// TODO: handle dry run
		return newBatch, nil
	}

	return r.GetBatchByID(newBatch.ID)
}

func (r *BatchRepository) GetBatchByID(batchId string) (*Batch, error) {
	var batch Batch

	tx := r.db.
		Table(types.BatchTable.Name).Where("id = ?", batchId)

	if err := tx.First(&batch).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve batch by its ID: %w", err)
		} else {
			return nil, nil
		}
	}

	return &batch, nil
}

func (r *BatchRepository) GetNextBatch() (*Batch, error) {
	var batch Batch
	return &batch, nil
}
