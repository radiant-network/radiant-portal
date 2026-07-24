package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_GetProjectByCode_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewProjectRepository(database.PostgresDB{DB: env.Postgres})
		project, err := repo.GetProjectByCode(t.Context(), "N1")
		assert.NoError(t, err)
		assert.NotNil(t, project)
		assert.Equal(t, 1, project.ID)
		assert.Equal(t, "Phase one NeuroDev cases", project.Description)
	})
}

func Test_GetProjectByCode_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewProjectRepository(database.PostgresDB{DB: env.Postgres})
		project, err := repo.GetProjectByCode(t.Context(), "notexists")
		assert.NoError(t, err)
		assert.Nil(t, project)
	})
}
