#!/usr/bin/env python3
"""Fill radiant_data_dev.pcx_30_patient_key: a URL key for every pcx_30 patient that has none.

    # report the gap, write nothing (default)
    starrocks-dbt/.starrocks-dbt/bin/python3 fill_patient_keys.py

    # mint and insert the missing keys
    starrocks-dbt/.starrocks-dbt/bin/python3 fill_patient_keys.py --apply

    # move one patient's existing key to another organization, keeping the key value
    starrocks-dbt/.starrocks-dbt/bin/python3 fill_patient_keys.py \
        --move-patient C0000000 --to-org SCH-DEMO --apply

THE CONTRACT THIS IMPLEMENTS lives in the portal's ../seed/sql/pcx_30_patient_key.sql,
which calls itself "the contract for the other team" -- i.e. this one. Read it first.
Its three rules, and how each is kept here:

  1. "add a key for every patient that has none, NEVER CHANGE AN EXISTING ONE (links
     must keep working)". The insert is guarded by LEFT JOIN ... WHERE patient_key IS
     NULL, and because the table is PRIMARY KEY (organization_code, mrn) an unguarded
     insert would silently UPSERT and overwrite a live key. So the guard is not
     belt-and-braces, it is the whole safety property. --apply additionally snapshots
     the table to pcx_30_patient_key_bak_<stamp> first and then PROVES every
     pre-existing (organization_code, mrn, patient_key) triple survived; a single
     changed key fails the run and leaves the backup for recovery.
  2. "a key must be unguessable, so generate it outside StarRocks with a cryptographic
     random source". uuid.uuid4() here. StarRocks' uuid() is a time-and-counter value
     (one key gives away its neighbours) and rand() is not cryptographic.
  3. "never derive it from an identifier: a hash of an MRN can be brute-forced". The
     keys are generated with no knowledge of the row they will land on.

WHY IT DOES NOT SHIP MRNs, unlike the build_seed.py pattern it is modelled on

build_seed.py::patient_keys builds candidate rows as (org, mrn, uuid4) in Python and
inserts them. That is right for the local seed, whose MRNs are fake and already in the
file it reads. On PRD the MRNs are real PHI that is already in the cluster, so this
script sends only opaque UUIDs with an ordinal and lets StarRocks pair them to the
missing (organization_code, mrn) rows by row_number(). No MRN crosses the wire, and
the pairing is still arbitrary -- row_number() ordering decides which patient gets
which key, which is exactly as meaningless as it should be. The candidate table
therefore has a DIFFERENT shape from the key table, which is the one deliberate
divergence from the sibling implementation.

THE POPULATION is distinct (organization_code, mrn) from
radiant_data_dev.v_pcx_30_demographics_combined -- not the _deid table, not the
roster. That is the exact pair cbtn_tenant.v_pcx_30_patient_key joins the key table
on, so anything else would mint keys that never resolve or miss ones that are needed.

WHY THERE IS NO dbt MODEL FOR THIS. A dbt table model drops and recreates, and every
patient URL in the portal is a row in this table. It belongs with brim_output /
brim_patient_level / pcx_30_pnoc035_brim_url: derivable -> dbt model, irreplaceable ->
standalone CREATE TABLE IF NOT EXISTS plus a script. The DDL is read from the portal
contract file rather than copied, so the two cannot drift.

ORDER MATTERS AGAINST pcx_30_organization_override, AND --move-patient IS THE ANSWER.
A patient this script keys is keyed under the organization_code the views resolve
TODAY. When an override moves a patient to another organization, the key row has to
move with them, because cbtn_tenant.v_pcx_30_patient_key joins the key table on
(organization_code, mrn) and would otherwise find nothing. Do NOT let --apply supply
the new row: it would mint a FRESH uuid4 and change the patient's URL, and rule 1
then prevents putting it back. Use

    fill_patient_keys.py --move-patient C0000000 --to-org SCH-DEMO --apply

which carries the SAME patient_key onto the new (organization_code, mrn) pair and
removes the old one. organization_code is part of the PRIMARY KEY, so an in-place
UPDATE is not available -- this is an insert-then-delete that preserves the key
value. Rule 1 is about the KEY, not the row address: the URL keeps working, which is
the property the rule exists for. Reverting an override is the same command with the
original code.

A MOVE, NOT A SECOND ROW. Adding the new pair and leaving the old one would also keep
links working, but it leaves the table permanently holding an orphaned row and one
patient_key on two rows -- both of which this script's own preflight reports as
anomalies, and neither of which is true. One patient, one organization, one key row.

ORPHANED KEYS ARE NEVER DELETED by --apply. A key whose (organization_code, mrn) no
longer appears in demographics is reported and kept: the patient may return, and rule
1 is about links surviving rather than tidiness. --move-patient is the only mode that
removes a row, and it removes exactly the one it just copied.

AFTER A SUCCESSFUL RUN nothing downstream needs rebuilding --
cbtn_tenant.v_pcx_30_patient_key and v_pcx_30_patient_list are views and pick the new
rows up on the next read.
"""
from __future__ import annotations

