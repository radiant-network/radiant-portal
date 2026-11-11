"""Curated SQL run in StarRocks under the caller's JWT.

The tools that have no portal API endpoint (``gene_info``, ``second_hit``,
``cohort_carriers``, ``genotype_phenotype`` and the charts) build fixed queries and run
them through ``starrocks.query`` under the caller's JWT, exactly like the
``part`` lookup of ``get_case_context``: no service account, the caller's
StarRocks rights apply.

Values are bound as parameters (``Params``) and also validated first against
a strict pattern or a closed list, so a bad value fails with a clear
``InvalidInput`` before any query runs. Only identifiers that cannot be bound
(the tenant database name) are written into the SQL, and only once validated.
"""

import math
import re
from collections.abc import Iterable
from typing import Any

from . import starrocks
from .settings import get_settings

_TENANT = re.compile(r"^[a-z0-9_]{1,64}$")
# HGNC symbols: letters, digits, '-', '.', '@' (e.g. C9orf72, HLA-A, IGH@).
_SYMBOL = re.compile(r"^[A-Za-z0-9][A-Za-z0-9.@-]{0,39}$")
_HPO_ID = re.compile(r"^HP:\d{7}$")


class InvalidInput(ValueError):
    """A value that cannot safely go into a query. ``details`` go to ``error.details``."""

    def __init__(self, message: str, **details: Any) -> None:
        super().__init__(message)
        self.details = details


# StarRocks rejected or failed the query.
SqlError = starrocks.StarRocksError


# -- validation ----------------------------------------------------------------

def tenant_db(tenant: str) -> str:
    if not isinstance(tenant, str) or not _TENANT.match(tenant):
        raise InvalidInput(f"invalid tenant code: {tenant!r}")
    return f"{tenant}_tenant"


def shared_db() -> str:
    """The shared database, validated as a name when the settings load."""
    return get_settings().radiant_shared_db


def symbol(value: Any) -> str:
    if not isinstance(value, str) or not _SYMBOL.match(value):
        raise InvalidInput(f"invalid gene symbol: {value!r}")
    return value


def hpo_id(value: Any) -> str:
    if not isinstance(value, str) or not _HPO_ID.match(value):
        raise InvalidInput(f"invalid HPO id (expected HP:0000000): {value!r}")
    return value


def integer(value: Any) -> int:
    if isinstance(value, bool):
        raise InvalidInput(f"invalid integer: {value!r}")
    try:
        return int(value)
    except (TypeError, ValueError) as exc:
        raise InvalidInput(f"invalid integer: {value!r}") from exc


def number(value: Any) -> float:
    if isinstance(value, bool):
        raise InvalidInput(f"invalid number: {value!r}")
    try:
        out = float(value)
    except (TypeError, ValueError) as exc:
        raise InvalidInput(f"invalid number: {value!r}") from exc
    if not math.isfinite(out):
        raise InvalidInput(f"invalid number: {value!r}")
    return out


def one_of(value: Any, allowed: Iterable[str], what: str) -> str:
    allowed = tuple(allowed)
    if value not in allowed:
        raise InvalidInput(f"invalid {what}: {value!r} (allowed: {', '.join(allowed)})", allowed=list(allowed))
    return value


def all_of(values: Iterable[Any], allowed: Iterable[str], what: str) -> list[str]:
    allowed = tuple(allowed)
    return [one_of(v, allowed, what) for v in values]


# -- bound parameters -----------------------------------------------------------

class Params:
    """Collects bound values while a query is written.

    ``p(value)`` records the value and returns a named placeholder
    (``%(p0)s``), so the binding does not depend on the order in which the
    query fragments are built. ``p.list`` does the same for each value of an
    IN list or array literal. The MySQL connector escapes the values.
    """

    def __init__(self) -> None:
        self.values: dict[str, Any] = {}

    def __call__(self, value: Any) -> str:
        name = f"p{len(self.values)}"
        self.values[name] = value
        return f"%({name})s"

    def list(self, values: Iterable[Any]) -> str:
        values = list(values)
        if not values:
            raise InvalidInput("empty value list")
        return ", ".join(self(v) for v in values)


# -- execution --------------------------------------------------------------------

def run(token: str, sql: str, params: Params | None = None) -> list[dict]:
    """Run ``sql`` as the caller and return the rows as JSON-friendly dicts."""
    values = dict(params.values) if params is not None else None
    result = starrocks.query(token, sql, values or None)
    return [{c: plain(v) for c, v in zip(result.columns, row, strict=True)} for row in result.rows]


def cut(rows: list, limit: int) -> tuple[list, bool]:
    """``rows`` cut at ``limit``, and whether some were left out. A query reads ``limit`` + 1
    rows so that a complete list of exactly ``limit`` rows is not reported as cut."""
    return rows[:limit], len(rows) > limit


def plain(value: Any) -> Any:
    from datetime import date, datetime
    from decimal import Decimal

    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (bytes, bytearray)):
        return value.decode("utf-8", "replace")
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return value


def as_list(value: Any) -> list:
    """An ARRAY column as a list (StarRocks sends arrays as JSON text)."""
    import json

    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
        except ValueError:
            return [value]
        return parsed if isinstance(parsed, list) else [parsed]
    return [value]


def first(rows: list[dict]) -> dict | None:
    return rows[0] if rows else None
