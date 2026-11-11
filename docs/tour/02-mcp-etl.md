# Chapter 2: the MCP and the ETL

**Goal.** Add the two other modules, the ETL and the MCP, and see why the monorepo matters most for the MCP: it
depends on **both** other projects, and today nothing checks that dependency where it can break.

Branch: `poc/monorepo-02-mcp-etl` (chapter 1 + `etl/`, `mcp/`, `clients/python/`). What it adds:

```bash
git diff --stat poc/monorepo-01-moon-portal poc/monorepo-02-mcp-etl -- . ':!etl' ':!mcp' ':!clients'   # the wiring
git diff --shortstat poc/monorepo-01-moon-portal poc/monorepo-02-mcp-etl -- etl mcp clients           # the copied code
```

## Context: why the MCP depends on the two other projects

Read this before the steps: the rest of the tour builds on it.

**What the MCP is.** `radiant-mcp` is the server that gives AI assistants (the D.A.V.I.D agents in LibreChat, Claude)
access to Radiant data: curated tools ("find the P/LP variants of this case", "who carries this variant") and, as a
last resort, SQL. It holds **no credential**: every call runs as the user who made it, with their Keycloak JWT
forwarded to StarRocks and to the portal API, which apply that user's rights.

**What it reads, and who owns it.** The MCP owns almost none of the data it uses:

```
                 ETL (radiant-portal-pipeline)                 portal backend (radiant-portal)
                 writes the StarRocks tables                   creates the tenant views, serves the API
                 germline__snv__occurrence, snv__variant...    cases, patient, v_pcx_30_*, gene_panel_mv
                 DDL: etl/radiant/dags/sql/*/init/              migrations, view builders, swagger.yaml
                        │                                              │                 │
                        │ SQL (tables)              SQL (tenant views) │                 │ HTTP (radiant_python,
                        ▼                                              ▼                 ▼  generated from swagger)
                 ┌──────────────────────────────────────────────────────────────────────────┐
                 │ MCP: queries/*.py build SQL on those columns; schema_catalog.py describes │
                 │ them to the agent; tools call the portal API through radiant_python       │
                 └──────────────────────────────────────────────────────────────────────────┘
```

1. **The ETL's StarRocks tables.** The variant data (occurrences, variants, consequences, frequencies, CNVs) is
   written by the ETL. The MCP's tools generate SQL on their columns (`mcp/radiant_mcp/queries/*.py`) and its catalog
   tells the agent which columns exist and what their values mean (`mcp/radiant_mcp/schema_catalog.py`,
   `enums.py`). The schema is owned by the ETL: its DDL is in `etl/radiant/dags/sql/*/init/`.
2. **The portal's tenant views.** In each tenant database (`<tenant>_tenant`), the portal backend creates one view
   per PostgreSQL table (`cases`, `patient`, `sample`...), the clinical `v_pcx_30_*` views and `gene_panel_mv`.
   The MCP joins them for clinical context. They are owned by the backend: migrations, view builders in Go, SQL
   templates.