import argparse
import shlex
import sys
import time
import uuid
from pathlib import Path

HERE = Path(__file__).resolve().parent
STARROCKS_ENV = Path.home() / ".radiant/starrocks-prod.env"

# The prod FE endpoint is deliberately NOT in the repo. It is read from
# STARROCKS_PROD_HOST in the credential file above, beside the user and password that
# file already supplies. Docs refer to it as <starrocks-prod-host>.

# The authoritative DDL + contract. Same repo, different tree: the portal owns the
# contract, this script implements it.
CONTRACT_SQL = HERE.parent / "seed" / "sql" / "pcx_30_patient_key.sql"

DB = "radiant_data_dev"
KEY_TABLE = f"{DB}.pcx_30_patient_key"
POPULATION = f"{DB}.v_pcx_30_demographics_combined"
CANDIDATE = f"{DB}.pcx_30_patient_key_candidate"

# Measured 720 rows/s over port 80; these rows are ~50 bytes so the packet limit is
# never the constraint and a larger batch just reduces the ~900 ms per-statement cost.
BATCH_ROWS = 2000


def read_env(path: Path) -> dict[str, str]:
    """Parse an `export K=V` credential file. Never logs values."""
    if not path.exists():
        sys.exit(f"missing credential file {path}\n"
                 f"  set the password with: bash ~/.radiant/set-starrocks-prod-pw.sh")
    out = {}
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line.startswith("export ") or "=" not in line:
            continue
        k, v = line[len("export "):].split("=", 1)
        parts = shlex.split(v)
        out[k.strip()] = parts[0] if parts else ""
    return out


def starrocks_host(cfg: dict[str, str]) -> str:
    """The prod FE endpoint, from the credential file -- never hardcoded here."""
    host = cfg.get("STARROCKS_PROD_HOST", "").strip()
    if not host:
        sys.exit(f"STARROCKS_PROD_HOST is not set in {STARROCKS_ENV}\n"
                 f"  add:  export STARROCKS_PROD_HOST=<starrocks-prod-host>")
    return host


def connect_starrocks():
    try:
        import pymysql
    except ImportError:
        sys.exit("pymysql is required; use starrocks-dbt/.starrocks-dbt/bin/python3")
    cfg = read_env(STARROCKS_ENV)
    return pymysql.connect(
        host=starrocks_host(cfg), port=80,
        user=cfg["STARROCKS_PROD_USER"], password=cfg["STARROCKS_PROD_PASSWORD"],
        autocommit=True, charset="utf8mb4", local_infile=False,
    )


def scalar(cur, sql: str):
    cur.execute(sql)
    return cur.fetchone()[0]


