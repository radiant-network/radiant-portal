package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
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
