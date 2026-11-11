package keycloak

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestClient(t *testing.T, handler http.HandlerFunc) (*Client, *[]time.Duration) {
	srv := httptest.NewServer(handler)
	t.Cleanup(srv.Close)
	var sleeps []time.Duration
	c := New(Config{BaseURL: srv.URL, Realm: "qlin", ClientID: "radiant-client-cli"})
	c.sleep = func(d time.Duration) { sleeps = append(sleeps, d) }
	return c, &sleeps
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func makeToken(t *testing.T, claims map[string]any) string {
	payload, err := json.Marshal(claims)
	require.NoError(t, err)
	enc := base64.RawURLEncoding.EncodeToString
	return enc([]byte(`{"alg":"RS256"}`)) + "." + enc(payload) + "." + enc([]byte("sig"))
}

func Test_StartDeviceAuth_Success(t *testing.T) {
	c, _ := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "/realms/qlin/protocol/openid-connect/auth/device", r.URL.Path)
		require.NoError(t, r.ParseForm())
		assert.Equal(t, "radiant-client-cli", r.Form.Get("client_id"))
		writeJSON(w, 200, map[string]any{"device_code": "dev", "user_code": "ABCD-EFGH", "verification_uri_complete": "https://kc/device?user_code=ABCD-EFGH", "expires_in": 600, "interval": 5})
	})
	da, err := c.StartDeviceAuth(context.Background())
	require.NoError(t, err)
	assert.Equal(t, "dev", da.DeviceCode)
	assert.Equal(t, "ABCD-EFGH", da.UserCode)
	assert.Equal(t, 5, da.Interval)
}

func Test_StartDeviceAuth_UnknownClient(t *testing.T) {
	c, _ := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 401, map[string]any{"error": "invalid_client"})
	})
	_, err := c.StartDeviceAuth(context.Background())
	assert.ErrorContains(t, err, "HTTP 401")
	assert.ErrorContains(t, err, "invalid_client")
}

func Test_PollDeviceToken_PendingThenSuccess(t *testing.T) {
	var calls atomic.Int32
	c, sleeps := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		require.NoError(t, r.ParseForm())
		assert.Equal(t, "urn:ietf:params:oauth:grant-type:device_code", r.Form.Get("grant_type"))
		assert.Equal(t, "dev", r.Form.Get("device_code"))
		if calls.Add(1) < 3 {
			writeJSON(w, 400, map[string]any{"error": "authorization_pending"})
			return
		}
		writeJSON(w, 200, map[string]any{"access_token": "at", "refresh_token": "rt"})
	})
	tokens, err := c.PollDeviceToken(context.Background(), &DeviceAuth{DeviceCode: "dev", ExpiresIn: 600, Interval: 5})
	require.NoError(t, err)
	assert.Equal(t, &Tokens{AccessToken: "at", RefreshToken: "rt"}, tokens)
	assert.Equal(t, []time.Duration{5 * time.Second, 5 * time.Second, 5 * time.Second}, *sleeps)
}

func Test_PollDeviceToken_SlowDownIncreasesInterval(t *testing.T) {
	var calls atomic.Int32
	c, sleeps := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		if calls.Add(1) == 1 {
			writeJSON(w, 400, map[string]any{"error": "slow_down"})
			return
		}
		writeJSON(w, 200, map[string]any{"access_token": "at"})
	})
	_, err := c.PollDeviceToken(context.Background(), &DeviceAuth{DeviceCode: "dev", ExpiresIn: 600, Interval: 5})
	require.NoError(t, err)
	assert.Equal(t, []time.Duration{5 * time.Second, 10 * time.Second}, *sleeps)
}

func Test_PollDeviceToken_ExpiredToken(t *testing.T) {
	c, _ := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 400, map[string]any{"error": "expired_token"})
	})
	_, err := c.PollDeviceToken(context.Background(), &DeviceAuth{DeviceCode: "dev", ExpiresIn: 600})
	assert.ErrorIs(t, err, ErrDeviceCodeExpired)
}

