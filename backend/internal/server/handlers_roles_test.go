package server

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type mockRolesReader struct {
	roles     []types.RoleResult
	err       error
	gotTenant string
}

func (m *mockRolesReader) ListTenantRoles(_ context.Context, tenantCode string) ([]types.RoleResult, error) {
	m.gotTenant = tenantCode
	return m.roles, m.err
}

func serveListRoles(repo rolesReader) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.GET("/:tenant/roles", ListRolesHandler(repo))
	req, _ := http.NewRequest("GET", "/radiant/roles", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_ListRolesHandler(t *testing.T) {
	repo := &mockRolesReader{roles: []types.RoleResult{{
		Code:        "geneticist",
		Name:        "Geneticist",
		Description: "Interpret variants at the selected organizations.",
		IsDefault:   true,
		Scope:       types.RoleScopeOrg,
		Actions: []types.RoleActionResult{
			{Code: "can_read_pii", Name: "Read personal health information", Description: "See patient identity on cases owned by the organization.", Scope: types.ActionScopeOrg},
		},
		AssignedUsersCount: 12,
	}}}
	w := serveListRoles(repo)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"code":"geneticist",
		"name":"Geneticist",
		"description":"Interpret variants at the selected organizations.",
		"is_default":true,
		"scope":"org",
		"actions":[{
			"code":"can_read_pii",
			"name":"Read personal health information",
			"description":"See patient identity on cases owned by the organization.",
			"scope":"org"
		}],
		"assigned_users_count":12
	}]`, w.Body.String())
}

func Test_ListRolesHandler_PassesTenantFromPath(t *testing.T) {
	repo := &mockRolesReader{roles: []types.RoleResult{}}
	w := serveListRoles(repo)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "radiant", repo.gotTenant)
	assert.JSONEq(t, `[]`, w.Body.String())
}

func Test_ListRolesHandler_OmitsEmptyDescription(t *testing.T) {
	repo := &mockRolesReader{roles: []types.RoleResult{{
		Code:    "researcher",
		Name:    "Researcher",
		Scope:   types.RoleScopeTenant,
		Actions: []types.RoleActionResult{},
	}}}
	w := serveListRoles(repo)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{
		"code":"researcher","name":"Researcher","is_default":false,"scope":"tenant",
		"actions":[],"assigned_users_count":0
	}]`, w.Body.String())
}

func Test_ListRolesHandler_RepoError(t *testing.T) {
	repo := &mockRolesReader{err: errors.New("boom")}
	w := serveListRoles(repo)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
