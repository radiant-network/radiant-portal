-- pcx_30 survival CUBES (EFS + OS) -- base tables + tenant pass-through views.
--
-- THIS FILE IS A TEMPLATE, not directly runnable. The schema names are
-- `{{BASE_DB}}` / `{{VIEW_DB}}` because the same objects live in two schema
-- pairs, and a second hand-edited copy would drift from this one silently:
--   QA    radiant_tests     / demo_cbtn_tenant
--   PROD  radiant_data_dev  / cbtn_tenant
-- `../load_survival_cubes.py --target {qa,prod} --create` renders and applies
-- it; piping this file straight into `mysql` will fail on the placeholders,
-- which is the intended outcome rather than a limitation.
--
-- The PROPERTIES list is deliberately minimal and must NOT name a storage
-- volume: prod rejects `"storage_volume" = "builtin_storage_volume"` for want
-- of a USAGE privilege, while a `show create table` round-trip (from either
-- cluster) emits it. The table still lands on the cluster-default volume, so
-- the result is identical. QA does not have this restriction, so a DDL that
-- round-trips fine on QA breaks on prod.
--
-- SOURCE: Cumulus-exported CSVs, in TWO cube FAMILIES that coexist here. The
-- v7 pair was added beside the v6 pair (owner's call, 2026-11-04) rather than
-- replacing it, so both remain live and the demo can cut over deliberately.
--
--   v6 "all_dx"  6 dimensions, snapshot 2026-10-21r
--     pcx30_efs_all_dx_v6_months_2026-10-21r_cube.csv   24,056 data rows
--     pcx30_os_all_dx_v6_months_2026-10-21r_cube.csv    24,352 data rows
--   v7 "pooled"  7 dimensions (adds `data_source`), UNDATED export
--     pcx__30_efs_pooled_v7_months_cube.csv            249,587 data rows
--     pcx__30_os_pooled_v7_months_cube.csv             249,489 data rows
--
-- The v7 EXPORT FILENAMES CARRY NO SNAPSHOT TOKEN and spell the project with a
-- DOUBLE underscore (`pcx__30`). Both are source-side quirks, handled by the
-- loader rather than by renaming the files: the snapshot token is optional and
-- a dateless export resolves to the sentinel `undated`, while the table names
-- normalize to the single-underscore `pcx30_` convention the v6 pair set. A
-- dateless export means the loader's filename-based cross-cube snapshot guard
-- cannot speak, so a GRAND-TOTAL EQUALITY check between the two cubes carries
-- that weight instead -- see the loader's `cross_check_cohorts`.
--
-- SNAPSHOT-SPECIFIC COUNTS LIVE IN THIS HEADER ONLY. The COMMENT strings on the
-- tables and columns below are deliberately SNAPSHOT-AGNOSTIC -- they state the
-- cube contract, never a row count or cohort size. A reload replaces the data
-- but not the catalog comments, so a comment carrying "cnt = 969" would silently
-- describe the previous export forever. `load_survival_cubes.py --verify`
-- re-derives the live figures on demand; trust that over any number in prose.
--
-- LOADED-SNAPSHOT HISTORY (newest first), v6 "all_dx" family:
--   2026-10-21r  cohort 970, EFS 24,056 rows / 842 leaf, OS 24,352 / 840 leaf.
--                SUBTYPE VOCABULARY CHANGED -- see the breaking-change note below.
--   2026-10-21   cohort 969, EFS 24,139 rows / 841 leaf, OS 24,333 / 838 leaf.
--
-- LOADED-SNAPSHOT HISTORY (newest first), v7 "pooled" family:
--   undated      cohort 7,440, EFS 249,587 rows / 5,236 leaf,
--                OS 249,489 / 5,108 leaf. All 128 grouping sets present in both.
--                Measured pre-load from the CSVs; `--verify` re-derives it live.
--
-- BREAKING CHANGE AT 2026-10-21r -- `subtype` was RENAMED, not re-valued. The
-- six medulloblastoma subtypes gained an `MB-` prefix:
--     Group 3 -> MB-Group 3            SHH -> MB-SHH
--     Group 4 -> MB-Group 4            WNT -> MB-WNT
--     NOS/NEC -> MB-NOS/NEC            non-WNT/non-SHH -> MB-non-WNT/non-SHH
-- The four ATRT-* values are unchanged. Any saved query, dashboard filter or
-- notebook pinning a bare value (`subtype = 'SHH'`) now matches ZERO rows
-- rather than erroring -- it returns an empty slice that looks like a real
-- finding. The rename is an improvement at source: the old vocabulary carried
-- a bare `SHH` beside `ATRT-SHH` and a bare `NOS/NEC` beside `ATRT-NOS/NEC`,
-- so the medulloblastoma values were only disambiguated by convention.
--
-- THESE ARE COMPLETE CUBES, NOT FLAT FACT TABLES. Measured on every snapshot
-- loaded so far, in BOTH families: all 2^N grouping sets over the N dimensions
-- are present -- 64 of 64 for the six-dimension v6 pair, 128 of 128 for the
-- seven-dimension v7 pair. A NULL dimension means ROLLED UP ACROSS EVERY VALUE
-- of that dimension -- it does NOT mean missing or unknown.
--
--   * the all-NULL row IS the grand total, and both cubes of a family agree
--   * the fully-specified leaf rows sum to that same grand total
--
-- SO `select sum(cnt)` OVER THE WHOLE TABLE RETURNS 2^N x THE COHORT (64x on
-- v6, 128x on v7), because subtotal rows and leaf rows coexist. Measured on
-- v7: 7,440 x 128 = 952,320, exactly the whole-table sum of both cubes. A
-- consumer MUST pick a grouping set.
-- Both idioms are correct:
--     -- true cohort total (v7: add `and data_source is not null`)
--     select sum(cnt) from <t>
--      where <months> is not null and <status> is not null
--        and diagnosis is not null and protocol_name_and_arm is not null
--        and subtype is not null and site is not null;
--     -- precomputed per-diagnosis subtotal, no re-aggregation
--     -- (v7: add `and data_source is null`)
--     select diagnosis, cnt from <t>
--      where diagnosis is not null and <months> is null and <status> is null
--        and protocol_name_and_arm is null and subtype is null
--        and site is null;
--
-- A GROUPING-SET PREDICATE MUST NAME EVERY DIMENSION, and on v7 that is SEVEN,
-- not six. This is the quiet way to get a wrong number off the v7 cubes: take a
-- correct v6 leaf filter verbatim, run it against v7, and the un-named
-- `data_source` admits BOTH the leaf rows and the data_source-rolled-up rows,
-- so the total comes back at exactly 2x the cohort. It does not error and the
-- shape looks right. The same trap applies to any v6-era saved query or
-- dashboard filter pointed at a v7 table.
--
-- `Not Reported` IS A VALUE, NOT A ROLL-UP -- NEW IN v7, and the second way to
-- get a quiet wrong number. The v6 cubes carried exactly two status values
-- (`event`/`event-free`, `alive`/`deceased`) and two diagnoses, so on v6
-- `status is not null` did mean "status known". On v7, `efs_status`,
-- `vital_status` and `diagnosis` each carry an explicit `Not Reported` LEVEL
-- that sits BESIDE the NULL roll-up row. So on v7:
--     `status is not null`            = a real grouping set, INCLUDING Not Reported
--     `status not in ('Not Reported')` = what "status known" now requires
-- A v6-era filter does not break, it just quietly re-scopes: unknown-status
-- patients are now counted as a status cohort rather than excluded. Whoever
-- owns the demo queries has to decide, per curve, whether Not Reported belongs
-- in the denominator -- this schema does not decide it for them.
--
-- The views are DELIBERATELY plain pass-throughs (owner's call, 2026-10-27,
-- carried forward to v7 on 2026-11-04): the source columns verbatim -- seven on
-- v6, eight on v7 -- no derived grouping_level/is_leaf helper, no leaf filter.
-- The roll-up contract lives in these comments and the COMMENT strings.
--
-- A NEGATIVE SURVIVAL MONTH IS REAL DATA, NOT A SENTINEL -- do not clean it.
-- `months = -1` is present in every snapshot loaded so far; at 2026-10-21r it
-- spans 320 EFS rows and 350 OS rows, carrying cnt=25 (EFS) and cnt=28 (OS) at
-- the grand-total grouping set. It is an event dated BEFORE the diagnosis
-- anchor, the same class the pipeline's own EFS work records (an event dated two
-- days before the diagnosis anchor yields -2 days). Keeping the column
-- signed preserves it; an unsigned column or a `greatest(months, 0)` would
-- silently fold those patients into month 0 and move the first point of every
-- survival curve.
--
-- `diagnosis` holds only ATRT and Medulloblastoma on the v6 pair despite the
-- `all_dx` filename -- that is the snapshot's real content, measured, not a load
-- truncation. The v7 pair is the one that actually spans the disease set: 13
-- diagnoses, 107 subtypes, 31 sites, against v6's 2 / 10 / 8. That widening is
-- why the v7 string columns are NOT sized like v6's -- the longest v7 `subtype`
-- is 84 bytes and would have been TRUNCATED by v6's `varchar(64)`.
--
-- A NOTE ON WIDTHS: StarRocks `varchar(N)` counts BYTES, not characters, and
-- one v7 subtype ("Anaplastic large cell lymphoma (ALK+/ALK-)") carries a
-- U+2212 MINUS SIGN that is 3 bytes. Measured max BYTE widths were used to size
-- the v7 columns, with headroom, since a character count would under-size them.
--
-- EXPORT FILENAMES ARE NOT CANONICAL and the loader resolves them rather than
-- requiring a rename. Two quirks seen in the wild, both handled:
--   * a re-export of the same nominal date carries a REVISION suffix
--     (`2026-10-21r`), so the snapshot token is a date plus an optional
--     alphanumeric tail, not a bare date;
--   * a repeated browser download appends ` (1)` before `.csv`, which is a
--     download artifact and NOT part of the snapshot identity.
-- One such duplicate is accepted; TWO files for the same snapshot are refused,
-- because they can differ and guessing would load unreviewed bytes.
--
-- PHI: none. Every column is an aggregate count or a cohort dimension; there is
-- no identifier and no calendar date, so the
-- radiant_data_dev-base/tenant-view PHI gating that the pcx_30 *_combined
-- objects carry does not apply and no can_read_phi guard is added here.
-- SMALL CELLS ARE PUBLISHED, DELIBERATELY. This is a disclosure question rather
-- than a schema one, and it was PUT to the owner for v7 and answered: no
-- minimum-cell rule (2026-11-04). Recorded because the v7 numbers are a step
-- up from v6, not a continuation -- measured on the v7 EFS cube, 4,529 of its
-- 5,236 leaf cells carry cnt=1 (86%), spread across 31 sites x 2 data sources.
-- The decision is to carry v6's posture forward knowingly. If it is ever
-- revisited, the rule belongs in the view WHERE clause and has to be authored
-- deliberately -- NOT in the base tables, which must keep the complete cube for
-- the grouping-set invariants above to hold.
--
-- Reload is TRUNCATE + INSERT (see ../load_survival_cubes.py). These are
-- DUPLICATE KEY tables, so UPDATE/DELETE are unavailable -- a partial load
-- cannot be repaired in place and must be re-truncated.

