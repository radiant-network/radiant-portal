# pcx_30 upstream sources and refresh procedure

How the five source tables in `radiant_data_dev` get there, what contract they
satisfy, and what a refresh has to do. Written 2026-10-01; every number in here was
measured against live prod on that date and is labelled with its measurement, so a
later reader can re-measure rather than trust it.

**Updated 2026-10-02:** all six sources were refreshed to the 2026-10-01 vintage and
the loader now exists (`../load_upstream_tables.py`). Two claims in the 10-01 draft were
wrong and are corrected below: the `radiant_patient_mrn_list` generating script is *not*
unrecoverable (§3a), and the enrollment↔MRN-list join *is* raw equality (§1, §3a). The
stages 2–8 downstream rebuild then ran to completion the same day — all 13 `pcx_30_*`
tables, 12 `radiant_data_dev` views, 12 `cbtn_tenant` guarded views and the data
dictionary are current, and §7's four verification queries pass. The §7 reference row
counts are re-based below. A third script hazard was found and is documented in §5.

Everything downstream — 7 `pcx_30_*_deid` release tables, their identified twins,
12 `radiant_data_dev` combined views, 12 `cbtn_tenant` guarded views, and the data
dictionary — is derived from these six tables. Nothing else is an input.

---

## 1. The six source tables

Five are loaded from two external warehouses. The sixth is built inside StarRocks
from the FHIR Iceberg catalog by a SQL script — a different mechanism entirely.

| table | source | schema | engine | cols | PHI | downstream pcx_30 SQL files |
|---|---|---|---|---|---|---|
| `stg_cbtn_enrollment_final` | **identified** DWH | `stg_cbtn` | PostgreSQL 16.13 | 15 | **YES** | **17** |
| `radiant_patient_mrn_list` | FHIR Iceberg catalog (in-StarRocks CTAS) | `fhir_cbtn_tenant_db` | StarRocks external catalog | 3 | **YES** (`mrn`) | 16 |
| `diagnosis` | de-identified DWH | `prod_access` | PostgreSQL 16.11 | 65 | no | 13 |
| `treatment` | de-identified DWH | `prod_access` | PostgreSQL 16.11 | 36 | no | 6 |
| `participants` | de-identified DWH | `prod_access` | PostgreSQL 16.11 | 21 | no | 2 |
| `updates` | de-identified DWH | `prod_access` | PostgreSQL 16.11 | 12 | no | 2 |

The identified warehouse also holds `stg_cbtn.stg_cbtn_enrollment` — same row count
as `_final` (7,202 on 2026-10-01). **Use `_final`.** The non-final sibling is not the
pcx_30 input; nothing downstream references it.

### PHI boundary

**Two** of the six cross it. `stg_cbtn_enrollment_final` carries `first_name`,
`last_name`, `mrn`, `dob`, `subject_consent_date`; `radiant_patient_mrn_list` carries
`mrn` (2,804 rows on 2026-10-02, one MRN per FHIR patient id). The four de-identified
warehouse tables do not: `participants` carries `dob_year`, never `dob`.

This matters because it is the *only* reason `radiant_data_dev` is a PHI-bearing
schema, which is in turn why `cbtn_tenant` exposes nothing but grant-guarded views.
Automating the de-identified four needs no PHI handling; automating the fifth does.

The two warehouses use **separate credentials in separate files**, deliberately, so a
job that only needs de-identified data cannot accidentally hold an identified
connection. Do not merge them.

### Identifier families

Three, and they do not share a key space. Any automation that treats these five as
one homogeneous batch will get the joins wrong.

| family | columns | tables |
|---|---|---|
| REDCap longitudinal | `subject`, `redcap_record_id`, `event_id`, `redcap_event_name` | `diagnosis`, `treatment`, `updates` |
| registry / warehouse | `unique_participant_key`, `research_id`, `kids_first_participant_id`, `bp_number`, `family_id` | `participants` |
| identity bridge | `ehb_protocol_code`, `redcap_subject_record_id`, `research_id`, `mrn` | `stg_cbtn_enrollment_final` |

The join the downstream SQL actually relies on:

