package client

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

// RangerConfig points the admin client at Ranger. Mirrors 03_ranger_policies.py.
type RangerConfig struct {
	BaseURL   string // e.g. http://localhost:6080
	AdminUser string
	AdminPass string
}

// RangerConfigFromEnv builds a RangerConfig from the environment, defaulting to
// the local compose stack.
func RangerConfigFromEnv() RangerConfig {
	return RangerConfig{
		BaseURL:   os.Getenv("RANGER_URL"),
		AdminUser: os.Getenv("RANGER_ADMIN_USER"),
		AdminPass: os.Getenv("RANGER_ADMIN_PASSWORD"),
	}
}

// RangerAdminClient talks to the Ranger REST API with stdlib net/http and basic auth.
type RangerAdminClient struct {
	cfg        RangerConfig
	authHeader string
	httpClient *http.Client
}

func NewRangerAdminClient(cfg RangerConfig) *RangerAdminClient {
	creds := base64.StdEncoding.EncodeToString([]byte(cfg.AdminUser + ":" + cfg.AdminPass))
	return &RangerAdminClient{
		cfg:        cfg,
		authHeader: "Basic " + creds,
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

// EnsureUser creates the Ranger user if it does not already exist. An existing user (HTTP 400) is treated as success.
func (c *RangerAdminClient) EnsureUser(ctx context.Context, name string) error {
	body := map[string]any{
		"name":         name,
		"firstName":    name,
		"emailAddress": "",
		"password":     "Unused-P0c123!",
		"userRoleList": []string{"ROLE_USER"},
	}
	resp, payload, err := c.request(ctx, http.MethodPost, "/service/xusers/secure/users", body)
	if err != nil {
		return err
	}
	// 200/201 = created; 400 = already exists -> both fine.
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusBadRequest {
		return fmt.Errorf("ensure user %q: HTTP %d: %s", name, resp.StatusCode, string(payload))
	}
	return nil
}

type rangerRoleMember struct {
	Name    string `json:"name"`
	IsAdmin bool   `json:"isAdmin"`
}

type rangerRole struct {
	ID    int64              `json:"id,omitempty"`
	Name  string             `json:"name"`
	Users []rangerRoleMember `json:"users"`
	Roles []rangerRoleMember `json:"roles"`
}

// AddUserToRole adds user to roleName via read-modify-write so it never clobbers
// existing members. The role must already exist, a missing role is an error.
// Idempotent: a user already in the role is a no-op.
func (c *RangerAdminClient) AddUserToRole(ctx context.Context, roleName, user string) error {
	resp, payload, err := c.request(ctx, http.MethodGet, "/service/roles/roles/name/"+roleName, nil)
	if err != nil {
		return err
	}
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("get role %q: HTTP %d: %s", roleName, resp.StatusCode, string(payload))
	}
	var role rangerRole
	if err := json.Unmarshal(payload, &role); err != nil {
		return fmt.Errorf("parse role %q: %w", roleName, err)
	}

	for _, m := range role.Users {
		if m.Name == user {
			return nil // already a member
		}
	}
	role.Users = append(role.Users, rangerRoleMember{Name: user, IsAdmin: false})

	resp, payload, err = c.request(ctx, http.MethodPut, fmt.Sprintf("/service/roles/roles/%d", role.ID), role)
	if err != nil {
		return err
	}
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("update role %q: HTTP %d: %s", roleName, resp.StatusCode, string(payload))
	}
	return nil
}

// request issues a basic-auth request to Ranger, JSON-encoding body when non-nil,
// and returns the response (body drained) plus the raw payload bytes.
func (c *RangerAdminClient) request(ctx context.Context, method, path string, body any) (*http.Response, []byte, error) {
	var reader io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return nil, nil, err
		}
		reader = bytes.NewReader(data)
	}
	req, err := http.NewRequestWithContext(ctx, method, c.cfg.BaseURL+path, reader)
	if err != nil {
		return nil, nil, err
	}
	req.Header.Set("Authorization", c.authHeader)
	req.Header.Set("Accept", "application/json")
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
