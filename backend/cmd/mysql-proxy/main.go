// Command mysql-proxy sits between go-sql-driver clients (the Radiant API/worker via GORM)
// and StarRocks. Go's MySQL driver can't speak StarRocks' authentication_openid_connect_client
// plugin, so it can't log in as a JWT user directly. This proxy translates: the Go client
// connects in cleartext and sends its Keycloak JWT as the "password" (mysql_clear_password),
// and the proxy performs the real TLS + OIDC handshake to StarRocks on its behalf. Every query
// then runs as the authenticated user, so Ranger enforces per-user masking / row-filter /
// tenant access — no need to reimplement any of that in the API.
//
// SECURITY: the JWT crosses the client↔proxy hop in cleartext, so run the proxy on the same
// host (or a trusted network) as the Go service and restrict its listen port to that peer.
//
//	LISTEN_ADDR      address to accept cleartext clients on   (default :9031)
//	STARROCKS_ADDR   StarRocks FE MySQL address               (default starrocks:9030)
//	STARROCKS_SSL_CA path to a CA bundle to verify StarRocks' cert; unset = skip verification (dev)
//	PROBE_PORT       HTTP health-probe port                   (default 9998)
package main

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
	"os/signal"
	"sync"
	"syscall"
	"time"
)

const (
	authTimeout = 15 * time.Second
	// drainTimeout bounds how long shutdown waits for in-flight connections. Piped sessions
	// are long-lived, so this is a grace period for short queries, not a guarantee — after it
	// elapses remaining connections die with the process.
	drainTimeout = 10 * time.Second
)

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	listenAddr := getenv("LISTEN_ADDR", ":9031")
	backendAddr := getenv("STARROCKS_ADDR", "starrocks:9030")
	probePort := getenv("PROBE_PORT", "9998")

	tlsCfg, err := backendTLSConfig(os.Getenv("STARROCKS_SSL_CA"), backendAddr)
	if err != nil {
		slog.Error("build backend TLS config", "error", err)
		os.Exit(1)
	}
	p := &proxy{backendAddr: backendAddr, tlsCfg: tlsCfg, authTimeout: authTimeout}

	// Cancel the root context on SIGINT/SIGTERM so the accept loop and health server stop.
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go serveHealthProbe(ctx, probePort)

	ln, err := net.Listen("tcp", listenAddr)
	if err != nil {
		slog.Error("listen failed", "addr", listenAddr, "error", err)
		os.Exit(1)
	}
	slog.Info("mysql-proxy listening", "listen", listenAddr, "backend", backendAddr)

	// Unblock Accept on shutdown by closing the listener.
	go func() {
		<-ctx.Done()
		_ = ln.Close()
	}()

	var handlers sync.WaitGroup
	for {
		conn, err := ln.Accept()
		if err != nil {
			if ctx.Err() != nil {
				slog.Info("shutting down, draining connections", "timeout", drainTimeout)
				waitWithTimeout(&handlers, drainTimeout)
				return
			}
			slog.Error("accept error", "error", err)
			continue
		}
		handlers.Add(1)
		go func() {
			defer handlers.Done()
			p.handle(conn)
		}()
	}
}

// waitWithTimeout waits for wg up to d, then gives up (long-lived piped sessions would
// otherwise block shutdown forever).
func waitWithTimeout(wg *sync.WaitGroup, d time.Duration) {
	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()
	select {
	case <-done:
	case <-time.After(d):
		slog.Warn("drain timeout reached, exiting with active connections")
	}
}

// backendTLSConfig builds the TLS config for the proxy→StarRocks hop. With a CA bundle it
// verifies StarRocks' certificate (using the backend host as the expected name); without one
// it skips verification — acceptable for local dev against a self-signed cert, but production
// should set STARROCKS_SSL_CA.
func backendTLSConfig(caPath, backendAddr string) (*tls.Config, error) {
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

// serveHealthProbe runs a minimal HTTP server exposing GET /status for liveness checks,
// shutting down when ctx is cancelled.
func serveHealthProbe(ctx context.Context, port string) {
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

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