func Test_PollDeviceToken_AccessDenied(t *testing.T) {
	c, _ := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 400, map[string]any{"error": "access_denied"})
	})
	_, err := c.PollDeviceToken(context.Background(), &DeviceAuth{DeviceCode: "dev", ExpiresIn: 600})
	assert.ErrorIs(t, err, ErrAccessDenied)
}

func Test_PollDeviceToken_DeadlineReached(t *testing.T) {
	c, _ := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 400, map[string]any{"error": "authorization_pending"})
	})
	start := time.Now()
	clock := start
	c.now = func() time.Time { return clock }
	c.sleep = func(d time.Duration) { clock = clock.Add(d) }
	_, err := c.PollDeviceToken(context.Background(), &DeviceAuth{DeviceCode: "dev", ExpiresIn: 12, Interval: 5})
	assert.ErrorIs(t, err, ErrDeviceCodeExpired)
}

func Test_PollDeviceToken_ContextCancelled(t *testing.T) {
	c, _ := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 400, map[string]any{"error": "authorization_pending"})
	})
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	_, err := c.PollDeviceToken(ctx, &DeviceAuth{DeviceCode: "dev", ExpiresIn: 600})
	assert.ErrorIs(t, err, context.Canceled)
}

func Test_Refresh_Success(t *testing.T) {
	c, _ := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		require.NoError(t, r.ParseForm())
		assert.Equal(t, "refresh_token", r.Form.Get("grant_type"))
		assert.Equal(t, "old", r.Form.Get("refresh_token"))
		writeJSON(w, 200, map[string]any{"access_token": "at2", "refresh_token": "rt2"})
	})
	tokens, err := c.Refresh(context.Background(), "old")
	require.NoError(t, err)
	assert.Equal(t, "at2", tokens.AccessToken)
}

func Test_Refresh_InvalidGrant(t *testing.T) {
	c, _ := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 400, map[string]any{"error": "invalid_grant", "error_description": "Token is not active"})
	})
	_, err := c.Refresh(context.Background(), "old")
	assert.ErrorIs(t, err, ErrInvalidGrant)
	assert.ErrorContains(t, err, "Token is not active")
}

func Test_Refresh_ServerError(t *testing.T) {
	c, _ := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "boom", 500)
	})
	_, err := c.Refresh(context.Background(), "old")
	assert.ErrorContains(t, err, "HTTP 500")
}

func Test_Claims_ReadsUsername(t *testing.T) {
	token := makeToken(t, map[string]any{"preferred_username": "geneticist", "exp": 1})
	claims, err := Claims(token)
	require.NoError(t, err)
	assert.Equal(t, "geneticist", claims["preferred_username"])
}

func Test_Claims_Malformed(t *testing.T) {
	_, err := Claims("not-a-jwt")
	assert.ErrorContains(t, err, "malformed token")
}

func Test_AccessTokenValid_FutureExp(t *testing.T) {
	now := time.Unix(1_000_000, 0)
	token := makeToken(t, map[string]any{"exp": float64(now.Add(time.Hour).Unix())})
	assert.True(t, AccessTokenValid(token, now, 15*time.Second))
}

func Test_AccessTokenValid_ExpiredWithinSlack(t *testing.T) {
	now := time.Unix(1_000_000, 0)
	token := makeToken(t, map[string]any{"exp": float64(now.Add(10 * time.Second).Unix())})
	assert.False(t, AccessTokenValid(token, now, 15*time.Second))
}

func Test_AccessTokenValid_NoExp(t *testing.T) {
	token := makeToken(t, map[string]any{"sub": "x"})
	assert.False(t, AccessTokenValid(token, time.Now(), 0))
}

func Test_AccessTokenValid_Malformed(t *testing.T) {
	assert.False(t, AccessTokenValid("", time.Now(), 0))
	assert.False(t, AccessTokenValid(fmt.Sprintf("a.%s.c", "!!!"), time.Now(), 0))
}
