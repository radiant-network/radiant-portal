# pcx_30 cohort expansion — PROTOTYPE, UNDER EXTERNAL EVALUATION

Expand the 7 `pcx_30_*_deid` release tables and their dependent views from the
curated ATRT / Medulloblastoma cohort to **every `stg_cbtn_enrollment_final`
patient who also has a `research_study_name = 'CBTN'` row in `diagnosis`**,
labelling the newly admitted patients `diagnosis_type_cohort = 'Not Applicable'`.

> The study qualifier was added 2026-10-30 — **§1b** carries it, and it moves the
> expanded cohort from 6,963 to **6,957** patients. Figures elsewhere in this
> document were measured 2026-10-23 against the unqualified rule and are left as
> measured; where one says 6,963, §1b is what supersedes it.

> **STATUS 2026-10-23 — awaiting a go/no-go decision, do not promote.**
> A working prototype exists and has been measured end to end (§6), but the
> approach has **not been adopted**. An external team is evaluating it, and the
> decision on whether to use it at all follows that review. Until then:
> the published release is unchanged at 970 patients, the repo changes are all
> inert under the default scope, and the preview tables and CSVs are evaluation
> artefacts rather than a release. **§9 is the hand-off: what to look at, and what
> is actually being asked.**
>
> If the answer is NO, §7 has the drop statements and the repo changes revert
> cleanly. If YES, §4 is the route to production and §6g lists what must be
> finished first — the prototype is not the deliverable.

Written 2026-10-23. Every number below was measured against live prod on
2026-10-23 and is labelled, so a later reader can re-measure rather than trust it.

Read `UPSTREAM_SOURCES.md` first — this plan assumes its §4 (staleness), §5
(refresh procedure and the three script hazards) and §7 (verification queries).

---

## 1. The cohort rule, as decided

Decided by the data owner 2026-10-23:

```
ATRT or Medulloblastoma  ->  keep the real cns_diagnosis_category (unchanged)
anything else            ->  exactly ONE row, diagnosis_type_cohort = 'Not Applicable'
```

Three clarifications that are part of the decision, not inferences:

- `'Not Reported'` (4,586 patients — the single largest category) is **not** ATRT or
  Medulloblastoma, so it collapses to `'Not Applicable'` like everything else.
- The collapse is **one value per patient**. A patient carrying 2, 3 or 4 non-ATRT/MB
  categories still produces exactly one `'Not Applicable'` row. 467 of the 5,993
  newly admitted patients are in that position (443 with 2 categories, 23 with 3,
  1 with 4), so without the collapse they would duplicate across every grain.
- An ATRT/MB patient who **also** carries other categories keeps the ATRT/MB label
  and gets no `'Not Applicable'` row. 97 patients are in that position. This is
  already today's behaviour — the current cohort CTE drops their other categories —
  so the rule introduces no change for them.

### 1a. The one unresolved edge, and why it is left to fail loudly

"One value per patient" and "ATRT/MB stay as-is" conflict only for a patient
carrying **both** ATRT and Medulloblastoma. Measured 2026-10-23: **no such patient
exists** — all 995 ATRT/MB patients carry exactly one of the two. So both readings
build identically today.

The headers of `int_pcx_30_diagnosis_cohort.sql` (lines 14-16) and
`int_pcx_30_cohort_roster.sql` (lines 12-16) both describe that dual-diagnosis
fan-out as live. It is **theoretical, not realised**.

Upstream *does* re-curate `cns_diagnosis_category` — on the 2026-10-19 refresh
three patients left the cohort that way — so a future refresh could create one.
The decision is to let the `unique` test (§4 step 7) FAIL rather than pick a
silent winner: a build that blocks surfaces a genuine conflict against the stated
requirement, where a deterministic tie-break would publish a choice nobody made.
If that failure ever lands, the fix is a decision, not a retry.

### 1b. The cohort also requires `research_study_name = 'CBTN'` (added 2026-10-30)

Decided by the data owner 2026-10-30, after the condition below was measured.

`int_pcx_30_diagnosis_cohort` now requires `research_study_name = 'CBTN'` on every
arm — including the `not exists` probe in arm 2 — so the cohort chokepoint matches
the filter `pcx_30_event_level_deid` has always carried.

**What it fixes.** `pcx_30_event_level_deid` filters `research_study_name = 'CBTN'`
on every union arm, inherited verbatim from
`radiant-prod/tables/event_level_fields_openpedcan_prod.sql` (lines 277, 319, 498,
540), whose header records the cohort as profiled with that filter. The cohort model
did not carry it. Under `atrt_mb` the divergence is invisible; under `all_diagnosed`
it admitted 6 patients to the roster — and so to demographics — that every other
grain then dropped, because event_level feeds `int_pcx_30_initial_events`, which
anchors `is_initial_treatment` and `treatment_summary`.

Those 6 are the **`CHOP Fly RNASeq`** group (`participants.research_study_name`,
6 patients): `C3360729`, `C3361344`, `C3361467`, `C3361590`, `C3361713`, `C3361836`,
all at `CBTN Non-Consortium Member`. Each carries exactly one `diagnosis` row and it
is a placeholder — `event_type 'Unavailable'`, `cns_diagnosis_category 'Not
Reported'`, `diagnosis 'Other'`, `age_at_event_days 0`, `tumor_descriptor
'Unavailable'` — plus one `treatment` row and no `updates` row. They export with
`birth_year 1900`. They were the **entire** population the filter excludes: of 6,963
roster patients, exactly 6 had no CBTN-study diagnosis row.

**Measured on prod 2026-10-30, by executing the compiled model:**

