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
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockUsersReader struct {
	users     []types.UserResult
	count     int64
	err       error
	gotTenant string
	gotQuery  types.ListUsersQuery
}

func (m *mockUsersReader) ListTenantUsers(_ context.Context, tenantCode string, query types.ListUsersQuery) ([]types.UserResult, int64, error) {
	m.gotTenant, m.gotQuery = tenantCode, query
	return m.users, m.count, m.err
}

func serveListUsers(repo usersReader, queryString string) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.GET("/:tenant/users", ListUsersHandler(repo))
	req, _ := http.NewRequest("GET", "/radiant/users"+queryString, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_ListUsersHandler(t *testing.T) {
	repo := &mockUsersReader{count: 1, users: []types.UserResult{{
		UserID:    "b3f1-keycloak-sub",
		Email:     "grace.chen@chop.edu",
		FirstName: "Grace",
		LastName:  "Chen",
		Roles: []types.UserRoleResult{
			{RoleCode: "member", Name: "Member", Scope: types.RoleScopeTenant, OrgCodes: []string{}},
			{RoleCode: "geneticist", Name: "Geneticist", Scope: types.RoleScopeOrg, OrgCodes: []string{"CHOP", "CHUSJ"}},
		},
	}}}
	w := serveListUsers(repo, "")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"list": [
			{
				"user_id": "b3f1-keycloak-sub",
				"email": "grace.chen@chop.edu",
				"first_name": "Grace",
				"last_name": "Chen",
				"roles": [
					{"role_code":"member","name":"Member","scope":"tenant","org_codes":[]},
					{"role_code":"geneticist","name":"Geneticist","scope":"org","org_codes":["CHOP","CHUSJ"]}
				]
			}
		],
		"count": 1
	}`, w.Body.String())
}

func Test_ListUsersHandler_OmitsMissingIdentityAttributes(t *testing.T) {
	repo := &mockUsersReader{count: 1, users: []types.UserResult{{
		UserID: "sub-without-attributes",
		Roles:  []types.UserRoleResult{},
	}}}
	w := serveListUsers(repo, "")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"list":[{"user_id":"sub-without-attributes","roles":[]}],"count":1}`, w.Body.String())
}

func Test_ListUsersHandler_EmptyList(t *testing.T) {
	repo := &mockUsersReader{users: []types.UserResult{}}
	w := serveListUsers(repo, "")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"list":[],"count":0}`, w.Body.String())
}

func Test_ListUsersHandler_PassesTenantAndResolvedQueryToRepo(t *testing.T) {
	repo := &mockUsersReader{users: []types.UserResult{}}
	w := serveListUsers(repo, "?search=chen&limit=10&offset=20")

	require.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "radiant", repo.gotTenant)
	assert.Equal(t, "chen", repo.gotQuery.Search)
	require.NotNil(t, repo.gotQuery.Pagination)
	assert.Equal(t, 10, repo.gotQuery.Pagination.Limit)
	assert.Equal(t, 20, repo.gotQuery.Pagination.Offset)
}

func Test_ListUsersHandler_NotANumberLimit(t *testing.T) {
	w := serveListUsers(&mockUsersReader{}, "?limit=abc")

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_ListUsersHandler_NegativeOffset(t *testing.T) {
	w := serveListUsers(&mockUsersReader{}, "?offset=-1")

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"limit, offset and page_index must not be negative"}`, w.Body.String())
}

func Test_ListUsersHandler_RepoError(t *testing.T) {
	repo := &mockUsersReader{err: errors.New("boom")}
	w := serveListUsers(repo, "")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func Test_ListUsersHandler_ForwardsRoleFilterToRepo(t *testing.T) {
	repo := &mockUsersReader{users: []types.UserResult{}}
	w := serveListUsers(repo, "?search=chen&roles=member,geneticist")

	require.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "chen", repo.gotQuery.Search)
	assert.Equal(t, []string{"member", "geneticist"}, repo.gotQuery.Roles)
}

func Test_ListUsersHandler_BlankRoleFilterIsNoFilter(t *testing.T) {
	repo := &mockUsersReader{users: []types.UserResult{}}
	w := serveListUsers(repo, "?roles=")

	require.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, repo.gotQuery.Roles)
}

// --- POST /:tenant/users ----------------------------------------------------
//
// The handler only maps HTTP to service.UserAdmin; grant composition and the scope rules are
// exercised in internal/service/users_test.go.

type mockUserCreator struct {
	err error

	got       types.CreateUserRequest
	gotTenant string
	gotActor  string
	calls     int
}

func (m *mockUserCreator) CreateTenantUser(_ context.Context, tenantCode string, req types.CreateUserRequest, actor string) error {
	m.got, m.gotTenant, m.gotActor, m.calls = req, tenantCode, actor, m.calls+1
	return m.err
}

