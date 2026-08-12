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
// For an endpoint humans connect to with a password instead, see cmd/mysql-gateway.
//
//	LISTEN_ADDR      address to accept cleartext clients on   (default :9031)
//	STARROCKS_ADDR   StarRocks FE MySQL address               (default starrocks:9030)
//	STARROCKS_SSL_CA path to a CA bundle to verify StarRocks' cert; unset = skip verification (dev)
//	PROBE_PORT       HTTP health-probe port                   (default 9998)
package main

import (
	"context"
	"log/slog"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/radiant-network/radiant-api/internal/mysqlproxy"
)

// drainTimeout bounds how long shutdown waits for in-flight connections. Piped sessions are
// long-lived, so this is a grace period for short queries, not a guarantee — after it elapses
// remaining connections die with the process.
const drainTimeout = 10 * time.Second

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	listenAddr := mysqlproxy.Getenv("LISTEN_ADDR", ":9031")
	backendAddr := mysqlproxy.Getenv("STARROCKS_ADDR", "starrocks:9030")
	probePort := mysqlproxy.Getenv("PROBE_PORT", "9998")

	backendTLS, err := mysqlproxy.BackendTLSConfig(os.Getenv("STARROCKS_SSL_CA"), backendAddr)
	if err != nil {
		slog.Error("build backend TLS config", "error", err)
		os.Exit(1)
	}

	p := mysqlproxy.New(mysqlproxy.Config{
		BackendAddr: backendAddr,
		BackendTLS:  backendTLS,
		Auth:        mysqlproxy.JWTPassthrough{},
	})

	// Cancel the root context on SIGINT/SIGTERM so the accept loop and health server stop.
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go mysqlproxy.ServeHealthProbe(ctx, probePort)

	ln, err := net.Listen("tcp", listenAddr)
	if err != nil {
		slog.Error("listen failed", "addr", listenAddr, "error", err)
		os.Exit(1)
	}
	slog.Info("mysql-proxy listening", "listen", listenAddr, "backend", backendAddr)

	p.Serve(ctx, ln, drainTimeout)
}
