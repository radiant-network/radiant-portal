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
	"github.com/stretchr/testify/require"
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

func Test_EligibleAssignees_IncludesInterpretGrantsAtThatOrg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", ghostID, allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.Contains(t, ids, aliceID, "geneticist granted at CHOP itself")
		assert.Contains(t, ids, wendyID, "geneticist granted at the '*' wildcard")
		assert.Contains(t, ids, carolID, "second wildcard geneticist")
	})
}

// An org-scoped grant is not enough on its own: data_manager carries can_ingest_data at every
// org and still cannot be assigned a case, because it cannot interpret one.
func Test_EligibleAssignees_ExcludesRoleWithoutInterpret(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", ghostID, allCandidates(""))

		assert.NoError(t, err)
		assert.NotContains(t, candidateIDs(candidates), gabeID, "data_manager holds can_ingest_data, not can_interpret_variant")
	})
}

func Test_EligibleAssignees_ExcludesGrantsAtAnotherOrg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", ghostID, allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.NotContains(t, ids, danID, "geneticist granted at CHUSJ only")
		assert.NotContains(t, ids, patID, "practitioner granted at CHUSJ only")
	})
}

// Roles that carry no can_interpret_variant at all.
func Test_EligibleAssignees_ExcludesTenantScopedOnlyRoles(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", ghostID, allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.NotContains(t, ids, mikeID, "member holds can_search_case and can_view_kb only")
		assert.NotContains(t, ids, taraID, "tenant_admin holds only the manage actions")
	})
}

// tw holds practitioner — which does map can_interpret_variant — but granted tenant-wide
// (org_code NULL), which names no organization. Same rule GetMemberships applies.
func Test_EligibleAssignees_ExcludesTenantWideGrantOfAnOrgScopedRole(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHUSJ", ghostID, allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.NotContains(t, ids, twID, "practitioner granted with org_code NULL")
		assert.Contains(t, ids, patID, "the same role granted at CHUSJ does qualify")
	})
}

func Test_EligibleAssignees_ExcludesSystemAccounts(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", ghostID, allCandidates(""))

		assert.NoError(t, err)
		// The batch client has no email, so it is not a person.
		assert.NotContains(t, candidateIDs(candidates), "c0ffee00-1111-4222-8333-444455556666")
	})
}

// A grant in another tenant must not leak, even for a user who holds the same role in both.
func Test_EligibleAssignees_ScopedToTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), "tenant_b", "CHOP", ghostID, allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.Contains(t, ids, carolID, "carol holds a wildcard geneticist grant in tenant_b too")
		assert.NotContains(t, ids, aliceID, "alice's grants are all in radiant")
	})
}

func Test_EligibleAssignees_OrderedByName(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", ghostID, allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		// Adams, Cohen, Walsh — other users may sort between them, only the order matters.
		assert.Less(t, slices.Index(ids, aliceID), slices.Index(ids, carolID))
		assert.Less(t, slices.Index(ids, carolID), slices.Index(ids, wendyID))
	})
}

func Test_EligibleAssignees_SearchMatchesEmail(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", ghostID, allCandidates("wendy@"))

		assert.NoError(t, err)
		assert.Equal(t, []string{wendyID}, candidateIDs(candidates))
	})
}

func Test_EligibleAssignees_SearchMatchesLastName(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", ghostID, allCandidates("Wal"))

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

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "NOPE", ghostID, allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.Contains(t, ids, wendyID, "granted at '*'")
		assert.NotContains(t, ids, aliceID, "granted at CHOP specifically")
	})
}

func Test_EligibleAssignees_ReturnsIdentityAttributes(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", ghostID, allCandidates("wendy@"))

		assert.NoError(t, err)
		assert.Equal(t, []types.CaseAssignee{
			{UserID: wendyID, FirstName: "Wendy", LastName: "Walsh", Email: "wendy@test.authz"},
		}, candidates)
	})
}

func assignedIDsIn(t *testing.T, db *gorm.DB, caseID int) []string {
	t.Helper()
	ids := []string{}
	err := db.Table("case_assignment").Where("case_id = ?", caseID).Order("user_id").Pluck("user_id", &ids).Error
	assert.NoError(t, err)
	return ids
}

func Test_ReplaceAssignees_AssignsFromEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		// Case 1's lab is CQGC, where carol and wendy hold wildcard grants.
		err := repo.ReplaceAssignees(t.Context(), types.DefaultTenantCode, 1, []string{wendyID, carolID})

		assert.NoError(t, err)
		assert.ElementsMatch(t, []string{wendyID, carolID}, assignedIDsIn(t, env.Postgres, 1))
	})
}

func Test_ReplaceAssignees_RemovesAndAddsInOneStep(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		assign(t, env.Postgres, types.DefaultTenantCode, 1, wendyID)

		err := repo.ReplaceAssignees(t.Context(), types.DefaultTenantCode, 1, []string{carolID})

		assert.NoError(t, err)
		assert.Equal(t, []string{carolID}, assignedIDsIn(t, env.Postgres, 1))
	})
}

func Test_ReplaceAssignees_EmptySetUnassigns(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		assign(t, env.Postgres, types.DefaultTenantCode, 1, wendyID)

		err := repo.ReplaceAssignees(t.Context(), types.DefaultTenantCode, 1, nil)

		assert.NoError(t, err)
		assert.Empty(t, assignedIDsIn(t, env.Postgres, 1))
	})
}

