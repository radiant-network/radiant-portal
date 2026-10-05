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
	"gorm.io/gorm"
)

// Integration tests for PATCH /:tenant/cases/system_status as wired in main.go: the all-of
// can_ingest_data gate over the case ids, then the conditional status update.

func serveCaseSystemStatus(db *gorm.DB, userID, tenant, body string) *httptest.ResponseRecorder {
	authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: db})
	casesRepo := postgres.NewCasesRepository(database.PostgresDB{DB: db})
	auth := &testutils.MockAuth{Id: userID}

	router := gin.New()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
	tenantRoutes.PATCH("/cases/system_status",
		server.RequireActionAtEvery(auth, authRepo, types.ActionIngestData, server.OrgsFromCaseIDsBody(authRepo)),
		server.PatchCaseSystemStatusHandler(casesRepo))

	req, _ := http.NewRequest(http.MethodPatch, "/"+tenant+"/cases/system_status", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_CaseSystemStatus_PipelineMovesCasesThroughProcessing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100040, types.CaseStatusSubmitted)
		seedCase(t, env.Postgres, 100041, types.CaseStatusRevoked)

		w := serveCaseSystemStatus(env.Postgres, gabeID, "radiant", `{"cases":[
			{"case_id":100040,"status_code":"processing","expected_status_codes":["submitted"]},
			{"case_id":100041,"status_code":"processing","expected_status_codes":["submitted"]}]}`)
		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"cases":[
			{"case_id":100040,"updated":true,"current_status_code":"processing"},
			{"case_id":100041,"updated":false,"current_status_code":"revoked"}]}`, w.Body.String())
		assert.Equal(t, types.CaseStatusRevoked, caseStatus(t, env.Postgres, 100041), "a status a user set must not be overwritten")

		w = serveCaseSystemStatus(env.Postgres, gabeID, "radiant",
			`{"cases":[{"case_id":100040,"status_code":"in_progress","expected_status_codes":["processing"]}]}`)
		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"cases":[{"case_id":100040,"updated":true,"current_status_code":"in_progress"}]}`, w.Body.String())
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, 100040))
	})
}

func Test_CaseSystemStatus_DisallowedChangeIsBadRequest(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		w := serveCaseSystemStatus(env.Postgres, gabeID, "radiant",
			`{"cases":[{"case_id":1,"status_code":"completed","expected_status_codes":["in_progress"]}]}`)
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func Test_CaseSystemStatus_WithoutIngestActionForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100042, types.CaseStatusSubmitted)

		w := serveCaseSystemStatus(env.Postgres, wendyID, "radiant",
			`{"cases":[{"case_id":100042,"status_code":"processing","expected_status_codes":["submitted"]}]}`)
		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Equal(t, types.CaseStatusSubmitted, caseStatus(t, env.Postgres, 100042))
	})
}

func Test_CaseSystemStatus_IngestorAtAnotherLabForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100043, types.CaseStatusSubmitted)
		userID := seedIngestorAt(t, env.Postgres, "CHOP")

		w := serveCaseSystemStatus(env.Postgres, userID, "radiant",
			`{"cases":[{"case_id":100043,"status_code":"processing","expected_status_codes":["submitted"]}]}`)
		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Equal(t, types.CaseStatusSubmitted, caseStatus(t, env.Postgres, 100043))
	})
}

func Test_CaseSystemStatus_CaseOutsideTheTenantRefusesTheRequest(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100044, types.CaseStatusSubmitted)

		w := serveCaseSystemStatus(env.Postgres, gabeID, "radiant", `{"cases":[
			{"case_id":100044,"status_code":"processing","expected_status_codes":["submitted"]},
			{"case_id":999999,"status_code":"processing","expected_status_codes":["submitted"]}]}`)
		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Equal(t, types.CaseStatusSubmitted, caseStatus(t, env.Postgres, 100044), "no case of a refused request may be changed")
	})
}
