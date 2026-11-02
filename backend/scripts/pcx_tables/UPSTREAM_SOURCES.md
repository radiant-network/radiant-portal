# pcx_30 upstream sources and refresh procedure

How the seven source tables in `radiant_data_dev` get there, what contract they
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

**Updated 2026-10-21:** `imaging_sessions` was **added to the loader**, taking stage 1
from five warehouse tables to six and the total source count from six to seven. It had
been declared in the dbt project's `dwh_source` but had no loader anywhere in the repo,
so it sat at whatever vintage it was last hand-loaded at (2026-09-28, 46,420 rows) while
the other five refreshed around it — exactly the mixed-vintage condition §4 warns about.
It needed no DDL: its 9 columns already matched the StarRocks target in ordinal order.
Two consequences are documented below: it is a **second** type-flattening exception (§3,
`age_at_session_days`), and the de-identified column total moves 134 → 143. All six
warehouse tables were then refreshed to the 2026-10-21 vintage (§4). The one remaining
uncovered source is `openpedcan_histologies_annotated` — see §6 item 5.

Everything downstream — 7 `pcx_30_*_deid` release tables, 13 `radiant_data_dev` combined
views, 13 `cbtn_tenant` guarded views, and the data dictionary — is derived from these
seven tables. Nothing else is an input.

**The identified twins no longer exist** (observed 2026-10-21). Earlier drafts of this doc
listed a non-`_deid` twin beside each release table; `radiant_data_dev` now holds only the
7 `_deid` tables plus `pcx_30_data_dictionary`, `pcx_30_data_dictionary_src` and
`pcx_30_organization_ref`, and the dbt project has no models for the twins. Identity is
re-attached at the **view** layer instead — the combined views join `mrn` / `research_id`
from `radiant_patient_mrn_list` onto the de-identified tables, and the `cbtn_tenant` views
gate that behind `can_read_phi`. This is a cleaner boundary (PHI exists only in views that
can gate it), but it means §7 check (b) now has 9 objects to find rather than 12.

---

## 1. The seven source tables

Six are loaded from two external warehouses. The seventh is built inside StarRocks
from the FHIR Iceberg catalog by a SQL script — a different mechanism entirely.

| table | source | schema | engine | cols | PHI | downstream pcx_30 SQL files |
|---|---|---|---|---|---|---|
| `stg_cbtn_enrollment_final` | **identified** DWH | `stg_cbtn` | PostgreSQL 16.13 | 15 | **YES** | **17** |
| `radiant_patient_mrn_list` | FHIR Iceberg catalog (in-StarRocks CTAS) | `fhir_cbtn_tenant_db` | StarRocks external catalog | 3 | **YES** (`mrn`) | 16 |
| `diagnosis` | de-identified DWH | `prod_access` | PostgreSQL 16.11 | 65 | no | 13 |
| `treatment` | de-identified DWH | `prod_access` | PostgreSQL 16.11 | 36 | no | 6 |
| `participants` | de-identified DWH | `prod_access` | PostgreSQL 16.11 | 21 | no | 2 |
| `updates` | de-identified DWH | `prod_access` | PostgreSQL 16.11 | 12 | no | 2 |
| `imaging_sessions` | de-identified DWH | `prod_access` | PostgreSQL 16.11 | 9 | no | 2 |

The identified warehouse also holds `stg_cbtn.stg_cbtn_enrollment` — same row count
as `_final` (7,202 on 2026-10-01). **Use `_final`.** The non-final sibling is not the
pcx_30 input; nothing downstream references it.

### PHI boundary

**Two** of the seven cross it. `stg_cbtn_enrollment_final` carries `first_name`,
`last_name`, `mrn`, `dob`, `subject_consent_date`; `radiant_patient_mrn_list` carries
`mrn` (2,804 rows on 2026-10-02, one MRN per FHIR patient id). The five de-identified
warehouse tables do not: `participants` carries `dob_year`, never `dob`, and
`imaging_sessions` carries only `age_at_session_days` — the calendar `session_date` is
*derived downstream* by adding that offset to `pt_roster.dob`, so the date is
manufactured inside the gated view layer and never lands in the source table.

This matters because it is the *only* reason `radiant_data_dev` is a PHI-bearing
schema, which is in turn why `cbtn_tenant` exposes nothing but grant-guarded views.
Automating the de-identified five needs no PHI handling; automating the sixth does.

The two warehouses use **separate credentials in separate files**, deliberately, so a
job that only needs de-identified data cannot accidentally hold an identified
connection. Do not merge them.

