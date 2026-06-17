# Go style rules (from Go Code Review Comments)

Apply these to every Go change in `backend/`. They are a curated, project-annotated
copy of the upstream [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments)
plus this repo's interface-placement guidance. Where this codebase intentionally
deviates, it is called out as **Project note**. When in doubt, the upstream doc wins.

`gofmt`/`goimports` already enforce the mechanical items — run them and most of this is free.

---

## Interface placement (the rule we care about most)

**Define an interface in the package that *uses* it, not the package that *implements*
it. Constructors return concrete structs; consumers declare the narrow interface they
need.** "Accept interfaces, return structs."

This works because Go interface satisfaction is *structural* (implicit): a type satisfies
an interface just by having the methods — it never names the interface, so the consumer
can declare the contract after the fact and existing concrete types satisfy it for free.

The real goal is **controlling the import graph**, not the rule itself. Decide placement by
asking: *does putting the interface here force a package to import another it otherwise
wouldn't (or risk a cycle)?*

| Situation | Put the interface… | Why |
|---|---|---|
| Consumer would otherwise **not** import the implementer's package (or it'd risk a cycle) | **Consumer side** | Keeps the consumer decoupled — the load-bearing case |
| Consumer **already** imports the implementer's package | Either is allowed; still prefer a narrow interface next to the consumer | Coupling-neutral, so placement won't break the graph — but a per-consumer slice beats one shared fat contract |
| Broad, reused extension point | Producer or a neutral package | Like `io.Reader` living in `io` |
| Single impl, no consumer needs the abstraction yet | **Don't write one** | Return the struct; add the interface when a consumer needs it |

Worked examples in this repo:
- **Load-bearing (consumer side):** `internal/service/admin.go` declares `KeycloakProvisioner`,
  `RangerProvisioner`, `StarrocksProvisioner`, `AuthStore`. `service` imports only
  `internal/types`; `client`/`repository` return concrete structs and never import `service`.
  Putting these interfaces in `client`/`repository` would force `service` to import both —
  avoid that.
- **Narrow consumer-side interfaces beat one shared producer-side `*DAO`:** the auth repository
  was once exposed as a single `repository.AuthRepositoryDAO` interface next to its
  implementation. It was coupling-neutral (`internal/server` already imports `repository`), so
  it didn't *break* the import-graph rule — but it was the weaker shape: one fat contract that
  also carried a `HasAction` method no handler called ("for mocking" / preemptive). It now lives
  as two narrow, unexported interfaces in `internal/server`, each scoped to one consumer:
  `membershipReader` (just `GetMemberships`, in `handlers_auth.go`) and `tenantAccessChecker`
  (just `HasTenantAccess`, in `middlewares.go`). `NewAuthRepository` returns the concrete
  `*AuthRepository`, which satisfies both for free. **Lesson:** coupling-neutral means "either
  placement is *allowed*," not "producer side is *preferred*" — when a consumer needs only a
  slice, declare that slice next to the consumer, and don't keep contract methods nobody calls.

