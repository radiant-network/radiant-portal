#!/usr/bin/env python3
"""Load BRIM abstraction exports into radiant_data_dev.brim_output.

    # check without writing
    python3 load_brim_outputs.py --dry-run <file.csv> [...]

    # load one or more exports
    python3 load_brim_outputs.py <file.csv> [...]

    # re-load a file already present (deletes its prior rows first)
    python3 load_brim_outputs.py --replace <file.csv>

NOTE: needs pymysql, absent from every system python3 here. Use the dbt venv:

    starrocks-dbt/.starrocks-dbt/bin/python3 load_brim_outputs.py --dry-run <file>

WHY IT IS BUILT THIS WAY

* APPEND-ONLY, so re-running is the hazard rather than data loss. The target has no
  primary key (DUPLICATE KEY, like every table on this cluster), so nothing stops a
  second load of the same file from silently doubling its rows. This refuses a file
  whose basename is already in `source_file` unless `--replace` is passed, which
  deletes that file's rows first. That check is the main reason to use this script
  rather than an ad-hoc INSERT.

* Parameterised INSERT via pymysql, never string interpolation. Measured on
  patient-56169295: 1,144 fields contain commas, 49 contain embedded newlines, 15
  contain double quotes. Hand-escaping that is how you corrupt a load.

* Port 80 batched INSERT. FE 8030 / BE 8040 are filtered on the prod CelerData
  cluster, so Stream Load is unavailable -- see UPSTREAM_SOURCES.md section 5.

* HEADER IS MATCHED AGAINST THE FIRST 28 TARGET COLUMNS ONLY. Columns 29-30
  (`source_file`, `loaded_at`) are load provenance, stamped here, and are deliberately
  NOT in the export. The 28 are the BRIM header verbatim, snake_cased, in order.

* The BRIM export schema DRIFTS between versions. An older 25-column export exists
  (`brim_output_20260911_notstructured.csv`); the current 28-column form is a strict
  superset -- it adds `Value Start Offset`, `Value End Offset` and `Patient Link`, and
  keeps the shared columns in the same relative order. This script therefore accepts
  any header that is an ordered subset of the 28, filling the absent columns with NULL,
  and reports which were missing. A header with an UNKNOWN column is refused.

* Everything loads as a string. `confidence` is not cast to float and `note_date` not
  to datetime, matching the load contract the other tables in this directory follow:
  the source carries sentinels (`reviewed_at` holds '--'), so let downstream SQL decide.
"""
from __future__ import annotations

import argparse
import csv
import shlex
import sys
import time
from pathlib import Path

csv.field_size_limit(sys.maxsize)

TARGET_SCHEMA = "radiant_data_dev"
TARGET_TABLE = "brim_output"
PROVENANCE_COLS = ("source_file", "loaded_at")
STARROCKS_ENV = Path.home() / ".radiant/starrocks-prod.env"
STARROCKS_HOST = ("celerdata-private-nlb-hnsIFJjH-"
                  "47198fe90f6ce7c2.elb.us-east-1.amazonaws.com")

# BRIM CSV header -> target column. Order is the export's order.
HEADER_MAP = {
    "Name": "name",
    "Scope": "scope",
    "Patient_id": "patient_id",
    "Note_id": "note_id",
    "Note Date": "note_date",
    "Note Title": "note_title",
    "Generated Value": "generated_value",
    "Value": "value",
    "Raw Text": "raw_text",
    "Value Start Offset": "value_start_offset",
    "Value End Offset": "value_end_offset",
    "Reasoning": "reasoning",
    "Review Status": "review_status",
    "Reviewed": "reviewed",
    "Reviewing User": "reviewing_user",
    "Reviewed At": "reviewed_at",
    "Validation Value": "validation_value",
    "Validation Agreement": "validation_agreement",
    "Match Rule": "match_rule",
    "Confidence": "confidence",
    "Flag": "flag",
    "Flag last edited by": "flag_last_edited_by",
    "Flag last edited": "flag_last_edited",
    "Comment": "comment",
    "Comment last edited by": "comment_last_edited_by",
    "Comment last edited": "comment_last_edited",
    "Result Link": "result_link",
    "Patient Link": "patient_link",
}


def read_env(path: Path) -> dict[str, str]:
    """Parse an `export K=V` credential file. Never logs values."""
    if not path.exists():
        sys.exit(f"missing credential file {path}")
    out = {}
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line.startswith("export ") or "=" not in line:
            continue
        k, v = line[len("export "):].split("=", 1)
        parts = shlex.split(v)
        out[k.strip()] = parts[0] if parts else ""
    return out


def connect():
    try:
        import pymysql
    except ImportError:
        sys.exit("pymysql is required -- use starrocks-dbt/.starrocks-dbt/bin/python3")
    cfg = read_env(STARROCKS_ENV)
    return pymysql.connect(
        host=STARROCKS_HOST, port=80,
        user=cfg["STARROCKS_PROD_USER"], password=cfg["STARROCKS_PROD_PASSWORD"],
        autocommit=True, charset="utf8mb4", local_infile=False,
    )


def target_columns(cur) -> list[str]:
    cur.execute(
        "select column_name from information_schema.columns "
        "where table_schema=%s and table_name=%s order by ordinal_position",
        (TARGET_SCHEMA, TARGET_TABLE))
    cols = [r[0] for r in cur.fetchall()]
    if not cols:
        sys.exit(f"{TARGET_SCHEMA}.{TARGET_TABLE} does not exist")
    return cols


