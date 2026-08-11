package server

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
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
