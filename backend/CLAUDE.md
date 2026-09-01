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
  mysql-proxy/   - Loopback sidecar: Go/GORM clients log in to StarRocks as a JWT user
  mysql-gateway/ - Human-facing endpoint: any MySQL client logs in with a Keycloak
                   username + password (TLS required); it does the token exchange
internal/
  authorization/ - Keycloak authorization (RBAC middleware)
  mysqlproxy/  - MySQL wire-protocol translation shared by cmd/mysql-proxy and
                 cmd/mysql-gateway; the Authenticator seam is the only difference
  batchval/    - Batch validation context, caching, record validation
  client/      - External clients (PubMed, Keycloak admin, Ranger admin)
  database/    - DB connection setup (postgres.go, starrocks.go)
  provisioning/- Wires service.AdminDeps from env config; shared by cmd/api and cmd/createuser
  repository/  - Data access layer, split by DB target into postgres/ and starrocks/ subpackages
  server/      - HTTP handlers grouped by resource; middlewares
  service/     - Cross-system orchestration (user provisioning, tenant setup, Ranger policies)
  types/       - Domain models, filters, facets, OpenAPI annotations
  utils/       - Auth, S3, mappers, env helpers, collection utilities
scripts/
  init-sql/migrations/ - PostgreSQL migrations (golang-migrate)
