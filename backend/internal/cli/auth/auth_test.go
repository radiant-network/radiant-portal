package auth

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/cli/config"
	"github.com/radiant-network/radiant-api/internal/cli/keycloak"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type fakeSource struct {
	refreshErr   error
	refreshed    *keycloak.Tokens
	device       *keycloak.DeviceAuth
	polled       *keycloak.Tokens
	pollErr      error
	refreshCalls int
	deviceCalls  int
}

func (f *fakeSource) StartDeviceAuth(context.Context) (*keycloak.DeviceAuth, error) {
	f.deviceCalls++
	return f.device, nil
}
func (f *fakeSource) PollDeviceToken(context.Context, *keycloak.DeviceAuth) (*keycloak.Tokens, error) {
	return f.polled, f.pollErr
}
func (f *fakeSource) Refresh(context.Context, string) (*keycloak.Tokens, error) {
	f.refreshCalls++
	return f.refreshed, f.refreshErr
}

var now = time.Unix(1_000_000, 0)

func token(t *testing.T, claims map[string]any) string {
	payload, err := json.Marshal(claims)
	require.NoError(t, err)
	enc := base64.RawURLEncoding.EncodeToString
	return enc([]byte(`{}`)) + "." + enc(payload) + "." + enc([]byte("s"))
}

func Test_EnsureToken_ReusesValidAccessToken(t *testing.T) {
	valid := token(t, map[string]any{"exp": float64(now.Add(time.Hour).Unix())})
	cfg := &config.Config{Tokens: config.Tokens{AccessToken: valid, RefreshToken: "rt"}}
	src := &fakeSource{}
	got, err := EnsureToken(context.Background(), cfg, src, &bytes.Buffer{}, now)
	require.NoError(t, err)
	assert.Equal(t, valid, got)
	assert.Equal(t, 0, src.refreshCalls)
	assert.Equal(t, 0, src.deviceCalls)
}

func Test_EnsureToken_RefreshesExpiredToken(t *testing.T) {
	expired := token(t, map[string]any{"exp": float64(now.Add(-time.Minute).Unix())})
	cfg := &config.Config{Tokens: config.Tokens{AccessToken: expired, RefreshToken: "rt"}}
	src := &fakeSource{refreshed: &keycloak.Tokens{AccessToken: "new-at", RefreshToken: "new-rt"}}
	got, err := EnsureToken(context.Background(), cfg, src, &bytes.Buffer{}, now)
	require.NoError(t, err)
	assert.Equal(t, "new-at", got)
	assert.Equal(t, config.Tokens{AccessToken: "new-at", RefreshToken: "new-rt"}, cfg.Tokens)
	assert.Equal(t, 0, src.deviceCalls)
}

func Test_EnsureToken_DeviceFlowWhenRefreshFails(t *testing.T) {
	polled := token(t, map[string]any{"preferred_username": "geneticist", "exp": float64(now.Add(time.Hour).Unix())})
	cfg := &config.Config{Tokens: config.Tokens{AccessToken: "garbage", RefreshToken: "stale"}}
	src := &fakeSource{
		refreshErr: keycloak.ErrInvalidGrant,
		device:     &keycloak.DeviceAuth{UserCode: "WXYZ-1234", VerificationURIComplete: "https://kc/device?user_code=WXYZ-1234", ExpiresIn: 600},
		polled:     &keycloak.Tokens{AccessToken: polled, RefreshToken: "rt2"},
	}
	var out bytes.Buffer
	got, err := EnsureToken(context.Background(), cfg, src, &out, now)
	require.NoError(t, err)
	assert.Equal(t, polled, got)
	assert.Equal(t, "rt2", cfg.Tokens.RefreshToken)
	assert.Equal(t, 1, src.refreshCalls)
	assert.Contains(t, out.String(), "Session expired")
	assert.Contains(t, out.String(), "https://kc/device?user_code=WXYZ-1234")
	assert.Contains(t, out.String(), "WXYZ-1234")
	assert.Contains(t, out.String(), "expires in 10 min")
	assert.Contains(t, out.String(), "Logged in as geneticist")
}

func Test_EnsureToken_DeviceFlowWithoutStoredTokens(t *testing.T) {
	cfg := &config.Config{}
	src := &fakeSource{device: &keycloak.DeviceAuth{}, polled: &keycloak.Tokens{AccessToken: "at"}}
	got, err := EnsureToken(context.Background(), cfg, src, &bytes.Buffer{}, now)
	require.NoError(t, err)
	assert.Equal(t, "at", got)
	assert.Equal(t, 0, src.refreshCalls, "no refresh token, must not try to refresh")
}

func Test_EnsureToken_KeepsRefreshTokenWhenPollOmitsIt(t *testing.T) {
	cfg := &config.Config{Tokens: config.Tokens{RefreshToken: "keep"}}
	src := &fakeSource{refreshErr: errors.New("down"), device: &keycloak.DeviceAuth{}, polled: &keycloak.Tokens{AccessToken: "at"}}
	_, err := EnsureToken(context.Background(), cfg, src, &bytes.Buffer{}, now)
	require.NoError(t, err)
	assert.Equal(t, "keep", cfg.Tokens.RefreshToken)
}

func Test_EnsureToken_PollError(t *testing.T) {
	cfg := &config.Config{}
	src := &fakeSource{device: &keycloak.DeviceAuth{}, pollErr: keycloak.ErrAccessDenied}
	_, err := EnsureToken(context.Background(), cfg, src, &bytes.Buffer{}, now)
	assert.ErrorIs(t, err, keycloak.ErrAccessDenied)
}
