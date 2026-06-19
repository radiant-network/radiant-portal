package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

// user_id (Keycloak sub) values matching the seeded auth fixtures (test/data/auth/05_users.sql).
// nobodyID has no rows, to exercise the no-grants path.
const (
	aliceID  = "25286548-fbef-4e93-b3c4-c659e6169396"
	nobodyID = "c7dd9459-3b2f-4f8d-94a3-5db90a9c7091"
)

func assertGetMeHandler(t *testing.T, userID string, expected string) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewAuthRepository(env.Postgres)
		auth := &testutils.MockAuth{Id: userID}

		router := gin.Default()
		router.GET("/auth/me", server.GetMeHandler(repo, auth))

		req, _ := http.NewRequest("GET", "/auth/me", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetMeHandler_SeededUser(t *testing.T) {
	// alice: geneticist @ CHOP + researcher tenant-wide, in the radiant tenant.
	assertGetMeHandler(t, aliceID, `[{
		"code": "radiant",
		"name": "Radiant",
		"tenant_actions": ["can_search_case", "can_view_kb"],
		"orgs_by_action": {
			"can_comment_variant": ["CHOP"],
			"can_download_file": ["CHOP"],
			"can_flag_variant": ["CHOP"],
			"can_interpret_variant": ["CHOP"],
			"can_read_pii": ["CHOP"]
		}
	}]`)
}

func Test_GetMeHandler_UserWithoutGrants(t *testing.T) {
	assertGetMeHandler(t, nobodyID, `[]`)
}

// assertTenantAccess wires the real AuthRepository behind RequireTenantAccess and requests a
// tenant-scoped route as the given user, returning the resulting status code.
func assertTenantAccess(t *testing.T, userID, tenant string, expectedStatus int) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewAuthRepository(env.Postgres)
		auth := &testutils.MockAuth{Id: userID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, repo))
		tenantRoutes.GET("/cases/filters", func(c *gin.Context) { c.Status(http.StatusOK) })

		req, _ := http.NewRequest("GET", "/"+tenant+"/cases/filters", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, expectedStatus, w.Code)
	})
}

func Test_RequireTenantAccess_Member_Allowed(t *testing.T) {
	// alice holds roles in radiant.
	assertTenantAccess(t, aliceID, types.DefaultTenantCode, http.StatusOK)
}

func Test_RequireTenantAccess_CrossTenant_Forbidden(t *testing.T) {
	// alice has no grant in tenant_b → cross-tenant access is rejected.
	assertTenantAccess(t, aliceID, "tenant_b", http.StatusForbidden)
}