-- ---------------------------------------------------------------- EFS cube ---
CREATE TABLE IF NOT EXISTS {{BASE_DB}}.pcx30_efs_all_dx_v6_months_cube (
  cnt                        int          NOT NULL COMMENT "Patient count in this cell. Always populated. Summing across grouping sets over-counts 64x -- see table comment",
  event_free_survival_months int          NULL     COMMENT "Months to EFS event or censor. NULL = ROLLED UP across all months. SIGNED: -1 is real (an event dated before the diagnosis anchor), never clean it",
  efs_status                 varchar(32)  NULL     COMMENT "event | event-free. NULL = ROLLED UP across both",
  diagnosis                  varchar(64)  NULL     COMMENT "ATRT | Medulloblastoma -- the real content despite the all_dx filename. NULL = ROLLED UP",
  protocol_name_and_arm      varchar(256) NULL     COMMENT "Some values contain commas. NULL = ROLLED UP across all protocols",
  subtype                    varchar(64)  NULL     COMMENT "Molecular subtype. MB-* values gained that prefix at snapshot 2026-10-21r (was a bare SHH/WNT/Group 3/...), so a filter pinning an old bare value matches zero rows. NULL = ROLLED UP",
  site                       varchar(256) NULL     COMMENT "Consortium site. NULL = ROLLED UP across all sites"
) ENGINE=OLAP
DUPLICATE KEY(cnt)
COMMENT "pcx_30 EVENT-FREE SURVIVAL cube from Cumulus. COMPLETE 6-dim cube: all 64 grouping sets present, a NULL dimension means ROLLED UP across every value of it. sum(cnt) over the whole table is 64x the cohort -- filter to one grouping set; the all-NULL row is the grand total. months=-1 is real data, not a sentinel. Loaded snapshot + counts: see scripts/cumulus_cubes/sql/pcx30_survival_cubes.sql"
DISTRIBUTED BY RANDOM
PROPERTIES ("replication_num" = "1", "compression" = "LZ4");

