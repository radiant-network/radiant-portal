package main

import (
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
)

// Mirrors the production wiring — RequireTenantAccess, then the can_edit_case gate resolving
// the labs named in the body, then the handler — as wendy, a wildcard geneticist who holds
// can_edit_case at every radiant org.
func assertAssignmentCandidates(t *testing.T, requestBody string, expectedStatus int, assertBody func(t *testing.T, body string)) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := postgres.NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: wendyID}

		router := gin.New()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.POST("/cases/assignment_candidates",
			server.RequireActionAtEvery(auth, authRepo, types.ActionEditCase, server.OrgsFromCaseIDsBody(authRepo)),
			server.ListCaseAssignmentCandidatesHandler(repo, authRepo))

		req, _ := http.NewRequest("POST", "/radiant/cases/assignment_candidates", strings.NewReader(requestBody))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, expectedStatus, w.Code)
		assertBody(t, w.Body.String())
	})
}

// Case 1's diagnosis lab is CQGC, where only the wildcard grants reach: carol and wendy are
// geneticists at '*', gabe is a data_manager at '*'. alice (CHOP) and dan (CHUSJ) hold their
// grants at another lab, and the nameless batch client is not a person.
func Test_ListCaseAssignmentCandidates_AtTheCaseLab(t *testing.T) {
	assertAssignmentCandidates(t, `{"case_ids":[1]}`, http.StatusOK, func(t *testing.T, body string) {
		assert.JSONEq(t, `[
			{"user_id":"b6e6d0dd-7aa5-4018-ae03-1f5076801360","first_name":"Carol","last_name":"Cohen","email":"carol@test.authz"},
			{"user_id":"0a1b2c3d-4e5f-4061-8273-849506a7b8c9","first_name":"Gabe","last_name":"Green","email":"gabe@test.authz"},
			{"user_id":"79a8855e-3782-4dc8-be2a-8afdb34d6359","first_name":"Wendy","last_name":"Walsh","email":"wendy@test.authz"}
		]`, body)
	})
}

func Test_ListCaseAssignmentCandidates_Search(t *testing.T) {
	assertAssignmentCandidates(t, `{"case_ids":[1],"search":"coh"}`, http.StatusOK, func(t *testing.T, body string) {
		assert.JSONEq(t, `[
			{"user_id":"b6e6d0dd-7aa5-4018-ae03-1f5076801360","first_name":"Carol","last_name":"Cohen","email":"carol@test.authz"}
		]`, body)
	})
}

func Test_ListCaseAssignmentCandidates_SearchMatchesNobody(t *testing.T) {
	assertAssignmentCandidates(t, `{"case_ids":[1],"search":"zzz"}`, http.StatusOK, func(t *testing.T, body string) {
		assert.JSONEq(t, `[]`, body)
	})
}

// Every fixture case shares the CQGC lab, so a multi-case request resolves normally.
func Test_ListCaseAssignmentCandidates_SeveralCases(t *testing.T) {
	assertAssignmentCandidates(t, `{"case_ids":[1,2,3]}`, http.StatusOK, func(t *testing.T, body string) {
		assert.Contains(t, body, "wendy@test.authz")
	})
}

// A case that does not exist attributes the request to no lab, so the gate refuses it before
// the handler runs — a generic 403, which is also what stops the endpoint revealing whether a
// case exists. The handler's own 400 for the same input is covered by its unit tests; it stays
// because a handler must not assume a gate ran in front of it.
func Test_ListCaseAssignmentCandidates_UnknownCaseDeniedByTheGate(t *testing.T) {
	assertAssignmentCandidates(t, `{"case_ids":[999999]}`, http.StatusForbidden, func(t *testing.T, body string) {})
}

func Test_ListCaseAssignmentCandidates_MissingCaseIDsDeniedByTheGate(t *testing.T) {
	assertAssignmentCandidates(t, `{}`, http.StatusForbidden, func(t *testing.T, body string) {})
}

// A caller who can read cases but cannot edit them has no use for the picker: alice holds every
// geneticist action, but at CHOP, and case 1's lab is CQGC.
func Test_ListCaseAssignmentCandidates_WithoutEditRightsAtTheLab(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := postgres.NewCaseAssignmentsRepository(database.PostgresDB{DB: env.Postgres})
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: aliceID}

		router := gin.New()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.POST("/cases/assignment_candidates",
			server.RequireActionAtEvery(auth, authRepo, types.ActionEditCase, server.OrgsFromCaseIDsBody(authRepo)),
			server.ListCaseAssignmentCandidatesHandler(repo, authRepo))

		req, _ := http.NewRequest("POST", "/radiant/cases/assignment_candidates", strings.NewReader(`{"case_ids":[1]}`))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusForbidden, w.Code)
	})
}
