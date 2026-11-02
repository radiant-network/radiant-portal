/*
   radiant_data_dev.brim_output  (TABLE)

   BRIM abstraction exports, accumulated across patients and export vintages.

   Source: BRIM export CSVs (one per patient per run), e.g.
     2026-10-21-Radiant-BRIM-Develop-patient-56169295.csv
   Loaded by: ../../load_brim_outputs.py  (NOT by dbt, and NOT by this file)

   Created 2026-10-22. Columns 1-28 are the BRIM CSV header verbatim, snake_cased,
   in the export's own order. Columns 29-30 are load provenance stamped by the
   loader and are deliberately absent from the export.

   ------------------------------------------------------------------------------
   THIS SCRIPT IS create-IF-NOT-EXISTS, AND MUST STAY THAT WAY
   ------------------------------------------------------------------------------
   Unlike every other table script in this directory, this one does NOT begin with
   a drop. The pcx_30 tables are CTAS snapshots -- rebuildable from their sources at
   any time, so dropping them is free. This table is NOT: it is the only record of
   its contents, because the BRIM export CSVs live outside the repo (in the demos
   tree) and an export is a point-in-time artefact of a BRIM project that may since
   have been re-reviewed. Dropping this table destroys data that cannot be
   regenerated from any warehouse. Re-run this file freely; it is a no-op once the
   table exists.

   ------------------------------------------------------------------------------
   APPEND-ONLY -- THE HAZARD IS A DUPLICATE LOAD, NOT DATA LOSS
   ------------------------------------------------------------------------------
   DUPLICATE KEY, per this cluster's convention, so there is no primary key and
   nothing at the database level prevents loading the same export twice -- it simply
   doubles that file's rows, silently. `source_file` exists so this is detectable and
   reversible. load_brim_outputs.py refuses a source_file already present unless
   --replace is passed (which deletes that file's prior rows first). If you ever
   insert by hand, check first:

     select source_file, count(*) from radiant_data_dev.brim_output group by 1;

   ------------------------------------------------------------------------------
   SUPERSEDES the 25-column script in the demos tree
   ------------------------------------------------------------------------------
   'demos/Nov 2026/brim/BRIM_outputs/scripts/load_brim_output.sql' creates
   radiant_data_dev.brim_ouput (note the misspelling) with 25 columns. That matched
   the 2026-09-11 export format and is sound against it -- verified, no truncation on
   brim_output_20260911_notstructured.csv. It is NOT usable for the current 28-column
   format, for two separate reasons:

     1. Three columns absent -- value_start_offset, value_end_offset, patient_link.
        The load fails outright.
     2. Three columns undersized -- name varchar(50) against 263 actual,
        generated_value and value varchar(50) against 333 actual. This is the
        dangerous half: depending on session settings StarRocks truncates an
        over-length insert rather than erroring, so a multi-drug
        generated_value such as '[vincristine | cisplatin | doxorubicin | ...]'
        could be clipped at 50 chars with nothing to show it happened.

   That script is also not runnable top-to-bottom: its `select count(*)` has no
   terminating semicolon, so a client splitting on semicolons hands StarRocks one
   malformed `select ... create table ...` statement (the same hazard documented in
   UPSTREAM_SOURCES.md section 5), and its leading `drop table` carries no
   `if exists`. Neither defect is worth fixing -- prefer this file.

   As of 2026-10-22 radiant_data_dev.brim_ouput does not exist on the cluster.
   There is also an unrelated empty `radiant.brim` (14 cols, 0 rows, never loaded)
   whose raw_text varchar(128) and reasoning varchar(500) are far too small for real
   export data. Neither is the target.

   ------------------------------------------------------------------------------
   COLUMN SIZING -- measured, not guessed
   ------------------------------------------------------------------------------
   Max observed lengths on patient-56169295 (343 rows), which drove the sizes below:
     reasoning 1024 . raw_text 973 . generated_value 333 . value 333 . name 263
     note_title 47 . note_id 45 . result_link 71 . note_date 19 . patient_id 8

   The five long free-text columns were declared STRING, which StarRocks materialises
   as varchar(65533) -- that is what SHOW CREATE TABLE reports and what is written
   below. Generous on purpose: `name` already reaches 263 because the long form
   carries its whole sub-field list, e.g.
   'Radiation Therapy Events (radiation_start_date, radiation_end_date, ...)',
   and that grows as variables gain fields.

   NOTE on reasoning: 1024 is suspiciously round and appears to be upstream clipping
   in BRIM rather than a natural maximum. The column can hold far more if that is
   ever fixed, so no migration will be needed.

   ------------------------------------------------------------------------------
   EVERYTHING IS A STRING -- do not "improve" the typing
   ------------------------------------------------------------------------------
   Same contract the other tables in this directory follow (UPSTREAM_SOURCES.md
   section 3). confidence stays '0.935' rather than becoming a float, and
   reviewed_at holds the sentinel '--' as well as real timestamps, so a datetime
   column would reject or null it. patient_id is MRN-shaped and MUST stay varchar:
   the observed value '00306618' has leading zeros that a numeric type destroys, and
   zero-padding is already a live join trap against the portal patient table.
   loaded_at is the one real datetime, because it is ours rather than source data.

   PHI: note_date carries real calendar timestamps, so this table is PHI-bearing --
   consistent with radiant_data_dev generally. Anything exposing it through
   cbtn_tenant needs the usual can_read_phi gate plus date suppression; see
   ../../access_controlled_views/.

   SCHEMA DRIFT: the export format moved 25 -> 28 columns between 2026-09-11 and
   2026-10-21, the 28 being a strict superset (adds the two offsets and patient_link,
   shared columns keep their relative order). Expect further drift. The loader accepts
   any ordered subset of the 28 and NULLs the rest, but a genuinely NEW column must be
   added both to this table and to the loader's HEADER_MAP -- it refuses an
   unrecognised column rather than guessing.
*/

