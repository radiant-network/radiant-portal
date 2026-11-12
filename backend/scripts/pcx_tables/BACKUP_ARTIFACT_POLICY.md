# pcx_30 backup and scratch artifacts: retention policy

Companion to `UPSTREAM_SOURCES.md`. That file says how to refresh; this one says what
to do with the copies a refresh leaves behind, and when they may be destroyed.

Written 2026-11-10, after the surgical single-patient patch (`UPSTREAM_SOURCES.md` §4)
created ten more backup tables and prompted the question. **Nothing has been dropped.
The sections marked DECISION NEEDED are proposals, not applied policy.**

---

## 1. What actually exists today — measured, not estimated

Three tiers, and only the first is usually thought of as "backups".

### Tier 1 — in-cluster, `radiant_data_dev` (PHI-bearing)

92 base tables, of which **28 are not production objects**:

| class | n | age | examples |
|---|---|---|---|
| rollback copies | 17 | 1 day – 18 days | the 10 `*_bak_20261110` from today's patch; `pcx_30_organization_ref_bak_20261023`; `pcx_30_patient_key_bak_20261105` + `_20261105move`; 3 `pcx_patient_list*_qasalt_bak_20261102`; `brim_output_backup20261028` |
| comparison previews | 11 | 11 days | every `*_all_cbtn` — built 2026-10-30 to validate the cohort expansion, and **already declared redundant** by `COHORT_EXPANSION_PLAN.md` §7 |
| harness outputs | 10 | 5 – 14 days | 5 `*_promo` (promotion harness), 5 `*_composite` (CRF composite) |

**Total storage: roughly 30 MB.** The largest single artifact, `brim_output_backup20261028`,
is 22 MB; most are under 0.3 MB. **Disk is not the problem and must not be the argument** —
every reason to manage these is about correctness and governance, below.

### Tier 2 — local disk, `~/radiant_extracts`

**268 MB across 5 vintages** (`20261001`, `20261019`, `20261021`, `20261110`,
`20261110c76`). Every vintage includes a `stg_cbtn_enrollment_final` extract, which
carries `first_name`, `last_name`, `mrn`, `dob`, `subject_consent_date`. So this is
**five copies of identified patient data on a laptop**, mode 600, outside any git repo,
with no expiry and no inventory. Two of them (`20261021`, `20261110c76`) are load-bearing
right now: they are the rollback source for the live cluster state.

### Tier 3 — local disk, `~/Documents/Radiant/demos/Nov 2026`

**1.5 GB.** Includes 2 `prelim_30_deid_tables` directories plus 2 matching zips, 2
`prelim_30_all_cbtn_preview` zips, a 1.0 GB `brim` tree, 278 MB of `charm data`, and 3
patient-scoped directories (~90 MB) named with raw patient identifiers. This tier has no
convention at all — it is a working directory that has become an archive by accident.

---

## 2. Why this needs managing — ranked by real harm

**1. Scratch silently corrupts verification queries. This is measured, not theoretical.**
`UPSTREAM_SOURCES.md` §7 check (b) asserts that `is_initial_treatment` appears on exactly
9 objects. On 2026-11-10 it returned **21**: the canonical 9 plus 3 `_composite`, 3
`_all_cbtn`, 3 `_promo` and 3 `_bak_20261110`. The query is unscoped — no
`table_schema`, no `table_name` — so its expected value drifts every time anyone makes a
copy. A check whose answer depends on how much scratch exists is not a check. It has now
been scoped (same file, §7) and returns 9 again, but the class of bug recurs wherever an
`information_schema` query is unscoped.

**2. Every in-cluster backup is an ungoverned PHI copy.** `radiant_data_dev` is
PHI-bearing, which is the entire reason `cbtn_tenant` exposes nothing but grant-guarded
views. A backup table has **no row in `view_data_dictionary_access_policy.csv`, no data
dictionary entry, no `can_read_phi` gate and no expiry**. The governance surface describes
*views*; backups sit underneath it and inherit nothing. `pcx_30_patient_key_bak_20261105`
holds `(organization_code, mrn, patient_key)` in the clear.

