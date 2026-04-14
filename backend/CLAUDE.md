# Backend - Claude Code Guide

## Overview

Go backend for the Radiant Portal — a medical/genomic data platform. Exposes a REST API and an async batch-processing worker. Go 1.24.

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
  authorization/ - Keycloak (default) and OpenFGA authorization providers
  batchval/    - Batch validation context, caching, record validation
  client/      - External clients (PubMed)
  database/    - DB connection setup (postgres.go, starrocks.go)
  repository/  - Data access layer (61 files); separated by DB target
  server/      - HTTP handlers grouped by resource; middlewares
  types/       - Domain models, filters, facets, OpenAPI annotations
  utils/       - Auth, S3, mappers, env helpers, collection utilities
scripts/
  init-sql/migrations/ - PostgreSQL migrations (golang-migrate)
  init-openfga/        - OpenFGA authorization model and tests
test/testutils/        - Shared test infrastructure (containers, fixtures, JWT, mocks)
```

## Key Frameworks & Libraries
- **Gin** v1.10 — HTTP router/framework
- **GORM** v1.25 — ORM (MySQL driver for StarRocks, postgres driver for PG)
- **gin-keycloak** — Keycloak RBAC middleware
- **openfga/go-sdk** — Fine-grained access control (optional)
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
make test          # Unit + integration tests + OpenFGA model tests
make itest         # Integration tests only (repository layer)
make doc           # Generate OpenAPI v3.1 spec + OpenFGA JSON model
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

Two providers, selected via `RADIANT_AUTHORIZATION_PROVIDER` env var (default: `keycloak`):

- **Keycloak**: RBAC via JWT claims (`sub`, `azp`, `resource_access`). `data_manager` role gates batch endpoints.
- **OpenFGA**: Fine-grained access control; contextual tuples from JWT. Relations: `reader` (GET) / `writer` (POST/PUT/PATCH/DELETE). Model: `scripts/init-openfga/model.fga`.

Auth utilities live in `internal/utils/auth.go` (`KeycloakAuth` interface).

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
| `PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD` | PostgreSQL | localhost:5432 |
| `API_PORT` | API listen port | 8090 |
| `KEYCLOAK_HOST/REALM/CLIENT` | Keycloak | localhost:8080 |
| `RADIANT_AUTHORIZATION_PROVIDER` | `keycloak` or `openfga` | keycloak |
| `AWS_ENDPOINT_URL/REGION/ACCESS_KEY_ID/SECRET_ACCESS_KEY` | S3/MinIO | — |
| `S3_PRESIGNED_URL_EXPIRE` | URL TTL | 60m |
| `PUBMED_BASE_URL` | PubMed API | ncbi.nlm.nih.gov |
| `POLL_INTERVAL_MS` | Worker poll interval | 1000 |

## Testing

Tests use **testcontainers** for isolated DB instances — no manual setup required.

```bash
make test   # all tests
make itest  # integration tests (repository layer)
# OpenFGA model tests (requires fga CLI):
fga model test --tests ./scripts/init-openfga/tests.fga.yaml
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

Serial is also forced when `MinIO: true` (t.Setenv incompatibility) or `OpenFGA: true` (process env mutation).

Legacy shims (`ParallelTestWithStarrocks`, `ParallelTestWithPostgres`, `SequentialTestWithPostgres`, etc.) still exist and route through `RunTest`. New tests should use `RunTest` directly.

StarRocks fixtures (`test/data/<folder>/*.tsv`) are loaded once per process per folder and shared across tests; the StarRocks test database is treated as read-only.

## Adding a New API Endpoint

1. Add type definitions in `internal/types/`.
2. Add repository method in `internal/repository/` (target the correct DB).
3. Add handler in `internal/server/` (follow existing resource grouping).
4. Register route in `cmd/api/main.go` under the appropriate group.
5. Add Swagger annotations and run `make doc` to regenerate the spec.
6. Add handler unit test in `internal/server/` and integration test in `cmd/api/`.

## Adding a DB Migration

```bash
make migrate   # creates a new timestamped migration file in scripts/init-sql/migrations/
```

Migrations run automatically on startup (`internal/database/postgres.go`).
