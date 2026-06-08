package client

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/radiant-network/radiant-api/internal/utils"
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
		BaseURL:   utils.GetEnvOrDefault("KEYCLOAK_HOST", "http://localhost:8080"),
		Realm:     utils.GetEnvOrDefault("KEYCLOAK_REALM", "CQDG"),
		AdminUser: utils.GetEnvOrDefault("KC_ADMIN_USER", "kcadmin"),
		AdminPass: utils.GetEnvOrDefault("KC_ADMIN_PASS", "admin"),
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
// password is optional: a non-empty value is (re)set as a permanent password; an
// empty value skips the password step entirely, for realms that delegate
// authentication to an external IdP and therefore have no local credential.
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

	id, err := c.findUserID(ctx, token, username)
	if err != nil {
		return "", err
	}
	if id == "" {
		if err := c.createUser(ctx, token, user); err != nil {
			return "", err
		}
		if id, err = c.findUserID(ctx, token, username); err != nil {
			return "", err
		}
		if id == "" {
			return "", fmt.Errorf("user %q not found after create", username)
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
	defer resp.Body.Close()
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

// findUserID returns the id of the user with an exact username match, or "" if none.
func (c *KeycloakAdminClient) findUserID(ctx context.Context, token, username string) (string, error) {
	endpoint := fmt.Sprintf("%s/admin/realms/%s/users?username=%s&exact=true",
		c.cfg.BaseURL, c.cfg.Realm, url.QueryEscape(username))
	resp, body, err := c.adminRequest(ctx, http.MethodGet, endpoint, token, nil)
	if err != nil {
		return "", err
	}
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("find user %q failed: HTTP %d: %s", username, resp.StatusCode, string(body))
	}
	var users []keycloakUser
	if err := json.Unmarshal(body, &users); err != nil {
		return "", fmt.Errorf("parse user search for %q: %w", username, err)
	}
	if len(users) == 0 {
		return "", nil
	}
	return users[0].ID, nil
}

func (c *KeycloakAdminClient) createUser(ctx context.Context, token string, user keycloakUser) error {
	endpoint := fmt.Sprintf("%s/admin/realms/%s/users", c.cfg.BaseURL, c.cfg.Realm)
	resp, body, err := c.adminRequest(ctx, http.MethodPost, endpoint, token, user)
	if err != nil {
		return err
	}
	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusConflict {
		return fmt.Errorf("create user %q failed: HTTP %d: %s", user.Username, resp.StatusCode, string(body))
	}
	return nil
}

func (c *KeycloakAdminClient) updateUser(ctx context.Context, token, id string, user keycloakUser) error {
	endpoint := fmt.Sprintf("%s/admin/realms/%s/users/%s", c.cfg.BaseURL, c.cfg.Realm, id)
	resp, body, err := c.adminRequest(ctx, http.MethodPut, endpoint, token, user)
	if err != nil {
		return err
	}
	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("update user %q failed: HTTP %d: %s", user.Username, resp.StatusCode, string(body))
	}
	return nil
}

func (c *KeycloakAdminClient) resetPassword(ctx context.Context, token, id, password string) error {
	endpoint := fmt.Sprintf("%s/admin/realms/%s/users/%s/reset-password", c.cfg.BaseURL, c.cfg.Realm, id)
	cred := map[string]any{"type": "password", "value": password, "temporary": false}
	resp, body, err := c.adminRequest(ctx, http.MethodPut, endpoint, token, cred)
	if err != nil {
		return err
	}
	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("reset password failed: HTTP %d: %s", resp.StatusCode, string(body))
	}
	return nil
}

// adminRequest issues a bearer-authenticated admin request, JSON-encoding body when
// non-nil, and returns the response (body already drained) plus the raw body bytes.
func (c *KeycloakAdminClient) adminRequest(ctx context.Context, method, endpoint, token string, body any) (*http.Response, []byte, error) {
	var reader io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return nil, nil, err
		}
		reader = bytes.NewReader(data)
	}
	req, err := http.NewRequestWithContext(ctx, method, endpoint, reader)
	if err != nil {
		return nil, nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, nil, err
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, nil, err
	}
	return resp, data, nil
}