CREATE TABLE IF NOT EXISTS radiant_data_dev.brim_output (
  `name`                   varchar(512)   NULL COMMENT "BRIM variable or decision name; long form carries the sub-field list",
  `scope`                  varchar(128)   NULL COMMENT "e.g. 'One Label Per Note'",
  `patient_id`             varchar(128)   NULL COMMENT "MRN-shaped; varchar to preserve leading zeros",
  `note_id`                varchar(256)   NULL COMMENT "BRIM note identifier",
  `note_date`              varchar(64)    NULL COMMENT "timestamp string; PHI (real calendar date)",
  `note_title`             varchar(512)   NULL,
  `generated_value`        varchar(65533) NULL COMMENT "LLM value; pipe-delimited list when multi-valued",
  `value`                  varchar(65533) NULL COMMENT "final value after any human edit",
  `raw_text`               varchar(65533) NULL COMMENT "source span; empty on structured-data passthrough rows",
  `value_start_offset`     varchar(64)    NULL,
  `value_end_offset`       varchar(64)    NULL,
  `reasoning`              varchar(65533) NULL COMMENT "observed clipped at 1024 chars upstream",
  `review_status`          varchar(128)   NULL,
  `reviewed`               varchar(64)    NULL,
  `reviewing_user`         varchar(256)   NULL,
  `reviewed_at`            varchar(64)    NULL COMMENT "carries '--' sentinel as well as timestamps",
  `validation_value`       varchar(65533) NULL,
  `validation_agreement`   varchar(128)   NULL,
  `match_rule`             varchar(128)   NULL,
  `confidence`             varchar(64)    NULL COMMENT "string, not float -- keeps the load verbatim",
  `flag`                   varchar(256)   NULL,
  `flag_last_edited_by`    varchar(256)   NULL,
  `flag_last_edited`       varchar(64)    NULL,
  `comment`                varchar(65533) NULL,
  `comment_last_edited_by` varchar(256)   NULL,
  `comment_last_edited`    varchar(64)    NULL,
  `result_link`            varchar(512)   NULL,
  `patient_link`           varchar(512)   NULL,
  `source_file`            varchar(256)   NULL COMMENT "provenance: basename of the loaded BRIM export",
  `loaded_at`              datetime       NULL COMMENT "provenance: when this row was inserted"
) ENGINE=OLAP
DUPLICATE KEY(`name`)
COMMENT "BRIM abstraction exports, append-only. Cols 1-28 are the BRIM CSV header verbatim (snake_cased, same order); 29-30 are load provenance."
DISTRIBUTED BY RANDOM;
