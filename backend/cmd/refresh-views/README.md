# refresh-views

A control-plane CLI that re-applies a tenant's StarRocks views (or every tenant's)
after a schema change. Idempotent; touches only **StarRocks** (DDL) and **PostgreSQL**
(reads) — **no Ranger, no new credentials**. It is not part of the request-serving API.

```bash
go run ./cmd/refresh-views            # every tenant
go run ./cmd/refresh-views -code demo # one tenant
```

## Why it exists

A StarRocks view freezes its column list at creation time, so a migration that adds,
drops, or renames a column on a federated table requires the per-tenant views to be
recreated. (See [`create-tenant`](../create-tenant) for how the views are built —
this command re-runs that same view DDL.) Recreating is safe: each view is
`DROP` + `CREATE`, and a missing tenant database is created on the fly.

Refresh happens in **two** places:

- **Automatically, in the API on startup** — when (and only when) a migration actually
  changed the schema. Gated by `VIEW_REFRESH_ON_STARTUP_ENABLED` (default off),
  serialized across replicas by a Postgres advisory lock, non-fatal. See
  [`cmd/api/view_refresh.go`](../api/view_refresh.go). This is the normal path.
- **Manually, via this command** — the break-glass / recovery tool: rebuild views out
  of band (e.g. after a failed startup refresh, or to backfill a tenant whose views
  were never built).

## Configuration

Reads the same environment as the API:

| Vars | System |
|------|--------|
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USERNAME` / `DB_PASSWORD` / `DB_SSL_MODE` | StarRocks (privileged / `root`) |
| `PGHOST` / `PGPORT` / `PGDATABASE` / `PGUSER` / `PGPASSWORD` / `PGSSLMODE` | PostgreSQL |

Against the local `compose` stack, set `DB_SSL_MODE=skip-verify` (StarRocks runs with
TLS enabled).
