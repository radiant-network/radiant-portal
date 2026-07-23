package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetFamilyById_OK(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewFamilyRepository(database.PostgresDB{DB: db})
		result, err := repo.GetFamilyById(t.Context(), 1)

		expected := &types.Family{
			ID:                        1,
			CaseID:                    1,
			FamilyMemberID:            1,
			RelationshipToProbandCode: "mother",
			AffectedStatusCode:        "affected",
			TenantCode:                types.DefaultTenantCode,
		}

		assert.NoError(t, err)
		assert.Equal(t, expected, result)
	})
}

func Test_GetFamilyById_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewFamilyRepository(database.PostgresDB{DB: db})
		result, err := repo.GetFamilyById(t.Context(), 9999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateFamily_OK(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		newFamily := &types.Family{
			ID:                        999,
			CaseID:                    1,
			FamilyMemberID:            1,
			RelationshipToProbandCode: "mother",
			AffectedStatusCode:        "affected",
			TenantCode:                types.DefaultTenantCode,
		}

		repo := NewFamilyRepository(database.PostgresDB{DB: db})
		err := repo.CreateFamily(t.Context(), newFamily)
		assert.NoError(t, err)

		result, err := repo.GetFamilyById(t.Context(), 999)
		assert.NoError(t, err)
		assert.Equal(t, newFamily, result)

		db.Exec("DELETE FROM family WHERE id=999")
	})
}

func Test_CreateFamily_NilError(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewFamilyRepository(database.PostgresDB{DB: db})
		err := repo.CreateFamily(t.Context(), nil)
		assert.Error(t, err)
	})
}

func Test_DeleteFamilyByCaseID_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewFamilyRepository(database.PostgresDB{DB: db})

		// Two dedicated cases so the delete-by-case-id can be asserted not to touch the other one.
		createTestCase(t, db, 100013)
		createTestCase(t, db, 100014)

		db.Exec(`INSERT INTO family (id, case_id, family_member_id, relationship_to_proband_code, affected_status_code, tenant_code) VALUES (100011, 100013, 1, 'proband', 'affected', 'radiant')`)
		db.Exec(`INSERT INTO family (id, case_id, family_member_id, relationship_to_proband_code, affected_status_code, tenant_code) VALUES (100012, 100014, 1, 'mother', 'non_affected', 'radiant')`)
		t.Cleanup(func() {
			db.Exec("DELETE FROM family WHERE id IN (100011, 100012)")
		})

		err := repo.DeleteFamilyByCaseID(t.Context(), 100013)
		assert.NoError(t, err)

		deleted, err := repo.GetFamilyById(t.Context(), 100011)
		assert.NoError(t, err)
		assert.Nil(t, deleted)

		untouched, err := repo.GetFamilyById(t.Context(), 100012)
		assert.NoError(t, err)
		assert.NotNil(t, untouched)
	})
}
