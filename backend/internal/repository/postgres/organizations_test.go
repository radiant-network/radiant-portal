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
		org, err := repo.GetOrganizationByCode(t.Context(), "CHOP", types.DefaultTenantCode)
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
		org, err := repo.GetOrganizationByCode(t.Context(), "Unknown", types.DefaultTenantCode)
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

		created, err := repo.GetOrganizationByCode(t.Context(), "org_test_create", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.NotNil(t, created)
		assert.Equal(t, "Test Org", created.Name)
		assert.Equal(t, "healthcare_provider", created.CategoryCode)
	})
}

func Test_UpdateOrganization(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})
		defer env.Postgres.Exec("DELETE FROM organization WHERE code = 'org_test_update' AND tenant_code = 'radiant'")

		err := repo.CreateOrganization(t.Context(), types.Organization{
			Code: "org_test_update", Name: "Old Name", CategoryCode: "healthcare_provider", TenantCode: "radiant",
		})
		assert.NoError(t, err)

		err = repo.UpdateOrganization(t.Context(), "radiant", "org_test_update", types.UpdateOrganizationRequest{Name: "New Name"})
		assert.NoError(t, err)

		updated, err := repo.GetOrganizationByCode(t.Context(), "org_test_update", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Equal(t, "New Name", updated.Name)
		assert.Equal(t, "healthcare_provider", updated.CategoryCode) // category untouched
	})
}

func Test_CreateOrganization_WithNotificationEmails(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})
		defer env.Postgres.Exec("DELETE FROM organization WHERE code = 'org_test_emails' AND tenant_code = 'radiant'")

		err := repo.CreateOrganization(t.Context(), types.Organization{
			Code: "org_test_emails", Name: "Lab", CategoryCode: "diagnostic_laboratory", TenantCode: "radiant",
			NotificationEmails: types.NotificationEmailsColumn("a@lab.invalid,b@lab.invalid"),
		})
		assert.NoError(t, err)

		created, err := repo.GetOrganizationByCode(t.Context(), "org_test_emails", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Equal(t, "a@lab.invalid,b@lab.invalid", *created.NotificationEmails)
	})
}

func Test_UpdateOrganization_NotificationEmails_SetThenBlankClears(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})
		defer env.Postgres.Exec("DELETE FROM organization WHERE code = 'org_test_upd_emails' AND tenant_code = 'radiant'")

		assert.NoError(t, repo.CreateOrganization(t.Context(), types.Organization{
			Code: "org_test_upd_emails", Name: "Lab", CategoryCode: "diagnostic_laboratory", TenantCode: "radiant",
		}))

		assert.NoError(t, repo.UpdateOrganization(t.Context(), "radiant", "org_test_upd_emails",
			types.UpdateOrganizationRequest{Name: "Lab", NotificationEmails: "a@lab.invalid"}))
		org, err := repo.GetOrganizationByCode(t.Context(), "org_test_upd_emails", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Equal(t, "a@lab.invalid", *org.NotificationEmails)

		// blank clears to NULL
		assert.NoError(t, repo.UpdateOrganization(t.Context(), "radiant", "org_test_upd_emails",
			types.UpdateOrganizationRequest{Name: "Lab renamed", NotificationEmails: ""}))
		org, err = repo.GetOrganizationByCode(t.Context(), "org_test_upd_emails", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Equal(t, "Lab renamed", org.Name)
		assert.Nil(t, org.NotificationEmails)
	})
}

func Test_NotificationEmailsByOrg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})

		// LDM-CHUSJ and LDM-CHOP carry a seeded list, CHOP has none, no_such_org does not exist.
		byOrg, err := repo.NotificationEmailsByOrg(t.Context(), types.DefaultTenantCode, []string{"LDM-CHUSJ", "LDM-CHOP", "CHOP", "no_such_org"})
		assert.NoError(t, err)
		assert.Equal(t, map[string][]string{
			"LDM-CHUSJ": {"ldm-chusj@example.invalid", "ldm-chusj-bis@example.invalid"},
			"LDM-CHOP":  {"ldm-chop@example.invalid"},
		}, byOrg)
	})
}

func Test_NotificationEmailsByOrg_OtherTenant_Empty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})

		byOrg, err := repo.NotificationEmailsByOrg(t.Context(), "tenant_b", []string{"LDM-CHUSJ"})
		assert.NoError(t, err)
		assert.Empty(t, byOrg)

		byOrg, err = repo.NotificationEmailsByOrg(t.Context(), types.DefaultTenantCode, nil)
		assert.NoError(t, err)
		assert.Empty(t, byOrg)
	})
}

func Test_UpdateOrganization_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.UpdateOrganization(t.Context(), "radiant", "does_not_exist", types.UpdateOrganizationRequest{Name: "X"})
		assert.ErrorIs(t, err, types.ErrOrganizationNotFound)
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

func Test_ExistingOrgCodes_ReturnsOnlyTheCodesThatExist(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})

		existing, err := repo.ExistingOrgCodes(t.Context(), types.DefaultTenantCode, []string{"CHOP", "no_such_org"})
		assert.NoError(t, err)
		assert.Equal(t, []string{"CHOP"}, existing)
	})
}

func Test_ExistingOrgCodes_ExcludesAnotherTenantsOrg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})

		existing, err := repo.ExistingOrgCodes(t.Context(), types.DefaultTenantCode, []string{"TENANT_B_ORG"})
		assert.NoError(t, err)
		assert.Empty(t, existing, "TENANT_B_ORG belongs to tenant_b, so it is not grantable in radiant")
	})
}

func Test_ExistingOrgCodes_NoCodesRequestedIsEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})

		existing, err := repo.ExistingOrgCodes(t.Context(), types.DefaultTenantCode, nil)
		assert.NoError(t, err)
		assert.Empty(t, existing)
	})
}

func Test_GetOrganizationByCode_OtherTenantRow_NotReturned(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})

		org, err := repo.GetOrganizationByCode(t.Context(), "TENANT_B_ORG", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, org, "an organization that exists only in tenant_b must not resolve for radiant")

		org, err = repo.GetOrganizationByCode(t.Context(), "TENANT_B_ORG", "tenant_b")
		assert.NoError(t, err)
		assert.NotNil(t, org)
	})
}
