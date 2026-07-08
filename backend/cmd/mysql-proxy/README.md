# mysql-proxy

A small TCP proxy that lets **Go / GORM** clients authenticate to StarRocks as a **JWT user**.

Go's `go-sql-driver/mysql` implements a fixed set of auth plugins and has no extension point,
so it can't speak StarRocks' `authentication_openid_connect_client` plugin — the driver would
have to be forked. Instead this proxy translates during the login handshake:

```
Go client ──cleartext (mysql_clear_password: JWT sent as the "password")──▶ proxy
proxy     ──TLS + authentication_openid_connect_client (JWT as auth data)──▶ StarRocks
```

After login it's a transparent byte pipe. Because every query then runs as the authenticated
user, **Ranger enforces per-user masking / row-filter / tenant access** on the API's queries —
no need to reimplement any of that in the application.

> **Security:** the JWT crosses the client↔proxy hop in **cleartext**. Run the proxy on the same
> host (or a trusted network) as the Go service and restrict its listen port to that peer.

## Run (local dev)

```bash
# StarRocks is port-forwarded to 127.0.0.1:9030 by the compose stack; it uses a self-signed
# cert, so leave STARROCKS_SSL_CA unset to skip verification in dev.
STARROCKS_ADDR=127.0.0.1:9030 LISTEN_ADDR=:9031 go run ./cmd/mysql-proxy
```

## Verify

The proxy accepts `mysql_clear_password`, so you can exercise it with the MySQL CLI (no Go
program needed) — point the client at the **proxy** (`:9031`), not StarRocks, and pass the JWT
as the password:

```bash
JWT=$(curl -s -X POST "$KC_URL/realms/$REALM/protocol/openid-connect/token" \
  -d client_id=radiant -d client_secret=... -d username=<user> -d password=... \
  -d grant_type=password | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')
SUB=$(printf %s "$JWT" | cut -d. -f2 | base64 -d 2>/dev/null | python3 -c 'import sys,json;print(json.load(sys.stdin)["sub"])')

mysql -h127.0.0.1 -P9031 -u"$SUB" \
  --default-auth=mysql_clear_password --enable-cleartext-plugin -p"$JWT" \
  -e "SELECT id, first_name, can_read_pii FROM qlin_tenant.patient ORDER BY id"
```

A `member` user should see `***`; a `geneticist` should see clear values — same result as a
native OIDC connection, proving the translation is transparent. From Go, connect with
`allowCleartextPasswords=true` and the JWT as the DSN password, pointing at the proxy.

## Configuration

| Env | Purpose | Default |
|-----|---------|---------|
| `LISTEN_ADDR` | address to accept cleartext clients on | `:9031` |
| `STARROCKS_ADDR` | StarRocks FE MySQL address | `starrocks:9030` |
| `STARROCKS_SSL_CA` | CA bundle to verify StarRocks' cert; unset = skip verification (dev only) | — |
| `PROBE_PORT` | HTTP health-probe port (`GET /status`) | `9998` |

## Scope

This is **Piece 1**: the proxy binary. Wiring the API's StarRocks read path to open per-user
connections through it (forwarding the request's JWT as the password) is the separate, larger
follow-on.