| | rows here | subjects here | patients downstream |
|---|---|---|---|
| `atrt_mb` before | 995 | 995 | 970 |
| `atrt_mb` after | **970** | **970** | **970** |
| `all_diagnosed` before | 12,517 | 12,517 | 6,963 |
| `all_diagnosed` after | **6,957** | **6,957** | **6,957** |

- **The curated release publishes identically.** All 25 subjects dropped from the
  `atrt_mb` arm are absent from `stg_cbtn_enrollment_final`, and all three consumers
  (`int_pcx_30_cohort_roster`, `pcx_30_demographics_deid`,
  `v_pcx_30_demographics_combined`) inner-join this model. Curated patients lost: 0.
- **No label flips.** The ATRT/MB grain is one category per subject before and after
  (995 pairs / 995 subjects → 970 / 970), so no subject keeps one category while
  losing another. §1a's dual-diagnosis edge is unaffected.
- **Set difference against the live `_all_cbtn` roster is exactly those 6 leaving and
  0 entering** — verified row by row, not by count, per §6 item 17.
- The arm-2 `not exists` probe is filtered too. Unprobed, a subject admitted on a
  CBTN-study row whose ATRT/MB label existed only under another study would be
  dropped by arm 1 and excluded by arm 2 — vanishing entirely. Measured: **0**
  subjects are in that position, so it is defence against a future load.

**What this does NOT resolve.** 31 subjects carry an ATRT/MB diagnosis under a
non-CBTN study (Penn NTTB 12, PNOC027 11, DGD 8). 6 of them are in the curated
roster and all 6 *also* carry CBTN-study ATRT/MB rows, which is why the curated
count does not move. An upstream study re-label is where the curated cohort would
shrink — re-measure there before blaming this filter.

It also narrows but does not close §9's open question 2 (patient-completeness):
demographics and event_level now agree at 6,957, while `patient_level` stays at
**6,932** — 31 patients still lack any vital-status row, which is a different cause
(§6d).

---

## 2. Measured blast radius (prod, 2026-10-23)

| grain | now | after | note |
|---|---|---|---|
| cohort patients | 970 | **6,963** | 7.2x; 5,993 newly admitted |
| `diagnosis` rows -> event_level input | 1,869 | 14,272 | source rows, pre-`select distinct` |
| `treatment` surgery='Yes' | 1,289 | 9,360 | same caveat |
| `treatment` chemotherapy='Yes' | 1,283 | 5,778 | same caveat |
| `treatment` radiation='Yes' | 786 | 3,301 | same caveat |
| `imaging_sessions` -> mri_images view | 9,085 | 47,167 | same caveat |
| roster rows | 970 | 6,963 | no MRN fan-out: one mrn per research_id in this set |

The right-hand treatment/diagnosis/imaging figures are **source** rows counted
before each model's `select distinct`, so the final table counts will land lower.
The order of magnitude is right; do not use them as the §7 baseline. Re-measure
after the first build and record the real numbers in §7 of `UPSTREAM_SOURCES.md`.

240 enrollment patients have **no** `diagnosis` row and stay excluded by the rule.

### Two shifts in the character of the release

- **`data_type_cohort` inverts.** 313 radiant / 657 cbtn-non-radiant today ->
  **2,735 / 4,228**. The release becomes majority non-RADIANT.
- **`address_postal_code` degrades.** It reads FHIR patient attributes only, with no
  `participants` fallback, and 3,571 of the 5,993 new patients have no FHIR row —
  they all publish `'XXXXX'`. Race / ethnicity / gender are fine (all 5,993 have a
  `participants` row, which is the coalesce fallback). Only 4 lack `dob`/`dob_year`.

### What does NOT break

- **No new unmatched organizations.** Every `organization_name` in the expanded
  cohort resolves to a code against the 44-row `pcx_30_organization_ref`
  (verified 2026-10-23, after CHLA / NYULH / Nicklaus were added). `NULL
  organization_code` should stay 0 across all 8 views — assert it (Phase 5).
- `Zurich Children's Hospital` stays out: its 4 enrollment patients have no
  `diagnosis` rows, so the expansion does not reintroduce the unmatched-name gap.
- The 4 `cbtn_clinical` views (CBC, both CSF, Lansky/Karnofsky) are **not**
  cohort-filtered — they already cover the whole CBTN population and are unaffected.

---

## 3. Why this is one model plus consequences

> **CORRECTED 2026-10-23 after building the `_all_cbtn` prototype (§6).** This
> section originally called `int_pcx_30_diagnosis_cohort` the SOLE chokepoint. That
> is **wrong**. A second, independent cohort filter is hard-coded into
> `pcx_30_event_level_deid.sql:172-174` (and duplicated in
> `v_pcx_30_event_level_combined.sql:187`), and it silently excludes most of the
> expanded cohort. Read §6 before planning the work — Phase 1 is no longer a
> one-file change.

`int_pcx_30_diagnosis_cohort.sql` is the **primary chokepoint**. It emits
`(subject, cns_diagnosis_category)` filtered to the two categories, and it is read by:

- `int_pcx_30_cohort_roster` — which 6 of the 7 `_deid` models and all 8 pcx_30
  combined views inner-join, and
- `pcx_30_demographics_deid` — which joins it **directly** rather than through the
  roster, deliberately (see its header, lines 8-15: it resolves the cohort via FHIR
  patient attributes rather than the MRN list, and the two predicates are not
  provably equivalent).

Widening that one `select` is necessary but **not sufficient** — see the §6b
blocker, where `pcx_30_event_level_deid` re-filters the cohort on its own.

