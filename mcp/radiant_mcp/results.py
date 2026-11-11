"""The one result shape of every tool.

Every tool answers with a ``ToolOutput``:

- ``ok``: false when the tool could not answer; ``error`` then says why.
- ``data``: what the tool found. Its fields are the tool's own (see its docstring).
- ``warnings``: what the agent must tell the user about how complete or reliable
  ``data`` is (skipped sequencings, partial lookups, a filter that is missing).
- ``truncated``: set when a list was cut; ``reason`` says how to narrow the question.
- ``error``: ``code`` (one of ``ErrorCode``), ``message``, and ``details`` such as the
  allowed values.
- ``portal_url``: the portal page of the main entity, when there is one.

Tool bodies return ``ok(...)`` or raise ``ToolFailure`` (``invalid(...)``,
``not_found(...)``). ``failure()`` turns any exception into the error result, so
an unexpected one never leaks its message. ``respond()`` builds the MCP result:
the JSON text the agent reads, the same object as structured content, the
chart's PNG (``ok(..., image=png)``) as an image part, and ``isError`` on failures.
"""

import json
import logging
import re
from typing import Any, Literal

from fastmcp.server.middleware import Middleware
from fastmcp.tools import ToolResult
from fastmcp.utilities.types import Image
from mcp.types import TextContent
from pydantic import BaseModel, Field, PrivateAttr

logger = logging.getLogger(__name__)

ErrorCode = Literal[
    "invalid_input",  # fix the arguments and call again
    "not_found",  # the gene, case, patient or variant does not exist (or is not visible)
    "ambiguous_tenant",  # several tenants: pass `tenant` (details.tenants lists them)
    "forbidden",  # the caller may not see this
    "unavailable",  # the tenant has no such data to read (e.g. the patient view is off)
    "auth_required",  # no JWT in the request
    "upstream",  # the portal API or StarRocks failed
    "internal",  # a bug: the details are in the server logs
]


class ToolError(BaseModel):
    code: ErrorCode
    message: str
    details: dict[str, Any] | None = None


class Truncation(BaseModel):
    reason: str = Field(description="What was cut, and how to narrow the question.")
    lists: list[str] | None = Field(None, description="Which lists were cut, when the result holds several.")


class ToolOutput(BaseModel):
    ok: bool
    data: dict[str, Any] | None = None
    warnings: list[str] = Field(default_factory=list)
    truncated: Truncation | None = None
    error: ToolError | None = None
    portal_url: str | None = None
    # The PNG of a chart tool: sent as an image part, never in the JSON.
    _image: bytes | None = PrivateAttr(None)


OUTPUT_SCHEMA = ToolOutput.model_json_schema()

# Sent to MCP clients at initialize (server instructions).
INSTRUCTIONS = (
    "Every Radiant tool returns one JSON object: `ok`; `data`, the tool's own fields; `warnings`, a list to "
    "report to the user because the answer may be incomplete; `truncated`, set when a list was cut (its "
    "`reason` says how to narrow the question; never conclude that something is absent from a cut list); "
    "`portal_url`, the portal page to link. When `ok` is false, `error.code` says what to do: invalid_input "
    "(fix the arguments, `error.details.allowed` lists the accepted values), not_found, ambiguous_tenant "
    "(ask which tenant, `error.details.tenants`), forbidden, unavailable (this tenant has no such data), "
    "auth_required, upstream (retry once), internal (report it). Chart tools also return a PNG image."
)


class ToolFailure(Exception):
    """Raised by a tool body: the tool answers with this error."""

    def __init__(self, code: ErrorCode, message: str, **details: Any) -> None:
        super().__init__(message)
        self.error = ToolError(code=code, message=message, details=details or None)


def invalid(message: str, **details: Any) -> ToolFailure:
    return ToolFailure("invalid_input", message, **details)


def not_found(message: str, **details: Any) -> ToolFailure:
    return ToolFailure("not_found", message, **details)


def ok(
    data: dict[str, Any] | None = None,
    *,
    warnings: list[str] | None = None,
    truncated: Truncation | str | None = None,
    portal_url: str | None = None,
    image: bytes | None = None,
) -> ToolOutput:
    if isinstance(truncated, str):
        truncated = Truncation(reason=truncated)
    output = ToolOutput(ok=True, data=data, warnings=[w for w in warnings or [] if w], truncated=truncated,
                        portal_url=portal_url)
    output._image = image
    return output


def error(code: ErrorCode, message: str, **details: Any) -> ToolOutput:
    return ToolOutput(ok=False, error=ToolError(code=code, message=message, details=details or None))


AUTH_REQUIRED = error("auth_required", "Authentication required: no JWT in request context.")

_API_STATUS_CODES: dict[int, ErrorCode] = {
    400: "invalid_input", 401: "auth_required", 403: "forbidden", 404: "not_found", 422: "invalid_input",
}


