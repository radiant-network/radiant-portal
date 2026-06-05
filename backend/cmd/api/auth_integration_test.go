package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func assertGetMeHandler(t *testing.T, email string, expected string) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewAuthRepository(env.Postgres)
		auth := &testutils.MockAuth{Email: email}

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
	assertGetMeHandler(t, "alice@test.authz", `[{
		"code": "radiant",
		"name": "Radiant",
		"tenant_actions": ["can_search_case", "can_view_kb"],
		"orgs_by_action": {
			"can_interpret_variant": ["CHOP"],
			"can_read_pii": ["CHOP"]
		}
	}]`)
}

func Test_GetMeHandler_UserWithoutGrants(t *testing.T) {
	assertGetMeHandler(t, "nobody@test.authz", `[]`)
}

// assertTenantAccess wires the real AuthRepository behind RequireTenantAccess and requests a
// tenant-scoped route as the given user, returning the resulting status code.
func assertTenantAccess(t *testing.T, email, tenant string, enforce bool, expectedStatus int) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewAuthRepository(env.Postgres)
		auth := &testutils.MockAuth{Email: email}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, repo, enforce))
		tenantRoutes.GET("/cases/filters", func(c *gin.Context) { c.Status(http.StatusOK) })

		req, _ := http.NewRequest("GET", "/"+tenant+"/cases/filters", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, expectedStatus, w.Code)
	})
}

func Test_RequireTenantAccess_Member_Allowed(t *testing.T) {
	// alice holds roles in radiant.
	assertTenantAccess(t, "alice@test.authz", "radiant", true, http.StatusOK)
}

func Test_RequireTenantAccess_CrossTenant_Forbidden(t *testing.T) {
	// alice has no grant in tenant_b → cross-tenant access is rejected.
	assertTenantAccess(t, "alice@test.authz", "tenant_b", true, http.StatusForbidden)
}

func Test_RequireTenantAccess_EnforcementDisabled_AllowsCrossTenant(t *testing.T) {
	// With enforcement off, even a non-member reaches the handler (no day-1 lockout).
	assertTenantAccess(t, "alice@test.authz", "tenant_b", false, http.StatusOK)
}