**The combined views do NOT read the `_deid` tables.** They re-derive from
`treatment` / `diagnosis` / `imaging_sessions` joined to the roster (e.g.
`v_pcx_30_surgery_level_combined.sql:67-71`). So "update the tables and the views
follow" is false here — each view is an independent derivation and must be verified
per-row against its table. Shared `int_pcx_30_*` intermediates reduce this
duplication but do not eliminate it. This is the same class of trap that let the
event-level OpenPedCan upgrade sit in the table but not the view in October.

---

## 4. Steps

### Phase 1 — widen the cohort (2 files: the chokepoint AND the event_level filter)

1. Rewrite `models/pcx_30/int_pcx_30_diagnosis_cohort.sql` to implement §1: all
   `diagnosis.subject` values; real category for ATRT/MB; one collapsed
   `'Not Applicable'` row otherwise. Gate it on the scope var (§5a). Update the
   grain comment in the header and keep the disabled `coordinating_institution`
   filter — it is still the one-place switch if the cohort is ever narrowed to the
   three RADIANT sites. **DONE 2026-10-23**, var-gated and default-off.
1b. Resolve the §6b `event_level` blocker with the third union arm of §6d.
   **DONE in `pcx_30_event_level_deid.sql` 2026-10-23** (self-gating, verified inert
   under the default scope). **NOT DONE in
   `v_pcx_30_event_level_combined.sql:187`**, which still carries the arm-1 category
   filter with no arm 3 — so table and view would publish different populations.
   That port is required before any expanded build is published (§6g item 1).

### Phase 2 — audit every consumer for the two-value assumption

2. `int_pcx_30_cohort_roster.sql:12-16` — the grain comment understates the new
   fan-out shape; correct it.
3. `pcx_30_demographics_deid.sql:67` — joins the cohort independently; verify it
   inherits the collapse rather than re-fanning.
4. **`int_pcx_30_openpedcan_subtype` — highest-risk consumer.** Its NOS/NEC upgrade
   is medulloblastoma-specific with an allowlist. Confirm a newly admitted
   Ependymoma or Low-Grade Glioma patient cannot pick up a subtype upgrade or a
   `cns_integrated_diagnosis_source = 'OpenPedCan'` stamp. Note also that
   `openpedcan_histologies_annotated` has no loader and is stale
   (`UPSTREAM_SOURCES.md` §6 item 5), so the new population will be
   under-upgraded — degraded, not wrong.
5. `int_pcx_30_initial_events` and `int_pcx_30_vital_status_events` — the `-1`
   anchor guard and the sentinel handling were measured on 970 patients.
   Re-measure on 6,963. `age_at_surgery` carries **both** unknown conventions
   (string sentinels AND negatives — `pcx_30_surgery_level_deid.sql:17-25`) and the
   new population will expose more of both.

### Phase 3 — tests and docs (mandatory, not optional)

6. `_pcx_30__models.yml:23-31` — the `accepted_values` test on
   `diagnosis_type_cohort` is pinned to exactly the two categories and **will fail
   on the first expanded run**. Add `'Not Applicable'`. Extend it; do not remove
   it — it is the guard that catches a botched collapse.
7. **Add `unique` on `research_id` to `pcx_30_demographics_deid`.** The §1 rule has
   nothing enforcing it today. Demographics becomes exactly one row per patient
   (6,963 / 6,963), and the comment at `_pcx_30__models.yml:99-101` that declines
   this test — on the grounds that the `subj` CTE can admit a patient twice — is
   retired by the collapse. This test is also the §1a failure mode.
8. Re-check the existing `unique` tests on `research_id` for
   `pcx_30_patient_level_deid` and `pcx_30_treatment_summary_deid`.
9. Update the `diagnosis_type_cohort` description in `_pcx_30__models.yml` and in
   the `pcx_30_data_dictionary_src` seed to define `'Not Applicable'`. **No new
   columns**, so no new `view_data_dictionary_access_policy.csv` rows and no new
   dictionary rows — wording only, and `display_order` does not move.

### Phase 4 — build safely

10. **There is only one dbt target (`dev` -> prod `radiant_data_dev`).** Add a
    scratch-schema target or pass a schema override so the expanded cohort can be
    built and inspected without overwriting the live release. Building straight
    into prod is the default path and should be avoided for a 7x change.
11. Back up the 7 `_deid` tables plus `pcx_30_data_dictionary` as
    `*_bak_<YYYYMMDD>` before any prod rebuild.
12. `dbt build --select +pcx_30` — run **and** test, dependency-ordered. If any
    step falls back to hand-run SQL, the three §5 hazards in `UPSTREAM_SOURCES.md`
    apply again (non-atomic view drops; the `--`-comment-with-semicolon abort;
    `--skip-comments`).

### Phase 5 — verify before asking anyone to approve

13. Run `UPSTREAM_SOURCES.md` §7 checks (a)-(d), plus:
    - **per-row agreement between each `_deid` table and its base view**, both
      directions (§3: the views re-derive and can silently disagree)
    - every base view count == its `cbtn_tenant` count (masking only, no row
      filtering — a divergence is a defect signal)
    - `NULL organization_code` still 0 across all 8 pcx_30 combined views
    - the PHI masking sweep as a login holding **no** `pii_grant`. This matters
      more than before: 4,228 of the new patients are cbtn-non-radiant. §7 check
      (d) was last skipped because the running login held a grant — do not skip it
      again on this change.
14. Record the real post-build counts and re-baseline §4 and §7 of
    `UPSTREAM_SOURCES.md`.
15. Measure and record the new `is_initial_treatment` indeterminate rate. On the
    970-patient build, 36 of 133 `'no'` rows (27%) were an unavailable source read
    as a clinical negative. The new population is heavily `Not Reported` and
    largely non-RADIANT, so that proportion will rise. Publish the number rather
    than letting it drift silently into a release.

### >>> GOVERNANCE CHECKPOINT — see §5. Do not proceed past here unsigned. <<<