test/testutils/        - Shared test infrastructure (containers, fixtures, JWT, mocks)
```

### Repository layer (split by database target)

`internal/repository/` is split so a repository's target database is explicit and enforced at compile time:

- `postgres/` — repositories owning PostgreSQL data; constructors take `database.PostgresDB`.
- `starrocks/` — repositories reading StarRocks (federation / per-tenant views); constructors take `database.StarrocksDB`.

`database.PostgresDB` / `database.StarrocksDB` (in `internal/database/`) are named `*gorm.DB` wrappers — passing the wrong connection to a constructor is a compile error, not a runtime SQL failure.

Repositories whose data lives in both places are split into two types by role: e.g. `postgres.CasesRepository` (writes/CRUD) and `starrocks.CasesRepository` (search/reads); likewise for `documents` and `sequencing_experiment`. The API builds the StarRocks read variants; the worker/batchval build the PostgreSQL write variants — each side constructs only the variant it needs.

Shared JOIN SQL lives once in `internal/utils/joins` as methods on a `Joiner`; a repo picks `joins.Starrocks()` (resolves table names via `TenantQualifiedName` — federation / tenant views) or `joins.Postgres()` (`.Name`) in its constructor.

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
- `/batches`, `/patients/batch`, `/samples/batch`, `/sequencing/batch`, `/cases/batch` — additionally require the `can_ingest_data` action

Middleware stack (in order): request id → structured request logging (slog) → metrics → gzip → Keycloak logger → CORS → Keycloak authentication → recovery.

Logging uses stdlib `log/slog` with JSON output (see `internal/observability`). The `RequestID` middleware assigns each request a correlation id (reusing an inbound `X-Request-ID` or minting a UUID), echoes it on the response, and threads it through the request context so every `slog.*Context` line carries `request_id`. `HandleError` returns that same id as `X-Correlation-ID`. Prometheus metrics are exposed at public `GET /metrics`.

## Authorization

Keycloak is the sole authentication provider: JWT claims (`sub`, `azp`, `resource_access`). Authorization is the tenant/action model below — Keycloak roles no longer gate any route. Batch endpoints are gated by the `can_ingest_data` action.

Auth utilities live in `internal/utils/auth.go` (`KeycloakAuth` interface).

### Multi-tenancy authorization model (`auth_db`)

Authorization is **data**, not a separate service. Migration `000009_init_auth_multi_tenancy.up.sql` adds the model as 8 PostgreSQL tables (in `public`; the ADR's `auth_db.*` is the logical name, federated into StarRocks as `radiant_jdbc.public.*`). Migration `000011_rekey_users_by_user_id.up.sql` then re-keys identity to `user_id` (see below). See `docs/adr/multi-tenancy-security.md` §5.

Identifiers are **varchar `code` natural keys** — no integer surrogate ids — so every reference column is `*_code`. Users are keyed by **`user_id`** (the Keycloak `sub`), which is required and unique; `email` / `first_name` / `last_name` are optional attributes. `user_id` is the same column name used by `saved_filter` / `user_preference` / `user_set` / `occurrence_note`. **Consequence:** a user must exist in Keycloak (have a `sub`) before they can be granted roles — there is no pre-provisioning by email before first login. (Migration 000009 originally keyed users by email; 000011 reversed that.)

| Table | Key | Purpose |
|---|---|---|
| `tenant` | `code` | Tenant catalog (e.g. `radiant`) |
| `organization` | `(code, tenant_code)` | Orgs, each belonging to one tenant (pre-existing table; `id` dropped, `tenant_code` added) |
| `users` | `user_id` | Identity registry, keyed by the Keycloak `sub` (required, unique); `email` / `first_name` / `last_name` are optional attributes |
| `role` | `(tenant_code, code)` | Per-tenant role catalog; `is_default` marks a seeded role, which is locked (no edit, no delete) |
| `action` | `code` | Global action catalog; `scope` ∈ {`org`,`tenant`}; `grantable` = may a custom role map it (false for `can_manage_user` alone) |
| `role_action` | `(tenant_code, role_code, action_code)` | Role → action mapping; FK to `role` `ON DELETE CASCADE` |
| `user_role` | `(user_id, tenant_code, org_code, role_code)` | Single grant table (`user_id` FK → `users`); `org_code` is nullable — `NULL` = not org-scoped (tenant-wide grant), `'*'` = all orgs in tenant, specific code = that org. Uniqueness enforced by two partial indexes (one for non-NULL `org_code`, one for NULL). |

The org-linked clinical tables (`cases`, `patient`, `sample`, `sequencing_experiment`) reference `organization(code, tenant_code)` via compound FKs; StarRocks federation joins are `ON x.<>_code = org.code AND x.tenant_code = org.tenant_code`.

The remaining tenant-scoped tables carry `tenant_code varchar(50) NOT NULL` with an FK to `tenant(code)` (added by migration `000013_tenant_scope_clinical_tables.up.sql`): `document`, `family`, `family_history`, `obs_categorical`, `obs_string`, `occurrence_note`, `occurrence_flag`, `project`, `task`, `batch`, `interpretation_germline`/`interpretation_somatic` (+ their `_history` twins — column-only, no FK; `tp_history_func` copies positionally via `$5.*`, so the column is appended last), plus the tenant-owned catalogs `analysis_catalog` and `panel` (plain column — their PK stays the integer `id`, so inbound FKs are untouched; their `UNIQUE(code)` widens to `UNIQUE(code, tenant_code)`) and `user_set` (holds tenant entity IDs). Migration `000020_add_fetus.up.sql` adds `fetus` to this list with the same `tenant_code` + FK + index pattern — the prenatal case's clinical subject, modeled as tissue of its mother (the case's proband) with no administrative identity of its own; see `project-tasks/radiant-migration/foetus-analysis.md` in the parent clin-localstack repo.

**Not** tenant-scoped (deployment-wide "instance" data): the enum/reference dictionaries (`sex`, `case_status`, `sample_type`, `priority`, …); `saved_filter` + `user_preference` (`saved_filter` queries are tenant-agnostic); all pure junctions (`case_has_sequencing_experiment`, `task_context`, `task_has_document`, `panel_has_genes`, `user_set_*`); and the identity/global auth tables (`tenant`, `users`, `action`).

**No DB default — writes derive `tenant_code` from the active tenant.** 000013 deliberately omits a column `DEFAULT` (a default would silently route writes to one tenant). Existing rows are backfilled with an explicit `UPDATE … SET tenant_code = 'radiant'`. Writes resolve the tenant from the request:
- **API handlers** read the active tenant from the `/:tenant` path via `GetTenant(c)` (stored by `RequireTenantAccess`) and set it on the record — interpretations through `fillInterpretationCommonWithContext`, occurrence notes/flags in the handler, and the batch handlers pass it to `CreateBatch(tenantCode, …)`.
- **The worker** reads `tenant_code` from the batch it is processing (`ClaimNextBatch` returns it) and attaches every record it persists to that tenant (`StorageContext.TenantCode` / the per-entity `insert*Records` helpers in `cmd/worker`). A batch is stamped with the submitter's tenant at creation, so worker-persisted cases/patients/samples/etc. inherit it.

`types.DefaultTenantCode` ("radiant") remains the seed/launch tenant (migration backfill + the value test fixtures use); it is no longer a write-time fallback. Test seed fixtures and inline test inserts list `tenant_code` explicitly — there is no test-only default. Handler unit/integration tests that register `/:tenant` routes directly use a `tenantRouter()` helper that mirrors `RequireTenantAccess`'s context write.

**Seeded** (idempotent, `ON CONFLICT DO NOTHING`): the `radiant` default tenant + 8 actions (`can_read_pii`, `can_interpret_variant`, `can_comment_variant`, `can_flag_variant`, `can_download_file`, `can_ingest_data`, `can_search_case`, `can_view_kb`). No default roles — tenants define their own. User backfill is out of scope.

#### Enforcement

Two `internal/server` middlewares enforce this model on `/:tenant/*` routes:

- `RequireTenantAccess` — group-level; verifies tenant membership (`HasTenantAccess`) and stores the tenant in context (`GetTenant`).
- `RequireAction(auth, repo, action)` — per-route; verifies the caller holds a specific action (`HasAction`). Wired in `cmd/api/main.go` via the `requireAction(...)` closure; action codes are `types.Action*` constants. On denial it returns a **generic 403** (the missing action is logged, never put in the body) and logs server-side.

Org resolution for org-scoped actions is deferred behind `resolveOrgCode(c)` (a seam in `middlewares.go`): step 1 returns `WildcardOnlyOrg` (`""`, matches only `'*'` grants — correct while all grants are `'*'`); a follow-up will resolve the real org per resource. Every `/:tenant` route is covered by `Test_TenantRoutesAreMappedToActions` (in `cmd/api`), which fails if a new route ships unlisted: an action-gated route goes in `expectedTenantActions` (route → `RequireAction` code), and an intentionally **member-readable** route — gated by tenant membership (`RequireTenantAccess`) alone, no `RequireAction`, for referential reads any member may see, e.g. `GET /:tenant/organizations` — goes in the `membershipOnlyTenantRoutes` allowlist instead.

#### Read-path tenant isolation

Reads are scoped to the active tenant in two places, both activated by `TENANT_VIEWS_READ_ENABLED` (`RequireTenantAccess` binds the tenant to the request context only when on; off → no tenant bound → reads are unscoped / single-tenant behavior):

- **StarRocks (federated clinical reads):** repositories address the tenant's view database `<code>_tenant.*` via `types.TenantSchema(ctx)` / `types.Table.In(schema)` instead of `radiant_jdbc.public.*`. Off → `radiant_jdbc.public` (unchanged).
- **PostgreSQL-direct reads:** repositories that read/update/delete a tenant-scoped table apply the `postgres.WithTenant(ctx)` GORM scope, which adds `WHERE tenant_code = ?` from the bound tenant. It is a **no-op when no tenant is bound**, so the worker (processes all tenants) and the unscoped default path are unaffected. A cross-tenant row is then invisible → repos return nil → handlers return 404 (no existence leak). **Any new read/update/delete against a tenant-scoped PG table (`interpretation_germline`/`interpretation_somatic`, `occurrence_note`, `occurrence_flag`, `batch`, `task`) must add `.Scopes(postgres.WithTenant(ctx))`.** The federated tables (cases, patient, documents, …) are isolated by the StarRocks views above, not here.

**Dropping a federated table:** tenant views are `CREATE OR REPLACE` and are never implicitly removed, and `FederatableColumns` returns no columns for a table that no longer exists — so the view is skipped by the refresh loop rather than fixed by it, and outlives its source table. Any environment that has already built tenant views needs the stale view dropped by hand (`DROP VIEW IF EXISTS <code>_tenant.<table>`). Both view flags default to off, so this only applies once a deployment has enabled them.

##### `snv__variant` is per-tenant (SJRA-1754)

The genomic pipeline writes `snv__variant` into each tenant's database rather than the shared base DB, so `types.VariantTable` carries `PerTenant: true` and a tenant's variant catalog holds **only the loci that tenant carries** (it previously held every annotated locus). `snv__consequence` / `snv__consequence_filter_partitioned` stay shared, so consequence→variant joins now cross databases. Three consequences, none of them visible from the code:

1. **Occurrence↔variant consistency is a load-bearing pipeline invariant.** Within a tenant, every locus in `germline__snv__occurrence` / `somatic__snv__occurrence` must have a row in that tenant's `snv__variant`, because the list / count / aggregation / statistics queries *inner*-JOIN it (`JoinSNVOccurrencesWithVariants`, `internal/repository/starrocks/snv_occurrences.go`). A missing row **silently drops the occurrence from results, counts and facets** rather than erroring — impossible before, when the variant catalog was global. Verify a backfill on this before enabling reads for a tenant.
2. **Consequence-only reads are deliberately not gated on the tenant's catalog.** `GetVariantConsequences` (`variants.go`) and the gene-panel symbol lookup (`gene_panels.go`) read `snv__consequence` with no variant join, so for a locus the tenant does not carry they return annotations while the variant-driven endpoints (header, overview, frequencies) return 404. Accepted: consequence rows are non-PII reference annotation and reveal nothing about another tenant's cohort.
3. **Internal frequencies are single-tenant.** `germline_pc_*/pn_*/pf_*` and `somatic_pc_tn_*/pn_tn_*/pf_tn_*` are now the tenant's own cohort, not all tenants pooled, so displayed values drop and a tenant with no somatic experiments reads `somatic_pn_tn_* = 0`. Known follow-ups, not yet done: the route `/variants/germline/:locus_id/internal_frequencies/global` and `GetGermlineVariantGlobalInternalFrequencies` are misnamed (renaming the route is a breaking API change), the frontend tooltips still say "across all patients of the network" (`frontend/translations/common/en.json`), and saved filters carrying frequency thresholds (`germline_pf_wgs` is filterable and sortable) will match different variant sets.

Because `TENANT_VIEWS_READ_ENABLED` gates whether a tenant is bound at all, `PerTenant` is inert while it is off — with no tenant bound, `TenantQualifiedName` emits bare names for shared and per-tenant tables alike. So deploying this is safe ahead of a backfill; the cutover is the flag flip. `Test_SNVOccurrences_NoTenant_KeepsBareNames` is the regression guard for that property.

Schema scoping (above) decides *which* database a read targets; it does not by itself enforce PII masking or access — that is **Ranger**, and Ranger only sees a per-user identity if the query runs **as that user**. When `STARROCKS_PROXY_READ_ENABLED` is on, `server.BindStarrocksUserPool` (group middleware on `/:tenant`) opens a per-request StarRocks pool through `mysql-proxy` authenticated with the caller's JWT (default DB `<code>_tenant`) and binds it to the request context. The shared StarRocks `*gorm.DB` is backed by `database.routingConnPool`, which routes each query to that per-request pool — so repositories are unchanged, yet their reads run as the user and Ranger applies masking / row-filter / DB access. **The root fallback is unmasked and fail-open**, safe only because the middleware sits at the group level (every `/:tenant` read has a user pool bound, or the request was aborted); never read tenant StarRocks data off a context that skipped it. Off (default) → all reads use the shared `root` pool (today's behavior). See `internal/database/routing.go` and `internal/server/middlewares_starrocks.go`.

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
| `LOG_LEVEL` | slog level for JSON logs (`debug`/`info`/`warn`/`error`) | info |
| `KEYCLOAK_HOST/REALM/CLIENT` | Keycloak | localhost:8080 |
| `KEYCLOAK_ADMIN_CLIENT_ID/SECRET` | Service-account client (needs realm-management roles) the Keycloak **admin** client authenticates with via client_credentials. Required by any process that provisions users — `cmd/createuser`, `cmd/create-tenant`, and `POST /{tenant}/users` in the API. Read lazily, so a deployment that never provisions is unaffected. | — |
| `KEYCLOAK_DEFAULT_GROUP` | Keycloak group every newly provisioned user joins (all paths go through `service.ProvisionUser`). Empty = no group assignment; a configured group that does not exist is an error, not a silent skip. | — (none) |
| `RANGER_URL/ADMIN_USER/ADMIN_PASSWORD` | Ranger admin API used to create the user and add them to the tenant's `<code>_user` role during provisioning, and to drop that membership again on `DELETE /{tenant}/users/{user_id}`. Same lazy-read note as the Keycloak admin credentials. | — |
| `STARROCKS_JWT_JWKS_URL/REQUIRED_ISSUER/REQUIRED_AUDIENCE` | `authentication_jwt` parameters baked into each StarRocks user created during provisioning. | — |
| `VIEW_REFRESH_ON_STARTUP_ENABLED` | On every API startup, recreate every tenant's StarRocks views (CREATE OR REPLACE, idempotent; advisory-locked across replicas so one runs it per deploy; fatal on error — a build must not serve against stale views). Off by default. Tenant *creation* (which needs Ranger) stays in the `cmd/create-tenant` CLI/task. | false |
| `TENANT_VIEWS_READ_ENABLED` | When on, `RequireTenantAccess` binds the active tenant to the request context so the read path resolves the tenant's view database (`<code>_tenant`) via `types.TenantSchema` instead of the `radiant_jdbc` federation. Off by default: with no tenant bound, reads stay on `radiant_jdbc.public` (unchanged). Flip on only after every tenant's views exist and are populated (`cmd/create-tenant` / `cmd/refresh-tenants`). | false |
| `STARROCKS_PROXY_READ_ENABLED` | When on, `/:tenant` routes run their StarRocks reads **as the calling user** through `mysql-proxy` (`server.BindStarrocksUserPool`): a per-request pool opens via `STARROCKS_PROXY_ADDR` with the user's JWT and default DB `<code>_tenant`, bound to the request context; the shared handle's `routingConnPool` routes those queries to it, so Ranger enforces per-user masking / row-filter / access. Off by default → the routing pool falls back to the root (`root`) connection (today's behavior). Enable **together with** `TENANT_VIEWS_READ_ENABLED` (the per-user connection targets the tenant view DB) and only once the StarRocks FE has `access_control = ranger`, the proxy is deployed (sidecar), and every tenant's Ranger policies/role memberships exist. | false |
| `STARROCKS_PROXY_ADDR` | Address of `mysql-proxy` (`host:port`) the per-user StarRocks pool dials when `STARROCKS_PROXY_READ_ENABLED` is on. Required in that mode. | — |
| `SHARED_DATABASE` | StarRocks base database holding cross-tenant reference/annotation tables (`snv__consequence`, `snv__consequence_filter_partitioned`, gene panels, population frequencies, ensembl/cytoband, hpo/mondo terms, sequencing staging). `types.SharedDatabase` resolves it once at load; when a tenant is bound, shared tables qualify as `<SHARED_DATABASE>.<table>` (bare otherwise). Rename the base DB without code changes. Note `snv__variant` is **not** here — it is per-tenant (see Read-path tenant isolation). | radiant |
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
    repo := starrocks.NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
    ...
})
```

