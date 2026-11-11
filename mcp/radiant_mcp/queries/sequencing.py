"""The shared ``staging_sequencing_experiment`` table: the only StarRocks table
that maps an occurrence's (seq_id, task_id) to its case, patient and ``part``."""

from .. import sql as _sql
from ..domain import rules as _rules


def latest_tasks(p: _sql.Params, tenant: str, data_type: str) -> str:
    """Subquery: the live staging rows of the latest task of each (case, sequencing) for ``data_type``.

    A re-analysis adds a task next to the old one, and the old task's occurrences
    stay: only the latest task of the type that produces ``data_type`` is kept, so
    a call the re-analysis dropped is not counted. Only imported tasks compete: a
    re-analysis whose occurrences are not loaded yet would otherwise hide the case.
    Somatic SNVs come from the tumor-normal tasks only (a task with a normal sample,
    the portal's ``somaticCohortCounts`` rule): tumor-only tasks share the type but
    keep the germline variants. A task shared by several cases (a per-sequencing
    task) has one row per case and counts for each.
    """
    paired = (
        f"MAX(CASE WHEN s.histology_type = {p(_rules.NORMAL_HISTOLOGY)} THEN 1 ELSE 0 END)"
        " OVER (PARTITION BY s.task_id)"
        if data_type == "somatic_snv_tn" else "0"
    )
    tumor_normal = " AND l.paired = 1" if data_type == "somatic_snv_tn" else ""
    return (
        "(SELECT case_id, seq_id, task_id, patient_id, family_role, affected_status, experimental_strategy"
        " FROM (SELECT t.*, ROW_NUMBER() OVER (PARTITION BY t.case_id, t.seq_id, t.paired ORDER BY t.task_id DESC)"
        " AS rerun FROM (SELECT s.case_id, s.seq_id, s.task_id, s.patient_id, s.family_role, s.affected_status,"
        f" s.experimental_strategy, {paired} AS paired"
        f" FROM {_sql.shared_db()}.staging_sequencing_experiment s"
        f" WHERE s.tenant_code = {p(tenant)} AND s.deleted = false"
        f" AND s.task_type = {p(_rules.TASK_TYPES[data_type])}"
        f" AND s.ingested_at > {p(_rules.NOT_INGESTED)}) t) l WHERE l.rerun = 1{tumor_normal})"
    )


def latest_task_join(p: _sql.Params, tenant: str, data_type: str, source: str = "x") -> str:
    """Join ``source`` (with seq_id / task_id) to ``latest_tasks`` as ``s``: rows of older tasks drop out."""
    return (
        f"JOIN {latest_tasks(p, tenant, data_type)} s"
        f" ON s.seq_id = {source}.seq_id AND s.task_id = {source}.task_id"
    )


def genotyped_patients_query(tenant: str, data_type: str) -> tuple[str, _sql.Params]:
    """The patients with an imported ``data_type`` analysis: the population carriers
    of that data type are found in, so its non-carriers have a known genotype."""
    p = _sql.Params()
    return f"SELECT DISTINCT s.patient_id FROM {latest_tasks(p, tenant, data_type)} s", p


def parts_query(case_id: int) -> tuple[str, _sql.Params]:
    """``seq_id, task_id, part`` of the case's live tasks, and ``imported``: false (or NULL)
    while the ETL has not loaded the task's occurrences yet (see ``latest_tasks``)."""
    p = _sql.Params()
    return (f"SELECT seq_id, task_id, part, ingested_at > {p(_rules.NOT_INGESTED)} AS imported"
            f" FROM {_sql.shared_db()}.staging_sequencing_experiment"
            f" WHERE case_id = {p(int(case_id))} AND deleted = false"), p
