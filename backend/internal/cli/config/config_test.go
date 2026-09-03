package config

import (
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func sample() *Config {
	return &Config{
		APIURL: "https://api.example.org",
		Auth:   Auth{Method: "device", KeycloakURL: "https://auth.example.org", Realm: "qlin", ClientID: "radiant-client-cli"},
		Tokens: Tokens{AccessToken: "a", RefreshToken: "r"},
	}
}

func Test_Load_MissingFile(t *testing.T) {
	cfg, err := Load(filepath.Join(t.TempDir(), "missing.json"))
	require.NoError(t, err)
	assert.Equal(t, &Config{}, cfg)
}

func Test_Load_InvalidJSON(t *testing.T) {
	path := filepath.Join(t.TempDir(), "config.json")
	require.NoError(t, os.WriteFile(path, []byte("{not json"), 0o600))
	_, err := Load(path)
	assert.ErrorContains(t, err, "parse config")
}

func Test_SaveLoad_RoundTrip(t *testing.T) {
	path := filepath.Join(t.TempDir(), "nested", "dir", "config.json")
	require.NoError(t, Save(path, sample()))
	got, err := Load(path)
	require.NoError(t, err)
	assert.Equal(t, sample(), got)
	_, err = os.Stat(path + ".tmp")
	assert.True(t, os.IsNotExist(err), "temp file must be renamed away")
}

func Test_Save_OverwritesExisting(t *testing.T) {
	path := filepath.Join(t.TempDir(), "config.json")
	require.NoError(t, Save(path, sample()))
	updated := sample()
	updated.APIURL = "https://other.example.org"
	require.NoError(t, Save(path, updated))
	got, err := Load(path)
	require.NoError(t, err)
	assert.Equal(t, "https://other.example.org", got.APIURL)
}

func Test_Save_FileMode0600(t *testing.T) {
	if runtime.GOOS == "windows" {
		t.Skip("unix permissions only")
	}
	path := filepath.Join(t.TempDir(), "config.json")
	require.NoError(t, Save(path, sample()))
	fi, err := os.Stat(path)
	require.NoError(t, err)
	assert.Equal(t, os.FileMode(0o600), fi.Mode().Perm())
}

func Test_Validate_Valid(t *testing.T) {
	assert.NoError(t, sample().Validate())
}

func Test_Validate_MissingAPIURL(t *testing.T) {
	cfg := sample()
	cfg.APIURL = ""
	assert.ErrorContains(t, cfg.Validate(), "api_url")
}

func Test_Validate_UnsupportedMethod(t *testing.T) {
	cfg := sample()
	cfg.Auth.Method = "password"
	assert.ErrorContains(t, cfg.Validate(), `unsupported auth method "password"`)
}

func Test_Validate_IncompleteKeycloak(t *testing.T) {
	cfg := sample()
	cfg.Auth.ClientID = ""
	assert.ErrorContains(t, cfg.Validate(), "keycloak settings")
}

func Test_DefaultPath_EnvOverride(t *testing.T) {
	t.Setenv(PathEnv, "/tmp/custom.json")
	path, err := DefaultPath()
	require.NoError(t, err)
	assert.Equal(t, "/tmp/custom.json", path)
}

func Test_DefaultPath_UnderUserConfigDir(t *testing.T) {
	t.Setenv(PathEnv, "")
	path, err := DefaultPath()
	require.NoError(t, err)
	assert.Equal(t, filepath.Join("radiant-client", "config.json"), filepath.Join(filepath.Base(filepath.Dir(path)), filepath.Base(path)))
}
