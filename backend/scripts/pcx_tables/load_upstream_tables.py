#!/usr/bin/env python3
"""Extract the pcx_30 upstream tables from their warehouses and load them into StarRocks.

Companion to UPSTREAM_SOURCES.md in this directory; read that first for the source
map, the PHI boundary, and the downstream rebuild order.

    # load today's existing extracts (all five tables)
    python3 load_upstream_tables.py --load

    # extract fresh, then load
    python3 load_upstream_tables.py --extract --load

    # check everything without writing to StarRocks
    python3 load_upstream_tables.py --load --dry-run

    # one table only
    python3 load_upstream_tables.py --extract --load --tables updates

WHY IT IS BUILT THIS WAY

* Port 80, batched INSERT. FE 8030 / BE 8040 are filtered on the prod CelerData
  cluster, so Stream Load is unavailable, and the cluster's instance profile cannot
  read the radiant-tst staging bucket (403), so S3 FILES()/Broker Load is not an
  option either. Measured throughput over port 80 plateaus near 720 rows/s at a batch
  size of ~2000; smaller batches pay a ~900 ms fixed cost per statement.

* `\\N` is the NULL marker in the extracts, NOT an empty field. `participants`
  contains genuine empty strings, so the CSV default (NULL and '' both render empty)
  would silently convert 70 empty strings to NULL or vice versa. Verified no real
  value anywhere contains a literal `\\N` before adopting the marker.

* Parameterised INSERT via pymysql, never string interpolation. `diagnosis` has
  16,406 rows containing commas, `treatment` has 247 containing double quotes and 5
  containing newlines. Hand-escaping that is how you corrupt a load.

* PREFLIGHT EVERY TABLE BEFORE TRUNCATING ANY. A header mismatch on table 5 must not
  leave tables 1-4 already destroyed. Preflight checks the CSV exists, parses, has
  uniform row width, and that its header matches the StarRocks column order exactly.

* Truncate-and-load is NOT atomic. There is a window where a table is empty, and a
  mid-load failure leaves it partial. The script reports this loudly and names the
  table. `ALTER TABLE ... SWAP WITH` would avoid it but needs a privilege this login
  does not have (USAGE on builtin_storage_volume) and rejects a schema-qualified
  target.

* Loads all requested tables in one run by design. Every pcx_30 object joins across
  these sources, so a partial refresh produces a cohort assembled from mixed vintages
  and silently drops patients at the inner join rather than erroring.

AFTER A SUCCESSFUL LOAD the downstream objects are stale. Run the 8-stage rebuild in
UPSTREAM_SOURCES.md section 5, then the four verification queries in section 7.
"""
from __future__ import annotations

import argparse
import csv
import os
import shlex
import subprocess
import sys
import time
from pathlib import Path

csv.field_size_limit(sys.maxsize)

NULL_MARKER = "\\N"
TARGET_SCHEMA = "radiant_data_dev"
EXTRACT_DIR = Path.home() / "radiant_extracts"

# table -> (credential profile, source schema)
REGISTRY = {
    "participants":              ("deid",       "prod_access"),
    "diagnosis":                 ("deid",       "prod_access"),
    "treatment":                 ("deid",       "prod_access"),
    "updates":                   ("deid",       "prod_access"),
    "stg_cbtn_enrollment_final": ("identified", "stg_cbtn"),
}

PROFILES = {
    "deid":       (Path.home() / ".radiant/dwh-prod-access.env", "DWH"),
    "identified": (Path.home() / ".radiant/dwh-identified.env",  "DWH_ID"),
}
STARROCKS_ENV = Path.home() / ".radiant/starrocks-prod.env"


def read_env(path: Path) -> dict[str, str]:
    """Parse an `export K=V` credential file. Never logs values."""
    if not path.exists():
        sys.exit(f"missing credential file {path}\n"
                 f"  create it with: bash ~/.radiant/set-dwh-creds.sh --profile <deid|identified>")
    out = {}
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line.startswith("export ") or "=" not in line:
            continue
        k, v = line[len("export "):].split("=", 1)
        parts = shlex.split(v)
        out[k.strip()] = parts[0] if parts else ""
    return out


# ---------------------------------------------------------------- extract

