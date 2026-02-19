package batchval

import (
	"errors"
	"os"
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
    		VALUES ('{"unmarshalled_json":true}', 'RUNNING', 'patient', true, 'user999', '2025-10-09')
    		RETURNING id;
		`).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		err := errors.New("some unexpected error")
		ProcessUnexpectedError(&types.Batch{ID: id}, err, repo)

		resultBatch := types.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusError, resultBatch.Status)
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

type mockValidationRecord struct {
	base         *BaseValidationRecord
	resourceType string
}

func (m *mockValidationRecord) GetBase() *BaseValidationRecord {
	return m.base
}

func (m *mockValidationRecord) GetResourceType() string {
	return m.resourceType
}

func Test_ValidateUniquenessInBatch(t *testing.T) {
	duplicateCode := "DUP-001"
	resourceType := "patient"

	t.Run("first occurrence should not add error", func(t *testing.T) {
		record := &mockValidationRecord{
			base:         &BaseValidationRecord{Index: 0},
			resourceType: resourceType,
		}
		seen := make(map[string]struct{})
		ids := []string{"ORG001", "PAT001"}

		ValidateUniquenessInBatch(record, "key1", seen, duplicateCode, ids)

		assert.Empty(t, record.base.Errors)
		assert.Contains(t, seen, "key1")
	})

	t.Run("second occurrence should add error", func(t *testing.T) {
		record := &mockValidationRecord{
			base:         &BaseValidationRecord{Index: 1},
			resourceType: resourceType,
		}
		seen := map[string]struct{}{"key1": {}}
		ids := []string{"ORG001", "PAT001"}

		ValidateUniquenessInBatch(record, "key1", seen, duplicateCode, ids)

		assert.Len(t, record.base.Errors, 1)
		assert.Equal(t, duplicateCode, record.base.Errors[0].Code)
		assert.Equal(t, "patient[1]", record.base.Errors[0].Path)
		assert.Contains(t, record.base.Errors[0].Message, "Patient (ORG001 / PAT001) appears multiple times in the batch.")
	})
}

func TestMain(m *testing.M) {
	testutils.StartPostgresContainer()
	testutils.StartObjectStoreContainer()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