def key_table_ddl() -> str:
    """The CREATE TABLE of the contract file, verbatim from 'CREATE TABLE' onward."""
    if not CONTRACT_SQL.exists():
        sys.exit(f"missing contract file {CONTRACT_SQL}\n"
                 f"  it carries the authoritative DDL; do not re-type it here")
    text = CONTRACT_SQL.read_text(encoding="utf-8")
    if "CREATE TABLE" not in text:
        sys.exit(f"{CONTRACT_SQL} no longer contains a CREATE TABLE -- read it before proceeding")
    ddl = text[text.index("CREATE TABLE"):].rstrip()
    if KEY_TABLE not in ddl:
        sys.exit(f"{CONTRACT_SQL} names a different table than {KEY_TABLE}:\n  {ddl.splitlines()[0]}")
    return ddl


# ---------------------------------------------------------------- preflight

MISSING_SQL = f"""
select d.organization_code, d.mrn
from (select distinct organization_code, mrn from {POPULATION}) d
left join {KEY_TABLE} k
       on k.organization_code = d.organization_code and k.mrn = d.mrn
where k.mrn is null
"""


def preflight(cur) -> int:
    """Measure the gap and refuse on anything that would mint a junk or duplicate key."""
    needed = scalar(cur, f"select count(*) from (select distinct organization_code, mrn from {POPULATION}) x")
    held = scalar(cur, f"select count(*) from {KEY_TABLE}")
    missing = scalar(cur, f"select count(*) from ({MISSING_SQL}) x")
    orphaned = scalar(cur, f"""
        select count(*) from (
            select k.organization_code, k.mrn from {KEY_TABLE} k
            left join (select distinct organization_code, mrn from {POPULATION}) d
                   on k.organization_code = d.organization_code and k.mrn = d.mrn
            where d.mrn is null) x""")
    dup_keys = scalar(cur, f"""
        select count(*) from (
            select patient_key from {KEY_TABLE} group by patient_key having count(*) > 1) x""")

    print(f"  population  {POPULATION}")
    print(f"  needed      {needed:>7,}  distinct (organization_code, mrn)")
    print(f"  held        {held:>7,}  keys already minted")
    print(f"  missing     {missing:>7,}  keys this run would add")
    print(f"  orphaned    {orphaned:>7,}  keys with no current row (KEPT, never deleted)")
    print(f"  shared keys {dup_keys:>7,}  patient_key values on more than one row")

    # A NULL or blank identifier cannot be keyed, and a row minted for one is a
    # permanent junk key in a table whose rows are never changed. Refuse instead.
    bad = scalar(cur, f"""
        select count(*) from {POPULATION}
        where organization_code is null or trim(organization_code) = ''
           or mrn is null or trim(mrn) = ''""")
    if bad:
        sys.exit(f"REFUSING: {bad:,} rows in {POPULATION} have a NULL/blank "
                 f"organization_code or mrn. A key minted for one can never be changed. "
                 f"Fix the organization resolution first (a NULL organization_code also "
                 f"fails closed in the access-controlled views).")

    if dup_keys:
        print(f"  NOTE: {dup_keys} patient_key value(s) appear on more than one row. That is "
              f"expected only where a key was deliberately copied onto a second "
              f"(organization_code, mrn) pair to keep a URL stable across an organization "
              f"override. Confirm it is that, and not a minting bug, before --apply.")

    return missing


# ---------------------------------------------------------------- apply

