package postgres

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_GetProjectByCode_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewProjectRepository(database.PostgresDB{DB: env.Postgres})
		project, err := repo.GetProjectByCode(t.Context(), "N1", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.NotNil(t, project)
		assert.Equal(t, 1, project.ID)
		assert.Equal(t, "Phase one NeuroDev cases", project.Description)
	})
}

func Test_GetProjectByCode_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewProjectRepository(database.PostgresDB{DB: env.Postgres})
		project, err := repo.GetProjectByCode(t.Context(), "notexists", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, project)
	})
}

func Test_GetProjectByCode_OtherTenantRow_NotReturned(t *testing.T) {
	// project.code is unique per (code, tenant_code) since migration 000014, so two tenants can
	// hold the same code.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewProjectRepository(database.PostgresDB{DB: db})
		require.NoError(t, db.Exec(`
			INSERT INTO project (id, code, name, description, tenant_code)
			VALUES (9010, 'PROJ-TENANT-ISO', 'Tenant Isolation Project', '', 'tenant_b')
		`).Error)
		defer db.Exec(`DELETE FROM project WHERE id = 9010`)

		project, err := repo.GetProjectByCode(t.Context(), "PROJ-TENANT-ISO", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, project, "a project that exists only in tenant_b must not resolve for radiant")

		project, err = repo.GetProjectByCode(t.Context(), "PROJ-TENANT-ISO", "tenant_b")
		assert.NoError(t, err)
		require.NotNil(t, project)
		assert.Equal(t, 9010, project.ID)
	})
}
