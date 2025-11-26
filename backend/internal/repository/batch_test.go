package repository

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_CreateBatch_Valid(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewBatchRepository(db)
		type samplePayload struct {
			Message string `json:"message"`
		}
		payload := make([]samplePayload, 0)
		payload = append(payload, samplePayload{Message: "hello world"})
		payload = append(payload, samplePayload{Message: "bye world"})
		batchType := "test_type"
		username := "test_user"
		dryRun := true
		createdBatch, err := repo.CreateBatch(payload, batchType, username, dryRun)
		assert.NoError(t, err)
		assert.NotNil(t, createdBatch)
		assert.NotEqual(t, uuid.Nil, createdBatch.ID)
		assert.Empty(t, createdBatch.Payload)
		assert.Equal(t, batchType, createdBatch.BatchType)
		assert.Equal(t, username, createdBatch.Username)
		assert.Equal(t, dryRun, createdBatch.DryRun)
		assert.Equal(t, types.BatchStatusPending, createdBatch.Status)
		var dbBatch types.Batch
		err = db.First(&dbBatch, "id = ?", createdBatch.ID).Error
		assert.NoError(t, err)
		assert.Equal(t, `[{"message": "hello world"}, {"message": "bye world"}]`, dbBatch.Payload)
	})
}

func Test_GetBatchByID_Success(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewBatchRepository(db)
		batchId := uuid.NewString()
		initErr := db.Exec(`
            INSERT INTO batch (id, payload, status, batch_type, dry_run, username, created_on) VALUES
            (?, '{}', ?, 'patient', true, 'user1', now())
        `, batchId, types.BatchStatusSuccess).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}
		batch, err := repo.GetBatchByID(batchId)
		assert.NoError(t, err)
		assert.NotNil(t, batch)
		assert.Equal(t, batchId, batch.ID)
		assert.Equal(t, "patient", batch.BatchType)
		assert.Equal(t, "user1", batch.Username)
		assert.Equal(t, types.BatchStatusSuccess, batch.Status)
		assert.Empty(t, batch.Payload)
	})
}

func Test_GetBatchByID_NotFound(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewBatchRepository(db)
		nonExistentId := uuid.NewString()
		batch, err := repo.GetBatchByID(nonExistentId)
		assert.NoError(t, err)
		assert.Nil(t, batch)
	})
}

func Test_GetBatchByID_InvalidUUID(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewBatchRepository(db)
		invalidId := "not-a-valid-uuid"
		batch, err := repo.GetBatchByID(invalidId)
		assert.Error(t, err)
		assert.Nil(t, batch)
	})
}

func Test_ClaimNextBatch_Without_Pending(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewBatchRepository(db)
		batch, err := repo.ClaimNextBatch()
		assert.NoError(t, err)
		assert.Nil(t, batch)
	})
}

func Test_ClaimNextBatch_Several_Entries(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewBatchRepository(db)
		// Add two pending batches
		initErr := db.Exec(`
			INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on) VALUES
            ('{}', ?, 'patient', true, 'user1', '2025-10-09'),
            ('{}', ?, 'sample', false, 'user2', '2025-11-09')
		`, types.BatchStatusPending, types.BatchStatusPending).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}
		batch, err := repo.ClaimNextBatch()
		assert.NoError(t, err)
		assert.NotNil(t, batch)
		expectedDate, _ := time.Parse(time.DateOnly, "2025-10-09")
		assert.Equal(t, expectedDate, batch.CreatedOn)
		assert.Equal(t, types.BatchStatusRunning, batch.Status)
		assert.Equal(t, true, batch.DryRun)
		assert.Equal(t, "patient", batch.BatchType)
		// Verify that only one pending batch remains
		var count int64
		db.Table("batch").Where("status = ?", types.BatchStatusPending).Count(&count)
		assert.Equal(t, int64(1), count)
	})
}

func Test_UpdateBatch(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewBatchRepository(db)

		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES ('{}', ?, 'patient', true, 'user999', '2025-10-09')
    		RETURNING id;
		`, types.BatchStatusRunning).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		finished := time.Date(2025, 10, 9, 15, 30, 0, 0, time.UTC)
		rowsUpdated, err := repo.UpdateBatch(Batch{ID: id, Status: types.BatchStatusSuccess, FinishedOn: &finished})
		assert.NoError(t, err)
		assert.EqualValues(t, 1, rowsUpdated)
		resultBatch := Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusSuccess, resultBatch.Status)
		assert.Equal(t, true, resultBatch.DryRun)
		assert.Equal(t, "patient", resultBatch.BatchType)
		assert.Equal(t, "user999", resultBatch.Username)
		assert.Equal(t, finished, *resultBatch.FinishedOn)

	})
}