### Phase 6 — publish

16. Export the static CSVs: `export_deid_tables.py --archive` with the dbt venv
    python. The `--archive` run must happen so the **pre-change** release is
    recoverable. Match the existing dialect exactly: CRLF, `QUOTE_MINIMAL`, SQL
    NULL as an empty field, `order by 1..N`.
17. **Diff at row level, not by count.** A 970 -> 6,963 jump will mask any patient
    that *left*; a net delta cannot detect a departure
    (`UPSTREAM_SOURCES.md` §4).
18. Commit on a branch. Update this file's status header, `UPSTREAM_SOURCES.md`,
    and the operator notes that describe the cohort as ATRT/Medulloblastoma-only.

---

## 5. The governance checkpoint

This change takes a curated 970-patient de-identified release to ~7,000 and
re-publishes it as static CSVs consumed outside this repo. That is a scope
decision, not an engineering one, and it must not be reachable as a side effect of
a routine refresh.

It is placed **between Phase 5 and Phase 6** on purpose: approve a *measured
result*, not a plan. Phases 1-5 are reversible (scratch schema, backups, no
export). Phase 6 is the publication.

Three layers, because each catches a failure the others do not.

### 5a. A default-off scope var — stops an accident

Gate `int_pcx_30_diagnosis_cohort.sql` on a dbt var that defaults to today's cohort:

```sql
{% set scope = var('pcx_30_cohort_scope', 'atrt_mb') %}
```

- `atrt_mb` (default) reproduces the current 970-patient cohort byte-identically.
- `all_diagnosed` activates §1.

Expanding then requires an explicit
`dbt build --vars '{pcx_30_cohort_scope: all_diagnosed}'`.

**Why this layer exists:** `UPSTREAM_SOURCES.md` §5 instructs an operator to
"refresh all seven sources, then rebuild everything downstream." Without the var,
the next routine `dbt run` by anyone — for an unrelated source refresh — silently
publishes a 7x cohort. The var makes the expansion a deliberate act with its own
command line, recorded in shell history and in the run log.

This mirrors conventions already in use: `var('tenant_code', 'cbtn')` appears at 14
call sites in this project, and the wider repo's dark-deploy pattern is
build-the-machinery / validate / then flip the default. Flip the default to
`all_diagnosed` (or retire the var) only once the expanded cohort is the approved
steady state.

### 5b. A signed, dated record in this file — creates accountability

Fill this in before Phase 6. An unfilled row is a visible blocker, not a
forgotten sentence.

| field | value |
|---|---|
| Approved by (name, role) | _unsigned_ |
| Date approved | _unsigned_ |
| Patient count approved | _unsigned_ (expected ~6,963 — record the MEASURED count) |
| Cohort rule approved | §1 as written / amended (state how) |
| Static CSVs may be refreshed? | yes / no |
| Scope of use approved | _unsigned_ (demo payload / external hand-off / both) |
| Re-review trigger | _unsigned_ (e.g. next cohort-rule change, or a refresh moving the patient grain >5%) |

Record the **measured** count, not the expected one: approving "~7,000" and
shipping 8,400 after an upstream refresh is the failure this row prevents.

### 5c. A refusal in the export path — guards the irreversible step

Teach `export_deid_tables.py` to compare the live patient grain against a recorded
baseline and **refuse** to overwrite the demo CSVs when it moves beyond a threshold
(a few percent) unless `--approve-cohort-change` is passed.

**Why this layer exists:** the CSVs are the only step that leaves the warehouse.
They are hand-off payloads already parsed by demo consumers, and
`pcx30-deid-csv-export`'s standing lesson is that a net row delta hides cohort
departures. A 7x jump is exactly the event an operator should have to acknowledge
by name. It also keeps protecting the release *after* this change ships, against
the next unreviewed expansion.

Pair it with the `--archive` requirement in Phase 6 step 16 so the prior release is
always recoverable.

### Not recommended

- **A doc-only checkpoint.** Prose does not survive a hurried refresh.
- **A dbt test asserting a patient-count ceiling.** It would fail on legitimate
  organic growth and train people to ignore red builds.
- **Blocking Phases 1-5 on sign-off.** Reviewers should see verified numbers. Doing
  the engineering first costs nothing that a scratch schema does not already cover.

---

## 6. What the `_all_cbtn` prototype proved (2026-10-23)

A throwaway expanded-cohort build was made to measure the expansion before
committing to it: 11 tables suffixed `_all_cbtn` in `radiant_data_dev`, built from
dbt's own compiled SQL under `pcx_30_cohort_scope: all_diagnosed` with the
cohort-dependent refs mechanically rewritten. Live objects were untouched and
verified unchanged. **These tables are temporary — see §7.**

### 6a. The cohort rule works exactly as specified

| `diagnosis_type_cohort` | rows | patients |
|---|---|---|
| Not Applicable | 5,993 | 5,993 |
| Medulloblastoma | 792 | 792 |
| Atypical teratoid/rhabdoid tumor | 178 | 178 |
| **total** | **6,963** | **6,963** |

One row per patient, exactly as §1 requires. The 970 ATRT/MB patients are
unchanged, no ATRT/MB patient was mislabelled `'Not Applicable'` (0 of 970), and
the 467 multi-category patients each collapsed to a single row.

### 6b. THE BLOCKER: a second cohort filter outside the chokepoint

`pcx_30_event_level_deid.sql` filters `cns_diagnosis_category in ('Atypical
teratoid/rhabdoid tumor','Medulloblastoma')` **in its own WHERE clause** (line 173)
on the `Initial CNS Tumor` union arm. The non-initial arm (line 221) has no
category filter. So a `'Not Applicable'` patient is dropped by arm 1 on category
and by arm 2 on `event_type`, and a patient whose ONLY event is an initial
diagnosis disappears from `event_level` entirely.