def failure(exc: Exception) -> ToolOutput:
    """The error result of an exception raised while a tool ran."""
    from radiant_python.exceptions import ApiException
    from urllib3.exceptions import HTTPError as TransportError

    from .sql import InvalidInput, SqlError

    if isinstance(exc, ToolFailure):
        return ToolOutput(ok=False, error=exc.error)
    if isinstance(exc, InvalidInput):
        return error("invalid_input", str(exc), **exc.details)
    if isinstance(exc, SqlError):
        # The message can quote the statement, and a statement can hold patient
        # identifiers: the warning keeps the kind and the error number only.
        logger.warning("StarRocks error: kind=%s errno=%s", exc.kind, exc.errno)
        logger.debug("StarRocks error message: %s", exc)
        if exc.kind == "denied":
            return error("forbidden", f"StarRocks denied access: {exc}")
        if exc.kind == "expired":
            return error("auth_required", str(exc))
        return error("upstream", f"StarRocks error: {exc}")
    if isinstance(exc, ApiException) and not exc.status:
        # Status 0: the generated client's own errors. "SSLError..." wraps urllib3's TLS error,
        # whose raw text can name internal hosts: logged, not returned. Anything else is the
        # client refusing to build the request (a bug here, not a portal outage).
        if str(exc.reason or "").startswith("SSLError"):
            logger.warning("Radiant API unreachable: %s", exc.reason)
            return error("upstream", "The Radiant API did not answer (TLS error); retry once.")
        logger.error("Radiant API client error: %s", exc.reason)
        return error("internal", "The Radiant API client could not build the request; the details are in the "
                                 "server logs.")
    if isinstance(exc, ApiException):
        details: dict[str, Any] = {"status": exc.status}
        body = (exc.body.decode() if isinstance(exc.body, bytes) else str(exc.body)) if exc.body else ""
        correlation_id = (getattr(exc, "headers", None) or {}).get("X-Correlation-ID")
        if correlation_id:
            details["correlation_id"] = correlation_id
        if exc.status >= 500:
            # A server error body can carry the portal's internals (SQL, stack) and patient
            # identifiers: never returned, and logged at DEBUG only, as StarRocks messages.
            logger.warning("Radiant API error %s (correlation id %s)", exc.status, correlation_id)
            logger.debug("Radiant API error body: %s", body[:2000])
        elif body:
            # A 4xx body says what was wrong with the request: the agent can fix it.
            details["body"] = body[:2000]
        code = _API_STATUS_CODES.get(exc.status, "upstream")
        return error(code, f"Radiant API error {exc.status}: {exc.reason}", **details)
    if isinstance(exc, (TransportError, json.JSONDecodeError)):
        # Timeout, refused connection, broken response: the portal, not the tool. The
        # message names the internal host, so it is logged, not returned.
        logger.warning("Radiant API unreachable: %r", exc)
        return error("upstream", f"The Radiant API did not answer ({type(exc).__name__}); retry once.")
    # The message of an unexpected error (a connection error, say) can name internal
    # hosts and URLs: log it, and give the agent the error type only.
    logger.exception("tool failed")
    return error("internal", f"Unexpected {type(exc).__name__} in the tool; the details are in the server logs.")


def argument_error(exc: Any) -> ToolOutput:
    """The ``invalid_input`` result of arguments FastMCP rejected before the tool ran.

    ``exc`` is the pydantic ``ValidationError`` of the call. Each rejected argument
    becomes one ``details.errors`` entry; a value outside a closed list also gives
    ``details.allowed``, as the tools' own checks do. The input values are not
    echoed back.
    """
    errors = []
    allowed: list[str] = []
    for err in exc.errors(include_url=False):
        argument = ".".join(str(part) for part in err["loc"]) or "arguments"
        entry: dict[str, Any] = {"argument": argument, "message": str(err["msg"]).removeprefix("Value error, ")}
        if err["type"] == "literal_error":
            entry["allowed"] = re.findall(r"'([^']*)'", str((err.get("ctx") or {}).get("expected", "")))
            allowed = entry["allowed"]
        errors.append(entry)
    message = "Invalid argument(s): " + "; ".join(f"{e['argument']}: {e['message']}" for e in errors)
    details: dict[str, Any] = {"errors": errors}
    if len(errors) == 1 and allowed:
        details["allowed"] = allowed
    return ToolOutput(ok=False, error=ToolError(code="invalid_input", message=message, details=details))


class ArgumentErrors(Middleware):
    """Return rejected arguments as the result envelope instead of FastMCP's raw text.

    FastMCP validates the arguments against the signature (``Literal`` values,
    pydantic models such as survival's ``GroupSpec``) before the tool function
    runs, and its error would carry no ``ok`` and no ``error.code``.
    """

    async def on_call_tool(self, context, call_next):
        from fastmcp.exceptions import ValidationError as ArgumentValidationError
        from pydantic import ValidationError as PydanticValidationError

        try:
            return await call_next(context)
        except ArgumentValidationError as exc:
            if not isinstance(exc.__cause__, PydanticValidationError):
                raise
            return respond(argument_error(exc.__cause__))


def describe(exc: Exception) -> str:
    """One line for a warning about a lookup that failed while the rest of the tool went on.

    An expired or refused token is not a partial failure: every later lookup fails the same
    way, and the tool would answer ok with empty sections (second_hit: no sequencing, so "no
    second hit"). It is raised again, so the whole call fails with ``auth_required``.
    """
    if _is_auth_failure(exc):
        raise exc
    return failure(exc).error.message


def _is_auth_failure(exc: Exception) -> bool:
    from radiant_python.exceptions import ApiException

    from .sql import SqlError

    return ((isinstance(exc, SqlError) and exc.kind == "expired")
            or (isinstance(exc, ApiException) and exc.status == 401))


def respond(output: ToolOutput) -> ToolResult:
    """The MCP result of ``output``: JSON text and structured content, plus the chart image."""
    payload = output.model_dump(mode="json", exclude_none=True)
    text = output.model_dump_json(exclude_none=True)
    content: list[Any] = [TextContent(type="text", text=text)]
    if output._image is not None:
        content.append(Image(data=output._image, format="png").to_image_content())
    return ToolResult(content=content, structured_content=payload, is_error=not output.ok)