### Identifier families

Three, and they do not share a key space. Any automation that treats these six as
one homogeneous batch will get the joins wrong.

| family | columns | tables |
|---|---|---|
| REDCap longitudinal | `subject`, `redcap_record_id`, `event_id`, `redcap_event_name` | `diagnosis`, `treatment`, `updates` |
| registry / warehouse | `unique_participant_key`, `research_id`, `kids_first_participant_id`, `bp_number`, `family_id` | `participants` |
| identity bridge | `ehb_protocol_code`, `redcap_subject_record_id`, `research_id`, `mrn` | `stg_cbtn_enrollment_final` |
| imaging / Flywheel | `subject`, `flywheel_subject_id`, `flywheel_project_id`, `session_id` | `imaging_sessions` |

`imaging_sessions.subject` is in the **same `C#######` space** as the other `subject`
columns, so it joins the same way (measured 2026-10-21: 3,031 distinct subjects, 3,025
matching `participants.research_id`, 3,018 matching `diagnosis.subject`). Its Flywheel
columns are a fourth key space, but nothing downstream joins on them — they are carried
through to the view as payload for PACS lookup, not as join keys.

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
Column names and order are verbatim for **all six** warehouse tables (143/143 on the
de-identified five, 15/15 on the identified one, matched by
`(ordinal_position, column_name)` with zero differences). Types are faithful on four of
the de-identified five but **not** on `imaging_sessions` and **not** on the identified
one — see the two exceptions below.

Verified 2026-10-01 across the original four de-identified tables, re-measured
2026-10-21 with `imaging_sessions` added:

- **Column names identical**, including order: 143/143 columns matched by
  `(ordinal_position, column_name)` with zero differences.
- **Column counts identical**: 65 / 36 / 21 / 12 / 9.
- **Types map 1:1 on the original four**, with one flattening introduced by
  `imaging_sessions`:

  | PostgreSQL source | count | StarRocks | count |
  |---|---|---|---|
  | `text` + `character varying` | 81 + 55 = 136 | `varchar` | 136 |
  | `bigint` | 1 | `varchar` | 1 — **FLATTENED**, see below |
  | `integer` | 3 | `int` | 3 |
  | `boolean` | 2 | `tinyint` | 2 |
  | `double precision` | 1 | `float` | 1 |

### Exception 1: `stg_cbtn_enrollment_final` is type-FLATTENED

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
load is **not uniform across the six tables**, so a generic "copy with source types"
job would silently *change* these four columns' types. If that is the automation you
build, either accept the change deliberately and re-verify the 4 `dob_year` consumers,
or pin these columns to `varchar` to preserve current behaviour. Do not let it happen
by accident.

### Exception 2: `imaging_sessions.age_at_session_days` is type-FLATTENED

Found 2026-10-21 when the table was added to the loader. 8 of its 9 columns are `text`
→ `varchar` 1:1; the ninth is not:

| column | source type | StarRocks type | used downstream? |
|---|---|---|---|
| `age_at_session_days` | `bigint` | `varchar` | **yes — 2 files** |

**Already handled downstream, and must stay handled.** Both consumers wrap it in an
explicit cast to build the calendar date:

```sql
date_add(pt_roster.dob, interval cast(imaging_sessions.age_at_session_days as int) day)
    as session_date
```

That cast is load-bearing twice over. It is required because the column is `varchar`,
and `as int` specifically — not a bare arithmetic promotion — because of the same trap
that bit `age_at_event_days` on 2026-10-02: StarRocks promotes an untyped numeric
through aggregation to `decimal(38,9)` and publishes `5541.000000000` instead of `5541`.
If a future load ever imports this column as a real `bigint`, the casts stay correct
(an `int` cast of a `bigint` is a no-op here — the values are day offsets in the
thousands), so there is no coupling to fix in the other direction.

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

**Latest refresh: 2026-10-21.** All six warehouse tables loaded clean — every final
count matched its extract and its preflight figure exactly:

| table | was (10-19) | now | delta |
|---|---|---|---|
| `participants` | 16,117 | **16,126** | +9 |
| `diagnosis` | 21,075 | **21,085** | +10 |
| `treatment` | 43,061 | **43,087** | +26 |
| `updates` | 29,535 | **29,548** | +13 |
| `imaging_sessions` | 46,420 *(09-28)* | **47,304** | **+884** |
| `stg_cbtn_enrollment_final` | 7,234 | **7,240** | +6 |

