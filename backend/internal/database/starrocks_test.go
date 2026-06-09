package database

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"math/big"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// writeTestCA generates a self-signed CA certificate, writes it as PEM to a
// file in t.TempDir(), and returns the path.
func writeTestCA(t *testing.T) string {
	t.Helper()
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	require.NoError(t, err)
	tmpl := &x509.Certificate{
		SerialNumber:          big.NewInt(1),
		Subject:               pkix.Name{CommonName: "test-ca"},
		NotBefore:             time.Unix(0, 0),
		NotAfter:              time.Unix(1<<31-1, 0),
		IsCA:                  true,
		KeyUsage:              x509.KeyUsageCertSign,
		BasicConstraintsValid: true,
	}
	der, err := x509.CreateCertificate(rand.Reader, tmpl, tmpl, &key.PublicKey, key)
	require.NoError(t, err)
	path := filepath.Join(t.TempDir(), "ca.pem")
	require.NoError(t, os.WriteFile(path, pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: der}), 0o600))
	return path
}

func Test_registerStarrocksTLS_EmptyPath_Disabled(t *testing.T) {
	param, err := registerStarrocksTLS("", "starrocks-empty", "localhost")
	assert.NoError(t, err)
	assert.Equal(t, "", param)
}

func Test_registerStarrocksTLS_ValidCA_ReturnsParam(t *testing.T) {
	caPath := writeTestCA(t)
	param, err := registerStarrocksTLS(caPath, "starrocks-valid", "localhost")
	assert.NoError(t, err)
	assert.Equal(t, "&tls=starrocks-valid", param)
}

func Test_registerStarrocksTLS_MissingFile_Errors(t *testing.T) {
	param, err := registerStarrocksTLS(filepath.Join(t.TempDir(), "does-not-exist.pem"), "starrocks-missing", "localhost")
	require.Error(t, err)
	assert.Contains(t, err.Error(), "read DB_SSL_CA")
	assert.Equal(t, "", param)
}

func Test_registerStarrocksTLS_GarbagePEM_Errors(t *testing.T) {
	path := filepath.Join(t.TempDir(), "garbage.pem")
	require.NoError(t, os.WriteFile(path, []byte("not a pem file"), 0o600))
	param, err := registerStarrocksTLS(path, "starrocks-garbage", "localhost")
	require.Error(t, err)
	assert.Contains(t, err.Error(), "no certs found")
	assert.Equal(t, "", param)
}

func Test_starrocksTLSParam_NoCANoMode_Disabled(t *testing.T) {
	param, err := starrocksTLSParam("", "", "starrocks-none", "localhost")
	assert.NoError(t, err)
	assert.Equal(t, "", param)
}

func Test_starrocksTLSParam_FalseMode_Disabled(t *testing.T) {
	param, err := starrocksTLSParam("", "false", "starrocks-false", "localhost")
	assert.NoError(t, err)
	assert.Equal(t, "", param)
}

func Test_starrocksTLSParam_DisableMode_Disabled(t *testing.T) {
	param, err := starrocksTLSParam("", "disable", "starrocks-disable", "localhost")
	assert.NoError(t, err)
	assert.Equal(t, "", param)
}

func Test_starrocksTLSParam_SkipVerifyMode_PassedThrough(t *testing.T) {
	param, err := starrocksTLSParam("", "skip-verify", "starrocks-skip", "localhost")
	assert.NoError(t, err)
	assert.Equal(t, "&tls=skip-verify", param)
}

func Test_starrocksTLSParam_PreferredMode_PassedThrough(t *testing.T) {
	param, err := starrocksTLSParam("", "preferred", "starrocks-preferred", "localhost")
	assert.NoError(t, err)
	assert.Equal(t, "&tls=preferred", param)
}

func Test_starrocksTLSParam_CATakesPrecedenceOverMode(t *testing.T) {
	caPath := writeTestCA(t)
	param, err := starrocksTLSParam(caPath, "skip-verify", "starrocks-ca-wins", "localhost")
	assert.NoError(t, err)
	assert.Equal(t, "&tls=starrocks-ca-wins", param)
}