3. **The portal API.** Some tools call the API through `radiant_python`, a client **generated** from the backend's
   `swagger.yaml` (here `clients/python/`; in the real repos it is the portal's `cli/python`, pinned by commit in the
   MCP's `pyproject.toml`).

**What breaks.** If the ETL renames a column, or the backend changes a view or the API, the MCP's SQL or API call is
wrong. The failure shows up **at runtime, in production**, when an agent answers a clinician, not in any CI.

**How it is checked today (separate repos).** The MCP's own CI (`radiant-mcp/.github/workflows/test.yml`)
sparse-checks out `main` of the ETL and of the portal, and its tests read their DDL and Go/SQL to verify every column
the MCP uses. That catches drift, but too late and in the wrong place:

- the check runs in the **MCP's** CI, not in the PR that makes the change: the ETL PR that renames a column merges
  green, and the MCP turns red later, on its next PR;
- it checks against the other repos' `main`, which is not necessarily what is deployed;
- the API client is pinned to a portal commit: the MCP lags behind the API until someone bumps it.

**What the monorepo changes.** The same tests run, but `mcp:test` declares as **inputs** the exact files of the
other projects it depends on. A PR that changes one of them runs `mcp:test` in that PR, so it fails before merging.
This chapter shows it.

Keep one doubt for later: the MCP tests still **parse the other modules' internals** (regexes on the ETL's SQL and
the backend's Go). Chapter 4 replaces that with data contracts.

## Step 0: setup

```bash
git switch poc/monorepo-02-mcp-etl
export PATH=$PWD/.tools/node_modules/.bin:$PATH
git status --short                             # nothing
moon run etl:venv                              # the ETL's virtualenv (the MCP uses uv directly)
```

## Step 1: three new projects, and how they are wired

```bash
moon projects                                  # backend etl frontend mcp python-client
cat mcp/moon.yml
grep -A4 'schema:' etl/moon.yml
grep -A7 'views:' backend/moon.yml
```

What to see in `mcp/moon.yml`:

- `dependsOn: ['etl', 'backend', 'python-client']`: the three dependencies of the context section.
- `mcp:test` inputs: its own sources, plus **groups of files of other projects**:
  `project://etl?group=schema` (the DDL and the table mappings), `project://backend?group=views` (migrations,
  view templates, the tenant view builder), `project://python-client?group=sources` (the generated client).
- The `env` replaces the sibling checkouts of today's CI: `RADIANT_ETL_DIR=$workspaceRoot/etl` and
  `RADIANT_PORTAL_DIR=$workspaceRoot`. Same tests, but the "other repos" are now folders of the same commit.

Each owner names the files it publishes (`schema` in the ETL, `views` in the backend); the reader points at those
groups, not at the whole project.

## Step 2: run the new checks

```bash
moon run mcp:test etl:test-unit python-client:check
```

Expected: `mcp:test | 646 passed`, `etl:test-unit | 1782 passed`, `python-client:check` ok (`Tasks: 4 completed`).
`python-client:check` is the same idea as `frontend:api-client-check`: regenerate the Python client from
`swagger.yaml` and diff.

## Step 3: what each change runs

Try each change alone, look at the affected tasks, revert:

```bash
A() { moon query affected | jq -c '.tasks | keys'; }
ddl=etl/radiant/dags/sql/radiant/init/germline_snv_occurrence_create_table.sql

echo "# tour" >> etl/radiant/dags/__init__.py;  A; git checkout -- etl
echo "-- tour" >> $ddl;                          A; git checkout -- etl
echo "-- tour" >> backend/scripts/init-sql/migrations/000046_add_brain_spinal_cord_sample_types.up.sql; A; git checkout -- backend
echo "# tour" >> backend/docs/swagger.yaml;      A; git checkout -- backend
echo "# tour" >> clients/python/radiant_python/__init__.py; A; git checkout -- clients
echo "# tour" >> mcp/server.py;                  A; git checkout -- mcp
```

Expected:

| Change | Affected |
|---|---|
| ETL Python code (a DAG) | `etl:lint`, `etl:test-unit` |
| ETL DDL (StarRocks schema) | `etl:test-unit`, **`mcp:test`** |
| backend migration | **`mcp:test`** |
| `swagger.yaml` | `frontend:api-client-*`, `python-client:*` |
| Python client | `python-client:check`, **`mcp:test`** |
| MCP code | `mcp:lint`, `mcp:test` |

An ETL change that does not touch the schema never runs the MCP tests; one that does, always does.

## Step 4: the ETL renames a column

The ETL renames `gq` (genotype quality) in `germline__snv__occurrence`. Nothing in the ETL breaks:

```bash
sed -i '' 's/^    gq INT,/    genotype_quality INT,/' etl/radiant/dags/sql/radiant/init/germline_snv_occurrence_create_table.sql
moon run mcp:test
```

Expected: `25 failed, 621 passed`, among them:

```
<tenant>_tenant.germline__snv__occurrence: columns not in the ETL DDL: ['gq']     (the catalog shown to the agent)
Failed: hits.germline_plp: Unknown column: gq                                       (the SQL of a tool)
Failed: carriers.totals[germline_snv]: Unknown column: gq
```

The first one is the catalog: the MCP tells the agent about a column that no longer exists. The others are the
SQL the curated tools generate, parsed and resolved against the schema (sqlglot): each would fail in StarRocks.
Revert:

```bash
git checkout -- etl
```

## Step 5: the API changes, through the generated client

```bash
sed -i '' '21s/Count in the bucket/Number of items in the bucket/' backend/docs/swagger.yaml
moon run python-client:check                  # fails: the client is stale
moon run python-client:generate frontend:api-client-generate
git status --short                            # swagger.yaml + both clients regenerated
moon query affected | jq -c '.tasks | keys'   # now includes mcp:test and the frontend
```

One spec change, two generated clients, and the tests of both readers (frontend and MCP) in the same PR. Revert:

```bash
git checkout -- . && git clean -fdq clients frontend/api
```

## Step 6: the same in CI

The ETL PR from step 4, as CI sees it:

```bash
git switch -c tour/demo-ci
sed -i '' 's/^    gq INT,/    genotype_quality INT,/' etl/radiant/dags/sql/radiant/init/germline_snv_occurrence_create_table.sql
git -c user.name=tour -c user.email=tour@localhost commit --no-verify -qam "feat(etl): rename gq"
moon ci --base poc/monorepo-02-mcp-etl --summary minimal
```

Expected: `etl:test-unit` passes, `mcp:test` fails (`25 failed`), `Tasks: ... 1 failed`. **The ETL PR is red because
of the MCP**: the author sees it before merging, in their own PR. Today, it merges green.

Clean up:

```bash
git switch poc/monorepo-02-mcp-etl
git branch -D tour/demo-ci
git status --short                            # nothing
```

## What to remember

- The MCP reads three things it does not own: the ETL's tables, the portal's tenant views, the portal's API.
- In the monorepo, `mcp:test` takes the owners' published files as inputs: the PR that changes them runs the MCP
  tests and fails there, not later in the MCP's CI.
- Each owner names what it publishes (`etl` group `schema`, `backend` group `views`, `swagger.yaml`); readers point
  at those groups.
- Still to fix: the MCP tests parse the ETL's SQL and the backend's Go. Chapter 4 replaces that with contracts.

## Glossary

The concepts this chapter adds (chapter 1's still hold: task, inputs, cache, affected):

| Concept | What it is | Where |
|---|---|---|
| **cross-project input** | A task's input that points into another project. Either a path from the workspace root (`/backend/docs/swagger.yaml`, chapter 1) or a **file group of another project**: `project://etl?group=schema` means "the files the `etl` project lists in its `schema` group". | `mcp/moon.yml` |
| **published file group** | A group a project declares for its readers: the ETL's `schema` (its DDL), the backend's `views` (what it creates in StarRocks) and `openapi`. The owner decides what is in it; readers only reference its name, so when the owner moves a file, it updates its group and every reader follows. | `etl/moon.yml`, `backend/moon.yml` |
| **token** | A variable moon expands in a task: `$workspaceRoot` (the repo root), `@group(name)`. Used here to point the MCP tests at the ETL and the portal folders, instead of the sibling checkouts today's CI clones. | `env:` of `mcp:test` |

And one pattern from chapter 1, repeated: the Python client is **generated** from `swagger.yaml` and **checked**
(`python-client:check`), like the TypeScript one.

Next: `poc/monorepo-03-images-release` builds and tags the images of the four modules and releases them as one
product.
