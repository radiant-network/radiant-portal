# mysql-gateway

Lets people query StarRocks from **any MySQL client** — DBeaver, the `mysql` CLI, a BI tool —
with the **Keycloak username and password they already have**. No tokens to fetch, no `sub` to
look up, no driver plugins to install.

StarRocks users here authenticate with a JWT (`authentication_openid_connect_client`), which no
ordinary MySQL client can produce. The gateway closes that gap:

```
client  ──TLS + mysql_clear_password (Keycloak password)──▶ gateway ──ROPC──▶ Keycloak
gateway ──TLS + authentication_openid_connect_client (JWT)──▶ StarRocks
```

It asks the client for its password, exchanges username+password with Keycloak for an access
token, reads the token's `sub` — which **is** the StarRocks username — and completes the OIDC
handshake. The session then runs as that user, so **Ranger applies their masking, row filters
and tenant access** exactly as it would through the portal.

It shares all its wire-protocol code with [`mysql-proxy`](../mysql-proxy) via
[`internal/mysqlproxy`](../../internal/mysqlproxy); the only difference is the `Authenticator`.
`mysql-proxy` is the API's loopback sidecar (JWT in, no TLS on the client hop); this is the
human-facing endpoint.

## Security

The gateway sees end-user passwords in cleartext. That is inherent, not a shortcut:
`mysql_native_password` is a challenge-response that never reveals the password, and the OAuth2
password grant needs it. What follows from that:

- **TLS on the listener is mandatory** — the process refuses to start without
  `TLS_CERT_FILE` / `TLS_KEY_FILE`, and rejects a client that declines to upgrade.
- **Passwords are never logged.** Only the username and the resolved `sub` are.
- **Keycloak counts every connection as a login attempt.** A client with a stale saved password
  reconnecting in a loop can trip brute-force lockout. Tune that in Keycloak's realm policy.
- **ROPC cannot satisfy MFA.** A realm requiring OTP for these users rejects every login
  (`invalid_grant`) — the same constraint that pushed `cmd/create-user`'s admin client onto
  `client_credentials`.
- Prefer a **public** Keycloak client (no secret deployed) with direct access grants enabled.
  Do not reuse the portal's confidential client.

## Configuration

| Env | Purpose | Default |
|-----|---------|---------|
| `LISTEN_ADDR` | address to accept clients on | `:9032` |
| `TLS_CERT_FILE` / `TLS_KEY_FILE` | PEM cert + key for the listener | **required** |
| `STARROCKS_ADDR` | StarRocks FE MySQL address | `starrocks:9030` |
| `STARROCKS_SSL_CA` | CA bundle verifying StarRocks' cert; unset = skip verification (dev only) | — |
| `KEYCLOAK_HOST` / `KEYCLOAK_REALM` | Keycloak base URL and realm | **required** |
| `KEYCLOAK_CLIENT_ID` | client for the password grant; needs direct access grants, and its tokens must carry the audience the StarRocks users require | **required** |
| `KEYCLOAK_CLIENT_SECRET` | only for a confidential client | — |
| `PROBE_PORT` | HTTP health-probe port (`GET /status`) | `9997` |

## Run locally

```bash
# A self-signed cert is fine for local testing; clients connect with ssl-mode=PREFERRED.
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
  -keyout /tmp/gw-key.pem -out /tmp/gw-cert.pem -subj "/CN=localhost"

TLS_CERT_FILE=/tmp/gw-cert.pem TLS_KEY_FILE=/tmp/gw-key.pem \
STARROCKS_ADDR=127.0.0.1:9030 \
KEYCLOAK_HOST=http://localhost:8080 KEYCLOAK_REALM=CQDG \
KEYCLOAK_CLIENT_ID=radiant CLIENT_SECRET= \
go run ./cmd/mysql-gateway
```

Then connect as a human would — **username and password, nothing else**:

```bash
mysql -h127.0.0.1 -P9032 -u alice -p \
  --ssl-mode=REQUIRED --enable-cleartext-plugin \
  -e "SELECT id, first_name FROM radiant_tenant.patient LIMIT 5"
```

`--enable-cleartext-plugin` is the mysql CLI's opt-in to sending the password to a plugin that
asks for it; the connection is TLS-encrypted regardless. JDBC clients (DBeaver) need no
equivalent flag — Connector/J accepts the cleartext plugin automatically once the connection is
encrypted, which is exactly why the listener requires TLS.

A `member` should see masked PII (`***`) and a `geneticist` clear values — same as any other
path, proving the gateway is transparent to Ranger.
