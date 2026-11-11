"""The raw SQL tools: ``read_query`` and ``table_overview``.

They are the agents' last resort, when no Radiant tool answers. Both run
under the caller's JWT (``starrocks``), so StarRocks applies the caller's own
grants on every call: nothing is cached across calls. ``read_query`` returns
at most ``STARROCKS_MAX_ROWS`` rows and says when it cut the result.
"""

from collections.abc import Callable

from fastmcp.tools import ToolResult

from .. import portal_api as _api
from .. import starrocks, workers
from ..results import AUTH_REQUIRED, ToolOutput, failure, invalid, ok, respond
from ..settings import get_settings
from ..sql import plain

_SAMPLE_ROWS = 3


def _max_rows() -> int:
    return get_settings().starrocks_max_rows


def _rows(result: starrocks.Result) -> list[list]:
    return [[plain(v) for v in row] for row in result.rows]


async def _run(fn: Callable[..., ToolOutput], *args) -> ToolResult:
    """Run ``fn(token, *args)`` on a worker thread; failures become the error result.

    The JWT is read on the event loop: the auth context does not follow the
    thread.
    """
    token = _api.get_jwt_token()
    if not token:
        return respond(AUTH_REQUIRED)
    try:
        return respond(await workers.run(lambda: fn(token, *args)))
    except Exception as exc:  # noqa: BLE001 — every failure becomes a tool result
        return respond(failure(exc))


def _read_query(token: str, query: str, db: str | None) -> ToolOutput:
    max_rows = _max_rows()
    try:
        result = starrocks.query(token, query, database=db, max_rows=max_rows)
    except starrocks.StarRocksError as exc:
        # The agent wrote the statement: a syntax error or an unknown column is
        # its to fix, not a StarRocks outage to retry.
        if exc.kind == "invalid":
            raise invalid(f"StarRocks rejected the statement: {exc}") from exc
        raise
    truncated = None
    if result.truncated:
        truncated = (f"Only the first {max_rows} rows are returned. Aggregate (COUNT, GROUP BY) "
                     "or add a narrower WHERE / LIMIT instead of paging.")
    warnings = []
    if result.ignored_result_sets:
        warnings.append(f"{result.ignored_result_sets} later statement(s) also returned rows, not shown: only the "
                        "first result set is returned. Send one SELECT per call.")
    return ok({"columns": result.columns, "rows": _rows(result), "returned": len(result.rows)},
              warnings=warnings, truncated=truncated)


async def read_query(query: str, db: str | None = None) -> ToolResult:
    """Run a SQL query in StarRocks, as the caller (your own StarRocks rights apply).

    Last resort: call ``describe_schema`` first and prefer the Radiant tools.
    Send one SELECT per call, with ``db`` rather than a ``USE`` statement: when
    several statements are sent, all of them run, only the first result set is
    returned and a warning says how many were not shown. The result holds at
    most a few hundred rows; when more exist, ``truncated`` is set, so
    aggregate or filter instead.

    Args:
        query: The SQL statement, e.g. a SELECT with a LIMIT.
        db: Database to run it in (e.g. ``cbtn_tenant``); table names may
            also be prefixed with their database instead.
    """
    return await _run(_read_query, query, db)


def _table_overview(token: str, table: str) -> ToolOutput:
    db, _, name = table.rpartition(".")
    db = db or starrocks.default_database()
    if not db:
        raise invalid(f"no database given for table {table!r} (use db.table)")
    try:
        starrocks.database_name(db), starrocks.database_name(name)
    except starrocks.StarRocksError as exc:
        raise invalid(str(exc)) from exc
    full = f"`{starrocks.database_name(db)}`.`{starrocks.database_name(name)}`"
    try:
        count = starrocks.query(token, f"SELECT COUNT(*) FROM {full}").rows[0][0]
    except starrocks.StarRocksError as exc:
        # An unknown table or database: the agent named it, so it is its to fix.
        if exc.kind == "invalid":
            raise invalid(f"StarRocks rejected the table: {exc}") from exc
        raise
    columns = starrocks.query(token, f"DESCRIBE {full}")
    out = {
        "table": f"{db}.{name}",
        "row_count": plain(count),
        "columns": [dict(zip(columns.columns, row, strict=True)) for row in _rows(columns)],
    }
    if count:
        sample = starrocks.query(token, f"SELECT * FROM {full} LIMIT {_SAMPLE_ROWS}")
        out["sample"] = {"columns": sample.columns, "rows": _rows(sample)}
    return ok(out)


async def table_overview(table: str) -> ToolResult:
    """Get a table's columns, total row count and up to 3 sample rows, as the caller.

    Prefer ``describe_schema``, which documents the tables to use, their
    partitions and stored enum values.

    Args:
        table: ``db.table`` (e.g. ``cbtn_tenant.germline__snv__occurrence``).
    """
    return await _run(_table_overview, table)
