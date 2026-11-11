"""``portal_api.RadiantApi``: the real client facade (every other test uses ``FakeApi``)."""

import re
from pathlib import Path

import pytest
from radiant_python.exceptions import ApiException

from radiant_mcp import portal_api
from radiant_mcp.services.patients import PATIENT_SECTIONS
from radiant_mcp.tools.genes import ONTOLOGIES
from radiant_mcp.tools.occurrences import _KINDS
from radiant_mcp.tools.variants import _VARIANT_SECTIONS

_SOURCES = Path(portal_api.__file__).parent


class _Response:
    def __init__(self, status: int, data: bytes, headers: dict | None = None) -> None:
        self.status, self.data, self.reason, self.headers = status, data, "Reason", headers or {}
        self.released = False

    def release_conn(self) -> None:
        self.released = True


def _api(response: _Response, calls: list) -> portal_api.RadiantApi:
    import radiant_python

    api = portal_api.RadiantApi(radiant_python.ApiClient(radiant_python.Configuration(host="http://portal")))

    class Cases:
        def case_entity_without_preload_content(self, **kwargs):
            calls.append(kwargs)
            return response

    api._apis["cases"] = Cases()
    return api


def test_call_returns_the_json_body_and_releases_the_connection(configure):
    configure(radiant_api_timeout=12)
    calls: list = []
    response = _Response(200, b'{"case_id": 8, "note": null}')
    assert _api(response, calls).call("cases", "case_entity", tenant="t", case_id=8) == {"case_id": 8}
    assert response.released and calls[0]["case_id"] == 8 and calls[0]["_request_timeout"] is not None


def test_call_raises_the_api_error_with_its_headers(configure):
    response = _Response(500, b'{"message": "boom"}', {"X-Correlation-ID": "abc"})
    with pytest.raises(ApiException) as exc:
        _api(response, []).call("cases", "case_entity", tenant="t", case_id=8)
    assert exc.value.status == 500 and exc.value.body == '{"message": "boom"}'
    assert exc.value.headers["X-Correlation-ID"] == "abc" and response.released


def test_an_empty_body_is_none(configure):
    assert _api(_Response(200, b""), []).call("cases", "case_entity", tenant="t", case_id=8) is None


def test_every_operation_called_exists_in_the_pinned_client():
    # A client bump that renames an operation fails here, not in front of an agent.
    import radiant_python

    calls = set()
    for path in _SOURCES.rglob("*.py"):
        calls |= set(re.findall(r'\.call\(\s*"(\w+)",\s*"(\w+)"', path.read_text()))
    calls |= {("patients", operation) for operation, _ in PATIENT_SECTIONS.values()}
    calls |= {("variants", operation) for operation, _ in _VARIANT_SECTIONS.values()}
    calls |= set(ONTOLOGIES.values())
    calls |= {("occurrences", op) for kind in _KINDS.values() for op in (kind.list_operation, kind.count_operation)}
    calls |= {("variants", op) for op in re.findall(r'"(get_germline_variant_\w+_cases)"',
                                                     (_SOURCES / "tools" / "variants.py").read_text())}
    assert len(calls) > 20
    missing = [f"{api}.{operation}" for api, operation in sorted(calls)
               if not hasattr(getattr(radiant_python, portal_api._API_CLASSES[api]),
                              f"{operation}_without_preload_content")]
    assert missing == []


def test_a_redirect_is_an_error_not_an_empty_success(configure):
    # Without retries urllib3 does not follow it: a 3xx used to read as "no data".
    from radiant_mcp.results import failure

    response = _Response(308, b"")
    with pytest.raises(ApiException) as exc:
        _api(response, []).call("cases", "case_entity", tenant="t", case_id=8)
    assert exc.value.status == 308 and failure(exc.value).error.code == "upstream"
