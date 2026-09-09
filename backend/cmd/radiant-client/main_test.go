package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/cli/config"
	"github.com/radiant-network/radiant-api/internal/cli/download"
	"github.com/radiant-network/radiant-api/internal/cli/style"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func execute(t *testing.T, stdin string, args ...string) (string, error) {
	t.Helper()
	var out bytes.Buffer
	root := newRootCmd()
	root.SetOut(&out)
	root.SetErr(&out)
	root.SetIn(strings.NewReader(stdin))
	root.SetArgs(args)
	err := root.ExecuteContext(context.Background())
	return out.String(), err
}

func validToken(t *testing.T) string {
	payload, err := json.Marshal(map[string]any{"exp": float64(time.Now().Add(time.Hour).Unix()), "preferred_username": "geneticist"})
	require.NoError(t, err)
	enc := base64.RawURLEncoding.EncodeToString
	return enc([]byte(`{}`)) + "." + enc(payload) + "." + enc([]byte("s"))
}

func Test_Root_Version(t *testing.T) {
	out, err := execute(t, "", "--version")
	require.NoError(t, err)
	assert.Contains(t, out, "dev (commit none, built unknown)")
}

func Test_Configure_WritesConfigFromServer(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "/config", r.URL.Path)
		_, _ = w.Write([]byte(`{"auth":{"method":"device","keycloak_url":"https://auth","realm":"qlin","client_id":"radiant-client-cli"}}`))
	}))
	defer srv.Close()
	path := filepath.Join(t.TempDir(), "config.json")
	t.Setenv(config.PathEnv, path)

	out, err := execute(t, "", "configure", "-u", srv.URL+"/")
	require.NoError(t, err)
	assert.Contains(t, out, "Configuration saved to "+path)

	cfg, err := config.Load(path)
	require.NoError(t, err)
	assert.Equal(t, srv.URL, cfg.APIURL)
	assert.Equal(t, config.Auth{Method: "device", KeycloakURL: "https://auth", Realm: "qlin", ClientID: "radiant-client-cli"}, cfg.Auth)
}

func Test_Configure_PromptsURLWhenFlagMissing(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(`{"auth":{"method":"device","keycloak_url":"https://auth","realm":"qlin","client_id":"c"}}`))
	}))
	defer srv.Close()
	t.Setenv(config.PathEnv, filepath.Join(t.TempDir(), "config.json"))

	out, err := execute(t, srv.URL+"\n", "configure")
	require.NoError(t, err)
	assert.Contains(t, out, "Radiant API URL: ")
	assert.Contains(t, out, "Configuration saved")
}

func Test_Configure_Reset(t *testing.T) {
	path := filepath.Join(t.TempDir(), "config.json")
	t.Setenv(config.PathEnv, path)
	require.NoError(t, config.Save(path, &config.Config{APIURL: "https://api", Tokens: config.Tokens{AccessToken: "x"}}))

	_, err := execute(t, "", "configure", "--reset")
	require.NoError(t, err)
	cfg, err := config.Load(path)
	require.NoError(t, err)
	assert.Equal(t, &config.Config{}, cfg)
}

func Test_Configure_ServerUnusableConfig(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(`{"auth":{"method":"password"}}`))
	}))
	defer srv.Close()
	t.Setenv(config.PathEnv, filepath.Join(t.TempDir(), "config.json"))

	_, err := execute(t, "", "configure", "-u", srv.URL)
	assert.ErrorContains(t, err, "unusable configuration")
}

func Test_Download_MissingConfig(t *testing.T) {
	t.Setenv(config.PathEnv, filepath.Join(t.TempDir(), "config.json"))
	manifestPath := filepath.Join(t.TempDir(), "m.tsv")
	require.NoError(t, os.WriteFile(manifestPath, []byte("tenant\tdocument_id\nqlin\t1\n"), 0o644))

	_, err := execute(t, "", "download", "-m", manifestPath)
	assert.ErrorContains(t, err, "radiant-client configure")
}