-- ----------------------------------------------------------------- OS cube ---
CREATE TABLE IF NOT EXISTS {{BASE_DB}}.pcx30_os_all_dx_v6_months_cube (
  cnt                     int          NOT NULL COMMENT "Patient count in this cell. Always populated. Summing across grouping sets over-counts 64x -- see table comment",
  overall_survival_months int          NULL     COMMENT "Months to death or censor. NULL = ROLLED UP across all months. SIGNED: -1 is real (an event dated before the diagnosis anchor), never clean it",
  vital_status            varchar(32)  NULL     COMMENT "alive | deceased. NULL = ROLLED UP across both",
  diagnosis               varchar(64)  NULL     COMMENT "ATRT | Medulloblastoma -- the real content despite the all_dx filename. NULL = ROLLED UP",
  protocol_name_and_arm   varchar(256) NULL     COMMENT "Some values contain commas. NULL = ROLLED UP across all protocols",
  subtype                 varchar(64)  NULL     COMMENT "Molecular subtype. MB-* values gained that prefix at snapshot 2026-10-21r (was a bare SHH/WNT/Group 3/...), so a filter pinning an old bare value matches zero rows. NULL = ROLLED UP",
  site                    varchar(256) NULL     COMMENT "Consortium site. NULL = ROLLED UP across all sites"
) ENGINE=OLAP
DUPLICATE KEY(cnt)
COMMENT "pcx_30 OVERALL SURVIVAL cube from Cumulus. COMPLETE 6-dim cube: all 64 grouping sets present, a NULL dimension means ROLLED UP across every value of it. sum(cnt) over the whole table is 64x the cohort -- filter to one grouping set; the all-NULL row is the grand total. months=-1 is real data, not a sentinel. Loaded snapshot + counts: see scripts/cumulus_cubes/sql/pcx30_survival_cubes.sql"
DISTRIBUTED BY RANDOM
PROPERTIES ("replication_num" = "1", "compression" = "LZ4");

