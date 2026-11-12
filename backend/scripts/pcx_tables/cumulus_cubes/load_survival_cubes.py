#!/usr/bin/env python3
"""Load the pcx_30 Cumulus survival cubes (EFS + OS) into StarRocks.

There are TWO cube FAMILIES and both are live; ``--family`` selects which to act
on (default: both). The v7 pair was added BESIDE the v6 pair (owner's call,
2026-11-04) rather than replacing it:

    v6  "all_dx"  6 dimensions, dated exports      pcx30_*_all_dx_v6_months_cube
    v7  "pooled"  7 dimensions (+ ``data_source``) pcx30_*_pooled_v7_months_cube

Nearly everything here is dimension-count-agnostic -- the leaf and roll-up
filters, the grouping-set audit and the batcher all derive from each cube's own
column tuple, so the seventh dimension needed no special-casing. The two places
that did are called out at their definitions: the SNAPSHOT TOKEN is optional
(the v7 exports are undated), and because that silences the filename-based
cross-cube guard, a GRAND-TOTAL equality check between a family's two cubes
carries that weight instead.

``--target`` selects the cluster and the schema pair; see
``sql/pcx30_survival_cubes.sql`` for the DDL and the measured cube contract.

    qa    (default)  radiant_tests     / demo_cbtn_tenant
    prod             radiant_data_dev  / cbtn_tenant

Requires an interpreter carrying ``pymysql`` -- the system python3 does not. Use
the starrocks-dbt venv, per the pcx_30 loader convention:

    ~/Documents/GitHub/radiant-portal/backend/scripts/pcx_tables/\
starrocks-dbt/.starrocks-dbt/bin/python3 load_survival_cubes.py \
--target prod --create --load --verify

NOT A dbt MODEL. The authoritative home for prod pcx_30 objects is the dbt
project at ``radiant-portal/backend/scripts/pcx_tables/starrocks-dbt``, and
these two cubes are deliberately outside it: their content is an external
Cumulus CSV export rather than anything derivable from upstream tables, so
there is no dbt model to write. A ``dbt run`` neither builds nor drops them.
Folding them in would mean a seed per snapshot.

Stream Load is deliberately NOT used -- and on prod it is not even available
(ports 8030/8040 are filtered there, so batched INSERT is the only bulk path).
The CSVs are RFC-4180 quoted (11
``protocol_name_and_arm`` values contain commas) and many ``site`` values
contain an apostrophe, so parsing is left to the stdlib ``csv`` module and the
values are sent as bound parameters -- no hand-rolled escaping anywhere.

Batching is BY BYTES, not by row count, matching the measured prod-loader
convention: a row-count batch blows the packet limit once a text column holds
multi-KB cells. The v6 pair is ~48k rows total and finishes in well under a
minute; the v7 pair is ~499k rows, roughly 10x, so expect minutes rather than
seconds on prod.

These are DUPLICATE KEY tables, so ``UPDATE``/``DELETE`` are unavailable and a
partial load cannot be repaired in place. ``--load`` therefore TRUNCATEs first
and verifies the post-load count against the CSV's own row count, failing loud
on a mismatch rather than leaving a short table that looks loaded.
"""

from __future__ import annotations

import argparse
import csv
import logging
import os
import re
import sys
from pathlib import Path
from typing import Iterator, Sequence

try:
    import pymysql
except ModuleNotFoundError:  # pragma: no cover - explicit operator guidance
    sys.exit(
        "pymysql is not importable by this interpreter.\n"
        "Use the starrocks-dbt venv python3 (see this module's docstring)."
    )

LOG = logging.getLogger("load_survival_cubes")

DDL_PATH = Path(__file__).resolve().parent / "sql" / "pcx30_survival_cubes.sql"

# Prod FE. Port 80 speaks the MySQL protocol there (not HTTP), and 8030/8040 are
# filtered, so Stream Load is unavailable on prod -- batched INSERT is the only
# bulk path. QA is the opposite and has tunnels; see docs/ and the CLAUDE.md
# StarRocks notes.
#
# The HOST is deliberately NOT in the repo. It comes from STARROCKS_PROD_HOST in
# ~/.radiant/starrocks-prod.env, resolved through the same host_var mechanism QA
# already uses. Docs refer to it as <starrocks-prod-host>. The PORT stays here: 80
# is not a secret and is not carried in the credential file.
PROD_PORT = 80


class Target:
    """One cluster + schema pair, with the credential source that reaches it.

    The two clusters do NOT share a credential convention: QA exports
    ``STARROCKS_*`` from ``mcp-credentials.env`` while prod exports
    ``STARROCKS_PROD_*`` from its own file. Both now carry their HOST in the
    environment -- prod's was a literal in this file until 2026-11-05, when it was
    moved out to ``STARROCKS_PROD_HOST`` so the endpoint is not in the repo. Prod
    still carries no PORT (80 is pinned here). Binding each target to its own env var names is what
    keeps a QA password from being sent to the prod FE (and vice versa) when
    both files have been sourced into one shell -- which is the normal state of
    an operator terminal, and would otherwise be silently resolved by whichever
    file was sourced last.
    """

    def __init__(self, key: str, base_db: str, view_db: str,
                 user_var: str, password_var: str,
                 host: str | None, port: int | None,
                 host_var: str | None, port_var: str | None,
                 credential_hint: str) -> None:
        self.key = key
        self.base_db = base_db
        self.view_db = view_db
        self.user_var = user_var
        self.password_var = password_var
        self.host = host
        self.port = port
        self.host_var = host_var
        self.port_var = port_var
        self.credential_hint = credential_hint