Don't write `Interface`+`Impl` pairs "for mocking" when there's one implementation and no
consumer that needs the abstraction yet — that's the preemptive-interface anti-pattern.
Conformance is checked wherever a concrete is assigned to the interface (e.g. the wiring in
`buildDeps`), so a method rename surfaces as a build error there; you don't need a
`var _ Iface = (*T)(nil)` assertion unless you want the error localized to the impl (and that
assertion makes the impl import the interface's package — only do it when that edge is free).

References: [Code Review Comments §Interfaces](https://go.dev/wiki/CodeReviewComments#interfaces),
[Effective Go §Interfaces](https://go.dev/doc/effective_go#interfaces),
[Dave Cheney, "SOLID Go Design"](https://dave.cheney.net/2016/08/20/solid-go-design),
[Go Proverbs](https://go-proverbs.github.io/) ("The bigger the interface, the weaker the abstraction").

---

## Naming

- **Mixed caps:** camelCase, no underscores. Unexported start lowercase (`maxLength`); exported
  start uppercase (`MaxLength`).
- **Initialisms:** keep acronyms uniform case — `ServeHTTP`, `userID`, `xmlAPI`; never `Url`,
  `appId`, `ParseUrl`.
- **Variable names:** short, scaled to scope. Near their declaration, `c`/`i` beat `lineCount`/
  `sliceIndex`; the further a name travels, the more descriptive it must be. Globals need real names.
- **Receiver names:** one or two letters abbreviating the type (`c` for `Client`), consistent across
  all methods. Never `me`, `this`, or `self`.
- **Package names:** lowercase, single word; omit it from member names (in package `chubby`, name the
  type `File`, not `ChubbyFile`, so callers write `chubby.File`). Upstream discourages generic names
  like `util`, `common`, `api`, `types`, `interfaces`.
  - **Project note:** this repo already standardizes on `internal/types` and `internal/utils`. Keep
    using them; don't rename existing packages to satisfy this guideline.

## Comments & docs

- **Doc comments:** when you do comment, write full sentences.
  - **Project note:** this repo overrides upstream's "every exported name gets a doc comment." Keep
    comments minimal and reserve them for genuinely tricky/non-obvious points — see
    [universal.md](universal.md#comments-minimal-self-documenting-code). Don't add a doc comment just
    because a name is exported.
- **Comment sentences:** start with the name of the thing and end with a period
  (`// AuthRepository provides ...`).
- **Package comments:** sit directly above the `package` clause, no blank line. For `package main`,
  forms like `// Command createuser ...` are the convention (see `cmd/createuser/main.go`).

## Errors

- **Handle errors:** never discard with `_`. Check, handle, return, or (rarely) panic.
- **Error strings:** lowercase, no trailing punctuation (they get wrapped) — `fmt.Errorf("upsert user %q: %w", ...)`,
  not `"Upsert failed."`. Exception: leading proper nouns/acronyms.
- **Don't panic:** use error returns for normal flow; `panic` only for truly exceptional/unrecoverable cases.
- **In-band errors:** return an extra `error`/`ok` rather than sentinel values like `-1` or `""`
  (`func Lookup(key string) (value string, ok bool)`).
- **Indent error flow:** handle the error and return early; keep the happy path at the left margin.
  No `else` after an error check.

## Functions & methods

- **Contexts:** `context.Context` is the first parameter, named `ctx`; never store it in a struct.
  `context.Background()` only at the top of a non-request call tree.
- **Pass values:** don't take a pointer just to save bytes. If the body only ever dereferences `*x`,
  pass the value. (Large structs that may grow are the exception.)
- **Receiver type:** use a pointer receiver if the method mutates, the type holds a `sync.Mutex`/etc.,
  or the struct is large; otherwise a value receiver is fine. Don't mix the two on one type. When unsure, pointer.
- **Named result parameters:** only when they improve godoc or are needed inside a deferred closure —
  not merely to enable naked returns.
- **Naked returns:** acceptable only in very short functions; otherwise return values explicitly.
- **Synchronous functions:** prefer returning results directly over spawning goroutines/callbacks.
  Let the caller add concurrency if it wants it — easier to test, no leaks/races.
- **Goroutine lifetimes:** make it obvious when (or whether) each goroutine exits; document non-obvious
  exits. A goroutine blocked forever on a channel is a leak.

## Slices, copying, randomness

- **Empty slices:** prefer `var t []string` (nil) over `t := []string{}`.
  - **Project note:** the auth repository returns `[]string{}` / `[]types.TenantMembership{}` on purpose
    so JSON serializes `[]` not `null`. That's the documented exception — keep it for API response shapes.
- **Copying:** don't copy a struct from another package without care (it may alias internal slices);
  don't copy a value whose methods are on `*T`.
- **Crypto rand:** keys/secrets come from `crypto/rand`, never `math/rand`. For random text use
  `crypto/rand.Text()` or hex/base64-encoded random bytes.

## Imports

- **Imports:** don't rename except to break a collision (rename the most local/project-specific one).
  Group as stdlib, then third-party (blank line between); `goimports` does this.
- **Blank import** (`import _ "pkg"`): only in `package main` or tests, for side effects
  (e.g. the `godotenv/autoload` import in `cmd/createuser`).
- **Dot import** (`import . "pkg"`): avoid; only in a test file that can't live in the tested package
  due to a cycle.

## Testing

- **Useful test failures:** report `input → got → want`, in that order:
  `t.Errorf("Foo(%q) = %d; want %d", in, got, want)`. Name/disambiguate cases so a failure points
  at exactly which one broke. (See also `universal.md`: prefer `Test_Subject_SpecificCase` names.)
- **Examples:** new packages should ship runnable `Example` functions or a simple test showing the
  full call sequence.

## Formatting

- **Gofmt/goimports:** always run them; they settle indentation, alignment, and import order.
  Run `make fmt` to apply gofmt and `make lint` to run golangci-lint before you finish. CI
  runs the same golangci-lint config (`backend/.golangci.yml`) and fails on unformatted code
  (the `gofmt` formatter) or any finding from `bodyclose`, `errcheck`, `gosec`, `govet`,
  `ineffassign`, `staticcheck`, or `unused`. `make lint` runs `go vet` (via the `govet`
  linter), so there's no need to run `go vet ./...` separately. A pre-commit hook also runs
  gofmt on staged Go files.
- **Line length:** no hard limit — break for readability/semantics, not to hit a column count.
