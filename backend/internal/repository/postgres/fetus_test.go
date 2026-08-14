package postgres

import (
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_GetFetusById_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewFetusRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetFetusById(t.Context(), 9999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateFetus_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		newFetus := &types.Fetus{
			ID:               9999,
			MotherID:         1,
			OrganizationCode: "CHUSJ",
			SexCode:          "male",
			LifeStatusCode:   "alive",
			TenantCode:       types.DefaultTenantCode,
		}

		repo := NewFetusRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateFetus(t.Context(), newFetus)
		assert.NoError(t, err)
		t.Cleanup(func() { env.Postgres.Exec("DELETE FROM fetus WHERE id=9999") })

		result, err := repo.GetFetusById(t.Context(), 9999)
		assert.NoError(t, err)
		assert.Equal(t, newFetus.ID, result.ID)
		assert.Equal(t, newFetus.MotherID, result.MotherID)
		assert.Equal(t, newFetus.SexCode, result.SexCode)
		assert.Equal(t, newFetus.LifeStatusCode, result.LifeStatusCode)
		assert.Nil(t, result.LastMenstrualPeriod)
		assert.Nil(t, result.EstimatedDueDate)
	})
}

func Test_CreateFetus_WithGestationalDates_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		lmp := time.Date(2026, time.February, 1, 0, 0, 0, 0, time.UTC)
		newFetus := &types.Fetus{
			ID:                  9998,
			MotherID:            1,
			OrganizationCode:    "CHUSJ",
			SexCode:             "female",
			LifeStatusCode:      "alive",
			LastMenstrualPeriod: &lmp,
			TenantCode:          types.DefaultTenantCode,
		}

		repo := NewFetusRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateFetus(t.Context(), newFetus)
		assert.NoError(t, err)
		t.Cleanup(func() { env.Postgres.Exec("DELETE FROM fetus WHERE id=9998") })

		result, err := repo.GetFetusById(t.Context(), 9998)
		assert.NoError(t, err)
		assert.NotNil(t, result.LastMenstrualPeriod)
		assert.True(t, lmp.Equal(*result.LastMenstrualPeriod))
		assert.Nil(t, result.EstimatedDueDate)
	})
}

func Test_CreateFetus_NilError(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewFetusRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateFetus(t.Context(), nil)
		assert.Error(t, err)
	})
}

// Test_GetFetusByOrganizationAndSubmitterId_TenantIsolation reproduces CLIN-6157 for fetus: the
// same (organization_code, submitter_fetus_id) can belong to a different mother's fetus in a
// different tenant, and the pre-insert uniqueness check must not treat it as a conflict.
func Test_GetFetusByOrganizationAndSubmitterId_TenantIsolation(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const orgCode = "TENANT-ISO-FETUS-ORG"
		const submitterFetusId = "F-TENANT-ISO-1"

		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO organization (code, name, category_code, tenant_code)
			VALUES (?, 'Tenant Isolation Fetus Test Org (radiant)', 'healthcare_provider', 'radiant')
			ON CONFLICT (code, tenant_code) DO NOTHING
		`, orgCode).Error)
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO organization (code, name, category_code, tenant_code)
			VALUES (?, 'Tenant Isolation Fetus Test Org (tenant_b)', 'healthcare_provider', 'tenant_b')
			ON CONFLICT (code, tenant_code) DO NOTHING
		`, orgCode).Error)
		defer env.Postgres.Exec(`DELETE FROM organization WHERE code = ?`, orgCode)
		defer env.Postgres.Exec(`DELETE FROM fetus WHERE organization_code = ?`, orgCode)

		repo := NewFetusRepository(database.PostgresDB{DB: env.Postgres})

		fetusA := &types.Fetus{
			ID:               9997,
			SubmitterFetusId: submitterFetusId,
			MotherID:         1,
			OrganizationCode: orgCode,
			SexCode:          "male",
			LifeStatusCode:   "alive",
			TenantCode:       "radiant",
		}
		require.NoError(t, repo.CreateFetus(t.Context(), fetusA))

		// Same key, a different tenant: must not resolve to tenant "radiant"'s fetus.
		conflict, err := repo.GetFetusByOrganizationAndSubmitterId(t.Context(), orgCode, submitterFetusId, "tenant_b")
		require.NoError(t, err)
		assert.Nil(t, conflict, "must not find another tenant's fetus as a conflict")

		// The widened fetus_org_submitter_id_key must accept a second fetus under the same key.
		fetusB := &types.Fetus{
			ID:               9996,
			SubmitterFetusId: submitterFetusId,
			MotherID:         1,
			OrganizationCode: orgCode,
			SexCode:          "female",
			LifeStatusCode:   "alive",
			TenantCode:       "tenant_b",
		}
		require.NoError(t, repo.CreateFetus(t.Context(), fetusB))

		found, err := repo.GetFetusByOrganizationAndSubmitterId(t.Context(), orgCode, submitterFetusId, "tenant_b")
		require.NoError(t, err)
		if assert.NotNil(t, found) {
			assert.Equal(t, fetusB.ID, found.ID)
		}
	})
}

func Test_CreateFetus_InvalidSexCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		newFetus := &types.Fetus{
			ID:               4242,
			MotherID:         1,
			OrganizationCode: "CHUSJ",
			SexCode:          "not-a-sex",
			LifeStatusCode:   "alive",
			TenantCode:       types.DefaultTenantCode,
		}

		repo := NewFetusRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateFetus(t.Context(), newFetus)
		assert.Error(t, err)

		result, err := repo.GetFetusById(t.Context(), 4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}
