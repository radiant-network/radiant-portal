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

const createRoleBody = `{"code":"clinical_reviewer","name_en":"Clinical Reviewer","name_fr":"Réviseur clinique","description_en":"Full clinical work.","description_fr":"Travail clinique complet.","actions":["can_search_case","can_read_pii"]}`

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
	assert.EqualValues(t, "Clinical Reviewer", repo.gotReq.NameEn)
	assert.EqualValues(t, "Réviseur clinique", repo.gotReq.NameFr)
	assert.EqualValues(t, "Full clinical work.", repo.gotReq.DescriptionEn)
	assert.EqualValues(t, "Travail clinique complet.", repo.gotReq.DescriptionFr)
	assert.Equal(t, []string{"can_search_case", "can_read_pii"}, repo.gotReq.Actions)
}

func Test_PostRoleHandler_FrenchLabelsAreOptional(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"code":"reviewer","name_en":"Reviewer","actions":["can_view_kb"]}`)

	require.Equal(t, http.StatusCreated, w.Code)
	assert.Empty(t, repo.gotReq.NameFr, "omitted, so the repository falls back to the English name")
	assert.EqualValues(t, "Reviewer", repo.gotReq.FrenchName())
}

func Test_PostRoleHandler_TrimsCodeNameAndDescription(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"code":"  clinical_reviewer  ","name_en":"  Clinical Reviewer  ","name_fr":"  Réviseur clinique  ","description_en":"  Full clinical work.  ","actions":["can_view_kb"]}`)

	require.Equal(t, http.StatusCreated, w.Code)
	assert.EqualValues(t, "clinical_reviewer", repo.gotReq.Code)
	assert.EqualValues(t, "Clinical Reviewer", repo.gotReq.NameEn)
	assert.EqualValues(t, "Réviseur clinique", repo.gotReq.NameFr)
	assert.EqualValues(t, "Full clinical work.", repo.gotReq.DescriptionEn)
}

func Test_PostRoleHandler_WhitespaceOnlyNameIsRejected(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"code":"reviewer","name_en":"   ","actions":["can_view_kb"]}`)

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
	w := servePostRole(repo, `{"name_en":"Clinical Reviewer","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Zero(t, repo.calls)
}

func Test_PostRoleHandler_InvalidCodeIsRejected(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"code":"Clinical-Reviewer","name_en":"Clinical Reviewer","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Clinical-Reviewer")
	assert.Zero(t, repo.calls, "validation runs before the repository is touched")
}

func Test_PostRoleHandler_EmptyActionsIsRejected(t *testing.T) {
	repo := &mockRoleCreator{}
	w := servePostRole(repo, `{"code":"empty","name_en":"Empty","actions":[]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Zero(t, repo.calls)
}

func Test_PostRoleHandler_DuplicateCodeIsConflict(t *testing.T) {
	repo := &mockRoleCreator{err: &types.RoleConflictError{Field: types.RoleFieldCode}}
	w := servePostRole(repo, createRoleBody)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"a role with the same code already exists in this tenant","detail":{"field":"code"}}`, w.Body.String())
}

func Test_PostRoleHandler_DuplicateEnglishNameIsConflict(t *testing.T) {
	repo := &mockRoleCreator{err: &types.RoleConflictError{Field: types.RoleFieldNameEn}}
	w := servePostRole(repo, createRoleBody)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"a role with the same name_en already exists in this tenant","detail":{"field":"name_en"}}`, w.Body.String())
}

func Test_PostRoleHandler_DuplicateFrenchNameIsConflict(t *testing.T) {
	repo := &mockRoleCreator{err: &types.RoleConflictError{Field: types.RoleFieldNameFr}}
	w := servePostRole(repo, createRoleBody)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"a role with the same name_fr already exists in this tenant","detail":{"field":"name_fr"}}`, w.Body.String())
}

