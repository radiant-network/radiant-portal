package server

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

// mockUserID stands in for a Keycloak sub (uuid). These tests use a stubbed repo, so the
// value isn't looked up — it just needs to be a realistic user_id.
const mockUserID = "25286548-fbef-4e93-b3c4-c659e6169396"

// tenantTestRouter wires RequireTenantAccess in front of a handler that echoes the resolved
// tenant, so tests can assert both the gate's status code and what it stored in context.
func tenantTestRouter(repo *mockAuthRepository, auth *testutils.MockAuth, enforce bool) *gin.Engine {
	router := gin.New()
	tenantGroup := router.Group("/:tenant")
	tenantGroup.Use(RequireTenantAccess(auth, repo, enforce))
	tenantGroup.GET("/cases/filters", func(c *gin.Context) {
		tenant, err := GetTenant(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"tenant": *tenant})
	})
	return router
}

func Test_RequireTenantAccess_Member_PassesAndSetsContext(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := tenantTestRouter(repo, auth, true)

	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"tenant":"radiant"}`, w.Body.String())
}

func Test_RequireTenantAccess_NonMember_Returns403(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: false}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := tenantTestRouter(repo, auth, true)

	req, _ := http.NewRequest("GET", "/tenant_b/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_RequireTenantAccess_TokenError_Returns401(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true}
	auth := &testutils.MockAuth{Error: fmt.Errorf("no token")}
	router := tenantTestRouter(repo, auth, true)

	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func Test_RequireTenantAccess_RepoError_Returns500(t *testing.T) {
	repo := &mockAuthRepository{tenantErr: fmt.Errorf("db down")}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := tenantTestRouter(repo, auth, true)

	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

// With enforcement off, a non-member still passes and the tenant is stored in context. The
// repo is rigged to error to prove the membership check is skipped entirely (no lockout
// before users are backfilled).
func Test_RequireTenantAccess_EnforcementDisabled_AllowsAndSetsContext(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: false, tenantErr: fmt.Errorf("must not be called")}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := tenantTestRouter(repo, auth, false)

	req, _ := http.NewRequest("GET", "/tenant_b/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"tenant":"tenant_b"}`, w.Body.String())
}

// actionTestRouter wires RequireTenantAccess then RequireAction (the production order) in
// front of a handler that returns 200, so tests exercise the action gate with a resolved tenant.
func actionTestRouter(repo *mockAuthRepository, auth *testutils.MockAuth, action string, enforce bool) *gin.Engine {
	router := gin.New()
	tenantGroup := router.Group("/:tenant")
	tenantGroup.Use(RequireTenantAccess(auth, repo, enforce))
	tenantGroup.GET("/cases/filters", RequireAction(auth, repo, action, enforce), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	return router
}

func doActionRequest(router *gin.Engine) *httptest.ResponseRecorder {
	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_RequireAction_HasAction_Allows(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(actionTestRouter(repo, auth, types.ActionSearchCase, true))

	assert.Equal(t, http.StatusOK, w.Code)
}

func Test_RequireAction_LacksAction_Returns403(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: false}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(actionTestRouter(repo, auth, types.ActionInterpretVariant, true))

	assert.Equal(t, http.StatusForbidden, w.Code)
	// The body must NOT name the missing action (no permission-model disclosure).
	assert.NotContains(t, w.Body.String(), types.ActionInterpretVariant)
}

func Test_RequireAction_RepoError_Returns500(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, actionErr: fmt.Errorf("db down")}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(actionTestRouter(repo, auth, types.ActionSearchCase, true))

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_RequireAction_TokenError_Returns401(t *testing.T) {
	// Tenant access is satisfied; the action gate's own token read fails.
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	router := gin.New()
	tenantGroup := router.Group("/:tenant")
	tenantGroup.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	tenantGroup.GET("/cases/filters", RequireAction(&testutils.MockAuth{Error: fmt.Errorf("no token")}, repo, types.ActionSearchCase, true), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	w := doActionRequest(router)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func Test_RequireAction_NoTenantInContext_Returns500(t *testing.T) {
	// RequireAction registered without RequireTenantAccess in front → GetTenant errors, and
	// the gate must fail closed (500), never fall through to the handler.
	repo := &mockAuthRepository{hasAction: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := gin.New()
	router.GET("/cases/filters", RequireAction(auth, repo, types.ActionSearchCase, true), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	req, _ := http.NewRequest("GET", "/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

// With enforcement off the action gate allows even when the grant is absent. The repo is
// rigged to error to prove HasAction is never called (no lockout before backfill).
func Test_RequireAction_EnforcementDisabled_Allows(t *testing.T) {
	repo := &mockAuthRepository{actionErr: fmt.Errorf("must not be called")}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(actionTestRouter(repo, auth, types.ActionSearchCase, false))

	assert.Equal(t, http.StatusOK, w.Code)
}

func Test_RequireAction_PassesResolvedOrgToChecker(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	doActionRequest(actionTestRouter(repo, auth, types.ActionFlagVariant, true))

	assert.Equal(t, WildcardOnlyOrg, repo.gotOrgCode)
	assert.Equal(t, types.ActionFlagVariant, repo.gotAction)
}

func Test_resolveOrgCode_ReturnsWildcardOnly(t *testing.T) {
	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	org, err := resolveOrgCode(c)

	assert.NoError(t, err)
	assert.Equal(t, WildcardOnlyOrg, org)
}
