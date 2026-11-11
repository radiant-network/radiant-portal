# Chapter 4: data contracts

Branch: `poc/monorepo-04-contracts` (chapter 3 + the contracts of the ETL and the backend, their checks, the MCP tests
on the contracts, the breaking-change check). What it adds:

```bash
git diff --stat poc/monorepo-03-images-release poc/monorepo-04-contracts -- . ':!*/contracts/starrocks'
git diff --shortstat poc/monorepo-03-images-release poc/monorepo-04-contracts -- etl/contracts/starrocks backend/contracts/starrocks   # the 101 contracts
```

## Context: what the MCP does with the contracts of the ETL and the backend

Chapter 2 showed that the MCP reads three things it does not own. This chapter is about the first two, the StarRocks
tables of the ETL and the tenant views of the backend.

**Why the MCP needs to know the schema.** The MCP's users are AI agents (the D.A.V.I.D agents in LibreChat) that
answer a clinician's questions. An agent gets data in two ways, and both need SQL on tables the MCP does not own:

- **The Radiant tools** (`second_hit`, `cohort_carriers`, `genotype_phenotype`...): one tool per frequent question.
  The agent only gives arguments (a case, a gene); the tool builds tested SQL itself, in `radiant_mcp/queries/*.py`.
  This is the preferred way: the SQL already follows the rules a model gets wrong, such as always filtering on the
  `part` partition (without it StarRocks scans every partition of the tenant and the query times out).
- **Raw SQL, as a last resort** (`read_query`), when no tool answers. Here **the model writes the SQL**. It first calls
  `describe_schema`, which prints the **catalog** (`radiant_mcp/schema_catalog.py`) for one topic: which tables to
  use, their keys and partitions, how to join them, the useful columns with one line of meaning each, example
  queries. The raw schema says which columns exist; it does not say which table to use or how to join, which is
  where a model's SQL goes wrong.

In both ways, filters on text columns need the **exact stored values** (`radiant_mcp/enums.py`). StarRocks compares
strings case-sensitively, and the spellings are not uniform: Exomiser stores `pathogenic`, ClinVar stores
`Pathogenic`. A filter `exomiser_acmg_classification = 'Pathogenic'` raises no error: it **matches nothing**, and the
agent answers "no pathogenic variant in this case". So the tools map what the user says onto the stored spelling, and
`describe_schema` prints the allowed values next to each column.

So the MCP keeps, in its own code, three copies of what other modules own:

| In the MCP | What it is for | Example |
|---|---|---|
| `radiant_mcp/queries/*.py` | the SQL of the Radiant tools | `hits.py`: `o.filter, o.gq` |
| `radiant_mcp/schema_catalog.py` | what `describe_schema` tells the model before it writes SQL | `germline__snv__occurrence`: `"gq": "genotype quality"` |
| `radiant_mcp/enums.py` | the stored values, for the tools' filters and the model's SQL | `zygosity`: HET, HOM, HEM, WT, UNK |

Their truth is elsewhere: the ETL owns the tables, the backend owns the views. When a copy is wrong, there are two
kinds of failure:

- **a column that no longer exists** (the ETL renamed `gq`): the tool's SQL fails in StarRocks, and the agent tells
  the clinician it cannot answer. Visible, but in production;
- **a value that no longer exists** (the ETL now stores `Pathogenic` instead of `pathogenic`): no error at all, an
  **empty result**, and the agent gives a wrong answer with confidence. The worst kind: nobody notices.

**A contract** is what an owner **publishes and promises** about one table or view: its columns, their type, the
values allowed, what they mean, who reads it. One YAML file per table, in the ODCS format (Open Data Contract
Standard): `etl/contracts/starrocks/` (31 tables), `backend/contracts/starrocks/tenant/` (70 views). Both are
**hand-edited** by their owner: the contract is the source of truth, and the owner's check verifies its code matches
it.

**What the MCP does with them, today: its tests.** The MCP does not read the contracts at runtime. Its tests
(`mcp:test`) check its copies against them:

1. **catalog ⊆ contracts**: every table and column the catalog shows the agent exists in the contract of the ETL or
   of the backend (`test_schema_catalog.py`);
2. **enums = contract**: the values in `enums.py` are exactly those of the ETL contract (`zygosity`: HET, HOM, HEM,
   WT, UNK);
3. **the tools' SQL resolves**: sqlglot parses every query the tools build and resolves each column against the
   schema of the contracts (`test_curated_sql_schema.py`); the contract's `array` type validates the `unnest`;
