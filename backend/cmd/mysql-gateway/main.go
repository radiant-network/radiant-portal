// Command mysql-gateway lets people query StarRocks from any MySQL client — DBeaver, the mysql
// CLI, a BI tool — using the Keycloak username and password they already have, with no token
// handling on their side.
//
// StarRocks users authenticate with a JWT (authentication_openid_connect_client), which no
// ordinary MySQL client can produce. The gateway closes that gap: it asks the client for its
// password over TLS, exchanges username+password with Keycloak for an access token, reads the
// token's `sub` (which IS the StarRocks username), and completes the OIDC handshake to
// StarRocks. The session then runs as that user, so Ranger applies their masking, row filters
// and tenant access.
//
//	client ──TLS + mysql_clear_password (Keycloak password)──▶ gateway ──ROPC──▶ Keycloak
//	gateway ──TLS + authentication_openid_connect_client (JWT)──▶ StarRocks
//
// SECURITY: the gateway sees end-user passwords in cleartext — that is inherent, since
// mysql_native_password is a challenge-response that never reveals the password, and ROPC
// needs it. Consequences, all enforced or noted here:
//   - TLS on the listener is MANDATORY; the process refuses to start without a cert/key.
//   - Passwords are never logged. Only the username and the resolved `sub` are.
//   - Keycloak counts each connection as a login attempt, so a client retrying a stale saved
//     password can trip brute-force lockout. That is Keycloak's policy to tune, not ours.
//   - ROPC cannot satisfy MFA. A realm requiring OTP for these users will reject every login.
//
// Configuration:
//
//	LISTEN_ADDR             address to accept clients on              (default :9032)
//	TLS_CERT_FILE           PEM certificate for the listener          (required)
//	TLS_KEY_FILE            PEM private key for the listener          (required)
//	STARROCKS_ADDR          StarRocks FE MySQL address                (default starrocks:9030)
//	STARROCKS_SSL_CA        CA bundle verifying StarRocks' cert; unset = skip verification (dev)
//	KEYCLOAK_HOST           Keycloak base URL                         (required)
//	KEYCLOAK_REALM          realm the users live in                   (required)
//	KEYCLOAK_CLIENT_ID      client used for the password grant; needs direct access grants
//	                        enabled and must mint tokens carrying the audience the StarRocks
//	                        users require                             (required)
//	KEYCLOAK_CLIENT_SECRET  only for a confidential client; prefer a public one so no secret
//	                        is deployed                               (optional)
//	PROBE_PORT              HTTP health-probe port                    (default 9997)
package main

import (
	"context"
	"log/slog"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/mysqlproxy"
)

const drainTimeout = 10 * time.Second

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	listenAddr := mysqlproxy.Getenv("LISTEN_ADDR", ":9032")
	backendAddr := mysqlproxy.Getenv("STARROCKS_ADDR", "starrocks:9030")
	probePort := mysqlproxy.Getenv("PROBE_PORT", "9997")

	// Fail closed: without TLS the listener would carry end-user passwords in the clear.
	listenerTLS, err := mysqlproxy.ListenerTLSConfig(os.Getenv("TLS_CERT_FILE"), os.Getenv("TLS_KEY_FILE"))
	if err != nil {
		slog.Error("TLS is required for mysql-gateway: set TLS_CERT_FILE and TLS_KEY_FILE", "error", err)
		os.Exit(1)
	}

	backendTLS, err := mysqlproxy.BackendTLSConfig(os.Getenv("STARROCKS_SSL_CA"), backendAddr)
	if err != nil {
		slog.Error("build backend TLS config", "error", err)
		os.Exit(1)
	}

	kcConfig := client.KeycloakPasswordConfigFromEnv()
	if kcConfig.BaseURL == "" || kcConfig.Realm == "" || kcConfig.ClientID == "" {
		slog.Error("KEYCLOAK_HOST, KEYCLOAK_REALM and KEYCLOAK_CLIENT_ID are required")
		os.Exit(1)
	}

	p := mysqlproxy.New(mysqlproxy.Config{
		BackendAddr: backendAddr,
		BackendTLS:  backendTLS,
		ClientTLS:   listenerTLS,
		Auth:        mysqlproxy.PasswordExchange{Tokens: client.NewKeycloakPasswordClient(kcConfig)},
	})

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go mysqlproxy.ServeHealthProbe(ctx, probePort)

	ln, err := net.Listen("tcp", listenAddr)
	if err != nil {
		slog.Error("listen failed", "addr", listenAddr, "error", err)
		os.Exit(1)
	}
	slog.Info("mysql-gateway listening",
		"listen", listenAddr, "backend", backendAddr,
		"keycloak", kcConfig.BaseURL, "realm", kcConfig.Realm, "client_id", kcConfig.ClientID)

	p.Serve(ctx, ln, drainTimeout)
}