TARGETS = {
    "qa": Target(
        key="qa",
        base_db="radiant_tests",
        view_db="demo_cbtn_tenant",
        user_var="STARROCKS_USER",
        password_var="STARROCKS_PASSWORD",
        host=None, port=None,
        host_var="STARROCKS_HOST", port_var="STARROCKS_PORT",
        credential_hint="source ~/.radiant/mcp-credentials.env first.",
    ),
    "prod": Target(
        key="prod",
        base_db="radiant_data_dev",
        view_db="cbtn_tenant",
        user_var="STARROCKS_PROD_USER",
        password_var="STARROCKS_PROD_PASSWORD",
        host=None, port=PROD_PORT,
        host_var="STARROCKS_PROD_HOST", port_var=None,
        credential_hint=(
            "set -a; . ~/.radiant/starrocks-prod.env; set +a\n"
            "  (after a rotation: bash ~/.radiant/set-starrocks-prod-pw.sh, "
            "which needs a real terminal)"
        ),
    ),
}

DEFAULT_CSV_DIR = Path.home() / "Documents" / "Radiant" / "demos" / "Nov 2026" / "cumulus"

# Max bytes of VALUES payload per INSERT. ~4 MB matches the measured prod
# loader; the server packet limit is the binding constraint, not row count.
MAX_BATCH_BYTES = 4 * 1024 * 1024
MAX_BATCH_ROWS = 2000


class Cube:
    """One cube: its CSV naming, its table, its view, and its column order.

    The CSV name is a stable ``prefix``, an OPTIONAL snapshot date, and a
    ``cube.csv`` suffix -- NOT a fixed filename. A refreshed v6 Cumulus export
    carries a new date, and hardcoding one would mean editing this file for
    every reload.

    ``family`` groups the cubes that describe ONE cohort export and must
    therefore be snapshot-resolved and cross-checked together; ``metric`` is the
    survival measure (``efs``/``os``). ``--family`` and ``--only`` filter on
    these respectively, and ``key`` is just the pair, for logging.
    """

    def __init__(self, family: str, metric: str, csv_prefix: str, table: str,
                 view: str, columns: Sequence[str]) -> None:
        self.family = family
        self.metric = metric
        self.key = f"{metric}_{family}"
        self.csv_prefix = csv_prefix
        self.table = table
        self.view = view
        self.columns = tuple(columns)
        if self.columns[0] != "cnt":
            raise AssertionError(
                f"{self.key}: 'cnt' must be the FIRST column -- the measure "
                "column is located positionally when auditing grouping sets."
            )
        # Columns that are NULLable in the DDL, i.e. the cube dimensions. `cnt`
        # is NOT NULL and is excluded, so an empty `cnt` fails loud at insert
        # instead of silently becoming NULL.
        self.nullable = tuple(c for c in self.columns if c != "cnt")
        self.int_columns = ("cnt", self.columns[1])

    @property
    def grouping_sets(self) -> int:
        """How many grouping sets a COMPLETE cube of this shape has: 2^dims.

        Derived, never written down: this is 64 for the six-dimension v6 pair
        and 128 for the seven-dimension v7 pair, and a future eighth dimension
        needs no edit here.
        """
        return 2 ** len(self.nullable)

    def csv_name(self, snapshot: str) -> str:
        if snapshot == UNDATED_SNAPSHOT:
            return f"{self.csv_prefix}cube.csv"
        return f"{self.csv_prefix}{snapshot}_cube.csv"

    def exports_available(self, csv_dir: Path) -> dict[str, list[Path]]:
        """Map each snapshot token on disk to the file(s) carrying it.

        A list, not a single path, because a browser re-download yields a
        ``... (1).csv`` sibling. One such file alone is harmless and is
        accepted; two files for the SAME snapshot are genuine ambiguity -- they
        can differ -- and the caller refuses rather than picking one.

        The glob is ``*cube*`` rather than ``*_cube*`` because the v7 exports
        carry NO snapshot token at all, so there is no underscore to anchor on:
        ``..._months_cube.csv``, not ``..._months_<date>_cube.csv``.
        """
        found: dict[str, list[Path]] = {}
        for path in csv_dir.glob(f"{self.csv_prefix}*cube*.csv"):
            tail = path.name[len(self.csv_prefix):]
            m = EXPORT_TAIL_RE.fullmatch(tail)
            if m:
                found.setdefault(m.group("snapshot") or UNDATED_SNAPSHOT,
                                 []).append(path)
        return {k: sorted(v) for k, v in found.items()}

    def snapshots_available(self, csv_dir: Path) -> set[str]:
        return set(self.exports_available(csv_dir))


# A snapshot token is an ISO date, optionally carrying a REVISION suffix -- a
# re-export of the same nominal date arrives as `2026-10-21r`, so demanding a
# bare date would reject every revision. Lexicographic max still orders these
# correctly: `2026-10-21r` > `2026-10-21`, and a later date beats both.
SNAPSHOT_RE = re.compile(r"\d{4}-\d{2}-\d{2}[A-Za-z0-9]*")

# The stand-in token for an export whose filename carries NO date. The v7
# "pooled" exports are like this -- `pcx__30_efs_pooled_v7_months_cube.csv`.
# It is deliberately NOT date-shaped, so it can never be confused for one, and
# deliberately sorts ABOVE every date ('u' > '2'), which is why the "newest
# wins" default refuses to choose between it and a date rather than letting
# lexicographic luck decide. See `resolve_snapshot`.
UNDATED_SNAPSHOT = "undated"

