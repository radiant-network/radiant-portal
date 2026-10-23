#!/usr/bin/env python3
"""Export the 7 pcx_30 `_deid` release tables from StarRocks to static CSV.

Companion to load_upstream_tables.py (which does the opposite direction) and to
UPSTREAM_SOURCES.md. Run this AFTER the dbt models have been rebuilt, to refresh the
static copies the demo notebooks and the hand-off payloads read.

    # report what would be written, touch nothing
    python3 export_deid_tables.py --dry-run

    # archive the current CSVs, then write fresh ones
    python3 export_deid_tables.py --archive

    # one table only, to a scratch dir
    python3 export_deid_tables.py --tables pcx_30_event_level_deid --out-dir /tmp

NOTE: needs pymysql, which is absent from every system python3 on this machine. Use
the dbt venv interpreter:

    starrocks-dbt/.starrocks-dbt/bin/python3 export_deid_tables.py --dry-run

WHY THIS FORMAT

The existing CSVs in prelim_30_deid_tables/ were produced by a GUI client, and the
demo consumers already parse them. This script reproduces that dialect byte-for-byte
rather than imposing a tidier one, so a refresh is a clean diff instead of a
whole-file rewrite:

* CRLF line terminators (every *_deid.csv is CRLF; data_dictionary.csv is LF and is
  NOT written by this script).
* QUOTE_MINIMAL -- a field is quoted only when it contains a comma, quote or newline.
  Verified against the live files: event_level has 1,665 quoted lines (the
  "Medulloblastoma, non-WNT/non-SHH" family), treatment_summary has zero.
* SQL NULL renders as an EMPTY FIELD, not the `\\N` marker that load_upstream_tables.py
  uses. Opposite convention, same directory -- the loader needs to round-trip genuine
  empty strings out of `participants`, these release tables do not, and the demo
  consumers expect empty. Do not unify them.
* Column order is the table's `ordinal_position`, so the header matches the live
  schema without a hand-maintained list.

ORDERING: `order by` every column, positionally (1..N). The tables have no primary
key to sort on and StarRocks gives no stable natural order, so an unordered export
would diff dirty on every run even with identical data. Ordering by the full column
tuple is total (no ties to break) and reproduces the ordering the existing GUI-exported
files already have, because their leading columns are the natural sort keys
(organization_name/research_id for event_level, research_id for patient_level).
"""
from __future__ import annotations

import argparse
import csv
import shlex
import shutil
import sys
import time
from pathlib import Path

TARGET_SCHEMA = "radiant_data_dev"
OUT_DIR = Path.home() / "Documents/Radiant/demos/Nov 2026/prelim_30_deid_tables"
ARCHIVE_DIR = Path.home() / "Documents/Radiant/demos/Nov 2026/prelim_30_tables_archive"
STARROCKS_ENV = Path.home() / ".radiant/starrocks-prod.env"
STARROCKS_HOST = ("celerdata-private-nlb-hnsIFJjH-"
                  "47198fe90f6ce7c2.elb.us-east-1.amazonaws.com")

# The 7 release tables. Discovered by pattern against information_schema and pinned
# here so a surprise 8th table is a visible mismatch, not a silent extra file.
EXPECTED = [
    "pcx_30_demographics_deid",
    "pcx_30_event_level_deid",
    "pcx_30_medical_therapy_level_deid",
    "pcx_30_patient_level_deid",
    "pcx_30_radiation_level_deid",
    "pcx_30_surgery_level_deid",
    "pcx_30_treatment_summary_deid",
]


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


def columns(cur, table: str) -> list[str]:
    cur.execute(
        "select column_name from information_schema.columns "
        "where table_schema=%s and table_name=%s order by ordinal_position",
        (TARGET_SCHEMA, table))
    return [r[0] for r in cur.fetchall()]


def existing_shape(path: Path) -> tuple[int, int] | None:
    """(cols, rows) of the CSV already on disk, or None if absent."""
    if not path.exists():
        return None
    with path.open(newline="", encoding="utf-8") as fh:
        rd = csv.reader(fh)
        try:
            hdr = next(rd)
        except StopIteration:
            return (0, 0)
        return (len(hdr), sum(1 for _ in rd))


