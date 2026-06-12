package client

import (
	"bytes"
	"context"
	"crypto/rand"
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
	// The password is never used by StarRocks but is required by Ranger's
	// user-creation API, so generate a throwaway random one per call.
	pw, err := randomPassword()
	if err != nil {
		return err
	}
	body := map[string]any{
		"name":         name,
		"firstName":    name,
		"emailAddress": "",
		"password":     pw,
		"userRoleList": []string{"ROLE_USER"},
	}
	status, payload, err := c.request(ctx, http.MethodPost, "/service/xusers/secure/users", body)
	if err != nil {
		return err
	}
	// 200/201 = created; 400 = already exists -> both fine.
	if status != http.StatusOK && status != http.StatusCreated && status != http.StatusBadRequest {
		return fmt.Errorf("ensure user %q: HTTP %d: %s", name, status, string(payload))
	}
	return nil
}

// randomPassword returns a throwaway, policy-compliant password backed by
// crypto/rand. The base64 body covers upper/lower/digits and the fixed suffix
// guarantees Ranger's complexity requirement (upper, lower, digit, special).
func randomPassword() (string, error) {
	b := make([]byte, 24)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("generate ranger password: %w", err)
	}
	return base64.RawURLEncoding.EncodeToString(b) + "Aa1!", nil
}

const rangerStarrocksService = "starrocks"

type rangerRoleMember struct {
	Name    string `json:"name"`
	IsAdmin bool   `json:"isAdmin"`
}

type rangerRole struct {
	ID            int64              `json:"id,omitempty"`
	Name          string             `json:"name"`
	CreatedByUser string             `json:"createdByUser,omitempty"`
	Users         []rangerRoleMember `json:"users"`
	Roles         []rangerRoleMember `json:"roles"`
}

// EnsureRole creates an empty Ranger role if absent. An existing role is left
// untouched — its membership is owned by the user-provisioning flow, so a re-run must
// never clobber it.
func (c *RangerAdminClient) EnsureRole(ctx context.Context, name string) error {
	status, _, err := c.request(ctx, http.MethodGet, "/service/roles/roles/name/"+name, nil)
	if err != nil {
		return err
	}
	if status == http.StatusOK {
		return nil
	}
	role := rangerRole{Name: name, CreatedByUser: c.cfg.AdminUser, Users: []rangerRoleMember{}, Roles: []rangerRoleMember{}}
	status, payload, err := c.request(ctx, http.MethodPost, "/service/roles/roles", role)
	if err != nil {
		return err
	}
	if status != http.StatusOK && status != http.StatusCreated {
		return fmt.Errorf("create role %q: HTTP %d: %s", name, status, string(payload))
	}
	return nil
}

// EnsureAccessPolicy upserts a StarRocks access policy granting roles SELECT on the
// databases/tables. Delete-by-name then create, so a re-run converges to exactly this
// definition.
func (c *RangerAdminClient) EnsureAccessPolicy(ctx context.Context, name string, databases, tables, roles []string) error {
	if _, _, err := c.request(ctx, http.MethodDelete,
		fmt.Sprintf("/service/public/v2/api/policy?servicename=%s&policyname=%s", rangerStarrocksService, name), nil); err != nil {
		return err
	}
	policy := map[string]any{
		"policyType":     0,
		"name":           name,
		"isEnabled":      true,
		"isAuditEnabled": false,
		"service":        rangerStarrocksService,
		"resources": map[string]any{
			"catalog":  map[string]any{"values": []string{"default_catalog"}},
			"database": map[string]any{"values": databases},
			"table":    map[string]any{"values": tables},
			"column":   map[string]any{"values": []string{"*"}},
		},
		"policyItems": []map[string]any{{
			"roles":    roles,
			"accesses": []map[string]any{{"type": "select", "isAllowed": true}},
		}},
	}
	status, payload, err := c.request(ctx, http.MethodPost, "/service/plugins/policies", policy)
	if err != nil {
		return err
	}
	if status != http.StatusOK && status != http.StatusCreated {
		return fmt.Errorf("create access policy %q: HTTP %d: %s", name, status, string(payload))
	}
	return nil
}

// AddUserToRole adds user to roleName via read-modify-write so it never clobbers
// existing members. The role must already exist, a missing role is an error.
// Idempotent: a user already in the role is a no-op.
func (c *RangerAdminClient) AddUserToRole(ctx context.Context, roleName, user string) error {
	status, payload, err := c.request(ctx, http.MethodGet, "/service/roles/roles/name/"+roleName, nil)
	if err != nil {
		return err
	}
	if status != http.StatusOK {
		return fmt.Errorf("get role %q: HTTP %d: %s", roleName, status, string(payload))
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

	status, payload, err = c.request(ctx, http.MethodPut, fmt.Sprintf("/service/roles/roles/%d", role.ID), role)
	if err != nil {
		return err
	}
	if status != http.StatusOK && status != http.StatusCreated {
		return fmt.Errorf("update role %q: HTTP %d: %s", roleName, status, string(payload))
	}
	return nil
}

// request issues a basic-auth request to Ranger, JSON-encoding body when non-nil,
// and returns the HTTP status code plus the raw payload bytes. The response body is
// fully read and closed before returning, so callers never hold an open body.
func (c *RangerAdminClient) request(ctx context.Context, method, path string, body any) (int, []byte, error) {
	var reader io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return 0, nil, err
		}
		reader = bytes.NewReader(data)
	}
	req, err := http.NewRequestWithContext(ctx, method, c.cfg.BaseURL+path, reader)
	if err != nil {
		return 0, nil, err
	}
	req.Header.Set("Authorization", c.authHeader)
	req.Header.Set("Accept", "application/json")
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
