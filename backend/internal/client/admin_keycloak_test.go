package client

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// fakeKeycloak is a minimal stateful stand-in for the Keycloak admin REST API.
type fakeKeycloak struct {
	realm           string
	usersByEmail    map[string]string // email -> id (the sub)
	nextID          string
	tokenStatus     int  // override token endpoint status (0 => 200)
	createStatus    int  // override create status (0 => 201)
	duplicateSearch bool // return two rows for the searched email
	created         int
	updated         int
	passwordSets    int
	groupsByName    map[string]string // name -> id
	groupAdds       [][2]string       // {userID, groupID}

	lastUpdatedID         string // id addressed by the last user update
	lastUpdateBody        map[string]any
	lastPasswordTemporary bool       // "temporary" field of the last reset-password credential
	lastTokenForm         url.Values // form of the last token request
}

func newFakeKeycloak(realm string) *fakeKeycloak {
	return &fakeKeycloak{
		realm:        realm,
		usersByEmail: map[string]string{},
		groupsByName: map[string]string{},
		nextID:       "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
	}
}

func (f *fakeKeycloak) server() *httptest.Server {
	mux := http.NewServeMux()

	mux.HandleFunc("/realms/"+f.realm+"/protocol/openid-connect/token", func(w http.ResponseWriter, r *http.Request) {
		_ = r.ParseForm()
		f.lastTokenForm = r.PostForm
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
			email := r.URL.Query().Get("email")
			id, ok := f.usersByEmail[email]
			out := []map[string]string{}
			if ok {
				out = append(out, map[string]string{"id": id, "email": email})
				if f.duplicateSearch {
					out = append(out, map[string]string{"id": id + "-dup", "email": email})
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
			f.usersByEmail[u["email"].(string)] = f.nextID
			f.created++
			w.WriteHeader(http.StatusCreated)
		}
	})

	// The search endpoint matches substrings, so the fake does too — the client is
	// responsible for re-checking the name exactly.
	mux.HandleFunc("/admin/realms/"+f.realm+"/groups", func(w http.ResponseWriter, r *http.Request) {
		search := r.URL.Query().Get("search")
		out := []map[string]string{}
		for name, id := range f.groupsByName {
			if strings.Contains(name, search) {
				out = append(out, map[string]string{"id": id, "name": name})
			}
		}
		_ = json.NewEncoder(w).Encode(out)
	})

	// PUT /users/{id}, /users/{id}/reset-password and /users/{id}/groups/{groupId}
	mux.HandleFunc(usersPath+"/", func(w http.ResponseWriter, r *http.Request) {
		rest := strings.TrimPrefix(r.URL.Path, usersPath+"/")
		userID, sub, _ := strings.Cut(rest, "/")
		switch {
		case sub == "reset-password":
			f.passwordSets++
			var cred map[string]any
			_ = json.NewDecoder(r.Body).Decode(&cred)
			f.lastPasswordTemporary, _ = cred["temporary"].(bool)
		case strings.HasPrefix(sub, "groups/"):
			f.groupAdds = append(f.groupAdds, [2]string{userID, strings.TrimPrefix(sub, "groups/")})
		default:
			f.updated++
			f.lastUpdatedID = userID
			_ = json.NewDecoder(r.Body).Decode(&f.lastUpdateBody)
		}
		w.WriteHeader(http.StatusNoContent)
	})

	return httptest.NewServer(mux)
}

func (f *fakeKeycloak) clientWithGroup(url, group string) *KeycloakAdminClient {
	return NewKeycloakAdminClient(KeycloakConfig{
		BaseURL: url, Realm: f.realm, ClientID: "radiant-admin-cli", ClientSecret: "s3cret",
		DefaultGroup: group,
	})
}

func (f *fakeKeycloak) client(url string) *KeycloakAdminClient {
	return NewKeycloakAdminClient(KeycloakConfig{
		BaseURL: url, Realm: f.realm, ClientID: "radiant-admin-cli", ClientSecret: "s3cret",
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

func Test_KeycloakAdminClient_UpsertUser_ForcesPasswordResetOnFirstLogin(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	srv := fake.server()
	defer srv.Close()

	_, err := fake.client(srv.URL).UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "pw")

	require.NoError(t, err)
	assert.Equal(t, 1, fake.passwordSets)
	assert.True(t, fake.lastPasswordTemporary, "a set password is temporary so Keycloak forces a reset at first login")
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
	fake.usersByEmail["alice@demo.org"] = "existing-1111-2222-3333-444444444444"
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

func Test_KeycloakAdminClient_UpsertUser_UsesClientCredentialsGrant(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	srv := fake.server()
	defer srv.Close()

	_, err := fake.client(srv.URL).UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "pw")

	require.NoError(t, err)
	assert.Equal(t, "client_credentials", fake.lastTokenForm.Get("grant_type"))
	assert.Equal(t, "radiant-admin-cli", fake.lastTokenForm.Get("client_id"))
	assert.Equal(t, "s3cret", fake.lastTokenForm.Get("client_secret"))
	assert.Empty(t, fake.lastTokenForm.Get("username"), "a service account sends no username")
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
	fake.usersByEmail["alice@demo.org"] = "existing-id"
	fake.duplicateSearch = true
	srv := fake.server()
	defer srv.Close()

	sub, err := fake.client(srv.URL).UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "pw")

	require.Error(t, err)
	assert.Empty(t, sub)
	assert.Contains(t, err.Error(), "expected at most 1 exact match")
}

func Test_KeycloakAdminClient_UpsertUser_AddsUserToDefaultGroup(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	fake.groupsByName["portal-users"] = "group-1111"
	srv := fake.server()
	defer srv.Close()

	sub, err := fake.clientWithGroup(srv.URL, "portal-users").UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "")

	require.NoError(t, err)
	assert.Equal(t, [][2]string{{sub, "group-1111"}}, fake.groupAdds)
}

func Test_KeycloakAdminClient_UpsertUser_PicksTheExactlyNamedGroup(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	fake.groupsByName["portal-users"] = "group-1111"
	fake.groupsByName["portal-users-readonly"] = "group-2222"
	srv := fake.server()
	defer srv.Close()

	_, err := fake.clientWithGroup(srv.URL, "portal-users").UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "")

	require.NoError(t, err)
	require.Len(t, fake.groupAdds, 1)
	assert.Equal(t, "group-1111", fake.groupAdds[0][1], "the substring match must not win over the exact name")
}

