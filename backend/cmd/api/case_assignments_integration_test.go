package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// candidatesRouter mirrors the production wiring: RequireTenantAccess, then the can_edit_case
// gate resolving the case's lab, then the handler.
func candidatesRouter(env *testutils.Env, userID string) *gin.Engine {
	repo := postgres.NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
	authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
	auth := &testutils.MockAuth{Id: userID}

	router := gin.New()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
	tenantRoutes.GET("/cases/:case_id/assignment_candidates",
		server.RequireActionAt(auth, authRepo, types.ActionEditCase, server.OrgFromCaseParam(authRepo)),
		server.ListCaseAssignmentCandidatesHandler(repo, authRepo))
	return router
}

func assertAssignmentCandidates(t *testing.T, path string, expectedStatus int, assertBody func(t *testing.T, body string)) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		req, _ := http.NewRequest("GET", fmt.Sprintf("/radiant/cases/%s", path), nil)
		w := httptest.NewRecorder()
		candidatesRouter(env, wendyID).ServeHTTP(w, req)

		assert.Equal(t, expectedStatus, w.Code)
		assertBody(t, w.Body.String())
	})
}

// Case 1's diagnosis lab is CQGC, where only the wildcard grants reach: carol and wendy hold
// geneticist at '*', which carries can_interpret_variant. alice (CHOP) and dan (CHUSJ) hold it
// at another lab, gabe's data_manager does not carry it at all, and the nameless batch client
// is not a person.
func Test_ListCaseAssignmentCandidates_AtTheCaseLab(t *testing.T) {
	assertAssignmentCandidates(t, "1/assignment_candidates", http.StatusOK, func(t *testing.T, body string) {
		assert.JSONEq(t, `[
			{"user_id":"b6e6d0dd-7aa5-4018-ae03-1f5076801360","first_name":"Carol","last_name":"Cohen","email":"carol@test.authz"},
			{"user_id":"79a8855e-3782-4dc8-be2a-8afdb34d6359","first_name":"Wendy","last_name":"Walsh","email":"wendy@test.authz"}
		]`, body)
	})
}

func Test_ListCaseAssignmentCandidates_Search(t *testing.T) {
	assertAssignmentCandidates(t, "1/assignment_candidates?search=coh", http.StatusOK, func(t *testing.T, body string) {
		assert.JSONEq(t, `[
			{"user_id":"b6e6d0dd-7aa5-4018-ae03-1f5076801360","first_name":"Carol","last_name":"Cohen","email":"carol@test.authz"}
		]`, body)
	})
}

func Test_ListCaseAssignmentCandidates_SearchMatchesNobody(t *testing.T) {
	assertAssignmentCandidates(t, "1/assignment_candidates?search=zzz", http.StatusOK, func(t *testing.T, body string) {
		assert.JSONEq(t, `[]`, body)
	})
}

// An unknown case attributes the request to no lab, so the gate refuses it before the handler
// runs — a generic 403, which is also what stops the endpoint revealing whether a case exists.
func Test_ListCaseAssignmentCandidates_UnknownCaseDeniedByTheGate(t *testing.T) {
	assertAssignmentCandidates(t, "999999/assignment_candidates", http.StatusForbidden, func(t *testing.T, body string) {})
}

func Test_ListCaseAssignmentCandidates_MalformedCaseIdDeniedByTheGate(t *testing.T) {
	assertAssignmentCandidates(t, "not-a-number/assignment_candidates", http.StatusForbidden, func(t *testing.T, body string) {})
}

// A caller who can read cases but cannot edit them has no use for the picker: alice holds every
// geneticist action, but at CHOP, and case 1's lab is CQGC.
func Test_ListCaseAssignmentCandidates_WithoutEditRightsAtTheLab(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		req, _ := http.NewRequest("GET", "/radiant/cases/1/assignment_candidates", nil)
		w := httptest.NewRecorder()
		candidatesRouter(env, aliceID).ServeHTTP(w, req)

		assert.Equal(t, http.StatusForbidden, w.Code)
	})
}

// assignmentsRouter mirrors the production wiring for the write path: RequireTenantAccess, then
// the can_edit_case gate resolving the case's lab, then the handler.
func assignmentsRouter(env *testutils.Env, userID string) *gin.Engine {
	repo := postgres.NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
	authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
	auth := &testutils.MockAuth{Id: userID}

	router := gin.New()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
	tenantRoutes.PUT("/cases/:case_id/assignments",
		server.RequireActionAt(auth, authRepo, types.ActionEditCase, server.OrgFromCaseParam(authRepo)),
		server.PutCaseAssignmentsHandler(repo))
	return router
}

func putAssignments(t *testing.T, env *testutils.Env, userID, path, body string) *httptest.ResponseRecorder {
	t.Helper()
	req, _ := http.NewRequest("PUT", "/radiant/cases/"+path+"/assignments", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	assignmentsRouter(env, userID).ServeHTTP(w, req)
	return w
}

// assigneesOfCase1 reads the stored set back. The endpoint answers 200 with no body, like the
// other PUTs, so what was actually written is asserted here rather than on the response.
func assigneesOfCase(t *testing.T, env *testutils.Env, caseID int) []string {
	t.Helper()
	repo := postgres.NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
	byCase, err := repo.ListForCases(t.Context(), []int{caseID})
	require.NoError(t, err)
	ids := make([]string, len(byCase[caseID]))
	for i, assignee := range byCase[caseID] {
		ids[i] = assignee.UserID
	}
	return ids
}

// carol and wendy are the wildcard geneticists, so they are the ones assignable at CQGC.
func Test_PutCaseAssignments_Assigns(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		w := putAssignments(t, env, wendyID, "1", `{"user_ids":["`+carolID+`"]}`)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Empty(t, w.Body.String())
		assert.Equal(t, []string{carolID}, assigneesOfCase(t, env, 1))
	})
}

