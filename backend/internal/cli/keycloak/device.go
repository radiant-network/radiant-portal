// Package keycloak implements the OAuth2 device authorization grant and refresh grant against
// a public Keycloak client. Kept apart from internal/client, which pulls internal/types.
package keycloak

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

var (
	ErrAccessDenied      = errors.New("access denied by the user")
	ErrDeviceCodeExpired = errors.New("device code expired, start again")
	ErrInvalidGrant      = errors.New("token refresh rejected")
)

type Config struct {
	BaseURL  string
	Realm    string
	ClientID string
}

type Client struct {
	cfg   Config
	http  *http.Client
	sleep func(time.Duration)
	now   func() time.Time
}

func New(cfg Config) *Client {
	return &Client{
		cfg:   cfg,
		http:  &http.Client{Timeout: 15 * time.Second},
		sleep: time.Sleep,
		now:   time.Now,
	}
}

type DeviceAuth struct {
	DeviceCode              string `json:"device_code"`
	UserCode                string `json:"user_code"`
	VerificationURI         string `json:"verification_uri"`
	VerificationURIComplete string `json:"verification_uri_complete"`
	ExpiresIn               int    `json:"expires_in"`
	Interval                int    `json:"interval"`
}

type Tokens struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type oauthError struct {
	Code        string `json:"error"`
	Description string `json:"error_description"`
}

func (c *Client) endpoint(suffix string) string {
	return fmt.Sprintf("%s/realms/%s/protocol/openid-connect/%s", strings.TrimRight(c.cfg.BaseURL, "/"), c.cfg.Realm, suffix)
}

func (c *Client) StartDeviceAuth(ctx context.Context) (*DeviceAuth, error) {
	form := url.Values{"client_id": {c.cfg.ClientID}, "scope": {"openid"}}
	body, status, err := c.post(ctx, c.endpoint("auth/device"), form)
	if err != nil {
		return nil, fmt.Errorf("device authorization request: %w", err)
	}
	if status != http.StatusOK {
		return nil, fmt.Errorf("device authorization request failed: HTTP %d: %s", status, strings.TrimSpace(string(body)))
	}
	var da DeviceAuth
	if err := json.Unmarshal(body, &da); err != nil {
		return nil, fmt.Errorf("parse device authorization response: %w", err)
	}
	if da.DeviceCode == "" {
		return nil, errors.New("device authorization response had no device_code")
	}
	return &da, nil
}

// PollDeviceToken blocks until the user completes the browser login, the code expires, or ctx ends.
func (c *Client) PollDeviceToken(ctx context.Context, da *DeviceAuth) (*Tokens, error) {
	interval := da.Interval
	if interval <= 0 {
		interval = 5
	}
	deadline := c.now().Add(time.Duration(da.ExpiresIn) * time.Second)
	form := url.Values{
		"grant_type":  {"urn:ietf:params:oauth:grant-type:device_code"},
		"client_id":   {c.cfg.ClientID},
		"device_code": {da.DeviceCode},
	}
	for {
		if err := ctx.Err(); err != nil {
			return nil, err
		}
		c.sleep(time.Duration(interval) * time.Second)
		tokens, oerr, err := c.token(ctx, form)
		if err != nil {
			return nil, err
		}
		if oerr == nil {
			return tokens, nil
		}
		switch oerr.Code {
		case "authorization_pending":
		case "slow_down":
			interval += 5
		case "expired_token":
			return nil, ErrDeviceCodeExpired
		case "access_denied":
			return nil, ErrAccessDenied
		default:
			return nil, fmt.Errorf("device token request failed: %s: %s", oerr.Code, oerr.Description)
		}
		if c.now().After(deadline) {
			return nil, ErrDeviceCodeExpired
		}
	}
}

func (c *Client) Refresh(ctx context.Context, refreshToken string) (*Tokens, error) {
	form := url.Values{
		"grant_type":    {"refresh_token"},
		"client_id":     {c.cfg.ClientID},
		"refresh_token": {refreshToken},
	}
	tokens, oerr, err := c.token(ctx, form)
	if err != nil {
		return nil, err
	}
	if oerr != nil {
		return nil, fmt.Errorf("%w: %s: %s", ErrInvalidGrant, oerr.Code, oerr.Description)
	}
	return tokens, nil
}

// token returns either tokens, an OAuth error body (4xx with an `error` field), or a transport error.
func (c *Client) token(ctx context.Context, form url.Values) (*Tokens, *oauthError, error) {
	body, status, err := c.post(ctx, c.endpoint("token"), form)
	if err != nil {
		return nil, nil, fmt.Errorf("token request: %w", err)
	}
	if status == http.StatusOK {
		var tokens Tokens
		if err := json.Unmarshal(body, &tokens); err != nil {
			return nil, nil, fmt.Errorf("parse token response: %w", err)
		}
		if tokens.AccessToken == "" {
			return nil, nil, errors.New("token response had no access_token")
		}
		return &tokens, nil, nil
	}
	var oerr oauthError
	if json.Unmarshal(body, &oerr) == nil && oerr.Code != "" {
		return nil, &oerr, nil
	}
	return nil, nil, fmt.Errorf("token request failed: HTTP %d: %s", status, strings.TrimSpace(string(body)))
}

func (c *Client) post(ctx context.Context, endpoint string, form url.Values) ([]byte, int, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, strings.NewReader(form.Encode()))
	if err != nil {
		return nil, 0, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	resp, err := c.http.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer func() { _ = resp.Body.Close() }()
	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return nil, 0, err
	}
	return body, resp.StatusCode, nil
}

// Claims decodes the JWT payload without verifying the signature: the CLI only reads `exp` and
// `preferred_username` for display and local expiry checks, the API does the real verification.
func Claims(token string) (map[string]any, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, errors.New("malformed token")
	}
	payload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, fmt.Errorf("decode token payload: %w", err)
	}
	var claims map[string]any
	if err := json.Unmarshal(payload, &claims); err != nil {
		return nil, fmt.Errorf("parse token payload: %w", err)
	}
	return claims, nil
}

// AccessTokenValid reports whether the token expires later than now+slack.
func AccessTokenValid(token string, now time.Time, slack time.Duration) bool {
	claims, err := Claims(token)
	if err != nil {
		return false
	}
	exp, ok := claims["exp"].(float64)
	if !ok {
		return false
	}
	return time.Unix(int64(exp), 0).After(now.Add(slack))
}
