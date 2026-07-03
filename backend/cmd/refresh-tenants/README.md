# refresh-tenants

A control-plane CLI that re-applies a tenant's derived StarRocks + Ranger configuration
(or every tenant's) after a schema or policy change. Idempotent; touches **StarRocks**
(view DDL), **PostgreSQL** (reads), and **Ranger** (PII-masking policies). It is not part
of the request-serving API.

```bash
go run ./cmd/refresh-tenants            # every tenant
go run ./cmd/refresh-tenants -code demo # one tenant
```

## What it refreshes

1. **Per-tenant StarRocks views.** A StarRocks view freezes its column list at creation
   time, so a migration that adds, drops, or renames a column on a federated table requires
   the per-tenant views to be recreated. (See [`create-tenant`](../create-tenant) for how
   the views are built — this command re-runs that same view DDL.) Recreating is safe: each
   view is `DROP` + `CREATE`, and a missing tenant database is created on the fly.
2. **Global Ranger PII-masking policies.** The masking-subject marker role, SELECT +
   row-filter on `auth.pii_grant`, and the `patient` column masks — plus re-nesting each
   tenant role under the marker so its members are masking subjects. These are static
   (independent of tenant count) and idempotently upserted.

The view refresh also happens **automatically in the API on startup** when a migration
changed the schema (gated by `VIEW_REFRESH_ON_STARTUP_ENABLED`, serialized across replicas
by a Postgres advisory lock, non-fatal — see [`cmd/api/view_refresh.go`](../api/view_refresh.go)).
That path deliberately **excludes the Ranger masking** (no Ranger creds at API runtime), so
this command is the entry point for the masking policies and the break-glass tool for views.

## Configuration

Reads the same environment as the API:

| Vars | System |
|------|--------|
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USERNAME` / `DB_PASSWORD` / `DB_SSL_MODE` | StarRocks (privileged / `root`) |
| `PGHOST` / `PGPORT` / `PGDATABASE` / `PGUSER` / `PGPASSWORD` / `PGSSLMODE` | PostgreSQL |
| `RANGER_URL` / `RANGER_ADMIN_USER` / `RANGER_ADMIN_PASSWORD` | Ranger (admin) |

Against the local `compose` stack, set `DB_SSL_MODE=skip-verify` (StarRocks runs with
TLS enabled).