func Test_PutCaseAssignments_EmptyListUnassigns(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		require.Equal(t, http.StatusOK, putAssignments(t, env, wendyID, "1", `{"user_ids":["`+carolID+`"]}`).Code)

		w := putAssignments(t, env, wendyID, "1", `{"user_ids":[]}`)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Empty(t, assigneesOfCase(t, env, 1))
	})
}

// A PUT replaces the whole set rather than adding to it. Both users are eligible at the case's
// lab, so nothing here is explained by the pruning rule: wendy goes because the second request
// does not name her, full stop.
func Test_PutCaseAssignments_ReplacesRatherThanMerges(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		require.Equal(t, http.StatusOK,
			putAssignments(t, env, wendyID, "1", `{"user_ids":["`+wendyID+`"]}`).Code)
		require.Equal(t, []string{wendyID}, assigneesOfCase(t, env, 1))

		w := putAssignments(t, env, wendyID, "1", `{"user_ids":["`+carolID+`"]}`)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, []string{carolID}, assigneesOfCase(t, env, 1), "wendy is replaced, not joined by carol")
	})
}

func Test_PutCaseAssignments_IsIdempotent(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		body := `{"user_ids":["` + carolID + `","` + wendyID + `"]}`
		require.Equal(t, http.StatusOK, putAssignments(t, env, wendyID, "1", body).Code)

		w := putAssignments(t, env, wendyID, "1", body)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.ElementsMatch(t, []string{carolID, wendyID}, assigneesOfCase(t, env, 1))
	})
}

// alice is a geneticist at CHOP; case 1's lab is CQGC, so she cannot be assigned to it.
func Test_PutCaseAssignments_RejectsAssigneeFromAnotherLab(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		w := putAssignments(t, env, wendyID, "1", `{"user_ids":["`+aliceID+`"]}`)

		assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
		assert.Contains(t, w.Body.String(), aliceID)
	})
}

// revokeGrantsDuringTest strips a user's grants in the radiant tenant for the rest of the test
// and puts back exactly the rows it found, whatever they were — the seed is free to change
// without this helper quietly narrowing someone's access to one hardcoded row.
//
// The restore matters beyond this file: testutils' cleanUp truncates case_assignment but never
// touches user_role, so nothing else will repair the seed. It is asserted rather than left
// best-effort because a silent failure leaves the user unprivileged for every later test in the
// run, and the ones that break then point anywhere but here. assert, not require: a require
// would abort the loop and skip the rows it had not restored yet.
func revokeGrantsDuringTest(t *testing.T, env *testutils.Env, userID string) {
	t.Helper()
	type grant struct {
		OrgCode  *string
		RoleCode string
	}
	var granted []grant
	require.NoError(t, env.Postgres.Raw(
		`SELECT org_code, role_code FROM user_role WHERE user_id = ? AND tenant_code = 'radiant'`,
		userID).Scan(&granted).Error)
	require.NotEmpty(t, granted, "nothing to revoke — the auth seed no longer grants this user anything")

	require.NoError(t, env.Postgres.Exec(
		`DELETE FROM user_role WHERE user_id = ? AND tenant_code = 'radiant'`, userID).Error)
	t.Cleanup(func() {
		for _, g := range granted {
			assert.NoError(t, env.Postgres.Exec(
				`INSERT INTO user_role (user_id, tenant_code, org_code, role_code)
				 VALUES (?, 'radiant', ?, ?) ON CONFLICT DO NOTHING`,
				userID, g.OrgCode, g.RoleCode).Error, "restoring the auth seed")
		}
	})
}

// Losing the permission does not unassign anyone on its own: the assignment stays readable.
// The next write is what prunes it. Both halves are asserted here because they are the same
// rule seen from the read and the write side.
func Test_PutCaseAssignments_StaleAssigneeIsReadableThenPrunedByTheNextWrite(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		body := `{"user_ids":["` + carolID + `"]}`
		require.Equal(t, http.StatusOK, putAssignments(t, env, wendyID, "1", body).Code)

		revokeGrantsDuringTest(t, env, carolID)

		// Read side: she is still assigned.
		assert.Equal(t, []string{carolID}, assigneesOfCase(t, env, 1), "losing a grant does not unassign")

		// Write side: resubmitting the same set prunes her.
		w := putAssignments(t, env, wendyID, "1", body)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Empty(t, assigneesOfCase(t, env, 1), "the next write cleared her")
	})
}

// A stale assignee the caller does not mention goes too, by the replace semantics rather than
// the eligibility filter: whoever is absent from the submitted set is removed, eligible or not.
func Test_PutCaseAssignments_StaleAssigneeIsPrunedByAWriteThatOmitsThem(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		require.Equal(t, http.StatusOK,
			putAssignments(t, env, wendyID, "1", `{"user_ids":["`+carolID+`"]}`).Code)

		revokeGrantsDuringTest(t, env, carolID)

		// carol is not named at all; wendy replaces her.
		w := putAssignments(t, env, wendyID, "1", `{"user_ids":["`+wendyID+`"]}`)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, []string{wendyID}, assigneesOfCase(t, env, 1))
	})
}

func Test_PutCaseAssignments_UnknownCaseDeniedByTheGate(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		w := putAssignments(t, env, wendyID, "999999", `{"user_ids":[]}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
	})
}

func Test_PutCaseAssignments_WithoutEditRightsAtTheLab(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		w := putAssignments(t, env, aliceID, "1", `{"user_ids":[]}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
	})
}