func Test_ReplaceAssignees_IsIdempotent(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		assert.NoError(t, repo.ReplaceAssignees(t.Context(), types.DefaultTenantCode, 1, []string{wendyID}))
		assert.NoError(t, repo.ReplaceAssignees(t.Context(), types.DefaultTenantCode, 1, []string{wendyID}))

		assert.Equal(t, []string{wendyID}, assignedIDsIn(t, env.Postgres, 1))
	})
}

func Test_ReplaceAssignees_LeavesOtherCasesAlone(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		assign(t, env.Postgres, types.DefaultTenantCode, 2, wendyID)

		err := repo.ReplaceAssignees(t.Context(), types.DefaultTenantCode, 1, []string{carolID})

		assert.NoError(t, err)
		assert.Equal(t, []string{wendyID}, assignedIDsIn(t, env.Postgres, 2))
	})
}

// alice is a geneticist at CHOP; case 1's lab is CQGC, and she is not already assigned.
func Test_ReplaceAssignees_RejectsIneligibleNewcomer(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.ReplaceAssignees(t.Context(), types.DefaultTenantCode, 1, []string{aliceID})

		var ineligible *types.IneligibleAssigneesError
		require.ErrorAs(t, err, &ineligible)
		assert.Equal(t, "CQGC", ineligible.OrgCode)
		assert.Equal(t, []string{aliceID}, ineligible.UserIDs)
		assert.Empty(t, assignedIDsIn(t, env.Postgres, 1), "a refused request writes nothing")
	})
}

// An already-assigned user who is not eligible at the lab is pruned rather than refused.
func Test_ReplaceAssignees_PrunesIneligibleExistingAssignee(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		// alice cannot interpret at CQGC, but is on the case already.
		assign(t, env.Postgres, types.DefaultTenantCode, 1, aliceID)

		err := repo.ReplaceAssignees(t.Context(), types.DefaultTenantCode, 1, []string{aliceID})

		assert.NoError(t, err)
		assert.Empty(t, assignedIDsIn(t, env.Postgres, 1))
	})
}

func Test_ReplaceAssignees_UnknownCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.ReplaceAssignees(t.Context(), types.DefaultTenantCode, 999999, nil)

		assert.ErrorIs(t, err, types.ErrCaseNotFound)
	})
}

// A case of another tenant is as good as absent, so the write cannot reach across tenants.
func Test_ReplaceAssignees_CaseOfAnotherTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.ReplaceAssignees(t.Context(), "tenant_b", 1, nil)

		assert.ErrorIs(t, err, types.ErrCaseNotFound)
	})
}

func Test_EligibleAssigneeIDs_KeepsOnlyTheEligible(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// At CHOP: alice is granted there, wendy by wildcard; dan is a geneticist at CHUSJ only.
		eligible, err := eligibleAssigneeIDs(env.Postgres, types.DefaultTenantCode, "CHOP", []string{aliceID, wendyID, danID})

		assert.NoError(t, err)
		assert.ElementsMatch(t, []string{aliceID, wendyID}, eligible)
	})
}

// An id the registry does not know simply does not come back, which is the same answer as "not
// eligible" — the caller rejects the request either way.
func Test_EligibleAssigneeIDs_DropsUnknownUser(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		eligible, err := eligibleAssigneeIDs(env.Postgres, types.DefaultTenantCode, "CHOP", []string{ghostID})

		assert.NoError(t, err)
		assert.Empty(t, eligible)
	})
}

func Test_EligibleAssigneeIDs_NoUsers(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		eligible, err := eligibleAssigneeIDs(env.Postgres, types.DefaultTenantCode, "CHOP", nil)

		assert.NoError(t, err)
		assert.Empty(t, eligible)
	})
}

// At CHOP the eligible users sort Adams, Cohen, Walsh. The caller jumps the queue so that
// assigning a case to oneself is the first row of the picker.
func Test_EligibleAssignees_CallerComesFirst(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", wendyID, allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		require.NotEmpty(t, ids)
		assert.Equal(t, wendyID, ids[0], "the caller leads even though Walsh sorts last")
		assert.Less(t, slices.Index(ids, aliceID), slices.Index(ids, carolID), "the rest keep their order")
	})
}

// A caller who cannot be assigned the case is not inserted into the list by being the caller.
func Test_EligibleAssignees_IneligibleCallerIsNotListed(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		// dan is a geneticist at CHUSJ only, so he is no candidate at CHOP.
		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", danID, allCandidates(""))

		assert.NoError(t, err)
		ids := candidateIDs(candidates)
		assert.NotContains(t, ids, danID)
		assert.Equal(t, aliceID, ids[0], "ordering falls back to name")
	})
}

// The reason the caller is ordered in SQL rather than moved to the front of the result: with a
// page smaller than the candidate list, reordering after the fact would leave a caller who sorts
// late out of the first page altogether instead of leading it.
func Test_EligibleAssignees_CallerLeadsTheFirstPage(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		onePerPage := types.ListAssignmentCandidatesQuery{Pagination: &types.Pagination{Limit: 1}}

		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", wendyID, onePerPage)

		assert.NoError(t, err)
		assert.Equal(t, []string{wendyID}, candidateIDs(candidates), "Walsh sorts last by name yet fills the single-row page")
	})
}

// Ordering the caller first must not exempt them from the search: a caller who does not match
// the term stays out of the results rather than being surfaced at the top of them.
func Test_EligibleAssignees_CallerNotSurfacedPastTheSearch(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})

		// "Coh" matches Cohen only; wendy is the caller and matches nothing.
		candidates, err := repo.EligibleAssignees(t.Context(), types.DefaultTenantCode, "CHOP", wendyID, allCandidates("Coh"))

		assert.NoError(t, err)
		assert.Equal(t, []string{carolID}, candidateIDs(candidates))
	})
}