def extract(table: str, stamp: str) -> Path:
    profile, schema = REGISTRY[table]
    env_path, prefix = PROFILES[profile]
    cfg = read_env(env_path)
    dest = EXTRACT_DIR / f"{table}_{stamp}.csv"
    EXTRACT_DIR.mkdir(mode=0o700, exist_ok=True)

    copy = (f'\\copy (select * from {schema}."{table}") to \'{dest}\' '
            f"with (format csv, header true, quote '\"', null '{NULL_MARKER}')")
    env = dict(os.environ, PGPASSWORD=cfg[f"{prefix}_PASSWORD"])
    t0 = time.time()
    r = subprocess.run(
        ["psql", "-h", cfg[f"{prefix}_HOST"], "-p", str(cfg[f"{prefix}_PORT"]),
         "-U", cfg[f"{prefix}_USER"], "-d", cfg[f"{prefix}_DATABASE"], "-q", "-c", copy],
        capture_output=True, text=True, env=env,
    )
    if r.returncode != 0:
        sys.exit(f"  extract FAILED for {table}: {(r.stderr or r.stdout).strip()[:300]}")
    dest.chmod(0o600)
    print(f"  {table:26} extracted {dest.stat().st_size:>12,} bytes in {time.time()-t0:5.1f}s"
          f"{'   [PHI]' if profile == 'identified' else ''}")
    return dest


# ---------------------------------------------------------------- StarRocks

def connect_starrocks():
    try:
        import pymysql
    except ImportError:
        sys.exit("pymysql is required:  python3 -m pip install pymysql")
    cfg = read_env(STARROCKS_ENV)
    return pymysql.connect(
        host="celerdata-private-nlb-hnsIFJjH-47198fe90f6ce7c2.elb.us-east-1.amazonaws.com",
        port=80, user=cfg["STARROCKS_PROD_USER"], password=cfg["STARROCKS_PROD_PASSWORD"],
        autocommit=True, charset="utf8mb4", local_infile=False,
    )


def target_columns(cur, table: str) -> list[str]:
    cur.execute(
        "select column_name from information_schema.columns "
        "where table_schema=%s and table_name=%s order by ordinal_position",
        (TARGET_SCHEMA, table))
    return [r[0] for r in cur.fetchall()]


def row_count(cur, table: str) -> int:
    cur.execute(f"select count(*) from {TARGET_SCHEMA}.`{table}`")
    return cur.fetchone()[0]


def preflight(cur, table: str, path: Path) -> tuple[list[str], int]:
    """Validate the extract against the live table. Exits on any mismatch."""
    if not path.exists():
        sys.exit(f"  {table}: extract not found at {path}  (run with --extract)")
    with path.open(newline="") as fh:
        rd = csv.reader(fh)
        try:
            header = next(rd)
        except StopIteration:
            sys.exit(f"  {table}: extract is empty")
        widths, n = set(), 0
        for row in rd:
            widths.add(len(row))
            n += 1
    cols = target_columns(cur, table)
    if not cols:
        sys.exit(f"  {table}: no such table {TARGET_SCHEMA}.{table}")
    if header != cols:
        extra = [c for c in header if c not in cols]
        missing = [c for c in cols if c not in header]
        detail = (f"csv-only={extra} target-only={missing}" if (extra or missing)
                  else "same columns, ORDER differs")
        sys.exit(f"  {table}: header does not match {TARGET_SCHEMA}.{table} -- {detail}")
    if n == 0:
        sys.exit(f"  {table}: extract has a header but no data rows -- refusing to truncate")
    if widths != {len(cols)}:
        sys.exit(f"  {table}: ragged rows, widths seen {sorted(widths)}, expected {len(cols)}")
    return cols, n


def load(cur, table: str, path: Path, cols: list[str], batch_size: int) -> int:
    placeholder = "(" + ",".join(["%s"] * len(cols)) + ")"
    collist = ",".join(f"`{c}`" for c in cols)
    stmt_head = f"insert into {TARGET_SCHEMA}.`{table}` ({collist}) values "
    sent = 0
    with path.open(newline="") as fh:
        rd = csv.reader(fh)
        next(rd)
        batch: list[list] = []
        for row in rd:
            batch.append([None if v == NULL_MARKER else v for v in row])
            if len(batch) >= batch_size:
                sent += flush(cur, stmt_head, placeholder, batch)
                batch = []
        if batch:
            sent += flush(cur, stmt_head, placeholder, batch)
    return sent


