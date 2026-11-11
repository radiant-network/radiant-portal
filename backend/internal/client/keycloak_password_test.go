package client

import (
	"context"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_PasswordGrant_SendsROPCFormAndReturnsAccessToken(t *testing.T) {
	var gotPath string
	var gotForm url.Values
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		require.NoError(t, r.ParseForm())
		gotPath, gotForm = r.URL.Path, r.PostForm
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"access_token":"tok-123","expires_in":300}`))
	}))
	defer server.Close()

	c := NewKeycloakPasswordClient(KeycloakConfig{
		BaseURL: server.URL, Realm: "radiant", ClientID: "radiant-sql", ClientSecret: "s3cret",
	})
	token, err := c.PasswordGrant(context.Background(), "alice", "hunter2")

	require.NoError(t, err)
	assert.Equal(t, "tok-123", token)
	assert.Equal(t, "/realms/radiant/protocol/openid-connect/token", gotPath)
	assert.Equal(t, "password", gotForm.Get("grant_type"))
	assert.Equal(t, "radiant-sql", gotForm.Get("client_id"))
	assert.Equal(t, "s3cret", gotForm.Get("client_secret"))
	assert.Equal(t, "alice", gotForm.Get("username"))
	assert.Equal(t, "hunter2", gotForm.Get("password"))
}

func Test_PasswordGrant_OmitsClientSecretForAPublicClient(t *testing.T) {
	var gotForm url.Values
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		require.NoError(t, r.ParseForm())
		gotForm = r.PostForm
		_, _ = w.Write([]byte(`{"access_token":"tok-123"}`))
	}))
	defer server.Close()

	c := NewKeycloakPasswordClient(KeycloakConfig{BaseURL: server.URL, Realm: "radiant", ClientID: "radiant-sql"})
	_, err := c.PasswordGrant(context.Background(), "alice", "hunter2")

	require.NoError(t, err)
	_, present := gotForm["client_secret"]
	assert.False(t, present, "a public client must not send an empty client_secret")
}

func Test_PasswordGrant_SurfacesKeycloakErrorBody(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusUnauthorized)
		_, _ = w.Write([]byte(`{"error":"unauthorized_client"}`))
	}))
	defer server.Close()

	c := NewKeycloakPasswordClient(KeycloakConfig{BaseURL: server.URL, Realm: "radiant", ClientID: "radiant-sql"})
	_, err := c.PasswordGrant(context.Background(), "alice", "hunter2")

	// Config-level reasons must reach the operator's logs; PasswordExchange is what keeps
	// them away from the end user.
	assert.ErrorContains(t, err, "HTTP 401")
	assert.ErrorContains(t, err, "unauthorized_client")
}

func Test_PasswordGrant_RejectsResponseWithoutAccessToken(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte(`{"expires_in":300}`))
	}))
	defer server.Close()

	c := NewKeycloakPasswordClient(KeycloakConfig{BaseURL: server.URL, Realm: "radiant", ClientID: "radiant-sql"})
	_, err := c.PasswordGrant(context.Background(), "alice", "hunter2")

	assert.ErrorContains(t, err, "no access_token")
}