def apply(conn, cur, missing: int, stamp: str, batch_rows: int) -> None:
    ddl = key_table_ddl()
    backup = f"{KEY_TABLE}_bak_{stamp}"

    # 1. The key table is CREATE TABLE IF NOT EXISTS, so this is a no-op when it
    #    exists and the correct bootstrap when it does not.
    cur.execute(ddl)

    # 2. Snapshot BEFORE touching anything. This is both the rollback copy and the
    #    evidence for the never-change-an-existing-key proof below.
    #    DDL-then-INSERT rather than CTAS: a CTAS cannot carry the PRIMARY KEY, and
    #    copying a `show create table` body instead would carry a storage_volume
    #    property that this login has no USAGE privilege for on PRD.
    held_before = scalar(cur, f"select count(*) from {KEY_TABLE}")
    cur.execute(f"drop table if exists {backup}")
    cur.execute(ddl.replace("IF NOT EXISTS ", "").replace(KEY_TABLE, backup))
    cur.execute(f"insert into {backup} (organization_code, mrn, patient_key) "
                f"select organization_code, mrn, patient_key from {KEY_TABLE}")
    if scalar(cur, f"select count(*) from {backup}") != held_before:
        sys.exit(f"REFUSING: backup {backup} does not match {KEY_TABLE}; nothing was written")
    print(f"  backup      {backup}  ({held_before:,} rows)")

    # 3. Candidate table: ordinal -> uuid4. No MRN crosses the wire; see the header.
    cur.execute(f"drop table if exists {CANDIDATE}")
    cur.execute(f"create table {CANDIDATE} (n bigint not null, patient_key varchar(36) not null) "
                f"primary key (n) distributed by hash (n) buckets 1 "
                f'properties ("replication_num" = "1")')
    rows = [(i + 1, str(uuid.uuid4())) for i in range(missing)]
    if len({k for _, k in rows}) != missing:
        sys.exit("REFUSING: uuid4 collision -- re-run")  # cannot happen; asserted anyway
    t0 = time.time()
    for i in range(0, missing, batch_rows):
        chunk = rows[i:i + batch_rows]
        cur.executemany(f"insert into {CANDIDATE} (n, patient_key) values (%s, %s)", chunk)
    if scalar(cur, f"select count(*) from {CANDIDATE}") != missing:
        sys.exit(f"REFUSING: {CANDIDATE} is short; nothing was written to {KEY_TABLE}. "
                 f"Backup kept at {backup}")
    print(f"  candidates  {missing:,} uuid4 keys loaded in {time.time() - t0:.1f}s")

    # 4. The guarded insert. WHERE patient_key IS NULL is the safety property: the key
    #    table is PRIMARY KEY, so an unguarded insert UPSERTS and overwrites live keys.
    #    row_number() pairs an arbitrary-but-stable ordinal to each missing row; the
    #    ordering is unique because (organization_code, mrn) is distinct here.
    cur.execute(f"""
        insert into {KEY_TABLE} (organization_code, mrn, patient_key)
        select m.organization_code, m.mrn, c.patient_key
        from (
            select organization_code, mrn,
                   row_number() over (order by organization_code, mrn) as n
            from ({MISSING_SQL}) missing
        ) m
        join {CANDIDATE} c on c.n = m.n""")

    # 5. Prove it. Three assertions, each catching a different failure.
    held_after = scalar(cur, f"select count(*) from {KEY_TABLE}")
    still_missing = scalar(cur, f"select count(*) from ({MISSING_SQL}) x")
    changed = scalar(cur, f"""
        select count(*) from {backup} b
        left join {KEY_TABLE} k
               on k.organization_code = b.organization_code
              and k.mrn = b.mrn
              and k.patient_key = b.patient_key
        where k.mrn is null""")
    dup_after = scalar(cur, f"""
        select count(*) from (
            select patient_key from {KEY_TABLE} group by patient_key having count(*) > 1) x""")

    print(f"  held        {held_before:,} -> {held_after:,}  (+{held_after - held_before:,})")
    print(f"  missing     {still_missing}")
    print(f"  pre-existing keys changed or lost: {changed}")

    problems = []
    if changed:
        problems.append(f"{changed} pre-existing key(s) changed or vanished -- rule 1 violated")
    if still_missing:
        problems.append(f"{still_missing} patient(s) still have no key")
    if held_after != held_before + missing:
        problems.append(f"expected {held_before + missing:,} rows, found {held_after:,}")
    if problems:
        sys.exit("FAILED:\n  - " + "\n  - ".join(problems) +
                 f"\n  {backup} holds the pre-run table; {CANDIDATE} is kept for diagnosis.")

    cur.execute(f"drop table {CANDIDATE}")
    print(f"  OK. {backup} kept as the rollback copy -- drop it once the portal "
          f"patient list is confirmed.")
    if dup_after:
        print(f"  NOTE: {dup_after} patient_key value(s) are on more than one row "
              f"(pre-existing; this run minted only distinct new keys).")


