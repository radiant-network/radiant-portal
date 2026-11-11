"""One log line per tool call (``radiant_mcp.call_log``)."""

import asyncio
from types import SimpleNamespace

import pytest

from radiant_mcp.call_log import CallLog
from radiant_mcp.results import error, ok, respond


def _call(result_or_exc, caplog):
    caplog.set_level("INFO", logger="radiant_mcp.calls")

    async def call_next(_context):
        if isinstance(result_or_exc, Exception):
            raise result_or_exc
        return result_or_exc

    return asyncio.run(CallLog().on_call_tool(SimpleNamespace(message=SimpleNamespace(name="read_query")), call_next))


def test_a_successful_call_is_logged_with_its_tool_and_duration(caplog):
    _call(respond(ok({"rows": [["MRN-123"]]})), caplog)
    assert "tool=read_query" in caplog.text and "outcome=ok" in caplog.text and "ms=" in caplog.text
    # Results can hold patient identifiers: they are never logged.
    assert "MRN-123" not in caplog.text


def test_a_failed_call_is_logged_with_its_error_code(caplog):
    _call(respond(error("forbidden", "denied")), caplog)
    assert "outcome=forbidden" in caplog.text


def test_an_exception_is_logged_and_raised(caplog):
    with pytest.raises(RuntimeError):
        _call(RuntimeError("boom"), caplog)
    assert "outcome=exception:RuntimeError" in caplog.text