# The filename tail after the cube prefix: an OPTIONAL `<snapshot>_` segment,
# then `cube`, then an optional ` (N)` browser duplicate-download marker before
# `.csv`. Two things this shape is carrying:
#   * the snapshot segment is optional because the v7 exports are undated. It
#     stays ANCHORED to the date pattern rather than becoming a loose `.*`, so a
#     dateless export yields `None` (-> UNDATED_SNAPSHOT) instead of silently
#     minting a junk snapshot token out of whatever precedes `cube`.
#   * the ` (N)` marker is NOT part of the snapshot identity -- folding it in
#     would mint a bogus snapshot named `2026-10-21r_cube (1)`.
EXPORT_TAIL_RE = re.compile(
    r"(?:(?P<snapshot>" + SNAPSHOT_RE.pattern + r")_)?cube(?: \(\d+\))?\.csv"
)

# The seven v7 dimensions vs the six v6 ones are the ONLY structural difference
# between the families; everything downstream derives the dimension list from
# these tuples. Column ORDER must match the DDL, and `cnt` must come first.
CUBES = (
    Cube(
        family="v6", metric="efs",
        csv_prefix="pcx30_efs_all_dx_v6_months_",
        table="pcx30_efs_all_dx_v6_months_cube",
        view="v_pcx30_efs_all_dx_v6_months_cube",
        columns=("cnt", "event_free_survival_months", "efs_status", "diagnosis",
                 "protocol_name_and_arm", "subtype", "site"),
    ),
    Cube(
        family="v6", metric="os",
        csv_prefix="pcx30_os_all_dx_v6_months_",
        table="pcx30_os_all_dx_v6_months_cube",
        view="v_pcx30_os_all_dx_v6_months_cube",
        columns=("cnt", "overall_survival_months", "vital_status", "diagnosis",
                 "protocol_name_and_arm", "subtype", "site"),
    ),
    # The source filenames spell the project with a DOUBLE underscore
    # (`pcx__30_`), so the CSV prefix keeps it while the table/view names
    # normalize to the single-underscore `pcx30_` convention the v6 pair set.
    Cube(
        family="v7", metric="efs",
        csv_prefix="pcx__30_efs_pooled_v7_months_",
        table="pcx30_efs_pooled_v7_months_cube",
        view="v_pcx30_efs_pooled_v7_months_cube",
        columns=("cnt", "event_free_survival_months", "efs_status", "diagnosis",
                 "protocol_name_and_arm", "subtype", "site", "data_source"),
    ),
    Cube(
        family="v7", metric="os",
        csv_prefix="pcx__30_os_pooled_v7_months_",
        table="pcx30_os_pooled_v7_months_cube",
        view="v_pcx30_os_pooled_v7_months_cube",
        columns=("cnt", "overall_survival_months", "vital_status", "diagnosis",
                 "protocol_name_and_arm", "subtype", "site", "data_source"),
    ),
)

FAMILIES = tuple(dict.fromkeys(c.family for c in CUBES))
METRICS = tuple(dict.fromkeys(c.metric for c in CUBES))


def resolve_snapshot(csv_dir: Path, requested: str | None,
                     cubes: Sequence[Cube]) -> tuple[str, dict[str, Path]]:
    """Pick ONE snapshot token that every cube of ONE FAMILY has an export for.

    Call this PER FAMILY, never across families -- the v6 exports are dated and
    the v7 exports are not, so an all-cubes intersection is empty by
    construction and would refuse every default run.

    The hazard this exists to close is not a missing file -- that fails loudly
    on its own -- but a SILENT CROSS-CUBE MISMATCH: loading EFS from one export
    and OS from an older one yields two tables that each look internally
    consistent (both grand totals are a plausible cohort count) while
    describing different cohorts. Nothing downstream could detect it. So the
    token is resolved ONCE, against the intersection of what the family's cubes
    actually have, and both tables are loaded from it or neither is.

    **On an UNDATED family this guard is weak and cannot be made strong here.**
    Every v7 export resolves to the same `undated` token, so filename agreement
    is vacuous -- two exports taken months apart look identical to it. That is
    why `cross_check_cohorts` exists: it compares the two cubes' GRAND TOTALS,
    which is a direct test of "same cohort" rather than an inference from a
    filename, and it runs before anything is written.

    With no ``--snapshot``, the newest common date wins; ISO-8601 sorts
    chronologically, so lexicographic max is the newest. The resolved token is
    always logged, so a wrong pick is visible rather than inferred.
    """
    exports = {c.key: c.exports_available(csv_dir) for c in cubes}
    per_cube = {k: set(v) for k, v in exports.items()}
    for key, dates in per_cube.items():
        if not dates:
            cube = next(c for c in cubes if c.key == key)
            raise SystemExit(
                f"no export found for the {key} cube in {csv_dir}\n"
                f"  expected a file named {cube.csv_name('<YYYY-MM-DD>')}\n"
                f"  or, for an undated export, "
                f"{cube.csv_name(UNDATED_SNAPSHOT)}"
            )

    common = set.intersection(*per_cube.values())
    if not common:
        detail = "\n".join(f"    {k}: {', '.join(sorted(v))}"
                           for k, v in sorted(per_cube.items()))
        raise SystemExit(
            "the selected cubes share NO common snapshot date, so loading them "
            "together would mix cohorts:\n" + detail + "\n"
            "  re-export the missing side, or load one cube at a time with "
            "--only."
        )

    if requested is not None:
        if requested not in common:
            raise SystemExit(
                f"--snapshot {requested} is not available for every selected "
                f"cube.\n  common dates: {', '.join(sorted(common))}"
            )
        chosen = requested
    elif len(common) > 1 and UNDATED_SNAPSHOT in common:
        # "Newest wins" has no meaning across a date and a dateless export: the
        # undated one cannot be placed in time at all. Lexicographic max WOULD
        # pick it ('u' > '2'), but that is alphabetical luck, not recency, so
        # refuse and make the operator say which they mean.
        raise SystemExit(
            "this family has BOTH dated and undated exports on disk "
            f"({', '.join(sorted(common))}), and an undated export cannot be "
            "ordered against a dated one -- 'newest' is undefined.\n"
            f"  pass --snapshot explicitly (use --snapshot {UNDATED_SNAPSHOT} "
            "for the dateless export)."
        )
    else:
        chosen = max(common)
        if len(common) > 1:
            LOG.warning(
                "multiple snapshots on disk (%s); loading the NEWEST: %s. "
                "Pass --snapshot to pin a different one.",
                ", ".join(sorted(common)), chosen,
            )

    # One file per cube for the chosen snapshot, or refuse. A ` (N)` duplicate
    # download is tolerated on its own but never silently preferred over a
    # sibling: the two can differ, and guessing would load unreviewed bytes.
    paths: dict[str, Path] = {}
    for cube in cubes:
        candidates = exports[cube.key][chosen]
        if len(candidates) > 1:
            listing = "\n".join(f"    {p.name}" for p in candidates)
            raise SystemExit(
                f"the {cube.key} cube has {len(candidates)} files for snapshot "
                f"{chosen}, so which one is authoritative is undecidable:\n"
                + listing + "\n"
                "  these can differ -- delete the stale duplicate (a ' (1)' "
                "suffix is usually a repeated browser download) and re-run."
            )
        paths[cube.key] = candidates[0]
    return chosen, paths


