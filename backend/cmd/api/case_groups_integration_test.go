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
	"github.com/stretchr/testify/require"
)

// caseGroupsRouter mirrors the /:tenant/case_groups wiring of setupRouter: tenant membership, then
// can_ingest_data in-tenant to write (gabe: data_manager '*') and can_search_case to read (mike: member).
func caseGroupsRouter(env *testutils.Env, userID string) *gin.Engine {
	pg := database.PostgresDB{DB: env.Postgres}
	authRepo := postgres.NewAuthRepository(pg)
	repo := postgres.NewCaseGroupsRepository(pg)
	auth := &testutils.MockAuth{Id: userID}

	router := gin.New()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
	tenantRoutes.POST("/case_groups", server.RequireActionInTenant(auth, authRepo, types.ActionIngestData), server.PostCaseGroupHandler(repo, auth))
	tenantRoutes.GET("/case_groups/:name", server.RequireAction(auth, authRepo, types.ActionSearchCase), server.GetCaseGroupHandler(repo))
	return router
}

func serve(router *gin.Engine, method, path, body string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func trackCaseGroup(t *testing.T, env *testutils.Env, name string) {
	t.Helper()
	t.Cleanup(func() { env.Postgres.Exec("DELETE FROM case_group WHERE tenant_code = 'radiant' AND name = ?", name) })
}

// Seeded cases 1 and 2 exist in tenant radiant (test/data/clinical/03_cases.sql).

func Test_PostCaseGroup_DataManager_CreatesAndReturnsSortedIds(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		trackCaseGroup(t, env, "it_cg_create")
		router := caseGroupsRouter(env, gabeID)

		w := serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_create","case_ids":[2,1]}`)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"name":"it_cg_create","tenant_code":"radiant","case_ids":[1,2]}`, w.Body.String())
	})
}

func Test_PostCaseGroup_SameName_Overwrites(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		trackCaseGroup(t, env, "it_cg_overwrite")
		router := caseGroupsRouter(env, gabeID)

		require.Equal(t, http.StatusOK, serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_overwrite","case_ids":[1,2]}`).Code)
		w := serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_overwrite","case_ids":[2]}`)
		assert.Equal(t, http.StatusOK, w.Code)

		// data_manager alone does not carry can_search_case; reads go through a member.
		got := serve(caseGroupsRouter(env, mikeID), "GET", "/radiant/case_groups/it_cg_overwrite", "")
		assert.Equal(t, http.StatusOK, got.Code)
		assert.JSONEq(t, `{"name":"it_cg_overwrite","tenant_code":"radiant","case_ids":[2]}`, got.Body.String())
	})
}

func Test_PostCaseGroup_UnknownCase_400(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		trackCaseGroup(t, env, "it_cg_unknown")
		router := caseGroupsRouter(env, gabeID)

		w := serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_unknown","case_ids":[1,999999]}`)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		assert.JSONEq(t, `{"status":400,"message":"unknown case ids in this tenant: [999999]"}`, w.Body.String())
		assert.Equal(t, http.StatusNotFound, serve(caseGroupsRouter(env, mikeID), "GET", "/radiant/case_groups/it_cg_unknown", "").Code)
	})
}

func Test_PostCaseGroup_Member_Forbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router := caseGroupsRouter(env, mikeID)

		w := serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_forbidden","case_ids":[1]}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
	})
}

func Test_GetCaseGroup_Member_CanRead(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		trackCaseGroup(t, env, "it_cg_member_read")
		require.Equal(t, http.StatusOK, serve(caseGroupsRouter(env, gabeID), "POST", "/radiant/case_groups", `{"name":"it_cg_member_read","case_ids":[1]}`).Code)

		w := serve(caseGroupsRouter(env, mikeID), "GET", "/radiant/case_groups/it_cg_member_read", "")

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"name":"it_cg_member_read","tenant_code":"radiant","case_ids":[1]}`, w.Body.String())
	})
}

func Test_GetCaseGroup_Unknown_404(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router := caseGroupsRouter(env, mikeID)

		w := serve(router, "GET", "/radiant/case_groups/it_cg_missing", "")

		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.JSONEq(t, `{"status":404,"message":"case group not found"}`, w.Body.String())
	})
}

func Test_GetCaseGroup_DataManagerWithoutSearch_Forbidden(t *testing.T) {
	// gabe holds data_manager only: can_ingest_data, no can_search_case → 403 on the read.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		assert.Equal(t, http.StatusForbidden, serve(caseGroupsRouter(env, gabeID), "GET", "/radiant/case_groups/whatever", "").Code)
	})
}

func Test_GetCaseGroup_CrossTenant_Forbidden(t *testing.T) {
	// mike has no grant in tenant_b → RequireTenantAccess rejects before the handler runs.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router := caseGroupsRouter(env, mikeID)

		assert.Equal(t, http.StatusForbidden, serve(router, "GET", "/tenant_b/case_groups/it_cg_create", "").Code)
	})
}
