package client

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

// KeycloakPasswordClient exchanges an end user's username and password for an access token
// via the OAuth2 password grant (ROPC). It exists for the SQL gateway, where a MySQL client
// can only offer a password and the proxy must turn that into the JWT StarRocks expects.
//
// ROPC cannot satisfy an interactive step, so a realm that requires OTP/MFA for these users
// will reject it with invalid_grant — the same constraint that pushed the admin client onto
// client_credentials (see KeycloakConfig).
type KeycloakPasswordClient struct {
	cfg        KeycloakConfig
	httpClient *http.Client
}

func NewKeycloakPasswordClient(cfg KeycloakConfig) *KeycloakPasswordClient {
	return &KeycloakPasswordClient{
		cfg:        cfg,
		httpClient: &http.Client{Timeout: 15 * time.Second},
	}
}

// KeycloakPasswordConfigFromEnv builds the config for the end-user-facing client. It shares
// KEYCLOAK_HOST/REALM with the rest of the backend but takes its own client id/secret:
// this must NOT be the admin service-account client, and should be a client whose tokens
// carry the audience the StarRocks users require.
func KeycloakPasswordConfigFromEnv() KeycloakConfig {
	return KeycloakConfig{
		BaseURL:      os.Getenv("KEYCLOAK_HOST"),
		Realm:        os.Getenv("KEYCLOAK_REALM"),
		ClientID:     os.Getenv("KEYCLOAK_CLIENT_ID"),
		ClientSecret: os.Getenv("KEYCLOAK_CLIENT_SECRET"),
	}
}

func (c *KeycloakPasswordClient) PasswordGrant(ctx context.Context, username, password string) (string, error) {
	form := url.Values{
		"grant_type": {"password"},
		"client_id":  {c.cfg.ClientID},
		"scope":      {"openid"},
		"username":   {username},
		"password":   {password},
	}
	if c.cfg.ClientSecret != "" {
		form.Set("client_secret", c.cfg.ClientSecret)
	}
	endpoint := fmt.Sprintf("%s/realms/%s/protocol/openid-connect/token", c.cfg.BaseURL, c.cfg.Realm)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, strings.NewReader(form.Encode()))
	if err != nil {
		return "", fmt.Errorf("build token request: %w", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("token request: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return "", fmt.Errorf("read token response: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		// Keycloak's error body names the reason (invalid_grant, unauthorized_client, ...).
		// Safe to include: it describes the client/realm config, never the password.
		return "", fmt.Errorf("token request failed: HTTP %d: %s", resp.StatusCode, strings.TrimSpace(string(body)))
	}
	var payload struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return "", fmt.Errorf("parse token response: %w", err)
	}
	if payload.AccessToken == "" {
		return "", fmt.Errorf("token response had no access_token")
	}
	return payload.AccessToken, nil
}
