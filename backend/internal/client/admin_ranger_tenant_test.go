package client

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// fakeRangerTenant is a minimal Ranger stand-in for the role/policy provisioning
// paths (EnsureRole, EnsureAccessPolicy). It records the methods+paths it served.
type fakeRangerTenant struct {
	existingRoles  map[string]bool // roles that already exist (GET by name -> 200)
	createdRoles   []string        // names POSTed to /service/roles/roles
	createdPolicy  map[string]any  // last policy POSTed
	deletedPolicy  string          // last policy name deleted
	policyPOSTCode int             // override policy create status (0 => 200)
}

func (f *fakeRangerTenant) server() *httptest.Server {
	mux := http.NewServeMux()

	mux.HandleFunc("/service/roles/roles/name/", func(w http.ResponseWriter, r *http.Request) {
		name := strings.TrimPrefix(r.URL.Path, "/service/roles/roles/name/")
		if f.existingRoles[name] {
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte(`{"id":1,"name":"` + name + `"}`))
			return
		}
		w.WriteHeader(http.StatusNotFound)
	})
	mux.HandleFunc("/service/roles/roles", func(w http.ResponseWriter, r *http.Request) {
		var role rangerRole
		_ = json.NewDecoder(r.Body).Decode(&role)
		f.createdRoles = append(f.createdRoles, role.Name)
		w.WriteHeader(http.StatusOK)
	})
	mux.HandleFunc("/service/public/v2/api/policy", func(w http.ResponseWriter, r *http.Request) {
		f.deletedPolicy = r.URL.Query().Get("policyname")
		w.WriteHeader(http.StatusNoContent)
	})
	mux.HandleFunc("/service/plugins/policies", func(w http.ResponseWriter, r *http.Request) {
		f.createdPolicy = map[string]any{}
		_ = json.NewDecoder(r.Body).Decode(&f.createdPolicy)
		if f.policyPOSTCode != 0 {
			w.WriteHeader(f.policyPOSTCode)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	return httptest.NewServer(mux)
}

func (f *fakeRangerTenant) client(url string) *RangerAdminClient {
	return NewRangerAdminClient(RangerConfig{BaseURL: url, AdminUser: "admin", AdminPass: "pw"})
}

func Test_RangerAdminClient_EnsureRole_CreatesWhenMissing(t *testing.T) {
	fake := &fakeRangerTenant{existingRoles: map[string]bool{}}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureRole(context.Background(), "demo_user")

	require.NoError(t, err)
	assert.Equal(t, []string{"demo_user"}, fake.createdRoles)
}

func Test_RangerAdminClient_EnsureRole_LeavesExistingRoleUntouched(t *testing.T) {
	fake := &fakeRangerTenant{existingRoles: map[string]bool{"demo_user": true}}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureRole(context.Background(), "demo_user")

	require.NoError(t, err)
	assert.Empty(t, fake.createdRoles, "must not re-create / clobber an existing role's membership")
}

func Test_RangerAdminClient_EnsureAccessPolicy_DeletesThenCreates(t *testing.T) {
	fake := &fakeRangerTenant{existingRoles: map[string]bool{}}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureAccessPolicy(context.Background(), "sr_access_demo", []string{"demo"}, []string{"*"}, []string{"demo_user"})

	require.NoError(t, err)
	assert.Equal(t, "sr_access_demo", fake.deletedPolicy, "old policy deleted first for convergence")
	assert.Equal(t, "sr_access_demo", fake.createdPolicy["name"])
	assert.EqualValues(t, 0, fake.createdPolicy["policyType"], "access policy is type 0")
}

func Test_RangerAdminClient_EnsureAccessPolicy_ReportsServerError(t *testing.T) {
	fake := &fakeRangerTenant{existingRoles: map[string]bool{}, policyPOSTCode: http.StatusInternalServerError}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureAccessPolicy(context.Background(), "sr_access_demo", []string{"demo"}, []string{"*"}, []string{"demo_user"})

	require.Error(t, err)
	assert.Contains(t, err.Error(), "create access policy")
}
