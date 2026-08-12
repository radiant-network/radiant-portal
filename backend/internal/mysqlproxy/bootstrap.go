package mysqlproxy

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"time"
)

// BackendTLSConfig builds the TLS config for the proxy→StarRocks hop. With a CA bundle it
// verifies StarRocks' certificate (using the backend host as the expected name); without one
// it skips verification — acceptable for local dev against a self-signed cert, but production
// should set STARROCKS_SSL_CA.
func BackendTLSConfig(caPath, backendAddr string) (*tls.Config, error) {
	if caPath == "" {
		slog.Warn("STARROCKS_SSL_CA not set — not verifying StarRocks certificate (dev only)")
		return &tls.Config{InsecureSkipVerify: true}, nil //nolint:gosec // documented dev fallback; prod sets STARROCKS_SSL_CA
	}
	pem, err := os.ReadFile(caPath) //nolint:gosec // operator-configured path, not attacker input
	if err != nil {
		return nil, fmt.Errorf("read STARROCKS_SSL_CA: %w", err)
	}
	pool := x509.NewCertPool()
	if !pool.AppendCertsFromPEM(pem) {
		return nil, fmt.Errorf("parse STARROCKS_SSL_CA: no certificates in %s", caPath)
	}
	host, _, err := net.SplitHostPort(backendAddr)
	if err != nil {
		return nil, fmt.Errorf("parse STARROCKS_ADDR %q: %w", backendAddr, err)
	}
	return &tls.Config{MinVersion: tls.VersionTLS12, RootCAs: pool, ServerName: host}, nil
}

// ListenerTLSConfig builds the TLS config the proxy presents to its own clients. Both paths
// must be set; a proxy that needs TLS and doesn't get it should fail to start rather than
// quietly fall back to cleartext.
func ListenerTLSConfig(certPath, keyPath string) (*tls.Config, error) {
	if certPath == "" || keyPath == "" {
		return nil, errors.New("both a certificate and a key are required")
	}
	cert, err := tls.LoadX509KeyPair(certPath, keyPath)
	if err != nil {
		return nil, fmt.Errorf("load listener certificate: %w", err)
	}
	return &tls.Config{MinVersion: tls.VersionTLS12, Certificates: []tls.Certificate{cert}}, nil
}

// ServeHealthProbe runs a minimal HTTP server exposing GET /status for liveness checks,
// shutting down when ctx is cancelled.
func ServeHealthProbe(ctx context.Context, port string) {
	mux := http.NewServeMux()
	mux.HandleFunc("/status", func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusOK) })
	srv := &http.Server{Addr: ":" + port, Handler: mux, ReadHeaderTimeout: 5 * time.Second}
	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = srv.Shutdown(shutdownCtx)
	}()
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		slog.Error("health probe server failed", "error", err)
	}
}

func Getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
