---
name: add-endpoint
description: Add a new REST endpoint to the radiant-portal backend. Walks through DB schema, types, repository, handler, routing, integration test, swagger regeneration, TS/Python client generation, and Postman collection update. Use whenever the task is "add an endpoint" or "expose X via the API" on this repo.
---

# Add a new backend endpoint

Use this workflow when adding a REST endpoint to the Go backend at `backend/`. The workflow is deliberately ordered — each step builds on the previous and ends in a state that compiles and tests cleanly.

Before starting, confirm with the user:
- HTTP method + final route path
- Auth requirements (public, JWT, `data_manager` role)
- Inputs (path / query / body) and exact response shape
- Which database the data lives in (StarRocks for analytical/genomic, PostgreSQL for operational/clinical — see `backend/CLAUDE.md`)

Track progress with TodoWrite, one item per workflow step.

## Universal rules

Before starting, read and apply the rules in [../../rules/universal.md](../../rules/universal.md). They apply to every step below.

---

## Step 1 — DB schema and types

Goal: the data model the endpoint will return is defined, and the DB supports it.

1. **Migration (only if schema must change):**
   - `cd backend && make migrate` — creates a new timestamped file in `backend/scripts/init-sql/migrations/`.
   - Write the SQL. Migrations run automatically on startup (see `backend/internal/database/postgres.go`).
   - StarRocks schema is **not** managed by golang-migrate; flag any StarRocks schema change to the user — it's usually out of scope for an API task.
2. **Types** in `backend/internal/types/`:
   - Request DTO (if body or non-trivial query) — add `binding:"required"` / `validate:"required"` tags as the existing types do.
   - Response DTO. Use swaggo annotations on the struct doc comment (`@Description`, `@Name`).
   - Enums: define as a typed string with constants, plus a validation method (e.g. `func (x Foo) IsValid() bool`).
   - Reuse `time.Time`, `types.JsonArray`, etc. already used elsewhere.
3. Confirm: `cd backend && go build ./...` is green.

## Step 2 — Repository layer + tests

Goal: a tested DAO method that returns the data the handler will serve.

1. **Pick the right file** in `backend/internal/repository/`:
   - StarRocks-backed repos for cases/variants/genes/etc.
   - PostgreSQL-backed repos for tasks/patients/sequencing/notes/preferences/etc.
2. **Interface + impl**:
   - Add the method signature to the existing `XxxDAO` interface in the file.
   - Implement it on the repository struct. Use GORM (`r.db.Table(...).Where(...).Find(...)`) — match the style of nearby methods.
   - Wrap returned errors with `fmt.Errorf("... %w", err)` (project convention).
   - Filter explicitly — never trust caller-side checks. For occurrence-style queries, **always include the partition filter** (`part = ?`) when one applies.
