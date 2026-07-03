package client

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// fakeRanger is a minimal stateful stand-in for the Ranger REST API.
type fakeRanger struct {
	roles        map[string]*rangerRole // by name
	ensureStatus int                    // override ensure-user status (0 => 200)
	ensuredUsers []string
	lastPutRole  *rangerRole
}

func newFakeRanger() *fakeRanger {
	return &fakeRanger{roles: map[string]*rangerRole{}}
}

func (f *fakeRanger) server() *httptest.Server {
	mux := http.NewServeMux()

	mux.HandleFunc("/service/xusers/secure/users", func(w http.ResponseWriter, r *http.Request) {
		var u map[string]any
		_ = json.NewDecoder(r.Body).Decode(&u)
		f.ensuredUsers = append(f.ensuredUsers, u["name"].(string))
		if f.ensureStatus != 0 {
			w.WriteHeader(f.ensureStatus)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	mux.HandleFunc("/service/roles/roles/name/", func(w http.ResponseWriter, r *http.Request) {
		name := strings.TrimPrefix(r.URL.Path, "/service/roles/roles/name/")
		role, ok := f.roles[name]
		if !ok {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		_ = json.NewEncoder(w).Encode(role)
	})

	mux.HandleFunc("/service/roles/roles/", func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		var role rangerRole
		_ = json.Unmarshal(body, &role)
		f.lastPutRole = &role
		idStr := strings.TrimPrefix(r.URL.Path, "/service/roles/roles/")
		if id, err := strconv.ParseInt(idStr, 10, 64); err == nil {
			for _, existing := range f.roles {
				if existing.ID == id {
					existing.Users = role.Users
				}
			}
		}
		w.WriteHeader(http.StatusOK)
	})

	return httptest.NewServer(mux)
}

func (f *fakeRanger) client(url string) *RangerAdminClient {
	return NewRangerAdminClient(RangerConfig{BaseURL: url, AdminUser: "admin", AdminPass: "pw"})
}

func Test_RangerAdminClient_EnsureUser_Creates(t *testing.T) {
	fake := newFakeRanger()
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureUser(context.Background(), "the-sub")

	require.NoError(t, err)
	assert.Equal(t, []string{"the-sub"}, fake.ensuredUsers)
}

func Test_RangerAdminClient_EnsureUser_AlreadyExistsIsNotAnError(t *testing.T) {
	fake := newFakeRanger()
	fake.ensureStatus = http.StatusBadRequest // Ranger returns 400 when the user exists
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureUser(context.Background(), "the-sub")

	assert.NoError(t, err)
}

func Test_RangerAdminClient_EnsureUser_ServerErrorIsReported(t *testing.T) {
	fake := newFakeRanger()
	fake.ensureStatus = http.StatusInternalServerError
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureUser(context.Background(), "the-sub")

	require.Error(t, err)
	assert.Contains(t, err.Error(), "ensure user")
}

func Test_RangerAdminClient_AddUserToRole_AddsNewMember(t *testing.T) {
	fake := newFakeRanger()
	fake.roles["tenant_a_user"] = &rangerRole{ID: 7, Name: "tenant_a_user", Users: []rangerRoleMember{}}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).AddUserToRole(context.Background(), "tenant_a_user", "the-sub")

	require.NoError(t, err)
	require.NotNil(t, fake.lastPutRole)
	assert.Equal(t, []rangerRoleMember{{Name: "the-sub", IsAdmin: false}}, fake.lastPutRole.Users)
}

func Test_RangerAdminClient_AddUserToRole_PreservesExistingMembers(t *testing.T) {
	fake := newFakeRanger()
	fake.roles["tenant_a_user"] = &rangerRole{
		ID: 7, Name: "tenant_a_user",
		Users: []rangerRoleMember{{Name: "wendy-sub"}},
	}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).AddUserToRole(context.Background(), "tenant_a_user", "the-sub")

	require.NoError(t, err)
	require.NotNil(t, fake.lastPutRole)
	names := []string{fake.lastPutRole.Users[0].Name, fake.lastPutRole.Users[1].Name}
	assert.Equal(t, []string{"wendy-sub", "the-sub"}, names, "existing member kept, new one appended")
}

func Test_RangerAdminClient_AddUserToRole_IsIdempotent(t *testing.T) {
	fake := newFakeRanger()
	fake.roles["tenant_a_user"] = &rangerRole{
		ID: 7, Name: "tenant_a_user",
		Users: []rangerRoleMember{{Name: "the-sub"}},
	}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).AddUserToRole(context.Background(), "tenant_a_user", "the-sub")

	require.NoError(t, err)
	assert.Nil(t, fake.lastPutRole, "no PUT when the user is already a member")
}

func Test_RangerAdminClient_AddUserToRole_MissingRoleIsReported(t *testing.T) {
	fake := newFakeRanger()
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).AddUserToRole(context.Background(), "no_such_role", "the-sub")

	require.Error(t, err)
	assert.Contains(t, err.Error(), "get role")
}

func Test_RangerAdminClient_AddRoleToRole_NestsNewChild(t *testing.T) {
	fake := newFakeRanger()
	fake.roles["user_role"] = &rangerRole{ID: 3, Name: "user_role", Roles: []rangerRoleMember{}}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).AddRoleToRole(context.Background(), "user_role", "demo_user")

	require.NoError(t, err)
	require.NotNil(t, fake.lastPutRole)
	assert.Equal(t, []rangerRoleMember{{Name: "demo_user", IsAdmin: false}}, fake.lastPutRole.Roles)
}

func Test_RangerAdminClient_AddRoleToRole_PreservesExistingSubRoles(t *testing.T) {
	fake := newFakeRanger()
	fake.roles["user_role"] = &rangerRole{ID: 3, Name: "user_role", Roles: []rangerRoleMember{{Name: "cbtn_user"}}}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).AddRoleToRole(context.Background(), "user_role", "demo_user")

	require.NoError(t, err)
	require.NotNil(t, fake.lastPutRole)
	names := []string{fake.lastPutRole.Roles[0].Name, fake.lastPutRole.Roles[1].Name}
	assert.Equal(t, []string{"cbtn_user", "demo_user"}, names, "existing sub-role kept, new one appended")
}

func Test_RangerAdminClient_AddRoleToRole_IsIdempotent(t *testing.T) {
	fake := newFakeRanger()
	fake.roles["user_role"] = &rangerRole{ID: 3, Name: "user_role", Roles: []rangerRoleMember{{Name: "demo_user"}}}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).AddRoleToRole(context.Background(), "user_role", "demo_user")

	require.NoError(t, err)
	assert.Nil(t, fake.lastPutRole, "no PUT when the child is already nested")
}

func Test_RangerAdminClient_AddRoleToRole_MissingParentIsReported(t *testing.T) {
	fake := newFakeRanger()
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).AddRoleToRole(context.Background(), "no_such_role", "demo_user")

	require.Error(t, err)
	assert.Contains(t, err.Error(), "get role")
}
