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

// fakeKeycloak is a minimal stateful stand-in for the Keycloak admin REST API.
type fakeKeycloak struct {
	realm           string
	usersByName     map[string]string // username -> id (the sub)
	nextID          string
	tokenStatus     int  // override token endpoint status (0 => 200)
	createStatus    int  // override create status (0 => 201)
	duplicateSearch bool // return two rows for the searched username
	created         int
	updated         int
	passwordSets    int
}

func newFakeKeycloak(realm string) *fakeKeycloak {
	return &fakeKeycloak{
		realm:       realm,
		usersByName: map[string]string{},
		nextID:      "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
	}
}

func (f *fakeKeycloak) server() *httptest.Server {
	mux := http.NewServeMux()

	mux.HandleFunc("/realms/master/protocol/openid-connect/token", func(w http.ResponseWriter, r *http.Request) {
		if f.tokenStatus != 0 {
			w.WriteHeader(f.tokenStatus)
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]string{"access_token": "fake-admin-token"})
	})

	usersPath := "/admin/realms/" + f.realm + "/users"
	mux.HandleFunc(usersPath, func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			username := r.URL.Query().Get("username")
			id, ok := f.usersByName[username]
			out := []map[string]string{}
			if ok {
				out = append(out, map[string]string{"id": id, "username": username})
				if f.duplicateSearch {
					out = append(out, map[string]string{"id": id + "-dup", "username": username})
				}
			}
			_ = json.NewEncoder(w).Encode(out)
		case http.MethodPost:
			if f.createStatus != 0 {
				w.WriteHeader(f.createStatus)
				return
			}
			var u map[string]any
			_ = json.NewDecoder(r.Body).Decode(&u)
			f.usersByName[u["username"].(string)] = f.nextID
			f.created++
			w.WriteHeader(http.StatusCreated)
		}
	})

	// PUT /users/{id} and /users/{id}/reset-password
	mux.HandleFunc(usersPath+"/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/reset-password") {
			f.passwordSets++
		} else {
			f.updated++
		}
		w.WriteHeader(http.StatusNoContent)
	})

	return httptest.NewServer(mux)
}

func (f *fakeKeycloak) client(url string) *KeycloakAdminClient {
	return NewKeycloakAdminClient(KeycloakConfig{
		BaseURL: url, Realm: f.realm, AdminUser: "kcadmin", AdminPass: "admin",
	})
}

func Test_KeycloakAdminClient_UpsertUser_CreatesNewUserAndReturnsSub(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	srv := fake.server()
	defer srv.Close()

	sub, err := fake.client(srv.URL).UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "pw")

	require.NoError(t, err)
	assert.Equal(t, fake.nextID, sub)
	assert.Equal(t, 1, fake.created)
	assert.Equal(t, 0, fake.updated)
	assert.Equal(t, 1, fake.passwordSets)
}

func Test_KeycloakAdminClient_UpsertUser_SkipsPasswordWhenEmpty(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	srv := fake.server()
	defer srv.Close()

	// An external-IdP realm: no local password, so the password step is skipped.
	sub, err := fake.client(srv.URL).UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "")

	require.NoError(t, err)
	assert.Equal(t, fake.nextID, sub)
	assert.Equal(t, 1, fake.created)
	assert.Equal(t, 0, fake.passwordSets, "no password is set when none is provided")
}

func Test_KeycloakAdminClient_UpsertUser_UpdatesExistingUser(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	fake.usersByName["alice"] = "existing-1111-2222-3333-444444444444"
	srv := fake.server()
	defer srv.Close()

	sub, err := fake.client(srv.URL).UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "pw")

	require.NoError(t, err)
	assert.Equal(t, "existing-1111-2222-3333-444444444444", sub)
	assert.Equal(t, 0, fake.created)
	assert.Equal(t, 1, fake.updated)
	assert.Equal(t, 1, fake.passwordSets)
}

func Test_KeycloakAdminClient_UpsertUser_IsIdempotent(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	srv := fake.server()
	defer srv.Close()
	client := fake.client(srv.URL)

	sub1, err := client.UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "pw")
	require.NoError(t, err)
	sub2, err := client.UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "pw")
	require.NoError(t, err)

	assert.Equal(t, sub1, sub2, "re-run converges to the same sub")
	assert.Equal(t, 1, fake.created)
	assert.Equal(t, 1, fake.updated, "second run updates rather than re-creates")
}

func Test_KeycloakAdminClient_UpsertUser_TokenFailureIsReported(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	fake.tokenStatus = http.StatusUnauthorized
	srv := fake.server()
	defer srv.Close()

	_, err := fake.client(srv.URL).UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "pw")

	require.Error(t, err)
	assert.Contains(t, err.Error(), "admin token request failed")
}

func Test_KeycloakAdminClient_UpsertUser_AmbiguousSearchIsReported(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	fake.usersByName["alice"] = "existing-id"
	fake.duplicateSearch = true
	srv := fake.server()
	defer srv.Close()

	sub, err := fake.client(srv.URL).UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "pw")

	require.Error(t, err)
	assert.Empty(t, sub)
	assert.Contains(t, err.Error(), "expected at most 1 exact match")
}

func Test_KeycloakAdminClient_UpsertUser_CreateFailureIsReported(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	fake.createStatus = http.StatusInternalServerError
	srv := fake.server()
	defer srv.Close()

	_, err := fake.client(srv.URL).UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "pw")

	require.Error(t, err)
	assert.Contains(t, err.Error(), "create user")
}
