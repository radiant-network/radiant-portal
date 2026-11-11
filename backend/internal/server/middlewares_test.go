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

// anyActionTestRouter is actionTestRouter's RequireAnyAction twin: the caller needs any one of
// the actions.
func anyActionTestRouter(repo *mockAuthRepository, auth *testutils.MockAuth, actions ...string) *gin.Engine {
	router := gin.New()
	tenantGroup := router.Group("/:tenant")
	tenantGroup.Use(RequireTenantAccess(auth, repo))
	tenantGroup.GET("/cases/filters", RequireAnyAction(auth, repo, actions...), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	return router
}

func Test_RequireAnyAction_HoldsSecondAction_Allows(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, actionsHeld: map[string]bool{
		types.ActionManageUser: true,
	}}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(anyActionTestRouter(repo, auth, types.ActionManageRole, types.ActionManageUser))

	assert.Equal(t, http.StatusOK, w.Code)
}

func Test_RequireAnyAction_HoldsFirstAction_SkipsTheRest(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, actionsHeld: map[string]bool{
		types.ActionManageRole: true,
	}}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(anyActionTestRouter(repo, auth, types.ActionManageRole, types.ActionManageUser))

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, []string{types.ActionManageRole}, repo.gotActions, "a hit must not cost a second query")
}

func Test_RequireAnyAction_HoldsNoAction_Returns403(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, actionsHeld: map[string]bool{}}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(anyActionTestRouter(repo, auth, types.ActionManageRole, types.ActionManageUser))

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Equal(t, []string{types.ActionManageRole, types.ActionManageUser}, repo.gotActions)
	// The body must NOT name the missing actions (no permission-model disclosure).
	assert.NotContains(t, w.Body.String(), types.ActionManageRole)
	assert.NotContains(t, w.Body.String(), types.ActionManageUser)
}

func Test_RequireAnyAction_RepoError_Returns500(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, actionErr: fmt.Errorf("db down")}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(anyActionTestRouter(repo, auth, types.ActionManageRole, types.ActionManageUser))

	assert.Equal(t, http.StatusInternalServerError, w.Code)
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

func Test_RequireAction_PassesTenantWideOrgToChecker(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	doActionRequest(actionTestRouter(repo, auth, types.ActionSearchCase))

	assert.Equal(t, TenantWideOrg, repo.gotOrgCode)
	assert.Equal(t, types.ActionSearchCase, repo.gotAction)
}

func Test_tenantWideOrg_ResolvesToTheEmptyOrgOnly(t *testing.T) {
	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	orgs, err := tenantWideOrg(c)

	assert.NoError(t, err)
	assert.Equal(t, []string{TenantWideOrg}, orgs)
}

// --- RequireActionAtEvery ----------------------------------------------------------------

const (
	labA = "CQGC"
	labB = "CHUSJ"
)

// everyActionTestRouter wires RequireActionAtEvery over a fixed set of orgs, standing in for
// the case-batch resolver. The handler echoes what the gate stored in context.
func everyActionTestRouter(repo *mockAuthRepository, auth *testutils.MockAuth, action string, orgs []string, resolveErr error) *gin.Engine {
	resolve := func(c *gin.Context) ([]string, error) { return orgs, resolveErr }

	router := gin.New()
	tenantGroup := router.Group("/:tenant")
	tenantGroup.Use(RequireTenantAccess(auth, repo))
	tenantGroup.GET("/cases/filters", RequireActionAtEvery(auth, repo, action, resolve), func(c *gin.Context) {
		authorized, _ := GetAuthorizedOrgs(c)
		c.JSON(http.StatusOK, gin.H{"orgs": authorized})
	})
	return router
}

func Test_RequireActionAtEvery_HoldsActionAtEveryOrg_Allows(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, orgsHeld: map[string]bool{labA: true, labB: true}}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(everyActionTestRouter(repo, auth, types.ActionIngestData, []string{labA, labB}, nil))

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, []string{labA, labB}, repo.gotOrgCodes, "every resolved org is checked")
	assert.Contains(t, w.Body.String(), labB, "the resolved orgs are left in context for the handler")
}

func Test_RequireActionAtEvery_LacksActionAtOneOrg_Returns403(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, orgsHeld: map[string]bool{labA: true, labB: false}}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(everyActionTestRouter(repo, auth, types.ActionIngestData, []string{labA, labB}, nil))

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.NotContains(t, w.Body.String(), types.ActionIngestData, "the body must not name the missing action")
}

// The all-of quantifier is the whole point of this gate: the same inputs that admit a caller
// under RequireActionAt (any-of) must refuse them here.
func Test_RequireActionAtEvery_DiffersFromRequireActionAt_OnTheSameOrgs(t *testing.T) {
	orgs := []string{labA, labB}
	held := map[string]bool{labA: true, labB: false}
	resolve := func(c *gin.Context) ([]string, error) { return orgs, nil }

	route := func(gate func(*mockAuthRepository, *testutils.MockAuth) gin.HandlerFunc) int {
		repo := &mockAuthRepository{hasTenantAccess: true, orgsHeld: held}
		auth := &testutils.MockAuth{Id: mockUserID}
		router := gin.New()
		tenantGroup := router.Group("/:tenant")
		tenantGroup.Use(RequireTenantAccess(auth, repo))
		tenantGroup.GET("/cases/filters", gate(repo, auth), func(c *gin.Context) { c.Status(http.StatusOK) })
		return doActionRequest(router).Code
	}

	anyOf := route(func(repo *mockAuthRepository, auth *testutils.MockAuth) gin.HandlerFunc {
		return RequireActionAt(auth, repo, types.ActionIngestData, resolve)
	})
	everyOf := route(func(repo *mockAuthRepository, auth *testutils.MockAuth) gin.HandlerFunc {
		return RequireActionAtEvery(auth, repo, types.ActionIngestData, resolve)
	})

	assert.Equal(t, http.StatusOK, anyOf, "any-of admits a caller holding the action at one of the orgs")
	assert.Equal(t, http.StatusForbidden, everyOf, "all-of refuses the same caller")
}

