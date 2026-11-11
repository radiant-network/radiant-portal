"""Shared fixtures: a fake Radiant API in place of the HTTP client, and the
StarRocks schema read from the ETL and portal checkouts (``schema_sources``)."""

import asyncio
import base64
import json
from collections.abc import Callable
from contextlib import contextmanager
from typing import Any

import pytest
from radiant_python.exceptions import ApiException
from schema_sources import (  # noqa: F401
    etl,
    etl_dictionaries,
    etl_tables,
    portal,
    portal_fields,
    portal_tenant_objects,
    portal_views,
)

from radiant_mcp import portal_api as _api
from radiant_mcp import workers
from radiant_mcp.settings import Settings, use_settings

PORTAL = "https://portal.example"

# Occurrence keys as get_case_context returns them, for the SQL query builders.
SNV_KEY = {"seq_id": 10, "task_id": 20, "part": 5, "variant_part": 0}
CNV_KEY = {"seq_id": 10, "task_id": 21, "part": 5, "variant_part": 0}


class FakeApi:
    """Stands in for ``_api.RadiantApi``.

    ``responses[(api, operation)]`` is the JSON body to return, an exception
    to raise, or a callable taking the call's kwargs. Every call is recorded
    in ``calls`` as ``(api, operation, kwargs)``.
    """

    def __init__(self) -> None:
        self.responses: dict[tuple[str, str], Any] = {}
        self.calls: list[tuple[str, str, dict]] = []

    def on(self, api: str, operation: str, response: Any) -> "FakeApi":
        self.responses[(api, operation)] = response
        return self

    def call(self, api: str, operation: str, **kwargs) -> Any:
        self.calls.append((api, operation, kwargs))
        if (api, operation) not in self.responses:
            raise AssertionError(f"unexpected call {api}.{operation}({kwargs})")
        response = self.responses[(api, operation)]
        if isinstance(response, Exception):
            raise response
        if callable(response):
            return response(**kwargs)
        return response

    def operations(self) -> list[str]:
        return [operation for _, operation, _ in self.calls]

    def kwargs(self, operation: str) -> dict:
        return next(kwargs for _, op, kwargs in self.calls if op == operation)


def echo_gene_search(fake: FakeApi) -> None:
    """The portal gene search finds every symbol it is given, upper-cased."""
    fake.on("genes", "gene_search", lambda gene_search_body, **_: [
        {"symbol": i.upper(), "ensembl_gene_id": "ENSG1"} for i in gene_search_body.inputs])


def api_exception(status: int, body: str = "", headers: dict | None = None) -> ApiException:
    exc = ApiException(status=status, reason="error", body=body)
    exc.headers = headers or {}
    return exc


class _TestSettings(Settings):
    """``Settings`` built from its arguments only: the developer's environment never leaks in."""

    @classmethod
    def settings_customise_sources(cls, settings_cls, init_settings, **_sources):
        return (init_settings,)


def _test_settings(**values) -> Settings:
    return _TestSettings(**{"keycloak_realm_url": "https://kc.example/realms/radiant", **values})


# Installed at import: some test modules build queries while pytest collects them.
use_settings(_test_settings())


@pytest.fixture(autouse=True)
def configure() -> Callable[..., Settings]:
    """Call ``configure(field=value, ...)`` to change the test settings; reset after each test."""

    def _configure(**values) -> Settings:
        settings = _test_settings(**values)
        use_settings(settings)
        # Each test runs its own event loop, and the pool is sized from the settings.
        workers.reset()
        return settings

    workers.reset()
    yield _configure
    use_settings(_test_settings())
    workers.reset()


@pytest.fixture
def fake_api(monkeypatch, configure) -> FakeApi:
    fake = FakeApi()

    @contextmanager
    def _connect(_token: str):
        yield fake

    monkeypatch.setattr(_api, "connect", _connect)
    monkeypatch.setattr(_api, "get_jwt_token", lambda: "jwt")
    configure(radiant_api_url="http://api.example", radiant_portal_url=PORTAL)
    return fake


class Envelope(dict):
    """A tool's ``ToolOutput`` as the agent receives it, plus the chart PNG (``png``)."""

    png: bytes | None = None


def envelope(result) -> Envelope:
    """The structured content of a tool's MCP result, with its image part as ``png``."""
    out = Envelope(result.structured_content)
    images = [block for block in result.content if block.type == "image"]
    out.png = base64.b64decode(images[0].data) if images else None
    # The text part the agent reads is the same object.
    assert json.loads(result.content[0].text) == dict(out)
    return out


@pytest.fixture
def run() -> Callable[..., Envelope]:
    """Run a tool coroutine to completion and return its envelope."""
    return lambda coroutine: envelope(asyncio.run(coroutine))


def serialized(model) -> Any:
    """A request body as the HTTP client would send it."""
    import radiant_python

    client = radiant_python.ApiClient(radiant_python.Configuration(host="http://x"))
    return client.sanitize_for_serialization(model)


class FakeSql:
    """Stands in for ``_sql.run``: records every query, answers from rules.

    ``rules`` is a list of ``(substring, rows)``: the first rule whose
    substring is in the SQL gives the rows (a list, or a callable taking the
    params dict). Unmatched queries return no rows.
    """

    def __init__(self) -> None:
        self.rules: list[tuple[str, Any]] = []
        self.queries: list[tuple[str, dict]] = []

    def on(self, substring: str, rows: Any) -> "FakeSql":
        self.rules.append((substring, rows))
        return self

    def __call__(self, token, sql, params=None):
        values = dict(params.values) if params is not None else {}
        self.queries.append((sql, values))
        for substring, rows in self.rules:
            if substring in sql:
                if isinstance(rows, Exception):
                    raise rows
                return [dict(r) for r in (rows(values) if callable(rows) else rows)]
        return []

    def matching(self, substring: str) -> list[tuple[str, dict]]:
        return [(sql, values) for sql, values in self.queries if substring in sql]


@pytest.fixture
def fake_sql(monkeypatch) -> FakeSql:
    from radiant_mcp import sql as _sql

    fake = FakeSql()
    monkeypatch.setattr(_sql, "run", fake)
    return fake


def bound_value(sql: str, values: dict, before_placeholder: str):
    """The value bound right after ``before_placeholder`` (e.g. "o.part = ")."""
    import re

    match = re.search(re.escape(before_placeholder) + r"%\((p\d+)\)s", sql)
    assert match, f"no placeholder after {before_placeholder!r}"
    return values[match.group(1)]