The five small deltas are two days of accrual (there was a 2026-10-19 refresh of those
five). `imaging_sessions` carries the large delta because this was its first loader-driven
refresh — it had been sitting at its 2026-09-28 hand-load for three weeks.

**A refresh can SHRINK the cohort, and a net-positive count will hide it.** On the
2026-10-19 refresh the patient grain read 966 → 969, which looks like pure growth. It
was **+6 new, −3 removed**: `C112791`, `C530007` and `C530622` all left the cohort
because upstream re-curated their `cns_diagnosis_category` off Medulloblastoma (→ `Other
CNS Embryonal tumors` / `Glioneuronal and neuronal tumors`). They still have
`participants`, `enrollment`, `diagnosis` and `treatment` rows — they simply no longer
satisfy the §5 cohort filter. That is a correct upstream correction flowing through, not
a defect, but it means **the §7 count checks cannot detect a departure**. Diff the deid
CSVs at row level (see §5 step 9) if you need to know who left.

### Previous refresh: 2026-10-02

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
error. Automation should refresh **all seven, then rebuild everything downstream**, and
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
export of all six warehouse tables and the import into StarRocks **over port 80**.

**Use the dbt venv interpreter, not a system `python3`.** `pymysql` is absent from every
python3 on the authoring machine (homebrew, /usr/local, framework, anaconda). The import
check lands *after* the extract phase — extract shells out to `psql`, which does not need
pymysql — so a plain `python3 --extract --load` pulls all six extracts, including the PHI
one, and only then dies. The venv already has pymysql 2.2.8:

```bash
cd backend/scripts/pcx_tables
P=starrocks-dbt/.starrocks-dbt/bin/python3

# preflight every table against its live schema, write nothing
$P load_upstream_tables.py --load --dry-run

# extract fresh from both warehouses, then load all six
$P load_upstream_tables.py --extract --load

# load extracts of a known vintage (stamp = extract date, not today)
$P load_upstream_tables.py --load --stamp 20261021
```

`--extract` still runs under `--dry-run`, so `--extract --load --dry-run` is the safe
first move: it writes fresh CSVs and validates them without touching StarRocks, and a
following `--load --stamp <same date>` reuses them rather than re-pulling.

Read its module docstring before use; it records why port 80, why `\N` is the NULL marker,
and why it preflights every table before truncating any. **It is not a dry run by
default** — `--load` without `--dry-run` truncates and loads immediately.

**Stages 1b–8 are now dbt models**, in `starrocks-dbt/starrocks_radiant` (profile
`starrocks_radiant`, target `dev` → `radiant_data_dev` on the same prod cluster over port
80). A single `dbt run` rebuilds `radiant_patient_mrn_list`, the `int_pcx_30_*`
intermediates, the 7 `_deid` release tables, the 8 combined views, the 8
access-controlled `cbtn_tenant` views and the 3 data-dictionary objects, in dependency
order — so the hand-ordered walk below is no longer the normal path. The `.sql` files in
`radiant-prod/`, `access_controlled_views/` and `data_dictionary/` remain the record of
what each object does, and the three script hazards below still apply **if you run them
by hand**. dbt resolves `ref()` ordering itself, which removes the 1→1b and 2→4→5
footguns, but it does NOT remove the §4 mixed-vintage risk: dbt has no visibility into
whether stage 1 loaded all six sources at one vintage.

Stage 9 (static CSV export of the `_deid` tables) is scripted as of 2026-10-19 —
`../export_deid_tables.py`, same venv interpreter, `--dry-run` / `--archive`.

### Why port 80 and not Stream Load

On the prod CelerData cluster, **FE 8030 and BE 8040 are filtered**, so Stream Load is
unavailable. Bulk loading must go over the port-80 MySQL protocol as batched `INSERT`,
or via an S3 broker load. This is the opposite of QA, where Stream Load tunnels exist —
do not copy a QA loader and expect it to work here. See `~/.radiant/starrocks-prod.env`
notes and the Stream Load section of the root `CLAUDE.md`.

### Required order

Each stage depends on every stage above it. Steps 2+ are all in this directory.
**Stages 1b–8 are handled in dependency order by `dbt run`** — this table is the
by-hand fallback and the record of what depends on what.