4. **a `deprecated` column is a missing column**: the tests drop the columns tagged `deprecated`. When the ETL
   deprecates `gq`, `mcp:test` fails in that same PR: the MCP stops reading it before the PR merges.

**Why contracts rather than the DDL and the Go (chapter 2).** In chapter 2 the MCP tests read the other modules'
internals: regexes on the ETL's SQL, on the backend's Go and SQL templates (`schema_sources.py`, 361 lines).
Fragile (a backend refactor breaks the MCP tests without changing any view), incomplete (the tenant views are built
by Go code at runtime, a regex cannot see what it produces), and nothing said what is public: the MCP could read any
internal column. With contracts each check is done by whoever knows:

```
ETL      etl:contracts-check       the contract = its DDL and its data QA
backend  backend:contracts-check   the contract ⊆ the views its code creates (a column left out is not published)
MCP      mcp:test                  catalog, enums, SQL ⊆ the contracts (and it runs after both checks)
```

And a contract is the one place to look for a breaking change: `contracts-breaking` compares the contracts before and
after a PR and requires the right bump of the product version (chapter 3).

**Next: the contracts in the MCP's runtime.** Today the catalog repeats short descriptions by hand; the contracts
know much more. For `gq`: "Phred; a GQ of 0 or missing is stored as NULL; the portal frequencies count only GQ >= 20".
The MCP could load the contracts at runtime: the catalog would keep only its **selection** (which tables and columns
to show the agent, the example queries), and take descriptions, types, units and enum values from the contracts.
Nothing to copy any more, and the agent gets the owner's documentation. The contracts would then be inputs of
`docker-mcp` (chapter 3): a contract change would rebuild and redeploy the MCP image. Not done in this POC.

Still parsed from Go: the API fields the MCP filters on (`mcp/tests/unit/portal_fields.py`, group `api-fields`).
They belong in `swagger.yaml`, the API's own contract.

## How this chapter works

| Step | Concept |
|---|---|
| 0 | setup |
| 1 | a contract: one file per table, owned and hand-edited |
| 2 | each owner checks its contract against its code |
| 3 | the MCP tests read the contracts: what runs them now |
| 4 | the DDL and the contract change together |
| 5 | deprecating a column: a minor bump, and the MCP moves in the same PR |
| 6 | removing a column: after a release, a major bump; the two deployment rules |
| 7 | the backend: a view column is published only when its contract has it |

## Step 0: setup

```bash
git switch poc/monorepo-04-contracts
export PATH=$PWD/.tools/node_modules/.bin:$PATH
export CONTRACTS_BASE=poc/monorepo-04-contracts   # what contracts-breaking compares with (CI: the PR's base)
git status --short                                # nothing
docker info --format '{{.ServerVersion}}'         # backend:contracts-check migrates a throwaway Postgres
```

`CONTRACTS_BASE` matters: its default is `main`, which in a clone of radiant-portal is the real portal, without
contracts.

## Step 1: a contract

**Concept.** A contract describes one table for its readers: the purpose and usage of the table, then each column
with its logical type, whether it is required, its allowed values (`enum`) and what it means. The `customProperties`
record where a description comes from. The owner edits it like code, in the same PR as the table.

```bash
C=etl/contracts/starrocks/tenant/germline__snv__occurrence.odcs.yaml
head -12 $C                                       # owner, id, status, purpose
sed -n '/^  - name: gq$/,/^  - name: dp$/p' $C     # a column: type, description, unit
sed -n '/^  - name: zygosity$/,/^  - name: /p' $C  # an enum: each value with its meaning and its ontology term
grep -A9 'property: consumers' $C                 # the readers: the files of the portal and the MCP that read it
ls backend/contracts/starrocks/tenant | head      # the backend's: one per tenant view
```

## Step 2: each owner checks its contract

**Concept.** The contract is the source of truth; the owner's check fails when its code says something else. The ETL
compares with its DDL (`radiant/dags/sql/*/init/`: columns, types, `NOT NULL` = required) and its data QA (dbt
`accepted_values` = the enum). The backend builds its views as `refresh-tenants` does (it migrates a throwaway
Postgres in Docker and runs the Go view builders), and checks that every contracted view, column and type exists.

```bash
moon run etl:contracts-check backend:contracts-check
```

Expected: `31 contracts, 0 mismatch(es) with the DDL / data QA` and
`70 views, 0 without a contract (not published), 0 mismatch(es)` (with the Docker logs of the Postgres).