def connect(target: Target) -> "pymysql.connections.Connection":
    """Open a StarRocks connection for ``target`` from ITS credential vars."""
    required = [target.user_var, target.password_var]
    if target.host_var:
        required.append(target.host_var)
    if target.port_var:
        required.append(target.port_var)
    missing = [k for k in required if not os.environ.get(k)]
    if missing:
        sys.exit(
            f"missing {target.key} StarRocks environment: " + ", ".join(missing)
            + "\n  " + target.credential_hint
        )

    host = target.host or os.environ[target.host_var]
    port = target.port if target.port is not None else int(os.environ[target.port_var])
    LOG.info("target %s: %s:%s  tables=%s  views=%s",
             target.key, host, port, target.base_db, target.view_db)
    return pymysql.connect(
        host=host,
        port=port,
        user=os.environ[target.user_var],
        password=os.environ[target.password_var],
        charset="utf8mb4",
        autocommit=True,
        local_infile=False,
    )


def read_cube_rows(cube: Cube, csv_path: Path) -> list[tuple]:
    """Parse one cube CSV into bound-parameter tuples.

    Empty dimension cells become ``None`` (SQL NULL), which is the cube's
    roll-up marker -- NOT missing data. ``cnt`` is required; an empty or
    non-integer ``cnt`` raises rather than loading a NULL count.

    Dimension values are INTERNED. The whole file is held in memory so the
    cross-cube cohort check can run before any write, and at v7 scale (~250k
    rows x 7 dimensions) the cells are overwhelmingly repeats of a small
    vocabulary -- 107 subtypes, 31 sites, 2 data sources. `csv` hands back a
    fresh `str` per cell regardless, so interning collapses ~1.7M objects to a
    few hundred distinct ones. It changes nothing about the values sent.
    """
    with csv_path.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        header = tuple(reader.fieldnames or ())
        if header != cube.columns:
            raise SystemExit(
                f"{csv_path.name}: header does not match the expected cube shape.\n"
                f"  expected: {cube.columns}\n"
                f"  found:    {header}\n"
                "The DDL is authored against the expected order; refusing to "
                "load a reshaped export."
            )

        rows: list[tuple] = []
        for lineno, record in enumerate(reader, start=2):
            out: list[object] = []
            for col in cube.columns:
                raw = record[col]
                if col in cube.int_columns:
                    if raw == "":
                        if col == "cnt":
                            raise SystemExit(
                                f"{csv_path.name}:{lineno}: empty cnt. "
                                "cnt is NOT NULL by contract; refusing to load."
                            )
                        out.append(None)  # rolled-up month
                        continue
                    try:
                        out.append(int(raw))
                    except ValueError:
                        raise SystemExit(
                            f"{csv_path.name}:{lineno}: {col}={raw!r} is not an "
                            "integer."
                        ) from None
                else:
                    out.append(sys.intern(raw) if raw != "" else None)
            rows.append(tuple(out))
    return rows