**3. A stale copy is a loaded gun.** `ALTER TABLE <live> SWAP WITH <bak>` is the
documented repair pattern on this cluster, and `INSERT ... SELECT` from a dated copy is
one line. Either silently reverts the release to an older vintage — the same hazard
`UPSTREAM_SOURCES.md` already records for the retained hand-authored `.sql` scripts, each
of which opens with a `drop`. The more copies exist, and the less clear which is current,
the likelier that mistake becomes.

**4. Three naming conventions and zero recorded intent.** `_bak_YYYYMMDD`,
`_backup<YYYYMMDD>` and `_qasalt_bak_YYYYMMDD` are all in use. Nothing anywhere records
what `pcx_30_patient_key_bak_20261105` protects, how it differs from
`pcx_30_patient_key_bak_20261105move`, or when either may go. **A name cannot carry
intent, so in six months nobody can distinguish a backup that must never be deleted from
one that should have gone in a fortnight — and the safe response to that ambiguity is to
keep everything, which is how we got here.**

**5. An unverified backup is not a backup.** No artifact records a row count or digest at
creation, so a restore cannot be proven faithful — only plausible.

---

## 3. The policy

### 3a. A registry, because the name cannot carry the intent

`radiant_data_dev.pcx_30_backup_registry`. It holds data recorded nowhere else, so by the
existing rule in `UPSTREAM_SOURCES.md` it is a standalone `CREATE TABLE IF NOT EXISTS`
and **must never become a dbt model** — a table model drops and recreates, which would
destroy the only record of what every backup is for.

```sql
create table if not exists radiant_data_dev.pcx_30_backup_registry (
    artifact_name          varchar(256)  comment 'table name, directory or zip',
    artifact_kind          varchar(16)   comment 'table | dir | zip',
    location               varchar(256)  comment 'cluster schema, or host:path',
    source_object          varchar(256)  comment 'what it is a copy OF',
    retention_class        varchar(32)   comment 'rollback|one_way_door|comparison|harness_output',
    reason                 varchar(1024) comment 'the operation it protects, in words',
    created_at             datetime,
    created_by             varchar(64),
    review_on              date          comment 'when a human must re-decide',
    row_count_at_creation  bigint,
    digest_at_creation     varchar(64)   comment 'so a restore can be PROVEN faithful',
    contains_phi           boolean,
    disposition            varchar(16)   comment 'active | expired | dropped',
    dropped_at             datetime
)
duplicate key (artifact_name)
distributed by hash(artifact_name) buckets 1;
```

**Registration happens in the script that creates the backup**, not afterwards by
goodwill. An unregistered artifact matching a backup pattern is the single loudest thing
the sweeper reports, because it is either someone's in-flight work or something nobody
remembers.

### 3b. Four retention classes

| class | what it is | default retention | today's members |
|---|---|---|---|
| `rollback` | pre-change copy of an operation that gets verified and then settles | **14 days after the change verifies**, then drop | the 10 `*_bak_20261110`; `pcx_30_organization_ref_bak_20261023`; the 3 `*_qasalt_bak_20261102` |
| `one_way_door` | pre-state of a change that cannot be re-performed | **1 year, annual review** | `pcx_30_patient_key_bak_20261105`, `..._20261105move` — the key contract forbids re-minting a `patient_key`, so these are the only route back |
| `comparison` | a preview built to inform a decision | **drop once the decision is recorded**; hard cap 30 days | the 11 `*_all_cbtn` |
| `harness_output` | re-derivable output of a pipeline that can simply be re-run | **no dated copies at all** — one current copy, overwritten in place | the 5 `*_promo`, the 5 `*_composite` |

The classes exist so the *default* is correct. `rollback` is the common case and it is
short-lived; `one_way_door` is rare and long-lived; conflating them is what makes people
keep everything forever.

### 3c. A sweeper, report-only by default

`manage_backup_artifacts.py`, in this directory, same venv interpreter and the same
posture as `fill_patient_keys.py` — **reports by default, writes only under `--apply`.**

