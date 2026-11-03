#!/usr/bin/env python3
"""Load BRIM PATIENT-LEVEL exports into radiant_data_dev.brim_patient_level.

    load_brim_patient_level.py --project-id 54 --dry-run <file.csv> [...]
    load_brim_patient_level.py --project-id 54 [--replace] <file.csv> [...]

Needs pymysql -- use starrocks-dbt/.starrocks-dbt/bin/python3.

NOT load_brim_outputs.py. That one loads the DETAILED export (one row per label
per note, 28 fixed columns) into brim_output; this one loads the PATIENT-LEVEL
export (one wide row per patient, columns ARE variable names). Each script
refuses the other's shape: that one rejects unrecognised columns, this one
requires Patient_MRN first and refuses a header containing Note_id.

It UNPIVOTS to one row per (patient, variable). The export's width changes when
the project gains a variable -- measured 93 -> 94 in a single day -- so a wide
table would need a migration per variable and vintages would not be
union-compatible.

THE HEADER IS DATA, so there is nothing to validate it against: every column is
legitimately new the first time a variable appears. What is checked instead are
the invariants -- Patient_MRN first, no ragged rows, no duplicate variable name
within a file, at least one data row.

APPEND-ONLY, so re-running is the hazard. No primary key, so a second load of the
same file silently doubles its rows; this refuses a basename already in
source_file unless --replace. Note the basename carries the export DATE, so
re-exporting the same patient tomorrow IS accepted as a new vintage -- intended,
since these values move, but consumers must then pick one per patient.

Parameterised INSERT via pymysql, never interpolation (values contain commas and
double quotes). Port 80 batched INSERT, because FE 8030 / BE 8040 are filtered on
prod CelerData -- see UPSTREAM_SOURCES.md section 5.

Values load VERBATIM including the empty string, matching this directory's
contract; downstream must test trim(coalesce(value,''))=''. project_id is STAMPED
from --project-id, not parsed: the export does not carry it, and brim_output's
lesson is that an export table accumulates unrelated projects (that one mixes
six) and every consumer then reverse-engineers which is which.
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
TARGET_TABLE = "brim_patient_level"
PATIENT_KEY = "Patient_MRN"
STARROCKS_ENV = Path.home() / ".radiant/starrocks-prod.env"
STARROCKS_HOST = ("celerdata-private-nlb-hnsIFJjH-"
                  "47198fe90f6ce7c2.elb.us-east-1.amazonaws.com")

INSERT_COLS = ("patient_id", "variable_name", "value", "project_id",
               "column_ordinal", "source_file", "loaded_at")


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


def assert_table(cur) -> None:
    cur.execute(
        "select count(*) from information_schema.columns "
        "where table_schema=%s and table_name=%s", (TARGET_SCHEMA, TARGET_TABLE))
    if not cur.fetchone()[0]:
        sys.exit(f"{TARGET_SCHEMA}.{TARGET_TABLE} does not exist -- apply "
                 f"radiant-prod/tables/brim_patient_level_table.sql first")


def unpivot(path: Path) -> tuple[list[tuple[str, str, str, int]], int, int]:
    """Read a patient-level export into (patient, variable, value, ordinal) rows.

    Returns (rows, n_patients, n_variables).
    """
    with path.open(newline="", encoding="utf-8-sig") as fh:
        table = list(csv.reader(fh))
    if not table:
        sys.exit(f"  {path.name}: file is empty")
    header, data = table[0], table[1:]

    if "Note_id" in header:
        sys.exit(f"  {path.name}: this is a DETAILED export, not a patient-level "
                 f"one (header carries Note_id).\n"
                 f"    load it with load_brim_outputs.py, into brim_output")
    if not header or header[0] != PATIENT_KEY:
        sys.exit(f"  {path.name}: expected {PATIENT_KEY!r} as the first column, "
                 f"got {header[:3]}")
    if not data:
        sys.exit(f"  {path.name}: header but no data rows")

    widths = {len(r) for r in data}
    if widths != {len(header)}:
        sys.exit(f"  {path.name}: ragged rows, widths {sorted(widths)}, "
                 f"expected {len(header)}")

    variables = header[1:]
    dupes = {v for v in variables if variables.count(v) > 1}
    if dupes:
        sys.exit(f"  {path.name}: duplicate variable column(s) {sorted(dupes)} -- "
                 f"the unpivoted rows would be ambiguous")

    rows = []
    for rec in data:
        mrn = rec[0]
        if not mrn.strip():
            sys.exit(f"  {path.name}: a data row has an empty {PATIENT_KEY}")
        for i, (name, val) in enumerate(zip(variables, rec[1:]), start=1):
            rows.append((mrn, name, val, i))
    return rows, len(data), len(variables)


def flush(cur, head: str, placeholder: str, batch) -> int:
    cur.execute(head + ",".join([placeholder] * len(batch)),
                [v for row in batch for v in row])
    return len(batch)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+", help="BRIM patient-level export CSV(s)")
    ap.add_argument("--project-id", required=True,
                    help="BRIM project the export came from (stamped, not parsed)")
    ap.add_argument("--dry-run", action="store_true", help="preflight only; write nothing")
    ap.add_argument("--replace", action="store_true",
                    help="if a file's rows are already present, DELETE them and re-load")
    ap.add_argument("--batch-size", type=int, default=500)
    args = ap.parse_args()

    cur = connect().cursor()
    assert_table(cur)

    print(f"PREFLIGHT  (-> {TARGET_SCHEMA}.{TARGET_TABLE}, append-only, "
          f"project {args.project_id})")
    plan, blocked = [], []
    for f in args.files:
        p = Path(f).expanduser()
        if not p.exists():
            sys.exit(f"  {p}: no such file")
        rows, n_pat, n_var = unpivot(p)
        cur.execute(f"select count(*) from {TARGET_SCHEMA}.`{TARGET_TABLE}` "
                    f"where source_file=%s", (p.name,))
        already = cur.fetchone()[0]
        note = f"  {n_pat} patient(s) x {n_var} vars = {len(rows):,} rows"
        if already:
            note += f"  *** {already:,} rows ALREADY LOADED"
            if not args.replace:
                blocked.append(p.name)
        print(f"  {p.name[:56]:56}{note}")
        plan.append((p, rows, already))

    cur.execute(f"select count(*) from {TARGET_SCHEMA}.`{TARGET_TABLE}`")
    before = cur.fetchone()[0]
    print(f"  table currently holds {before:,} rows\n")

    if blocked:
        sys.exit(f"REFUSING: already loaded {blocked}. Re-run with --replace to "
                 f"delete those rows and load again, or drop the file from the list.")

    if args.dry_run:
        print("DRY RUN -- nothing written.")
        return

    stamp = time.strftime("%Y-%m-%d %H:%M:%S")
    collist = ",".join(f"`{c}`" for c in INSERT_COLS)
    placeholder = "(" + ",".join(["%s"] * len(INSERT_COLS)) + ")"
    head = f"insert into {TARGET_SCHEMA}.`{TARGET_TABLE}` ({collist}) values "

    print(f"LOAD  (batch={args.batch_size}, loaded_at={stamp})")
    total = 0
    for p, rows, already in plan:
        t0 = time.time()
        if already and args.replace:
            cur.execute(f"delete from {TARGET_SCHEMA}.`{TARGET_TABLE}` "
                        f"where source_file=%s", (p.name,))
            print(f"  {p.name[:56]:56} deleted {already:,} prior rows")
        payload = [(mrn, name, val, args.project_id, ordinal, p.name, stamp)
                   for mrn, name, val, ordinal in rows]
        sent = 0
        try:
            for i in range(0, len(payload), args.batch_size):
                sent += flush(cur, head, placeholder,
                              payload[i:i + args.batch_size])
        except Exception as exc:  # noqa: BLE001 - must say which file is partial
            print(f"\n  *** FAILED on {p.name}: {exc}")
            print(f"  *** that file is PARTIALLY loaded. Clean up with:")
            print(f"  ***   delete from {TARGET_SCHEMA}.{TARGET_TABLE} "
                  f"where source_file='{p.name}';")
            sys.exit(1)
        cur.execute(f"select count(*) from {TARGET_SCHEMA}.`{TARGET_TABLE}` "
                    f"where source_file=%s", (p.name,))
        landed = cur.fetchone()[0]
        ok = landed == len(rows) == sent
        total += sent
        print(f"  {p.name[:56]:56} {sent:>6,} sent, {landed:>6,} present  "
              f"{time.time() - t0:5.1f}s  {'OK' if ok else 'COUNT MISMATCH'}")
        if not ok:
            sys.exit(f"  *** {p.name}: expected {len(rows)}, sent {sent}, "
                     f"present {landed}")

    cur.execute(f"select count(*) from {TARGET_SCHEMA}.`{TARGET_TABLE}`")
    after = cur.fetchone()[0]
    print(f"\nSUCCESS  {len(plan)} file(s), {total:,} rows inserted; "
          f"table {before:,} -> {after:,}")


if __name__ == "__main__":
    main()
