package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetFamilyHistoryById_OK(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewFamilyHistoryRepository(database.PostgresDB{DB: db})
		result, err := repo.GetById(t.Context(), 1)
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
		repo := NewFamilyHistoryRepository(database.PostgresDB{DB: db})
		result, err := repo.GetById(t.Context(), 999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateFamilyHistory_OK(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		newFamilyHistory := &types.FamilyHistory{
			ID:               9999,
			CaseID:           1,
			PatientID:        1,
			FamilyMemberCode: "aunt",
			Condition:        "Breast cancer",
			TenantCode:       types.DefaultTenantCode,
		}

		repo := NewFamilyHistoryRepository(database.PostgresDB{DB: db})
		err := repo.CreateFamilyHistory(t.Context(), newFamilyHistory)
		assert.NoError(t, err)

		result, err := repo.GetById(t.Context(), 9999)
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
		repo := NewFamilyHistoryRepository(database.PostgresDB{DB: db})
		err := repo.CreateFamilyHistory(t.Context(), nil)
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
			TenantCode:       types.DefaultTenantCode,
		}

		repo := NewFamilyHistoryRepository(database.PostgresDB{DB: db})
		err := repo.CreateFamilyHistory(t.Context(), newFamilyHistory)
		assert.Error(t, err)

		result, err := repo.GetById(t.Context(), 4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_DeleteFamilyHistoryByCaseID_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewFamilyHistoryRepository(database.PostgresDB{DB: db})

		createTestCase(t, db, 100029)
		createTestCase(t, db, 100030)

		db.Exec(`INSERT INTO family_history (id, case_id, patient_id, family_member_code, condition, tenant_code) VALUES (100031, 100029, 1, 'aunt', 'Breast cancer', 'radiant')`)
		db.Exec(`INSERT INTO family_history (id, case_id, patient_id, family_member_code, condition, tenant_code) VALUES (100032, 100030, 1, 'uncle', 'Diabetes', 'radiant')`)
		t.Cleanup(func() {
			db.Exec("DELETE FROM family_history WHERE id IN (100031, 100032)")
		})

		err := repo.DeleteFamilyHistoryByCaseID(t.Context(), 100029)
		assert.NoError(t, err)

		deleted, err := repo.GetById(t.Context(), 100031)
		assert.NoError(t, err)
		assert.Nil(t, deleted)

		untouched, err := repo.GetById(t.Context(), 100032)
		assert.NoError(t, err)
		assert.NotNil(t, untouched)
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
			TenantCode:       types.DefaultTenantCode,
		}

		repo := NewFamilyHistoryRepository(database.PostgresDB{DB: db})
		err := repo.CreateFamilyHistory(t.Context(), newFamilyHistory)
		assert.Error(t, err)

		result, err := repo.GetById(t.Context(), 4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}
