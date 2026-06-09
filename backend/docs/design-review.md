# Backend Design Review — Radiant Portal Go API

## Context

First task as a new engineer: analyze `backend/` and recommend design changes. The backend is a
Go 1.25 monorepo component (~21K LOC prod, ~30K LOC test) serving a medical/genomic platform via a
Gin REST API plus an async batch worker, over a dual-database split (StarRocks analytical +
PostgreSQL operational), with Keycloak/RBAC multi-tenant auth.

**Overall assessment: this is a healthy, above-average Go codebase.** Clean handler → repository →
GORM layering, explicit constructor-based DI with no global mutable state, consistent `%w` error
wrapping, a genuinely strong containerized test harness (`testutils.RunTest`, 1.4:1 test:code ratio),
and codified conventions in `backend/.claude/rules/`. The recommendations below are refinements and
gap-closing, **not** a rescue. They are ordered by value/effort. Several are already in-flight
(SJRA-1576) — I align with the existing direction rather than redirecting it.

> Note: this is an analysis deliverable. Nothing here is implemented yet; the file is the review.
> The "Quick wins" section is what I'd pick up first if asked to act.

---

## Findings & recommendations (prioritized)

### P0 — Security / correctness

**1. `HandleError` leaks internal error detail to API clients.**
`internal/server/errors.go:20` returns `Detail: err.Error()` on 500s. Raw GORM/driver errors
(constraint names, SQL fragments, host info) reach the client. Fix: log the full error server-side
(with a correlation id), return a generic `Detail` (or omit it). This is the single most concrete
issue found. Low effort, touches one function + its callers' expectations.

**2. Database TLS is opt-in and silently plaintext when unset.**
StarRocks (`DB_SSL_CA`) and Postgres (`PGSSLMODE`) default to plaintext (`internal/database/`).
For a PII/genomic platform, prod should *fail fast* if TLS isn't configured. Add a startup assertion
gated by an env (e.g. `REQUIRE_DB_TLS=true` in prod manifests) rather than changing local-dev defaults.

### P1 — CI / toolchain hygiene (cheap, high leverage)

**3. No linter in CI.** `backend.yml` runs build + test only; `go vet`/`golangci-lint` never run,
despite `backend/.claude/rules/go-code-review.md` codifying exactly the rules a linter enforces. Add
a `golangci-lint` job (start with `govet, staticcheck, errcheck, ineffassign, unused`; the rules doc
maps cleanly onto these). Catches the style drift the agents flagged (mixed-case error strings, etc.)
automatically.