PostgresMode controls both cleanup and isolation:
- `ReadPostgres` — read-only, no cleanup, parallel.
- `WritePostgres` — writes with unique keys, cleanup after test, parallel.
- `ExclusivePostgres` — writes to shared state (seed data, count assertions on shared keys), cleanup after test, forces serial. Use only when the test can't use unique keys.

Serial is also forced when `MinIO: true` (t.Setenv incompatibility).

`RunTest` is the only entry point — the legacy `ParallelTestWith*` / `SequentialTestWith*` shims have been removed. Every test declares its resources via `Need`.

To make a Postgres write test parallel-safe (`WritePostgres` instead of `ExclusivePostgres`):
- Use IDs/keys that `cleanUp` preserves (e.g., `case_id=1` or `case_id=71` for `occurrence_note`). Check `test/testutils/setup_postgres.go:cleanUp` for the full list of preserved ranges.
- Use a unique identifier per test (e.g., a distinct `occurrence_id`) so count/list assertions don't see rows from other tests.

StarRocks fixtures (`test/data/<folder>/*.tsv`) are loaded once per process per folder and shared across tests; the StarRocks test database is treated as read-only. This invariant is enforced at runtime by a GORM read-only guard (`test/testutils/setup_starrocks.go`): any attempt to INSERT, UPDATE, DELETE, DROP, ALTER, or TRUNCATE through a test StarRocks connection will fail immediately with `testutils.ErrStarrocksReadOnly`. This applies to both ORM operations (`db.Create`, `db.Save`, `db.Delete`) and raw SQL (`db.Exec`).

