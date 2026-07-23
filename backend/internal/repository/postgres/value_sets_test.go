package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_GetCodes(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewValueSetsRepository(database.PostgresDB{DB: env.Postgres})

		for vsType, tableName := range repo.tableMap {
			result, err := repo.GetCodes(t.Context(), vsType)
			assert.NoError(t, err)
			assert.NotNil(t, result)
			assert.Greater(t, len(result), 0, "ValueSetType: %s, TableName: %s", vsType, tableName)
		}
	})
}