def flush(cur, stmt_head: str, placeholder: str, batch: list[list]) -> int:
    sql = stmt_head + ",".join([placeholder] * len(batch))
    cur.execute(sql, [v for row in batch for v in row])
    return len(batch)


# ---------------------------------------------------------------- main

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--tables", default=",".join(REGISTRY),
                    help="comma-separated subset (default: all five)")
    ap.add_argument("--extract", action="store_true", help="re-extract from the warehouses first")
    ap.add_argument("--load", action="store_true", help="load extracts into StarRocks")
    ap.add_argument("--dry-run", action="store_true",
                    help="preflight and report only; never truncates or inserts")
    ap.add_argument("--batch-size", type=int, default=2000,
                    help="rows per INSERT (default 2000, where throughput plateaus)")
    ap.add_argument("--stamp", default=time.strftime("%Y%m%d"),
                    help="extract vintage YYYYMMDD (default today)")
    args = ap.parse_args()

    tables = [t.strip() for t in args.tables.split(",") if t.strip()]
    unknown = [t for t in tables if t not in REGISTRY]
    if unknown:
        sys.exit(f"unknown table(s): {unknown}\nknown: {list(REGISTRY)}")
    if not (args.extract or args.load):
        sys.exit("nothing to do: pass --extract and/or --load")

    if len(tables) < len(REGISTRY) and args.load and not args.dry_run:
        print("WARNING: loading a SUBSET of the upstream tables. Every pcx_30 object joins\n"
              "         across these sources, so a partial refresh leaves radiant_data_dev at\n"
              "         mixed vintages and silently drops patients at the inner join.\n"
              f"         loading: {tables}\n"
              f"         skipping: {[t for t in REGISTRY if t not in tables]}\n")

    if args.extract:
        print(f"EXTRACT  (vintage {args.stamp}) -> {EXTRACT_DIR}")
        for t in tables:
            extract(t, args.stamp)
        print()

    if not args.load:
        return

    conn = connect_starrocks()
    cur = conn.cursor()

    print("PREFLIGHT  (all tables validated before anything is truncated)")
    plan = {}
    for t in tables:
        path = EXTRACT_DIR / f"{t}_{args.stamp}.csv"
        cols, n = preflight(cur, t, path)
        before = row_count(cur, t)
        plan[t] = (path, cols, n, before)
        delta = n - before
        print(f"  {t:26} cols={len(cols):>3}  csv={n:>7,}  live={before:>7,}  delta={delta:+,}")
    print("  all extracts match their target schema\n")

    if args.dry_run:
        print("DRY RUN -- nothing written. Re-run without --dry-run to apply.")
        return

    print(f"LOAD  (truncate + batched insert, batch={args.batch_size:,})")
    results, failed = [], None
    for t in tables:
        path, cols, n, before = plan[t]
        t0 = time.time()
        try:
            cur.execute(f"truncate table {TARGET_SCHEMA}.`{t}`")
            sent = load(cur, t, path, cols, args.batch_size)
            after = row_count(cur, t)
        except Exception as exc:  # noqa: BLE001 - must report which table is partial
            failed = t
            print(f"\n  *** FAILED on {t}: {exc}")
            print(f"  *** {TARGET_SCHEMA}.{t} IS NOW PARTIAL OR EMPTY -- it was truncated.")
            print(f"  *** Re-run: --load --tables {t} --stamp {args.stamp}")
            break
        dt = time.time() - t0
        ok = after == n == sent
        results.append((t, before, after, dt, ok))
        print(f"  {t:26} {before:>7,} -> {after:>7,} rows in {dt:6.1f}s "
              f"({n/dt:>6,.0f} rows/s)  {'OK' if ok else 'COUNT MISMATCH'}")

    print()
    if failed:
        sys.exit(f"ABORTED at {failed}. Tables before it are loaded; {failed} and any after it are not.")
    bad = [r[0] for r in results if not r[4]]
    if bad:
        sys.exit(f"loaded with COUNT MISMATCH on: {bad}")
    total = sum(r[2] for r in results)
    secs = sum(r[3] for r in results)
    print(f"SUCCESS  {len(results)} tables, {total:,} rows, {secs:.1f}s total")
    print("\nDownstream objects are now STALE. Next:")
    print("  1. rebuild stages 2-8 from UPSTREAM_SOURCES.md section 5")
    print("  2. run the four verification queries in section 7")


if __name__ == "__main__":
    main()