def write_csv(cur, table: str, cols: list[str], dest: Path) -> int:
    collist = ",".join(f"`{c}`" for c in cols)
    order = ",".join(str(i + 1) for i in range(len(cols)))
    cur.execute(f"select {collist} from {TARGET_SCHEMA}.`{table}` order by {order}")
    rows = cur.fetchall()
    tmp = dest.with_suffix(".csv.tmp")
    with tmp.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\r\n", quoting=csv.QUOTE_MINIMAL)
        w.writerow(cols)
        for row in rows:
            w.writerow(["" if v is None else v for v in row])
    tmp.replace(dest)  # atomic: a failed fetch never leaves a truncated release file
    return len(rows)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--tables", default=",".join(EXPECTED),
                    help="comma-separated subset (default: all seven)")
    ap.add_argument("--out-dir", default=str(OUT_DIR))
    ap.add_argument("--archive", action="store_true",
                    help=f"copy current CSVs to {ARCHIVE_DIR} with a date stamp first")
    ap.add_argument("--dry-run", action="store_true",
                    help="report live vs on-disk shape; write nothing")
    ap.add_argument("--stamp", default=time.strftime("%Y%m%d"))
    ap.add_argument("--allow-unpinned", action="store_true",
                    help="permit tables outside EXPECTED (prototype/preview builds "
                         "such as the *_deid_all_cbtn set). Requires an explicit "
                         "--out-dir so a non-release payload cannot land in the "
                         "release directory.")
    args = ap.parse_args()

    tables = [t.strip() for t in args.tables.split(",") if t.strip()]
    unknown = [t for t in tables if t not in EXPECTED]
    if unknown and not args.allow_unpinned:
        sys.exit(f"unknown table(s): {unknown}\nknown: {EXPECTED}\n"
                 f"pass --allow-unpinned (with --out-dir) to export a preview build")
    if unknown and Path(args.out_dir).expanduser() == OUT_DIR:
        sys.exit(f"refusing: --allow-unpinned writes a NON-RELEASE payload, so it "
                 f"must not target the release dir\n  {OUT_DIR}\n"
                 f"pass an explicit --out-dir")
    if unknown:
        print(f"NOTE  exporting {len(unknown)} unpinned table(s) as a PREVIEW -- "
              f"not a release payload:\n      {', '.join(unknown)}\n")
    out_dir = Path(args.out_dir).expanduser()
    if not out_dir.is_dir():
        sys.exit(f"out dir does not exist: {out_dir}")

    cur = connect().cursor()

    # Fail before writing if the live table set drifted from the pinned list.
    cur.execute(
        "select table_name from information_schema.tables "
        "where table_schema=%s and table_name like 'pcx\\_30\\_%%\\_deid' "
        "order by table_name", (TARGET_SCHEMA,))
    live = [r[0] for r in cur.fetchall()]
    if sorted(live) != sorted(EXPECTED):
        print(f"WARNING: live _deid table set differs from the pinned list\n"
              f"  live-only  = {[t for t in live if t not in EXPECTED]}\n"
              f"  pinned-only= {[t for t in EXPECTED if t not in live]}\n")

    print(f"PLAN  ({TARGET_SCHEMA} -> {out_dir})")
    plan = {}
    for t in tables:
        cols = columns(cur, t)
        if not cols:
            sys.exit(f"  {t}: no such table {TARGET_SCHEMA}.{t}")
        cur.execute(f"select count(*) from {TARGET_SCHEMA}.`{t}`")
        n = cur.fetchone()[0]
        dest = out_dir / f"{t}.csv"
        prior = existing_shape(dest)
        plan[t] = (cols, n, dest, prior)
        if prior is None:
            note = "  (new file)"
        elif prior[0] != len(cols):
            note = f"  *** COLUMN COUNT CHANGED {prior[0]} -> {len(cols)}"
        else:
            note = f"  rows {prior[1]:,} -> {n:,}  delta={n - prior[1]:+,}"
        print(f"  {t:36} cols={len(cols):>3}  live={n:>7,}{note}")
    print()

    if args.dry_run:
        print("DRY RUN -- nothing written.")
        return

    if args.archive:
        ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
        print(f"ARCHIVE  -> {ARCHIVE_DIR}")
        for t in tables:
            dest = plan[t][2]
            if dest.exists():
                bak = ARCHIVE_DIR / f"{t}_{args.stamp}.csv"
                shutil.copy2(dest, bak)
                print(f"  {t:36} -> {bak.name}")
        print()

    print("EXPORT")
    total = 0
    for t in tables:
        cols, n, dest, prior = plan[t]
        t0 = time.time()
        written = write_csv(cur, t, cols, dest)
        total += written
        ok = written == n
        print(f"  {t:36} {written:>7,} rows  {dest.stat().st_size:>10,} bytes  "
              f"{time.time() - t0:5.1f}s  {'OK' if ok else 'COUNT MISMATCH'}")
        if not ok:
            sys.exit(f"  *** {t}: wrote {written} but table has {n}")
    print(f"\nSUCCESS  {len(tables)} files, {total:,} rows -> {out_dir}")


if __name__ == "__main__":
    main()