```
diagnosis.subject  = stg_cbtn_enrollment_final.research_id
treatment.subject  = stg_cbtn_enrollment_final.research_id
updates.subject    = stg_cbtn_enrollment_final.research_id
participants.research_id = stg_cbtn_enrollment_final.research_id
stg_cbtn_enrollment_final.mrn = radiant_patient_mrn_list.mrn
```

That last join **is** raw equality — corrected 2026-10-02. The 10-01 draft claimed it
matched zero rows without leading-zero stripping; it does not. Measured on the refreshed
tables, raw `=` matches **2,731** rows, and zero-stripped equality matches the same 2,731.
Both sides carry leading zeros (392 of 2,804 and 469 of 7,202), but they carry them
*consistently*, because `radiant_patient_mrn_list.mrn` is populated from the same
identifier space the enrollment table draws on — §3a's own CTAS joins the two on raw
equality to derive `research_id`.

The zero-pad trap is real but belongs to a **different** join: pcx_30 MRN against the
**portal** surrogate key `radiant_jdbc.public.patient`, where the portal zero-pads to a
fixed width and pcx_30 does not, so a raw `=` matches nothing and both sides must be
stripped. That join lives in the access-controlled views, not here — see the
`radiant_patient_id` note in `access_controlled_views/*.sql.tmpl`. Do not apply its
stripping rule to the enrollment↔MRN-list join above; it is unnecessary there.

---

## 2. Credentials

Never in this repo, never pasted into a chat transcript. They live in `~/.radiant/`
(mode `700`, outside any git repo), written by a helper that prompts without echo:

```bash
bash ~/.radiant/set-dwh-creds.sh --profile deid         # -> ~/.radiant/dwh-prod-access.env
bash ~/.radiant/set-dwh-creds.sh --profile identified   # -> ~/.radiant/dwh-identified.env
```

| profile | env file | var prefix | schema |
|---|---|---|---|
| `deid` | `~/.radiant/dwh-prod-access.env` | `DWH_*` | `prod_access` |
| `identified` | `~/.radiant/dwh-identified.env` | `DWH_ID_*` | `stg_cbtn` |

Both files are mode `600` and carry `ENGINE HOST PORT DATABASE SCHEMA USER PASSWORD`.
Must be run in a real terminal — a no-echo prompt cannot read from Claude Code's `!`
prefix, though `! bash ~/.radiant/set-dwh-creds.sh --profile deid` works because that
runs in your shell.

Hostnames are deliberately **not** recorded in this file. Read them from the env file;
this document is version-controlled and internal hostnames should not be.

StarRocks prod credentials are the existing `~/.radiant/starrocks-prod.env`.

Connect to the de-identified warehouse:

```bash
set -a && . ~/.radiant/dwh-prod-access.env && set +a && export PGPASSWORD="$DWH_PASSWORD"
psql -h "$DWH_HOST" -p "$DWH_PORT" -U "$DWH_USER" -d "$DWH_DATABASE"
```

---

## 3. The load contract: strict, verbatim, type-faithful

The load is a **strict export and import** — no renames, no filters, no reordering.
Column names and order are verbatim for **all five** warehouse tables (134/134 on the
de-identified four, 15/15 on the identified one, matched by
`(ordinal_position, column_name)` with zero differences). Types are faithful on the
de-identified four but **not** on the identified one — see the exception below.

Verified 2026-10-01 across all four de-identified tables:

- **Column names identical**, including order: 134/134 columns matched by
  `(ordinal_position, column_name)` with zero differences.
- **Column counts identical**: 65 / 36 / 21 / 12.
- **Types map 1:1** with no information loss:

  | PostgreSQL source | count | StarRocks | count |
  |---|---|---|---|
  | `text` + `character varying` | 73 + 55 = 128 | `varchar` | 128 |
  | `integer` | 3 | `int` | 3 |
  | `boolean` | 2 | `tinyint` | 2 |
  | `double precision` | 1 | `float` | 1 |

### Exception: `stg_cbtn_enrollment_final` is type-FLATTENED

All 15 columns arrive in StarRocks as `varchar`, but 4 are typed in the source. Column
names and order still match exactly; only the types differ:

| column | source type | StarRocks type | used downstream? |
|---|---|---|---|
| `ehb_protocol_code` | `integer` | `varchar` | no — 0 files |
| `dob_year` | `numeric` | `varchar` | **yes — 4 files** |
| `age_at_consent_days` | `integer` | `varchar` | no — 0 files |
| `consent_fiscal_year` | `numeric` | `varchar` | no — 0 files |

Harmless today: three of the four are unreferenced, and `dob_year` is consumed as a
display string (demographics `birth_year`), not compared numerically. But it means the
load is **not uniform across the five tables**, so a generic "copy with source types"
job would silently *change* these four columns' types. If that is the automation you
build, either accept the change deliberately and re-verify the 4 `dob_year` consumers,
or pin these columns to `varchar` to preserve current behaviour. Do not let it happen
by accident.

### Do not "improve" the typing

Nearly every column is a string **in the source warehouse**, including every age and
every date. That is not an artefact of the load — it originates upstream.

The consequence is that ages and dates carry *sentinel strings*, and all ~30
downstream SQL files are written to expect them: every one wraps `cast(... as int)`
and tolerates a NULL result. Measured sentinels:

| column | sentinels present (2026-10-01) |
|---|---|
| `treatment.age_at_chemo_start` | `Not Available` (93), `Not Applicable` (38), `Not Reported` (14) |
| `treatment.age_at_radiation_start` | `Not Available` (403), `Not Reported` (104) |
| `treatment.age_at_radiation_stop` | `Not Available` (378), `Not Reported` (136) |
| `treatment.age_at_surgery` | `Not Reported` (9), NULL (2), **and `-1` (32 rows)** |
| `pcx_30_event_level_deid.age_at_event_days` | 11 string sentinels, **and `-1` (5 rows)** |

Two unknown conventions coexist: string sentinels, which `cast(... as int)` turns into
NULL, and the numeric `-1`, which **casts cleanly** and therefore silently behaves as a
real age unless explicitly guarded. A loader that inferred types would convert the
string sentinels to NULL or fail outright, and would not help with `-1` at all. Keep
the load verbatim and let the downstream SQL decide.

---

## 3a. `radiant_patient_mrn_list` — different mechanism

Not exported from a warehouse. It is a CTAS run **inside StarRocks** against the FHIR
Iceberg external catalog `radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient_identifier`,
selecting a per-institution identifier type:

| `org_short_code` | `identifier_type_text` | distinct patients (2026-10-01) |
|---|---|---|
| `chop` | `EPI` | 2,034 |
| `seattle` | `SCHMRN` | 470 |
| `ucsf` | `MRN` | 300 |

That mapping is **hardcoded three ways**, so onboarding a fourth institution requires
editing the script — it will not pick up a new site automatically.

### The generating script — recovered and committed 2026-10-02

**The 10-01 draft of this section was wrong.** It reported that the generator produced
only 2 columns, that the `research_id` derivation was "unrecorded", and that the table
therefore "cannot currently be rebuilt from the script without losing a column". That
analysis was of the wrong file. `prelim_30_sql/master_mrn_list.sql` is an earlier
2-column draft; the actual generator is
`prelim_30_sql/patient_mrn_list_radiant_prod.sql`, and it produces all three columns.

`research_id` comes from a LEFT JOIN to the enrollment table on raw MRN equality:

```sql
left join radiant_data_dev.stg_cbtn_enrollment_final enr on pi.identifier_value = enr.mrn
```

**This is why stage 1b must run AFTER stage 1.** The MRN list derives `research_id` from
`stg_cbtn_enrollment_final`, so rebuilding it against a stale enrollment table
under-populates the column silently. Running it in the correct order on 2026-10-02 took
`research_id` coverage from 2,677 real values to **2,728**.

The script is now committed, repaired, at
`radiant-prod/patient_mrn_list_prod.sql`. Two defects were fixed and the SELECT is
otherwise verbatim:

1. **Its first two lines were broken scratch** — a `create table ... ;` with no column
   list or `AS`, then an unterminated `drop table`. Running the file top-to-bottom errored
   before reaching the real statement. Removed. (The 10-01 note that these targeted
   `radiant_tests` was also wrong — both named `radiant_data_dev`.)
2. **No `drop table if exists` guard** on the `CREATE TABLE AS`, so a re-run against an
   existing table failed. Added.

What remains true: the three institution/identifier pairs are **hardcoded**, so a fourth
site needs a script edit. And `research_id` here is read by `brim/brim_demo_scripts.sql`,
not by any pcx_30 file — pcx_30 uses only `mrn` and `patient_id`.

### Rebuild it with a temp-table swap, not drop-then-CTAS

`drop table` followed by `CREATE TABLE AS` leaves this table **absent** if the Iceberg
read fails, and **16 downstream files** depend on it. The committed script carries the
`if exists` guard for re-runnability, but for a live refresh prefer the swap used on
2026-10-02: CTAS into `radiant_patient_mrn_list_new<stamp>`, verify, then two metadata
renames. The expensive, failure-prone Iceberg read then happens while the live table is
untouched, and the table is never absent except for the rename instant.

Verify before swapping — these are the checks that were run:

- row count, and `count(distinct patient_id) = count(*)` (the LEFT JOIN must not fan out;
  it cannot today because `mrn` is unique in the enrollment table, but check anyway)
- `0` rows in `old EXCEPT new` on `(patient_id, mrn)` — no patient silently dropped
- no **real** `research_id` replaced by a different real value

One trap in that last check: `research_id` carries **empty strings as well as NULLs**
(9 empty / 112 NULL before, 3 empty / 73 NULL after). A naive `o.research_id <>
n.research_id` test counts `'' → real value` as a regression when it is an improvement.
Compare against `is not null AND <> ''`.

---

## 4. Current state and how to check staleness

**All six sources were refreshed on 2026-10-02** to the 2026-10-01 extract vintage. Every
loaded count matched its extract exactly:

| table | was (09-14/21) | now | delta | loaded |
|---|---|---|---|---|
| `diagnosis` | 20,884 | **21,002** | +118 | 2026-10-01 17:15 |
| `updates` | 29,052 | **29,308** | +256 | 2026-10-01 17:14 |
| `participants` | 15,918 | **16,074** | +156 | 2026-10-02 09:22 |
| `treatment` | 42,238 | **42,745** | +507 | 2026-10-02 09:23 |
| `stg_cbtn_enrollment_final` | 7,157 | **7,202** | +45 | 2026-10-02 09:23 |
| `radiant_patient_mrn_list` | 2,798 | **2,804** | +6 | 2026-10-02 09:28 |

The six are now at one vintage. `radiant_patient_mrn_list` reconciles against the §3a
per-institution figures: 2,034 chop + 470 seattle + 300 ucsf = 2,804.

**Stages 2–8 then ran on 2026-10-02** (13 tables 09:49–09:53, then the 12 base views,
the 12 guarded views and the dictionary), putting everything downstream at one vintage.
The published cohort is no longer stale.

**Downstream is now split across two dates.** On **2026-10-05** four event-level objects
were rebuilt for the OpenPedCan diagnosis upgrade, so they are at that later vintage
while the other stages remain at 2026-10-02:
`pcx_30_event_level` + `_deid`, `radiant_data_dev.v_pcx_30_event_level_combined`,
`cbtn_tenant.v_pcx_30_event_level_combined`, and `pcx_30_data_dictionary`.
This is NOT upstream staleness — the six sources did not move, and the event-level row
count is unchanged at 1,856. What changed is the `cns_integrated_diagnosis` VALUE on 187
rows (an `%NOS or NEC%` value replaced by a more specific OpenPedCan molecular subtype)
plus one new column, `cns_integrated_diagnosis_source`, taking that table from 11 columns
to 12 and the dictionary from 73 rows to 74. Built by
`radiant-prod/event_level_fields_openpedcan_prod.sql`, which SUPERSEDES
`event_level_fields_prod.sql` (archived the same day — see §5 step 2).

