"""Which tasks the carrier and oncoprint queries read (``queries.sequencing.latest_tasks``).

The subquery runs in SQLite, with an attached ``radiant`` database standing for
the shared StarRocks one: window functions behave the same for this query.
"""

import re
import sqlite3

import pytest

from radiant_mcp import sql as _sql
from radiant_mcp.queries.sequencing import latest_tasks

COLUMNS = ("case_id", "seq_id", "task_id", "task_type", "patient_id", "family_role", "affected_status",
           "experimental_strategy", "histology_type", "tenant_code", "deleted", "ingested_at")


def _kept(rows: list[tuple], data_type: str) -> set[tuple[int, int, int]]:
    db = sqlite3.connect(":memory:")
    db.execute("ATTACH ':memory:' AS radiant")
    db.execute(f"CREATE TABLE radiant.staging_sequencing_experiment ({', '.join(COLUMNS)})")
    for row in rows:
        values = dict(zip(COLUMNS[:4], row[:4], strict=True)) | {
            "patient_id": row[1], "family_role": "proband", "affected_status": "affected",
            "experimental_strategy": "wgs", "histology_type": row[4] if len(row) > 4 else None,
            "tenant_code": "demo", "deleted": row[5] if len(row) > 5 else False,
            "ingested_at": row[6] if len(row) > 6 else "2026-11-01 10:00:00",
        }
        db.execute(f"INSERT INTO radiant.staging_sequencing_experiment VALUES ({', '.join('?' * len(COLUMNS))})",
                   [values[c] for c in COLUMNS])
    p = _sql.Params()
    sql = re.sub(r"%\((p\d+)\)s", r":\1", f"SELECT case_id, seq_id, task_id FROM {latest_tasks(p, 'demo', data_type)}")
    return set(db.execute(sql, p.values).fetchall())


GERMLINE = "radiant_germline_annotation"
SOMATIC = "radiant_somatic_annotation"


def test_a_re_analysis_replaces_the_older_task_of_the_sequencing():
    # Task 2 re-ran sequencing 10: the occurrences of task 1 must not be read any more.
    assert _kept([(1, 10, 1, GERMLINE), (1, 10, 2, GERMLINE), (1, 11, 3, GERMLINE)], "germline_snv") == {
        (1, 10, 2), (1, 11, 3)}


def test_a_re_analysis_not_imported_yet_keeps_the_loaded_task():
    # The ETL inserts the new task at the epoch; its occurrences come with the import.
    rows = [(1, 10, 1, GERMLINE), (1, 10, 2, GERMLINE, None, False, "1970-01-01 00:00:00"),
            (1, 11, 3, GERMLINE, None, False, None)]
    assert _kept(rows, "germline_snv") == {(1, 10, 1)}


def test_only_the_task_type_of_the_data_type_counts():
    # A newer CNV calling task is not a re-run of the SNV annotation.
    rows = [(1, 10, 1, GERMLINE), (1, 10, 5, "alignment_germline_variant_calling")]
    assert _kept(rows, "germline_snv") == {(1, 10, 1)}
    assert _kept(rows, "germline_cnv") == {(1, 10, 5)}


def test_a_deleted_task_is_ignored():
    assert _kept([(1, 10, 1, GERMLINE), (1, 10, 2, GERMLINE, None, True)], "germline_snv") == {(1, 10, 1)}


def test_a_shared_task_counts_once_per_case():
    rows = [(1, 10, 7, "alignment_germline_variant_calling"), (2, 10, 7, "alignment_germline_variant_calling")]
    assert _kept(rows, "germline_cnv") == {(1, 10, 7), (2, 10, 7)}


@pytest.mark.parametrize("newer", ["tumor-only", "tumor-normal"])
def test_somatic_snvs_come_from_the_tumor_normal_task_only(newer):
    # A tumor-only task keeps the germline variants: never read, newer or not.
    tn_task, to_task = (1, 3) if newer == "tumor-only" else (3, 1)
    tumor_normal = [(1, 20, tn_task, SOMATIC, "tumoral"), (1, 21, tn_task, SOMATIC, "normal")]
    tumor_only = [(1, 20, to_task, SOMATIC, "tumoral")]
    kept = _kept(tumor_normal + tumor_only, "somatic_snv_tn")
    assert (1, 20, tn_task) in kept and (1, 20, to_task) not in kept


def test_a_tumor_normal_re_run_replaces_the_older_tumor_normal_task():
    rows = [(1, 20, 1, SOMATIC, "tumoral"), (1, 21, 1, SOMATIC, "normal"),
            (1, 20, 2, SOMATIC, "tumoral"), (1, 21, 2, SOMATIC, "normal")]
    assert {k for k in _kept(rows, "somatic_snv_tn") if k[1] == 20} == {(1, 20, 2)}


def test_a_case_with_only_a_tumor_only_analysis_has_no_somatic_snv_task():
    assert _kept([(1, 20, 1, SOMATIC, "tumoral")], "somatic_snv_tn") == set()
