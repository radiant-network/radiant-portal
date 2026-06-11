# Backend - Claude Code Guide

## Overview

Go backend for the Radiant Portal — a medical/genomic data platform. Exposes a REST API and an async batch-processing worker. Go 1.25.

## Architecture

### Dual-database design
- **StarRocks** (MySQL-compatible, port 9030): analytical/genomic data — cases, variants (germline SNV/CNV), genes, gene panels, documents, Exomiser, ClinVar.
- **PostgreSQL** (port 5432): operational/clinical data — batches, patients, samples, sequencing experiments, interpretations, user preferences, saved filters, tasks, value sets.

### Package layout
```
cmd/
  api/         - API server entry point, router setup, integration tests
  worker/      - Batch validation worker, validation logic per entity type
internal/
  authorization/ - Keycloak authorization (RBAC middleware)
  batchval/    - Batch validation context, caching, record validation
  client/      - External clients (PubMed)
  database/    - DB connection setup (postgres.go, starrocks.go)
  repository/  - Data access layer (61 files); separated by DB target
  server/      - HTTP handlers grouped by resource; middlewares
  types/       - Domain models, filters, facets, OpenAPI annotations
  utils/       - Auth, S3, mappers, env helpers, collection utilities
scripts/
  init-sql/migrations/ - PostgreSQL migrations (golang-migrate)
test/testutils/        - Shared test infrastructure (containers, fixtures, JWT, mocks)
```

## Key Frameworks & Libraries
- **Gin** v1.10 — HTTP router/framework
- **GORM** v1.25 — ORM (MySQL driver for StarRocks, postgres driver for PG)
- **gin-keycloak** — Keycloak RBAC middleware
- **golang-jwt/jwt/v5** — JWT parsing
- **aws-sdk-go** + **minio-go** — S3/MinIO file storage
- **golang-migrate** — DB migrations
- **swaggo/swag v2** — OpenAPI 3.1 generation
- **testify** + **testcontainers-go** — Testing

## Common Commands

```bash
make install       # go mod tidy
make build         # Build API binary → bin/api/
make build-worker  # Build worker binary → bin/worker/
make run           # Run API server (port 8090)
make run-worker    # Run worker
make watch         # Live reload (air)
make docker-run    # docker compose up (all dependencies)
make docker-down   # docker compose down
make test          # Unit + integration tests
make itest         # Integration tests only (repository layer)
make fmt           # Format code (gofmt -w .)
make lint          # Run golangci-lint (same config/linters as CI)
make doc           # Generate OpenAPI v3.1 spec
make clean         # Remove binaries
make migrate       # Create new migration file
```

## API Server

**Entry point:** `cmd/api/main.go`

Route groups:
- `GET /status` — health check (public, no auth)
- `/cases`, `/documents`, `/genes`, `/hpo`, `/igv`, `/interpretations`, `/mondo`, `/occurrences`, `/sequencing`, `/users`, `/variants` — protected by JWT auth middleware
- `/batches`, `/patients/batch`, `/samples/batch`, `/sequencing/batch`, `/cases/batch` — additionally require `data_manager` Keycloak role

Middleware stack (in order): CORS → Gzip → request logging → Keycloak logger → role-based auth → recovery.

## Authorization

Keycloak is the sole authentication provider: JWT claims (`sub`, `azp`, `resource_access`). The `data_manager` role gates batch endpoints.

Auth utilities live in `internal/utils/auth.go` (`KeycloakAuth` interface).

### Multi-tenancy authorization model (`auth_db`)