def audit_cube(cube: Cube, rows: Sequence[tuple]) -> dict[str, int]:
    """Re-derive the cube contract from the PARSED CSV, before anything is written.

    The DDL header states three properties of every cube. Checking them here
    rather than only after loading matters because these are DUPLICATE KEY
    tables: a `--load` truncates first, so discovering a malformed export
    post-load means the target is already empty and the old data is gone.

    Two of the three are FATAL, one is a loud warning, and the split is by
    whether a consumer could notice:

      * exactly ONE all-NULL grand-total row -- FATAL if not. Zero or several
        makes "the cohort size" ambiguous, and every documented idiom reads it.
      * leaf rows sum to that grand total -- FATAL if not. An internally
        inconsistent cube hands every consumer a wrong cohort with nothing to
        hint at it.
      * all 2^dims grouping sets present -- WARNING if not. A consumer asking
        for an absent subtotal gets an empty result, which is visible; and a
        partial cube can still be legitimately useful. Loud, named, not fatal.
    """
    dim_i = tuple(range(1, len(cube.columns)))  # `cnt` is column 0, asserted
    grand_rows = [r for r in rows if all(r[i] is None for i in dim_i)]
    if len(grand_rows) != 1:
        raise SystemExit(
            f"{cube.key}: found {len(grand_rows)} all-NULL grand-total rows, "
            "expected exactly 1. The cohort size this cube asserts is "
            f"ambiguous; refusing to load.\n"
            "  Every documented consumer idiom reads that row -- see "
            f"{DDL_PATH.name}."
        )
    grand = grand_rows[0][0]

    leaf = [r for r in rows if all(r[i] is not None for i in dim_i)]
    leaf_sum = sum(r[0] for r in leaf)
    if leaf_sum != grand:
        raise SystemExit(
            f"{cube.key}: the cube is INTERNALLY INCONSISTENT -- its leaf rows "
            f"sum to {leaf_sum:,} but its grand-total row says {grand:,}.\n"
            "  Refusing to load: both numbers reach consumers and there is no "
            "way to tell which is wrong from inside the data."
        )

    present = {tuple(r[i] is None for i in dim_i) for r in rows}
    if len(present) != cube.grouping_sets:
        LOG.warning(
            "%s: INCOMPLETE CUBE -- %d of %d grouping sets present. Loading "
            "anyway (a consumer asking for an absent subtotal gets an empty "
            "result, which is visible), but the '%d grouping sets' claim in "
            "the DDL comments does NOT hold for this export.",
            cube.key, len(present), cube.grouping_sets, cube.grouping_sets,
        )

    return {
        "rows": len(rows),
        "grand_total": grand,
        "leaf_rows": len(leaf),
        "leaf_sum": leaf_sum,
        "grouping_sets": len(present),
    }


def cross_check_cohorts(audits: dict[str, dict[str, int]], family: str,
                        cubes: Sequence[Cube]) -> None:
    """Refuse to load a family whose cubes disagree on the cohort size.

    This is the control that replaces the filename-based snapshot guard on an
    UNDATED family. `resolve_snapshot` can only ask "do these files claim the
    same snapshot", and for v7 every export claims the same `undated` token, so
    it cannot detect a stale EFS export sitting beside a fresh OS one. Their
    GRAND TOTALS can: the two cubes of a family are two cuts of one cohort, so
    the all-NULL cell must agree. Measured on the v7 pair, both say 7,440.

    Only meaningful with both cubes of the family in hand, so a single-cube
    `--only` run says plainly that the check did not run rather than passing
    silently.
    """
    if len(audits) < 2:
        only = next(iter(audits), "none")
        LOG.warning(
            "family %s: cohort cross-check SKIPPED -- only the %s cube was "
            "selected, so there is nothing to compare it against. A stale "
            "export for this cube cannot be detected by this run.",
            family, only,
        )
        return

    totals = {k: a["grand_total"] for k, a in audits.items()}
    if len(set(totals.values())) != 1:
        detail = "\n".join(f"    {k}: cohort {v:,}" for k, v in sorted(totals.items()))
        raise SystemExit(
            f"family {family}: the cubes DISAGREE on the cohort size, so they "
            "describe different cohorts:\n" + detail + "\n"
            "  This is what a stale export beside a fresh one looks like. "
            "Loading them together would publish two survival curves over "
            "different populations.\n"
            "  Re-export the stale side, or load one cube at a time with "
            "--only (which disables this check)."
        )
    LOG.info("family %s: cohort cross-check OK -- all %d cubes agree at %s",
             family, len(totals), f"{next(iter(totals.values())):,}")


def batches(rows: Sequence[tuple]) -> Iterator[list[tuple]]:
    """Yield row batches bounded by serialized BYTES, then by row count."""
    batch: list[tuple] = []
    nbytes = 0
    for row in rows:
        size = sum(len(str(v).encode("utf-8")) + 3 for v in row if v is not None) + 8
        if batch and (nbytes + size > MAX_BATCH_BYTES or len(batch) >= MAX_BATCH_ROWS):
            yield batch
            batch, nbytes = [], 0
        batch.append(row)
        nbytes += size
    if batch:
        yield batch


def split_sql_statements(sql: str) -> list[str]:
    """Split a multi-statement script on top-level ``;``, comments removed.

    This has to be string-aware in BOTH directions, and a naive implementation
    fails on this very DDL file:

      * ``sql.split(";")`` shreds the header, because the worked examples in
        the comment block end their SQL with a semicolon. Splitting first and
        then dropping "comment-looking" fragments does not recover it -- the
        fragments carry real DDL text spliced onto comment tails.
      * a line-wise ``--`` strip corrupts the DDL, because several
        ``COMMENT "..."`` literals legitimately contain ``--`` (for example
        "over-counts 64x -- see table comment"). That text is DATA, not a
        comment, and must survive verbatim into the catalog.

    So comments and string literals are tracked together in one pass. StarRocks
    quotes string literals with ``'`` or ``"`` (identifiers use backticks), and
    like MySQL requires whitespace after ``--`` to open a line comment -- which
    is what keeps a bare ``--------`` rule from being mistaken for an operator.
    """
    out: list[str] = []
    buf: list[str] = []
    i, n = 0, len(sql)
    quote: str | None = None

    while i < n:
        ch = sql[i]

        if quote is not None:
            buf.append(ch)
            if ch == "\\" and i + 1 < n:          # escape inside a literal
                buf.append(sql[i + 1])
                i += 2
                continue
            if ch == quote:
                # A doubled quote is an escaped quote, not a close.
                if i + 1 < n and sql[i + 1] == quote:
                    buf.append(sql[i + 1])
                    i += 2
                    continue
                quote = None
            i += 1
            continue

        if ch in ("'", '"'):
            quote = ch
            buf.append(ch)
            i += 1
            continue

        if ch == "-" and sql.startswith("--", i) and (
            i + 2 >= n or sql[i + 2] in " \t\r\n-"
        ):
            eol = sql.find("\n", i)
            i = n if eol == -1 else eol + 1
            buf.append("\n")
            continue

        if ch == "/" and sql.startswith("/*", i):
            end = sql.find("*/", i + 2)
            i = n if end == -1 else end + 2
            buf.append(" ")
            continue

        if ch == ";":
            stmt = "".join(buf).strip()
            if stmt:
                out.append(stmt)
            buf = []
            i += 1
            continue

        buf.append(ch)
        i += 1

    if quote is not None:
        raise SystemExit(
            f"{DDL_PATH.name}: unterminated {quote} string literal -- refusing "
            "to execute a script that cannot be parsed."
        )
    tail = "".join(buf).strip()
    if tail:
        out.append(tail)
    return out