| # | stage | objects |
|---|---|---|
| 1 | **load the 6 warehouse sources** | `participants`, `diagnosis`, `treatment`, `updates`, `imaging_sessions`, `stg_cbtn_enrollment_final` — `../load_upstream_tables.py` |
| 1b | **rebuild the Iceberg-derived source** | `radiant_patient_mrn_list` — `radiant-prod/patient_mrn_list_prod.sql` (see §3a: run the temp-swap, not the bare script) |
| 2 | event level | `event_level_fields_openpedcan_prod.sql` → `pcx_30_event_level` + `_deid` (supersedes `event_level_fields_prod.sql`, archived 2026-10-05; it builds the same two tables but without the OpenPedCan NOS/NEC diagnosis upgrade, so running it would revert 187 rows and drop `cns_integrated_diagnosis_source`) |
| 3 | demographics / patient level | `demographics_prod.sql`, `patient_level_prod.sql` |
| 4 | treatment tables | `chemotherapy_fields_prod.sql`, `surgery_level_fields_prod.sql`, `radiation_level_fields_prod.sql` |
| 5 | treatment summary | `treatment_summary_fields.sql` |
| 6 | combined views | `radiant-prod/combined_views/*.sql` |
| 7 | guarded views | `access_controlled_views/*.sql` (render the `.sql.tmpl` first) |
| 8 | data dictionary | `data_dictionary/data_dictionary_table.sql` |
| 9 | static deid CSVs | `prelim_30_deid_tables/*.csv` — `../export_deid_tables.py --archive` (optional; only if the demo payloads need refreshing) |

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
   `INSERT` over port 80, reporting counts before and after. It covers **all six warehouse
   tables** as of 2026-10-21 (`imaging_sessions` added), and stages 1b–8 are now `dbt run`
   (§5), so the manual surface is much smaller than this item originally described. Two
   gaps remain. Its truncate-and-load is **not atomic**, so a mid-load failure leaves one
   named table partial (it reports which, and the re-run command). And its subset warning
   is advisory only — it does not refuse a partial refresh, which is how the 10-01
   mixed-vintage state arose. Making the subset case opt-in rather than warn-only is the
   obvious next hardening.
4. **Load is full-replace, not incremental.** Deltas are small (+6 to +884 rows), so
   incremental loading is possible, but no source table has a reliable
   updated-at column identified yet. Full replace is correct and simple; confirm before
   optimising.
5. **`openpedcan_histologies_annotated` has no loader.** The last of the seven sources
   still outside stage 1 (76 cols, 56,246 rows on 2026-10-21). It feeds
   `int_pcx_30_openpedcan_subtype` → the NOS/NEC molecular-subtype upgrade on
   `pcx_30_event_level_deid`, so leaving it stale means a newly-admitted patient arrives
   with an un-upgraded subtype rather than being dropped — degraded, not wrong. Adding it
   is NOT a one-line registry entry like `imaging_sessions` was: it lives in
   **`bix_reporting`**, not `prod_access`, so it needs its own source schema, and its
   type map is unverified. Deferred deliberately 2026-10-21.
6. **Decide the `stg_cbtn_enrollment_final` typing question** in §3 before writing a
   generic loader, so the 4 flattened columns change deliberately or not at all.
7. **No post-refresh verification suite — still unautomated, but the content now
   exists.** §7's four queries were all run by hand on 2026-10-02 and all passed, and §7
   carries the re-baselined expected counts plus the generalised all-12-view PHI sweep.
   What is missing is a *runner*: something that executes them, diffs the counts against
   the recorded baseline, and exits non-zero. Until then "verified" depends on whoever
   ran the refresh remembering to check.
8. **The `--`-comment-with-semicolon hazard is only partly remediated.** Two files are
   fixed; six table scripts still carry it (§5 hazard 3). They are safe under
   `--skip-comments`, so this is latent rather than live, but any automation MUST pass
   that flag — or the six should be re-punctuated so correctness does not depend on a
   caller-supplied flag. A `grep` guard in CI would stop new ones appearing.
9. **`pcx_30_medical_therapy_level` reads `protocol_name_unmasked_internal_use`**, while
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

-- b. the initial-treatment flag reached every object that should carry it. Expect 9
--    as of 2026-10-21 (was 12 before the identified twins were retired -- see §1).
--    The 9 = 3 treatment grains (radiation / medical_therapy / surgery) x 3 objects
--    (_deid table, radiant_data_dev view, cbtn_tenant view). treatment_summary
--    DERIVES had_initial_* from these and does not carry the raw flag itself.
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