It reports four populations:
1. registered and **past `review_on`** — the drop candidates;
2. registered and active — with days remaining;
3. **unregistered artifacts matching a backup/scratch pattern** — the drift detector;
4. registry rows whose artifact no longer exists — stale bookkeeping.

Rules it must enforce:
- `--apply` drops **only** artifacts that are registered, classed, and past review.
- It **never** drops an unregistered artifact. It reports them for adoption, because an
  unregistered copy may be a colleague's in-flight work, and this cluster has exactly one
  shared target.
- It refuses to drop an artifact with no `digest_at_creation` unless that artifact is
  named explicitly on the command line — if we cannot prove what a backup held, deleting
  it silently is the wrong default.
- It will not drop anything whose `source_object` no longer exists. A backup whose
  original is gone has been promoted to the only copy.

### 3d. Long-term retention belongs outside the cluster

**In-cluster copies are short-lived rollback aids. Nothing else.** Anything that must
survive longer becomes a CSV export via `export_deid_tables.py --archive` in object
storage under a lifecycle rule — not a live table in a PHI-bearing schema with no access
policy. The `prelim_30_deid_tables_<date>` convention already does the right thing; what
it needs is (a) formalising, and (b) moving off a laptop, which is where both Tier 2 and
Tier 3 currently live.

For Tier 2 specifically: keep **two** extract vintages — the one the cluster was loaded
from and the one before it — and delete the rest, because the PHI exposure is per-copy
and the older vintages have no consumer. Today that means keeping `20261021` and
`20261110c76` and retiring `20261001` and `20261019`.

### 3e. Two structural fixes so this does not recur

1. **Scope every `information_schema` verification query** to `table_schema` plus an
   explicit `table_name` list. Cheap, done for §7 check (b) on 2026-11-10, and it makes
   that check immune to however much scratch exists.
2. **DECISION NEEDED — a separate scratch schema**, e.g. `radiant_data_dev_scratch`.
   Then "is this a production object?" is answerable by schema membership, unscoped
   checks stop counting scratch for free, and grants can be withheld from the scratch
   schema entirely. This is the structural fix rather than the cosmetic one, but it is
   not mine to take: it needs a `CREATE DATABASE` privilege, and the `calkinsh` login
   **can create but cannot grant and cannot even read the grant tables**, so whoever
   holds GRANT has to own the access story. A second PHI-bearing schema is a governance
   decision, not an engineering convenience.

---

## 4. DECISION NEEDED

1. **The 11 `*_all_cbtn` previews.** `COHORT_EXPANSION_PLAN.md` §7 already says to drop
   them and the comparison they informed is recorded. 11 days old. Confirm and they go.
2. **`brim_output_backup20261028`.** 22 MB, 257,639 rows against a live `brim_output` of
   258,639 — so it is NOT a copy of current state, it is a genuine point-in-time
   snapshot, and it uses a naming convention nobody else uses. Not mine; needs its
   owner's decision before anything happens to it.
3. **The two `pcx_30_patient_key_bak_20261105*` tables.** Proposed `one_way_door`, keep,
   annual review. These are the only route back if a `patient_key` has to be restored,
   and the contract forbids minting a replacement.
4. **The scratch schema** (§3e item 2).
5. **The retention numbers themselves** — 14 days, 1 year, 30-day cap are proposals
   chosen to make the common case safe, not measured optima.

## 5. Sequencing, and the one thing that is not negotiable before the demo

**Nothing is dropped before the November 2026 demo.** The ten `*_bak_20261110` tables are
the rollback for the change made today and stay until the demo has passed *and* the
post-demo full refresh has landed and verified. Registering them costs nothing and is the
first step; destroying anything is the last.

Note the SCH-DEMO teardown is already due **on or before 2026-11-19** and has its own
artifacts (the two `patient_key` backups, the `pcx_30_organization_override` seed row).
Those dates belong in the registry's `review_on`, so the teardown is remembered by a
query rather than by a person.
