package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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
		AssignedOrgsCount:  3,
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
		"assigned_users_count":12,
		"assigned_orgs_count":3
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
		"actions":[],"assigned_users_count":0,"assigned_orgs_count":0
	}]`, w.Body.String())
}

func Test_ListRolesHandler_RepoError(t *testing.T) {
	repo := &mockRolesReader{err: errors.New("boom")}
	w := serveListRoles(repo)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

type mockRoleDetailReader struct {
	role      *types.RoleResult
	err       error
	gotTenant string
	gotRole   string
}

func (m *mockRoleDetailReader) GetTenantRole(_ context.Context, tenantCode, roleCode string) (*types.RoleResult, error) {
	m.gotTenant = tenantCode
	m.gotRole = roleCode
	return m.role, m.err
}

func serveGetRole(repo roleDetailReader, code string) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.GET("/:tenant/roles/:code", GetRoleHandler(repo))
	req, _ := http.NewRequest("GET", "/radiant/roles/"+code, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_GetRoleHandler(t *testing.T) {
	repo := &mockRoleDetailReader{role: &types.RoleResult{
		Code:        "geneticist",
		Name:        "Geneticist",
		Description: "Interpret variants at the selected organizations.",
		IsDefault:   true,
		Scope:       types.RoleScopeOrg,
		Actions: []types.RoleActionResult{
			{Code: "can_read_pii", Name: "Read personal health information", Description: "See patient identity on cases owned by the organization.", Scope: types.ActionScopeOrg},
		},
		AssignedUsersCount: 12,
		AssignedOrgsCount:  3,
	}}
	w := serveGetRole(repo, "geneticist")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
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
		"assigned_users_count":12,
		"assigned_orgs_count":3
	}`, w.Body.String())
}

func Test_GetRoleHandler_PassesTenantAndCodeFromPath(t *testing.T) {
	repo := &mockRoleDetailReader{role: &types.RoleResult{Code: "researcher", Name: "Researcher", Scope: types.RoleScopeTenant, Actions: []types.RoleActionResult{}}}
	w := serveGetRole(repo, "researcher")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "radiant", repo.gotTenant)
	assert.Equal(t, "researcher", repo.gotRole)
	assert.JSONEq(t, `{
		"code":"researcher","name":"Researcher","is_default":false,"scope":"tenant",
		"actions":[],"assigned_users_count":0,"assigned_orgs_count":0
	}`, w.Body.String())
}

func Test_GetRoleHandler_UnknownRoleNotFound(t *testing.T) {
	repo := &mockRoleDetailReader{}
	w := serveGetRole(repo, "no_such_role")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"role not found"}`, w.Body.String())
}

func Test_GetRoleHandler_RepoError(t *testing.T) {
	repo := &mockRoleDetailReader{err: errors.New("boom")}
	w := serveGetRole(repo, "geneticist")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

type mockRoleCreator struct {
	err       error
	gotTenant string
	gotReq    types.CreateRoleRequest
	calls     int
}

func (m *mockRoleCreator) CreateRole(_ context.Context, tenantCode string, req types.CreateRoleRequest) error {
	m.calls++
	m.gotTenant = tenantCode
	m.gotReq = req
	return m.err
}

func servePostRole(repo roleCreator, body string) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.POST("/:tenant/roles", PostRoleHandler(repo))
	req, _ := http.NewRequest("POST", "/radiant/roles", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

const createRoleBody = `{"code":"clinical_reviewer","name":"Clinical Reviewer","description":"Full clinical work.","actions":["can_search_case","can_read_pii"]}`

func Test_PostRoleHandler_CreatedIsEmpty(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, createRoleBody)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Empty(t, w.Body.String(), "matches the other create endpoints: the caller reads the role back")
}

func Test_PostRoleHandler_PassesTenantAndPayloadToRepo(t *testing.T) {
	repo := &mockRoleCreator{}
	servePostRole(repo, createRoleBody)

	assert.Equal(t, "radiant", repo.gotTenant)
	assert.EqualValues(t, "clinical_reviewer", repo.gotReq.Code)
	assert.EqualValues(t, "Clinical Reviewer", repo.gotReq.Name)
	assert.EqualValues(t, "Full clinical work.", repo.gotReq.Description)
	assert.Equal(t, []string{"can_search_case", "can_read_pii"}, repo.gotReq.Actions)
}

func Test_PostRoleHandler_TrimsCodeNameAndDescription(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"code":"  clinical_reviewer  ","name":"  Clinical Reviewer  ","description":"  Full clinical work.  ","actions":["can_view_kb"]}`)

	require.Equal(t, http.StatusCreated, w.Code)
	assert.EqualValues(t, "clinical_reviewer", repo.gotReq.Code)
	assert.EqualValues(t, "Clinical Reviewer", repo.gotReq.Name)
	assert.EqualValues(t, "Full clinical work.", repo.gotReq.Description)
}

func Test_PostRoleHandler_WhitespaceOnlyNameIsRejected(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"code":"reviewer","name":"   ","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code, "trimming leaves it empty, so required fails")
	assert.Zero(t, repo.calls)
}

func Test_PostRoleHandler_MalformedBodyIsRejected(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"code":`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Zero(t, repo.calls, "an unparsable body never reaches the repository")
}

func Test_PostRoleHandler_MissingRequiredFieldIsRejected(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"name":"Clinical Reviewer","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Zero(t, repo.calls)
}

func Test_PostRoleHandler_InvalidCodeIsRejected(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"code":"Clinical-Reviewer","name":"Clinical Reviewer","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Clinical-Reviewer")
	assert.Zero(t, repo.calls, "validation runs before the repository is touched")
}

func Test_PostRoleHandler_EmptyActionsIsRejected(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"code":"empty","name":"Empty","actions":[]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Zero(t, repo.calls)
}

func Test_PostRoleHandler_DuplicateCodeIsConflict(t *testing.T) {
	repo := &mockRoleCreator{err: types.ErrRoleCodeExists}
	w := servePostRole(repo, createRoleBody)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"role code already exists in this tenant"}`, w.Body.String())
}

func Test_PostRoleHandler_DuplicateNameIsConflict(t *testing.T) {
	repo := &mockRoleCreator{err: types.ErrRoleNameExists}
	w := servePostRole(repo, createRoleBody)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"role name already exists in this tenant"}`, w.Body.String())
}

func Test_PostRoleHandler_UngrantableActionIsUnprocessable(t *testing.T) {
	repo := &mockRoleCreator{err: fmt.Errorf("%w: can_manage_user", types.ErrRoleActionsNotGrantable)}
	w := servePostRole(repo, createRoleBody)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	assert.JSONEq(t, `{"status":422,"message":"actions cannot be granted to a custom role: can_manage_user"}`, w.Body.String())
}

func Test_PostRoleHandler_RepoError(t *testing.T) {
	repo := &mockRoleCreator{err: errors.New("boom")}
	w := servePostRole(repo, createRoleBody)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