def drop_objects(conn, target: Target, cubes: Sequence[Cube],
                 dry_run: bool) -> None:
    """Drop the views then the tables, so --create rebuilds them from the DDL.

    Needed because ``CREATE TABLE IF NOT EXISTS`` is a no-op against an existing
    table: an edit to a COMMENT string (or any column definition) in the DDL file
    would never reach the catalog, leaving the committed DDL and the live schema
    silently disagreeing. Views go first -- they depend on the tables.
    """
    for cube in cubes:
        for stmt in (f"drop view if exists {target.view_db}.{cube.view}",
                     f"drop table if exists {target.base_db}.{cube.table}"):
            if dry_run:
                LOG.info("[dry-run] would execute: %s", stmt)
                continue
            with conn.cursor() as cur:
                cur.execute(stmt)
            LOG.info("ok: %s", stmt)


def render_ddl(sql: str, target: Target) -> str:
    """Substitute the schema placeholders, refusing a half-templated file.

    The DDL names its schemas as ``{{BASE_DB}}`` / ``{{VIEW_DB}}`` rather than
    literally, because the same objects live in two schema pairs
    (``radiant_tests``/``demo_cbtn_tenant`` on QA, ``radiant_data_dev``/
    ``cbtn_tenant`` on prod) and a second hand-edited copy of the file would
    drift from this one silently.

    Both guards below are fail-loud for the same reason: a MIXED-schema script
    is the one failure mode that does not announce itself. An un-substituted
    placeholder would reach StarRocks as a syntax error (loud, fine), but a
    literal schema name left behind in an otherwise-templated file executes
    perfectly -- creating one cube in the target schema and the other in
    whatever schema the stale literal names. On a prod run that silently writes
    a tenant-facing view against a QA base table.
    """
    rendered = sql.replace("{{BASE_DB}}", target.base_db) \
                  .replace("{{VIEW_DB}}", target.view_db)

    if "{{" in rendered:
        leftovers = sorted(set(re.findall(r"\{\{[^}]*\}\}", rendered)))
        raise SystemExit(
            f"{DDL_PATH.name}: unsubstituted placeholder(s): "
            + ", ".join(leftovers) +
            "\n  every placeholder must be known to render_ddl(); refusing to "
            "execute a partially rendered script."
        )

    # Scoped to the executable statements: the file header legitimately names
    # every schema in prose (the loaded-snapshot history, the worked examples),
    # and matching those would make the guard unable to pass.
    body = "\n".join(split_sql_statements(rendered))
    strays = sorted({
        name for t in TARGETS.values() for name in (t.base_db, t.view_db)
        if name not in (target.base_db, target.view_db)
        and re.search(rf"\b{re.escape(name)}\s*\.", body)
    })
    if strays:
        raise SystemExit(
            f"{DDL_PATH.name}: executable DDL names a NON-target schema: "
            + ", ".join(strays) +
            f"\n  rendering for target '{target.key}' "
            f"({target.base_db}/{target.view_db}).\n"
            "  A literal schema name here would execute successfully against "
            "the wrong schema; use {{BASE_DB}}/{{VIEW_DB}}."
        )
    return rendered


def apply_ddl(conn, target: Target, dry_run: bool) -> None:
    """Execute the committed DDL file statement by statement."""
    sql = render_ddl(DDL_PATH.read_text(encoding="utf-8"), target)
    statements = split_sql_statements(sql)
    LOG.info("DDL: %d statements from %s -> %s/%s", len(statements),
             DDL_PATH.name, target.base_db, target.view_db)
    for stmt in statements:
        label = " ".join(stmt.split())[:90]
        if dry_run:
            LOG.info("[dry-run] would execute: %s...", label)
            continue
        with conn.cursor() as cur:
            cur.execute(stmt)
        LOG.info("ok: %s...", label)


