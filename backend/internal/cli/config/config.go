// Package config stores the radiant-client settings (API URL, Keycloak device-flow settings,
// tokens) as a JSON file in the OS user config directory.
package config

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

const (
	PathEnv      = "RADIANT_CLIENT_CONFIG"
	MethodDevice = "device"
)

// Auth mirrors the `auth` object of radiant-api's GET /config. The CLI keeps its own copy of the
// shape so it never imports the server packages (and their gin/gorm/aws dependency trees).
type Auth struct {
	Method      string `json:"method"`
	KeycloakURL string `json:"keycloak_url"`
	Realm       string `json:"realm"`
	ClientID    string `json:"client_id"`
}

type ClientConfig struct {
	Auth Auth `json:"auth"`
}

type Tokens struct {
	AccessToken  string `json:"access_token,omitempty"`
	RefreshToken string `json:"refresh_token,omitempty"`
}

type Config struct {
	APIURL string `json:"api_url"`
	Auth   Auth   `json:"auth"`
	Tokens Tokens `json:"tokens"`
}

func DefaultPath() (string, error) {
	if p := os.Getenv(PathEnv); p != "" {
		return p, nil
	}
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", fmt.Errorf("resolve user config dir: %w", err)
	}
	return filepath.Join(dir, "radiant-client", "config.json"), nil
}

// Load returns an empty Config when the file does not exist yet.
func Load(path string) (*Config, error) {
	data, err := os.ReadFile(path) //nolint:gosec // G304: the user picks their own config path
	if errors.Is(err, os.ErrNotExist) {
		return &Config{}, nil
	}
	if err != nil {
		return nil, fmt.Errorf("read config %s: %w", path, err)
	}
	var cfg Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil, fmt.Errorf("parse config %s: %w", path, err)
	}
	return &cfg, nil
}

// Save writes atomically (temp file + rename) with mode 0600: the file holds tokens.
func Save(path string, cfg *Config) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return fmt.Errorf("create config dir: %w", err)
	}
	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return fmt.Errorf("encode config: %w", err)
	}
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, data, 0o600); err != nil {
		return fmt.Errorf("write config: %w", err)
	}
	if err := os.Chmod(tmp, 0o600); err != nil {
		return fmt.Errorf("chmod config: %w", err)
	}
	if runtime.GOOS == "windows" {
		_ = os.Remove(path)
	}
	if err := os.Rename(tmp, path); err != nil {
		return fmt.Errorf("replace config: %w", err)
	}
	return nil
}

func (c *Config) Validate() error {
	switch {
	case c.APIURL == "":
		return errors.New("api_url is missing")
	case c.Auth.Method != MethodDevice:
		return fmt.Errorf("unsupported auth method %q", c.Auth.Method)
	case c.Auth.KeycloakURL == "" || c.Auth.Realm == "" || c.Auth.ClientID == "":
		return errors.New("keycloak settings are incomplete")
	}
	return nil
}
