package client

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// fakeRangerTenant is a minimal Ranger stand-in for the role/policy provisioning
// paths (EnsureRole, EnsureAccessPolicy).
type fakeRangerTenant struct {
	existingRoles map[string]bool
	roleGETStatus int      // override GET-role-by-name status (0 => normal 200/404)
	createdRoles  []string // names POSTed to /service/roles/roles

	existingPolicies  map[string]int64 // policy name -> id, for the GET-by-name upsert probe
	createdPolicy     map[string]any   // last POST /service/plugins/policies body
	updatedPolicy     map[string]any   // last PUT /service/public/v2/api/policy/{id} body
	policyWriteStatus int              // override create/update status (0 => 200)
}

func (f *fakeRangerTenant) server() *httptest.Server {
	mux := http.NewServeMux()

	mux.HandleFunc("/service/roles/roles/name/", func(w http.ResponseWriter, r *http.Request) {
		if f.roleGETStatus != 0 {
			w.WriteHeader(f.roleGETStatus)
			return
		}
		name := strings.TrimPrefix(r.URL.Path, "/service/roles/roles/name/")
		if f.existingRoles[name] {
			w.WriteHeader(http.StatusOK)
			_, _ = fmt.Fprintf(w, `{"id":1,"name":%q}`, name)
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
	// GET access policy by name (upsert probe): /service/public/v2/api/service/<svc>/policy/<name>
	mux.HandleFunc("/service/public/v2/api/service/", func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(r.URL.Path, "/")
		name := parts[len(parts)-1]
		if id, ok := f.existingPolicies[name]; ok {
			w.WriteHeader(http.StatusOK)
			_, _ = fmt.Fprintf(w, `{"id":%d,"name":%q}`, id, name)
			return
		}
		w.WriteHeader(http.StatusNotFound)
	})
	// PUT access policy by id (update): /service/public/v2/api/policy/<id>
	mux.HandleFunc("/service/public/v2/api/policy/", func(w http.ResponseWriter, r *http.Request) {
		f.updatedPolicy = map[string]any{}
		_ = json.NewDecoder(r.Body).Decode(&f.updatedPolicy)
		w.WriteHeader(orDefault(f.policyWriteStatus, http.StatusOK))
	})
	// POST access policy (create).
	mux.HandleFunc("/service/plugins/policies", func(w http.ResponseWriter, r *http.Request) {
		f.createdPolicy = map[string]any{}
		_ = json.NewDecoder(r.Body).Decode(&f.createdPolicy)
		w.WriteHeader(orDefault(f.policyWriteStatus, http.StatusOK))
	})

	return httptest.NewServer(mux)
}

func orDefault(v, def int) int {
	if v != 0 {
		return v
	}
	return def
}

func (f *fakeRangerTenant) client(url string) *RangerAdminClient {
	return NewRangerAdminClient(RangerConfig{BaseURL: url, AdminUser: "admin", AdminPass: "pw"})
}

func Test_RangerAdminClient_EnsureRole_CreatesWhenMissing(t *testing.T) {
	fake := &fakeRangerTenant{existingRoles: map[string]bool{}}
	srv := fake.server()
	defer srv.Close()

	require.NoError(t, fake.client(srv.URL).EnsureRole(context.Background(), "demo_user"))
	assert.Equal(t, []string{"demo_user"}, fake.createdRoles)
}

func Test_RangerAdminClient_EnsureRole_LeavesExistingRoleUntouched(t *testing.T) {
	fake := &fakeRangerTenant{existingRoles: map[string]bool{"demo_user": true}}
	srv := fake.server()
	defer srv.Close()

	require.NoError(t, fake.client(srv.URL).EnsureRole(context.Background(), "demo_user"))
	assert.Empty(t, fake.createdRoles, "must not re-create / clobber an existing role's membership")
}

func Test_RangerAdminClient_EnsureRole_NonNotFoundStatusIsErrorNotCreate(t *testing.T) {
	fake := &fakeRangerTenant{existingRoles: map[string]bool{}, roleGETStatus: http.StatusInternalServerError}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureRole(context.Background(), "demo_user")
	require.Error(t, err, "a transient 500 on GET must not be read as 'role absent'")
	assert.Empty(t, fake.createdRoles, "must not attempt a create on a non-404 GET")
}

func Test_RangerAdminClient_EnsureAccessPolicy_CreatesWhenMissing(t *testing.T) {
	fake := &fakeRangerTenant{existingPolicies: map[string]int64{}}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureAccessPolicy(context.Background(), "sr_access_demo", []string{"demo_tenant"}, []string{"*"}, []string{"demo_user"})

	require.NoError(t, err)
	require.NotNil(t, fake.createdPolicy, "missing policy is created via POST")
	assert.Nil(t, fake.updatedPolicy, "no update when it didn't exist")
	assert.Equal(t, "sr_access_demo", fake.createdPolicy["name"])
	assert.EqualValues(t, 0, fake.createdPolicy["policyType"])
}

func Test_RangerAdminClient_EnsureAccessPolicy_UpdatesInPlaceWhenExists(t *testing.T) {
	fake := &fakeRangerTenant{existingPolicies: map[string]int64{"sr_access_demo": 7}}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureAccessPolicy(context.Background(), "sr_access_demo", []string{"demo_tenant"}, []string{"*"}, []string{"demo_user"})

	require.NoError(t, err)
	require.NotNil(t, fake.updatedPolicy, "existing policy is updated via PUT (no delete-then-create)")
	assert.Nil(t, fake.createdPolicy, "must not create when it already exists")
	assert.EqualValues(t, 7, fake.updatedPolicy["id"], "PUT targets the existing policy id")
}

func Test_RangerAdminClient_EnsureAccessPolicy_ReportsWriteError(t *testing.T) {
	fake := &fakeRangerTenant{existingPolicies: map[string]int64{}, policyWriteStatus: http.StatusInternalServerError}
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).EnsureAccessPolicy(context.Background(), "sr_access_demo", []string{"demo_tenant"}, []string{"*"}, []string{"demo_user"})
	require.Error(t, err)
	assert.Contains(t, err.Error(), "ensure access policy")
}