The rebuilt object counts, for the §7 re-baseline:
`pcx_30_event_level` 1,856 · `pcx_30_demographics` / `patient_level` /
`treatment_summary_deid` 966 each · `pcx_30_surgery_level` 1,285 ·
`pcx_30_medical_therapy_level` 1,267 · `pcx_30_radiation_level` 776 ·
`pcx_30_data_dictionary` 74 (was 73 before the 2026-10-05 upgrade).

`pcx_30_medical_therapy_level` did NOT move (1,267 before and after) even though
`treatment` gained 507 rows and the other two treatment tables grew. It genuinely
rebuilt — new `update_time`, `_deid` twin agreeing, §7 check (c) passing, and the
`is_initial_treatment` split did shift (732/535 → 736/531) — so new source rows were
read; `select distinct` over a narrower column projection collapses them. Do not read
the flat count as a failed build.

Two measurement traps when re-checking:

- `information_schema.tables.table_rows` is a **cached statistic** that lags a load — it
  read `0` for all three tables immediately after a verified successful load. Use
  `count(*)`, not `table_rows`.
- `update_time` reflects the last write, so it moves on a *failed partial* load too. It
  proves recency, not correctness; pair it with a count.

### Loads are not atomic — this is the main correctness risk

Before the 10-02 refresh those `update_time` values spanned **four different days**
(09-14 to 09-21). Every pcx_30 table joins
across these sources, so a partial refresh silently produces a cohort assembled from
mixed vintages: a patient present in a fresh `diagnosis` but absent from a stale
`stg_cbtn_enrollment_final` is dropped by the `inner join` in `pt_roster` without any
error. Automation should refresh **all six, then rebuild everything downstream**, and
record one timestamp for the batch.

This is not hypothetical. On 2026-10-01 a subset load left `diagnosis` and `updates` at
the 10-01 vintage while the other four stayed at 09-15 — exactly the mixed-vintage state
described above — and it persisted until the 10-02 refresh closed it. `load_upstream_tables.py`
prints a subset warning for this reason, but the warning is advisory and does not block.

Staleness check — run before and after any refresh:

```sql
-- source (psql, de-identified warehouse)
select 'participants' t, count(*) from prod_access.participants union all
select 'diagnosis',      count(*) from prod_access.diagnosis    union all
select 'treatment',      count(*) from prod_access.treatment    union all
select 'updates',        count(*) from prod_access.updates order by 1;
```

```sql
-- StarRocks: counts plus per-table load time
select table_name, update_time from information_schema.tables
where table_schema='radiant_data_dev'
  and table_name in ('participants','diagnosis','treatment','updates','stg_cbtn_enrollment_final')
order by update_time;
```

---

## 5. Refresh procedure

Stage 1 is scripted as of 2026-10-02 — `../load_upstream_tables.py` does the strict
export of all five warehouse tables and the import into StarRocks **over port 80**:

```bash
# preflight every table against its live schema, write nothing
python3 load_upstream_tables.py --load --dry-run

# extract fresh from both warehouses, then load all five
python3 load_upstream_tables.py --extract --load

# load extracts of a known vintage (stamp = extract date, not today)
python3 load_upstream_tables.py --load --stamp 20261001
```

Read its module docstring before use; it records why port 80, why `\N` is the NULL marker,
and why it preflights every table before truncating any. **It is not a dry run by
default** — `--load` without `--dry-run` truncates and loads immediately.

Stages 1b and 2–8 are still run by hand, statement by statement.

### Why port 80 and not Stream Load

On the prod CelerData cluster, **FE 8030 and BE 8040 are filtered**, so Stream Load is
unavailable. Bulk loading must go over the port-80 MySQL protocol as batched `INSERT`,
or via an S3 broker load. This is the opposite of QA, where Stream Load tunnels exist —
do not copy a QA loader and expect it to work here. See `~/.radiant/starrocks-prod.env`
notes and the Stream Load section of the root `CLAUDE.md`.

### Required order

Each stage depends on every stage above it. Steps 2+ are all in this directory.

