# Somatic CNV — Portal API analysis

**Upstream**: [SJRA-1770](https://d3b.atlassian.net/browse/SJRA-1770) (ETL, `radiant-portal-pipeline`, merged)

**Portal ticket**: [SJRA-1797](https://d3b.atlassian.net/browse/SJRA-1797)

**Scope**: backend only — read API for somatic CNV occurrences. UI is a separate ticket. No implementation in this document.

---

## 1. Context

SJRA-1770 ingests **somatic tumor-only CNV** into a new StarRocks table. The pipeline put API and UI
explicitly out of scope, so the portal side is untouched: there is no type, repository, handler, route
or fixture for somatic CNV anywhere in `backend/`.

This ticket adds the read API, so a client can list, count, facet and inspect those segments the way it
already does for germline CNV.

The work is almost entirely a mirror of the germline CNV slice. The value of this document is the
handful of places where somatic differs — and the record of what was checked and found already done.

---

## 2. Ground truth from the ETL

Authoritative DDL:
`radiant-portal-pipeline/radiant/dags/sql/radiant/init/somatic_cnv_occurrence_create_table.sql`.

| | |
|---|---|
| StarRocks table | `somatic__cnv__occurrence`, **per-tenant** (lives in `<code>_tenant`) |
| Key | `DUPLICATE KEY(part, seq_id, task_id, cnv_id) PARTITION BY (part)` — **identical to germline CNV** |
| Task type | `tumor_only_variant_calling` |
| Cohort | tumor-only only. There is no tumor-normal CNV. |

### 2.1 The one thing worth reading twice

**`seq_id` is the tumor sequencing experiment id, and the column is literally named `seq_id`.**

Somatic *SNV* spells this `tumor_seq_id` and carries a `normal_seq_id` beside it. Somatic *CNV* does
neither — it has a single, germline-shaped `seq_id`. So the WHERE clause is
`seq_id = ? AND task_id = ? AND part = ?`, character-for-character germline CNV's, while the value bound
to `:seq_id` is the same tumor sequencing id the somatic SNV routes take.

Do not reach for `tumor_seq_id` here; it does not exist on this table.

### 2.2 Columns

Germline CNV's column set exactly, plus the DRAGEN allele-specific copy-number (ASCN) block:

> `cn` (germline already has it), and **8 new**: `cnf`, `cnq`, `mcn`, `mcnf`, `mcnq`, `maf`, `sd`, `ascn_as`

- `ascn_as` is DRAGEN's `FORMAT/AS`, renamed because `as` is reserved in StarRocks/MySQL.
- **Expect these to be mostly NULL.** DRAGEN 3.10.8 does not emit them at all; 4.2.4 declares them but
  omits them per record. `maf = 0` is the direct LOH marker where a record carries it.

### 2.3 Value domains that differ from germline

| Column | Somatic | Germline |
|---|---|---|
| `type` | `GAIN`, `LOSS`, `CNLOH`, `GAINLOH` | `GAIN`, `LOSS` |
| `alternate` | `<DUP>`, `<DEL>`, `<LOH>` | `<DUP>`, `<DEL>` |

Both LOH spellings DRAGEN emits (4.4's `<LOH>`, 4.2's multi-allelic `<DEL>,<DUP>`) are normalised by the
ETL to a stored `alternate` of `<LOH>`, so one event yields one row in either VCF format.

> ### Semantic warning
>
> Two columns read like germline's but do not mean the same thing.
>
> - **`nb_snv` counts somatic SNVs**, joined from `somatic__snv__occurrence` on `tumor_seq_id`. Germline
>   CNV's `nb_snv` counts germline SNVs. Same column name, different population — never compare or pool
>   the two.
> - **`gnomad_*` is NULL by design on CNLOH rows.** The gnomAD-SV join keys on `type`, not `alternate`:
>   `GAIN`/`GAINLOH` → `DUP`, `LOSS` → `DEL`, and copy-neutral `CNLOH` correctly matches nothing. A NULL
>   `gnomad_sf` on a CNLOH segment is the right answer, not missing data.

---

## 3. API surface

Five endpoints under `/{tenant}/occurrences/somatic/cnv/...`, mirroring germline CNV one for one
(`cmd/api/main.go:184-189`). All gated by `requireAction(types.ActionSearchCase)`.

| Method | Path |
|---|---|
| POST | `/{case_id}/{seq_id}/{task_id}/list` |
| POST | `/{case_id}/{seq_id}/{task_id}/count` |
| POST | `/{case_id}/{seq_id}/{task_id}/aggregate` |
| POST | `/{case_id}/{seq_id}/{task_id}/statistics` |
| GET | `/{case_id}/{seq_id}/{task_id}/{cnv_id}/genes_overlap` |

Request and response bodies are the shared sqon types (`ListBodyWithSqon`, `CountBodyWithSqon`, …) —
unchanged. Germline CNV has no `/expanded` and no `/dictionary` route; somatic CNV needs neither.

### 3.1 Task discovery — one new `data_type` value

`GET /{tenant}/cases/{case_id}/{seq_id}/tasks_with_occurrences?data_type=…` is how a client resolves the
`task_id` that the five routes above require. It needs a new value: **`somatic_cnv`**.

It maps to `TaskSelector{TaskTypeCode: "tumor_only_variant_calling", SomaticCohort: SomaticCohortNone}`.

**No cohort predicate.** Somatic SNV needed `SomaticCohortTumorOnly` because TO and TN rows share the
`radiant_somatic_annotation` task type, so the task type alone could not tell them apart. CNV has no such
ambiguity — `tumor_only_variant_calling` is tumor-only by definition, and the ETL rejects a task that is
not. Adding the `n_tumoral = 1 AND n_normal = 0` predicate anyway would only create a way for malformed
clinical data to silently hide the CNV tab.

**Why `somatic_cnv` rather than `somatic_cnv_to`.** There is no TN counterpart to disambiguate from, and
the plain name keeps the CNV pair symmetric with `germline_cnv`. If TN CNV ever ships, `somatic_cnv_tn`
can be added then. Note the frontend already declares `ApplicationId.somatic_cnv_to_occurrence`
(`frontend/components/cores/applications-config.tsx:12`) — the UI ticket will need to reconcile that name.

### 3.2 Which columns are exposed

**The 9 ASCN columns**: selectable, filterable and sortable; **none in the default field set**. The UI
ticket can then pull what it needs via `additional_fields` without a second backend change and client
regeneration, while the default response stays as lean as germline's. None are aggregable — they are
continuous, and `/statistics` already covers min/max.

**Everything else: mirror germline CNV exactly**, including the two cases where mirroring is arguably
the wrong call on its own merits. Consistency between the two CNV tabs is worth more than either
micro-optimisation, and any change here should change both tables at once:

- **`alternate` stays unexposed.** The column exists in StarRocks but germline declares no `Field` for
  it. For somatic it would only distinguish `<LOH>`, which `type` already splits into `CNLOH` /
  `GAINLOH` — strictly less information.
- **`cipos` / `ciend` stay exposed**, even though no observed DRAGEN version populates them (3.10.8
  declares but never fills them; 4.2.4 does not declare them). They will read NULL. Germline exposes
  both; dropping them here alone would be a gratuitous divergence.

---

## 4. Changes, file by file

Structure follows germline CNV. The row DTO and the field registry genuinely differ by 8 columns and
stay separate, but the **repository is shared** — see the revision note below.

> **Revised in review (PR #1550).** This section originally called for duplicating the repository
> rather than sharing it. Review disagreed, and was right: the two repositories came out line-for-line
> identical apart from the table var, the alias literal (`cnvo`/`scnvo`) and the row type. The five
> query bodies now live once in `internal/repository/starrocks/cnv_occurrences.go`, parameterised on
> `cnvTable types.Table`, with only the list helper generic over the row type
> (`listCNVOccurrences[T]`). Each repository is ~40 lines of delegation.
>
> It is also *simpler* than the SNV precedent it was measured against: `AddImplicitSNVOccurrencesFilters`
> needs a `switch` on the table because somatic SNV keys on `tumor_seq_id`, whereas both CNV tables key
> on plain `seq_id` (§3) — so the CNV helper needs no per-table branching at all. The field registries
> and the two test files stay per-type.

### 4.1 New files

| File | Contents |
|---|---|
| `internal/types/somatic_cnv_occurrence.go` | Row struct, `SomaticCNVOccurrenceTable` (`somatic__cnv__occurrence`, new alias, `PerTenant: true`), one `Field` per column, and the `Fields` / `DefaultFields` / `DefaultSort` / `QueryConfig` registries. Model on `germline_cnv_occurrence.go`. |
| `internal/repository/starrocks/somatic_cnv_occurrences.go` | `SomaticCNVOccurrencesRepository` + constructor taking `database.StarrocksDB`, and the five methods, each delegating to the shared helper below. |
| `internal/repository/starrocks/cnv_occurrences.go` | The shared CNV query layer used by both CNV repositories, parameterised on `cnvTable types.Table`: `prepareCNVQuery`, `listCNVOccurrences[T]`, `countCNVOccurrences`, `aggregateCNVOccurrences`, `cnvOccurrencesStatistics`, plus `cnvGenesOverlap` (this file is the renamed `cnv_genes_overlap.go`). |
| `internal/server/handlers_somatic_cnv_occurrences.go` | Consumer-side unexported `somaticCNVOccurrencesReader` interface + five handlers with full swagger blocks and new `@Id`s. |
| `test/data/sql/somatic__cnv__occurrence.sql` | Test DDL. |
| `test/data/{simple,gene_panels,multiple}/somatic__cnv__occurrence.tsv` | Fixture rows. Cover at least one `CNLOH` and one `GAINLOH` row, and one row with the ASCN block entirely NULL. |

Tests: `internal/repository/starrocks/somatic_cnv_occurrences_test.go`,
`internal/server/handlers_somatic_cnv_occurrences_test.go`, and CNV cases added to
`cmd/api/somatic_occurrences_integration_test.go`.

### 4.2 Edits

| File | Change |
|---|---|
| `internal/types/occurrence.go` | Add `OccurrenceTypeSomaticCNV = "somatic_cnv"`, list it in `AllOccurrenceTypes`, map it in `TaskSelector()`. |
| `internal/types/task.go` | Add the `tumor_only_variant_calling` task-type constant (the value is already seeded in Postgres — see §5). |
| `internal/server/handlers_cases.go:242` | Add `somatic_cnv` to the `Enums(...)` string. **swaggo reads this string, not the Go constants** — a value added to `AllOccurrenceTypes` alone vanishes from the generated clients with no build error. |
| `cmd/api/main.go` | Construct the repo (~line 61); add the `/cnv` group under `occurrencesSomaticGroup` with the five routes (~line 190). |
| `cmd/api/action_enforcement_integration_test.go` | Add the five routes to `expectedTenantActions` — `Test_TenantRoutesAreMappedToActions` fails if a `/:tenant` route ships unlisted. |
| `cmd/api/integration_test.go` | Add a somatic CNV route to `Test_SecureRoutes` (it silently passes for routes not listed). |
| `test/testutils/setup_starrocks.go:50` | Add the table to `perTenantTables`. That map's *values* derive from the `types.Table` defs, but its *membership* is hand-enumerated — the table is invisible to multi-tenant fixtures until listed. |
| `scripts/init-sql/init_starrocks.sql` | Add the DDL and a few seed rows for local dev. |

### 4.3 Generated — do not hand-edit

`cd backend && make doc` → `docs/{docs.go,swagger.json,swagger.yaml}`, then from the repo root
`make generate-client-all` → `frontend/api/`, `cli/python/`.

Add the five requests to `postman/RADIANT-API.postman_collection.json`, and the new `data_type` value to
its task-list example.

---

## 5. Verified non-issues

Checked against the current tree. Each of these needs **no work**.

- **The `type` facet dictionary already carries all four values.**
  `internal/repository/starrocks/facets.go:105-110` lists `GAIN`, `LOSS`, `GAINLOH`, `CNLOH`. This closes
  SJRA-1770 §9 Q1 ("do the new type values need portal work first?") — no.
  *Caveat, pre-existing:* the dictionary is keyed on facet name globally, so germline CNV's `type` facet
  also advertises `GAINLOH`/`CNLOH` with zero counts. Introduced by `c28750ff0`, not by this ticket.
- **`tumor_only_variant_calling` is already a seeded task type** —
  `scripts/init-sql/migrations/000001_init.up.sql:1253`. No migration.
- **Saved filters already accept somatic CNV** — `internal/types/saved_filter.go:43,47` carry
  `somatic_cnv_occurrence` and `somatic_cnv_variant`, already in the swagger enum and the Python client.
- **`types.CNVGeneOverlap` is reusable as-is**, and the genes-overlap CTE
  (`germline_cnv_occurrences.go:189-241`) depends only on the segment's `chromosome/start/end/length` — no
  coupling to either table's column set, so it extracts cleanly to a shared helper. It did: `cnvGenesOverlap`
  in `cnv_occurrences.go`, alongside the rest of the shared CNV query layer (§4.1).
- **`utils.GetSequencingPart(seqId, …)` works unchanged** — `seq_id` is a real sequencing experiment id.
- **No production StarRocks migration.** The production schema is owned by the pipeline; the portal only
  maintains its dev and test copies (§4).
- **No tenant view template** — `PerTenant: true` on the table var is the whole multi-tenancy change.

---

## 6. Suggested sequencing

1. Types (`somatic_cnv_occurrence.go`) plus the `occurrence.go` / `task.go` enum edits, with unit tests
   for the new `TaskSelector` mapping.
2. Test DDL and fixtures.
3. Repository and its integration tests.
4. Handlers and handler unit tests.
5. Routes, the two route-guard test entries, and the API integration tests.
6. `make doc`, client regeneration, Postman.

Acceptance:

```
cd backend && go build ./... && make fmt && make lint && make test && make itest
```

Then a manual `list` + `aggregate` against a seeded somatic CNV task, confirming that `type` facets
include the LOH values and that ASCN columns come back only when requested via `additional_fields`.

---

## 7. Settled — nothing here is open

All four questions raised during analysis have been decided. They are recorded so a reviewer does not
reopen them.

1. **`has_variants` does not model CNV at all — germline or somatic.** `starrocks/cases.go:282` gates on
   `task_type IN ('radiant_germline_annotation', 'radiant_somatic_annotation' AND histology_type = 'tumoral')`.
   A tumor sequencing with a somatic CNV task but no somatic SNV annotation task reads
   `has_variants = false`. Germline CNV has lived with this gap since it shipped (SJRA-1751 §3.4 deferred
   it deliberately), so somatic CNV inherits it rather than introducing it.
   → **Out of scope. Separate ticket**, covering both CNV types at once. Nothing in SJRA-1797 depends on it;
   the five endpoints work regardless, since the client reaches them through the task list (§3.1), not
   through this flag. It only bites if the UI gates the tab on `has_variants` — which is the UI ticket's
   problem to raise.
2. **Expose `alternate`?** → **No. Mirror germline** (§3.2).
3. **`cipos` / `ciend` are dead columns?** → **Keep them. Mirror germline** (§3.2).
4. **Frontend name mismatch** — the frontend's `somatic_cnv_to_occurrence` versus the API's `somatic_cnv`.
   → **Accepted as-is.** The two names are allowed to differ; the frontend identifier is a UI-side
   application key, not a wire value, and the API contract does not bend to match it. Recorded here only
   so whoever picks up the UI ticket is not surprised by it.