**4. Three-way Go version drift.** `backend/CLAUDE.md` says Go 1.24, `go.mod` declares 1.25, CI
(`backend.yml`) pins `go-version: '1.23'` and uses the deprecated `setup-go@v4` (twice, redundantly,
in the `build` job). CI building on an older toolchain than `go.mod` targets is a real risk. Pin one
version everywhere (read it from `go.mod` via `setup-go`'s `go-version-file: backend/go.mod`), bump
`setup-go@v5`, and remove the duplicate step.

### P2 — Observability (the clearest capability gap)

**5. No structured logging, correlation ids, metrics, or tracing.**
Logging is `glog`/Gin text lines; there's no request id threaded through layers, no batch
success/failure/latency metrics, no `/metrics` endpoint. For an async batch system this is the
weakest operational area. Recommend: migrate to `log/slog` (stdlib, Go 1.21+) with JSON output, inject
a request-id middleware, and expose Prometheus counters/histograms (batch outcomes, repo query
latency, HTTP status). Incremental — start with slog + request id, add metrics next.

**6. No graceful shutdown.** Worker is `for { process(); time.Sleep() }` with no signal handling;
API uses `r.Run()` (no `http.Server.Shutdown`). Background goroutines (health probe, cleanup ticker)
never stop cleanly. Add `signal.NotifyContext(SIGTERM/SIGINT)`, thread the context into the poll loop
and `server.Shutdown(ctx)`. Matters for clean rollouts in k8s and for not abandoning an in-flight batch.

### P3 — Code structure (maintainability, larger effort)

**7. Thread `context.Context` through repositories.**
The project's own `go-code-review.md` says "context.Context is the first parameter, named ctx," yet
repository methods (`SearchCases(query)`, etc.) don't take one — so there's no query
cancellation/timeout and #5's tracing can't propagate. This is consistent with their stated rules,
not a new opinion. Large surface area (61 repo files) but mechanical: add `ctx`, call
`db.WithContext(ctx)`. Best done as a dedicated slice, like SJRA-1576.

**8. Duplication across occurrence handlers + repeated GORM query scaffolding.**
`handlers_germline_snv_occurrences.go`, `handlers_germline_cnv_occurrences.go`,
`handlers_somatic_snv_occurrences.go` share ~80% structure (Count/List/Aggregate/Statistics);
`variants.go` (560 lines) repeats the Table/Join/Select/First-with-NotFound dance. Extract a shared
query-builder helper and consider generics for the occurrence handler family. Reduces the largest
files and the duplication the rules doc explicitly warns against ("Reuse, don't duplicate").

**9. Finish SJRA-1576 (consumer-side interfaces).** ~15 producer-side `*DAO` interfaces remain
(`CasesDAO` is still passed into handlers); the new narrow consumer-side pattern (`membershipReader`,
`tenantAccessChecker`) is the documented target. Already in progress — just keep going.
*Aligns with current work; no redirection.*

### P4 — Minor / consistency

- **Standardize nil-db handling in repo constructors** — some `log.Print`+return nil, some
  `log.Fatal`. Pick one (recommend returning an error, or panicking consistently at wiring time).
- **Consider declarative request validation** (`go-playground/validator` struct tags) to thin out
  imperative `ShouldBind` + manual checks — *optional*, weigh against the team's preference for
  explicit code.
- **Retire legacy test shims** (`ParallelTestWithStarrocks`, etc.) once call sites migrate to
  `RunTest` — already the stated direction in CLAUDE.md.

---

## Deep dive: package boundaries (`internal/types` & `internal/utils`)

The upstream Go guidance discourages catch-all package names (`util`, `common`, `types`). The repo's
`go-code-review.md` documents keeping these names as a deliberate exception — and **renaming them is
not worth it**. But the *cohesion* problem the rule warns about has partially materialized, and that
part is worth addressing. The name is a symptom; cohesion is the issue.

**Evidence — `internal/utils` (14 files) is a genuine grab-bag**, ≥5 unrelated concerns together:

| File(s) | What it really is | Natural home |
|---|---|---|
| `auth.go` | Keycloak JWT/token extraction (`Auth`, `KeycloakAuth`) | auth, not "util" |
| `s3.go` | S3 presigning + file metadata (`PreSigner`, `FileMetadataGetter`, `S3Store`) | object-storage infra |
| `repositories.go` | GORM query builders (`AddWhere`, `AddSort`, `JoinCaseWithProband`, `GetFilter`…) | query/repository infra |
| `mappers.go`, parts of `collections.go` | domain→domain conversions, `SortConsequences`, `SortIgvTracks…` | domain logic |
| `env.go`, `booleans.go`, `sql.go`, generic `collections.go` | `GetEnvOrDefault`, `BoolPointer`, `RemoveDuplicates`, `GroupByProperty` | the only genuinely generic bits |

**Evidence — `internal/types` (81 files) is secretly two packages.** ~70 files are passive domain
models (`case.go`, `patient.go`, `variant.go`: structs + JSON/swagger tags). ~10 are an *active query
DSL engine* with behavior: `filter.go` (`FilterNode`/`AndNode`/`ComparisonNode` + `ToSQL`), `query.go`
(`Query`/`ListQuery`/`QueryConfig`), `table_field.go` (`Field`/`Table`), `search_request.go` (`Sqon`),
`facet.go`/`aggregation.go`/`count.go`/`statistics.go`.

### Recommended alternative (priority order)

1. **Split `utils` — the real win, low cycle risk.** `utils` already depends on `types`
   one-directionally, so this is mostly mechanical:
   ```
   internal/auth/        ← utils/auth.go   (or fold into existing internal/authorization)
   internal/objectstore/ ← utils/s3.go
   internal/query/       ← utils/repositories.go + utils/sql.go   (GORM/SQL builders)
   internal/mapper/      ← utils/mappers.go + domain-specific sorts from collections.go
   internal/env/         ← utils/env.go
   ```
   Truly-generic leftovers (`BoolPointer`, `RemoveDuplicates`, `GroupByProperty`) — prefer **deleting**
   in favor of stdlib `slices`/`maps` (Go 1.21+) over rehoming.

2. **Extract the query DSL out of `types` into that same `internal/query`.** Move
   `FilterNode`/`Query`/`Sqon`/`Field`/`Table` + `ToSQL` behavior, leaving `types` as pure domain
   models. Combined with #1 you get one package owning *"how a search request becomes SQL"* — a named
   extension point instead of behavior hidden in a "types" bag. Biggest mental-model improvement.

3. **Do NOT rename `types` itself** (→ `model`/`domain`). Cosmetic rename of 70+ files + every import
   for near-zero benefit; team has decided against it. A shared domain-vocabulary package every layer
   imports is legitimate. The value is the DSL extraction (#2), not the name.

### Honest caveat (why this is work, not `git mv`)

`Field`/`Table` (`table_field.go`) is referenced by **both** the domain config and the query engine —
it's the shared core, which is *why* it all landed in one package. Split naively → import cycle
(engine → domain, domain → engine). Correct decomposition is layered: `query` depends on a small
`Field`/`Table` core; domain structs depend on nothing; nothing depends back on `query`. That's why
#1 (utils) is the high-value/low-risk starting point and #3 (renaming types) isn't worth doing.

---

## Quick wins (what I'd do first)

Highest value-to-effort, each independently shippable:
1. **#1** redact `HandleError` detail (single function, ~1 hr).
2. **#3 + #4** add golangci-lint job + fix Go-version drift in `backend.yml` (CI-only, no app risk).
3. **#5 (phase 1)** request-id middleware + slog JSON logger.

## Verification

- After each change: `cd backend && go build ./... && make test` (per `universal.md` — green build is the bar).
- **#1**: add a handler test that forces a repo error and asserts the 500 body's `Detail` is generic
  (`assert.JSONEq`, matching the project's response-comparison convention).
- **#3/#4**: confirm the new CI job runs on a PR and `golangci-lint run` is clean locally.
- **#5/#6**: run `make run` / `make run-worker`, hit `/status`, confirm JSON logs carry a request id;
  send SIGTERM and confirm clean exit with no abandoned batch.
- **#7**: package-level `go test ./internal/repository/...` after the ctx threading slice.

## Out of scope / respected as intentional

- `[]string{}` vs nil slices in auth responses (documented JSON-shape exception).
- `internal/types` / `internal/utils` package names (documented deviation from upstream naming) — see
  the package-boundaries deep dive for the cohesion nuance.
- Dual-DB split and manual DI — sound as-is, no change recommended.
