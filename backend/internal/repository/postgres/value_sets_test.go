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

// ListValueSet selects code + name_en on whatever table the type maps to, so the mapping is only
// valid as long as every mapped table actually has those columns. Looping the registry is what
// verifies that invariant: service_catalog was mapped for months while it still had `name`, and
// the single-type test above never touched it.
func Test_ListValueSet_EveryMappedType(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewValueSetsRepository(database.PostgresDB{DB: env.Postgres})

		for vsType, tableName := range repo.tableMap {
			items, err := repo.ListValueSet(t.Context(), string(vsType))
			assert.NoError(t, err, "ValueSetType: %s, TableName: %s", vsType, tableName)
			assert.NotNil(t, items, "ValueSetType: %s, TableName: %s", vsType, tableName)
			for _, item := range items {
				assert.NotEmpty(t, item.Code, "ValueSetType: %s returned an item with no code", vsType)
			}
		}
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
