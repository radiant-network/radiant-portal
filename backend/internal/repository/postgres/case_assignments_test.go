package postgres

import (
	"context"
	"slices"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
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
		assign(t, env.Postgres, types.DefaultTenantCode, 1, wendyID, aliceID)
		assign(t, env.Postgres, types.DefaultTenantCode, 2, carolID)

		byCase, err := repo.ListForCases(t.Context(), []int{1, 2, 3})

		assert.NoError(t, err)
		// Ordered by last name: Adams before Walsh.
		assert.Equal(t, []types.CaseAssignee{
			{UserID: aliceID, FirstName: "Alice", LastName: "Adams", Email: "alice@test.authz"},
			{UserID: wendyID, FirstName: "Wendy", LastName: "Walsh", Email: "wendy@test.authz"},
		}, byCase[1])
		assert.Equal(t, []types.CaseAssignee{
			{UserID: carolID, FirstName: "Carol", LastName: "Cohen", Email: "carol@test.authz"},
		}, byCase[2])
		// Case 3 has no assignee: absent from the map rather than present and empty.
		assert.NotContains(t, byCase, 3)
	})
}

func Test_ListForCases_IgnoresCasesNotAskedFor(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		assign(t, env.Postgres, types.DefaultTenantCode, 1, wendyID)
		assign(t, env.Postgres, types.DefaultTenantCode, 2, carolID)

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
		assign(t, env.Postgres, types.DefaultTenantCode, 1, wendyID)

		radiant, err := repo.ListForCases(types.ContextWithTenant(context.Background(), types.DefaultTenantCode), []int{1})
		assert.NoError(t, err)
		assert.Len(t, radiant[1], 1)

		other, err := repo.ListForCases(types.ContextWithTenant(context.Background(), "tenant_b"), []int{1})
		assert.NoError(t, err)
		assert.Empty(t, other)
	})
}

// allCandidates mirrors what the handler passes for an unpaged request: parallel provisioning
// tests add users to radiant, so a test looking for a fixture user must not be capped at the
// default page. For the same reason the assertions below check membership and relative order
// rather than the exact list.
func allCandidates(search string) types.ListAssignmentCandidatesQuery {
	return types.ListAssignmentCandidatesQuery{Search: search, Pagination: &types.Pagination{Limit: utils.MaxLimit}}
}

func candidateIDs(candidates []types.CaseAssignee) []string {
	ids := make([]string, len(candidates))
	for i, candidate := range candidates {
		ids[i] = candidate.UserID
	}
	return ids
}

func Test_EligibleAssignees_IncludesOrgScopedGrantsAtThatOrg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.Contains(t, ids, aliceID, "geneticist granted at CHOP itself")
		assert.Contains(t, ids, wendyID, "geneticist granted at the '*' wildcard")
		assert.Contains(t, ids, carolID, "second wildcard geneticist")
	})
}

// can_ingest_data is org-scoped, so the data_manager role qualifies even though it is an
// operations role rather than a clinical one. Pinned deliberately: narrowing the rule to the
// clinical actions is a product decision, not an oversight to fix silently.
func Test_EligibleAssignees_IncludesDataManager(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", allCandidates(""))

		assert.NoError(t, err)
		assert.Contains(t, candidateIDs(candidates), gabeID)
	})
}

func Test_EligibleAssignees_ExcludesGrantsAtAnotherOrg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.NotContains(t, ids, danID, "geneticist granted at CHUSJ only")
		assert.NotContains(t, ids, patID, "practitioner granted at CHUSJ only")
	})
}

// A role whose actions are all tenant-scoped carries no organization, so holding it is not
// being part of a lab.
func Test_EligibleAssignees_ExcludesTenantScopedOnlyRoles(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.NotContains(t, ids, mikeID, "member holds can_search_case and can_view_kb, both tenant-scoped")
		assert.NotContains(t, ids, taraID, "tenant_admin holds only the tenant-scoped manage actions")
	})
}

// tw holds practitioner — which does map org-scoped actions — but granted tenant-wide
// (org_code NULL), which names no organization. Same rule GetMemberships applies.
func Test_EligibleAssignees_ExcludesTenantWideGrantOfAnOrgScopedRole(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHUSJ", allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.NotContains(t, ids, twID, "practitioner granted with org_code NULL")
		assert.Contains(t, ids, patID, "the same role granted at CHUSJ does qualify")
	})
}

func Test_EligibleAssignees_ExcludesSystemAccounts(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", allCandidates(""))

		assert.NoError(t, err)
		// The batch client holds data_manager at '*' but has no email, so it is not a person.
		assert.NotContains(t, candidateIDs(candidates), "c0ffee00-1111-4222-8333-444455556666")
	})
}

// A grant in another tenant must not leak, even for a user who holds the same role in both.
func Test_EligibleAssignees_ScopedToTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), "tenant_b", "CHOP", allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.Contains(t, ids, carolID, "carol holds a wildcard geneticist grant in tenant_b too")
		assert.NotContains(t, ids, aliceID, "alice's grants are all in radiant")
	})
}

func Test_EligibleAssignees_OrderedByName(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		// Adams, Cohen, Green, Walsh — other users may sort between them, only the order matters.
		assert.Less(t, slices.Index(ids, aliceID), slices.Index(ids, carolID))
		assert.Less(t, slices.Index(ids, carolID), slices.Index(ids, gabeID))
		assert.Less(t, slices.Index(ids, gabeID), slices.Index(ids, wendyID))
	})
}

func Test_EligibleAssignees_SearchMatchesEmail(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", allCandidates("wendy@"))

		assert.NoError(t, err)
		assert.Equal(t, []string{wendyID}, candidateIDs(candidates))
	})
}

func Test_EligibleAssignees_SearchMatchesLastName(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", allCandidates("Wal"))

		assert.NoError(t, err)
		assert.Equal(t, []string{wendyID}, candidateIDs(candidates))
	})
}

// A '*' grant is matched literally, so an org code naming no organization still returns the
// wildcard holders rather than nothing. Unreachable through the endpoint — the org code is a
// case's diagnosis_lab_code, which the schema constrains to a real organization — so this pins
// the behaviour rather than endorsing it: expanding '*' against the organization table would
// mean a join on every keystroke to rule out an input that cannot occur.
func Test_EligibleAssignees_UnknownOrgStillMatchesWildcardGrants(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "NOPE", allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.Contains(t, ids, wendyID, "granted at '*'")
		assert.NotContains(t, ids, aliceID, "granted at CHOP specifically")
	})
}

func Test_EligibleAssignees_ReturnsIdentityAttributes(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", allCandidates("wendy@"))

		assert.NoError(t, err)
		assert.Equal(t, []types.CaseAssignee{
			{UserID: wendyID, FirstName: "Wendy", LastName: "Walsh", Email: "wendy@test.authz"},
		}, candidates)
	})
}