// A conflict wrapped on its way up still answers 409 with the field, so a repository that adds
// context to the error does not silently downgrade the response to a 500.
func Test_PostRoleHandler_WrappedConflictIsStillConflict(t *testing.T) {
	repo := &mockRoleCreator{err: fmt.Errorf("creating role: %w", &types.RoleConflictError{Field: types.RoleFieldCode})}
	w := servePostRole(repo, createRoleBody)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"a role with the same code already exists in this tenant","detail":{"field":"code"}}`, w.Body.String())
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

type mockRoleUpdater struct {
	err       error
	gotTenant string
	gotCode   string
	gotReq    types.UpdateRoleRequest
	calls     int
}

func (m *mockRoleUpdater) UpdateRole(_ context.Context, tenantCode, roleCode string, req types.UpdateRoleRequest) error {
	m.calls++
	m.gotTenant = tenantCode
	m.gotCode = roleCode
	m.gotReq = req
	return m.err
}

func servePutRole(repo roleUpdater, code, body string) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.PUT("/:tenant/roles/:code", PutRoleHandler(repo))
	req, _ := http.NewRequest("PUT", "/radiant/roles/"+code, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

const updateRoleBody = `{"name_en":"Clinical Reviewer","name_fr":"Réviseur clinique","description_en":"Full clinical work.","description_fr":"Travail clinique complet.","actions":["can_search_case","can_read_pii"]}`

func Test_PutRoleHandler_OkIsEmpty(t *testing.T) {
	repo := &mockRoleUpdater{}
	w := servePutRole(repo, "clinical_reviewer", updateRoleBody)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, w.Body.String(), "matches the other write endpoints: the caller reads the role back")
}

func Test_PutRoleHandler_PassesTenantCodeAndPayloadToRepo(t *testing.T) {
	repo := &mockRoleUpdater{}
	servePutRole(repo, "clinical_reviewer", updateRoleBody)

	assert.Equal(t, "radiant", repo.gotTenant)
	assert.Equal(t, "clinical_reviewer", repo.gotCode)
	assert.EqualValues(t, "Clinical Reviewer", repo.gotReq.NameEn)
	assert.EqualValues(t, "Réviseur clinique", repo.gotReq.NameFr)
	assert.EqualValues(t, "Full clinical work.", repo.gotReq.DescriptionEn)
	assert.EqualValues(t, "Travail clinique complet.", repo.gotReq.DescriptionFr)
	assert.Equal(t, []string{"can_search_case", "can_read_pii"}, repo.gotReq.Actions)
}

func Test_PutRoleHandler_FrenchLabelsAreOptional(t *testing.T) {
	repo := &mockRoleUpdater{}
	w := servePutRole(repo, "reviewer", `{"name_en":"Reviewer","actions":["can_view_kb"]}`)

	require.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, repo.gotReq.NameFr, "omitted, so the repository falls back to the English name")
	assert.EqualValues(t, "Reviewer", repo.gotReq.FrenchName())
}

func Test_PutRoleHandler_TrimsNameAndDescription(t *testing.T) {
	repo := &mockRoleUpdater{}
	w := servePutRole(repo, "reviewer", `{"name_en":"  Clinical Reviewer  ","name_fr":"  Réviseur clinique  ","description_en":"  Full clinical work.  ","actions":["can_view_kb"]}`)

	require.Equal(t, http.StatusOK, w.Code)
	assert.EqualValues(t, "Clinical Reviewer", repo.gotReq.NameEn)
	assert.EqualValues(t, "Réviseur clinique", repo.gotReq.NameFr)
	assert.EqualValues(t, "Full clinical work.", repo.gotReq.DescriptionEn)
}

func Test_PutRoleHandler_WhitespaceOnlyNameIsRejected(t *testing.T) {
	repo := &mockRoleUpdater{}
	w := servePutRole(repo, "reviewer", `{"name_en":"   ","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code, "trimming leaves it empty, so required fails")
	assert.Zero(t, repo.calls)
}

func Test_PutRoleHandler_MalformedBodyIsRejected(t *testing.T) {
	repo := &mockRoleUpdater{}
	w := servePutRole(repo, "reviewer", `{"name_en":`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Zero(t, repo.calls, "an unparsable body never reaches the repository")
}

func Test_PutRoleHandler_MissingRequiredFieldIsRejected(t *testing.T) {
	repo := &mockRoleUpdater{}
	w := servePutRole(repo, "reviewer", `{"description_en":"No name here."}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Zero(t, repo.calls)
}

func Test_PutRoleHandler_EmptyActionsIsRejected(t *testing.T) {
	repo := &mockRoleUpdater{}
	w := servePutRole(repo, "reviewer", `{"name_en":"Reviewer","actions":[]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code, "an edit may not strip a role down to no actions")
	assert.Zero(t, repo.calls)
}

func Test_PutRoleHandler_UnknownRoleIsNotFound(t *testing.T) {
	repo := &mockRoleUpdater{err: types.ErrRoleNotFound}
	w := servePutRole(repo, "no_such_role", updateRoleBody)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"role not found"}`, w.Body.String())
}

func Test_PutRoleHandler_DefaultRoleIsForbiddenWithAReason(t *testing.T) {
	repo := &mockRoleUpdater{err: types.ErrRoleIsDefault}
	w := servePutRole(repo, "geneticist", updateRoleBody)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.JSONEq(t, `{"status":403,"message":"cannot edit a default role"}`, w.Body.String())
}

func Test_PutRoleHandler_DuplicateEnglishNameIsConflict(t *testing.T) {
	repo := &mockRoleUpdater{err: &types.RoleConflictError{Field: types.RoleFieldNameEn}}
	w := servePutRole(repo, "clinical_reviewer", updateRoleBody)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"a role with the same name_en already exists in this tenant","detail":{"field":"name_en"}}`, w.Body.String())
}

func Test_PutRoleHandler_DuplicateFrenchNameIsConflict(t *testing.T) {
	repo := &mockRoleUpdater{err: &types.RoleConflictError{Field: types.RoleFieldNameFr}}
	w := servePutRole(repo, "clinical_reviewer", updateRoleBody)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"a role with the same name_fr already exists in this tenant","detail":{"field":"name_fr"}}`, w.Body.String())
}

func Test_PutRoleHandler_WrappedDefaultRoleErrorIsStillForbidden(t *testing.T) {
	repo := &mockRoleUpdater{err: fmt.Errorf("updating role %q: %w", "geneticist", types.ErrRoleIsDefault)}
	w := servePutRole(repo, "geneticist", updateRoleBody)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_PutRoleHandler_WrappedConflictIsStillConflict(t *testing.T) {
	repo := &mockRoleUpdater{err: fmt.Errorf("updating role: %w", &types.RoleConflictError{Field: types.RoleFieldNameEn})}
	w := servePutRole(repo, "clinical_reviewer", updateRoleBody)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"a role with the same name_en already exists in this tenant","detail":{"field":"name_en"}}`, w.Body.String())
}

func Test_PutRoleHandler_UngrantableActionIsUnprocessable(t *testing.T) {
	repo := &mockRoleUpdater{err: fmt.Errorf("%w: can_manage_user", types.ErrRoleActionsNotGrantable)}
	w := servePutRole(repo, "clinical_reviewer", updateRoleBody)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	assert.JSONEq(t, `{"status":422,"message":"actions cannot be granted to a custom role: can_manage_user"}`, w.Body.String())
}

func Test_PutRoleHandler_RepoError(t *testing.T) {
	repo := &mockRoleUpdater{err: errors.New("boom")}
	w := servePutRole(repo, "clinical_reviewer", updateRoleBody)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