| # | stage | objects |
|---|---|---|
| 1 | **load the 5 warehouse sources** | `participants`, `diagnosis`, `treatment`, `updates`, `stg_cbtn_enrollment_final` — `../load_upstream_tables.py` |
| 1b | **rebuild the Iceberg-derived source** | `radiant_patient_mrn_list` — `radiant-prod/patient_mrn_list_prod.sql` (see §3a: run the temp-swap, not the bare script) |
| 2 | event level | `event_level_fields_openpedcan_prod.sql` → `pcx_30_event_level` + `_deid` (supersedes `event_level_fields_prod.sql`, archived 2026-10-05; it builds the same two tables but without the OpenPedCan NOS/NEC diagnosis upgrade, so running it would revert 187 rows and drop `cns_integrated_diagnosis_source`) |
| 3 | demographics / patient level | `demographics_prod.sql`, `patient_level_prod.sql` |
| 4 | treatment tables | `chemotherapy_fields_prod.sql`, `surgery_level_fields_prod.sql`, `radiation_level_fields_prod.sql` |
| 5 | treatment summary | `treatment_summary_fields.sql` |
| 6 | combined views | `radiant-prod/combined_views/*.sql` |
| 7 | guarded views | `access_controlled_views/*.sql` (render the `.sql.tmpl` first) |
| 8 | data dictionary | `data_dictionary/data_dictionary_table.sql` |

Step 1 must precede step 1b: `radiant_patient_mrn_list` derives `research_id` by LEFT
JOINing `stg_cbtn_enrollment_final`, so building it first under-populates that column
silently (§3a).
Step 2 must precede step 4: the `is_initial_treatment` flag on the three treatment
tables reads `pcx_30_event_level_deid` for its diagnosis and first-event anchors.
Step 4 must precede step 5: `treatment_summary` derives its `had_initial_*` flags from
the `is_initial_treatment` column those tables produce.

### Three hazards in the scripts themselves

1. **The view scripts are not atomic.** Each begins `drop view if exists`, so a failed
   re-run leaves the view **missing** rather than falling back to its old definition.
   Dependent `cbtn_tenant` views break until the base view is recreated.
2. **Never run `combined_views_cbtn_tenant/*.sql`.** Those files create the same
   `cbtn_tenant` view names as `access_controlled_views/` but with **no `can_read_phi`
   gate and no `pii_grant` join** — they project `mrn` and calendar dates to every
   caller. Whichever ran last wins. They are superseded; delete or rename them.
   *(As of 2026-10-02 that directory no longer exists in this repo. The warning stays
   because the files may still be elsewhere, and recreating them would reintroduce the
   exposure.)*
3. **A semicolon inside a `--` comment breaks the whole file** (found 2026-10-02).
   The `mysql` client splits input on `;` and StarRocks then **rejects the resulting
   comment-only statement** — `ERROR 1064 ... Unexpected input '<EOF>'` — where MySQL
   server tolerates it. The file aborts *before reaching any statement*. Combined with
   hazard 1 this is how you lose a view. Run with **`mysql --skip-comments < file`**,
   which strips comments client-side; verified semantically inert here because no script
   uses `/*+ ... */` optimizer hints. `/* */` block comments are immune — only `--`
   lines are affected.

   Scan for it before a rebuild:

   ```bash
   grep -rlE "^\s*--.*;" radiant-prod/ access_controlled_views/ data_dictionary/
   ```

   Fixed in `combined_views/csf_results_latest_by_component_view.sql` (2 section markers
   re-punctuated) and in `radiant-prod/patient_mrn_list_prod.sql` (header converted to a
   block comment, because its SQL example legitimately needs semicolons). **Still
   present in 6 table scripts** — `chemotherapy_fields_prod.sql` (6 lines),
   `lansky_karnofsky_latest_table.sql` (3), `csf_tumor_analysis_latest_table.sql` (2),
   and `cbc_latest_results_table.sql`, `csf_results_latest_by_component_table.sql`,
   `treatment_summary_fields.sql` (1 each). Those are table scripts, so a failure costs
   a **table**, not a view. They are safe under `--skip-comments` and that is how the
   2026-10-02 rebuild ran them.

---

## 6. Open items before this can be automated