Measured consequences:

| object | expected (full cohort) | actual | gap |
|---|---|---|---|
| demographics patients | 6,963 | 6,963 | — |
| event_level patients | 6,963 | **3,650** | 3,313 absent |
| patients with an `Initial CNS Tumor` row | 6,963 | **950** | the old cohort only |
| treatment_summary patients | 6,963 | **3,650** | derives from event_level |
| patient_level patients | 6,963 | **6,932** | 31 lack any vital-status row |
| surgery patients | — | 6,506 | |
| medical_therapy patients | — | 3,170 | |
| radiation patients | — | 2,565 | |

Of the 3,313 absent from event_level: **3,239 have only `Initial CNS Tumor` events**
(dropped by both arms), 6 have no CBTN study row, 68 need investigation.

**The release would not be patient-complete.** Today all three patient-grained
tables are 970. After expansion they are 6,963 / 6,932 / 3,650, so any consumer
joining them on `research_id` meets three different populations.

### 6c. `is_initial_treatment` becomes almost entirely indeterminate

| | `yes` | `no` |
|---|---|---|
| live surgery (970 patients) | 1,157 | 132 |
| `_all_cbtn` surgery (6,963 patients) | **1,157** | **8,169** |

The `yes` count is **identical**. Not one newly admitted patient's surgery is
classifiable as initial treatment, because without an `Initial CNS Tumor` event
there is no `age_at_initial_dx_days` anchor, the `between` yields NULL, and the
`case` falls to `'no'`.

So 8,037 of the 8,169 `'no'` values are "cannot tell" published as "not frontline"
— a **98% indeterminate rate** on that column for the new population, against the
27% measured on the curated build. Shipping this as-is would mean a release whose
`is_initial_treatment` column is false for almost every new patient.

### 6d. RESOLVED 2026-10-23 — a third union arm in `pcx_30_event_level_deid`

The data owner's instruction: do not erase the non-ATRT/MB patients' initial
diagnosis; take **the first initial-diagnosis row per patient** — for ATRT/MB that
is their first ATRT/MB diagnosis (arm 1, unchanged), for everyone else whatever
their first initial row is. Implemented as a third `union distinct` arm.

Two design points had to be settled, both load-bearing:

- **Scoped by PATIENT, not by row.** The predicate is
  `pt_roster.diagnosis_type_cohort = 'Not Applicable'`, not
  `cns_diagnosis_category not in (...)`. A row-level predicate would have given each
  of the 97 ATRT/MB patients who also carry other categories a SECOND
  `Initial CNS Tumor` event — one from arm 1 and one from arm 3. Verified after the
  rebuild: exactly 1 patient has two initial rows, and that is the pre-existing
  ATRT/MB patient with two integrated diagnoses in arm 1. Arm 3 added no duplicates.
- **One row per patient, not a collapse.** Arm 1 aggregates a patient's initial rows
  (`min` age, `group_concat` of specimens) because they are all the same ATRT/MB
  diagnosis. These patients' initial rows can carry DIFFERENT diagnoses (71 of the
  537 multi-row patients do), so collapsing would manufacture a diagnosis the
  registry never recorded. Arm 3 picks the single earliest row and publishes it
  verbatim, via `row_number()`.

Ordering carries two traps, both handled: `age_at_event_days = -1` is the
unknown-date sentinel rather than an early date, so -1 and NULL sort LAST (affects
4 patients who hold both a sentinel row and a real-age row; 56 patients have only
sentinel rows and still get their row with -1 preserved). And 56 patients have more
than one row at their earliest age — 14 with differing category, 24 with differing
integrated diagnosis — so the remaining sort keys are alphabetical purely to make
the choice deterministic across rebuilds. **They are not a clinical ranking.** If
which diagnosis wins matters for those 14, decide it explicitly.

**Self-gating.** Under the default `atrt_mb` scope the roster holds no
`'Not Applicable'` rows, so arm 3 matches nothing and emits zero rows. No Jinja
needed. Verified read-only against the live published table: zero differences on
every column not built by `group_concat` (see §6e for why that qualifier is needed),
in both directions.

#### Measured effect

| | before arm 3 | after arm 3 | live (970 cohort) |
|---|---|---|---|
| event_level rows | 7,439 | **13,275** | 1,869 |
| event_level patients | 3,650 | **6,957** of 6,963 | 970 |
| `Initial CNS Tumor` rows / patients | 951 / 950 | **6,787 / 6,786** | 951 / 950 |
| treatment_summary patients | 3,650 | **6,957** | 970 |
| surgery `is_initial_treatment` yes / no | 1,157 / 8,169 | **8,083 / 1,243** | 1,157 / 132 |

6,786 = 950 ATRT/MB + 5,836 others with an initial row, exactly as predicted. The
`is_initial_treatment` indeterminate rate falls from 98% of `'no'` to 13% of all
surgery rows — in line with the curated build's 10%, so the anchor is genuinely
restored rather than papered over.

Still not covered, and not fixable here: **6 patients** absent from event_level
(no CBTN `research_study_name` row at all), **157** with no `Initial CNS Tumor` row
anywhere in the registry, and **31** absent from patient_level (no vital-status
row). So demographics 6,963 / event_level 6,957 / patient_level 6,932 — much closer
to patient-complete, but still three populations. Decide whether that residual
needs disclosing in the release.

### 6e. NEW FINDING: `event_level` is not reproducible run-to-run

