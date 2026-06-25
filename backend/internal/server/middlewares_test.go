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
func tenantTestRouter(repo *mockAuthRepository, auth *testutils.MockAuth) *gin.Engine {
	router := gin.New()
	tenantGroup := router.Group("/:tenant")
	tenantGroup.Use(RequireTenantAccess(auth, repo))
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
	router := tenantTestRouter(repo, auth)

	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"tenant":"radiant"}`, w.Body.String())
}

// tenantSchemaRouter wires RequireTenantAccess in front of a handler that reports the schema
// the read path would resolve from the request context, so tests can assert the gated binding.
func tenantSchemaRouter(repo *mockAuthRepository, auth *testutils.MockAuth) *gin.Engine {
	router := gin.New()
	tenantGroup := router.Group("/:tenant")
	tenantGroup.Use(RequireTenantAccess(auth, repo))
	tenantGroup.GET("/cases/filters", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"schema": types.TenantSchema(c.Request.Context())})
	})
	return router
}

func Test_RequireTenantAccess_ViewsReadEnabled_BindsTenantToRequestContext(t *testing.T) {
	t.Setenv("TENANT_VIEWS_READ_ENABLED", "true")
	repo := &mockAuthRepository{hasTenantAccess: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := tenantSchemaRouter(repo, auth)

	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"schema":"radiant_tenant"}`, w.Body.String())
}

func Test_RequireTenantAccess_ViewsReadDisabled_LeavesFederationSchema(t *testing.T) {
	t.Setenv("TENANT_VIEWS_READ_ENABLED", "false")
	repo := &mockAuthRepository{hasTenantAccess: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := tenantSchemaRouter(repo, auth)

	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"schema":"radiant_jdbc.public"}`, w.Body.String())
}

func Test_RequireTenantAccess_NonMember_Returns403(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: false}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := tenantTestRouter(repo, auth)

	req, _ := http.NewRequest("GET", "/tenant_b/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_RequireTenantAccess_TokenError_Returns401(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true}
	auth := &testutils.MockAuth{Error: fmt.Errorf("no token")}
	router := tenantTestRouter(repo, auth)

	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func Test_RequireTenantAccess_RepoError_Returns500(t *testing.T) {
	repo := &mockAuthRepository{tenantErr: fmt.Errorf("db down")}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := tenantTestRouter(repo, auth)

	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

// An unknown tenant in the URL path is rejected with the same generic 403 as a cross-tenant
// denial, so the response never discloses whether a tenant exists. This also guards against
// the bad tenant_code reaching a write and surfacing as an opaque 500 from a foreign-key
// violation. The existence check runs before the membership check, so it aborts first here.
func Test_RequireTenantAccess_UnknownTenant_Returns403(t *testing.T) {
	repo := &mockAuthRepository{tenantNotFound: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := tenantTestRouter(repo, auth)

	req, _ := http.NewRequest("GET", "/nope/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_RequireTenantAccess_TenantLookupError_Returns500(t *testing.T) {
	repo := &mockAuthRepository{tenantExistsErr: fmt.Errorf("db down")}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := tenantTestRouter(repo, auth)

	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

// actionTestRouter wires RequireTenantAccess then RequireAction (the production order) in
// front of a handler that returns 200, so tests exercise the action gate with a resolved tenant.
func actionTestRouter(repo *mockAuthRepository, auth *testutils.MockAuth, action string) *gin.Engine {
	router := gin.New()
	tenantGroup := router.Group("/:tenant")
	tenantGroup.Use(RequireTenantAccess(auth, repo))
	tenantGroup.GET("/cases/filters", RequireAction(auth, repo, action), func(c *gin.Context) {
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
	w := doActionRequest(actionTestRouter(repo, auth, types.ActionSearchCase))

	assert.Equal(t, http.StatusOK, w.Code)
}

func Test_RequireAction_LacksAction_Returns403(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: false}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(actionTestRouter(repo, auth, types.ActionInterpretVariant))

	assert.Equal(t, http.StatusForbidden, w.Code)
	// The body must NOT name the missing action (no permission-model disclosure).
	assert.NotContains(t, w.Body.String(), types.ActionInterpretVariant)
}

func Test_RequireAction_RepoError_Returns500(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, actionErr: fmt.Errorf("db down")}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(actionTestRouter(repo, auth, types.ActionSearchCase))

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_RequireAction_TokenError_Returns401(t *testing.T) {
	// Tenant access is satisfied; the action gate's own token read fails.
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	router := gin.New()
	tenantGroup := router.Group("/:tenant")
	tenantGroup.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	tenantGroup.GET("/cases/filters", RequireAction(&testutils.MockAuth{Error: fmt.Errorf("no token")}, repo, types.ActionSearchCase), func(c *gin.Context) {
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
	router.GET("/cases/filters", RequireAction(auth, repo, types.ActionSearchCase), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	req, _ := http.NewRequest("GET", "/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_RequireAction_PassesResolvedOrgToChecker(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	doActionRequest(actionTestRouter(repo, auth, types.ActionFlagVariant))

	assert.Equal(t, WildcardOnlyOrg, repo.gotOrgCode)
	assert.Equal(t, types.ActionFlagVariant, repo.gotAction)
}

func Test_resolveOrgCode_ReturnsWildcardOnly(t *testing.T) {
	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	org, err := resolveOrgCode(c)

	assert.NoError(t, err)
	assert.Equal(t, WildcardOnlyOrg, org)
}
