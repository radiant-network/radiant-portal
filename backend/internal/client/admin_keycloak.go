package client

import (
	"bytes"
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

// KeycloakConfig points the admin client at a realm and the bootstrap admin used
// to manage it. Mirrors the values 00_keycloak_users.sh relied on.
type KeycloakConfig struct {
	BaseURL   string // e.g. http://localhost:8080
	Realm     string // realm the users live in, e.g. CQDG
	AdminUser string // a fully-set-up admin (kcadmin), NOT the temporary bootstrap admin
	AdminPass string
}

// KeycloakConfigFromEnv builds a KeycloakConfig from the environment, defaulting
// to the local compose stack. KEYCLOAK_HOST/REALM match the backend's own config;
// KC_ADMIN_USER/PASS match the admin seeded by master.json.
func KeycloakConfigFromEnv() KeycloakConfig {
	return KeycloakConfig{
		BaseURL:   os.Getenv("KEYCLOAK_HOST"),
		Realm:     os.Getenv("KEYCLOAK_REALM"),
		AdminUser: os.Getenv("KEYCLOAK_ADMIN_USER"),
		AdminPass: os.Getenv("KEYCLOAK_ADMIN_PASS"),
	}
}

// KeycloakAdminClient talks to the Keycloak Admin REST API with stdlib net/http.
type KeycloakAdminClient struct {
	cfg        KeycloakConfig
	httpClient *http.Client
}

func NewKeycloakAdminClient(cfg KeycloakConfig) *KeycloakAdminClient {
	return &KeycloakAdminClient{
		cfg:        cfg,
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

type keycloakUser struct {
	ID              string   `json:"id,omitempty"`
	Username        string   `json:"username"`
	Email           string   `json:"email"`
	FirstName       string   `json:"firstName"`
	LastName        string   `json:"lastName"`
	Enabled         bool     `json:"enabled"`
	EmailVerified   bool     `json:"emailVerified"`
	RequiredActions []string `json:"requiredActions"`
}

// UpsertUser creates or updates the user and returns the Keycloak user id — which
// is exactly the `sub` claim of any token it later mints. Idempotent: an existing
// user is updated in place.
//
// password is optional: a non-empty value is (re)set as a temporary password —
// Keycloak adds the UPDATE_PASSWORD required action so the user must choose their
// own password at first login. An empty value skips the password step entirely,
// for realms that delegate authentication to an external IdP and therefore have no
// local credential.
//
// firstName/lastName are sent non-empty by callers because the Keycloak
// user-profile feature otherwise injects a VERIFY_PROFILE required action that
// breaks headless (ROPC) login.
func (c *KeycloakAdminClient) UpsertUser(ctx context.Context, username, email, firstName, lastName, password string) (string, error) {
	token, err := c.adminToken(ctx)
	if err != nil {
		return "", err
	}

	user := keycloakUser{
		Username:        username,
		Email:           email,
		FirstName:       firstName,
		LastName:        lastName,
		Enabled:         true,
		EmailVerified:   true,
		RequiredActions: []string{},
	}

	// Match on email, not username: a pre-existing user may have been provisioned
	// with a username that differs from its email (the realm need not enforce
	// email-as-username), so email is the reliable identity key.
	id, err := c.findUserIDByEmail(ctx, token, email)
	if err != nil {
		return "", err
	}
	if id == "" {
		if err := c.createUser(ctx, token, user); err != nil {
			return "", err
		}
		if id, err = c.findUserIDByEmail(ctx, token, email); err != nil {
			return "", err
		}
		if id == "" {
			return "", fmt.Errorf("user %q not found after create", email)
		}
	} else {
		if err := c.updateUser(ctx, token, id, user); err != nil {
			return "", err
		}
	}

	// An empty password means the realm authenticates via an external IdP, so there
	// is no local credential to set.
	if password != "" {
		if err := c.resetPassword(ctx, token, id, password); err != nil {
			return "", err
		}
	}
	return id, nil
}

// adminToken fetches an access token for the admin via the ROPC flow against the
// master realm (admin-cli client), as the bash script did.
func (c *KeycloakAdminClient) adminToken(ctx context.Context) (string, error) {
	form := url.Values{
		"client_id":  {"admin-cli"},
		"username":   {c.cfg.AdminUser},
		"password":   {c.cfg.AdminPass},
		"grant_type": {"password"},
	}
	endpoint := fmt.Sprintf("%s/realms/master/protocol/openid-connect/token", c.cfg.BaseURL)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, strings.NewReader(form.Encode()))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer func() { _ = resp.Body.Close() }()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("admin token request failed: HTTP %d: %s", resp.StatusCode, string(body))
	}
	var parsed struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(body, &parsed); err != nil {
		return "", fmt.Errorf("parse admin token: %w", err)
	}
	if parsed.AccessToken == "" {
		return "", fmt.Errorf("admin token response had no access_token")
	}
	return parsed.AccessToken, nil
}

// findUserIDByEmail returns the id of the user with an exact email match, or "" if none.
func (c *KeycloakAdminClient) findUserIDByEmail(ctx context.Context, token, email string) (string, error) {
	endpoint := fmt.Sprintf("%s/admin/realms/%s/users?email=%s&exact=true",
		c.cfg.BaseURL, c.cfg.Realm, url.QueryEscape(email))
	status, body, err := c.adminRequest(ctx, http.MethodGet, endpoint, token, nil)
	if err != nil {
		return "", err
	}
	if status != http.StatusOK {
		return "", fmt.Errorf("find user %q failed: HTTP %d: %s", email, status, string(body))
	}
	var users []keycloakUser
	if err := json.Unmarshal(body, &users); err != nil {
		return "", fmt.Errorf("parse user search for %q: %w", email, err)
	}
	if len(users) == 0 {
		return "", nil
	}
	if len(users) > 1 {
		return "", fmt.Errorf("find user %q: expected at most 1 exact match, got %d", email, len(users))
	}
	return users[0].ID, nil
}

func (c *KeycloakAdminClient) createUser(ctx context.Context, token string, user keycloakUser) error {
	endpoint := fmt.Sprintf("%s/admin/realms/%s/users", c.cfg.BaseURL, c.cfg.Realm)
	status, body, err := c.adminRequest(ctx, http.MethodPost, endpoint, token, user)
	if err != nil {
		return err
	}
	if status != http.StatusCreated && status != http.StatusConflict {
		return fmt.Errorf("create user %q failed: HTTP %d: %s", user.Username, status, string(body))
	}
	return nil
}

func (c *KeycloakAdminClient) updateUser(ctx context.Context, token, id string, user keycloakUser) error {
	endpoint := fmt.Sprintf("%s/admin/realms/%s/users/%s", c.cfg.BaseURL, c.cfg.Realm, id)
	status, body, err := c.adminRequest(ctx, http.MethodPut, endpoint, token, user)
	if err != nil {
		return err
	}
	if status != http.StatusNoContent && status != http.StatusOK {
		return fmt.Errorf("update user %q failed: HTTP %d: %s", user.Username, status, string(body))
	}
	return nil
}

func (c *KeycloakAdminClient) resetPassword(ctx context.Context, token, id, password string) error {
	endpoint := fmt.Sprintf("%s/admin/realms/%s/users/%s/reset-password", c.cfg.BaseURL, c.cfg.Realm, id)
	// temporary:true makes Keycloak add the UPDATE_PASSWORD required action, forcing
	// the user to set their own password at first login.
	cred := map[string]any{"type": "password", "value": password, "temporary": true}
	status, body, err := c.adminRequest(ctx, http.MethodPut, endpoint, token, cred)
	if err != nil {
		return err
	}
	if status != http.StatusNoContent && status != http.StatusOK {
		return fmt.Errorf("reset password failed: HTTP %d: %s", status, string(body))
	}
	return nil
}

// adminRequest issues a bearer-authenticated admin request, JSON-encoding body when
// non-nil, and returns the HTTP status code plus the raw body bytes. The response body
// is fully read and closed before returning, so callers never hold an open body.
func (c *KeycloakAdminClient) adminRequest(ctx context.Context, method, endpoint, token string, body any) (int, []byte, error) {
	var reader io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return 0, nil, err
		}
		reader = bytes.NewReader(data)
	}
	req, err := http.NewRequestWithContext(ctx, method, endpoint, reader)
	if err != nil {
		return 0, nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return 0, nil, err
	}
	defer func() { _ = resp.Body.Close() }()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, nil, err
	}
	return resp.StatusCode, data, nil
}
