package main

import (
	"errors"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_Process_Unexpected_Errors(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewBatchRepository(db)

		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES ('{"unmarshalled_json":true}', 'PROCESSING', 'patient', true, 'user999', '2025-10-09')
    		RETURNING id;
		`).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		err := errors.New("some unexpected error")
		processUnexpectedError(&types.Batch{ID: id}, err, repo)

		resultBatch := types.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, "ERROR", resultBatch.Status)
		assert.Equal(t, true, resultBatch.DryRun)
		assert.Equal(t, "patient", resultBatch.BatchType)
		assert.Equal(t, "user999", resultBatch.Username)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		if assert.Len(t, resultBatch.Report.Errors, 1) {
			assert.Equal(t, resultBatch.Report.Errors[0].Code, "GLOBAL-000")
			assert.Equal(t, resultBatch.Report.Errors[0].Message, "some unexpected error")
		}

	})
}
