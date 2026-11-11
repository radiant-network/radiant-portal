package api

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestClient(t *testing.T, handler http.HandlerFunc) *Client {
	srv := httptest.NewServer(handler)
	t.Cleanup(srv.Close)
	c := New(srv.URL + "/")
	c.Token = func(context.Context) (string, error) { return "tok", nil }
	return c
}

func Test_GetConfig_Success(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "/config", r.URL.Path)
		assert.Empty(t, r.Header.Get("Authorization"))
		_, _ = w.Write([]byte(`{"auth":{"method":"device","keycloak_url":"https://auth","realm":"qlin","client_id":"radiant-client-cli"}}`))
	})
	cc, err := c.GetConfig(context.Background())
	require.NoError(t, err)
	assert.Equal(t, "device", cc.Auth.Method)
	assert.Equal(t, "https://auth", cc.Auth.KeycloakURL)
	assert.Equal(t, "qlin", cc.Auth.Realm)
	assert.Equal(t, "radiant-client-cli", cc.Auth.ClientID)
}

func Test_GetConfig_ServerError(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(502) })
	_, err := c.GetConfig(context.Background())
	assert.ErrorContains(t, err, "HTTP 502")
}

func Test_DownloadURL_Success(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "/qlin/documents/273/download_url", r.URL.Path)
		assert.Equal(t, "Bearer tok", r.Header.Get("Authorization"))
		_, _ = w.Write([]byte(`{"url":"https://s3/bucket/key?sig=1","expires_at":1788451424}`))
	})
	ps, err := c.DownloadURL(context.Background(), "qlin", 273)
	require.NoError(t, err)
	assert.Equal(t, "https://s3/bucket/key?sig=1", ps.URL)
	assert.Equal(t, int64(1788451424), ps.ExpiresAt)
}

func Test_DownloadURL_EscapesTenant(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "/a%2Fb/documents/1/download_url", r.URL.EscapedPath())
		_, _ = w.Write([]byte(`{"url":"u","expires_at":1}`))
	})
	_, err := c.DownloadURL(context.Background(), "a/b", 1)
	require.NoError(t, err)
}

func Test_DownloadURL_Unauthorized(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(401) })
	_, err := c.DownloadURL(context.Background(), "qlin", 1)
	assert.ErrorIs(t, err, ErrUnauthorized)
}

func Test_DownloadURL_Forbidden(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(403) })
	_, err := c.DownloadURL(context.Background(), "qlin", 1)
	assert.ErrorIs(t, err, ErrForbidden)
}

func Test_DownloadURL_NotFound(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(404) })
	_, err := c.DownloadURL(context.Background(), "qlin", 1)
	assert.ErrorIs(t, err, ErrNotFound)
}

func Test_DownloadURL_EmptyURL(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) { _, _ = w.Write([]byte(`{}`)) })
	_, err := c.DownloadURL(context.Background(), "qlin", 1)
	assert.ErrorContains(t, err, "no url")
}

func Test_DownloadURL_TokenError(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) { t.Fatal("must not be called") })
	c.Token = func(context.Context) (string, error) { return "", assert.AnError }
	_, err := c.DownloadURL(context.Background(), "qlin", 1)
	assert.ErrorIs(t, err, assert.AnError)
}
