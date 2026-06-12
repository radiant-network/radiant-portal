package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_ValidateTenantCode_AcceptsLowerSnakeCase(t *testing.T) {
	for _, code := range []string{"radiant", "demo", "tenant_a", "cbtn2", "a1"} {
		if err := ValidateTenantCode(code); err != nil {
			t.Errorf("ValidateTenantCode(%q) = %v; want nil", code, err)
		}
	}
}

func Test_ValidateTenantCode_RejectsUnsafeInput(t *testing.T) {
	for _, code := range []string{"", "1abc", "Radiant", "te-nant", "te nant", "tenant_", "a.b", "x'; DROP DATABASE y; --"} {
		if err := ValidateTenantCode(code); err == nil {
			t.Errorf("ValidateTenantCode(%q) = nil; want error", code)
		}
	}
}

func Test_TenantRepository_EnsureTenant_InsertsIdempotentlyWithoutOverwriting(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTenantRepository(env.Postgres)
		const code = "zz_ensure_tenant"
		defer env.Postgres.Exec("DELETE FROM tenant WHERE code = ?", code)

		require.NoError(t, repo.EnsureTenant(code, "First Name"))
		require.NoError(t, repo.EnsureTenant(code, "Second Name")) // ON CONFLICT DO NOTHING

		var name string
		require.NoError(t, env.Postgres.Raw("SELECT name FROM tenant WHERE code = ?", code).Scan(&name).Error)
		assert.Equal(t, "First Name", name, "re-running must not overwrite the existing tenant")
	})
}

func Test_TenantRepository_SeedDefaultRoles_SeedsCatalogIdempotently(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewTenantRepository(env.Postgres)
		const code = "zz_seed_roles"
		defer func() {
			env.Postgres.Exec("DELETE FROM role WHERE tenant_code = ?", code) // cascades role_action
			env.Postgres.Exec("DELETE FROM tenant WHERE code = ?", code)
		}()
		require.NoError(t, repo.EnsureTenant(code, "Seed Roles"))

		require.NoError(t, repo.SeedDefaultRoles(code))
		require.NoError(t, repo.SeedDefaultRoles(code)) // idempotent — no duplicate rows

		var wantActions int64
		for _, r := range DefaultRoles {
			wantActions += int64(len(r.Actions))
		}
		var roleCount, actionCount int64
		require.NoError(t, env.Postgres.Raw("SELECT count(*) FROM role WHERE tenant_code = ?", code).Scan(&roleCount).Error)
		require.NoError(t, env.Postgres.Raw("SELECT count(*) FROM role_action WHERE tenant_code = ?", code).Scan(&actionCount).Error)
		assert.EqualValues(t, len(DefaultRoles), roleCount)
		assert.Equal(t, wantActions, actionCount)
	})
}

func Test_TenantRepository_ListTenants_IncludesSeededDefault(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		codes, err := NewTenantRepository(env.Postgres).ListTenants()
		require.NoError(t, err)
		assert.Contains(t, codes, types.DefaultTenantCode) // "radiant", seeded by migration 000009
	})
}

func Test_TenantRepository_FederatableColumns_ExcludesJsonbAndUuid(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		cols, err := NewTenantRepository(env.Postgres).FederatableColumns([]string{"interpretation_germline"})
		require.NoError(t, err)

		got := cols["interpretation_germline"]
		require.NotEmpty(t, got)
		assert.NotContains(t, got, "id", "uuid column must be excluded")
		assert.NotContains(t, got, "metadata", "jsonb column must be excluded")
		assert.Contains(t, got, "case_id", "a federatable column should be present")
	})
}