Authorization is **data**, not a separate service. Migration `000009_init_auth_multi_tenancy.up.sql` adds the model as 8 PostgreSQL tables (in `public`; the ADR's `auth_db.*` is the logical name, federated into StarRocks as `radiant_jdbc.public.*`). Migration `000011_rekey_users_by_user_id.up.sql` then re-keys identity to `user_id` (see below). See `docs/adr/multi-tenancy-security.md` §5.

Identifiers are **varchar `code` natural keys** — no integer surrogate ids — so every reference column is `*_code`. Users are keyed by **`user_id`** (the Keycloak `sub`), which is required and unique; `email` / `first_name` / `last_name` are optional attributes. `user_id` is the same column name used by `saved_filter` / `user_preference` / `user_set` / `occurrence_note`. **Consequence:** a user must exist in Keycloak (have a `sub`) before they can be granted roles — there is no pre-provisioning by email before first login. (Migration 000009 originally keyed users by email; 000011 reversed that.)

| Table | Key | Purpose |
|---|---|---|
| `tenant` | `code` | Tenant catalog (e.g. `radiant`) |
| `organization` | `(code, tenant_code)` | Orgs, each belonging to one tenant (pre-existing table; `id` dropped, `tenant_code` added) |
| `users` | `user_id` | Identity registry, keyed by the Keycloak `sub` (required, unique); `email` / `first_name` / `last_name` are optional attributes |
| `role` | `(tenant_code, code)` | Per-tenant role catalog |
| `action` | `code` | Global action catalog; `scope` ∈ {`org`,`tenant`} |
| `role_action` | `(tenant_code, role_code, action_code)` | Role → action mapping; FK to `role` `ON DELETE CASCADE` |
| `user_role` | `(user_id, tenant_code, org_code, role_code)` | Single grant table (`user_id` FK → `users`); `org_code` is nullable — `NULL` = not org-scoped (tenant-wide grant), `'*'` = all orgs in tenant, specific code = that org. Uniqueness enforced by two partial indexes (one for non-NULL `org_code`, one for NULL). |

The child clinical tables (`cases`, `patient`, `sample`, `sequencing_experiment`) reference `organization(code, tenant_code)` via compound FKs; StarRocks federation joins are `ON x.<>_code = org.code AND x.tenant_code = org.tenant_code`.

**Seeded** (idempotent, `ON CONFLICT DO NOTHING`): the `radiant` default tenant + 8 actions (`can_read_pii`, `can_interpret_variant`, `can_comment_variant`, `can_flag_variant`, `can_download_file`, `can_ingest_data`, `can_search_case`, `can_view_kb`). No default roles — tenants define their own. User backfill is out of scope.

#### Enforcement

Two `internal/server` middlewares enforce this model on `/:tenant/*` routes, both gated by `TENANT_ENFORCEMENT_ENABLED` (off = resolve context but allow, so it ships before `user_role` backfill without locking anyone out):

- `RequireTenantAccess` — group-level; verifies tenant membership (`HasTenantAccess`) and stores the tenant in context (`GetTenant`).
- `RequireAction(auth, repo, action, enforce)` — per-route; verifies the caller holds a specific action (`HasAction`). Wired in `cmd/api/main.go` via the `requireAction(...)` closure; action codes are `types.Action*` constants. On denial it returns a **generic 403** (the missing action is logged, never put in the body) and logs server-side.

Org resolution for org-scoped actions is deferred behind `resolveOrgCode(c)` (a seam in `middlewares.go`): step 1 returns `WildcardOnlyOrg` (`""`, matches only `'*'` grants — correct while all grants are `'*'`); a follow-up will resolve the real org per resource. Every privileged `/:tenant` route is covered by `Test_TenantRoutesAreMappedToActions`, which fails if a new route ships unmapped.

Until per-tenant API routing lands, batch-ingested records are attached to the default tenant via `DefaultTenantCode = "radiant"` in `cmd/worker/case_validation.go` (see its `TODO(multi-tenant)`).

## Worker

**Entry point:** `cmd/worker/main.go`

Polls PostgreSQL for PENDING batches; processes Patient, Sample, Sequencing Experiment, and Case batch types. Validation logic per type lives alongside `main.go` in `cmd/worker/`.

- `POLL_INTERVAL_MS` — polling interval (default 1000ms)
- `CLEAN_UP_INTERVAL_POLL_HOUR` — cleanup interval for stuck batches (default 24h)
- Health probe: `GET /status` on port `PROBE_PORT` (default 9999)

## Configuration

Copy `.env.template` → `.env`. Key variables:

| Variable | Purpose | Default |
|---|---|---|
| `DB_HOST/PORT/NAME/USERNAME/PASSWORD` | StarRocks | localhost:9030 |
| `DB_SSL_CA` | Path to CA bundle to enable TLS to StarRocks; unset = plaintext | — |
| `PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD` | PostgreSQL | localhost:5432 |
| `API_PORT` | API listen port | 8090 |
| `KEYCLOAK_HOST/REALM/CLIENT` | Keycloak | localhost:8080 |
| `TENANT_ENFORCEMENT_ENABLED` | Enforce tenant membership on `/{tenant}/*` routes (403 on cross-tenant). Off by default so routing can ship before `user_role` is backfilled; set `true` once it is. | false |
| `AWS_ENDPOINT_URL/REGION/ACCESS_KEY_ID/SECRET_ACCESS_KEY` | S3/MinIO | — |
| `S3_PRESIGNED_URL_EXPIRE` | URL TTL | 60m |
| `PUBMED_BASE_URL` | PubMed API | ncbi.nlm.nih.gov |
| `POLL_INTERVAL_MS` | Worker poll interval | 1000 |

## Testing

Tests use **testcontainers** for isolated DB instances — no manual setup required.

```bash
make test   # all tests
make itest  # integration tests (repository layer)
```

Test utilities in `test/testutils/`: DB container setup, fixtures, JWT generation, mock auth, object store setup.

**Prefer `testutils.RunTest`** (in `test/testutils/fixtures.go`) for new tests. Declare what you need via `Need`; the framework derives parallel vs serial and cleanup behavior:

```go
testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
    repo := NewGenesRepository(env.Starrocks)
    ...
})
```

PostgresMode controls both cleanup and isolation:
- `ReadPostgres` — read-only, no cleanup, parallel.
- `WritePostgres` — writes with unique keys, cleanup after test, parallel.
- `ExclusivePostgres` — writes to shared state (seed data, count assertions on shared keys), cleanup after test, forces serial. Use only when the test can't use unique keys.

Serial is also forced when `MinIO: true` (t.Setenv incompatibility).

Legacy shims (`ParallelTestWithStarrocks`, `ParallelTestWithPostgres`, `SequentialTestWithPostgres`, etc.) still exist and route through `RunTest`. New tests should use `RunTest` directly.

To make a Postgres write test parallel-safe (`WritePostgres` instead of `ExclusivePostgres`):
- Use IDs/keys that `cleanUp` preserves (e.g., `case_id=1` or `case_id=71` for `occurrence_note`). Check `test/testutils/setup_postgres.go:cleanUp` for the full list of preserved ranges.
- Use a unique identifier per test (e.g., a distinct `occurrence_id`) so count/list assertions don't see rows from other tests.

StarRocks fixtures (`test/data/<folder>/*.tsv`) are loaded once per process per folder and shared across tests; the StarRocks test database is treated as read-only. This invariant is enforced at runtime by a GORM read-only guard (`test/testutils/setup_starrocks.go`): any attempt to INSERT, UPDATE, DELETE, DROP, ALTER, or TRUNCATE through a test StarRocks connection will fail immediately with `testutils.ErrStarrocksReadOnly`. This applies to both ORM operations (`db.Create`, `db.Save`, `db.Delete`) and raw SQL (`db.Exec`).

## Adding a New API Endpoint

Follow the [add-endpoint skill](.claude/skills/add-endpoint/SKILL.md). It covers DB schema, types, repository + tests, handler + tests, route + integration test, swagger + client regeneration, Postman, and updating this file when patterns change.

Universal coding/testing rules that apply to every backend change live in [.claude/rules/universal.md](.claude/rules/universal.md). Go style conventions (naming, errors, interface placement — a project-annotated copy of the Go Code Review Comments) live in [.claude/rules/go-code-review.md](.claude/rules/go-code-review.md).

## Adding a DB Migration

```bash
make migrate   # creates a new timestamped migration file in scripts/init-sql/migrations/
```

Migrations run automatically on startup (`internal/database/postgres.go`).