# ---------------------------------------------------------------- move one patient

def resolve_one_key(cur, research_id: str) -> tuple[str, str, str]:
    """(organization_code, mrn, patient_key) of a single patient, resolved by mrn ALONE.

    Deliberately not joined on organization_code: the whole point of a move is that
    the view's organization_code and the key table's have diverged, so a join on it
    would find nothing in exactly the case this mode exists for. Resolving by mrn is
    safe here because the population is 1:1 on (research_id, mrn) -- asserted below
    rather than assumed, since a multi-MRN patient would make "the" key ambiguous.
    """
    cur.execute(f"select distinct mrn from {POPULATION} where research_id = %s", (research_id,))
    mrns = [r[0] for r in cur.fetchall()]
    if len(mrns) != 1:
        sys.exit(f"REFUSING: {research_id} resolves to {len(mrns)} mrn(s) in {POPULATION}; "
                 f"expected exactly 1. A multi-MRN patient has no single key to move.")
    cur.execute(f"select organization_code, mrn, patient_key from {KEY_TABLE} where mrn = %s",
                (mrns[0],))
    rows = cur.fetchall()
    if len(rows) != 1:
        sys.exit(f"REFUSING: {research_id} has {len(rows)} row(s) in {KEY_TABLE}; expected "
                 f"exactly 1. 0 means run --apply first; more than 1 means the table already "
                 f"holds a split this mode would have prevented.")
    return rows[0]


