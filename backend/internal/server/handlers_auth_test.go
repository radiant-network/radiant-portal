package server

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

type mockAuthRepository struct {
	memberships     []types.TenantMembership
	err             error
	tenantNotFound  bool
	tenantExistsErr error
	hasTenantAccess bool
	tenantErr       error
	hasAction       bool
	actionErr       error
	gotOrgCode      string
	gotAction       string
}

// TenantExists defaults to reporting the tenant as present (zero-value tenantNotFound=false)
// so existing tests need no change; set tenantNotFound to exercise the unknown-tenant 403 path.
func (m *mockAuthRepository) TenantExists(ctx context.Context, tenantCode string) (bool, error) {
	return !m.tenantNotFound, m.tenantExistsErr
}

func (m *mockAuthRepository) HasTenantAccess(ctx context.Context, email, tenantCode string) (bool, error) {
	return m.hasTenantAccess, m.tenantErr
}

func (m *mockAuthRepository) HasAction(ctx context.Context, userID, tenantCode, orgCode, actionCode string) (bool, error) {
	m.gotOrgCode = orgCode
	m.gotAction = actionCode
	return m.hasAction, m.actionErr
}

func (m *mockAuthRepository) GetMemberships(ctx context.Context, email string) ([]types.TenantMembership, error) {
	return m.memberships, m.err
}

func Test_GetMeHandler(t *testing.T) {
	repo := &mockAuthRepository{memberships: []types.TenantMembership{
		{
			Code:          types.DefaultTenantCode,
			Name:          "Radiant",
			TenantActions: []string{"can_search_case", "can_view_kb"},
			OrgsByAction:  map[string][]string{"can_read_pii": {"CHOP"}},
		},
	}}
	auth := &testutils.MockAuth{}
	router := gin.Default()
	router.GET("/auth/me", GetMeHandler(repo, auth))

	req, _ := http.NewRequest("GET", "/auth/me", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"code":"radiant",
		"name":"Radiant",
		"tenant_actions":["can_search_case","can_view_kb"],
		"orgs_by_action":{"can_read_pii":["CHOP"]}
	}]`, w.Body.String())
}

func Test_GetMeHandler_EmailError(t *testing.T) {
	repo := &mockAuthRepository{}
	auth := &testutils.MockAuth{Error: fmt.Errorf("no token")}
	router := gin.Default()
	router.GET("/auth/me", GetMeHandler(repo, auth))

	req, _ := http.NewRequest("GET", "/auth/me", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