Discovered while trying to prove arm 3 inert. The **same** compiled SQL, against
**unchanged** sources, returned 0, then 2, then 1 differing rows across three
consecutive executions. Restricting the comparison to every column NOT built by
`group_concat` gives 0 differences in both directions — so no row ever appears or
disappears; only the ORDER of values INSIDE the concatenated strings moves.

Cause: `group_concat(distinct ... separator ';')` in arm 1 with no `order by`.
StarRocks does not guarantee ordering, and it varies with parallel execution.
Affects `metastasis_location`, `tumor_location_other` and their siblings. Observed
on `C725331` (`'Leptomeningeal;Spine;Brain;...'` vs `'Brain;Leptomeningeal;Spine;...'`)
and `C1248204`.

**Pre-existing — nothing to do with the expansion**, but it matters here for three
reasons:

1. A plain `dbt run` republishes different strings for a handful of rows with no
   source change, so "the table changed" is not evidence that anything changed.
2. The §4 Phase-5 per-row table-vs-view agreement check will produce false
   positives on these rows.
3. The static CSV export will diff dirty on them between refreshes even when the
   data is identical — which defeats the row-level diff that §4 Phase 6 step 17
   depends on to detect cohort departures.

Fix is cheap and worth doing before the expansion ships:
`group_concat(distinct x order by x separator ';')`, in both
`pcx_30_event_level_deid.sql` and `v_pcx_30_event_level_combined.sql`.

### 6f. NEW FINDING: OpenPedCan upgrades cross a category boundary

The expansion lets 4 patients whose CBTN `cns_diagnosis_category` is
`'Other CNS Embryonal tumors'` receive a **Medulloblastoma** integrated diagnosis
from OpenPedCan:

| research_id | event_type | category | assigned integrated diagnosis |
|---|---|---|---|
| C17589 | Initial CNS Tumor | Other CNS Embryonal tumors | Medulloblastoma, WNT-activated |
| C19803 | Initial CNS Tumor | Other CNS Embryonal tumors | Medulloblastoma, Group 4 |
| C530130 | Initial CNS Tumor | Other CNS Embryonal tumors | Medulloblastoma, Group 4 |
| C49323 | Recurrence | Other CNS Embryonal tumors | Medulloblastoma, Group 3 |

The curated cohort's upgrades are untouched: Medulloblastoma 191 + ATRT 52 = 243,
exactly the live table's count. These 4 are additional.

Arm 3 contributed 3 of them; the `Recurrence` row already arrived through arm 2, so
the pattern is a consequence of admitting non-ATRT/MB patients at all, not of arm 3.

The `%NOS or NEC%` branch of the upgrade checks only that the CBTN integrated
diagnosis is unspecified and that OpenPedCan has an allowlisted value — it does NOT
check that the CBTN *category* is medulloblastoma. (The narrower `opc_mb_group`
branch was built precisely to stop a contradicting value winning, but it guards only
the `non-WNT/non-SHH` case.) The result is a row whose category and integrated
diagnosis disagree, on a patient simultaneously labelled
`diagnosis_type_cohort = 'Not Applicable'`.

Three ways to go, and it is a clinical call, not a mechanical one:

1. **Accept it** — OpenPedCan genuinely refines an under-specified registry call.
   Then consider whether those patients should still be `'Not Applicable'`.
2. **Restrict the `%NOS or NEC%` branch** to the medulloblastoma / ATRT categories,
   so a non-MB category can never receive an MB subtype. Smallest blast radius.
3. **Let it through but reclassify** the affected patients' cohort label.

4 patients either way — worth an explicit decision, not worth blocking on.

### 6g. What remains before the expansion is publishable

The §6b blocker is closed by §6d. Three items are still open, none of them a
blocker on their own:

1. **`v_pcx_30_event_level_combined.sql:187` carries the same arm-1 category filter
   and has NOT been given arm 3.** Until it does, the table and the view publish
   different populations — the exact divergence §3 warns about. This is the one
   item that must be done before any expanded build is published.
2. **The §6e `group_concat` ordering fix**, so the release is reproducible and the
   row-level CSV diff in Phase 6 step 17 can be trusted.
3. **The §6f cross-category OpenPedCan decision** (4 patients).

Still worth doing independently of the expansion: **publish
`is_initial_treatment` as NULL rather than `'no'`** when the initial-diagnosis
anchor is missing, so an unavailable source stops masquerading as a clinical
negative. §6d cut this population from 8,037 rows to roughly 1,243, but the
pre-existing 27%-of-`'no'` indeterminate case on the curated build is unchanged.

---

## 7. The temporary `_all_cbtn` tables

Built 2026-10-23 in `radiant_data_dev` by `build_all_cbtn_preview.py` (in this
directory; read its docstring before running). **Not dbt-managed, not documented in
the data dictionary, and not a deliverable** — they exist so §6 could be measured.
Rebuild them from the dbt models rather than promoting them.

To regenerate from scratch:

```bash
cd starrocks-dbt/starrocks_radiant
../.starrocks-dbt/bin/dbt compile --select +tag:deid \
    --vars '{pcx_30_cohort_scope: all_diagnosed}'
cd ../..
starrocks-dbt/.starrocks-dbt/bin/python3 build_all_cbtn_preview.py --dry-run
starrocks-dbt/.starrocks-dbt/bin/python3 build_all_cbtn_preview.py
```

7 release tables, deliberately suffixed `_deid_all_cbtn` so they do NOT match the
`like 'pcx_30%_deid'` pattern that `UPSTREAM_SOURCES.md` §7 check (a) uses — a
`_all_cbtn_deid` name would have made that check report every column as
undocumented:

Counts below are the **post-arm-3 rebuild** of 2026-10-23 (the first build, before
arm 3, gave event_level 7,439 and treatment_summary 3,650 — see §6d):

