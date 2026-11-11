"""One log line per tool call: tool, user, duration and outcome.

The line carries no argument and no result: they can hold patient
identifiers. The user is the JWT ``sub`` (a UUID, the StarRocks user name),
enough to tie a call to the portal and StarRocks audit logs.
"""

import logging
import time

from fastmcp.server.middleware import Middleware, MiddlewareContext

logger = logging.getLogger("radiant_mcp.calls")


def _sub() -> str:
    try:
        from fastmcp.server.dependencies import get_access_token

        token = get_access_token()
        return str(token.claims.get("sub", "?")) if token is not None else "-"
    except Exception:  # noqa: BLE001 — no auth context
        return "-"


class CallLog(Middleware):
    async def on_call_tool(self, context: MiddlewareContext, call_next):
        tool = getattr(context.message, "name", "?")
        sub = _sub()
        start = time.monotonic()
        try:
            result = await call_next(context)
        except Exception as exc:
            logger.warning("tool=%s sub=%s ms=%d outcome=exception:%s", tool, sub,
                           (time.monotonic() - start) * 1000, type(exc).__name__)
            raise
        content = getattr(result, "structured_content", None) or {}
        outcome = "ok" if content.get("ok", True) else (content.get("error") or {}).get("code", "error")
        logger.info("tool=%s sub=%s ms=%d outcome=%s", tool, sub, (time.monotonic() - start) * 1000, outcome)
        return result
