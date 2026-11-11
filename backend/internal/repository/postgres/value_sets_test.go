package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_ListValueSet_OrganizationCategory(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewValueSetsRepository(database.PostgresDB{DB: env.Postgres})

		items, err := repo.ListValueSet(t.Context(), "organization_category")
		assert.NoError(t, err)
		// Seeded by migration 000001 (organization_category), ordered by name_en.
		assert.Equal(t, []types.ValueSetItem{
			{Code: "diagnostic_laboratory", Name: "Diagnostic Laboratory"},
			{Code: "healthcare_provider", Name: "Healthcare Provider"},
			{Code: "research_institute", Name: "Research Institute"},
			{Code: "sequencing_center", Name: "Sequencing Center"},
		}, items)
	})
}

func Test_ListValueSet_UnknownType(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewValueSetsRepository(database.PostgresDB{DB: env.Postgres})

		items, err := repo.ListValueSet(t.Context(), "not_a_value_set")
		assert.ErrorIs(t, err, types.ErrUnknownValueSet)
		assert.Nil(t, items)
	})
}

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