func Test_RequireActionAtEvery_StopsAtTheFirstDenial(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, orgsHeld: map[string]bool{labA: false, labB: true}}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(everyActionTestRouter(repo, auth, types.ActionIngestData, []string{labA, labB}, nil))

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Equal(t, []string{labA}, repo.gotOrgCodes, "a denial ends the loop; the rest are not queried")
}

func Test_RequireActionAtEvery_NoOrgResolved_Returns403(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(everyActionTestRouter(repo, auth, types.ActionIngestData, nil, nil))

	assert.Equal(t, http.StatusForbidden, w.Code, "an unattributable request is denied, never vacuously allowed")
	assert.Empty(t, repo.gotOrgCodes, "with nothing to check against, the action is not queried at all")
}

func Test_RequireActionAtEvery_ResolverError_Returns500(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(everyActionTestRouter(repo, auth, types.ActionIngestData, nil, fmt.Errorf("boom")))

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_RequireActionAtEvery_RepoError_Returns500(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, actionErr: fmt.Errorf("boom")}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(everyActionTestRouter(repo, auth, types.ActionIngestData, []string{labA}, nil))

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_RequireActionAtEvery_TokenError_Returns401(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	// RequireTenantAccess is bypassed so the gate itself is what meets the token error.
	router := gin.New()
	router.GET("/:tenant/cases/filters",
		func(c *gin.Context) { c.Set(TenantContextKey, "radiant") },
		RequireActionAtEvery(&testutils.MockAuth{Error: fmt.Errorf("no token")}, repo, types.ActionIngestData,
			func(c *gin.Context) ([]string, error) { return []string{labA}, nil }),
		func(c *gin.Context) { c.Status(http.StatusOK) })

	assert.Equal(t, http.StatusUnauthorized, doActionRequest(router).Code)
}

func Test_RequireActionAtEvery_NoTenantInContext_Returns500(t *testing.T) {
	repo := &mockAuthRepository{hasAction: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := gin.New()
	router.GET("/:tenant/cases/filters",
		RequireActionAtEvery(auth, repo, types.ActionIngestData,
			func(c *gin.Context) ([]string, error) { return []string{labA}, nil }),
		func(c *gin.Context) { c.Status(http.StatusOK) })

	assert.Equal(t, http.StatusInternalServerError, doActionRequest(router).Code)
}

// --- RequireActionInTenant ---------------------------------------------------------------

func inTenantActionTestRouter(repo *mockAuthRepository, auth *testutils.MockAuth, action string) *gin.Engine {
	router := gin.New()
	tenantGroup := router.Group("/:tenant")
	tenantGroup.Use(RequireTenantAccess(auth, repo))
	tenantGroup.GET("/cases/filters", RequireActionInTenant(auth, repo, action), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	return router
}

func Test_RequireActionInTenant_HoldsAction_Allows(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(inTenantActionTestRouter(repo, auth, types.ActionIngestData))

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, repo.gotOrgCodes, "the org is never consulted, so HasAction is not the query used")
}

func Test_RequireActionInTenant_LacksAction_Returns403(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: false}
	auth := &testutils.MockAuth{Id: mockUserID}
	w := doActionRequest(inTenantActionTestRouter(repo, auth, types.ActionIngestData))

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.NotContains(t, w.Body.String(), types.ActionIngestData, "the body must not name the missing action")
}

func Test_RequireActionInTenant_RepoError_Returns500(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, actionErr: fmt.Errorf("boom")}
	auth := &testutils.MockAuth{Id: mockUserID}

	assert.Equal(t, http.StatusInternalServerError, doActionRequest(inTenantActionTestRouter(repo, auth, types.ActionIngestData)).Code)
}

func Test_RequireActionInTenant_TokenError_Returns401(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: true, hasAction: true}
	router := gin.New()
	router.GET("/:tenant/cases/filters",
		func(c *gin.Context) { c.Set(TenantContextKey, "radiant") },
		RequireActionInTenant(&testutils.MockAuth{Error: fmt.Errorf("no token")}, repo, types.ActionIngestData),
		func(c *gin.Context) { c.Status(http.StatusOK) })

	assert.Equal(t, http.StatusUnauthorized, doActionRequest(router).Code)
}

func Test_RequireActionInTenant_NoTenantInContext_Returns500(t *testing.T) {
	repo := &mockAuthRepository{hasAction: true}
	auth := &testutils.MockAuth{Id: mockUserID}
	router := gin.New()
	router.GET("/:tenant/cases/filters", RequireActionInTenant(auth, repo, types.ActionIngestData),
		func(c *gin.Context) { c.Status(http.StatusOK) })

	assert.Equal(t, http.StatusInternalServerError, doActionRequest(router).Code)
}