## Step 3: the MCP tests read the contracts

**Concept.** `mcp:test` now takes as inputs the **contracts** of the ETL and of the backend (groups `contracts`), not
their DDL, Go and SQL. And it depends on both checks: it tests against contracts their owners have verified.

```bash
moon task mcp:test                                # Depends on: etl:contracts-check, backend:contracts-check
moon run mcp:test                                 # 651 passed
```

What runs now, for an ETL change:

```bash
A() { moon query affected | jq -c '.tasks | keys'; }
DDL=etl/radiant/dags/sql/radiant/init/germline_snv_occurrence_create_table.sql
echo "-- tour" >> $DDL; A; git checkout -- etl
echo "# tour"  >> $C;   A; git checkout -- etl
```

Expected:

| Change | Affected |
|---|---|
| the DDL | `etl:contracts-check`, `etl:test-unit`, `etl:docker-operator`: **no `mcp:test`** (chapter 2: it ran) |
| the contract | `etl:contracts-check`, `etl:contracts-breaking`, **`mcp:test`** |

The ETL can change its internals freely; the MCP tests run when what the ETL **publishes** changes.

## Step 4: the DDL and the contract change together

**Concept.** An ETL PR that adds a column to the table must add it to the contract too, or `etl:contracts-check`
fails. An added column is a **minor** change: no reader can break.

```bash
perl -pi -e 's/^    gq INT,\n/    gq INT,\n    demo_score DOUBLE,\n/' $DDL
moon run etl:contracts-check                      # ✗ demo_score: in the DDL, missing from the contract
perl -0pi -e 's/(  - name: dp\n)/  - name: demo_score\n    logicalType: number\n    physicalType: DOUBLE\n    description: A tour column.\n$1/' $C
moon run etl:contracts-check etl:contracts-breaking
git checkout -- etl
```

Expected, last run: `0 mismatch(es)`, then `minor  column demo_score added` and
`contracts: needs a minor bump since poc/monorepo-04-contracts (release checked: none yet)`.

## Step 5: deprecating a column

**Concept.** A column is never removed at once: readers may still use it. First it is **deprecated** (tag
`deprecated`): a minor change. The MCP tests then treat it as gone, so the PR that deprecates it also moves the MCP
off it. `contracts-breaking` computes the bump the change needs and compares it with the **PR title**, which becomes
the squash commit release-please reads (chapter 3): `fix:` declares no bump, `feat:` a minor, `!` a major.

```bash
perl -0pi -e 's/(  - name: gq\n)/$1    tags: [deprecated]\n/' $C
git diff --stat
CONTRACTS_PR_TITLE='fix(etl): stop using gq' moon run etl:contracts-breaking    # ✗ declares none, needs minor: use feat:
CONTRACTS_PR_TITLE='feat(etl): deprecate gq' moon run etl:contracts-breaking    # the PR title declares a minor bump: ok
moon run mcp:test                                 # 25 failed, 626 passed
```

The 25 failures are the MCP still reading `gq`: the catalog (`test_catalog_tables_and_columns_exist_in_the_etl`) and
24 queries (`hits.germline_plp`, `carriers.*[germline_snv]`, `charts.oncoprint`...). In a real PR, the author removes
`gq` from those 7 files in the same PR, and the MCP is off `gq` before the deprecation merges. In CI the title comes
from the PR (`CONTRACTS_PR_TITLE` in `ci.yml`), and editing the title re-runs the check.

Keep the change for the next step.

## Step 6: removing a column, after a release

**Concept.** Removing a column is allowed only once a **release** shipped it deprecated (the last `v*` tag reachable
from the base): then every deployed reader already stopped reading it. The removal is a **major** change: the title
needs `!`. Removing what no release deprecated is **refused**, whatever the title.

Commit the deprecation (the merged PR), then remove `gq` before any release:

```bash
git switch -c tour/demo-contracts
git -c user.name=tour -c user.email=tour@localhost commit --no-verify -qam "feat(etl): deprecate gq"
export CONTRACTS_BASE=tour/demo-contracts
perl -0pi -e 's/  - name: gq\n.*?(?=  - name: )//s' $C
perl -ni -e 'print unless /^    gq INT,$/' $DDL
moon run etl:contracts-breaking                   # ✗ refused: deprecated but not released yet
```

The output lists the readers of the contract (`radiant-portal, radiant-mcp (7 files: ...)`): who to warn. Now release
the deprecation, as release-please would, and try again:

```bash
git tag v1.1.0 tour/demo-contracts
CONTRACTS_PR_TITLE='feat(etl): remove gq'  moon run etl:contracts-breaking      # ✗ needs major: add `!`
CONTRACTS_PR_TITLE='feat(etl)!: remove gq' moon run etl:contracts-breaking      # ok: release checked: v1.1.0
```

`contracts-breaking` reads git, not production. Its guarantee holds only if production follows **two rules** (not
enforced yet):

1. **One release for every image.** Never deploy or roll back one image alone: the ETL 2.0.0 (without `gq`) with the
   MCP 1.0.0 (still reading `gq`) was never tested together.
2. **No release skipped.** 2.0.0, which removes `gq`, deploys only onto a production that ran 1.1.0, which deprecated
   it: every reader is then at least 1.1.0. From 1.0.0 straight to 2.0.0, the new ETL drops `gq` while the old MCP
   still reads it.

Clean up:

```bash
git tag -d v1.1.0
git checkout -- etl
git switch poc/monorepo-04-contracts
git branch -D tour/demo-contracts
export CONTRACTS_BASE=poc/monorepo-04-contracts
git status --short                                # nothing
```

## Step 7: the backend publishes what its contracts list

**Concept.** The backend's views expose every column of its Postgres tables, internal ones included. Its contracts
list what it **publishes**: a new column is not published until someone adds it to the contract, with a description.
A column in a contract that the views no longer have fails the check: deprecate it first, like in the ETL.

```bash
M=backend/scripts/init-sql/migrations
echo 'SELECT 1;' > $M/000047_tour.down.sql
echo 'ALTER TABLE public.cases ADD COLUMN demo_note text;' > $M/000047_tour.up.sql
moon run backend:contracts-check                  # 0 mismatch(es): demo_note exists, but is not published
echo 'ALTER TABLE public.cases DROP COLUMN proband_id;' > $M/000047_tour.up.sql
moon run backend:contracts-check                  # ✗ cases.proband_id: in the contract, not in the view
rm $M/000047_tour.*
```

A new view starts from a scaffold: the generator writes a contract with the view's columns and types, never
overwriting an existing one. Then the backend adds the descriptions and removes the columns no reader should use.

```bash
rm backend/contracts/starrocks/tenant/sex.odcs.yaml
moon run backend:contracts-check                  # 1 without a contract (not published)
moon run backend:contracts-scaffold -- sex        # + contracts/starrocks/tenant/sex.odcs.yaml
git diff --stat                                   # the scaffold has no descriptions: compare with the hand-edited one
git checkout -- backend
git status --short                                # nothing
```

## What to remember

- The MCP keeps copies of the ETL's and the backend's schema (catalog, enums, SQL). Its tests check those copies
  against the owners' **contracts**, never against their code.
- Each owner checks its own contract against its code; the MCP tests run after both checks, and only when a contract
  changes.
- A column is removed in two releases: deprecate (minor, the readers move in the same PR), then remove (major, after a
  release shipped the deprecation). The PR title must declare the bump.
- This holds if production deploys every image of one release together, and never skips a release.
- Next: the MCP could read the contracts at runtime, and stop copying them.

## Glossary

| Concept | What it is | Where |
|---|---|---|
| **data contract** | One YAML file (ODCS v3.2) per published table or view: columns, types, required, enums, descriptions, readers. Hand-edited by its owner. | `etl/contracts/`, `backend/contracts/` |
| **owner** | The module that writes the table (the ETL) or creates the view (the backend). It edits the contract and checks it. | `contracts-check` tasks |
| **reader** | A module that reads it (portal, MCP), listed in the contract's `consumers` property (the files that read it). | `readers` in `contracts-breaking`'s output |
| **published column** | A column in the contract. A view column left out of it may change or disappear without notice. | `backend:contracts-check` |
| **deprecated** | Tag on a column (or `status: deprecated` on a contract): still there, to be removed after the next release. The MCP tests treat it as gone. | `mcp/tests/unit/contracts.py` |
| **bump** | The version change a PR needs: none (description), minor (add, deprecate), major (released removal, type change, required change, enum value removed). | `scripts/contracts-breaking.py` |
| **expand / contract** | Change a schema in two steps, two releases apart, so that old and new readers both work in between. | step 6 |
| **deployment rules** | One release for every image; no release skipped. What `contracts-breaking` assumes about production. | step 6 |

This is the last chapter.
