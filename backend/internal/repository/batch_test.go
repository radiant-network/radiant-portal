package repository

import (
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

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
            ('{}', 'PENDING', 'patient', true, 'user1', '2025-10-09'),
            ('{}', 'PENDING', 'sample', false, 'user2', '2025-11-09')
		`).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}
		batch, err := repo.ClaimNextBatch()
		assert.NoError(t, err)
		assert.NotNil(t, batch)
		expectedDate, _ := time.Parse(time.DateOnly, "2025-10-09")
		assert.Equal(t, expectedDate, batch.CreatedOn)
		assert.Equal(t, "RUNNING", batch.Status)
		assert.Equal(t, true, batch.DryRun)
		assert.Equal(t, "patient", batch.BatchType)
		// Verify that only one pending batch remains
		var count int64
		db.Table("batch").Where("status = 'PENDING'").Count(&count)
		assert.Equal(t, int64(1), count)
	})
}