def load_cube(conn, target: Target, cube: Cube, rows: Sequence[tuple],
              dry_run: bool) -> None:
    """TRUNCATE and reload one cube from ALREADY-PARSED, already-audited rows.

    Takes rows rather than a path deliberately. Every CSV is parsed, audited and
    cross-checked before this is called even once, because these are DUPLICATE
    KEY tables and `--load` truncates: parsing cube 2 lazily would mean a
    malformed second export leaves cube 1 reloaded and cube 2 empty, i.e. a
    family split across two cohorts, which is the exact state the cross-check
    exists to prevent.
    """
    table_fqn = f"{target.base_db}.{cube.table}"
    placeholders = ",".join(["%s"] * len(cube.columns))
    stmt = (f"insert into {table_fqn} ({','.join(cube.columns)}) "
            f"values ({placeholders})")

    if dry_run:
        LOG.info("[dry-run] would TRUNCATE %s and insert %d rows",
                 table_fqn, len(rows))
        return

    with conn.cursor() as cur:
        cur.execute(f"truncate table {table_fqn}")
        LOG.info("%s: truncated", table_fqn)
        sent = 0
        for i, batch in enumerate(batches(rows), start=1):
            cur.executemany(stmt, batch)
            sent += len(batch)
            LOG.info("%s: batch %d -> %d/%d rows", cube.key, i, sent, len(rows))

        cur.execute(f"select count(*) from {table_fqn}")
        landed = cur.fetchone()[0]

    if landed != len(rows):
        raise SystemExit(
            f"{table_fqn}: load is SHORT -- {landed} rows landed, {len(rows)} "
            "expected. This is a DUPLICATE KEY table so the partial load cannot "
            "be repaired in place; re-run --load to truncate and reload."
        )
    LOG.info("%s: verified %d rows", table_fqn, landed)


def verify(conn, target: Target, cubes: Sequence[Cube] = CUBES) -> None:
    """Re-derive the cube invariants from the LOADED tables.

    Deliberately re-derived from the database rather than reported from the
    parse: this is the only step that can catch a load that went wrong between
    a correct CSV and the table, and it is the number to trust over any figure
    written down in prose or in a COMMENT string.
    """
    grand_by_family: dict[str, dict[str, int]] = {}

    for cube in cubes:
        months, status = cube.columns[1], cube.columns[2]
        leaf_filter = " and ".join(f"{c} is not null" for c in cube.nullable)
        rollup_filter = " and ".join(f"{c} is null" for c in cube.nullable)
        with conn.cursor() as cur:
            cur.execute(f"""
                select
                  (select count(*) from {target.base_db}.{cube.table}),
                  (select sum(cnt) from {target.base_db}.{cube.table}),
                  (select sum(cnt) from {target.base_db}.{cube.table} where {leaf_filter}),
                  (select count(*) from {target.base_db}.{cube.table} where {leaf_filter}),
                  (select cnt from {target.base_db}.{cube.table} where {rollup_filter}),
                  (select min({months}) from {target.base_db}.{cube.table}),
                  (select max({months}) from {target.base_db}.{cube.table}),
                  (select count(*) from {target.view_db}.{cube.view})
            """)
            (nrows, total_all, total_leaf, nleaf, grand,
             mn, mx, view_rows) = cur.fetchone()
            cur.execute(f"select count(distinct {status}) from "
                        f"{target.base_db}.{cube.table} where {status} is not null")
            nstatus = cur.fetchone()[0]

        ndims = len(cube.nullable)
        grand_by_family.setdefault(cube.family, {})[cube.metric] = grand

        LOG.info("")
        LOG.info("%s  table=%s.%s  view=%s.%s",
                 cube.key.upper(), target.base_db, cube.table,
                 target.view_db, cube.view)
        LOG.info("  dimensions               %s   (%s grouping sets if complete)",
                 ndims, cube.grouping_sets)
        LOG.info("  rows                     %s   (view sees %s)", nrows, view_rows)
        LOG.info("  grand-total cell cnt     %s   <- the real cohort", grand)
        LOG.info("  sum(cnt) leaf rows       %s   over %s leaf rows", total_leaf, nleaf)
        LOG.info("  sum(cnt) ALL rows        %s   <- %sx, subtotals included",
                 total_all, cube.grouping_sets)
        LOG.info("  %-22s   %s .. %s   (-1 is real, not a sentinel)",
                 months, mn, mx)
        LOG.info("  distinct %-14s  %s   (a 'Not Reported' level counts here)",
                 status, nstatus)

        if grand != total_leaf:
            LOG.error("  INVARIANT BROKEN: grand total %s != leaf sum %s",
                      grand, total_leaf)
        if view_rows != nrows:
            LOG.error("  INVARIANT BROKEN: view sees %s of %s rows",
                      view_rows, nrows)
        # Not an equality check on a written-down number: `grouping_sets` is
        # derived from this cube's own column tuple, so this re-states the DDL's
        # completeness claim against the loaded table.
        if total_all != grand * cube.grouping_sets:
            LOG.error("  INCOMPLETE CUBE: sum(cnt) over all rows is %s, but a "
                      "complete %s-dim cube would give %s (= %s x %s)",
                      total_all, ndims, grand * cube.grouping_sets, grand,
                      cube.grouping_sets)

    # The same cohort-agreement test `cross_check_cohorts` ran pre-load, re-run
    # against what actually landed -- this is the one that would catch a load
    # that half-failed and left two families' tables describing different
    # cohorts.
    for family, by_metric in sorted(grand_by_family.items()):
        if len(by_metric) < 2:
            continue
        if len(set(by_metric.values())) != 1:
            LOG.error("family %s: LOADED cubes DISAGREE on the cohort -- %s",
                      family, ", ".join(f"{m}={v:,}"
                                        for m, v in sorted(by_metric.items())))
        else:
            LOG.info("")
            LOG.info("family %s: loaded cubes agree, cohort %s",
                     family, f"{next(iter(by_metric.values())):,}")


