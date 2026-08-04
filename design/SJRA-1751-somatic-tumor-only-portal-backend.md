# Somatic Tumor-Only (TO) — Portal backend analysis

**Upstream**: [SJRA-1751](https://d3b.atlassian.net/browse/SJRA-1751) (ETL, `radiant-portal-pipeline`)
**Portal ticket**: TBD
**Scope**: backend only — SNV only, no CNV. No implementation in this document.

---

## 1. Context

The ETL now ingests **Somatic Tumor-Only (TO)** SNV data — a tumor sample with no matched normal —
alongside the existing **Tumor-Normal (TN)** path. The pipeline explicitly put API and UI out of
scope, so the portal side is untouched.

Two consequences for the portal:

1. The somatic Variants tab has a single **SNV (TN)** toggle. An **SNV (TO)** toggle is needed;
   selecting it must narrow the task list to TO tasks.
2. The occurrence table must display **TO frequencies**. The ETL already added the columns to
   `snv__variant`.

The team also asked to expose the new **SQ** and **AQ** quality columns as columns and filters.

Frontend work is out of scope here, and is named only where it justifies a backend contract.

---

## 2. Ground truth from the ETL

Source: `radiant-portal-pipeline/design/SJRA-1751-somatic-snv-tumor-only-ingestion.md`.

**There is no TO/TN discriminator column anywhere.** TO rows go into the existing
`somatic__snv__occurrence` with the whole `normal_*` block left NULL. The task type is unchanged
(`radiant_somatic_annotation`). No new table, no new task type, no new DAG.

**The verdict is a property of the task, computed at `task_id` grain.** Canonical SQL:
`radiant/dags/sql/radiant/somatic_snv_staging_variant_freq_insert.sql`.

```
n_tumoral = COUNT(DISTINCT aliquot WHERE histology_type = 'tumoral')
n_normal  = COUNT(DISTINCT aliquot WHERE histology_type = 'normal')
  over staging_sequencing_experiment WHERE analysis_type = 'somatic', GROUP BY task_id

tumor_only   ⟺ n_tumoral = 1 AND n_normal = 0
tumor_normal ⟺ n_tumoral > 0 AND n_normal > 0
```

Three properties of that rule are load-bearing:

- **Grouped by `task_id` alone** — not by `part`, not by `case_id`. Narrowing the grouping to a
  single sequencing experiment leaves every TN task looking like 1 tumoral / 0 normal, which
  reclassifies the entire TN cohort as TO.
- **The two flags are independent, not complementary.** A malformed task (2 tumoral / 0 normal, or
  0 tumoral / 1 normal) belongs to **neither** cohort. Never implement TN as `NOT tumor_only`.
- **Per-task, not per-case.** Pipeline seeds deliberately place TN task 67 and TO task 68 on the
  *same* tumor sample inside case 22; case 23 is TO-only (task 69, seq 64).

`normal_seq_id IS NULL` on the occurrence row is documented upstream as "a convenience, not the
definition".

> ### Semantic warning
>
> **TO frequencies measure germline frequency, not somatic recurrence.** With no matched normal
> there is nothing to subtract: 95% of high-confidence TO calls sit at a germline allele fraction,
> and a common variant will show a TO frequency around 50%. That is a *different quantity* from the
> TN frequency. **TO and TN frequencies must never be compared, summed or averaged.**

---

## 3. The SNV (TO) toggle

### 3.1 API contract

Extend `types.OccurrenceType` (`backend/internal/types/occurrence.go`), the enum behind the
`data_type` query param of `GET /{tenant}/cases/{case_id}/{seq_id}/tasks_with_occurrences`:

| `data_type` | task_type | cohort |
|---|---|---|
| `germline_snv` | `radiant_germline_annotation` | — |
| `germline_cnv` | `alignment_germline_variant_calling` | — |
| `somatic_snv` *(deprecated)* | `radiant_somatic_annotation` | tumor_normal |
| `somatic_snv_tn` | `radiant_somatic_annotation` | tumor_normal |
| `somatic_snv_to` | `radiant_somatic_annotation` | tumor_only |

**Why a flat enum rather than an orthogonal `?analysis_mode=tn|to`.** OpenAPI cannot express "valid
only when `data_type=somatic_snv`", so generated clients would happily build
`germline_snv&analysis_mode=to`. The flat enum is 1:1 with the toggle button and extends naturally
to `somatic_cnv_to` later.

**Why `somatic_snv` stays, aliased to TN.** This is more than compatibility. Today `somatic_snv`
returns *all* `radiant_somatic_annotation` tasks — so the moment the ETL ingests TO, the existing
"SNV (TN)" button starts listing TO tasks. Aliasing it to TN **repairs that interim regression**
rather than merely preserving behaviour. Mark it deprecated in the param description with a removal
condition.

**Mapper.** `TaskTypeCode() (*string, error)` cannot carry the cohort, since TO and TN share one
task_type. Replace it — there is exactly one non-test caller, `handlers_cases.go:268` — with a
single mapper rather than two switches that can drift:

```go
type SomaticCohort string

const (
    SomaticCohortNone        SomaticCohort = ""
    SomaticCohortTumorNormal SomaticCohort = "tumor_normal"
    SomaticCohortTumorOnly   SomaticCohort = "tumor_only"
)

type TaskSelector struct {
    TaskTypeCode  string
    SomaticCohort SomaticCohort
}

func (o OccurrenceType) TaskSelector() (TaskSelector, error)
```

Return value + error, not `(*TaskSelector, error)` — the current pointer exists only because the
payload was a bare string. `default:` returns an error, per the repo rule against silent defaults;
the existing unknown-input and empty-string tests in `occurrence_test.go` carry over unchanged.

Add `AllOccurrenceTypes` plus a test asserting every value resolves. swaggo reads `Enums(...)` from
the annotation *string*, not from the Go constants, so a new constant without an annotation edit
disappears from the generated TS/Python clients with **no build error**.

**Swagger impact** is one line at `handlers_cases.go:240`:

```
@Param data_type query string true "Occurrence type" Enums(germline_snv, germline_cnv, somatic_snv, somatic_snv_tn, somatic_snv_to)
```

Purely additive — the generated `CaseTasksWithOccurrencesDataTypeEnum` gains two members and
existing callers still compile. No new route, so `Test_TenantRoutesAreMappedToActions` is unaffected.

### 3.2 Task-list query

`TaskRepository.ListTasksByCaseSeqAndTaskType` (`backend/internal/repository/postgres/task.go:122`)
takes a `types.TaskSelector` and is renamed (it is no longer just a task type). Pass the struct
rather than two adjacent strings.

**Keep it PostgreSQL-only.** The clinical model already carries histology:
`task_context → sequencing_experiment.sample_id → sample.histology_code`, whose values are exactly
`'tumoral'` and `'normal'`, FK-enforced by `000001_init.up.sql:1120-1121` — the same vocabulary the
ETL uses. Reading `staging_sequencing_experiment` instead would mean a second database, exposure to
the federated-view work still outstanding, and losing tasks that exist but are not yet ingested.

When `SomaticCohort != ""`, join an aggregated derived table. Germline paths must emit
byte-identical SQL to today.

```sql
JOIN (
    SELECT k_tctx.task_id,
           COUNT(DISTINCT CASE WHEN k_spl.histology_code='tumoral' THEN k_se.aliquot END) AS n_tumoral,
           COUNT(DISTINCT CASE WHEN k_spl.histology_code='normal'  THEN k_se.aliquot END) AS n_normal
    FROM task_context k_tctx
    JOIN sequencing_experiment k_se ON k_se.id  = k_tctx.sequencing_experiment_id
    JOIN sample k_spl               ON k_spl.id = k_se.sample_id
    JOIN task k_task                ON k_task.id = k_tctx.task_id
                                   AND k_task.task_type_code = 'radiant_somatic_annotation'
    GROUP BY k_tctx.task_id
) k ON k.task_id = task.id
```

then a `switch` on the cohort choosing a **static** predicate: `k.n_tumoral = 1 AND k.n_normal = 0`
or `k.n_tumoral > 0 AND k.n_normal > 0`.

Details that must not be lost in implementation:

- The derived table is grouped by `task_id` **alone** — it must not be narrowed to the queried
  `sequencing_experiment_id` or `case_id`. This is the trap described in §2 and deserves the one
  code comment the repo's comment policy allows, pointing at the pipeline SQL file.
- Apply `WithTenantOn(ctx, "k_task")` to the **subquery's** `*gorm.DB`, not the outer `tx`.
- Use distinct aliases (`k_*`); the outer query already aliases `task` as `task`.
- Use `types.*Table.Name` and `types.RadiantSomaticAnnotationTask`, never literals.
- `COUNT(DISTINCT aliquot)`, not `seq_id` — matches the ETL exactly.

Malformed tasks fall out of both predicates automatically. Pin that with explicit tests so a later
"simplification" to `NOT tumor_only` cannot slip through.

The ETL's `analysis_type = 'somatic'` filter has no Postgres analog, but is redundant here: the
outer query already pins `task_type_code = 'radiant_somatic_annotation'`.

### 3.3 Occurrence-list endpoints — no change, verified

`POST /{tenant}/occurrences/somatic/snv/{case_id}/{seq_id}/{task_id}/{list,count,aggregate,statistics}`
filters on `tumor_seq_id + task_id + part`. `task_id` *is* the discriminator, so selecting a TO task
yields TO occurrences with zero code change.

Supporting evidence: no `normal_*` column is referenced anywhere in `backend/internal/` outside the
DDL — not in `SomaticSNVOccurrence`, not in `ExpandedSomaticSNVOccurrence`, not in the expanded
SELECT, not in any `Field`. TO's all-NULL normal block cannot silently drop rows.

### 3.4 `has_variants` — deferred, deliberately

`CaseSequencingExperiment.has_variants` (`internal/types/case.go:123`, built at
`starrocks/cases.go:276-277`) drives more than one button. In the case entity the frontend reads it
at `apps/case/src/entity/case-entity.tsx:58` (gates the Variants tab), `:62` (default `seq_id`),
`somatic-variants-tab.tsx:32` and `germline-variants-tab.tsx:30` (dropdown contents), and
`use-variant-search-params.tsx:13,48` (validates the `seq_id` URL param). The case-list usage at
`case-actions-menu-cell.tsx:39` is a *different*, case-level flag.

**Leaving it alone is safe.** The existing predicate is
`task_type = 'radiant_somatic_annotation' AND histology_type = 'tumoral'`, which a TO staging row
already satisfies — so no TO sequencing experiment disappears and nothing breaks. The only
divergence is a tumoral seq exp that has one cohort but not the other: it is then offered in both
modes, and in the wrong mode the task dropdown is simply empty.

**Recommendation: ship task filtering first; revisit only if that empty state proves confusing.**

If picked up later, the cheap shape is two additive booleans on `CaseSequencingExperiment` —
`has_somatic_snv_tn_variants` / `has_somatic_snv_to_variants`, zero API breakage — fed by a
per-`seq_id` aggregated derived table replacing the correlated LEFT JOIN at `cases.go:276`, with the
same "group by `task_id` only" caveat. A generic `variant_data_types: []OccurrenceType` is the
better long-term shape but is blocked today: `has_variants` does not model `germline_cnv` at all
(it never looks at `alignment_germline_variant_calling`), so the array would be inaccurate without
also changing the germline CNV tab.

`SearchCases` (`cases.go:66`) carries the same predicate and must **not** change — the case list has
no mode, and a TO case does have variants.

---

## 4. TO frequencies in the occurrence table

The ETL added six flat columns to `snv__variant`
(`radiant/dags/sql/radiant/migrations/SJRA-1751_snv_variant_add_tumor_only_frequencies.sql`):
`somatic_pf_to_{wgs,wxs}`, `somatic_pc_to_{wgs,wxs}`, `somatic_pn_to_{wgs,wxs}`. All are
`COALESCE(..., 0)` and never NULL. `pc` = carriers, `pn` = cohort size, `pf` = `pc/pn`.

Expose the **WGS** trio only, mirroring TN exactly. No WXS is exposed for TN either — keep parity
and defer WXS.

1. **`internal/types/variant.go`** — add `SomaticPfToWgsField` and `SomaticPcToWgsField` next to the
   TN pair at `:381-397`, with `CanBeSelected/CanBeFiltered/CanBeSorted: true`. Use `IntegerType`
   for `pc_to`; note in passing that the existing `SomaticPcTnWgsField` is typed `DecimalType` over
   an `INT(11)` column — a cheap drive-by fix.
2. **`internal/types/somatic_snv_occurrence.go`** — register both in
   `SomaticSNVOccurrencesDefaultFields` (where the TN pair sits, `:189-190`) and add
   `SomaticPfToWgs` / `SomaticPcToWgs` to the `SomaticSNVOccurrence` DTO. Both cohorts are always
   returned; the frontend picks per mode.
3. **`ExpandedSomaticSNVOccurrence`** — add `somatic_pc_to_wgs`, `somatic_pn_to_wgs`,
   `somatic_pf_to_wgs`, and extend the hand-written SELECT at
   `starrocks/somatic_snv_occurrences.go:91`, where `v.somatic_pn_tn_wgs` already lives with no
   `Field` behind it.

> **Correctness note.** Until this ships, a TO occurrence renders the **TN cohort's** frequency — a
> wrong number on screen, not a missing feature. `somatic_pf_tn_wgs` is also filterable and
> sortable, so saved filters currently apply a TN threshold to TO variants.

---

## 5. SQ and AQ

The ETL added four columns to `somatic__snv__occurrence`
(`migrations/SJRA-1751_somatic_snv_occurrence_add_sq_aq_hotspot.sql`):

| Column | Type | Meaning |
|---|---|---|
| `tumor_sq` | FLOAT | somatic quality, per call, tumor side |
| `normal_sq` | FLOAT | same, normal side — NULL on every TO row |
| `info_aq` | FLOAT | systematic-noise score used by the caller to flag noisy sites |
| `info_hotspot` | BOOLEAN | known somatic site flag (see §6) |

Expose `tumor_sq` and `info_aq` using the **optional-column** pattern already established by
`tumor_ad_ratio` / `tumor_ad_alt` / `tumor_ad_total`: place them in the `// Occurrence facets` block
of `SomaticSNVOccurrencesFields`, *not* in `DefaultFields`. The frontend then requests them via
`additional_fields`, and no existing `assert.JSONEq` body changes.

- `SomaticSNVTumorSqField` — `Name: "tumor_sq"`, `Alias: "sq"`, selected/filtered/sorted, `DecimalType`.
- `SomaticSNVInfoAqField` — `Name: "info_aq"`, `Alias: "aq"`, same flags.
- DTO: `Sq` / `Aq` as `*float32` with `omitempty` on `SomaticSNVOccurrence`, plus the same on
  `ExpandedSomaticSNVOccurrence` and its raw SELECT.
- Set explicit aliases, unlike `SomaticSNVInfoQdField` whose json tag `qd` and column `info_qd`
  already disagree.

`normal_sq` is TN-only by definition; expose it in the expanded sheet only if the sheet ever shows
normal-side data.

**Two caveats:**

- SQ, AQ and hotspot are **DRAGEN-only**. On Mutect2-produced TN data they are NULL — the
  pipeline's own data-QA config excludes them from its not-all-NULL check. A TN-mode filter on SQ or
  AQ can therefore legitimately return nothing.
- TO rows carry NULL for **23 `info_*` columns** plus `quality`, including `info_qd`. Existing
  occurrence facets built on those columns will be empty in TO mode. SQ and AQ are precisely the
  quality signals that replace them for TO — worth an explicit UI decision.

---

## 6. Verified non-issues and adjacent findings

**`GetSequencingPart` — not a bug.** `internal/utils/repositories.go:80` reads
`SELECT part FROM staging_sequencing_experiment WHERE seq_id = ?` with no `task_id` qualifier, while
the primary key is `(case_id, seq_id, task_id)`. With TO, one tumor seq legitimately has rows under
both a TN and a TO task. Confirmed with the team: the pipeline partitioner assigns `part` per
sequencing experiment and raises on inconsistency, so every row for one `seq_id` carries the same
`part`. No change. *(Residual, unrelated to TO: zero matching rows returns `(0, nil)` silently
rather than an error — optional hardening.)*

**The hotspot column is dead — flagged, out of scope.** The backend maps `info_hotspotallele` to
the `hotspot` field (`SomaticSNVInfoHotspotAlleleField`). The ETL states this GATK-era field was
never populated by DRAGEN, and now writes a working boolean `info_hotspot` instead. The portal's
hotspot column is therefore empty today. Separate ticket.

**Type drift in the local DDL.** `backend/scripts/init-sql/init_starrocks.sql` declares
`info_hotspotallele` as `VARCHAR(255)`; the pipeline declares it `INT`.

---

## 7. Local schema and fixtures

No Postgres migration, and no portal-owned StarRocks migration — the production StarRocks schema is
owned by the pipeline. Only the portal's dev and test copies must catch up.

| File | Change |
|---|---|
| `backend/scripts/init-sql/init_starrocks.sql:176-200` | `snv__variant` DDL gains the six `somatic_p{c,n,f}_to_{wgs,wxs}` columns |
| `backend/scripts/init-sql/init_starrocks.sql:473` | `INSERT OVERWRITE snv__variant (...)` column list gains the WGS trio |
| `backend/scripts/init-sql/init_starrocks.sql:400` | `somatic__snv__occurrence` gains `info_hotspot`, `info_aq`, `tumor_sq`, `normal_sq` |
| `backend/test/data/sql/snv__variant.sql`, `.../somatic__snv__occurrence.sql` | same columns |
| `backend/test/data/*/snv__variant.tsv` (8 folders) | header + values |
| `backend/test/data/simple/somatic__snv__occurrence.tsv` | TO rows with empty `normal_*`, plus the new columns |
| `backend/test/data/simple/staging_sequencing_experiment.tsv` | a TO staging row (same `part` as its TN sibling) and a malformed-task row |
| `backend/test/data/clinical/01_task.sql`, `05_task_context.sql` | a TO task on the same tumor seq as existing TN task 74, mirroring pipeline case 22 / task 68. Task ids 82+ are free |

**Fixture hazards.** The Postgres clinical fixtures are shared by every `ReadPostgres` test, so
adding a task to a case changes that case's `CaseEntity.Tasks` and any count assertion on it. The
existing somatic fixture is task 74 / case 71 / seq 74 (tumoral) + seq 73 (normal) — a valid TN pair
that keeps passing under the new filter. `Test_CaseOccurrenceTasksEndpoint_SomaticSNV_ReturnsSomaticAnnotationTask`
(`cmd/api/cases_tasks_integration_test.go:53`) and its repository twin at
`internal/repository/postgres/task_test.go:262` assert an exact task list for case 71 / seq 73, so
attach new fixtures elsewhere or update them deliberately. StarRocks tests read the Postgres seeds
through a live JDBC catalog, so the PG seeds and the staging TSV must be added consistently.

---

## 8. File-by-file summary

### Code

| File | Change |
|---|---|
| `internal/types/occurrence.go` | `somatic_snv_tn` / `somatic_snv_to`; `SomaticCohort`; `TaskSelector`; replace `TaskTypeCode()`; `AllOccurrenceTypes` |
| `internal/types/variant.go` | `SomaticPfToWgsField`, `SomaticPcToWgsField` |
| `internal/types/somatic_snv_occurrence.go` | register TO frequency fields in `DefaultFields`; SQ/AQ fields in the facets block; DTO fields on both structs |
| `internal/server/handlers_cases.go` | `caseTasksReader` signature (`:25`), `Enums(...)` + deprecation note (`:240`), call site (`:268`) |
| `internal/repository/postgres/task.go` | rename + `TaskSelector` param + cohort derived-table join (`:113-136`) |
| `internal/repository/starrocks/somatic_snv_occurrences.go` | extend the expanded SELECT (`:88-95`) |

### Tests

| File | Change |
|---|---|
| `internal/types/occurrence_test.go` | new values, `somatic_snv`→TN alias, all-values-resolve; keep unknown + empty branches |
| `internal/repository/postgres/task_test.go` | 9 existing call sites take the new param; add TN / TO / both malformed shapes / same-tumor-seq-in-both-cohorts |
| `internal/server/handlers_cases_tasks_test.go` | `MockRepository` and `emptyTaskRepo` signatures (`:43`, `:71`); cohort branches; alias test |
| `cmd/worker/case_validation_test.go:60` | stale mock method with the old signature — update or delete |
| `cmd/api/cases_tasks_integration_test.go` | TO and TN endpoint tests against the new fixtures |
| `cmd/api/somatic_snv_occurrences_integration_test.go`, `internal/server/handlers_somatic_snv_occurrences_test.go` | expected JSON bodies gain the TO frequency keys |

### Generated

`make doc` (backend) → `backend/docs/{docs.go,swagger.json,swagger.yaml}`; then `make generate-client-all`
from the repo root → `frontend/api/api.ts`, `cli/python/`; then update the `data_type` example in
`postman/`.

---

## 9. Suggested sequencing

1. Enum + `TaskSelector` + tests.
2. Postgres cohort join + clinical fixtures + repository tests (TN / TO / both malformed shapes /
   same tumor seq in both cohorts).
3. Handler + swagger annotation + integration tests.
4. TO frequency fields + SQ/AQ fields + local DDL/fixtures + JSON body updates.
5. `make doc`, then `make generate-client-typescript` from the repo root, then Postman.

Acceptance: `cd backend && go build ./... && make fmt && make lint && make test && make itest`, then
a manual check via `make docker-run && make run` against
`GET /{tenant}/cases/{case_id}/{seq_id}/tasks_with_occurrences?data_type=somatic_snv_to` and the
somatic SNV list endpoint on a TO task.

---

## 10. Open questions for the team

1. **Deploy ordering.** ETL-before-backend produces a visible interim state: TO tasks listed under
   the "SNV (TN)" button. The `somatic_snv` → TN alias repairs it. Confirm the team wants that
   reading rather than "all somatic".
2. **Two sources of truth.** The seq-exp dropdown reads StarRocks staging (ingested rows only) while
   the task dropdown reads Postgres (all tasks, ingested or not). A TO task that exists but is not
   yet ingested will appear in the task list. Should the task list be gated on ingestion?
3. **`tenant_code` drift.** The pipeline's `staging_sequencing_experiment` carries `tenant_code` and
   the ETL rule filters on it; the portal's DDL does not, relying on per-tenant database scoping.
   Confirm what the deployed table actually looks like.
4. **Can one sequencing experiment be `tumoral` under one task and `normal` under another?** The
   rule keys histology off the staging row, not the sample.
5. **Should TO and TN frequency columns be visible at the same time**, given they must never be
   compared?
6. **What replaces the empty TO facets** (`info_qd`, `quality`, and 22 other `info_*` columns are
   NULL for every TO row)?
