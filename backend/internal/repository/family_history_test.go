package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetFamilyHistoryById_OK(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewFamilyHistoryRepository(db)
		result, err := repo.GetById(1)
		assert.NoError(t, err)
		assert.Equal(t, 1, result.ID)
		assert.Equal(t, 16, result.CaseID)
		assert.Equal(t, 44, result.PatientID)
		assert.Equal(t, "uncle", result.FamilyMemberCode)
		assert.Equal(t, "Diabetes", result.Condition)
	})
}

func Test_GetFamilyHistoryById_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewFamilyHistoryRepository(db)
		result, err := repo.GetById(999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateFamilyHistory_OK(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		newFamilyHistory := &types.FamilyHistory{
			ID:               9999,
			CaseID:           1,
			PatientID:        1,
			FamilyMemberCode: "aunt",
			Condition:        "Breast cancer",
		}

		repo := NewFamilyHistoryRepository(db)
		err := repo.CreateFamilyHistory(newFamilyHistory)
		assert.NoError(t, err)

		result, err := repo.GetById(9999)
		assert.NoError(t, err)
		assert.Equal(t, 9999, result.ID)
		assert.Equal(t, 1, result.CaseID)
		assert.Equal(t, 1, result.PatientID)
		assert.Equal(t, "aunt", result.FamilyMemberCode)
		assert.Equal(t, "Breast cancer", result.Condition)

		db.Exec("DELETE FROM family_history WHERE id=9999")
	})
}

func Test_CreateFamilyHistory_NilError(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewFamilyHistoryRepository(db)
		err := repo.CreateFamilyHistory(nil)
		assert.Error(t, err)
	})
}

func Test_CreateFamilyHistory_CaseNotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		newFamilyHistory := &types.FamilyHistory{
			ID:               4242,
			CaseID:           9876,
			PatientID:        1,
			FamilyMemberCode: "aunt",
			Condition:        "Breast cancer",
		}

		repo := NewFamilyHistoryRepository(db)
		err := repo.CreateFamilyHistory(newFamilyHistory)
		assert.Error(t, err)

		result, err := repo.GetById(4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateFamilyHistory_PatientNotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		newFamilyHistory := &types.FamilyHistory{
			ID:               4242,
			CaseID:           1,
			PatientID:        9876,
			FamilyMemberCode: "aunt",
			Condition:        "Breast cancer",
		}

		repo := NewFamilyHistoryRepository(db)
		err := repo.CreateFamilyHistory(newFamilyHistory)
		assert.Error(t, err)

		result, err := repo.GetById(4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}
