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

// The seeded cases hang off LDM-CHUSJ. What matters is that no probe user is granted there
// specifically: wendy reaches it through her '*' grant, and alice — whose can_edit_case is at
// CHOP — does not reach it at all.
const (
	caseDiagnosisLab = "LDM-CHUSJ"
	caseOrderingOrg  = "UCSF"
)

func seedCase(t *testing.T, db *gorm.DB, caseID int, status string) {
	t.Helper()
	repo := postgres.NewCasesRepository(database.PostgresDB{DB: db})
	diagLab := caseDiagnosisLab
	orgCode := caseOrderingOrg
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
		SubmitterCaseID:          fmt.Sprintf("case-patch-%d", caseID),
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

// servePatchCase mirrors the production wiring: RequireTenantAccess, then the org-scoped
// can_edit_case gate resolving the case's diagnosis lab, then the handler.
func servePatchCase(db *gorm.DB, userID, tenant string, caseID int, body string) *httptest.ResponseRecorder {
	authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: db})
	casesRepo := postgres.NewCasesRepository(database.PostgresDB{DB: db})
	auth := &testutils.MockAuth{Id: userID}

	router := gin.New()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
	tenantRoutes.PATCH("/cases/:case_id",
		server.RequireActionAt(auth, authRepo, types.ActionEditCase, server.OrgFromCaseParam(authRepo)),
		server.PatchCaseHandler(casesRepo))

	req, _ := http.NewRequest("PATCH", fmt.Sprintf("/%s/cases/%d", tenant, caseID), strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_PatchCase_LegalTransitionIsPersisted(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100030
		seedCase(t, env.Postgres, caseID, types.CaseStatusInProgress)

		w := servePatchCase(env.Postgres, wendyID, "radiant", caseID, `{"status_code":"in_review"}`)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Empty(t, w.Body.String(), "a successful patch answers 200 with no body")
		assert.Equal(t, types.CaseStatusInReview, caseStatus(t, env.Postgres, caseID))
	})
}

// Statuses are saved in any order — the closure sub-statuses and a reopen are all one PATCH away
// from each other, with no state machine in between.
func Test_PatchCase_AnyOrderIsAccepted(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100031
		seedCase(t, env.Postgres, caseID, types.CaseStatusInProgress)

		for _, status := range types.UserAppliedCaseStatuses {
			w := servePatchCase(env.Postgres, wendyID, "radiant", caseID, fmt.Sprintf(`{"status_code":%q}`, status))
			assert.Equalf(t, http.StatusOK, w.Code, "status %q was refused", status)
			assert.Equal(t, status, caseStatus(t, env.Postgres, caseID))
		}
	})
}

func Test_PatchCase_SystemAppliedStatusesRejected(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100032
		seedCase(t, env.Postgres, caseID, types.CaseStatusInProgress)

		for _, status := range types.SystemAppliedCaseStatuses {
			w := servePatchCase(env.Postgres, wendyID, "radiant", caseID, fmt.Sprintf(`{"status_code":%q}`, status))
			assert.Equalf(t, http.StatusBadRequest, w.Code, "status %q was accepted from a user", status)
			assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID), "a refused status must leave the case untouched")
		}
	})
}

func Test_PatchCase_UnknownStatusRejected(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100033
		seedCase(t, env.Postgres, caseID, types.CaseStatusInProgress)

		for _, status := range []string{"archived", ""} {
			w := servePatchCase(env.Postgres, wendyID, "radiant", caseID, fmt.Sprintf(`{"status_code":%q}`, status))
			assert.Equalf(t, http.StatusBadRequest, w.Code, "status %q was accepted", status)
			assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID))
		}
	})
}

// A body naming no patchable field is refused rather than written as a no-op.
func Test_PatchCase_EmptyPatchRejected(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100037
		seedCase(t, env.Postgres, caseID, types.CaseStatusInProgress)

		w := servePatchCase(env.Postgres, wendyID, "radiant", caseID, `{}`)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID))
	})
}

func Test_PatchCase_WithoutEditActionForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100034
		seedCase(t, env.Postgres, caseID, types.CaseStatusInProgress)

		// mike is a plain member: the denial is the generic 403, never naming can_edit_case.
		w := servePatchCase(env.Postgres, mikeID, "radiant", caseID, `{"status_code":"in_review"}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.JSONEq(t, `{"status":403,"message":"Forbidden"}`, w.Body.String())
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID))
	})
}

func Test_PatchCase_GranteeAtAnotherLabForbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100035
		seedCase(t, env.Postgres, caseID, types.CaseStatusInProgress)

		// alice holds can_edit_case, but at CHOP — the case's diagnosis lab is LDM-CHUSJ.
		w := servePatchCase(env.Postgres, aliceID, "radiant", caseID, `{"status_code":"in_review"}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID))
	})
}

// A case in another tenant is unreachable twice over: the gate cannot attribute it to an org of
// the tenant in the path, and the repository's tenant scope would not match it either
// (Test_PatchCase_CrossTenantCaseIsNotFoundAndUnchanged). The gate answers first, so the
// response is the generic 403 rather than the repository's 404 — neither discloses the case.
func Test_PatchCase_CrossTenantCaseDeniedAndUnchanged(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		const caseID = 100036
		seedCase(t, env.Postgres, caseID, types.CaseStatusInProgress)

		w := servePatchCase(env.Postgres, carolID, "tenant_b", caseID, `{"status_code":"revoked"}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.JSONEq(t, `{"status":403,"message":"Forbidden"}`, w.Body.String())
		assert.Equal(t, types.CaseStatusInProgress, caseStatus(t, env.Postgres, caseID), "another tenant must not move a radiant case")
	})
}

func Test_PatchCase_UnknownCaseDenied(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Not a 404: the gate cannot resolve an org for a case that does not exist, and it
		// denies with the same generic 403 as a missing grant so it is not an existence oracle.
		w := servePatchCase(env.Postgres, wendyID, "radiant", 999999, `{"status_code":"in_review"}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
	})
}