### Multi-tenant StarRocks fixtures

By default a fixture folder is loaded into a single flat StarRocks database, and tests run with no tenant bound — so `types.Table.TenantQualifiedName` yields bare names. To exercise the real multi-database deployment (shared `types.SharedDatabase` + one `<code>_tenant` database per tenant for `PerTenant` tables), set `Need.Tenants`:

```go
testutils.RunTest(t, testutils.Need{Starrocks: "simple", Tenants: []string{"tenant1", "tenant2"}},
    func(t *testing.T, env *testutils.Env) {
        ctx := env.TenantCtx("tenant1")            // bind the tenant
        db := env.Starrocks.WithContext(ctx)       // reads resolve to tenant1_tenant.* / radiant.*
        ...
    })
```

The loader (`initStarrocksMultiTenant`) puts shared/reference tables in `radiant` and the five `PerTenant` tables (germline/somatic SNV, germline CNV, exomiser, `snv__variant`) in each `<code>_tenant` database. `PerTenant`-vs-shared is derived from the `types.Table` defs (`perTenantTables`), so it can't drift. Each tenant's `PerTenant` rows are offset by `testutils.TenantKeyOffset * <tenant index>` on the columns named in `Need.TenantKeyColumns`, so the tenants' data is disjoint and isolation is observable in executed queries (see `Test_SNVOccurrences_TenantIsolation_Executes`, which offsets `seq_id`). `Need.TenantKeyColumns` is per test and has no default: leave it empty and both tenants get identical rows (no isolation), so a test that asserts isolation must name its key column(s). Whatever you offset here must match how the query filters — if you offset `task_id`, the query's `task_id` filter has to use the offset value for the non-zero-index tenant too. The returned connection is not pinned to one database, so fully-qualified cross-database names resolve. Bind the tenant with `env.TenantCtx(code)`; use this mode for tests that assert on `PerTenant`-table behavior. Note: the shared database name is global (`types.SharedDatabase`, resolved once at load), so multi-tenant tests should use a single fixture folder. The same trap applies to `Need` itself: the loader caches per `(folder, tenants, keyColumns)` but the databases it builds (`radiant`, `<code>_tenant`) are globally named, so **two multi-tenant tests whose `Need` differs in any of those three will each run a load and `DROP`/`CREATE` those databases underneath each other** — they run in parallel, so it surfaces as a confusing `Can't create database 'radiant'; database exists` or a vanished table. Until the loader guards against this, every multi-tenant test in a package must declare an identical `Need` (see `Test_SNVOccurrences_TenantIsolation_Executes` and `Test_VariantOverview_CrossDatabaseJoin_Executes`, which share `Tenants` *and* `TenantKeyColumns` for exactly this reason). Federated views (`<code>_tenant` views over `radiant_jdbc`) are not built by this loader — queries that touch federated tables under a bound tenant need those views (a follow-up).

## Adding a New API Endpoint

Follow the [add-endpoint skill](.claude/skills/add-endpoint/SKILL.md). It covers DB schema, types, repository + tests, handler + tests, route + integration test, swagger + client regeneration, Postman, and updating this file when patterns change.

Universal coding/testing rules that apply to every backend change live in [.claude/rules/universal.md](.claude/rules/universal.md). Go style conventions (naming, errors, interface placement — a project-annotated copy of the Go Code Review Comments) live in [.claude/rules/go-code-review.md](.claude/rules/go-code-review.md).

## Adding a DB Migration

```bash
make migrate   # creates a new timestamped migration file in scripts/init-sql/migrations/
```

Migrations run automatically on startup (`internal/database/postgres.go`).
