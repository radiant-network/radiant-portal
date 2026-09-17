package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_Projects_ListByTenant_Seeded(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewProjectsRepository(database.PostgresDB{DB: env.Postgres})
		projects, err := repo.ListByTenant(t.Context(), types.DefaultTenantCode)
		require.NoError(t, err)
		assert.Equal(t, []types.Project{
			{ID: 1, Code: "N1", Name: "NeuroDev Phase I", Description: "Phase one NeuroDev cases"},
			{ID: 2, Code: "N2", Name: "NeuroDev Phase II", Description: "Phase two NeuroDev cases"},
		}, projects)
	})
}

func Test_Projects_ListByTenant_OtherTenant_Empty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewProjectsRepository(database.PostgresDB{DB: env.Postgres})
		projects, err := repo.ListByTenant(t.Context(), "tenant_b")
		require.NoError(t, err)
		assert.Equal(t, []types.Project{}, projects)
	})
}

func Test_Projects_GetByCode_Found(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewProjectsRepository(database.PostgresDB{DB: env.Postgres})
		project, err := repo.GetByCode(t.Context(), types.DefaultTenantCode, "N2")
		require.NoError(t, err)
		require.NotNil(t, project)
		assert.Equal(t, "NeuroDev Phase II", project.Name)
	})
}

func Test_Projects_GetByCode_WrongTenant_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewProjectsRepository(database.PostgresDB{DB: env.Postgres})
		project, err := repo.GetByCode(t.Context(), "tenant_b", "N2")
		require.NoError(t, err)
		assert.Nil(t, project)
	})
}

func Test_Projects_GetByCode_UnknownCode_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewProjectsRepository(database.PostgresDB{DB: env.Postgres})
		project, err := repo.GetByCode(t.Context(), types.DefaultTenantCode, "NOPE")
		require.NoError(t, err)
		assert.Nil(t, project)
	})
}
