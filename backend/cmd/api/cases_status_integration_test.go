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

// Integration tests for PATCH /:tenant/cases/status as wired in main.go: the per-change gate
// (can_ingest_data for a change involving a system status, can_edit_case for any other, each at
// its case's lab), then the conditional status update.
//
// gabe holds can_ingest_data at '*' but not can_edit_case; wendy holds can_edit_case at '*' but
// not can_ingest_data; alice holds can_edit_case at CHOP only. The seeded cases are at LDM-CHUSJ.

func serveCasesStatus(db *gorm.DB, userID, tenant, body string) *httptest.ResponseRecorder {
	authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: db})
	casesRepo := postgres.NewCasesRepository(database.PostgresDB{DB: db})
	auth := &testutils.MockAuth{Id: userID}

	router := gin.New()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
	tenantRoutes.PATCH("/cases/status",
		server.RequireCaseStatusChangeActions(auth, authRepo),
		server.PatchCasesStatusHandler(casesRepo))

	req, _ := http.NewRequest(http.MethodPatch, "/"+tenant+"/cases/status", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_CasesStatus_PipelineMovesCasesThroughProcessing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100040, types.CaseStatusSubmitted)
		seedCase(t, env.Postgres, 100041, types.CaseStatusRevoked)

		w := serveCasesStatus(env.Postgres, gabeID, "radiant", `{"cases":[
			{"case_id":100040,"status_code":"processing","expected_status_codes":["submitted"]},
			{"case_id":100041,"status_code":"processing","expected_status_codes":["submitted"]}]}`)
		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"cases":[
			{"case_id":100040,"updated":true,"current_status_code":"processing"},
			{"case_id":100041,"updated":false,"current_status_code":"revoked"}]}`, w.Body.String())
		assert.Equal(t, types.CaseStatusRevoked, caseStatus(t, env.Postgres, 100041), "a status a user set must not be overwritten")

		w = serveCasesStatus(env.Postgres, gabeID, "radiant",
			`{"cases":[{"case_id":100040,"status_code":"in_progress","expected_status_codes":["processing"]}]}`)
		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"cases":[{"case_id":100040,"updated":true,"current_status_code":"in_progress"}]}`, w.Body.String())
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, 100040))
	})
}

func Test_CasesStatus_DisallowedChangeIsBadRequest(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		w := serveCasesStatus(env.Postgres, gabeID, "radiant",
			`{"cases":[{"case_id":1,"status_code":"in_progress","expected_status_codes":["submitted"]}]}`)
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func Test_CasesStatus_GeneticistSettingSystemStatusForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100042, types.CaseStatusSubmitted)

		w := serveCasesStatus(env.Postgres, wendyID, "radiant",
			`{"cases":[{"case_id":100042,"status_code":"processing","expected_status_codes":["submitted"]}]}`)
		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Equal(t, types.CaseStatusSubmitted, caseStatus(t, env.Postgres, 100042))
	})
}

func Test_CasesStatus_IngestorAtAnotherLabForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100043, types.CaseStatusSubmitted)
		userID := seedIngestorAt(t, env.Postgres, "CHOP")

		w := serveCasesStatus(env.Postgres, userID, "radiant",
			`{"cases":[{"case_id":100043,"status_code":"processing","expected_status_codes":["submitted"]}]}`)
		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Equal(t, types.CaseStatusSubmitted, caseStatus(t, env.Postgres, 100043))
	})
}

func Test_CasesStatus_CaseOutsideTheTenantRefusesTheRequest(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100044, types.CaseStatusSubmitted)

		w := serveCasesStatus(env.Postgres, gabeID, "radiant", `{"cases":[
			{"case_id":100044,"status_code":"processing","expected_status_codes":["submitted"]},
			{"case_id":999999,"status_code":"processing","expected_status_codes":["submitted"]}]}`)
		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Equal(t, types.CaseStatusSubmitted, caseStatus(t, env.Postgres, 100044), "no case of a refused request may be changed")
	})
}

func Test_CasesStatus_GeneticistAppliesUserChange(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100045, types.CaseStatusInProgress)

		w := serveCasesStatus(env.Postgres, wendyID, "radiant",
			`{"cases":[{"case_id":100045,"status_code":"in_review","expected_status_codes":["in_progress"]}]}`)
		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"cases":[{"case_id":100045,"updated":true,"current_status_code":"in_review"}]}`, w.Body.String())
		assert.Equal(t, types.CaseStatusInReview, caseStatus(t, env.Postgres, 100045))
	})
}

func Test_CasesStatus_GeneticistLeavingProcessingForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100046, types.CaseStatusProcessing)

		w := serveCasesStatus(env.Postgres, wendyID, "radiant",
			`{"cases":[{"case_id":100046,"status_code":"in_progress","expected_status_codes":["processing"]}]}`)
		assert.Equal(t, http.StatusForbidden, w.Code, "processing -> in_progress is the pipeline's change")
		assert.Equal(t, types.CaseStatusProcessing, caseStatus(t, env.Postgres, 100046))
	})
}

func Test_CasesStatus_MixedRequestWithoutIngestChangesNothing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100047, types.CaseStatusInProgress)
		seedCase(t, env.Postgres, 100048, types.CaseStatusSubmitted)

		w := serveCasesStatus(env.Postgres, wendyID, "radiant", `{"cases":[
			{"case_id":100047,"status_code":"in_review","expected_status_codes":["in_progress"]},
			{"case_id":100048,"status_code":"processing","expected_status_codes":["submitted"]}]}`)
		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, 100047), "the allowed user change must not be applied either")
		assert.Equal(t, types.CaseStatusSubmitted, caseStatus(t, env.Postgres, 100048))
	})
}

func Test_CasesStatus_IngestorApplyingUserChangeForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100049, types.CaseStatusInProgress)

		w := serveCasesStatus(env.Postgres, gabeID, "radiant",
			`{"cases":[{"case_id":100049,"status_code":"completed","expected_status_codes":["in_progress"]}]}`)
		assert.Equal(t, http.StatusForbidden, w.Code, "the pipeline's grant must not let it make a geneticist's change")
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, 100049))
	})
}

func Test_CasesStatus_EditorAtAnotherLabForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seedCase(t, env.Postgres, 100050, types.CaseStatusInProgress)

		w := serveCasesStatus(env.Postgres, aliceID, "radiant",
			`{"cases":[{"case_id":100050,"status_code":"in_review","expected_status_codes":["in_progress"]}]}`)
		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, 100050))
	})
}