func Test_KeycloakAdminClient_UpsertUser_SkipsGroupWhenUnconfigured(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	fake.groupsByName["portal-users"] = "group-1111"
	srv := fake.server()
	defer srv.Close()

	_, err := fake.client(srv.URL).UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "")

	require.NoError(t, err)
	assert.Empty(t, fake.groupAdds, "no group is joined when KEYCLOAK_DEFAULT_GROUP is unset")
}

func Test_KeycloakAdminClient_UpsertUser_MissingDefaultGroupIsReported(t *testing.T) {
	fake := newFakeKeycloak("CQDG")
	srv := fake.server()
	defer srv.Close()

	_, err := fake.clientWithGroup(srv.URL, "portal-users").UpsertUser(context.Background(), "alice", "alice@demo.org", "Alice", "Demo", "")

	require.Error(t, err)
	assert.Contains(t, err.Error(), `group "portal-users" not found`)
	assert.Empty(t, fake.groupAdds)
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

func Test_KeycloakAdminClient_UpdateUserName_SendsOnlyTheNameAttributes(t *testing.T) {
	fake := newFakeKeycloak("radiant")
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).UpdateUserName(context.Background(), "the-sub", "Grace", "Chen")

	require.NoError(t, err)
	assert.Equal(t, "the-sub", fake.lastUpdatedID, "the sub addresses the account directly")
	assert.Equal(t, map[string]any{"firstName": "Grace", "lastName": "Chen"}, fake.lastUpdateBody,
		"a fuller representation would reset enabled and the required actions")
}

func Test_KeycloakAdminClient_UpdateUserName_TokenFailureIsReported(t *testing.T) {
	fake := newFakeKeycloak("radiant")
	fake.tokenStatus = http.StatusUnauthorized
	srv := fake.server()
	defer srv.Close()

	err := fake.client(srv.URL).UpdateUserName(context.Background(), "the-sub", "Grace", "Chen")

	require.Error(t, err)
	assert.Equal(t, 0, fake.updated)
}
