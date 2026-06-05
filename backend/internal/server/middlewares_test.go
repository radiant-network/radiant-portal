package server

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

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
	auth := &testutils.MockAuth{Email: "alice@test.authz"}
	router := tenantTestRouter(repo, auth, true)

	req, _ := http.NewRequest("GET", "/radiant/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"tenant":"radiant"}`, w.Body.String())
}

func Test_RequireTenantAccess_NonMember_Returns403(t *testing.T) {
	repo := &mockAuthRepository{hasTenantAccess: false}
	auth := &testutils.MockAuth{Email: "alice@test.authz"}
	router := tenantTestRouter(repo, auth, true)

	req, _ := http.NewRequest("GET", "/tenant_b/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_RequireTenantAccess_EmailError_Returns401(t *testing.T) {
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
	auth := &testutils.MockAuth{Email: "alice@test.authz"}
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
	auth := &testutils.MockAuth{Email: "alice@test.authz"}
	router := tenantTestRouter(repo, auth, false)

	req, _ := http.NewRequest("GET", "/tenant_b/cases/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"tenant":"tenant_b"}`, w.Body.String())
}