func Test_Download_HappyPathWithYes(t *testing.T) {
	payload := []byte("hello radiant")
	files := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write(payload)
	}))
	defer files.Close()
	apiSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "Bearer "+r.Header.Get("Authorization")[7:], r.Header.Get("Authorization"))
		switch r.URL.Path {
		case "/qlin/documents/273/download_url":
			_, _ = w.Write([]byte(`{"url":"` + files.URL + `/run/420010.cnv.vcf.gz","expires_at":1}`))
		case "/qlin/documents/999/download_url":
			w.WriteHeader(404)
		default:
			t.Errorf("unexpected path %s", r.URL.Path)
		}
	}))
	defer apiSrv.Close()

	path := filepath.Join(t.TempDir(), "config.json")
	t.Setenv(config.PathEnv, path)
	require.NoError(t, config.Save(path, &config.Config{
		APIURL: apiSrv.URL,
		Auth:   config.Auth{Method: "device", KeycloakURL: "https://auth", Realm: "qlin", ClientID: "c"},
		Tokens: config.Tokens{AccessToken: validToken(t)},
	}))
	outDir := filepath.Join(t.TempDir(), "out")
	manifestPath := filepath.Join(t.TempDir(), "m.tsv")
	require.NoError(t, os.WriteFile(manifestPath, []byte("tenant\tdocument_id\tname\tsize\nqlin\t273\t\t13\nqlin\t999\tmissing.bin\t\n"), 0o644))

	out, err := execute(t, "", "download", "-m", manifestPath, "-o", outDir, "-y", "--skip-missing")
	require.NoError(t, err, out)
	assert.Contains(t, out, "Manifest: 2 documents")
	assert.Contains(t, out, "Size to download: 13 B (2 files, 1 without size in the manifest)")
	assert.Contains(t, out, "not found:  missing.bin")
	assert.Contains(t, out, "Total downloaded files: 1 (resumed 0, skipped 0, failed 0)\nlocated here: "+outDir)
	got, err := os.ReadFile(filepath.Join(outDir, "420010.cnv.vcf.gz"))
	require.NoError(t, err)
	assert.Equal(t, payload, got)
}

func Test_Download_MissingDocumentFailsWithoutSkipFlag(t *testing.T) {
	apiSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(404) }))
	defer apiSrv.Close()
	path := filepath.Join(t.TempDir(), "config.json")
	t.Setenv(config.PathEnv, path)
	require.NoError(t, config.Save(path, &config.Config{
		APIURL: apiSrv.URL,
		Auth:   config.Auth{Method: "device", KeycloakURL: "https://auth", Realm: "qlin", ClientID: "c"},
		Tokens: config.Tokens{AccessToken: validToken(t)},
	}))
	manifestPath := filepath.Join(t.TempDir(), "m.tsv")
	require.NoError(t, os.WriteFile(manifestPath, []byte("tenant\tdocument_id\tname\nqlin\t1\ta.bin\n"), 0o644))

	_, err := execute(t, "", "download", "-m", manifestPath, "-o", t.TempDir(), "-y")
	assert.ErrorContains(t, err, "1 document(s) not found or not allowed")
}

func Test_Download_UnauthorizedClearsTokens(t *testing.T) {
	apiSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(401) }))
	defer apiSrv.Close()
	path := filepath.Join(t.TempDir(), "config.json")
	t.Setenv(config.PathEnv, path)
	require.NoError(t, config.Save(path, &config.Config{
		APIURL: apiSrv.URL,
		Auth:   config.Auth{Method: "device", KeycloakURL: "https://auth", Realm: "qlin", ClientID: "c"},
		Tokens: config.Tokens{AccessToken: validToken(t), RefreshToken: "rt"},
	}))
	manifestPath := filepath.Join(t.TempDir(), "m.tsv")
	require.NoError(t, os.WriteFile(manifestPath, []byte("tenant\tdocument_id\tname\nqlin\t1\ta.bin\n"), 0o644))

	_, err := execute(t, "", "download", "-m", manifestPath, "-o", t.TempDir(), "-y")
	assert.ErrorContains(t, err, "stored tokens were cleared")
	cfg, err := config.Load(path)
	require.NoError(t, err)
	assert.Equal(t, config.Tokens{}, cfg.Tokens)
}

func Test_Report_InterruptedExitCode130(t *testing.T) {
	var out bytes.Buffer
	cfg := &config.Config{}
	err := report(&out, style.Palette{}, download.Result{Downloaded: 3, Interrupted: 27}, "/out", false, cfg, filepath.Join(t.TempDir(), "c.json"))
	var ec exitCodeError
	require.ErrorAs(t, err, &ec)
	assert.Equal(t, 130, ec.code)
	assert.Contains(t, out.String(), "Total downloaded files: 3")
	assert.Contains(t, out.String(), "Interrupted: 27 file(s) not downloaded. Run again with --resume to continue.")
}

func Test_Download_AbortedByUser(t *testing.T) {
	path := filepath.Join(t.TempDir(), "config.json")
	t.Setenv(config.PathEnv, path)
	require.NoError(t, config.Save(path, &config.Config{
		APIURL: "http://127.0.0.1:1",
		Auth:   config.Auth{Method: "device", KeycloakURL: "https://auth", Realm: "qlin", ClientID: "c"},
		Tokens: config.Tokens{AccessToken: validToken(t)},
	}))
	manifestPath := filepath.Join(t.TempDir(), "m.tsv")
	require.NoError(t, os.WriteFile(manifestPath, []byte("tenant\tdocument_id\nqlin\t1\n"), 0o644))

	_, err := execute(t, "no\n", "download", "-m", manifestPath, "-o", t.TempDir())
	assert.ErrorContains(t, err, "aborted by user")
}