```
pcx_30_demographics_deid_all_cbtn          6,963   (6,963 patients)
pcx_30_event_level_deid_all_cbtn          13,275   (6,957 patients)
pcx_30_patient_level_deid_all_cbtn         6,932   (6,932 patients)
pcx_30_surgery_level_deid_all_cbtn         9,326   (6,506 patients)
pcx_30_radiation_level_deid_all_cbtn       3,279   (2,565 patients)
pcx_30_medical_therapy_level_deid_all_cbtn 5,676   (3,170 patients)
pcx_30_treatment_summary_deid_all_cbtn     6,957   (6,957 patients)
```

They were built from `pcx_30_event_level_deid.sql` WITH arm 3 but against the
UNPORTED combined view, so they are not a preview of the published view layer.

4 scaffolding intermediates, needed because they are cohort-dependent:

```
int_pcx_30_diagnosis_cohort_all_cbtn      12,517
int_pcx_30_cohort_roster_all_cbtn          6,963
int_pcx_30_initial_events_all_cbtn         3,650
int_pcx_30_vital_status_events_all_cbtn    8,339
```

`radiant_patient_mrn_list`, `int_pcx_30_fhir_patient_attributes` and
`int_pcx_30_openpedcan_subtype` are cohort-independent and were read live, not
copied.

### Static CSVs of the preview build

Exported 2026-10-23 to a dedicated directory, NOT the release directory:

```
~/Documents/Radiant/demos/Nov 2026/prelim_30_all_cbtn_preview/
    pcx_30_demographics_deid_all_cbtn.csv           6,963 rows / 11 cols
    pcx_30_event_level_deid_all_cbtn.csv           13,275 rows / 12 cols
    pcx_30_medical_therapy_level_deid_all_cbtn.csv  5,676 rows / 10 cols
    pcx_30_patient_level_deid_all_cbtn.csv          6,932 rows /  3 cols
    pcx_30_radiation_level_deid_all_cbtn.csv        3,279 rows / 13 cols
    pcx_30_surgery_level_deid_all_cbtn.csv          9,326 rows /  5 cols
    pcx_30_treatment_summary_deid_all_cbtn.csv      6,957 rows / 13 cols
```

A `data_dictionary.csv` sits alongside them, matching the release copy's dialect
(LF, not CRLF — the release dictionary is LF and `export_deid_tables.py` never
writes it) and its 3-column `table,field,description` shape. All 74 field
descriptions are byte-identical to the release copy, verified row by row; the live
`pcx_30_data_dictionary` table was confirmed to agree with the release CSV in full
before copying.

**One column was retargeted on purpose.** The first column is a *filename*
(`source_file`), not a table name, so the release copy points at
`pcx_30_demographics_deid.csv` etc. In the preview copy those 74 values carry the
`_all_cbtn` suffix, so the dictionary describes the files actually in this
directory. Nothing else was changed, and the retarget is safe because the preview
tables have **identical column sets and order** to their release counterparts
(verified at export). For a verbatim copy instead, just `cp` the release file.

**The `diagnosis_type_cohort` description is now understated.** It reads "The
patient's primary diagnosis group used to define the cohort for this release" and
does not mention `'Not Applicable'`. Correcting it is Phase 3 step 9 and requires
editing the `pcx_30_data_dictionary_src` seed, so it was deliberately NOT patched
here — a hand-edited dictionary copy would drift from its seed.

The 7 table CSVs were written by `export_deid_tables.py --allow-unpinned
--out-dir ...`, so they carry the
same byte-exact dialect as the release files (CRLF, QUOTE_MINIMAL, SQL NULL as an
empty field, `ordinal_position` header order, `order by 1..N`). Verified: CRLF
throughout with no stray LF, row counts equal to the tables, headers identical to
their release counterparts, no literal `'NULL'` strings.

`--allow-unpinned` was added for this export because `EXPECTED` is deliberately
pinned to the 7 release tables so that a surprise 8th is a visible mismatch rather
than a silent extra file. The flag preserves that default and additionally
**refuses to write into the release directory**, so a preview payload cannot be
mistaken for — or overwrite — a release one.

**These CSVs are NOT a release.** They sit outside `prelim_30_deid_tables/` on
purpose: per §5c the CSV export is the publication step, and this cohort has not
passed the §5b checkpoint. They also predate the §6g fixes — the combined view is
unported, `group_concat` ordering is still nondeterministic (§6e), and the §6f
OpenPedCan question is open.

Drop all 11 tables when done:

```sql
drop table if exists radiant_data_dev.pcx_30_treatment_summary_deid_all_cbtn;
drop table if exists radiant_data_dev.pcx_30_patient_level_deid_all_cbtn;
drop table if exists radiant_data_dev.pcx_30_medical_therapy_level_deid_all_cbtn;
drop table if exists radiant_data_dev.pcx_30_radiation_level_deid_all_cbtn;
drop table if exists radiant_data_dev.pcx_30_surgery_level_deid_all_cbtn;
drop table if exists radiant_data_dev.pcx_30_demographics_deid_all_cbtn;
drop table if exists radiant_data_dev.pcx_30_event_level_deid_all_cbtn;
drop table if exists radiant_data_dev.int_pcx_30_vital_status_events_all_cbtn;
drop table if exists radiant_data_dev.int_pcx_30_initial_events_all_cbtn;
drop table if exists radiant_data_dev.int_pcx_30_cohort_roster_all_cbtn;
drop table if exists radiant_data_dev.int_pcx_30_diagnosis_cohort_all_cbtn;
```

---

## 8. Status

**NOT EXECUTED** as of 2026-10-23. Prod still carries the 970-patient
ATRT/Medulloblastoma cohort as its published release. No test, seed or CSV has been
changed, and no live table or view has been rebuilt.

