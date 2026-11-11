"""Shared plumbing for the tools backed by the Radiant portal API.

Every tool follows the same per-user pass-through model as ``starrocks``:
the caller's Keycloak JWT is forwarded verbatim as a Bearer token, so the
Radiant API enforces its own per-user / per-organization authorization. This
component holds no Radiant API credential.

Responses are read as raw JSON rather than through the generated pydantic
models: those models mark many fields as required and non-null, so a single
NULL in the data would make the whole tool call fail client-side. The request
bodies still go through the generated models.
"""

import json
import logging
from collections.abc import Callable, Iterator
from contextlib import contextmanager
from typing import Any

from fastmcp.tools import ToolResult

from . import workers
from .results import AUTH_REQUIRED, ToolFailure, ToolOutput, failure, respond
from .settings import get_settings

logger = logging.getLogger(__name__)

_API_CLASSES = {
    "auth": "AuthApi",
    "cases": "CasesApi",
    "genes": "GenesApi",
    "hpo": "HpoApi",
    "mondo": "MondoApi",
    "occurrences": "OccurrencesApi",
    "patients": "PatientsApi",
    "variants": "VariantApi",
}


def api_enabled() -> bool:
    """True when the Radiant API tools can be registered."""
    return get_settings().radiant_api_url is not None


def get_jwt_token() -> str | None:
    """Raw JWT from the current MCP auth context."""
    try:
        from fastmcp.server.dependencies import get_access_token
        access_token = get_access_token()
        if access_token is not None:
            return access_token.token
    except Exception:  # noqa: BLE001 — no auth context means no token
        pass
    return None


def _timeout() -> tuple[float, float]:
    """(connect, read): a portal that does not answer fails in seconds, not after the read timeout."""
    settings = get_settings()
    return settings.radiant_api_connect_timeout, settings.radiant_api_timeout


class RadiantApi:
    """Thin facade over the generated ``radiant_python`` API classes.

    ``call("patients", "patient_entity", tenant=..., patient_key=...)`` runs
    the operation and returns its JSON body. A status >= 400 raises
    ``radiant_python.exceptions.ApiException`` (see ``results.failure``).
    """

    def __init__(self, client) -> None:
        import radiant_python

        self.client = client
        self._apis = {name: getattr(radiant_python, cls)(client) for name, cls in _API_CLASSES.items()}
        self._timeout = _timeout()

    def call(self, api: str, operation: str, **kwargs) -> Any:
        from radiant_python.exceptions import ApiException

        method = getattr(self._apis[api], f"{operation}_without_preload_content")
        response = method(**kwargs, _request_timeout=self._timeout)
        try:
            raw = response.data
        finally:
            response.release_conn()
        body = raw.decode("utf-8") if isinstance(raw, bytes) else (raw or "")
        # Not only >= 400: without retries urllib3 does not follow a redirect, and a 3xx
        # (http -> https, a trailing slash) would read as an empty success, "no data".
        if not 200 <= response.status < 300:
            exc = ApiException(status=response.status, reason=response.reason, body=body)
            # Keep the headers (case-insensitive): a 500 carries X-Correlation-ID.
            exc.headers = response.headers
            raise exc
        return compact(json.loads(body)) if body else None


@contextmanager
def connect(token: str) -> Iterator[RadiantApi]:
    """Open a ``RadiantApi`` that forwards the caller's JWT. Tests replace it."""
    import radiant_python

    host = get_settings().radiant_api_url
    configuration = radiant_python.Configuration(host=host, access_token=token)
    # urllib3 retries a GET 3 times by default, each with a fresh timeout: a hung
    # portal would hold the worker 4 times the timeout. The tool reports the error
    # instead, and the agent retries once.
    configuration.retries = False
    client = radiant_python.ApiClient(configuration)
    try:
        yield RadiantApi(client)
    finally:
        # ApiClient.__exit__ does not close its pool: release the sockets now
        # rather than at garbage collection.
        client.rest_client.pool_manager.clear()


def compact(value: Any) -> Any:
    """Drop ``None`` values recursively so payloads stay small for the model."""
    if isinstance(value, dict):
        return {k: compact(v) for k, v in value.items() if v is not None}
    if isinstance(value, list):
        return [compact(v) for v in value]
    return value


def is_status(exc: Exception, *statuses: int) -> bool:
    from radiant_python.exceptions import ApiException

    return isinstance(exc, ApiException) and exc.status in statuses


def list_tenants(api: RadiantApi) -> list[dict]:
    return api.call("auth", "get_me") or []


def resolve_tenant(api: RadiantApi, tenant: str | None) -> str:
    """The tenant code to use; raises ``ToolFailure`` when it cannot be chosen.

    If ``tenant`` is given it is used as-is (the API will 403 if the caller
    isn't a member). Otherwise the caller's memberships (GET /auth/me) are
    consulted: a single membership is auto-selected, several is ambiguous.
    """
    if tenant:
        return tenant

    memberships = list_tenants(api)
    codes = [m.get("code") for m in memberships if m.get("code")]
    if len(codes) == 1:
        return codes[0]
    if not codes:
        raise ToolFailure("forbidden", "The authenticated user is not a member of any tenant.")
    raise ToolFailure(
        "ambiguous_tenant",
        "The authenticated user belongs to several tenants; pass the `tenant` argument explicitly.",
        tenants=[{"code": m.get("code"), "name": m.get("name")} for m in memberships],
    )


# Page size cap of the case and patient searches.
SEARCH_MAX_LIMIT = 100


def clamp(value: int, low: int, high: int) -> int:
    return max(low, min(int(value), high))


async def run(fn: Callable[..., ToolOutput], *args) -> ToolResult:
    """Run a synchronous tool body for the current caller.

    The JWT is read here, on the event loop, before hopping to a worker
    thread: the auth context does not follow the thread. ``fn`` receives an
    open ``RadiantApi`` and the token, then ``args``, and returns a
    ``ToolOutput``; whatever it raises becomes the error result.
    """
    token = get_jwt_token()
    if not token:
        return respond(AUTH_REQUIRED)

    def _body() -> ToolOutput:
        with connect(token) as api:
            return fn(api, token, *args)

    try:
        return respond(await workers.run(_body))
    except Exception as exc:  # noqa: BLE001 — every failure becomes a tool result
        return respond(failure(exc))
