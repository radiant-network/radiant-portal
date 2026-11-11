# Chapter 1: moon on the portal

Branch: `poc/monorepo-01-moon-portal`. Local only: no remote, no GitHub Actions run, ever.

## Why we are doing this

Today the portal backend, the frontend, the ETL and the MCP live in **separate repos**. Each repo has its own CI, and
each CI only knows its own code. Yet the modules depend on each other: the frontend calls the backend's API, the
backend and the MCP read the tables the ETL writes, the MCP calls the API. When a change in one repo breaks another,
no CI sees it: it shows up later, in another repo's PR, or in production.

The plan is **one monorepo**: one commit holds every module, so a PR can change a module and its readers together,
and CI can check every boundary in that PR. The catch: a monorepo that runs every test of every module on every PR is
slow (the ETL tests alone take ~30 s, the backend's minutes, the frontend build too). We need a tool that knows, for
a given change, **what it can break**, and runs only that.

This chapter introduces that tool, moon, on the portal alone (Go backend + React frontend). Chapter 2 adds the ETL and
the MCP.

## What moon is

[moon](https://moonrepo.dev) is a **task runner and build system for monorepos**, language-agnostic: it runs the
commands each module already has (`go build`, `npx vitest`, `pytest`), but it knows:

- **what each command reads** (its inputs), so it can tell whether a change concerns it;
- **what each command needs first** (other commands), so it runs them in the right order, in parallel when it can;
- **what it already ran**, with which inputs, so it never runs the same thing twice.

Why moon and not another tool:

| Tool | Why not, for us |
|---|---|
| `make`, shell scripts | no notion of "what changed", no cache: every task runs every time |
| Nx, Turborepo | built around JavaScript/TypeScript; Go and Python are second-class |
| Bazel, Pants | very powerful, but they replace each language's build (BUILD files everywhere): a big migration and a steep learning curve |
| **moon** | runs our existing commands unchanged, any language, with inputs, cache and "affected"; one YAML file per module |

## How this chapter works

Each step introduces **one or two concepts and shows them right away** with a command: read the concept, run the
command, check that the output says what the concept says. The glossary at the end recaps every concept.

## Step 0: setup

```bash
cd ~/workspace/radiant-moon-tour          # or wherever this branch is checked out
export PATH=$PWD/.tools/node_modules/.bin:$PATH
moon --version                            # moon 2.6.2
git status --short                        # must print nothing: every demo starts from a clean tree
```

First time only: `npm ci --prefix .tools` (installs moon) and `npm ci --prefix frontend` (or let moon do it at step 4).

## Step 1: workspace, projects, tasks, targets

**Concept.** The workspace lists the projects; each project describes its tasks. moon reads only these YAML files:
the modules' own build files (`go.mod`, `package.json`) are untouched.

```bash
cat .moon/workspace.yml                   # the workspace: 2 projects
cat backend/moon.yml                      # a project: its file groups and tasks
cat frontend/moon.yml
moon projects                             # table of the projects
moon tasks                                # table of every task, by target
```

Expected: `moon projects` lists `backend` and `frontend` (with their folder); `moon tasks` lists 8 targets:
`backend:build`, `backend:test`, `frontend:api-client-check`, `frontend:api-client-generate`, `frontend:build`,
`frontend:install`, `frontend:lint`, `frontend:test`, with their command (`go`, `npm`, `npx`, or `(script)` for a
shell script). The `Toolchains` column says `system`: moon runs the Go, Node and Python already installed, it does
not manage their versions here.

Read `backend/moon.yml` with the concepts table in mind:

- `fileGroups.sources` = every `.go` file plus `go.mod` / `go.sum`; `build` and `test` take `@group(sources)` as
  inputs. `fileGroups.openapi` names what the backend **publishes** to the frontend: `docs/swagger.yaml`.
- `test` has `deps: ['build']`: moon builds before testing.

And in `frontend/moon.yml`:

- `dependsOn: ['backend']`: the frontend uses the backend (through its API).
- `api-client-check` has the input `/backend/docs/swagger.yaml`: a file **of another project** (leading `/`).
- `lint` and `api-client-generate` have `runInCI: false`; tasks with side effects have `cache: false` (step 7).

## Step 2: hash and cache

**Concept.** Before running a task, moon computes its hash. If a result with that hash exists in the cache, it
replays it: same output, same logs, and the `outputs` files restored, without running the command.

```bash
moon run backend:build
moon run backend:build
```

Expected: the first run builds (`backend:build (4s ...)`; or `cached` if it already ran on this machine), the second
prints `backend:build (cached, <hash>)` and `Tasks: 1 completed (1 cached)`.

The hash in parentheses is the task's fingerprint. See what went into it:

```bash
H() { jq -r .hash .moon/cache/states/backend/build/lastRun.json; }   # hash of the last run of backend:build
moon hash $(H) | head -20
moon hash $(H) | grep -c '"backend/'                               # how many files are hashed
```

Expected: the task's `command` (`go`) and `args` (`build ./...`), its `env` and `deps` (empty), then `inputs`: every
input file with the hash of **its content** (~500 `.go` files, `go.mod`, `go.sum`). Change any of them and the task
hash changes; change nothing and it stays the same.

Locally the cache saves time; shared between machines (remote cache), a task already run on `main` would never run
again in a PR that does not touch its inputs.

## Step 3: inputs decide what "changed" means

**Concept.** Only inputs enter the hash. A file that is not an input of a task cannot make it run again; a file that
is one always does. Inputs are the task's contract: too few and a real change is missed (a stale cache hides a bug),
too many and everything always runs.

```bash
moon hash $(H) | grep README                  # nothing: backend/README.md is not an input
echo "x" >> backend/README.md
moon run backend:build                        # still cached: the hash did not change
git checkout -- backend/README.md

before=$(H)
echo "// tour $(date +%s)" >> backend/internal/types/case.go   # a .go file: in @group(sources)
moon run backend:build                        # runs again
moon hash $before $(H) | grep -E '^[-+]'      # the only difference between the two hashes
git checkout -- backend/internal/types/case.go
moon run backend:build                        # cached again: the file is back to a content moon already built
```

Expected: no README line in the hash, `Tasks: 1 completed (1 cached)` after editing it; `Tasks: 1 completed` (no
cache) for the Go file, and the diff of the two hashes is exactly one input:

```
+      "backend/internal/types/case.go": "<hash of the new content>",
-      "backend/internal/types/case.go": "<hash of the old content>",
```

then cached again after the revert.

Why `$(date +%s)`: the cache is keyed by **content, not time**. Append the same `// tour` twice (in two tries) and the
second time moon finds the hash of the first one and replays it, as if nothing had changed. Same with the revert:
the original content was already built, so its result is in the cache.

## Step 4: task dependencies

**Concept.** `deps` order tasks: moon builds a graph of the tasks to run and runs each after its deps, in parallel
when they are independent. Each dep goes through the cache too.

```bash
moon task frontend:build
```

Expected: `Depends on: frontend:install, frontend:api-client-check`, and further down its inputs and outputs.
`moon run frontend:build` would run `install` and `api-client-check` first (each from cache when it can).
`frontend:install` runs `npm ci` only when the lockfile is newer than `node_modules`.

## Step 5: affected, or what a change can break

**Concept.** moon takes the changed files (here: the working tree against `HEAD`; in CI: the PR's base against its
head) and lists the tasks whose inputs match them. That list is the answer to "what can this change break?".

Try three changes, one at a time:

```bash
echo "// tour" >> backend/internal/types/case.go
moon query affected | jq -c '.tasks | keys'
git checkout -- backend/internal/types/case.go

echo "# tour" >> backend/docs/swagger.yaml
moon query affected | jq -c '.tasks | keys'
git checkout -- backend/docs/swagger.yaml

echo "// tour" >> frontend/utils/helper.ts
moon query affected | jq -c '.tasks | keys'
git checkout -- frontend/utils/helper.ts
```

Expected:

| Change | Affected tasks |
|---|---|
| a backend `.go` file | `backend:build`, `backend:test` (no frontend task) |
| `backend/docs/swagger.yaml` | `frontend:api-client-check`, `frontend:api-client-generate` (a backend file, yet frontend tasks) |
| a frontend file | `frontend:build`, `frontend:lint`, `frontend:test` (no backend task) |

This is the distinction from the concepts: the frontend `dependsOn` the backend, yet a change to the backend's Go
code runs no frontend task. **The boundary is declared as an input**: the frontend reads the backend only through
`swagger.yaml`, so only a change to the spec reaches it. That is how the whole monorepo stays fast: modules are
connected by precise files, not by "A depends on B, so rerun everything of A".

## Step 6: generated code, checked

**Concept.** When a module generates code from another module's file (here a TypeScript client from the API spec),
the generated code can go stale. The pattern used throughout the tour: a `*-check` task regenerates into a temporary
folder and diffs with what is committed; it fails when they differ. Its inputs are the source (`swagger.yaml`) and
the generated code, so it runs whenever either changes.

The frontend calls the API through `frontend/api/`, generated from `swagger.yaml`:

```bash
sed -i '' '21s/Count in the bucket/Number of items in the bucket/' backend/docs/swagger.yaml
moon run frontend:api-client-check            # fails
```

Expected:

```
diff ... .gen/api.ts api/api.ts
<      * Number of items in the bucket
>      * Count in the bucket
× Task frontend:api-client-check failed to run.
```

Fix it the way a developer would, then check again:

```bash
moon run frontend:api-client-generate         # regenerates frontend/api in place
git status --short                            # swagger.yaml and frontend/api/api.ts changed: one PR, both files
moon run frontend:api-client-check            # passes
```

Keep these two changes: step 7 commits them on a throwaway branch.

## Step 7: CI, `moon ci`

**Concept.** The whole CI is one command, `moon ci`. It computes the files changed between the PR's base and its
head, runs the affected tasks (plus the deps they need), and skips the tasks marked `runInCI: false` (`lint` here,
because the portal's code does not pass eslint today; `api-client-generate`, which writes files). The workflow splits
the work into 2 jobs (`--job` / `--job-total`): each job runs half of the affected tasks.

```bash
cat .github/workflows/ci.yml
```

We never run the workflow; we run what it runs:

```bash
git switch -c tour/demo-ci
git -c user.name=tour -c user.email=tour@localhost commit --no-verify -qam "docs(api): reword the aggregation count"
moon ci --base poc/monorepo-01-moon-portal --summary minimal
```

`--no-verify` skips the portal's git hooks (husky: lint-staged and commitlint, which wants a ticket number in the
message); they are the portal's own, not part of this tour.

Expected: only frontend tasks (`frontend:install`, `frontend:api-client-check`, `frontend:test`, `frontend:build`),
`Tasks: ... completed`. No backend task: the Go code did not change, and `swagger.yaml` is not an input of the
backend build or tests.

Clean up:

```bash
git switch poc/monorepo-01-moon-portal
git branch -D tour/demo-ci
git status --short                            # nothing
```

## What to remember

- moon runs each module's own commands, but knows their **inputs**, their **deps**, and what it already ran
  (**hash** → **cache**).
- A task runs again **only** when one of its inputs changes; otherwise it is replayed.
- **Affected** = the tasks whose inputs a change touches. Modules are connected by **precise inputs**
  (`/backend/docs/swagger.yaml`), not by `dependsOn`.
- Generated code is **checked**, not trusted: a `*-check` task regenerates and diffs.
- CI = `moon ci`: the affected tasks between base and head, nothing else.

## Glossary

Every concept of this chapter, and where it is in the repo.

| Concept | What it is | Where |
|---|---|---|
| **workspace** | The monorepo root, and the list of its projects. | `.moon/workspace.yml` |
| **project** | One module, one folder (`backend`, `frontend`). It may declare `dependsOn` other projects. | `<folder>/moon.yml` |
| **task** | A named command of a project: `build`, `test`, `lint`... | `tasks:` in `moon.yml` |
| **target** | How you name a task: `project:task` (`backend:build`). `:test` means "the `test` task of every project". | `moon run <target>` |
| **inputs** | The files (and env vars) whose content the task depends on. Paths are relative to the project; a leading `/` is relative to the workspace root, so a task can read another project's file. | `inputs:` |
| **file group** | A named list of file patterns, reused as inputs: `@group(sources)`. Lets a project name what it publishes (`openapi`). | `fileGroups:` |
| **outputs** | The files the task produces (a build folder). Cached and restored with the task. | `outputs:` |
| **deps** | Tasks to run before this one (`frontend:build` needs `frontend:install`). | `deps:` |
| **hash** | A fingerprint of everything that can change a task's result: its command, its inputs' content, its env, the hashes of its deps. | computed |
| **cache** | Results stored by hash. Same hash = same result: moon replays it (output, logs, outputs) instead of running. Local in `.moon/cache`; can be shared between machines (remote cache, not set up in this POC). | `.moon/cache` |
| **affected** | Given changed files, the tasks whose inputs match them. "What can this change break?" | `moon query affected`, `--affected` |
| **`moon ci`** | The CI entry point: runs the tasks affected between a base and a head commit (and the deps they need), with options for CI (`runInCI`, sharding across jobs). | `.github/workflows/ci.yml` |

One distinction matters for the rest of the tour: **`dependsOn` (between projects) is not what decides what runs.
Inputs are.** `dependsOn` documents the module graph (and orders work); the precise files a task reads decide
whether a change reaches it. Step 5 shows why that matters.

Next: `poc/monorepo-02-mcp-etl` adds the MCP and the ETL, and a boundary that crosses three modules
(`swagger.yaml` → Python client → MCP).
