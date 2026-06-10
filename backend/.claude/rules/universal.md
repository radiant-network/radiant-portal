# Backend engineering rules

Apply these to every coding task in the Go backend (`backend/`). They are intentionally short — extend by editing this file, not by adding caveats to individual skills.

Go style conventions (naming, error handling, interface placement, etc.) live in a curated, project-annotated copy of the Go Code Review Comments: [go-code-review.md](go-code-review.md). The headline rule from there, since it comes up most:

> **Declare an interface in the package that *uses* it, not the one that implements it; constructors return concrete structs.** Place it by what keeps the import graph clean — consumer-side when the consumer wouldn't otherwise import the implementer (e.g. `service`'s provisioner interfaces). Even when the consumer already imports the implementer (coupling-neutral), prefer a narrow interface scoped to that consumer over one shared `*DAO` contract — e.g. `internal/server`'s `membershipReader` / `tenantAccessChecker` over the old `repository.AuthRepositoryDAO`. Don't write `Interface`+`Impl` pairs "for mocking." See [go-code-review.md](go-code-review.md#interface-placement-the-rule-we-care-about-most) for the full heuristic.

## Test as you go

Every function, method, or branch you add must have a passing test in the same step it was introduced. Do **not** move on to the next workflow step until the code you just wrote has been exercised by a passing test.

This rule applies even to small helpers that look "too trivial to test" — enum mappers, validators, conversion methods, parameter parsers. Those are exactly where silent regressions hide.

## One concept per test, named for intent

Prefer explicit `Test_Subject_SpecificCase` over table-driven tests with sub-tests. A reader should be able to understand what is being verified from the function name alone.

Use table-driven tests only when the cases share genuinely identical structure (same setup, same shape of assertion) **and** there are many of them. For 3–5 cases with subtle differences, write them out.

## Errors are values, not sentinels

When an enum mapper, parser, or validator receives an unrecognized input, return `(nil, error)` (or a zero value + error). Never silently return an empty string, zero, or default.

Tests must cover both the happy path and the unknown-input branch — including the empty-input edge case, which is often a distinct branch from "unrecognized non-empty input."

## Reuse, don't duplicate

If a constant, helper, or type already exists in another package, move it to a shared location (typically `internal/types/` or `internal/utils/`) and update both callers. Don't redefine it.

`cmd/api` and `cmd/worker` cannot import each other; shared values **must** live under `internal/`. This is a Go module structure constraint, not a style preference.

## Run the build (or relevant tests) before marking work done

A green build is the bar for advancing. For each workflow step:

- Run `go build ./...` and confirm it's clean.
- Run the tests for the package you just touched.
- If you added a new test, run it explicitly so the framework can't silently skip it.

Skipping this and reporting "done" produces work that compiles in your head but not in the repo.

## Use the modern test framework, not legacy shims

New tests use `testutils.RunTest(t, testutils.Need{...}, ...)` directly. Declare what the test needs via `Need` (e.g. `Need{Starrocks: "simple", Postgres: testutils.ReadPostgres}`) and read DBs from `env` (`env.Starrocks`, `env.Postgres`). Do **not** call the legacy shims — `ParallelTestWithPostgres`, `SequentialTestWithPostgres`, `ParallelTestWithStarrocks`, `ParallelTestWithReadOnlyPostgresAndStarrocks`, and friends. They still exist for back-compat and route through `RunTest`, but they are never the target for new code; if you touch a test that uses one, migrate it to `RunTest`.

This rule mirrors the guidance in [backend/CLAUDE.md](../../CLAUDE.md) under "Testing".

## Make test helpers reusable across happy and error paths

Test helpers that issue HTTP requests should take path/query params as **strings**, not parsed types like `int`. That way the same helper can drive both happy-path tests (`"1"`, `"germline_snv"`) and parse-error tests (`"not-a-number"`, `""`). Don't fork into two helpers when one would do.

## Compare JSON output to expected JSON strings

Handler tests assert on the response body via `assert.JSONEq(t, expected, w.Body.String())` against a hand-written expected JSON string. Don't `json.Unmarshal` the response and assert field-by-field — that hides shape/field-name regressions and makes the test diverge from what the API actually returns.