func servePostUser(svc userCreator, body string) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.POST("/:tenant/users", PostUserHandler(svc, &testutils.MockAuth{Id: "acting-admin-sub"}))
	req, _ := http.NewRequest("POST", "/radiant/users", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_PostUserHandler_ForwardsRequestAndAnswers201(t *testing.T) {
	svc := &mockUserCreator{}

	w := servePostUser(svc, `{
		"email":"grace.chen@chop.edu","first_name":"Grace","last_name":"Chen",
		"roles":[{"role_code":"geneticist","org_codes":["CHOP"]}]
	}`)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Empty(t, w.Body.String())
	assert.Equal(t, "radiant", svc.gotTenant)
	assert.Equal(t, "acting-admin-sub", svc.gotActor, "granted_by is the acting admin")
	assert.Equal(t, types.CreateUserRequest{
		Email:     "grace.chen@chop.edu",
		FirstName: "Grace",
		LastName:  "Chen",
		Roles:     []types.CreateUserRole{{RoleCode: "geneticist", OrgCodes: []string{"CHOP"}}},
	}, svc.got)
}

func Test_PostUserHandler_MissingRequiredFieldIsRejected(t *testing.T) {
	for _, body := range []string{
		`{"first_name":"Grace","last_name":"Chen"}`,
		`{"email":"grace.chen@chop.edu","last_name":"Chen"}`,
		`{"email":"grace.chen@chop.edu","first_name":"Grace"}`,
	} {
		svc := &mockUserCreator{}
		w := servePostUser(svc, body)
		assert.Equal(t, http.StatusBadRequest, w.Code, "body %s", body)
		assert.Zero(t, svc.calls, "nothing is provisioned when the payload is rejected")
	}
}

func Test_PostUserHandler_MalformedBodyIsRejected(t *testing.T) {
	w := servePostUser(&mockUserCreator{}, `{"email":`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostUserHandler_MalformedEmailIsRejected(t *testing.T) {
	svc := &mockUserCreator{}

	w := servePostUser(svc, `{"email":"not-an-email","first_name":"Grace","last_name":"Chen"}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"email \"not-an-email\" is not a valid address"}`, w.Body.String())
	assert.Zero(t, svc.calls)
}

func Test_PostUserHandler_ExistingTenantUserIsConflict(t *testing.T) {
	svc := &mockUserCreator{err: types.ErrUserAlreadyInTenant}

	w := servePostUser(svc, `{"email":"grace.chen@chop.edu","first_name":"Grace","last_name":"Chen"}`)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"a user with this email already has access to this tenant"}`, w.Body.String())
}

func Test_PostUserHandler_ScopeViolationIsBadRequest(t *testing.T) {
	for _, sentinel := range []error{
		types.ErrRoleRequiresOrg, types.ErrRoleNotOrgScoped,
		types.ErrUnknownRole, types.ErrUnknownOrganizations,
	} {
		svc := &mockUserCreator{err: fmt.Errorf("role %q %w", "geneticist", sentinel)}
		w := servePostUser(svc, `{"email":"grace.chen@chop.edu","first_name":"Grace","last_name":"Chen"}`)

		assert.Equal(t, http.StatusBadRequest, w.Code, "sentinel %v", sentinel)
		assert.Contains(t, w.Body.String(), sentinel.Error(), "the reason reaches the caller")
	}
}

func Test_PostUserHandler_ProvisioningErrorIsRedacted(t *testing.T) {
	svc := &mockUserCreator{err: errors.New("keycloak: connection refused")}

	w := servePostUser(svc, `{"email":"grace.chen@chop.edu","first_name":"Grace","last_name":"Chen"}`)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

// --- PUT /:tenant/users/:user_id --------------------------------------------

type mockUserUpdater struct {
	err error

	got       types.UpdateUserRequest
	gotTenant string
	gotUserID string
	gotActor  string
	calls     int
}

func (m *mockUserUpdater) UpdateTenantUser(_ context.Context, tenantCode, userID string, req types.UpdateUserRequest, actor string) error {
	m.got, m.gotTenant, m.gotUserID, m.gotActor, m.calls = req, tenantCode, userID, actor, m.calls+1
	return m.err
}

func servePutUser(svc userUpdater, body string) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.PUT("/:tenant/users/:user_id", PutUserHandler(svc, &testutils.MockAuth{Id: "acting-admin-sub"}))
	req, _ := http.NewRequest("PUT", "/radiant/users/b3f1-keycloak-sub", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_PutUserHandler_ForwardsRequestAndAnswers200(t *testing.T) {
	svc := &mockUserUpdater{}

	w := servePutUser(svc, `{
		"roles":[{"role_code":"geneticist","org_codes":["CHOP","CHUSJ"]}]
	}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, w.Body.String())
	assert.Equal(t, "radiant", svc.gotTenant)
	assert.Equal(t, "b3f1-keycloak-sub", svc.gotUserID)
	assert.Equal(t, "acting-admin-sub", svc.gotActor, "granted_by is the acting admin")
	assert.Equal(t, types.UpdateUserRequest{
		Roles: []types.CreateUserRole{{RoleCode: "geneticist", OrgCodes: []string{"CHOP", "CHUSJ"}}},
	}, svc.got)
}

func Test_PutUserHandler_EmptyRoleSetIsForwarded(t *testing.T) {
	svc := &mockUserUpdater{}

	w := servePutUser(svc, `{"roles":[]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, svc.got.Roles, "an empty set is a valid edit — it revokes everything but member")
}

func Test_PutUserHandler_IdentityFieldsAreIgnored(t *testing.T) {
	svc := &mockUserUpdater{}

	// Identity is fixed at creation: a payload carrying it edits nothing but the roles.
	w := servePutUser(svc, `{"first_name":"Grace","last_name":"Chen","email":"grace.chen@chop.edu"}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, types.UpdateUserRequest{}, svc.got)
}

func Test_PutUserHandler_DuplicateRoleIsRejected(t *testing.T) {
	svc := &mockUserUpdater{}

	w := servePutUser(svc, `{"roles":[
		{"role_code":"geneticist","org_codes":["CHOP"]},
		{"role_code":"geneticist","org_codes":["CHUSJ"]}
	]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"role \"geneticist\" is listed more than once"}`, w.Body.String())
	assert.Zero(t, svc.calls)
}

func Test_PutUserHandler_MalformedBodyIsRejected(t *testing.T) {
	w := servePutUser(&mockUserUpdater{}, `{"roles":`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PutUserHandler_UnknownUserIsNotFound(t *testing.T) {
	svc := &mockUserUpdater{err: types.ErrUserNotInTenant}

	w := servePutUser(svc, `{"roles":[]}`)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"user not found"}`, w.Body.String())
}

func Test_PutUserHandler_LastAdminIsConflict(t *testing.T) {
	svc := &mockUserUpdater{err: types.ErrLastTenantAdmin}

	w := servePutUser(svc, `{"roles":[]}`)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"this is the last user who can manage the users of this tenant"}`, w.Body.String())
}

func Test_PutUserHandler_ScopeViolationIsBadRequest(t *testing.T) {
	for _, sentinel := range []error{
		types.ErrRoleRequiresOrg, types.ErrRoleNotOrgScoped,
		types.ErrUnknownRole, types.ErrUnknownOrganizations,
	} {
		svc := &mockUserUpdater{err: fmt.Errorf("role %q %w", "geneticist", sentinel)}
		w := servePutUser(svc, `{"roles":[]}`)

		assert.Equal(t, http.StatusBadRequest, w.Code, "sentinel %v", sentinel)
		assert.Contains(t, w.Body.String(), sentinel.Error(), "the reason reaches the caller")
	}
}

func Test_PutUserHandler_UpdateErrorIsRedacted(t *testing.T) {
	svc := &mockUserUpdater{err: errors.New("keycloak: connection refused")}

	w := servePutUser(svc, `{"roles":[]}`)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

// --- DELETE /:tenant/users/:user_id -----------------------------------------

type mockUserRemover struct {
	err error

	gotTenant string
	gotUserID string
	gotActor  string
	calls     int
}

func (m *mockUserRemover) RemoveTenantUser(_ context.Context, tenantCode, userID, actor string) error {
	m.gotTenant, m.gotUserID, m.gotActor, m.calls = tenantCode, userID, actor, m.calls+1
	return m.err
}

func serveDeleteUser(svc userRemover) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.DELETE("/:tenant/users/:user_id", DeleteUserHandler(svc, &testutils.MockAuth{Id: "acting-admin-sub"}))
	req, _ := http.NewRequest("DELETE", "/radiant/users/b3f1-keycloak-sub", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_DeleteUserHandler_ForwardsRequestAndAnswers204(t *testing.T) {
	svc := &mockUserRemover{}

	w := serveDeleteUser(svc)

	assert.Equal(t, http.StatusNoContent, w.Code)
	assert.Empty(t, w.Body.String())
	assert.Equal(t, "radiant", svc.gotTenant)
	assert.Equal(t, "b3f1-keycloak-sub", svc.gotUserID)
	assert.Equal(t, "acting-admin-sub", svc.gotActor, "the service compares the target to the caller")
}

func Test_DeleteUserHandler_UnknownUserIsNotFound(t *testing.T) {
	svc := &mockUserRemover{err: types.ErrUserNotInTenant}

	w := serveDeleteUser(svc)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"user not found"}`, w.Body.String())
}

func Test_DeleteUserHandler_LastAdminIsConflict(t *testing.T) {
	svc := &mockUserRemover{err: types.ErrLastTenantAdmin}

	w := serveDeleteUser(svc)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"this is the last user who can manage the users of this tenant"}`, w.Body.String())
}

func Test_DeleteUserHandler_RemovingYourselfIsBadRequest(t *testing.T) {
	svc := &mockUserRemover{err: types.ErrCannotRemoveSelf}

	w := serveDeleteUser(svc)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"you cannot remove your own access to this tenant"}`, w.Body.String())
}

func Test_DeleteUserHandler_RemoveErrorIsRedacted(t *testing.T) {
	svc := &mockUserRemover{err: errors.New("ranger: connection refused")}

	w := serveDeleteUser(svc)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