3. **Tests** in the sibling `*_test.go`:
   - Prefer `testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, ...)` or `Need{Starrocks: "<folder>"}` (see `backend/CLAUDE.md` for mode trade-offs).
   - For Postgres writes, use ids ≥ 1000 so `cleanUp` preserves the seed range (`test/testutils/setup_postgres.go`).
   - StarRocks fixtures live in `backend/test/data/<folder>/*.tsv` and are read-only at runtime (enforced by GORM guard).
   - Cover: happy path, empty result, sort order, exclusion (rows that *almost* match but shouldn't be returned), error propagation.
4. Run: `cd backend && make itest` (or target the single package with `go test ./internal/repository/...`).

## Step 3 — Handler + tests

Goal: an HTTP handler that parses inputs, calls the DAO, and returns the response.

1. **Handler file** in `backend/internal/server/`:
   - Group by resource — extend an existing `handlers_<resource>.go` if one exists, otherwise create one (lowercase, snake_case).
   - Signature: `func HandlerName(repo repository.XxxDAO) gin.HandlerFunc { return func(c *gin.Context) { ... } }`.
   - Parse path params with `strconv.Atoi(c.Param("..."))`; query with `c.Query("...")`; body with `c.ShouldBindJSON(&dto)`.
   - Use the project's error helpers: `HandleNotFoundError`, `HandleValidationError`, `HandleError` (in `internal/server/errors.go`).
   - Coerce nil slices to `[]T{}` before returning so JSON shows `[]` not `null`.
2. **Swagger annotations** above the handler — required. Pattern:
   ```
   // @Summary ...
   // @Id camelCaseRouteId
   // @Description ...
   // @Tags <group>
   // @Security bearerauth
   // @Param ... path/query/body <type> required "Description"
   // @Produce json
   // @Success 200 {object|array} types.Foo
   // @Failure 400 {object} types.ApiError
   // @Failure 404 {object} types.ApiError
   // @Failure 500 {object} types.ApiError
   // @Router /path/{param} [get]
   ```
3. **Handler unit tests** in `handlers_<resource>_test.go`:
   - Build a small mock that implements the DAO interface (return zero values for methods you don't exercise).
   - Cases: happy path, empty result, repo error → 500, each missing/invalid input → 400 or 404, sort/shape assertions on the JSON.
   - Use `httptest.NewRecorder` + `gin.CreateTestContext` per existing handler tests.

## Step 4 — Route + integration test

Goal: the route is reachable end-to-end against a real DB.

1. **Register the route** in `backend/cmd/api/main.go`:
   - Find the existing route group that matches the resource (e.g. `sequencingGroup`, `casesGroup`, `occurrencesGroup`).
   - Construct the repository near the other repo constructors (~line 60-80) if not already wired.
   - Register: `<group>.<METHOD>("/path", server.HandlerName(repo))`.
   - Confirm the group is on the right middleware (private routes require JWT; `data_manager` group requires the role).
2. **Integration test** in `backend/cmd/api/`:
   - Add to the resource's `*_integration_test.go`. If none exists for the resource, create one mirroring `cases_integration_test.go` or `germline_occurrences_integration_test.go`.
   - Boot the real router via `testutils.RunTest` with a JWT helper and assert against a seeded DB state.
   - Cover the cross-cutting concerns that handler unit tests can't: routing wiring, middleware (auth), real query against the test DB.
3. **Security tests** in [backend/cmd/api/integration_test.go](../../../cmd/api/integration_test.go) — these enumerate every route and assert auth behavior. They will silently pass for missing routes, so adding here is easy to forget:
   - `Test_SecureRoutes`: add the route to the matching `[]string` slice (GET or POST). Asserts a 401 without a token.
   - `Test_OpenFGA_Authorization`: add an entry to `getTests` or `postTests` with the expected status code when called with a valid `data_manager` JWT against seeded data.
4. Run: `cd backend && make test` — full suite must be green.

## Step 5 — Swagger + clients

Goal: the OpenAPI spec and generated clients reflect the new endpoint.

```bash
cd backend
make doc                          # regenerates backend/docs/swagger.{json,yaml}
cd ..
make generate-client-typescript   # regenerates frontend/api/
make generate-client-python       # regenerates cli/python/
```

Requires `openapi-generator-cli` installed globally (see root `Makefile`).

Verify the diff in `frontend/api/api.ts` includes the new method and response type. Do not edit these files by hand.

## Step 6 — Postman collection

Goal: the API team has the new endpoint in `postman/RADIANT-API.postman_collection.json`.

1. The collection is a single file, organized as one top-level folder per resource (e.g. `Germline SNV Occurrences`, `Cases`, `Sequencing`).
2. Add a new request item under the appropriate folder. Match the style of an adjacent item:
   - `auth.bearer.token = {{token}}` (existing pattern).
   - `url.raw` uses `{{radiant-api-url}}` and the `host`/`path` arrays must be kept consistent.
   - Use example path/query values that resolve against the seeded test DB so the request returns data without manual edits.
3. If the resource folder doesn't exist yet, create it as a top-level item with the same shape as a neighboring folder.
4. Save the file — do **not** reformat surrounding entries. Keep the diff minimal.

## Step 7 — Update CLAUDE.md if the change is non-trivial

Goal: `backend/CLAUDE.md` reflects any new pattern, convention, or load-bearing file the endpoint introduces.

Update [backend/CLAUDE.md](../../../CLAUDE.md) when this change introduces any of:

- A new package or directory under `internal/` or `cmd/`.
- A new cross-cutting pattern other endpoints will adopt (e.g. a new way of mapping enums to DB filters, a shared helper that should be reused).
- A new task type, route group, or background job category.
- A change to test infrastructure or shared mock conventions.

Do **not** update `CLAUDE.md` for routine additions: a single new endpoint inside an existing route group with no new patterns is not a `CLAUDE.md` change.

Similarly update [backend/.claude/rules/universal.md](../../rules/universal.md) if you discovered a backend coding/testing rule worth applying to future work — but only if it's a rule, not a one-off preference.

## Step 8 — Run the full test suite

Goal: confirm the change compiles and passes against the **whole** backend, not just the packages you touched.

```bash
cd backend && make test
```

Package-scoped tests can miss cross-package breakage. The most common case: adding a method to a DAO interface satisfied by mocks in other packages (e.g. `cmd/worker`'s test mocks also implement `TaskDAO`). The package you edited compiles, but the consumer package breaks. `make test` is the only thing that catches this consistently.

If a test fails:
- **Reproducible failure** in the package you touched → fix the code or test.
- **Reproducible failure in an unrelated package** → almost always a missing interface method on a shared mock, or a fixture that drifted because of a seed change. Search for the failing type/method in other test files.
- **Failure that disappears on rerun in isolation** → likely a parallel-test flake unrelated to your change. Note it and proceed.

Do not mark the task complete until `make test` passes end-to-end.

---

## End-of-task checklist

Before reporting done:

- [ ] `cd backend && make test` green (full suite, per Step 8 — not just the packages you touched)
- [ ] `backend/docs/swagger.yaml` regenerated and committed
- [ ] `frontend/api/` regenerated and committed
- [ ] `cli/python/` regenerated and committed
- [ ] Postman collection updated
- [ ] `backend/CLAUDE.md` and/or `backend/.claude/rules/universal.md` updated if a new pattern/convention was introduced (per Step 7)
- [ ] Swagger annotations include `@Tags`, `@Security`, all params, success + failure responses
- [ ] Repository, handler, and integration tests all present
- [ ] Route added to both `Test_SecureRoutes` and `Test_OpenFGA_Authorization` in `cmd/api/integration_test.go`
- [ ] No new comments explaining the *what* — only non-obvious *why*
- [ ] No unused fields, imports, or backwards-compat shims

If the user asked for a draft PR / commit at the end, follow the project's commit convention: `type(scope): SJRA-### message` (CommitLint + Husky enforced).
