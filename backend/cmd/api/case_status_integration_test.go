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
	"gorm.io/gorm"
)

func seedCaseForStatus(t *testing.T, db *gorm.DB, caseID int, status string) {
	t.Helper()
	repo := postgres.NewCasesRepository(database.PostgresDB{DB: db})
	diagLab := "CQGC"
	orgCode := "CHUSJ"
	require.NoError(t, repo.CreateCase(t.Context(), &types.Case{
		ID:                       caseID,
		ProbandID:                1,
		ProjectID:                1,
		StatusCode:               status,
		DiagnosisLabCode:         &diagLab,
		OrderingOrganizationCode: &orgCode,
		AnalysisCatalogID:        1,
		PriorityCode:             "routine",
		CaseTypeCode:             "germline",
		CaseCategoryCode:         "postnatal",
		SubmitterCaseID:          fmt.Sprintf("status-endpoint-%d", caseID),
		TenantCode:               types.DefaultTenantCode,
	}))
	t.Cleanup(func() { db.Exec("DELETE FROM cases WHERE id = ?", caseID) })
}

func caseStatus(t *testing.T, db *gorm.DB, caseID int) string {
	t.Helper()
	var status string
	require.NoError(t, db.Table("cases").Select("status_code").Where("id = ?", caseID).Scan(&status).Error)
	return status
}

func servePatchStatus(db *gorm.DB, userID, tenant string, caseID int, body string) *httptest.ResponseRecorder {
	authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: db})
	casesRepo := postgres.NewCasesRepository(database.PostgresDB{DB: db})
	auth := &testutils.MockAuth{Id: userID}

	router := gin.New()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
	tenantRoutes.PATCH("/cases/:case_id/status",
		server.RequireActionAt(auth, authRepo, types.ActionEditCase, server.OrgFromCaseParam(authRepo)),
		server.PatchCaseStatusHandler(casesRepo))

	req, _ := http.NewRequest("PATCH", fmt.Sprintf("/%s/cases/%d/status", tenant, caseID), strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_PatchCaseStatus_LegalTransitionIsPersisted(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100030
		seedCaseForStatus(t, env.Postgres, caseID, types.CaseStatusInProgress)

		w := servePatchStatus(env.Postgres, wendyID, "radiant", caseID, `{"status_code":"in_review"}`)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, fmt.Sprintf(`{"case_id":%d,"status_code":"in_review"}`, caseID), w.Body.String())
		assert.Equal(t, types.CaseStatusInReview, caseStatus(t, env.Postgres, caseID))
	})
}

func Test_PatchCaseStatus_AnyOrderIsAccepted(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100031
		seedCaseForStatus(t, env.Postgres, caseID, types.CaseStatusInProgress)

		for _, status := range types.UserAppliedCaseStatuses {
			w := servePatchStatus(env.Postgres, wendyID, "radiant", caseID, fmt.Sprintf(`{"status_code":%q}`, status))
			assert.Equalf(t, http.StatusOK, w.Code, "status %q was refused", status)
			assert.Equal(t, status, caseStatus(t, env.Postgres, caseID))
		}
	})
}

func Test_PatchCaseStatus_SystemAppliedStatusesRejected(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100032
		seedCaseForStatus(t, env.Postgres, caseID, types.CaseStatusInProgress)

		for _, status := range types.SystemAppliedCaseStatuses {
			w := servePatchStatus(env.Postgres, wendyID, "radiant", caseID, fmt.Sprintf(`{"status_code":%q}`, status))
			assert.Equalf(t, http.StatusBadRequest, w.Code, "status %q was accepted from a user", status)
			assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID), "a refused status must leave the case untouched")
		}
	})
}

func Test_PatchCaseStatus_UnknownStatusRejected(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100033
		seedCaseForStatus(t, env.Postgres, caseID, types.CaseStatusInProgress)

		for _, status := range []string{"archived", "draft", ""} {
			w := servePatchStatus(env.Postgres, wendyID, "radiant", caseID, fmt.Sprintf(`{"status_code":%q}`, status))
			assert.Equalf(t, http.StatusBadRequest, w.Code, "status %q was accepted", status)
			assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID))
		}
	})
}

func Test_PatchCaseStatus_WithoutEditActionForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100034
		seedCaseForStatus(t, env.Postgres, caseID, types.CaseStatusInProgress)

		// mike is a plain member: the denial is the generic 403, never naming can_edit_case.
		w := servePatchStatus(env.Postgres, mikeID, "radiant", caseID, `{"status_code":"in_review"}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.JSONEq(t, `{"status":403,"message":"Forbidden"}`, w.Body.String())
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID))
	})
}

func Test_PatchCaseStatus_GranteeAtAnotherLabForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100035
		seedCaseForStatus(t, env.Postgres, caseID, types.CaseStatusInProgress)

		// alice holds can_edit_case, but at CHOP the case's diagnosis lab is CQGC.
		w := servePatchStatus(env.Postgres, aliceID, "radiant", caseID, `{"status_code":"in_review"}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID))
	})
}

func Test_PatchCaseStatus_CrossTenantCaseDeniedAndUnchanged(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100036
		seedCaseForStatus(t, env.Postgres, caseID, types.CaseStatusInProgress)

		w := servePatchStatus(env.Postgres, carolID, "tenant_b", caseID, `{"status_code":"revoked"}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.JSONEq(t, `{"status":403,"message":"Forbidden"}`, w.Body.String())
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID), "another tenant must not move a radiant case")
	})
}

func Test_PatchCaseStatus_UnknownCaseDenied(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Not a 404: the gate cannot resolve an org for a case that does not exist, and it
		// denies with the same generic 403 as a missing grant so it is not an existence oracle.
		w := servePatchStatus(env.Postgres, wendyID, "radiant", 999999, `{"status_code":"in_review"}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
	})
}
