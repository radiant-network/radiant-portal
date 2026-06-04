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

type mockAuthRepository struct {
	memberships []types.TenantMembership
	err         error
}

func (m *mockAuthRepository) HasAction(email, tenantCode, orgCode, actionCode string) (bool, error) {
	return false, nil
}

func (m *mockAuthRepository) GetMemberships(email string) ([]types.TenantMembership, error) {
	return m.memberships, m.err
}

func Test_GetMeHandler(t *testing.T) {
	repo := &mockAuthRepository{memberships: []types.TenantMembership{
		{
			Code:          "radiant",
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
