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
		Status:    types.BatchStatusPending,
		Username:  username,
		Payload:   string(jsonPayload),
		CreatedOn: time.Now(),
		// TODO(multi-tenant): set from the active tenant once writes read it from context.
		TenantCode: types.DefaultTenantCode,
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
			WHERE status = '%s'
			ORDER BY created_on ASC
			FOR UPDATE SKIP LOCKED
			LIMIT 1
		)
		RETURNING id, payload, status, batch_type, dry_run, started_on, created_on;
	`, types.BatchTable.Name, types.BatchTable.Name, types.BatchStatusPending)

	err := r.db.Raw(query).Scan(&batch).Error
	if err != nil {
		return nil, err
	}
	if batch.ID == "" {
		return nil, nil // no available job
	}
	return &batch, nil
}

// ReleaseBatch resets an in-flight (RUNNING) batch back to PENDING and clears started_on, so a
// graceful shutdown can requeue the batch instead of abandoning it. The status = 'RUNNING' guard
// makes it a no-op once a batch has committed to SUCCESS or ERROR. It runs on the repository's
// default (background) context so it isn't aborted by the cancelled shutdown context.
func (r *BatchRepository) ReleaseBatch(batchId string) (int64, error) {
	result := r.db.Table(types.BatchTable.Name).
		Where("id = ? AND status = ?", batchId, types.BatchStatusRunning).
		Updates(map[string]any{"status": types.BatchStatusPending, "started_on": nil})
	if result.Error != nil {
		return 0, fmt.Errorf("error releasing batch %v: %w", batchId, result.Error)
	}
	return result.RowsAffected, nil
}

func (r *BatchRepository) UpdateStuckBatch() (int64, error) {
	result := r.db.Table(types.BatchTable.Name)
	result = result.Where("status = ?", types.BatchStatusRunning)
	result = result.Where("started_on < ?", time.Now().Add(-24*time.Hour).Format("2006-01-02"))
	result = result.Update("status", types.BatchStatusError)

	if result.Error != nil {
		return 0, fmt.Errorf("error updating batch: %w", result.Error)
	}
	return result.RowsAffected, nil
}
