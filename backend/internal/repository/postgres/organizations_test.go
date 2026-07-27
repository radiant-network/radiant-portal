package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_GetOrganizationByCode_Not_Null(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})
		org, err := repo.GetOrganizationByCode(t.Context(), "CHOP")
		assert.NoError(t, err)
		assert.NotNil(t, org)
		assert.Equal(t, "CHOP", org.Code)
		assert.Equal(t, "Children Hospital of Philadelphia", org.Name)
		assert.Equal(t, "healthcare_provider", org.CategoryCode)
	})
}
func Test_GetOrganizationByCode_Null(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})
		org, err := repo.GetOrganizationByCode(t.Context(), "Unknown")
		assert.NoError(t, err)
		assert.Nil(t, org)
	})
}

func Test_CreateOrganization(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})
		defer env.Postgres.Exec("DELETE FROM organization WHERE code = 'org_test_create' AND tenant_code = 'radiant'")

		err := repo.CreateOrganization(t.Context(), types.Organization{
			Code: "org_test_create", Name: "Test Org", CategoryCode: "healthcare_provider", TenantCode: "radiant",
		})
		assert.NoError(t, err)

		created, err := repo.GetOrganizationByCode(t.Context(), "org_test_create")
		assert.NoError(t, err)
		assert.NotNil(t, created)
		assert.Equal(t, "Test Org", created.Name)
		assert.Equal(t, "healthcare_provider", created.CategoryCode)
	})
}

func Test_CreateOrganization_DuplicateCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})
		// CHOP already exists in radiant (seeded) — the insert must not create a duplicate.
		err := repo.CreateOrganization(t.Context(), types.Organization{
			Code: "CHOP", Name: "Duplicate", CategoryCode: "healthcare_provider", TenantCode: "radiant",
		})
		assert.ErrorIs(t, err, types.ErrOrganizationCodeExists)
	})
}

func Test_CreateOrganization_UnknownCategory(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateOrganization(t.Context(), types.Organization{
			Code: "org_test_badcat", Name: "Bad Category", CategoryCode: "does_not_exist", TenantCode: "radiant",
		})
		assert.ErrorIs(t, err, types.ErrOrganizationUnknownCategory)
	})
}
