package repository

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Batch = types.Batch

type BatchRepository struct {
	db *gorm.DB
}

type BatchRepositoryDAO interface {
	CreateBatch(payload any, batchType string, username string, dryRun bool) (*Batch, error)
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

func (r *BatchRepository) CreateBatch(payload any, batchType string, username string, dryRun bool) (*Batch, error) {
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("error marshalling batch payload: %w", err)
	}

	newBatch := &Batch{
		DryRun:    dryRun,
		BatchType: batchType,
		Status:    "PENDING",
		Username:  username,
		Payload:   string(jsonPayload),
		CreatedOn: time.Now(),
	}
	if err := r.db.Create(newBatch).Error; err != nil {
		return nil, fmt.Errorf("error creating batch: %w", err)
	}

	return r.GetBatchByID(newBatch.ID)
}

func (r *BatchRepository) UpdateBatch(batch Batch) (int64, error) {
	result := r.db.Model(&batch).Updates(batch)
	if result.Error != nil {
		return 0, fmt.Errorf("error updating batch: %w", result.Error)
	}
	return result.RowsAffected, nil

}

func (r *BatchRepository) GetBatchByID(batchId string) (*Batch, error) {
	var batch Batch

	tx := r.db.
		Table(types.BatchTable.Name).
		Omit("payload").
		Where("id = ?", batchId)
	if err := tx.First(&batch).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve batch by its ID: %w", err)
		} else {
			return nil, nil
		}
	}

	return &batch, nil
}

func (r *BatchRepository) ClaimNextBatch() (*Batch, error) {
	var batch Batch

	query := fmt.Sprintf(`
		UPDATE %s
		SET status = 'RUNNING', started_on = now()
		WHERE id = (
			SELECT id FROM %s
			WHERE status = 'PENDING'
			ORDER BY created_on ASC
			FOR UPDATE SKIP LOCKED
			LIMIT 1
		)
		RETURNING id, payload, status, batch_type, dry_run, started_on, created_on;
	`, types.BatchTable.Name, types.BatchTable.Name)

	err := r.db.Raw(query).Scan(&batch).Error
	if err != nil {
		return nil, err
	}
	if batch.ID == "" {
		return nil, nil // no available job
	}
	return &batch, nil
}
