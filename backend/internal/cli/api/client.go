// Package api is the small radiant-api client used by radiant-client: public /config and the
// per-document presigned download URL.
package api

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/radiant-network/radiant-api/internal/cli/config"
)

var (
	ErrUnauthorized = errors.New("unauthorized")
	ErrForbidden    = errors.New("forbidden")
	ErrNotFound     = errors.New("not found")
)

// PreSignedURL mirrors utils.PreSignedURL without importing internal/utils (aws-sdk, gin).
type PreSignedURL struct {
	URL       string `json:"url"`
	ExpiresAt int64  `json:"expires_at"`
}

type Client struct {
	BaseURL string
	HTTP    *http.Client
	// Token returns the bearer token for authenticated calls. Nil for /config only usage.
	Token func(ctx context.Context) (string, error)
}

func New(baseURL string) *Client {
	return &Client{BaseURL: strings.TrimRight(baseURL, "/"), HTTP: &http.Client{Timeout: 30 * time.Second}}
}

func (c *Client) GetConfig(ctx context.Context) (*config.ClientConfig, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.BaseURL+"/config", nil)
	if err != nil {
		return nil, err
	}
	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GET /config: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GET /config: HTTP %d", resp.StatusCode)
	}
	var cc config.ClientConfig
	if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&cc); err != nil {
		return nil, fmt.Errorf("parse /config response: %w", err)
	}
	return &cc, nil
}

func (c *Client) DownloadURL(ctx context.Context, tenant string, documentID int) (*PreSignedURL, error) {
	path := fmt.Sprintf("%s/%s/documents/%d/download_url", c.BaseURL, url.PathEscape(tenant), documentID)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	token, err := c.Token(ctx)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GET download_url: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()
	switch resp.StatusCode {
	case http.StatusOK:
		var ps PreSignedURL
		if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&ps); err != nil {
			return nil, fmt.Errorf("parse download_url response: %w", err)
		}
		if ps.URL == "" {
			return nil, errors.New("download_url response had no url")
		}
		return &ps, nil
	case http.StatusUnauthorized:
		return nil, ErrUnauthorized
	case http.StatusForbidden:
		return nil, ErrForbidden
	case http.StatusNotFound:
		return nil, ErrNotFound
	default:
		return nil, fmt.Errorf("GET download_url: HTTP %d", resp.StatusCode)
	}
}