Three things HAVE landed, all deliberately inert under the default scope:

- `int_pcx_30_diagnosis_cohort.sql` carries the `pcx_30_cohort_scope` var (§5a),
  defaulting to `atrt_mb`. Verified by compiling both arms: the default renders the
  pre-var SQL exactly, so a plain `dbt run` is byte-identical to before.
- `pcx_30_event_level_deid.sql` carries the third union arm (§6d). Self-gating on
  `diagnosis_type_cohort = 'Not Applicable'`, which the default scope never
  produces. Verified read-only against the live published table: zero differences
  on every column not built by `group_concat`, both directions (§6e explains why
  that qualifier is needed).
- The 11 temporary `_all_cbtn` tables of §7 exist in `radiant_data_dev`. They are
  measurement scaffolding, not a release.

Decisions settled 2026-10-23: the cohort rule (§1), the collapse granularity, the
treatment of ATRT/MB patients, the §1a fail-loud posture, and the §6d
first-initial-diagnosis rule for the non-ATRT/MB cohort.

Open, in rough priority order:

1. **Port arm 3 to `v_pcx_30_event_level_combined.sql`** (§6g item 1) — mechanical,
   but required before an expanded build can be published, or the table and the
   view publish different populations.
2. **The §6e `group_concat` ordering fix** — pre-existing, cheap, and until it is
   done the row-level CSV diff that Phase 6 step 17 depends on cannot be trusted.
3. **The §6f cross-category OpenPedCan question** — 4 patients, a clinical call.
4. **The §6d tie-break** for the 14 patients whose earliest initial row is
   ambiguous on category — currently alphabetical, for determinism only.
5. **The §5b governance sign-off.**

---

## 9. Evaluation hand-off

Written 2026-10-23 for an external team reviewing whether this approach should be
adopted. The question is **not** "is the SQL correct" — it is **"is this the right
way to widen the release, and is the resulting data fit to publish?"**

### What exists to look at

| artefact | where |
|---|---|
| 7 preview release tables + 4 intermediates | `radiant_data_dev.*_all_cbtn` (§7) |
| 7 preview CSVs + a matching data dictionary | `~/Documents/Radiant/demos/Nov 2026/prelim_30_all_cbtn_preview/` (§7) |
| the cohort rule | §1, implemented in `int_pcx_30_diagnosis_cohort.sql` |
| the `event_level` third arm | §6d, implemented in `pcx_30_event_level_deid.sql` |
| the prototype build script | `build_all_cbtn_preview.py` |
| measured effects | §2 (blast radius), §6 (what the prototype proved) |

Nothing in the published release changed. Every repo change is inert under the
default `pcx_30_cohort_scope` ('atrt_mb'), verified by compiling both arms and by
row-level comparison against the live table.

### The five questions worth an outside opinion

1. **Is `'Not Applicable'` the right label?** It collapses 12 real registry
   categories — including `'Not Reported'` (4,586 patients), `'Low-Grade Glioma'`
   (1,920) and `'High-Grade Glioma'` (1,265) — into one value. The alternative is
   publishing the real `cns_diagnosis_category`. This was a deliberate owner
   decision (§1), not a technical constraint, and it is the single most
   consequential choice here.
2. **Is a release that is not patient-complete acceptable?** demographics 6,963 /
   event_level 6,957 / patient_level 6,932 (§6d). Today all three are 970. A
   consumer joining them on `research_id` meets three populations. The residual is
   small and explained, but it is a change in kind.
3. **Does `is_initial_treatment` mean what consumers think it means?** 1,243 of
   9,326 surgery rows are `'no'`, and a share of those is "cannot tell" rather than
   "not frontline" (§6c, §6g). The expansion improved this enormously — 8,169 →
   1,243 — but did not fix the underlying conflation, which predates it.
4. **The §6f cross-category OpenPedCan upgrade** — 4 patients whose CBTN category
   is `'Other CNS Embryonal tumors'` receive a Medulloblastoma integrated
   diagnosis. Clinically right or wrong? Small, but it is a reclassification.
5. **The §6d tie-break** — 14 patients whose earliest initial-diagnosis row is
   ambiguous on category, currently resolved alphabetically purely for
   determinism. Does that need a clinical rule?

### Known-open, and NOT to be read as oversights

All are recorded with their reasoning; none is a surprise:

- `v_pcx_30_event_level_combined.sql` has not received the third arm, so the view
  layer still publishes the 970 cohort (§6g item 1). **The preview CSVs therefore
  reflect the TABLE layer only** — they are not a preview of the views.
- `group_concat` in `event_level` is order-nondeterministic, pre-existing and
  independent of this work (§6e). It makes a handful of rows diff dirty between
  identical rebuilds.
- The `diagnosis_type_cohort` dictionary description does not yet mention
  `'Not Applicable'`. Deliberately not patched: it is seeded, and hand-editing the
  copy would drift from the seed. Owner deferred this 2026-10-23.
- `openpedcan_histologies_annotated` is stale (no loader —
  `UPSTREAM_SOURCES.md` §6 item 5), so newly admitted patients are
  under-upgraded. Degraded, not wrong.
- The §5 governance checkpoint is unsigned, by design. The CSV export is the
  publication step and this cohort has not been approved for it.

### If the approach is accepted

Route to production is §4, with §6g finished first. The prototype tables are NOT
promotable — rebuild from the dbt models with
`dbt build --vars '{pcx_30_cohort_scope: all_diagnosed}'`, then re-run §4 Phase 5
verification and re-export the CSVs into the real release directory through the
§5 checkpoint.

### If it is rejected

Drop the 11 tables (§7), delete the preview directory, and revert the four repo
files. Nothing else has to be undone, because nothing else was changed.