def main(argv: Sequence[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--target", choices=sorted(TARGETS), default="qa",
                    help="cluster + schema pair to act on. qa (default) = "
                         "radiant_tests/demo_cbtn_tenant; prod = "
                         "radiant_data_dev/cbtn_tenant")
    ap.add_argument("--create", action="store_true",
                    help="apply the DDL (base tables in the target's base "
                         "schema, views in its view schema)")
    ap.add_argument("--recreate", action="store_true",
                    help="DROP the views and tables, then re-apply the DDL. Use "
                         "when the DDL file changed (e.g. a COMMENT edit), since "
                         "CREATE TABLE IF NOT EXISTS cannot update an existing "
                         "table. Implies --create; pair with --load, as this "
                         "discards the data.")
    ap.add_argument("--load", action="store_true",
                    help="TRUNCATE and reload both tables from the CSVs")
    ap.add_argument("--verify", action="store_true",
                    help="re-derive the cube invariants from the loaded tables")
    ap.add_argument("--csv-dir", type=Path, default=DEFAULT_CSV_DIR,
                    help=f"directory holding the two cube CSVs (default: {DEFAULT_CSV_DIR})")
    ap.add_argument("--family", choices=FAMILIES, action="append",
                    help="restrict to one cube family (default: all). "
                         "v6 = the 6-dim all_dx pair, v7 = the 7-dim pooled "
                         "pair. Both are live; v7 was added BESIDE v6, not as "
                         "a replacement")
    ap.add_argument("--only", choices=METRICS, action="append",
                    help="restrict to one survival metric (default: both). "
                         "NOTE: selecting a single metric disables the "
                         "cross-cube cohort check for that family")
    ap.add_argument("--snapshot", metavar="YYYY-MM-DD",
                    help="pin an exact snapshot token (default: the newest "
                         "token every selected cube of a family has an export "
                         f"for). Use '{UNDATED_SNAPSHOT}' for a dateless "
                         "export such as the v7 pair. Applies to every "
                         "selected family, so pair it with --family")
    ap.add_argument("--dry-run", action="store_true",
                    help="print what would run, execute nothing")
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args(argv)

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(message)s",
    )

    if not (args.create or args.recreate or args.load or args.verify):
        ap.error("nothing to do: pass --create, --recreate, --load and/or "
                 "--verify")

    selected = [c for c in CUBES
                if (not args.family or c.family in args.family)
                and (not args.only or c.metric in args.only)]
    if not selected:
        ap.error("--family/--only selected no cubes")

    if args.recreate and not args.load and not args.dry_run:
        ap.error("--recreate drops the data; pair it with --load (or use "
                 "--dry-run to preview)")

    if args.snapshot is not None and args.snapshot != UNDATED_SNAPSHOT \
            and not SNAPSHOT_RE.fullmatch(args.snapshot):
        ap.error(f"--snapshot {args.snapshot!r} is neither a YYYY-MM-DD date "
                 f"nor '{UNDATED_SNAPSHOT}'")

    target = TARGETS[args.target]

    families = tuple(dict.fromkeys(c.family for c in selected))
    LOG.info("selected: %s  (families: %s)",
             ", ".join(c.key for c in selected), ", ".join(families))

    # EVERYTHING that can refuse happens BEFORE a single write: snapshot
    # resolution, parsing, the per-cube contract audit, and the cross-cube
    # cohort check -- for every selected family. Two reasons this ordering is
    # load-bearing rather than tidy:
    #   * --recreate DROPS the live objects, so a missing or malformed export
    #     discovered afterwards leaves the target with no tables at all;
    #   * --load TRUNCATEs each table, and these are DUPLICATE KEY tables with
    #     no UPDATE/DELETE, so a refusal partway through a family leaves one
    #     cube reloaded and the other empty.
    # The cost is holding both families' parsed rows in memory at once; the
    # dimension values are interned, which is what makes that affordable.
    load_plan: dict[str, list[tuple[Cube, list[tuple]]]] = {}
    if args.load:
        for family in families:
            fam_cubes = [c for c in selected if c.family == family]
            snapshot, paths = resolve_snapshot(args.csv_dir, args.snapshot,
                                               fam_cubes)
            LOG.info("")
            LOG.info("family %s: snapshot %s  (%s)", family, snapshot,
                     ", ".join(c.metric for c in fam_cubes))

            parsed: list[tuple[Cube, list[tuple]]] = []
            audits: dict[str, dict[str, int]] = {}
            for cube in fam_cubes:
                csv_path = paths[cube.key]
                if not csv_path.is_file():
                    raise SystemExit(f"CSV not found: {csv_path}")
                rows = read_cube_rows(cube, csv_path)
                audit = audit_cube(cube, rows)
                LOG.info("  %-8s %s", cube.metric, csv_path.name)
                LOG.info("    %s rows, cohort %s, %s leaf rows, "
                         "%s/%s grouping sets",
                         f"{audit['rows']:,}", f"{audit['grand_total']:,}",
                         f"{audit['leaf_rows']:,}", audit["grouping_sets"],
                         cube.grouping_sets)
                parsed.append((cube, rows))
                audits[cube.metric] = audit

            cross_check_cohorts(audits, family, fam_cubes)
            load_plan[family] = parsed

    conn = connect(target)
    try:
        if args.recreate:
            drop_objects(conn, target, selected, args.dry_run)
        if args.create or args.recreate:
            apply_ddl(conn, target, args.dry_run)
        for family, parsed in load_plan.items():
            LOG.info("")
            LOG.info("loading family %s", family)
            for cube, rows in parsed:
                load_cube(conn, target, cube, rows, args.dry_run)
        if args.verify and not args.dry_run:
            verify(conn, target, selected)
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
