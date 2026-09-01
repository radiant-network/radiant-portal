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

var splitStatusCodes = []types.ValueSetItem{
	{Code: "completed", Name: "Completed"},
	{Code: "draft", Name: "Draft"},
	{Code: "in_progress", Name: "In Progress"},
	{Code: "incomplete", Name: "Incomplete"},
	{Code: "revoke", Name: "Revoke"},
	{Code: "submitted", Name: "Submitted"},
	{Code: "unknown", Name: "Unknown"},
}

func Test_ListValueSet_CaseStatus(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewValueSetsRepository(database.PostgresDB{DB: env.Postgres})

		items, err := repo.ListValueSet(t.Context(), "case_status")
		assert.NoError(t, err)
		assert.Subset(t, items, splitStatusCodes)
	})
}

func Test_ListValueSet_SequencingExperimentStatus(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewValueSetsRepository(database.PostgresDB{DB: env.Postgres})

		items, err := repo.ListValueSet(t.Context(), "sequencing_experiment_status")
		assert.NoError(t, err)
		assert.Subset(t, items, splitStatusCodes)
	})
}

func Test_ListValueSet_StatusIsRetired(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewValueSetsRepository(database.PostgresDB{DB: env.Postgres})

		items, err := repo.ListValueSet(t.Context(), "status")
		assert.ErrorIs(t, err, types.ErrUnknownValueSet)
		assert.Nil(t, items)
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