-- -------------------------------------------------- demo tenant views ---
-- Plain pass-throughs. Seven columns each, identical to the base table, no
-- derived column and no leaf filter. The cube contract is in the base-table
-- COMMENT above; a consumer of these views still has to pick a grouping set.

CREATE OR REPLACE VIEW {{VIEW_DB}}.v_pcx30_efs_all_dx_v6_months_cube AS
SELECT
  cnt,
  event_free_survival_months,
  efs_status,
  diagnosis,
  protocol_name_and_arm,
  subtype,
  site
FROM {{BASE_DB}}.pcx30_efs_all_dx_v6_months_cube;

CREATE OR REPLACE VIEW {{VIEW_DB}}.v_pcx30_os_all_dx_v6_months_cube AS
SELECT
  cnt,
  overall_survival_months,
  vital_status,
  diagnosis,
  protocol_name_and_arm,
  subtype,
  site
FROM {{BASE_DB}}.pcx30_os_all_dx_v6_months_cube;

-- ======================================================================
-- v7 "pooled" family -- SEVEN dimensions. Added BESIDE the v6 pair above
-- (owner's call, 2026-11-04), which stays live and unmodified.
--
-- Three differences from v6 that a reader of the v6 DDL would get wrong:
--   1. `data_source` is a SEVENTH dimension, so there are 128 grouping sets
--      and a correct leaf filter must name all seven. A v6 filter run here
--      returns 2x the cohort, silently.
--   2. the string columns are WIDER, sized from measured max BYTE widths --
--      v6's varchar(64) would truncate the longest v7 subtype (84 bytes).
--   3. `Not Reported` is a real VALUE in the status and diagnosis columns,
--      beside the NULL roll-up.
-- All three are detailed in the file header.
-- ======================================================================

-- ------------------------------------------------------------ v7 EFS cube ---
CREATE TABLE IF NOT EXISTS {{BASE_DB}}.pcx30_efs_pooled_v7_months_cube (
  cnt                        int          NOT NULL COMMENT "Patient count in this cell. Always populated. Summing across grouping sets over-counts 128x -- see table comment",
  event_free_survival_months int          NULL     COMMENT "Months to EFS event or censor. NULL = ROLLED UP across all months. SIGNED: -1 is real (an event dated before the diagnosis anchor), never clean it",
  efs_status                 varchar(32)  NULL     COMMENT "event | event-free | Not Reported. NULL = ROLLED UP across all three. 'Not Reported' is a VALUE, not a roll-up: `efs_status is not null` INCLUDES it, so it is not a test for 'status known'",
  diagnosis                  varchar(64)  NULL     COMMENT "13 values incl. an explicit 'Not Reported' VALUE (not a roll-up). NULL = ROLLED UP",
  protocol_name_and_arm      varchar(256) NULL     COMMENT "Some values contain commas. NULL = ROLLED UP across all protocols",
  subtype                    varchar(128) NULL     COMMENT "Molecular/histologic subtype, 107 values. Sized from a measured 84-BYTE max (varchar counts bytes; one value carries a 3-byte U+2212). NULL = ROLLED UP",
  site                       varchar(256) NULL     COMMENT "Consortium site, 31 values. NULL = ROLLED UP across all sites",
  data_source                varchar(32)  NULL     COMMENT "Federated Network | Radiant Connected. The SEVENTH dimension, absent from the v6 cubes -- a v6-era leaf filter that omits it silently returns 2x the cohort. NULL = ROLLED UP across both"
) ENGINE=OLAP
DUPLICATE KEY(cnt)
COMMENT "pcx_30 EVENT-FREE SURVIVAL cube from Cumulus, v7 POOLED. COMPLETE 7-dim cube: all 128 grouping sets present, a NULL dimension means ROLLED UP across every value of it. sum(cnt) over the whole table is 128x the cohort -- filter to one grouping set naming ALL SEVEN dimensions; the all-NULL row is the grand total. 'Not Reported' is a VALUE in efs_status/diagnosis, not a roll-up. months=-1 is real data, not a sentinel. Loaded snapshot + counts: see scripts/cumulus_cubes/sql/pcx30_survival_cubes.sql"
DISTRIBUTED BY RANDOM
PROPERTIES ("replication_num" = "1", "compression" = "LZ4");

-- ------------------------------------------------------------- v7 OS cube ---
CREATE TABLE IF NOT EXISTS {{BASE_DB}}.pcx30_os_pooled_v7_months_cube (
  cnt                     int          NOT NULL COMMENT "Patient count in this cell. Always populated. Summing across grouping sets over-counts 128x -- see table comment",
  overall_survival_months int          NULL     COMMENT "Months to death or censor. NULL = ROLLED UP across all months. SIGNED: -1 is real (an event dated before the diagnosis anchor), never clean it",
  vital_status            varchar(32)  NULL     COMMENT "alive | deceased | Not Reported. NULL = ROLLED UP across all three. 'Not Reported' is a VALUE, not a roll-up: `vital_status is not null` INCLUDES it, so it is not a test for 'status known'",
  diagnosis               varchar(64)  NULL     COMMENT "13 values incl. an explicit 'Not Reported' VALUE (not a roll-up). NULL = ROLLED UP",
  protocol_name_and_arm   varchar(256) NULL     COMMENT "Some values contain commas. NULL = ROLLED UP across all protocols",
  subtype                 varchar(128) NULL     COMMENT "Molecular/histologic subtype, 107 values. Sized from a measured 84-BYTE max (varchar counts bytes; one value carries a 3-byte U+2212). NULL = ROLLED UP",
  site                    varchar(256) NULL     COMMENT "Consortium site, 31 values. NULL = ROLLED UP across all sites",
  data_source             varchar(32)  NULL     COMMENT "Federated Network | Radiant Connected. The SEVENTH dimension, absent from the v6 cubes -- a v6-era leaf filter that omits it silently returns 2x the cohort. NULL = ROLLED UP across both"
) ENGINE=OLAP
DUPLICATE KEY(cnt)
COMMENT "pcx_30 OVERALL SURVIVAL cube from Cumulus, v7 POOLED. COMPLETE 7-dim cube: all 128 grouping sets present, a NULL dimension means ROLLED UP across every value of it. sum(cnt) over the whole table is 128x the cohort -- filter to one grouping set naming ALL SEVEN dimensions; the all-NULL row is the grand total. 'Not Reported' is a VALUE in vital_status/diagnosis, not a roll-up. months=-1 is real data, not a sentinel. Loaded snapshot + counts: see scripts/cumulus_cubes/sql/pcx30_survival_cubes.sql"
DISTRIBUTED BY RANDOM
PROPERTIES ("replication_num" = "1", "compression" = "LZ4");

-- --------------------------------------------- v7 demo tenant views ---
-- Plain pass-throughs, same posture as the v6 views above: EIGHT columns each,
-- identical to the base table, no derived column and no leaf filter. A consumer
-- of these views still has to pick a grouping set -- and name all seven
-- dimensions when doing so.

CREATE OR REPLACE VIEW {{VIEW_DB}}.v_pcx30_efs_pooled_v7_months_cube AS
SELECT
  cnt,
  event_free_survival_months,
  efs_status,
  diagnosis,
  protocol_name_and_arm,
  subtype,
  site,
  data_source
FROM {{BASE_DB}}.pcx30_efs_pooled_v7_months_cube;

CREATE OR REPLACE VIEW {{VIEW_DB}}.v_pcx30_os_pooled_v7_months_cube AS
SELECT
  cnt,
  overall_survival_months,
  vital_status,
  diagnosis,
  protocol_name_and_arm,
  subtype,
  site,
  data_source
FROM {{BASE_DB}}.pcx30_os_pooled_v7_months_cube;