1. ~~**`radiant_patient_mrn_list` cannot be rebuilt from its script.**~~ **RESOLVED
   2026-10-02.** The premise was wrong — the 10-01 analysis read an earlier 2-column
   draft. The real generator carries the `research_id` derivation and is now committed,
   repaired, at `radiant-prod/patient_mrn_list_prod.sql`. See §3a.
2. **Refresh trigger and cadence are undefined.** Currently ad hoc / before a demo.
   Automation needs a decision: scheduled, or on-demand with a staleness check.
3. ~~**No loader script exists anywhere in the repo.**~~ **RESOLVED 2026-10-02** for
   stage 1: `../load_upstream_tables.py` does export → preflight-all → truncate → batched
   `INSERT` over port 80, reporting counts before and after. Three gaps remain. It covers
   **only the five warehouse tables** — stage 1b and stages 2–8 are still manual. Its
   truncate-and-load is **not atomic**, so a mid-load failure leaves one named table
   partial (it reports which, and the re-run command). And its subset warning is advisory
   only — it does not refuse a partial refresh, which is how the 10-01 mixed-vintage state
   arose. Making the subset case opt-in rather than warn-only is the obvious next
   hardening.
4. **Load is full-replace, not incremental.** Deltas are small (+6 to +507 rows), so
   incremental loading is possible, but no source table has a reliable
   updated-at column identified yet. Full replace is correct and simple; confirm before
   optimising.
5. **Decide the `stg_cbtn_enrollment_final` typing question** in §3 before writing a
   generic loader, so the 4 flattened columns change deliberately or not at all.
6. **No post-refresh verification suite — still unautomated, but the content now
   exists.** §7's four queries were all run by hand on 2026-10-02 and all passed, and §7
   carries the re-baselined expected counts plus the generalised all-12-view PHI sweep.
   What is missing is a *runner*: something that executes them, diffs the counts against
   the recorded baseline, and exits non-zero. Until then "verified" depends on whoever
   ran the refresh remembering to check.
7. **The `--`-comment-with-semicolon hazard is only partly remediated.** Two files are
   fixed; six table scripts still carry it (§5 hazard 3). They are safe under
   `--skip-comments`, so this is latent rather than live, but any automation MUST pass
   that flag — or the six should be re-punctuated so correctness does not depend on a
   caller-supplied flag. A `grep` guard in CI would stop new ones appearing.
8. **`pcx_30_medical_therapy_level` reads `protocol_name_unmasked_internal_use`**, while
   the source also carries `protocol_name_masked_for_release` (`Not Available` on 1,041
   of 42,745 rows). Both the identified and `_deid` builds choose the unmasked column
   explicitly, so the `_deid` release table — and the extracted CSV — publishes protocol
   names the source marks as not-for-release. Deliberate-looking but worth an explicit
   decision rather than inheritance.

---

## 7. Verification queries

Run after any refresh and rebuild. All four should come back clean.

```sql
-- a. every _deid release table has a dictionary row per column, and vice versa.
--    Expect ZERO rows.
with cols as (
  select c.table_name, c.column_name from information_schema.columns c
  where c.table_schema='radiant_data_dev' and c.table_name like 'pcx_30%_deid'),
doc as (
  select table_name, field_name from radiant_data_dev.pcx_30_data_dictionary
  where field_name is not null)
select coalesce(cols.table_name, doc.table_name) tbl,
       coalesce(cols.column_name, doc.field_name) field,
       case when doc.field_name is null then 'COLUMN NOT DOCUMENTED'
            else 'DOCUMENTED BUT NO SUCH COLUMN' end problem
from cols full outer join doc
  on doc.table_name=cols.table_name and doc.field_name=cols.column_name
where doc.field_name is null or cols.column_name is null;

-- b. the initial-treatment flag reached all 12 objects. Expect 12.
select count(*) from information_schema.columns where column_name='is_initial_treatment';

-- c. treatment_summary agrees with the per-row flags it derives from. Expect 0 and 0.
with r as (select research_id, max(case when is_initial_treatment='yes' then 1 else 0 end) f
           from radiant_data_dev.pcx_30_radiation_level_deid group by research_id),
     c as (select research_id, max(case when is_initial_treatment='yes' then 1 else 0 end) f
           from radiant_data_dev.pcx_30_medical_therapy_level_deid group by research_id)
select 'radiation' domain, count(*) disagreements
from radiant_data_dev.pcx_30_treatment_summary_deid t join r on r.research_id=t.research_id
where (t.had_initial_radiation='yes') <> (r.f=1)
union all
select 'chemo', count(*)
from radiant_data_dev.pcx_30_treatment_summary_deid t join c on c.research_id=t.research_id
where (t.had_initial_chemo='yes') <> (c.f=1);

-- d. PHI masking intact. Run as a login holding NO pii_grant: expect every
--    date column NULL and patient_id_type='research_id' on every row.
select patient_id_type, count(*) rows_n,
       sum(case when regimen_start_date is null then 1 else 0 end) start_null,
       sum(case when regimen_stop_date  is null then 1 else 0 end) stop_null
from cbtn_tenant.v_pcx_30_medical_therapy_level_combined group by 1;
```

