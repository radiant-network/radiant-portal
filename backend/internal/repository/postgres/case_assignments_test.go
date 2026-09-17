package postgres

import (
	"context"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

const (
	aliceUserID = "25286548-fbef-4e93-b3c4-c659e6169396"
	wendyUserID = "79a8855e-3782-4dc8-be2a-8afdb34d6359"
	carolUserID = "b6e6d0dd-7aa5-4018-ae03-1f5076801360"
)

func assign(t *testing.T, db *gorm.DB, tenantCode string, caseID int, userIDs ...string) {
	t.Helper()
	for _, userID := range userIDs {
		err := db.Create(&types.CaseAssignment{CaseID: caseID, UserID: userID, TenantCode: tenantCode}).Error
		assert.NoError(t, err)
	}
}

func Test_ListForCases_GroupsAssigneesByCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		assign(t, env.Postgres, types.DefaultTenantCode, 1, wendyUserID, aliceUserID)
		assign(t, env.Postgres, types.DefaultTenantCode, 2, carolUserID)

		byCase, err := repo.ListForCases(t.Context(), []int{1, 2, 3})

		assert.NoError(t, err)
		// Ordered by last name: Adams before Walsh.
		assert.Equal(t, []types.CaseAssignee{
			{UserID: aliceUserID, FirstName: "Alice", LastName: "Adams", Email: "alice@test.authz"},
			{UserID: wendyUserID, FirstName: "Wendy", LastName: "Walsh", Email: "wendy@test.authz"},
		}, byCase[1])
		assert.Equal(t, []types.CaseAssignee{
			{UserID: carolUserID, FirstName: "Carol", LastName: "Cohen", Email: "carol@test.authz"},
		}, byCase[2])
		// Case 3 has no assignee: absent from the map rather than present and empty.
		assert.NotContains(t, byCase, 3)
	})
}

func Test_ListForCases_IgnoresCasesNotAskedFor(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		assign(t, env.Postgres, types.DefaultTenantCode, 1, wendyUserID)
		assign(t, env.Postgres, types.DefaultTenantCode, 2, carolUserID)

		byCase, err := repo.ListForCases(t.Context(), []int{2})

		assert.NoError(t, err)
		assert.Len(t, byCase, 1)
		assert.NotContains(t, byCase, 1)
	})
}

func Test_ListForCases_NoCases(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		byCase, err := repo.ListForCases(t.Context(), nil)

		assert.NoError(t, err)
		assert.Empty(t, byCase)
	})
}

// A tenant bound to the context narrows the read, so a case id cannot pull assignments
// recorded under another tenant. Without a bound tenant the scope is a no-op, which is how
// the rest of the read path behaves when per-tenant views are off.
func Test_ListForCases_ScopedToBoundTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		assign(t, env.Postgres, types.DefaultTenantCode, 1, wendyUserID)

		radiant, err := repo.ListForCases(types.ContextWithTenant(context.Background(), types.DefaultTenantCode), []int{1})
		assert.NoError(t, err)
		assert.Len(t, radiant[1], 1)

		other, err := repo.ListForCases(types.ContextWithTenant(context.Background(), "tenant_b"), []int{1})
		assert.NoError(t, err)
		assert.Empty(t, other)
	})
}