**Run 2026-10-21** (post-refresh, post-`dbt run`): (a) zero rows — PASS, (b) **9** —
PASS against the revised expectation above, (c) 0 and 0 — PASS, (shape) 12 columns on
`pcx_30_event_level_deid` — PASS. Check (d) was NOT re-run; it needs a login holding no
`pii_grant` and this session's login holds one.

All four passed on the 2026-10-02 rebuild: (a) zero rows, (b) 12 *(under the pre-retirement
object set)*, (c) 0 and 0, (d) all 1,267 rows `research_id` with both dates NULL on every
row.

Check (d) generalises usefully — every one of the guarded views was confirmed to
return `research_id` on every row, `can_read_phi` false, and **NULL in every date-typed
column**, for a login holding no grant. Two notes if you re-run it that way. First,
`v_pcx_30_demographics_combined` has no date-typed column at all (`birth_year` is
varchar), so it has nothing to assert. Second, scope the sweep to the pcx_30 views:
`cbtn_tenant` holds ~63 objects, and the others are a different surface (portal tenant
views such as `patient`, `document`, `task`, `cases`, `sequencing_experiment`) which DO
return dates to an ungranted caller and are governed separately — not a pcx_30 finding.

**Re-baselined 2026-10-21** (post-refresh of all six warehouse sources, post-`dbt run`
at 10:49). Expected row counts after a clean rebuild:

| object | rows | was (10-02) |
|---|---|---|
| `pcx_30_event_level` / `_deid` | **1,869** | 1,856 |
| `pcx_30_surgery_level` / `_deid` | **1,289** | 1,285 |
| `pcx_30_medical_therapy_level` / `_deid` | **1,283** | 1,267 |
| `pcx_30_radiation_level` / `_deid` | **786** | 776 |
| `pcx_30_demographics`, `pcx_30_patient_level`, `pcx_30_treatment_summary_deid` | **970** each | 966 |
| `pcx_30_data_dictionary` | 74 | 74 |
| `radiant_patient_mrn_list` | **2,990** | 2,804 |

Treat these as a **floor-and-shape** baseline, not an equality assertion. §4 records a
refresh in which the patient grain grew by 3 net while 3 patients *left* the cohort, so a
matching count does not prove a matching population.

Row counts alone will NOT catch a reverted event-level build: running the archived
`event_level_fields_prod.sql` yields the same row count, but with 11 columns instead of 12
and the OpenPedCan rows silently back to `%NOS or NEC%`. Check the shape and the
provenance split, not just the count:

```sql
-- expect 12 columns, and (2026-10-21) 1,626 CBTN / 243 OpenPedCan
select count(*) from information_schema.columns
where table_schema='radiant_data_dev' and table_name='pcx_30_event_level_deid';
select cns_integrated_diagnosis_source, count(*)
from radiant_data_dev.pcx_30_event_level_deid group by 1;
```

The OpenPedCan share **grew 187 → 243 without `openpedcan_histologies_annotated` being
refreshed** (it is still at its older vintage — §6 item 5). That is expected: the
annotation table did not move, but the refreshed `diagnosis` rows it joins against did, so
more events now find a match. Do not read a changed split as evidence the annotation
source was reloaded.

Every base view and its `cbtn_tenant` counterpart return the SAME count as the table
(masking only, no row filtering) — so a base/guarded count divergence is a defect signal.

**`v_pcx_30_mri_images_combined` is NO LONGER refresh-invariant** — corrected 2026-10-21.
It was previously grouped with the clinical views below as reading only the Iceberg FHIR
catalog, but it reads `imaging_sessions`, which became a loader-driven source on
2026-10-21. It moved **8,853 → 9,085** on that refresh. It is the ONLY object affected by
the imaging source: none of the 7 `_deid` release tables read `imaging_sessions`, so a
refresh that includes imaging changes this view and nothing else downstream of it.

The remaining non-pcx_30 views in the same directories do read the Iceberg FHIR catalog
rather than these seven sources, and are genuinely unaffected by an upstream refresh:
`v_cbc_latest_results` 2,421 · `v_lansky_karnofsky_latest` 1,627 ·
`v_csf_results_latest_by_component` 1,054 · `v_csf_tumor_analysis_latest` 814.

The superseded pre-refresh (09-15) baseline, kept only so an older artefact can be dated:
`pcx_30_medical_therapy_level` 1,267 · `pcx_30_surgery_level` 1,278 ·
`pcx_30_radiation_level` 771 · `pcx_30_treatment_summary_deid` 960 ·
`pcx_30_data_dictionary` 71.