All four passed on the 2026-10-02 rebuild: (a) zero rows, (b) 12, (c) 0 and 0,
(d) all 1,267 rows `research_id` with both dates NULL on every row.

Check (d) generalises usefully — every one of the 12 guarded views was confirmed to
return `research_id` on every row, `can_read_phi` false, and **NULL in every date-typed
column**, for a login holding no grant. Two notes if you re-run it that way. First,
`v_pcx_30_demographics_combined` has no date-typed column at all (`birth_year` is
varchar), so it has nothing to assert. Second, scope the sweep to these 12 views:
`cbtn_tenant` holds ~63 objects, and the others are a different surface (portal tenant
views such as `patient`, `document`, `task`, `cases`, `sequencing_experiment`) which DO
return dates to an ungranted caller and are governed separately — not a pcx_30 finding.

**Re-baselined 2026-10-02** (post-refresh, post-rebuild), with the
`pcx_30_data_dictionary` figure revised **2026-10-05** for the OpenPedCan upgrade (§4).
Expected row counts after a clean rebuild:

| object | rows |
|---|---|
| `pcx_30_event_level` / `_deid` | 1,856 |
| `pcx_30_surgery_level` / `_deid` | 1,285 |
| `pcx_30_medical_therapy_level` / `_deid` | 1,267 |
| `pcx_30_radiation_level` / `_deid` | 776 |
| `pcx_30_demographics`, `pcx_30_patient_level`, `pcx_30_treatment_summary_deid` | 966 each |
| `pcx_30_data_dictionary` | 74 |

Row counts alone will NOT catch a reverted event-level build: running the archived
`event_level_fields_prod.sql` still yields 1,856 rows, but with 11 columns instead of 12
and 187 rows silently back to `%NOS or NEC%`. Check the shape and the provenance split,
not just the count:

```sql
-- expect 12 columns, and 1,669 CBTN / 187 OpenPedCan
select count(*) from information_schema.columns
where table_schema='radiant_data_dev' and table_name='pcx_30_event_level_deid';
select cns_integrated_diagnosis_source, count(*)
from radiant_data_dev.pcx_30_event_level_deid group by 1;
```

Every base view and its `cbtn_tenant` counterpart return the SAME count as the table
(masking only, no row filtering) — so a base/guarded count divergence is a defect signal.
The non-pcx_30 views in the same directories read the Iceberg FHIR catalog, not these six
sources, and are unaffected by an upstream refresh: `v_pcx_30_mri_images_combined` 8,853 ·
`v_cbc_latest_results` 2,421 · `v_lansky_karnofsky_latest` 1,627 ·
`v_csf_results_latest_by_component` 1,054 · `v_csf_tumor_analysis_latest` 814.

The superseded pre-refresh (09-15) baseline, kept only so an older artefact can be dated:
`pcx_30_medical_therapy_level` 1,267 · `pcx_30_surgery_level` 1,278 ·
`pcx_30_radiation_level` 771 · `pcx_30_treatment_summary_deid` 960 ·
`pcx_30_data_dictionary` 71.