def move_patient(cur, research_id: str, to_org: str, stamp: str, do_apply: bool) -> None:
    from_org, mrn, key = resolve_one_key(cur, research_id)
    # The key value is the URL and is PHI-adjacent only in that it identifies a
    # patient page; the mrn is PHI and is never printed.
    print(f"  patient     {research_id}")
    print(f"  move        {from_org}  ->  {to_org}")
    print(f"  patient_key unchanged (not printed)")

    if from_org == to_org:
        print(f"  already at {to_org}; nothing to do.")
        return

    # The target code must be a real organization, or the move mints a row that can
    # never match a grant and the patient silently loses PHI resolution.
    cur.execute(f"select count(*) from {DB}.pcx_30_organization_ref where code = %s", (to_org,))
    if not cur.fetchone()[0]:
        sys.exit(f"REFUSING: '{to_org}' is not a code in {DB}.pcx_30_organization_ref. "
                 f"Add it there (and confirm the portal owns it) before moving a patient to it.")
    cur.execute(f"select count(*) from {KEY_TABLE} where organization_code = %s and mrn = %s",
                (to_org, mrn))
    if cur.fetchone()[0]:
        sys.exit(f"REFUSING: {KEY_TABLE} already holds a row at ({to_org}, this mrn). "
                 f"Nothing to move; check whether a previous run already did this.")

    if not do_apply:
        print(f"\nREPORT ONLY -- nothing written. Re-run with --apply to move the row.")
        return

    backup = f"{KEY_TABLE}_bak_{stamp}"
    ddl = key_table_ddl()
    held_before = scalar(cur, f"select count(*) from {KEY_TABLE}")
    cur.execute(f"drop table if exists {backup}")
    cur.execute(ddl.replace("IF NOT EXISTS ", "").replace(KEY_TABLE, backup))
    cur.execute(f"insert into {backup} (organization_code, mrn, patient_key) "
                f"select organization_code, mrn, patient_key from {KEY_TABLE}")
    if scalar(cur, f"select count(*) from {backup}") != held_before:
        sys.exit(f"REFUSING: backup {backup} does not match {KEY_TABLE}; nothing was written")
    print(f"  backup      {backup}  ({held_before:,} rows)")

    # Insert FIRST, delete second. In the window between them the patient has two key
    # rows and the view still resolves exactly one (whichever matches demographics),
    # so there is no moment where the patient has no URL. The reverse order would
    # discard the key before it was durable anywhere.
    cur.execute(f"insert into {KEY_TABLE} (organization_code, mrn, patient_key) values (%s, %s, %s)",
                (to_org, mrn, key))
    cur.execute(f"select patient_key from {KEY_TABLE} where organization_code = %s and mrn = %s",
                (to_org, mrn))
    landed = cur.fetchone()
    if not landed or landed[0] != key:
        sys.exit(f"REFUSING to delete the old row: the new ({to_org}, mrn) row is absent or "
                 f"carries a different key. Backup kept at {backup}")
    cur.execute(f"delete from {KEY_TABLE} where organization_code = %s and mrn = %s",
                (from_org, mrn))

    # Prove it: the key survived, there is exactly one row for this patient, the table
    # did not change size, and no OTHER patient's triple moved.
    held_after = scalar(cur, f"select count(*) from {KEY_TABLE}")
    cur.execute(f"select organization_code, patient_key from {KEY_TABLE} where mrn = %s", (mrn,))
    after = cur.fetchall()
    cur.execute(f"""
        select count(*) from {backup} b
        left join {KEY_TABLE} k
               on k.organization_code = b.organization_code
              and k.mrn = b.mrn
              and k.patient_key = b.patient_key
        where k.mrn is null and b.mrn <> %s""", (mrn,))
    others_changed = cur.fetchone()[0]

    problems = []
    if len(after) != 1:
        problems.append(f"{len(after)} key row(s) for this patient, expected 1")
    elif after[0][0] != to_org:
        problems.append(f"the surviving row is at {after[0][0]}, not {to_org}")
    elif after[0][1] != key:
        problems.append("the patient_key CHANGED -- rule 1 violated")
    if held_after != held_before:
        problems.append(f"table size moved {held_before:,} -> {held_after:,}; a move must not change it")
    if others_changed:
        problems.append(f"{others_changed} other patient(s) lost or changed their key")
    if problems:
        sys.exit("FAILED:\n  - " + "\n  - ".join(problems) +
                 f"\n  {backup} holds the pre-run table.")

    print(f"  held        {held_after:,} (unchanged)")
    print(f"  OK. One row, at {to_org}, same patient_key -- the patient URL is unchanged.")
    print(f"  {backup} kept as the rollback copy. To revert: --move-patient {research_id} "
          f"--to-org {from_org} --apply")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    # Deliberately --apply rather than the sibling scripts' --dry-run: a wrong row here
    # is a permanent key in a table whose rows are never changed, so the safe mode is
    # the default one.
    ap.add_argument("--apply", action="store_true",
                    help="write (default: report only)")
    ap.add_argument("--move-patient", metavar="RESEARCH_ID",
                    help="move ONE patient's existing key to --to-org, keeping the key value. "
                         "Does not mint anything and does not fill the gap.")
    ap.add_argument("--to-org", metavar="CODE",
                    help="target organization_code for --move-patient")
    ap.add_argument("--batch-size", type=int, default=BATCH_ROWS,
                    help=f"candidate rows per INSERT (default {BATCH_ROWS})")
    ap.add_argument("--stamp", default=time.strftime("%Y%m%d"),
                    help="suffix for the backup table (default: today)")
    args = ap.parse_args()

    if bool(args.move_patient) != bool(args.to_org):
        ap.error("--move-patient and --to-org must be given together")

    conn = connect_starrocks()
    try:
        with conn.cursor() as cur:
            print(f"{KEY_TABLE}")
            if args.move_patient:
                move_patient(cur, args.move_patient, args.to_org, args.stamp, args.apply)
                return
            missing = preflight(cur)
            if not missing:
                print("  nothing to do.")
                return
            if not args.apply:
                print(f"\nREPORT ONLY -- nothing written. Re-run with --apply to mint "
                      f"{missing:,} key(s).")
                return
            print()
            apply(conn, cur, missing, args.stamp, args.batch_size)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
