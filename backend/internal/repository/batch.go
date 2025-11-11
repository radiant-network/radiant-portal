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
	ClaimNextBatch() (*Batch, error)
}

func NewBatchRepository(db *gorm.DB) *BatchRepository {
	if db == nil {
		log.Fatal("BatchRepository: db is nil")
		return nil
	}
	return &BatchRepository{db: db}
}

func (r *BatchRepository) ClaimNextBatch() (*Batch, error) {
	var batch Batch

	query := `
		UPDATE batch
		SET status = 'RUNNING', started_on = now()
		WHERE id = (
			SELECT id FROM batch
			WHERE status = 'PENDING'
			ORDER BY created_on ASC
			FOR UPDATE SKIP LOCKED
			LIMIT 1
		)
		RETURNING id, payload, status, batch_type, dry_run, started_on, created_on;
	`

	err := r.db.Raw(query).Scan(&batch).Error
	if err != nil {
		return nil, err
	}
	if batch.ID == "" {
		return nil, nil // no available job
	}
	return &batch, nil

}