def preflight(cur, path: Path, data_cols: list[str]):
    """Validate one export. Returns (cols_present, rows, already_loaded_count)."""
    if not path.exists():
        sys.exit(f"  {path.name}: no such file")
    with path.open(newline="", encoding="utf-8-sig") as fh:
        rd = csv.reader(fh)
        try:
            header = next(rd)
        except StopIteration:
            sys.exit(f"  {path.name}: file is empty")
        widths, n = set(), 0
        for row in rd:
            widths.add(len(row))
            n += 1

    unknown = [h for h in header if h not in HEADER_MAP]
    if unknown:
        sys.exit(f"  {path.name}: unrecognised BRIM column(s) {unknown}\n"
                 f"    the export schema has drifted -- add them to HEADER_MAP and the table")
    mapped = [HEADER_MAP[h] for h in header]
    # must be an ordered subset of the table's data columns
    pos = [data_cols.index(c) for c in mapped]
    if pos != sorted(pos):
        sys.exit(f"  {path.name}: columns are out of order relative to the target")
    if n == 0:
        sys.exit(f"  {path.name}: header but no data rows")
    if widths != {len(header)}:
        sys.exit(f"  {path.name}: ragged rows, widths {sorted(widths)}, expected {len(header)}")

    cur.execute(f"select count(*) from {TARGET_SCHEMA}.`{TARGET_TABLE}` "
                f"where source_file=%s", (path.name,))
    return mapped, n, cur.fetchone()[0]


def load(cur, path: Path, mapped: list[str], stamp: str, batch_size: int) -> int:
    cols = mapped + list(PROVENANCE_COLS)
    collist = ",".join(f"`{c}`" for c in cols)
    placeholder = "(" + ",".join(["%s"] * len(cols)) + ")"
    head = f"insert into {TARGET_SCHEMA}.`{TARGET_TABLE}` ({collist}) values "
    sent = 0
    with path.open(newline="", encoding="utf-8-sig") as fh:
        rd = csv.reader(fh)
        next(rd)
        batch = []
        for row in rd:
            batch.append(list(row) + [path.name, stamp])
            if len(batch) >= batch_size:
                sent += flush(cur, head, placeholder, batch)
                batch = []
        if batch:
            sent += flush(cur, head, placeholder, batch)
    return sent


def flush(cur, head: str, placeholder: str, batch) -> int:
    cur.execute(head + ",".join([placeholder] * len(batch)),
                [v for row in batch for v in row])
    return len(batch)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+", help="BRIM export CSV(s)")
    ap.add_argument("--dry-run", action="store_true", help="preflight only; write nothing")
    ap.add_argument("--replace", action="store_true",
                    help="if a file's rows are already present, DELETE them and re-load")
    ap.add_argument("--batch-size", type=int, default=500,
                    help="rows per INSERT (default 500; rows here are far wider than "
                         "the upstream tables, so the 2000 used there is too large)")
    args = ap.parse_args()

    cur = connect().cursor()
    all_cols = target_columns(cur)
    data_cols = [c for c in all_cols if c not in PROVENANCE_COLS]

    print(f"PREFLIGHT  (-> {TARGET_SCHEMA}.{TARGET_TABLE}, append-only)")
    plan = []
    blocked = []
    for f in args.files:
        p = Path(f).expanduser()
        mapped, n, already = preflight(cur, p, data_cols)
        missing = [c for c in data_cols if c not in mapped]
        note = f"  cols={len(mapped)}/{len(data_cols)}"
        if missing:
            note += f"  (NULL: {','.join(missing)})"
        if already:
            note += f"  *** {already:,} rows ALREADY LOADED"
            if not args.replace:
                blocked.append(p.name)
        print(f"  {p.name[:58]:58} rows={n:>6,}{note}")
        plan.append((p, mapped, n, already))

    cur.execute(f"select count(*) from {TARGET_SCHEMA}.`{TARGET_TABLE}`")
    before_total = cur.fetchone()[0]
    print(f"  table currently holds {before_total:,} rows\n")

    if blocked:
        sys.exit(f"REFUSING: already loaded {blocked}. Re-run with --replace to "
                 f"delete those rows and load again, or drop the file from the list.")

    if args.dry_run:
        print("DRY RUN -- nothing written.")
        return

    stamp = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"LOAD  (batch={args.batch_size}, loaded_at={stamp})")
    total = 0
    for p, mapped, n, already in plan:
        t0 = time.time()
        if already and args.replace:
            cur.execute(f"delete from {TARGET_SCHEMA}.`{TARGET_TABLE}` "
                        f"where source_file=%s", (p.name,))
            print(f"  {p.name[:58]:58} deleted {already:,} prior rows")
        try:
            sent = load(cur, p, mapped, stamp, args.batch_size)
        except Exception as exc:  # noqa: BLE001 - must say which file is partial
            print(f"\n  *** FAILED on {p.name}: {exc}")
            print(f"  *** that file is PARTIALLY loaded. Clean up with:")
            print(f"  ***   delete from {TARGET_SCHEMA}.{TARGET_TABLE} "
                  f"where source_file='{p.name}';")
            sys.exit(1)
        cur.execute(f"select count(*) from {TARGET_SCHEMA}.`{TARGET_TABLE}` "
                    f"where source_file=%s", (p.name,))
        landed = cur.fetchone()[0]
        ok = landed == n == sent
        total += sent
        print(f"  {p.name[:58]:58} {sent:>6,} sent, {landed:>6,} present  "
              f"{time.time()-t0:5.1f}s  {'OK' if ok else 'COUNT MISMATCH'}")
        if not ok:
            sys.exit(f"  *** {p.name}: expected {n}, sent {sent}, present {landed}")

    cur.execute(f"select count(*) from {TARGET_SCHEMA}.`{TARGET_TABLE}`")
    after = cur.fetchone()[0]
    print(f"\nSUCCESS  {len(plan)} file(s), {total:,} rows inserted; "
          f"table {before_total:,} -> {after:,}")


if __name__ == "__main__":
    main()
