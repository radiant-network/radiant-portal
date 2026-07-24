package postgres

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Batch = types.Batch

type BatchRepository struct {
	db *gorm.DB
}

func NewBatchRepository(db database.PostgresDB) *BatchRepository {
	return &BatchRepository{db: db.DB}
}

func (r *BatchRepository) CreateBatch(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*Batch, error) {
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("error marshalling batch payload: %w", err)
	}

	newBatch := &Batch{
		DryRun:     dryRun,
		BatchType:  batchType,
		Status:     types.BatchStatusPending,
		Username:   username,
		Payload:    string(jsonPayload),
		CreatedOn:  time.Now(),
		TenantCode: tenantCode,
	}
	if err := r.db.WithContext(ctx).Create(newBatch).Error; err != nil {
		return nil, fmt.Errorf("error creating batch: %w", err)
	}

	return r.GetBatchByID(ctx, newBatch.ID)
}

func (r *BatchRepository) UpdateBatch(ctx context.Context, batch Batch) (int64, error) {
	result := r.db.WithContext(ctx).Model(&batch).Updates(batch)
	if result.Error != nil {
		return 0, fmt.Errorf("error updating batch: %w", result.Error)
	}
	return result.RowsAffected, nil

}

func (r *BatchRepository) GetBatchByID(ctx context.Context, batchId string) (*Batch, error) {
	var batch Batch

	tx := r.db.WithContext(ctx).
		Table(types.BatchTable.Name).
		Scopes(WithTenant(ctx)).
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

func (r *BatchRepository) ClaimNextBatch(ctx context.Context) (*Batch, error) {
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
		RETURNING id, payload, status, batch_type, dry_run, started_on, created_on, tenant_code;
	`, types.BatchTable.Name, types.BatchTable.Name, types.BatchStatusPending)

	err := r.db.WithContext(ctx).Raw(query).Scan(&batch).Error
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
func (r *BatchRepository) ReleaseBatch(ctx context.Context, batchId string) (int64, error) {
	result := r.db.WithContext(ctx).Table(types.BatchTable.Name).
		Where("id = ? AND status = ?", batchId, types.BatchStatusRunning).
		Updates(map[string]any{"status": types.BatchStatusPending, "started_on": nil})
	if result.Error != nil {
		return 0, fmt.Errorf("error releasing batch %v: %w", batchId, result.Error)
	}
	return result.RowsAffected, nil
}

func (r *BatchRepository) UpdateStuckBatch(ctx context.Context) (int64, error) {
	result := r.db.WithContext(ctx).Table(types.BatchTable.Name)
	result = result.Where("status = ?", types.BatchStatusRunning)
	result = result.Where("started_on < ?", time.Now().Add(-24*time.Hour).Format("2006-01-02"))
	result = result.Update("status", types.BatchStatusError)

	if result.Error != nil {
		return 0, fmt.Errorf("error updating batch: %w", result.Error)
	}
	return result.RowsAffected, nil
}
